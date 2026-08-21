// brreg-financial-history.ts — Brreg Financial History Collector
// Henter historiske regnskap (tidsserier) fra Brreg og normaliserer til
// FinancialProfile-objekter. Genererer trend-analyser (marginer, EK-ratio, vekst).
//
// Brreg-regnskapsregisteret eksponerer tilgjengelige rapporteringsperioder per
// virksomhet. Collector-en normaliserer dem til et historikkformat og bygger
// trender når kilden faktisk inneholder flere enn én periode.

import { RawEvidence } from "../evidence-graph";
import { FinancialProfile } from "../research-orchestrator";

export interface FinancialTrend {
  key: "revenue" | "operating_margin" | "equity_ratio" | "employees";
  label: string;
  values: Array<{ year: string; value: number | null }>;
  /** År-over-år endring i prosent (null hvis kun ett år eller manglende data) */
  yoy_change_pct?: number;
  /** Gjennomsnittlig årlig vekstrate (CAGR) over perioden */
  cagr_pct?: number;
}

export interface FinancialHistory {
  org_number: string;
  company_name?: string;
  years: FinancialProfile[];
  trends: FinancialTrend[];
  /** Siste kjente år (favør etter fallback til siste år) */
  latest_year: string;
  /** Antall år med data — nyttig for å skille tynn/tett historikk */
  data_points: number;
}

export interface HistoryCollectorResult {
  raw: RawEvidence[];
  history: FinancialHistory | null;
  error?: string;
}

// Hjelpefunksjoner for uttrekk av Brreg-verdier (fra research-orchestrator-mønster)
function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function getRecord(obj: Record<string, unknown>, key: string): Record<string, unknown> {
  return asRecord(obj[key]);
}

function getNumber(obj: Record<string, unknown>, key: string): number | undefined {
  const value = obj[key];
  return typeof value === "number" ? value : undefined;
}

function getString(obj: Record<string, unknown>, key: string): string | undefined {
  const value = obj[key];
  return typeof value === "string" ? value : undefined;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Beregn år-over-år vekst i prosent. Returner null ved manglende/ikke-positiv base. */
function yoyChange(values: Array<{ year: string; value: number | null }>): number | undefined {
  if (values.length < 2) return undefined;
  const sorted = values.filter((v) => v.value !== null).sort((a, b) => a.year.localeCompare(b.year));
  if (sorted.length < 2) return undefined;
  const prev = sorted[sorted.length - 2].value;
  const current = sorted[sorted.length - 1].value;
  if (prev === null || current === null || prev === 0) return undefined;
  return round(((current - prev) / Math.abs(prev)) * 100);
}

/** Beregn CAGR (%) over perioden. Returner null hvis < 2 år. */
function cagr(values: Array<{ year: string; value: number | null }>): number | undefined {
  const sorted = values.filter((v) => v.value !== null).sort((a, b) => a.year.localeCompare(b.year));
  if (sorted.length < 2) return undefined;
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (first.value === null || last.value === null) return undefined;
  const years = Math.max(1, Number(last.year) - Number(first.year));
  if (years === 0 || first.value === 0) return undefined;
  return round((Math.pow(last.value / first.value, 1 / years) - 1) * 100);
}

// Parse ett Brreg regnskapsår til FinancialProfile (felt-flate verifisert mot ekte data 2026-08-21)
function parseYear(ra: Record<string, unknown>, year: string, currency: string): FinancialProfile | null {
  const rr = getRecord(ra, "resultatregnskapResultat");
  const eg = getRecord(ra, "egenkapitalGjeld");
  const ei = getRecord(ra, "eiendeler");
  const revisjon = getRecord(ra, "revisjon");
  const regnskapsperiode = getRecord(ra, "regnskapsperiode");

// Merk: Brreg nøster driftsinntekter UNDER driftsresultat (ikke separat)
const driftsresultat = getRecord(rr, "driftsresultat");
const driftsinntekter = getRecord(driftsresultat, "driftsinntekter");

const revenue = getNumber(driftsinntekter, "sumDriftsinntekter");
const operatingResult = getNumber(driftsresultat, "driftsresultat") ?? getNumber(driftsresultat, "sumDriftsresultat");

// Egenkapital og gjeld — strukturen varierer (verifisert: egenkapital nøstet under eg.egenkapital)
const egenkapitalNest = getRecord(eg, "egenkapital");
const egenkapital = getNumber(eg, "sumEgenkapital")
  ?? getNumber(egenkapitalNest, "sumEgenkapital")
  ?? getNumber(egenkapitalNest, "egenkapital");
const eiendelerTotal = getNumber(ei, "sumEiendeler") ?? getNumber(ei, "eiendelSum");
const gjeldTotal = getNumber(eg, "sumGjeld") ?? getNumber(getRecord(getRecord(eg, "gjeldOversikt"), "kortsiktigGjeld"), "sumKortsiktigGjeld");

  if (revenue === undefined && operatingResult === undefined) return null;

  return {
    period_from: getString(regnskapsperiode, "fraDato") ?? getString(regnskapsperiode, "fra") ?? `${year}-01-01`,
    period_to: getString(regnskapsperiode, "tilDato") ?? getString(regnskapsperiode, "til") ?? `${year}-12-31`,
    currency,
    revenue,
    operating_result: operatingResult,
    net_result: getNumber(rr, "sumSkatt") !== undefined
      ? (operatingResult ?? 0) - getNumber(rr, "sumSkatt")!
      : undefined,
    equity: egenkapital,
    total_assets: eiendelerTotal,
    total_liabilities: gjeldTotal,
    audited: getBoolean(revisjon, "revidert") ?? true,
    accounting_standard: getString(ra, "regnskapsprinsipper") ?? undefined,
  };
}

function getBoolean(obj: Record<string, unknown>, key: string): boolean | undefined {
  const value = obj[key];
  return typeof value === "boolean" ? value : undefined;
}

// Økonomiske nøkkeltall per år (basert på FinancialProfile)
function operatingMargin(fp: FinancialProfile): number | null {
  if (fp.revenue === undefined || fp.operating_result === undefined || fp.revenue === 0) return null;
  return round((fp.operating_result / fp.revenue) * 100);
}

function equityRatio(fp: FinancialProfile): number | null {
  if (fp.total_assets === undefined || fp.equity === undefined || fp.total_assets === 0) return null;
  return round((fp.equity / fp.total_assets) * 100);
}

export class BrregFinancialHistoryCollector {
  private readonly baseUrl = "https://data.brreg.no/regnskapsregisteret/regnskap";
  constructor(private readonly fetcher: typeof fetch = fetch) {}

  async collect(orgNumber: string, companyName?: string): Promise<HistoryCollectorResult> {
    const raw: RawEvidence[] = [];
    try {
      // Bruk samme kanoniske ressurs som den løpende finansprofilen. Brreg
      // ignorerer ikke nødvendigvis `size`, men den parameteren har gitt et
      // annet resultat fra Workers enn fra lokal kjøring.
      const years = await this.fetchYears(orgNumber);
      if (years.length === 0) {
        return { raw, history: null, error: "Ingen regnskapsdata funnet" };
      }

      const parsedYears = years
        .map(({ period, data }) => parseYear(data, period, "NOK"))
        .filter((fp): fp is FinancialProfile => fp !== null)
        .sort((a, b) => a.period_to.localeCompare(b.period_to));

      if (parsedYears.length === 0) {
        return { raw, history: null, error: "Ingen parsebare regnskapsår" };
      }

      const history = this.buildHistory(orgNumber, companyName, parsedYears);

      // Bygg evidens for hvert år (hvert år er et verifisert datapunkt fra Brreg)
      for (const fp of parsedYears) {
        raw.push({
          type: "FINANCIAL_EVENT",
          observation: `${fp.period_to}: revenue=${fp.revenue ?? "n/a"} operating=${fp.operating_result ?? "n/a"} equity=${fp.equity ?? "n/a"}`,
          source: "brreg-regnskap",
          observed_at: new Date().toISOString(),
          confidence: "VERIFIED",
          metadata: {
            year: fp.period_to,
            metric: "financial_history",
            revenue: fp.revenue ?? null,
            operating_result: fp.operating_result ?? null,
            equity: fp.equity ?? null,
            total_assets: fp.total_assets ?? null,
          },
        });
      }

      return { raw, history };
    } catch (error) {
      return { raw, history: null, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async fetchYears(orgNumber: string): Promise<Array<{ period: string; data: Record<string, unknown> }>> {
    const resp = await this.fetcher(`${this.baseUrl}/${orgNumber}`, {
      headers: { "Accept": "application/json", "User-Agent": "Arch-Audit/0.1" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) throw new Error(`Brreg regnskapsregister svarte HTTP ${resp.status}`);
    const value = (await resp.json()) as unknown;
    if (!Array.isArray(value)) throw new Error("Brreg regnskapsregister returnerte ugyldig svarformat");

    return value.flatMap((item) => {
      const ra = asRecord(item);
      const rp = getRecord(ra, "regnskapsperiode");
      // Brreg bruker feltene fraDato/tilDato (ikke fra/til)
      const periodTo = getString(rp, "tilDato") ?? getString(rp, "til");
      if (!periodTo) return [];
      return [{ period: periodTo.slice(0, 4), data: ra }];
    });
  }

  private buildHistory(orgNumber: string, companyName: string | undefined, years: FinancialProfile[]): FinancialHistory {
    const latest = years[years.length - 1];
    const revenueTrend = years.map((fp) => ({ year: fp.period_to.slice(0, 4), value: fp.revenue ?? null }));
    const operatingMarginTrend = years.map((fp) => ({ year: fp.period_to.slice(0, 4), value: operatingMargin(fp) }));
    const equityRatioTrend = years.map((fp) => ({ year: fp.period_to.slice(0, 4), value: equityRatio(fp) }));
    // Ansatte finnes ikke i regnskapsregisteret — utelat employees-trend her (hentes fra enhet)
    const employeesTrend: Array<{ year: string; value: number | null }> = [];

    const trends: FinancialTrend[] = [
      { key: "revenue", label: "Revenue (NOK)", values: revenueTrend, yoy_change_pct: yoyChange(revenueTrend), cagr_pct: cagr(revenueTrend) },
      { key: "operating_margin", label: "Operating margin (%)", values: operatingMarginTrend, yoy_change_pct: yoyChange(operatingMarginTrend), cagr_pct: cagr(operatingMarginTrend) },
      { key: "equity_ratio", label: "Equity ratio (%)", values: equityRatioTrend, yoy_change_pct: yoyChange(equityRatioTrend), cagr_pct: cagr(equityRatioTrend) },
      { key: "employees", label: "Employees", values: employeesTrend },
    ];

    return {
      org_number: orgNumber,
      company_name: companyName,
      years,
      trends,
      latest_year: latest.period_to.slice(0, 4),
      data_points: years.length,
    };
  }
}
