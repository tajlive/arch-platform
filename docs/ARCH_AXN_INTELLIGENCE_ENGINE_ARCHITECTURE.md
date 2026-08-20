# ARCH AXN — Intelligence Engine Architecture v1.0

**Dato:** 2026-08-20
**Rolle:** Principal AI Architect + Enterprise Product Designer
**Status:** PLAN — ingen kode bygget i denne leveransen

> Transformasjon: **AI audit questionnaire → AI-powered Company Intelligence Platform**

---

## Del 1 — Eksisterende system (kartlegging)

### 1.1 Backend (Worker `arch-audit-api`)

| Komponent | Fil | Status |
|-----------|-----|--------|
| Router (13 routes) | `src/index.ts` | ✅ Live |
| Brønnøysund-adapter (identitet + roller) | `src/adapters.ts` | ✅ Live |
| Evidence Engine v1 (3 kilder) | `src/evidence-engine.ts` | ✅ Live |
| CompanyService (resolve + firstQuestion) | `src/company.ts` | ✅ Live |
| Anonym session + claim | `src/sessions.ts` | ✅ Live |
| Access-auth → User → Tenant | `src/auth.ts` | ✅ Live |
| Tenant-isolasjon | `src/tenant-access.ts` | ✅ Live |
| Rate limiter (DO) | `src/rate-limiter.ts` | ✅ Live |
| Anonymisert demo | `src/demo-company.ts` | ✅ Live |
| Beta-provisioning | `src/beta.ts` | ✅ Live |

### 1.2 D1 schema (database `arch-audit`)

| Tabell | Formål | Status |
|--------|--------|--------|
| tenants / identities / users / user_identities / tenant_memberships | Identitet + tenant-isolasjon | ✅ |
| public_company_contexts | Public company cache (context_json) | ✅ |
| audit_sessions / session_credentials | Anonym session-sikkerhet | ✅ |
| question_decisions | Question trace (purpose + gain) | ✅ |
| learning_events / outcome_measurements | Læring + outcome | ✅ |
| beta_program / beta_feedback | Beta-onboarding | ✅ |

### 1.3 Cloudflare-bindinger (wrangler.jsonc)

| Binding | Type | Status |
|---------|------|--------|
| DB | D1 | ✅ |
| RATE_LIMITER | Durable Object | ✅ |
| R2 | — | ❌ Mangler |
| Vectorize | — | ❌ Mangler |
| AI Gateway | — | ❌ Mangler |

### 1.4 Frontend (CF Pages `arch-platform`)

| Side | Formål | Status |
|------|--------|--------|
| index.html | Premium forside + demo | ✅ |
| start.html | AI analyst onboarding + Executive Brief | ✅ |
| proof/explore/architecture | Engineering (dark) | ✅ |

---

## Del 2 — Hva finnes / mangler / gjenbrukes / endres

### Finnes (gjenbrukes)
- ✅ Brønnøysund identitet + roller + **regnskap** (Evidence Engine v1)
- ✅ Executive Brief (frontend) — viser identity/financial/leadership/digital/sources
- ✅ Evidence Object-standard er *delvis* der (`IntelligenceReport` + `EvidenceSource.status`)
- ✅ Question trace med `required_for` + `expected_information_gain`
- ✅ Anonym session + tenant-claim (identitetskjede)

### Mangler (må bygges)
- ❌ **Evidence Graph** (relasjoner) — i dag flat: `context_json` blob, ingen node/edge-modell
- ❌ **Evidence Object-standarden er ikke konsekvent** — mangler `hypothesis` + `recommended_question` per funn
- ❌ **Agent-arkitektur** (Research/Analyst/Question/Report) — i dag én deterministisk `firstQuestion()`
- ❌ **Market Intelligence** (nyheter) — ingen kilde
- ❌ **Workforce Intelligence** (NAV) — krever auth
- ❌ **Industry Intelligence** (SSB) — feil endepunkt funnet
- ❌ **Vectorize/R2/AI Gateway** — ingen bindinger

### Kan gjenbrukes (men må utvides)
- 🔶 `BrregAdapter` → må bli **Identity Intelligence Layer**
- 🔶 `fetchFinancial` → må bli **Financial Intelligence Layer** (observasjoner, ikke rå tall)
- 🔶 `fetchDigital` → må bli **Digital Intelligence Layer** (hypoteser fra kanaler)
- 🔶 `IntelligenceReport` → må bli **Evidence Graph** (relasjoner, ikke flat liste)

### Må endres
- 🔴 `firstQuestion()` er deterministisk hardkodet → må bli **Question Agent** (informasjonsgevinst-rangert)
- 🔴 `public_company_contexts.context_json` er en blob → må struktureres i grafen

---

## Del 3 — Ny arkitektur

```
Company Input (org.nr / navn / nettside)
        │
        ▼
Company Resolver  ──→  (Brønnøysund oppslag, canonical org.nr)
        │
        ▼
Company Intelligence Engine  ── 7 lag (parallell innhenting)
        │
        ▼
Evidence Graph  (D1: nodes + edges, ikke flat)
        │
        ▼
AI Analyst  (Research → Analyst → Question → Report agents)
        │
        ▼
Executive Intelligence Brief
        │
        ▼
Human Conversation
```

### De 7 Intelligence-lagene

| Lag | Kilde | Output | Status |
|-----|-------|--------|--------|
| **1. Identity** | Brønnøysund | Company Profile | ✅ Live |
| **2. Financial** | Regnskapsregisteret | Observasjoner (marginer, vekst, revisjon) | ✅ Live |
| **3. Leadership** | Brønnøysund roller | Leadership Profile | ✅ Live |
| **4. Market** | Nyheter (Google/Bing/RSS) | Market Signals | ❌ Planlagt |
| **5. Digital** | Nettsideanalyse | Digital Footprint + hypoteser | 🔶 Delvis |
| **6. Workforce** | NAV stillinger | Hiring signals | ❌ Planlagt (auth) |
| **7. Industry** | SSB | Bransjekontekst (ikke fakta om bedriften) | ❌ Planlagt |

**Kritisk regel (Financial Layer):** Lag **observasjoner**, ikke råd.
- ❌ «Bedriften bør kutte kostnader»
- ✅ *Observation:* Operating margin decreased. *Evidence:* Annual accounts 2025. *Question:* What changed operationally?

---

## Del 4 — Evidence Object-standard (kanonisk)

Alle funn MÅ følge:

```json
{
  "observation": "Operating margin decreased",
  "evidence": "Annual accounts 2025 (Brønnøysund)",
  "source": "brreg-regnskap",
  "confidence": "HIGH",
  "timestamp": "2026-08-20T12:00:00Z",
  "hypothesis": "Operational cost increase or revenue mix shift",
  "recommended_question": "What changed operationally between 2024 and 2025?"
}
```

**Ingen AI-output uten `evidence`.** Dette er §102-ærligheten kodifisert.

---

## Del 5 — Evidence Graph (D1 schema-forslag)

### Ny migrasjon `0005_evidence_graph.sql`

```
evidence_nodes         (id, org_number, type, payload_json, source, confidence, created_at)
                       -- type: COMPANY | PERSON | FINANCIAL_EVENT | MARKET_SIGNAL
                       --       | DIGITAL_SIGNAL | WORKFORCE_SIGNAL | INDUSTRY_CONTEXT

evidence_edges         (id, from_node, to_node, relation, created_at)
                       -- relation: BELONGS_TO | LEADS | REPORTS_TO | SIGNALS | EVIDENCES | HYPOTHESIZES

hypotheses             (id, org_number, hypothesis, evidence_node_ids_json, confidence, status, created_at)
                       -- status: OPEN | VERIFIED | REJECTED

investigation_areas    (id, org_number, area, evidence_coverage_score, created_at)
                       -- area: customer_communication | operations | documentation | ...
```

**Relasjoner (ikke flat):**
```
Company ─BELONGS_TO→ Person (ledelse)
Company ─HAS→ FinancialEvent (regnskap)
Company ─SIGNALS→ MarketSignal (nyheter)
Company ─SIGNALS→ DigitalSignal (nettside)
Hypothesis ─EVIDENCES→ EvidenceNode (kilde)
Hypothesis ─GENERATES→ Question (recommended_question)
```

**Hvorfor relasjoner:** en toppanalytiker holder ikke en flat liste — de holder et nettverk av «hvem, hva, hvorfor, basert på hva».

---

## Del 6 — AI Agent-arkitektur (minimum 4)

| Agent | Ansvarsområde | Trigger |
|-------|---------------|---------|
| **Research Agent** | Samler evidence fra de 7 lagene | Etter Company Resolver |
| **Analyst Agent** | Lager hypoteser fra evidence (aldri uten kilde) | Etter research |
| **Question Agent** | Velger spørsmålet med **høyest informasjonsgevinst** | Før hver brukerinteraksjon |
| **Report Agent** | Bygger Executive Brief fra grafen | Etter analyse |

**Informasjonsgevinst-rangering (gjenbruk fra FinnBilGlass C9.1 Question Intelligence):**
```
Question Value = (usikkerhet redusert) × (feilkostnad unngått) × (svar-sannsynlighet)
```

---

## Del 7 — Cloudflare-arkitektur

| Tjeneste | Rolle | Status |
|----------|-------|--------|
| **Workers** | Agent orchestration (én Worker, fire agent-funksjoner) | ✅ |
| **D1** | Evidence Graph (strukturert, relasjonelt) | ✅ |
| **R2** | Dokumenter: rapporter, PDF-er, webpages | ❌ Legg til |
| **Vectorize** | Company memory: tidligere analyser, semantisk søk | ❌ Legg til |
| **AI Gateway** | Model routing, cost control, logging | ❌ Legg til |

---

## Del 8 — Data source matrix

| Kilde | Status | Auth | Verdi |
|-------|--------|------|-------|
| Brreg (Enhetsregisteret) | ✅ Live | Ingen | Høy |
| Brreg (Regnskapsregisteret) | ✅ Live | Ingen | Høy |
| Brreg (Roller) | ✅ Live | Ingen | Høy |
| Nettsideanalyse | 🔶 Delvis | Ingen | Medium |
| News (Google/Bing/RSS) | ❌ Planlagt | API-nøkkel | Medium |
| NAV stillingsannonser | ❌ Planlagt | Bearer-auth | Høy |
| SSB bransje | ❌ Planlagt | API | Medium |

---

## Del 9 — API contract-forslag

### Nåværende (beholdes)
```
POST /v1/public/audit/session          → session (cookie)
POST /v1/public/company/resolve        → company + context_id
POST /v1/public/company/intelligence   → company + IntelligenceReport
POST /v1/public/audit/question         → question + purpose + gain
```

### Nye (fase 2)
```
POST /v1/public/company/intelligence   → utvides: returnerer Evidence Graph (nodes+edges), ikke flat
POST /v1/public/audit/brief            → Executive Intelligence Brief (strukturert)
GET  /v1/public/company/{org}/graph    → hent lagret graf (cache)
```

### Kontrakt-prinsipp
- Response = **evidence-first**: hvert funn bærer `evidence` + `source` + `confidence`.
- Ingen `recommendation` uten `evidence_node_ids`.
- `INSUFFICIENT EVIDENCE` er en førsteklasses respons, ikke en feil.

---

## Del 10 — Frontend experience-forslag

Når bruker skriver «Rosenborg Bakeri AS», skal Arch IKKE spørre «Hvordan kan vi hjelpe?».

**Først:** Executive Intelligence Brief
```
ARCH INTELLIGENCE BRIEF
├── Company — verified identity
├── Financial profile — public records
├── Leadership — governance
├── Market signals — available data
├── Digital footprint — investigation areas
└── Evidence coverage score
```

**Deretter:** «Based on available evidence, Arch would like to understand…»

Dette er **allerede påbegynt** i `start.html` (Executive Brief-panelet). Utvidelsen er å vise **Evidence Graph** (relasjoner) + **hypoteser** (med kilde), ikke bare flat liste.

---

## Del 11 — Implementeringsfaser

### Fase 0 — Evidence Graph-datamodell (FØRST)
- Migrasjon `0005_evidence_graph.sql` (nodes, edges, hypotheses, investigation_areas)
- Evidence Object-standarden håndheves i TypeScript-typer
- **Leveranse:** D1 schema + type-kontrakt + 1 test som validerer «ingen output uten evidence»

### Fase 1 — Intelligence-lagene restruktureres til grafen
- Identity/Financial/Leadership/Digital → skriver nodes+edges (ikke flat blob)
- **Leveranse:** `intelligence`-endepunktet returnerer graph

### Fase 2 — Agent-arkitektur
- Research → Analyst → Question → Report (fire funksjoner i Worker)
- Question Agent erstatter deterministisk `firstQuestion()`
- **Leveranse:** informasjonsgevinst-rangert spørsmål

### Fase 3 — Nye kilder (ETTER motoren)
- NAV (workforce) → Market (news) → SSB (industry)
- **Kun når grafen + agentene er på plass** — ellers «adaptere uten motor»

### Fase 4 — Cloudflare-utvidelser
- R2 (dokumenter) → Vectorize (semantisk minne) → AI Gateway (cost/logging)

### Fase 5 — Executive Brief v2
- Vis Evidence Graph (relasjoner) + hypoteser i frontend

---

## Endelig arkitekturprinsipp

> **ARCH AXN skal ikke være «AI som svarer på spørsmål.»
> ARCH AXN skal være «AI som gjør research, bygger forståelse og stiller de spørsmålene en toppanalytiker ville stilt.»**

Konkurransefortrinnet er ikke adapterne. Det er **grafen + hypotesene + spørsmålene som er evidence-forankret** — og ærligheten som sier «INSUFFICIENT EVIDENCE» når den mangler data.
