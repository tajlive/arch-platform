// analyst-evals.test.ts — enhetstest for ArchAnalyst evals-gate (0-fabrikasjon)
import { describe, it, expect } from "vitest";
import { runAnalystEvals, sampleClaim, samplePriority } from "../src/analyst-evals";
import type { AnalystOutput } from "../src/analyst";

function sampleOutput(overrides?: Partial<AnalystOutput["analyst"]>): AnalystOutput {
  return {
    org_number: "951001880",
    company_name: "ALFA SKO AS",
    generated_at: new Date().toISOString(),
    analyst: {
      summary: "Sammendrag",
      strengths: [sampleClaim("Solid egenkapital", ["brreg-regnskap"])],
      weaknesses: [sampleClaim("Negativ margin", ["brreg-regnskap"])],
      priorities: [samplePriority(1, "Forbedre margin", ["brreg-regnskap"])],
      unknowns: [],
      ...overrides,
    },
    model: { provider: "nvidia", model: "nemotron", tokens: { input: 100, output: 50 } },
    provenance: {
      evidence_sources: ["brreg-regnskap"],
      disclaimer: "Beslutningsstøtte, ikke rådgivning.",
      benchmark_deltas: [],
    },
  };
}

describe("runAnalystEvals", () => {
  it("passerer når alle claims er evidence-lenket", () => {
    const suite = runAnalystEvals(sampleOutput());
    expect(suite.passed).toBe(suite.results.length);
    expect(suite.failed).toBe(0);
  });

  it("feiler på 0-fabrikasjon når claim mangler evidence_ref", () => {
    const output = sampleOutput({
      strengths: [sampleClaim("FABRIKERT påstand", [])],
    });
    const suite = runAnalystEvals(output);
    const noFab = suite.results.find((r) => r.id === "ANALYST_NO_FABRICATION");
    expect(noFab?.passed).toBe(false);
    expect(noFab?.severity).toBe("error");
  });

  it("feiler når anbefaling ikke er evidence-lenket", () => {
    const output = sampleOutput({
      priorities: [samplePriority(1, "utjenlig anbefaling", [])],
    });
    const suite = runAnalystEvals(output);
    const recs = suite.results.find((r) => r.id === "ANALYST_RECS_EVIDENCE_LINKED");
    expect(recs?.passed).toBe(false);
  });

  it("feiler når evidence_ref kommer fra ikke-tillatt kilde", () => {
    const output = sampleOutput({
      strengths: [sampleClaim("Bruk av uverifisert", ["sosiale-medier"])],
    });
    const suite = runAnalystEvals(output);
    const allowed = suite.results.find((r) => r.id === "ANALYST_ALLOWED_SOURCES");
    expect(allowed?.passed).toBe(false);
  });

  it("passerer med tom output (ingen evals feiler)", () => {
    const suite = runAnalystEvals(sampleOutput({ strengths: [], weaknesses: [], priorities: [], unknowns: [], summary: "" }));
    // selve struktur-evalen feiler for tom syntese — men ingen fabrikasjon
    const noFab = suite.results.find((r) => r.id === "ANALYST_NO_FABRICATION");
    expect(noFab?.passed).toBe(true);
  });

  it("feiler når priority mangler expected_effect (kontrakt-brudd)", () => {
    const output = sampleOutput({
      priorities: [samplePriority(1, "tiltak", ["brreg-regnskap"], { expected_effect: "" })],
    });
    const suite = runAnalystEvals(output);
    const contract = suite.results.find((r) => r.id === "ANALYST_PRIORITY_CONTRACT");
    expect(contract?.passed).toBe(false);
    expect(contract?.severity).toBe("error");
  });

  it("feiler når priority har ugyldig time_horizon", () => {
    const output = sampleOutput({
      priorities: [samplePriority(1, "tiltak", ["brreg-regnskap"], { time_horizon: 45 as any })],
    });
    const suite = runAnalystEvals(output);
    const contract = suite.results.find((r) => r.id === "ANALYST_PRIORITY_CONTRACT");
    expect(contract?.passed).toBe(false);
  });

  it("feiler når funn mangler gyldig kind", () => {
    const output = sampleOutput({
      strengths: [{ claim: "uten kind", evidence_refs: ["brreg-regnskap"], kind: "FABEL" as any }],
    });
    const suite = runAnalystEvals(output);
    const kindEval = suite.results.find((r) => r.id === "ANALYST_KIND_CLASSIFIED");
    expect(kindEval?.passed).toBe(false);
  });

  it("passerer når disclaimer er til stede", () => {
    const suite = runAnalystEvals(sampleOutput());
    const disclaimer = suite.results.find((r) => r.id === "ANALYST_DISCLAIMER");
    expect(disclaimer?.passed).toBe(true);
  });

  it("feiler når kundesvaret inneholder et kjent feilaktig finansord", () => {
    const output = sampleOutput({ summary: "Branchens driftsoverresult er positivt." });
    const suite = runAnalystEvals(output);
    const language = suite.results.find((r) => r.id === "ANALYST_NORWEGIAN_QUALITY");
    expect(language?.passed).toBe(false);
    expect(language?.severity).toBe("error");
  });
});
