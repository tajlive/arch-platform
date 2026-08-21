// analyst-service.ts — ArchAnalyst tjenestelag (stateless)
//
// Kobler evidenslag → LLM-tolkning → evals-gate.
//  - FAIL-OPEN: LLM-feil (timeout/429) → kaster → ruten returnerer 503 ærlig.
//  - FAIL-CLOSED: evals-gate validerer 0-fabrikasjon FØR output leveres.

import type { IntelligenceReport } from "./research-orchestrator";
import type { ComparativeReport, BenchmarkMetric, BenchmarkMetricKey } from "./comparative";
import {
  AnalystOutput,
  AnalystModel,
  BenchmarkDelta,
  FocusArea,
  buildEvidenceBundle,
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

  const deltas: BenchmarkDelta[] = [];
  for (const metric of Object.values(comparative.benchmark.metrics ?? {}) as BenchmarkMetric[]) {
    const key = metric.key;
    const companyValue = own.metrics[key];
    const median = metric.median;
    if (companyValue === undefined || median === undefined) continue;
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

    // FAIL-CLOSED: evals-gate må passeres før output leveres til kunde.
    const sources = bundle.sources.map((s) => s.status);
    const suite = runAnalystEvals(output, sources);
    const errors = suite.results.filter((r) => !r.passed && r.severity === "error");
    if (errors.length > 0) {
      throw new Error(`analyst-evals feilet: ${errors.map((e) => e.id).join(", ")}`);
    }

    return { analyst: output.analyst, model: output.model, provenance: output.provenance };
  }
}
