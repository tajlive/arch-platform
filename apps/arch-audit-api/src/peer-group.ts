// peer-group.ts — PeerGroupBuilder
// Bygger sammenlignbar peer-gruppe for et selskap basert på:
//   1. NACE-kode (samme industriklassifisering)
//   2. Størrelsesklasse (ansatte / omsetning)
//   3. Region (valgfritt — filtrer på fylke/kommune når tilgjengelig)
//
// Bruker Brreg Enhetsregisteret-søk på naeringskode for å finne kandidater.
// Verifisert syntaks (2026-08-21): naeringskode=15.200 (med punktum) gir treff.
// sort med komma-feil — unngås.

import { BrregCompany } from "./adapters";

export type SizeClass = "MICRO" | "SMALL" | "MEDIUM" | "LARGE" | "UNKNOWN";

export interface Peer {
  org_number: string;
  company_name: string;
  industry_code?: string;
  industry_name?: string;
  employees?: number;
  municipality?: string;
  /** Størrelsesklasse per ansatte-terskel */
  size_class: SizeClass;
  /** Samsvar-score mot referanseselskapet (0-100) */
  similarity_score: number;
}

export interface PeerGroupResult {
  org_number: string;
  company_name: string;
  nace_code?: string;
  nace_name?: string;
  size_class: SizeClass;
  peers: Peer[];
  /** Antall peers funnet i samme NACE før filtrering */
  candidates_found: number;
  /** Antall peers som faktisk ble valgt (etter størrelse/region-filter) */
  peers_selected: number;
  note?: string;
}

// Størrelsesklasse per antall ansatte
export function sizeClassFor(employees?: number): SizeClass {
  if (employees === undefined) return "UNKNOWN";
  if (employees <= 9) return "MICRO";
  if (employees <= 49) return "SMALL";
  if (employees <= 249) return "MEDIUM";
  return "LARGE";
}

/** Beregn simpel samsvar-score (0-100) basert på størrelse + region */
export function similarityScore(
  reference: { employees?: number; municipality?: string },
  candidate: { employees?: number; municipality?: string }
): number {
  let score = 50; // basisscore
  if (reference.employees !== undefined && candidate.employees !== undefined) {
    const diff = Math.abs(reference.employees - candidate.employees);
    score += Math.max(0, 40 - diff); // nærmere størrelse = høyere score
  }
  if (reference.municipality && candidate.municipality === reference.municipality) {
    score += 10; // samme kommune
  }
  return Math.min(100, Math.max(0, score));
}

export class PeerGroupBuilder {
  private readonly baseUrl = "https://data.brreg.no/enhetsregisteret/api/enheter";
  private readonly maxCandidates = 20;

  constructor(private readonly fetcher: typeof fetch = fetch) {}

  /**
   * Bygg peer-gruppe for et selskap.
   * @param orgNumber - referanseselskapets org.nr
   * @param options - nace_code (valgfritt, hentes via fetch hvis ikke gitt), size_class_tolerance
   */
  async build(
    orgNumber: string,
    options?: { nace_code?: string; company_name?: string; exact_size_class?: boolean }
  ): Promise<PeerGroupResult> {
    const naceCode = options?.nace_code ?? (await this.fetchNace(orgNumber));
    const reference = await this.fetchCompany(orgNumber);
    const refEmployees = reference?.employees ?? undefined;
    const refMunicipality = reference?.municipality ?? undefined;

    if (!naceCode) {
      return {
        org_number: orgNumber,
        company_name: options?.company_name ?? reference?.company_name ?? "Ukjent",
        nace_code: undefined,
        size_class: sizeClassFor(refEmployees),
        peers: [],
        candidates_found: 0,
        peers_selected: 0,
        note: "Ingen NACE-kode funnet — kan ikke bygge peer-gruppe",
      };
    }

    const candidates = await this.fetchCandidates(naceCode, orgNumber);
    const refSizeClass = sizeClassFor(refEmployees);

    const peers: Peer[] = candidates
      .map((c) => ({
        org_number: c.org_number,
        company_name: c.company_name,
        industry_code: c.industry_code,
        industry_name: c.industry_name,
        employees: c.employees,
        municipality: c.municipality,
        size_class: sizeClassFor(c.employees),
        similarity_score: similarityScore(
          { employees: refEmployees, municipality: refMunicipality },
          { employees: c.employees, municipality: c.municipality }
        ),
      }))
      .filter((p) => {
        if (options?.exact_size_class && refSizeClass !== "UNKNOWN") {
          return p.size_class === refSizeClass;
        }
        return true;
      })
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, this.maxCandidates);

    return {
      org_number: orgNumber,
      company_name: options?.company_name ?? reference?.company_name ?? "Ukjent",
      nace_code: naceCode,
      nace_name: candidates[0]?.industry_name ?? reference?.industry_name,
      size_class: refSizeClass,
      peers,
      candidates_found: candidates.length,
      peers_selected: peers.length,
    };
  }

  private async fetchNace(orgNumber: string): Promise<string | undefined> {
    const company = await this.fetchCompany(orgNumber);
    return company?.industry_code;
  }

  private async fetchCompany(orgNumber: string): Promise<BrregCompany | undefined> {
    const resp = await this.fetcher(
      `https://data.brreg.no/enhetsregisteret/api/enheter/${orgNumber}`,
      { headers: { "Accept": "application/json" }, signal: AbortSignal.timeout(10_000) }
    );
    if (!resp.ok) return undefined;
    const u = (await resp.json()) as Record<string, unknown>;
    return {
      org_number: String(u.organisasjonsnummer ?? orgNumber),
      company_name: String(u.navn ?? ""),
      industry_code: (u.naeringskode1 as Record<string, unknown>)?.kode as string | undefined,
      industry_name: (u.naeringskode1 as Record<string, unknown>)?.beskrivelse as string | undefined,
      employees: u.antallAnsatte as number | undefined,
      municipality: (u.postadresse as Record<string, unknown>)?.kommune as string | undefined,
    };
  }

  private async fetchCandidates(naceCode: string, excludeOrgNumber: string): Promise<BrregCompany[]> {
    // Verifisert syntaks: naeringskode=15.200 (med punktum). Uten sort (komma feiler).
    const url = `${this.baseUrl}?naeringskode=${encodeURIComponent(naceCode)}&size=${this.maxCandidates}`;
    const resp = await this.fetcher(url, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) return [];
    const body = (await resp.json()) as { _embedded?: { enheter?: Array<Record<string, unknown>> } };
    const list = body?._embedded?.enheter ?? [];
    return list
      .filter((u) => String(u.organisasjonsnummer) !== excludeOrgNumber)
      .map((u) => ({
        org_number: String(u.organisasjonsnummer),
        company_name: String(u.navn ?? ""),
        industry_code: (u.naeringskode1 as Record<string, unknown>)?.kode as string | undefined,
        industry_name: (u.naeringskode1 as Record<string, unknown>)?.beskrivelse as string | undefined,
        employees: u.antallAnsatte as number | undefined,
        municipality: (u.postadresse as Record<string, unknown>)?.kommune as string | undefined,
      }));
  }
}
