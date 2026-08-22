import type { BrregCompany } from "./adapters";
import type { CompanyIntelligenceGraph, IntelligenceReport } from "./research-orchestrator";

export type BenchmarkMetricKey =
  | "operating_margin"
  | "equity_ratio"
  | "employees"
  | "digital_score"
  | "workforce_signals";

export interface CompanyIntelligenceResult {
  company: BrregCompany;
  report: IntelligenceReport;
}

export interface ComparableCompany {
  org_number: string;
  company_name: string;
  industry_code?: string;
  industry_name?: string;
  metrics: Partial<Record<BenchmarkMetricKey, number>>;
  evidence: Partial<Record<BenchmarkMetricKey, string[]>>;
  /** Offentlig lønns- og arbeidskraftkontekst per selskap. Ikke en rangeringsmetrik. */
  wage_context?: IntelligenceReport["wage_context"];
  source_status: Record<string, string>;
  graph: CompanyIntelligenceGraph;
}

export interface BenchmarkMetric {
  key: BenchmarkMetricKey;
  label: string;
  unit: "percent" | "count" | "score";
  values: Array<{ org_number: string; value: number }>;
  /** Statistics only exist when at least one documented value exists. */
  median?: number;
  q1?: number;
  q3?: number;
  top_decile?: number;
  bottom_decile?: number;
  industry_reference?: {
    value: number;
    period: string;
    scope: "division" | "section";
    source_url: string;
  };
}

export interface SsbIndustryBenchmark {
  industry_code: string;
  industry_name?: string;
  scope: "division" | "section";
  period: string;
  source_url: string;
  operating_margin?: number;
  equity_ratio?: number;
  company_count?: number;
}

export interface IndustryBenchmarkCollector {
  collect(industryCode?: string, industryName?: string): Promise<SsbIndustryBenchmark | null>;
}

export interface BenchmarkContext {
  generated_at: string;
  peer_group: {
    basis: "selected_companies";
    industry_code?: string;
    industry_name?: string;
    company_count: number;
    note: string;
  };
  metrics: BenchmarkMetric[];
  sources: Array<{ key: string; label: string; status: "AVAILABLE" | "NOT_AVAILABLE"; note?: string }>;
}

export type ComparativeFindingKind = "STRENGTH" | "WEAKNESS" | "GAP";

export interface ComparativeFinding {
  kind: ComparativeFindingKind;
  org_number: string;
  company_name: string;
  metric: BenchmarkMetricKey;
  title: string;
  detail: string;
  value?: number;
  benchmark?: {
    median?: number;
    q1?: number;
    q3?: number;
    top_decile?: number;
    bottom_decile?: number;
  };
  evidence_refs: string[];
}

export interface ComparativeReport {
  generated_at: string;
  companies: ComparableCompany[];
  benchmark: BenchmarkContext;
  strengths: ComparativeFinding[];
  weaknesses: ComparativeFinding[];
  gaps: ComparativeFinding[];
  recommendations: Array<{
    org_number: string;
    company_name: string;
    priority: "HIGH" | "MEDIUM";
    action: string;
    based_on: string[];
  }>;
}

export interface CompanyCompareResult {
  resolved: boolean;
  report: ComparativeReport | null;
  unresolved: Array<{ query: string; error: "COMPANY_NOT_FOUND" }>;
}

export type IntelligenceRunner = (query: string) => Promise<CompanyIntelligenceResult | null>;

const METRIC_LABELS: Record<BenchmarkMetricKey, { label: string; unit: BenchmarkMetric["unit"] }> = {
  operating_margin: { label: "Driftsmargin", unit: "percent" },
  equity_ratio: { label: "Egenkapitalandel", unit: "percent" },
  employees: { label: "Ansatte", unit: "count" },
  digital_score: { label: "Digital synlighet", unit: "score" },
  workforce_signals: { label: "Rekrutteringssignaler", unit: "count" },
};

// Flere ansatte eller aktive stillinger er et avvik, ikke i seg selv en styrke
// eller svakhet. Bare metrikker med entydig retning blir rangert automatisk.
const DIRECTIONAL_METRICS = new Set<BenchmarkMetricKey>([
  "operating_margin",
  "equity_ratio",
  "digital_score",
]);

/**
 * Only these metrics can be automatically framed as a strength or weakness.
 * Headcount and open vacancies are descriptive context, not quality scores.
 */
export function isDirectionalMetric(key: BenchmarkMetricKey): boolean {
  return DIRECTIONAL_METRICS.has(key);
}

const SSB_TABLE_BY_SECTION: Record<string, string> = {
  B: "08677",
  C: "08674",
  F: "08168",
  G: "08171",
  H: "08162",
  I: "08165",
  J: "08158",
};

function industrySection(industryCode?: string): string | undefined {
  const division = Number(industryCode?.split(".")[0]);
  if (!Number.isInteger(division)) return undefined;
  if (division >= 1 && division <= 3) return "A";
  if (division >= 5 && division <= 9) return "B";
  if (division >= 10 && division <= 33) return "C";
  if (division === 35) return "D";
  if (division >= 36 && division <= 39) return "E";
  if (division >= 41 && division <= 43) return "F";
  if (division >= 45 && division <= 47) return "G";
  if (division >= 49 && division <= 53) return "H";
  if (division >= 55 && division <= 56) return "I";
  if (division >= 58 && division <= 63) return "J";
  if (division >= 64 && division <= 66) return "K";
  if (division === 68) return "L";
  if (division >= 69 && division <= 75) return "M";
  if (division >= 77 && division <= 82) return "N";
  if (division === 84) return "O";
  if (division === 85) return "P";
  if (division >= 86 && division <= 88) return "Q";
  if (division >= 90 && division <= 93) return "R";
  if (division >= 94 && division <= 96) return "S";
  return undefined;
}

function industryDivision(industryCode?: string): string | undefined {
  const match = industryCode?.match(/^(\d{2})(?:\.(\d))?/);
  if (!match) return undefined;
  return match[2] ? `${match[1]}.${match[2]}` : match[1];
}

function latestPeriod(dataset: SsbDataset): string | undefined {
  const periods = Object.entries(dataset.dimension?.Tid?.category.index ?? {})
    .sort(([, left], [, right]) => left - right)
    .map(([code]) => code);
  return periods.at(-1);
}

function metricValue(dataset: SsbDataset, code: string): number | undefined {
  const index = dataset.dimension?.ContentsCode?.category.index?.[code];
  const value = typeof index === "number" ? dataset.value?.[index] : undefined;
  return typeof value === "number" ? value : undefined;
}

interface SsbDataset {
  value?: Array<number | null>;
  dimension?: {
    Tid?: { category: { index: Record<string, number> } };
    ContentsCode?: { category: { index: Record<string, number> } };
  };
}

export class SsbIndustryBenchmarkCollector implements IndustryBenchmarkCollector {
  private readonly fetcher: typeof fetch;

  constructor(fetcher?: typeof fetch) {
    // Workers' fetch requires the global receiver when stored as an instance field.
    this.fetcher = fetcher ?? fetch.bind(globalThis);
  }

  async collect(industryCode?: string, industryName?: string): Promise<SsbIndustryBenchmark | null> {
    const division = industryDivision(industryCode);
    const section = industrySection(industryCode);
    if (!section) return null;

    const tableId = division ? SSB_TABLE_BY_SECTION[section] : undefined;
    const primary = tableId && division
      ? await this.fetchBenchmark(tableId, division, "division", true)
      : null;
    if (primary) return { ...primary, industry_code: division!, industry_name: industryName };

    const fallback = await this.fetchBenchmark("07371", section, "section", false);
    return fallback ? { ...fallback, industry_code: section, industry_name: industryName } : null;
  }

  private async fetchBenchmark(
    tableId: string,
    industryCode: string,
    scope: SsbIndustryBenchmark["scope"],
    includeRegion: boolean
  ): Promise<Omit<SsbIndustryBenchmark, "industry_code" | "industry_name"> | null> {
    const metadataUrl = `https://data.ssb.no/api/pxwebapi/v2/tables/${tableId}/metadata?lang=no`;
    try {
      const metadataResponse = await this.fetcher(metadataUrl, { signal: AbortSignal.timeout(5_000) });
      if (!metadataResponse.ok) return null;
      const metadata = await metadataResponse.json<SsbDataset>();
      const period = latestPeriod(metadata);
      if (!period) return null;

      const dataUrl = new URL(`https://data.ssb.no/api/pxwebapi/v2/tables/${tableId}/data`);
      dataUrl.searchParams.set("lang", "no");
      if (includeRegion) dataUrl.searchParams.append("valueCodes[Region]", "00");
      dataUrl.searchParams.append("valueCodes[NACE2007]", industryCode);
      dataUrl.searchParams.append("valueCodes[ContentsCode]", "Drift");
      dataUrl.searchParams.append("valueCodes[ContentsCode]", "EgenkapAnd");
      dataUrl.searchParams.append("valueCodes[ContentsCode]", "Antall");
      dataUrl.searchParams.append("valueCodes[Tid]", period);
      dataUrl.searchParams.set("outputFormat", "json-stat2");

      const dataResponse = await this.fetcher(dataUrl.toString(), { signal: AbortSignal.timeout(5_000) });
      if (!dataResponse.ok) return null;
      const dataset = await dataResponse.json<SsbDataset>();
      const operatingMargin = metricValue(dataset, "Drift");
      const equityRatio = metricValue(dataset, "EgenkapAnd");
      if (operatingMargin === undefined && equityRatio === undefined) return null;

      return {
        scope,
        period,
        source_url: dataUrl.toString(),
        operating_margin: operatingMargin,
        equity_ratio: equityRatio,
        company_count: metricValue(dataset, "Antall"),
      };
    } catch {
      return null;
    }
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function percentile(sorted: number[], p: number): number | undefined {
  if (sorted.length === 0) return undefined;
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function evidenceFor(report: IntelligenceReport, source: string, metric?: string): string[] {
  return report.graph.evidence
    .filter((evidence) => {
      if (evidence.source !== source) return false;
      if (!metric) return true;
      return evidence.metadata?.metric === metric || evidence.metadata?.signal === metric;
    })
    .map((evidence) => evidence.dedupe_key);
}

function digitalScore(report: IntelligenceReport): number | undefined {
  const digital = report.digital;
  if (!digital?.fetched) return undefined;
  const signals = new Set<string>();
  for (const tech of digital.tech_stack) signals.add(`tech:${tech}`);
  for (const channel of digital.channels) signals.add(`channel:${channel}`);
  if (digital.has_booking) signals.add("capability:booking");
  if (digital.has_self_service) signals.add("capability:self_service");
  return Math.min(100, signals.size * 15);
}

function workforceSignalCount(report: IntelligenceReport): number | undefined {
  const source = report.sources.find((s) => s.key === "nav-arbeidsplassen");
  if (source?.status !== "AVAILABLE") return undefined;

  const aggregate = report.graph.evidence.find(
    (evidence) => evidence.source === "nav-arbeidsplassen" && evidence.metadata?.signal === "open_positions_count"
  );
  const count = aggregate?.metadata?.count;
  return typeof count === "number" ? count : undefined;
}

export function toComparableCompany(result: CompanyIntelligenceResult): ComparableCompany {
  const { company, report } = result;
  const financial = report.financial;
  const metrics: ComparableCompany["metrics"] = {};
  const evidence: ComparableCompany["evidence"] = {};

  if (financial?.revenue && financial.operating_result !== undefined) {
    metrics.operating_margin = round((financial.operating_result / financial.revenue) * 100);
    evidence.operating_margin = [
      ...evidenceFor(report, "brreg-regnskap", "revenue"),
      ...evidenceFor(report, "brreg-regnskap", "operating_result"),
    ];
  }

  if (financial?.total_assets && financial.equity !== undefined) {
    metrics.equity_ratio = round((financial.equity / financial.total_assets) * 100);
    evidence.equity_ratio = evidenceFor(report, "brreg-regnskap");
  }

  if (report.identity.employees !== undefined) {
    metrics.employees = report.identity.employees;
    evidence.employees = evidenceFor(report, "brreg-enhet");
  }

  const digital = digitalScore(report);
  if (digital !== undefined) {
    metrics.digital_score = digital;
    evidence.digital_score = evidenceFor(report, "website");
  }

  const workforce = workforceSignalCount(report);
  if (workforce !== undefined) {
    metrics.workforce_signals = workforce;
    evidence.workforce_signals = evidenceFor(report, "nav-arbeidsplassen", "open_positions_count");
  }

  return {
    org_number: company.org_number,
    company_name: company.company_name,
    industry_code: report.identity.industry_code,
    industry_name: report.identity.industry_name,
    metrics,
    evidence,
    wage_context: report.wage_context ?? null,
    source_status: Object.fromEntries(report.sources.map((source) => [source.key, source.status])),
    graph: report.graph,
  };
}

export class BenchmarkEngine {
  constructor(private readonly industryCollector: IndustryBenchmarkCollector = new SsbIndustryBenchmarkCollector()) {}

  async enrich(graphs: ComparableCompany[]): Promise<BenchmarkContext> {
    const industryCodes = Array.from(new Set(graphs.map((company) => company.industry_code).filter((code): code is string => Boolean(code))));
    const commonIndustryCode = industryCodes.length === 1 ? industryCodes[0] : undefined;
    const commonIndustry = commonIndustryCode
      ? graphs.find((company) => company.industry_code === commonIndustryCode)
      : undefined;
    const industryBenchmark = await this.industryCollector.collect(commonIndustryCode, commonIndustry?.industry_name);
    const metrics: BenchmarkMetric[] = [];

    for (const key of Object.keys(METRIC_LABELS) as BenchmarkMetricKey[]) {
      const values = graphs
        .map((company) => ({ org_number: company.org_number, value: company.metrics[key] }))
        .filter((entry): entry is { org_number: string; value: number } => typeof entry.value === "number");

      const sorted = values.map((entry) => entry.value).sort((a, b) => a - b);
      const percentileFor = (p: number) => {
        const value = percentile(sorted, p);
        return value === undefined ? undefined : round(value);
      };
      metrics.push({
        key,
        label: METRIC_LABELS[key].label,
        unit: METRIC_LABELS[key].unit,
        values,
        median: percentileFor(0.5),
        q1: percentileFor(0.25),
        q3: percentileFor(0.75),
        top_decile: percentileFor(0.9),
        bottom_decile: percentileFor(0.1),
        industry_reference: key === "operating_margin" && industryBenchmark?.operating_margin !== undefined
          ? { value: industryBenchmark.operating_margin, period: industryBenchmark.period, scope: industryBenchmark.scope, source_url: industryBenchmark.source_url }
          : key === "equity_ratio" && industryBenchmark?.equity_ratio !== undefined
            ? { value: industryBenchmark.equity_ratio, period: industryBenchmark.period, scope: industryBenchmark.scope, source_url: industryBenchmark.source_url }
            : undefined,
      });
    }

    return {
      generated_at: new Date().toISOString(),
      peer_group: {
        basis: "selected_companies",
        industry_code: commonIndustryCode,
        industry_name: commonIndustry?.industry_name,
        company_count: graphs.length,
        note: industryBenchmark
          ? `Sammenligningen er beriket med SSB-referanse for ${industryBenchmark.scope === "division" ? "næringsgruppe" : "næringsseksjon"} i ${industryBenchmark.period}.`
          : "Sammenligningen bygger på de valgte virksomhetene. Dette er et sammenligningsutvalg, ikke en bransjereferanse.",
      },
      metrics,
      sources: [
        { key: "selected-company-peer-set", label: "Valgt sammenligningsutvalg", status: "AVAILABLE" },
        industryBenchmark
          ? { key: "ssb-bransje", label: "SSB-bransjereferanse", status: "AVAILABLE", note: `Referanse for ${industryBenchmark.scope === "division" ? "næringsgruppe" : "næringsseksjon"}, ${industryBenchmark.period}.` }
          : { key: "ssb-bransje", label: "SSB-bransjereferanse", status: "NOT_AVAILABLE", note: commonIndustryCode ? "Ingen kompatibel SSB-referanse ble returnert." : "Virksomhetene har ikke samme næringskode." },
      ],
    };
  }
}

export class ComparativeAnalyzer {
  analyze(companies: ComparableCompany[], benchmark: BenchmarkContext): ComparativeReport {
    const strengths: ComparativeFinding[] = [];
    const weaknesses: ComparativeFinding[] = [];
    const gaps: ComparativeFinding[] = [];

    // Two selected companies are a direct comparison, not a peer cohort.
    // Do not turn one side of a pair into an automatic strength, weakness, or
    // recommendation. The portal presents their documented differences instead.
    if (companies.length < 3) {
      return {
        generated_at: new Date().toISOString(),
        companies,
        benchmark,
        strengths,
        weaknesses,
        gaps,
        recommendations: [],
      };
    }

    for (const metric of benchmark.metrics) {
      // An unavailable collector must never create a false zero metric or a
      // repetitive gap for every company. Coverage communicates that state.
      if (metric.values.length === 0) continue;

      for (const company of companies) {
        const value = company.metrics[metric.key];
        if (value === undefined) {
          continue;
        }

        const refs = company.evidence[metric.key] ?? [];
        if (refs.length === 0) {
          continue;
        }

        if (!isDirectionalMetric(metric.key) || metric.median === undefined || metric.q1 === undefined || metric.q3 === undefined) continue;

        if (value >= metric.q3 && value > metric.median) {
          strengths.push(this.finding("STRENGTH", company, metric.key, `${metric.label} over medianen`, `${company.company_name} har ${value} mot medianen på ${metric.median} i sammenligningsgruppen.`, value, metric, refs));
        } else if (value <= metric.q1 && value < metric.median) {
          weaknesses.push(this.finding("WEAKNESS", company, metric.key, `${metric.label} under medianen`, `${company.company_name} har ${value} mot medianen på ${metric.median} i sammenligningsgruppen.`, value, metric, refs));
        }
      }
    }

    return {
      generated_at: new Date().toISOString(),
      companies,
      benchmark,
      strengths: strengths.sort((a, b) => this.sortByDistance(b) - this.sortByDistance(a)),
      weaknesses: weaknesses.sort((a, b) => this.sortByDistance(b) - this.sortByDistance(a)),
      gaps,
      recommendations: this.recommendations(companies, weaknesses, gaps),
    };
  }

  private finding(
    kind: ComparativeFindingKind,
    company: ComparableCompany,
    key: BenchmarkMetricKey,
    title: string,
    detail: string,
    value: number | undefined,
    metric: BenchmarkMetric,
    evidenceRefs: string[]
  ): ComparativeFinding {
    return {
      kind,
      org_number: company.org_number,
      company_name: company.company_name,
      metric: key,
      title,
      detail: metric.industry_reference
        ? `${detail} SSB-referanse for ${metric.industry_reference.scope === "division" ? "næringsgruppe" : "næringsseksjon"} i ${metric.industry_reference.period}: ${metric.industry_reference.value}.`
        : detail,
      value,
      benchmark: metric.median === undefined
        ? undefined
        : {
            median: metric.median,
            q1: metric.q1,
            q3: metric.q3,
            top_decile: metric.top_decile,
            bottom_decile: metric.bottom_decile,
          },
      evidence_refs: evidenceRefs,
    };
  }

  private sortByDistance(finding: ComparativeFinding): number {
    if (finding.value === undefined || finding.benchmark?.median === undefined) return 0;
    return Math.abs(finding.value - finding.benchmark.median);
  }

  private recommendations(
    companies: ComparableCompany[],
    weaknesses: ComparativeFinding[],
    gaps: ComparativeFinding[]
  ): ComparativeReport["recommendations"] {
    const out: ComparativeReport["recommendations"] = [];
    for (const company of companies) {
      const companyWeaknesses = weaknesses.filter((finding) => finding.org_number === company.org_number);
      const companyGaps = gaps.filter((finding) => finding.org_number === company.org_number);
      if (companyWeaknesses.length > 0) {
        out.push({
          org_number: company.org_number,
          company_name: company.company_name,
          priority: "HIGH",
          action: `Undersøk avviket i ${METRIC_LABELS[companyWeaknesses[0].metric].label.toLowerCase()} mot sterkere sammenligningsvirksomheter.`,
          based_on: companyWeaknesses[0].evidence_refs,
        });
      } else if (companyGaps.length > 0) {
        out.push({
          org_number: company.org_number,
          company_name: company.company_name,
          priority: "MEDIUM",
          action: `Innhent dokumentasjon for ${METRIC_LABELS[companyGaps[0].metric].label.toLowerCase()} før det trekkes en strategisk konklusjon.`,
          based_on: [],
        });
      }
    }
    return out;
  }
}

export class ComparativeOrchestrator {
  constructor(
    private runIntelligence: IntelligenceRunner,
    private benchmark = new BenchmarkEngine(),
    private analyzer = new ComparativeAnalyzer()
  ) {}

  async compare(queries: string[]): Promise<CompanyCompareResult> {
    const uniqueQueries = Array.from(new Set(queries.map((query) => query.trim()).filter(Boolean)));
    const settled = await Promise.all(uniqueQueries.map(async (query) => ({
      query,
      result: await this.runIntelligence(query),
    })));

    const unresolved = settled
      .filter((entry) => !entry.result)
      .map((entry) => ({ query: entry.query, error: "COMPANY_NOT_FOUND" as const }));
    const companies = settled
      .map((entry) => entry.result)
      .filter((entry): entry is CompanyIntelligenceResult => entry !== null)
      .map(toComparableCompany);

    if (companies.length < 2) return { resolved: false, report: null, unresolved };

    const benchmark = await this.benchmark.enrich(companies);
    return {
      resolved: true,
      report: this.analyzer.analyze(companies, benchmark),
      unresolved,
    };
  }
}
