import { describe, expect, it, vi } from "vitest";
import { CompanyWebDiscoveryCollector, normalizeRegisteredWebsite } from "../src/collectors/company-web";

describe("CompanyWebDiscoveryCollector", () => {
  it("normaliserer bare offentlige HTTP(S)-nettsteder", () => {
    expect(normalizeRegisteredWebsite("eksempel.no")?.toString()).toBe("https://eksempel.no/");
    expect(normalizeRegisteredWebsite("http://127.0.0.1/admin")).toBeNull();
    expect(normalizeRegisteredWebsite("http://[::1]/admin")).toBeNull();
    expect(normalizeRegisteredWebsite("https://localhost/admin")).toBeNull();
    expect(normalizeRegisteredWebsite("file:///etc/passwd")).toBeNull();
  });

  it("henter en avgrenset offentlig forside og produserer kilde-lenket evidens", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(`
      <html><head>
        <title>Smile Pizza Trondheim</title>
        <meta name="description" content="Pizza og grill i Trondheim">
      </head><body>
        <a href="tel:+4770000000">Ring</a>
        <a href="mailto:hei@smile.example">E-post</a>
        <a href="https://www.instagram.com/smilepizza">Instagram</a>
        <a href="/bestill">Bestill bord</a>
        <script src="/wp-content/theme.js"></script>
      </body></html>
    `, { headers: { "content-type": "text/html; charset=utf-8" } }));
    const collector = new CompanyWebDiscoveryCollector(fetcher as unknown as typeof fetch);

    const result = await collector.collect("smile.example");

    expect(result.source.status).toBe("AVAILABLE");
    expect(result.digital).toMatchObject({
      source_url: "https://smile.example/",
      page_title: "Smile Pizza Trondheim",
      page_description: "Pizza og grill i Trondheim",
      has_booking: true,
      channels: ["Telefon", "E-post", "Sosiale medier"],
    });
    expect(result.raw.some((evidence) => evidence.metadata?.source_url === "https://smile.example/")).toBe(true);
    expect(result.raw.some((evidence) => evidence.observation === "Nettstedet viser en bestillingsmulighet")).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("avviser videresending til en ikke-offentlig adresse", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, {
      status: 302,
      headers: { location: "http://127.0.0.1/internal" },
    }));
    const collector = new CompanyWebDiscoveryCollector(fetcher as unknown as typeof fetch);

    const result = await collector.collect("https://safe.example");

    expect(result.digital).toBeNull();
    expect(result.source.status).toBe("ERROR");
    expect(result.error).toBe("UNSAFE_REDIRECT");
  });
});
