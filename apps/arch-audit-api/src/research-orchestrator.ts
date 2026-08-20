import { BrregAdapter, BrregCompany } from "./adapters";
import {
  EvidenceValidationIssue,
  EvidenceValidator,
  RawEvidence,
  ValidatedEvidence,
} from "./evidence-graph";

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

export interface DigitalFootprint {
  website: string;
  tech_stack: string[];
  channels: string[];
  has_booking: boolean;
  has_self_service: boolean;
  fetched: boolean;
}

export type SourceStatus = "AVAILABLE" | "NOT_AVAILABLE" | "EMPTY";

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
  digital: DigitalFootprint | null;
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

async function readTextBounded(resp: Response, maxBytes: number): Promise<string> {
  const reader = resp.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    const remaining = maxBytes - total;
    const chunk = value.length > remaining ? value.slice(0, remaining) : value;
    chunks.push(chunk);
    total += chunk.length;
    if (value.length > remaining) break;
  }
  await reader.cancel().catch(() => undefined);

  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(out);
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

async function fetchDigital(website: string): Promise<DigitalFootprint | null> {
  if (!website) return null;
  const url = website.startsWith("http") ? website : `https://${website}`;
  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Arch-Audit research; passive)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) {
      return { website, tech_stack: [], channels: [], has_booking: false, has_self_service: false, fetched: false };
    }

    const html = await readTextBounded(resp, 512_000);
    const tech: string[] = [];
    const patterns: [RegExp, string][] = [
      [/wp-content|wp-includes|wp-json/, "WordPress"],
      [/shopify/, "Shopify"],
      [/google-analytics|gtag|googletagmanager/, "Google Analytics"],
      [/facebook|fbq\(/, "Facebook Pixel"],
      [/hotjar/, "Hotjar"],
      [/intercom/, "Intercom"],
      [/crisp\.chat|crisp-client/, "Crisp chat"],
      [/tawk\.to/, "Tawk.to"],
      [/calendly|timebestilling|booking/, "Booking-system"],
    ];
    for (const [re, name] of patterns) if (re.test(html)) tech.push(name);

    const channels: string[] = [];
    if (/tel:/.test(html)) channels.push("Telefon");
    if (/mailto:/.test(html)) channels.push("Epost");
    if (/facebook\.com|instagram\.com|linkedin\.com/.test(html)) channels.push("Sosiale medier");

    return {
      website,
      tech_stack: tech,
      channels,
      has_booking: /booking|timebestilling|calendly/i.test(html),
      has_self_service: /min side|self.?service|portal|login/i.test(html),
      fetched: true,
    };
  } catch {
    return { website, tech_stack: [], channels: [], has_booking: false, has_self_service: false, fetched: false };
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

function collectDigital(digital: DigitalFootprint | null, fetchedAt: string): CollectorResult {
  if (!digital) {
    return { raw: [], source: { key: "website", label: "Digital footprint", status: "NOT_AVAILABLE" } };
  }
  if (!digital.fetched) {
    return { raw: [], source: { key: "website", label: "Digital footprint", status: "EMPTY", fetched_at: fetchedAt } };
  }

  const raw: RawEvidence[] = [
    ...digital.tech_stack.map((tech) => ({
      type: "DIGITAL_SIGNAL" as const,
      observation: `Website indicates ${tech}`,
      source: "website",
      observed_at: fetchedAt,
      confidence: "MEDIUM" as const,
      metadata: { website: digital.website, signal: tech },
    })),
    ...digital.channels.map((channel) => ({
      type: "DIGITAL_SIGNAL" as const,
      observation: `Website exposes ${channel} contact channel`,
      source: "website",
      observed_at: fetchedAt,
      confidence: "MEDIUM" as const,
      metadata: { website: digital.website, channel },
    })),
  ];

  if (digital.has_booking) {
    raw.push({
      type: "DIGITAL_SIGNAL",
      observation: "Website indicates booking capability",
      source: "website",
      observed_at: fetchedAt,
      confidence: "MEDIUM",
      metadata: { website: digital.website, signal: "booking" },
    });
  }

  return {
    raw,
    source: { key: "website", label: "Digital footprint", status: raw.length ? "AVAILABLE" : "EMPTY", fetched_at: fetchedAt },
  };
}

export class ResearchOrchestrator {
  private brreg = new BrregAdapter();
  private validator = new EvidenceValidator();

  async run(query: string): Promise<{ company: BrregCompany; report: IntelligenceReport }> {
    const result = await this.brreg.fetch({ query });
    if (!result.data) throw new Error("COMPANY_NOT_FOUND");
    const company = result.data;

    const financialFetchedAt = new Date().toISOString();
    const [financial, digital] = await Promise.all([
      fetchFinancial(company.org_number),
      fetchDigital(company.website ?? ""),
    ]);
    const digitalFetchedAt = new Date().toISOString();

    const collectorResults = [
      collectIdentity(company, result.fetched_at),
      collectLeadership(company, result.fetched_at),
      collectFinancial(financial, financialFetchedAt),
      collectDigital(digital, digitalFetchedAt),
    ];
    const validated = this.validator.validate(collectorResults.flatMap((r) => r.raw));

    const leadership: LeadershipRole[] = (company.roles ?? []).map((r) => ({
      role_type: r.role_type,
      role_description: r.role_description,
      person_name: r.person_name,
    }));

    const sources: EvidenceSource[] = [
      ...collectorResults.map((r) => r.source),
      { key: "nav-stillinger", label: "Workforce signals", status: "NOT_AVAILABLE", note: "krever auth" },
      { key: "nyheter", label: "Market signals", status: "NOT_AVAILABLE", note: "ikke koblet" },
      { key: "ssb-bransje", label: "Industry context", status: "NOT_AVAILABLE", note: "ikke koblet" },
    ];

    const evidence_map = [
      { stage: "Company identity", status: "done" as const },
      { stage: "Leadership & governance", status: leadership.length ? ("done" as const) : ("pending" as const) },
      { stage: "Financial profile", status: financial ? ("done" as const) : ("pending" as const) },
      { stage: "Digital footprint", status: digital?.fetched ? ("done" as const) : ("pending" as const) },
      { stage: "Workforce signals", status: "not_available" as const },
      { stage: "Market signals", status: "not_available" as const },
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
        digital,
        sources,
        evidence_map,
        graph,
      },
    };
  }
}
