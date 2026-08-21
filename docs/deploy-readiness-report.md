# Deploy Readiness Report — Arch Platform (F3.6)

**Status:** ✅ **DEPLOYET** (F3.6C First Governed Deploy) — sanitert Customer Portal live.
**Commit:** `2227817` (`2227817d21ea63132d282626154db80cb0380977`)
**Dato:** 2026-08-13 · **Prod:** https://arch-platform.pages.dev/

---

## Deploy-resultat — eksakte bevis

| Steg | Resultat | Bevis |
|---|---|---|
| Build (collect) | ✅ | `npm run build` → Klarpakke 98% (observed), Arch Platform 74% (observed), Arch Dashboard not_scored (arkivert) |
| Leakage gate | ✅ | `audit-leak.mjs` → **0 funn** i `apps/customer-portal` |
| Deploy Ready Gate | ✅ | `deploy-ready-check.mjs` → **12/12 PASS** |
| Deploy | ✅ | Pages-prosjekt `arch-platform` opprettet; deployment `53730518-0d52-4e30-b2ef-f4c87aabd9bc` (env: production, branch: main, commit: 2227817, stage: success) |
| HTTP smoke | ✅ | prod + preview → `200 text/html` (2543 B = index.html) |
| Assets smoke | ✅ | `styles.css` 200/4225 B · `app.js` 200/2762 B · `data.js` 200/1408 B |
| DOM smoke | ✅ | headless Chrome `--dump-dom` → rendret: Klarpakke 98 %, knowledge 6/4/7/10/1/1, security OK×3, agents ærlig (Hermes=Ukjent, Codex/Kimi=Rolle) |
| Data-freshness | ✅ | `generated` = 2026-08-12T23:14:10Z (≈5 min fersk ved sjekk); footer «Oppdatert 2026-08-12 23:14» |
| Privacy | ✅ | 0 treff i live `data.js` for: `/Users/`, `dev_path`, `LINEAR_API_KEY`, `Bearer`, `secret://`, `repository`, `linear_team`, `sk_live`, `ghp_` |
| Rollback | ✅ (kapabilitet) | deploy-historikk sporet (commit-SHA-anchor). Static site → rollback = re-deploy tidligere commit (atomisk). IKKE *eksekvert* (første deploy, ingen tidligere versjon; destruktiv POST korrekt gated) |

---

## Pre-deploy gates — bevis

| # | Gate | Resultat | Bevis |
|---|---|---|---|
| 1 | Ingen hardkodede `/Users/`-stier i prod-laget | ✅ PASS | `deploy-ready-check.mjs` skanner adapters/collector/apps — 0 treff. Stier finnes kun som `dev_path` i registry (dev-metadata, ikke prod-identifikator) |
| 2 | Project Registry | ✅ PASS | `packages/governance/projects.json` (SSoT, 3 prosjekter: klarpakke/arch-platform/arch-dashboard-arkivert) |
| 3 | Data Adapter-lag | ✅ PASS | `github-adapter.mjs`, `knowledge-adapter.mjs`, `hermes-adapter.mjs` |
| 4 | observed/declared/stale/unknown/error | ✅ PASS | `lib/provenance.mjs` — alle 5 statuser; hvert datapunkt bærer `value/source/observed_at/status` |
| 5 | Intern vs offentlig datasone (default-deny) | ✅ PASS | `apps/control-center/` (full) vs `apps/customer-portal/` (sanitert). Publikum = default-deny (kun `visibility=demo`) |
| 6 | Health Score v2.1 med evidens | ✅ PASS | `PASS/FAIL/UNKNOWN/NOT_APPLICABLE` per sjekk + evidence + `observed_at` |
| 7 | Automatisert refresh | ✅ PASS | `npm run build` → collector. Manuell collect = kun nødstilfelle. Adaptere degraderer grasiøst |
| 8 | secret/path/privacy leakage = 0 | ✅ PASS | `audit-leak.mjs` → 0 funn. Public `data.js` = 1,4 KB uten `/Users/`/`dev_path`/`LINEAR_API_KEY`/repo-metadata (grep-verifisert i live prod) |
| 9 | Interne kontrollflater beskyttet | ✅ PASS | `control-center` merket INTERN, deployes aldri uten autentisering. Kun `customer-portal` er deploy-scope |
| 10 | Public/demo build ferdig + sanitert | ✅ PASS | `customer-portal/data.js` generert, rendret, verifisert i DOM (Klarpakke 98 %, Hermes=Ukjent ærlig) |
| 11 | Rollback-plan | ✅ PASS | se under |
| 12 | CI/security gates grønne | ✅ PASS | `.github/workflows/ci.yml` (syntaks + health-score + leakage-audit + deploy-ready-check) |

## Rollback-plan (KORRIGERT 2026-08-13)

> ⚠️ `wrangler pages deployment rollback` finnes IKKE i wrangler 4.122.0 (kun `list`/`create`/`tail`/`delete`). Faktiske mekanismer:

1. **Dashboard:** Cloudflare Pages → arch-platform → Deployment → «Roll back».
2. **API:** `POST /accounts/{account_id}/pages/projects/arch-platform/rollbacks` med `{"deployment_id": "<mål>"}`.
3. **Re-deploy prior commit (primær for statisk site):** `wrangler pages deploy apps/customer-portal --project-name arch-platform --branch main --commit-hash <forrige-sha>`.
4. Kundeporlet er 100 % statisk (HTML/CSS/JS + data.js) — ingen DB/session-state → rollback er atomisk og risiko-fri.
5. Ved feil i smoke (HTTP/asset/DOM) → umiddelbar rollback til forrige versjon.

## Hva som IKKE er gjort (governance)

- ❌ `control-center` er **ikke** publisert (utenfor deploy-scope, mangler auth — egen gate før det eventuelt går online).
- ❌ Ingen endring av Klarpakke, trading-regler, prod-secrets eller tilgangsnivåer.
- ❌ Ingen auth/authorization på Customer Portal (public read-only visning — akseptabelt for første deploy; egen gate før Control Center).

## Verifisert data (ved siste collect)

| Prosjekt | Arch Health Score | Provenance |
|---|---|---|
| Klarpakke | 98 % | observed |
| Arch Platform | 74 % | observed |
| Arch Dashboard | — | arkivert (not_scored) |

Agenter (ærlig): Hermes = `unknown` (ikke instrumentert) · Codex = `declared` (rolle) · Kimi = `declared` (rolle).
