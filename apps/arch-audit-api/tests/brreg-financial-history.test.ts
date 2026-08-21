// brreg-financial-history.test.ts — enhetstest for BrregFinancialHistoryCollector
// Teststruktur verifisert mot EKTE Brreg-data (ALFA SKO AS, 2026-08-21)
import { describe, it, expect } from "vitest";
import { BrregFinancialHistoryCollector } from "../src/collectors/brreg-financial-history";

// Autentisk Brreg-svarstruktur (fra ekte ALFA SKO AS — org.nr 951001880)
const alfaSkoResponse = [
  {
    "regnskapsperiode": { "fraDato": "2025-01-01", "tilDato": "2025-12-31" },
    "valuta": "NOK",
    "revisjon": { "revidert": true },
    "resultatregnskapResultat": {
      "driftsresultat": {
        "driftsresultat": -19318991,
        "driftsinntekter": { "sumDriftsinntekter": 146693681 }
      }
    },
    "egenkapitalGjeld": {
      "sumEgenkapitalGjeld": 133194811,
      "egenkapital": { "sumEgenkapital": 30109263 },
      "gjeldOversikt": { "sumGjeld": 103085548, "kortsiktigGjeld": { "sumKortsiktigGjeld": 103085548 } }
    },
    "eiendeler": { "sumEiendeler": 133194811 }
  }
];

describe("BrregFinancialHistoryCollector", () => {
  it("parserer og normaliserer regnskapsår med korrekte felt", async () => {
    const fetcher = (async () => new Response(JSON.stringify(alfaSkoResponse), { status: 200 })) as unknown as typeof fetch;
    const collector = new BrregFinancialHistoryCollector(fetcher);

    const result = await collector.collect("951001880", "ALFA SKO AS");
    expect(result.history).not.toBeNull();
    expect(result.history?.org_number).toBe("951001880");
    expect(result.history?.data_points).toBe(1);
    expect(result.history?.latest_year).toBe("2025");
    const year = result.history?.years[0];
    expect(year?.revenue).toBe(146693681);
    expect(year?.operating_result).toBe(-19318991);
    expect(year?.equity).toBe(30109263);
    expect(year?.total_assets).toBe(133194811);
    expect(year?.total_liabilities).toBe(103085548);
    expect(year?.audited).toBe(true);
  });

  it("genererer trender med margin og EK-ratio", async () => {
    const fetcher = (async () => new Response(JSON.stringify(alfaSkoResponse), { status: 200 })) as unknown as typeof fetch;
    const collector = new BrregFinancialHistoryCollector(fetcher);

    const result = await collector.collect("951001880");
    const margin = result.history?.trends.find((t) => t.key === "operating_margin");
    const equity = result.history?.trends.find((t) => t.key === "equity_ratio");
    expect(margin?.values[0].value).toBeCloseTo(-13.17, 1);
    expect(equity?.values[0].value).toBeCloseTo(22.61, 1);
  });

  it("returnerer null history ved HTTP-feil", async () => {
    const fetcher = (async () => new Response("Not Found", { status: 404 })) as unknown as typeof fetch;
    const collector = new BrregFinancialHistoryCollector(fetcher);
    const result = await collector.collect("000000000");
    expect(result.history).toBeNull();
    expect(result.error).toBeDefined();
  });

  it("returnerer null history ved tom liste", async () => {
    const fetcher = (async () => new Response(JSON.stringify([]), { status: 200 })) as unknown as typeof fetch;
    const collector = new BrregFinancialHistoryCollector(fetcher);
    const result = await collector.collect("000000000");
    expect(result.history).toBeNull();
  });

  it("bruker den kanoniske Brreg-ressursen uten query-parametere", async () => {
    let requestedUrl = "";
    const fetcher = (async (input: RequestInfo | URL) => {
      requestedUrl = String(input);
      return new Response(JSON.stringify(alfaSkoResponse), { status: 200 });
    }) as unknown as typeof fetch;
    const collector = new BrregFinancialHistoryCollector(fetcher);

    await collector.collect("951001880");

    expect(requestedUrl).toBe("https://data.brreg.no/regnskapsregisteret/regnskap/951001880");
  });

  it("bygger evidens-entries for hvert år", async () => {
    const fetcher = (async () => new Response(JSON.stringify(alfaSkoResponse), { status: 200 })) as unknown as typeof fetch;
    const collector = new BrregFinancialHistoryCollector(fetcher);
    const result = await collector.collect("951001880");
    expect(result.raw.length).toBe(1);
    expect(result.raw[0].type).toBe("FINANCIAL_EVENT");
    expect(result.raw[0].source).toBe("brreg-regnskap");
    expect(result.raw[0].confidence).toBe("VERIFIED");
  });
});
