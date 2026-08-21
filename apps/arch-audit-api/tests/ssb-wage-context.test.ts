import { describe, expect, it } from "vitest";
import { SsbWageContextCollector } from "../src/collectors/ssb-wage-context";

const METADATA = {
  dimension: {
    Tid: { category: { index: { "2025K2": 0, "2026K2": 1 } } },
    Region: {
      category: {
        index: { Ialt: 0, "50": 1 },
        label: { Ialt: "I alt", "50": "Trøndelag - Trööndelage" },
      },
    },
    NACE2007: {
      category: {
        index: { "55-56": 0 },
        label: { "55-56": "Overnattings- og serveringsvirksomhet" },
      },
    },
  },
};

function dataset(region: "Ialt" | "50") {
  const current = region === "50"
    ? [11000, 11587, 6022, 40600, 42500, 37830, 39940, 101.2, 103.1]
    : [132000, 140054, 79403, 41490, 43640, 38120, 40240, 101.6, 103.4];
  const previous = region === "50"
    ? [10700, 11200, 5880, 39000, 40000, 36500, 38000, 98.7, 98.5]
    : [128000, 136000, 77000, 40000, 42000, 37000, 39000, 98.9, 99.1];
  const values = current.flatMap((value, index) => [previous[index], value]);
  return {
    id: ["Region", "NACE2007", "ContentsCode", "Tid"],
    size: [1, 1, 9, 2],
    value: values,
    dimension: {
      Region: { category: { index: { [region]: 0 } } },
      NACE2007: { category: { index: { "55-56": 0 } } },
      ContentsCode: {
        category: {
          index: {
            Lonsstakere: 0,
            AntArbForhold: 1,
            HeltidsEkvMnd: 2,
            GjAvtaltMdlonn: 3,
            GjMdTotal: 4,
            MedianAvtMndLonn: 5,
            MedianMndLonn: 6,
            GjAvtaltMdlonnIndeks: 7,
            GjMdTotalIndeks: 8,
          },
        },
      },
      Tid: { category: { index: { "2025K2": 0, "2026K2": 1 } } },
    },
  };
}

describe("SsbWageContextCollector", () => {
  it("henter lønns- og arbeidskraftkontekst for NACE og fylke", async () => {
    const requestedUrls: string[] = [];
    const fetcher: typeof fetch = async (input) => {
      const url = String(input);
      requestedUrls.push(url);
      if (url.includes("/metadata")) return Response.json(METADATA);
      return Response.json(dataset(url.includes("valueCodes%5BRegion%5D=50") ? "50" : "Ialt"));
    };

    const result = await new SsbWageContextCollector(fetcher).collect({
      industryCode: "56.101",
      municipalityNumber: "5001",
    });

    expect(result.error).toBeUndefined();
    expect(result.source.status).toBe("AVAILABLE");
    expect(result.context).toMatchObject({
      industry_group: {
        code: "55-56",
        label: "Overnattings- og serveringsvirksomhet",
        based_on_nace_code: "56.101",
      },
      period: "2026K2",
      regional: {
        region_code: "50",
        scope: "county",
        statistics: {
          average_monthly_salary: 42500,
          median_monthly_salary: 39940,
          jobs: 11587,
          full_time_equivalents: 6022,
          average_monthly_salary_growth_pct: 6.25,
        },
      },
      national: {
        region_code: "Ialt",
        scope: "country",
        statistics: { average_monthly_salary: 43640 },
      },
      company_personnel_costs: { status: "NOT_AVAILABLE" },
    });
    expect(result.raw).toHaveLength(5);
    expect(result.raw.every((evidence) => evidence.source === "ssb-lonn")).toBe(true);
    expect(requestedUrls.some((url) => url.includes("valueCodes%5BNACE2007%5D=55-56"))).toBe(true);
  });

  it("returnerer bare nasjonal referanse med eksplisitt avgrensning uten fylkeskobling", async () => {
    const fetcher: typeof fetch = async (input) => {
      const url = String(input);
      if (url.includes("/metadata")) return Response.json(METADATA);
      return Response.json(dataset("Ialt"));
    };

    const result = await new SsbWageContextCollector(fetcher).collect({ industryCode: "56.101" });

    expect(result.context?.regional).toBeNull();
    expect(result.context?.national.statistics.average_monthly_salary).toBe(43640);
    expect(result.context?.caveats.join(" ")).toContain("bare nasjonal referanse");
  });

  it("avviser NACE som ikke finnes i SSBs lønnsgrupper uten å gjette", async () => {
    const result = await new SsbWageContextCollector(async () => {
      throw new Error("skal ikke kalles");
    }).collect({ industryCode: "04.000", municipalityNumber: "5001" });

    expect(result.context).toBeNull();
    expect(result.error).toBe("UNSUPPORTED_INDUSTRY");
    expect(result.source.status).toBe("NOT_AVAILABLE");
  });
});
