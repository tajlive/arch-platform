# Arch Platform

**Autonomous Engineering Platform** — Arch analyserer, bygger, tester og drifter digitale
løsninger med innebygd governance.

> «Arch lærer av systemet, men endrer aldri sikkerhetsgrenser automatisk.»

## Hva Arch gjør

```
Ny idé → analyze → arkitektur-forslag → godkjenning (Tom/kunde)
       → project factory → AI-utviklingsteam → monitoring + forbedring → knowledge tilbake
```

Arch er ikke «vi lager nettsider». Arch er en autonom AI-plattform med kontroll, audit,
kunnskapsarv og menneskelig godkjenning ved risiko.

## Struktur

| Katalog | Innhold |
|---|---|
| `dashboard/` | Arch Control Center (web, datadrevet av `collect-dashboard-data.mjs`) |
| `project-factory/` | `analyze-project.mjs` + `init-project.mjs` + `health-score.mjs` (v2) + `collect-dashboard-data.mjs` |
| `knowledge-engine/` | Knowledge Graph — failures/patterns/lessons/decisions/customers/architectures |
| `templates/` | Versjonerte maler (arch/ci/docs) |
| `control-plane/` | Governance — SSoT-tabell, approval-gates, secret://-standard |
| `docs/` | Arkitektur + dokumentasjon |
| `examples/` | Referanseprosjekter (Klarpakke = #1) |
| `.arch/` | Arch Control Plane (prosjektets egen governance-konfig) |

## Kjør

```bash
# Score et prosjekt (vektet: Gov 20/Sec 25/Eng 25/Ops 20/Docs 10)
node project-factory/health-score.mjs /sti/til/prosjekt

# Generer dashboard-data (reelle tall → dashboard/data.js)
node project-factory/collect-dashboard-data.mjs

# Åpne dashboard
open dashboard/index.html
```

## Health Score v2

Kategorier og vekt: Governance 20 % · Security 25 % · Engineering 25 % · Operations 20 % ·
Documentation 10 %. TOTAL = Σ(kategori% × vekt). Deterministisk og fil-basert.

## Referanseprosjekter

- **Klarpakke** (`examples/klarpakke/`, repo `tajlive/KP`) — Arch Score 98 %.
- **Arch Dashboard** — første Factory-genererte prosjekt (Internal Platform).

## Governance

- Linear = eneste oppgave-SSoT (team `ARC`).
- `--approve`-gate: eksterne ressurser (repo, Linear-team) krever godkjenning.
- Factory deployer/secreter/live aldri — det er governed steg utenfor Factory.
