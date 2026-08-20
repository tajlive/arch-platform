# Arch Audit v0.1 — Production Security Foundation Complete

**Dato:** 2026-08-20  
**Status:** PRODUCTION VERIFIED

---

## Milepæl

Arch Audit har gått fra statisk Pages til en **multi-tenant AI audit-plattform med verifisert sikkerhetsfundament**.

> «Jeg designet og verifiserte en multi-tenant AI audit-plattform med evidence model, anonymous secure discovery, identity federation, tenant isolation og produksjonsgater.»

---

## Hva er verifisert i produksjon

| Lag | Status | Evidens |
|-----|--------|---------|
| **Public API** (`api.arch.axn.no`) | ✅ Live | `/health` 200, custom domain + SSL |
| **Anonymous secure discovery** | ✅ | session_id + secret credential (HttpOnly), ikke bare UUID |
| **Public Discovery** (Brønnøysund) | ✅ | company resolve + context-aware first question |
| **Identity federation** (Access → Identity → User → Membership → Tenant) | ✅ | `ctx.access.getIdentity()`, `user_identities` many-to-many |
| **Tenant isolation** (application-layer) | ✅ | 7/7 cross-tenant tester mot prod-D1 |
| **Authorization** (deterministisk) | ✅ | OWNER/ADMIN/AUDITOR/MEMBER, `authorize()` |
| **Atomisk anonymous→authenticated claim** | ✅ | `WHERE ownership_mode='ANONYMOUS'` (race-sikker) |
| **Access-beskyttelse** (path-basert) | ✅ | `/v1/tenant/*` + `/v1/internal/*` → 302 login |

---

## Security-arkitekturen (fire lag)

```
REQUEST
  → Cloudflare Access (path: /v1/tenant/*, /v1/internal/*)
  → ctx.access.getIdentity()  (user_uuid / onetimepin fallback)
  → Identity lookup  (provider, provider_subject — UNIQUE)
  → User  (via user_identities)
  → TenantMembership  (kun ACTIVE)
  → TenantContext  (server-side, aldri fra client)
  → authorize(context, action, resource)  → ALLOW/DENY
  → TenantDataAccess  (WHERE tenant_id = ? — secure by construction)
```

---

## Key Decisions (ADR-er)

| ADR | Beslutning |
|-----|-----------|
| ADR-006 | Customer auth strategy (PROVISIONAL — OTP for pilotkunder) |
| ADR-007 | `ctx.access` følger ikke Service Bindings (fremtidig begrensning) |

---

## Neste (anbefalt rekkefølge)

1. Rate limiting (Cloudflare-native — høy risiko før public scale)
2. Brønnøysund + SSB + NAV Public Discovery
3. Ekte AI Audit Consultant (LLM + trace + evals)
4. Proof Center live metrics
5. Første pilotkunde
