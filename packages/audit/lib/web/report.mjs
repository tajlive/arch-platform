// Web-rapport-renderer — Arch Website Audit v1 (F4.2B).
//
// To kundevendte visninger + intern evidence (som repo-audit):
//   renderWebCustomer  — executive (daglig leder, <5 min)
//   renderWebTechnical — teknisk appendix (utvikler/byrå/IT-leverandør)
// Gjenbruker: stampWebsiteScope (consent/scope), buildActions/groupByBucket (bøtter),
// renderBuildProposal (Build Proposal-utkast).

import { buildActions, groupByBucket, BUCKET_LABEL } from "../commercial.mjs";
import { renderBuildProposal } from "../build-proposal.mjs";
import { stampWebsiteScope } from "../customer.mjs";

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|");

function tone(pct) {
  if (pct === null || pct === undefined) return "⚪";
  if (pct >= 80) return "🟢";
  if (pct >= 50) return "🟠";
  return "🔴";
}
function bar(pct) {
  if (pct === null || pct === undefined) return "N/A";
  const filled = Math.round(pct / 10);
  return "█".repeat(filled) + "░".repeat(10 - filled) + ` ${pct}%`;
}

export function renderWebScorecard(score) {
  const L = [];
  L.push(`## Website Scorecard\n`);
  L.push(`**Total: ${score.total}%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)\n`);
  L.push(`| Dimensjon | Score |`); L.push(`|---|---|`);
  for (const dim of ["performance", "security", "ux_mobile", "accessibility", "seo", "reliability", "trust_privacy", "automation"]) {
    const c = score.categories[dim];
    const label = score.labels[dim];
    const pct = dim === "automation" ? c.potential : c.pct;
    L.push(`| ${tone(dim === "automation" ? c.leverage : pct)} ${label} | ${bar(pct)} |`);
  }
  L.push(``);
  L.push(`> **Slik leser du dette:** høyere = bedre, bortsett fra **Automation Potential**`);
  L.push(`> som viser uutnyttet automatiseringsverdi (høy = mer å hente, verdien Arch kan levere).`);
  L.push(`> Score er en evidensbasert vurdering, **ikke** en sertifisering. UNKNOWN telles som ikke-verifisert.\n`);
  return L.join("\n");
}

export function execSummary(audit) {
  const score = audit.score;
  const actions = buildActions(audit);
  const buckets = groupByBucket(actions);
  const crit = (buckets.Critical ?? []).length;
  const high = (buckets["High ROI"] ?? []).length;
  const auto = score.automation;
  const biggestRisk = crit ? (buckets.Critical[0]?.title ?? "kritiske funn") : (high ? (buckets["High ROI"][0]?.title ?? "høyprioriterte funn") : "ingen kritiske funn observert");
  const parts = [
    `${audit.meta.name} sin offentlige nettside scorer **${score.total}%** på Arch Website Score.`,
    `Den største risikoen er: **${biggestRisk}**.`,
    `${crit + high ? `**${crit + high} funn** bør prioriteres (${crit} kritisk, ${high} høy ROI).` : "Ingen kritiske funn observert utenfra."}`,
    `Største mulighet: **${auto.potential}% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging).`,
    `Forretningsmessig betyr dette: ${crit ? "konkret risiko som bør lukkes raskt, og " : ""}målbar gevinst i hastighet, konvertering og frigjort tid.`,
    `Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.`,
  ];
  return parts.join(" ");
}

export function renderWebCustomer(audit) {
  const m = audit.meta;
  const actions = buildActions(audit);
  const buckets = groupByBucket(actions);
  const L = [];

  L.push(`# Arch Website Audit — ${esc(m.name ?? m.domain)}\n`);
  L.push(`| | |`); L.push(`|---|---|`);
  L.push(`| Kunde | ${esc(m.name ?? "—")} |`);
  L.push(`| Nettsted | ${esc(m.website)} |`);
  L.push(`| Audit-dato | ${m.generated} |`);
  L.push(`| Scope | Offentlig nettside (kun) |`);
  L.push(`| Tilgang | Read-only / uautentisert |`);
  L.push(`| Repository-tilgang | Ikke gitt |`);
  L.push(`| Endringer utført | Ingen |\n`);

  if (audit.customer) L.push(stampWebsiteScope(audit.customer, audit.customer.modeLabel));

  L.push(`## Executive Summary\n\n${audit.executive_summary}\n`);

  L.push(renderWebScorecard(audit.score));

  L.push(`## Toppfunn (prioritert)\n`);
  for (const bucket of ["Critical", "High ROI", "Quick Win", "Strategic"]) {
    const items = buckets[bucket] ?? [];
    L.push(`### ${BUCKET_LABEL[bucket]}\n`);
    if (!items.length) { L.push(`- *(ingen funn i denne kategorien)*\n`); continue; }
    for (const a of items) {
      L.push(`**${esc(a.title ?? a.problem)}**`);
      L.push(`- **Problem:** ${esc(a.title ?? a.problem)}`);
      L.push(`- **Forretningsmessig betydning:** ${esc(a.business_impact ?? "—")}`);
      L.push(`- **Anbefalt løsning:** ${esc(a.solution ?? "—")}`);
      L.push(`- **Forventet innsats:** ${esc(a.effort_label ?? a.effort ?? "—")}`);
      L.push(`- **Build-kandidat:** ${a.build_candidate ? "✅ ja" : "— (menneskelig/lavkode)"}`);
      L.push(``);
    }
  }

  L.push(`## Hva Arch kan forbedre (prioritert)\n`);
  const buildCandidates = actions.filter((a) => a.build_candidate);
  if (!buildCandidates.length) L.push(`- *(ingen automatiserbare/utviklingsbare tiltak identifisert)*\n`);
  buildCandidates.slice(0, 8).forEach((a, i) => L.push(`${i + 1}. ${esc(a.title)} — ${esc(a.effort_label ?? a.effort ?? "")}`));
  L.push(``);

  L.push(renderBuildProposal(audit, actions));

  L.push(`## Evidence Boundary — hva som IKKE ble inspisert\n`);
  L.push(`Fordi repository-/intern tilgang ikke ble gitt, er følgende **UNKNOWN** (ikke vurdert):\n`);
  L.push(`- Repository-sikkerhet, CI/CD, testdekning, intern secret-håndtering`);
  L.push(`- Database-arkitektur, interne rettigheter/roller, backend-logikk`);
  L.push(`- Ekte Core Web Vitals (LCP/CLS) uten browser-måling, dyp WCAG/konstrast-audit`);
  L.push(`- Juridisk/regulatorisk samsvar (GDPR m.fl.) — krever kvalifisert gjennomgang\n`);

  L.push(`---`);
  L.push(`_Arch Website Audit er en evidensbasert utenfor-inn vurdering, ikke en sertifisering. `);
  L.push(`Ingen endringer ble gjort, ingen mutasjoner, ingen skjemainnsending, ingen login-bypass. `);
  L.push(`Juridiske/regulatoriske påstander er ikke vurdert — kun signaler, som krever kvalifisert gjennomgang._\n`);
  return L.join("\n");
}

export function renderWebTechnical(audit) {
  const m = audit.meta;
  const web = audit.web;
  const raw = web.raw ?? {};
  const L = [];
  L.push(`# Teknisk appendix — Arch Website Audit ${esc(m.name ?? m.domain)}\n`);
  L.push(`> **Generert:** ${m.generated} · **Nettsted:** ${m.website} · **Endelig URL:** ${m.final_url ?? m.website}\n`);
  L.push(`> For utvikler/byrå/IT-leverandør. Executive-rapporten er ${`website-audit-${m.domain}.md`}.\n`);

  L.push(`## 1. Per-sjekk (evidence + confidence)\n`);
  L.push(`| Dimensjon | Sjekk | Resultat | Evidence | Confidence |`); L.push(`|---|---|---|---|---|`);
  for (const ch of web.checks ?? []) {
    L.push(`| ${ch.dimension} | ${esc(ch.label)} | ${ch.result} | ${esc(ch.evidence)} | ${ch.confidence} |`);
  }
  L.push(``);

  L.push(`## 2. HTTP & redirect-kjede\n`);
  const home = raw.home ?? {};
  L.push(`- Status: ${home.status ?? "?"} ${home.status_text ?? ""}`);
  L.push(`- Endelig URL: ${home.final_url ?? "—"}`);
  L.push(`- Redirects: ${(home.redirects ?? []).map((r) => `${r.status} ${r.from} → ${r.to}`).join("; ") || "ingen"}`);
  L.push(`- HTTPS: ${raw.https?.detail ?? "—"}`);
  L.push(`- Compression: ${raw.compression ?? "—"} · Cache: ${raw.caching ?? "—"}\n`);

  L.push(`## 3. Sikkerhets-headere (offentlig observerbare)\n`);
  const sh = raw.security_headers ?? {};
  L.push(`| Header | Verdi |`); L.push(`|---|---|`);
  for (const [k, v] of Object.entries(sh)) L.push(`| ${k} | ${v ?? "— mangler"} |`);
  L.push(`- Blandet innhold: ${raw.mixed_content ?? 0} http-referanser`);
  L.push(`- Source maps eksponert: ${raw.source_maps === null ? "UNKNOWN" : raw.source_maps ? "JA" : "nei"}`);
  L.push(`- Versjons-avsløring: ${[raw.tech_disclosure?.server, raw.tech_disclosure?.x_powered_by].filter(Boolean).join(", ") || "ingen"}\n`);

  L.push(`## 4. Crawl-resultat\n`);
  const crawl = raw.crawl ?? {};
  L.push(`- Sider sjekket: ${crawl.pages_checked ?? 0} · Vellykket: ${crawl.crawled ?? 0}`);
  L.push(`- Ødelagte interne lenker: ${(crawl.broken ?? []).length}`);
  if ((crawl.broken ?? []).length) L.push(`  ${crawl.broken.map((b) => `${b.url} → ${b.status}`).join(", ")}`);
  L.push(`- Ressurs-feil: ${raw.asset_failures?.failed ?? 0}/${raw.asset_failures?.checked ?? 0}\n`);

  L.push(`## 5. Teknologi-overflate (confidence merket)\n`);
  const tech = raw.technology ?? {};
  L.push(`- Framework: ${tech.framework ?? "ikke gjenkjent"} · CMS: ${tech.cms ?? "—"} · CDN: ${tech.cdn ?? "—"} · Hosting: ${tech.hosting ?? "—"}`);
  L.push(`- Analytics/trackere: ${(raw.analytics ?? []).join(", ") || "ingen kjente observert"}`);
  L.push(`- Tredjeparts-domener: ${(raw.third_party ?? []).join(", ") || "ingen"}\n`);

  L.push(`## 6. SEO / Meta / Struktur\n`);
  L.push(`- Tittel: ${raw.title ?? "—"} · Meta-beskrivelse: ${raw.meta_description ?? "—"}`);
  L.push(`- Canonical: ${raw.canonical ?? "—"} · robots.txt: ${raw.robots?.present ? "ja" : "nei"} · Sitemap: ${raw.sitemap ? `${raw.sitemap.urls} URL-er` : "nei"}`);
  L.push(`- OpenGraph: ${JSON.stringify(raw.open_graph ?? {})} · JSON-LD: ${raw.structured_data ? "ja" : "nei"}`);
  L.push(`- Headings: ${JSON.stringify(raw.headings ?? {})} · Lang: ${raw.lang ?? "—"}\n`);

  L.push(`## 7. Browser-evidence\n`);
  const be = audit.browser ?? {};
  if (!be?.available) L.push(`- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).`);
  else {
    L.push(`- Rendered DOM: ${be.rendered?.length ?? be.rendered?.error ?? "—"} tegn`);
    L.push(`- Skjermbilder: ${(be.screenshots ?? []).join(", ") || "ingen"}`);
    L.push(`- Console-feil: ${(be.console_errors ?? []).length}`);
    L.push(`- Failed requests: ${(be.failed_requests ?? []).length}`);
    if (be.performance) L.push(`- Performance: ${JSON.stringify(be.performance)}`);
  }
  L.push(``);

  L.push(`## 8. Automatiserings-signaler\n`);
  L.push(`- ${JSON.stringify(raw.automation_signals ?? {})}`);
  L.push(`- Uutnyttet potensial: ${audit.score.automation.potential}% (${audit.score.automation.present}/${audit.score.automation.total} signaler utnyttet)\n`);

  L.push(`---`);
  L.push(`_Rå maskinlesbar evidence: ${`website-audit-${m.domain}.evidence.json`}. Hver sjekk bærer provenance (source, observed_at, confidence, status)._`);
  return L.join("\n");
}
