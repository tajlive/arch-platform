// Rapport-generator — Arch Audit v1 (F4).
// To visninger: kundevennlig (markdown) + intern teknisk evidence (JSON).
// Grense: kunderapport viser konklusjon + anbefaling, INTERN visning viser
// rå checks med evidence/provenance/observed_at.

import { CLASS_LABEL } from "./classify.mjs";

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|");

function bySection(findings, section) {
  return findings.filter((f) => f.section === section);
}

function findingsTable(items) {
  if (!items.length) return "- (ingen)\n";
  return items.map((f) =>
    `| ${f.id} | **${esc(f.title)}** | ${esc(CLASS_LABEL[f.class])} | ${esc(f.evidence ?? "")} |`
  ).join("\n");
}

function severityIcon(s) {
  return s === "critical" ? "🔴" : s === "high" ? "🟠" : s === "medium" ? "🟡" : "🟢";
}

export function renderCustomer(audit) {
  const m = audit.meta;
  const h = audit.health;
  const L = [];
  L.push(`# Arch Audit — ${esc(m.name ?? m.target)}\n`);
  L.push(`> **Generert:** ${m.generated} · **Arch Audit v${m.version}** · **Commit:** \`${m.commit ?? "—"}\`\n`);
  L.push(`> **Klassifikasjon:** 🟢 automatisk funn · 🟡 inferert anbefaling · 🔴 krever menneskelig beslutning\n`);

  // 1. Executive Summary
  L.push(`## 1. Executive Summary\n\n${audit.executive_summary}\n`);

  // 2. Arch Health Score
  L.push(`## 2. Arch Health Score\n`);
  L.push(`**Total: ${h.total}%** (vektet: Governance 20 · Security 25 · Engineering 25 · Operations 20 · Documentation 10)\n`);
  L.push(`| Kategori | Score | Pass/Fail/Unknown |`);
  L.push(`|---|---|---|`);
  for (const [name, c] of Object.entries(h.categories)) {
    const denom = (c.pass ?? 0) + (c.fail ?? 0) + (c.unknown ?? 0);
    L.push(`| ${name} | ${denom === 0 ? "N/A" : `${c.pct}%`} | ${c.pass}P / ${c.fail}F / ${c.unknown}U |`);
  }
  L.push(`\n> Health Score er evidensbasert: hver sjekk bærer \`evidence\` + \`observed_at\`. UNKNOWN telles som ikke-healthy (fail-safe).`);
  if (h.arch_managed === false) {
    L.push(`\n> **Eksternt prosjekt:** Arch-governance-sjekker (\`.arch/*\`) er N/A og ekskluderes — totalscoren baseres på generiske helsesjekker (CI, tester, docs, secrets-gitignore, monitoring).\n`);
  }

  // 3. Security & Secret Governance
  L.push(`## 3. Security & Secret Governance\n`);
  const s = audit.security;
  L.push(`| Sjekk | Resultat | Bevis |`);
  L.push(`|---|---|---|`);
  L.push(`| Secret-scan | ${s.secrets.status === "clean" ? "✅ clean" : `🔴 ${s.secrets.findings} lekkasje(r)`} | ${s.secrets.files_scanned} filer scannet, ${s.secrets.findings} lekkasje, ${s.secrets.gitignored_notes} gitignoret note |`);
  L.push(`| Secret-governance (.arch/secrets) | ${s.secret_governance === "observed" ? "✅ tilstede" : "🟡 mangler"} | ${s.secret_governance === "observed" ? ".arch/secrets/registry.yaml" : "ingen .arch/secrets/registry.yaml"} |`);
  if (s.secrets.details?.length) {
    L.push(`\n<details><summary>Funn (fil:linje — aldri verdier)</summary>\n`);
    L.push(`\`\`\`\n${s.secrets.details.map((d) => `[${d.severity}] ${d.file}:${d.line} — ${d.pattern}`).join("\n")}\n\`\`\`\n</details>\n`);
  }
  L.push(`> ⚠️ «0 funn» = ingen matchende secret-mønster i scannet filsett. Det er IKKE en sikkerhetssertifisering. Juridisk/regulatorisk status (GDPR m.fl.) krever egen kvalifisert vurdering (se §12).\n`);

  // 4. Architecture Review
  L.push(`## 4. Architecture Review\n`);
  const st = audit.stack;
  L.push(`| Aspekt | Observert |`);
  L.push(`|---|---|`);
  L.push(`| Rammeverk | ${esc(st.framework)} |`);
  L.push(`| Språk | ${esc(st.language)} |`);
  L.push(`| Package manager | ${esc(st.package_manager)} |`);
  L.push(`| Test-runner | ${esc(st.test_runner)} |`);
  L.push(`| Runtime | ${esc(st.runtime_hint)} |`);
  L.push(`| Cloudflare | ${st.cloudflare.length ? st.cloudflare.join(", ") : "—"} |`);
  L.push(`| Supabase | ${st.supabase.length ? st.supabase.join(", ") : "—"} |`);
  L.push(`\n${findingsTable(bySection(audit.findings, "architecture"))}\n`);

  // 5. CI/CD & Engineering Quality
  L.push(`## 5. CI/CD & Engineering Quality\n`);
  const ci = audit.ci_cd;
  L.push(`| Sjekk | Resultat | Bevis |`);
  L.push(`|---|---|---|`);
  L.push(`| CI-workflows | ${ci.workflows.length ? ci.workflows.join(", ") : "ingen"} | ${ci.workflows.length ? "tilstede" : "mangler"} |`);
  L.push(`| Verktøykjede-match | ${ci.mismatches.length ? `🔴 ${ci.mismatches.length} mismatch` : "✅ matcher"} | ${ci.mismatches.length ? esc(ci.mismatches.join("; ")) : "workflow-verktøy finnes i repo"} |`);
  if (ci.last_run) {
    L.push(`| Siste CI-run | ${esc(ci.last_run.conclusion ?? "—")} | ${esc(ci.last_run.head_sha?.slice(0, 7) ?? "—")} · ${esc(ci.last_run.created_at ?? "—")} |`);
  }
  L.push(`\n${findingsTable(bySection(audit.findings, "ci_cd"))}\n`);

  // 6. Operations & Monitoring
  L.push(`## 6. Operations & Monitoring\n`);
  const op = audit.operations;
  L.push(`| Sjekk | Resultat |`);
  L.push(`|---|---|`);
  L.push(`| Monitoring | ${op.monitoring ? "✅" : "🟡 mangler"} |`);
  L.push(`| Alert-integrasjon | ${op.alerts ? "✅" : "🟡 mangler"} |`);
  L.push(`| Rollback | ${op.rollback ? "✅" : "🟡 mangler"} |`);
  L.push(`\n${findingsTable(bySection(audit.findings, "operations"))}\n`);

  // 7. AI/automation opportunities
  L.push(`## 7. AI / automasjonsmuligheter\n`);
  const ai = bySection(audit.findings, "ai_automation");
  L.push(findingsTable(ai) + "\n");

  // 8. Technical debt / risks
  L.push(`## 8. Teknisk gjeld / risiko\n`);
  const debt = bySection(audit.findings, "tech_debt");
  L.push(findingsTable(debt) + "\n");

  // 9. Prioritized recommendations
  L.push(`## 9. Prioriterte anbefalinger\n`);
  const recs = [...audit.findings].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99)).slice(0, 20);
  L.push(`| Prio | Tittel | Klasse | Bevis |`);
  L.push(`|---|---|---|---|`);
  if (!recs.length) L.push(`| — | (ingen) | — | — |`);
  for (const r of recs) L.push(`| P${r.priority ?? "?"} | **${esc(r.title)}** | ${esc(CLASS_LABEL[r.class])} | ${esc(r.evidence ?? "")} |`);
  L.push(`\n`);

  // 10. Quick wins
  L.push(`## 10. Quick wins\n`);
  if (!audit.quick_wins.length) L.push("- (ingen identifisert)\n");
  for (const q of audit.quick_wins) L.push(`- **${esc(q.title)}** — innsats: ${esc(q.effort)} · effekt: ${esc(q.impact)} · [${esc(CLASS_LABEL[q.class])}]`);
  L.push(`\n`);

  // 11. Estimated Build opportunities
  L.push(`## 11. Estimerte Build-muligheter\n`);
  L.push(`| Mulighet | Verdi-estimat | Innsats | Klasse |`);
  L.push(`|---|---|---|---|`);
  if (!audit.build_opportunities.length) L.push(`| — | — | — | — |`);
  for (const b of audit.build_opportunities) L.push(`| **${esc(b.title)}** | ${esc(b.estimated_value)} | ${esc(b.effort)} | ${esc(CLASS_LABEL[b.class])} |`);
  L.push(`\n> Verdi-estimat er en vurdering, ikke et løfte. Endelig pris/scope fastsettes i Architecture Proposal + godkjenning.\n`);

  // 12. Human-approval requirements
  L.push(`## 12. Krav til menneskelig godkjenning\n`);
  L.push(`| Beslutning | Hvorfor menneskelig |`);
  L.push(`|---|---|`);
  if (!audit.human_approvals.length) L.push(`| — | — |`);
  for (const ha of audit.human_approvals) L.push(`| **${esc(ha.title)}** | ${esc(ha.why)} |`);
  L.push(`\n---\n_Arch Audit er en evidensbasert vurdering, ikke en sertifisering. Ingen sikkerhets-, juridiske eller regulatoriske påstander uten dokumentert grunnlag._\n`);

  return L.join("\n");
}

export function renderEvidence(audit) {
  return JSON.stringify(audit, null, 2);
}
