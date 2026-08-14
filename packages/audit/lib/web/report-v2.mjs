// Rapport-rendering for Arch Website Audit v2 (ARC-10).
//
// Bygger på v1-rapportene og legger til v2-seksjonene:
//   «Hva en hacker ser» · E-post & DNS-sikkerhet · Norge-data · Historikk · Compliance-signaler.
//
// Regler (arver KLA-264 trust-claims-policy):
//   - Compliance-funn presenteres som signaler («potential concern»), aldri som dom.
//   - UNKNOWN vises som «ikke verifisert» — aldri som PASS eller FAIL.
//   - Ingen fabrikerte tall — kun verdier fra evidence.

const ICON = { PASS: "✅", FAIL: "❌", UNKNOWN: "⚠️", NOT_APPLICABLE: "➖" };
const LABEL = { PASS: "OK", FAIL: "Funn", UNKNOWN: "Ikke verifisert", NOT_APPLICABLE: "N/A" };

function sectionChecksTable(sec) {
  const lines = ["", `### ${sec.title}`, ""];
  lines.push("| Status | Sjekk | Observert |");
  lines.push("|---|---|---|");
  for (const ch of sec.checks ?? []) {
    const ev = String(ch.evidence ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
    lines.push(`| ${ICON[ch.result] ?? "⚠️"} ${LABEL[ch.result] ?? ch.result} | ${ch.label} | ${ev} |`);
  }
  return lines.join("\n");
}

// ── «Hva en hacker ser» (security_hacker) ──
function renderSecurity(sec) {
  const r = sec.raw ?? {};
  let out = sectionChecksTable(sec);
  if (r.grading) {
    const g = r.grading;
    out += `\n\n**Sikkerhetsheader-gradering: ${g.grade ?? "?"}** — ` +
      `${(g.missing ?? []).length ? `mangler: ${g.missing.join(", ")}` : "alle kritiske headere til stede"}.` +
      ` (securityheaders.com-modellen, deterministisk)` +
      `\n\nHvis graderingen er lavere enn A: hver manglende header er et konkret, billig tiltak.`;
  }
  if (r.cookies && Array.isArray(r.cookies) && r.cookies.length) {
    const weak = r.cookies.filter((c) => (c.missing ?? []).length);
    if (weak.length) {
      out += `\n\n**Cookies uten anbefalte attributter:** ` +
        weak.map((c) => `${c.name} (${(c.missing ?? []).join(", ")})`).join("; ") + `.`;
    }
  }
  if (r.tls && r.tls.not_before && r.tls.not_after) {
    out += `\n\n**TLS-sertifikat:** gyldig til ${r.tls.not_after} (issuer: ${r.tls.issuer ?? "ukjent"}).`;
  }
  return out;
}

// ── E-post & DNS (email_dns) ──
function renderDnsEmail(sec) {
  const r = sec.raw ?? {};
  let out = sectionChecksTable(sec);
  const rows = [];
  const t = (k, v) => v !== undefined && v !== null && v !== "" ? rows.push(`| ${k} | ${v} |`) : null;
  if (r.spf) t("SPF", typeof r.spf === "string" ? r.spf : (r.spf.record ?? r.spf.policy ?? JSON.stringify(r.spf)));
  if (r.dmarc) t("DMARC", typeof r.dmarc === "string" ? r.dmarc : (r.dmarc.policy ? `${r.dmarc.policy} (p=${r.dmarc.p})` : JSON.stringify(r.dmarc)));
  if (r.dkim) t("DKIM", typeof r.dkim === "string" ? r.dkim : JSON.stringify(r.dkim));
  if (r.mta_sts && typeof r.mta_sts === "object") {
    t("MTA-STS", `TXT: ${r.mta_sts.txt ? "ja" : "nei"} · policy-fil: ${r.mta_sts.policy ? "ja" : "nei"}`);
  }
  if (r.tls_rpt) t("TLS-RPT", typeof r.tls_rpt === "string" ? r.tls_rpt : JSON.stringify(r.tls_rpt));
  if (r.bimi) t("BIMI", typeof r.bimi === "string" ? r.bimi : JSON.stringify(r.bimi));
  if (r.caa && typeof r.caa === "object") {
    t("CAA", (r.caa.issuers ?? []).length ? r.caa.issuers.join(", ") : "ingen CAA");
  }
  if (r.dnssec !== undefined && r.dnssec !== null) {
    t("DNSSEC", typeof r.dnssec === "string"
      ? (/flags:\s*[^\n]*\bad\b/i.test(r.dnssec) ? "signert (AD-flag)" : "ikke signert")
      : String(r.dnssec));
  }
  if (r.dnsbl && typeof r.dnsbl === "object") {
    t("DNSBL", r.dnsbl.listed === true ? `LISTET (${r.dnsbl.mx ?? ""})` : r.dnsbl.listed === false ? `${r.dnsbl.mx ?? ""} ikke listet` : r.dnsbl.error ?? "ukjent");
  }
  if (r.subdomains) {
    const sd = r.subdomains;
    const n = Array.isArray(sd.unique) ? sd.unique.length : (typeof sd.count === "number" ? sd.count : "?");
    t("Subdomener (crt.sh)", `${n} observert${sd.interesting?.length ? ` — interessant: ${sd.interesting.join(", ")}` : ""}`);
  }
  if (rows.length) out += `\n\n| Protokoll | Observert |\n|---|---|\n${rows.join("\n")}`;
  out += `\n\n**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.`;
  return out;
}

// ── Norge-data (norge) ──
function renderNorge(sec) {
  const r = sec.raw ?? {};
  let out = sectionChecksTable(sec);
  const b = r.brreg?.unit ?? r.brreg ?? {};
  if (b.organisasjonsnummer) {
    out += `\n\n**Brreg-enhet:** ${b.navn ?? ""} — org.nr ${b.organisasjonsnummer}` +
      `${b.organisasjonsform?.beskrivelse ? ` · ${b.organisasjonsform.beskrivelse}` : ""}` +
      `${b.stiftelsesdato ? ` · stiftet ${b.stiftelsesdato}` : ""}` +
      `${b.naeringskode1?.beskrivelse ? ` · næring: ${b.naeringskode1.beskrivelse}` : ""}` +
      `${typeof b.antallAnsatte === "number" ? ` · ${b.antallAnsatte} ansatte` : ""}` +
      `.`;
  }
  if (r.norid && typeof r.norid === "object") {
    const n = r.norid;
    out += `\n\n**Norid (${n.domain ?? ""}):** ` +
      `${n.created ? `registrert ${n.created}` : ""}${n.changed ? ` · sist endret ${n.changed}` : ""}` +
      `${n.registrar ? ` · registrar: ${n.registrar}` : ""}` +
      `${n.dnssec !== undefined ? ` · DNSSEC: ${n.dnssec ? "ja" : "nei"}` : ""}` +
      `.`;
  }
  if (r.ssb?.evidence) out += `\n\n**Bransjekontekst (SSB):** ${r.ssb.evidence}.`;
  return out;
}

// ── Historikk (history) ──
function renderHistory(sec) {
  const r = sec.raw ?? {};
  let out = sectionChecksTable(sec);
  if (r.first_seen && r.last_seen) {
    out += `\n\n**Arkivomfang:** første arkiverte versjon ${r.first_seen}, siste ${r.last_seen}` +
      `${typeof r.snapshot_count === "number" ? ` (${r.snapshot_count} arkiverte versjoner)` : ""}.`;
  }
  return out;
}

// ── Compliance (compliance) ──
function renderCompliance(sec) {
  let out = sectionChecksTable(sec);
  out += `\n\n**Viktig:** Disse punktene er maskinlesbare SIGNALER, ikke en juridisk vurdering. ` +
    `«Funn» betyr at noe mangler eller er observert — om det faktisk utgjør et problem krever juridisk vurdering.`;
  return out;
}

// ── Fart (pagespeed) ──
function renderPageSpeed(sec) {
  let out = sectionChecksTable(sec);
  const summary = [];
  for (const strategy of ["mobile", "desktop"]) {
    const e = sec.raw?.[strategy];
    if (!e?.data) continue;
    const d = e.data;
    const pct = typeof d.lighthouseResult?.categories?.performance?.score === "number"
      ? Math.round(d.lighthouseResult.categories.performance.score * 100) : null;
    const crux = d.loadingExperience?.overall_category ?? null;
    if (pct !== null || crux) summary.push(`${strategy === "mobile" ? "Mobil" : "Desktop"}: lab ${pct ?? "?"}/100${crux ? ` · ekte brukerdata: ${crux}` : ""}`);
  }
  if (summary.length) out += `\n\n**Fartsprofil:** ${summary.join(" · ")}. (Lab = øyeblikksbilde; CrUX = ekte besøkendes opplevelse.)`;
  return out;
}

// ── Tilstedeværelse (presence) ──
function renderPresence(sec) {
  let out = sectionChecksTable(sec);
  const s = sec.raw?.social;
  if (s && Object.keys(s).length) {
    const parts = Object.entries(s).map(([k, v]) => `${k}: ${typeof v === "string" ? "lenket" : (v.status ?? "?")}`);
    out += `\n\n**Sosiale profiler (lenket fra nettsiden):** ${parts.join(" · ")}.`;
  }
  const c = sec.raw?.contact;
  if (c && (c.tel || c.email)) {
    out += `\n\n**Kontakt på nettsiden:** ${[c.tel ? `telefon ${c.tel}` : null, c.email ? `e-post ${c.email}` : null].filter(Boolean).join(" · ")}.`;
  }
  return out;
}

// ── AI-analyse (ai_analysis) ──
function renderAiAnalysis(sec) {
  let out = sectionChecksTable(sec);
  if (sec.raw?.available && sec.raw.response) {
    out += `\n\n**AI-vurdering (DeepSeek, ${sec.raw.model ?? "deepseek-chat"}):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.`;
  }
  return out;
}

// ── AI-synlighet (ai_visibility — Peec.ai-modellen) ──
function renderAiVisibility(sec) {
  let out = sectionChecksTable(sec);
  const r = sec.raw ?? {};
  if (r.available && r.prompts?.length) {
    out += `\n\n**Målemetode (Peec.ai-modellen):** ${r.prompts.length} kunderelevante spørsmål ble stilt til en AI-assistent (${r.model ?? "deepseek-chat"}). Spørsmålene er generert fra nettsidens eget innhold og ligger i evidence-filen.`;
    out += `\n\n**Stilte spørsmål:**\n` + r.prompts.map((p) => `- ${p}`).join("\n");
    if (r.measurements?.length) {
      out += `\n\n**Målinger per spørsmål:**\n`;
      for (const m of r.measurements) {
        const pos = m.mentioned ? (m.position ? `posisjon #${m.position}` : "nevnt i tekst") : "ikke nevnt";
        out += `- «${m.prompt.slice(0, 70)}${m.prompt.length > 70 ? "…" : ""}» → ${pos}${m.cited_domains?.length ? ` · kilder: ${m.cited_domains.join(", ")}` : ""}\n`;
      }
    }
    if (r.analysis?.advice_nb) {
      out += `\n\n**Anbefaling (AI-vurdert):** ${r.analysis.advice_nb}`;
    }
  }
  return out;
}

const RENDERERS = {
  security_hacker: renderSecurity,
  email_dns: renderDnsEmail,
  norge: renderNorge,
  history: renderHistory,
  compliance: renderCompliance,
  pagespeed: renderPageSpeed,
  presence: renderPresence,
  ai_analysis: renderAiAnalysis,
  ai_visibility: renderAiVisibility,
};

/** Kunderapport-seksjoner (norsk, ikke-teknisk). */
export function renderV2Sections(audit) {
  const sections = audit.v2?.sections ?? [];
  if (!sections.length) return "";
  const parts = ["\n---\n", "## Arch Audit v2 — utvidede undersøkelser", ""];
  for (const sec of sections) {
    const fn = RENDERERS[sec.section] ?? sectionChecksTable;
    try { parts.push(fn(sec)); } catch (e) { parts.push(sectionChecksTable(sec), `\n_(renderingsfeil: ${String(e.message ?? e).split("\n")[0]})_`); }
  }
  parts.push("", "---", "", "_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._");
  return parts.join("\n");
}

/** Teknisk visning: kompakt tabell av ALLE v2-sjekker + rådata-oversikt. */
export function renderV2Technical(audit) {
  const sections = audit.v2?.sections ?? [];
  if (!sections.length) return "";
  const lines = ["# V2-moduler — teknisk oversikt", ""];
  for (const sec of sections) {
    lines.push(`## ${sec.title} (${sec.section})`, "");
    for (const ch of sec.checks ?? []) {
      lines.push(`- [${ch.result}] ${ch.id}: ${ch.evidence}`);
    }
    const keys = Object.keys(sec.raw ?? {});
    if (keys.length) lines.push("", `Rådata-nøkler: ${keys.join(", ")}`, "");
  }
  lines.push(`# V2-kjøretid: ${audit.meta?.v2_modules_ms ?? "?"} ms (moduler parallelt)`);
  return lines.join("\n");
}
