#!/usr/bin/env node
/**
 * Leveranse-registrering — Arch Audit F4.2 (måling av kundeleveransen).
 *
 * Auto-beregner maskin-sidige måltall fra en ferdig kunde-audit (evidence.json),
 * og merger dem inn i kundens leveranse-record. Menneskelige felt (tidsbruk,
 * manuelle steg, feedback, objections, kommersielt utfall) fylles av Tom etter
 * kundemøtet — se docs/f4.2-first-real-customer.md for felt-definisjoner.
 *
 * Bruk:
 *   npm run audit:delivery -- <customer_id>          # auto-beregn + skriv/merge
 *   npm run audit:delivery -- <customer_id> --check  # valider PROVEN-gate
 */
import { readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadCustomer } from "./customer.mjs";
import { buildActions } from "./commercial.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..", "..");
const CUSTOMERS_DIR = join(root, "packages", "audit", "customers");
const AUDIT_OUT_ROOT = join(root, "docs", "audits", "customers");

const args = process.argv.slice(2);
const check = args.includes("--check");
const id = args.find((a) => !a.startsWith("--"));

if (!id) {
  console.error("Bruk: npm run audit:delivery -- <customer_id> [--check]");
  process.exit(2);
}

const manifestRes = loadCustomer(id);
if (manifestRes.error) { console.error(manifestRes.error); process.exit(2); }

const outDir = join(AUDIT_OUT_ROOT, id);
const evidenceFile = existsSync(outDir)
  ? readdirSync(outDir).find((f) => f.endsWith(".evidence.json"))
  : null;

if (!evidenceFile) {
  console.error(`Ingen audit-evidence for «${id}» — kjør audit først: npm run audit -- <repo> --customer ${id}`);
  process.exit(2);
}

const audit = JSON.parse(readFileSync(join(outDir, evidenceFile), "utf8"));

// ── Auto-beregning ──
const actions = buildActions(audit);
const byCategory = {};
for (const f of audit.findings ?? []) byCategory[f.section] = (byCategory[f.section] ?? 0) + 1;
const auto = {
  customer_id: id,
  milestone: "F4.2 — First Real Customer",
  started_at: audit.meta?.generated ?? null,
  timing: {
    audit_machine_ms: audit.meta?.audit_duration_ms ?? null,
  },
  findings: {
    by_category: byCategory,
    build_candidates: actions.filter((a) => a.build_candidate).length,
  },
};

// ── Merge med evt. eksisterende record (bevar menneskelige felt) ──
const recPath = join(CUSTOMERS_DIR, `${id}.delivery.json`);
let record = auto;
if (existsSync(recPath)) {
  const existing = JSON.parse(readFileSync(recPath, "utf8"));
  record = {
    ...existing,
    ...auto,
    timing: { ...(existing.timing ?? {}), ...auto.timing },
    findings: { ...(existing.findings ?? {}), ...auto.findings, by_category: auto.findings.by_category },
  };
}

if (!check) {
  writeFileSync(recPath, JSON.stringify(record, null, 2) + "\n");
}

// ── Rapport ──
console.log(`\nLEVERANSE-REGISTRERING — ${id}`);
console.log("=".repeat(50));
console.log(`  Audit maskin-tid : ${auto.timing.audit_machine_ms ?? "?"} ms`);
console.log(`  Funn per kategori: ${Object.entries(byCategory).map(([k, v]) => `${k}=${v}`).join(", ") || "(ingen)"}`);
console.log(`  Build-kandidater  : ${auto.findings.build_candidates}`);

const missing = [];
if (record.timing.lead_to_consent_hours == null) missing.push("timing.lead_to_consent_hours");
if (record.timing.total_elapsed_hours == null) missing.push("timing.total_elapsed_hours");
if (record.timing.manual_steps == null) missing.push("timing.manual_steps");
if (record.timing.automation_rate_pct == null) missing.push("timing.automation_rate_pct");
if (!(record.findings.customer_cared_about ?? []).length) missing.push("findings.customer_cared_about");
if (!(record.customer?.objections ?? []).length && !(record.customer?.questions ?? []).length) missing.push("customer.objections / questions");
if (!(record.customer?.feedback ?? "").trim()) missing.push("customer.feedback");
if (!record.commercial?.outcome) missing.push("commercial.outcome");
if (!(record.learning?.knowledge_graph_entries ?? []).length) missing.push("learning.knowledge_graph_entries");

if (check) {
  console.log(`\nGATE «PROVEN WITH REAL CUSTOMER»:`);
  if (!missing.length) {
    console.log("  ✅ PASS — leveranse + tilbakemelding registrert");
    process.exit(0);
  }
  console.log(`  ❌ IKKE PASS — mangler: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(`\nManglende (menneskelige) felt — fyll i ${recPath}:`);
missing.forEach((m) => console.log(`  - ${m}`));
console.log("\nDeretter: npm run audit:delivery -- " + id + " --check  for PROVEN-gate.\n");
