# Arch Audit Learning Evals

**Dato:** 2026-08-20

---

## Evaluering av læringssløyfen

Arch evaluerer ikke bare produktet — den evaluerer **om læringen er korrekt**.

### 1. Prediction Accuracy

| Spørsmål | Mål |
|----------|-----|
| Hvor ofte traff Arch? | `actual_value / expected_value` per finding |
| Eksempel | Est. 20 t/mnd → faktisk 14 t/mnd = 70 % accuracy |

**Terskel:** Prediction accuracy under 50 % (systematisk overestimering) utløser review av ROI-modellen.

### 2. Evidence Quality

| Spørsmål | Mål |
|----------|-----|
| Var anbefalingen basert på riktig grunnlag? | Evidens-nivå (E1-E4) + confidence |
| Hadde findingen `evidence_reference`? | Obligatorisk — 100 % krav |

### 3. Outcome Realization

| Spørsmål | Mål |
|----------|-----|
| Ble forventet verdi realisert? | outcome_measurements (expected vs actual) |
| Hvor mange recommendations ble faktisk implementert? | IMPLEMENTATION_STARTED events |

### 4. User Feedback

| Spørsmål | Mål |
|----------|-----|
| Var kunden enig? | RECOMMENDATION_ACCEPTED rate |
| Hvilke funn opplevdes relevante? | kunde-feedback (kvalitativ, beta) |

---

## Beta-måling (3-5 bedrifter)

| Metric | Min. mål | Status |
|--------|----------|--------|
| Audits completed | 5 | NOT YET MEASURED |
| Evidence items collected | 50+ | NOT YET MEASURED |
| Findings verified | 20+ | NOT YET MEASURED |
| Recommendations accepted | 10+ | NOT YET MEASURED |
| Outcomes measured | 3 | NOT YET MEASURED |
| Prediction accuracy | — | NOT YET MEASURED |

---

## Prinsipp

> Læring skal kunne **bevises** — hver lærings-kant har `evidence_reference`. Ingen læring uten kobling tilbake til evidens. Ingen automatisk trening på rå kundedata.
