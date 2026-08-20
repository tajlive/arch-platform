# Arch Audit Learning Architecture v0.1

**Dato:** 2026-08-20  
**Rolle:** Principal AI Platform Architect

---

## 1. Kjerneinnsikt

> Arch skal ikke lære fordi den får mer data. Arch skal lære fordi den får **verifisert feedback mellom signal, beslutning, handling og resultat.**

**Ingen automatisk modelltrening basert på rå kundedata.**

## 2. Moat

Arch sin konkurransefordel er IKKE «nyeste modell» (modeller kan kopieres).

Moaten er:
> **En voksende database av verifiserte sammenhenger mellom virksomhetssignaler, prosesser, AI-anbefalinger og faktiske resultater.**

Det er mye vanskeligere å kopiere.

---

## 3. Canonical Learning Loop

```
Public Signal
      ↓
Evidence
      ↓
Hypothesis
      ↓
QuestionDecision
      ↓
Finding
      ↓
Recommendation
      ↓
Implementation
      ↓
Measured Outcome
      ↓
Learning
```

**Ingen læring uten kobling tilbake til evidens.** Hver lærings-kant i grafen har `evidence_reference`.

---

## 4. Tre typer kunnskap (harde skiller)

### A. Tenant Knowledge (KUN én kunde)

```yaml
Firma A:
  Prosess: Ordrebehandling
  System: ERP X
  Problem: Manuell registrering
  Tiltak: Integrasjon
  Resultat: -20 timer/mnd
```

**Regel:** Skal ALDRI brukes på andre kunder uten eksplisitt godkjenning. Lagres med `tenant_id` og cross-tenant-isolasjon (allerede implementert).

### B. Anonymous Industry Intelligence (aggregert)

```yaml
Bransje: Bilverksted
  Antall analyser: 57
  Vanlige signaler: [Telefonbooking, Manuell faktura, Kundeoppfølging]
  Bekreftet verdi: (ingen identifiserbare data)
```

**Regel:** Kun aggregerte, anonymiserte data. Minimum cohort (n ≥ 10) før publisering. Ingen tenant-identifikator.

### C. Arch General Intelligence (generelle mønstre)

```yaml
Spørsmål: "Hvor mange timer bruker dere på manuell ordrebehandling?"
  Høy informasjonsverdi innen: [handel, service, logistikk]
```

**Regel:** Tverrgående mønstre uten tenant-spesifikke data. Dette er det eneste som kan forbedre Question Intelligence globalt.

---

## 5. Learning Entities (canonical modeller)

### LearningEvent

```typescript
interface LearningEvent {
  id: string;
  tenant_id: string | null;   // null = anonymous/aggregated
  type: LearningEventType;
  source: string;             // hvilken pipeline-kilde
  created_at: string;
}

type LearningEventType =
  | "QUESTION_ANSWERED"
  | "FINDING_CREATED"
  | "RECOMMENDATION_ACCEPTED"
  | "IMPLEMENTATION_STARTED"
  | "OUTCOME_MEASURED";
```

### OutcomeMeasurement

```typescript
interface OutcomeMeasurement {
  id: string;
  finding_id: string;          // FK → finding
  expected_value: number;      // estimert (f.eks. 20 timer/mnd)
  actual_value: number;        // faktisk (f.eks. 14 timer/mnd)
  unit: string;                // "timer/mnd", "kr/år"
  measurement_method: string;  // hvordan målt (kunde-rapportert, system-metrisk)
  confidence: "LOW" | "MEDIUM" | "HIGH";
  measured_at: string;
}

// Prediction accuracy = actual_value / expected_value (14/20 = 70%)
```

---

## 6. Question Intelligence (utvidelse)

Mål for hvert spørsmål:
- spørsmål stilt
- spørsmål unngått (sparsomhet — public data dekket det)
- informasjonsgevinst (endret svaret resultatet?)
- hvor ofte svaret endret resultatet
- hvilke spørsmål ga faktisk verdi

**QuestionDecision** (allerede implementert) utvides med `learning_impact` felt senere.

---

## 7. Recommendation Intelligence

Ikke lær «dette fungerer alltid». Lær:

```yaml
Recommendation pattern:
  Context: SMB
  Bransje: Service
  Evidence: Høy
  Success rate: 67%
```

Kun mønstre med tilstrekkelig sample size (ikke 3 datapunkter = trend).

---

## 8. Privacy Boundaries

| Data | Tillatt i læring? |
|------|-------------------|
| Tenant-spesifikke prosesser/systemer | Kun Tenant Knowledge (isolert) |
| Aggregert bransjedata (n ≥ 10) | Anonymous Industry Intelligence |
| Generelle spørsmålsmønstre | Arch General Intelligence |
| Personopplysninger | **Aldri** i læring |
| Konfidensiell kundedata | **Aldri** uten behov |

---

## 9. Beta Data Strategy (3-5 bedrifter)

**Samle:**
- hvilke spørsmål de svarer på
- hvilke funn som oppleves relevante
- hvilke anbefalinger de godtar
- hvilke tiltak de faktisk gjennomfører
- outcome measurements (forventet vs faktisk verdi)

**Ikke samle:**
- unødvendige personopplysninger
- konfidensiell kundedata uten behov

---

## 10. Beta Success Criteria (før offentlig lansering)

| Kriterium | Minimum |
|-----------|---------|
| Bedrifter analysert | 5 |
| Evidence objects | 50+ |
| Findings | 20+ |
| Recommendations | 10+ |
| Outcome measurements | 3 |

---

## 11. Outcome Tracking

Hver Recommendation → Implementation → Measured Outcome gir en prediction-accuracy-datapunkt. Over tid bygger dette Arch sin unike evidens for «hvilke anbefalinger som faktisk gir verdi».

**Dette er forskjellen mellom å selge AI og å selge målte resultater.**
