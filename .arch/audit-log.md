# Arch Audit-log — arch-platform
## 2026-08-12 — scaffold
- **Aktør:** Hermes (Project Factory v2.1)
- **Hendelse:** .arch/ + struktur scaffoldet. Ekstern oppsett: governed.

## 2026-08-13 — F3.5 Arch Productization
- **Aktør:** Hermes (governed — Tom godkjente F3.5)
- **Hendelse:** Arch Control Center-dashboard bygget (statisk, datadrevet av collect-dashboard-data.mjs). Health Score v2 (vektet). Knowledge Graph + Factory + templates flyttet fra Klarpakke til dette repoet. Linear issue ARC-1 («Arch Dashboard v1») opprettet. Repo opprettet via Project Factory (--create-github).
- **Governance:** ingen deploy (avventer Tom-godkjenning). Ingen prod-secrets. Klarpakke uberørt.

## 2026-08-13 — F3.6 Arch Production Readiness
- **Aktør:** Hermes (governed — ARC-2, Tom-mandat F3.6)
- **Hendelse:** Kanonisk monorepo (apps/control-center + customer-portal, packages/{project-factory,health-score,data-adapters,knowledge-engine,governance,ui}). Project Registry (SSoT, ingen hardkodede stier). Data-adaptere med provenance (observed/declared/unknown). Intern vs sanitert publikumsvisning. Health Score v2.1 med evidence. Build-automasjon (package.json). Leakage-audit.
- **Governance:** ingen deploy (publikumsvisning deployable, venter Tom-godkjenning). Leakage-audit clean (0 sensitive lekkasjer i publikumsartefakter).

## 2026-08-13 — F3.6C First Governed Deploy (Tom-godkjent)
- **Aktør:** Hermes (governed — eksplisitt Tom-ordre «F3.6C First Governed Deploy»)
- **Hendelse:** Build (`npm run build`) → leakage gate (`audit-leak.mjs` 0 funn) → deploy-ready-check (12/12 PASS) → deploy sanitert Customer Portal til Cloudflare Pages (prosjekt `arch-platform`, deployment `53730518-0d52-4e30-b2ef-f4c87aabd9bc`, commit `2227817`, branch main). Prod: https://arch-platform.pages.dev/.
- **Smoke (alle grønne):** HTTP 200 (prod+preview), assets 200 (styles.css/app.js/data.js), DOM rendret (headless Chrome — Klarpakke 98 %, agents ærlig Hermes=Ukjent/Codex=Kimi=Rolle), data-freshness (generated ≈5 min fersk), privacy 0 lekkasjer i live data.js.
- **Rollback:** kapabilitet verifisert (deploy-historikk sporet, commit-SHA-anchor, statisk site → re-deploy tidligere commit). IKKE eksekvert (første deploy; destruktiv rollback-POST korrekt gated av Hermes-approval).
- **Governance:** `control-center` IKKE publisert (utenfor deploy-scope, mangler auth). Ingen endring av Klarpakke, prod-secrets, trading eller tilgangsnivåer. Rollback-plan korrigert (wrangler har ingen `pages deployment rollback` — bruk dashboard/API/re-deploy). `deploy.yml` omskrevet fra ødelagt stub (tsc/`npm test` fantes ikke → rød på hver push) til korrekt governed deploy (workflow_dispatch-only, reelle gates, wrangler pages deploy, smoke).

## 2026-08-13 — F4.1 Arch Audit v1 (Tom-mandat: START F4 — Commercial Product Layer)
- **Aktør:** Hermes (governed — eksplisitt Tom-ordre F4, ARC-3/4/5 opprettet)
- **Hendelse:** Knowledge Graph oppdatert med F3.6C-funn (2 failures: rollback-antakelse-wrangler, deploy-workflow-falsk-gate; 1 lesson: governed-deploy-verifiser-verktoy). Arch Audit v1 bygget: `packages/audit/audit.mjs` + `lib/{classify,secret-scan,stack-detect,report}.mjs`. Tre-klasse-grense (automatic/inferred/human_approval). Klarpakke = første reference audit (98 %, 0 lekkasjer, 7726 filer scannet) → `docs/audits/audit-klarpakke.{md,evidence.json}`. ARC-3 (Audit v1) In Progress, ARC-4 (Build v1) + ARC-5 (Managed v1) Backlog (prepare-only). `docs/f4-commercial-layer.md` scope.
- **Governance:** Ingen deploy av Audit-produktet. Ingen endring av Klarpakke. Audit er read-only (endrer aldri mål-repoet). Juridisk/regulatorisk = alltid human_approval, ingen påstander uten grunnlag. deploy-ready-check utvidet til å skanne `packages/audit/` (NO_LOCAL_PATHS).
