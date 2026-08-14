#!/usr/bin/env node
/** Kommentar på KLA-300 (Toma-saken) via Linear GraphQL. */
import { execFileSync } from 'node:child_process';
const KEY = execFileSync('bash', ['-c', "grep '^LINEAR_API_KEY=' /Users/taj/klarpakke/.env.local | head -1 | sed 's/^LINEAR_API_KEY=//' | tr -d \"'\\\"\""], { encoding: 'utf8' }).trim();
const q = (query, variables) => {
  const r = execFileSync('curl', ['-s', '-X', 'POST', 'https://api.linear.app/graphql', '-H', 'Content-Type: application/json', '-H', `Authorization: ${KEY}`, '-d', JSON.stringify({ query, variables })], { encoding: 'utf8' });
  const d = JSON.parse(r);
  if (d.errors) throw new Error(d.errors.map((e) => e.message).join('; '));
  return d.data;
};
const iss = q(`query($id: String!) { issue(id: $id) { id identifier } }`, { id: 'KLA-300' }).issue;
const body = `DEL 2 (2026-08-13) — audit fortsatt i dybden:

ORG-KART (toma.no/kontakt-oss): Åsmund Eikli = CIO Tomagruppen (IT & Digitalisering); Gunnar Harris-Christensen = CRO (Strategi og M&A); Lars Furu = Direktør Innkjøp og Prosjekter; Marte Bjelland = Leder bærekraft; Atefeh Sori = Personvernombud; Fredrik Duus = Divisjonsdirektør FM. Trondheim: Per-Erik Larsen (Eiendomssjef Trondheim).

TRONDHEIM-BASEN: NRS Norge AS (org 977340950, Torgardsvegen 9B Tiller, 260 ansatte) = Toma sitt Midt-Norge-oppkjøp. Est. ~300+ ansatte i Trondheim (NRS + Food & support Midt + Eiendomsdrift).

HVASS: hvass.no = konsernets andre merke (Hvass AS, Oslo, 290 ansatte). Arch Website Audit: 57 % — 1 KRITISK (blandet http/https) + 7 høy ROI. Konsernet har altså to nettsider med funn.

TEKNOLOGI: WordPress + BunnyCDN + Google Analytics; kantineapp = Kanpla-hvitlabel. Digitalt modningsrom er stort (CIO-mulighet).

HISTORIE: Toma kjøpte selv ISS Direct i Danmark — ISS og Toma kjenner hverandre. Referanse: kantina hos robotselskapet 1X Technologies (NAV-rekruttering), Toma Camps tok 3 ISO-sertifiseringer samtidig.

AVINOR: kantinetjenester utlyst som 3 avtaler (OSL Gardermoen + Røyken + Flysikring), Eskil = Toma sin kontakt. Coor vant OSL-renholdet (~NOK 100 mill/år). Vinner av kantine-avtalene: UNKNOWN utenfor-inn.

ISS-FUSJONEN: fortsatt IKKE fullført per 2026-08-13 (betinget Konkurransetilsynet). Timing-vinduet står åpent.

Filer: docs/audits/prospects/www.toma.no/deep-dive-2026-08-13-del2.md + website-audit hvass.no (57 %).`;
const r = q(`mutation($i: String!, $b: String!) { commentCreate(input: { issueId: $i, body: $b }) { success } }`, { i: iss.id, b: body });
console.log('Kommentar lagt til', iss.identifier, r.commentCreate.success ? 'OK' : '?');
