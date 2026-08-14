// AI-synlighet-modul — Arch Website Audit v2 (Peec.ai-modellen).
//
// Hva den måler (inspirert av Peec.ai sine AI-search-metrikker):
//   Visibility  — blir merkevaren/domene nevnt i AI-svar på kunderelevante spørsmål?
//   Position    — hvor i svaret dukker merkevaren opp (topp-2 = sterkt)?
//   Sentiment   — er omtalen positiv, nøytral eller negativ?
//   Sources     — hvilke eksterne kilder siterer AI-en (og dermed styrer synligheten)?
//
// Metode (reproduserbar, «alltid fakta»):
//   1. Én LLM-verdi fra sidetekst/tittel → 3 realistiske kundeprompter (som om en kunde
//      spør en AI-assistent: «anbefal…», «hvilket verktøy…», «er X verdt det?»).
//   2. Tre «AI-søk» mot samme modell (temperature 0.7) — svar lagres RÅ i evidence.
//   3. Determinisme: nevning = tekstmatch mot merkevare/domene; posisjon = nummerert liste;
//      kilder = domene-ekstraksjon. Sentiment + råd = én LLM-vurdering av de tre svarene.
//   4. Ingen API-nøkkel / feil → UNKNOWN (aldri fabrikert analyse).
//
// Kostnad: ~5 små DeepSeek-kall (ørebeløp), én seksjon per audit.

const NOW = () => new Date().toISOString();

const check = (id, label, result, evidence, confidence = "medium", source = "llm_visibility") => ({
  id, label, dimension: "ai_visibility", result, evidence, confidence, source, observed_at: NOW(),
});

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function extractDomains(text) {
  const seen = new Set();
  for (const m of text.matchAll(/(?:https?:\/\/)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)(?:\/|[\s.,;:)\]"])/gi)) {
    const d = m[1].toLowerCase().replace(/^www\./, "");
    if (/\.(no|com|org|net|io|ai|eu|se|dk|de|uk|co)$/.test(d)) seen.add(d);
  }
  return [...seen].slice(0, 12);
}

async function llm(apiKey, model, system, user, temperature, maxTokens, timeoutMs = 60000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      signal: ctrl.signal,
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        temperature,
        max_tokens: maxTokens,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text().catch(() => "")).slice(0, 120)}`);
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "";
  } finally {
    clearTimeout(t);
  }
}

function parseJsonLoose(content) {
  const cleaned = String(content ?? "").replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  try {
    return JSON.parse(cleaned.slice(cleaned.indexOf("["), cleaned.lastIndexOf("]") + 1));
  } catch { /* prøv objekt */ }
  try {
    return JSON.parse(cleaned.slice(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));
  } catch {
    return null;
  }
}

export async function collectAiVisibility(targetUrl, opts = {}) {
  const section = "ai_visibility";
  const title = "AI-synlighet (GEO — hvordan AI-assistenter omtaler dere)";
  const checks = [];
  const raw = { available: false, error: null, model: null, brand_candidates: [], prompts: [], answers: [], analysis: null };

  const apiKey = opts.apiKey || process.env.DEEPSEEK_API_KEY || "";
  const model = opts.model || process.env.ARCH_AI_MODEL || "deepseek-chat";
  raw.model = model;

  if (!apiKey) {
    checks.push(check("ai_vis_visibility", "Synlighet i AI-svar", "UNKNOWN", "DEEPSEEK_API_KEY ikke konfigurert — modulen er klar, måling hoppes over"));
    raw.error = "ingen API-nøkkel";
    return { section, title, checks, raw };
  }

  // ── 1. Innhold: hjemmeside-HTML → tekst/tittel/meta ──
  let html = opts.html ?? "";
  if (!html) {
    try {
      const res = await fetch(targetUrl, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" }, signal: AbortSignal.timeout(15000) });
      if (res.ok) html = await res.text();
    } catch { /* best-effort */ }
  }
  if (!html) {
    checks.push(check("ai_vis_visibility", "Synlighet i AI-svar", "UNKNOWN", "kunne ikke hente hjemmeside-HTML"));
    return { section, title, checks, raw };
  }

  const titleText = html.match(/<title[^>]*>([^<]{2,160})<\/title>/i)?.[1]?.trim() ?? null;
  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{2,300})["']/i)?.[1]?.trim() ?? null;
  const ogName = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']{2,120})["']/i)?.[1]?.trim() ?? null;
  const text = stripHtml(html).slice(0, 5000);

  // Merkevare-kandidater: registrerbart domene + og:site_name + tittel-prefiks
  const regDomain = opts.registrableDomain || new URL(targetUrl).hostname.replace(/^www\./, "").split(".").slice(-2).join(".");
  const brandCandidates = [];
  for (const c of [ogName, titleText?.split(/[|·•–—–-]/)[0]?.trim(), regDomain]) {
    if (c && c.length >= 3 && !brandCandidates.includes(c)) brandCandidates.push(c);
  }
  raw.brand_candidates = brandCandidates;
  const brandMatch = (answer) =>
    brandCandidates.some((b) => String(answer ?? "").toLowerCase().includes(b.toLowerCase().replace(/\./g, ".")));

  // ── 2. Generer 3 kundeprompter (LLM) ──
  const genPrompt = [
    "Du lager kunde-promptene for en AI-synlighetsmåling (GEO). Du får innhold fra én bedrifts hjemmeside.",
    `URL: ${targetUrl}`,
    `Tittel: ${titleText ?? "ukjent"}`,
    `Meta: ${metaDesc ?? "mangler"}`,
    `Sidetekst:\n${text.slice(0, 2500)}`,
    "",
    "Lag 3 ulike spørsmål en potensiell kunde kan stille en AI-assistent (ChatGPT/Gemini/DeepSeek) der denne bedriften BØR kunne bli anbefalt. Eksempler: «Hvilket verktøy anbefaler du for …?», «Hva er det beste alternativet for …?», «Er … verdt det i 2026?»",
    'Svar KUN med JSON-array av strenger: ["prompt 1", "prompt 2", "prompt 3"]',
  ].join("\n");

  let prompts = [];
  try {
    const genOut = await llm(apiKey, model, "Du svarer med gyldig JSON.", genPrompt, 0.3, 400);
    const parsed = parseJsonLoose(genOut);
    prompts = Array.isArray(parsed) ? parsed.slice(0, 3).filter((p) => typeof p === "string" && p.length > 8) : [];
  } catch (e) {
    raw.error = `prompt-generering feilet: ${String(e.message ?? e).split("\n")[0]}`;
  }
  if (!prompts.length) {
    // Fallback: generiske prompter fra tittel/domene — aldri la modulen dø stille.
    const topic = (titleText ?? regDomain).split(/[|·•–—–-]/)[0]?.trim().slice(0, 60) || regDomain;
    prompts = [
      `Hvilket verktøy eller tjeneste anbefaler du for ${topic}?`,
      `Hva er de beste alternativene innen ${topic} i 2026?`,
      `Er ${topic} verdt å bruke, og hvorfor?`,
    ];
  }
  raw.prompts = prompts;

  // ── 3. Tre «AI-søk» ──
  const system = "Du er en hjelpsom AI-assistent en kunde spør. Svar grundig, ærlig og nyansert — anbefal gjerne konkrete tjenester/verktøy, med kort begrunnelse. Svar på norsk.";
  for (const p of prompts) {
    try {
      const answer = await llm(apiKey, model, system, p, 0.7, 700);
      raw.answers.push({ prompt: p, answer });
    } catch (e) {
      raw.answers.push({ prompt: p, answer: null, error: String(e.message ?? e).split("\n")[0] });
    }
  }

  const usable = raw.answers.filter((a) => a.answer);
  if (!usable.length) {
    checks.push(check("ai_vis_visibility", "Synlighet i AI-svar", "UNKNOWN", `AI-søk feilet: ${raw.error ?? "ingen svar"}`));
    return { section, title, checks, raw };
  }

  // ── 4. Deterministiske målinger per svar ──
  const measurements = usable.map(({ prompt, answer }) => {
    const mentioned = brandMatch(answer);
    // Posisjon: laveste tall i nummerert liste der merkevaren nevnes
    let position = null;
    if (mentioned) {
      for (const line of answer.split("\n")) {
        const m = line.match(/^\s*(\d{1,2})[.)]\s+/);
        if (m && line.toLowerCase().includes(brandCandidates[0]?.toLowerCase() ?? "__none__")) {
          position = Math.min(position ?? 99, parseInt(m[1], 10));
        }
      }
    }
    return { prompt, mentioned, position, cited_domains: extractDomains(answer) };
  });
  raw.measurements = measurements;

  const mentions = measurements.filter((m) => m.mentioned).length;
  const bestPos = Math.min(...measurements.map((m) => m.position ?? 99));
  const allDomains = [...new Set(measurements.flatMap((m) => m.cited_domains))];

  // ── 5. Sentiment + råd (LLM på de tre Q&A-parene) ──
  let sentiment = null;
  try {
    const qa = usable.map(({ prompt, answer }) => `SPØRSMÅL: ${prompt}\nSVAR: ${answer.slice(0, 1200)}`).join("\n\n---\n\n");
    const analPrompt = [
      `En bedrift med merkenavn(ene) ${brandCandidates.join(" / ")} (domene ${regDomain}) ble sjekket i AI-søk. Under er 3 spørsmål og AI-svarene:`,
      qa,
      "",
      'Vurder omtalen av bedriften. Svar KUN med JSON: {"sentiment":"positiv|nøytral|negativ|blandet","quote":"kort sitat","advice_nb":"én konkret setning om hva bedriften bør gjøre for bedre AI-synlighet"}',
      "Hvis bedriften ikke nevnes i et svar: se bort fra det svaret. Sentiment gjelder KUN omtaler som faktisk finnes.",
    ].join("\n");
    const out = await llm(apiKey, model, "Du svarer med gyldig JSON.", analPrompt, 0.1, 400);
    const parsed = parseJsonLoose(out);
    if (parsed && typeof parsed === "object" && parsed.sentiment) sentiment = parsed;
  } catch { /* sentiment forblir null — sjekkene nedenfor forholder seg til deterministiske data */ }
  raw.analysis = sentiment;

  // ── 6. Sjekker ──
  const mentionEvidence = `${mentions}/${measurements.length} svar nevner ${brandCandidates[0] ?? "merkevaren"}` +
    (sentiment?.quote ? ` · sitat: «${sentiment.quote.slice(0, 140)}»` : "") +
    ` · prompter: ${raw.prompts.slice(0, 2).map((p) => `«${p.slice(0, 50)}…»`).join(" / ")}`;

  checks.push(check("ai_vis_visibility", "Synlighet i AI-svar",
    mentions > 0 ? "PASS" : "FAIL",
    mentionEvidence));

  checks.push(check("ai_vis_position", "Posisjon i AI-svar",
    bestPos <= 2 ? "PASS" : "FAIL",
    mentions > 0
      ? `beste posisjon: ${bestPos === 99 ? "nevnt i løpende tekst (ikke topp-liste)" : `#${bestPos}`} av ${measurements.length} svar`
      : "ikke nevnt i noen av svarene"));

  checks.push(check("ai_vis_sentiment", "Sentiment i AI-omtale",
    sentiment?.sentiment === "negativ" ? "FAIL" : "PASS",
    sentiment ? `sentiment: ${sentiment.sentiment}${sentiment.advice_nb ? ` · råd: ${sentiment.advice_nb.slice(0, 140)}` : ""}` : "ingen omtale å vurdere (eller sentiment ikke vurdert)"));

  checks.push(check("ai_vis_sources", "Kilder AI-en siterer",
    allDomains.length ? "PASS" : "UNKNOWN",
    allDomains.length ? `eksterne domener i AI-svar: ${allDomains.join(", ")}` : "ingen eksterne domener sitert"));

  raw.available = true;
  return { section, title, checks, raw };
}

// Direkte kjøring: node packages/audit/lib/web/ai-visibility.mjs https://klarpakke.no
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const url = process.argv[2];
  if (!url) { console.error("Bruk: node ai-visibility.mjs <url>"); process.exit(2); }
  collectAiVisibility(url).then((r) => console.log(JSON.stringify(r, null, 2)));
}
