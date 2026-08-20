# P1E Fase 1 — Manuel Positiv Access-test (OTP)

**Status:** ✅ PASS — OWNER VERIFIED  
**Dato:** 2026-08-20

## Resultat

| Felt | Verdi |
|------|-------|
| Tidspunkt | 2026-08-20 (Tom logget inn) |
| Identity provider | onetimepin |
| provider_subject format | `onetimepin:tomarnejensen@gmail.com` |
| Tenant resolved | tenant-tom |
| Role | OWNER |
| Response | 200 JSON med user_id, tenant_id, role, permissions |

**Response (faktisk):**
```json
{
  "user_id": "user-tom",
  "tenant_id": "tenant-tom",
  "role": "OWNER",
  "permissions": ["audit:read", "audit:write", "audit:delete", "tenant:manage", "tenant:read"]
}
```

## Rotårsak (fixet underveis)

Første forsøk ga `IDENTITY_NOT_PROVISIONED`. Rotårsak: `ctx.access.getIdentity()` returnerer en `user_uuid` (Cloudflare-generert) for onetimepin, ikke `onetimepin:{epost}`. Koden brukte den som provider_subject, som ikke matchet DB-raden.

Fiks (3 lag):
1. `getAccessIdentity()` bruker `idp.type` (stabil `onetimepin`), ikke `idp.id` (UUID).
2. For onetimepin tvinges `provider_subject = onetimepin:{epost}`.
3. `resolveUser()` har epost-fallback.

## Konklusjon

Positiv path er **bruker-verifisert i produksjon**. Combined med P1C sine negative cross-tenant-tester, er Arch nå:

**TENANT ISOLATION — SECURITY VERIFIED**
