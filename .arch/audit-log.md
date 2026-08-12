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
- **Governance:** `control-center` IKKE publisert (utenfor deploy-scope, mangler auth). Ingen endring av Klarpakke, prod-secrets, trading eller tilgangsnivåer. Rollback-plan korrigert (wrangler har ingen `pages deployment rollback` — bruk dashboard/API/re-deploy).
