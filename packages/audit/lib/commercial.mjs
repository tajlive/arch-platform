// Kommersielt lag — Arch Audit v1 (F4.1).
//
// Oversetter maskinfunn (automatic/inferred/human_approval) til et salgbart format:
//   1. Prioriterings-bøtter: Critical · High ROI · Quick Win · Strategic
//   2. Per tiltak: problem, business impact, anbefalt løsning, forventet innsats,
//      Arch Build candidate (yes/no)
//   3. Automation Potential — hvor mye uutnyttet automatiseringsverdi Arch kan levere.
//
// Alt er deterministisk (regelbasert), aldri fabrikkert: business impact og innsats
// er malbaserte vurderinger knyttet til en dokumentert funn-type (kind), ikke fri tekst.

import { WEB_KINDS } from "./web/kinds.mjs";

export const BUCKETS = Object.freeze(["Critical", "High ROI", "Quick Win", "Strategic"]);

export const BUCKET_LABEL = Object.freeze({
  Critical: "🔴 Kritisk — må håndteres først",
  "High ROI": "🟠 Høy ROI — størst verdi per innsats",
  "Quick Win": "🟢 Quick win — gjør det denne uka",
  Strategic: "🔵 Strategisk — planlegg neste kvartal",
});

// Effort-skala (forventet innsats, vurdering — ikke et løfte)
export const EFFORT = Object.freeze({
  S: "Lav (timer)",
  M: "Middels (1–3 dager)",
  L: "Betydelig (1–2 uker)",
  XL: "Stor (prosjekt)",
});

// Hver funn-type (kind) → kommersiell framing.
// `impact` er skrevet for en daglig leder uten teknisk bakgrunn.
const KIND_META = {
  secret_leak: {
    bucket: "Critical",
    impact: "Hemmeligheter (API-nøkler, passord, tokens) ligger åpent i koden. Alle med tilgang til koden — eller en fremtidig lekkasje — kan misbruke tjenestene deres. Dette er direkte økonomisk og omdømmemessig risiko.",
    solution: "Rotér alle eksponerte hemmeligheter umiddelbart, fjern dem fra versjonshistorikken, og innfør sentral hemmelighets-styring.",
    effort: "S",
    build_candidate: true,
  },
  secret_rotate_human: {
    bucket: "Critical",
    impact: "Kredentialer må roteres, men kun eieren har konsoll-tilgang — dette kan ikke automatiseres av Arch.",
    solution: "Rotér nøklene manuelt i respektive tjenestekonsoller (dashboard/API).",
    effort: "S",
    build_candidate: false,
  },
  secret_governance: {
    bucket: "High ROI",
    impact: "Uten sentral styring av hemmeligheter vil nye nøkler igjen havne i kode — problemet gjentar seg.",
    solution: "Etablér .arch/secrets (registry + allowlist) og en CI-scanner som blokkerer nye lekkasjer.",
    effort: "M",
    build_candidate: true,
  },
  ci_mismatch: {
    bucket: "Critical",
    impact: "CI-en gir falskt grønt eller rødt lys: endringer kan nå produksjon uten at kvalitetsportene faktisk kjører — eller bli blokkert av verktøy som ikke finnes.",
    solution: "Korriger workflowen til de faktiske verktøyene (eller fjern falske gater).",
    effort: "S",
    build_candidate: true,
  },
  ci_missing: {
    bucket: "High ROI",
    impact: "Ingen automatisk kvalitetsport før endringer når produksjon — feil slippes ut til kunder.",
    solution: "Etablér CI med test-gate (test → deploy → smoke).",
    effort: "M",
    build_candidate: true,
  },
  monitoring_missing: {
    bucket: "High ROI",
    impact: "Dere oppdager ikke feil før kundene deres gjør det — nedetid og støttebelastning.",
    solution: "Automatisk monitorering + syntetisk røyk-test som varsler ved avvik.",
    effort: "M",
    build_candidate: true,
  },
  alerts_missing: {
    bucket: "High ROI",
    impact: "Når noe feiler, får ingen beskjed — nedetiden forlenges i stedet for å kortes.",
    solution: "Alert-ruting til eier (Slack/e-post) med klare eskaleringsregler.",
    effort: "S",
    build_candidate: true,
  },
  rollback_missing: {
    bucket: "High ROI",
    impact: "En dårlig deploy kan ikke rulles tilbake automatisk — hver feil betyr lengre nedetid.",
    solution: "Legg til rollback-steg i deploy-workflowen (eller re-deploy av forrige versjon).",
    effort: "S",
    build_candidate: true,
  },
  test_runner_missing: {
    bucket: "High ROI",
    impact: "Ingen automatiserte tester — regresjoner oppdages manuelt, ofte etter at kunden har sett dem.",
    solution: "Sett opp test-runner + røyk-test som kjører i CI.",
    effort: "M",
    build_candidate: true,
  },
  ai_opportunities: {
    bucket: "Strategic",
    impact: "Flere manuelle steg kan automatiseres — dette frigjør tid og reduserer menneskelige feil.",
    solution: "Automatiser de identifiserte stegene (se detalj i teknisk appendix).",
    effort: "L",
    build_candidate: true,
  },
  legal_regulatory: {
    bucket: "Critical",
    impact: "Regulatorisk eksponering (GDPR m.fl.) kan gi bøter og ansvar. Arch vurderer IKKE dette — det krever kvalifisert juridisk gjennomgang.",
    solution: "Kvalifisert juridisk vurdering (ekstern rådgiver).",
    effort: "S",
    build_candidate: false,
  },
  // Quick wins (direkte oversettelser)
  qw_rollback: {
    bucket: "Quick Win",
    impact: "Rask trygghet: muligheten til å rulle tilbake en dårlig endring på sekunder.",
    solution: "Legg til rollback i deploy-workflowen.",
    effort: "S",
    build_candidate: true,
  },
  qw_ci_gates: {
    bucket: "Quick Win",
    impact: "Fjern falske kvalitetsport-sjekker som i dag bare lager støy (eller gir falsk trygghet).",
    solution: "Fjern/korriger CI-gater som refererer verktøy som ikke finnes.",
    effort: "S",
    build_candidate: true,
  },
  qw_architect: {
    bucket: "Quick Win",
    impact: "Et arkitektur-overblikk gjør nye folk produktive raskere og reduserer feilbeslutninger.",
    solution: "Skriv ARCHITECT.md (arkitektur-overblikk på én side).",
    effort: "S",
    build_candidate: false,
  },
  // Build-muligheter
  bo_ci_repair: {
    bucket: "Strategic",
    impact: "En pålitelig CI-kjede beskytter hele utviklingsløpet — grunnmur for videre automatisering.",
    solution: "Arkitektur- og CI-reparasjon (test → deploy → smoke → rollback).",
    effort: "M",
    build_candidate: true,
  },
  bo_ops: {
    bucket: "Strategic",
    impact: "Produksjonstrygghet: overvåking, varsling og rollback gjør at feil fanges og rettes før kundene merker det.",
    solution: "Overvåking + alerting + rollback (forberedelse for Arch Managed).",
    effort: "L",
    build_candidate: true,
  },
  bo_build: {
    bucket: "Strategic",
    impact: "Videreutvikling etter godkjent audit — scope fastsettes i Architecture Proposal.",
    solution: "Arch Build — videreutvikling fra godkjent audit.",
    effort: "L",
    build_candidate: true,
  },
};

// Merge website-kinds (F4.2B) — samme bøtter/format, gjenbrukt av Website Audit.
Object.assign(KIND_META, WEB_KINDS);

// Positive/informative funn som ikke er «tiltak» — vises ikke i prioritert liste.
export const INFO_KINDS = new Set(["secret_clean", "engineering_score"]);

/**
 * Beriker ett funn med kommersiell framing.
 * @returns {object|null} null hvis funnet er informativt (info-kinds).
 */
export function enrich(action) {
  const meta = KIND_META[action.kind];
  if (!meta) return null;
  return { ...action, bucket: meta.bucket, business_impact: meta.impact, solution: meta.solution, effort: meta.effort, effort_label: EFFORT[meta.effort], build_candidate: meta.build_candidate };
}

/**
 * Bygger den kommersielle aksjonslisten fra audit-resultatet:
 * findings (ikke-info) + quick_wins + build_opportunities, alle beriket.
 */
export function buildActions(audit) {
  const actions = [];
  for (const f of audit.findings ?? []) {
    if (INFO_KINDS.has(f.kind)) continue;
    const e = enrich(f);
    if (e) actions.push(e);
  }
  for (const q of audit.quick_wins ?? []) {
    const e = enrich(q);
    if (e) actions.push(e);
  }
  for (const b of audit.build_opportunities ?? []) {
    const e = enrich(b);
    if (e) actions.push(e);
  }
  // dedupe på tittel (finner + quick_win kan overlappe)
  const seen = new Set();
  return actions.filter((a) => (seen.has(a.title) ? false : (seen.add(a.title), true)));
}

/** Grupperer aksjoner i bøtte-rekkefølge Critical → High ROI → Quick Win → Strategic. */
export function groupByBucket(actions) {
  const out = { Critical: [], "High ROI": [], "Quick Win": [], Strategic: [] };
  for (const a of actions) {
    if (out[a.bucket]) out[a.bucket].push(a);
  }
  return out;
}

/**
 * Automation Potential (0–100): andel av 8 automatiseringsmuligheter som IKKE er
 * dekket — dvs. hvor mye verdi Arch kan levere ved å automatisere. Høy = mer å hente.
 */
export function automationPotential(audit) {
  const op = audit.operations ?? {};
  const caps = [
    ["CI-pipeline", (audit.ci_cd?.workflows?.length ?? 0) > 0],
    ["Test-runner", !!(audit.stack?.test_runner) && audit.stack.test_runner !== "ingen test-runner"],
    ["Monitorering", !!op.monitoring],
    ["Alert-ruting", !!op.alerts],
    ["Rollback", !!op.rollback],
    ["Hemmelighets-styring", audit.security?.secret_governance === "observed"],
    ["Deploy-pipeline", !!op.deploy_pipeline],
    ["Arkitektur-dokumentasjon", !!(audit.documentation?.architect)],
  ];
  const covered = caps.filter(([, on]) => on).length;
  return Math.round(((caps.length - covered) / caps.length) * 100);
}
