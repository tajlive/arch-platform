// benchmark-evals.test.ts — enhetstest for benchmark-evals
import { describe, it, expect } from "vitest";
import { runBenchmarkEvals } from "../src/benchmark-evals";
import { sizeClassFor } from "../src/peer-group";

describe("runBenchmarkEvals", () => {
  it("validerer finansiell marginkonsistens", () => {
    const suite = runBenchmarkEvals({
      financialHistory: {
        org_number: "951001880",
        years: [{ period_to: "2025-12-31", revenue: 100, operating_result: -13, currency: "NOK", audited: true }],
        trends: [
          { key: "operating_margin", label: "Operating margin (%)", values: [{ year: "2025", value: -13 }] },
        ],
        latest_year: "2025",
        data_points: 1,
      } as never,
    });
    const marginEval = suite.results.find((r) => r.id === "FIN_HISTORY_MARGIN_CONSISTENT");
    expect(marginEval?.passed).toBe(true);
  });

  it("validerer at peers deler NACE", () => {
    const suite = runBenchmarkEvals({
      peerGroup: {
        org_number: "951001880",
        company_name: "ALFA SKO AS",
        nace_code: "15.200",
        size_class: sizeClassFor(23),
        peers: [
          { org_number: "932520516", company_name: "EIK", industry_code: "15.200", size_class: "MICRO", similarity_score: 73 },
        ],
        candidates_found: 1,
        peers_selected: 1,
      } as never,
    });
    const naceEval = suite.results.find((r) => r.id === "PEER_GROUP_SAME_NACE");
    expect(naceEval?.passed).toBe(true);
    const emptyEval = suite.results.find((r) => r.id === "PEER_GROUP_NON_EMPTY");
    expect(emptyEval?.passed).toBe(true);
  });

  it("rapporterer suiten og tellinger", () => {
    const suite = runBenchmarkEvals({});
    // Uten inndata skal ingen evals kjøres — ingen feil
    expect(suite.passed).toBe(0);
    expect(suite.failed).toBe(0);
    expect(suite.results.length).toBe(0);
  });
});
