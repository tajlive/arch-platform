// Rapport-generator — Arch Audit v1 (F4.1).
//
// TRE visninger:
//   1. renderCustomer  — kundevennlig (daglig leder): exec summary, scorecard,
//                        prioriterte funn (4 bøtter, 5 felt), Build Proposal-utkast.
//   2. renderTechnical — teknisk appendix (utviklingsteam): full evidence/provenance.
//   3. renderEvidence  — intern rå JSON (maskinlesbar).
//
// Grense: kunderapport = konklusjon + anbefaling (ikke-teknisk); appendix = rå checks.

import { CLASS_LABEL } from "./classify.mjs";
import { buildActions, groupByBucket, BUCKET_LABEL } from "./commercial.mjs";
import { renderScorecard } from "./scorecard.mjs";
import { renderBuildProposal } from "./build-proposal.mjs";
import { stampScope } from "./customer.mjs";

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|");
const bySection = (findings, section) => findings.filter((f) => f.section === section);

// ─────────────────────────────────────────────────────────────────────────────
// 1. Kundevennlig rapport (daglig leder)
// ─────────────────────────────────────────────────────────────────────────────
export function renderCustomer(audit) {
  const m = audit.meta;
  const actions = buildActions(audit);
  const buckets = groupByBucket(actions);
  const L = [];

  L.push(`# Arch Audit — ${esc(m.name ?? m.target)}\n`);
  L.push(`> **Generert:** ${m.generated} · **Arch Audit v${m.version}** · **Commit:** \`${m.commit ?? "—"}\`\n`);
  if (audit.customer) L.push(stampScope(audit.customer, audit.customer.modeLabel));
  L.push(`> **Slik leser du rapporten:** 🟢 automatisk funn · 🟡 inferert anbefaling · 🔴 krever menneskelig beslutning\n`);

  // 1. Executive summary
  L.push(`## 1. Sammendrag (executive summary)\n\n${audit.executive_summary}\n`);

  // 2. Executive scorecard (6 dimensjoner)
  L.push(renderScorecard(audit));

  // 3. Prioriterte funn
  L.push(`## 2. Prioriterte funn og anbefalte tiltak\n`);
  for (const bucket of ["Critical", "High ROI", "Quick Win", "Strategic"]) {
    L.push(`### ${BUCKET_LABEL[bucket]}\n`);
    const items = buckets[bucket] ?? [];
    if (!items.length) {
      L.push(`- *(ingen funn i denne kategorien)*\n`);
      continue;
    }
    for (const a of items) {
      L.push(`**${a.id ?? ""} ${esc(a.title ?? a.problem)}**`);
      L.push(`- **Problem:** ${esc(a.title ?? a.problem)}`);
      L.push(`- **Forretningsmessig betydning:** ${esc(a.business_impact ?? "—")}`);
      L.push(`- **Anbefalt løsning:** ${esc(a.solution ?? "—")}`);
      L.push(`- **Forventet innsats:** ${esc(a.effort_label ?? a.effort ?? "—")}`);
      L.push(`- **Arch Build-kandidat:** ${a.build_candidate ? "✅ ja" : "— (menneskelig/lavkode)"}`);
      L.push(``);
    }
  }

  // 4. Build Proposal-utkast (auto)
  L.push(renderBuildProposal(audit, actions));

  // Footer
  L.push(`---`);
  L.push(`_Arch Audit er en evidensbasert vurdering, ikke en sertifisering. `);
  L.push(`Ingen endringer ble gjort i systemet under analysen. `);
  L.push(`Ingen hemmeligheter er kopiert inn i Arch. `);
  L.push(`Juridiske/regulatoriske forhold (GDPR m.fl.) er ikke vurdert — krever kvalifisert gjennomgang._\n`);
  return L.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Teknisk appendix (utviklingsteam)
// ─────────────────────────────────────────────────────────────────────────────
function findingsTable(items) {
  if (!items.length) return "- (ingen)\n";
  return items.map((f) => `| ${f.id} | **${esc(f.title)}** | ${esc(CLASS_LABEL[f.class])} | ${esc(f.evidence ?? "")} |`).join("\n");
}

export function renderTechnical(audit) {
  const m = audit.meta;
  const h = audit.health;
  const L = [];
  L.push(`# Teknisk appendix — Arch Audit ${esc(m.name ?? m.target)}\n`);
  L.push(`> **Generert:** ${m.generated} · **Commit:** \`${m.commit ?? "—"}\` · **Repo:** \`${m.repo ?? "—"}\`\n`);
  L.push(`> Dette dokumentet er for utviklingsteamet. Kunderapporten (${`audit-${m.name}.md`}) er den ikke-tekniske visningen.\n`);

  // Health Score detalj
  L.push(`## 1. Arch Health Score (detalj)\n`);
  L.push(`**Total: ${h.total}%** (vektet: Governance 20 · Security 25 · Engineering 25 · Operations 20 · Documentation 10)\n`);
  L.push(`| Kategori | Score | Pass/Fail/Unknown |`); L.push(`|---|---|---|`);
  for (const [name, c] of Object.entries(h.categories ?? {})) {
    const denom = (c.pass ?? 0) + (c.fail ?? 0) + (c.unknown ?? 0);
    L.push(`| ${name} | ${denom === 0 ? "N/A" : `${c.pct}%`} | ${c.pass}P / ${c.fail}F / ${c.unknown}U |`);
  }
  L.push(``);
  L.push(`<details><summary>Per-sjekk (evidence + observed_at)</summary>\n`);
  for (const [name, c] of Object.entries(h.categories ?? {})) {
    L.push(`**${name}**`);
    for (const ch of c.checks ?? []) {
      L.push(`- [${ch.result}] ${ch.label} — ${esc(ch.evidence ?? "")}`);
    }
    L.push(``);
  }
  L.push(`</details>\n`);
  if (h.arch_managed === false) L.push(`> **Eksternt prosjekt:** Arch-governance-sjekker (\`.arch/*\`) er N/A og ekskluderes.\n`);

  // Architecture review
  L.push(`## 2. Arkitektur & stack\n`);
  const st = audit.stack ?? {};
  L.push(`| Aspekt | Observert |`); L.push(`|---|---|`);
  L.push(`| Rammeverk | ${esc(st.framework)} |`);
  L.push(`| Språk | ${esc(st.language)} |`);
  L.push(`| Package manager | ${esc(st.package_manager)} |`);
  L.push(`| Test-runner | ${esc(st.test_runner)} |`);
  L.push(`| Runtime | ${esc(st.runtime_hint)} |`);
  L.push(`| Cloudflare | ${st.cloudflare?.length ? st.cloudflare.join(", ") : "—"} |`);
  L.push(`| Supabase | ${st.supabase?.length ? st.supabase.join(", ") : "—"} |`);
  L.push(`\n${findingsTable(bySection(audit.findings, "architecture"))}\n`);

  // Security
  L.push(`## 3. Sikkerhet & hemmelighets-styring\n`);
  const s = audit.security ?? {};
  L.push(`| Sjekk | Resultat | Bevis |`); L.push(`|---|---|---|`);
  const notesTxt = `${s.secrets?.gitignored_notes ?? 0} gitignoret note${s.secrets?.fixture_notes ? `, ${s.secrets.fixture_notes} fixture/eksempel-note` : ""}`;
  L.push(`| Secret-scan | ${s.secrets?.status === "clean" ? "✅ clean" : `🔴 ${s.secrets?.findings} lekkasje(r)`} | ${s.secrets?.files_scanned} filer scannet, ${s.secrets?.findings} lekkasje, ${notesTxt} |`);
  L.push(`| Secret-governance (.arch/secrets) | ${s.secret_governance === "observed" ? "✅ tilstede" : "🟡 mangler"} | ${s.secret_governance === "observed" ? ".arch/secrets/registry.yaml" : "ingen .arch/secrets/registry.yaml"} |`);
  if (s.secrets?.details?.length) {
    L.push(`\n<details><summary>Funn (fil:linje — aldri verdier)</summary>\n`);
    L.push(`\`\`\`\n${s.secrets.details.map((d) => `[${d.severity}] ${d.file}:${d.line} — ${d.pattern}`).join("\n")}\n\`\`\`\n</details>\n`);
  }
  L.push(`> ⚠️ «0 funn» = ingen matchende secret-mønster i scannet filsett. Ikke en sikkerhetssertifisering.\n`);

  // CI/CD
  L.push(`## 4. CI/CD & engineering\n`);
  const ci = audit.ci_cd ?? {};
  L.push(`| Sjekk | Resultat | Bevis |`); L.push(`|---|---|---|`);
  L.push(`| CI-workflows | ${ci.workflows?.length ? ci.workflows.join(", ") : "ingen"} | ${ci.workflows?.length ? "tilstede" : "mangler"} |`);
  L.push(`| Verktøykjede-match | ${ci.mismatches?.length ? `🔴 ${ci.mismatches.length} mismatch` : "✅ matcher"} | ${ci.mismatches?.length ? esc(ci.mismatches.join("; ")) : "workflow-verktøy finnes i repo"} |`);
  if (ci.last_run) L.push(`| Siste CI-run | ${esc(ci.last_run.conclusion ?? "—")} | ${esc(ci.last_run.head_sha?.slice(0, 7) ?? "—")} · ${esc(ci.last_run.created_at ?? "—")} |`);
  L.push(`\n${findingsTable(bySection(audit.findings, "ci_cd"))}\n`);

  // Operations
  L.push(`## 5. Drift & overvåking\n`);
  const op = audit.operations ?? {};
  L.push(`| Sjekk | Resultat |`); L.push(`|---|---|`);
  L.push(`| Monitoring | ${op.monitoring ? "✅" : "🟡 mangler"} |`);
  L.push(`| Alert-integrasjon | ${op.alerts ? "✅" : "🟡 mangler"} |`);
  L.push(`| Rollback | ${op.rollback ? "✅" : "🟡 mangler"} |`);
  L.push(`| Deploy-pipeline | ${op.deploy_pipeline ? "✅" : "🟡 mangler"} |`);
  L.push(`\n${findingsTable(bySection(audit.findings, "operations"))}\n`);

  // Documentation
  L.push(`## 6. Dokumentasjon\n`);
  const d = audit.documentation ?? {};
  L.push(`| Sjekk | Resultat |`); L.push(`|---|---|`);
  L.push(`| README | ${d.readme ? "✅" : "🟡 mangler"} |`);
  L.push(`| ARCHITECT | ${d.architect ? "✅" : "🟡 mangler"} |`);
  L.push(`| API-dokumentasjon | ${d.api_docs ? "✅" : "🟡 mangler"} |`);
  L.push(`| Beslutningslogg | ${d.decisions ? "✅" : "🟡 mangler"} |`);

  // Full funn-liste (inkl. info-kinds)
  L.push(`## 7. Komplett funn-liste (med klasse + evidence)\n`);
  L.push(`| ID | Funn | Klasse | Evidence |`); L.push(`|---|---|---|---|`);
  if (!audit.findings?.length) L.push(`| — | (ingen) | — | — |`);
  for (const f of audit.findings ?? []) {
    L.push(`| ${f.id} | **${esc(f.title)}** | ${esc(CLASS_LABEL[f.class])} | ${esc(f.evidence ?? "")} |`);
  }
  L.push(`\n---\n_Evidensgrunnlag: hver sjekk bærer \`evidence\` + \`observed_at\`. Rå maskinlesbar JSON: \`${`audit-${m.name}.evidence.json`}\`._\n`);
  return L.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Intern rå JSON
// ─────────────────────────────────────────────────────────────────────────────
export function renderEvidence(audit) {
  return JSON.stringify(audit, null, 2);
}
