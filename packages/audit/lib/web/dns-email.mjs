// E-post & DNS-sikkerhet — Arch Website Audit v2 (ARC-10).
//
// Referanse: docs/f4.3-audit-v2-product-strategy.md §1.5 («Hva en hacker ser»)
// og §5.4 (E-post/DNS-sikkerhet — 2026-standarden).
//
// Passiv, read-only, utenfor-inn: kun DNS-oppslag (node:dns/promises), én
// `dig`-kall for DNSSEC-kjeden, og GET mot mta-sts + crt.sh. Ingen mutasjoner.
//
// Sjekk-format: { id, label, dimension, result, evidence, confidence, source, observed_at }
// der result ∈ PASS|FAIL|UNKNOWN|NOT_APPLICABLE. UNKNOWN ≠ PASS: fravær av bevis
// = UNKNOWN, aldri FAIL. Nettverksfeil → try/catch → UNKNOWN med feilbeskjed.
// Timeout ~10s per DNS-kall (20s for crt.sh, 1 req/s mot crt.sh).

import { promises as dns } from "node:dns";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileP = promisify(execFile);

const NOW = () => new Date().toISOString();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const DNS_TIMEOUT = 10000;
const CRTSH_TIMEOUT = 20000;

// ── eTLD+1-normalisering ────────────────────────────────────────────────────
// Registrerbare toppnivå (2-labels) + multi-label-suffikser (3-labels).
const TWO_LABEL_TLDS = new Set(["no", "com", "net", "org", "io", "ai", "eu", "se", "dk", "fi", "is"]);
const THREE_LABEL_SUFFIXES = new Set(["co.uk", "org.uk", "com.au", "co.nz"]);

/** Normaliserer et domene (eller URL) til registrerbart domene (eTLD+1). */
export function registrable(domain) {
  let d = String(domain || "").trim().toLowerCase().replace(/\.$/, "");
  d = d.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split(/[/?#]/)[0];
  const labels = d.split(".").filter(Boolean);
  if (labels.length <= 1) return d;
  if (labels.length >= 3) {
    const suffix2 = labels.slice(-2).join(".");
    if (THREE_LABEL_SUFFIXES.has(suffix2)) return labels.slice(-3).join(".");
  }
  return labels.slice(-2).join(".");
}

// ── DNS-hjelpere (10s-timeout, feil → { error }) ───────────────────────────
async function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error(`${label} tidsavbrudd (${ms}ms)`), { code: "ETIMEDOUT" })), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

/** resolveTxt → { records: string[] } (hver TXT-record joinet sammen).
 *  ENOTFOUND/ENODATA = definitivt fravær (ingen record) — ikke en feil. */
async function dnsTxt(name) {
  try {
    const rows = await withTimeout(dns.resolveTxt(name), DNS_TIMEOUT, "resolveTxt");
    return { records: (rows ?? []).map((chunks) => (Array.isArray(chunks) ? chunks.join("") : String(chunks))) };
  } catch (e) {
    if (e.code === "ENOTFOUND" || e.code === "ENODATA") return { records: [], error: null };
    return { records: [], error: { code: e.code ?? null, message: String(e.message || e).split("\n")[0] } };
  }
}

/** resolveCaa → { records: object[] }. ENOTFOUND/ENODATA = ingen CAA. */
async function dnsCaa(name) {
  try {
    const rows = await withTimeout(dns.resolveCaa(name), DNS_TIMEOUT, "resolveCaa");
    return { records: rows ?? [] };
  } catch (e) {
    if (e.code === "ENOTFOUND" || e.code === "ENODATA") return { records: [], error: null };
    return { records: [], error: { code: e.code ?? null, message: String(e.message || e).split("\n")[0] } };
  }
}

/** resolveMx → { records: [{exchange, priority}] } sortert på priority. */
async function dnsMx(name) {
  try {
    const rows = await withTimeout(dns.resolveMx(name), DNS_TIMEOUT, "resolveMx");
    const records = (rows ?? []).map((r) => ({ exchange: r.exchange, priority: r.priority }));
    records.sort((a, b) => a.priority - b.priority);
    return { records };
  } catch (e) {
    if (e.code === "ENOTFOUND" || e.code === "ENODATA") return { records: [], error: null };
    return { records: [], error: { code: e.code ?? null, message: String(e.message || e).split("\n")[0] } };
  }
}

/** resolve4 → { addresses: string[] }. */
async function dns4(name) {
  try {
    const rows = await withTimeout(dns.resolve4(name), DNS_TIMEOUT, "resolve4");
    return { addresses: rows ?? [] };
  } catch (e) {
    return { addresses: [], error: { code: e.code ?? null, message: String(e.message || e).split("\n")[0] } };
  }
}

/** dig +dnssec DNSKEY — kun brukt for DNSSEC AD-flag (dig er eksternt). */
async function digDnssec(domain) {
  try {
    const { stdout, stderr } = await execFileP("dig", ["+dnssec", "DNSKEY", domain, "+time=5", "+tries=1"], {
      timeout: DNS_TIMEOUT,
      maxBuffer: 2 * 1024 * 1024,
    });
    return { available: true, stdout: stdout ?? "", stderr: stderr ?? "" };
  } catch (e) {
    return { available: false, error: String(e.message || e).split("\n")[0] };
  }
}

/** GET med timeout (returnerer { ok, status, body } — aldri kast). */
async function httpGet(url, timeout = DNS_TIMEOUT) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "arch-audit/2.0 (+https://arch.no)", accept: "*/*" },
      signal: AbortSignal.timeout(timeout),
    });
    let body = "";
    try { body = await res.text(); } catch { /* tom body */ }
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    return { ok: false, status: 0, error: String(e.message || e).split("\n")[0] };
  }
}

// ── Sjekk-bygger ────────────────────────────────────────────────────────────
const check = (id, label, dimension, result, evidence, confidence = "high", source = "dns") => ({
  id, label, dimension, result, evidence, confidence, source, observed_at: NOW(),
});

// ── Hoved-funksjon ──────────────────────────────────────────────────────────
export async function collectDnsEmail(domain, opts = {}) {
  const original = String(domain || "").trim().toLowerCase().replace(/\.$/, "").split(/[/?#]/)[0];
  const reg = registrable(original);
  const isSubdomain = original !== reg;

  const checks = [];
  const raw = {
    original,
    registrable: reg,
    subdomain_of_input: isSubdomain,
  };

  // ── a. SPF ──
  const spfRes = await dnsTxt(reg);
  raw.spf = { record: null, policy: null, private_ips: [] };
  if (spfRes.error) {
    raw.spf = { record: null, policy: null, private_ips: [], error: spfRes.error.message };
    checks.push(check("spf", "SPF (avsender-verifisering)", "security", "UNKNOWN", `DNS-feil: ${spfRes.error.message}`, "low"));
  } else {
    const spfRecord = spfRes.records.find((r) => /v=spf1/i.test(r)) ?? null;
    if (!spfRecord) {
      raw.spf.record = null;
      checks.push(check("spf", "SPF (avsender-verifisering)", "security", "FAIL", "ingen SPF", "high"));
    } else {
      const allMatch = spfRecord.match(/(?:^|\s)([-~+?]?)all(?=\s|$)/i);
      const qualifier = allMatch ? (allMatch[1] || "+") : null;
      raw.spf.record = spfRecord;
      raw.spf.policy = qualifier ? `${qualifier}all` : "ingen `all`";
      if (qualifier === "-") {
        checks.push(check("spf", "SPF (avsender-verifisering)", "security", "PASS", spfRecord, "high"));
      } else if (qualifier === "~") {
        checks.push(check("spf", "SPF (avsender-verifisering)", "security", "FAIL", `${spfRecord} — ~all er svakt, spoofing mulig`, "high"));
      } else if (qualifier === "+" || qualifier === "?") {
        checks.push(check("spf", "SPF (avsender-verifisering)", "security", "FAIL", `${spfRecord} — ${qualifier}all tillater spoofing`, "high"));
      } else {
        checks.push(check("spf", "SPF (avsender-verifisering)", "security", "FAIL", `${spfRecord} — mangler avsluttende -all`, "high"));
      }
      // Private IP-er i mekanismene = konfigfeil-signal.
      const privIp4 = [...spfRecord.matchAll(/ip4:(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)[0-9.]+/gi)].map((m) => m[0]);
      const privIp6 = [...spfRecord.matchAll(/ip6:(fc|fd|fe80)[0-9a-f:]*/gi)].map((m) => m[0]);
      raw.spf.private_ips = [...privIp4, ...privIp6];
      if (raw.spf.private_ips.length) {
        checks.push(check("spf_private_ip", "SPF: private IP-er i mekanismene", "security", "FAIL",
          `privat IP i SPF: ${raw.spf.private_ips.join(", ")}`, "medium"));
      } else {
        checks.push(check("spf_private_ip", "SPF: private IP-er i mekanismene", "security", "PASS",
          "ingen private IP-er i SPF", "medium"));
      }
    }
  }

  // ── b. DKIM (probe — fravær kan ikke konkluderes, aldri FAIL) ──
  const dkimSelectors = ["default", "dkim", "google", "selector1", "selector2", "s1", "k1"];
  const dkimFound = [];
  const dkimErrors = [];
  for (const sel of dkimSelectors) {
    const r = await dnsTxt(`${sel}._domainkey.${reg}`);
    if (r.records.some((t) => /v=DKIM1/i.test(t))) dkimFound.push(sel);
    else if (r.error) dkimErrors.push(r.error.code);
  }
  raw.dkim = dkimFound.length ? dkimFound.join(", ") : null;
  if (dkimFound.length) {
    checks.push(check("dkim", "DKIM (e-post-signering)", "security", "PASS",
      `selector${dkimFound.length > 1 ? "er" : ""}: ${dkimFound.join(", ")}`, "medium"));
  } else {
    checks.push(check("dkim", "DKIM (e-post-signering)", "security", "UNKNOWN",
      "ingen av probede selektorer funnet (kan ikke konkludere fravær)", "low"));
  }

  // ── c. DMARC ──
  const dmarcRes = await dnsTxt(`_dmarc.${reg}`);
  raw.dmarc = { record: null, p: null, policy: null };
  if (dmarcRes.error) {
    raw.dmarc.error = dmarcRes.error.message;
    checks.push(check("dmarc", "DMARC (spoofing-beskyttelse)", "security", "UNKNOWN", `DNS-feil: ${dmarcRes.error.message}`, "low"));
  } else {
    const dmarcRecord = dmarcRes.records.find((r) => /v=DMARC1/i.test(r)) ?? null;
    raw.dmarc.record = dmarcRecord;
    if (!dmarcRecord) {
      checks.push(check("dmarc", "DMARC (spoofing-beskyttelse)", "security", "FAIL", "ingen DMARC", "high"));
    } else {
      const p = dmarcRecord.match(/[;\s]p=([^;\s]+)/i)?.[1]?.toLowerCase() ?? null;
      raw.dmarc.p = p;
      if (p === "reject") {
        raw.dmarc.policy = "reject";
        checks.push(check("dmarc", "DMARC (spoofing-beskyttelse)", "security", "PASS", `p=reject (blokk) — ${dmarcRecord}`, "high"));
      } else if (p === "quarantine") {
        raw.dmarc.policy = "quarantine";
        checks.push(check("dmarc", "DMARC (spoofing-beskyttelse)", "security", "PASS", `p=quarantine (delvis) — ${dmarcRecord}`, "high"));
      } else if (p === "none") {
        raw.dmarc.policy = "none";
        checks.push(check("dmarc", "DMARC (spoofing-beskyttelse)", "security", "FAIL", `p=none (kun overvåkning) — ${dmarcRecord}`, "high"));
      } else {
        raw.dmarc.policy = p ?? "ukjent";
        checks.push(check("dmarc", "DMARC (spoofing-beskyttelse)", "security", "FAIL", `mangler gyldig p= policy — ${dmarcRecord}`, "high"));
      }
    }
  }
  // Subdomene-DMARC (ISS-case: subdomener kan spoofes uten egen _dmarc).
  if (isSubdomain) {
    const subDmarc = await dnsTxt(`_dmarc.${original}`);
    raw.dmarc.subdomain = { name: `_dmarc.${original}`, present: false };
    if (subDmarc.error) {
      raw.dmarc.subdomain.error = subDmarc.error.message;
      checks.push(check("dmarc_subdomain", "DMARC for subdomene", "security", "UNKNOWN", `DNS-feil: ${subDmarc.error.message}`, "low"));
    } else {
      const subRecord = subDmarc.records.find((r) => /v=DMARC1/i.test(r)) ?? null;
      raw.dmarc.subdomain.present = !!subRecord;
      raw.dmarc.subdomain.record = subRecord;
      if (subRecord) {
        checks.push(check("dmarc_subdomain", "DMARC for subdomene", "security", "PASS", `_dmarc.${original} finnes`, "medium"));
      } else {
        checks.push(check("dmarc_subdomain", "DMARC for subdomene", "security", "FAIL",
          `ingen _dmarc.${original} — subdomener kan spoofes`, "medium"));
      }
    }
  }

  // ── d. MTA-STS (TXT + policy-fil) ──
  const mtaStsTxtRes = await dnsTxt(`_mta-sts.${reg}`);
  const hasStsTxt = !mtaStsTxtRes.error && mtaStsTxtRes.records.some((r) => /v=STSv1/i.test(r));
  const mtaStsPolicy = await httpGet(`https://mta-sts.${reg}/.well-known/mta-sts.txt`, DNS_TIMEOUT);
  const hasStsPolicy = mtaStsPolicy.ok && /version:\s*STSv1/i.test(mtaStsPolicy.body ?? "");
  raw.mta_sts = { txt: hasStsTxt, policy: hasStsPolicy, policy_status: mtaStsPolicy.status ?? null };
  if (hasStsTxt && hasStsPolicy) {
    checks.push(check("mta_sts", "MTA-STS (håndhevet e-post-TLS)", "security", "PASS",
      "TXT + gyldig policy-fil på plass", "high"));
  } else if (hasStsTxt || hasStsPolicy) {
    const missing = hasStsTxt ? "policy-filen mangler" : "TXT-recorden mangler";
    checks.push(check("mta_sts", "MTA-STS (håndhevet e-post-TLS)", "security", "FAIL",
      `delvis: ${missing}`, "medium"));
  } else {
    checks.push(check("mta_sts", "MTA-STS (håndhevet e-post-TLS)", "security", "FAIL",
      "ingen MTA-STS (TXT + policy-fil mangler)", "high"));
  }

  // ── e. TLS-RPT ──
  const tlsRptRes = await dnsTxt(`_smtp._tls.${reg}`);
  const tlsRptRecord = !tlsRptRes.error ? (tlsRptRes.records.find((r) => /v=TLSRPTv1/i.test(r)) ?? null) : null;
  raw.tls_rpt = tlsRptRecord;
  if (tlsRptRes.error) {
    checks.push(check("tls_rpt", "TLS-RPT (TLS-rapportering)", "security", "UNKNOWN", `DNS-feil: ${tlsRptRes.error.message}`, "low"));
  } else if (tlsRptRecord) {
    checks.push(check("tls_rpt", "TLS-RPT (TLS-rapportering)", "security", "PASS", tlsRptRecord, "medium"));
  } else {
    checks.push(check("tls_rpt", "TLS-RPT (TLS-rapportering)", "security", "FAIL", "ingen TLS-rapportering", "medium"));
  }

  // ── f. BIMI (premium-signal — mangler = NOT_APPLICABLE) ──
  const bimiRes = await dnsTxt(`default._bimi.${reg}`);
  const bimiRecord = !bimiRes.error ? (bimiRes.records.find((r) => /v=BIMI1/i.test(r)) ?? null) : null;
  raw.bimi = bimiRecord;
  if (bimiRes.error) {
    checks.push(check("bimi", "BIMI (merkevare-logo i innboks)", "trust_privacy", "UNKNOWN", `DNS-feil: ${bimiRes.error.message}`, "low"));
  } else if (bimiRecord) {
    checks.push(check("bimi", "BIMI (merkevare-logo i innboks)", "trust_privacy", "PASS", bimiRecord, "low"));
  } else {
    checks.push(check("bimi", "BIMI (merkevare-logo i innboks)", "trust_privacy", "NOT_APPLICABLE", "ingen BIMI (ikke påkrevd)", "low"));
  }

  // ── g. CAA ──
  const caaRes = await dnsCaa(reg);
  const caaIssuers = [];
  for (const rec of caaRes.records ?? []) {
    if (rec.issue) caaIssuers.push(rec.issue);
    if (rec.issuewild) caaIssuers.push(rec.issuewild);
  }
  raw.caa = { records: caaRes.records ?? [], issuers: [...new Set(caaIssuers)] };
  if (caaRes.error) {
    checks.push(check("caa", "CAA (sertifikat-utsteder-kontroll)", "security", "UNKNOWN", `DNS-feil: ${caaRes.error.message}`, "low"));
  } else if (caaRes.records.length) {
    checks.push(check("caa", "CAA (sertifikat-utsteder-kontroll)", "security", "PASS",
      caaIssuers.length ? `issuer: ${[...new Set(caaIssuers)].join(", ")}` : "CAA tilstede", "high"));
  } else {
    checks.push(check("caa", "CAA (sertifikat-utsteder-kontroll)", "security", "FAIL", "ingen CAA", "high"));
  }

  // ── h. DNSSEC (dig +dnssec DNSKEY — AD-flag) ──
  const dig = await digDnssec(reg);
  raw.dnssec = dig.available ? (dig.stdout ?? "") : null;
  if (!dig.available) {
    checks.push(check("dnssec", "DNSSEC (signert sone)", "security", "UNKNOWN", `dig utilgjengelig: ${dig.error}`, "low"));
  } else if (!/status:\s*NOERROR/i.test(dig.stdout)) {
    checks.push(check("dnssec", "DNSSEC (signert sone)", "security", "UNKNOWN", "kunne ikke validere DNSKEY (ikke NOERROR)", "low"));
  } else if (/flags:[^;\n]*\bad\b/.test(dig.stdout)) {
    checks.push(check("dnssec", "DNSSEC (signert sone)", "security", "PASS", "AD-flag — signert sone validert", "high"));
  } else {
    checks.push(check("dnssec", "DNSSEC (signert sone)", "security", "FAIL", "manglende AD-flag — sonen er ikke DNSSEC-signert", "high"));
  }

  // ── i. DNSBL (zen.spamhaus.org på reversert MX-IP) ──
  const mxRes = await dnsMx(reg);
  raw.mx = mxRes.records;
  if (mxRes.error || !mxRes.records.length) {
    raw.dnsbl = null;
    checks.push(check("dnsbl", "E-post-omdømme (DNSBL)", "trust_privacy", "UNKNOWN",
      mxRes.error ? `DNS-feil: ${mxRes.error.message}` : "ingen MX", "low"));
  } else {
    const firstMx = mxRes.records[0].exchange;
    const ipRes = await dns4(firstMx);
    if (ipRes.error || !ipRes.addresses.length) {
      raw.dnsbl = { mx: firstMx, error: ipRes.error?.message ?? "ingen A-record" };
      checks.push(check("dnsbl", "E-post-omdømme (DNSBL)", "trust_privacy", "UNKNOWN",
        `kunne ikke oppslå IP for ${firstMx}`, "low"));
    } else {
      const ip = ipRes.addresses[0];
      const rev = ip.split(".").reverse().join(".");
      const blHost = `${rev}.zen.spamhaus.org`;
      const blRes = await dns4(blHost);
      if (blRes.error && (blRes.error.code === "ENOTFOUND" || blRes.error.code === "ENODATA")) {
        raw.dnsbl = { mx: firstMx, ip, listed: false, host: blHost };
        checks.push(check("dnsbl", "E-post-omdømme (DNSBL)", "trust_privacy", "PASS",
          `${firstMx} (${ip}) ikke listet`, "medium"));
      } else if (blRes.error) {
        raw.dnsbl = { mx: firstMx, ip, error: blRes.error.message, host: blHost };
        checks.push(check("dnsbl", "E-post-omdømme (DNSBL)", "trust_privacy", "UNKNOWN",
          `DNSBL-feil: ${blRes.error.message}`, "low"));
      } else if (blRes.addresses.some((a) => /^127\.0\.0\./.test(a))) {
        raw.dnsbl = { mx: firstMx, ip, listed: true, result: blRes.addresses[0], host: blHost };
        checks.push(check("dnsbl", "E-post-omdømme (DNSBL)", "trust_privacy", "FAIL",
          `${firstMx} (${ip}) listet: ${blRes.addresses[0]}`, "medium"));
      } else {
        raw.dnsbl = { mx: firstMx, ip, listed: false, result: blRes.addresses[0], host: blHost };
        checks.push(check("dnsbl", "E-post-omdømme (DNSBL)", "trust_privacy", "PASS",
          `${firstMx} (${ip}) ikke listet`, "medium"));
      }
    }
  }

  // ── j. Subdomener (crt.sh — Certificate Transparency) ──
  await sleep(1000); // respekter crt.sh rate-limit (1 req/s)
  const crtUrl = `https://crt.sh/?q=%25.${reg}&output=json`;
  let crt = await httpGet(crtUrl, CRTSH_TIMEOUT);
  if ([429, 500, 502, 503, 504].includes(crt.status)) {
    await sleep(1000);
    crt = await httpGet(crtUrl, CRTSH_TIMEOUT); // retry én gang
  }
  let subdomains = [];
  let crtError = crt.error ?? (!crt.ok ? `HTTP ${crt.status}` : null);
  if (crt.ok) {
    try {
      const json = JSON.parse(crt.body);
      const names = new Set();
      for (const entry of json ?? []) {
        const nv = entry?.name_value ?? "";
        for (const n of String(nv).split("\n")) {
          const s = n.trim().toLowerCase().replace(/\.$/, "");
          if (!s) continue;
          names.add(s);
        }
      }
      const suffix = `.${reg}`;
      subdomains = [...names].filter((s) =>
        s !== reg && s.endsWith(suffix) && !s.includes("*") && !s.startsWith("www."));
      raw.subdomains = {
        count: subdomains.length,
        unique: subdomains,
        interesting: subdomains.filter((s) => /(^|\.)(staging|dev|admin|vpn|old|test|mail|beta|demo)($|\.)/i.test(s)),
        queried: true,
      };
    } catch (e) {
      crtError = `ugyldig JSON: ${String(e.message || e).split("\n")[0]}`;
      raw.subdomains = { count: 0, unique: [], interesting: [] };
    }
  } else {
    raw.subdomains = { count: 0, unique: [], interesting: [], error: crtError };
  }

  if (crtError) {
    checks.push(check("subdomains", "Subdomene-eksponering (crt.sh)", "security", "UNKNOWN", `crt.sh-feil: ${crtError}`, "low", "https"));
  } else if (subdomains.length) {
    const int = raw.subdomains.interesting;
    checks.push(check("subdomains", "Subdomene-eksponering (crt.sh)", "security", "PASS",
      `${subdomains.length} subdomener${int.length ? ` — interessant: ${int.join(", ")}` : ""}`, "medium", "https"));
  } else if (raw.subdomains.queried) {
    checks.push(check("subdomains", "Subdomene-eksponering (crt.sh)", "security", "PASS",
      "0 unike subdomener utover apex/www (sertifikatregistret crt.sh har kun hoveddomenet)", "medium", "https"));
  } else {
    checks.push(check("subdomains", "Subdomene-eksponering (crt.sh)", "security", "UNKNOWN", "ingen data i crt.sh", "medium", "https"));
  }

  return {
    section: "email_dns",
    title: "E-post & DNS-sikkerhet",
    checks,
    raw,
  };
}

// ── Direkte kjøring: node dns-email.mjs <domene> ───────────────────────────
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  if (!target) {
    console.error("Bruk: node packages/audit/lib/web/dns-email.mjs <domene>");
    process.exit(2);
  }
  try {
    const result = await collectDnsEmail(target);
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(`Feil: ${String(e.message || e)}`);
    process.exit(1);
  }
}
