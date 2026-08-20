# ARCH AXN — Evidence Graph v1 Architecture Review

**Dato:** 2026-08-20
**Rolle:** Principal Data Architect
**Status:** REVIEW — for godkjenning FØR implementering (ingen kode bygget)

> Fase 0 leveranse. Formål: erstatte flat `company_context` JSON-blob med en **Evidence Graph** som blir kjernen i ARCH AXN.

---

## 1. Formål og grense

**Problem (dagens begrensning):**
```json
{ "company": "", "employees": "", "revenue": "" }
```
Flat. Ingen relasjoner. Ingen historikk. Ingen «hva støtter hva».

**Mål:** Et relasjonsnettverk som lar Arch svare på *«hva vet vi, og hva støtter det?»* — ikke bare *«hvilke felter fant vi?»*.

**Grense (Fase 0):**
- ✅ Bygg kun graf-fundamentet (tabeller + TypeScript-modeller)
- ❌ Ingen nye eksterne datakilder
- ❌ Ingen AI-agenter ennå
- ❌ Ingen UI-endringer
- ❌ Ingen anbefalinger (Recommendation eksisterer IKKE i grafen)

---

## 2. Graph Model

```
                        COMPANY
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
       PERSON        FINANCIAL_EVENT      SIGNALS
          │                │            (DIGITAL / MARKET / WORKFORCE)
       CEO/Board       Revenue        ┌──────┴──────┐
       Owners          Margin         │             │
                       Debt        Digital       Market
                                   Signal        Signal
                           │
                      EVIDENCE (kilden — bæres av hver node)
                           │
                 ┌─────────┴─────────┐
                 │                   │
             HYPOTHESIS          QUESTION
         (støttes av evidens)   (manglende kunnskap)
```

**Kjerneregel (uforanderlig):**
```
Evidence → Hypothesis → Question
Aldri: AI → Recommendation
```

---

## 3. Node-typer (8)

Hver node = én **observasjon**, med sin egen kilde (evidence).

| Type | Verdi-eksempel | Kilde (source) | Metadata |
|------|----------------|----------------|----------|
| `COMPANY` | Melhus Bil Trondheim AS | brreg-enhet | org_number, industry_code, employees |
| `PERSON` | Rune Hagen | brreg-roller | role_type (DAGL/STYR), role_description |
| `FINANCIAL_EVENT` | Operating margin decreased | brreg-regnskap 2025 | metric, period, value |
| `DIGITAL_SIGNAL` | No self-service portal | website | url, tech_stack, channels |
| `MARKET_SIGNAL` | Announced expansion | news | url, published_at |
| `WORKFORCE_SIGNAL` | Hiring activity increased | nav | job_count, roles |
| `INDUSTRY_CONTEXT` | Automation adoption increasing | ssb | industry_code (kontekst, IKKE fakta om bedriften) |
| `EVIDENCE` | Annual accounts 2025 (kilden) | brreg | source_url, document_ref |

**Viktig skille:** `EVIDENCE` er *kilden* (årsregnskap, nyhetsartikkel). De andre typene er *observasjoner som peker til* en kilde. En observasjon uten kilde = ikke lov.

---

## 4. Edge-relasjoner

| Relasjon | Fra | Til | Betydning |
|----------|-----|-----|-----------|
| `BELONGS_TO` | PERSON | COMPANY | Personen tilhører selskapet |
| `HAS_FINANCIAL` | COMPANY | FINANCIAL_EVENT | Selskapet har dette regnskapstallet |
| `HAS_SIGNAL` | COMPANY | SIGNAL | Selskapet viser dette signalet |
| `EVIDENCED_BY` | (enhver node) | EVIDENCE | Observasjonen støttes av denne kilden |
| `SUPPORTS` | EVIDENCE | HYPOTHESIS | Kilden støtter hypotesen |

> `SUPPORTS` og `EVIDENCED_BY` er **to retninger på samme sannhet**: en observasjon er evidensert av en kilde; en hypotese er støttet av en kilde.

---

## 5. D1 Schema Proposal (migrasjon 0005)

**Designprinsipp: ren additiv migrasjon.** Ingen DROP, ingen ALTER på eksisterende tabeller. Eksisterende system fortsetter uforstyrret.

```sql
-- 0005_evidence_graph.sql — Evidence Graph foundation
-- ADDITIV: berører ingen eksisterende tabeller.

-- 5.1 companies — root-node (erstatter flat company_context som canonical)
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  org_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  industry_code TEXT,
  industry_name TEXT,
  created_at TEXT NOT NULL
);

-- 5.2 evidence_nodes — HJERTET. Én rad = én observasjon + kilde.
CREATE TABLE evidence_nodes (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  type TEXT NOT NULL CHECK (type IN (
    'COMPANY','PERSON','FINANCIAL_EVENT','DIGITAL_SIGNAL',
    'MARKET_SIGNAL','WORKFORCE_SIGNAL','INDUSTRY_CONTEXT','EVIDENCE'
  )),
  value TEXT NOT NULL,                 -- observasjonen (f.eks. "Operating margin decreased")
  source TEXT NOT NULL,                -- kilde (f.eks. "brreg-regnskap 2025")
  confidence TEXT NOT NULL CHECK (confidence IN ('LOW','MEDIUM','HIGH','VERIFIED')),
  observed_at TEXT NOT NULL,           -- når vi observerte
  metadata_json TEXT                   -- [{metric, period, role_type, url, ...}]
);
CREATE INDEX idx_en_company ON evidence_nodes(company_id);
CREATE INDEX idx_en_type ON evidence_nodes(type);

-- 5.3 evidence_edges — relasjoner
CREATE TABLE evidence_edges (
  id TEXT PRIMARY KEY,
  from_node TEXT NOT NULL REFERENCES evidence_nodes(id),
  to_node TEXT NOT NULL REFERENCES evidence_nodes(id),
  relationship TEXT NOT NULL CHECK (relationship IN (
    'BELONGS_TO','HAS_FINANCIAL','HAS_SIGNAL','EVIDENCED_BY','SUPPORTS'
  )),
  confidence TEXT NOT NULL CHECK (confidence IN ('LOW','MEDIUM','HIGH','VERIFIED')),
  created_at TEXT NOT NULL
);
CREATE INDEX idx_ee_from ON evidence_edges(from_node);
CREATE INDEX idx_ee_to ON evidence_edges(to_node);

-- 5.4 hypotheses — tolkninger. MÅ ha supporting_evidence.
CREATE TABLE hypotheses (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  hypothesis TEXT NOT NULL,            -- tolkning, IKKE anbefaling
  supporting_evidence TEXT NOT NULL,   -- JSON-array av evidence_nodes.id (KREVET)
  confidence TEXT NOT NULL CHECK (confidence IN ('LOW','MEDIUM','HIGH')),
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','VERIFIED','REJECTED')),
  created_at TEXT NOT NULL
);
CREATE INDEX idx_hyp_company ON hypotheses(company_id);

-- 5.5 questions — manglende kunnskap. MÅ referere en hypotese.
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  hypothesis_id TEXT REFERENCES hypotheses(id),
  question TEXT NOT NULL,              -- hva vi IKKE vet
  information_gain INTEGER NOT NULL DEFAULT 0,  -- 0-100
  answered INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_q_hypothesis ON questions(hypothesis_id);
```

---

## 6. Designregler (håndheves i kode + test)

| # | Regel | Håndheves av |
|---|-------|-------------|
| 1 | Hver hypotese MÅ ha `supporting_evidence` (ikke tom) | TypeScript-type + test |
| 2 | Hvert spørsmål MÅ referere `hypothesis_id` (eller eksplisitt `null` = fritt spørsmål) | TypeScript-type + test |
| 3 | Ingen `recommendation`-tabell eller -type | Fravær (arkitektur) |
| 4 | `FINANCIAL_EVENT` = observasjon, aldri råd | Kopi-regel + review |
| 5 | `INDUSTRY_CONTEXT` merkes kontekst (aldri fakta om bedriften) | Type + doc |
| 6 | Confidence enum: LOW/MEDIUM/HIGH/VERIFIED | CHECK-constraint |

**Eksempel på korrekt output (Financial Layer):**
```
observation:  "Operating margin decreased"
evidence:     "Annual accounts 2025 (Brønnøysund)"
hypothesis:   "Operational cost increase or revenue mix shift"
question:     "What changed operationally between 2024 and 2025?"
```
**Aldri:** "Bedriften bør kutte kostnader."

---

## 7. Migration Plan (bakoverkompatibel)

1. **Migrasjon 0005** = rent `CREATE TABLE` (5 nye tabeller). Ingen berøring av eksisterende.
2. **`public_company_contexts` beholdes uendret** — den fortsetter å betjene `resolve` og `question` (eksisterende kontrakt).
3. **`question_decisions` beholdes uendret** — spørrehistorikk fortsetter.
4. **Koblingen:** når `intelligence`-endepunktet (fase 1) skriver til grafen, skrives det **i tillegg til** `public_company_contexts`, ikke i stedet for.
5. **Rollback:** slette de 5 nye tabellene (de er isolerte). Ingen annen tabell påvirkes.

**Verifikasjons-rekkefølge:**
1. `wrangler d1 migrations apply arch-audit --remote` → 0005 kjøres.
2. `SELECT name FROM sqlite_master WHERE type='table'` → 5 nye tabeller finnes, gamle urørt.
3. Eksisterende 32 tester grønne (backward-compat bevis).
4. E2E `session → resolve → question` fortsatt 200.

---

## 8. API Impact Analysis

| Endepunkt | Påvirkning | Status |
|-----------|-----------|--------|
| `POST /v1/public/audit/session` | Ingen | Uendret |
| `POST /v1/public/company/resolve` | Ingen | Uendret |
| `POST /v1/public/company/intelligence` | Ingen (fase 0) | Uendret — skriver IKKE til graf ennå |
| `POST /v1/public/audit/question` | Ingen | Uendret |
| Alle `/v1/tenant/*` | Ingen | Uendret |
| Alle `/v1/internal/*` | Ingen | Uendret |

**Konklusjon:** Fase 0 har **null API-endringer**. Grafen er et datamodell-fundament som ingen endepunkt leser/skriver ennå. Det kommer i fase 1 (intelligence skriver til graf) og fase 2 (brief leser fra graf).

---

## 9. Test Strategy

### 9.1 Unit (vitest)
- **Schema-validators:** `hypotheses.supporting_evidence` kan ikke være tom array.
- **Type-guards:** `isEvidenceNode()` / `isHypothesis()` — avviser ugyldige typer.
- **Graf-bygging:** gitt 3 noder + 2 edges → graf-matrise korrekt.

### 9.2 Backward-compat (kritisk)
- Eksisterende **32/32 tester** MÅ forbli grønne etter migrasjon.
- Ingen test endres (bevis på at ingenting brakk).

### 9.3 Integrasjon (prod D1)
- Etter migrasjon: `INSERT` en test-node + edge + hypotese + question i en transaksjon, les tilbake, verifiser relasjoner.
- **Cross-tenant:** evidence_nodes er keyed på `company_id` (ikke tenant), men graf-lesing senere MÅ scope på tenant. Test at én tenant ikke kan lese en annens graf (fase 2).

### 9.4 Regresjons-gate
- `tsc --noEmit` = 0 feil
- `vitest run` = grønn (32 + nye)

---

## 10. Beslutningspunkter (til Tom-godkjenning)

1. **Node-typer:** godkjennes 8 typer (COMPANY, PERSON, FINANCIAL_EVENT, DIGITAL_SIGNAL, MARKET_SIGNAL, WORKFORCE_SIGNAL, INDUSTRY_CONTEXT, EVIDENCE)?
2. **Edge-relasjoner:** godkjennes 5 relasjoner (BELONGS_TO, HAS_FINANCIAL, HAS_SIGNAL, EVIDENCED_BY, SUPPORTS)?
3. **Hypotese-krav:** `supporting_evidence` som JSON-array av node-id — godkjennes dette, eller bør det være en separat join-tabell (mer relasjonell, mer kompleks)?
4. **Spørsmål-krav:** `hypothesis_id` FK (ikke-null for graf-genererte spørsmål) — godkjennes?
5. **Tenant-scoping:** evidence_nodes er `company_id`-keyed (public data). Tenant-grense kommer i fase 2. Godkjennes å utsette tenant-kolonnen til da?

---

## Oppsummering

Dette er **fundamentet**. Hvis grafen er riktig, bygges agenter og kilder på trygg grunn. Hvis den er feil, arver alt feilen.

**Det strategiske grepet:** datamodellen er produktet. Palantir/Databricks vinner på dette laget — evnen til å holde *relasjoner mellom fakta, kilder, hypoteser og spørsmål*, ikke en flat liste av felter.
