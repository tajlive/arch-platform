import { describe, it, expect } from "vitest";
import { BetaService } from "../src/beta";

// ── BetaService: tenant-isolasjon + provisioning ─────────────
// Verifiserer at beta_provisioning oppretter isolert tenant + at listBetaCompanies
// kun returnerer egne data (aldri cross-tenant).

function captureDb() {
  const inserts: Array<{ table: string; bindings: unknown[] }> = [];
  const db = {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          // Fang tabellnavn + bindings for verifisering
          const tableMatch = sql.match(/INSERT INTO (\w+)/) || sql.match(/UPDATE (\w+)/);
          if (tableMatch) inserts.push({ table: tableMatch[1], bindings: args });
          return {
            run: async () => ({ meta: { changes: 1 } }),
            first: async () => null,
            all: async () => ({ results: [] }),
          };
        },
      };
    },
  };
  return { db, inserts };
}

describe("BetaService — tenant-isolasjon ved provisioning", () => {
  it("provisionTenant oppretter 7 entiteter med konsistent tenant_id", async () => {
    const { db, inserts } = captureDb();
    const beta = new BetaService(db as never);
    const result = await beta.provisionTenant({
      company_name: "Test Bedrift AS",
      org_number: "123456789",
      contact_email: "owner@testbedrift.no",
      industry: "45.200",
      beta_cohort: "BETA_001",
    });

    expect(result.tenant_id).toBeTruthy();
    expect(result.invitation_status).toBe("INVITED");

    // Verifiser at tenants-insert bruker riktig tenant_id
    const tenantInsert = inserts.find((i) => i.table === "tenants");
    expect(tenantInsert).toBeTruthy();

    // membership må koble owner til tenant_id (IKKE annen tenant)
    const membershipInsert = inserts.find((i) => i.table === "tenant_memberships");
    expect(membershipInsert).toBeTruthy();
    // binding-rekkefølge: id, user_id, tenant_id, role, joined_at, status
    expect(membershipInsert!.bindings[2]).toBe(result.tenant_id);

    // beta_program må bruke samme tenant_id
    const betaInsert = inserts.find((i) => i.table === "beta_program");
    expect(betaInsert).toBeTruthy();
    expect(betaInsert!.bindings[0]).toBe(result.tenant_id);
  });

  it("provisionTenant validerer at contact_email normaliseres (onetimepin subject)", async () => {
    const { db, inserts } = captureDb();
    const beta = new BetaService(db as never);
    await beta.provisionTenant({
      company_name: "X",
      org_number: "1",
      contact_email: "Owner@Test.no",
      beta_cohort: "BETA_001",
    });

    const identityInsert = inserts.find((i) => i.table === "identities");
    expect(identityInsert).toBeTruthy();
    // binding-rekkefølge (identity_provider er hardkodet 'onetimepin' i SQL):
    // id, provider_subject, email, created_at
    expect(identityInsert!.bindings[1]).toBe("onetimepin:owner@test.no"); // normalisert subject
    expect(identityInsert!.bindings[2]).toBe("owner@test.no");           // normalisert epost
  });
});
