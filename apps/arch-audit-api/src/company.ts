// company.ts — PublicCompanyContext persistence + question generation

import type { D1Database } from "@cloudflare/workers-types";
import { BrregAdapter, BrregCompany } from "./adapters";
import { EvidenceEngine, IntelligenceReport } from "./evidence-engine";
import { PublicCompanyContextRow, QuestionPurpose } from "./types";
import { randomId } from "./utils";

export class CompanyService {
  constructor(private db: D1Database) {}

  private adapter = new BrregAdapter();
  private engine = new EvidenceEngine();

  async resolve(query: string): Promise<{ company: BrregCompany; contextId: string }> {
    const result = await this.adapter.fetch({ query });
    if (!result.data) {
      throw new Error("COMPANY_NOT_FOUND");
    }

    const company = result.data;

    // Sjekk cache (samme org_number, ikke utgått)
    const cached = await this.db
      .prepare(`SELECT * FROM public_company_contexts WHERE org_number = ? ORDER BY fetched_at DESC LIMIT 1`)
      .bind(company.org_number)
      .first<PublicCompanyContextRow>();

    if (cached && cached.expires_at && new Date(cached.expires_at).getTime() > Date.now()) {
      return { company, contextId: cached.id };
    }

    // Opprett ny context
    const contextId = randomId(16);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dager

    await this.db
      .prepare(
        `INSERT INTO public_company_contexts
          (id, org_number, company_name, industry_code, industry_name, context_json, confidence, sources_json, fetched_at, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        contextId,
        company.org_number,
        company.company_name,
        company.industry_code ?? null,
        company.industry_name ?? null,
        JSON.stringify(company),
        result.confidence,
        JSON.stringify([{ source: result.source, fetched_at: result.fetched_at }]),
        now.toISOString(),
        expiresAt.toISOString()
      )
      .run();

    return { company, contextId };
  }

  /**
   * Evidence Engine v1 — samler alle tilgjengelige datakilder til én rapport.
   * Returnerer null (ikke throw) hvis selskapet ikke finnes.
   */
  async intelligence(query: string): Promise<{ company: BrregCompany; report: IntelligenceReport } | null> {
    try {
      return await this.engine.analyze(query);
    } catch (e) {
      if ((e as Error).message === "COMPANY_NOT_FOUND") return null;
      throw e;
    }
  }

  /**
   * Genererer det FØRSTE context-aware spørsmålet basert på PublicCompanyContext.
   * I P1B er dette deterministisk (ikke LLM). Når ekte model-integration kommer,
   * erstattes dette med LLM + QuestionDecision-trace + evals.
   */
  async firstQuestion(company: BrregCompany): Promise<{
    question: string;
    reason: string;
    target_unknown: string;
    expected_information_gain: number;
    required_for: QuestionPurpose;
  }> {
    // Deterministisk første spørsmål — bruker det vi VET fra Brønnøysund.
    // Vi spør om noe offentlige data IKKE kan fortelle oss: hvor arbeidet faktisk oppstår.
    return {
      question: `Jeg har funnet ${company.company_name} (${company.industry_name ?? "næring ukjent"}). Før jeg vurderer automatisering: Hvor kommer flest nye kundehenvendelser inn i dag?`,
      reason: "Offentlige data viser bransje og størrelse, men ikke hvor arbeidsintensive prosesser faktisk er. Dette er første skillende usikkerhet.",
      target_unknown: "primary_customer_inbound_channel",
      expected_information_gain: 60,
      required_for: "IDENTIFY_PROCESS",
    };
  }
}
