# Lesson: Multi-package + eksterne prosjekter er førsteklasse i alle Arch-skannere

**Regel:** Enhver scanner/detektor i Arch (stack, CI-match, health, secret) MÅ være
rekursiv over ALLE `package.json`/konfig-filer (med `node_modules`/`.git`/`.venv`/
`.wrangler`/`dist`/`allure-*` ekskludert), og MÅ behandle «ikke Arch-styrt prosjekt» som
NOT_APPLICABLE — ikke FAIL.

**Hvorfor:** Første eksterne kundeaudit ga false funn fordi skannerne var root-only og
Klarpakke/Arch-sentriske. Se failure: `audit-v1-root-only-scanning.md`.

**Sjekkliste ved ny skanner:**
1. Rekursiv over sub-kataloger (skip `node_modules`, `.git`, `.venv`, `dist`, `allure-*`).
2. `.arch/*`-sjekker = NOT_APPLICABLE for prosjekter uten `.arch/project.yaml`.
3. Totalscore aldri tvunget 0 for eksterne prosjekter — beregn over aktive kategorier.
4. Test-konfig: inkluder `playwright.config.*` (ikke bare vitest/jest) og sub-kataloger.
5. CI verktøy-match: respekter `working-directory` og sub-pakkenes `package.json`.
