// evidence-graph.ts — Evidence Graph domain-modell (Fase 0)
//
// TypeScript-modeller + type-guards + validatorer for Evidence Graph.
// Håndhever designreglene:
//   Evidence → Hypothesis → Question  (aldri AI → Recommendation)
//   - Hver hypotese MÅ ha minst én supporting evidence (via hypothesis_evidence)
//   - AI-genererte spørsmål MÅ ha hypothesis_id
//   - Ingen Recommendation-type finnes i modellen (fravær er designet)

export type NodeType =
  | "COMPANY"
  | "PERSON"
  | "FINANCIAL_EVENT"
  | "DIGITAL_SIGNAL"
  | "MARKET_SIGNAL"
  | "WORKFORCE_SIGNAL"
  | "INDUSTRY_CONTEXT"
  | "EVIDENCE"
  | "HYPOTHESIS"
  | "QUESTION";

export type Confidence = "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";

export type EdgeRelationship =
  | "BELONGS_TO"
  | "HAS_FINANCIAL"
  | "HAS_SIGNAL"
  | "EVIDENCED_BY"
  | "SUPPORTS"
  | "GENERATES"
  | "ANSWERS";

export interface Company {
  id: string;
  org_number: string;
  name: string;
  industry_code: string | null;
  industry_name: string | null;
  tenant_id: string | null;
  created_at: string;
}

// Evidence Quality Model — hver node bærer kvalitet i selve feltet, ikke metadata.
export interface EvidenceNode {
  id: string;
  company_id: string;
  type: NodeType;
  value: string;              // observasjonen
  source: string;             // kilde
  confidence: Confidence;
  freshness: string | null;   // "2025" eller dato
  verified: boolean;          // Evidence Quality
  observed_at: string;
  metadata_json: string | null;
  tenant_id: string | null;
}

export interface EvidenceEdge {
  id: string;
  from_node: string;
  to_node: string;
  relationship: EdgeRelationship;
  confidence: Confidence;
  created_at: string;
}

export interface HypothesisEvidence {
  id: string;
  hypothesis_id: string;
  evidence_id: string;
  relationship_type: string;
  confidence: Confidence;
  created_at: string;
}

export interface Question {
  id: string;
  hypothesis_id: string | null;  // null = fritt (menneske); ikke-null = AI-generert
  question: string;
  information_gain: number;       // 0-100
  answered: boolean;
  created_at: string;
}

// ── Validatorer ─────────────────────────────────────────────

export class EvidenceGraphError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvidenceGraphError";
  }
}

/**
 * Regel 1: Hver HYPOTHESIS-node MÅ ha minst én kobling i hypothesis_evidence.
 * «Ingen AI-output uten evidence» — en hypotese uten kilde er ulovlig.
 */
export function validateHypothesisHasEvidence(
  hypothesis: EvidenceNode,
  hypothesisEvidenceLinks: HypothesisEvidence[]
): void {
  if (hypothesis.type !== "HYPOTHESIS") return; // kun hypoteser sjekkes
  const hasEvidence = hypothesisEvidenceLinks.some(
    (l) => l.hypothesis_id === hypothesis.id
  );
  if (!hasEvidence) {
    throw new EvidenceGraphError(
      `HYPOTHESIS ${hypothesis.id} mangler supporting evidence. En hypotese uten kilde er ulovlig (Evidence → Hypothesis → Question).`
    );
  }
}

/**
 * Regel 2: AI-genererte spørsmål MÅ ha hypothesis_id (ikke null).
 * Fritt spørsmål (menneske-initiert) kan ha null.
 */
export function validateAiQuestionHasHypothesis(
  question: Question,
  source: "AI" | "HUMAN"
): void {
  if (source === "AI" && question.hypothesis_id === null) {
    throw new EvidenceGraphError(
      `AI-generert spørsmål ${question.id} mangler hypothesis_id. AI-spørsmål MÅ komme fra en hypotese som er støttet av evidence.`
    );
  }
}

/**
 * Regel 3: En QUESTION-node skal ha en GENERATES-edge fra sin HYPOTHESIS.
 * (Edge-nivå validering — brukes når grafen bygges.)
 */
export function validateQuestionGeneratedByHypothesis(
  questionNode: EvidenceNode,
  edges: EvidenceEdge[]
): void {
  if (questionNode.type !== "QUESTION") return;
  const generatedBy = edges.some(
    (e) =>
      e.relationship === "GENERATES" &&
      e.to_node === questionNode.id
  );
  if (!generatedBy) {
    throw new EvidenceGraphError(
      `QUESTION-node ${questionNode.id} mangler GENERATES-edge fra en HYPOTHESIS.`
    );
  }
}
