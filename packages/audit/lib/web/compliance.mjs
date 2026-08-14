// Compliance-signaler Norge — Arch Website Audit v2 (ARC-10, plan §1.4).
//
// Deterministisk regex-/tekstsøk på HTML + script/src-URL-er. Ingen headless browser.
// Kilden er KUN offentlig observerbar HTML fra en normal GET — samme som en nettleser ser.
//
// Referanse: docs/f4.3-audit-v2-product-strategy.md §1.4.
//
// TRUST-CLAIMS-POLICY (KLA-264 + plan §1.4) — HARDE REGLER:
//   - ALLE funn formuleres som «signal» / «potential concern» / «krever juridisk vurdering».
//   - ALDRI ordene «compliant», «ikke-compliant» eller «brudd».
//   - ALDRI påstand om GDPR/UU-sertifisering.
//   - Evidence beskriver KUN det som faktisk ble observert i HTML.
//   - PASS = signal observert; FAIL = signal MANGLER (eller uønsket signal observert) →
//     nøytral «potential concern»-formulering. UNKNOWN = kunne ikke verifisere (nettverksfeil).
//
// Sjekk-format (felles konvensjon): { id, label, dimension, result, evidence, confidence, source, observed_at }
//   result ∈ PASS|FAIL|UNKNOWN|NOT_APPLICABLE · dimension = trust_privacy · source = html.

import { pathToFileURL } from "node:url";

const NOW = () => new Date().toISOString();

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const TIMEOUT_MS = 10000;

/** Henter hjemmesiden (GET, 10s timeout, UA Chrome). Returnerer { ok, status, headers, html, error }. */
async function fetchHome(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*" },
      signal: ctrl.signal,
    });
  } catch (e) {
    clearTimeout(t);
    return { ok: false, status: null, headers: {}, html: "", error: String(e.message || e).split("\n")[0] };
  }
  clearTimeout(t);
  const headers = {};
  res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
  let html = "";
  try { html = await res.text(); } catch { /* tom body */ }
  return { ok: res.ok, status: res.status, headers, html, error: null };
}

/** Henter alle script-src-URL-er (for raw/evidence-formål). */
function scriptSrcs(html) {
  const out = [];
  for (const m of html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi)) out.push(m[1]);
  return out;
}

/** Sjekker om et HTML-segment (f.eks. footer) inneholder en personvern-lenke (href ELLER lenketekst). */
function hasPrivacyLink(segment) {
  if (/(?:href\s*=\s*["'][^"']*(?:personvern|privacy|personvernerklæring)[^"']*["'])/i.test(segment)) return true;
  if (/<a\b[^>]*>[^<]*(?:personvern|privacy|personvernerklæring)[^<]*<\/a>/i.test(segment)) return true;
  return false;
}

/** Beskriver en forhåndsavkrysset consent-input uten å lekke rå HTML (kun relevante attributter). */
function describePrechecked(tag) {
  const type = tag.match(/type\s*=\s*["']([^"']+)["']/i)?.[1];
  const name = tag.match(/name\s*=\s*["']([^"']+)["']/i)?.[1];
  const cat = tag.match(/data-cookie-type\s*=\s*["']([^"']+)["']/i)?.[1];
  const cls = tag.match(/class\s*=\s*["']([^"']+)["']/i)?.[1];
  const bits = [];
  if (type) bits.push(`type=${type}`);
  if (cat) bits.push(`data-cookie-type=${cat}`);
  if (name) bits.push(`name=${name}`);
  else if (cls) bits.push(`class=${cls}`);
  return bits.length ? bits.join(", ") : "input med checked-attributt";
}

const CMP_PATTERNS = [
  ["Cookiebot", /cookiebot/i],
  ["OneTrust", /onetrust/i],
  ["Usercentrics", /usercentrics/i],
  ["Cookie Information", /cookieinformation/i],
  ["iubenda", /iubenda/i],
  ["Didomi", /didomi/i],
  ["Osano", /osano/i],
  ["CookieHub", /cookiehub/i],
];

const TRACKER_PATTERNS = [
  ["Google Tag Manager", /googletagmanager\.com/i],
  ["Google Analytics", /google-analytics\.com/i],
  ["Google gtag.js", /\bgtag\b/i],
  ["Facebook Pixel", /connect\.facebook\.net/i],
  ["Hotjar", /hotjar\.com/i],
  ["LinkedIn Insight Tag", /snap\.licdn\.com/i],
  ["Microsoft Clarity", /clarity\.ms/i],
];

// E-handels-signaler (kun hvis observert kjøres pris/angrerett/klage-sjekkene).
// `\b` foran korte ord (kjøp/buy/cart/price/pris) for å unngå sub-streng-treff
// som «Oppkjøpet» (selskapsoppkjøp) eller «surprise».
const SHOP_RE = /handlekurv|handlevogn|shopping\s*cart|\bcart\b|\bkjøp|\bkjop|\bköp|\bbuy\b|\bprice|\bpris/i;
const KR_PRICE_RE = /(?:kr|nok)\s*\d|\d[\d\s,.]*\s*(?:kr|nok)\b/i;

export async function collectCompliance(targetUrl, opts = {}) {
  let url = String(targetUrl || "").trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  let html = opts.html || null;
  let headers = opts.headers || null;
  let fetched = false;
  let status = null;
  let fetchError = null;

  if (!html) {
    const h = await fetchHome(url);
    fetched = true;
    fetchError = h.error;
    status = h.status;
    html = h.html || "";
    headers = h.headers || {};
  }

  const checks = [];
  const check = (id, label, result, evidence, confidence = "high") => ({
    id, label, dimension: "trust_privacy", result, evidence, confidence, source: "html", observed_at: NOW(),
  });

  const raw = {
    url,
    fetched,
    status,
    fetch_error: fetchError ?? null,
    html_length: html.length,
    script_srcs: scriptSrcs(html),
  };

  // Nettverksfeil / tom HTML → UNKNOWN (frahold av bevis ≠ negativt faktum).
  if (!html) {
    checks.push(check("compliance_unavailable", "Compliance-analyse ikke mulig", "UNKNOWN",
      `kunne ikke hente HTML${fetchError ? `: ${fetchError}` : ""} — ikke verifisert`, "low"));
    return { section: "compliance", title: "Compliance-signaler Norge", checks, raw };
  }

  // ── 1. Cookie-banner / samtykke-plattform (CMP) ──
  const cmpNames = [];
  for (const [name, re] of CMP_PATTERNS) if (re.test(html)) cmpNames.push(name);
  const genericBanner =
    /(cookie|informasjonskapsl)/i.test(html) && /(samtykke|godta|godkjenner|aksepter)/i.test(html);
  const bannerFound = cmpNames.length > 0 || genericBanner;
  raw.cmp = { named: cmpNames, generic_text: genericBanner };

  if (cmpNames.length) {
    checks.push(check("cmp_banner", "Cookie-banner / samtykke-plattform (CMP)", "PASS",
      `CMP observert: ${cmpNames.join(", ")}`, "high"));
  } else if (genericBanner) {
    checks.push(check("cmp_banner", "Cookie-banner / samtykke-plattform (CMP)", "PASS",
      "generisk cookie/samtykke-banner observert (norsk tekst: cookie/informasjonskapsler + samtykke/godta/aksepter)", "medium"));
  } else {
    checks.push(check("cmp_banner", "Cookie-banner / samtykke-plattform (CMP)", "FAIL",
      "ingen CMP/banner observert — potential concern, krever juridisk vurdering", "medium"));
  }

  // ── 2. Reelt valg («Avvis»-knapp) — ekomloven § 3-15 ──
  // Ledende ordgrense kun (ikke etterfølgende) — fanger norske bøyninger:
  // «avvis»/«avvise»/«avviser»/«avvist», «avslå»/«avslår», «nekte»/«nekter».
  const rejectMatch = html.match(/\b(avvis|avslå|avsla|nekte|reject|decline)/i)?.[1] ?? null;
  raw.consent_reject = rejectMatch;
  if (!bannerFound) {
    checks.push(check("consent_real_choice", "Reelt valg (avvis-knapp)", "NOT_APPLICABLE",
      "ingen banner/CMP observert", "high"));
  } else if (rejectMatch) {
    checks.push(check("consent_real_choice", "Reelt valg (avvis-knapp)", "PASS",
      `avvis/avslå/reject-alternativ observert («${rejectMatch}»)`, "high"));
  } else {
    checks.push(check("consent_real_choice", "Reelt valg (avvis-knapp)", "FAIL",
      "banner/CMP observert, men ingen «avvis»/reject-alternativ observert — ekomloven § 3-15 krever reelt valg — potential concern, krever juridisk vurdering", "high"));
  }

  // ── 3. Forhåndsavkryssing (checked/selected på consent-inputs) ──
  const precheckedInputs = [];
  for (const m of html.matchAll(/<input\b[^>]*(?:data-cookie-type|consent|cookie|category)[^>]*\bchecked\b[^>]*>/gi)) precheckedInputs.push(m[0]);
  for (const m of html.matchAll(/<input\b[^>]*\bchecked\b[^>]*(?:data-cookie-type|consent|cookie|category)[^>]*>/gi)) precheckedInputs.push(m[0]);
  for (const m of html.matchAll(/<select\b[^>]*(?:consent|cookie|category)[^>]*>[\s\S]*?<option\b[^>]*\bselected\b[^>]*>/gi)) precheckedInputs.push(m[0]);
  // dedup (bevar rekkefølge)
  const prechecked = [...new Set(precheckedInputs)];
  raw.consent_prechecked = { count: prechecked.length, described: prechecked.slice(0, 3).map(describePrechecked) };

  if (prechecked.length) {
    checks.push(check("consent_prechecked", "Forhåndsavkrysset samtykke", "FAIL",
      `forhåndsavkrysset samtykke-input observert (${prechecked.slice(0, 3).map(describePrechecked).join("; ")}) — potential concern, krever juridisk vurdering`, "medium"));
  } else {
    checks.push(check("consent_prechecked", "Forhåndsavkrysset samtykke", "PASS",
      "ingen forhåndsavkryssede samtykke-inputs observert", "high"));
  }

  // ── 4. Personvernerklæring ──
  const footerHtml = html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i)?.[0] ?? "";
  const privacyLinked = hasPrivacyLink(html);
  const privacyInFooter = hasPrivacyLink(footerHtml);
  raw.privacy = { linked: privacyLinked, in_footer: privacyInFooter };

  if (privacyInFooter) {
    checks.push(check("privacy_policy", "Personvernerklæring", "PASS",
      "personvernerklæring lenket i footer", "high"));
  } else if (privacyLinked) {
    checks.push(check("privacy_policy", "Personvernerklæring", "PASS",
      "lenket, ikke i footer", "high"));
  } else {
    checks.push(check("privacy_policy", "Personvernerklæring", "FAIL",
      "ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering", "high"));
  }

  // ── 5. Tredjeparts-trackere ──
  const trackerNames = [];
  for (const [name, re] of TRACKER_PATTERNS) if (re.test(html)) trackerNames.push(name);
  raw.trackers = trackerNames;

  if (trackerNames.length) {
    const gate = bannerFound ? "CMP/banner observert separat" : "ingen synlig samtykke-gating observert";
    checks.push(check("third_party_trackers", "Tredjeparts-trackere", "FAIL",
      `trackere observert (${trackerNames.join(", ")}) — ${gate} — potential concern, krever juridisk vurdering`, "high"));
  } else {
    checks.push(check("third_party_trackers", "Tredjeparts-trackere", "PASS",
      "ingen kjente tredjeparts-trackere observert", "high"));
  }

  // ── 6. Google Fonts ──
  const externalFonts = /fonts\.(googleapis|gstatic)\.com/i.test(html);
  const selfHostedFonts = /["'(/]fonts\/|["']\/fonts\//i.test(html);
  raw.google_fonts = { external: externalFonts, self_hosted: selfHostedFonts };

  if (externalFonts) {
    checks.push(check("google_fonts", "Google Fonts (ekstern)", "FAIL",
      "ekstern Google Fonts observert (IP-data til Google) — signal, krever juridisk vurdering", "high"));
  } else if (selfHostedFonts) {
    checks.push(check("google_fonts", "Google Fonts (ekstern)", "PASS",
      "Google Fonts self-hosted observert (/fonts/-stier)", "high"));
  } else {
    checks.push(check("google_fonts", "Google Fonts (ekstern)", "PASS",
      "ingen ekstern Google Fonts observert", "high"));
  }

  // ── 7. E-handel (kun hvis butikksignaler) ──
  const isShop = SHOP_RE.test(html) || KR_PRICE_RE.test(html);
  raw.ecommerce = { shop_signal: isShop };

  if (!isShop) {
    checks.push(check("ecom_price_vat", "Pris inkl. mva", "NOT_APPLICABLE",
      "ingen e-handels-signaler observert (handlekurv/kjøp/pris)", "high"));
    checks.push(check("ecom_angrerett", "Angrerett-informasjon", "NOT_APPLICABLE",
      "ingen e-handels-signaler observert (handlekurv/kjøp/pris)", "high"));
    checks.push(check("ecom_klage", "Klageadgang / tvisteløsning", "NOT_APPLICABLE",
      "ingen e-handels-signaler observert (handlekurv/kjøp/pris)", "high"));
  } else {
    const priceVat = /inkl\.?\s*mva|inklusive\s+mva|ink\s+mva|pris\s+inkl/i.test(html);
    raw.ecommerce.price_vat = priceVat;
    checks.push(check("ecom_price_vat", "Pris inkl. mva", priceVat ? "PASS" : "FAIL",
      priceVat ? "pris inkl. mva-tekst observert" : "pris inkl. mva ikke observert — potential concern (prisopplysningsforskriften), krever juridisk vurdering", "high"));

    const angrerett = /angrerett|angrerettloven|14\s+dagers?\s+angrerett|rettur/i.test(html);
    raw.ecommerce.angrerett = angrerett;
    checks.push(check("ecom_angrerett", "Angrerett-informasjon", angrerett ? "PASS" : "FAIL",
      angrerett ? "angrerett/rettur-informasjon observert" : "angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering", "high"));

    const klage = /forbrukerrådet|forbrukertvist|klage|tvisteløsning|klagenemnd/i.test(html);
    raw.ecommerce.klage = klage;
    checks.push(check("ecom_klage", "Klageadgang / tvisteløsning", klage ? "PASS" : "FAIL",
      klage ? "klageadgang/tvisteløsning observert" : "klageadgang/tvisteløsning ikke observert — potential concern, krever juridisk vurdering", "high"));
  }

  return { section: "compliance", title: "Compliance-signaler Norge", checks, raw };
}

// Direkte kjøring: node packages/audit/lib/web/compliance.mjs https://klarpakke.no
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const url = process.argv[2];
  if (!url) {
    console.error("Bruk: node packages/audit/lib/web/compliance.mjs <url>");
    process.exit(2);
  }
  collectCompliance(url)
    .then((r) => console.log(JSON.stringify(r, null, 2)))
    .catch((e) => { console.error(e); process.exit(1); });
}
