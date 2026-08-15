#!/usr/bin/env node
// audit-publish.mjs — genererer standalone HTML-auditside fra v2-rapport (MD + evidence).
// Bruk: node packages/audit/scripts/audit-publish.mjs <prospect-dir> <stub>
// Eks:  node packages/audit/scripts/audit-publish.mjs klarpakke.no klarpakke-no
// Skriver: apps/customer-portal/audits/<stub>.html
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../..", import.meta.url).pathname; // arch-platform/
const args = process.argv.slice(2);
const [dir, stub] = args;
if (!dir || !stub) { console.error("Bruk: audit-publish.mjs <prospect-dir> <stub>"); process.exit(1); }

const base = join(ROOT, "docs/audits/prospects", dir);
const mdFile = join(base, `website-audit-v2-${dir}.md`);
const evFile = join(base, `website-audit-v2-${dir}.evidence.json`);
if (!existsSync(mdFile)) { console.error("Mangler MD:", mdFile); process.exit(1); }
if (!existsSync(evFile)) { console.error("Mangler evidence:", evFile); process.exit(1); }

const md = readFileSync(mdFile, "utf8");
const ev = JSON.parse(readFileSync(evFile, "utf8"));
const score = ev.score || {};
const cats = score.categories || {};
const findings = (ev.findings || []).slice().sort((a, b) => (b.priority || 0) - (a.priority || 0));
const dateStr = new Date((score.observed_at || Date.now())).toLocaleDateString("nb-NO", { year: "numeric", month: "long", day: "numeric" });

const SEV = { critical: ["KRITISK", "t-bad"], high: ["HØY", "t-bad"], medium: ["MEDIUM", "t-warn"], low: ["LAV", "t-ok"] };

// ── mini markdown → html (h3, tabeller, lister, bold, kode, sitat) ──
function inline(s) {
  return s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\*([^*]+)\*/g, "<i>$1</i>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
function mdBlock(text) {
  const lines = text.trim().split("\n");
  let html = "", i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\|/.test(line)) {
      let rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const parse = (r) => r.split("|").slice(1, -1).map((c) => c.trim());
      const head = parse(rows[0]);
      const body = rows.filter((r) => !/^[\s|:-]+$/.test(r.replace(/\|/g, ""))).slice(1);
      html += `<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${
        body.map((r) => `<tr>${parse(r).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")
      }</tbody></table>`;
    } else if (/^### /.test(line)) {
      html += `<h3>${inline(line.slice(4))}</h3>`; i++;
    } else if (/^## /.test(line)) {
      html += `<h2>${inline(line.slice(3))}</h2>`; i++;
    } else if (/^[-*] /.test(line)) {
      let items = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) { items.push(inline(lines[i].replace(/^[-*] /, ""))); i++; }
      html += `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
    } else if (/^\d+\. /.test(line)) {
      let items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(inline(lines[i].replace(/^\d+\. /, ""))); i++; }
      html += `<ol>${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
    } else if (/^>/.test(line)) {
      let q = [];
      while (i < lines.length && /^>/.test(lines[i])) { q.push(inline(lines[i].replace(/^>\s?/, ""))); i++; }
      html += `<blockquote>${q.join("<br>")}</blockquote>`;
    } else if (/^---+\s*$/.test(line)) {
      html += "<hr>"; i++;
    } else if (line.trim() === "") {
      i++;
    } else {
      let p = [line]; i++;
      while (i < lines.length && lines[i].trim() !== "" && !/^(#|\||[-*] |\d+\. |>|---)/.test(lines[i])) { p.push(lines[i]); i++; }
      html += `<p>${inline(p.join(" "))}</p>`;
    }
  }
  return html;
}

// ── v2-seksjoner: alt under «## Arch Audit v2» delt på «###» ──
const v2Start = md.indexOf("## Arch Audit v2");
let v2Html = "";
if (v2Start >= 0) {
  const v2 = md.slice(v2Start).split(/^### /m).filter((s) => s.trim());
  v2Html = v2.map((sec) => {
    const [title, ...rest] = sec.split("\n");
    return `<div class="card"><h2>${inline(title.trim())}</h2>${mdBlock(rest.join("\n"))}</div>`;
  }).join("\n");
}

const sevCount = {};
for (const f of findings) sevCount[f.severity] = (sevCount[f.severity] || 0) + 1;

const dimHtml = Object.entries(cats).map(([k, v]) => {
  const pct = Math.round((v.pct || 0) * 100) / 100;
  const color = pct >= 80 ? "var(--ok)" : pct >= 50 ? "var(--warn)" : "var(--bad)";
  const tag = pct >= 80 ? "t-ok" : pct >= 50 ? "t-warn" : "t-bad";
  return `<div class="dim"><b>${inline(v.label || k)} <span class="tag ${tag}">${pct} %</span></b><div class="bar"><i style="width:${pct}%;background:${color}"></i></div></div>`;
}).join("\n");

const findHtml = findings.map((f) => {
  const [label, cls] = SEV[f.severity] || [f.severity || "FUNN", "t-warn"];
  return `<p><span class="tag ${cls}">${label}</span> <b>${inline(f.title)}</b><br><span class="mut">${inline(f.evidence || "")}</span></p>`;
}).join("\n") || "<p class=\"mut\">Ingen funn.</p>";

const html = `<!DOCTYPE html>
<html lang="no">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Arch Website Audit — ${dir}</title>
<style>
  :root { --bg:#0f1220; --panel:#171b2e; --ink:#e8eaf2; --mut:#9aa3b8; --acc:#4f8cff; --ok:#3ddc84; --warn:#ffb454; --bad:#ff6b6b; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--bg); color:var(--ink); font-family:-apple-system,"Segoe UI",Roboto,sans-serif; line-height:1.6; padding:24px; }
  .wrap { max-width:860px; margin:0 auto; }
  .card { background:var(--panel); border-radius:14px; padding:24px; margin-bottom:18px; }
  h1 { font-size:1.5rem; margin-bottom:6px; }
  h2 { font-size:1.1rem; margin:0 0 10px; color:var(--acc); }
  h3 { font-size:1rem; margin:14px 0 8px; color:var(--ink); }
  .score { font-size:3rem; font-weight:800; color:var(--warn); }
  .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; }
  .dim { background:#1d2238; border-radius:10px; padding:12px; }
  .dim b { display:block; }
  .bar { height:8px; background:#2a3050; border-radius:6px; margin-top:8px; overflow:hidden; }
  .bar i { display:block; height:100%; border-radius:6px; }
  table { width:100%; border-collapse:collapse; margin:10px 0; }
  th,td { text-align:left; padding:8px 10px; border-bottom:1px solid #2a3050; font-size:.92rem; }
  th { color:var(--mut); font-weight:600; }
  .tag { display:inline-block; padding:2px 10px; border-radius:20px; font-size:.78rem; font-weight:700; }
  .t-ok { background:rgba(61,220,132,.15); color:var(--ok); }
  .t-warn { background:rgba(255,180,84,.15); color:var(--warn); }
  .t-bad { background:rgba(255,107,107,.15); color:var(--bad); }
  .mut { color:var(--mut); font-size:.88rem; }
  ul,ol { padding-left:20px; margin:8px 0; }
  code { background:#232a45; padding:1px 6px; border-radius:5px; font-size:.85em; }
  blockquote { border-left:3px solid var(--acc); padding-left:12px; margin:10px 0; color:var(--mut); }
  a { color:var(--acc); }
  .foot { color:var(--mut); font-size:.8rem; margin-top:20px; }
</style>
</head>
<body>
<div class="wrap">

  <div class="card">
    <h1>Arch Website Audit</h1>
    <p class="mut">${dir} · utført ${dateStr} · passiv, utenfor-inn · ingen endringer gjort</p>
    <p style="margin-top:14px">Total score</p>
    <div class="score">${score.total ?? "—"} %</div>
    <p class="mut">${sevCount.critical || 0} kritiske funn · ${sevCount.high || 0} høye · ${sevCount.medium || 0} medium · ${sevCount.low || 0} lave</p>
  </div>

  <div class="card">
    <h2>Dimensjoner</h2>
    <div class="grid">${dimHtml}</div>
  </div>

  <div class="card">
    <h2>Funn (prioritert)</h2>
    ${findHtml}
  </div>

${v2Html}

  <div class="card">
    <h2>Hva Arch kan gjøre for deg</h2>
    <p>Arch leverer Build-fix (rettelser), Compliance (Norge-spesifikke krav) og Managed (løpende overvåking og drift) basert på funnene over.</p>
  </div>

  <p class="foot">Generert av Arch Platform · website-audit v2 · ${new Date().toISOString().slice(0, 10)}</p>
</div>
</body>
</html>`;

const out = join(ROOT, "apps/customer-portal/audits", `${stub}.html`);
writeFileSync(out, html);
console.log("Skrevet:", out, `(${html.length} bytes)`);
