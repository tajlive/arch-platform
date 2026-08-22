// analyst-service.ts — ArchAnalyst tjenestelag (stateless)
//
// Kobler evidenslag → LLM-tolkning → evals-gate.
//  - FAIL-OPEN: LLM-feil (timeout/429) → kaster → ruten returnerer 503 ærlig.
//  - FAIL-CLOSED: evals-gate validerer 0-fabrikasjon FØR output leveres.

import type { IntelligenceReport } from "./research-orchestrator";
import { isDirectionalMetric, type ComparativeReport, type BenchmarkMetric } from "./comparative";
import {
  AnalystOutput,
  AnalystModel,
  BenchmarkDelta,
  FocusArea,
  buildEvidenceBundle,
  buildDeterministicSummary,
  buildPrompt,
  callAnalystModel,
  parseAnalystJson,
  estimateTokens,
  allowedEvidence,
} from "./analyst";
import { runAnalystEvals } from "./analyst-evals";

/** Beregn benchmark-deltas (selskap vs peer-median) fra ComparativeReport. */
export function computeBenchmarkDeltas(report: IntelligenceReport, comparative?: ComparativeReport | null): BenchmarkDelta[] {
  if (!comparative?.benchmark) return [];

  const own = comparative.companies.find((c) => c.org_number === report.org_number);
  if (!own) return [];

  // A pair gives a useful direct comparison in the UI, but not a benchmark that
  // can justify an automated weakness or priority in the analyst output.
  if (comparative.companies.length < 3) return [];

  const deltas: BenchmarkDelta[] = [];
  for (const metric of Object.values(comparative.benchmark.metrics ?? {}) as BenchmarkMetric[]) {
    // Headcount and vacancies describe a company; they do not by themselves
    // establish a business weakness, priority, or negative benchmark delta.
    if (!isDirectionalMetric(metric.key)) continue;
    const key = metric.key;
    const companyValue = own.metrics[key];
    const median = metric.median;
    if (companyValue === undefined || median === undefined || metric.values.length < 2) continue;
    const delta = Math.round((companyValue - median) * 100) / 100;
    const direction: BenchmarkDelta["direction"] =
      Math.abs(delta) < 0.01 ? "at" : delta > 0 ? "above" : "below";
    deltas.push({
      metric: key,
      label: metric.label,
      company_value: companyValue,
      peer_median: median,
      delta,
      direction,
    });
  }
  return deltas;
}

export class AnalystService {
  private readonly model: AnalystModel;

  constructor(model: AnalystModel) {
    this.model = model;
  }

  /**
   * Analysér en virksomhet basert på verifisert evidenslag.
   * @throws Error ved LLM-feil (FAIL-OPEN) eller valideringsfeil (eller evals-gate svikt).
   */
  async analyze(
    orgNumber: string,
    report: IntelligenceReport,
    focusArea: FocusArea = "salg",
    comparativeContext: string[] = [],
    comparative?: ComparativeReport | null
  ): Promise<{ analyst: AnalystOutput["analyst"]; model: AnalystOutput["model"]; provenance: AnalystOutput["provenance"] }> {
    const bundle = buildEvidenceBundle(report);

    // Benchmark-avvik fra deterministisk ComparativeEngine — ArchAnalyst forklarer AVVIK
    const benchmarkDeltas = computeBenchmarkDeltas(report, comparative);
    const prompt = buildPrompt(bundle, focusArea, benchmarkDeltas);

    const inputText = prompt;
    // Retry mot transiente overbelastning (NVIDIA 503) — 2 forsøk, kort backoff.
    // Timeout 60s: intelligence ~7-9s + LLM ~7-17s (varierer), rom mot Workers-limit.
    let raw: string;
    try {
      raw = await callAnalystModel(this.model, prompt, 1200, 60_000);
    } catch (e) {
      if (!(e instanceof Error) || !/HTTP 503|overloaded/i.test(e.message)) throw e;
      await new Promise((r) => setTimeout(r, 1500));
      raw = await callAnalystModel(this.model, prompt, 1200, 60_000);
    }

    const output = parseAnalystJson(
      raw,
      orgNumber,
      bundle.company_name,
      this.model.provider,
      this.model.model,
      estimateTokens(inputText),
      estimateTokens(raw),
      benchmarkDeltas
    );

    // Kundeoppsummeringen er kun verifiserte metadata og regnskapstall, aldri LLM-tolkning.
    output.analyst.summary = buildDeterministicSummary(bundle);

    // Uten et dokumentert negativt forhold skal modellen ikke fylle ut generiske svakheter eller tiltak.
    const hasDocumentedGap = benchmarkDeltas.some((delta) => delta.direction === "below")
      || (bundle.operating_result !== undefined && bundle.operating_result < 0)
      || (bundle.net_result !== undefined && bundle.net_result < 0);
    if (!hasDocumentedGap) {
      output.analyst.weaknesses = [];
      output.analyst.priorities = [];
    }

    // FAIL-CLOSED: evals-gate må passeres før output leveres til kunde.
    const sources = bundle.sources.map((s) => s.status);
    const suite = runAnalystEvals(output, sources);
    const errors = suite.results.filter((r) => !r.passed && r.severity === "error");
    if (errors.length > 0) {
      // Teknisk diagnose for API-observability. Kundeportalen viser bare en nøytral,
      // norsk feilmelding basert på error.code og eksponerer ikke denne teksten.
      throw new Error(`analyst-evals feilet: ${errors.map((e) => `${e.id} (${e.detail})`).join(", ")}`);
    }

    return { analyst: output.analyst, model: output.model, provenance: output.provenance };
  }
}
