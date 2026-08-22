import { BrregAdapter, BrregCompany } from "./adapters";
import {
  EvidenceValidationIssue,
  EvidenceValidator,
  RawEvidence,
  ValidatedEvidence,
} from "./evidence-graph";
import { NavAdapter } from "./collectors/nav";
import { BrregFinancialHistoryCollector, FinancialHistory } from "./collectors/brreg-financial-history";
import { SsbWageContextCollector, WageContext } from "./collectors/ssb-wage-context";
import { CompanyWebDiscoveryCollector, type DigitalFootprint } from "./collectors/company-web";
import { NewsSignalCollector, type NewsSignal } from "./collectors/news-signals";

export type { DigitalFootprint } from "./collectors/company-web";
export type { NewsSignal } from "./collectors/news-signals";

export interface FinancialProfile {
  period_from: string;
  period_to: string;
  currency: string;
  revenue?: number;
  operating_result?: number;
  net_result?: number;
  equity?: number;
  total_assets?: number;
  total_liabilities?: number;
  audited: boolean;
  accounting_standard?: string;
}

export interface LeadershipRole {
  role_type: string;
  role_description: string;
  person_name?: string;
}

export type SourceStatus = "AVAILABLE" | "NOT_AVAILABLE" | "EMPTY" | "ERROR";

export interface EvidenceSource {
  key: string;
  label: string;
  status: SourceStatus;
  fetched_at?: string;
  note?: string;
}

export interface CompanyIntelligenceGraph {
  org_number: string;
  company_name: string;
  generated_at: string;
  evidence: ValidatedEvidence[];
  rejected_evidence: EvidenceValidationIssue[];
  coverage: {
    accepted: number;
    rejected: number;
    sources: number;
  };
}

export interface IntelligenceReport {
  org_number: string;
  company_name: string;
  identity: {
    org_form?: string;
    industry_code?: string;
    industry_name?: string;
    employees?: number;
    municipality?: string;
    registered_at?: string;
  };
  leadership: LeadershipRole[];
  financial: FinancialProfile | null;
  /** Sprint 4: historisk regnskapsserie med trender (valgfritt supplement) */
  financial_history?: FinancialHistory | null;
  /** Offentlig, aggregert lønns- og arbeidskraftkontekst fra SSB. */
  wage_context?: WageContext | null;
  digital: DigitalFootprint | null;
  /** Tydelig navnematchede omtaler fra en offentlig RSS-kilde. */
  news_signals?: NewsSignal[];
  sources: EvidenceSource[];
  evidence_map: { stage: string; status: "done" | "pending" | "not_available" }[];
  graph: CompanyIntelligenceGraph;
}

interface CollectorResult {
  raw: RawEvidence[];
  source: EvidenceSource;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function getRecord(obj: Record<string, unknown>, key: string): Record<string, unknown> {
  return asRecord(obj[key]);
}

function getString(obj: Record<string, unknown>, key: string): string | undefined {
  const value = obj[key];
  return typeof value === "string" ? value : undefined;
}

function getNumber(obj: Record<string, unknown>, key: string): number | undefined {
  const value = obj[key];
  return typeof value === "number" ? value : undefined;
}

function getBoolean(obj: Record<string, unknown>, key: string): boolean | undefined {
  const value = obj[key];
  return typeof value === "boolean" ? value : undefined;
}

async function fetchFinancial(orgNumber: string): Promise<FinancialProfile | null> {
  try {
    const resp = await fetch(
      `https://data.brreg.no/regnskapsregisteret/regnskap/${orgNumber}`,
      { headers: { "Accept": "application/json", "User-Agent": "Arch-Audit/0.1" } }
    );
    if (!resp.ok) return null;
    const value = await resp.json<unknown>();
    if (!Array.isArray(value) || value.length === 0) return null;

    const ra = asRecord(value[0]);
    const rr = getRecord(ra, "resultatregnskapResultat");
    const eg = getRecord(ra, "egenkapitalGjeld");
    const ei = getRecord(ra, "eiendeler");
    const driftsresultat = getRecord(rr, "driftsresultat");
    const driftsinntekter = getRecord(rr, "driftsinntekter");
    const revisjon = getRecord(ra, "revisjon");
    const regnskapsperiode = getRecord(ra, "regnskapsperiode");
    const regnskapsprinsipper = getRecord(ra, "regnkapsprinsipper");

    return {
      period_from: getString(regnskapsperiode, "fraDato") ?? "",
      period_to: getString(regnskapsperiode, "tilDato") ?? "",
      currency: getString(ra, "valuta") ?? "NOK",
      revenue: getNumber(rr, "sumDriftsinntekter") ?? getNumber(driftsinntekter, "sumDriftsinntekter"),
      operating_result: getNumber(driftsresultat, "driftsresultat"),
      net_result: getNumber(rr, "aarsresultat"),
      equity: getNumber(getRecord(eg, "egenkapital"), "sumEgenkapital"),
      total_assets: getNumber(ei, "sumEiendeler"),
      total_liabilities: getNumber(getRecord(eg, "gjeldOversikt"), "sumGjeld"),
      audited: !(getBoolean(revisjon, "fravalgRevisjon") ?? false),
      accounting_standard: getString(regnskapsprinsipper, "regnskapsregler"),
    };
  } catch {
    return null;
  }
}

function collectIdentity(company: BrregCompany, fetchedAt: string): CollectorResult {
  const raw: RawEvidence[] = [
    {
      type: "COMPANY",
      observation: `${company.company_name} has organisation number ${company.org_number}`,
      source: "brreg-enhet",
      observed_at: fetchedAt,
      confidence: "HIGH",
      metadata: {
        org_number: company.org_number,
        org_form: company.org_form ?? null,
        industry_code: company.industry_code ?? null,
        industry_name: company.industry_name ?? null,
      },
    },
  ];

  if (company.employees !== undefined) {
    raw.push({
      type: "COMPANY",
      observation: `${company.company_name} has ${company.employees} registered employees`,
      source: "brreg-enhet",
      observed_at: fetchedAt,
      confidence: "HIGH",
      metadata: { employees: company.employees },
    });
  }

  return {
    raw,
    source: { key: "brreg-enhet", label: "Company identity", status: "AVAILABLE", fetched_at: fetchedAt },
  };
}

function collectLeadership(company: BrregCompany, fetchedAt: string): CollectorResult {
  const roles = company.roles ?? [];
  return {
    raw: roles.map((role) => ({
      type: "PERSON",
      observation: `${role.person_name ?? "Unknown person"} has role ${role.role_description}`,
      source: "brreg-roller",
      observed_at: fetchedAt,
      confidence: "HIGH",
      metadata: {
        role_type: role.role_type,
        role_description: role.role_description,
        person_name: role.person_name ?? null,
      },
    })),
    source: {
      key: "brreg-roller",
      label: "Leadership & governance",
      status: roles.length ? "AVAILABLE" : "EMPTY",
      fetched_at: fetchedAt,
    },
  };
}

function collectFinancial(financial: FinancialProfile | null, fetchedAt: string): CollectorResult {
  if (!financial) {
    return {
      raw: [],
      source: { key: "brreg-regnskap", label: "Financial profile", status: "EMPTY", fetched_at: fetchedAt },
    };
  }

  const raw: RawEvidence[] = [];
  if (financial.revenue !== undefined) {
    raw.push({
      type: "FINANCIAL_EVENT",
      observation: `Revenue was ${financial.revenue} ${financial.currency}`,
      source: "brreg-regnskap",
      observed_at: fetchedAt,
      confidence: "HIGH",
      freshness: financial.period_to,
      metadata: { metric: "revenue", value: financial.revenue, period_to: financial.period_to },
    });
  }
  if (financial.operating_result !== undefined) {
    raw.push({
      type: "FINANCIAL_EVENT",
      observation: `Operating result was ${financial.operating_result} ${financial.currency}`,
      source: "brreg-regnskap",
      observed_at: fetchedAt,
      confidence: "HIGH",
      freshness: financial.period_to,
      metadata: { metric: "operating_result", value: financial.operating_result, period_to: financial.period_to },
    });
  }
  if (financial.net_result !== undefined) {
    raw.push({
      type: "FINANCIAL_EVENT",
      observation: `Net result was ${financial.net_result} ${financial.currency}`,
      source: "brreg-regnskap",
      observed_at: fetchedAt,
      confidence: "HIGH",
      freshness: financial.period_to,
      metadata: { metric: "net_result", value: financial.net_result, period_to: financial.period_to },
    });
  }

  return {
    raw,
    source: { key: "brreg-regnskap", label: "Financial profile", status: raw.length ? "AVAILABLE" : "EMPTY", fetched_at: fetchedAt },
  };
}

export class ResearchOrchestrator {
  private brreg = new BrregAdapter();
  private nav = new NavAdapter();
  private validator = new EvidenceValidator();
  private financialHistoryCollector = new BrregFinancialHistoryCollector();
  private wageContextCollector = new SsbWageContextCollector();
  private webDiscoveryCollector = new CompanyWebDiscoveryCollector();
  private newsSignalCollector = new NewsSignalCollector();

  async run(query: string): Promise<{ company: BrregCompany; report: IntelligenceReport }> {
    const result = await this.brreg.fetch({ query });
    if (!result.data) throw new Error("COMPANY_NOT_FOUND");
    const company = result.data;

    const financialFetchedAt = new Date().toISOString();
    const [financial, webResult, navResult, historyResult, wageResult, newsResult] = await Promise.all([
      fetchFinancial(company.org_number),
      this.webDiscoveryCollector.collect(company.website),
      this.nav.collect(company.org_number, company.company_name),
      this.financialHistoryCollector.collect(company.org_number, company.company_name),
      this.wageContextCollector.collect({
        industryCode: company.industry_code,
        municipalityNumber: company.municipality_number,
      }),
      this.newsSignalCollector.collect(company.company_name, company.org_number),
    ]);
    const digital = webResult.digital;

    const collectorResults = [
      collectIdentity(company, result.fetched_at),
      collectLeadership(company, result.fetched_at),
      collectFinancial(financial, financialFetchedAt),
      { raw: webResult.raw, source: webResult.source },
      navResult,
      { raw: wageResult.raw, source: wageResult.source },
      { raw: newsResult.raw, source: newsResult.source },
    ];
    const validated = this.validator.validate(collectorResults.flatMap((r) => r.raw));

    const leadership: LeadershipRole[] = (company.roles ?? []).map((r) => ({
      role_type: r.role_type,
      role_description: r.role_description,
      person_name: r.person_name,
    }));

    const sources: EvidenceSource[] = [
      ...collectorResults.map((r) => r.source),
      {
        key: "brreg-regnskap-historikk",
        label: "Financial history",
        status: historyResult.history ? "AVAILABLE" : historyResult.error ? "ERROR" : "EMPTY",
        fetched_at: financialFetchedAt,
        note: historyResult.error,
      },
      { key: "ssb-bransje", label: "Industry context", status: "NOT_AVAILABLE", note: "ikke koblet" },
    ];

    const evidence_map = [
      { stage: "Company identity", status: "done" as const },
      { stage: "Leadership & governance", status: leadership.length ? ("done" as const) : ("pending" as const) },
      { stage: "Financial profile", status: financial ? ("done" as const) : ("pending" as const) },
      { stage: "Financial history", status: historyResult.history ? ("done" as const) : ("pending" as const) },
      { stage: "Digital footprint", status: digital?.fetched ? ("done" as const) : ("pending" as const) },
      { stage: "Workforce signals", status: navResult.source.status === "AVAILABLE" ? ("done" as const) : ("pending" as const) },
      { stage: "Wage and labour context", status: wageResult.context ? ("done" as const) : ("pending" as const) },
      { stage: "Market signals", status: newsResult.source.status === "AVAILABLE" ? ("done" as const) : ("pending" as const) },
      { stage: "Industry context", status: "not_available" as const },
    ];

    const graph: CompanyIntelligenceGraph = {
      org_number: company.org_number,
      company_name: company.company_name,
      generated_at: new Date().toISOString(),
      evidence: validated.accepted,
      rejected_evidence: validated.rejected,
      coverage: {
        accepted: validated.accepted.length,
        rejected: validated.rejected.length,
        sources: sources.filter((s) => s.status === "AVAILABLE").length,
      },
    };

    return {
      company,
      report: {
        org_number: company.org_number,
        company_name: company.company_name,
        identity: {
          org_form: company.org_form,
          industry_code: company.industry_code,
          industry_name: company.industry_name,
          employees: company.employees,
          municipality: company.municipality,
          registered_at: company.registered_at,
        },
        leadership,
        financial,
        financial_history: historyResult.history ?? null,
        wage_context: wageResult.context,
        digital,
        news_signals: newsResult.signals,
        sources,
        evidence_map,
        graph,
      },
    };
  }
}
