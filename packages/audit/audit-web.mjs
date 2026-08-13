#!/usr/bin/env node
/**
 * Arch Website Audit v1 (F4.2B) — laveste terskel inn i Arch.
 *
 * Utenfor-inn, read-only, passiv: analyserer KUN offentlig observerbar informasjon
 * via normale HTTP GET/HEAD-forespørsler (+ headless Chrome for rendering-signaler).
 * Ingen login-bypass, ingen exploits, ingen mutasjoner, ingen skjemainnsending.
 *
 * Bruk:
 *   npm run audit:web -- @url:https://kunde.no --customer <id> [--design-partner]
 *   npm run audit:web -- @url:https://prospekt.no --prospect-preview
 *   npm run audit:web -- https://kunde.no [--json|--technical] [--save <dir>]
 *   npm run audit:web -- https://kunde.no --browser-evidence <json>
 *
 * Sikkerhetsgrenser (konfigurerbare, trygge som default):
 *   --max-pages 25 · --max-depth 3 · --delay-ms 300 · same-origin · respekterer robots.txt
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

import { collect } from "./lib/web/collect.mjs";
import { scoreWeb } from "./lib/web/score.mjs";
import { buildWebFindings } from "./lib/web/findings.mjs";
import { renderWebCustomer, renderWebTechnical, execSummary } from "./lib/web/report.mjs";
import { collectBrowser, loadBrowserEvidence } from "./lib/web/browser.mjs";
import { loadCustomer, validateWebsite, assertNoSecrets, websiteCustomerDir, prospectDir } from "./lib/customer.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const asTechnical = args.includes("--technical");
const designPartner = args.includes("--design-partner");
const prospectFlag = args.includes("--prospect-preview");

function flagValue(flag) { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; }
const customerId = flagValue("--customer");
const saveDir = flagValue("--save");
const browserEvidencePath = flagValue("--browser-evidence");
const maxPages = parseInt(flagValue("--max-pages") ?? "25", 10);
const maxDepth = parseInt(flagValue("--max-depth") ?? "3", 10);
const delayMs = parseInt(flagValue("--delay-ms") ?? "300", 10);

// ── Resolve URL (@url:https://... eller plain) ──
let urlArg = null;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith("@url:")) { urlArg = a.slice(5); break; }
  if (["--json", "--technical", "--design-partner", "--prospect-preview"].includes(a)) continue;
  if (["--customer", "--save", "--browser-evidence", "--max-pages", "--max-depth", "--delay-ms"].includes(a)) { i++; continue; }
  if (a.startsWith("--")) continue;
  urlArg = a; break;
}

if (!urlArg) {
  console.error("Bruk: npm run audit:web -- @url:https://kunde.no [--customer <id>] [--prospect-preview] [--design-partner] [--json|--technical] [--save <dir>]");
  process.exit(2);
}
if (!/^https?:\/\//i.test(urlArg)) urlArg = "https://" + urlArg;
let u;
try { u = new URL(urlArg); } catch { console.error(`Ugyldig URL: ${urlArg}`); process.exit(2); }
const domain = u.hostname;

// ── Kunde-modus / consent-gate ──
let customer = null;
let outDir = saveDir;
if (customerId) {
  const res = loadCustomer(customerId);
  if (res.error) { console.error(res.error); process.exit(2); }
  const man = { ...res.manifest, website: res.manifest.website ?? urlArg };
  if (designPartner && man.mode !== "prospect_preview") man.mode = "design_partner";
  const errors = validateWebsite(man);
  if (errors.length) {
    console.error(`Consent/scope-gate feilet for «${customerId}»:\n- ${errors.join("\n- ")}`);
    console.error("For formell kunde-audit: consent_granted=true + website. For intern research: mode=prospect_preview eller --prospect-preview.");
    process.exit(2);
  }
  if (!assertNoSecrets(man)) { console.error("Kundemanifesten inneholder secret-lignende verdier — avbryter."); process.exit(2); }
  const modeLabel = man.mode === "prospect_preview" ? "Intern prospect-vurdering" : (man.mode === "design_partner" ? "Design partner (pilot)" : "Kunde");
  customer = { id: man.id, name: man.name, mode: man.mode, modeLabel, website: man.website, consent_granted: man.consent_granted, consent_date: man.consent_date };
  outDir = man.mode === "prospect_preview" ? prospectDir(man.id) : websiteCustomerDir(man.id);
} else if (prospectFlag) {
  customer = { id: domain, name: domain, mode: "prospect_preview", modeLabel: "Intern prospect-vurdering", website: urlArg, consent_granted: false, consent_date: null };
  outDir = prospectDir(domain);
}

const name = customer?.name ?? domain;

// ── 1. Samle (fetch, passiv, sikker) ──
console.error(`\n[arch] Analyserer ${urlArg} (passiv, read-only)…`);
const started = Date.now();
const collectResult = await collect(urlArg, { max_pages: maxPages, max_depth: maxDepth, delay_ms: delayMs });

// ── 2. Browser (valgfri berikelse) ──
let browserEvidence = null;
if (browserEvidencePath) {
  browserEvidence = loadBrowserEvidence(browserEvidencePath);
  if (!browserEvidence) console.error(`[arch] Kunne ikke lese browser-evidence: ${browserEvidencePath} — fortsetter uten.`);
} else {
  const browserDir = outDir ? join(outDir, "browser-evidence") : join(tmpdir(), `arch-web-${domain}`);
  browserEvidence = collectBrowser(urlArg, browserDir);
}

// ── 3. Score + funn ──
const score = scoreWeb(collectResult);
const findings = buildWebFindings(collectResult, score, browserEvidence);

// ── 4. Audit-objekt ──
const audit = {
  meta: {
    generated: new Date().toISOString(),
    version: "1.0",
    name,
    website: urlArg,
    domain,
    final_url: collectResult.meta.final_url,
    mode: "website",
    design_partner: customer?.mode === "design_partner" || designPartner,
    audit_duration_ms: Date.now() - started,
  },
  customer,
  score,
  findings,
  browser: browserEvidence ?? { available: false },
  web: collectResult,
  automation: score.automation,
  quick_wins: [],
  build_opportunities: [],
  human_approvals: [],
};
audit.executive_summary = execSummary(audit);

// ── 5. Output ──
if (asJson) {
  console.log(JSON.stringify(audit, null, 2));
} else if (asTechnical) {
  console.log(renderWebTechnical(audit));
} else {
  console.log(renderWebCustomer(audit));
}

if (outDir) {
  mkdirSync(outDir, { recursive: true });
  const base = join(outDir, `website-audit-${domain}`);
  writeFileSync(`${base}.md`, renderWebCustomer(audit));
  writeFileSync(`${base}.technical.md`, renderWebTechnical(audit));
  writeFileSync(`${base}.evidence.json`, JSON.stringify(audit, null, 2));
  console.error(`\n[lagret] ${base}.md + ${base}.technical.md + ${base}.evidence.json`);
}

process.exit(0);
