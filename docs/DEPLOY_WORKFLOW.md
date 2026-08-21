# Deploy Workflow — Arch Platform (Standard)

> **Gyldig fra:** 2026-08-21 | **Eier:** Hermes (arkitekt) | **Godkjent av:** Tom

---

## 1. Lokal iterasjon (sekunder)

```bash
# Worker (API)
cd apps/arch-audit-api && wrangler deploy

# Customer Portal (Pages)
cd ../.. && wrangler pages deploy apps/customer-portal
```

- Ingen CI-ventetid
- Umiddelbar verifisering via `curl` mot `*.workers.dev` / `*.pages.dev`
- Kjøres så ofte som trengs under utvikling

---

## 2. Commit + Push (når ferdig)

```bash
git add -A
git commit -m "feat(scope): beskrivelse

- Detaljer
- Av endringer

Files:
- fil1.ts
- fil2.ts"
git push origin main
```

- **En commit per logisk endring** (ingen "WIP", "fix", "typo")
- Commit-melding følger Conventional Commits
- `main` = alltid deploybar tilstand

---

## 3. Governed deploy (når klar for produksjon)

**GitHub Actions → Actions → `deploy` → Run workflow**

| Job | Sjekk |
|-----|-------|
| `gates` | typecheck, tester, leakage-audit, readiness, portal-e2e, git-synk |
| `deploy` | Pages deploy (sanitert customer-portal only) |
| `smoke` | HTTP smoke + privacy-sjekk + auto-rollback |
| `alert` | GitHub Issue-varsel ved feil |

- **Kun manuell trigger** (`workflow_dispatch`)
- **Aldri auto-deploy på push**
- Rollback automatisk ved rød smoke

---

## Prinsipper

| Prinsipp | Hva det betyr |
|----------|---------------|
| **Lokal først** | Iterer lokalt, push først når ferdig |
| **Én commit** | Én logisk endring = én commit |
| **Main = deploybar** | Aldri broken code på main |
| **Governed prod** | Tom bestemmer når prod deploy skjer |
| **Smoke = sanntidsverifikasjon** | Prod verifiseres med ekte HTTP-kall |
| **Rollback = automatisk** | Ingen manuell handling ved feil |

---

## Kjøretider (estimat)

| Steg | Tid |
|------|-----|
| Lokal worker deploy | ~7-8 sek |
| Lokal pages deploy | ~15-20 sek |
| CI gates (full) | ~4-5 min |
| CI deploy + smoke | ~3-4 min |
| **Total governed deploy** | **~8-10 min** |

---

## Referanser

- `apps/arch-audit-api/` — Worker (API)
- `apps/customer-portal/` — Pages (kundeflate)
- `.github/workflows/deploy.yml` — Governed deploy pipeline
- `packages/data-adapters/audit-leak.mjs` — Leakage-audit
- `packages/governance/deploy-ready-check.mjs` — 12-punkts readiness gate