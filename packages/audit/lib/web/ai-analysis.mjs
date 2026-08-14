// AI-analyse-modul — Arch Website Audit v2 (ARC-10, plan §1.7).
//
// DeepSeek (default: deepseek-chat; override med env ARCH_AI_MODEL) analyserer hjemmesidens
// tekst: tone, innholdskvalitet, aktualitet (gamle datoer, ©-år), UX-prosa, åpenbare feil.
//
// Regler (reproduserbarhet + «alltid fakta»):
//   - Prompt og rå-svar lagres i raw (evidence-JSON) — analysen kan etterprøves.
//   - LLM-en får KUN tekstekstrakt fra hjemmesiden — aldri person-data utover det som allerede
//     står offentlig på siden.
//   - Ingen nøkkel / API-feil → UNKNOWN (aldri fabrikert analyse).
//   - Utgift per kall er ørebeløp (Flash-prisklasse); én analyse per audit.

const NOW = () => new Date().toISOString();

const check = (id, label, result, evidence, confidence = "medium", source = "llm_analysis") => ({
  id, label, dimension: "ux_mobile", result, evidence, confidence, source, observed_at: NOW(),
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

function buildPrompt({ url, title, metaDescription, textSample, yearSignals }) {
  return [
    "Du er analyse-delen av Arch Audit (norsk verktøy). Analyser TEKSTEN på en norsk bedrifts hjemmeside. Vurder kun det som står i teksten under — ikke finn på noe.",
    `URL: ${url}`,
    `Tittel: ${title ?? "ukjent"}`,
    `Meta-beskrivelse: ${metaDescription ?? "mangler"}`,
    `Tekstutdrag (hjemmesiden):\n${textSample}`,
    yearSignals.length ? `Årstall/©-signaler funnet: ${yearSignals.join(", ")}` : "Ingen årstall-signaler funnet i teksten.",
    "",
    "Svar KUN med JSON (ingen markdown-kodeblokk):",
    '{"content_quality":"god|middels|svak","tone":"...","aktualitet":"frisk|middels|utdatert","signals":["..."],"summary_nb":"2-3 setninger på norsk, executive-språk, konkret"}',
    "Vurdering: aktualitet baseres på gamle datoer/©-år/nyhetsinnlegg i teksten; svak = stavefeil/ufullstendige setninger/meningsløs tekst; tone = hvem teksten henvender seg til og hvordan.",
  ].join("\n");
}

export async function collectAiAnalysis(targetUrl, opts = {}) {
  const section = "ai_analysis";
  const title = "AI-analyse av innhold (DeepSeek)";
  const checks = [];
  const raw = { available: false, error: null, prompt: null, response: null, model: null };

  const apiKey = opts.apiKey || process.env.DEEPSEEK_API_KEY || "";
  const model = opts.model || process.env.ARCH_AI_MODEL || "deepseek-chat";

  if (!apiKey) {
    checks.push(check("ai_content", "AI-innholdsanalyse", "UNKNOWN",
      "DEEPSEEK_API_KEY ikke konfigurert — modulen er klar, analyse hoppes over"));
    raw.error = "ingen API-nøkkel";
    return { section, title, checks, raw };
  }

  let html = opts.html ?? "";
  if (!html) {
    try {
      const res = await fetch(targetUrl, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" }, signal: AbortSignal.timeout(15000) });
      if (res.ok) html = await res.text();
    } catch { /* best-effort */ }
  }
  if (!html) {
    checks.push(check("ai_content", "AI-innholdsanalyse", "UNKNOWN", "kunne ikke hente hjemmeside-HTML", "medium"));
    return { section, title, checks, raw };
  }

  const titleText = html.match(/<title[^>]*>([^<]{2,160})<\/title>/i)?.[1]?.trim() ?? null;
  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{2,300})["']/i)?.[1]?.trim() ?? null;
  const text = stripHtml(html).slice(0, 6000);
  const years = [...html.matchAll(/(?:©|&copy;)\s*(19|20)\d{2}/gi)].map((m) => m[1] + m[2]);
  const staleDates = [...text.matchAll(/\b(19\d{2}|20(0\d|1\d))\b/g)].map((m) => m[1]).filter((y) => parseInt(y, 10) < new Date().getFullYear() - 1);
  const yearSignals = [...new Set([...years, ...staleDates])].slice(0, 5);

  const prompt = buildPrompt({ url: targetUrl, title: titleText, metaDescription: metaDesc, textSample: text, yearSignals });
  raw.prompt = prompt;
  raw.model = model;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 60000);
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      signal: ctrl.signal,
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Du er analyse-delen av Arch Audit. Du svarer alltid med gyldig JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 700,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      checks.push(check("ai_content", "AI-innholdsanalyse", "UNKNOWN", `DeepSeek API HTTP ${res.status}`, "medium"));
      raw.error = `HTTP ${res.status} ${body.slice(0, 120)}`;
      return { section, title, checks, raw };
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    raw.response = content;
    raw.available = true;

    let parsed = null;
    try {
      const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
      parsed = JSON.parse(cleaned.slice(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));
    } catch { /* ikke JSON — fallback til råtekst */ }

    const quality = parsed?.content_quality ?? null;
    const freshness = parsed?.aktualitet ?? null;
    const summary = parsed?.summary_nb ?? content.slice(0, 300);

    checks.push(check("ai_content_quality", "Innholdskvalitet (AI-vurdert)",
      quality === "god" ? "PASS" : quality === "svak" ? "FAIL" : "UNKNOWN",
      summary, quality === "svak" ? "medium" : "medium"));
    checks.push(check("ai_content_freshness", "Aktualitet (AI-vurdert)",
      freshness === "frisk" ? "PASS" : freshness === "utdatert" ? "FAIL" : "UNKNOWN",
      (parsed?.signals ?? []).join(" · ") || summary, "medium"));
  } catch (e) {
    checks.push(check("ai_content", "AI-innholdsanalyse", "UNKNOWN",
      `kall feilet: ${String(e.message || e).split("\n")[0]}`, "medium"));
    raw.error = String(e.message || e).split("\n")[0];
  } finally {
    clearTimeout(t);
  }

  return { section, title, checks, raw };
}

// Direkte kjøring: node packages/audit/lib/web/ai-analysis.mjs https://klarpakke.no
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const url = process.argv[2];
  if (!url) { console.error("Bruk: node ai-analysis.mjs <url>"); process.exit(2); }
  collectAiAnalysis(url).then((r) => {
    // Aldri skriv ut API-nøkkel; rå-svar beholdes i raw.
    console.log(JSON.stringify(r, null, 2));
  });
}
