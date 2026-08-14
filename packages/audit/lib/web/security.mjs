// «Hva en hacker ser» — Arch Website Audit v2 (ARC-10, plan §1.5).
//
// Sikkerhetsdybde sett utenfra: hva en angriper kan observere uten å angripe.
// KUN passiv, read-only informasjonsinnhenting via normal GET (samme som en nettleser)
// og TLS-håndtrykk via `openssl s_client`. Ingen exploits, ingen mutasjoner, ingen brute-force.
//
// Referanse: docs/f4.3-audit-v2-product-strategy.md §1.5.
//
// Innhold:
//   1. GET hjemmeside (manuell redirect-følging ≤6 hops, UA Chrome 126, 10s timeout)
//   2. Security-header-gradering A+–F (securityheaders.com-modellen, deterministisk)
//   3. Cookie-attributter (HttpOnly / Secure / SameSite) — KUN navn + flagg, ALDRI verdier
//   4. Versjonslekkasjer (server/x-powered-by/x-aspnet-version, <meta generator>,
//      gammel jQuery, WordPress-signatur)
//   5. TLS via openssl s_client (sertifikat-datoer/issuer/SAN, verify return code,
//      legacy-TLS 1.0/1.1)
//   6. Eksponerte filer (.env, .git/config, …) — KUN når opts.checkExposedFiles=true
//
// Sikkerhetsregler:
//   - UNKNOWN ≠ PASS: fravær av bevis = UNKNOWN, aldri FAIL. Nettverksfeil → try/catch → UNKNOWN.
//   - Sertifikat utgått / utløper innen 14 dager / legacy-TLS tilgjengelig = FAIL.
//   - Cookie-verdier skrives ALDRI ut (verken i checks.evidence eller raw).
//   - Eksponerte filer: kun HTTP-status, innhold leses aldri.
//
// Sjekk-format (felles konvensjon): { id, label, dimension, result, evidence, confidence, source, observed_at }
//   result ∈ PASS|FAIL|UNKNOWN|NOT_APPLICABLE · dimension = security ·
//   source ∈ http_headers | tls | html | http_probe · confidence ∈ high|medium.

import { execFile } from "node:child_process";
import { pathToFileURL } from "node:url";

const NOW = () => new Date().toISOString();

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const TIMEOUT_MS = 10000;
const HSTS_MIN_SECONDS = 15552000; // 6 måneder
const EXPIRY_WARN_DAYS = 14; // utløper innen 14 dager = FAIL

const check = (id, label, result, evidence, source, confidence = "high") => ({
  id,
  label,
  dimension: "security",
  result,
  evidence,
  confidence,
  source,
  observed_at: NOW(),
});

// ─────────────────────────────────────────────────────────────────────────────
// HTTP (manuell redirect-følging, set-cookie samles per hop)
// ─────────────────────────────────────────────────────────────────────────────

/** GET med manuell redirect-følging (≤maxRedirects hops). Returnerer { ok, status, headers (lowercase), body, redirects, setCookies, error }. */
async function httpGet(url, { method = "GET", timeout = TIMEOUT_MS, maxRedirects = 6 } = {}) {
  const redirects = [];
  const setCookies = [];
  let current = url;
  for (let i = 0; i <= maxRedirects; i++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    let res;
    try {
      res = await fetch(current, {
        method,
        redirect: "manual",
        headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*" },
        signal: ctrl.signal,
      });
    } catch (e) {
      clearTimeout(t);
      return { ok: false, error: String(e.message || e).split("\n")[0], url: current, redirects, setCookies };
    }
    clearTimeout(t);

    // set-cookie: getSetCookie() håndterer multi-header riktig (ikke komma-splitting av Expires).
    if (typeof res.headers.getSetCookie === "function") {
      for (const sc of res.headers.getSetCookie()) setCookies.push(sc);
    } else {
      const sc = res.headers.get("set-cookie");
      if (sc) setCookies.push(sc);
    }

    const headers = {};
    res.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });

    if ([301, 302, 303, 307, 308].includes(res.status) && headers.location) {
      const next = new URL(headers.location, current).toString();
      redirects.push({ from: current, to: next, status: res.status });
      current = next;
      continue;
    }

    let body = "";
    if (method === "GET") {
      try {
        body = await res.text();
      } catch {
        body = "";
      }
    }
    return {
      ok: true, // respons mottatt (uavhengig av 2xx/4xx/5xx) — headers analyseres uansett
      status: res.status,
      statusText: res.statusText,
      headers,
      body,
      url: current,
      redirects,
      setCookies,
    };
  }
  return { ok: false, error: "for mange redirects", url: current, redirects, setCookies };
}

/** Kun HTTP-status (GET, redirect:manual) — body leses ALDRI. Brukes for eksponerte-filer-sjekk. */
async function httpStatus(url, timeout = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": UA },
      signal: ctrl.signal,
    });
    const status = res.status;
    try {
      await res.body?.cancel?.();
    } catch {
      /* ignore */
    }
    return { status, error: null };
  } catch (e) {
    return { status: null, error: String(e.message || e).split("\n")[0] };
  } finally {
    clearTimeout(t);
    ctrl.abort();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Security-header-gradering A+–F (deterministisk)
// ─────────────────────────────────────────────────────────────────────────────
//
// Karakterstige: ["A+","A","A-","B","C","D","E","F"] — start på A+ (index 0).
// Hver deduksjon flytter én hakk ned (kappes ved F). CSP og HSTS er kritiske og
// teller dobbelt. Mappingen er deterministisk og dokumentert:
//
//   Trekk  Vekt  Årsak
//     1     2    content-security-policy mangler
//     2     1    CSP svak: inneholder unsafe-inline/unsafe-eval (uten nonce/hash)
//     3     2    strict-transport-security mangler
//     4     1    HSTS max-age < 15552000 s (6 mnd)
//     5     1    HSTS uten includeSubDomains
//     6     1    x-frame-options mangler OG CSP uten frame-ancestors
//     7     1    x-content-type-options mangler nosniff
//     8     1    referrer-policy mangler
//     9     1    permissions-policy mangler
//
// (preload rapporteres i evidence, men gir ikke trekk — de fleste mangler det.)
// Resultat-mapping til sjekk: A+/A/A- = PASS · B–F = FAIL.
function gradeSecurityHeaders(h) {
  const GRADE = ["A+", "A", "A-", "B", "C", "D", "E", "F"];
  const csp = (h["content-security-policy"] || "").toString();
  const hsts = (h["strict-transport-security"] || "").toString();
  const xfo = (h["x-frame-options"] || "").toString();
  const xcto = (h["x-content-type-options"] || "").toString();
  const rp = (h["referrer-policy"] || "").toString();
  const pp = (h["permissions-policy"] || "").toString();

  let count = 0;
  const reasons = [];

  if (!csp) {
    count += 2;
    reasons.push("CSP mangler");
  } else if (/unsafe-inline|unsafe-eval/i.test(csp)) {
    count += 1;
    reasons.push("CSP svak (unsafe-inline/unsafe-eval)");
  }

  if (!hsts) {
    count += 2;
    reasons.push("HSTS mangler");
  } else {
    const maxAge = parseInt((hsts.match(/max-age=(\d+)/i) || [])[1], 10);
    if (!maxAge || maxAge < HSTS_MIN_SECONDS) {
      count += 1;
      reasons.push(`HSTS max-age < 6 mnd (${Number.isFinite(maxAge) ? maxAge : "ukjent"})`);
    }
    if (!/includeSubDomains/i.test(hsts)) {
      count += 1;
      reasons.push("HSTS uten includeSubDomains");
    }
  }

  const frameAncestors = /frame-ancestors/i.test(csp);
  if (!xfo && !frameAncestors) {
    count += 1;
    reasons.push("X-Frame-Options mangler (og ingen frame-ancestors i CSP)");
  }
  if (!/nosniff/i.test(xcto)) {
    count += 1;
    reasons.push("X-Content-Type-Options mangler nosniff");
  }
  if (!rp) {
    count += 1;
    reasons.push("Referrer-Policy mangler");
  }
  if (!pp) {
    count += 1;
    reasons.push("Permissions-Policy mangler");
  }

  const grade = GRADE[Math.min(count, GRADE.length - 1)];

  const shorten = (v) => (v && v.length > 90 ? v.slice(0, 90) + "…" : v);
  const present = [
    ["Content-Security-Policy", csp ? shorten(csp) : "MANGLER"],
    ["Strict-Transport-Security", hsts ? shorten(hsts) : "MANGLER"],
    ["X-Frame-Options", xfo ? shorten(xfo) : "MANGLER"],
    ["X-Content-Type-Options", xcto ? shorten(xcto) : "MANGLER"],
    ["Referrer-Policy", rp ? shorten(rp) : "MANGLER"],
    ["Permissions-Policy", pp ? shorten(pp) : "MANGLER"],
  ];
  const evidence =
    `Gradering ${grade}. ` +
    present.map(([n, v]) => `${n}: ${v}`).join("; ") +
    (reasons.length ? ` Trekk: ${reasons.join(" · ")}` : " Ingen trekk.");

  return {
    grade,
    deductions: reasons,
    headers: { csp, hsts, xfo, xcto, referrerPolicy: rp, permissionsPolicy: pp },
    evidence,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Cookie-attributter
// ─────────────────────────────────────────────────────────────────────────────

/** set-cookie → [{ name, httpOnly, secure, sameSite }]. Verdier KASTES — kun navn + flagg.
 *  Dedupliserer på navn (redirect-kjeder setter ofte samme cookie flere ganger). */
function parseCookies(setCookies) {
  const seen = new Set();
  const out = [];
  for (const sc of setCookies) {
    const name = (sc.split(";")[0].split("=")[0] || "").trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const flags = ";" + sc.slice(name.length) + ";";
    out.push({
      name,
      httpOnly: /;\s*httponly\s*;/i.test(flags),
      secure: /;\s*secure\s*;/i.test(flags),
      sameSite: ((sc.match(/;\s*samesite\s*=\s*(\w+)/i) || [])[1] || null)?.toLowerCase() ?? null,
    });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Versjonslekkasjer
// ─────────────────────────────────────────────────────────────────────────────

function metaGenerators(html) {
  const out = [];
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if (/name\s*=\s*["']?generator["']?/i.test(tag)) {
      const m = tag.match(/content\s*=\s*["']([^"']*)["']/i);
      out.push(m ? m[1] : tag);
    }
  }
  return out;
}

function oldJquery(html) {
  const out = [];
  const re = /<script\b[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (const m of html.matchAll(re)) {
    if (/jquery[-_.]?[12]\.\d+/i.test(m[1])) out.push(m[1]);
  }
  return out;
}

/** Returnerer liste av { kind, value, header? }. WordPress-generator → egen kind (ikke dobbel). */
function findVersionLeaks(headers, html) {
  const leaks = [];
  for (const hn of ["server", "x-powered-by", "x-aspnet-version"]) {
    const v = headers[hn];
    // CDN-generiske verdier som «server: cloudflare» avslører ingen versjon — ikke et funn.
    if (v && !(hn === "server" && /^cloudflare$/i.test(String(v).trim()))) {
      leaks.push({ kind: "header", header: hn, value: v });
    }
  }
  for (const g of metaGenerators(html)) {
    if (/wordpress|wp\b/i.test(g)) leaks.push({ kind: "wordpress", value: g });
    else leaks.push({ kind: "meta_generator", value: g });
  }
  for (const src of oldJquery(html)) leaks.push({ kind: "old_jquery", value: src });
  return leaks;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TLS via openssl s_client
// ─────────────────────────────────────────────────────────────────────────────

function runOpenSSL(args, timeout = 15000) {
  return new Promise((resolve) => {
    try {
      execFile("openssl", args, { timeout, stdio: ["ignore", "pipe", "pipe"] }, (err, stdout, stderr) => {
        resolve({ err, stdout: String(stdout ?? ""), stderr: String(stderr ?? "") });
      });
    } catch (e) {
      resolve({ err: e, stdout: "", stderr: "" });
    }
  });
}

/** Kjører `openssl x509 -noout -dates -issuer -text` med PEM på stdin (LibreSSL mangler `-ext`). */
function x509Info(pem) {
  return new Promise((resolve) => {
    try {
      const child = execFile(
        "openssl",
        ["x509", "-noout", "-dates", "-issuer", "-text"],
        { timeout: 15000 },
        (err, stdout, stderr) => resolve({ err, stdout: String(stdout ?? ""), stderr: String(stderr ?? "") }),
      );
      child.stdin.write(pem);
      child.stdin.end();
    } catch (e) {
      resolve({ err: e, stdout: "", stderr: "" });
    }
  });
}

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

/** Parser `notBefore=Jul 28 08:21:14 2026 GMT` (LibreSSL-format). */
function parseX509Date(m) {
  if (!m) return null;
  const line = m[1];
  const mm = line.match(/([A-Za-z]{3})\s+(\d{1,2})\s+([\d:]{8})\s+(\d{4})/);
  if (!mm) {
    const d = new Date(line.replace(/\s+/g, " ").trim());
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const idx = MONTHS[mm[1]];
  if (idx === undefined) return null;
  const [h, mi, s] = mm[3].split(":").map(Number);
  return new Date(Date.UTC(Number(mm[4]), idx, Number(mm[2]), h, mi, s));
}

async function tlsChecks(host, connectTarget) {
  const tls = {
    opensslAvailable: true,
    cert: null,
    verify: null,
    legacy: { tls1: null, tls1_1: null },
  };

  const sclient = await runOpenSSL(["s_client", "-connect", connectTarget, "-servername", host]);
  if (sclient.err && sclient.err.code === "ENOENT") {
    tls.opensslAvailable = false;
    return tls;
  }
  const combined = sclient.stdout + "\n" + sclient.stderr;

  // (b) verify return code — skrives til stdout av s_client (LibreSSL: "Verify return code: 0 (ok)").
  const vm = combined.match(/verify return code:\s*(\d+)(?:\s*\(([^)]*)\))?/i);
  tls.verify = vm ? { code: parseInt(vm[1], 10), description: (vm[2] || "").trim() } : null;

  // (a) sertifikat-datoer + issuer + SAN via x509 (PEM trekkes ut av s_client-output).
  const pem = sclient.stdout.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/);
  if (pem) {
    const x = await x509Info(pem[0]);
    if (!x.err) {
      const nb = parseX509Date(x.stdout.match(/notBefore=([^\n]+)/));
      const na = parseX509Date(x.stdout.match(/notAfter=([^\n]+)/));
      const issuer = x.stdout.match(/issuer=\s*([^\n]+)/);
      const san = Array.from(x.stdout.matchAll(/DNS:([A-Za-z0-9.*_-]+)/g)).map((m) => m[1]);
      tls.cert = {
        notBefore: nb ? nb.toISOString() : null,
        notAfter: na ? na.toISOString() : null,
        issuer: issuer ? issuer[1].trim() : null,
        san,
      };
    }
  }

  // (c) legacy-TLS: -servername er med, ellers kan Cloudflares no-SNI default-cert maskere resultatet.
  // Suksess = handshake fullført = "BEGIN CERTIFICATE" i stdout.
  // Reject (PASS): "no peer certificate available" / "New, (NONE)" / "alert protocol version" /
  //                "no protocols available" / "unsupported protocol" / "handshake failure".
  for (const proto of ["tls1", "tls1_1"]) {
    const r = await runOpenSSL(["s_client", `-${proto}`, "-connect", connectTarget, "-servername", host]);
    const out = r.stdout + "\n" + r.stderr;
    if (/BEGIN CERTIFICATE-----/.test(r.stdout)) tls.legacy[proto] = "available";
    else if (/no peer certificate available|New, \(NONE\)|alert protocol version|no protocols available|unsupported protocol|handshake failure/i.test(out)) tls.legacy[proto] = "blocked";
    else tls.legacy[proto] = "unknown";
  }

  return tls;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Eksponerte filer (KUN ved opts.checkExposedFiles)
// ─────────────────────────────────────────────────────────────────────────────

const EXPOSED_PATHS = ["/.env", "/.git/config", "/.htaccess", "/backup.zip", "/wp-config.php.bak", "/.DS_Store"];

async function exposedFiles(origin) {
  const out = [];
  for (const p of EXPOSED_PATHS) {
    const r = await httpStatus(origin + p);
    out.push({ path: p, status: r.status, error: r.error });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hovedinnsamling
// ─────────────────────────────────────────────────────────────────────────────

export async function collectSecurity(targetUrl, opts = {}) {
  const { checkExposedFiles = false } = opts;
  const checks = [];

  let url;
  try {
    url = new URL(targetUrl);
    if (!/^https?:$/.test(url.protocol)) throw new Error("kun http(s) støttes");
  } catch {
    try {
      url = new URL(`https://${targetUrl}`);
    } catch {
      url = null;
    }
  }
  if (!url) {
    checks.push(
      check("security_fetch", "Hjemmeside hentet", "UNKNOWN", `Kunne ikke tolke URL: ${targetUrl}`, "http_headers", "high"),
    );
    return { section: "security_hacker", title: "Hva en hacker ser", checks, raw: {} };
  }

  const host = url.hostname;
  const origin = url.origin;
  const connectTarget = host.includes(":") ? `[${host}]:443` : `${host}:443`;

  // 1. GET hjemmeside
  const home = await httpGet(url.toString());
  if (!home.ok) {
    checks.push(
      check("security_fetch", "Hjemmeside hentet", "UNKNOWN", `Henting feilet: ${home.error}`, "http_headers", "high"),
    );
    return { section: "security_hacker", title: "Hva en hacker ser", checks, raw: {} };
  }

  const headers = home.headers;
  const html = home.body;

  // 2. Security-header-gradering
  const sec = gradeSecurityHeaders(headers);
  const secResult = ["A+", "A", "A-"].includes(sec.grade) ? "PASS" : "FAIL";
  checks.push(
    check("security_headers", `Sikkerhetsheadere — gradering ${sec.grade}`, secResult, sec.evidence, "http_headers", "high"),
  );

  // 3. Cookie-attributter
  const cookies = parseCookies(home.setCookies);
  const noHttpOnly = cookies.filter((c) => !c.httpOnly).map((c) => c.name);
  const noSecure = cookies.filter((c) => !c.secure).map((c) => c.name);
  const noSameSite = cookies.filter((c) => !c.sameSite).map((c) => c.name);
  let cookieResult;
  let cookieEvidence;
  if (cookies.length === 0) {
    cookieResult = "PASS";
    cookieEvidence = "Ingen cookies satt av serveren (0 set-cookie-headere).";
  } else if (noHttpOnly.length || noSecure.length || noSameSite.length) {
    cookieResult = "FAIL";
    cookieEvidence =
      `${cookies.length} cookies observert. ` +
      `Mangler HttpOnly: ${noHttpOnly.length ? noHttpOnly.join(", ") : "ingen"}. ` +
      `Mangler Secure: ${noSecure.length ? noSecure.join(", ") : "ingen"}. ` +
      `Mangler SameSite: ${noSameSite.length ? noSameSite.join(", ") : "alle har SameSite"}. ` +
      `(Cookie-navn + flagg kun — verdier aldri lagret/vist.)`;
  } else {
    cookieResult = "PASS";
    cookieEvidence = `${cookies.length} cookies — alle har HttpOnly, Secure og SameSite.`;
  }
  checks.push(check("cookies_attributes", "Cookie-sikkerhet (HttpOnly/Secure/SameSite)", cookieResult, cookieEvidence, "http_headers", "high"));

  // 4. Versjonslekkasjer — hvert funn = egen sjekk
  const leaks = findVersionLeaks(headers, html);
  leaks.forEach((leak, i) => {
    if (leak.kind === "header") {
      checks.push(check(`leak_${i}_${leak.header}`, `Versjonslekkasje: ${leak.header}-header`, "FAIL", `${leak.header}: ${leak.value}`, "http_headers", "high"));
    } else if (leak.kind === "wordpress") {
      checks.push(check(`leak_${i}_wordpress`, "WordPress-signatur i generator", "FAIL", `generator: ${leak.value}`, "html", "medium"));
    } else if (leak.kind === "meta_generator") {
      checks.push(check(`leak_${i}_meta`, "Versjonslekkasje: <meta name=generator>", "FAIL", `generator: ${leak.value}`, "html", "medium"));
    } else if (leak.kind === "old_jquery") {
      checks.push(check(`leak_${i}_jquery`, "Utdatert jQuery-bibliotek (1.x/2.x)", "FAIL", leak.value, "html", "medium"));
    }
  });
  if (leaks.length === 0) {
    checks.push(
      check(
        "version_leaks",
        "Ingen versjonslekkasjer",
        "PASS",
        "Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert.",
        "http_headers",
        "medium",
      ),
    );
  }

  // 5. TLS
  const tls = await tlsChecks(host, connectTarget);
  if (!tls.opensslAvailable) {
    checks.push(check("tls_cert", "TLS-sertifikat gyldighet", "UNKNOWN", "openssl ikke tilgjengelig på systemet.", "tls", "medium"));
    checks.push(check("tls_verify", "TLS-sertifikat-verifisering", "UNKNOWN", "openssl ikke tilgjengelig på systemet.", "tls", "medium"));
    checks.push(check("tls_legacy", "Legacy-TLS (1.0/1.1) støtte", "UNKNOWN", "openssl ikke tilgjengelig på systemet.", "tls", "medium"));
  } else {
    // (a) sertifikat-gyldighet
    if (!tls.cert || !tls.cert.notBefore || !tls.cert.notAfter) {
      checks.push(check("tls_cert", "TLS-sertifikat gyldighet", "UNKNOWN", "Kunne ikke hente sertifikatinfo (ingen PEM i s_client-output).", "tls", "medium"));
    } else {
      const now = Date.now();
      const notBefore = Date.parse(tls.cert.notBefore);
      const notAfter = Date.parse(tls.cert.notAfter);
      const problems = [];
      if (now < notBefore) problems.push("sertifikat ikke gyldig ennå");
      if (now >= notAfter) problems.push("sertifikat utgått");
      else if (notAfter - now <= EXPIRY_WARN_DAYS * 86400000) problems.push(`utløper innen ${EXPIRY_WARN_DAYS} dager`);
      const certResult = problems.length ? "FAIL" : "PASS";
      const san = (tls.cert.san || []).join(", ") || "?";
      checks.push(
        check(
          "tls_cert",
          "TLS-sertifikat gyldighet",
          certResult,
          `${problems.length ? problems.join("; ") + " — " : ""}notBefore=${tls.cert.notBefore}, notAfter=${tls.cert.notAfter}, issuer=${tls.cert.issuer || "?"}, SAN=${san}`,
          "tls",
          "high",
        ),
      );
    }

    // (b) verify return code
    if (tls.verify === null) {
      checks.push(check("tls_verify", "TLS-sertifikat-verifisering", "UNKNOWN", "Kunne ikke lese verify return code fra s_client-output.", "tls", "medium"));
    } else if (tls.verify.code === 0) {
      checks.push(
        check("tls_verify", "TLS-sertifikat-verifisering", "PASS", `verify return code: 0${tls.verify.description ? ` (${tls.verify.description})` : ""}`, "tls", "high"),
      );
    } else {
      checks.push(
        check("tls_verify", "TLS-sertifikat-verifisering", "FAIL", `verify return code: ${tls.verify.code}${tls.verify.description ? ` (${tls.verify.description})` : ""}`, "tls", "high"),
      );
    }

    // (c) legacy-TLS
    const legacy = tls.legacy;
    let legacyResult;
    if (legacy.tls1 === "available" || legacy.tls1_1 === "available") legacyResult = "FAIL";
    else if (legacy.tls1 === "unknown" || legacy.tls1_1 === "unknown") legacyResult = "UNKNOWN";
    else legacyResult = "PASS";
    checks.push(
      check("tls_legacy", "Legacy-TLS (1.0/1.1) støtte", legacyResult, `TLS 1.0: ${legacy.tls1} · TLS 1.1: ${legacy.tls1_1}`, "tls", "medium"),
    );
  }

  // 6. Eksponerte filer (KUN når checkExposedFiles=true)
  let exposed = null;
  if (checkExposedFiles) {
    exposed = await exposedFiles(origin);
    const found = exposed.filter((f) => f.status !== null && f.status >= 200 && f.status <= 299);
    const blocked = exposed.filter((f) => f.status === 403 || f.status === 404);
    const list = exposed.map((f) => `${f.path} → ${f.error ? `feil: ${f.error}` : f.status}`).join(", ");
    let result;
    let summary;
    if (found.length) {
      result = "FAIL";
      summary = `Tilgjengelige filer: ${found.map((f) => `${f.path} (${f.status})`).join(", ")} (tilstedeværelse kun — innhold ikke lest).`;
    } else if (blocked.length === exposed.length) {
      result = "PASS";
      summary = `Ingen av ${exposed.length} sonderte filer eksponert.`;
    } else {
      result = "UNKNOWN";
      summary = "Ikke entydig — én eller flere filer ga annen status (omdirigering/serverfeil/nettverksfeil).";
    }
    checks.push(check("exposed_files", "Eksponerte filer (.env, .git/config m.m.)", result, `${summary} Detalj: ${list}.`, "http_probe", "medium"));
  }

  // raw — cookie-VERDIER og set-cookie-headere utelates alltid.
  const safeHeaders = { ...headers };
  delete safeHeaders["set-cookie"];
  delete safeHeaders["set-cookie2"];
  const raw = {
    url: url.toString(),
    final_url: home.url,
    status: home.status,
    status_text: home.statusText,
    redirects: home.redirects,
    headers: safeHeaders,
    security_grade: sec.grade,
    security_deductions: sec.deductions,
    cookies: cookies.map(({ name, httpOnly, secure, sameSite }) => ({ name, httpOnly, secure, sameSite })),
    version_leaks: leaks,
    tls,
    ...(exposed ? { exposed_files: exposed } : {}),
  };

  return { section: "security_hacker", title: "Hva en hacker ser", checks, raw };
}

// Direkte kjøring: node packages/audit/lib/web/security.mjs https://klarpakke.no
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const url = process.argv[2];
  if (!url) {
    console.error("Bruk: node packages/audit/lib/web/security.mjs <url|domene>");
    process.exit(2);
  }
  collectSecurity(url)
    .then((r) => console.log(JSON.stringify(r, null, 2)))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
