// evidence-engine.ts — Evidence Engine v1
//
// Samler datakilder til én «intelligence report» for en virksomhet.
// Kilder (verifisert i prod 2026-08-20):
//   ✓ brreg-enhet    — Brønnøysund Enhetsregisteret (identitet, roller, ansatte)
//   ✓ brreg-regnskap — Brønnøysund Regnskapsregisteret (driftsresultat, resultat, EK, gjeld, revisjon)
//   ✓ website        — nettsideanalyse (tech stack, kanaler) — rate-limit-sensitiv, fallback
//   ✗ nav-stillinger — krever bearer-auth (404 på public-feed) → markeres NOT_AVAILABLE
//   ✗ ssb-bransje    — feil endepunkt (400) → markeres NOT_AVAILABLE
//   ✗ kunngjoringer  — 404 → markeres NOT_AVAILABLE
//
// Prinsipp: en utilgjengelig kilde markeres ærlig — aldri late som den finnes.

import { BrregAdapter, BrregCompany } from "./adapters";

// ── Regnskaps-adapter ───────────────────────────────────────

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

// ── Nettside-adapter ───────────────────────────────────────

export interface DigitalFootprint {
  website: string;
  tech_stack: string[];
  channels: string[];
  has_booking: boolean;
  has_self_service: boolean;
  fetched: boolean;
}

// ── Samlet intelligence report ─────────────────────────────

export type SourceStatus = "AVAILABLE" | "NOT_AVAILABLE" | "EMPTY";

export interface EvidenceSource {
  key: string;
  label: string;
  status: SourceStatus;
  fetched_at?: string;
  note?: string;
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
}

// ── Regnskap: Brønnøysund Regnskapsregisteret ───────────────

async function fetchFinancial(orgNumber: string): Promise<FinancialProfile | null> {
  try {
    const resp = await fetch(
      `https://data.brreg.no/regnskapsregisteret/regnskap/${orgNumber}`,
      { headers: { "Accept": "application/json", "User-Agent": "Arch-Audit/0.1" } }
    );
    if (!resp.ok) return null;
    const list: any[] = await resp.json();
    if (!Array.isArray(list) || list.length === 0) return null;
    const ra = list[0];
    const rr = ra?.resultatregnskapResultat ?? {};
    const eg = ra?.egenkapitalGjeld ?? {};
    const ei = ra?.eiendeler ?? {};
    return {
      period_from: ra?.regnskapsperiode?.fraDato ?? "",
      period_to: ra?.regnskapsperiode?.tilDato ?? "",
      currency: ra?.valuta ?? "NOK",
      revenue: rr?.sumDriftsinntekter ?? rr?.driftsinntekter?.sumDriftsinntekter,
      operating_result: rr?.driftsresultat?.driftsresultat,
      net_result: rr?.aarsresultat,
      equity: eg?.egenkapital?.sumEgenkapital,
      total_assets: ei?.sumEiendeler,
      total_liabilities: eg?.gjeldOversikt?.sumGjeld,
      audited: !(ra?.revisjon?.fravalgRevisjon ?? false),
      accounting_standard: ra?.regnkapsprinsipper?.regnskapsregler,
    };
  } catch {
    return null;
  }
}

// ── Nettside: tech stack + kanaler ──────────────────────────

async function fetchDigital(website: string): Promise<DigitalFootprint | null> {
  if (!website) return null;
  const url = website.startsWith("http") ? website : `https://${website}`;
  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Arch-Audit research; passive)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) return { website, tech_stack: [], channels: [], has_booking: false, has_self_service: false, fetched: false };
    const html = await resp.text();
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

// ── Evidence Engine ─────────────────────────────────────────

export class EvidenceEngine {
  private brreg = new BrregAdapter();

  async analyze(query: string): Promise<{ company: BrregCompany; report: IntelligenceReport }> {
    const result = await this.brreg.fetch({ query });
    if (!result.data) throw new Error("COMPANY_NOT_FOUND");
    const company = result.data;

    // Parallell innhenting av sekundære kilder
    const [financial, digital] = await Promise.all([
      fetchFinancial(company.org_number),
      fetchDigital(company.website ?? ""),
    ]);

    const leadership: LeadershipRole[] = (company.roles ?? []).map((r) => ({
      role_type: r.role_type,
      role_description: r.role_description,
      person_name: r.person_name,
    }));

    const sources: EvidenceSource[] = [
      { key: "brreg-enhet", label: "Company identity", status: "AVAILABLE", fetched_at: result.fetched_at },
      { key: "brreg-roller", label: "Leadership & governance", status: leadership.length ? "AVAILABLE" : "EMPTY" },
      { key: "brreg-regnskap", label: "Financial profile", status: financial ? "AVAILABLE" : "EMPTY", fetched_at: new Date().toISOString() },
      { key: "website", label: "Digital footprint", status: digital?.fetched ? "AVAILABLE" : (digital ? "EMPTY" : "NOT_AVAILABLE") },
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

    const report: IntelligenceReport = {
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
    };

    return { company, report };
  }
}
