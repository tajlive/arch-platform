// Norge-datakilder — Arch Website Audit v2 (ARC-10, plan §1.1–1.3 + §5.1–5.3).
// Ref: docs/f4.3-audit-v2-product-strategy.md
//
// Samler norske offentlige registerdata for å verifisere/kontekstualisere en
// norsk virksomhet basert på domenet alene:
//   Brreg Enhetsregisteret  — firma, organisasjonsform, konkurs/MVA, roller, regnskap
//   Norid RDAP              — domeneregistrering, DNSSEC, registrar (kun *.no)
//   SSB Statistikkbanken    — bransjekontekst (antall foretak i næringen)
//
// Sikkerhetsgrenser (arves fra v1): passiv, read-only, kun GET/POST mot åpne
// offentlige API-er. Ingen nøkler, ingen mutasjoner, ingen fabrikasjon.
// Roller hentes KUN fra det åpne API-et (organisasjoner/roller uten fnr);
// personers fnr/fødselsdato brukes aldri i output.
//
// Direkte kjøring: node packages/audit/lib/web/norge.mjs <navn> <domene>

const NOW = () => new Date().toISOString();
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const BRREG_BASE = "https://data.brreg.no/enhetsregisteret/api";
const BRREG_ACCEPT = "application/vnd.brreg.enhetsregisteret.enhet.v2+json";
const ROLLER_ACCEPT = "application/vnd.brreg.enhetsregisteret.rolle.v1+json";
const REGNSKAP_URL = "https://data.brreg.no/regnskapsregisteret/regnskap";
const FINANSTILSYNET_BASE = "https://api.finanstilsynet.no/registry/v2";
const OPPGAVEREGISTERET_BASE = "https://data.brreg.no/oppgaveregisteret/api";

// Kuratert næringskode (2 første tegn) → SSB-tabell. Alle tabell-id-er er
// VERIFISERT live 2026-08-14 (tabell 12817 svarer med json-stat2 for hver kode).
// Tabell 12817: «Foreløpige tall for antall foretak, sysselsatte og omsetning,
// etter næring (SN2007), sysselsettingsgruppe, statistikkvariabel og år».
const SSB_TABLES = {
  "45": { table: "12817" }, // Handel med og reparasjon av motorvogner
  "56": { table: "12817" }, // Serveringsvirksomhet
  "81": { table: "12817" }, // Tjenester tilknyttet eiendomsdrift (FM/renhold)
  "62": { table: "12817" }, // IT-tjenester
  "70": { table: "12817" }, // Hovedkontortjenester, administrativ rådgivning
  "47": { table: "12817" }, // Detaljhandel, unntatt med motorvogner
  "43": { table: "12817" }, // Spesialisert bygge- og anleggsvirksomhet
  "96": { table: "12817" }, // Annen personlig tjenesteyting
  "95": { table: "12817" }, // Reparasjon av varer til personlig bruk
  "63": { table: "12817" }, // Informasjonstjenester
};

/** Sjekk-objekt med provenance (samme format som v1-modulene). */
const check = (dimension, id, label, result, evidence, confidence = "high", source = "brreg") => ({
  id, label, dimension, result, evidence, confidence, source, observed_at: NOW(),
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

/** Renser navn for juridiske suffikser (AS/ASA/ENK/DA/Project) — kun som suffiks. */
function cleanName(name) {
  return String(name ?? "").replace(/\b(as|asa|enk|da|project|nuf)\b\s*$/i, "").trim();
}

/** Case/diakritikk-normalisert navn for konsistenssammenligning. */
function normalizeName(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(as|asa|enk|da|nuf|kf|sa|is|ba|project)\b\s*$/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ").trim();
}

/** Token-basert navnsammenligning (case/diakritikk-insensitiv). */
function namesMatch(a, b) {
  const na = normalizeName(a).split(/\s+/).filter(Boolean);
  const nb = normalizeName(b).split(/\s+/).filter(Boolean);
  if (!na.length || !nb.length) return false;
  const shorter = na.length <= nb.length ? na : nb;
  const longer = new Set(na.length <= nb.length ? nb : na);
  return shorter.every((t) => longer.has(t));
}

/** Normaliserer en hjemmeside-URL til registrerbart domene for sammenligning. */
function normalizeSite(url) {
  let s = String(url ?? "").trim().toLowerCase();
  if (!s) return null;
  s = s.replace(/^[a-z]+:\/\//, "").replace(/^www\./, "");
  s = s.split(/[/?#]/)[0];
  s = s.split(":")[0]; // fjern port
  return registrable(s);
}

/** VcardArray fn-uttrekk (registrar-navn fra Norid RDAP-entity). */
function vcardFn(entity) {
  const vcard = entity?.vcardArray;
  if (!Array.isArray(vcard) || !Array.isArray(vcard[1])) return null;
  for (const item of vcard[1]) {
    if (Array.isArray(item) && item[0] === "fn") return item[3] ?? null;
  }
  return null;
}

/** Henter RDAP-event-dato (YYYY-MM-DD) for gitt eventAction. */
function eventDate(events, action) {
  if (!Array.isArray(events)) return null;
  const ev = events.find((e) => e?.eventAction === action);
  if (!ev?.eventDate) return null;
  return String(ev.eventDate).slice(0, 10);
}

/** Fetch med timeout → { ok, status, json, text, error }. */
async function httpJson(url, { method = "GET", headers = {}, body = null, timeout = 15000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      method,
      headers: { "user-agent": UA, ...headers },
      body,
      redirect: "follow",
      signal: ctrl.signal,
    });
    let text = "";
    let json = null;
    try { text = await res.text(); if (text) json = JSON.parse(text); } catch { json = null; }
    return { ok: res.ok, status: res.status, json, text };
  } catch (e) {
    const msg = e?.name === "AbortError" ? "timeout" : String(e?.message || e);
    return { ok: false, status: 0, json: null, text: "", error: msg.split("\n")[0] };
  } finally {
    clearTimeout(t);
  }
}

/** Finner rollenavn (person eller enhet) for en rolletype-kode. IKKE fnr/fødselsdato. */
function roleName(groups, kode) {
  for (const g of groups ?? []) {
    for (const r of g.roller ?? []) {
      if (r?.type?.kode === kode && !r.avregistrert) {
        if (r.person?.navn) return `${r.person.navn.fornavn ?? ""} ${r.person.navn.etternavn ?? ""}`.trim() || null;
        if (r.enhet?.navn) return r.enhet.navn;
      }
    }
  }
  return null;
}

const fmtInt = (n) => (n == null ? null : new Intl.NumberFormat("nb-NO").format(n));

/** Henter SSB bransjekontekst: antall foretak i næringen, siste tilgjengelige år. */
async function ssbContext(tableId, nace2) {
  const query = {
    query: [
      { code: "NACE2007", selection: { filter: "item", values: [nace2] } },
      { code: "SyssGrp", selection: { filter: "item", values: ["000"] } },
      { code: "ContentsCode", selection: { filter: "item", values: ["Foretak"] } },
    ],
    response: { format: "json-stat2" },
  };
  const res = await httpJson(`https://data.ssb.no/api/v0/no/table/${tableId}`, {
    method: "POST", body: JSON.stringify(query), headers: { "content-type": "application/json" }, timeout: 20000,
  });
  if (!res.ok || !res.json?.value) return null;
  const j = res.json;
  const naceLabel = j.dimension?.NACE2007?.category?.label?.[nace2] ?? nace2;
  const tidIdx = j.dimension?.Tid?.category?.index ?? {};
  const tidLabels = j.dimension?.Tid?.category?.label ?? {};
  const values = j.value ?? [];
  let lastIdx = -1;
  for (let i = values.length - 1; i >= 0; i--) { if (values[i] != null) { lastIdx = i; break; } }
  if (lastIdx < 0) return null;
  let year = null;
  for (const [code, pos] of Object.entries(tidIdx)) { if (pos === lastIdx) { year = tidLabels?.[code] ?? code; break; } }
  return { value: values[lastIdx], year, label: naceLabel };
}

/**
 * Samler Norge-data for et domene.
 * @param {object}  opts
 * @param {string}  opts.domain          auditert domene (f.eks. klarpakke.no)
 * @param {string[]} opts.nameCandidates navnekandidater fra nettsiden (og:site_name, title)
 * @param {string|null} opts.orgNr        kjent organisasjonsnummer (valgfri snarvei)
 */
export async function collectNorge({ domain, nameCandidates = [], orgNr = null } = {}) {
  const checks = [];
  const raw = { brreg: { unit: null, search: null, selection: null }, norid: {}, ssb: {} };
  const reg = registrable(domain);

  // ── 1. Brreg-enhet: direkte oppslag eller navnesøk ──
  let unit = null;
  let selection = null;
  let confidence = "high";

  if (orgNr) {
    const res = await httpJson(`${BRREG_BASE}/enheter/${encodeURIComponent(orgNr)}`, { headers: { accept: BRREG_ACCEPT } });
    if (res.ok && res.json?.organisasjonsnummer) {
      unit = res.json;
      selection = { method: "orgnr", orgNr };
      confidence = "high";
    }
  }

  if (!unit && !orgNr) {
    const tried = [];
    for (const candidate of nameCandidates) {
      const q = cleanName(candidate);
      if (!q) continue;
      const res = await httpJson(`${BRREG_BASE}/enheter?navn=${encodeURIComponent(q)}&size=5`, { headers: { accept: BRREG_ACCEPT } });
      const hits = (res.ok && res.json?._embedded?.enheter) || [];
      if (!hits.length) { tried.push({ query: q, hits: 0 }); continue; }
      const homeMatch = hits.find((h) => h.hjemmeside && normalizeSite(h.hjemmeside) === reg);
      // Presis full-navn-match (token-likhet begge veier) — kun bekreftende hvis ENESTE treff.
      const exact = hits.find((h) => namesMatch(q, h.navn) && namesMatch(h.navn, q));
      unit = homeMatch ?? exact ?? hits[0];
      selection = {
        method: "navn", query: q, nameCandidate: candidate,
        totalHits: hits.length, matchedHjemmeside: !!homeMatch,
        matchedExactName: !!exact && hits.length === 1,
        hits: hits.map((h) => ({ organisasjonsnummer: h.organisasjonsnummer, navn: h.navn, hjemmeside: h.hjemmeside ?? null })),
      };
      confidence = homeMatch ? "high" : (exact && hits.length === 1) ? "medium" : "low";
      raw.brreg.search = selection;
      break;
    }
    if (!unit && tried.length) raw.brreg.search = { tried };
  }

  if (!unit) {
    checks.push(check("trust_privacy", "brreg_org", "Firma i Brreg (Enhetsregisteret)", "UNKNOWN",
      "ingen Brreg-treff" + (nameCandidates.length ? ` for «${nameCandidates.join("», «")}»` : ""), "medium", "brreg"));
    raw.brreg = { unit: null, search: raw.brreg.search ?? null, selection: null, error: "ingen treff", confirmed: false };
  } else {
    raw.brreg.unit = unit;
    raw.brreg.selection = selection;
    const org = unit.organisasjonsnummer;
    const navn = unit.navn;
    // Bekreftet = hjemmeside-match eller orgNr eller eneste treff med eksakt navn-match.
    const confirmed = !!selection?.matchedHjemmeside || selection?.method === "orgnr" || selection?.matchedExactName === true;
    raw.brreg.confirmed = confirmed;

    if (!confirmed) {
      const cands = (selection?.hits ?? []).slice(0, 3).map((h) => `${h.navn} (${h.organisasjonsnummer})`).join(" · ");
      checks.push(check("trust_privacy", "brreg_org", "Firma i Brreg (Enhetsregisteret)", "UNKNOWN",
        `N kandidater for «${selection?.query ?? nameCandidates[0]}», ingen med Brreg-hjemmeside som matcher ${reg} — kan ikke entydig knytte firma til domene. Kandidater: ${cands || "ingen"}`,
        "medium", "brreg"));
      // Ingen enhetsavledede sjekker ved tvetydig treff — å påstå orgform/konkurs/næring
      // om feil firma er verre enn UNKNOWN.
    } else {
      // 2a. Organisasjonsnummer + navn
      checks.push(check("trust_privacy", "brreg_org", "Organisasjonsnummer og navn", "PASS",
        `org ${org} — ${navn}`, confidence, "brreg"));

    // 2b. Organisasjonsform
    if (unit.organisasjonsform?.beskrivelse) {
      checks.push(check("trust_privacy", "brreg_orgform", "Organisasjonsform", "PASS",
        unit.organisasjonsform.beskrivelse + (unit.organisasjonsform.kode ? ` (${unit.organisasjonsform.kode})` : ""), "high", "brreg"));
    }

    // 2c. Konkurs / under avvikling — FAIL er et viktig signal
    const konkurs = unit.konkurs === true;
    const avvikling = unit.underAvvikling === true || unit.underTvangsavviklingEllerTvangsopplosning === true;
    checks.push(check("security", "brreg_konkurs", "Konkurs / under avvikling",
      (konkurs || avvikling) ? "FAIL" : "PASS",
      konkurs ? "enheten er registrert konkurs — viktig signal" :
      avvikling ? "enheten er under avvikling/tvangsoppløsning — viktig signal" :
      "ikke konkurs og ikke under avvikling", "high", "brreg"));

    // 2d. Registrert i MVA
    checks.push(check("trust_privacy", "brreg_mva", "Registrert i Merverdiavgiftsregisteret", "PASS",
      unit.registrertIMvaregisteret === true ? "registrert i MVA" : "ikke registrert i MVA", "high", "brreg"));

    // 2e. Stiftelses-/registreringsdato
    const stif = unit.stiftelsesdato;
    const regd = unit.registreringsdatoEnhetsregisteret;
    const dateEv = stif && regd ? `stiftet ${stif} · registrert i Enhetsregisteret ${regd}` :
      stif ? `stiftet ${stif}` : regd ? `registrert i Enhetsregisteret ${regd}` : "datoer ikke oppgitt";
    checks.push(check("trust_privacy", "brreg_dates", "Stiftelses- og registreringsdato", "PASS", dateEv, "high", "brreg"));

    // 2f. Antall ansatte
    checks.push(check("trust_privacy", "brreg_ansatte", "Antall ansatte", "PASS",
      typeof unit.antallAnsatte === "number" ? `${unit.antallAnsatte} ansatte` : "antall ansatte ikke oppgitt", "high", "brreg"));

    // 2g. Næringskode + beskrivelse
    const nace = unit.naeringskode1;
    checks.push(check("trust_privacy", "brreg_naering", "Næringskode og beskrivelse", "PASS",
      nace?.kode ? `${nace.kode} — ${nace.beskrivelse ?? "uten beskrivelse"}` : "næringskode ikke oppgitt", "high", "brreg"));

    // 2h. Hjemmeside-konsistens (Brreg-hjemmeside vs auditert domene)
    const hs = unit.hjemmeside;
    if (hs) {
      const match = normalizeSite(hs) === reg;
      checks.push(check("trust_privacy", "brreg_hjemmeside", "Hjemmeside-konsistens (Brreg vs domene)",
        match ? "PASS" : "FAIL",
        match ? `Brreg-hjemmeside «${hs}» samsvarer med auditert domene ${reg}` :
                `Brreg-hjemmeside «${hs}» avviker fra auditert domene ${reg}`,
        "high", "brreg"));
    } else {
      checks.push(check("trust_privacy", "brreg_hjemmeside", "Hjemmeside registrert i Brreg", "FAIL",
        `ingen hjemmeside registrert i Brreg for «${navn}»`, "high", "brreg"));
    }

    // 2i. Navn-konsistens (første navnekandidat vs Brreg-navn)
    const cand = nameCandidates[0];
    if (cand) {
      const match = namesMatch(cand, navn);
      checks.push(check("trust_privacy", "brreg_navn_consistency", "Navn-konsistens (nettside vs Brreg)",
        match ? "PASS" : "FAIL",
        match ? `«${cand}» samsvarer med Brreg-navn «${navn}»` : `nettside-navn «${cand}» avviker fra Brreg-navn «${navn}»`,
        confidence, "brreg"));
    } else {
      checks.push(check("trust_privacy", "brreg_navn_consistency", "Navn-konsistens (nettside vs Brreg)", "NOT_APPLICABLE",
        "ingen navnekandidat å sammenligne mot", "medium", "brreg"));
    }

    // 2j. Siste årsregnskap (Regnskapsregisteret — sumDriftsinntekter + resultat + år)
    const regn = await httpJson(`${REGNSKAP_URL}/${encodeURIComponent(org)}`, { headers: { accept: "application/json" }, timeout: 20000 });
    if (regn.ok && Array.isArray(regn.json) && regn.json.length) {
      const r = regn.json[0];
      const drifts = r.resultatregnskapResultat?.driftsresultat?.driftsinntekter?.sumDriftsinntekter;
      const resultat = r.resultatregnskapResultat?.aarsresultat ?? r.resultatregnskapResultat?.driftsresultat?.driftsresultat;
      const year = r.regnskapsperiode?.tilDato?.slice(0, 4);
      const ev = `regnskap ${year ?? "?"}: driftsinntekter ${fmtInt(drifts) ?? "?"} kr, resultat ${fmtInt(resultat) ?? "?"} kr`;
      checks.push(check("trust_privacy", "brreg_regnskap", "Siste årsregnskap", "PASS", ev, "high", "brreg"));
      raw.brreg.regnskap = { year, sumDriftsinntekter: drifts, resultat, oppstillingsplan: r.oppstillingsplan };
    } else {
      checks.push(check("trust_privacy", "brreg_regnskap", "Siste årsregnskap", "NOT_APPLICABLE",
        "ikke regnskapspliktig eller ikke innsendt årsregnskap", "high", "brreg"));
      raw.brreg.regnskap = null;
    }

    // 3. Roller — daglig leder + styreleder (åpent API, uten fnr)
    const rol = await httpJson(`${BRREG_BASE}/enheter/${encodeURIComponent(org)}/roller`, { headers: { accept: ROLLER_ACCEPT } });
    const groups = (rol.ok && rol.json) ? (rol.json.rollegrupper ?? rol.json._embedded?.rollegrupper ?? []) : [];
    const daglig = roleName(groups, "DAGL");
    const styreleder = roleName(groups, "LEDE");
    if (daglig) {
      checks.push(check("trust_privacy", "brreg_roller", "Daglig leder / styreleder (Brreg)", "PASS",
        `daglig leder: ${daglig}` + (styreleder ? ` · styreleder: ${styreleder}` : ""), "high", "brreg"));
      raw.brreg.roller = { daglig_leder: daglig, styreleder };
    } else {
      checks.push(check("trust_privacy", "brreg_roller", "Daglig leder / styreleder (Brreg)", "UNKNOWN",
        rol.ok ? "ingen daglig leder i åpent roller-API (ENK har ofte 0 roller)" : `klarte ikke hente roller (HTTP ${rol.status})`,
        "medium", "brreg"));
      raw.brreg.roller = null;
    }
    }

  }

  // 5. SSB bransjekontekst (næringskode 2 første tegn → kuratert tabell)
  const nace2 = unit?.naeringskode1?.kode ? String(unit.naeringskode1.kode).split(".")[0] : null;
  if (nace2 && SSB_TABLES[nace2]) {
    const cfg = SSB_TABLES[nace2];
    const ctx = await ssbContext(cfg.table, nace2);
    if (ctx) {
      const ev = `SSB tabell ${cfg.table}: ${ctx.label} — ${fmtInt(ctx.value)} foretak (${ctx.year})`;
      checks.push(check("trust_privacy", "ssb_context", `Bransjekontekst (SSB, næring ${nace2})`, "PASS", ev, "high", "ssb"));
      raw.ssb = { table: cfg.table, nace: nace2, value: ctx.value, year: ctx.year, label: ctx.label, evidence: ev };
    } else {
      checks.push(check("trust_privacy", "ssb_context", "Bransjekontekst (SSB)", "UNKNOWN",
        `SSB-tabell ${cfg.table} svarte ikke med data for næring ${nace2}`, "medium", "ssb"));
      raw.ssb = { table: cfg.table, nace: nace2, error: "ingen data" };
    }
  } else if (!nace2) {
    checks.push(check("trust_privacy", "ssb_context", "Bransjekontekst (SSB)", "UNKNOWN",
      "ingen næringskode tilgjengelig", "medium", "ssb"));
  } else {
    checks.push(check("trust_privacy", "ssb_context", "Bransjekontekst (SSB)", "UNKNOWN",
      `SSB-tabell ikke kartlagt for næring ${nace2}`, "medium", "ssb"));
  }

  // ── 4. Norid RDAP (kun .no) ──
  if (reg.endsWith(".no")) {
    const rdap = await httpJson(`https://rdap.norid.no/domain/${encodeURIComponent(reg)}`, { timeout: 15000 });
    if (rdap.ok && rdap.json?.ldhName) {
      const j = rdap.json;
      const created = eventDate(j.events, "registration");
      const changed = eventDate(j.events, "last changed");
      const dnssec = j.secureDNS?.delegationSigned;
      const registrar = vcardFn((j.entities ?? []).find((e) => (e.roles ?? []).includes("registrar")));
      raw.norid = { domain: reg, created, changed, dnssec, registrar, status: j.status ?? null };

      checks.push(check("trust_privacy", "norid_registered", "Domenet registrert (Norid)",
        created ? "PASS" : "UNKNOWN",
        created ? `registrert ${created}` : "registreringsdato ikke funnet i RDAP", "high", "norid"));
      if (changed) {
        checks.push(check("reliability", "norid_changed", "Sist endret (Norid)", "PASS", `sist endret ${changed}`, "high", "norid"));
      }
      checks.push(check("security", "norid_dnssec", "DNSSEC (Norid)",
        dnssec === true ? "PASS" : (dnssec === false ? "FAIL" : "UNKNOWN"),
        dnssec === true ? "DNSSEC aktivert (delegationSigned=true)" :
        dnssec === false ? "DNSSEC ikke aktivert (delegationSigned=false)" : "DNSSEC-status ukjent",
        "high", "norid"));
      checks.push(check("trust_privacy", "norid_registrar", "Registrar (Norid)",
        registrar ? "PASS" : "UNKNOWN",
        registrar ? `registrar: ${registrar}` : "registrar ikke funnet i RDAP", "high", "norid"));
    } else {
      raw.norid = { domain: reg, error: rdap.error ?? `HTTP ${rdap.status}` };
      checks.push(check("trust_privacy", "norid_registered", "Domenet registrert (Norid)", "NOT_APPLICABLE",
        `ikke funnet i Norid RDAP (${rdap.error ?? "HTTP " + rdap.status})`, "medium", "norid"));
    }
  } else {
    raw.norid = { domain: reg, authoritative: false };
    checks.push(check("trust_privacy", "norid_registered", "Domenet registrert (Norid)", "NOT_APPLICABLE",
      "utenlandsk domene — Norid ikke autoritativ", "high", "norid"));
  }

  // ── 6. Finanstilsynet Virksomhetsregister (lisenshavere under tilsyn) ──
  if (unit?.organisasjonsnummer) {
    const fsRes = await httpJson(`${FINANSTILSYNET_BASE}/legal-entities/filter?query=${encodeURIComponent(unit.organisasjonsnummer)}&pageSize=5`, { timeout: 15000 });
    if (fsRes.ok && fsRes.json) {
      const hits = fsRes.json.legalEntities ?? [];
      if (hits.length > 0) {
        const f = hits[0];
        const licences = f.licences ?? [];
        const licenceTypes = licences.map(l => l.licenceType?.name?.nb ?? l.licenceType?.code ?? l.licenceType?.name?.english).filter(Boolean);
        raw.finanstilsynet = { legalEntityId: f.legalEntityId, finanstilsynetId: f.finanstilsynetId, name: f.name, organisationNumber: f.organisationNumber, licences: licenceTypes };
        checks.push(check("trust_privacy", "finanstilsynet_licence", "Finanstilsynet-lisens", "PASS",
          `${f.name} — ${licenceTypes.join(", ") || "ukjent type"}`, "high", "finanstilsynet"));
        checks.push(check("security", "finanstilsynet_supervision", "Under Finanstilsynet tilsyn", "PASS",
          `ja — ${licenceTypes.length} lisens(er)`, "high", "finanstilsynet"));
      } else {
        raw.finanstilsynet = { organisationNumber: unit.organisasjonsnummer, found: false };
        checks.push(check("trust_privacy", "finanstilsynet_licence", "Finanstilsynet-lisens", "NOT_APPLICABLE",
          "ikke funnet i Finanstilsynet virksomhetsregister", "medium", "finanstilsynet"));
      }
    } else {
      raw.finanstilsynet = { organisationNumber: unit.organisasjonsnummer, error: fsRes.error ?? `HTTP ${fsRes.status}` };
      checks.push(check("trust_privacy", "finanstilsynet_licence", "Finanstilsynet-lisens", "UNKNOWN",
        `klarte ikke hente (HTTP ${fsRes.status})`, "medium", "finanstilsynet"));
    }
  }

  // ── 7. Oppgaveregisteret (revisjonsplikt, skjema, rapporteringsplikter per orgform/næring) ──
  if (unit?.organisasjonsnummer) {
    const orgForm = unit.organisasjonsform?.kode;
    const naering = unit.naeringskode1?.kode?.split(".")[0];
    const params = new URLSearchParams();
    if (orgForm) params.append("organisasjonsformer", orgForm);
    if (naering) params.append("naeringskoder", naering);
    const ogRes = await httpJson(`${OPPGAVEREGISTERET_BASE}/skjema?${params.toString()}&size=50`, { timeout: 15000 });
    if (ogRes.ok && ogRes.json?.skjema) {
      const forms = ogRes.json.skjema.filter(s =>
        s.formaal?.kategorier?.some(k => k.kode === "KONTROLL_TILSYN") &&
        s.maalgruppe?.naeringsgrupper?.some(g =>
          (!g.organisasjonsformer?.length || g.organisasjonsformer.some(o => o.verdi === orgForm)) &&
          (!g.naeringskoder?.length || g.naeringskoder.some(n => n.verdi === naering))
        )
      );
      if (forms.length > 0) {
        raw.oppgaveregisteret = { organisasjonsform: orgForm, naering, forms: forms.map(f => ({
          navn: f.navn, nummer: f.nummer, formål: f.formål?.fritekst,
          lovhjemler: f.lovhjemler?.map(l => `${l.tittel} ${l.henvisning || ""}`.trim())
        })) };
        checks.push(check("trust_privacy", "oppgaveregisteret_forms", "Oppgavepliktige skjema (revisjon/rapportering)", "PASS",
          `${forms.length} skjema matcher orgform ${orgForm} + næring ${naering} (f.eks. ${forms[0].navn})`, "high", "brreg"));
      } else {
        checks.push(check("trust_privacy", "oppgaveregisteret_forms", "Oppgavepliktige skjema", "NOT_APPLICABLE",
          `ingen skjema for orgform ${orgForm} + næring ${naering}`, "medium", "brreg"));
      }
    } else {
      checks.push(check("trust_privacy", "oppgaveregisteret_forms", "Oppgavepliktige skjema", "UNKNOWN",
        `klarte ikke hente (HTTP ${ogRes.status})`, "medium", "brreg"));
    }
  }

  return { section: "norge", title: "Norge-data (Brreg · Norid · SSB · Finanstilsynet · Oppgaveregisteret)", checks, raw };
}

// ── Direkte kjøring: node norge.mjs <navn> <domene> ──
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
const isDirect = process.argv[1] && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1]);
if (isDirect) {
  const [, , navn, domene] = process.argv;
  if (!navn || !domene) {
    console.error("Bruk: node norge.mjs <navn> <domene>");
    process.exit(2);
  }
  const result = await collectNorge({ domain: domene, nameCandidates: [navn] });
  console.log(JSON.stringify(result, null, 2));
}
