# ADR-008 — Company Intelligence Architecture

**Status:** ACCEPTED  
**Dato:** 2026-08-20

## Context

Arch må gå fra «Fortell oss om bedriften» til «Vi har allerede undersøkt bedriften». Dette krever en Company Intelligence Engine som bygger PublicCompanyContext fra eksterne kilder før samtalen starter.

## Decision

- **Signal-modell** (IntelligenceSignal): hver ekstern kilde blir et signal med provenance, confidence, freshness.
- **Signal ≠ Evidence:** signaler er observasjoner, ikke sannhet. AI går alltid Signal → Hypothesis → Question → Verified finding.
- **Canonical CompanyEntity:** `org_number` er unik nøkkel (Brønnøysund).
- **Question Intelligence:** spør kun når public evidence insufficient OG svaret endrer resultatet.

## Konsekvenser

- Alle kilder går gjennom SourceGovernance (license, usage, refresh, confidence).
- Free boundary: public signals vises gratis; full ROI/prosesskart er premium.
