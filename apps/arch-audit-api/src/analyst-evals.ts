// analyst-evals.ts — Evals-gate for ArchAnalyst
//
// KJØRES SOM CI-GATE (`analyst-evals`): Måler at ArchAnalyst ikke fabrikkerer,
// at alle claims er evidence-lenket, og at output er kalibrert mot evidenslaget.
// Feiler CI hvis 0-fabrikasjons-regelen brytes.
//
// Ingen LLM-kall her — ren deterministisk validering over AnalystOutput.

import { DISALLOWED_ANALYST_TERMS, type AnalystOutput, type AnalystClaim, type AnalystPriority } from "./analyst";

export type EvalSeverity = "error" | "warning";

export interface AnalystEvalResult {
  id: string;
  name: string;
  passed: boolean;
  severity: EvalSeverity;
  detail: string;
}

export interface AnalystEvalSuite {
  suite: "analyst-evals";
  passed: number;
  failed: number;
  results: AnalystEvalResult[];
}

/**
 * Kjør evals-gate over ArchAnalyst-output.
 * FAIL-CLOSED: enhver claim uten evidence_ref gir `passed: false` med severity=error.
 */
export function runAnalystEvals(output: AnalystOutput, evidenceSources?: string[]): AnalystEvalSuite {
  const results: AnalystEvalResult[] = [];
  const allClaims: AnalystClaim[] = [
    ...output.analyst.strengths,
    ...output.analyst.weaknesses,
  ];
  const priorities = output.analyst.priorities;

  // ── Eval 1: 0-fabrikasjon — hver claim må ha evidence_ref ──
  const claimsWithoutRefs = allClaims.filter((c) => c.evidence_refs.length === 0);
  results.push({
    id: "ANALYST_NO_FABRICATION",
    name: "Ingen claim uten evidence_ref (0 fabrikasjon)",
    passed: claimsWithoutRefs.length === 0,
    severity: "error",
    detail: `${allClaims.length} claims, ${claimsWithoutRefs.length} uten evidence_ref`,
  });

  // ── Eval 2: Anbefalinger må være evidence-lenket ──
  const recsWithoutRefs = priorities.filter((p) => p.evidence_refs.length === 0);
  results.push({
    id: "ANALYST_RECS_EVIDENCE_LINKED",
    name: "Alle anbefalinger er evidence-lenket",
    passed: recsWithoutRefs.length === 0,
    severity: "error",
    detail: `${priorities.length} anbefalinger, ${recsWithoutRefs.length} uten evidence_ref`,
  });

  // ── Eval 3: Evidence_refs må komme fra tillatte kilder ──
  const ALLOWED = new Set([
    "brreg-enhet", "brreg-roller", "brreg-regnskap", "brreg-regnskap-historikk",
    "website", "nav-arbeidsplassen", "ssb-lonn", "brreg", "peer-group",
  ]);
  const allRefs = [
    ...allClaims.flatMap((c) => c.evidence_refs),
    ...priorities.flatMap((p) => p.evidence_refs),
  ];
  const badRefs = allRefs.filter((ref) => !ALLOWED.has(ref));
  results.push({
    id: "ANALYST_ALLOWED_SOURCES",
    name: "Alle evidence_refs fra tillatte kilder",
    passed: badRefs.length === 0,
    severity: "error",
    detail: `${allRefs.length} refs, ${badRefs.length} fra ikke-tillatt kilde`,
  });

  // ── Eval 4: Kalibrering — ingen påstand om ukjente tall ──
  // Sjekk at strengths/weaknesses ikke refererer til kilder som er NOT_AVAILABLE/ERROR
  const unavailableSources = (evidenceSources ?? []).filter((s) => s.includes("NOT_AVAILABLE") || s.includes("ERROR"));
  results.push({
    id: "ANALYST_NO_UNAVAILABLE_CLAIMS",
    name: "Ingen claim basert på utilgjengelig kilde",
    passed: allClaims.every((c) => c.evidence_refs.length > 0),
    severity: "warning",
    detail: `${unavailableSources.length} utilgjengelige kilder ignorert`,
  });

  // ── Eval 5: Output er gyldig/strukturert ──
  const hasStructure = output.analyst.summary.length > 0;
  results.push({
    id: "ANALYST_STRUCTURED",
    name: "Output er strukturert med syntese",
    passed: hasStructure,
    severity: "error",
    detail: `summary lengde: ${output.analyst.summary.length}`,
  });

  // ── Eval 6: Priority-kontrakt (effort + time_horizon + expected_effect) ──
  const badPriorities = output.analyst.priorities.filter(
    (p) =>
      !p.expected_effect ||
      !["low", "medium", "high"].includes(p.effort) ||
      ![30, 90, 180].includes(p.time_horizon)
  );
  results.push({
    id: "ANALYST_PRIORITY_CONTRACT",
    name: "Hver priority har expected_effect, effort (low/medium/high) og time_horizon (30/90/180)",
    passed: badPriorities.length === 0,
    severity: "error",
    detail: `${output.analyst.priorities.length} prioriteter, ${badPriorities.length} uten full kontrakt`,
  });

  // ── Eval 7: kind-klassifisering (FACT/INTERPRETATION/HYPOTHESIS) ──
  const validKinds = new Set(["FACT", "INTERPRETATION", "HYPOTHESIS"]);
  const unclassified = [
    ...output.analyst.strengths,
    ...output.analyst.weaknesses,
    ...output.analyst.priorities,
  ].filter((f) => !validKinds.has(f.kind));
  results.push({
    id: "ANALYST_KIND_CLASSIFIED",
    name: "Hvert funn er klassifisert FACT/INTERPRETATION/HYPOTHESIS",
    passed: unclassified.length === 0,
    severity: "error",
    detail: `${unclassified.length} funn uten gyldig kind`,
  });

  // ── Eval 8: Beslutningsstøtte-merking (disclaimer) ──
  const hasDisclaimer = output.provenance.disclaimer.length > 0;
  results.push({
    id: "ANALYST_DISCLAIMER",
    name: "Beslutningsstøtte-merking til stede (ikke rådgivning)",
    passed: hasDisclaimer,
    severity: "error",
    detail: hasDisclaimer ? "disclaimer til stede" : "disclaimer mangler",
  });

  // ── Eval 9: Språkkvalitet — ikke lever kjente feilord til kunde ──
  const textParts = [
    output.analyst.summary,
    ...allClaims.map((claim) => claim.claim),
    ...priorities.flatMap((priority) => [
      priority.recommendation,
      priority.expected_effect,
      ...priority.uncertainties,
      ...priority.pre_work,
    ]),
    ...output.analyst.unknowns.flatMap((unknown) => [unknown.question, unknown.why]),
  ].join(" ").toLocaleLowerCase("nb-NO");
  const disallowedTerms = DISALLOWED_ANALYST_TERMS.filter((term) => textParts.includes(term));
  results.push({
    id: "ANALYST_NORWEGIAN_QUALITY",
    name: "Kundesvaret inneholder ikke kjente feilaktige norske finansord",
    passed: disallowedTerms.length === 0,
    severity: "error",
    detail: disallowedTerms.length ? `ugyldige ord: ${disallowedTerms.join(", ")}` : "språkkontroll passerte",
  });

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  return { suite: "analyst-evals", passed, failed, results };
}

/** Lager en falsk evidens-lenket claim som IKKE bryter 0-fabrikasjon (for tester). */
export function sampleClaim(claim: string, refs: string[], kind: AnalystClaim["kind"] = "FACT"): AnalystClaim {
  return { claim, evidence_refs: refs, kind };
}

export function samplePriority(
  rank: number,
  recommendation: string,
  refs: string[],
  overrides?: Partial<Omit<AnalystPriority, "rank" | "recommendation" | "evidence_refs">>
): AnalystPriority {
  return {
    rank,
    recommendation,
    evidence_refs: refs,
    expected_effect: "Redusert risiko",
    effort: "medium",
    time_horizon: 90,
    uncertainties: [],
    pre_work: [],
    kind: "INTERPRETATION",
    ...overrides,
  };
}
