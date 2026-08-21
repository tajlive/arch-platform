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

/** FACT/INTERPRETATION/HYPOTHESIS — provenance-ærlighet på hvert funn. */
export type FindingKind = "FACT" | "INTERPRETATION" | "HYPOTHESIS";

/** Innsatsnivå for tiltak (ny systemprompt 2026). */
export type EffortLevel = "low" | "medium" | "high";

/** Tidshorisont i dager (30/90/180). */
export type TimeHorizon = 30 | 90 | 180;

export interface AnalystClaim {
  claim: string;
  evidence_refs: string[];
  /** FACT = direkte observert, INTERPRETATION = støttet av facts, HYPOTHESIS = må valideres */
  kind: FindingKind;
}

export interface AnalystPriority {
  rank: number;
  /** Konkret tiltak */
  recommendation: string;
  /** Forventet effekt av tiltaket */
  expected_effect: string;
  /** Innsats: lav/medium/høy */
  effort: EffortLevel;
  /** Tidshorisont i dager: 30/90/180 */
  time_horizon: TimeHorizon;
  /** Obligatorisk — minst én */
  evidence_refs: string[];
  /** Usikkerheter knyttet til tiltaket */
  uncertainties: string[];
  /** Hva som må undersøkes før tiltaket gjennomføres */
  pre_work: string[];
  /** Klassifisering av anbefalingen */
  kind: FindingKind;
}

export interface AnalystUnknown {
  question: string;
  why: string; // hva evidens mangler
}

export interface BenchmarkDelta {
  metric: string;
  label: string;
  company_value: number | null;
  peer_median: number | null;
  delta: number | null; // company - median
  direction: "above" | "below" | "at" | "unknown";
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
    /** Beslutningsstøtte-merking — finans/juss/kreditt er ikke rådgivning */
    disclaimer: string;
    benchmark_deltas: BenchmarkDelta[];
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

export function buildPrompt(bundle: EvidenceBundle, focusArea: FocusArea, benchmarkDeltas: BenchmarkDelta[] = []): string {
  const evidence = allowedEvidence(bundle);
  // Kap antall evidens-linjer til 12 for å holde LLM-kall innenfor Workers 30s-limit
  const sourceLines = evidence.slice(0, 12).map((e) => `- [${e.source}] ${e.observation}`).join("\n");
  const sourceStatus = bundle.sources
    .map((s) => `${s.key}=${s.status}`)
    .filter((s) => !s.includes("NOT_AVAILABLE") && !s.includes("ERROR"))
    .join(", ");

  // Benchmark-avvik: deterministisk input som ArchAnalyst forklarer
  const benchmarkLines = benchmarkDeltas.length
    ? benchmarkDeltas.map((d) => `- ${d.label}: selskap=${d.company_value ?? "ukjent"}, peer-median=${d.peer_median ?? "ukjent"}, avvik=${d.delta ?? "ukjent"} (${d.direction})`).join("\n")
    : "(ingen benchmark-avvik beregnet)";

  return [
    "Du er ArchAnalyst — en analytiker som KUN bruker dokumentert evidens.",
    "HARD REGEL: Du SKAL ALDRI finne opp tall eller påstander. Hvis evidens mangler,",
    "skriv «ukjent». Hver påstand MÅ ha minst én evidence_ref fra kildene under.",
    "",
    "KLASSIFISER hvert funn som:",
    "- FACT: direkte observert fra kilde",
    "- INTERPRETATION: forklaring støttet av facts",
    "- HYPOTHESIS: mulig forklaring som må valideres (ALDRI presenter som FACT)",
    "",
    `Firma: ${bundle.company_name} (${bundle.org_number})`,
    `NACE: ${bundle.industry_code ?? "ukjent"} — ${bundle.industry_name ?? "ukjent"}`,
    `Fokusområde: ${focusArea}`,
    "",
    "BENCHMARK-AVVIK (mot peer-median):",
    benchmarkLines,
    "",
    "VERIFISERT EVIDENS:",
    sourceLines || "  (ingen verifisert evidens)",
    "",
    "Svar i JSON (norsk), streng skjema. evidence_refs SKAL være rene kildenavn uten [klammer].",
    "Hver priority MÅ ha expected_effect, effort (low/medium/high),",
    "time_horizon (30/90/180 dager), uncertainties og pre_work (hva må undersøkes før tiltak):",
    JSON.stringify({
      summary: "norsk syntese",
      strengths: [{ claim: "påstand", evidence_refs: ["kilde"], kind: "FACT" }],
      weaknesses: [{ claim: "påstand", evidence_refs: ["kilde"], kind: "INTERPRETATION" }],
      priorities: [{
        rank: 1,
        recommendation: "konkret tiltak",
        expected_effect: "forventet effekt",
        effort: "medium",
        time_horizon: 90,
        evidence_refs: ["kilde"],
        uncertainties: ["usikkerhet"],
        pre_work: ["hva som må undersøkes først"],
        kind: "HYPOTHESIS"
      }],
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
        // Avslå reasoning: gjør Nemotron vesentlig raskere (~7s vs ~16s) og
        // plasserer JSON i `content` (ikke reasoning_content) — holder innenfor Workers-limit.
        reasoning_effort: "none",
      }),
      signal: controller.signal,
    });
    if (!resp.ok) {
      throw new Error(`LLM HTTP ${resp.status}`);
    }
    const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string; reasoning_content?: string } }> };
    const msg = data.choices?.[0]?.message;
    // NVIDIA Nemotron (med reasoning) legger JSON-syntesen i `reasoning_content`,
    // mens `content` ofte inneholder tankeprosessen. Velg JSON-holdig felt.
    const content = msg?.content;
    const reasoning = msg?.reasoning_content;
    const jsonCandidate = looksLikeJson(content) ? content : looksLikeJson(reasoning) ? reasoning : content;
    if (!jsonCandidate) throw new Error("LLM returnerte tomt svar");
    return jsonCandidate;
  } finally {
    clearTimeout(timeout);
  }
}

// ── Parse og valider (FAIL-CLOSED på fabrikasjon) ─────────────

/** Sjekk om en streng ser ut som JSON (starter med { og parses). */
function looksLikeJson(text: string | undefined | null): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed.startsWith("{")) return false;
  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    // Kan inneholde markdown-fence — prøv å ekstrahere
    try {
      JSON.parse(extractJsonObject(trimmed));
      return true;
    } catch {
      return false;
    }
  }
}

export function parseAnalystJson(raw: string, orgNumber: string, companyName: string, provider: string, model: string, inputTokens: number, outputTokens: number, benchmarkDeltas: BenchmarkDelta[] = []): AnalystOutput {
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = JSON.parse(extractJsonObject(raw));
  }
  const analyst = parsed?.analyst ?? parsed;

  // Normaliser kind til gyldig verdi — HYPOTHESIS skal aldri presenteres som FACT
  const normalizeKind = (value: unknown): FindingKind => {
    const kind = String(value ?? "").trim().toUpperCase();
    if (kind === "FACT" || kind === "INTERPRETATION" || kind === "HYPOTHESIS") return kind;
    // Fallback: claims med evidence_refs = INTERPRETATION, uten = HYPOTHESIS
    return "INTERPRETATION";
  };

  // Normaliser evidence_refs — fjern [brackets] og trim (LLM kopierer ofte prompt-formatet)
  const normalizeRefs = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value
      .map((r) => String(r).trim().replace(/^\[|\]$/g, "").trim())
      .filter(Boolean);
  };

  const clean = (arr: any[], field: string, requiredRefs = true): AnalystClaim[] => {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => ({
        claim: String(item?.claim ?? item?.[field] ?? "").trim(),
        evidence_refs: normalizeRefs(item?.evidence_refs),
        kind: normalizeKind(item?.kind),
      }))
      .filter((item) => item.claim.length > 0 && (!requiredRefs || item.evidence_refs.length > 0));
  };

  const normalizeEffort = (value: unknown): EffortLevel => {
    const effort = String(value ?? "").trim().toLowerCase();
    return effort === "low" || effort === "medium" || effort === "high" ? effort : "medium";
  };

  const normalizeHorizon = (value: unknown): TimeHorizon => {
    const n = Number(value);
    return n === 30 || n === 90 || n === 180 ? n : 90;
  };

  const strengths = clean(analyst?.strengths, "claim");
  const weaknesses = clean(analyst?.weaknesses, "claim");
  const priorities = (Array.isArray(analyst?.priorities) ? analyst.priorities : [])
    .map((p: any, idx: number): AnalystPriority => ({
      rank: Number(p?.rank ?? idx + 1),
      recommendation: String(p?.recommendation ?? "").trim(),
      expected_effect: String(p?.expected_effect ?? p?.effect ?? "").trim(),
      effort: normalizeEffort(p?.effort),
      time_horizon: normalizeHorizon(p?.time_horizon ?? p?.horizon),
      evidence_refs: normalizeRefs(p?.evidence_refs),
      uncertainties: Array.isArray(p?.uncertainties) ? p.uncertainties.map(String).filter(Boolean) : [],
      pre_work: Array.isArray(p?.pre_work) ? p.pre_work.map(String).filter(Boolean) : [],
      kind: normalizeKind(p?.kind),
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
    provenance: {
      evidence_sources: ["brreg-enhet", "brreg-regnskap", "peer-group", "nav-arbeidsplassen", "website"],
      disclaimer:
        "Denne analysen er beslutningsstøtte basert på offentlige registre, ikke finansiell, juridisk eller kredittrådgivning. Verifiser forholdene mot primærkilder før beslutninger.",
      benchmark_deltas: benchmarkDeltas,
    },
  };
}

function extractJsonObject(raw: string): string {
  // Fjern markdown-code-fences (```json ... ``` eller ``` ... ```)
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  // Finn første { og siste } — ta JSON-objektet mellom dem
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const candidate = cleaned.slice(start, end + 1);
    // Valider at det faktisk er parsebar JSON — prøv direkte, ellers balanser braces
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // Prøv å balansere ved å fjerne tekst utenfor topp-nivå
      let depth = 0;
      for (let i = 0; i < candidate.length; i++) {
        if (candidate[i] === "{") depth++;
        else if (candidate[i] === "}") {
          depth--;
          if (depth === 0) {
            const inner = candidate.slice(0, i + 1);
            try { JSON.parse(inner); return inner; } catch { /* fortsett */ }
          }
        }
      }
    }
  }
  throw new Error(`Ugyldig JSON-respons fra LLM (første 200 tegn: ${raw.slice(0, 200)})`);
}

/** Estimér tokens fra tegn (ca. 4 tegn/token). */
export function estimateTokens(text: string): number {
  return Math.round(text.length / 4);
}
