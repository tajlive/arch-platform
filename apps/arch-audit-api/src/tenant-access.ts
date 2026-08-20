// tenant-access.ts — canonical TenantDataAccess (secure by construction)
//
// Viktig: authenticated tenant-handlers skal IKKE få fri tilgang til env.DB.
// De arbeider gjennom denne abstraksjonen som allerede kjenner TenantContext.
// Alle tenant-eide queries eksplisitt scopes: WHERE tenant_id = ? (eller id = ? AND tenant_id = ?)

import type { D1Database } from "@cloudflare/workers-types";
import { TenantContext } from "./auth";

export class TenantDataAccess {
  constructor(private db: D1Database, private ctx: TenantContext) {}

  private get tenantId(): string {
    return this.ctx.tenant_id;
  }

  /**
   * Hent en tenant-eid audit. Bruker WHERE id = ? AND tenant_id = ?
   * slik at cross-tenant resource aldri returneres (404 ved miss).
   */
  async getAudit(auditId: string): Promise<Record<string, unknown> | null> {
    const row = await this.db
      .prepare(`SELECT * FROM audit_sessions WHERE id = ? AND tenant_id = ?`)
      .bind(auditId, this.tenantId)
      .first();
    return row ?? null;
  }

  /**
   * List alle audits for tenant (alltid scoped).
   */
  async listAudits(): Promise<Record<string, unknown>[]> {
    const rows = await this.db
      .prepare(`SELECT * FROM audit_sessions WHERE tenant_id = ? ORDER BY created_at DESC`)
      .bind(this.tenantId)
      .all();
    return rows.results ?? [];
  }

  /**
   * Oppdater en tenant-eid audit. tenant_id injiseres fra TenantContext,
   * ALDRI fra request payload.
   */
  async updateAudit(auditId: string, updates: Record<string, unknown>): Promise<boolean> {
    // Kun tillatte felt (whitelist) — aldri tenant_id/ownership fra payload
    const allowed = ["status", "scope", "free_boundary_reached"];
    const keys = Object.keys(updates).filter((k) => allowed.includes(k));
    if (keys.length === 0) return false;

    const sets = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => updates[k]);

    const res = await this.db
      .prepare(`UPDATE audit_sessions SET ${sets}, updated_at = ? WHERE id = ? AND tenant_id = ?`)
      .bind(...values, new Date().toISOString(), auditId, this.tenantId)
      .run();

    return res.meta?.changes > 0;
  }

  /**
   * Slett en tenant-eid audit (hard delete kun for OWNER/ADMIN med permission).
   */
  async deleteAudit(auditId: string): Promise<boolean> {
    const res = await this.db
      .prepare(`DELETE FROM audit_sessions WHERE id = ? AND tenant_id = ?`)
      .bind(auditId, this.tenantId)
      .run();
    return res.meta?.changes > 0;
  }

  /**
   * Opprett en tenant-eid audit. tenant_id kommer fra TenantContext.
   */
  async createAudit(input: { scope: string }): Promise<string> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await this.db
      .prepare(
        `INSERT INTO audit_sessions
          (id, scope, ownership_mode, tenant_id, user_id, status, free_boundary_reached, created_at, updated_at, expires_at)
         VALUES (?, ?, 'AUTHENTICATED', ?, ?, 'ACTIVE', 0, ?, ?, ?)`
      )
      .bind(id, input.scope, this.tenantId, this.ctx.user_id, now, now, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString())
      .run();
    return id;
  }
}
