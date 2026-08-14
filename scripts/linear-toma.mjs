#!/usr/bin/env node
/** Opprett/oppdater Toma-saken i Linear (team KLA) via GraphQL. Idempotent. */
import { execFileSync } from 'node:child_process';

const KEY = execFileSync('bash', ['-c', "grep '^LINEAR_API_KEY=' /Users/taj/klarpakke/.env.local | head -1 | sed 's/^LINEAR_API_KEY=//' | tr -d \"'\\\"\""], { encoding: 'utf8' }).trim();
const TEAM = 'a2b657ba-6d13-48b0-8570-25cbcb69f9c4';

function gql(query, variables) {
  const r = execFileSync('curl', ['-s', '-X', 'POST', 'https://api.linear.app/graphql', '-H', 'Content-Type: application/json', '-H', `Authorization: ${KEY}`, '-d', JSON.stringify({ query, variables })], { encoding: 'utf8' });
  const d = JSON.parse(r);
  if (d.errors) throw new Error(d.errors.map((e) => e.message).join('; '));
  return d.data;
}

const desc = `Toma (Tomagruppen AS) — potensiell Arch-kunde (Tom 2026-08-13).

INNGANG: Eskil Henriksen, Regionsdirektør Food & support Midt (Trondheim), eskil.henriksen@toma.no.

FAKTA:
- Tomagruppen AS (984028474), Bergen, grunnlagt 1978, familieeid (Monsen). Omsetning NOK ~2,8 mrd FY25, EBITDA ~154 mill, EV ~1,4 mrd (ISS-avtale).
- ISS (global, 325k ansatte) signerte kjøpsavtale 7.5.2026 — IKKE fullført, betinget Konkurransetilsynet (aktiv fusjonssak). KFST markedshøring 10.-19.6.2026.
- Toma Facility Norge AS: 2 954 ansatte; driftsresultat ~50,5 mill (2023, BT).
- Toma Camps AS (120), Toma Security (74), Toma Eiendomsdrift (216). Danmark: 5 kontorer.
- Trondheim: nytt kantinekonsept «Lerka»; region Midt; anbudskontakt på Doffin 2025-120060 (Avinor OSL kantine).
- Digitalt: toma.no (Arch Website Audit 70 %, 7 funn, automation 50 %), Kantineapp = Kanpla-hvitlabel (dk.kanpla.toma.twa).

LEVERANSER GJORT:
- Arch Website Audit: docs/audits/prospects/www.toma.no/website-audit-www.toma.no.md (70 %)
- Deep-dive + mulighetskart: docs/audits/prospects/www.toma.no/deep-dive-2026-08-13.md

MULIGHETER (prioritert):
A. Timing-vindu: selg FØR ISS-closing (ledelsen kan signere nå; «gå inn i ISS med de beste tallene»).
B. Matsvinn-AI: Kanpla-data → produksjonsplan per kantine (Eskil poster selv #kuttmatsvinn2030; 1 pp svinn-reduksjon ≈ NOK 1M+/år).
C. Anbuds-AI: Doffin-radar + tilbudsdrafting (offentlige kontrakter er kjernekanal).
D. Lead-ruting/kontaktskjema (Autoglass-mønsteret).
E. Kanpla-data ut av silo (eie egne tall før ISS-integrasjon).
F. Camps-forpleining digitalisering (papir).
G. Toma = kunde #4-kandidat → FM-vertikal (ISS/Coor/Sodexo/Fazer/Compass har samme hull).

NAVN: Rett navn er Toma/Tomagruppen AS. «Toma Food» er ikke et firmanavn. Toma Mat AS (Haugesund) er et urelatert Prima Brands-selskap.`;

try {
  const ex = gql(`query($id: String!) { issue(id: $id) { id identifier url } }`, { id: 'KLA-300' }).issue;
  if (ex) { console.log('Finnes allerede:', ex.identifier, ex.url); process.exit(0); }
} catch { /* opprettes under */ }

const r = gql(`mutation($t: String!, $d: String!, $p: Int!) {
  issueCreate(input: { teamId: $t, title: "Toma (Tomagruppen) — Arch-mulighet: dyp-audit + brainstorm (Trondheim/Midt)", description: $d, priority: $p }) {
    issue { id identifier url state { name } }
  }
}`, { t: TEAM, d: desc, p: 1 });

const iss = r.issueCreate.issue;
console.log('Opprettet:', iss.identifier, iss.url, `[${iss.state.name}]`);

// Flytt til started (In Progress-ekvivalent)
const wf = gql(`query($t: ID!) { workflowStates(filter: { team: { id: { eq: $t } } }) { nodes { id name type } } }`, { t: TEAM });
const started = wf.workflowStates.nodes.find((s) => s.type === 'started');
if (started) {
  gql(`mutation($i: String!, $s: String!) { issueUpdate(id: $i, input: { stateId: $s }) { success } }`, { i: iss.id, s: started.id });
  console.log('Flyttet til:', started.name);
}
