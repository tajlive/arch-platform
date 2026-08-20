# ADR-010 — Signal vs Evidence Model

**Status:** ACCEPTED  
**Dato:** 2026-08-20

## Context

Eksterne kilder (jobbannonser, regnskap, nettside) gir observasjoner. AI må ikke forveksle observasjon med sannhet.

## Decision

Firedelt modell:
1. **Signal** — observasjon («5 jobbannonser for kundeservice»)
2. **Hypothesis** — antakelse («kan ha høy kundeservice-belastning»)
3. **Question** — verifiseringsspørsmål («hvor mye tid på manuell kundeservice?»)
4. **Verified finding** — evidens-bekreftet (E3/E4)

AI går ALLTID Signal → Hypothesis → Question → Verified finding. Aldri Signal → konklusjon.

## Konsekvenser

- IntelligenceSignal har `evidence_reference` (kilde-lenke/hash), aldri konklusjon.
- `description` er faktisk observasjon, ikke tolkning.
- Dette er kjernen i «AI som vet når den mangler evidens».
