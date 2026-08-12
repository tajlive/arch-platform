# Deploy Readiness Report — Arch Platform (F3.6)

**Status:** ✅ Deploy Ready — **IKKE deployet**. Venter eksplisitt Tom-godkjenning.
**Linear:** ARC-2 (state: Ready for Tom) · **Commit:** `d98d897` (senere F3.6A/B-commit følger)
**Dato:** 2026-08-13

---

## Pre-deploy gates — bevis

| # | Gate | Resultat | Bevis |
|---|---|---|---|
| 1 | Ingen hardkodede `/Users/`-stier i prod-laget | ✅ PASS | `deploy-ready-check.mjs` skanner adapters/collector/apps — 0 treff. Stier finnes kun som `dev_path` i registry (dev-metadata, ikke prod-identifikator) |
| 2 | Project Registry | ✅ PASS | `packages/governance/projects.json` (SSoT, 3 prosjekter: klarpakke/arch-platform/arch-dashboard-arkivert) |
| 3 | Data Adapter-lag | ✅ PASS | `github-adapter.mjs`, `linear-adapter.mjs`, `knowledge-adapter.mjs`, `hermes-adapter.mjs` |
| 4 | observed/declared/stale/unknown/error | ✅ PASS | `lib/provenance.mjs` — alle 5 statuser; hvert datapunkt bærer `value/source/observed_at/status` |
| 5 | Intern vs offentlig datasone (default-deny) | ✅ PASS | `apps/control-center/` (full) vs `apps/customer-portal/` (sanitert). Publikum = default-deny (kun `visibility=demo`) |
| 6 | Health Score v2.1 med evidens | ✅ PASS | `PASS/FAIL/UNKNOWN/NOT_APPLICABLE` per sjekk + evidence + `observed_at` |
| 7 | Automatisert refresh | ✅ PASS | `npm run build` → collector. Manuell collect = kun nødstilfelle. Adaptere degraderer grasiøst |
| 8 | secret/path/privacy leakage = 0 | ✅ PASS | `audit-leak.mjs` → 0 funn. Public `data.js` = 1,4 KB uten `/Users/`/`dev_path`/`LINEAR_API_KEY`/repo-metadata (grep-verifisert) |
| 9 | Interne kontrollflater beskyttet | ✅ PASS | `control-center` merket INTERN, deployes aldri uten autentisering. Kun `customer-portal` er deploy-scope |
| 10 | Public/demo build ferdig + sanitert | ✅ PASS | `customer-portal/data.js` generert, rendret, verifisert i DOM (Klarpakke 98 %, Hermes=Ukjent ærlig) |
| 11 | Rollback-plan | ✅ PASS | se under |
| 12 | CI/security gates grønne | ✅ PASS | `.github/workflows/ci.yml` (syntaks + health-score + leakage-audit + deploy-ready-check) |

## Rollback-plan

1. Deploy skjer via `wrangler pages deploy apps/customer-portal --project-name arch-platform`.
2. Cloudflare Pages beholder deploy-historikk: `wrangler pages deployment list` → `wrangler pages deployment rollback` (eller Pages-dashboard → Deployment → Roll back).
3. Kundeporlet er 100 % statisk (HTML/CSS/JS + data.js) — ingen DB/session-state → rollback er atomisk og risiko-fri.
4. Ved feil i smoke (HTTP/asset/konsoll) → umiddelbar rollback til forrige versjon.

## Hva som IKKE er gjort (governance)

- ❌ Ingen offentlig produksjonsdeploy (venter Tom).
- ❌ Ingen endring av Klarpakke, trading-regler, prod-secrets eller tilgangsnivåer.
- ❌ `control-center` er ikke publisert og publiseres ikke uten autentiseringsmekanisme.

## Verifisert data (ved siste collect)

| Prosjekt | Arch Health Score | Provenance |
|---|---|---|
| Klarpakke | 98 % | observed |
| Arch Platform | 74 % | observed |
| Arch Dashboard | — | arkivert (not_scored) |

Agenter (ærlig): Hermes = `unknown` (ikke instrumentert) · Codex = `declared` (rolle) · Kimi = `declared` (rolle).
