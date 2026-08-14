#!/usr/bin/env node
// Arch Kostnadskontroll — Cloudflare-ingest (fase 1)
// Henter Billable Usage API for hver konto og lagrer aggregerte kostnader som JSON.
// ARC-9 · docs/cost-control-plan.md
//
// Bruk:  node scripts/cost-ingest-cloudflare.mjs
// Tokens (aldri i repo): CF_TOKEN_<KONTONAVN> env-var, eller CLOUDFLARE_API_TOKEN for "KLARPAKKE".
//
// Output: data/cost/cloudflare-<konto>-<YYYY-MM-DD>.json  (en fil per konto per dag)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..");
const OUT_DIR = join(REPO, "data", "cost");

// Kontoer. Legg til nye her; token hentes fra CF_TOKEN_<name> (eller fallback under).
const ACCOUNTS = [
  { id: "80d5b1d56a3e907150ba7348b6182894", name: "KLARPAKKE" },
  // Autoglass B2B (2266e975) — token finnes kun som GitHub-secret; legg inn når tilgjengelig:
  // { id: "<full-id>", name: "AUTOGLASS-B2B" },
];

function tokenFor(name) {
  if (name === "KLARPAKKE") {
    // Fallback: lokal CLOUDFLARE_API_TOKEN i klarpakke/.env.local
    if (process.env.CF_TOKEN_KLARPAKKE) return process.env.CF_TOKEN_KLARPAKKE;
    const envPath = join(REPO, "..", "klarpakke", ".env.local");
    if (existsSync(envPath)) {
      const m = readFileSync(envPath, "utf8").match(/^CLOUDFLARE_API_TOKEN=(.+)$/m);
      if (m) return m[1].trim().replace(/^"|"$/g, "");
    }
  }
  return process.env[`CF_TOKEN_${name.replace(/[^A-Z0-9]/g, "_")}`];
}

async function fetchBillable(account) {
  const token = tokenFor(account.name);
  if (!token) return { account, error: "ingen token (sett CF_TOKEN_<name>)" };
  const url = `https://api.cloudflare.com/client/v4/accounts/${account.id}/billable-usage`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const body = await res.json();
  if (!body.success) {
    return { account, error: (body.errors || []).map((e) => e.message).join("; ") };
  }
  return { account, rows: body.result };
}

function aggregate(rows) {
  // Summerer BilledCost per ServiceFamilyName for nåværende faktureringsperiode.
  const byService = {};
  let total = 0;
  let currency = "USD";
  for (const r of rows || []) {
    const svc = r.ServiceFamilyName || r.ServiceName || "ukjent";
    const cost = Number(r.BilledCost ?? 0);
    byService[svc] = (byService[svc] || 0) + cost;
    total += cost;
    if (r.BillingCurrency) currency = r.BillingCurrency;
  }
  return { byService, total: round2(total), currency };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const day = new Date().toISOString().slice(0, 10);
  const all = [];
  for (const account of ACCOUNTS) {
    const { account: a, rows, error } = await fetchBillable(account);
    if (error) {
      console.error(`✗ ${a.name}: ${error}`);
      all.push({ account: a.name, error, fetched_at: new Date().toISOString() });
      continue;
    }
    const agg = aggregate(rows);
    const out = {
      account_id: a.id,
      account_name: a.name,
      fetched_at: new Date().toISOString(),
      billing_period_start: rows?.[0]?.BillingPeriodStart ?? null,
      currency: agg.currency,
      total_cost: agg.total,
      by_service: agg.byService,
    };
    const file = join(OUT_DIR, `cloudflare-${a.name.toLowerCase()}-${day}.json`);
    writeFileSync(file, JSON.stringify(out, null, 2));
    console.log(`✓ ${a.name}: total ${agg.total} ${agg.currency} → ${file}`);
    all.push(out);
  }
  writeFileSync(join(OUT_DIR, `cloudflare-all-${day}.json`), JSON.stringify(all, null, 2));
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
