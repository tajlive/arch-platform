// analyst-service.test.ts — enhetstest for AnalystService + computeBenchmarkDeltas
import { describe, it, expect, vi } from "vitest";
import { AnalystService, computeBenchmarkDeltas } from "../src/analyst-service";
import type { ComparativeReport } from "../src/comparative";
import type { IntelligenceReport } from "../src/research-orchestrator";

function sampleReport(): IntelligenceReport {
  return {
    org_number: "951001880",
    company_name: "ALFA SKO AS",
    identity: { industry_code: "15.200", industry_name: "Produksjon av skotøy", employees: 23 },
    leadership: [],
    financial: { period_from: "2025-01-01", period_to: "2025-12-31", revenue: 146693681, operating_result: -19318991, equity: 30109263, total_assets: 133194811, currency: "NOK", audited: true },
    financial_history: { org_number: "951001880", years: [], trends: [], latest_year: "2025", data_points: 1 },
    digital: { website: "www.alfa.no", tech_stack: [], channels: [], has_booking: false, has_self_service: false, fetched: false },
    sources: [],
    evidence_map: [],
    graph: { org_number: "951001880", company_name: "ALFA SKO AS", generated_at: "", evidence: [], rejected_evidence: [], coverage: { accepted: 0, rejected: 0, sources: 0 } },
  };
}

function sampleComparative(): ComparativeReport {
  return {
    generated_at: "2026-08-21T00:00:00Z",
    companies: [
      {
        org_number: "951001880",
        company_name: "ALFA SKO AS",
        metrics: { operating_margin: -13.17, equity_ratio: 22.61, employees: 23 },
        evidence: {},
        source_status: {},
        graph: sampleReport().graph,
      },
    ],
    benchmark: {
      generated_at: "2026-08-21T00:00:00Z",
      peer_group: { basis: "selected_companies", industry_code: "15.200", industry_name: "Produksjon av skotøy", company_count: 3, note: "test" },
      metrics: [
        { key: "operating_margin", label: "Operating margin", unit: "percent", values: [{ org_number: "951001880", value: -13.17 }, { org_number: "111111111", value: 5.2 }], median: 5.2, q1: 2, q3: 9, top_decile: 12, bottom_decile: -3 },
        { key: "equity_ratio", label: "Equity ratio", unit: "percent", values: [{ org_number: "951001880", value: 22.61 }, { org_number: "111111111", value: 30 }], median: 30.0, q1: 20, q3: 45, top_decile: 60, bottom_decile: 10 },
        { key: "employees", label: "Employees", unit: "count", values: [{ org_number: "951001880", value: 23 }, { org_number: "111111111", value: 40 }], median: 40, q1: 20, q3: 80, top_decile: 120, bottom_decile: 5 },
      ],
      sources: [],
    },
    strengths: [],
    weaknesses: [],
    gaps: [],
    recommendations: [],
  };
}

describe("computeBenchmarkDeltas", () => {
  it("beregner deltas kun for retningsbestemte metrikker med dokumenterte verdier", () => {
    const deltas = computeBenchmarkDeltas(sampleReport(), sampleComparative());
    expect(deltas.length).toBe(2);

    const margin = deltas.find((d) => d.metric === "operating_margin");
    expect(margin?.company_value).toBe(-13.17);
    expect(margin?.peer_median).toBe(5.2);
    expect(margin?.delta).toBeCloseTo(-18.37, 1);
    expect(margin?.direction).toBe("below");

    const equity = deltas.find((d) => d.metric === "equity_ratio");
    expect(equity?.direction).toBe("below");

    expect(deltas.find((d) => d.metric === "employees")).toBeUndefined();
  });

  it("returnerer tom liste når comparative mangler", () => {
    expect(computeBenchmarkDeltas(sampleReport(), null)).toEqual([]);
    expect(computeBenchmarkDeltas(sampleReport(), undefined)).toEqual([]);
  });

  it("returnerer tom liste når eget selskap ikke finnes i comparative", () => {
    const comparative = sampleComparative();
    comparative.companies = [{
      org_number: "999999999",
      company_name: "ANNET",
      metrics: { operating_margin: 3 },
      evidence: {},
      source_status: {},
      graph: sampleReport().graph,
    }];
    expect(computeBenchmarkDeltas(sampleReport(), comparative)).toEqual([]);
  });
});

describe("AnalystService", () => {
  it("bruker deterministisk oppsummering og forkaster generiske tiltak uten dokumentert avvik", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{
        message: {
          content: JSON.stringify({
            summary: "Modellens oppsummering skal ikke vises.",
            strengths: [{ claim: "23 ansatte", evidence_refs: ["brreg-enhet"], kind: "FACT" }],
            weaknesses: [{ claim: "Generisk svakhet", evidence_refs: ["brreg-regnskap"], kind: "INTERPRETATION" }],
            priorities: [{ rank: 1, recommendation: "Overvåk driften", expected_effect: "Bedre drift", effort: "medium", time_horizon: 90, evidence_refs: ["brreg-regnskap"], uncertainties: [], pre_work: [], kind: "HYPOTHESIS" }],
            unknowns: [],
          }),
        },
      }],
    }), { status: 200 })) as unknown as typeof fetch;

    try {
      const service = new AnalystService({ provider: "test", baseUrl: "https://model.test", apiKey: "test", model: "test-model" });
      const result = await service.analyze("951001880", {
        ...sampleReport(),
        financial: { ...sampleReport().financial!, operating_result: 56216, net_result: 42271 },
      }, "drift");

      expect(result.analyst.summary).toContain("ALFA SKO AS er registrert i bransjen Produksjon av skotøy og har 23 ansatte.");
      expect(result.analyst.summary).toContain("56");
      expect(result.analyst.weaknesses).toEqual([]);
      expect(result.analyst.priorities).toEqual([]);
      expect(result.analyst.strengths).toHaveLength(1);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("does not keep model weaknesses or priorities that are based only on headcount", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{
        message: {
          content: JSON.stringify({
            summary: "Ugyldig modelloppsummering.",
            strengths: [],
            weaknesses: [{ claim: "Færre ansatte", evidence_refs: ["brreg-enhet"], kind: "INTERPRETATION" }],
            priorities: [{ rank: 1, recommendation: "Ansett flere", expected_effect: "Flere ansatte", effort: "high", time_horizon: 180, evidence_refs: ["brreg-enhet"], uncertainties: [], pre_work: [], kind: "HYPOTHESIS" }],
            unknowns: [],
          }),
        },
      }],
    }), { status: 200 })) as unknown as typeof fetch;

    try {
      const comparative = sampleComparative();
      comparative.benchmark.metrics = [comparative.benchmark.metrics[2]];
      const service = new AnalystService({ provider: "test", baseUrl: "https://model.test", apiKey: "test", model: "test-model" });
      const result = await service.analyze("951001880", {
        ...sampleReport(),
        financial: { ...sampleReport().financial!, operating_result: 56216, net_result: 42271 },
      }, "drift", [], comparative);

      expect(result.analyst.weaknesses).toEqual([]);
      expect(result.analyst.priorities).toEqual([]);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
