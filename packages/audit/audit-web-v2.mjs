#!/usr/bin/env node
/**
 * Arch Website Audit v2 (ARC-10) — v1 + Norge-utvidelse.
 *
 * Bygger på Website Audit v1 (F4.2B) og legger til v2-modulene:
 *   security.mjs  «Hva en hacker ser» (header-gradering A+–F, cookies, TLS, versjonslekkasjer)
 *   dns-email.mjs E-post & DNS-sikkerhet (SPF/DKIM/DMARC/MTA-STS/TLS-RPT/BIMI/CAA/DNSSEC/DNSBL + crt.sh)
 *   norge.mjs     Norge-data (Brreg · Norid RDAP · SSB)
 *   wayback.mjs   Historikk (Wayback CDX)
 *   compliance.mjs Compliance-signaler Norge (cookie/CMP, personvern, trackere, pris/angrerett)
 *
 * Samme sikkerhetsgrenser som v1: passiv, read-only, kun GET/HEAD/DNS.
 * Eksponerte-filer-sjekk i security.mjs er AV som default og krever --check-exposed-files.
 *
 * Bruk:
 *   npm run audit:web2 -- https://kunde.no [--customer <id>] [--prospect-preview]
 *   npm run audit:web2 -- https://kunde.no [--json|--technical] [--save <dir>] [--browser] [--check-exposed-files]
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

import { collect } from "./lib/web/collect.mjs";
import { scoreWeb } from "./lib/web/score.mjs";
import { buildWebFindings } from "./lib/web/findings.mjs";
import { renderWebCustomer, renderWebTechnical, execSummary } from "./lib/web/report.mjs";
import { renderV2Sections, renderV2Technical } from "./lib/web/report-v2.mjs";
import { collectBrowser } from "./lib/web/browser.mjs";
import { collectSecurity } from "./lib/web/security.mjs";
import { collectDnsEmail, registrable } from "./lib/web/dns-email.mjs";
import { collectNorge } from "./lib/web/norge.mjs";
import { collectWayback } from "./lib/web/wayback.mjs";
import { collectCompliance } from "./lib/web/compliance.mjs";
import { collectPageSpeed } from "./lib/web/pagespeed.mjs";
import { collectPresence } from "./lib/web/presence.mjs";
import { collectAiAnalysis } from "./lib/web/ai-analysis.mjs";
import { collectAiVisibility } from "./lib/web/ai-visibility.mjs";
import { loadCustomer, validateWebsite, assertNoSecrets, websiteCustomerDir, prospectDir } from "./lib/customer.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const asTechnical = args.includes("--technical");
const designPartner = args.includes("--design-partner");
const prospectFlag = args.includes("--prospect-preview");
const useBrowser = args.includes("--browser");
const checkExposedFiles = args.includes("--check-exposed-files");

function flagValue(flag) { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; }
const customerId = flagValue("--customer");
const saveDir = flagValue("--save");
const maxPages = parseInt(flagValue("--max-pages") ?? "25", 10);
const maxDepth = parseInt(flagValue("--max-depth") ?? "3", 10);
const delayMs = parseInt(flagValue("--delay-ms") ?? "300", 10);

// ── Resolve URL (samme regler som audit-web.mjs) ──
let urlArg = null;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith("@url:")) { urlArg = a.slice(5); break; }
  if (["--json", "--technical", "--design-partner", "--prospect-preview", "--browser", "--check-exposed-files"].includes(a)) continue;
  if (["--customer", "--save", "--max-pages", "--max-depth", "--delay-ms"].includes(a)) { i++; continue; }
  if (a.startsWith("--")) continue;
  urlArg = a; break;
}

if (!urlArg) {
  console.error("Bruk: npm run audit:web2 -- https://kunde.no [--customer <id>] [--prospect-preview] [--json|--technical] [--save <dir>] [--browser] [--check-exposed-files]");
  process.exit(2);
}
if (!/^https?:\/\//i.test(urlArg)) urlArg = "https://" + urlArg;
let u;
try { u = new URL(urlArg); } catch { console.error(`Ugyldig URL: ${urlArg}`); process.exit(2); }
const domain = u.hostname;
const regDomain = registrable(domain);

// ── Kunde-modus / consent-gate (samme som v1) ──
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
    process.exit(2);
  }
  if (!assertNoSecrets(man)) { console.error("Kundemanifestet inneholder secret-lignende verdier — avbryter."); process.exit(2); }
  const modeLabel = man.mode === "prospect_preview" ? "Intern prospect-vurdering" : (man.mode === "design_partner" ? "Design partner (pilot)" : "Kunde");
  customer = { id: man.id, name: man.name, mode: man.mode, modeLabel, website: man.website, consent_granted: man.consent_granted, consent_date: man.consent_date };
  // Eksplisitt --save vinner alltid; default avhenger av modus
  outDir = saveDir || (man.mode === "prospect_preview" ? prospectDir(man.id) : websiteCustomerDir(man.id));
} else if (prospectFlag) {
  customer = { id: domain, name: domain, mode: "prospect_preview", modeLabel: "Intern prospect-vurdering", website: urlArg, consent_granted: false, consent_date: null };
  if (!saveDir) outDir = prospectDir(domain);
}

const name = customer?.name ?? domain;

// ── 1. v1-innsamling (passiv) ──
console.error(`\n[arch-v2] Analyserer ${urlArg} (passiv, read-only)…`);
const started = Date.now();
const collectResult = await collect(urlArg, { max_pages: maxPages, max_depth: maxDepth, delay_ms: delayMs });

// ── 1b. Hent hjemmeside-HTML for navn-kandidater + compliance (én ekstra GET) ──
let homeHtml = "";
let orgNrHint = null;
const nameCandidates = [];
try {
  const home = await fetch(urlArg, {
    redirect: "follow",
    headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36", accept: "text/html,application/xhtml+xml,*/*" },
    signal: AbortSignal.timeout(15000),
  });
  if (home.ok) homeHtml = await home.text();
} catch { /* best-effort */ }
if (homeHtml) {
  const og = homeHtml.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i) ?? homeHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i);
  const title = homeHtml.match(/<title[^>]*>([^<]{2,120})<\/title>/i);
  if (og?.[1]) nameCandidates.push(og[1].trim());
  if (title?.[1]) nameCandidates.push(title[1].split(/[|·•–—–-]/)[0].trim());
  const orgMatch = homeHtml.match(/\b(9\d{8}|[1-8]\d{8})\b/);
  if (orgMatch) orgNrHint = orgMatch[1];
}

// ── 2. v2-moduler (Norge først — gir Brreg-data til NAP-sjekken; resten parallelt) ──
const v2Start = Date.now();
const norP = await Promise.allSettled([collectNorge({ domain, nameCandidates, orgNr: orgNrHint })]);
const norgeResult = norP[0];
const brregUnit = norgeResult.status === "fulfilled" ? (norgeResult.value?.raw?.brreg?.unit ?? norgeResult.value?.raw?.brreg ?? null) : null;

const [secR, dnsR, wayR, compR, psiR, presR, aiR, aivR] = await Promise.allSettled([
  collectSecurity(urlArg, { checkExposedFiles }),
  collectDnsEmail(domain),
  collectWayback(regDomain),
  collectCompliance(urlArg, { html: homeHtml || undefined }),
  collectPageSpeed(urlArg),
  collectPresence(urlArg, { html: homeHtml || undefined, brreg: brregUnit, nameCandidates }),
  collectAiAnalysis(urlArg, { html: homeHtml || undefined }),
  collectAiVisibility(urlArg, { html: homeHtml || undefined, brandCandidates: nameCandidates, registrableDomain: regDomain }),
]);
const v2Ms = Date.now() - v2Start;

const sections = [];
for (const [label, res] of [["security", secR], ["dns-email", dnsR], ["norge", norgeResult], ["wayback", wayR], ["compliance", compR], ["pagespeed", psiR], ["presence", presR], ["ai_analysis", aiR], ["ai_visibility", aivR]]) {
  if (res.status === "fulfilled" && res.value) sections.push(res.value);
  else {
    const why = res.status === "rejected" ? String(res.reason?.message ?? res.reason).split("\n")[0] : "tomt resultat";
    sections.push({
      section: label,
      title: `Modul ${label}`,
      checks: [{ id: `${label}_error`, label: `Modul ${label} feilet`, dimension: "reliability", result: "UNKNOWN", evidence: `feil: ${why}`, confidence: "medium", source: "v2_runner", observed_at: new Date().toISOString() }],
      raw: { error: why },
    });
  }
}

// ── 3. Merge checks → felles score (v2-score inkluderer de nye dimensjonene) ──
const mergedChecks = [...(collectResult.checks ?? []), ...sections.flatMap((s) => s.checks ?? [])];
collectResult.checks = mergedChecks;

// ── 4. Browser (valgfri — AV som default i v2) ──
let browserEvidence = null;
if (useBrowser) {
  const browserDir = outDir ? join(outDir, "browser-evidence") : join(tmpdir(), `arch-web-v2-${domain}`);
  browserEvidence = collectBrowser(urlArg, browserDir);
}

// ── 5. Score + funn ──
const score = scoreWeb(collectResult);
const findings = buildWebFindings(collectResult, score, browserEvidence);

// ── 6. Audit-objekt ──
const audit = {
  meta: {
    generated: new Date().toISOString(),
    version: "2.0",
    name,
    website: urlArg,
    domain,
    registrable_domain: regDomain,
    mode: "website",
    design_partner: customer?.mode === "design_partner" || designPartner,
    audit_duration_ms: Date.now() - started,
    v2_modules_ms: v2Ms,
  },
  customer,
  score,
  findings,
  browser: browserEvidence ?? { available: false },
  web: collectResult,
  v2: { sections },
  automation: score.automation,
  quick_wins: [],
  build_opportunities: [],
  human_approvals: [],
};
audit.executive_summary = execSummary(audit);

// ── 7. Output ──
const customerReport = renderWebCustomer(audit) + "\n\n" + renderV2Sections(audit);
if (asJson) {
  console.log(JSON.stringify(audit, null, 2));
} else if (asTechnical) {
  console.log(renderWebTechnical(audit) + "\n\n" + renderV2Technical(audit));
} else {
  console.log(customerReport);
}

if (outDir) {
  mkdirSync(outDir, { recursive: true });
  const base = join(outDir, `website-audit-v2-${domain}`);
  writeFileSync(`${base}.md`, customerReport);
  writeFileSync(`${base}.technical.md`, renderWebTechnical(audit) + "\n\n" + renderV2Technical(audit));
  writeFileSync(`${base}.evidence.json`, JSON.stringify(audit, null, 2));
  console.error(`\n[lagret] ${base}.md + ${base}.technical.md + ${base}.evidence.json`);
}

process.exit(0);
