# F4 Pilot — Arch Audit v1 på ekstern kunde: Bilglass (Autoglass AS)

> **Fiktiv kunde** brukt for å teste at Arch Audit v1 fungerer på et prosjekt Arch IKKE
> er forhåndstrent på. Klarpakke = referanseprosjekt/læringskilde. Bilglass = første «kunde».
> **Read-only** — ingen endringer i Bilglass, ingen deploy, ingen secret-endringer.

## Konklusjon (bunnlinje)

Piloten gjorde nøyaktig det den skulle: **Arch Audit v1 fungerte mekanisk, men avslørte
3 deterministiske engine-bugs** (samme rot-årsak) som ga materiell feilaktige funn på et
eksternt mono-repo-prosjekt. Alle er fikset og regresjonstestet.

| Metrikk | Før fiks | Etter fiks |
|---|---|---|
| Arch Health Score (Bilglass) | 0% (tvunget) | **91%** (korrekt) |
| CI/verktøykjede-match | 2 false mismatch | **✅ matcher** |
| Rammeverk/språk/test | «ukjent / ingen tsconfig / ingen test-runner» | **React (SPA) / TypeScript / vitest + playwright** |
| Regresjon Klarpakke | 98% | 98% (uendret) |
| Regresjon Arch | 74% | 74% (uendret) |

## Kunde-oppdagelse (OBSERVED — verifisert mot Bilglass-filer)

| Aspekt | Observert verdi | Kilde |
|---|---|---|
| Domene | B2B grossistnettside for bilglass (Autoglass AS) | README.md, AGENTS.md |
| Stack | Vanilla JS (root, statisk HTML) + **React 18 SPA** (`frontend/`, Vite+Tailwind+Zustand+React Query) + **Cloudflare Worker** (`api/cf-worker/`, TypeScript) | package.json ×3 |
| Data | 27 184 bilglass-produkter (Pilkington/Glavista/Euroglass), regnr→glass, TecDoc/SVV/Bovsoft | data/ (86 filer), AGENTS.md |
| Runtime/deploy | Cloudflare Pages (`frontend/wrangler.toml`) + Worker + KV + D1 | wrangler.toml ×2, schema.sql, migrations |
| Tester | vitest (frontend + worker), Playwright e2e, Allure-rapporter | vitest.config.*, playwright.config.js, e2e/*.spec.js, allure-* |
| CI/CD | **14 workflows** (verify: tsc+vitest+build+e2e+smoke; daily scrape/price/SVV; d1-migrate; uptime) | .github/workflows/ |
| Secrets | `.env` + `.env.local` gitignoret (`.gitignore` L13–14), `.env.example` uten verdier | .gitignore, .env.example |
| Monitoring | uptime.yml tilstede | .github/workflows/uptime.yml |
| Dokumentasjon | README + docs/ (API, ADR, arkitektur-planer, runbooks) | docs/, docs/adr/ |
| Git | Branch `fix/vin-ktype-map-fast-path`, oppstrøms `autoglassnorge/autoglassgrossisten` | git status/remote |

## Engine-bugs funnet + fikset (pilotens viktigste gevinst)

| # | Bug | Effekt | Fiks |
|---|---|---|---|
| 1 | `stack-detect.mjs` leste kun ROOT `package.json`/configs | «ukjent rammeverk», «ingen tsconfig», «ingen test-runner», «Runtime ukjent» | Rekursiv multi-package deteksjon + `playwright.config.js` lagt til |
| 2 | `audit.mjs analyzeCiCd()` sjekket verktøy kun i root | false «tsc / npm test finnes ikke» (overså `working-directory` + sub-pakker) | Verktøy-tilstedeværelse fra rekursiv stack-data |
| 3 | `health-score.mjs` tvang `total=0` uten `.arch/project.yaml` + `.arch/*`=FAIL | Ekstern kunde fikk «0% health» | v2.2: `.arch/*`=NOT_APPLICABLE, total over aktive kategorier, rekursiv test-deteksjon, `docs/adr/`=beslutningslogg |

Variggjort i Knowledge Graph: `failures/audit-v1-root-only-scanning.md` +
`lessons/lesson-audit-multi-package-recursive.md`.

## Gjenstående legitime funn (INFERRED / RECOMMENDED)

1. **Ingen alert-routing** — uptime-monitoring finnes, men ingen alert/escalation (Discord/e-post).
2. **Ingen workflow-kodet rollback** — CF Pages/Worker har dashboard/API-rollback, men deploy.yml koder den ikke.
3. **Ingen `.arch/secrets/` governance** — Bilglass bruker ikke Arch-governance (forventet for ekstern kunde).
4. **Ingen `ARCHITECT.md`** — arkitekturkunnskap finnes spredt i `docs/ARCHITECTURE-PLAN.md` + `docs/B2B-MODERN-FRONTEND-PLAN.md` + `docs/adr/`, men ikke konsolidert.

> Juridisk/regulatorisk (GDPR m.fl.) = UNKNOWN — krever kvalifisert vurdering, aldri påstand.

## Architecture / Build Proposal Gate — STOPP

Status: **venter på Tom.** Ingen Architecture Proposal, ingen Build, ingen endringer i
Bilglass er utført. Dette dokumentet + `audit-bilglass.md` + `audit-bilglass.evidence.json`
er hele leveransen fra audit-fasen.
