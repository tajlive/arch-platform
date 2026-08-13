# Teknisk appendix — Arch Audit arch-audit-fastapi

> **Generert:** 2026-08-13T00:43:22.192Z · **Commit:** `f336ff8` · **Repo:** `fastapi/fastapi`

> Dette dokumentet er for utviklingsteamet. Kunderapporten (audit-arch-audit-fastapi.md) er den ikke-tekniske visningen.

## 1. Arch Health Score (detalj)

**Total: 59%** (vektet: Governance 20 · Security 25 · Engineering 25 · Operations 20 · Documentation 10)

| Kategori | Score | Pass/Fail/Unknown |
|---|---|---|
| Governance | N/A | 0P / 0F / 0U |
| Security | N/A | 0P / 0F / 0U |
| Engineering | 100% | 4P / 0F / 0U |
| Operations | 25% | 1P / 3F / 0U |
| Documentation | 25% | 1P / 3F / 0U |

<details><summary>Per-sjekk (evidence + observed_at)</summary>

**Governance**
- [NOT_APPLICABLE] project.yaml — utenfor Arch-governance-scope
- [NOT_APPLICABLE] policies.yaml — utenfor Arch-governance-scope
- [NOT_APPLICABLE] agents.yaml — utenfor Arch-governance-scope
- [NOT_APPLICABLE] audit-log.md — utenfor Arch-governance-scope
- [NOT_APPLICABLE] decisions.md — utenfor Arch-governance-scope

**Security**
- [NOT_APPLICABLE] secrets registry — utenfor Arch-governance-scope
- [NOT_APPLICABLE] secrets mapping — utenfor Arch-governance-scope
- [NOT_APPLICABLE] .env gitignoret — utenfor Arch-governance-scope
- [NOT_APPLICABLE] secret-policy i policies — utenfor Arch-governance-scope

**Engineering**
- [PASS] prosjektmanifest — pyproject.toml
- [PASS] CI-workflow — .github/workflows/
- [PASS] tester tilstede — test-filer funnet
- [PASS] test-runner konfig — test-runner konfig

**Operations**
- [FAIL] deploy workflow — mangler .github/workflows/deploy.yml
- [FAIL] monitoring — ingen monitor
- [PASS] alert-integrasjon — alert-integrasjon
- [FAIL] rollback — ingen rollback

**Documentation**
- [PASS] README — README.md
- [FAIL] ARCHITECT — mangler ARCHITECT
- [FAIL] API-dokumentasjon — mangler API-docs
- [FAIL] beslutningslogg — mangler beslutningslogg (docs/adr)

</details>

> **Eksternt prosjekt:** Arch-governance-sjekker (`.arch/*`) er N/A og ekskluderes.

## 2. Arkitektur & stack

| Aspekt | Observert |
|---|---|
| Rammeverk | FastAPI |
| Språk | Python |
| Package manager | uv |
| Test-runner | pytest |
| Runtime | Python |
| Cloudflare | — |
| Supabase | — |

- (ingen)


## 3. Sikkerhet & hemmelighets-styring

| Sjekk | Resultat | Bevis |
|---|---|---|
| Secret-scan | ✅ clean | 2949 filer scannet, 0 lekkasje, 0 gitignoret note, 6 fixture/eksempel-note |
| Secret-governance (.arch/secrets) | 🟡 mangler | ingen .arch/secrets/registry.yaml |

<details><summary>Funn (fil:linje — aldri verdier)</summary>

```
[note] tests/test_tutorial/test_security/test_tutorial004.py:120 — bearer-token
[note] tests/test_tutorial/test_security/test_tutorial004.py:134 — bearer-token
[note] tests/test_tutorial/test_security/test_tutorial004.py:148 — bearer-token
[note] tests/test_tutorial/test_security/test_tutorial005.py:141 — bearer-token
[note] tests/test_tutorial/test_security/test_tutorial005.py:155 — bearer-token
[note] tests/test_tutorial/test_security/test_tutorial005.py:181 — bearer-token
```
</details>

> ⚠️ «0 funn» = ingen matchende secret-mønster i scannet filsett. Ikke en sikkerhetssertifisering.

## 4. CI/CD & engineering

| Sjekk | Resultat | Bevis |
|---|---|---|
| CI-workflows | add-to-project.yml, build-docs.yml, bump-pre-commit-hooks.yml, create-draft-release.yml, deploy-docs.yml, detect-conflicts.yml, guard-dependencies.yml, issue-manager.yml, label-approved.yml, notify-translations.yml, pre-commit.yml, prepare-release.yml, publish.yml, smokeshow.yml, sponsors.yml, test-redistribute.yml, test.yml, topic-repos.yml, translate.yml, zizmor.yml | tilstede |
| Verktøykjede-match | ✅ matcher | workflow-verktøy finnes i repo |
| Siste CI-run | success | f336ff8 · 2026-08-12T22:23:57Z |

- (ingen)


## 5. Drift & overvåking

| Sjekk | Resultat |
|---|---|
| Monitoring | 🟡 mangler |
| Alert-integrasjon | ✅ |
| Rollback | 🟡 mangler |
| Deploy-pipeline | ✅ |

| F003 | **Manglende monitoring** | Inferert anbefaling (regelavledet) | ingen monitor i workflows/scripts |
| F004 | **Manglende rollback-mekanisme** | Inferert anbefaling (regelavledet) | ingen rollback i workflow |

## 6. Dokumentasjon

| Sjekk | Resultat |
|---|---|
| README | ✅ |
| ARCHITECT | 🟡 mangler |
| API-dokumentasjon | 🟡 mangler |
| Beslutningslogg | 🟡 mangler |
## 7. Komplett funn-liste (med klasse + evidence)

| ID | Funn | Klasse | Evidence |
|---|---|---|---|
| F001 | **Ingen secret-mønster i versjonskontrollerte filer** | Automatisk funn (maskinverifisert) | 2949 filer scannet, 0 lekkasje |
| F002 | **Etablér .arch/secrets/ governance (registry + allowlist)** | Inferert anbefaling (regelavledet) | ingen .arch/secrets/registry.yaml observert |
| F003 | **Manglende monitoring** | Inferert anbefaling (regelavledet) | ingen monitor i workflows/scripts |
| F004 | **Manglende rollback-mekanisme** | Inferert anbefaling (regelavledet) | ingen rollback i workflow |
| F005 | **Automasjonsmuligheter identifisert** | Inferert anbefaling (regelavledet) | automatisk monitorering + syntetisk smoke; dokumentasjon (ARCHITECT/API-docs) |
| F006 | **Regulatorisk/juridisk vurdering (GDPR m.fl.)** | Krever menneskelig beslutning | ikke vurdert av Arch — krever kvalifisert juridisk gjennomgang |

---
_Evidensgrunnlag: hver sjekk bærer `evidence` + `observed_at`. Rå maskinlesbar JSON: `audit-arch-audit-fastapi.evidence.json`._
