# Arch Audit Production Readiness Report v0.1

**Dato:** 2026-08-20  
**Forfatter:** Principal Engineer (Hermes)  
**Beslutning:** NOT READY for bred offentlig lansering — **READY for lukket beta (3-5 bedrifter)**

---

## FASE 0 — STATUSAUDIT (verifisert, ikke antatt)

### Infrastruktur

| Komponent | Status | Detalj |
|-----------|--------|--------|
| Cloudflare Pages | ✅ Live | `arch-platform` → `arch.axn.no` |
| Worker | ✅ Live | `arch-audit-api` → `api.arch.axn.no` (version `d6cd40f9`) |
| D1 | ✅ Live | `arch-audit` (`3a2bbd50`) — 10 tabeller, migrasjoner 0001+0002 |
| R2 | ⏸ Ingen Arch-bucket | korrekt (ikke nødvendig ennå) |
| DNS | ✅ | `arch.axn.no` + `api.arch.axn.no` (Cloudflare, proxied) |
| SSL | ✅ | Google Trust Services, gyldig til 18. nov 2026 |
| Bindings | ✅ | DB, RATE_LIMITER (DO), ENVIRONMENT, PUBLIC_ORIGIN |
| Secrets | ✅ | Ingen literal secrets i repo (BWS + wrangler secrets) |

### Backend routes (verifisert i kildekode)

Public (ingen auth): `/health`, `/v1/public/audit/session` (POST), `/v1/public/audit/session/:id` (GET), `/v1/public/company/resolve` (POST), `/v1/public/audit/question` (POST), `/v1/public/demo/company` (GET)

Protected (Access + membership): `/v1/tenant/me`, `/v1/tenant/context`, `/v1/tenant/audits` (GET/POST), `/v1/tenant/audits/:id` (GET), `/v1/tenant/session/claim` (POST), `/v1/internal/*`

### Security (verifisert)

| Kontroll | Status |
|----------|--------|
| Cloudflare Access | ✅ path-basert (tenant + internal) |
| Identity resolution | ✅ user-verifisert (OTP → OWNER) |
| Tenant isolation | ✅ 7/7 cross-tenant |
| Session security | ✅ id + secret credential |
| Rate limiting | ✅ Durable Object global (429) |
| CORS | ✅ origin-låst (ikke `*`) |
| Security headers | ✅ HSTS, X-Frame-Options, nosniff (NY i denne gaten) |
| Input validation | ✅ query-lengde, JSON-parsing, whitelist i update |

---

## FASE 1 — POSITIVE LOGIN VERIFICATION

| Rolle | Status |
|-------|--------|
| OWNER | ✅ Verifisert (Tom logget inn, resolved OWNER/tenant-tom) |
| MEMBER | ⏸ Unit-testet (permission model), ikke manuelt logget inn |
| AUDITOR | ⏸ Unit-testet, ikke manuelt |
| Revoked user | ✅ Verifisert (DB: ingen ACTIVE membership → DENY) |
| Missing membership | ✅ Verifisert (NO_MEMBERSHIP → 403) |

**Merk:** OWNER er bruker-verifisert. MEMBER/AUDITOR er deterministisk unit-testet (permissionsFor + authorize), men har ikke dedikert OTP-identity. For lukket beta er dette akseptabelt — roller testes med første ekte medlem.

---

## FASE 2-9 — DOKUMENTASJON (alle skrevet)

- ✅ `ARCH_AUDIT_AUTHENTICATION_STRATEGY.md` (Fase 2)
- ✅ `ARCH_AUDIT_CUSTOMER_EXPERIENCE.md` (Fase 3)
- ✅ Demo mode: `Nordic Service AS` (syntetisk) + `/v1/public/demo/company` (Fase 4)
- ✅ Observability: strukturert logging + NOT YET MEASURED-markering (Fase 5)
- ✅ `ARCH_AUDIT_INCIDENT_RESPONSE.md` (Fase 6)
- ✅ `/privacy`, `/security`, `/terms`, `/data-sources` (Fase 7)
- ✅ `ARCH_AUDIT_FREE_VS_PAID.md` (Fase 8)
- ✅ `ARCH_AUDIT_PRODUCTION_CHECKLIST.md` (Fase 9)

---

## FASE 10 — RELEASE DECISION

### **NOT READY** for bred offentlig lansering

### Blocker (før bred lansering)

| # | Blocker | Konsekvens |
|---|---------|-----------|
| B1 | **Ingen automatisk alerting** (Sentry/CF Notifications) | Feil i produksjon oppdages ikke proaktivt |
| B2 | **Personal OAuth ikke satt opp** (kun onetimepin) | Selvbetjening for kunder umulig |
| B3 | **Priser ikke validert** med reell kunde | Risiko for feilprising |
| B4 | **D1 backup ikke kjørt ennå** (prosedyre finnes) | Ingen restore-bevis |
| B5 | **Rollback ikke testet** (prosedyre finnes) | Ukjent recovery-tid |

### Risiko (ikke-blocker, men bør adresseres)

| # | Risiko | Nivå |
|---|--------|------|
| R1 | Rate limiting per-IP (angriper med mange IP-er kan spre) | Medium |
| R2 | Kunngjøringer-endepunkt (Brønnøysund) ikke funnet | Lav |
| R3 | SSB/NAV/Regnskap ikke implementert (X-Ray-grunn) | Medium |

### Anbefalt handling

**Lukk den lukkede betaen (3-5 bedrifter) NÅ** med:
- onetimepin + manuell onboarding (ikke selvbetjening)
- manuell monitoring via `wrangler tail`
- prisvalidering med ekte kunder

Dette gir Arch ekte data, ekte spørsmål og ekte forbedringspunkter uten omdømmerisiko.

---

## Konklusjon

Arch er teknisk langt forbi prototype, men er **ikke klar for bred offentlig lansering**. De fem blocker-ene (alerting, OAuth, prisvalidering, backup-test, rollback-test) er alle adresserbare, men krever verifisering før vi åpner dørene.

**Arkitekturen er solid.** Security foundation er bruker-verifisert. Det som gjenstår er operasjonell modenhet — ikke bygging av nye features.
