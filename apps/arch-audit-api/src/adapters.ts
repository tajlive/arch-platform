// adapters.ts — Public Data Adapter contract (canonical)

export interface AdapterInput {
  query: string;      // org.nr eller firmanavn
}

export interface AdapterResult<T> {
  data: T | null;
  source: string;
  fetched_at: string;
  confidence: "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  errors: string[];
}

export interface PublicDataAdapter<T> {
  source: string;
  fetch(input: AdapterInput): Promise<AdapterResult<T>>;
}

// ── Brønnøysund Enhetsregisteret ────────────────────────────

export interface BrregCompany {
  org_number: string;
  company_name: string;
  org_form?: string;
  industry_code?: string;
  industry_name?: string;
  employees?: number;
  website?: string;
  municipality?: string;
  municipality_number?: string;
  registered_at?: string;
  roles?: BrregRole[];         // daglig leder, styre, etc.
}

export interface BrregRole {
  role_type: string;           // "DAGL", "STYR", "REVI", "REGN"
  role_description: string;    // "Daglig leder", "Styre"
  person_name?: string;        // IKKE fødselsdato (personvern)
}

interface BrregResponse {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform?: { kode: string; beskrivelse: string };
  naeringskode1?: { kode: string; beskrivelse: string };
  antallAnsatte?: number;
  hjemmeside?: string;
  postadresse?: { kommune?: string; kommunenummer?: string };
  registreringsdatoEnhetsregisteret?: string;
}

export class BrregAdapter implements PublicDataAdapter<BrregCompany> {
  source = "brreg";

  /**
   * Søk som returnerer FLERE kandidater (flervalg).
   * Brukes når brukeren søker på firmanavn som matcher flere enheter.
   * Returnerer tom liste ved ingen treff.
   */
  async search(query: string): Promise<BrregCompany[]> {
    const q = query.trim();
    if (!q) return [];
    // Org.nr → direkte treff (kun én mulig)
    if (/^\d{9}$/.test(q)) {
      const one = await this.fetch({ query: q });
      return one.data ? [one.data] : [];
    }
    const url = `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(q)}&size=8`;
    const resp = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!resp.ok) return [];
    const body: any = await resp.json();
    const list: BrregResponse[] = body?._embedded?.enheter ?? [];
    return list.map((u) => ({
      org_number: u.organisasjonsnummer,
      company_name: u.navn,
      org_form: u.organisasjonsform?.beskrivelse,
      industry_code: u.naeringskode1?.kode,
      industry_name: u.naeringskode1?.beskrivelse,
      employees: u.antallAnsatte,
      website: u.hjemmeside,
      municipality: u.postadresse?.kommune,
      municipality_number: u.postadresse?.kommunenummer,
      registered_at: u.registreringsdatoEnhetsregisteret,
    }));
  }

  async fetch(input: AdapterInput): Promise<AdapterResult<BrregCompany>> {
    const fetched_at = new Date().toISOString();
    const errors: string[] = [];
    try {
      const q = input.query.trim();
      // Hvis det ser ut som org.nr (9 siffer), gjør direkte oppslag
      const isOrgNumber = /^\d{9}$/.test(q);

      let url: string;
      if (isOrgNumber) {
        url = `https://data.brreg.no/enhetsregisteret/api/enheter/${q}`;
      } else {
        url = `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(q)}&size=1`;
      }

      const resp = await fetch(url, {
        headers: { "Accept": "application/json" },
      });

      if (!resp.ok) {
        if (resp.status === 404) {
          return { data: null, source: this.source, fetched_at, confidence: "LOW", errors: ["COMPANY_NOT_FOUND"] };
        }
        return { data: null, source: this.source, fetched_at, confidence: "LOW", errors: [`HTTP_${resp.status}`] };
      }

      const body: any = await resp.json();

      // Navn-søk returnerer { _embedded: { enheter: [...] } }
      let unit: BrregResponse;
      if (!isOrgNumber) {
        const list: BrregResponse[] = body?._embedded?.enheter;
        if (!list || list.length === 0) {
          return { data: null, source: this.source, fetched_at, confidence: "LOW", errors: ["COMPANY_NOT_FOUND"] };
        }
        unit = list[0];
      } else {
        unit = body as BrregResponse;
      }

      const company: BrregCompany = {
        org_number: unit.organisasjonsnummer,
        company_name: unit.navn,
        org_form: unit.organisasjonsform?.beskrivelse,
        industry_code: unit.naeringskode1?.kode,
        industry_name: unit.naeringskode1?.beskrivelse,
        employees: unit.antallAnsatte,
        website: unit.hjemmeside,
        municipality: unit.postadresse?.kommune,
        municipality_number: unit.postadresse?.kommunenummer,
        registered_at: unit.registreringsdatoEnhetsregisteret,
      };

      // Hent roller (daglig leder, styre) — separat kall, best effort.
      // Personvern: henter KUN navn, aldri fødselsdato.
      try {
        const rolesResp = await fetch(
          `https://data.brreg.no/enhetsregisteret/api/enheter/${company.org_number}/roller`,
          { headers: { "Accept": "application/json" } }
        );
        if (rolesResp.ok) {
          const rolesBody: any = await rolesResp.json();
          const roles: BrregRole[] = [];
          for (const group of rolesBody?.rollegrupper ?? []) {
            const type = group?.type?.beskrivelse ?? group?.type?.kode ?? "Ukjent";
            for (const r of group?.roller ?? []) {
              if (r?.person?.navn) {
                roles.push({
                  role_type: r?.type?.kode ?? "UKJENT",
                  role_description: type,
                  person_name: `${r.person.navn.fornavn ?? ""} ${r.person.navn.etternavn ?? ""}`.trim(),
                });
              }
            }
          }
          if (roles.length > 0) company.roles = roles;
        }
      } catch {
        // Roller er best-effort — ikke kritisk hvis det feiler
      }

      return {
        data: company,
        source: this.source,
        fetched_at,
        confidence: "HIGH", // Brønnøysund = canonical selskapskilde
        errors,
      };
    } catch (e) {
      errors.push("FETCH_ERROR");
      return { data: null, source: this.source, fetched_at, confidence: "LOW", errors };
    }
  }
}
