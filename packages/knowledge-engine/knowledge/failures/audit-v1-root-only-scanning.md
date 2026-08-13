# Failure: Arch Audit v1 skannet kun root — false funn på eksterne mono-repo-prosjekter

**Dato:** 2026-08-13 · **Fase:** F4.1 pilot (Bilglass) · **Alvorlighet:** høy (materiell feil i kundeleveranse)

## Hva skjedde

Første eksterne kundeaudit (Bilglass) produserte materiell feilaktige funn:
- «tsc finnes ikke i repo» — feil (typescript i devDeps + tsconfig i `frontend/` og `api/cf-worker/`)
- «npm test finnes ikke» — feil (root har `test:unit/e2e/all`, `frontend` + `cf-worker` har `"test"`)
- «ingen test-runner» — feil (`playwright.config.js` i root, `vitest.config.*` i sub-pakker)
- «JavaScript (ingen tsconfig)» / «ukjent rammeverk» / «Runtime ukjent» — feil
- Arch Health Score tvunget **0%** (`if (!hasArch("project.yaml")) total = 0`)

## Rot-årsak

1. `stack-detect.mjs` leste kun ROOT `package.json`/konfig — Bilglass er mono-repo
   (root + `frontend/` + `api/cf-worker/`), alle med egne `package.json`.
2. `audit.mjs analyzeCiCd()` sjekket verktøy-tilstedeværelse kun i root, ignorerte
   `working-directory` og sub-pakkenes `package.json`.
3. `health-score.mjs` straffet eksterne prosjekter med FAIL for manglende `.arch/*`
   og tvang total=0 for alle ikke-Arch-styrte prosjekter.

## Fiks

- `stack-detect.mjs`: rekursiv multi-package deteksjon (alle package.json/tsconfig/
  test-config/wrangler), + `playwright.config.js` lagt til i test-runner-listen.
- `audit.mjs`: verktøy-tilstedeværelse fra rekursiv stack-data (deps/scripts/configs på tvers).
- `health-score.mjs` v2.2: `.arch/*` = NOT_APPLICABLE for eksterne; total kun over aktive
  kategorier; test-deteksjon rekursiv; beslutningslogg aksepterer `docs/adr/`.

## Lærdom

«Et verktøy som bare kjenner sine egne (Klarpakke/Arch) prosjektformer, lyver for eksterne
kunder. Multi-package- og ekstern-prosjekt-håndtering er en FØRSTEKLASSE egenskap,
ikke en edge-case.»
