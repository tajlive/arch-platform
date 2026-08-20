import { describe, it, expect } from "vitest";
import { TenantDataAccess } from "../src/tenant-access";
import { TenantContext } from "../src/auth";

// ── TenantDataAccess: secure by construction ─────────────────
// Verifiserer at tenant-scoping er hardkodet i SQL (WHERE ... AND tenant_id = ?),
// og at tenant_id ALDRI kan komme fra payload.

function ctx(tenantId: string): TenantContext {
  return {
    user_id: "u1", identity_id: "i1", tenant_id: tenantId, membership_id: "m1",
    role: "OWNER", permissions: ["audit:read", "audit:write", "audit:delete"],
    request_id: "r", trace_id: "r",
  };
}

// Capture-verktøy for å inspisere SQL + bindings uten ekte D1
function captureAccess() {
  const calls: Array<{ sql: string; bindings: unknown[] }> = [];
  const db = {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          calls.push({ sql, bindings: args });
          return {
            first: async () => ({ id: "audit-1", tenant_id: args[args.length - 1] }),
            all: async () => ({ results: [] }),
            run: async () => ({ meta: { changes: 1 } }),
          };
        },
        first: async () => null,
        all: async () => ({ results: [] }),
        run: async () => ({ meta: { changes: 0 } }),
      };
    },
  };
  return { db, calls };
}

describe("TenantDataAccess — secure by construction", () => {
  it("getAudit bruker WHERE id = ? AND tenant_id = ? (ikke bare id)", async () => {
    const { db, calls } = captureAccess();
    const access = new TenantDataAccess(db as never, ctx("tA"));
    await access.getAudit("audit-1");
    const call = calls.find((c) => c.sql.includes("audit_sessions WHERE id"));
    expect(call).toBeTruthy();
    expect(call!.sql).toContain("AND tenant_id = ?");
    // Siste binding = tenant_id (fra ctx, IKKE fra request)
    expect(call!.bindings[call!.bindings.length - 1]).toBe("tA");
  });

  it("listAudits scopes alltid til tenant", async () => {
    const { db, calls } = captureAccess();
    const access = new TenantDataAccess(db as never, ctx("tB"));
    await access.listAudits();
    const call = calls.find((c) => c.sql.includes("WHERE tenant_id = ?"));
    expect(call).toBeTruthy();
    expect(call!.bindings).toContain("tB");
  });

  it("updateAudit whitelister kun tillatte felt (aldri tenant_id/ownership)", async () => {
    const { db, calls } = captureAccess();
    const access = new TenantDataAccess(db as never, ctx("tA"));
    // Forsøk å endre tenant_id via payload — skal ignoreres
    const result = await access.updateAudit("audit-1", { tenant_id: "tB", ownership_mode: "AUTHENTICATED", status: "COMPLETED" });
    expect(result).toBe(true);
    const call = calls.find((c) => c.sql.includes("UPDATE audit_sessions"));
    expect(call!.sql).toContain("status = ?");
    expect(call!.sql).not.toContain("tenant_id = ?,"); // tenant_id kommer KUN fra WHERE-clause
    expect(call!.sql).not.toContain("ownership_mode");
  });

  it("deleteAudit bruker WHERE id = ? AND tenant_id = ?", async () => {
    const { db, calls } = captureAccess();
    const access = new TenantDataAccess(db as never, ctx("tA"));
    await access.deleteAudit("audit-1");
    const call = calls.find((c) => c.sql.includes("DELETE FROM audit_sessions"));
    expect(call!.sql).toContain("AND tenant_id = ?");
    expect(call!.bindings[call!.bindings.length - 1]).toBe("tA");
  });

  it("createAudit injiserer tenant_id fra ctx (ikke payload)", async () => {
    const { db, calls } = captureAccess();
    const access = new TenantDataAccess(db as never, ctx("tC"));
    await access.createAudit({ scope: "FULL" });
    const call = calls.find((c) => c.sql.includes("INSERT INTO audit_sessions"));
    // binding-rekkefølge: id, scope, tenant_id, user_id, ...
    expect(call!.bindings[2]).toBe("tC");
  });
});
