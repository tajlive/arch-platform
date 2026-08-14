// Tilstedeværelse-modul — Arch Website Audit v2 (ARC-10, plan §1.6).
//
// Dekker den deterministiske, passive delen av §1.6:
//   - Sosiale medier: profillenker fra nettsiden → profil svarer (200) eller død lenke (404)?
//   - NAP-signaler: navn/telefon/e-post/adresse observert på nettsiden; navn/org.nr-konsistens mot Brreg.
//
// Google Business Profile (anmeldelser, kategori) krever Places API-nøkkel — markeres
// eksplisitt UNKNOWN «krever Google Places API-nøkkel», aldri fabrikert.
//
// Regler: kun GET på profil-lenker funnet PÅ nettsiden (samtykke-gated av CLI-et som alltid).
// Ingen scraping av sosiale nettverk, ingen anmeldelsestall uten kilde.

const NOW = () => new Date().toISOString();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const check = (id, label, result, evidence, confidence = "high", source = "html") => ({
  id, label, dimension: "trust_privacy", result, evidence, confidence, source, observed_at: NOW(),
});

const SOCIAL_HOSTS = [
  { key: "facebook", host: /(^|\.)facebook\.com$/i },
  { key: "instagram", host: /(^|\.)instagram\.com$/i },
  { key: "linkedin", host: /(^|\.)linkedin\.com$/i },
  { key: "tiktok", host: /(^|\.)tiktok\.com$/i },
  { key: "youtube", host: /(^|\.)youtube\.com$/i },
  { key: "x_twitter", host: /(^|\.)(x\.com|twitter\.com)$/i },
];

function extractSocial(html) {
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]);
  const found = new Map();
  for (const href of hrefs) {
    let u;
    try { u = new URL(href); } catch { continue; }
    const def = SOCIAL_HOSTS.find((d) => d.host.test(u.hostname));
    if (!def || found.has(def.key)) continue;
    if (/(share|intent|sharer|embed|pixel|analytics)/i.test(u.pathname + u.search)) continue;
    found.set(def.key, u.toString());
  }
  return found;
}

async function profileStatus(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal, headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" } });
    return { url, status: res.status };
  } catch (e) {
    // HEAD blokkeres ofte av sosiale plattformer — GET-status fallback
    try {
      const res2 = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal, headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" } });
      return { url, status: res2.status };
    } catch (e2) {
      return { url, status: null, error: String(e2.message || e2).split("\n")[0] };
    }
  } finally {
    clearTimeout(t);
  }
}

export async function collectPresence(targetUrl, opts = {}) {
  const section = "presence";
  const title = "Tilstedeværelse (sosiale medier · NAP)";
  const checks = [];
  const raw = { social: {}, contact: {}, google_business: null };

  let html = opts.html ?? "";
  if (!html) {
    try {
      const res = await fetch(targetUrl, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" }, signal: AbortSignal.timeout(15000) });
      if (res.ok) html = await res.text();
    } catch { /* best-effort */ }
  }
  if (!html) {
    checks.push(check("presence_html", "Hjemmeside lesbar for tilstedeværelse-sjekk", "UNKNOWN", "kunne ikke hente HTML", "medium"));
    return { section, title, checks, raw };
  }

  // ── Sosiale medier ──
  const social = extractSocial(html);
  raw.social = Object.fromEntries(social);
  if (social.size) {
    const results = [];
    for (const [key, url] of social) {
      const st = await profileStatus(url);
      raw.social[key] = { url, status: st.status ?? null, error: st.error ?? null };
      results.push(`${key}: ${st.status ?? "feil"}${st.error ? ` (${st.error})` : ""}`);
      await sleep(300);
    }
    const dead = Object.entries(raw.social).filter(([, v]) => v.status === 404);
    checks.push(check("social_profiles", "Sosiale medier (lenker fra nettsiden)",
      dead.length ? "FAIL" : "PASS",
      dead.length
        ? `${Object.keys(raw.social).length} profiler lenket, ${dead.length} svarer 404: ${dead.map(([k]) => k).join(", ")}`
        : `${Object.keys(raw.social).length} profiler lenket — alle svarer (${results.join(" · ")})`));
    if (dead.length) {
      checks.push(check("social_dead_links", "Døde sosiale medie-lenker",
        "FAIL", `Profil-lenker som gir 404: ${dead.map(([k, v]) => `${k} (${v.url})`).join(", ")}`));
    }
  } else {
    checks.push(check("social_profiles", "Sosiale medier (lenker fra nettsiden)", "FAIL",
      "ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet)"));
  }

  // ── NAP-signaler: kontaktinfo på nettsiden ──
  const tel = html.match(/href=["']tel:([^"']+)["']/i)?.[1] ?? null;
  const mail = html.match(/href=["']mailto:([^"']+)["']/i)?.[1] ?? null;
  const orgNrMatch = html.match(/\b(9\d{8}|[1-8]\d{8})\b/);
  raw.contact = { tel, email: mail ?? null, org_nr_on_page: orgNrMatch?.[1] ?? null };

  checks.push(check("nap_phone", "Telefon på nettsiden", tel ? "PASS" : "FAIL",
    tel ? `tel-lenke: ${tel}` : "ingen tel:-lenke observert — potential concern (kontaktbarhet)", "medium"));
  checks.push(check("nap_email", "E-post på nettsiden", mail ? "PASS" : "FAIL",
    mail ? `mailto: ${mail}` : "ingen mailto:-lenke observert — potential concern (kontaktbarhet)", "medium"));

  // NAP-konsistens vs Brreg (hvis Brreg-data er gitt av orchestrator)
  const brreg = opts.brreg ?? null;
  if (brreg) {
    const brregName = String(brreg.navn ?? "").toLowerCase();
    const ogName = (opts.nameCandidates?.[0] ?? "").toLowerCase();
    const normalized = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9æøå ]/g, "").replace(/\s+/g, " ").trim();
    const a = normalized(brregName), b = normalized(ogName);
    if (a && b) {
      const match = a === b || a.includes(b) || b.includes(a);
      checks.push(check("nap_name_consistency", "Navn-konsistens (nettside ↔ Brreg)",
        match ? "PASS" : "FAIL",
        match ? `«${brreg.navn}» (Brreg) samsvarer med nettsidenavn` : `nettsidenavn «${opts.nameCandidates?.[0]}» avviker fra Brreg-navn «${brreg.navn}» — signal`, "high", "html+brreg"));
    }
    if (raw.contact.org_nr_on_page && brreg.organisasjonsnummer) {
      checks.push(check("nap_orgnr_consistency", "Org.nr-konsistens (nettside ↔ Brreg)",
        raw.contact.org_nr_on_page === brreg.organisasjonsnummer ? "PASS" : "FAIL",
        `nettside: ${raw.contact.org_nr_on_page} · Brreg: ${brreg.organisasjonsnummer}`, "high", "html+brreg"));
    }
  }

  // Google Business Profile — krever Places API-nøkkel; aldri fabrikert
  raw.google_business = { status: "unknown", reason: "krever Google Places API-nøkkel — ikke tilgjengelig uten" };
  checks.push(check("google_business", "Google Business Profile (anmeldelser, kategori)",
    "UNKNOWN", "krever Google Places API-nøkkel — støttes når nøkkel er konfigurert", "medium", "places_api"));

  return { section, title, checks, raw };
}

// Direkte kjøring: node packages/audit/lib/web/presence.mjs https://klarpakke.no
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const url = process.argv[2];
  if (!url) { console.error("Bruk: node presence.mjs <url>"); process.exit(2); }
  collectPresence(url).then((r) => console.log(JSON.stringify(r, null, 2)));
}
