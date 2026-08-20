# Arch Audit Product Specification

**Dato:** 2026-08-20  
**Versjon:** 3.0  
**Basert på:** Master Implementation Directive + Public Intelligence + Commercial Funnel + Portfolio IP Strategy + **AI-First Discovery**

---

## 1. Produktvisjon

> **Arch Audit: Evidence-Based AI & Automation Audit Platform**
>
> Fra bedrift → data → systemer → prosesser → oppgaver → evidens → muligheter → ROI → risiko → prioritering → implementeringsplan → realisert resultat.
>
> Uten å miste sporbarheten mellom leddene.

---

## 2. To Produkter i Én (§9)

### A. PUBLIC WEBSITE — Verdismaskin & Engineering Portfolio
- **URL:** `arch.axn.no`
- **To målgrupper, to innganger:**
  - **Potensielle kunder** → `/start` (AI Audit Consultant) → Free boundary → Betalte trinn
  - **Potensielle arbeidsgivere/CTO-er** → `/explore` → `/proof` → `/trace` → `/architecture` → `/evals` → `/decisions`
- **Konvertering:** Kunde: "Start gratis AI-audit" → AI Conversation | Arbeidsgiver: "Explore the Engineering" → Technical Deep Dive

### B. SECURE AUDIT PLATFORM (Selve audit-produktet)
- **URL:** `app.arch.axn.no` (subdomene, egen Worker)
- **Målgruppe:** Audit-kunder (innlogget, tenant-isolert)
- **Funksjon:** Full audit pipeline fra discovery til outcome tracking

---

## 3. KJERNEARKITEKTUR: AI-First Discovery (erstatter form-first)

> **Arch Audit skal IKKE bruke et tradisjonelt flertrinnsskjema som primær discovery-opplevelse.**

`/start` er en **AI Audit Consultant** — ikke et skjema med chatbot-dekorasjon.

### 3.1 Opplevelsesflyt

```
COMPANY
  ↓
PUBLIC RESEARCH      (PublicCompanyContext bygges FØR første spørsmål)
  ↓
AI CONVERSATION      (AI stiller kun spørsmål med eksplisitt formål)
  ↓
DYNAMIC DISCOVERY    (process/system/task bygges opp underveis)
  ↓
LIVE FINDINGS        (funn vises i sanntid, med evidens + confidence)
  ↓
FREE VALUE BOUNDARY  (scope-basert, ikke svekket modell)
  ↓
FULL AUDIT
```

### 3.2 PublicCompanyContext (bygget FØR første spørsmål)

Når lovlig og tilgjengelig, henter Arch automatisk fra offentlige kilder:

| Kilde | Hva | Verdi |
|-------|-----|-------|
| Brønnøysund Enhetsregisteret | Selskapsinfo, næring, adresse, roller | Identitet + næring |
| Brønnøysund Regnskapsregisteret | Årsregnskap (15 år) | Økonomi + utvikling |
| SSB PxWeb API v2 | ~7 500 statistikkbanktabeller | Bransjebenchmark (næringssnitt) |
| NAV Arbeidsplassen | Utlyste stillinger | Rekrutteringssignaler → arbeidsintensive prosesser |
| Selskapets nettside | Servicesider, FAQ, booking, sitemap, tech signals | Forretningsmodell + tech stack |
| Offentlige teknologisignaler | DNS, SSL, headers, CSP | Tech stack |

> **Produktprinsipp:** «Arch skal føles som at en svært god konsulent allerede har gjort hjemmeleksen før møtet starter.»

### 3.3 Question Decision Model (Forklarbart auditintervju)

> **AI skal aldri spørre etter informasjon som allerede finnes med tilstrekkelig sikkerhet i tilgjengelig context.**

Hvert spørsmål må ha et eksplisitt formål. Hvis spørsmålet ikke kan påvirke auditresultatet, skal det ikke stilles.

```typescript
interface QuestionDecision {
  question: string;                // Det faktiske spørsmålet
  reason: string;                  // Hvorfor dette spørsmålet stilles
  target_unknown: string;          // Hvilken ukjent variabel vi prøver å løse
  expected_information_gain: number; // 0-100 (hvor mye usikkerhet fjernes)
  related_process?: string;        // Hvilken prosess spørsmålet tilhører
  related_finding?: string;        // Hvilket funn spørsmålet påvirker
  required_for: QuestionPurpose;   // Formål (se enum)
  asked_at: string;                // ISO timestamp
  answer?: string;                 // Kundens svar
}

enum QuestionPurpose {
  REDUCE_UNCERTAINTY = "REDUCE_UNCERTAINTY",
  QUANTIFY_VALUE = "QUANTIFY_VALUE",
  IDENTIFY_PROCESS = "IDENTIFY_PROCESS",
  IDENTIFY_SYSTEM = "IDENTIFY_SYSTEM",
  VERIFY_EVIDENCE = "VERIFY_EVIDENCE",
  ASSESS_RISK = "ASSESS_RISK",
  CHOOSE_TECHNOLOGY = "CHOOSE_TECHNOLOGY"
}
```

**Sparsomhetsregel:** Et spørsmål stilles KUN hvis `expected_information_gain` overstiger en terskel OG `target_unknown` ikke allerede er løst med tilstrekkelig confidence i `PublicCompanyContext` eller tidligere svar.

### 3.4 INSUFFICIENT EVIDENCE — Ærlighet fremfor presisjon

AI skal **aldri** finne på presise økonomiske gevinster fra offentlig informasjon alene.

Når evidensen er utilstrekkelig, sier Arch eksplisitt:

> **INSUFFICIENT EVIDENCE**
>
> For å beregne faktisk besparelse trenger vi: [minste mengde tilleggsinformasjon som løser usikkerheten].

Dette er et konkurransefortrinn — det viser at systemet ikke hallusinerer.

### 3.5 Multimodal Discovery (fremtidig, designet nå)

Alle inputtyper konverteres til samme canonical Evidence/Process/Task-modell:

| Input | Modality | Konverteres til |
|-------|----------|-----------------|
| Tekst | TEXT | Evidence (INTERVIEW, source=chat) |
| Stemme | VOICE | Evidence (INTERVIEW, ASR → tekst) |
| Dokument | DOCUMENT | Evidence (DOCUMENT, hash + parse) |
| Skjermbilde | SCREENSHOT | Evidence (SCREENSHOT, hash) |
| System-tilkobling | SYSTEM CONNECTOR | Evidence (API/DATABASE, E4) |

> **Canonical model:** Uavhengig av input-kilde, lander alt i samme Evidence/Process/Task-graf. Dette gjør discovery-modellen fremtidssikker.

---

## 4. Free Boundary — Scope-basert (IKKE svekket modell)

> **Gratisbrukeren skal få samme intelligens, men mindre audit-dybde. Ikke svekk modellen kunstig.**

| Lag | Hva gratisbruker får | Hva Full Audit gir |
|-----|---------------------|--------------------|
| **Public research** | ✅ Full offentlig research | ✅ Full offentlig research |
| **Conversational discovery** | ✅ Full AI-conversation | ✅ Full AI-conversation |
| **Process discovery** | ⚠️ Begrenset (topp-nivå) | ✅ Full process/task mapping |
| **Findings** | ⚠️ Opptil 3 visible findings | ✅ All opportunities |
| **ROI** | ⚠️ Indikativ (range) | ✅ Deterministic (scenarier) |
| **Evidence** | ⚠️ Confidence + klasse | ✅ Complete evidence graph |
| **System inventory** | ❌ Teaser | ✅ Full inventory + integration |
| **Risk analysis** | ❌ Teaser | ✅ 11-kategori risk engine |
| **Roadmap** | ❌ Teaser | ✅ Prioritert roadmap |
| **Report** | ❌ Teaser | ✅ Executive report |

**Free boundary = scope, ikke intelligens.** Samme LLM, samme Question Intelligence, samme evidens-modell — bare færre resultater synlige.

---

## 5. Hjemmeside (Hero)

> **La AI-en vår undersøke bedriften din.**
>
> ```
> Søk etter firma
> [ Firma eller organisasjonsnummer ]
> [ Start gratis AI-audit ]
> ```

CTA-hierarki:
- **Primær:** `Start gratis AI-audit` → `/start`
- **Sekundær:** `Explore the Engineering` → `/explore`

> **Effekt:** Arbeidsgivere som besøker porteføljen kan prøve agenten selv. Vi trenger ikke fortelle dem hvor avansert systemet er — de får oppleve det.

---

## 6. Kommersiell Funnel & Prising (§56-57)

| Nivå | Hva kunden får | Pris | Målgruppe |
|------|----------------|------|-----------|
| **Free AI Audit** | Public research, AI-conversation, 3 funn, indikativ ROI | **Gratis** | Alle besøkende |
| **Arch Audit Scan** | 3–5 prioriterte opportunities + business case | **~7 900 kr** | SMB som vil rask oversikt |
| **Arch Audit Full** | Prosesser, tasks, evidence, ROI, risk, roadmap | **fra ~24 900 kr** | SMB som vil full oversikt |
| **Continuous** | Måling + nye opportunities + oppfølging | **fra ~4 900 kr/mnd** | Voksende bedrifter |

> **Referanse:** Norske aktører tar 6 500 kr for 90 min kartlegging, 35 000 kr for pilot. AI-workshops 15k–50k kr. **990 kr ville svekket inntrykket.**

---

## 7. Målgruppe & Vertikale Prioritering (§13)

### 7.1 Prioriterte Vertikaler (Første 12 mnd)

| Vertikal | Argument | Domenekunnskap |
|----------|----------|----------------|
| **1. Bilverksted / bilglass / bildeler** | Telefon, booking, regnr, deler, ordre, kundeoppfølging, faktura, SMS, e-post, forsikring, leverandører | **Svært sterk** — FinnBilGlass + Autoglass AS |
| **2. Regnskapsbyrå** | Dokumenter, e-post, klassifisering, bilag, kundeoppfølging, frister | Sterk — fakturabehandling er top automation case |
| **3. Håndverk / bygg / elektro / VVS** | Lead → befaring → tilbud → kalender → ordre → timer → dokumentasjon → faktura | Stor SMB-gruppe, mange systembrudd |
| **4. Grossist / logistikk / B2B-handel** | Ordre, lager, kundeservice, produktdata, leverandørkommunikasjon | B2B-ekspertise via Autoglass AS |
| **5. Eiendomsdrift / facility management** | Henvendelser, feil, ordre, leverandører, dokumenter, avtaler | Toma-domene |

**IKKE helse først** — personvern, sensitive data, risiko = unødvendig kompleksitet for første kommersielle sektor.

### 7.2 Demo-bedrifter (Syntetiske — tydelig merket)

| Demo | Vertikal |
|------|----------|
| Nordic AutoGlass AS | Bilverksted/bilglass |
| Trøndelag Regnskap AS | Regnskapsbyrå |
| Nordbygg Elektro AS | Håndverk/bygg |
| Nordic Logistics AS | Grossist/logistikk |
| Fjord Eiendomsdrift AS | Eiendomsdrift |

> **Viktig:** `Synthetic demonstration company` badge på ALLE. Ingen logos til ekte bedrifter uten consent.

---

## 8. Arbeidsgiver/CTO-portfolio (§15)

### 8.1 Tre-lags portefølje

| Lag | URL | Formål |
|-----|-----|--------|
| **1. Sluttprodukt** | `arch.axn.no` | Kunde prøver AI Audit Consultant direkte |
| **2. Bevis** | `/proof` → `/trace` → `/challenge` | Levende data fra CI/prod, agent traces |
| **3. Bygging** | `/explore` → `/architecture` → `/adrs` → `/evals` → `/decisions` | Guided tour, ADR-er, Eval Lab, ansvarsfordeling |

### 8.2 `/proof` — Levende Proof Center (Live CI/Prod Data)
- Production status, siste deploy, test status (487 passed), eval pass rate (F1 97.1%, grounding 97.1%, hallucination 1.2%)
- Accessibility (WCAG 2.2 AA), Performance (CWV), Security (gitleaks, npm audit, ZAP)
- Agent task success 98.7%, Human escalation 6.8%, Cost per audit < $5

### 8.3 `/trace` — Agent Trace Explorer
```
User request → Orchestrator → Context → Policy → Model → Tool → Evidence → Decision → Result → Eval
```

### 8.4 `/decisions` — What AI Did / What I Decided

| Komponent | AI (Hermes/agents) | Menneske (Chief Architect) |
|-----------|-------------------|----------------------------|
| Systemdesign | Forslag, alternativer, tradeoffs | Krav, risikogrenser, endelig avgjørelse |
| Krav | Ekstraksjon, strukturering | Godkjenning, domeneregler |
| Risiko | Deteksjon, klassifisering | Grenser, godkjenning |
| Sikkerhet | Implementering, tester | Policy, grenser, gates |
| Production gates | Sjekker, rapportering | Endelig godkjenning |

---

## 9. GitHub & IP Strategy (§16)

| Repo | Visibilitet | Innhold | Formål |
|------|-------------|---------|--------|
| **arch-platform** | **PRIVATE** | All produktkode, prompts, connectors, policy, ROI, evals | **IP-beskyttelse** — moat |
| **arch-audit-showcase** | **PUBLIC** | `architecture/`, `adrs/`, `examples/`, `evals/`, `security/` | **Engineering Portfolio** |
| **arch-trace-viewer** | **PUBLIC (senere)** | Én nyttig komponent | **Community goodwill** |

---

## 10. ARCH PUBLIC AUDIT INDEX — Long-term Moat

Når nok anonymiserte auditer er gjennomført:

> **Norwegian Automation Index** — 126 businesses, 1 842 tasks, 437 opportunities, median saving, most common bottleneck.

> **Kun aggregert, personverntrygt.** Blir Archs moat — som Celonis/UiPath sine observede prosessdata.

---

## 11. Datamodell for AI-First Discovery

```typescript
// AI Audit Session (erstatter MiniAudit)
interface AuditSession {
  id: string;
  tenant_id?: string;            // Null hvis anonym (gratis)
  company?: PublicCompanyContext; // Bygges FØR første spørsmål
  conversation: QuestionDecision[]; // Forklarbart intervju
  findings: Finding[];           // Live findings (opptil 3 for gratis)
  evidence: Evidence[];          // Bygget opp underveis
  free_boundary_reached: boolean;
  scope: "FREE" | "SCAN" | "FULL";
  created_at: string;
}

interface PublicCompanyContext {
  org_number: string;
  company_name: string;
  industry_code: string;         // NACE
  industry_name: string;
  employees_range?: string;      // Fra Brønnøysund/SSB
  revenue?: number;              // Fra regnskapsregisteret
  revenue_history?: { year: number; revenue: number }[];
  job_postings?: JobPosting[];   // Fra NAV → arbeidsintensive signaler
  website_analysis?: WebsiteAnalysis;
  tech_stack?: TechSignals;
  benchmark?: SSBBenchmark;      // Næringssnitt
  confidence: "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  data_sources: string[];        // ["bronnoyysund", "ssb", "nav", "website"]
}
```

---

## 12. Implementeringsprioritet (Oppdatert)

### Fase 1.1 — Auth + AI-First Foundation
1. **Auth + Cloudflare Access** — canonical identity model (`Identity → User → TenantMembership → Tenant`)
2. **Multi-tenancy Schema** — `identities`, `users`, `tenant_memberships`
3. **Tenant Isolation** — Application-layer (IKKE D1 RLS) + R2 prefix + 18 cross-tenant tester
4. **Database Schema v1** — Core + `audit_sessions`, `public_company_contexts`, `question_decisions`
5. **Public Discovery Engine** — Brønnøysund + SSB + NAV + Website crawler → PublicCompanyContext
6. **AI Audit Consultant API** — `/api/audit/session` + `/api/audit/question` (QuestionDecision-modell)
7. **Observability Baseline** — Trace context, AI Gateway config
8. **CI/CD Pipeline** — + cross-tenant + question-sparsomhets-tester
9. **Policy Engine (OPA)** — + free-boundary-policy
10. **Secrets Management**
11. **Tenant Onboarding Flow**

### Fase 2 — AI Audit Consultant UX
1. `/start` — AI-ledet conversation (IKKE skjema)
2. Live findings + evidence + confidence i sanntid
3. Free boundary (3 funn + indikativ ROI + teasers)
4. Commercial funnel (Scan/Full/Continuous)
5. Vertikale landingssider
6. Syntetiske demo-bedrifter med badge

### Fase 3 — Engineering Portfolio (parallelt)
1. `/explore`, `/proof`, `/trace`, `/architecture`, `/adrs`, `/evals`, `/cost`, `/case-study`, `/decisions`

---

## 13. LinkedIn Integration (Når production-verifisert)

- **Headline:** "I architect, orchestrate and verify production AI systems"
- **Projects:** Arch Audit (→ `/proof`), FinnBilGlass (case study)
- **Skills:** AI Orchestration, Cloudflare Workers, D1, Evidence-Based Audit, Policy-as-Code
- **Featured:** Lenke til `/proof` + innlegg "From AI prompt to production-governed system"

---

## 14. Akseptekriterier for Fase 1.1

Fase 1.1 er **IKKE** ferdig når login-siden virker. Den er ferdig når:

- [ ] **Auth + Identity Model** fungerer: `Identity → User → TenantMembership → Tenant`
- [ ] **Server-side Authorization** verifisert (OPA policy engine)
- [ ] **Tenant Isolation Verified** (application-layer, 18/18 cross-tenant tester grønne)
- [ ] **Session Security Verified** (Secure, HttpOnly, SameSite, expiry, rotation)
- [ ] **Traceability Verified** (trace context + AI Gateway metadata)
- [ ] **Public Discovery Engine** kjører: Brønnøysund + SSB + NAV + Website → PublicCompanyContext
- [ ] **AI Audit Consultant** stiller kun spørsmål med eksplisitt QuestionPurpose + expected_information_gain
- [ ] **INSUFFICIENT EVIDENCE** håndteres: ingen oppdiktede tall
- [ ] **Tests Green:** unit, integration, security, cross-tenant, question-sparsomhet, evals
- [ ] **Staging Verified:** deploy + smoke + cross-tenant attack tests
- [ ] **Production Gate:** eksplisitt godkjenning

---

**Status:** Klar for Fase 1.1 implementering. AI-first discovery er kjerne.
