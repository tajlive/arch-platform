// auth.ts — canonical auth flow: Identity → User → TenantMembership → TenantContext

import type { D1Database, ExecutionContext } from "@cloudflare/workers-types";

export type Role = "OWNER" | "ADMIN" | "AUDITOR" | "MEMBER";

export interface AccessIdentityInfo {
  provider_subject: string;   // user_uuid — stabil primary identity key (IKKE email)
  email?: string;
  name?: string;
  provider: string;           // idp.id
  provider_type: string;      // idp.type
}

export interface TenantContext {
  user_id: string;
  identity_id: string;
  tenant_id: string;
  membership_id: string;
  role: Role;
  permissions: string[];
  request_id: string;
  trace_id: string;
}

export interface ResolveResult {
  identityId: string;
  userId: string;
  memberships: MembershipRow[];
}

export interface MembershipRow {
  id: string;
  user_id: string;
  tenant_id: string;
  role: Role;
  status: string; // ACTIVE | INVITED | REVOKED | SUSPENDED
}

/**
 * Hent Access-identity fra native ctx.access.
 * Returnerer undefined hvis requesten IKKE er Access-autentisert.
 *
 * Identity-nøkkel (direktiv §5):
 * - Primær = stabil provider subject (user_uuid/sub) når tilgjengelig.
 * - onetimepin (OTP) gir IKKE user_uuid — e-posten ER identiteten.
 *   Da brukes namespaced subject: `onetimepin:{normalisert epost}`.
 * - email er attribute, aldri permanent primary key alene.
 *   Kompositt-nøkkel (provider, provider_subject) er UNIQUE i schema.
 */
export async function getAccessIdentity(ctx: ExecutionContext): Promise<AccessIdentityInfo | undefined> {
  if (!ctx.access) return undefined;
  const identity = await ctx.access.getIdentity();
  if (!identity) return undefined;

  // Provider: bruk STABIL type-streng, ikke IdP-UUID (idp.id varierer per konto).
  const providerType = identity.idp?.type ?? "access";
  const email = identity.email;

  // onetimepin (OTP) er Cloudflares egen e-post-PIN-IdP.
  // Den gir typisk IKKE user_uuid — e-posten ER identiteten.
  if (providerType === "onetimepin") {
    if (!email) return undefined;
    const normalizedEmail = email.trim().toLowerCase();
    return {
      provider_subject: `onetimepin:${normalizedEmail}`,
      email: normalizedEmail,
      name: identity.name ?? normalizedEmail,
      provider: "onetimepin",
      provider_type: "onetimepin",
    };
  }

  // OIDC IdP-er gir stabil subject (user_uuid/sub)
  const stableSubject = identity.user_uuid;
  if (stableSubject) {
    return {
      provider_subject: stableSubject,
      email,
      name: identity.name,
      provider: providerType,
      provider_type: providerType,
    };
  }

  // Fallback: epost som subject for andre provider-typer
  if (email) {
    const normalizedEmail = email.trim().toLowerCase();
    return {
      provider_subject: `${providerType}:${normalizedEmail}`,
      email: normalizedEmail,
      name: identity.name ?? normalizedEmail,
      provider: providerType,
      provider_type: providerType,
    };
  }

  return undefined;
}

export class AuthService {
  constructor(private db: D1Database) {}

  /**
   * Resolve Identity → User (med user_identities join).
   * Hvis identity ikke finnes, returneres null (controlled onboarding path).
   */
  async resolveUser(access: AccessIdentityInfo): Promise<ResolveResult | null> {
    // 1. Finn identity via (provider, provider_subject) — stabil nøkkel.
    let identity = await this.db
      .prepare(`SELECT id FROM identities WHERE identity_provider = ? AND provider_subject = ?`)
      .bind(access.provider, access.provider_subject)
      .first<{ id: string }>();

    // 2. Fallback: epost-basert lookup (onetimepin identifiserer ved epost).
    //    Hvis provider_subject mismatch (f.eks. Access ga user_uuid i stedet for
    //    onetimepin:{epost}), match på epost i stedet. Trygt fordi epost i
    //    identities er unik per provider.
    if (!identity && access.email) {
      const byEmail = await this.db
        .prepare(`SELECT id FROM identities WHERE identity_provider = ? AND email = ?`)
        .bind(access.provider, access.email)
        .first<{ id: string }>();
      identity = byEmail;
    }

    if (!identity) return null;

    // 2. Finn user via user_identities join
    const user = await this.db
      .prepare(
        `SELECT u.id FROM users u
         JOIN user_identities ui ON ui.user_id = u.id
         WHERE ui.identity_id = ? LIMIT 1`
      )
      .bind(identity.id)
      .first<{ id: string }>();

    if (!user) return null;

    // 3. Hent memberships (kun ACTIVE)
    const memberships = await this.db
      .prepare(`SELECT * FROM tenant_memberships WHERE user_id = ? AND status = 'ACTIVE'`)
      .bind(user.id)
      .all<MembershipRow>();

    return { identityId: identity.id, userId: user.id, memberships: memberships.results ?? [] };
  }

  /**
   * Opprett Identity + User (onboarding). Brukes av controlled onboarding path.
   * Returnerer userId.
   */
  async provisionUser(access: AccessIdentityInfo): Promise<string> {
    const now = new Date().toISOString();
    const identityId = crypto.randomUUID();

    await this.db
      .prepare(
        `INSERT INTO identities (id, identity_provider, provider_subject, email, email_verified, created_at)
         VALUES (?, ?, ?, ?, 0, ?)`
      )
      .bind(identityId, access.provider, access.provider_subject, access.email ?? null, now)
      .run();

    const userId = crypto.randomUUID();
    await this.db
      .prepare(`INSERT INTO users (id, display_name, created_at) VALUES (?, ?, ?)`)
      .bind(userId, access.name ?? access.email ?? "Ukjent", now)
      .run();

    await this.db
      .prepare(`INSERT INTO user_identities (user_id, identity_id, is_primary, created_at) VALUES (?, ?, 1, ?)`)
      .bind(userId, identityId, now)
      .run();

    return userId;
  }

  /**
   * Bygg TenantContext fra verifisert membership.
   * tenant_id fra client er et ØNSKE om context, aldri autorisasjon.
   */
  buildTenantContext(
    resolve: ResolveResult,
    requestedTenantId: string | null,
    request_id: string,
    trace_id: string
  ): TenantContext | null {
    const memberships = resolve.memberships;

    let membership: MembershipRow | null = null;
    if (requestedTenantId) {
      // Brukeren ønsker en spesifikk tenant — må ha membership der
      membership = memberships.find((m) => m.tenant_id === requestedTenantId) ?? null;
    } else if (memberships.length === 1) {
      membership = memberships[0];
    } else if (memberships.length > 1) {
      // Flere tenants — krever eksplisitt valg (returnerer null = må velge)
      return null;
    }

    if (!membership) return null;

    return {
      user_id: resolve.userId,
      identity_id: resolve.identityId,
      tenant_id: membership.tenant_id,
      membership_id: membership.id,
      role: membership.role,
      permissions: permissionsFor(membership.role),
      request_id,
      trace_id,
    };
  }
}

/**
 * Minimal permission model. Rollemapping er deterministisk og enkel.
 * Senere kan OPA/Cedar overta evaluatePolicy() uten å endre handlers.
 */
export function permissionsFor(role: Role): string[] {
  switch (role) {
    case "OWNER":
      return ["audit:read", "audit:write", "audit:delete", "tenant:manage", "tenant:read"];
    case "ADMIN":
      return ["audit:read", "audit:write", "audit:delete", "tenant:read"];
    case "AUDITOR":
      return ["audit:read"]; // read-only cross-tenant observasjon
    case "MEMBER":
      return ["audit:read", "audit:write"];
    default:
      return [];
  }
}

export type AuthDecision = "ALLOW" | "DENY";

/**
 * Authorization interface — deterministisk TypeScript nå.
 * Senere kan OPA/Cedar overta evaluatePolicy() uten å endre handlers.
 */
export function authorize(
  context: TenantContext,
  action: string,
  _resource: unknown
): AuthDecision {
  return context.permissions.includes(action) ? "ALLOW" : "DENY";
}
