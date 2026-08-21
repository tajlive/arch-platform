// peer-group.test.ts — enhetstest for PeerGroupBuilder
// Verifisert mot ekte Brreg-struktur (2026-08-21)
import { describe, it, expect } from "vitest";
import { PeerGroupBuilder, sizeClassFor, similarityScore } from "../src/peer-group";

// Autentisk Brreg enhet-svarstruktur
const brregEnheterResponse = {
  _embedded: {
    enheter: [
      { organisasjonsnummer: "932520516", navn: "EIK TRESKOFABRIKK AS", naeringskode1: { kode: "15.200", beskrivelse: "Produksjon av skotøy" }, antallAnsatte: 6, postadresse: { kommune: "Ski" } },
      { organisasjonsnummer: "916915500", navn: "PROTEX AS", naeringskode1: { kode: "15.200", beskrivelse: "Produksjon av skotøy" }, antallAnsatte: 5, postadresse: { kommune: "Oslo" } },
      { organisasjonsnummer: "918541276", navn: "FENRIR SKOFABRIKK AS", naeringskode1: { kode: "15.200", beskrivelse: "Produksjon av skotøy" }, antallAnsatte: 12, postadresse: { kommune: "Trondheim" } },
      { organisasjonsnummer: "951001880", navn: "ALFA SKO AS", naeringskode1: { kode: "15.200", beskrivelse: "Produksjon av skotøy" }, antallAnsatte: 23, postadresse: { kommune: "Oslo" } },
    ],
  },
};

const brregEnhetResponse = {
  organisasjonsnummer: "951001880",
  navn: "ALFA SKO AS",
  naeringskode1: { kode: "15.200", beskrivelse: "Produksjon av skotøy" },
  antallAnsatte: 23,
  postadresse: { kommune: "Oslo" },
};

describe("sizeClassFor", () => {
  it("klassifiserer etter ansatte-terskel", () => {
    expect(sizeClassFor(6)).toBe("MICRO");
    expect(sizeClassFor(23)).toBe("SMALL");
    expect(sizeClassFor(100)).toBe("MEDIUM");
    expect(sizeClassFor(500)).toBe("LARGE");
    expect(sizeClassFor(undefined)).toBe("UNKNOWN");
  });
});

describe("similarityScore", () => {
  it("gir høyere score for lik størrelse", () => {
    const ref = { employees: 20, municipality: "Oslo" };
    const close = { employees: 22, municipality: "Oslo" };
    const far = { employees: 200, municipality: "Bergen" };
    expect(similarityScore(ref, close)).toBeGreaterThan(similarityScore(ref, far));
  });
});

describe("PeerGroupBuilder", () => {
  it("bygger peer-gruppe fra NACE, ekskluderer referanseselskapet", async () => {
    const fetcher = (async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/enheter/951001880")) {
        return new Response(JSON.stringify(brregEnhetResponse), { status: 200 });
      }
      return new Response(JSON.stringify(brregEnheterResponse), { status: 200 });
    }) as unknown as typeof fetch;
    const builder = new PeerGroupBuilder(fetcher);

    const result = await builder.build("951001880", { company_name: "ALFA SKO AS" });
    expect(result.nace_code).toBe("15.200");
    expect(result.nace_name).toBe("Produksjon av skotøy");
    expect(result.size_class).toBe("SMALL");
    // 4 enheter totalt, 1 er referansen → 3 peers
    expect(result.peers.length).toBe(3);
    expect(result.candidates_found).toBe(3);
    // Referanseselskapet (ALFA) må være ekskludert
    expect(result.peers.some((p) => p.org_number === "951001880")).toBe(false);
    // Sortert etter similarity-score desc
    expect(result.peers[0].similarity_score).toBeGreaterThanOrEqual(result.peers[1].similarity_score);
  });

  it("returnerer note når NACE mangler", async () => {
    const fetcher = (async () => new Response(JSON.stringify({}), { status: 200 })) as unknown as typeof fetch;
    const builder = new PeerGroupBuilder(fetcher);

    const result = await builder.build("000000000", { company_name: "Ukjent" });
    expect(result.peers.length).toBe(0);
    expect(result.note).toBeDefined();
  });
});
