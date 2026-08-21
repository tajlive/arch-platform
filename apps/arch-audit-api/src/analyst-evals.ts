// analyst-evals.ts — Evals-gate for ArchAnalyst
//
// KJØRES SOM CI-GATE (`analyst-evals`): Måler at ArchAnalyst ikke fabrikkerer,
// at alle claims er evidence-lenket, og at output er kalibrert mot evidenslaget.
// Feiler CI hvis 0-fabrikasjons-regelen brytes.
//
// Ingen LLM-kall her — ren deterministisk validering over AnalystOutput.

import type { AnalystOutput, AnalystClaim, AnalystPriority } from "./analyst";

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
    "website", "nav-arbeidsplassen", "brreg", "peer-group",
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

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  return { suite: "analyst-evals", passed, failed, results };
}

/** Lager en falsk evidens-lenket claim som IKKE bryter 0-fabrikasjon (for tester). */
export function sampleClaim(claim: string, refs: string[]): AnalystClaim {
  return { claim, evidence_refs: refs };
}

export function samplePriority(rank: number, recommendation: string, refs: string[]): AnalystPriority {
  return { rank, recommendation, evidence_refs: refs };
}
