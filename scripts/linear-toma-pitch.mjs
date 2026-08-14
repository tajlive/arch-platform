#!/usr/bin/env node
/** Pitch-pakke-kommentar på KLA-300. */
import { execFileSync } from 'node:child_process';
const KEY = execFileSync('bash', ['-c', "grep '^LINEAR_API_KEY=' /Users/taj/klarpakke/.env.local | head -1 | sed 's/^LINEAR_API_KEY=//' | tr -d \"'\\\"\""], { encoding: 'utf8' }).trim();
const q = (query, variables) => {
  const r = execFileSync('curl', ['-s', '-X', 'POST', 'https://api.linear.app/graphql', '-H', 'Content-Type: application/json', '-H', `Authorization: ${KEY}`, '-d', JSON.stringify({ query, variables })], { encoding: 'utf8' });
  const d = JSON.parse(r);
  if (d.errors) throw new Error(d.errors.map((e) => e.message).join('; '));
  return d.data;
};
const iss = q(`query($id: String!) { issue(id: $id) { id identifier } }`, { id: 'KLA-300' }).issue;
const body = `PITCH-PAKKE LAGET (2026-08-13) — gulrot-strategi (Tom-mandat: smakebit gratis, hemmeligheten bak betaling):

Filer i docs/audits/prospects/www.toma.no/pitch-pakke/:
1. toma-smakebit.html — 1-siders salgsgulrot: scorekort (toma.no 70, hvass.no 57) + 3 overflate-funn (Hvass kritisk blandet innhold, manglende sikkerhetsheadere, manuell lead-ruting) + mørk «det dere ikke har sett ennå»-seksjon + CTA 30-min møte. Printbar, selvforsynt.
2. epost-utkast-eskil.md — kort e-post fra Tom til Eskil (eskil.henriksen@toma.no) + følgebrev med møte-agenda og gulrot-regler (detaljer/mulighetskart deles KUN i møte; aldri tidsestimater/sertifiseringspåstander).
3. toma-smakebit-forhaandsvisning.png — renderingsbevis (headless Chrome).

Verifisert: DOM-render OK (alle seksjoner til stede), screenshot generert.

TILBAKEHOLDT (bak betaling): full funnliste, teknisk evidence, deep-dive del 1+2, mulighetskartet (matsvinn-AI, anbuds-AI, ISS-timingvinduet).`;
const r = q(`mutation($i: String!, $b: String!) { commentCreate(input: { issueId: $i, body: $b }) { success } }`, { i: iss.id, b: body });
console.log('Pitch-kommentar lagt til', iss.identifier, r.commentCreate.success ? 'OK' : '?');
