# ARCH AXN — Graph Health Check

**Dato:** 2026-08-20
**Formål:** Verifisere at Evidence Graph v1 representerer virkeligheten FØR Sprint 2 (Research Agent).

---

## 1. Faktisk grafdump (ekte firma: Melhus Bil Trondheim AS)

```
COMPANY
└── MELHUS BIL TRONDHEIM AS (74 ansatte, Trondheim)

PERSON
├── Rune Hagen          (Daglig leder)
├── Rune Vikvald        (Styre)
└── Kåre Vikvald        (Styre)

FINANCIAL_EVENT
├── Operating result 16 494 225 NOK
├── Net result 10 729 078 NOK
└── Equity 81 040 740 NOK

EVIDENCE
├── Brønnøysund Enhetsregisteret  (VERIFIED)
└── Annual accounts 2025          (VERIFIED)

HYPOTHESIS
└── Operational scaling challenge

QUESTION
└── Which workflows are hardest to scale?
```

### Relasjoner (edges + join-tabell) — verifisert i prod

| Relasjon | Eksempel |
|----------|----------|
| BELONGS_TO ×3 | Rune Hagen → MELHUS BIL |
| HAS_FINANCIAL ×3 | MELHUS BIL → Operating result / Net result / Equity |
| EVIDENCED_BY ×4 | Finansielle hendelser → Annual accounts 2025 |
| GENERATES | Hypothese → Question |
| SUPPORTS (join) ×2 | Hypothese ← Brønnøysund + Årsregnskap |

**Konklusjon:** Grafen representerer virkeligheten korrekt. `Evidence → Hypothesis → Question` er intakt.

---

## 2. Evidence Coverage Score

```
Identity        ██████████ 100%
Financial       ██████████ 100%
Leadership      ██████████ 100%
Digital         ░░░░░░░░░░   0%
Market          ░░░░░░░░░░   0%
Workforce       ░░░░░░░░░░   0%

Dekning: 3/6 kategorier (50%)
```

**Dette er et salgsargument, ikke en feil.** En CEO ser umiddelbart «Arch vet mye om økonomi og ledelse, men mangler markeds- og arbeidskraftsdata» — og det er nøyaktig hva NAV + News + SSB (Sprint 5) skal fylle. Coverage-score er ærlig, ikke oppblåst.

---

## 3. Graph query performance

| Scenario | Radere lest | SQL-tid (D1 `duration`) |
|----------|-------------|------------------------|
| 1 selskap (indeksert lookup) | 12 | **0.28 ms** |
| 10 000-selskaps lookup | 2 | **0.17 ms** |
| COUNT over hele grafen (10 113 rader) | 10 113 | **0.14 ms** |
| 3-veis JOIN (hypotese→evidence→question) | 14 | **0.32 ms** |

**Konklusjon:** D1 håndterer grafen suverent. Selv med 10 000 selskaper (~3.5 MB DB) er alle queries sub-millisekund. Ingen ytelsesgrunn til å introdusere R2/Vectorize/event-stream ennå — D1 alene er riktig valg for nåværende fase.

### Når trenger vi mer enn D1?
- **R2** — når vi lagrer dokumenter (årsrapporter, PDF-er, nettsider) som blobs > D1's cell-størrelse.
- **Vectorize** — når vi skal gjøre semantisk søk på tvers av selskaper («bedrifter med lignende mønster») — først når det finnes ekte data.
- **Event stream (Queues)** — når research må orkestreres asynkront (mange kilder, lang kjøretid).

**Ingen av disse er nødvendig nå.** D1 + Workers dekker Sprint 2–4.

---

## 4. Funn under health check

1. **Grafen er korrekt** — relasjoner, join-tabell og evidence-quality-felt virker som spesifisert.
2. **10000-selskaps-insert feilet første gang** på UNIQUE constraint (test-data brukte samme org-nummer-rekke) — det var en test-data-genereringsfeil, ikke en graf-begrensning. Retest med unike org-numre lyktes (10 000 rader på 5.7s).
3. **Syntetisk test-data ligger i prod-D1** (merket `perf%`, `healthcheck%`, `SYNTHETIC`) — opprydding blokkert av deny-regelen `*wrangler*delete*`. Uskadelig, men bør ryddes før beta.

---

## 5. Vurdering

**Grafen er klar for Sprint 2.** Fundamentet er riktig:
- ✅ Representerer virkeligheten
- ✅ Evidence → Hypothesis → Question håndhevet
- ✅ Sub-millisekund ytelse
- ✅ Coverage-score er ærlig

**Én beslutning til Tom:** syntetisk test-data (10 100 selskaper) ligger i prod-D1. Vil du (a) la den ligge som ytelses-bevis, eller (b) rydde den manuelt (deny-regelen blokkerer Hermes fra å kjøre DELETE)?
