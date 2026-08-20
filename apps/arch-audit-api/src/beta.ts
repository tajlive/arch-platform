// beta.ts — Beta onboarding service (intern admin-funksjon)
//
// Kontrollert onboarding: oppretter tenant + company entity + owner user + membership
// + beta metadata. IKKE offentlig — kun /v1/internal/* med ADMIN/OWNER-rolle.

import type { D1Database } from "@cloudflare/workers-types";

export interface BetaProvisionInput {
  company_name: string;
  org_number: string;
  contact_email: string;
  industry?: string;
  beta_cohort: string; // 'BETA_001'
}

export interface BetaProvisionOutput {
  tenant_id: string;
  company_id: string;
  invitation_status: string;
  created_at: string;
}

export class BetaService {
  constructor(private db: D1Database) {}

  async provisionTenant(input: BetaProvisionInput): Promise<BetaProvisionOutput> {
    const now = new Date().toISOString();
    const tenantId = crypto.randomUUID();
    const companyId = crypto.randomUUID();
    const identityId = crypto.randomUUID();
    const userId = crypto.randomUUID();
    const membershipId = crypto.randomUUID();

    // 1. Tenant
    await this.db
      .prepare(`INSERT INTO tenants (id, name, created_at, status) VALUES (?, ?, ?, 'ACTIVE')`)
      .bind(tenantId, input.company_name, now)
      .run();

    // 2. Company entity (public_company_contexts brukes for company info — her oppretter vi
    //    en minimal company-identitet via org_number som nøkkel)
    await this.db
      .prepare(
        `INSERT INTO public_company_contexts
          (id, org_number, company_name, industry_code, context_json, confidence, sources_json, fetched_at, expires_at)
         VALUES (?, ?, ?, ?, ?, 'LOW', '["beta_provisioning"]', ?, ?)`
      )
      .bind(
        companyId,
        input.org_number,
        input.company_name,
        input.industry ?? null,
        JSON.stringify({ company_name: input.company_name, org_number: input.org_number, industry: input.industry ?? null }),
        now,
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      )
      .run();

    // 3. Identity (onetimepin — epost er identiteten, jf. auth.ts)
    await this.db
      .prepare(
        `INSERT INTO identities (id, identity_provider, provider_subject, email, email_verified, created_at)
         VALUES (?, 'onetimepin', ?, ?, 0, ?)`
      )
      .bind(identityId, `onetimepin:${input.contact_email.trim().toLowerCase()}`, input.contact_email.trim().toLowerCase(), now)
      .run();

    // 4. User
    await this.db
      .prepare(`INSERT INTO users (id, display_name, created_at) VALUES (?, ?, ?)`)
      .bind(userId, input.company_name, now)
      .run();

    // 5. user_identity link
    await this.db
      .prepare(`INSERT INTO user_identities (user_id, identity_id, is_primary, created_at) VALUES (?, ?, 1, ?)`)
      .bind(userId, identityId, now)
      .run();

    // 6. Membership: OWNER av ny tenant
    await this.db
      .prepare(`INSERT INTO tenant_memberships (id, user_id, tenant_id, role, joined_at, status) VALUES (?, ?, ?, 'OWNER', ?, 'ACTIVE')`)
      .bind(membershipId, userId, tenantId, now)
      .run();

    // 7. Beta metadata
    await this.db
      .prepare(
        `INSERT INTO beta_program (tenant_id, cohort, status, feedback_status, company_id, created_at)
         VALUES (?, ?, 'INVITED', 'PENDING', ?, ?)`
      )
      .bind(tenantId, input.beta_cohort, companyId, now)
      .run();

    return {
      tenant_id: tenantId,
      company_id: companyId,
      invitation_status: "INVITED",
      created_at: now,
    };
  }

  async listBetaCompanies(): Promise<Record<string, unknown>[]> {
    const rows = await this.db
      .prepare(
        `SELECT bp.tenant_id, bp.cohort, bp.status, bp.feedback_status, bp.company_id,
                t.name AS company_name, bp.created_at
         FROM beta_program bp JOIN tenants t ON t.id = bp.tenant_id
         ORDER BY bp.created_at DESC`
      )
      .all();
    return rows.results ?? [];
  }
}
