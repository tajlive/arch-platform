import { describe, it, expect, beforeAll } from "vitest";
import { PublicAuditDataAccess } from "../src/sessions";

// Vitest kjører på Node, ikke Workers runtime. Vi bruker en minimal
// D1Database-mock for å teste data-access-logikken deterministisk.
// Selve Workers-runtime-D1 testes via wrangler dev + produksjons-smoke.

type Row = Record<string, unknown>;

class FakeD1 {
  rows: Row[] = [];
  prepare(sql: string) {
    const self = this;
    return {
      bind(..._args: unknown[]) {
        return this;
      },
      async run() {
        // capture INSERT for sessions
        return { success: true };
      },
      async first<T>(): Promise<T | null> {
        const m = sql.match(/FROM (\w+)/);
        const table = m ? m[1] : "";
        const all = self.rows.filter((r) => r.__table === table);
        return (all[0] as T) ?? null;
      },
      async all<T>(): Promise<T[]> {
        const m = sql.match(/FROM (\w+)/);
        const table = m ? m[1] : "";
        return self.rows.filter((r) => r.__table === table) as T[];
      },
    };
  }
}

describe("PublicAuditDataAccess", () => {
  it("verifyCredential avviser feil credential", async () => {
    const db = new FakeD1() as unknown as D1Database;
    const access = new PublicAuditDataAccess(db);
    // Ingen rad i mock → false
    expect(await access.verifyCredential("s1", "wrong")).toBe(false);
  });

  it("isExpired returnerer true for gamle sessions", async () => {
    const db = new FakeD1() as unknown as D1Database;
    const access = new PublicAuditDataAccess(db);
    const session = {
      id: "s1", scope: "FREE", ownership_mode: "ANONYMOUS", tenant_id: null, user_id: null,
      company_context_id: null, status: "ACTIVE", free_boundary_reached: 0,
      created_at: "2020-01-01", updated_at: "2020-01-01", expires_at: "2020-01-02",
    } as const;
    expect(await access.isExpired(session as never)).toBe(true);
  });
});
