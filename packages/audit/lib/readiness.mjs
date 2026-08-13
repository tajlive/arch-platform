#!/usr/bin/env node
/**
 * Readiness-gate — «READY FOR FIRST EXTERNAL CUSTOMER» (F4.1).
 *
 * Selvtest av hele kundeflyten. Alle sjekker må PASS for at gaten er grønn:
 *   1. Alle audit-moduler syntax-gyldige (node --check)
 *   2. Onboarding/design-partner/pitch-dokumenter tilstede
 *   3. Kunde-template gyldig + consent-gate NEXTER uten samtykke
 *   4. Design-partner-manifest (bilglass) validerer (consent OK)
 *   5. Røyk-audit produserer 3 filer + 6-dimensjonalt scorecard + 4 bøtter + Build Proposal
 *   6. Consent-gate: audit med ukjent kunde avbrytes (exit 2)
 *   7. Ingen secret-verdier i genererte artefakter
 *
 * Bruk: npm run audit:ready
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, mkdtempSync, readdirSync, statSync, rmSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..", "..", "..");
const auditCli = join(root, "packages", "audit", "audit.mjs");
const DOCS = ["docs/f4.1-onboarding.md", "docs/f4.1-design-partner.md", "docs/f4.1-pitch.md"];
const MODULES = [
  "packages/audit/audit.mjs",
  "packages/audit/lib/classify.mjs",
  "packages/audit/lib/commercial.mjs",
  "packages/audit/lib/build-proposal.mjs",
  "packages/audit/lib/scorecard.mjs",
  "packages/audit/lib/customer.mjs",
  "packages/audit/lib/report.mjs",
  "packages/audit/lib/secret-scan.mjs",
  "packages/audit/lib/stack-detect.mjs",
];

let pass = 0;
let fail = 0;
const check = (name, ok, detail = "") => {
  if (ok) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`); }
};

console.log("\nARCH AUDIT — READY FOR FIRST EXTERNAL CUSTOMER\n" + "=".repeat(58));

// 1. Syntax
for (const m of MODULES) {
  try {
    execFileSync("node", ["--check", join(root, m)], { encoding: "utf8" });
    check(`syntax: ${m}`, true);
  } catch (e) {
    check(`syntax: ${m}`, false, String(e.message || e).split("\n")[0]);
  }
}

// 2. Docs
for (const d of DOCS) check(`dokument: ${d}`, existsSync(join(root, d)));

// 3. Template + consent-gate
const tplPath = join(root, "packages", "audit", "customers", "_template.json");
const tpl = existsSync(tplPath) ? JSON.parse(readFileSync(tplPath, "utf8")) : null;
check("kunde-template finnes", !!tpl);
check("template default nektes (consent_granted=false)", tpl?.consent_granted === false);

// 4. Design-partner-manifest validerer
const dpPath = join(root, "packages", "audit", "customers", "bilglass.json");
let dpOk = false;
if (existsSync(dpPath)) {
  const dp = JSON.parse(readFileSync(dpPath, "utf8"));
  dpOk = dp.consent_granted === true && dp.mode === "design_partner" && dp.access?.level === "read_only" && !!dp.scope?.description;
}
check("design-partner-manifest (bilglass) consent/scope/read-only", dpOk);

// 5. Røyk-audit
const tmp = mkdtempSync(join(tmpdir(), "arch-ready-"));
let smokeOk = false;
let smokeDetail = "";
try {
  execFileSync("node", [auditCli, ".", "--save", tmp], { encoding: "utf8", timeout: 180000 });
  const files = readdirSync(tmp);
  const md = files.find((f) => f.endsWith(".md") && !f.includes("technical"));
  const tech = files.find((f) => f.endsWith(".technical.md"));
  const ev = files.find((f) => f.endsWith(".evidence.json"));
  let content = "";
  if (md) content = readFileSync(join(tmp, md), "utf8");
  const six = ["Security", "Governance", "Engineering", "Operations", "Documentation", "Automation Potential"]
    .every((d) => content.includes(d));
  const four = ["Kritisk", "Høy ROI", "Quick win", "Strategisk"].every((b) => content.includes(b));
  const proposal = content.includes("Arch Build Proposal — utkast");
  smokeOk = !!md && !!tech && !!ev && six && four && proposal;
  smokeDetail = `3 filer=${!!md && !!tech && !!ev}, scorecard6=${six}, bøtter4=${four}, proposal=${proposal}`;
} catch (e) {
  smokeDetail = String(e.message || e).split("\n").slice(0, 2).join(" | ");
}
check("røyk-audit: 3 filer + 6-dimensjonalt scorecard + 4 bøtter + Build Proposal", smokeOk, smokeDetail);

// 6. Consent-gate avbryter
let gateOk = false;
try {
  execFileSync("node", [auditCli, ".", "--customer", "finnes-ikke"], { encoding: "utf8", timeout: 60000 });
} catch (e) {
  gateOk = e.status === 2;
}
check("consent-gate: ukjent kunde avbrytes (exit 2)", gateOk);

// 7. Ingen secret-verdier i artefakter
const leaked = [];
const scanDir = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { scanDir(p); continue; }
    const text = readFileSync(p, "utf8");
    if (/eyJ[A-Za-z0-9_-]{20,}/.test(text)) leaked.push(`${p}: JWT-verdi`);
    if (/\b(sk|AKIA|ghp_|github_pat_)[A-Za-z0-9]{20,}/.test(text)) leaked.push(`${p}: nøkkel-verdi`);
  }
};
scanDir(tmp);
const custDir = join(root, "docs", "audits", "customers");
if (existsSync(custDir)) scanDir(custDir);
check("ingen secret-verdier i genererte artefakter", leaked.length === 0, leaked.slice(0, 3).join("; "));

// Cleanup
try { rmSync(tmp, { recursive: true, force: true }); } catch { /* best-effort */ }

console.log("=".repeat(58));
console.log(`RESULTAT: ${pass}/${pass + fail} PASS${fail ? " — IKKE READY" : ""}`);
if (!fail) console.log("GATE: ✅ READY FOR FIRST EXTERNAL CUSTOMER\n");
else { console.log("GATE: ❌ BLOCKERT\n"); process.exit(1); }
