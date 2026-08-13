// Arch Build Proposal — auto-draft (F4.1).
//
// Genererer et UTKAST til Arch Build Proposal fra audit-funn flagget
// `build_candidate: true`. Dette er en malbasert oppsummering av scope + verdi +
// innsats — IKKE et bindende tilbud. Endelig pris/scope fastsettes i en godkjent
// Architecture Proposal (menneskelig gate).
//
// Ingen kunde-kode implementeres under audit-fasen. Dette dokumentet er kun et
// forslag som sendes til kunden for gjennomgang.

import { EFFORT } from "./commercial.mjs";

const effortRank = (e) => ({ S: 0, M: 1, L: 2, XL: 3 }[e] ?? 9);

export function renderBuildProposal(audit, actions) {
  const candidates = actions.filter((a) => a.build_candidate);
  const m = audit.meta;
  const L = [];
  L.push(`## Arch Build Proposal — utkast\n`);
  L.push(`> **Status:** automatisk utkast fra audit-funn — **ikke bindende**, krever kundegodkjenning.`);
  L.push(`> Arch implementerer **ingen** endringer i kundens system under audit-fasen.\n`);

  if (!candidates.length) {
    L.push(`Ingen automatiserbare/utviklingsbare funn flagget — ingen Build-kandidater identifisert.\n`);
    return L.join("\n");
  }

  const sorted = [...candidates].sort((a, b) => effortRank(a.effort) - effortRank(b.effort));
  const effortTotal = sorted.reduce((s, a) => s + ({ S: 0.5, M: 2, L: 8, XL: 20 }[a.effort] ?? 8), 0);

  L.push(`### Foreslått scope\n`);
  L.push(`Følgende tiltak er identifisert som Arch Build-kandidater (fra godkjent audit):\n`);
  L.push(`| # | Tiltak | Innsats |`);
  L.push(`|---|---|---|`);
  sorted.forEach((a, i) => {
    L.push(`| ${i + 1} | ${String(a.title ?? a.problem ?? "").replace(/\|/g, "\\|")} | ${EFFORT[a.effort] ?? a.effort} |`);
  });
  L.push(`\n**Samlet innsats-estimat:** ~${Math.max(0.5, Math.round(effortTotal * 2) / 2)} dager (vurdering, ikke løfte).\n`);

  L.push(`### Verdi for kunden\n`);
  L.push(`- Redusert risiko for nedetid, lekkasjer og feilleveranser.`);
  L.push(`- Færre manuelle steg — frigjør utviklertid.`);
  L.push(`- Forutsigbar kvalitetsport før hver deploy (test → smoke → rollback).\n`);

  L.push(`### Neste steg\n`);
  L.push(`1. Kundegjennomgang av dette utkastet.`);
  L.push(`2. Endelig Architecture Proposal med fastsatt scope, pris og akseptkriterier.`);
  L.push(`3. Godkjenning → Arch Build (separat fase, egen tilgang).\n`);
  L.push(`---\n`);
  return L.join("\n");
}
