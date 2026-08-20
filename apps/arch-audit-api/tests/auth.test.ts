import { describe, it, expect } from "vitest";
import { AuthService, TenantContext, authorize, permissionsFor, getAccessIdentity } from "../src/auth";
import { TenantDataAccess } from "../src/tenant-access";

// ── Deterministic tests av auth + authorization logikk (ingen Workers runtime) ──

function makeMemberships(rows: Array<{ id: string; user_id: string; tenant_id: string; role: string; status: string }>) {
  return rows;
}

describe("permissionsFor", () => {
  it("OWNER har alle permissions", () => {
    const p = permissionsFor("OWNER");
    expect(p).toContain("audit:read");
    expect(p).toContain("audit:write");
    expect(p).toContain("audit:delete");
    expect(p).toContain("tenant:manage");
  });

  it("AUDITOR har KUN audit:read", () => {
    const p = permissionsFor("AUDITOR");
    expect(p).toEqual(["audit:read"]);
  });

  it("MEMBER har read+write men IKKE delete", () => {
    const p = permissionsFor("MEMBER");
    expect(p).toContain("audit:read");
    expect(p).toContain("audit:write");
    expect(p).not.toContain("audit:delete");
    expect(p).not.toContain("tenant:manage");
  });
});

describe("authorize", () => {
  const ctx = (role: string): TenantContext => ({
    user_id: "u1", identity_id: "i1", tenant_id: "t1", membership_id: "m1",
    role: role as never, permissions: permissionsFor(role as never),
    request_id: "r", trace_id: "r",
  });

  it("MEMBER kan ikke invokere admin-operasjon (delete)", () => {
    expect(authorize(ctx("MEMBER"), "audit:delete", null)).toBe("DENY");
  });

  it("OWNER kan delete", () => {
    expect(authorize(ctx("OWNER"), "audit:delete", null)).toBe("ALLOW");
  });

  it("AUDITOR kan read men ikke write", () => {
    expect(authorize(ctx("AUDITOR"), "audit:read", null)).toBe("ALLOW");
    expect(authorize(ctx("AUDITOR"), "audit:write", null)).toBe("DENY");
  });
});

describe("AuthService.buildTenantContext — tenant switching & membership", () => {
  const svc = new AuthService({} as never);
  const base = { identityId: "i1", userId: "u1" };

  it("single-tenant user får sin eneste tenant", () => {
    const resolve = {
      ...base,
      memberships: makeMemberships([{ id: "m1", user_id: "u1", tenant_id: "tA", role: "OWNER", status: "ACTIVE" }]),
    };
    const tc = svc.buildTenantContext(resolve as never, null, "r", "r");
    expect(tc?.tenant_id).toBe("tA");
  });

  it("single-tenant user kan IKKE switch til urelatert tenant", () => {
    const resolve = {
      ...base,
      memberships: makeMemberships([{ id: "m1", user_id: "u1", tenant_id: "tA", role: "OWNER", status: "ACTIVE" }]),
    };
    const tc = svc.buildTenantContext(resolve as never, "tB", "r", "r");
    expect(tc).toBeNull(); // tenant_id i request = ønske, ikke autorisasjon
  });

  it("multi-tenant user kan kun switch til gyldig membership", () => {
    const resolve = {
      ...base,
      memberships: makeMemberships([
        { id: "m1", user_id: "u1", tenant_id: "tA", role: "OWNER", status: "ACTIVE" },
        { id: "m2", user_id: "u1", tenant_id: "tB", role: "MEMBER", status: "ACTIVE" },
      ]),
    };
    const tcA = svc.buildTenantContext(resolve as never, "tA", "r", "r");
    expect(tcA?.tenant_id).toBe("tA");
    const tcB = svc.buildTenantContext(resolve as never, "tB", "r", "r");
    expect(tcB?.tenant_id).toBe("tB");
    // Ugyldig tenant → null
    expect(svc.buildTenantContext(resolve as never, "tC", "r", "r")).toBeNull();
  });

  it("multi-tenant user uten eksplisitt valg → null (krever valg)", () => {
    const resolve = {
      ...base,
      memberships: makeMemberships([
        { id: "m1", user_id: "u1", tenant_id: "tA", role: "OWNER", status: "ACTIVE" },
        { id: "m2", user_id: "u1", tenant_id: "tB", role: "MEMBER", status: "ACTIVE" },
      ]),
    };
    expect(svc.buildTenantContext(resolve as never, null, "r", "r")).toBeNull();
  });

  it("user uten membership → null", () => {
    const resolve = { ...base, memberships: makeMemberships([]) };
    expect(svc.buildTenantContext(resolve as never, "tA", "r", "r")).toBeNull();
  });
});

describe("getAccessIdentity — sikkerhetsgrenser", () => {
  it("returnerer undefined uten ctx.access", async () => {
    const ctx = {} as never;
    expect(await getAccessIdentity(ctx)).toBeUndefined();
  });

  it("returnerer identity med provider_subject = user_uuid (OIDC)", async () => {
    const ctx = {
      access: {
        getIdentity: async () => ({ user_uuid: "uuid-123", email: "x@y.no", idp: { id: "google", type: "oidc" } }),
      },
    } as never;
    const id = await getAccessIdentity(ctx);
    expect(id?.provider_subject).toBe("uuid-123");
    expect(id?.email).toBe("x@y.no");
  });

  it("onetimepin (ingen user_uuid) faller tilbake til namespaced epost-subject", async () => {
    const ctx = {
      access: {
        getIdentity: async () => ({ email: "Tom@Example.no", name: "Tom", idp: { id: "onetimepin", type: "onetimepin" } }),
      },
    } as never;
    const id = await getAccessIdentity(ctx);
    expect(id?.provider_subject).toBe("onetimepin:tom@example.no");
    expect(id?.email).toBe("tom@example.no"); // normalisert
  });

  it("returnerer undefined uten verken user_uuid eller epost", async () => {
    const ctx = {
      access: {
        getIdentity: async () => ({ name: "Tom" }),
      },
    } as never;
    expect(await getAccessIdentity(ctx)).toBeUndefined();
  });
});
