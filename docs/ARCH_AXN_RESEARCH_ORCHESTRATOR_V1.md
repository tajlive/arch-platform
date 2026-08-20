# ARCH AXN — Research Orchestrator v1

**Dato:** 2026-08-20
**Status:** Implementert i `apps/arch-audit-api`

## Governance-regel

Collectors skriver ikke direkte til D1 eller Evidence Graph.

Kanonisk flyt:

```text
Collectors
  -> RawEvidence
  -> EvidenceValidator
  -> Company Intelligence Graph
```

## Quality gate

`EvidenceValidator` avviser evidence før graph-build når:

- `source` mangler
- `observed_at` mangler
- `confidence` mangler
- `observation` er tom
- samme source/type/observation/freshness allerede finnes i batchen

Dette håndhever regelen: ingen evidence uten kilde, timestamp og confidence.

## API-kontrakt

Eksisterende public intelligence-kontrakt er beholdt. `identity`, `leadership`,
`financial`, `digital`, `sources` og `evidence_map` ligger fortsatt på samme sted.

Sprint 2 legger additivt til `intelligence.graph`, som inneholder validert evidence,
avvist evidence og coverage-tall. Grafen er observation-first og inneholder ikke
anbefalinger.
