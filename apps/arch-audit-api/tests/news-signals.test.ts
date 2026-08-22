import { describe, expect, it, vi } from "vitest";
import { NewsSignalCollector } from "../src/collectors/news-signals";

describe("NewsSignalCollector", () => {
  it("beholder bare omtaler med tydelig match mot juridisk selskapsnavn", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(`<?xml version="1.0"?>
      <rss><channel>
        <item>
          <title><![CDATA[SMILE PIZZA &amp; GRILL AS utvider i Trondheim]]></title>
          <link>https://news.example/smile-pizza</link>
          <pubDate>Fri, 21 Aug 2026 10:00:00 GMT</pubDate>
          <source>Adresseavisen</source>
        </item>
        <item>
          <title>Pizza-festival i Trondheim</title>
          <link>https://news.example/festival</link>
          <pubDate>Fri, 21 Aug 2026 10:00:00 GMT</pubDate>
        </item>
      </channel></rss>`, { headers: { "content-type": "application/rss+xml" } }));
    const collector = new NewsSignalCollector(fetcher as unknown as typeof fetch);

    const result = await collector.collect("SMILE PIZZA & GRILL AS", "997788648");

    expect(result.source.status).toBe("AVAILABLE");
    expect(result.signals).toEqual([expect.objectContaining({
      title: "SMILE PIZZA & GRILL AS utvider i Trondheim",
      url: "https://news.example/smile-pizza",
      publisher: "Adresseavisen",
    })]);
    expect(result.raw[0]).toMatchObject({
      type: "MARKET_SIGNAL",
      source: "news-rss",
      confidence: "HIGH",
      metadata: { url: "https://news.example/smile-pizza" },
    });
  });

  it("avviser omtale av en annen juridisk virksomhet med samme korte navn", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(`
      <rss><channel><item><title>Viva Napoli AS i Namsos hadde høy omsetning</title><link>https://news.example/napoli</link></item></channel></rss>
    `));
    const collector = new NewsSignalCollector(fetcher as unknown as typeof fetch);

    const result = await collector.collect("NAPOLI AS", "960486072", "Trondheim");

    expect(result.source.status).toBe("EMPTY");
    expect(result.raw).toEqual([]);
    expect(result.signals).toEqual([]);
  });

  it("tillater et kort juridisk navn bare når kommune og fullt navn matcher", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(`
      <rss><channel><item><title>Frati AS utvider tilbudet i Trondheim</title><link>https://news.example/frati</link></item></channel></rss>
    `));
    const collector = new NewsSignalCollector(fetcher as unknown as typeof fetch);

    const result = await collector.collect("FRATI AS", "951263648", "Trondheim");

    expect(result.source.status).toBe("AVAILABLE");
    expect(result.signals).toHaveLength(1);
  });
});
