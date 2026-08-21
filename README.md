# Arch Platform

**Autonomous Engineering Platform** — Arch analyserer, bygger, tester og drifter digitale
løsninger med innebygd governance.

> «Arch lærer av systemet, men endrer aldri sikkerhetsgrenser automatisk.»

## Moduler

Produktet er **Arch Platform**. Disse er moduler (ikke egne produkter): **Control Center**,
**Customer Portal**, **Project Factory**, **Health Score**, **Data Adapters**, **Knowledge Engine**,
**Governance** og **UI**. Kommersielt lag (F4): **Arch Audit** (v1 bygget), **Arch Build** og
**Arch Managed** (forberedt, ikke implementert — se `docs/f4-commercial-layer.md`).
(`arch-dashboard` er ikke et eget produkt — kun historisk F3-pilot, arkivert.)

## Struktur (kanonisk monorepo)

| Katalog | Innhold |
|---|---|
| `apps/control-center/` | **INTERN** kontrollpanel (full provenance, krever autentisering) |
| `apps/customer-portal/` | **SANITERT** publikums-/demo-visning (default-deny) |
| `packages/project-factory/` | `analyze-project.mjs` + `init-project.mjs` |
| `packages/health-score/` | Health Score v2.1 (vektet + evidence) |
| `packages/data-adapters/` | GitHub/Knowledge/Hermes-adaptere + `collect.mjs` + `audit-leak.mjs` |
| `packages/knowledge-engine/` | Knowledge Graph (failures/patterns/lessons/decisions/…) |
| `packages/governance/` | `projects.json` (Project Registry, SSoT) + governance-regler |
| `packages/audit/` | Arch Audit v1 (F4.1) — evidensbasert audit av repo/system |
| `packages/ui/` | Delt design-system |
| `templates/` | Versjonerte maler |
| `examples/` | Referanseprosjekter (Klarpakke = #1) |
| `docs/` | Arkitektur + dokumentasjon |
| `.arch/` | Arch Control Plane (prosjektets egen governance) |

## Kjerneprinsipper

1. **Project Registry** er SSoT — ingen hardkodede lokale stier i produksjonskode.
2. **Provenance** — hvert datapunkt er `observed` / `declared` / `unknown` / `error`. Aldri vise antatt som observert.
3. **Intern vs publikum** — to data-eksponeringsnivåer, default-deny.
4. **Governed deploy** — publiseres kun etter grønne gater + leakage-audit.

## Kjør

```bash
# Generer data (observert via adapters → data.js i begge apper)
npm run build          # = node packages/data-adapters/collect.mjs

# Health Score v2.1 (vektet + evidence)
npm run score -- /sti/til/prosjekt

# Leakage-audit (må være clean før deploy)
npm run audit:leak

# Arch Audit v1 (F4.1) — evidensbasert audit av repo/system
npm run audit -- <target|project_id>      # kunderapport (markdown)
npm run audit -- <target> --json          # intern evidence-visning
npm run audit -- <target> --save <dir>    # begge til fil

# Åpne
open apps/customer-portal/index.html   # publikum
open apps/control-center/index.html    # intern
```

## Health Score v2.1

Vekter: Governance 20 · Security 25 · Engineering 25 · Operations 20 · Documentation 10.
Hver sjekk har `PASS`/`FAIL`/`UNKNOWN`/`NOT_APPLICABLE` + evidence. UNKNOWN telles ikke
som healthy (fail-safe).

## Referanseprosjekter

- **Klarpakke** (`examples/klarpakke/`, repo `tajlive/KP`) — Arch Health Score 98 %.
- **Arch Dashboard** — historisk F3-pilot, slått sammen med `arch-platform`.

## Governance

- GitHub Issues er oppgavekilden.
- `--approve`-gate for eksterne ressurser (repo).
- Factory deployer/secreter/live aldri — governed steg utenfor Factory.
- Deploy kun etter Tom-godkjenning + grønne security-gates.
