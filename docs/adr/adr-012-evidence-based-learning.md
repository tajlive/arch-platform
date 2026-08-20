# ADR-012 — Evidence-Based Learning Architecture

**Status:** ACCEPTED  
**Dato:** 2026-08-20

## Context

Arch går inn i lukket beta. Betaen skal ikke bare teste at produktet fungerer — den skal begynne å bygge den viktigste konkurransefordelen: en målt læringssløyfe.

## Decision

1. **Arch forbedres gjennom målte resultater, ikke ukontrollert trening.**
2. Canonical learning loop: `Signal → Evidence → Hypothesis → QuestionDecision → Finding → Recommendation → Implementation → Measured Outcome → Learning`.
3. **Ingen læring uten kobling tilbake til evidens** (`evidence_reference` på hver learning event).
4. Tre harde kunnskapsskiller:
   - **Tenant Knowledge** — isolert, aldri brukt på andre kunder uten godkjenning.
   - **Anonymous Industry Intelligence** — aggregert, n ≥ 10, ingen identifiserbar data.
   - **Arch General Intelligence** — tverrgående mønstre (Question Intelligence).
5. **Ingen automatisk modelltrening på rå kundedata.**

## Konsekvenser

- Nye tabeller: `learning_events`, `outcome_measurements` (migrasjon 0003).
- Prediction accuracy måles som `actual / expected` per finding.
- Moaten blir: verifiserte sammenhenger mellom signaler, prosesser, anbefalinger og faktiske resultater — ikke «nyeste modell».
