// ssb-wage-context.ts -- SSB Wage and Labour Context Collector
//
// Henter offentlig, aggregert lønnsstatistikk fra SSB. Kilden beskriver en
// næringsgruppe og et geografisk område, aldri lønnen hos den enkelte virksomhet.

import type { RawEvidence } from "../evidence-graph";
import type { EvidenceSource } from "../research-orchestrator";

const TABLE_ID = "11654";
const SSB_BASE_URL = "https://data.ssb.no/api/pxwebapi/v2/tables";

const CONTENT_CODES = [
  "Lonsstakere",
  "AntArbForhold",
  "HeltidsEkvMnd",
  "GjAvtaltMdlonn",
  "GjMdTotal",
  "MedianAvtMndLonn",
  "MedianMndLonn",
  "GjAvtaltMdlonnIndeks",
  "GjMdTotalIndeks",
] as const;

type ContentCode = typeof CONTENT_CODES[number];

interface SsbDimension {
  category?: {
    index?: Record<string, number>;
    label?: Record<string, string>;
  };
}

interface SsbDataset {
  id?: string[];
  size?: number[];
  value?: Array<number | null>;
  dimension?: Record<string, SsbDimension>;
}

export interface WageStatistics {
  wage_earners?: number;
  jobs?: number;
  full_time_equivalents?: number;
  average_agreed_monthly_salary?: number;
  average_monthly_salary?: number;
  median_agreed_monthly_salary?: number;
  median_monthly_salary?: number;
  average_agreed_monthly_salary_index?: number;
  average_monthly_salary_index?: number;
  average_monthly_salary_growth_pct?: number;
}

export interface WageAreaContext {
  region_code: string;
  region_label: string;
  scope: "county" | "country";
  statistics: WageStatistics;
  source_url: string;
}

export interface WageContext {
  industry_group: {
    code: string;
    label: string;
    based_on_nace_code: string;
  };
  period: string;
  previous_period?: string;
  regional: WageAreaContext | null;
  national: WageAreaContext;
  company_personnel_costs: {
    status: "NOT_AVAILABLE";
    note: string;
  };
  caveats: string[];
}

export interface WageCollectorInput {
  industryCode?: string;
  municipalityNumber?: string;
}

export interface WageCollectorResult {
  raw: RawEvidence[];
  context: WageContext | null;
  source: EvidenceSource;
  error?: string;
}

const NACE_GROUPS: Array<{ from: number; to: number; code: string }> = [
  { from: 1, to: 3, code: "01-03" },
  { from: 5, to: 9, code: "05-09" },
  { from: 10, to: 33, code: "10-33" },
  { from: 35, to: 39, code: "35-39" },
  { from: 41, to: 43, code: "41-43" },
  { from: 45, to: 47, code: "45-47" },
  { from: 49, to: 53, code: "49-53" },
  { from: 55, to: 56, code: "55-56" },
  { from: 58, to: 63, code: "58-63" },
  { from: 64, to: 66, code: "64-66" },
  { from: 68, to: 75, code: "68-75" },
  { from: 77, to: 82, code: "77-82" },
  { from: 84, to: 84, code: "84" },
  { from: 85, to: 85, code: "85" },
  { from: 86, to: 88, code: "86-88" },
  { from: 90, to: 99, code: "90-99" },
];

function industryGroupFor(industryCode?: string): string | null {
  const division = Number(industryCode?.match(/^\d{2}/)?.[0]);
  if (!Number.isInteger(division)) return null;
  return NACE_GROUPS.find((group) => division >= group.from && division <= group.to)?.code ?? null;
}

function latestPeriods(metadata: SsbDataset): { latest: string; previous?: string } | null {
  const index = metadata.dimension?.Tid?.category?.index;
  if (!index) return null;
  const periods = Object.entries(index)
    .sort(([, left], [, right]) => left - right)
    .map(([period]) => period);
  const latest = periods.at(-1);
  if (!latest) return null;
  return { latest, previous: periods.at(-2) };
}

function getDatasetValue(dataset: SsbDataset, requested: Record<string, string>): number | undefined {
  const ids = dataset.id ?? [];
  const sizes = dataset.size ?? [];
  if (ids.length === 0 || ids.length !== sizes.length || !dataset.value) return undefined;

  let flatIndex = 0;
  for (let position = 0; position < ids.length; position += 1) {
    const dimension = dataset.dimension?.[ids[position]]?.category?.index;
    const categoryIndex = dimension?.[requested[ids[position]]];
    if (categoryIndex === undefined) return undefined;
    flatIndex = flatIndex * sizes[position] + categoryIndex;
  }

  const value = dataset.value[flatIndex];
  return typeof value === "number" ? value : undefined;
}

function percentChange(current?: number, previous?: number): number | undefined {
  if (current === undefined || previous === undefined || previous === 0) return undefined;
  return Math.round(((current - previous) / Math.abs(previous)) * 10_000) / 100;
}

function statisticsFrom(dataset: SsbDataset, region: string, industry: string, latest: string, previous?: string): WageStatistics {
  const value = (code: ContentCode, period = latest) => getDatasetValue(dataset, {
    Region: region,
    NACE2007: industry,
    ContentsCode: code,
    Tid: period,
  });
  const latestAverage = value("GjMdTotal");

  return {
    wage_earners: value("Lonsstakere"),
    jobs: value("AntArbForhold"),
    full_time_equivalents: value("HeltidsEkvMnd"),
    average_agreed_monthly_salary: value("GjAvtaltMdlonn"),
    average_monthly_salary: latestAverage,
    median_agreed_monthly_salary: value("MedianAvtMndLonn"),
    median_monthly_salary: value("MedianMndLonn"),
    average_agreed_monthly_salary_index: value("GjAvtaltMdlonnIndeks"),
    average_monthly_salary_index: value("GjMdTotalIndeks"),
    average_monthly_salary_growth_pct: percentChange(latestAverage, previous ? value("GjMdTotal", previous) : undefined),
  };
}

function countyCodeFor(municipalityNumber: string | undefined, metadata: SsbDataset): string | null {
  if (!municipalityNumber || !/^\d{4}$/.test(municipalityNumber)) return null;
  const countyCode = municipalityNumber.slice(0, 2);
  return metadata.dimension?.Region?.category?.index?.[countyCode] === undefined ? null : countyCode;
}

function labelFor(metadata: SsbDataset, dimension: string, code: string): string {
  return metadata.dimension?.[dimension]?.category?.label?.[code] ?? code;
}

function rawEvidenceFor(context: WageContext, observedAt: string): RawEvidence[] {
  const area = context.regional ?? context.national;
  const entries: Array<[keyof WageStatistics, string]> = [
    ["average_monthly_salary", "gjennomsnittlig månedslønn"],
    ["median_monthly_salary", "median månedslønn"],
    ["jobs", "antall jobber"],
    ["full_time_equivalents", "heltidsekvivalenter"],
    ["average_monthly_salary_growth_pct", "endring i gjennomsnittlig månedslønn"],
  ];

  return entries.flatMap(([metric, label]) => {
    const value = area.statistics[metric];
    if (value === undefined) return [];
    const unit = metric.includes("salary") ? "NOK" : metric.includes("growth") ? "prosent" : "antall";
    return [{
      type: "INDUSTRY_CONTEXT" as const,
      observation: `SSB ${label} for ${context.industry_group.label} i ${area.region_label} var ${value} ${unit} i ${context.period}`,
      source: "ssb-lonn",
      observed_at: observedAt,
      confidence: "HIGH" as const,
      freshness: context.period,
      metadata: {
        metric,
        value,
        period: context.period,
        region: area.region_label,
        region_scope: area.scope,
        industry_group: context.industry_group.code,
        source_url: area.source_url,
      },
    }];
  });
}

export class SsbWageContextCollector {
  private readonly fetcher: typeof fetch;

  constructor(fetcher?: typeof fetch) {
    this.fetcher = fetcher ?? fetch.bind(globalThis);
  }

  async collect(input: WageCollectorInput): Promise<WageCollectorResult> {
    const fetchedAt = new Date().toISOString();
    const empty = (status: EvidenceSource["status"], note: string, error?: string): WageCollectorResult => ({
      raw: [],
      context: null,
      source: { key: "ssb-lonn", label: "Lønn og arbeidskraft (SSB)", status, fetched_at: fetchedAt, note },
      error,
    });

    const industryGroup = industryGroupFor(input.industryCode);
    if (!industryGroup) {
      return empty("NOT_AVAILABLE", "NACE-koden kan ikke kobles til SSBs lønnsgrupper.", "UNSUPPORTED_INDUSTRY");
    }

    try {
      const metadataUrl = `${SSB_BASE_URL}/${TABLE_ID}/metadata?lang=no`;
      const metadataResponse = await this.fetcher(metadataUrl, { signal: AbortSignal.timeout(5_000) });
      if (!metadataResponse.ok) return empty("ERROR", "SSB-metadata kunne ikke hentes.", `HTTP_${metadataResponse.status}`);
      const metadata = await metadataResponse.json<SsbDataset>();
      const periods = latestPeriods(metadata);
      if (!periods) return empty("ERROR", "SSB mangler en rapporteringsperiode.", "MISSING_PERIOD");

      const regionCode = countyCodeFor(input.municipalityNumber, metadata);
      const requestedPeriods = [periods.previous, periods.latest].filter((period): period is string => Boolean(period));
      const fetchArea = async (areaCode: string): Promise<WageAreaContext | null> => {
        const dataUrl = new URL(`${SSB_BASE_URL}/${TABLE_ID}/data`);
        dataUrl.searchParams.set("lang", "no");
        dataUrl.searchParams.append("valueCodes[Region]", areaCode);
        dataUrl.searchParams.append("valueCodes[NACE2007]", industryGroup);
        for (const contentCode of CONTENT_CODES) dataUrl.searchParams.append("valueCodes[ContentsCode]", contentCode);
        for (const period of requestedPeriods) dataUrl.searchParams.append("valueCodes[Tid]", period);
        dataUrl.searchParams.set("outputFormat", "json-stat2");

        const response = await this.fetcher(dataUrl.toString(), { signal: AbortSignal.timeout(5_000) });
        if (!response.ok) return null;
        const dataset = await response.json<SsbDataset>();
        return {
          region_code: areaCode,
          region_label: labelFor(metadata, "Region", areaCode),
          scope: areaCode === "Ialt" ? "country" : "county",
          statistics: statisticsFrom(dataset, areaCode, industryGroup, periods.latest, periods.previous),
          source_url: dataUrl.toString(),
        };
      };

      const [national, regional] = await Promise.all([
        fetchArea("Ialt"),
        regionCode ? fetchArea(regionCode) : Promise.resolve(null),
      ]);
      if (!national) return empty("ERROR", "SSB-lønnsdata kunne ikke hentes.", "SSB_DATA_UNAVAILABLE");

      const context: WageContext = {
        industry_group: {
          code: industryGroup,
          label: labelFor(metadata, "NACE2007", industryGroup),
          based_on_nace_code: input.industryCode ?? "",
        },
        period: periods.latest,
        previous_period: periods.previous,
        regional,
        national,
        company_personnel_costs: {
          status: "NOT_AVAILABLE",
          note: "Brønnøysunds strukturerte regnskapsdata i Arch inneholder ikke personalkostnader for den enkelte virksomheten.",
        },
        caveats: [
          "Statistikken beskriver lønn og arbeidsmarked i en SSB-næringsgruppe, ikke lønnen i den konkrete virksomheten.",
          "Selskapets registrerte adresse brukes kun til fylkesnivå. Individuelle lønninger, lønnsspenn, bonus og stillingsmiks er ikke tilgjengelig.",
          ...(regional ? [] : ["Fylkeskobling mangler eller er ikke støttet; bare nasjonal referanse vises."]),
        ],
      };
      const raw = rawEvidenceFor(context, fetchedAt);
      return {
        raw,
        context,
        source: {
          key: "ssb-lonn",
          label: "Lønn og arbeidskraft (SSB)",
          status: raw.length ? "AVAILABLE" : "EMPTY",
          fetched_at: fetchedAt,
          note: "Aggregert SSB-statistikk; ikke selskapets faktiske lønninger.",
        },
      };
    } catch (error) {
      return empty("ERROR", "SSB-lønnsdata kunne ikke hentes.", error instanceof Error ? error.message : String(error));
    }
  }
}
