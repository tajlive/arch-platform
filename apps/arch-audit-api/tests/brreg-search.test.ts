import { afterEach, describe, expect, it, vi } from "vitest";
import { BrregAdapter } from "../src/adapters";

// BrregAdapter.search() — flervalgs-kandidatliste ved firmasøk.
describe("BrregAdapter.search", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returnerer tom liste ved tom/whitespace query", async () => {
    const adapter = new BrregAdapter();
    await expect(adapter.search("   ")).resolves.toEqual([]);
    await expect(adapter.search("")).resolves.toEqual([]);
  });

  it("org.nr (9 siffer) gjør direkte oppslag og returnerer én kandidat", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          organisasjonsnummer: "914780184",
          navn: "Melhus Bil AS",
          organisasjonsform: { beskrivelse: "Aksjeselskap" },
          naeringskode1: { kode: "45.112", beskrivelse: "Bilhandel" },
          postadresse: { kommune: "MELHUS", postnummer: "7224", poststed: "MELHUS" },
          antallAnsatte: 18,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const adapter = new BrregAdapter();
    const result = await adapter.search("914780184");

    expect(result).toHaveLength(1);
    expect(result[0].org_number).toBe("914780184");
    expect(result[0].company_name).toBe("Melhus Bil AS");
    expect(result[0].postal_code).toBe("7224");
    expect(result[0].postal_place).toBe("MELHUS");
    expect(fetchMock).toHaveBeenCalled();
    const orgUrl = fetchMock.mock.calls.map((c) => String(c[0])).find((u) => u.includes("/enheter/914780184"));
    expect(orgUrl).toBeTruthy();
  });

  it("navnesøk returnerer flervalgsliste fra _embedded.enheter", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          _embedded: {
            enheter: [
              {
                organisasjonsnummer: "914780184",
                navn: "Melhus Bil AS",
                organisasjonsform: { beskrivelse: "Aksjeselskap" },
                naeringskode1: { kode: "45.112", beskrivelse: "Bilhandel" },
                postadresse: { kommune: "MELHUS", postnummer: "7224", poststed: "MELHUS" },
                antallAnsatte: 18,
              },
              {
                organisasjonsnummer: "912345678",
                navn: "Melhus Bilutleie AS",
                organisasjonsform: { beskrivelse: "Aksjeselskap" },
                naeringskode1: { kode: "77.110", beskrivelse: "Bilutleie" },
                forretningsadresse: { kommune: "MELHUS", postnummer: "7224", poststed: "MELHUS" },
                antallAnsatte: 3,
              },
            ],
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const adapter = new BrregAdapter();
    const result = await adapter.search("melhus bil");

    expect(result).toHaveLength(2);
    expect(result.map((c) => c.org_number)).toEqual(["914780184", "912345678"]);
    expect(result.map((c) => [c.postal_code, c.postal_place])).toEqual([
      ["7224", "MELHUS"],
      ["7224", "MELHUS"],
    ]);
    // Søket anroper navn-endepunktet med size=8 (flervalg), ikke size=1
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("navn=");
    expect(url).toContain("size=8");
  });

  it("bruker forretningsadresse foran postadresse som geografisk virksomhetssted", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          organisasjonsnummer: "914780184",
          navn: "Eksempel AS",
          postadresse: { kommune: "OSLO", kommunenummer: "0301", postnummer: "0101", poststed: "OSLO" },
          forretningsadresse: { kommune: "TRONDHEIM", kommunenummer: "5001", postnummer: "7010", poststed: "TRONDHEIM" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await new BrregAdapter().search("914780184");

    expect(result[0]).toMatchObject({
      municipality: "TRONDHEIM",
      municipality_number: "5001",
      postal_code: "7010",
      postal_place: "TRONDHEIM",
    });
  });

  it("returnerer tom liste ved HTTP-feil", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("boom", { status: 500 })));
    const adapter = new BrregAdapter();
    await expect(adapter.search("finnes ikke")).resolves.toEqual([]);
  });
});
