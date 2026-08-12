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
