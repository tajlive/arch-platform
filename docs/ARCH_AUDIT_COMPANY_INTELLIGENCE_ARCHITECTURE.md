# Arch Audit Company Intelligence Architecture

**Dato:** 2026-08-20  
**Versjon:** 1.0  
**Basert på:** P1E Fase 3 + Master Implementation Directive

---

## 1. Produktprinsipp

> Arch starter IKKE med «Fortell oss om bedriften din».
> Arch starter med «**Vi har allerede undersøkt bedriften din.**»

Pipeline:
```
Company → Public Research → Signals → Evidence → Hypothesis → Question Intelligence → Audit
```

---

## 2. Canonical Modeller

### 2.1 CompanyEntity

```typescript
interface CompanyEntity {
  company_id: string;         // UUID (canonical)
  org_number: string;         // Brønnøysund (unik)
  name: string;
  industry_code?: string;     // NACE
  industry_name?: string;
  status: "ACTIVE" | "INACTIVE" | "UNKNOWN";
  sources: string[];          // ["brreg", "regnskap", "ssb", "nav", "website"]
  confidence: "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  updated_at: string;
}
```

### 2.2 IntelligenceSignal

```typescript
interface IntelligenceSignal {
  id: string;
  company_id: string;
  source: string;             // "brreg_kunngjoring", "regnskap", "ssb", "nav", "website", "news", "doffin", ...
  signal_type: SignalType;
  description: string;        // FAKTISK observasjon, IKKE tolkning
  confidence: "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  observed_at: string;
  expires_at?: string;        // freshness/TTL
  evidence_reference: string; // lenke/hash til kilde
}

type SignalType =
  | "FINANCIAL"
  | "GROWTH"
  | "HIRING"
  | "LEGAL"
  | "NEWS"
  | "TECHNOLOGY"
  | "DIGITAL_MATURITY"
  | "CUSTOMER_FACING"
  | "COMPLIANCE"
  | "OPERATIONAL";
```

### 2.3 Signal vs Evidence (KRITISK skille)

| Lag | Semantikk | Eksempel |
|-----|-----------|----------|
| **Signal** | Observasjon fra ekstern kilde | «5 jobbannonser for kundeservice» |
| **Hypothesis** | Foreløpig antakelse | «Kan ha høy kundeservice-belastning» |
| **Question** | Spørsmål for å verifisere | «Hvor mye tid på manuell kundeservice per uke?» |
| **Verified finding** | Evidens-bekreftet | «12 t/uke manuell kundehenvendelse (E3)» |

> **Signal er IKKE sannhet.** AI skal aldri hoppe fra «mange jobbannonser» til «automatiser kundeservice» uten spørsmål + evidens.

---

## 3. Source Roadmap

### Tier 1 — Første versjon (implementert nå)

| Kilde | Hva | Signal-typer | Status |
|-------|-----|-------------|--------|
| **Brønnøysund** (Enhetsregisteret) | identitet, næring, roller, selskapsendringer, kunngjøringer | LEGAL, OPERATIONAL | ✅ Delvis (identitet + næring) |
| **Regnskap** (Regnskapsregisteret) | revenue, profit, growth, margins, employee cost | FINANCIAL, GROWTH | ⏳ Planlagt |
| **SSB** (PxWeb v2) | bransjebenchmark, størrelse, produktivitet, lønn | FINANCIAL, OPERATIONAL | ⏳ Planlagt |
| **NAV Arbeidsplassen** | jobbannonser → arbeidsoppgaver (ikke bare tittel) | HIRING | ⏳ Planlagt |
| **Website Intelligence** | CMS, teknologi, booking, webshop, skjema, kanaler, headers | TECHNOLOGY, DIGITAL_MATURITY, CUSTOMER_FACING | ⏳ Planlagt |

### Tier 2 — Advanced (dokumentert, ikke implementert)

| Kilde | Signal | Merk |
|-------|--------|------|
| **Nyheter** (NRK, E24, lokal, bransje) | vekst, investering, problemer, endringer | NEW |
| **Lovdata** | compliance-signaler («ny regulering kan påvirke dokumentasjon») | COMPLIANCE — IKKE juridisk råd |
| **Doffin** | offentlige kontrakter → vekst/compliance/rapportering | GROWTH, COMPLIANCE |
| **Patentstyret** | innovasjon, produktutvikling | TECHNOLOGY (tech-bedrifter) |

---

## 4. Source Governance

Hver kilde dokumenteres:

```typescript
interface SourceGovernance {
  source_name: string;
  license_status: string;     // "NLOD" | "CC BY 4.0" | "proprietary" | ...
  allowed_usage: string;      // hva lisensen tillater
  refresh_interval: string;   // TTL/freshness
  confidence_default: "LOW" | "MEDIUM" | "HIGH";
}
```

> **Regel:** Ingen kilde integreres uten dokumentert brukstillatelse.

---

## 5. Question Intelligence (utvidet)

AI spør KUN når:
1. Public evidence insufficient (signal er LOW/MEDIUM confidence), OG
2. Svaret kan endre audit-resultatet (expected_information_gain > terskel).

Eksempel:
- Public signal: «5 ansatte jobber med ordre»
- **IKKE spør:** «Hvor mange jobber med ordre?» (allerede kjent)
- **Spør:** «Hvor mye tid bruker teamet på manuell ordrebehandling per uke?» (reduserer usikkerhet)

---

## 6. Company X-Ray Output (gratis)

Gratisbruker ser:
```
Company: Example AS
Signals found: 18
Evidence confidence: Medium
Potential areas: Customer operations, Reporting, Manual administration
```

**Ikke vist (premium):** full ROI, prosesskart, implementeringsplan, scoring weights.

---

## 7. Full Audit Value Boundary

```
Public Intelligence (signals)
        +
Internal Evidence (documents, processes, ERP/CRM, metrics, connectors)
        =
Verified Opportunities
```

---

## 8. Proof Center — Company Intelligence metrics

| Metric | Kilde |
|--------|-------|
| Sources connected | D1 count |
| Signals discovered | D1 count |
| Evidence items | D1 count |
| Companies analyzed | D1 count |
| Questions avoided | QuestionDecision-logikk |
| Questions asked | D1 count |
| Confidence distribution | D1 aggregate |

> Aldri hardkodet. `NOT YET MEASURED` hvis ikke instrumentert.
