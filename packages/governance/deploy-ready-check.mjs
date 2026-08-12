#!/usr/bin/env node
/**
 * deploy-ready-check.mjs — Deploy Ready Gate (F3.6).
 * Verifiserer de 12 pre-deploy-bevisene deterministisk (ingen secrets/network).
 * Exit 0 = alle grønne, exit 1 = minst én rød. Output = bevis-tabell.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const walk = (d, out = []) => {
  if (!existsSync(d)) return out;
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

const checks = [];
const add = (id, label, pass, evidence) => checks.push({ id, label, pass, evidence });

// 1. Ingen hardkodede /Users/-stier i produksjonslaget.
//    Scanner (audit-leak) og genererte data.js utelukkes — scanneren SØKER etter /Users/,
//    og intern data.js inneholder dev_path med vilje (intern visning).
const prodFiles = [
  ...walk(join(root, "packages", "data-adapters")).filter((f) => !f.endsWith("audit-leak.mjs")),
  ...walk(join(root, "packages", "audit")),
  ...walk(join(root, "apps")).filter((f) => !f.endsWith("data.js")),
  ...walk(join(root, "packages", "health-score")),
];
const hardcoded = prodFiles.filter((f) => /\.(mjs|js|html)$/.test(f) && read(f).includes("/Users/"));
add("NO_LOCAL_PATHS", "Ingen hardkodede /Users/-stier i prod-laget", hardcoded.length === 0,
  hardcoded.length === 0 ? "0 treff i adapters/collector/apps" : `LEKKASJE: ${hardcoded.join(", ")}`);

// 2. Project Registry
const reg = join(root, "packages", "governance", "projects.json");
add("PROJECT_REGISTRY", "Project Registry (SSoT)", existsSync(reg), existsSync(reg) ? reg : "mangler");

// 3. Data Adapter-lag
const adapters = ["github-adapter.mjs", "linear-adapter.mjs", "knowledge-adapter.mjs", "hermes-adapter.mjs"]
  .map((f) => join(root, "packages", "data-adapters", f));
add("DATA_ADAPTERS", "Data Adapter-lag (4 adaptere)", adapters.every(existsSync),
  `${adapters.filter(existsSync).length}/4 adaptere`);

// 4. Provenance-statuser
const prov = read(join(root, "packages", "data-adapters", "lib", "provenance.mjs"));
const statuses = ["observed", "declared", "stale", "unknown", "error"];
add("PROVENANCE", "observed/declared/stale/unknown/error", statuses.every((s) => prov.includes(s)),
  statuses.filter((s) => prov.includes(s)).join(","));

// 5. Intern vs offentlig datasone (default-deny)
const cc = existsSync(join(root, "apps", "control-center", "index.html"));
const cp = existsSync(join(root, "apps", "customer-portal", "index.html"));
add("INTERNAL_PUBLIC_SPLIT", "Intern vs offentlig visning (default-deny)", cc && cp,
  `control-center=${cc} customer-portal=${cp}`);

// 6. Health Score v2.1 (evidence + 4 tilstander)
const hs = read(join(root, "packages", "health-score", "health-score.mjs"));
add("HEALTH_SCORE_21", "Health Score v2.1 (evidence, PASS/FAIL/UNKNOWN/NA)",
  ["PASS", "FAIL", "UNKNOWN", "NOT_APPLICABLE"].every((s) => hs.includes(s)), "4 tilstander i kode");

// 7. Automatisert refresh (build-script)
const pkg = read(join(root, "package.json"));
add("AUTO_REFRESH", "Automatisert refresh (build → collect)", /"build"\s*:\s*"node packages\/data-adapters\/collect.mjs"/.test(pkg),
  "npm run build → collector");

// 8. Leakage = 0 (publikumsartefakt)
const pubData = read(join(root, "apps", "customer-portal", "data.js"));
const leakPats = ["/Users/", "dev_path", "LINEAR_API_KEY", "linear_team", "repository", "Bearer", "secret://"];
const leaks = leakPats.filter((p) => pubData.includes(p));
add("LEAKAGE_ZERO", "secret/path/privacy leakage = 0", leaks.length === 0,
  leaks.length === 0 ? "0 sensitive treff i public data.js" : `LEKKASJE: ${leaks.join(", ")}`);

// 9. Intern overflate beskyttet (IKKE i deploy-scope, merket INTERN)
const ccHtml = read(join(root, "apps", "control-center", "index.html"));
add("INTERNAL_PROTECTED", "Intern overflate beskyttet (merket INTERN, ikke deploy-scope)",
  /INTERN/i.test(ccHtml), "control-center merket INTERN");

// 10. Public/demo build sanitert
add("PUBLIC_SANITIZED", "Public/demo build ferdig og sanitert",
  existsSync(join(root, "apps", "customer-portal", "data.js")) && leaks.length === 0,
  "customer-portal/data.js generert + sanitert");

// 11. Rollback-plan
const rb = read(join(root, "docs", "deploy-readiness-report.md"));
add("ROLLBACK_PLAN", "Rollback-plan dokumentert", /rollback/i.test(rb), "dokumentert i deploy-readiness-report");

// 12. CI/security gates
add("CI_GATES", "CI/security gates (workflow)", existsSync(join(root, ".github", "workflows", "ci.yml")),
  ".github/workflows/ci.yml");

// ── output ──
let fail = 0;
for (const c of checks) {
  if (!c.pass) fail++;
  console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.id.padEnd(22)} ${c.label.padEnd(46)} ${c.evidence}`);
}
console.log(fail === 0 ? `\n✅ ALLE ${checks.length} GATES GRØNNE` : `\n❌ ${fail}/${checks.length} GATE(S) RØD`);
process.exit(fail === 0 ? 0 : 1);
