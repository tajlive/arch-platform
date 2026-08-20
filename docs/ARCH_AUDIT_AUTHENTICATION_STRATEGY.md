# Arch Audit Authentication Strategy

**Dato:** 2026-08-20  
**Status:** ACCEPTED (PROVISIONAL for personal OAuth)

---

## 1. Tre brukertyper

| Brukertype | Autentisering | Konto | Formål |
|-----------|---------------|-------|--------|
| **Public user** | Ingen | Ingen | Gratis Company X-Ray + funn |
| **Personal account** | OAuth (Google/Microsoft/LinkedIn) | Ja (Identity→User) | Lagre audits, upgrade til Full |
| **Enterprise** | Microsoft Entra ID / SSO | Ja (TenantMembership) | Multi-bruker, full audit, connectors |

## 2. Public (ingen konto)

```
Company Search → Public X-Ray → Free findings
```
Ingen login. Anonymous AuditSession med session credential (allerede implementert).

## 3. Personal OAuth

**Valgte IdP-er (rekkefølge):**
1. **Google** — bred dekning, enkel OIDC
2. **Microsoft** — enterprise-tilstøtende
3. **LinkedIn** — B2B-kontekst (senere)

**Flow:**
```
OAuth → IdP subject (user_uuid/sub) → Identity → User → TenantMembership → Tenant
```

**Viktig:** `Identity(provider, provider_subject, email)`. Email er attribute, aldri primary key. Allerede implementert (P1C).

## 4. Enterprise SSO (Microsoft Entra ID)

- Én organisasjon = én Tenant.
- Multiple users via `tenant_memberships`.
- OWNER/ADMIN/MEMBER roller (allerede implementert).

## 5. Anonymous → Authenticated conversion

Allerede implementert (P1C §25-26): atomisk claim av anonymous session krever BÅDE valid session credential OG authenticated identity.

## 6. Cloudflare Access rolle

- **Public + personal OAuth:** OAuth håndteres av vår egen Identity → User → Membership-løsning (IKKE Access-grupper).
- **Internal/admin:** Cloudflare Access (OTP) — allerede aktiv.
- **Enterprise:** Entra ID som OIDC-IdP.

## 7. Hva gjenstår

| Element | Status |
|---------|--------|
| onetimepin (internal) | ✅ Live |
| Google OIDC | ⏳ Må settes opp (OAuth-consent + IdP) |
| Microsoft OIDC | ⏳ Må settes opp |
| LinkedIn OIDC | ⏳ Senere |
| Entra ID SSO | ⏳ Senere (enterprise) |

**Anbefaling:** Før lukket beta (3-5 bedrifter) er onetimepin (Access) + manuell onboarding tilstrekkelig. Personal OAuth (Google) settes opp når vi åpner for selvbetjening.
