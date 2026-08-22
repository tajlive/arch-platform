import type { RawEvidence } from "../evidence-graph";
import type { EvidenceSource } from "../research-orchestrator";

const MAX_ITEMS = 5;
const REQUEST_TIMEOUT_MS = 6_000;
const COMPANY_SUFFIXES = new Set(["as", "asa", "ans", "da", "nuf", "sa"]);

export interface NewsSignal {
  title: string;
  url: string;
  publisher?: string;
  published_at?: string;
}

export interface NewsSignalCollectorResult {
  signals: NewsSignal[];
  raw: RawEvidence[];
  source: EvidenceSource;
  error?: string;
}

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function tagValue(item: string, tag: string): string | undefined {
  const match = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  const value = match ? decodeXml(match[1]) : "";
  return value || undefined;
}

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("nb-NO")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchesCompany(title: string, companyName: string, orgNumber: string): boolean {
  const normalizedTitle = normalize(title);
  const legalName = normalize(companyName);
  if (normalizedTitle.includes(legalName) || normalizedTitle.includes(orgNumber)) return true;

  const terms = legalName.split(" ").filter((term) => term.length >= 4 && !COMPANY_SUFFIXES.has(term));
  if (terms.length < 2) return false;
  const matches = terms.filter((term) => new RegExp(`(?:^|\\s)${term}(?:$|\\s)`).test(normalizedTitle));
  return matches.length >= 2;
}

function parseSignals(xml: string, companyName: string, orgNumber: string): NewsSignal[] {
  const seen = new Set<string>();
  const signals: NewsSignal[] = [];
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  for (const item of items) {
    const title = tagValue(item, "title");
    const url = tagValue(item, "link");
    if (!title || !url || !matchesCompany(title, companyName, orgNumber)) continue;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") continue;
    } catch {
      continue;
    }
    const published = tagValue(item, "pubDate");
    const sourceTag = item.match(/<source\b[^>]*>([\s\S]*?)<\/source>/i);
    const publisher = sourceTag ? decodeXml(sourceTag[1]) : undefined;
    const key = `${title.toLocaleLowerCase("nb-NO")}|${url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    signals.push({ title: title.slice(0, 240), url, publisher, published_at: published });
    if (signals.length === MAX_ITEMS) break;
  }
  return signals;
}

function freshDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

export class NewsSignalCollector {
  private readonly fetcher: typeof fetch;

  constructor(fetcher?: typeof fetch) {
    this.fetcher = fetcher ?? fetch.bind(globalThis);
  }

  async collect(companyName: string, orgNumber: string): Promise<NewsSignalCollectorResult> {
    const fetchedAt = new Date().toISOString();
    const empty = (status: EvidenceSource["status"], note: string, error?: string): NewsSignalCollectorResult => ({
      signals: [],
      raw: [],
      source: { key: "news-rss", label: "Nyhetssignaler", status, fetched_at: fetchedAt, note },
      error,
    });
    const query = `"${companyName}"`;
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=no&gl=NO&ceid=NO:no`;
    try {
      const response = await this.fetcher(feedUrl, {
        headers: { "Accept": "application/rss+xml,application/xml,text/xml", "User-Agent": "Arch-Audit research; passive" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) return empty("ERROR", `Nyhetskilden svarte med HTTP ${response.status}.`, `HTTP_${response.status}`);
      const signals = parseSignals(await response.text(), companyName, orgNumber);
      if (!signals.length) {
        return empty("EMPTY", "Ingen nyhetsomtaler med tydelig navnmatch ble funnet.");
      }
      const raw = signals.map((signal): RawEvidence => ({
        type: "MARKET_SIGNAL",
        observation: `Nyhetsomtale med tydelig navnmatch: ${signal.title}${signal.publisher ? ` (${signal.publisher})` : ""}`,
        source: "news-rss",
        observed_at: fetchedAt,
        confidence: "HIGH",
        freshness: freshDate(signal.published_at),
        metadata: {
          url: signal.url,
          publisher: signal.publisher ?? null,
          published_at: signal.published_at ?? null,
          query: companyName,
        },
      }));
      return {
        signals,
        raw,
        source: {
          key: "news-rss",
          label: "Nyhetssignaler",
          status: "AVAILABLE",
          fetched_at: fetchedAt,
          note: "Bare omtaler med tydelig match mot selskapsnavnet vises. Tittel og lenke er evidens; Arch utleder ikke hendelsesdetaljer uten primærkilde.",
        },
      };
    } catch (error) {
      return empty("ERROR", "Nyhetskilden kunne ikke hentes.", error instanceof Error ? error.name : "NEWS_FETCH_FAILED");
    }
  }
}
