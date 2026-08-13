// Website Health Score — Arch Website Audit v1 (F4.2B).
//
// Egen score-profil — gjenbruker IKKE repository Health Score.
// Vekter (dokumentert begrunnelse):
//   Performance 20 · Security Surface 20 · UX/Mobile 15 · Accessibility 15 ·
//   SEO/Discovery 10 · Reliability 10 · Trust/Privacy 5 · Automation Potential 5
//
// Semantikk: kategori-score = PASS / (PASS + FAIL + UNKNOWN) × 100 (N/A ekskludert).
// UNKNOWN telles mot (fail-safe) — aldri stille om til PASS.
// «Automation Potential» = uutnyttet automatiseringsverdi (høy = mer å hente);
// i totalscoren bidrar den invertert (maturity), tydelig dokumentert.

const WEIGHTS = {
  performance: 20,
  security: 20,
  ux_mobile: 15,
  accessibility: 15,
  seo: 10,
  reliability: 10,
  trust_privacy: 5,
};

const DIM_LABEL = {
  performance: "Performance",
  security: "Security Surface",
  ux_mobile: "UX / Mobile",
  accessibility: "Accessibility",
  seo: "SEO / Discovery",
  reliability: "Reliability",
  trust_privacy: "Trust / Privacy",
  automation: "Automation Potential",
};

const AUTOMATION_SIGNALS = ["contact_form", "analytics", "cmp", "chat", "booking", "newsletter"];

export function automationMetrics(raw) {
  const sig = raw.automation_signals ?? {};
  const present = AUTOMATION_SIGNALS.filter((k) => sig[k]).length;
  const total = AUTOMATION_SIGNALS.length;
  const leverage = Math.round((present / total) * 100);       // allerede utnyttet
  const potential = 100 - leverage;                            // uutnyttet (verdi Arch kan levere)
  return { leverage, potential, present, total, signals: sig };
}

export function scoreWeb(collectResult) {
  const checks = collectResult.checks ?? [];
  const categories = {};

  for (const [dim, weight] of Object.entries(WEIGHTS)) {
    const c = checks.filter((ch) => ch.dimension === dim);
    const pass = c.filter((r) => r.result === "PASS").length;
    const fail = c.filter((r) => r.result === "FAIL").length;
    const unk = c.filter((r) => r.result === "UNKNOWN").length;
    const denom = pass + fail + unk;
    const pct = denom === 0 ? null : Math.round((pass / denom) * 100);
    categories[dim] = { pct, weight, pass, fail, unknown: unk, denom, checks: c };
  }

  const auto = automationMetrics(collectResult.raw ?? {});
  categories.automation = {
    pct: auto.potential,
    leverage: auto.leverage,
    potential: auto.potential,
    weight: 5,
    pass: auto.present,
    fail: auto.total - auto.present,
    unknown: 0,
    denom: auto.total,
    checks: [],
  };

  // Total = vektet snitt av 7 helse-dimensjoner (renormalisert) + automation-leverage × 5.
  let num = 0; let wsum = 0;
  for (const [dim, w] of Object.entries(WEIGHTS)) {
    const c = categories[dim];
    if (c.denom > 0) { num += c.pct * w; wsum += w; }
  }
  num += auto.leverage * 5; wsum += 5;
  const total = wsum > 0 ? Math.round(num / wsum) : 0;

  return { total, categories, weights: WEIGHTS, labels: DIM_LABEL, automation: auto, observed_at: new Date().toISOString() };
}
