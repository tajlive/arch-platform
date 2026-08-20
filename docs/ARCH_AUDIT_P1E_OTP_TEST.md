# P1E Fase 1 — Manuel Positiv Access-test (OTP)

**Status:** AWAITING OWNER VERIFICATION  
**Dato:** 2026-08-20

## Hvorfor manuell

`ctx.access.getIdentity()` returnerer identitet kun når en ekte bruker har fullført Cloudflare Access-login. Dette kan ikke automatiseres uten Toms faktiske OTP-interaksjon (e-posten går til ham).

## Testprosedyre

1. Åpne i nettleser (inkognito, ny session):
   ```
   https://api.arch.axn.no/v1/tenant/me
   ```

2. Forventet: Cloudflare Access login-side (tomarnejensen.cloudflareaccess.com).

3. Skriv inn `tomarnejensen@gmail.com` → «Send login code».

4. Motta OTP på e-post → skriv inn koden.

5. Etter login: forventet JSON-respons:
   ```json
   {
     "user_id": "user-tom",
     "tenant_id": "tenant-tom",
     "role": "OWNER",
     "permissions": ["audit:read", "audit:write", "audit:delete", "tenant:manage", "tenant:read"]
   }
   ```

## Dokumenter (fylles ut ved test)

| Felt | Verdi |
|------|-------|
| Tidspunkt | (fylles inn) |
| Identity provider | onetimepin |
| provider_subject format | `onetimepin:tomarnejensen@gmail.com` |
| Tenant resolved | tenant-tom (forventet) |
| Role | OWNER (forventet) |
| Response | (fylles inn — forventet 200 JSON) |

## Ikke fake PASS

Før Toms faktiske login er verifisert, er positiv path **infrastruktur-verifisert men IKKE bruker-verifisert**. Proof Center viser dette ærlig.
