# ADR-007 — ctx.access og Service Binding-begrensning

**Status:** ACCEPTED  
**Dato:** 2026-08-20

---

## Context

Arch bruker Cloudflare Workers Access (`ctx.access.getIdentity()`) for protected `/v1/tenant/*` og `/v1/internal/*` namespace.

## Decision

1. **Native `ctx.access` er autoritativ** for Access-autentiserte Worker-requests. Ingen egen JWT-parsing av `Cf-Access-Jwt-Assertion`/`CF_Authorization`/email-headers.
2. **Secure-by-construction guard:** protected handler nekter dersom `ctx.access` mangler. Dette lukker workers.dev/preview/custom-domain bypass uavhengig av Access-policy-konfigurasjon.
3. **Identity-nøkkel = `user_uuid`** (stabil provider subject), IKKE email. Email er attribute.

## Viktig fremtidig begrensning

`ctx.access` følger **ikke** automatisk gjennom Worker Service Bindings eller RPC.

Hvis Arch senere splittes i flere Workers, må downstream Worker **ikke** anta at brukeridentiteten er kjent. Da må én eksplisitt strategi velges:
- re-authentication through protected hostname
- scoped service identity
- signed internal context
- service token

Ikke implementert nå (én Worker). ADR-note for å unngå å glemme.

## Konsekvenser

- `identity(provider, provider_subject, email) → User` med `user_identities` join-tabell (mange-til-mange).
- Tenant membership er autoritativ: kun `ACTIVE` gir tilgang. `INVITED`/`SUSPENDED`/`REVOKED` nektes.
- tenant_id fra client er et ØNSKE om context, aldri autorisasjon.
