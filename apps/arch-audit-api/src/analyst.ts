// analyst.ts — ArchAnalyst (stateless LLM-analyse over evidenslag)
//
// PRINSIPP: ArchAnalyst TOLKER det evidenslaget som er verifisert — aldri gjetter.
// Deterministisk benchmark/comparative-motor fastslår målbare forskjeller;
// ArchAnalyst forklarer, utfordrer og prioriterer dem på norsk.
//
// RUTEN ER STATELESS:
//   - Ingen Durable Objects, ingen KV-state, ingen session-state
//   - Ren funksjon: {evidens} in → {analyse} out
//   - Hver forespørsel uavhengig (idempotent)
//
// HARD REGEL — ingen fabrikasjon (FAIL-CLOSED):
//   - Hver claim (strength/weakness/recommendation) MÅ ha minst én evidence_ref
//   - «Ukjent» er gyldig svar når evidens mangler — ALDRI oppfinn tall
//   - analyst-evals-gate avviser 0-evidence claims, leveres aldri til kunde
//
// FAIL-OPEN på LLM-feil:
//   - LLM timeout/429 → 503 med ærlig feil (ikke fabrikkert analyse)

import type { IntelligenceReport, CompanyIntelligenceGraph } from "./research-orchestrator";
import type { ComparativeReport } from "./comparative";

// ── Kontrakttyper ─────────────────────────────────────────────

export type FocusArea =
  | "salg"
  | "administrasjon"
  | "drift"
  | "dokumentasjon"
  | "kundekommunikasjon";

export interface AnalystClaim {
  claim: string;
  evidence_refs: string[];
}

export interface AnalystPriority {
  rank: number;
  recommendation: string;
  evidence_refs: string[];
}

export interface AnalystUnknown {
  question: string;
  why: string; // hva evidens mangler
}

export interface AnalystOutput {
  org_number: string;
  company_name: string;
  generated_at: string;
  analyst: {
    summary: string;
    strengths: AnalystClaim[];
    weaknesses: AnalystClaim[];
    priorities: AnalystPriority[];
    unknowns: AnalystUnknown[];
  };
  model: {
    provider: string;
    model: string;
    tokens: { input: number; output: number };
  };
  provenance: {
    evidence_sources: string[];
  };
}

export interface AnalystInput {
  org_number: string;
  focus_area?: FocusArea;
  comparative_context?: string[];
}

export type AnalystResult =
  | { ok: true; output: AnalystOutput }
  | { ok: false; error: "LLM_FAILED" | "COMPANY_NOT_FOUND" | "INVALID" };

// ── Evidensekstraksjon fra IntelligenceReport ─────────────────

export interface EvidenceBundle {
  org_number: string;
  company_name: string;
  industry_code?: string;
  industry_name?: string;
  employees?: number;
  municipality?: string;
  revenue?: number;
  operating_margin?: number;
  equity_ratio?: number;
  digital_score?: number;
  workforce_count?: number;
  financial_history?: {
    years: number;
    latest_year?: string;
    revenue_trend?: Array<{ year: string; value: number | null }>;
  };
  sources: Array<{ key: string; label: string; status: string }>;
  evidence: Array<{ type: string; observation: string; source: string }>;
  comparative?: ComparativeReport;
}

/** Bygg et kompakt evidens-bundle fra IntelligenceReport (kun verifiserte kilder). */
export function buildEvidenceBundle(report: IntelligenceReport): EvidenceBundle {
  const evidence: Array<{ type: string; observation: string; source: string }> = report.graph?.evidence
    ?.filter((e) => e.verified && e.source)
    ?.map((e) => ({ type: e.type ?? "EVIDENCE", observation: e.observation, source: e.source ?? "ukjent" }))
    ?? [];

  const workforceMetrics = report.sources?.find((s) => s.key === "nav-arbeidsplassen");
  const financial = report.financial;
  const history = report.financial_history;

  return {
    org_number: report.org_number,
    company_name: report.company_name,
    industry_code: report.identity?.industry_code,
    industry_name: report.identity?.industry_name,
    employees: report.identity?.employees,
    municipality: report.identity?.municipality,
    revenue: financial?.revenue,
    operating_margin: financial?.revenue && financial?.operating_result !== undefined
      ? Math.round((financial.operating_result / financial.revenue) * 10000) / 100
      : undefined,
    equity_ratio: financial?.total_assets && financial?.equity !== undefined
      ? Math.round((financial.equity / financial.total_assets) * 10000) / 100
      : undefined,
    digital_score: report.digital?.fetched
      ? (report.digital.tech_stack?.length ?? 0) * 10 + (report.digital.has_booking ? 5 : 0)
      : undefined,
    workforce_count: workforceMetrics?.status === "AVAILABLE"
      ? evidence.filter((e) => e.type === "WORKFORCE_SIGNAL").length
      : undefined,
    financial_history: history
      ? {
          years: history.data_points,
          latest_year: history.latest_year,
          revenue_trend: history.trends?.find((t) => t.key === "revenue")?.values,
        }
      : undefined,
    sources: report.sources ?? [],
    evidence,
  };
}

// ── Evidenskilder som LLM har lov til å bruke ─────────────────

const ALLOWED_EVIDENCE_SOURCES = new Set([
  "brreg-enhet",
  "brreg-roller",
  "brreg-regnskap",
  "brreg-regnskap-historikk",
  "website",
  "nav-arbeidsplassen",
  "brreg",
]);

/** Filtrer evidens til KUN tillatte kilder (aldri NOT_AVAILABLE/ERROR). */
export function allowedEvidence(bundle: EvidenceBundle): Array<{ type: string; observation: string; source: string }> {
  return bundle.evidence.filter((e) => ALLOWED_EVIDENCE_SOURCES.has(e.source));
}

// ── prompt-bygging ────────────────────────────────────────────

export function buildPrompt(bundle: EvidenceBundle, focusArea: FocusArea): string {
  const evidence = allowedEvidence(bundle);
  const sourceLines = evidence.slice(0, 30).map((e) => `- [${e.source}] ${e.observation}`).join("\n");
  const sourceStatus = bundle.sources
    .map((s) => `${s.key}=${s.status}`)
    .filter((s) => !s.includes("NOT_AVAILABLE") && !s.includes("ERROR"))
    .join(", ");

  return [
    "Du er ArchAnalyst — en analytiker som KUN bruker dokumentert evidens.",
    "HARD REGEL: Du SKAL ALDRI finne opp tall eller påstander. Hvis evidens mangler,",
    "skriv «ukjent». Hver påstand MÅ ha minst én evidence_ref fra kildene under.",
    "",
    `Firma: ${bundle.company_name} (${bundle.org_number})`,
    `NACE: ${bundle.industry_code ?? "ukjent"} — ${bundle.industry_name ?? "ukjent"}`,
    `Fokusområde: ${focusArea}`,
    "",
    "VERIFISERT EVIDENS:",
    sourceLines || "  (ingen verifisert evidens)",
    "",
    "Svar i JSON (norsk), streng skjema:",
    JSON.stringify({
      summary: "norsk syntese",
      strengths: [{ claim: "påstand", evidence_refs: ["kilde"] }],
      weaknesses: [{ claim: "påstand", evidence_refs: ["kilde"] }],
      priorities: [{ rank: 1, recommendation: "anbefaling", evidence_refs: ["kilde"] }],
      unknowns: [{ question: "spørsmål", why: "hvorfor evidens mangler" }],
    }),
  ].join("\n");
}

// ── LLM-kall (stateless, FAIL-OPEN) ───────────────────────────

export interface AnalystModel {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

/**
 * Kall LLM (NVIDIA NIM OpenAI-kompatibelt). Temperatura=0 for reproduserbarhet.
 * FAIL-OPEN: kaster ved timeout/429 slik at ruten returnerer 503 (ikke fabrikasjon).
 */
export async function callAnalystModel(
  model: AnalystModel,
  prompt: string,
  maxOutputTokens = 1200,
  timeoutMs = 15_000
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(`${model.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify({
        model: model.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: maxOutputTokens,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
    if (!resp.ok) {
      throw new Error(`LLM HTTP ${resp.status}`);
    }
    const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("LLM returnerte tomt svar");
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

// ── Parse og valider (FAIL-CLOSED på fabrikasjon) ─────────────

export function parseAnalystJson(raw: string, orgNumber: string, companyName: string, provider: string, model: string, inputTokens: number, outputTokens: number): AnalystOutput {
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = JSON.parse(extractJsonObject(raw));
  }
  const analyst = parsed?.analyst ?? parsed;

  const clean = (arr: any[], field: string, requiredRefs = true): AnalystClaim[] => {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => ({
        claim: String(item?.claim ?? item?.[field] ?? "").trim(),
        evidence_refs: Array.isArray(item?.evidence_refs) ? item.evidence_refs.map(String) : [],
      }))
      .filter((item) => item.claim.length > 0 && (!requiredRefs || item.evidence_refs.length > 0));
  };

  const strengths = clean(analyst?.strengths, "claim");
  const weaknesses = clean(analyst?.weaknesses, "claim");
  const priorities = (Array.isArray(analyst?.priorities) ? analyst.priorities : [])
    .map((p: any, idx: number) => ({
      rank: Number(p?.rank ?? idx + 1),
      recommendation: String(p?.recommendation ?? "").trim(),
      evidence_refs: Array.isArray(p?.evidence_refs) ? p.evidence_refs.map(String) : [],
    }))
    .filter((p: AnalystPriority) => p.recommendation.length > 0 && p.evidence_refs.length > 0);
  const unknowns = (Array.isArray(analyst?.unknowns) ? analyst.unknowns : [])
    .map((u: any) => ({ question: String(u?.question ?? "").trim(), why: String(u?.why ?? "").trim() }))
    .filter((u: AnalystUnknown) => u.question.length > 0);

  return {
    org_number: orgNumber,
    company_name: companyName,
    generated_at: new Date().toISOString(),
    analyst: {
      summary: String(analyst?.summary ?? "").trim() || "Ingen verifisert syntese tilgjengelig.",
      strengths,
      weaknesses,
      priorities,
      unknowns,
    },
    model: { provider, model, tokens: { input: inputTokens, output: outputTokens } },
    provenance: { evidence_sources: ["brreg-enhet", "brreg-regnskap", "peer-group", "nav-arbeidsplassen", "website"] },
  };
}

function extractJsonObject(raw: string): string {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) return raw.slice(start, end + 1);
  throw new Error("Ugyldig JSON-respons fra LLM");
}

/** Estimér tokens fra tegn (ca. 4 tegn/token). */
export function estimateTokens(text: string): number {
  return Math.round(text.length / 4);
}
