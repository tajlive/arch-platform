// Executive scorecard — Arch Audit v1 (F4.1).
//
// Seks dimensjoner for daglig leder: Security, Governance, Engineering, Operations,
// Documentation, Automation Potential. Fem av dem kommer fra Health Score (evidensbasert);
// Automation Potential er en egen vurdering av uutnyttet automatiseringsverdi.
//
// Score er 0–100 eller N/A (kategori ikke vurderbar for dette prosjektet).
// Dette er en vurdering, ikke en sertifisering.

import { automationPotential } from "./commercial.mjs";

const ORDER = ["Security", "Governance", "Engineering", "Operations", "Documentation"];

function tone(pct) {
  if (pct === null) return "⚪";
  if (pct >= 80) return "🟢";
  if (pct >= 50) return "🟠";
  return "🔴";
}

function bar(pct) {
  if (pct === null) return "N/A";
  const filled = Math.round(pct / 10);
  return "█".repeat(filled) + "░".repeat(10 - filled) + ` ${pct}%`;
}

export function renderScorecard(audit) {
  const h = audit.health?.categories ?? {};
  const auto = automationPotential(audit);
  const L = [];
  L.push(`## Executive Scorecard\n`);
  L.push(`| Dimensjon | Score |`);
  L.push(`|---|---|`);
  for (const name of ORDER) {
    const c = h[name];
    const pct = c && c.denom > 0 ? c.pct : null;
    L.push(`| ${tone(pct)} ${name} | ${bar(pct)} |`);
  }
  // Automation Potential: høy = mye uutnyttet verdi (rom Arch kan automatisere)
  L.push(`| 🔵 Automation Potential | ${bar(auto)} |`);
  L.push(``);
  L.push(`> **Slik leser du dette:** høyere score = bedre i den dimensjonen.`);
  L.push(`> **Automation Potential** er motsatt: høy verdi = mye uutnyttet automatiseringsverdi`);
  L.push(`> som Arch kan levere. Score er en evidensbasert vurdering, **ikke** en sertifisering.\n`);
  return L.join("\n");
}
