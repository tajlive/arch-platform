// analyst.test.ts — enhetstest for ArchAnalyst (stateless, evidence-basert)
import { describe, it, expect, vi } from "vitest";
import {
  buildEvidenceBundle,
  buildPrompt,
  parseAnalystJson,
  callAnalystModel,
  estimateTokens,
  AnalystModel,
} from "../src/analyst";
import type { IntelligenceReport } from "../src/research-orchestrator";

// Minimal rapportere med verifisert evidens
function sampleReport(): IntelligenceReport {
  return {
    org_number: "951001880",
    company_name: "ALFA SKO AS",
    identity: { industry_code: "15.200", industry_name: "Produksjon av skotøy", employees: 23, municipality: "Oslo" },
    leadership: [],
    financial: { period_from: "2025-01-01", period_to: "2025-12-31", revenue: 146693681, operating_result: -19318991, equity: 30109263, total_assets: 133194811, currency: "NOK", audited: true },
    financial_history: { org_number: "951001880", years: [], trends: [], latest_year: "2025", data_points: 1 },
    digital: { website: "www.alfa.no", tech_stack: ["WordPress"], channels: ["Telefon"], has_booking: false, has_self_service: false, fetched: true },
    sources: [
      { key: "brreg-enhet", label: "Enhetsregisteret", status: "AVAILABLE" },
      { key: "brreg-regnskap", label: "Regnskapsregisteret", status: "AVAILABLE" },
      { key: "website", label: "Digital footprint", status: "AVAILABLE" },
    ],
    evidence_map: [],
    graph: {
      org_number: "951001880",
      company_name: "ALFA SKO AS",
      generated_at: new Date().toISOString(),
      evidence: [
        { type: "FINANCIAL_EVENT", observation: "operating margin -13.17%", source: "brreg-regnskap", observed_at: new Date().toISOString(), confidence: "VERIFIED", verified: true, dedupe_key: "x1" },
        { type: "COMPANY", observation: "23 ansatte", source: "brreg-enhet", observed_at: new Date().toISOString(), confidence: "VERIFIED", verified: true, dedupe_key: "x2" },
      ],
      rejected_evidence: [],
      coverage: { accepted: 2, rejected: 0, sources: 3 },
    },
  };
}

describe("buildEvidenceBundle", () => {
  it("bygger evidens-bundle fra verifisert evidenslag", () => {
    const bundle = buildEvidenceBundle(sampleReport());
    expect(bundle.company_name).toBe("ALFA SKO AS");
    expect(bundle.industry_code).toBe("15.200");
    expect(bundle.employees).toBe(23);
    expect(bundle.revenue).toBe(146693681);
    expect(bundle.operating_margin).toBeCloseTo(-13.17, 1);
    expect(bundle.equity_ratio).toBeCloseTo(22.61, 1);
    expect(bundle.evidence.length).toBe(2);
  });
});

describe("buildPrompt", () => {
  it("bygger prompt med kun tillatt evidens", () => {
    const prompt = buildPrompt(buildEvidenceBundle(sampleReport()), "salg");
    expect(prompt).toContain("ALFA SKO AS");
    expect(prompt).toContain("HARD REGEL");
    expect(prompt).toContain("evidence_refs");
    expect(prompt).toContain("brreg-regnskap");
  });
});

describe("parseAnalystJson", () => {
  it("parserer gyldig JSON og bevarer evidence-lenkede claims", () => {
    const raw = JSON.stringify({
      analyst: {
        summary: "Sterk egenkapital, svak margin.",
        strengths: [{ claim: "Solid egenkapital", evidence_refs: ["brreg-regnskap"] }],
        weaknesses: [{ claim: "Negativ margin", evidence_refs: ["brreg-regnskap"] }],
        priorities: [{ rank: 1, recommendation: "Forbedre margin", evidence_refs: ["brreg-regnskap"] }],
        unknowns: [{ question: "Har de nettbutikk?", why: "mangler digital evidens" }],
      },
    });
    const output = parseAnalystJson(raw, "951001880", "ALFA SKO AS", "nvidia", "nemotron", 100, 50);
    expect(output.analyst.strengths.length).toBe(1);
    expect(output.analyst.strengths[0].evidence_refs[0]).toBe("brreg-regnskap");
    expect(output.analyst.unknowns.length).toBe(1);
  });

  it("fjerner claims uten evidence_ref (0-fabrikasjon)", () => {
    const raw = JSON.stringify({
      analyst: {
        summary: "x",
        strengths: [
          { claim: "Har evidens", evidence_refs: ["brreg-regnskap"] },
          { claim: "FABRIKERT — ingen ref", evidence_refs: [] },
        ],
        weaknesses: [],
        priorities: [],
      },
    });
    const output = parseAnalystJson(raw, "951001880", "ALFA SKO AS", "nvidia", "nemotron", 0, 0);
    // Fabrikert claim uten evidence_ref må fjernes
    expect(output.analyst.strengths.length).toBe(1);
    expect(output.analyst.strengths[0].claim).toBe("Har evidens");
  });
});

describe("callAnalystModel", () => {
  it("kaller LLM og returnerer innhold (FAIL-OPEN ved feil)", async () => {
    const model: AnalystModel = { provider: "nvidia", baseUrl: "https://x", apiKey: "k", model: "m" };
    const fakeFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: '{"analyst":{"summary":"ok"}}' } }] }), { status: 200 }));
    globalThis.fetch = fakeFetch as unknown as typeof fetch;

    const content = await callAnalystModel(model, "prompt", 1200, 5000);
    expect(content).toContain("summary");
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it("kaster ved LLM-feil (FAIL-OPEN)", async () => {
    const model: AnalystModel = { provider: "nvidia", baseUrl: "https://x", apiKey: "k", model: "m" };
    const fakeFetch = vi.fn().mockResolvedValue(new Response("limit", { status: 429 }));
    globalThis.fetch = fakeFetch as unknown as typeof fetch;

    await expect(callAnalystModel(model, "prompt", 1200, 5000)).rejects.toThrow();
  });
});

describe("estimateTokens", () => {
  it("estimerer tokens fra tegn", () => {
    expect(estimateTokens("abc")).toBe(1);
    expect(estimateTokens("a".repeat(400))).toBe(100);
  });
});
