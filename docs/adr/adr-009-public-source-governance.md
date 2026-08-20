# ADR-009 — Public Source Governance

**Status:** ACCEPTED  
**Dato:** 2026-08-20

## Context

Arch henter offentlige data fra Brønnøysund, SSB, NAV m.fl. Hver kilde har egen lisens og bruksbetingelser.

## Decision

Ingen kilde integreres uten dokumentert:
- `source_name`
- `license_status` (NLOD, CC BY 4.0, proprietary, ...)
- `allowed_usage`
- `refresh_interval` (TTL)
- `confidence_default`

## Lisensoversikt (verifisert)

| Kilde | Lisens | Bruk |
|-------|--------|------|
| Brønnøysund Enhetsregisteret | NLOD (Norsk lisens for offentlige data) | Tillatt, attribusjon |
| Regnskapsregisteret | NLOD | Tillatt |
| SSB PxWeb API v2 | CC BY 4.0 | Tillatt, attribusjon |
| NAV Arbeidsplassen | Kostnadsfri API, analytisk bruk | Tillatt |
| Lovdata | Begrenset | Kun compliance-signal, IKKE juridisk råd |

## Konsekvenser

- Adaptere må bære SourceGovernance-metadata.
- Ny kilde krever governance-dokumentasjon FØR integrasjon.
