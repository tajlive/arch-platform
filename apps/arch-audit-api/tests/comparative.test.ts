import { describe, expect, it } from "vitest";
import {
  ComparativeOrchestrator,
  BenchmarkEngine,
  SsbIndustryBenchmarkCollector,
  toComparableCompany,
  type CompanyIntelligenceResult,
} from "../src/comparative";
import type { ValidatedEvidence } from "../src/evidence-graph";
import type { IntelligenceReport } from "../src/research-orchestrator";

function report(input: {
  org: string;
  name: string;
  revenue?: number;
  operatingResult?: number;
  equity?: number;
  totalAssets?: number;
  employees?: number;
  digitalSignals?: number;
  workforceOpenings?: number;
}): CompanyIntelligenceResult {
  const evidence: ValidatedEvidence[] = [
    {
      type: "COMPANY" as const,
      observation: `${input.name} has organisation number ${input.org}`,
      source: "brreg-enhet",
      observed_at: "2026-08-21T00:00:00.000Z",
      confidence: "HIGH" as const,
      verified: true,
      dedupe_key: `company|${input.org}`,
      metadata: { employees: input.employees ?? null },
    },
    {
      type: "FINANCIAL_EVENT" as const,
      observation: `Revenue was ${input.revenue ?? 0} NOK`,
      source: "brreg-regnskap",
      observed_at: "2026-08-21T00:00:00.000Z",
      confidence: "HIGH" as const,
      freshness: "2025-12-31",
      verified: true,
      dedupe_key: `financial|${input.org}|revenue`,
      metadata: { metric: "revenue", value: input.revenue ?? 0, period_to: "2025-12-31" },
    },
    {
      type: "FINANCIAL_EVENT" as const,
      observation: `Operating result was ${input.operatingResult ?? 0} NOK`,
      source: "brreg-regnskap",
      observed_at: "2026-08-21T00:00:00.000Z",
      confidence: "HIGH" as const,
      freshness: "2025-12-31",
      verified: true,
      dedupe_key: `financial|${input.org}|operating_result`,
      metadata: { metric: "operating_result", value: input.operatingResult ?? 0, period_to: "2025-12-31" },
    },
  ];

  for (let i = 0; i < (input.digitalSignals ?? 0); i += 1) {
    evidence.push({
      type: "DIGITAL_SIGNAL",
      observation: `Website indicates signal ${i}`,
      source: "website",
      observed_at: "2026-08-21T00:00:00.000Z",
      confidence: "MEDIUM",
      verified: false,
      dedupe_key: `digital|${input.org}|${i}`,
      metadata: { signal: `signal-${i}` },
    });
  }

  if (input.workforceOpenings !== undefined) {
    evidence.push({
      type: "WORKFORCE_SIGNAL",
      observation: `${input.name} has ${input.workforceOpenings} open positions`,
      source: "nav-arbeidsplassen",
      observed_at: "2026-08-21T00:00:00.000Z",
      confidence: "HIGH",
      verified: true,
      dedupe_key: `workforce|${input.org}|open_positions_count`,
      metadata: { signal: "open_positions_count", count: input.workforceOpenings },
    });
  }

  const intelligence: IntelligenceReport = {
    org_number: input.org,
    company_name: input.name,
    identity: {
      industry_code: "45.200",
      industry_name: "Vedlikehold og reparasjon av motorvogner",
      employees: input.employees,
    },
    leadership: [],
    financial: input.revenue === undefined ? null : {
      period_from: "2025-01-01",
      period_to: "2025-12-31",
      currency: "NOK",
      revenue: input.revenue,
      operating_result: input.operatingResult,
      equity: input.equity,
      total_assets: input.totalAssets,
      audited: true,
    },
    digital: {
      website: `${input.name.toLowerCase().replaceAll(" ", "")}.example`,
      tech_stack: Array.from({ length: input.digitalSignals ?? 0 }, (_, i) => `Tech ${i}`),
      channels: [],
      has_booking: false,
      has_self_service: false,
      fetched: input.digitalSignals !== undefined,
    },
    sources: [
      { key: "brreg-enhet", label: "Company identity", status: "AVAILABLE" },
      { key: "brreg-regnskap", label: "Financial profile", status: input.revenue === undefined ? "EMPTY" : "AVAILABLE" },
      { key: "website", label: "Digital footprint", status: input.digitalSignals === undefined ? "EMPTY" : "AVAILABLE" },
      {
        key: "nav-arbeidsplassen",
        label: "Workforce signals",
        status: input.workforceOpenings === undefined ? "EMPTY" : "AVAILABLE",
      },
    ],
    evidence_map: [],
    graph: {
      org_number: input.org,
      company_name: input.name,
      generated_at: "2026-08-21T00:00:00.000Z",
      evidence,
      rejected_evidence: [],
      coverage: { accepted: evidence.length, rejected: 0, sources: 3 },
    },
  };

  return {
    company: { org_number: input.org, company_name: input.name },
    report: intelligence,
  };
}

describe("Comparative intelligence", () => {
  it("extracts benchmark metrics from an intelligence report with evidence refs", () => {
    const comparable = toComparableCompany(report({
      org: "111111111",
      name: "Alpha Glass AS",
      revenue: 1_000,
      operatingResult: 200,
      equity: 400,
      totalAssets: 800,
      employees: 12,
      digitalSignals: 2,
      workforceOpenings: 3,
    }));

    expect(comparable.metrics).toMatchObject({
      operating_margin: 20,
      equity_ratio: 50,
      employees: 12,
      digital_score: 30,
      workforce_signals: 3,
    });
    expect(comparable.evidence.operating_margin).toContain("financial|111111111|revenue");
    expect(comparable.evidence.workforce_signals).toContain("workforce|111111111|open_positions_count");
  });

  it("adds an SSB industry reference only for a shared industry", async () => {
    const benchmark = new BenchmarkEngine({
      collect: async () => ({
        industry_code: "45.2",
        industry_name: "Vedlikehold og reparasjon av motorvogner",
        scope: "division",
        period: "2024",
        source_url: "https://data.ssb.no/api/pxwebapi/v2/tables/08171/data",
        operating_margin: 3,
        equity_ratio: 44.2,
        company_count: 3418,
      }),
    });
    const companies = [
      toComparableCompany(report({ org: "111111111", name: "Alpha Glass AS", revenue: 1_000, operatingResult: 220, equity: 500, totalAssets: 800 })),
      toComparableCompany(report({ org: "222222222", name: "Beta Glass AS", revenue: 1_000, operatingResult: 50, equity: 100, totalAssets: 800 })),
    ];

    const context = await benchmark.enrich(companies);

    expect(context.sources.find((source) => source.key === "ssb-bransje")?.status).toBe("AVAILABLE");
    expect(context.metrics.find((metric) => metric.key === "operating_margin")?.industry_reference?.value).toBe(3);
    expect(context.metrics.find((metric) => metric.key === "equity_ratio")?.industry_reference?.value).toBe(44.2);
  });

  it("retrieves the latest SSB reference for the matching NACE division", async () => {
    const requestedUrls: string[] = [];
    const fetcher: typeof fetch = async (input) => {
      const url = input.toString();
      requestedUrls.push(url);
      if (url.includes("/metadata")) {
        return Response.json({
          dimension: { Tid: { category: { index: { "2023": 0, "2024": 1 } } } },
        });
      }
      return Response.json({
        value: [3, 44.2, 3418],
        dimension: {
          ContentsCode: { category: { index: { Drift: 0, EgenkapAnd: 1, Antall: 2 } } },
        },
      });
    };
    const collector = new SsbIndustryBenchmarkCollector(fetcher);

    const benchmark = await collector.collect("45.200", "Vedlikehold og reparasjon av motorvogner");

    expect(benchmark).toMatchObject({
      industry_code: "45.2",
      scope: "division",
      period: "2024",
      operating_margin: 3,
      equity_ratio: 44.2,
      company_count: 3418,
    });
    expect(requestedUrls).toHaveLength(2);
    expect(requestedUrls[1]).toContain("tables/08171/data");
    expect(requestedUrls[1]).toContain("valueCodes%5BNACE2007%5D=45.2");
  });

  it("returns strengths, weaknesses and evidence gaps across companies", async () => {
    const fixtures = new Map<string, CompanyIntelligenceResult>([
      ["alpha", report({ org: "111111111", name: "Alpha Glass AS", revenue: 1_000, operatingResult: 220, equity: 500, totalAssets: 800, employees: 20, digitalSignals: 4, workforceOpenings: 4 })],
      ["beta", report({ org: "222222222", name: "Beta Glass AS", revenue: 1_000, operatingResult: 50, equity: 100, totalAssets: 800, employees: 6, digitalSignals: 1, workforceOpenings: 1 })],
    ]);
    const orchestrator = new ComparativeOrchestrator(
      async (query) => fixtures.get(query) ?? null,
      new BenchmarkEngine({ collect: async () => null })
    );

    const result = await orchestrator.compare(["alpha", "beta", "missing"]);

    expect(result.resolved).toBe(true);
    expect(result.unresolved).toEqual([{ query: "missing", error: "COMPANY_NOT_FOUND" }]);
    expect(result.report?.strengths.some((finding) => finding.org_number === "111111111" && finding.metric === "operating_margin")).toBe(true);
    expect(result.report?.weaknesses.some((finding) => finding.org_number === "222222222" && finding.metric === "operating_margin")).toBe(true);
    expect(result.report?.strengths.some((finding) => finding.org_number === "111111111" && finding.metric === "workforce_signals")).toBe(true);
    expect(result.report?.recommendations.some((recommendation) => recommendation.org_number === "222222222")).toBe(true);
  });

  it("does not produce a comparison when fewer than two companies resolve", async () => {
    const orchestrator = new ComparativeOrchestrator(
      async (query) => query === "alpha"
        ? report({ org: "111111111", name: "Alpha Glass AS", revenue: 1_000, operatingResult: 100 })
        : null,
      new BenchmarkEngine({ collect: async () => null })
    );

    const result = await orchestrator.compare(["alpha", "missing"]);

    expect(result.resolved).toBe(false);
    expect(result.report).toBeNull();
    expect(result.unresolved).toEqual([{ query: "missing", error: "COMPANY_NOT_FOUND" }]);
  });
});
