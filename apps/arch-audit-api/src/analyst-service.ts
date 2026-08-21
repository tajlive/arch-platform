// analyst-service.ts — ArchAnalyst tjenestelag (stateless)
//
// Kobler evidenslag → LLM-tolkning → evals-gate.
//  - FAIL-OPEN: LLM-feil (timeout/429) → kaster → ruten returnerer 503 ærlig.
//  - FAIL-CLOSED: evals-gate validerer 0-fabrikasjon FØR output leveres.

import type { IntelligenceReport } from "./research-orchestrator";
import type { ComparativeReport } from "./comparative";
import {
  AnalystOutput,
  AnalystModel,
  FocusArea,
  buildEvidenceBundle,
  buildPrompt,
  callAnalystModel,
  parseAnalystJson,
  estimateTokens,
  allowedEvidence,
} from "./analyst";
import { runAnalystEvals } from "./analyst-evals";

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
    comparativeContext: string[] = []
  ): Promise<{ analyst: AnalystOutput["analyst"]; model: AnalystOutput["model"]; provenance: AnalystOutput["provenance"] }> {
    const bundle = buildEvidenceBundle(report);

    // Hvis det finnes komparativ kontekst, berik evidensen (tom for nå — valgfritt)
    const prompt = buildPrompt(bundle, focusArea);

    const inputText = prompt;
    // Retry mot transiente overbelastning (NVIDIA 503) — 2 forsøk, kort backoff.
    let raw: string;
    try {
      raw = await callAnalystModel(this.model, prompt, 1200, 30_000);
    } catch (e) {
      if (!(e instanceof Error) || !/HTTP 503|overloaded/i.test(e.message)) throw e;
      await new Promise((r) => setTimeout(r, 1500));
      raw = await callAnalystModel(this.model, prompt, 1200, 30_000);
    }

    const output = parseAnalystJson(
      raw,
      orgNumber,
      bundle.company_name,
      this.model.provider,
      this.model.model,
      estimateTokens(inputText),
      estimateTokens(raw)
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
