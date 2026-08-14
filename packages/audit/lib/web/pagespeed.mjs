// PageSpeed Insights-modul — Arch Website Audit v2 (ARC-10, plan §1.8).
//
// Bruker Google PageSpeed Insights API (gratis, anonym tilgang uten nøkkel ved lav trafikk).
// Gir EKTE Chrome User Experience Report-data (CrUX felt-data: LCP/INP/CLS) + Lighthouse-labdata.
//
// Regler:
//   - Ingen fabrikasjon: felt-data vises KUN hvis API-et faktisk returnerer dem
//     (loadingExperience). Mangler felt-data → UNKNOWN «for lite trafikk for CrUX».
//   - Lab-score er øyeblikksbilde av ETT kjøretidspunkt — evidence sier det eksplisitt.
//   - Passiv/read-only: én GET per strategi (mobile + desktop), rate-limit: sov 1s mellom kall.

const NOW = () => new Date().toISOString();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const check = (id, label, result, evidence, confidence = "high", source = "pagespeed_api") => ({
  id, label, dimension: "performance", result, evidence, confidence, source, observed_at: NOW(),
});

async function runPagespeed(url, strategy, apiKey) {
  const key = apiKey || process.env.GOOGLE_PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY || "";
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance${key ? `&key=${key}` : ""}`;
  // Anonym tilgang er kraftig rate-begrenset (429 ved delt IP) — prøv 2 ganger med backoff.
  for (let attempt = 1; attempt <= 2; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch(api, { signal: ctrl.signal, headers: { "user-agent": "ArchAudit/2.0 (passiv website-audit)" } });
      if (res.status === 429 && attempt < 2) { clearTimeout(t); await sleep(5000); continue; }
      if (!res.ok) return { error: `HTTP ${res.status}`, strategy };
      return { ...(await res.json()), strategy };
    } catch (e) {
      return { error: String(e.message || e).split("\n")[0], strategy };
    } finally {
      clearTimeout(t);
    }
  }
  return { error: "HTTP 429 (rate-limit, to forsøk)", strategy };
}

const ms = (v) => (typeof v === "number" ? `${Math.round(v)} ms` : String(v));

export async function collectPageSpeed(targetUrl, opts = {}) {
  const section = "pagespeed";
  const title = "Fart (PageSpeed Insights + CrUX)";
  const checks = [];
  const raw = { mobile: null, desktop: null };

  const strategies = opts.strategies ?? ["mobile", "desktop"];
  for (const strategy of strategies) {
    const r = await runPagespeed(targetUrl, strategy, opts.apiKey);
    raw[strategy] = { error: r.error ?? null, data: r.error ? null : r };
    await sleep(1000); // rate-limit: 1 req/s
  }

  let anyOk = false;
  for (const strategy of strategies) {
    const entry = raw[strategy];
    if (entry.error || !entry.data) {
      checks.push(check(`psi_${strategy}`, `PageSpeed ${strategy === "mobile" ? "mobil" : "desktop"}`, "UNKNOWN",
        entry.error ? `API-feil: ${entry.error}` : "ingen respons", "medium"));
      continue;
    }
    anyOk = true;
    const d = entry.data;
    const cat = d.lighthouseResult?.categories?.performance?.score;
    const lab = d.lighthouseResult?.audits ?? {};
    const labLcp = lab["largest-contentful-paint"]?.displayValue ?? null;
    const labCls = lab["cumulative-layout-shift"]?.displayValue ?? null;
    const labInp = lab["interaction-to-next-paint"]?.displayValue ?? null;
    const labTbt = lab["total-blocking-time"]?.displayValue ?? null;
    const pct = typeof cat === "number" ? Math.round(cat * 100) : null;

    const evidence = [
      pct !== null ? `lab-score ${pct}/100` : null,
      labLcp ? `LCP ${labLcp}` : null,
      labCls ? `CLS ${labCls}` : null,
      labInp ? `INP ${labInp}` : null,
      labTbt ? `TBT ${labTbt}` : null,
      `(lab-måling — øyeblikksbilde av ett kjøretidspunkt)`,
    ].filter(Boolean).join(" · ");

    checks.push(check(`psi_${strategy}`, `PageSpeed lab (${strategy === "mobile" ? "mobil" : "desktop"})`,
      pct !== null ? (pct >= 90 ? "PASS" : "FAIL") : "UNKNOWN",
      evidence, "medium"));

    // CrUX felt-data — KUN hvis API-et returnerer dem (ellers UNKNOWN, ikke fabriker)
    const fe = d.loadingExperience;
    if (fe?.metrics) {
      const m = fe.metrics;
      const fld = [
        m.LARGEST_CONTENTFUL_PAINT_MS ? `LCP ${ms(m.LARGEST_CONTENTFUL_PAINT_MS.percentile)}` : null,
        m.CUMULATIVE_LAYOUT_SHIFT_SCORE ? `CLS ${m.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile}` : null,
        m.INTERACTION_TO_NEXT_PAINT_MS ? `INP ${ms(m.INTERACTION_TO_NEXT_PAINT_MS.percentile)}` : null,
      ].filter(Boolean).join(" · ");
      const cat2 = fe.overall_category ?? "";
      checks.push(check(`psi_crux_${strategy}`, `Ekte brukerdata (CrUX, ${strategy === "mobile" ? "mobil" : "desktop"})`,
        cat2 ? (cat2 === "GOOD" || cat2 === "FAST" ? "PASS" : "FAIL") : "UNKNOWN",
        fld ? `${fld} · kategori: ${cat2 || "ukjent"}` : "ingen feltdata", "high", "pagespeed_crux"));
    } else {
      checks.push(check(`psi_crux_${strategy}`, `Ekte brukerdata (CrUX, ${strategy === "mobile" ? "mobil" : "desktop"})`,
        "UNKNOWN", "for lite trafikk for CrUX-feltdata — kun lab-måling tilgjengelig", "high", "pagespeed_crux"));
    }
  }

  if (!anyOk) {
    checks.push(check("psi_availability", "PageSpeed API tilgjengelig", "UNKNOWN",
      "API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig", "medium"));
  }

  return { section, title, checks, raw };
}

// Direkte kjøring: node packages/audit/lib/web/pagespeed.mjs https://klarpakke.no
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const url = process.argv[2];
  if (!url) { console.error("Bruk: node pagespeed.mjs <url>"); process.exit(2); }
  collectPageSpeed(url).then((r) => console.log(JSON.stringify(r, null, 2)));
}
