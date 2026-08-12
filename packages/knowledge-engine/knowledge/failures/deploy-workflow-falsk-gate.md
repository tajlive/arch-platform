# Failure

System: Arch Platform CI (deploy.yml) · GitHub Actions
Dato: 2026-08-13 (F3.6C First Governed Deploy)

Symptom: `deploy.yml` var rød på HVER push siden F3.5 (0s kjøretid = umiddelbar
feil). Den så «aktiv» ut (trigger på push) men beskyttet ingenting.

Rotårsak: `deploy.yml` var en generisk mal (stub) som kjørte `npx tsc --noEmit`
og `npm test` — verktøy som IKKE finnes i arch-platform-repoet (ingen TypeScript,
ingen test-runner, ingen package-lock.json for `npm ci`). En gate som feiler på
grunn av feil verktøy for feil repo-type er en falsk gate: den gir rød CI uten å
teste noe reelt, og gjør at «grønn CI» blir meningsløs.

Fix: `deploy.yml` omskrevet til korrekt governed deploy: `workflow_dispatch`-only
(aldri push — deploy er Tom-governed), reelle gates (syntax + build + leakage +
deploy-ready-check), `wrangler pages deploy` kun customer-portal, HTTP+privacy smoke.

Permanent regel: En CI-workflow MÅ matche repoets faktiske verktøykjede
(package.json-scripts, lockfile, test-framework). En mal med TODOs som trigger på
push er verre enn ingen gate — den produserer falsk rød/grønn og desensitiviserer
teamet mot ekte CI-signaler.

Arvet av: Arch Audit v1 (F4) — «CI-workflow matcher repo-verktøykjede» er en
eksplisitt audit-sjekk.
