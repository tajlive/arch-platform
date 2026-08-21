// nav.ts — NAV Arbeidsplassen feed adapter (pam-stilling-feed.nav.no)
// Bruker offisiell feed-API med public token. Feed er paginert, filtreres på vår side.

import { RawEvidence } from "../evidence-graph";
import { EvidenceSource } from "../research-orchestrator";

export interface NavFeedItem {
  id: string;
  title: string;
  url: string;
  content_text: string;
  date_modified: string;
  _feed_entry: {
    uuid: string;
    status: "ACTIVE" | "INACTIVE";
    title: string;
    businessName: string;
    municipal: string;
    sistEndret: string;
  };
}

export interface NavFeedPage {
  version: string;
  title: string;
  home_page_url: string;
  feed_url: string;
  description: string;
  next_url: string | null;
  id: string;
  next_id: string | null;
  items: NavFeedItem[];
}

export interface NavFeedEntry {
  uuid: string;
  sistEndret: string;
  status: "ACTIVE" | "INACTIVE";
  json?: {
    uuid: string;
    published: string;
    expires: string;
    updated: string;
    workLocations: Array<{
      country: string;
      address: string;
      city: string;
      postalCode: string;
      county: string;
      municipal: string;
    }>;
    contactList: Array<{
      name: string;
      email: string;
      phone: string;
      role: string;
      title: string;
    }>;
    title: string;
    description: string;
    sourceurl: string;
    source: string;
    applicationUrl: string;
    applicationDue: string;
    occupationCategories: Array<{ level1: string; level2: string }>;
    categoryList: Array<{ categoryType: string; code: string; name: string; score: number }>;
    jobtitle: string;
    link: string;
    employer: {
      name: string;
      orgnr: string;
      description: string;
      homepage: string;
    };
    engagementtype: string;
    extent: string;
    starttime: string;
    positioncount: string;
    sector: string;
  };
}

export class NavAdapter {
  private baseUrl = "https://pam-stilling-feed.nav.no";
  private publicToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getPublicToken(): Promise<string> {
    const now = Date.now();
    if (this.publicToken && now < this.tokenExpiry) {
      return this.publicToken;
    }
    try {
      const resp = await fetch(`${this.baseUrl}/api/publicToken`, {
        headers: { "Accept": "text/plain" },
        signal: AbortSignal.timeout(5000),
      });
      if (!resp.ok) throw new Error("Token fetch failed");
      const text = await resp.text();
      const lines = text.trim().split("\n");
      const token = lines[lines.length - 1].trim();
      this.publicToken = token;
      this.tokenExpiry = now + 30 * 60 * 1000; // cache 30 min
      return token;
    } catch {
      return "";
    }
  }

  private async fetchFeedPage(url: string, token: string, ifModifiedSince?: string): Promise<NavFeedPage | null> {
    try {
      const headers: Record<string, string> = {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "User-Agent": "Arch-Audit/0.1 (research; contact: arch@axn.no)",
      };
      if (ifModifiedSince) {
        headers["If-Modified-Since"] = ifModifiedSince;
      }
      const resp = await fetch(`${this.baseUrl}${url}`, {
        headers,
        signal: AbortSignal.timeout(15000),
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch {
      return null;
    }
  }

  private async fetchFeedEntry(url: string, token: string): Promise<NavFeedEntry | null> {
    try {
      const resp = await fetch(`${this.baseUrl}${url}`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "User-Agent": "Arch-Audit/0.1",
        },
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch {
      return null;
    }
  }

  // Henter ACTIVE stillinger for et orgnr — bruker If-Modified-Since for nylige annonser
  async searchByOrgNumber(orgNumber: string): Promise<NavFeedItem[]> {
    const token = await this.getPublicToken();
    if (!token) return [];

    const results: NavFeedItem[] = [];
    let pageUrl: string | null = "/api/v1/feed";
    let pagesFetched = 0;
    const maxPages = 5; // ~5000 items
    // Hent kun annonser fra de siste 30 dagene
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toUTCString();

    while (pageUrl && pagesFetched < maxPages) {
      const page = await this.fetchFeedPage(pageUrl, token, thirtyDaysAgo);
      if (!page) break;

      for (const item of page.items) {
        const entry = item._feed_entry;
        if (entry.status === "ACTIVE" && entry.businessName) {
          // Hent detaljer for å få orgnr
          const detail = await this.fetchFeedEntry(item.url, token);
          if (detail?.json?.employer?.orgnr === orgNumber) {
            results.push(item);
          }
        }
      }

      pageUrl = page.next_url;
      pagesFetched++;

      // Lille pause for å være hyggelig
      if (pageUrl) await new Promise(r => setTimeout(r, 100));
    }

    return results;
  }

  // Konverterer NAV feed-items til RawEvidence
  toEvidence(jobs: NavFeedItem[], companyName: string, fetchedAt: string): RawEvidence[] {
    if (jobs.length === 0) return [];

    const evidence: RawEvidence[] = [];

    // Samlet signal: antall ledige stillinger = rekrutteringsaktivitet
    evidence.push({
      type: "WORKFORCE_SIGNAL",
      observation: `${companyName} har ${jobs.length} ledig(e) stilling(er) annonsert på NAV Arbeidsplassen`,
      source: "nav-arbeidsplassen",
      observed_at: fetchedAt,
      confidence: "HIGH",
      freshness: fetchedAt.slice(0, 10),
      metadata: {
        signal: "open_positions_count",
        count: jobs.length,
        source_query: "feed_filter_by_orgnr",
      },
    });

    // Per-stilling evidens (top 10)
    for (const job of jobs.slice(0, 10)) {
      evidence.push({
        type: "WORKFORCE_SIGNAL",
        observation: `${companyName} rekrutterer: ${job.title} i ${job._feed_entry.municipal}`,
        source: "nav-arbeidsplassen",
        observed_at: fetchedAt,
        confidence: "MEDIUM",
        freshness: job.date_modified.slice(0, 10),
        metadata: {
          signal: "job_posting",
          job_id: job.id,
          title: job.title,
          municipality: job._feed_entry.municipal,
          posting_date: job.date_modified,
          feed_url: job.url,
        },
      });
    }

    // Kompetanse-nøkkelord
    const keywords = this.extractKeywords(jobs);
    if (keywords.length > 0) {
      evidence.push({
        type: "WORKFORCE_SIGNAL",
        observation: `${companyName} etterspør kompetanse: ${keywords.slice(0, 15).join(", ")}`,
        source: "nav-arbeidsplassen",
        observed_at: fetchedAt,
        confidence: "MEDIUM",
        freshness: fetchedAt.slice(0, 10),
        metadata: {
          signal: "demanded_skills",
          keywords: JSON.stringify(keywords.slice(0, 30)),
          job_count: jobs.length,
        },
      });
    }

    return evidence;
  }

  private extractKeywords(jobs: NavFeedItem[]): string[] {
    const stopwords = new Set(["og", "eller", "i", "på", "for", "med", "av", "til", "som", "vi", "du", "år", "er", "en", "et", "det", "den", "de", "vi", "år"]);
    const freq = new Map<string, number>();

    for (const job of jobs) {
      const text = [job.title, job.content_text].join(" ").toLowerCase();
      const words = text.split(/\s+/).filter(w => w.length > 2 && !stopwords.has(w));
      for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
    }

    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);
  }

  // Hovedmetode kalt av ResearchOrchestrator
  async collect(orgNumber: string, companyName: string): Promise<{
    raw: RawEvidence[];
    source: EvidenceSource;
  }> {
    const fetchedAt = new Date().toISOString();
    const jobs = await this.searchByOrgNumber(orgNumber);
    const raw = this.toEvidence(jobs, companyName, fetchedAt);

    return {
      raw,
      source: {
        key: "nav-arbeidsplassen",
        label: "Workforce signals",
        status: jobs.length > 0 ? "AVAILABLE" : "EMPTY",
        fetched_at: fetchedAt,
        note: jobs.length === 0 ? "Ingen aktive stillinger funnet for orgnr" : undefined,
      },
    };
  }
}