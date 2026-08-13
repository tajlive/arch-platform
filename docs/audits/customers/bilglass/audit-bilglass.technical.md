# Teknisk appendix — Arch Audit bilglass

> **Generert:** 2026-08-13T00:43:07.516Z · **Commit:** `52a5232c` · **Repo:** `autoglassnorge/autoglassgrossisten`

> Dette dokumentet er for utviklingsteamet. Kunderapporten (audit-bilglass.md) er den ikke-tekniske visningen.

## 1. Arch Health Score (detalj)

**Total: 91%** (vektet: Governance 20 · Security 25 · Engineering 25 · Operations 20 · Documentation 10)

| Kategori | Score | Pass/Fail/Unknown |
|---|---|---|
| Governance | N/A | 0P / 0F / 0U |
| Security | 100% | 1P / 0F / 0U |
| Engineering | 100% | 4P / 0F / 0U |
| Operations | 75% | 3P / 1F / 0U |
| Documentation | 75% | 3P / 1F / 0U |

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
- [PASS] .env gitignoret — .gitignore
- [NOT_APPLICABLE] secret-policy i policies — utenfor Arch-governance-scope

**Engineering**
- [PASS] prosjektmanifest — package.json
- [PASS] CI-workflow — .github/workflows/
- [PASS] tester tilstede — test-filer funnet
- [PASS] test-runner konfig — test-runner konfig

**Operations**
- [PASS] deploy workflow — .github/workflows/deploy.yml
- [PASS] monitoring — monitor tilstede
- [PASS] alert-integrasjon — alert-integrasjon
- [FAIL] rollback — ingen rollback

**Documentation**
- [PASS] README — README.md
- [FAIL] ARCHITECT — mangler ARCHITECT
- [PASS] API-dokumentasjon — docs/api
- [PASS] beslutningslogg — docs/adr/

</details>

> **Eksternt prosjekt:** Arch-governance-sjekker (`.arch/*`) er N/A og ekskluderes.

## 2. Arkitektur & stack

| Aspekt | Observert |
|---|---|
| Rammeverk | React (SPA) |
| Språk | TypeScript |
| Package manager | npm |
| Test-runner | vitest + playwright |
| Runtime | Cloudflare |
| Cloudflare | wrangler.toml (api/cf-worker/wrangler.toml), wrangler.toml (frontend/wrangler.toml), Cloudflare Workers (dep) |
| Supabase | — |

- (ingen)


## 3. Sikkerhet & hemmelighets-styring

| Sjekk | Resultat | Bevis |
|---|---|---|
| Secret-scan | ✅ clean | 9276 filer scannet, 0 lekkasje, 2 gitignoret note |
| Secret-governance (.arch/secrets) | 🟡 mangler | ingen .arch/secrets/registry.yaml |

<details><summary>Funn (fil:linje — aldri verdier)</summary>

```
[note] .venv-pdf/lib/python3.14/site-packages/PIL/ImageFont.py:1246 — aws-key
[note] .venv-pdf/lib/python3.14/site-packages/cryptography/hazmat/primitives/serialization/ssh.py:78 — private-key
```
</details>

> ⚠️ «0 funn» = ingen matchende secret-mønster i scannet filsett. Ikke en sikkerhetssertifisering.

## 4. CI/CD & engineering

| Sjekk | Resultat | Bevis |
|---|---|---|
| CI-workflows | bovsoft-kv-sync.yml, d1-migrate.yml, d1-nordglass-import.yml, d1-position-migration.yml, daily-price-check.yml, daily-scrape.yml, daily-svv-bruteforce.yml, deploy-mirror.yml, deploy.yml, scrape-catalog.yml, sync-d1-catalog.yml, tecdoc-import.yml, uptime.yml, verify.yml | tilstede |
| Verktøykjede-match | ✅ matcher | workflow-verktøy finnes i repo |
| Siste CI-run | success | 806467c · 2026-08-12T23:30:34Z |

- (ingen)


## 5. Drift & overvåking

| Sjekk | Resultat |
|---|---|
| Monitoring | ✅ |
| Alert-integrasjon | 🟡 mangler |
| Rollback | 🟡 mangler |
| Deploy-pipeline | ✅ |

| F003 | **Manglende alert-integrasjon** | Inferert anbefaling (regelavledet) | ingen alert/escalation i workflows/scripts |
| F004 | **Manglende rollback-mekanisme** | Inferert anbefaling (regelavledet) | ingen rollback i workflow |

## 6. Dokumentasjon

| Sjekk | Resultat |
|---|---|
| README | ✅ |
| ARCHITECT | 🟡 mangler |
| API-dokumentasjon | ✅ |
| Beslutningslogg | 🟡 mangler |
## 7. Komplett funn-liste (med klasse + evidence)

| ID | Funn | Klasse | Evidence |
|---|---|---|---|
| F001 | **Ingen secret-mønster i versjonskontrollerte filer** | Automatisk funn (maskinverifisert) | 9276 filer scannet, 0 lekkasje |
| F002 | **Etablér .arch/secrets/ governance (registry + allowlist)** | Inferert anbefaling (regelavledet) | ingen .arch/secrets/registry.yaml observert |
| F003 | **Manglende alert-integrasjon** | Inferert anbefaling (regelavledet) | ingen alert/escalation i workflows/scripts |
| F004 | **Manglende rollback-mekanisme** | Inferert anbefaling (regelavledet) | ingen rollback i workflow |
| F005 | **Automasjonsmuligheter identifisert** | Inferert anbefaling (regelavledet) | alert-routing til eier (Linear/Discord); dokumentasjon (ARCHITECT/API-docs) |
| F006 | **Regulatorisk/juridisk vurdering (GDPR m.fl.)** | Krever menneskelig beslutning | ikke vurdert av Arch — krever kvalifisert juridisk gjennomgang |

---
_Evidensgrunnlag: hver sjekk bærer `evidence` + `observed_at`. Rå maskinlesbar JSON: `audit-bilglass.evidence.json`._
