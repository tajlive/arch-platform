import type { RawEvidence } from "../evidence-graph";
import type { EvidenceSource } from "../research-orchestrator";

export interface DigitalFootprint {
  website: string;
  source_url?: string;
  page_title?: string;
  page_description?: string;
  social_profiles?: string[];
  tech_stack: string[];
  channels: string[];
  has_booking: boolean;
  has_self_service: boolean;
  fetched: boolean;
}

export interface CompanyWebCollectorResult {
  digital: DigitalFootprint | null;
  raw: RawEvidence[];
  source: EvidenceSource;
  error?: string;
}

const MAX_HTML_BYTES = 256_000;
const MAX_REDIRECTS = 2;
const REQUEST_TIMEOUT_MS = 6_000;

function decodeHtml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function boundedText(value: string | undefined, maxLength = 240): string | undefined {
  if (!value) return undefined;
  const clean = decodeHtml(value.replace(/<[^>]+>/g, " "));
  return clean ? clean.slice(0, maxLength) : undefined;
}

function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [first, second] = parts;
  return first === 0
    || first === 10
    || first === 127
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168)
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 198 && (second === 18 || second === 19));
}

function isPublicWebsite(url: URL): boolean {
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  if (url.username || url.password) return false;
  if (url.port && url.port !== "80" && url.port !== "443") return false;
  if (!hostname.includes(".") || hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".internal")) return false;
  if (isPrivateIpv4(hostname)) return false;
  // Registered company websites are domain names; reject IPv6 literals to avoid
  // an incomplete private-network block list.
  if (hostname.includes(":")) return false;
  return true;
}

export function normalizeRegisteredWebsite(value: string | undefined): URL | null {
  const website = value?.trim();
  if (!website || website.startsWith("//")) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`);
    return isPublicWebsite(url) ? url : null;
  } catch {
    return null;
  }
}

async function readTextBounded(response: Response, maxBytes: number): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = value.length > maxBytes - total ? value.slice(0, maxBytes - total) : value;
    chunks.push(chunk);
    total += chunk.length;
    if (chunk.length !== value.length) break;
  }
  await reader.cancel().catch(() => undefined);

  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(output);
}

function firstMatch(html: string, pattern: RegExp): string | undefined {
  const match = html.match(pattern);
  return boundedText(match?.[1]);
}

function attributeValue(tag: string, attribute: string): string | undefined {
  const match = tag.match(new RegExp(`${attribute}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match?.[1];
}

function socialProfilesFrom(html: string): string[] {
  const profiles = new Set<string>();
  const links = html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi);
  for (const match of links) {
    try {
      const url = new URL(decodeHtml(match[1]));
      const hostname = url.hostname.toLowerCase();
      if (/^(?:www\.)?(facebook|instagram|linkedin|tiktok|youtube)\.com$/.test(hostname)) {
        profiles.add(url.toString());
      }
    } catch {
      // Ugyldige lenker er ikke evidens.
    }
    if (profiles.size === 4) break;
  }
  return [...profiles];
}

function parseDigitalFootprint(website: string, sourceUrl: string, html: string): DigitalFootprint {
  const lower = html.toLowerCase();
  const title = firstMatch(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const descriptionTag = metaTags.find((tag) => /\b(?:name|property)\s*=\s*["'](?:description|og:description)["']/i.test(tag));
  const pageDescription = descriptionTag ? boundedText(attributeValue(descriptionTag, "content")) : undefined;
  const techStack: string[] = [];
  const patterns: Array<[RegExp, string]> = [
    [/wp-content|wp-includes|wp-json/i, "WordPress"],
    [/shopify/i, "Shopify"],
    [/google-analytics|gtag|googletagmanager/i, "Google Analytics"],
    [/facebook|fbq\(/i, "Facebook Pixel"],
    [/hotjar/i, "Hotjar"],
    [/intercom/i, "Intercom"],
    [/crisp\.chat|crisp-client/i, "Crisp chat"],
    [/tawk\.to/i, "Tawk.to"],
    [/calendly|timebestilling|booking/i, "Booking-system"],
  ];
  for (const [pattern, name] of patterns) if (pattern.test(html)) techStack.push(name);

  const channels: string[] = [];
  if (/\btel:/i.test(html)) channels.push("Telefon");
  if (/\bmailto:/i.test(html)) channels.push("E-post");
  const socialProfiles = socialProfilesFrom(html);
  if (socialProfiles.length) channels.push("Sosiale medier");

  return {
    website,
    source_url: sourceUrl,
    page_title: title,
    page_description: pageDescription,
    social_profiles: socialProfiles,
    tech_stack: techStack,
    channels,
    has_booking: /booking|timebestilling|calendly|\bbestill(?:ing)?\b/i.test(lower),
    has_self_service: /min side|self.?service|kundeportal|\blogin\b/i.test(lower),
    fetched: true,
  };
}

function evidenceFor(digital: DigitalFootprint, observedAt: string): RawEvidence[] {
  const sourceUrl = digital.source_url ?? digital.website;
  const metadata = { website: digital.website, source_url: sourceUrl };
  const raw: RawEvidence[] = [{
    type: "DIGITAL_SIGNAL",
    observation: `Registrert nettsted er tilgjengelig: ${sourceUrl}`,
    source: "website",
    observed_at: observedAt,
    confidence: "HIGH",
    metadata,
  }];

  if (digital.page_title) {
    raw.push({
      type: "DIGITAL_SIGNAL",
      observation: `Nettstedets sidetittel: ${digital.page_title}`,
      source: "website",
      observed_at: observedAt,
      confidence: "HIGH",
      metadata: { ...metadata, signal: "page_title" },
    });
  }
  if (digital.page_description) {
    raw.push({
      type: "DIGITAL_SIGNAL",
      observation: `Nettstedets beskrivelse opplyser: ${digital.page_description}`,
      source: "website",
      observed_at: observedAt,
      confidence: "HIGH",
      metadata: { ...metadata, signal: "page_description" },
    });
  }
  for (const channel of digital.channels) {
    raw.push({
      type: "DIGITAL_SIGNAL",
      observation: `Nettstedet oppgir kontaktkanal: ${channel}`,
      source: "website",
      observed_at: observedAt,
      confidence: "HIGH",
      metadata: { ...metadata, channel },
    });
  }
  for (const profile of digital.social_profiles ?? []) {
    raw.push({
      type: "DIGITAL_SIGNAL",
      observation: `Nettstedet lenker til en sosial profil: ${profile}`,
      source: "website",
      observed_at: observedAt,
      confidence: "HIGH",
      metadata: { ...metadata, profile },
    });
  }
  if (digital.has_booking) {
    raw.push({
      type: "DIGITAL_SIGNAL",
      observation: "Nettstedet viser en bestillingsmulighet",
      source: "website",
      observed_at: observedAt,
      confidence: "HIGH",
      metadata: { ...metadata, signal: "booking" },
    });
  }
  for (const tech of digital.tech_stack) {
    raw.push({
      type: "DIGITAL_SIGNAL",
      observation: `Nettsideanalyse indikerer ${tech}`,
      source: "website",
      observed_at: observedAt,
      confidence: "MEDIUM",
      metadata: { ...metadata, signal: tech },
    });
  }
  return raw;
}

export class CompanyWebDiscoveryCollector {
  private readonly fetcher: typeof fetch;

  constructor(fetcher?: typeof fetch) {
    this.fetcher = fetcher ?? fetch.bind(globalThis);
  }

  async collect(registeredWebsite: string | undefined): Promise<CompanyWebCollectorResult> {
    const fetchedAt = new Date().toISOString();
    const initialUrl = normalizeRegisteredWebsite(registeredWebsite);
    const empty = (status: EvidenceSource["status"], note: string, error?: string): CompanyWebCollectorResult => ({
      digital: null,
      raw: [],
      source: { key: "website", label: "Digital tilstedeværelse", status, fetched_at: fetchedAt, note },
      error,
    });
    if (!registeredWebsite?.trim()) return empty("NOT_AVAILABLE", "Virksomheten har ikke et registrert nettsted.");
    if (!initialUrl) return empty("NOT_AVAILABLE", "Det registrerte nettstedet er ikke en gyldig offentlig HTTP(S)-adresse.", "INVALID_WEBSITE_URL");

    let url = initialUrl;
    try {
      for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
        const response = await this.fetcher(url.toString(), {
          headers: { "Accept": "text/html,application/xhtml+xml", "User-Agent": "Arch-Audit research; passive" },
          redirect: "manual",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get("location");
          if (!location || redirects === MAX_REDIRECTS) return empty("ERROR", "Nettstedet videresendte for mange ganger.", "TOO_MANY_REDIRECTS");
          const nextUrl = new URL(location, url);
          if (!isPublicWebsite(nextUrl)) return empty("ERROR", "Nettstedet videresendte til en ikke-tillatt adresse.", "UNSAFE_REDIRECT");
          url = nextUrl;
          continue;
        }
        if (!response.ok) return empty("ERROR", `Nettstedet svarte med HTTP ${response.status}.`, `HTTP_${response.status}`);
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType && !/text\/html|application\/xhtml\+xml/i.test(contentType)) {
          return empty("EMPTY", "Nettstedet returnerte ikke en offentlig HTML-side.", "NON_HTML_CONTENT");
        }
        const digital = parseDigitalFootprint(registeredWebsite, url.toString(), await readTextBounded(response, MAX_HTML_BYTES));
        return {
          digital,
          raw: evidenceFor(digital, fetchedAt),
          source: { key: "website", label: "Digital tilstedeværelse", status: "AVAILABLE", fetched_at: fetchedAt, note: "Kun offentlig forside; ingen innlogging eller skjemaer brukes." },
        };
      }
    } catch (error) {
      return empty("ERROR", "Nettstedet kunne ikke hentes innenfor sikkerhetsgrensene.", error instanceof Error ? error.name : "WEBSITE_FETCH_FAILED");
    }
    return empty("ERROR", "Nettstedet kunne ikke hentes.", "WEBSITE_FETCH_FAILED");
  }
}
