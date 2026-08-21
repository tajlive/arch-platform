// index.ts — Arch Audit API Worker (P1 foundation + P1C auth/tenant)

import { HttpError } from "./types";
import { PublicAuditDataAccess } from "./sessions";
import { CompanyService } from "./company";
import { BrregAdapter } from "./adapters";
import { AuthService, TenantContext, getAccessIdentity, authorize } from "./auth";
import { TenantDataAccess } from "./tenant-access";
import { RateLimiter } from "./rate-limiter";
import { NORDIC_SERVICE_DEMO, NORDIC_SERVICE_FLOW } from "./demo-company";
import { BetaService, BetaProvisionInput } from "./beta";
import {
  requestId, log, isAllowedOrigin, badRequest, notFound, unauthorized, forbidden,
} from "./utils";

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  PUBLIC_ORIGIN: string;
  GIT_SHA?: string;
  BUILD_TIME?: string;
  RATE_LIMITER: DurableObjectNamespace;
}

// ── Global rate limiting via Durable Object ──────────────────
// Erstatter P1C sin per-isolate in-memory Map (som var stateless og resettes ved cold start).
// Durable Object = singleton per key → global, atomisk state.

function rateProfileForPath(path: string, method: string): "anonymous" | "authenticated" | "internal" {
  if (path.startsWith("/v1/internal/")) return "internal";
  if (path.startsWith("/v1/tenant/")) return "authenticated";
  return "anonymous"; // /v1/public/* + /health
}

async function enforceRateLimit(env: Env, ip: string, path: string): Promise<Response | null> {
  const profile = rateProfileForPath(path, "GET");
  // key = IP + profil, slik at én IP kan ha ulike grenser per profil
  const id = env.RATE_LIMITER.idFromName(`${ip}:${profile}`);
  const stub = env.RATE_LIMITER.get(id);
  const resp = await stub.fetch(`https://rate-limiter/?profile=${profile}`);
  if (resp.status === 429) {
    const retryAfter = resp.headers.get("Retry-After") ?? "60";
    return Response.json(
      { error: { code: "RATE_LIMITED", message: "For mange forespørsler." } },
      { status: 429, headers: { "Retry-After": retryAfter } }
    );
  }
  return null;
}

// ── CORS ─────────────────────────────────────────────────────

function corsHeaders(env: Env, origin: string | null): Record<string, string> {
  const allowed = [env.PUBLIC_ORIGIN];
  if (env.ENVIRONMENT !== "production") {
    allowed.push("http://localhost:8787", "http://localhost:8788", "http://127.0.0.1:8787");
  }
  const o = origin && isAllowedOrigin(origin, allowed) ? origin : env.PUBLIC_ORIGIN;
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Tenant-ID",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
}

// ── Error rendering ──────────────────────────────────────────

// Security headers — påføres alle responses (også errors)
const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function applySecurityHeaders(res: Response): Response {
  const merged = new Response(res.body, { status: res.status, headers: res.headers });
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!merged.headers.has(k)) merged.headers.set(k, v);
  }
  return merged;
}

function renderError(e: unknown, rid: string): Response {
  const h = new HttpError(500, "INTERNAL_ERROR", "Noe gikk galt.");
  const err = e instanceof HttpError ? e : h;
  if (!(e instanceof HttpError)) {
    log({ timestamp: new Date().toISOString(), level: "error", request_id: rid, trace_id: rid, route: "-", method: "-", error_code: "INTERNAL_ERROR" });
  }
  return Response.json(
    { error: { code: err.code, message: err.message, request_id: rid } },
    { status: err.status, headers: { "Content-Type": "application/json" } }
  );
}

// ── Public handlers ──────────────────────────────────────────

async function handleHealth(env: Env): Promise<Response> {
  return Response.json({
    status: "ok",
    service: "arch-audit-api",
    environment: env.ENVIRONMENT,
    git_sha: env.GIT_SHA ?? null,
    build_time: env.BUILD_TIME ?? null,
  });
}

async function handleCreateSession(env: Env): Promise<Response> {
  const access = new PublicAuditDataAccess(env.DB);
  const { sessionId, credential, expires_at } = await access.createSession({ scope: "FREE" });
  const cookie = `arch_session=${sessionId}.${credential}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`;
  return Response.json(
    { session_id: sessionId, expires_at },
    { status: 201, headers: { "Content-Type": "application/json", "Set-Cookie": cookie } }
  );
}

interface SessionAuth {
  sessionId: string;
  credential: string;
}

function parseSessionCookie(cookieHeader: string | null): SessionAuth | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";").map((s) => s.trim())) {
    if (part.startsWith("arch_session=")) {
      const value = part.slice("arch_session=".length);
      const [sessionId, credential] = value.split(".");
      if (sessionId && credential) return { sessionId, credential };
    }
  }
  return null;
}

async function requireAnonymousSession(env: Env, cookieHeader: string | null): Promise<{ sessionId: string }> {
  const auth = parseSessionCookie(cookieHeader);
  if (!auth) throw unauthorized("SESSION_REQUIRED", "Session mangler.");
  const access = new PublicAuditDataAccess(env.DB);
  const session = await access.getSession(auth.sessionId);
  if (!session) throw unauthorized("SESSION_INVALID", "Session finnes ikke.");
  if (session.ownership_mode !== "ANONYMOUS") throw forbidden("SESSION_NOT_ANONYMOUS", "Session er ikke anonym.");
  if (await access.isExpired(session)) throw unauthorized("SESSION_EXPIRED", "Session er utløpt.");
  const ok = await access.verifyCredential(auth.sessionId, auth.credential);
  if (!ok) throw unauthorized("SESSION_INVALID_CREDENTIAL", "Ugyldig session credential.");
  return { sessionId: auth.sessionId };
}

async function handleGetSession(env: Env, req: Request): Promise<Response> {
  const { sessionId } = await requireAnonymousSession(env, req.headers.get("Cookie"));
  const access = new PublicAuditDataAccess(env.DB);
  const session = await access.getSession(sessionId);
  return Response.json({ session });
}

async function handleCompanyResolve(env: Env, req: Request): Promise<Response> {
  const body = (await req.json().catch(() => null)) as { query?: string } | null;
  const query = body?.query?.trim();
  if (!query || query.length < 2) throw badRequest("INVALID_QUERY", "Firma eller organisasjonsnummer mangler.");
  const svc = new CompanyService(env.DB);
  try {
    const { company, contextId } = await svc.resolve(query);
    return Response.json({ resolved: true, context_id: contextId, company });
  } catch (e) {
    if ((e as Error).message === "COMPANY_NOT_FOUND") {
      return Response.json(
        { resolved: false, error: { code: "COMPANY_NOT_FOUND", message: "Vi fant ikke virksomheten." } },
        { status: 404 }
      );
    }
    throw e;
  }
}

async function handleCompanySearch(env: Env, req: Request): Promise<Response> {
  const body = (await req.json().catch(() => null)) as { query?: string } | null;
  const query = body?.query?.trim();
  if (!query || query.length < 2) throw badRequest("INVALID_QUERY", "Firma eller organisasjonsnummer mangler.");
  const adapter = new BrregAdapter();
  const candidates = await adapter.search(query);
  return Response.json({ query, count: candidates.length, candidates });
}

async function handleCompanyIntelligence(env: Env, req: Request): Promise<Response> {
  const body = (await req.json().catch(() => null)) as { query?: string } | null;
  const query = body?.query?.trim();
  if (!query || query.length < 2) throw badRequest("INVALID_QUERY", "Firma eller organisasjonsnummer mangler.");
  const svc = new CompanyService(env.DB);
  const result = await svc.intelligence(query);
  if (!result) {
    return Response.json(
      { resolved: false, error: { code: "COMPANY_NOT_FOUND", message: "Vi fant ikke virksomheten." } },
      { status: 404 }
    );
  }
  return Response.json({ resolved: true, company: result.company, intelligence: result.report });
}

async function handleAskQuestion(env: Env, req: Request): Promise<Response> {
  const { sessionId } = await requireAnonymousSession(env, req.headers.get("Cookie"));
  const body = (await req.json().catch(() => null)) as { context_id?: string; focus_area?: string } | null;
  const access = new PublicAuditDataAccess(env.DB);
  const session = await access.getSession(sessionId);
  if (!session) throw unauthorized("SESSION_INVALID", "Session finnes ikke.");

  const svc = new CompanyService(env.DB);
  let company;
  if (body?.context_id) {
    const ctx = await env.DB.prepare(`SELECT * FROM public_company_contexts WHERE id = ?`).bind(body.context_id).first<{ context_json: string }>();
    if (ctx?.context_json) company = JSON.parse(ctx.context_json);
  }
  if (!company) {
    return Response.json({ insufficient: true, message: "INSUFFICIENT EVIDENCE — oppgi firma eller organisasjonsnummer først." });
  }
  const q = await svc.firstQuestion(company, body?.focus_area);
  const questionId = await access.addQuestion(sessionId, q);
  return Response.json({ question_id: questionId, ...q });
}

// ── Protected handlers (P1C) ─────────────────────────────────

/**
 * requireTenantContext — DENY hvis ctx.access mangler.
 * Dette er secure-by-construction: workers.dev/preview/custom-domain bypass
 * blokkeres fordi ctx.access kun finnes når Access faktisk autentiserte.
 */
async function requireTenantContext(env: Env, req: Request, ctx: ExecutionContext, rid: string): Promise<TenantContext> {
  const accessIdentity = await getAccessIdentity(ctx);
  if (!accessIdentity) {
    log({ timestamp: new Date().toISOString(), level: "warn", request_id: rid, trace_id: rid, route: new URL(req.url).pathname, method: req.method, event: "AUTH_DENIED", reason: "no_access_context" });
    throw unauthorized("ACCESS_REQUIRED", "Autentisering kreves.");
  }

  const auth = new AuthService(env.DB);
  let resolve = await auth.resolveUser(accessIdentity);
  if (!resolve) {
    // Unknown identity — DENY (controlled onboarding path skjer manuelt/separat)
    // Sanert logging: provider + provider_subject (IKKE email), for å debugge mismatch.
    log({
      timestamp: new Date().toISOString(), level: "warn", request_id: rid, trace_id: rid,
      route: new URL(req.url).pathname, method: req.method, event: "IDENTITY_RESOLUTION_FAILED",
      provider: accessIdentity.provider,
      provider_type: accessIdentity.provider_type,
      provider_subject: accessIdentity.provider_subject,
    });
    throw forbidden("IDENTITY_NOT_PROVISIONED", "Identitet ikke provisionert. Kontakt Arch.");
  }

  // tenant_id fra client = ØNSKE om context, aldri autorisasjon
  const requestedTenant = extractRequestedTenant(req);
  const tenantContext = auth.buildTenantContext(resolve, requestedTenant, rid, rid);

  if (!tenantContext) {
    if (resolve.memberships.length === 0) {
      log({ timestamp: new Date().toISOString(), level: "warn", request_id: rid, trace_id: rid, event: "MEMBERSHIP_DENIED" });
      throw forbidden("NO_MEMBERSHIP", "Ingen aktivt medlemskap.");
    }
    // Flere tenants, men ingen/ugyldig valgt
    throw forbidden("TENANT_SELECTION_REQUIRED", "Flere tenants — velg tenant eksplisitt.");
  }

  log({ timestamp: new Date().toISOString(), level: "info", request_id: rid, trace_id: rid, event: "TENANT_CONTEXT_SELECTED", tenant_id: tenantContext.tenant_id, role: tenantContext.role });
  return tenantContext;
}

function extractRequestedTenant(req: Request): string | null {
  // Fra body, query, path eller header — ALLE er kun indikasjoner
  const url = new URL(req.url);
  const qp = url.searchParams.get("tenant_id");
  if (qp) return qp;
  const header = req.headers.get("X-Tenant-ID");
  if (header) return header;
  return null;
}

async function handleTenantMe(env: Env, req: Request, ctx: ExecutionContext, rid: string): Promise<Response> {
  const tc = await requireTenantContext(env, req, ctx, rid);
  return Response.json({
    user_id: tc.user_id,
    tenant_id: tc.tenant_id,
    role: tc.role,
    permissions: tc.permissions,
  });
}

async function handleTenantContext(env: Env, req: Request, ctx: ExecutionContext, rid: string): Promise<Response> {
  const tc = await requireTenantContext(env, req, ctx, rid);
  return Response.json({ context: tc });
}

async function handleTenantListAudits(env: Env, req: Request, ctx: ExecutionContext, rid: string): Promise<Response> {
  const tc = await requireTenantContext(env, req, ctx, rid);
  if (authorize(tc, "audit:read", null) !== "ALLOW") {
    log({ timestamp: new Date().toISOString(), level: "warn", request_id: rid, trace_id: rid, event: "AUTHORIZATION_DENIED", action: "audit:read" });
    throw forbidden("FORBIDDEN", "Ingen tilgang.");
  }
  const access = new TenantDataAccess(env.DB, tc);
  const audits = await access.listAudits();
  return Response.json({ audits });
}

async function handleTenantGetAudit(env: Env, req: Request, ctx: ExecutionContext, rid: string, auditId: string): Promise<Response> {
  const tc = await requireTenantContext(env, req, ctx, rid);
  if (authorize(tc, "audit:read", null) !== "ALLOW") throw forbidden("FORBIDDEN", "Ingen tilgang.");
  const access = new TenantDataAccess(env.DB, tc);
  const audit = await access.getAudit(auditId);
  if (!audit) {
    // 404 reduserer enumeration/leakage (avslører ikke om audit finnes i annen tenant)
    log({ timestamp: new Date().toISOString(), level: "warn", request_id: rid, trace_id: rid, event: "CROSS_TENANT_ATTEMPT", audit_id: auditId, tenant_id: tc.tenant_id });
    throw notFound("AUDIT_NOT_FOUND", "Audit finnes ikke.");
  }
  return Response.json({ audit });
}

async function handleTenantCreateAudit(env: Env, req: Request, ctx: ExecutionContext, rid: string): Promise<Response> {
  const tc = await requireTenantContext(env, req, ctx, rid);
  if (authorize(tc, "audit:write", null) !== "ALLOW") throw forbidden("FORBIDDEN", "Ingen tilgang.");
  const body = (await req.json().catch(() => null)) as { scope?: string } | null;
  const access = new TenantDataAccess(env.DB, tc);
  const id = await access.createAudit({ scope: body?.scope ?? "FULL" });
  return Response.json({ id }, { status: 201 });
}

// ── Anonymous → Authenticated claim (§25-26) ─────────────────

async function handleClaimSession(env: Env, req: Request, ctx: ExecutionContext, rid: string): Promise<Response> {
  // Krever BÅDE autentisert bruker (Access) OG valid anonymous session credential.
  const tc = await requireTenantContext(env, req, ctx, rid);

  // Anonym session credential fra cookie
  const sessionAuth = parseSessionCookie(req.headers.get("Cookie"));
  if (!sessionAuth) throw badRequest("SESSION_CREDENTIAL_REQUIRED", "Anonym session credential kreves for claim.");

  const body = (await req.json().catch(() => null)) as { session_id?: string } | null;
  const sessionId = body?.session_id ?? sessionAuth.sessionId;

  const access = new PublicAuditDataAccess(env.DB);
  const result = await access.claimSession(sessionId, sessionAuth.credential, tc.tenant_id, tc.user_id);

  switch (result) {
    case "CLAIMED":
      log({ timestamp: new Date().toISOString(), level: "info", request_id: rid, trace_id: rid, event: "SESSION_CLAIMED", session_id: sessionId, tenant_id: tc.tenant_id });
      return Response.json({ claimed: true, session_id: sessionId });
    case "INVALID_CREDENTIAL":
      throw forbidden("CLAIM_DENIED", "Ugyldig session credential.");
    case "ALREADY_CLAIMED":
      throw forbidden("CLAIM_DENIED", "Session er allerede eid av en annen tenant.");
    case "NOT_FOUND":
      throw notFound("SESSION_NOT_FOUND", "Session finnes ikke.");
  }
}

// ── Router ──────────────────────────────────────────────────

function withCors(res: Response, ch: Record<string, string>): Response {
  const merged = new Response(res.body, res);
  Object.entries(ch).forEach(([k, v]) => merged.headers.set(k, v));
  return merged;
}

async function route(req: Request, env: Env, ctx: ExecutionContext, rid: string): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method.toUpperCase();
  const origin = req.headers.get("Origin");
  const ch = corsHeaders(env, origin);

  if (method === "OPTIONS") return new Response(null, { status: 204, headers: ch });

  // Origin-required for state-changing requests (CSRF defense)
  if (method !== "GET" && method !== "HEAD") {
    if (origin && !isAllowedOrigin(origin, [env.PUBLIC_ORIGIN])) {
      return Response.json({ error: { code: "ORIGIN_DENIED", message: "Ugyldig Origin.", request_id: rid } }, { status: 403, headers: ch });
    }
  }

  // Health
  if (path === "/health" && method === "GET") return handleHealth(env);

  // Public API v1 (INGEN auth)
  if (path === "/v1/public/audit/session" && method === "POST") return withCors(await handleCreateSession(env), ch);
  if (path.startsWith("/v1/public/audit/session/") && method === "GET") return withCors(await handleGetSession(env, req), ch);
  if (path === "/v1/public/company/resolve" && method === "POST") return withCors(await handleCompanyResolve(env, req), ch);
  if (path === "/v1/public/company/search" && method === "POST") return withCors(await handleCompanySearch(env, req), ch);
  if (path === "/v1/public/company/intelligence" && method === "POST") return withCors(await handleCompanyIntelligence(env, req), ch);
  if (path === "/v1/public/audit/question" && method === "POST") return withCors(await handleAskQuestion(env, req), ch);
  if (path === "/v1/public/demo/company" && method === "GET") {
    // SYNTHETIC demo — eksplisitt merket, aldri blandet med ekte data
    return withCors(Response.json({ ...NORDIC_SERVICE_DEMO, flow: NORDIC_SERVICE_FLOW }), ch);
  }

  // Protected tenant API (krever Access + membership)
  if (path === "/v1/tenant/me" && method === "GET") return withCors(await handleTenantMe(env, req, ctx, rid), ch);
  if (path === "/v1/tenant/context" && method === "GET") return withCors(await handleTenantContext(env, req, ctx, rid), ch);
  if (path === "/v1/tenant/audits" && method === "GET") return withCors(await handleTenantListAudits(env, req, ctx, rid), ch);
  if (path === "/v1/tenant/audits" && method === "POST") return withCors(await handleTenantCreateAudit(env, req, ctx, rid), ch);
  if (path.startsWith("/v1/tenant/audits/") && method === "GET") {
    const auditId = path.split("/").pop()!;
    return withCors(await handleTenantGetAudit(env, req, ctx, rid, auditId), ch);
  }
  if (path === "/v1/tenant/session/claim" && method === "POST") return withCors(await handleClaimSession(env, req, ctx, rid), ch);

  // Protected internal namespace (krever Access + ADMIN/OWNER-rolle)
  if (path.startsWith("/v1/internal/")) {
    const tc = await requireTenantContext(env, req, ctx, rid);
    if (tc.role !== "ADMIN" && tc.role !== "OWNER") throw forbidden("FORBIDDEN", "Krever admin-rolle.");

    const beta = new BetaService(env.DB);

    if (path === "/v1/internal/beta/tenant/create" && method === "POST") {
      const body = (await req.json().catch(() => null)) as BetaProvisionInput | null;
      if (!body?.company_name || !body?.org_number || !body?.contact_email || !body?.beta_cohort) {
        throw badRequest("INVALID_INPUT", "company_name, org_number, contact_email og beta_cohort er påkrevd.");
      }
      const result = await beta.provisionTenant(body);
      log({ timestamp: new Date().toISOString(), level: "info", request_id: rid, trace_id: rid, event: "BETA_TENANT_CREATED", tenant_id: result.tenant_id, actor: tc.user_id });
      return withCors(Response.json(result, { status: 201 }), ch);
    }

    if (path === "/v1/internal/beta/companies" && method === "GET") {
      const companies = await beta.listBetaCompanies();
      return withCors(Response.json({ companies }), ch);
    }

    throw notFound("NOT_FOUND", "Internal endpoint finnes ikke.");
  }

  throw notFound("NOT_FOUND", "Endpoint finnes ikke.");
}

// ── Entry ───────────────────────────────────────────────────

export { RateLimiter };

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const rid = requestId();
    const start = Date.now();
    const url = new URL(req.url);

    const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
    const rateLimited = await enforceRateLimit(env, ip, url.pathname);
    if (rateLimited) return rateLimited;

    try {
      const res = await route(req, env, ctx, rid);
      log({
        timestamp: new Date().toISOString(), level: "info", request_id: rid, trace_id: rid,
        route: url.pathname, method: req.method, status: res.status, latency_ms: Date.now() - start,
      });
      return applySecurityHeaders(res);
    } catch (e) {
      const res = renderError(e, rid);
      log({
        timestamp: new Date().toISOString(), level: "error", request_id: rid, trace_id: rid,
        route: url.pathname, method: req.method, status: res.status, latency_ms: Date.now() - start,
        error_code: e instanceof HttpError ? e.code : "INTERNAL_ERROR",
      });
      return applySecurityHeaders(res);
    }
  },
};
