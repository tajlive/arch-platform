// index.ts — Arch Audit API Worker (P1 foundation)

import { HttpError } from "./types";
import { PublicAuditDataAccess } from "./sessions";
import { CompanyService } from "./company";
import {
  requestId, log, isAllowedOrigin, badRequest, notFound, tooMany, unauthorized, forbidden,
} from "./utils";

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  PUBLIC_ORIGIN: string;
  // GIT_SHA / BUILD_TIME settes ved deploy via wrangler vars/secret for build metadata
  GIT_SHA?: string;
  BUILD_TIME?: string;
}

// ── In-memory rate limiter (per IP, sliding window) ──────────
// NOTE: Workers are stateless; this is per-isolate only. Production
// rate limiting should use Cloudflare WAF/Rate Limiting rules or Durable Objects.
// This is a first-line defense, not the authoritative control.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60; // requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
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
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
}

// ── Error rendering ──────────────────────────────────────────

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

// ── Handlers ────────────────────────────────────────────────

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
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
    }
  );
}

interface SessionAuth {
  sessionId: string;
  credential: string;
}

function parseSessionCookie(cookieHeader: string | null): SessionAuth | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((s) => s.trim());
  for (const part of parts) {
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

// ── Company resolve ─────────────────────────────────────────

async function handleCompanyResolve(env: Env, req: Request): Promise<Response> {
  const body = (await req.json().catch(() => null)) as { query?: string } | null;
  const query = body?.query?.trim();
  if (!query || query.length < 2) {
    throw badRequest("INVALID_QUERY", "Firma eller organisasjonsnummer mangler.");
  }

  const svc = new CompanyService(env.DB);
  try {
    const { company, contextId } = await svc.resolve(query);
    return Response.json({
      resolved: true,
      context_id: contextId,
      company,
    });
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

// ── Audit question ──────────────────────────────────────────

async function handleAskQuestion(env: Env, req: Request): Promise<Response> {
  const { sessionId } = await requireAnonymousSession(env, req.headers.get("Cookie"));
  const body = (await req.json().catch(() => null)) as { context_id?: string } | null;
  const contextId = body?.context_id;

  const access = new PublicAuditDataAccess(env.DB);
  const session = await access.getSession(sessionId);
  if (!session) throw unauthorized("SESSION_INVALID", "Session finnes ikke.");

  // Hent company context
  const svc = new CompanyService(env.DB);
  let company;
  if (contextId) {
    const ctx = await env.DB.prepare(`SELECT * FROM public_company_contexts WHERE id = ?`).bind(contextId).first<{ context_json: string }>();
    if (ctx?.context_json) company = JSON.parse(ctx.context_json);
  }

  if (!company) {
    // Ingen company context — kan ikke stille context-aware spørsmål
    return Response.json({
      insufficient: true,
      message: "INSUFFICIENT EVIDENCE — oppgi firma eller organisasjonsnummer først.",
    });
  }

  const q = await svc.firstQuestion(company);
  const questionId = await access.addQuestion(sessionId, q);

  return Response.json({
    question_id: questionId,
    ...q,
  });
}

// ── Router ──────────────────────────────────────────────────

async function route(req: Request, env: Env, rid: string): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method.toUpperCase();

  const origin = req.headers.get("Origin");
  const ch = corsHeaders(env, origin);

  // Preflight
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: ch });
  }

  // CORS on stateful endpoints: only allow the production frontend origin.
  // Origin-required for state-changing requests (CSRF defense).
  if (method !== "GET" && method !== "HEAD") {
    if (origin && !isAllowedOrigin(origin, [env.PUBLIC_ORIGIN])) {
      return Response.json(
        { error: { code: "ORIGIN_DENIED", message: "Ugyldig Origin.", request_id: rid } },
        { status: 403, headers: ch }
      );
    }
  }

  // Health
  if (path === "/health" && method === "GET") {
    return handleHealth(env);
  }

  // Public API v1
  if (path === "/v1/public/audit/session" && method === "POST") {
    const res = await handleCreateSession(env);
    // merge CORS headers
    const merged = new Response(res.body, res);
    Object.entries(ch).forEach(([k, v]) => merged.headers.set(k, v));
    return merged;
  }

  if (path.startsWith("/v1/public/audit/session/") && method === "GET") {
    const res = await handleGetSession(env, req);
    const merged = new Response(res.body, res);
    Object.entries(ch).forEach(([k, v]) => merged.headers.set(k, v));
    return merged;
  }

  if (path === "/v1/public/company/resolve" && method === "POST") {
    const res = await handleCompanyResolve(env, req);
    const merged = new Response(res.body, res);
    Object.entries(ch).forEach(([k, v]) => merged.headers.set(k, v));
    return merged;
  }

  if (path === "/v1/public/audit/question" && method === "POST") {
    const res = await handleAskQuestion(env, req);
    const merged = new Response(res.body, res);
    Object.entries(ch).forEach(([k, v]) => merged.headers.set(k, v));
    return merged;
  }

  throw notFound("NOT_FOUND", "Endpoint finnes ikke.");
}

// ── Entry ───────────────────────────────────────────────────

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const rid = requestId();
    const start = Date.now();
    const url = new URL(req.url);

    // Rate limit (first-line)
    const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: { code: "RATE_LIMITED", message: "For mange forespørsler.", request_id: rid } },
        { status: 429 }
      );
    }

    try {
      const res = await route(req, env, rid);
      log({
        timestamp: new Date().toISOString(), level: "info", request_id: rid, trace_id: rid,
        route: url.pathname, method: req.method, status: res.status, latency_ms: Date.now() - start,
      });
      return res;
    } catch (e) {
      const res = renderError(e, rid);
      log({
        timestamp: new Date().toISOString(), level: "error", request_id: rid, trace_id: rid,
        route: url.pathname, method: req.method, status: res.status, latency_ms: Date.now() - start,
        error_code: e instanceof HttpError ? e.code : "INTERNAL_ERROR",
      });
      return res;
    }
  },
};
