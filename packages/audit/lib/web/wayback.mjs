// Historikkmodul — Arch Website Audit v2 (ARC-10, plan §1.9).
// Ref: docs/f4.3-audit-v2-product-strategy.md
//
// Wayback Machine CDX-API (gratis, passiv): innholdshistorikk for et domene —
// når siden først ble arkivert, når den sist ble arkivert, og omfang.
// Avslører «gamle opplysninger» og om siden er aktiv/vedlikeholdt.
//
// Sikkerhetsgrenser: passiv, read-only, kun GET mot web.archive.org.
// Ingen data/feil → UNKNOWN (aldri fabrikert).
//
// Direkte kjøring: node packages/audit/lib/web/wayback.mjs klarpakke.no

const NOW = () => new Date().toISOString();
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const MONTH_MS = 30.44 * 24 * 60 * 60 * 1000; // ~én måned (gjennomsnitt)

const check = (dimension, id, label, result, evidence, confidence = "high") => ({
  id, label, dimension, result, evidence, confidence, source: "wayback_cdx", observed_at: NOW(),
});

/** Registrerbart domene (best-effort eTLD+1, Norway-sentrert). */
function registrable(host) {
  let h = String(host || "").toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  const parts = h.split(".").filter(Boolean);
  if (parts.length <= 2) return h;
  const multi = new Set(["co.uk", "org.uk", "ac.uk", "gov.uk", "co.no", "priv.no", "fhs.no", "mil.no", "co.jp", "com.au", "com.br"]);
  for (let i = 0; i < parts.length - 1; i++) {
    if (multi.has(parts.slice(i + 1).join("."))) return parts.slice(i).join(".");
  }
  return parts.slice(-2).join(".");
}

/** CDX-timestamp (yyyyMMddHHmmss) → ISO-dato (yyyy-mm-dd). */
function tsToIso(ts) {
  const s = String(ts ?? "");
  if (s.length < 8) return null;
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/** Date → CDX-dato (yyyyMMdd). */
function cdxDate(d) {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** Fetch med timeout → { ok, status, json, error }. */
async function httpJson(url, { timeout = 15000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: ctrl.signal });
    let text = "";
    let json = null;
    try { text = await res.text(); if (text) json = JSON.parse(text); } catch { json = null; }
    return { ok: res.ok, status: res.status, json };
  } catch (e) {
    const msg = e?.name === "AbortError" ? "timeout" : String(e?.message || e);
    return { ok: false, status: 0, json: null, error: msg.split("\n")[0] };
  } finally {
    clearTimeout(t);
  }
}

/** Parser CDX-JSON (tåler både full og fl=timestamp/... utdata) → [{timestamp, original}]. */
function parseCdx(json) {
  if (!Array.isArray(json) || !json.length) return [];
  const header = json[0];
  let tsIdx = -1;
  let origIdx = -1;
  header.forEach((h, i) => { if (h === "timestamp") tsIdx = i; if (h === "original") origIdx = i; });
  if (tsIdx < 0) return [];
  return json.slice(1)
    .filter((r) => Array.isArray(r) && r[tsIdx] && /^\d{8,14}$/.test(String(r[tsIdx])))
    .map((r) => ({ timestamp: String(r[tsIdx]), original: origIdx >= 0 ? r[origIdx] ?? null : null }));
}

/**
 * Samler Wayback-arkivhistorikk for et domene.
 * @param {string} domain registrerbart domene (f.eks. klarpakke.no)
 */
export async function collectWayback(domain) {
  const checks = [];
  const raw = { snapshots: [], first_seen: null, last_seen: null, snapshot_count: null };
  const reg = registrable(domain);

  // 1. Primær CDX-spørring (spec URL: collapse=urlkey → unike URL-nøkler, limit 100).
  const primary = await httpJson(
    `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(reg)}/*&output=json&limit=100&collapse=urlkey`,
    { timeout: 15000 },
  );

  let firstSeen = null;
  let lastSeen = null;
  let count = null;
  let usedFallback = false;

  if (primary.ok && Array.isArray(primary.json)) {
    const snaps = parseCdx(primary.json);
    if (snaps.length) {
      const stamps = snaps.map((s) => s.timestamp).sort();
      firstSeen = tsToIso(stamps[0]);
      lastSeen = tsToIso(stamps[stamps.length - 1]);
      count = snaps.length;
      raw.snapshots = snaps;
    } else {
      raw.error = "ingen arkiverte versjoner";
    }
  } else {
    // Fallback: collapse-spørringen er tung (timeouter på domener med mye historikk).
    // Bruk to raske spørringer: eldste fangst + fangst innen siste 12 mnd.
    usedFallback = true;
    raw.error = primary.error ?? `HTTP ${primary.status}`;

    const old = await httpJson(
      `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(reg)}&matchType=domain&output=json&limit=1&fl=timestamp`,
      { timeout: 15000 },
    );
    const recent = await httpJson(
      `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(reg)}&matchType=domain&output=json&limit=1&fl=timestamp&from=${cdxDate(new Date(Date.now() - 12 * MONTH_MS))}`,
      { timeout: 15000 },
    );
    const oldSnaps = parseCdx(old.json);
    const recentSnaps = parseCdx(recent.json);
    if (oldSnaps.length) firstSeen = tsToIso(oldSnaps[0].timestamp);
    if (recentSnaps.length) lastSeen = tsToIso(recentSnaps[0].timestamp);
    raw.snapshots = [...oldSnaps, ...recentSnaps];
    count = null;
  }

  raw.first_seen = firstSeen;
  raw.last_seen = lastSeen;
  raw.snapshot_count = count;
  if (usedFallback) raw.fallback = true;

  // 2. Sjekker
  if (firstSeen) {
    checks.push(check("reliability", "history_exists", "Arkivhistorikk finnes", "PASS",
      `arkivert siden ${firstSeen}`, "high"));

    // aktualitet: siste snapshot innen 12 mnd?
    if (lastSeen) {
      const fresh = Number.isFinite(Date.parse(lastSeen)) && (Date.now() - Date.parse(lastSeen)) <= 12 * MONTH_MS;
      const ev = usedFallback ? `fanget i løpet av siste 12 mnd (${lastSeen})` : `siste snapshot ${lastSeen}`;
      checks.push(check("reliability", "history_freshness", "Aktualitet (siste arkiverte versjon)",
        fresh ? "PASS" : "FAIL",
        fresh ? ev : (usedFallback ? ev : `siste snapshot ${lastSeen} — siden kan være inaktiv`),
        "high"));
    } else {
      checks.push(check("reliability", "history_freshness", "Aktualitet (siste arkiverte versjon)", "FAIL",
        "ingen fangst i Wayback siste 12 måneder — siden kan være inaktiv", "medium"));
    }

    // omfang
    if (count != null) {
      checks.push(check("reliability", "history_scope", "Arkivomfang", "PASS",
        `${count} arkiverte versjoner (unike URL-nøkler, limit 100)`, "high"));
    } else {
      checks.push(check("reliability", "history_scope", "Arkivomfang", "UNKNOWN",
        "omfang ikke tilgjengelig (Wayback CDX timeout på full historikk)", "medium"));
    }
  } else {
    const why = primary.error ?? (primary.ok ? "ingen arkiverte versjoner" : `HTTP ${primary.status}`);
    checks.push(check("reliability", "history_exists", "Arkivhistorikk finnes", "UNKNOWN",
      usedFallback && primary.error
        ? `Wayback svarte ikke (${primary.error}) for ${reg}`
        : `ingen arkiverte versjoner funnet i Wayback for ${reg}`, "medium"));
  }

  return { section: "history", title: "Historikk (Wayback Machine)", checks, raw };
}

// ── Direkte kjøring: node wayback.mjs <domene> ──
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
const isDirect = process.argv[1] && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1]);
if (isDirect) {
  const [, , domene] = process.argv;
  if (!domene) {
    console.error("Bruk: node wayback.mjs <domene>");
    process.exit(2);
  }
  const result = await collectWayback(domene);
  console.log(JSON.stringify(result, null, 2));
}
