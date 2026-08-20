// rate-limiter.ts — Durable Object global rate limiter (Cloudflare-native)
//
// Hvorfor Durable Object fremfor in-memory (P1C sin per-isolate løsning):
// - Workers er stateless: in-memory Map er per-isolate, resettes ved cold start,
//   og deles IKKE på tvers av isolates/lokasjoner → bulk scraping kan omgå den.
// - Durable Object er en singleton per key → GLOBAL state, atomisk (single-threaded),
//   og korrekt på tvers av alle requests til samme key.
//
// Cloudflare Rate Limiting Rules (http_ratelimit phase) krever Pro/Business —
// ikke tilgjengelig på Free-plan. Durable Object er den Cloudflare-native løsningen
// som faktisk er tilgjengelig og produksjonsklar her.

export interface RateLimiterEnv {
  RATE_LIMITER: DurableObjectNamespace;
}

// Profiler (direktiv P1E Fase 2)
export type RateProfile = "anonymous" | "authenticated" | "internal";

interface ProfileConfig {
  max: number;        // maks requests i vinduet
  windowMs: number;   // vindu-lengde
}

const PROFILES: Record<RateProfile, ProfileConfig> = {
  // Anonymous discovery: lav terskel — stop scraping/AI-abuse/D1-exhaustion
  anonymous: { max: 30, windowMs: 60_000 },
  // Authenticated user: høyere grense
  authenticated: { max: 300, windowMs: 60_000 },
  // Internal: restriktiv men praktisk
  internal: { max: 120, windowMs: 60_000 },
};

export class RateLimiter {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const profile = (url.searchParams.get("profile") ?? "anonymous") as RateProfile;
    const config = PROFILES[profile] ?? PROFILES.anonymous;

    const now = Date.now();

    // Les window start + count fra DO storage (persistent, global)
    const stored = await this.state.storage.get<{ windowStart: number; count: number }>("window");
    let { windowStart, count } = stored ?? { windowStart: now, count: 0 };

    // Reset hvis vinduet er utløpt
    if (now - windowStart >= config.windowMs) {
      windowStart = now;
      count = 0;
    }

    if (count >= config.max) {
      const retryAfter = Math.ceil((windowStart + config.windowMs - now) / 1000);
      return Response.json(
        { error: { code: "RATE_LIMITED", message: "For mange forespørsler." } },
        {
          status: 429,
          headers: { "Retry-After": String(Math.max(1, retryAfter)) },
        }
      );
    }

    count++;
    await this.state.storage.put("window", { windowStart, count });

    return Response.json({ allowed: true, remaining: config.max - count });
  }
}
