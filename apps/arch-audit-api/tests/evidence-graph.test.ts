import { describe, it, expect } from "vitest";
import {
  EvidenceNode,
  HypothesisEvidence,
  Question,
  EvidenceEdge,
  validateHypothesisHasEvidence,
  validateAiQuestionHasHypothesis,
  validateQuestionGeneratedByHypothesis,
  EvidenceGraphError,
  EvidenceValidator,
  RawEvidence,
} from "../src/evidence-graph";

// Hjelpere for å bygge test-noder
function node(overrides: Partial<EvidenceNode>): EvidenceNode {
  return {
    id: "n1",
    company_id: "c1",
    type: "EVIDENCE",
    value: "value",
    source: "source",
    confidence: "HIGH",
    freshness: "2025",
    verified: true,
    observed_at: "2026-08-20T12:00:00Z",
    metadata_json: null,
    tenant_id: null,
    is_synthetic: false,
    environment: "production",
    ...overrides,
  };
}

function link(hypothesis_id: string, evidence_id: string): HypothesisEvidence {
  return {
    id: "l1",
    hypothesis_id,
    evidence_id,
    relationship_type: "SUPPORTS",
    confidence: "HIGH",
    created_at: "2026-08-20T12:00:00Z",
  };
}

describe("Evidence Graph — designregler", () => {
  it("REGLER: hypotese MED evidence er lovlig", () => {
    const h = node({ id: "h1", type: "HYPOTHESIS", value: "Customer communication may contain manual workflows" });
    const links = [link("h1", "e1")];
    expect(() => validateHypothesisHasEvidence(h, links)).not.toThrow();
  });

  it("REGLER: hypotese UTEN evidence er ULovlig (Evidence → Hypothesis)", () => {
    const h = node({ id: "h1", type: "HYPOTHESIS", value: "Customer communication may contain manual workflows" });
    expect(() => validateHypothesisHasEvidence(h, [])).toThrow(EvidenceGraphError);
    expect(() => validateHypothesisHasEvidence(h, [])).toThrow(/mangler supporting evidence/);
  });

  it("REGLER: AI-spørsmål MÅ ha hypothesis_id (ikke null)", () => {
    const q: Question = {
      id: "q1", hypothesis_id: null, question: "How can we help?", information_gain: 0, answered: false, created_at: "2026-08-20T12:00:00Z",
    };
    expect(() => validateAiQuestionHasHypothesis(q, "AI")).toThrow(EvidenceGraphError);
    expect(() => validateAiQuestionHasHypothesis(q, "AI")).toThrow(/mangler hypothesis_id/);
  });

  it("REGLER: AI-spørsmål MED hypothesis_id er lovlig", () => {
    const q: Question = {
      id: "q1", hypothesis_id: "h1", question: "Which workflows are hardest to scale?", information_gain: 70, answered: false, created_at: "2026-08-20T12:00:00Z",
    };
    expect(() => validateAiQuestionHasHypothesis(q, "AI")).not.toThrow();
  });

  it("REGLER: menneske-initiert fritt spørsmål kan ha null hypothesis", () => {
    const q: Question = {
      id: "q1", hypothesis_id: null, question: "Free question", information_gain: 0, answered: false, created_at: "2026-08-20T12:00:00Z",
    };
    expect(() => validateAiQuestionHasHypothesis(q, "HUMAN")).not.toThrow();
  });

  it("REGLER: QUESTION-node MÅ ha GENERATES-edge fra hypotese", () => {
    const q = node({ id: "q1", type: "QUESTION", value: "Which workflows are hardest to scale?" });
    const edges: EvidenceEdge[] = [
      { id: "e1", from_node: "h1", to_node: "q1", relationship: "GENERATES", confidence: "HIGH", created_at: "2026-08-20T12:00:00Z" },
    ];
    expect(() => validateQuestionGeneratedByHypothesis(q, edges)).not.toThrow();
  });

  it("REGLER: QUESTION-node UTEN GENERATES-edge er ulovlig", () => {
    const q = node({ id: "q1", type: "QUESTION", value: "Which workflows are hardest to scale?" });
    expect(() => validateQuestionGeneratedByHypothesis(q, [])).toThrow(EvidenceGraphError);
  });

  it("REGLER: ikke-HYPOTHESIS-noder hoppes (ingen falsk positiv)", () => {
    const e = node({ id: "e1", type: "EVIDENCE", value: "Annual accounts 2025" });
    expect(() => validateHypothesisHasEvidence(e, [])).not.toThrow();
  });
});

describe("Research Orchestrator — Raw Evidence Validator", () => {
  const valid: RawEvidence = {
    type: "COMPANY",
    observation: "ARCH AS has organisation number 123456789",
    source: "brreg-enhet",
    observed_at: "2026-08-20T12:00:00Z",
    confidence: "HIGH",
  };

  it("aksepterer evidence med source, timestamp og confidence", () => {
    const result = new EvidenceValidator().validate([valid]);
    expect(result.accepted).toHaveLength(1);
    expect(result.rejected).toHaveLength(0);
    expect(result.accepted[0].verified).toBe(true);
    expect(result.accepted[0].dedupe_key).toContain("brreg-enhet");
  });

  it("avviser evidence uten source", () => {
    const result = new EvidenceValidator().validate([{ ...valid, source: null }]);
    expect(result.accepted).toHaveLength(0);
    expect(result.rejected[0].code).toBe("MISSING_SOURCE");
  });

  it("avviser evidence uten timestamp", () => {
    const result = new EvidenceValidator().validate([{ ...valid, observed_at: null }]);
    expect(result.accepted).toHaveLength(0);
    expect(result.rejected[0].code).toBe("MISSING_TIMESTAMP");
  });

  it("avviser evidence uten confidence", () => {
    const result = new EvidenceValidator().validate([{ ...valid, confidence: null }]);
    expect(result.accepted).toHaveLength(0);
    expect(result.rejected[0].code).toBe("MISSING_CONFIDENCE");
  });

  it("avviser duplikater før graph-build", () => {
    const result = new EvidenceValidator().validate([valid, { ...valid }]);
    expect(result.accepted).toHaveLength(1);
    expect(result.rejected[0].code).toBe("DUPLICATE_EVIDENCE");
  });
});
