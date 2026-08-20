# ADR-006 — Customer Authentication Strategy

**Status:** PROVISIONAL  
**Dato:** 2026-08-20

---

## Context

Arch har tre security zones: PUBLIC (`arch.axn.no`), PUBLIC API (`api.arch.axn.no`), og SECURE APPLICATION (`app.arch.axn.no` — ennå ikke opprettet).

Den anonyme gratis AI-auditen må fungere UTEN login (produktkrav). Betalende kunder trenger derimot identity/tenant-isolasjon.

## Decision

- **Anonym audit:** `api.arch.axn.no/v1/public/*` uten Cloudflare Access. Session-security via `session_id + secret credential` (HttpOnly cookie), IKKE bare UUID.
- **Intern administrasjon:** Cloudflare Access (OTP eller godkjent IdP) straks dashboard finnes.
- **Første pilotkunder:** Cloudflare Access OTP / godkjent IdP (MVP-valg).
- **Permanent public customer identity-system:** IKKE valgt ennå.

## Konsekvenser

Identity-modell: `Identity → User → TenantMembership → Tenant`. Email er identity-attributt, IKKE tenant-identifikator.

## Åpne spørsmål (evalueres før permanent valg)

self-service signup, invitations, multiple users per company, passwordless UX, account recovery, tenant switching, billing, B2B SSO.

## Status

PROVISIONAL — revurderes når secure customer workspace skal bygges.
