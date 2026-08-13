// Website-innsamling — Arch Website Audit v1 (F4.2B).
//
// Passiv, read-only, utenfor-inn: samler KUN offentlig observerbar informasjon via
// normale HTTP GET/HEAD-forespørsler (samme som en vanlig nettleser).
//
// Sikkerhetsregler:
//   - ingen login-bypass, ingen aggressive tester, ingen exploits, ingen mutasjoner
//   - ingen skjema-submit, GET/HEAD kun, same-origin crawl, begrenset sideantall,
//     konservativ forespørselsrate, respekterer robots.txt
//   - interne systemer som ikke er observerbare → UNKNOWN, aldri FAIL
//
// Hver sjekk bærer provenance: { result, evidence, source, observed_at, confidence }.
// `result` ∈ PASS | FAIL | UNKNOWN | NOT_APPLICABLE.

const NOW = () => new Date().toISOString();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const DIM = {
  perf: "performance",
  sec: "security",
  ux: "ux_mobile",
  acc: "accessibility",
  seo: "seo",
  rel: "reliability",
  trust: "trust_privacy",
};

const check = (dimension, id, label, result, evidence, confidence = "high") => ({
  id, label, dimension, result, evidence, confidence, source: "http", observed_at: NOW(),
});

/** Henter URL med manuell redirect-følging (registrerer hver hop). */
async function httpGet(url, { method = "GET", timeout = 10000, maxRedirects = 6 } = {}) {
  const redirects = [];
  let current = url;
  for (let i = 0; i <= maxRedirects; i++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    let res;
    try {
      res = await fetch(current, { method, redirect: "manual", headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*" }, signal: ctrl.signal });
    } catch (e) {
      clearTimeout(t);
      return { ok: false, error: String(e.message || e).split("\n")[0], url: current, redirects };
    }
    clearTimeout(t);
    const headers = {};
    res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    const status = res.status;
    if ([301, 302, 303, 307, 308].includes(status) && headers.location) {
      const next = new URL(headers.location, current).toString();
      redirects.push({ from: current, to: next, status });
      current = next;
      continue;
    }
    let body = "";
    if (method === "GET") { try { body = await res.text(); } catch { body = ""; } }
    return { ok: res.ok, status, statusText: res.statusText, headers, body, url: current, redirects, finalUrl: current };
  }
  return { ok: false, error: "for mange redirects", url: current, redirects };
}

const htmlMatches = (html, re) => Array.from(html.matchAll(re)).map((m) => m[1] ?? m[0]);

function parseLinks(html, baseUrl) {
  const out = [];
  for (const m of html.matchAll(/<a\s[^>]*href=["']([^"']+)["']/gi)) {
    try { out.push(new URL(m[1], baseUrl).toString()); } catch { /* skip */ }
  }
  return out;
}

function parseRobots(text) {
  const disallows = [];
  let active = true;
  for (const line of text.split("\n")) {
    const l = line.split("#")[0].trim();
    if (/^user-agent\s*:/i.test(l)) active = /\*/i.test(l) || /arch-audit/i.test(l);
    else if (active && /^disallow\s*:/i.test(l)) {
      const p = l.replace(/^disallow\s*:\s*/i, "").trim();
      if (p) disallows.push(p);
    }
  }
  return disallows;
}

export async function collect(targetUrl, opts = {}) {
  const cfg = {
    max_pages: 25,
    max_depth: 3,
    delay_ms: 300,
    same_origin_only: true,
    respect_robots: true,
    ...opts,
  };

  let url = String(targetUrl || "").trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  let u;
  try { u = new URL(url); } catch { return { meta: { url, error: "ugyldig URL" }, checks: [], raw: {} }; }
  const origin = u.origin;
  const domain = u.hostname;

  const checks = [];
  const raw = {};

  // ── A. Availability / Reliability ──
  const home = await httpGet(url);
  raw.home = {
    status: home.status ?? null,
    status_text: home.statusText ?? null,
    error: home.error ?? null,
    final_url: home.finalUrl ?? null,
    redirects: home.redirects,
  };
  const statusOk = home.status >= 200 && home.status < 400;
  checks.push(check(DIM.rel, "http_status", "HTTP-status (hovedsiden)", statusOk ? "PASS" : (home.error ? "UNKNOWN" : "FAIL"),
    statusOk ? `HTTP ${home.status}` : (home.error ?? `HTTP ${home.status}`), home.error ? "medium" : "high"));

  // HTTPS
  let httpsOk = false; let httpsDetail = "";
  if (url.startsWith("https://")) {
    httpsOk = !!home.headers && home.status !== undefined;
    httpsDetail = httpsOk ? "HTTPS leverte respons" : "HTTPS feilet";
  } else {
    const s = await httpGet("https://" + domain + "/");
    httpsOk = s.status >= 200 && s.status < 400;
    httpsDetail = httpsOk ? "HTTPS tilgjengelig (HTTP-kall brukt)" : "ingen HTTPS-respons";
  }
  raw.https = { ok: httpsOk, detail: httpsDetail };
  checks.push(check(DIM.sec, "https", "HTTPS/TLS", httpsOk ? "PASS" : "FAIL", httpsDetail, httpsOk ? "high" : "medium"));

  // redirect-chain (http → https)
  raw.redirect_chain = home.redirects;
  const hasHttpToHttps = home.redirects.some((r) => /^http:\/\//i.test(r.from) && /^https:\/\//i.test(r.to));
  checks.push(check(DIM.rel, "redirect_chain", "Omdirigeringskjede", home.redirects.length ? "PASS" : "NOT_APPLICABLE",
    home.redirects.length ? home.redirects.map((r) => `${r.status} ${r.from.split("/")[2]}→${r.to.split("/")[2]}`).join(", ") : "ingen redirects", "high"));

  // ── Hent robots.txt + sitemap ──
  let robotsTxt = null; let robotsDisallow = [];
  try {
    const r = await httpGet(origin + "/robots.txt");
    if (r.status >= 200 && r.status < 400 && r.body) { robotsTxt = r.body; robotsDisallow = parseRobots(r.body); }
  } catch { /* best-effort */ }
  raw.robots = { present: robotsTxt !== null, disallow: robotsDisallow };

  // ── Crawl interne sider (broken links) ──
  const visited = new Set();
  const broken = [];
  const crawlQueue = [{ url: origin + "/", depth: 0 }];
  const crawledPages = [];
  const allowedByRobots = (href) => {
    if (!cfg.respect_robots || !robotsDisallow.length) return true;
    const path = new URL(href).pathname;
    return !robotsDisallow.some((d) => path.startsWith(d));
  };
  while (crawlQueue.length && visited.size < cfg.max_pages) {
    const { url: cu, depth } = crawlQueue.shift();
    if (visited.has(cu)) continue;
    visited.add(cu);
    if (depth > cfg.max_depth) continue;
    await sleep(cfg.delay_ms);
    const page = await httpGet(cu, { method: "HEAD" });
    let pageStatus = page.status;
    if (pageStatus === 405 || pageStatus === 0 || page.error) {
      // HEAD ikke støttet — fall tilbake til GET (kun status)
      await sleep(cfg.delay_ms);
      const g = await httpGet(cu, { method: "GET" });
      pageStatus = g.status;
    }
    if (pageStatus >= 400) broken.push({ url: cu, status: pageStatus });
    else crawledPages.push({ url: cu, status: pageStatus, depth });
    if (depth < cfg.max_depth && pageStatus < 400) {
      const g = await httpGet(cu, { method: "GET" });
      const links = parseLinks(g.body, cu);
      for (const l of links) {
        let lu; try { lu = new URL(l); } catch { continue; }
        if (cfg.same_origin_only && lu.origin !== origin) continue;
        if (!allowedByRobots(l)) continue;
        if (!visited.has(l) && crawledPages.length + crawlQueue.length < cfg.max_pages) crawlQueue.push({ url: l, depth: depth + 1 });
      }
    }
  }
  raw.crawl = { pages_checked: visited.size, crawled: crawledPages.length, broken };
  checks.push(check(DIM.rel, "broken_links", "Ødelagte interne lenker", broken.length ? "FAIL" : "PASS",
    broken.length ? `${broken.length} ødelagt (${broken.slice(0, 3).map((b) => `${b.url.split("/")[2]}${new URL(b.url).pathname} → ${b.status}`).join(", ")})` : `${visited.size} sider sjekket, 0 ødelagt`, "high"));

  // ── Parse hovedsiden ──
  const html = home.body ?? "";
  raw.html_length = html.length;

  const imgs = htmlMatches(html, /<img\b[^>]*>/gi);
  const scripts = htmlMatches(html, /<script\b[^>]*>/gi);
  const stylesheets = htmlMatches(html, /<link\b[^>]*rel=["']?stylesheet[^>]*>/gi);
  const forms = htmlMatches(html, /<form\b[^>]*>/gi);

  // Asset-failures: sample same-origin img/script/stylesheet URL-er for 4xx/5xx
  const assetUrls = new Set();
  for (const tag of [...imgs, ...scripts, ...stylesheets]) {
    const src = tag.match(/(?:src|href)=["']([^"']+)["']/i)?.[1];
    if (!src) continue;
    try { const su = new URL(src, home.finalUrl ?? url); if (su.origin === origin) assetUrls.add(su.toString()); } catch { /* skip */ }
  }
  let assetFailures = 0; const assetChecked = [];
  for (const au of [...assetUrls].slice(0, 10)) {
    await sleep(cfg.delay_ms);
    const ar = await httpGet(au, { method: "HEAD" });
    let s = ar.status;
    if (s === 405 || ar.error) { await sleep(cfg.delay_ms); const ag = await httpGet(au, { method: "GET" }); s = ag.status; }
    assetChecked.push({ url: au, status: s });
    if (s >= 400) assetFailures++;
  }
  raw.asset_failures = { checked: assetChecked.length, failed: assetFailures, details: assetChecked.filter((a) => a.status >= 400) };
  const assetEv = assetChecked.length === 0
    ? "ingen same-origin-ressurser å sample"
    : assetFailures ? `${assetFailures} av ${assetChecked.length} ressurser feiler` : `0 av ${assetChecked.length} ressurser feilet`;
  checks.push(check(DIM.rel, "asset_failures", "Ressurs-feil (img/css/js)", assetFailures ? "FAIL" : "PASS", assetEv, "high"));

  // ── B. Performance ──
  const encoding = home.headers["content-encoding"];
  raw.compression = encoding ?? null;
  checks.push(check(DIM.perf, "compression", "Komprimering (gzip/brotli)", encoding ? "PASS" : "FAIL",
    encoding ?? "ingen content-encoding", "high"));

  const cacheControl = home.headers["cache-control"];
  raw.caching = cacheControl ?? null;
  checks.push(check(DIM.perf, "caching", "Cache-headere", cacheControl ? "PASS" : "FAIL", cacheControl ?? "ingen cache-control", "high"));

  const headScriptsBlocking = scripts.filter((s) => {
    if (/\basync\b|\bdefer\b/i.test(s)) return false;            // eksplisitt utsatt
    if (/type\s*=\s*["']?module/i.test(s)) return false;          // module = deferred av spec
    if (!/\bsrc\s*=/i.test(s)) return false;                       // inline (uten src) = ikke nettverksressurs
    return true;
  });
  raw.render_blocking_scripts = headScriptsBlocking.length;
  checks.push(check(DIM.perf, "render_blocking", "Render-blokkerende ressurser", headScriptsBlocking.length ? "FAIL" : "PASS",
    `${headScriptsBlocking.length} blokkerende skript, ${stylesheets.length} stylesheets`, "medium"));

  const imgWithDims = imgs.filter((i) => /\bwidth\s*=/i.test(i) && /\bheight\s*=/i.test(i)).length;
  const imgLazy = imgs.filter((i) => /loading=["']?lazy/i.test(i)).length;
  raw.images = { total: imgs.length, with_dimensions: imgWithDims, lazy: imgLazy };
  checks.push(check(DIM.perf, "image_optim", "Bilde-optimalisering", imgs.length && (imgWithDims < imgs.length || !imgLazy) ? "FAIL" : (imgs.length ? "PASS" : "NOT_APPLICABLE"),
    imgs.length ? `${imgs.length} bilder, ${imgWithDims} m/ dimensjoner, ${imgLazy} lazy` : "ingen <img>", "medium"));

  const thirdParty = new Set();
  for (const tag of [...scripts, ...imgs, ...stylesheets]) {
    const src = tag.match(/(?:src|href)=["']([^"']+)["']/i)?.[1];
    if (!src) continue;
    try {
      const su = new URL(src, home.finalUrl ?? url);
      if (su.origin !== origin) thirdParty.add(su.hostname);
    } catch { /* skip */ }
  }
  raw.third_party = [...thirdParty];
  checks.push(check(DIM.perf, "third_party", "Tredjeparts-skript/-ressurser", thirdParty.size > 6 ? "FAIL" : "PASS",
    `${thirdParty.size} eksterne domener${thirdParty.size ? ` (${[...thirdParty].slice(0, 5).join(", ")})` : ""}`, "medium"));

  // ── C. Mobile / Responsive ──
  const viewport = /<meta[^>]*name=["']viewport["']/i.test(html);
  raw.viewport = viewport;
  checks.push(check(DIM.ux, "viewport", "Viewport meta", viewport ? "PASS" : "FAIL", viewport ? "viewport tilstede" : "mangler viewport meta", "high"));

  // media queries (best-effort: fetch første same-origin stylesheet)
  let mediaQueries = false; let mediaQueriesObserved = false;
  for (const ss of stylesheets.slice(0, 3)) {
    const href = ss.match(/href=["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    try {
      const su = new URL(href, home.finalUrl ?? url);
      if (su.origin !== origin) continue;
      const css = await httpGet(su.toString());
      if (/@media\b/i.test(css.body)) { mediaQueries = true; mediaQueriesObserved = true; break; }
      mediaQueriesObserved = true;
    } catch { /* skip */ }
  }
  raw.media_queries = mediaQueriesObserved ? mediaQueries : null;
  checks.push(check(DIM.ux, "media_queries", "Responsive CSS (@media)", !mediaQueriesObserved ? "UNKNOWN" : (mediaQueries ? "PASS" : "FAIL"),
    mediaQueriesObserved ? (mediaQueries ? "@media funnet" : "ingen @media i stylesheets") : "stylesheets ikke observerbare", mediaQueriesObserved ? "medium" : "low"));

  // ── D. Accessibility ──
  const lang = html.match(/<html[^>]*lang=["']([^"']+)["']/i)?.[1] ?? null;
  raw.lang = lang;
  checks.push(check(DIM.acc, "lang", "Språk-attributt (lang)", lang ? "PASS" : "FAIL", lang ?? "mangler lang på <html>", "high"));

  const imgMissingAlt = imgs.filter((i) => !/\balt\s*=/i.test(i)).length;
  raw.img_missing_alt = imgMissingAlt;
  checks.push(check(DIM.acc, "alt_text", "Alt-tekst på bilder", imgs.length && imgMissingAlt ? "FAIL" : (imgs.length ? "PASS" : "NOT_APPLICABLE"),
    imgs.length ? `${imgMissingAlt}/${imgs.length} bilder mangler alt` : "ingen <img>", "high"));

  const inputs = htmlMatches(html, /<input\b[^>]*>/gi).filter((i) => !/type=["']?(hidden|submit|button)["']?/i.test(i));
  const labels = htmlMatches(html, /<label\b[^>]*>/gi).length;
  const inputsWithLabel = htmlMatches(html, /<label\b[^>]*for=["'][^"']+["']/gi).length;
  raw.forms_accessibility = { inputs: inputs.length, labels, inputs_with_label: inputsWithLabel };
  checks.push(check(DIM.acc, "form_labels", "Skjemaetiketter", inputs.length && inputsWithLabel < inputs.length ? "FAIL" : (inputs.length ? "PASS" : "NOT_APPLICABLE"),
    inputs.length ? `${inputs.length} input, ${labels} label` : "ingen skjemainput", "medium"));

  const hCount = (n) => htmlMatches(html, new RegExp(`<h${n}\\b`, "gi")).length;
  const headings = { h1: hCount(1), h2: hCount(2), h3: hCount(3), h4: hCount(4), h5: hCount(5), h6: hCount(6) };
  raw.headings = headings;
  const headingIssue = headings.h1 !== 1 || (headings.h2 === 0 && headings.h1 > 0);
  checks.push(check(DIM.acc, "heading_hierarchy", "Overskriftshierarki", headingIssue ? "FAIL" : "PASS",
    `h1=${headings.h1} h2=${headings.h2} h3=${headings.h3}`, "high"));

  const landmarks = ["header", "nav", "main", "footer"].filter((t) => new RegExp(`<${t}\\b`, "i").test(html));
  raw.landmarks = landmarks;
  checks.push(check(DIM.acc, "semantic", "Semantiske landemerker", landmarks.length >= 3 ? "PASS" : "FAIL",
    `${landmarks.length}/4 (${landmarks.join(", ") || "ingen"})`, "high"));

  // ── E. SEO ──
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
  raw.title = title;
  checks.push(check(DIM.seo, "title", "Tittel", title ? "PASS" : "FAIL", title ?? "mangler <title>", "high"));

  const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? null;
  raw.meta_description = metaDesc;
  checks.push(check(DIM.seo, "meta_description", "Meta-beskrivelse", metaDesc ? "PASS" : "FAIL", metaDesc ?? "mangler meta description", "high"));

  const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ?? null;
  raw.canonical = canonical;
  checks.push(check(DIM.seo, "canonical", "Canonical", canonical ? "PASS" : "FAIL", canonical ?? "mangler canonical", "high"));

  const robotsMeta = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? null;
  raw.robots_meta = robotsMeta;
  checks.push(check(DIM.seo, "robots_meta", "Robots-meta", robotsMeta && /noindex/i.test(robotsMeta) ? "FAIL" : "PASS",
    robotsMeta ?? "ingen robots-meta (standard: indekserbart)", "medium"));

  checks.push(check(DIM.seo, "robots_txt", "robots.txt", robotsTxt !== null ? "PASS" : "FAIL", robotsTxt !== null ? "robots.txt tilstede" : "mangler robots.txt", "high"));

  let sitemap = null;
  try {
    const sm = await httpGet(origin + "/sitemap.xml");
    if (sm.status >= 200 && sm.status < 400) sitemap = { status: sm.status, urls: (sm.body.match(/<loc>/g) ?? []).length };
  } catch { /* best-effort */ }
  raw.sitemap = sitemap;
  checks.push(check(DIM.seo, "sitemap", "Sitemap.xml", sitemap ? "PASS" : "FAIL", sitemap ? `sitemap tilstede (${sitemap.urls} URL-er)` : "mangler sitemap.xml", "high"));

  const og = {
    title: /<meta[^>]*property=["']og:title["']/i.test(html),
    description: /<meta[^>]*property=["']og:description["']/i.test(html),
    image: /<meta[^>]*property=["']og:image["']/i.test(html),
  };
  raw.open_graph = og;
  const ogOk = og.title && og.description && og.image;
  checks.push(check(DIM.seo, "open_graph", "OpenGraph", ogOk ? "PASS" : (og.title || og.description || og.image ? "FAIL" : "FAIL"),
    `title=${og.title} description=${og.description} image=${og.image}`, "high"));

  const jsonLd = /<script[^>]*type=["']application\/ld\+json["']/i.test(html);
  raw.structured_data = jsonLd;
  checks.push(check(DIM.seo, "structured_data", "Strukturert data (JSON-LD)", jsonLd ? "PASS" : "FAIL", jsonLd ? "JSON-LD tilstede" : "ingen JSON-LD", "high"));

  // ── F. Security (public observable) ──
  const secHeaders = {
    csp: home.headers["content-security-policy"] ?? null,
    hsts: home.headers["strict-transport-security"] ?? null,
    xcto: home.headers["x-content-type-options"] ?? null,
    referrer: home.headers["referrer-policy"] ?? null,
    permissions: home.headers["permissions-policy"] ?? null,
    frame: home.headers["x-frame-options"] ?? (home.headers["content-security-policy"]?.includes("frame-ancestors") ? "frame-ancestors" : null),
  };
  raw.security_headers = secHeaders;
  for (const [k, v] of Object.entries(secHeaders)) {
    checks.push(check(DIM.sec, `header_${k}`, `Header: ${k}`, v ? "PASS" : "FAIL", v ? "tilstede" : "mangler", "high"));
  }

  const mixed = (html.match(/(?:src|href)=["']http:\/\/[^"']+["']/gi) ?? []).filter((s) => !/http:\/\/www\.w3\.org/i.test(s));
  raw.mixed_content = mixed.length;
  checks.push(check(DIM.sec, "mixed_content", "Blandet innhold (http på https)", mixed.length ? "FAIL" : "PASS",
    mixed.length ? `${mixed.length} http-referanser` : "ingen http-referanser i HTML", "high"));

  // source maps (best-effort: grep main-script for sourceMappingURL)
  let sourceMaps = false; let smObserved = false;
  for (const sc of scripts.slice(0, 3)) {
    const src = sc.match(/src=["']([^"']+)["']/i)?.[1];
    if (!src) continue;
    try {
      const su = new URL(src, home.finalUrl ?? url);
      if (su.origin !== origin) continue;
      const js = await httpGet(su.toString());
      if (/sourceMappingURL/i.test(js.body)) { sourceMaps = true; smObserved = true; break; }
      smObserved = true;
    } catch { /* skip */ }
  }
  raw.source_maps = smObserved ? sourceMaps : null;
  checks.push(check(DIM.sec, "source_maps", "Eksponerte source maps", !smObserved ? "UNKNOWN" : (sourceMaps ? "FAIL" : "PASS"),
    smObserved ? (sourceMaps ? "sourceMappingURL funnet i publisert JS" : "ingen sourceMappingURL i sjekkede skript") : "skript ikke observerbare", smObserved ? "medium" : "low"));

  const serverHeader = home.headers["server"] ?? null;
  const xPowered = home.headers["x-powered-by"] ?? null;
  raw.tech_disclosure = { server: serverHeader, x_powered_by: xPowered };
  checks.push(check(DIM.sec, "tech_disclosure", "Versjons-avsløring", (serverHeader || xPowered) ? "FAIL" : "PASS",
    [serverHeader, xPowered].filter(Boolean).join(", ") || "ingen versjons-headere", "high"));

  // ── G. Privacy / Trust ──
  const cookieBanner = /cookie|samtykke|consent|informasjonskapsel/i.test(html) && /(knapp|button|godta|aksepter|accept)/i.test(html);
  raw.cookie_banner = cookieBanner;
  checks.push(check(DIM.trust, "cookie_banner", "Cookie-banner", cookieBanner ? "PASS" : "FAIL",
    cookieBanner ? "cookie/samtykke-element observert" : "ingen cookie-banner observert", "low"));

  const analytics = [];
  if (/googletagmanager|gtag\(|G-[A-Z0-9]{8,}/i.test(html)) analytics.push("Google Analytics/Tag Manager");
  if (/connect\.facebook\.net|fbq\(/i.test(html)) analytics.push("Facebook Pixel");
  if (/hotjar/i.test(html)) analytics.push("Hotjar");
  if (/plausible/i.test(html)) analytics.push("Plausible");
  if (/fathom/i.test(html)) analytics.push("Fathom");
  raw.analytics = analytics;
  // analytics/trackere er et RAPPORTERT signal (potensielt concern), ikke en score-sjekk —
  // «frahold av bevis» skal aldri bli negativt faktum, og tilstedeværelse av analytics er ikke i seg selv en feil.

  const privacyLink = /<a\b[^>]*href=["'][^"']*(personvern|privacy|privacy-policy)[^"']*["']/i.test(html);
  raw.privacy_link = privacyLink;
  checks.push(check(DIM.trust, "privacy_link", "Personvernerklæring-link", privacyLink ? "PASS" : "FAIL",
    privacyLink ? "link til personvern observert" : "ingen personvern-link observert", "high"));

  const cmp = /cookiebot|onetrust|didomi|cookieyes|usercentrics/i.test(html);
  raw.consent_cmp = cmp;
  const cmpResult = analytics.length === 0 ? "NOT_APPLICABLE" : (cmp ? "PASS" : "FAIL");
  checks.push(check(DIM.trust, "consent_cmp", "Samtykke-plattform (CMP)", cmpResult,
    analytics.length === 0 ? "ingen trackere observert — CMP ikke nødvendig" : (cmp ? "CMP observert" : "trackere observert uten CMP"), cmp ? "medium" : "low"));

  // ── H. Forms / Conversion ──
  raw.forms_count = forms.length;
  checks.push(check(DIM.trust, "contact_form", "Kontakt-/lead-skjema", forms.length ? "PASS" : "FAIL",
    forms.length ? `${forms.length} <form> observert` : "ingen <form> observert", "high"));

  const ctaText = /(kontakt|bestill|kjøp|køp|start|prøv|prøv|demo|kom i gang|få tilbud|book|meld)/i.test(html);
  raw.cta = ctaText;
  checks.push(check(DIM.trust, "cta", "Call-to-action", ctaText ? "PASS" : "FAIL", ctaText ? "CTA-tekst observert" : "ingen tydelig CTA observert", "low"));

  // Automatiserings-signaler (for Automation Potential — anbefalinger, ikke påstander)
  const chatWidget = /intercom|drift|crisp|zendesk|tawk\.to|livechat|chat-widget|chatbot/i.test(html);
  const booking = /calendly|book|booking|avtale|appointment/i.test(html);
  const newsletter = /nyhetsbrev|newsletter|subscribe/i.test(html);
  raw.automation_signals = {
    contact_form: forms.length > 0,
    analytics: analytics.length > 0,
    cmp,
    chat: chatWidget,
    booking,
    newsletter,
  };

  // ── I. Technology Surface ──
  const tech = { framework: null, cms: null, cdn: null, hosting: null, analytics: analytics };
  if (/__NEXT_DATA__/i.test(html) || /_next\//i.test(html)) tech.framework = "Next.js";
  else if (/data-reactroot|__REACT_/i.test(html)) tech.framework = "React (SPA)";
  else if (/ng-version/i.test(html)) tech.framework = "Angular";
  else if (/data-v-|vue\./i.test(html) && /vue/i.test(html)) tech.framework = "Vue";
  if (/wp-content|wp-includes|wordpress/i.test(html)) tech.cms = "WordPress";
  else if (/cdn\.shopify\.com|shopify/i.test(html)) tech.cms = "Shopify";
  else if (/squarespace/i.test(html)) tech.cms = "Squarespace";
  if (home.headers["cf-ray"]) tech.cdn = "Cloudflare";
  else if (/x-vercel-id/i.test(JSON.stringify(home.headers)) || serverHeader === "Vercel") tech.cdn = "Vercel";
  else if (/netlify/i.test(serverHeader ?? "")) tech.cdn = "Netlify";
  else if (/x-amz-cf-id/i.test(JSON.stringify(home.headers))) tech.cdn = "CloudFront";
  tech.hosting = serverHeader ?? null;
  raw.technology = tech;
  for (const [k, v] of Object.entries(tech)) {
    if (v && Array.isArray(v) && !v.length) continue;
    if (v) checks.push(check("tech", `tech_${k}`, `Teknologi: ${k}`, "PASS", Array.isArray(v) ? v.join(", ") : v, k === "framework" || k === "cms" ? "medium" : "high"));
  }

  return { meta: { url, domain, origin, final_url: home.finalUrl ?? url, fetched_at: NOW() }, checks, raw };
}
