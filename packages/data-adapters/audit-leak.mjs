#!/usr/bin/env node
/**
 * audit-leak.mjs — leakage-audit for produksjonsartefakter (F3.6 §7).
 * Skanner kunde-rettede artefakter for: lokale stier, secrets, tokens,
 * interne prosjekt-metadata. Feiler (exit 1) ved funn.
 *
 * Bruk: node packages/data-adapters/audit-leak.mjs
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");

const TARGETS = ["apps/customer-portal"]; // kun det som publiseres offentlig
const PATTERNS = [
  { re: /\/Users\/[a-zA-Z0-9_-]+/g, label: "lokal absolutt sti (/Users/...)" },
  { re: /\b[A-Za-z0-9]{32,}\b/g, label: "mulig token/hemmelighet (32+ tegn)" },
  { re: /(sk_live|pk_live|AKIA[0-9A-Z]{16}|ghp_|github_pat_|xoxb-|Bearer\s+[A-Za-z0-9._-]{20,})/g, label: "kjent secret-mønster" },
  { re: /LINEAR_API_KEY\s*[:=]/g, label: "API-nøkkel-variabel" },
  { re: /\.(env(\.local|\.production)?)\b/g, label: ".env-referanse" },
  { re: /dev_path|chain\.of\.thought|private repo intern|internal metadata|internal path|internal url/gi, label: "intern metadata" },
];

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
};
for (const t of TARGETS) if (existsSync(join(root, t))) walk(join(root, t));

let findings = 0;
for (const f of files) {
  const txt = readFileSync(f, "utf8");
  for (const p of PATTERNS) {
    const m = txt.match(p.re);
    if (m) {
      for (const hit of [...new Set(m)]) {
        console.log(`🔴 ${f}: ${p.label} → "${hit.slice(0, 60)}"`);
        findings++;
      }
    }
  }
}
console.log(findings === 0 ? "✅ Leakage-audit clean (0 funn) i public-artefakter." : `🔴 ${findings} funn — publiser IKKE.`);
process.exit(findings === 0 ? 0 : 1);
