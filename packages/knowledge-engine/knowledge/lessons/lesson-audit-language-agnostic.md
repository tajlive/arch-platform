# Lesson: Skannere må være språk-agnostiske og fixture-bevisste

**Regel:** Enhver Arch-detektor (stack, health, secret, CI-match) MÅ (1) gjenkjenne
manifest/test-runner på tvers av språk (pyproject.toml/pytest/Cargo.toml/go.mod — ikke bare
package.json/vitest/jest), og (2) klassifisere credential-lignende treff i test/eksempel/
fixture-filer og avkortede placeholders («...») som NOTE, ikke lekkasje.

**Hvorfor:** Generality-test på fastapi ga false «JavaScript / ingen test-runner / 6 critical
leaks». Se failure: `audit-v1-node-centric.md`.

**Sjekkliste:**
1. Språk: pyproject.toml/setup.py/requirements.txt (Python), Cargo.toml (Rust), go.mod (Go), ...
2. Test-runner: pytest/tox/conftest.py (Python), cargo test, go test — ikke bare vitest/jest/playwright.
3. Secret-scan: test/eksempel/fixture-stier + «...»-placeholders = note; aldri rapporter som lekkasje.
4. .env-gitignoret = N/A når prosjektet verken har .env-filer eller er Arch-styrt.
5. Verifiser på et reelt fremmedspråklig repo FØR det kalles «språk-agnostisk».
