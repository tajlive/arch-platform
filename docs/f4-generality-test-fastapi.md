# F4 Generality-test — Arch Audit v1 på ekte tredjeparts-repo: FastAPI

> Formål: bevise at Arch ikke er overtrent på Toms stack (Next.js/Cloudflare/TypeScript).
> Mål: **fastapi** (Python, pytest, uv) — helt utenfor Node/Cloudflare. Read-only, ingen endringer.

## Resultat

Generality-testen avslørte 2 nye engine-begrensninger (samme tema: «overtrent på Node/App»),
begge fikset, + 1 kjent gjenværende begrensning flagget for v2.4.

| Metrikk | Før (feil) | Etter (korrekt) |
|---|---|---|
| Språk | «JavaScript (ingen tsconfig)» | **Python** |
| Rammeverk | «ikke et Node-prosjekt» | **FastAPI** |
| Test-runner | «ingen test-runner» | **pytest** |
| Package manager | «ukjent» | **uv** |
| Secret-scan | 6 false «critical leaks» | **0 lekkasjer + 6 fixture-note** |
| Health Score | 17% (feil) | 59% (korrekt) |

**Regresjon uendret:** Klarpakke 98% · Arch 74% · Bilglass 91%.

## Fiks

1. `stack-detect.mjs` → multi-språk (Python/Rust/Go/Ruby/PHP/Java) + pytest/cargo test/go test;
   rammeverk prioriterer eksakt prosjektnavn (FastAPI) over dep-substreng (flask i optional-deps).
2. `health-score.mjs` v2.3 → prosjektmanifest på tvers av språk (pyproject/setup.py/Cargo.toml/go.mod);
   Python/Rust/Go test-filer; «.env gitignoret» = N/A uten .env-filer.
3. `secret-scan.mjs` v2 → avkortede placeholders («...») + test/eksempel/fixture-filer = note, ikke lekkasje.

## Kjente gjenværende begrensninger (flagget, IKKE fikset — kandidat for v2.4)

1. **Bibliotek vs app:** Operations/Documentation-sjekkene (deploy.yml, monitoring, rollback,
   ARCHITECT.md) er app-sentriske. Et bibliotek som FastAPI scorer lavt der uten at det er «feil».
   Løsning: bibliotek-deteksjon som gjør disse N/A for bibliotek.
2. **CI-verktøy-match kun Node:** `analyzeCiCd()` verifiserer bare tsc/npm test/eslint/vitest/jest —
   ikke pytest/ruff/mypy. Ingen false positive, men ufullstendig dekning for Python.

## Leveranse

- Kunderapport: `docs/audits/audit-arch-audit-fastapi.md` + `audit-arch-audit-fastapi.evidence.json`.
- Knowledge Graph: `failures/audit-v1-node-centric.md` + `lessons/lesson-audit-language-agnostic.md`.
