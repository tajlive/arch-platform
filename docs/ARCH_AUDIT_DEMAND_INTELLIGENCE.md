# Arch Audit Demand Intelligence

**Dato:** 2026-08-20  
**Versjon:** 1.0  
**Basert på:** Master Implementation Directive (AI-First Discovery + Demand Intelligence + Conversion Engine) §4-51, §106-107

---

## 1. Formål

Arch skal forstå **både** virksomheten kunden undersøker **og** hva markedet faktisk leter etter.

> **Privacy-guardrail (første prinsipp):** Arch analyserer etterspørsel uten å bli en overvåkingsplattform.
> Ingen fingerprinting, ingen kjøpt tredjepartsprofilering, ingen skjult deanonymisering,
> ingen cross-site tracking, ingen IP-basert identifisering av anonyme besøkende.

---

## 2. Fem Demand-lag

| Lag | Spørsmål | Kilde |
|-----|----------|-------|
| **L1 Acquisition Intent** | Hvordan fant brukeren Arch? | Referrer-class, UTM, organic, LinkedIn, GitHub |
| **L2 Company Search Intelligence** | Hvilke firma undersøkes? | Company Search → Brønnøysund-resolusjon |
| **L3 Problem Intent** | Hva sliter bedriften med? | AI Audit Conversation → canonical problem-kategorier |
| **L4 Engagement Intent** | Hva gir tillit/verdi? | Product events (findings, ROI, evidence, free boundary) |
| **L5 Commercial Intent** | Hva signaliserer betalingsvilje? | ROI card, pricing, full-audit-klikk, account |

---

## 3. SearchDemandSignal (Canonical)

```typescript
interface SearchDemandSignal {
  id: string;
  source:
    | "GOOGLE_SEARCH_CONSOLE"
    | "ARCH_COMPANY_SEARCH"
    | "ARCH_AI_CONVERSATION"
    | "ARCH_SITE_SEARCH"
    | "REFERRAL"
    | "CAMPAIGN";

  normalized_query?: string;
  intent_category?: SearchIntentCategory;

  industry?: string;             // NACE
  problem_category?: string;
  automation_category?: string;

  impressions?: number;
  clicks?: number;
  ctr?: number;
  average_position?: number;
  landing_page?: string;

  first_seen_at: string;
  last_seen_at: string;
  volume: number;

  privacy_classification: "AGGREGATE" | "PSEUDONYMIZED" | "MINIMIZED";
}
```

---

## 4. Intent Taxonomy

```typescript
type SearchIntentCategory =
  | "COMPANY_LOOKUP"
  | "AI_AUDIT"
  | "AUTOMATION_DISCOVERY"
  | "CUSTOMER_SERVICE"
  | "VOICE_AI"
  | "SALES_AUTOMATION"
  | "ACCOUNTING_AUTOMATION"
  | "DOCUMENT_AUTOMATION"
  | "BOOKING"
  | "EMAIL_AUTOMATION"
  | "REPORTING"
  | "PROCESS_IMPROVEMENT"
  | "AI_AGENT"
  | "ROI"
  | "SECURITY"
  | "GOVERNANCE"
  | "OTHER";
```

**Regel:** Taxonomien utvides gradvis. Ikke hardkod 100 kategorier fra start.

---

## 5. Company Search Intelligence (privacy-first)

### 5.1 Canonical Resolution

Når company search resolves mot Brønnøysund, lagres **primært canonical**:

```
org_number  (canonical)
company_name
NACE / industry
municipality / region (når relevant)
match confidence
timestamp
result state
```

> **Alias-normalisering:** `ELBATT`, `Elbatt AS`, `elbatt trondheim` → samme `org_number`.
> Canonical org_number er bedre enn å lagre alle variasjoner brukeren skrev.

### 5.2 Unresolved Search

```
RAW QUERY → sanitization → classification → intent extraction → aggregation → raw query expiration/deletion
```

- Ikke lagre potensielt sensitiv free text permanent uten behov.
- Kort retention kun dersom nødvendig for å forbedre søket.

### 5.3 IKKE anta hvem søkeren er

Hvis noen søker «Nordbygg AS»:
- ✅ Vi vet: *noen undersøkte Nordbygg AS*
- ❌ Vi vet IKKE: *en ansatt hos Nordbygg ønsker å kjøpe Arch*

> **Forbudt slutning:** ikke kontakt virksomheten bare fordi en anonym person søkte etter den.
> Company demand brukes til produktintelligens, market trends, vertical demand, conversion optimization — **ikke anonym visitor deanonymization**.

### 5.4 Company Demand Score (aggregert, ikke individuelle surveillance-score)

Input: searches, completed X-Rays, audit starts, industry interest, conversions.

Eksempel output: «Bilverkstedbransjen får 3.8× mer auditinteresse enn eiendomsdrift.»

---

## 6. Problem Intent (L3)

AI Audit Consultant lærer hva besøkende sliter med.

```
Bruker: «Vi bruker altfor mye tid på å svare telefonen.»
   ↓
PROBLEM          = Inbound customer communication
SUBTYPE          = Phone
IMPACT           = Employee interruption
AUTOMATION       = Voice AI / self-service / status automation
EVIDENCE         = Customer statement
EVIDENCE LEVEL   = E1
```

> **Data-minimering:** Lagre `problem_category`, `channel`, `industry` — **ikke nødvendigvis hele brukerens tekst**.

---

## 7. Product Event Contract (L4/L5)

### 7.1 Event Taxonomi

```
PAGE_VIEW, START_AUDIT_CLICK, COMPANY_SEARCH, COMPANY_MATCHED,
PUBLIC_CONTEXT_COMPLETE, AI_CONVERSATION_STARTED, QUESTION_ANSWERED,
FIRST_FINDING_SHOWN, ROI_PREVIEW_SHOWN, EVIDENCE_OPENED,
FREE_BOUNDARY_REACHED, FULL_AUDIT_VIEWED, PRICING_VIEWED,
CONVERSION_STARTED, ACCOUNT_CREATED, AUDIT_PURCHASED,
EXPLORE_ENGINEERING, PROOF_OPENED, TRACE_OPENED,
ARCHITECTURE_OPENED, EVALS_OPENED, CASE_STUDY_OPENED
```

### 7.2 Canonical Event Shape

```typescript
interface ProductEvent {
  event_name: ProductEventName;
  occurred_at: string;
  journey_id?: string;
  audit_session_id?: string;
  route?: string;
  org_number?: string;
  industry?: string;
  intent_category?: string;
  problem_category?: string;
  audit_scope?: "FREE" | "SCAN" | "FULL";
  experiment_id?: string;
  variant?: string;
  metadata?: Record<string, SafeAnalyticsValue>;
}
```

### 7.3 FORBUDT i generic analytics (ikke legg inn)

- full name, email, phone
- access token, auth token
- prompt contents, uploaded documents, screenshots
- full interview, customer secrets, invoice data, sensitive business data

> **Analytics = metadata om atferd, ikke kopi av produktdata.**

---

## 8. Commercial Intent (L5)

Signaler på betalingsvilje (aggregeres innenfor aktiv audit):

```
ROI card opened, 2./3. finding requested, evidence details viewed,
implementation tab opened, pricing viewed, Full Audit clicked,
account created, audit continued after free boundary,
report sample opened, contact initiated
```

> **IKKE manipulerende lead scoring.** Ikke «denne personen er desperat, press hardere».
> Bruk til: bedre timing, riktigere forklaring, relevant CTA, forstå produktet.

---

## 9. Arch Funnel (Canonical)

```
VISITOR → COMPANY SEARCH → PUBLIC COMPANY CONTEXT → AI CONVERSATION
→ FIRST USEFUL INSIGHT → LIVE FINDINGS → ROI PREVIEW → FREE BOUNDARY
→ FULL AUDIT INTEREST → ACCOUNT/CUSTOMER → PAID AUDIT
→ IMPLEMENTATION → CONTINUOUS AUDIT
```

### 9.1 North Star

| Stage | Metrikk |
|-------|---------|
| TOP | visitor → company_search |
| ACTIVATION | company_search → useful finding |
| VALUE | useful finding → ROI preview |
| INTENT | ROI preview → free boundary |
| CONVERSION | free boundary → paid interest |
| REVENUE | paid interest → purchased audit |
| RETENTION | full audit → continuous |

### 9.2 Den viktigste metrikken

> **TIME TO FIRST USEFUL INSIGHT** — fra audit started til første evidence-backed useful finding vises.
> Ikke pageviews.

### 9.3 Secondary North Star

> **VERIFIED VALUE DISCOVERED** = potential_value_discovered × evidence_strength × confidence.
> Ikke bare antall findings.

---

## 10. Search Console (Google Search Intelligence)

### 10.1 Adapter

```
SEARCH CONSOLE → QUERY AGGREGATION → INTENT CLASSIFICATION → DEMAND TREND → CONTENT OPPORTUNITY
```

Henner: query, impressions, clicks, CTR, average position, landing page, country, device, date.

### 10.2 Begrensning

- Search Console-data er **ikke** individuelle brukeres komplette søkehistorikk.
- Noen queries anonymiseres og vises ikke individuelt. **Ikke omgå dette.**
- Bruk som **aggregert market intelligence**, ikke individuell profiling.

### 10.3 Content Opportunity Model

```typescript
interface ContentOpportunity {
  query_cluster: string;
  intent: string;
  impressions: number;
  clicks: number;
  ctr: number;
  average_position: number;
  existing_page?: string;
  business_relevance: number;
  audit_conversion_relevance: number;
  recommended_action: "CREATE" | "IMPROVE" | "MERGE" | "IGNORE";
  confidence: number;
}
```

> **Regel:** AI foreslår. Auto-publiser aldri SEO-sider uten QA.

---

## 11. Vertical Intelligence

```typescript
interface VerticalDemandProfile {
  industry_code: string;
  company_searches: number;
  audits_started: number;
  audits_completed: number;
  top_problems: string[];
  top_automation_categories: string[];
  avg_time_to_insight?: number;
  free_to_paid_rate?: number;
  avg_estimated_value?: number;
  evidence_quality?: number;
}
```

### 11.1 IKKE forveksle popularitet med verdi

Ranger vertikaler etter:

```
DEMAND × CUSTOMER VALUE × CONVERSION × IMPLEMENTATION REPEATABILITY × SALES EFFORT × RISK
```

→ **ARCH VERTICAL ATTRACTIVENESS SCORE**

---

## 12. Demand Dashboard (internt, auth-beskyttet)

Route: `/internal/demand` (IKKE public).

Minimum: TODAY / 7D / 30D
- company searches, unique companies, industries, problem categories
- audit starts, first findings, free boundaries, conversion intent, conversions
- SEO: query clusters, impressions, CTR, position

### 12.1 Top Company Interest (kun aggregert)

```
1. Auto services
2. Accounting
3. Construction
...
```

> **Ikke bygg «who visited my website»-funksjonalitet.**

### 12.2 Top Problems / Automation Demand

Blir produktdata som styrer fremtidig utvikling.

---

## 13. Trend & Anomaly Detection

- Trender: EMERGING / GROWING / STABLE / DECLINING — med **minimum sample size**.
- **Ikke kall 3 searches en trend.**
- Anomalier: vis `baseline`, `sample`, `confidence`.

### 13.1 Source Provenance (bruk egen evidence-filosofi)

```
Insight: Accounting automation demand rising
Evidence: Search Console + Arch company searches + audit conversations
Period: 30 days
Sample: N=87
Confidence: HIGH
```

---

## 14. Market Feedback Loop (The Real Moat)

```
SEARCH DEMAND → COMPANY INTEREST → AUDIT CONVERSATIONS → PROBLEMS
→ OPPORTUNITIES → CONVERSIONS → IMPLEMENTATIONS → ACTUAL OUTCOMES
→ BETTER PRODUCT STRATEGY
```

> **Moaten er ikke prompts/frontend/Cloudflare.** Moaten er:
> **DEMAND + PROCESS + EVIDENCE + OUTCOME DATA.**
>
> «Regnskapsbyråer spør ofte om dokumentautomatisering» er interessant.
> «For 42 regnskapsauditer ga automatisert dokumentflyt median X faktisk tidsreduksjon» er verdifullt.

---

## 15. Fase 1 Scope (ikke overbuild)

Fase 1 trenger IKKE predictive AI. Vi trenger:
1. korrekt instrumentation
2. korrekte schemas
3. god privacy
4. ekte traffic
5. ekte audits
6. baseline

**Deretter** intelligence.
