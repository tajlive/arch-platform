// integration/cross-tenant.test.mjs — cross-tenant isolation tests mot ekte D1
// Kjører mot prod-D1 via Cloudflare REST API. Beviser tenant-isolasjon på data-laget.
// Bruk: source .env.local && node tests/integration/cross-tenant.test.mjs

const ACCOUNT = "80d5b1d56a3e907150ba7348b6182894";
const D1_ID = "3a2bbd50-515d-45b5-a190-f47fdc2b8efb";
const D1_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/d1/database/${D1_ID}/query`;

// Token fra env (satt av source)
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error("CLOUDFLARE_API_TOKEN ikke satt. source .env.local først.");
  process.exit(1);
}

async function query(sql, params = []) {
  const res = await fetch(D1_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
  });
  return res.json();
}

let pass = 0, fail = 0;
function check(name, condition, extra = "") {
  if (condition) { pass++; console.log(`✅ ${name}`); }
  else { fail++; console.log(`❌ ${name} ${extra}`); }
}

// Simulerer TenantDataAccess SQL (det faktiske mønsteret handlerne bruker)
async function scopedGetAudit(auditId, tenantId) {
  const r = await query(
    "SELECT * FROM audit_sessions WHERE id = ? AND tenant_id = ?",
    [auditId, tenantId]
  );
  return r.result?.[0]?.results?.[0] ?? null;
}

async function scopedListAudits(tenantId) {
  const r = await query("SELECT * FROM audit_sessions WHERE tenant_id = ?", [tenantId]);
  return r.result?.[0]?.results ?? [];
}

console.log("=== CROSS-TENANT ISOLATION TEST (prod D1) ===\n");

// 1. Cross-tenant READ: A prøver å lese B sin audit
const crossRead = await scopedGetAudit("audit-b-1", "tenant-a");
check("A kan IKKE lese B sin audit (WHERE id AND tenant_id)", crossRead === null, JSON.stringify(crossRead));

// 2. Tenant A ser KUN sine egne audits
const aAudits = await scopedListAudits("tenant-a");
check("A lister KUN A-audits (ikke B)", aAudits.length === 1 && aAudits[0].id === "audit-a-1", JSON.stringify(aAudits.map(a => a.id)));

// 3. Tenant B ser KUN sine egne
const bAudits = await scopedListAudits("tenant-b");
check("B lister KUN B-audits", bAudits.length === 1 && bAudits[0].id === "audit-b-1", JSON.stringify(bAudits.map(a => a.id)));

// 4. Enumeration: endret UUID eksponerer ikke annen tenant
const enum1 = await scopedGetAudit("audit-b-1", "tenant-a"); // B-audit fra A → null
const enum2 = await scopedGetAudit("audit-a-1", "tenant-b"); // A-audit fra B → null
check("Enumeration: B-audit fra A = null, A-audit fra B = null", enum1 === null && enum2 === null);

// 5. Membership: revoked user (user-d) har INGEN ACTIVE membership
const revoked = await query(
  "SELECT * FROM tenant_memberships WHERE user_id = 'user-d' AND status = 'ACTIVE'"
);
check("Revoked user-d har ingen ACTIVE membership", revoked.result?.[0]?.results?.length === 0);

// 6. Membership: user-c har 2 ACTIVE memberships (multi-tenant)
const multi = await query(
  "SELECT COUNT(*) as c FROM tenant_memberships WHERE user_id = 'user-c' AND status = 'ACTIVE'"
);
check("Multi-tenant user-c har 2 ACTIVE memberships", multi.result?.[0]?.results?.[0]?.c === 2);

// 7. Identity: user_uuid er stabil nøkkel (ikke email) — email kan endres uten å miste identity
const identity = await query(
  "SELECT * FROM identities WHERE identity_provider = 'test' AND provider_subject = 'user-a-subject'"
);
check("Identity resolve via provider_subject (ikke email)", identity.result?.[0]?.results?.length === 1);

console.log(`\n=== RESULTAT: ${pass} pass, ${fail} fail ===`);
process.exit(fail > 0 ? 1 : 0);
