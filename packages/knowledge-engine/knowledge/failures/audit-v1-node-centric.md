# Failure: Arch Audit v1 var Node-sentrisk — false funn på Python (FastAPI) + secret-scan false positive

**Dato:** 2026-08-13 · **Fase:** F4.1 generality-test (FastAPI) · **Alvorlighet:** høy (materiell feil i kundeleveranse)

## Symptom

Generality-test på fastapi (Python) ga:
- «Språk: JavaScript», «Rammeverk: ikke et Node-prosjekt», «Test-runner: ingen», Health 17%
- Secret-scan: 6 «critical leaks» i `tests/` — reelt avkortede dummy-JWT-er (`Bearer eyJhbG...7rOE`)

## Rot-årsak

1. `stack-detect.mjs` + `health-score.mjs` antok Node (package.json/tsconfig/vitest/jest/playwright) —
   ingen gjenkjenning av pyproject.toml/setup.py/pytest/Cargo.toml/go.mod.
2. `secret-scan.mjs` manglet skillet «ekte hemmelighet» vs «avkortet placeholder / test-fixture» —
   flagget dokumenterte dummy-credentials i testkode som kritiske lekkasjer.

## Fiks

- `stack-detect.mjs`: multi-språk (Python/Rust/Go/Ruby/PHP/Java) + pytest/cargo test/go test;
  rammeverk prioriterer eksakt prosjektnavn over dep-substreng.
- `health-score.mjs` v2.3: prosjektmanifest på tvers av språk; «.env gitignoret» = N/A uten .env.
- `secret-scan.mjs` v2: «...»-placeholders + test/eksempel/fixture-stier = note, ikke lekkasje.

## Lærdom

«En scanner som bare kjenner Node og bare kjenner app-strukturer, lyver om alt annet.
Språk-agnostisme og fixture-bevissthet er FØRSTEKLASSE egenskaper, ikke edge-cases.»
