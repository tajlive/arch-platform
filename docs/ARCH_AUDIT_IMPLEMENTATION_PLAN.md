# Arch Audit Implementation Plan

**Dato:** 2026-08-20  
**Versjon:** 1.0  
**Basert på:** ARCH_AUDIT_WORLD_CLASS_GAP.md + ARCH_AUDIT_ARCHITECTURE.md + Master Implementation Directive §91-103

---

## 1. Faseoversikt (per §91-103)

| Fase | Navn | Fokus | Akseptanse | Estimat |
|------|------|-------|------------|---------|
| **0** | TRUTH | Current state, prod verifisering, arkitektur map | Dokumentert REALITY | 1 uke |
| **1** | FOUNDATION | Auth, multi-tenancy, schema, observability baseline | Foundation can be trusted | 3-4 uker |
| **2** | PUBLIC PRODUCT | Website, demo, funnel, trust, SEO | Besøkende forstår og kan starte | 2-3 uker |
| **3** | DISCOVERY ENGINE | Business, system, process, task, evidence | Strukturert modell av virksomhet | 4-6 uker |
| **4** | INTELLIGENCE ENGINE | Findings, opportunities, feasibility, scoring | Ingen rec uten forklarbar reasoning | 4-6 uker |
| **5** | ROI + PRIORITIZATION | Deterministisk ROI, scenarier, roadmap | Alle kroner sporbare til input | 2-3 uker |
| **6** | GOVERNANCE | Policy-as-code, agent permissions, human approval | Systemet forklarer hvorfor | 3-4 uker |
| **7** | OBSERVABILITY | Full trace, cost, policy, evidence | En audit sporbart end-to-end | 2-3 uker |
| **8** | REPORT + EXECUTIVE UX | Interaktiv rapport, evidence map, drill-down | Leder forstår uten AI-kompetanse | 2-3 uker |
| **9** | OUTCOME MEASUREMENT | Expected vs Actual, kalibrering | Arch måler om anbefaling virket | 2-3 uker |
| **10** | CONTINUOUS AUDIT | Recurring, change detection, KPI tracking | Arkitektur klar for recurring | 4+ uker |
| **MCP** | MCP/INTEROP | Når behov demonstrert | Scoped tools, proper auth | TBD |

**Total estimert:** ~30-40 uker til fullt produkt (faser 0-9)

---

## 2. Fase 0 - TRUTH (UTFØRT)

| Oppgave | Status | Evidens |
|---------|--------|---------|
| Current State dokumentert | ✅ | `ARCH_AUDIT_CURRENT_STATE.md` |
| Production verifisering | ✅ | curl arch.axn.no, CF API |
| Architecture map | ✅ | `ARCH_AUDIT_ARCHITECTURE.md` |
| Data map | ✅ | `ARCH_AUDIT_DATA_MODEL.md` |
| Maturity score | ✅ | 52% (2.6/5) i CURRENT_STATE |
| Gaps identifisert | ✅ | `ARCH_AUDIT_WORLD_CLASS_GAP.md` |
| Technical debt | ✅ | Ingen auth, ingen tenancy, ingen observability |
| Risk register | ✅ | Top 5 i CURRENT_STATE |
| Nemotrorn verification | ✅ | 70-80% → 52% (overeestimat) |

**Neste:** Fase 1 - FOUNDATION

---

## 3. Fase 1 - FOUNDATION (P0: Truth + Security + Data Isolation)

### 3.1 Mål
**Foundation can be trusted.** Alle påfølgende faser bygger på solid grunnlag.

### 3.2 Arbeidspakker

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| F1.1 | **Auth + Cloudflare Access** | OIDC via Access, canonical identity model, session mgmt | - | 1 uke |
| F1.2 | **Multi-tenancy Schema** | D1 tabeller med tenant_id, Application-layer isolation | F1.1 | 1 uke |
| F1.3 | **Tenant Isolation (R2 + Workers)** | Prefix isolation, Worker middleware | F1.2 | 3 dager |
| F1.4 | **Database Schema v1** | Core + `audit_sessions`, `public_company_contexts`, `question_decisions` | F1.2 | 1 uke |
| F1.5 | **Public Discovery Engine** (NY) | Brønnøysund + SSB + NAV + Website crawler → PublicCompanyContext | F1.2 | 1 uke |
| F1.6 | **AI Audit Consultant API** (NY) | `/api/audit/session` + `/api/audit/question` (QuestionDecision-modell) | F1.5 | 3 dager |
| F1.7 | **Observability Baseline** | Trace context, AI Gateway config, cost tracking | - | 3 dager |
| F1.8 | **CI/CD Pipeline** | TypeCheck, Lint, Unit, Schema, Policy, Security, Build | - | 1 uke |
| F1.9 | **Policy Engine (OPA)** | Bundle build, runtime eval, decision logging, free-boundary-policy | - | 1 uke |
| F1.10 | **Secrets Management** | Wrangler secrets, BWS, rotation log | - | 2 dager |
| F1.11 | **Tenant Onboarding Flow** | Invite, accept, workspace creation | F1.1, F1.2 | 3 dager |

### 3.3 Akseptekriterier

- [ ] Cloudflare Access beskytter `/app/*` og `/api/*`
- [ ] Tenant A kan **aldri** lese Tenant B sin data (Application-layer isolation test)
- [ ] R2 filer isolert per tenant prefix
- [ ] Alle API-endepunkter krever auth
- [ ] Trace context propageres gjennom alle Workers
- [ ] AI Gateway metadata inkluderer tenant_id, audit_id, agent_id
- [ ] Policy engine evaluerer ALLOW/DENY/REQUIRE_APPROVAL
- [ ] Alle policy decisions logges immutable
- [ ] CI pipeline kjører: typecheck → lint → unit → schema → policy → security → build
- [ ] **Public Discovery Engine** kjører: Brønnøysund + SSB + NAV + Website → PublicCompanyContext
- [ ] **AI Audit Consultant** stiller kun spørsmål med eksplisitt QuestionPurpose + expected_information_gain
- [ ] **INSUFFICIENT EVIDENCE** håndteres: ingen oppdiktede tall
- [ ] Cross-tenant attack tests: 18/18 grønne
- [ ] Question-sparsomhets-tester: AI spør aldri om kjent info

---

## 4b. Portfolio & Engineering Proof Experience (Ny Fase - kan kjøres parallelt med Fase 2)

### Mål
**Arch Audit nettsiden fungerer som et levende teknisk CV og bevis på AI-orchestration-kompetanse.** Ikke bare et produkt — selve nettsiden *er* porteføljen.

### Arbeidspakker

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| P1.1 | **Recruiter / Engineering Tour (`/explore`)** | 2–3 min guidet gjennomgang: problem → arkitektur → agenter → governance → security → observability → evals → produksjonsbevis | Fase 1 (auth) | 1 uke |
| P1.2 | **Levende Proof Center (`/proof`)** | Production status, test status, eval pass rate, accessibility, performance, security checks, agent metrics — data fra CI/produksjon | Fase 1 (observability) | 1 uke |
| P1.3 | **Agent Trace Explorer (`/trace`)** | Interaktiv span-visning per demo-audit: request → orchestrator → policy → model → tool → evidence → decision | Fase 1 (observability) | 1 uke |
| P1.4 | **Challenge Arch (`/challenge`)** | Mini-audit i sanntid: syntetisk bedrift → evidence strength, assumptions, confidence, ROI-range, risk | Fase 3 (intelligence) | 1 uke |
| P1.5 | **Architecture Explorer (`/architecture`)** | Interaktivt diagram: Worker, D1, R2, AI Gateway, Agent, Evidence Store, Policy Engine. Hvert element: Why? | Fase 1 | 3 dager |
| P1.6 | **ADR Log (`/adrs`)** | ADR-001 Cloudflare Workers, ADR-002 Tenant Isolation, ADR-003 Deterministic ROI, ADR-004 Multi-Agent, ADR-005 OPA vs Cedar | — | 2 dager |
| P1.7 | **Eval Lab (`/evals`)** | Golden cases, regression gate, version comparison, cost vs quality | Fase 4 (evals) | 1 uke |
| P1.8 | **AI Cost Metrics (`/cost`)** | Cost per audit, cost per finding, model routing, AI Gateway cost estimation | Fase 1 (observability) | 3 dager |
| P1.9 | **FinnBilGlass Case Study (`/case-study`)** | Engineering edition: problem → domain → data → AI arch → security → bugs → fixes → prod | FinnBilGlass prod | 1 uke |
| P1.10 | **What AI Did / What I Decided (`/decisions`)** | Tabell per komponent: AI vs Menneske ansvar | — | 2 dager |

### Akseptekriterier
- [ ] `/explore` gir 2–3 min guided tour uten forutsetning om forretningskunnskap
- [ ] `/proof` viser live data fra CI/produksjon (ikke hardkodet)
- [ ] `/trace` viser full agent trace med policy decisions per span
- [ ] `/challenge` viser "insufficient evidence" der det gjelder
- [ ] `/architecture` forklarer "Why?" per teknologi
- [ ] ADR-er publisert og sanert
- [ ] `/evals` viser regression gate (95% threshold)
- [ ] `/cost` viser cost per audit/finding med model routing
- [ ] `/case-study` er engineering case study, ikke reklame
- [ ] `/decisions` viser tydelig AI vs Menneske ansvar per komponent

---

## 4. Fase 2 - PUBLIC PRODUCT EXPERIENCE

### 4.1 Mål
**En ny besøkende forstår produktet og kan starte en audit.**

### 4.2 Arbeidspakker

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| F2.1 | **Homepage Hero + CTA** | Value prop, "Start audit", trust signals | Fase 1 | 3 dager |
| F2.2 | **12 Ruter** | /audit, /how-it-works, /methodology, /security, /roi, /report, /industries, /cases, /resources, /about, /start, /login | F2.1 | 1 uke |
| F2.3 | **Interaktiv Demo** | "Nordic Logistics AS" med drill-down | F2.2 | 1 uke |
| F2.4 | **AI Audit Consultant UX** | AI-ledet conversation, live findings, free boundary | F1.6 | 1 uke |
| F2.5 | **Mobile + WCAG 2.2 AA** | Responsive, keyboard, contrast, screen reader | F2.2 | 3 dager |
| F2.6 | **SEO + Structured Data** | Organization, Service, FAQ, Breadcrumb | F2.2 | 2 dager |
| F2.7 | **Analytics Funnel** | VISIT → CTA → START → WORKSPACE → COMPLETE | F2.4 | 2 dager |

### 4.3 Akseptekriterier

- [ ] Besøkende forstår hva Arch Audit gjør på 5 sekunder
- [ ] "Start audit" → funnel → workspace opprettes
- [ ] Demo viser evidence, ROI, roadmap interaktivt
- [ ] Alle sider WCAG 2.2 AA
- [ ] Core Web Vitals > 90
- [ ] Funnel tracking i analytics

---

## 5. Fase 3 - DISCOVERY ENGINE

### 5.1 Mål
**Arch kan lage en strukturert og sporbar modell av virksomheten.**

### 5.2 Arbeidspakker

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| F3.1 | **Business Discovery** | Adaptive spørreskjema, business model, revenue, KPIs | Fase 2 | 1 uke |
| F3.2 | **System Inventory** | CRUD API, evidence linking, stack-detect integration | Fase 1 | 1 uke |
| F3.3 | **Process Capture** | Swimlane editor, varianter, unntak, evidence linking | F3.2 | 2 uker |
| F3.4 | **Task Capture** | Filtrerbar tabell, automation candidate flagg, scores | F3.3 | 1 uke |
| F3.4 | **Evidence Ingestion** | Alle 10 source types, hash, hash-verification, R2 storage | Fase 1 | 2 uker |
| F3.5 | **Evidence Graph** | Finding → evidence → source traversal, contradiction detection | F3.4 | 1 uke |
| F3.6 | **Discovery Pipeline** | State machine DISCOVERY → DATA_COLLECTION | F3.1-F3.5 | 1 uke |

### 5.3 Akseptekriterier

- [ ] Business discovery ferdig på < 10 min
- [ ] System inventory fylles automatisk (stack-detect) + manuelt
- [ ] Prosesser visualiseres som swimlane med varianter
- [ ] Tasks har automation candidate + scores
- [ ] Alle evidence har hash, classification E0-E4, kalibrert confidence
- [ ] Kontradiksjoner detekteres (interview vs system)
- [ ] State machine flyter DISCOVERY → DATA_COLLECTION automatisk

---

## 6. Fase 4 - INTELLIGENCE ENGINE

### 6.1 Mål
**Ingen recommendation uten forklarbar reasoning/evidence.**

### 6.2 Arbeidspakker

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| F4.1 | **Finding Engine** | Statement + evidence_ids + confidence + business impact | Fase 3 | 1 uke |
| F4.2 | **Opportunity Detection** | Automation classifier (11 typer), feasibility scoring | Fase 3 | 1 uke |
| F4.3 | **Feasibility Engines** | AI feasibility, Data readiness, Integration feasibility | Fase 3 | 1 uke |
| F4.4 | **Risk Engine** | 11 kategorier → autonomy constraint | Fase 1 (policy) | 1 uke |
| F4.5 | **Opportunity Scoring** | Deterministisk 0-100, sensitivity test | Fase 3 | 1 uke |
| F4.6 | **Critic Agent** | Contradiction check, hallucination check, calc verification | Fase 3 | 1 uke |
| F4.7 | **Intelligence Pipeline** | ANALYSIS → EVIDENCE_VALIDATION → OPPORTUNITY_SCORING | F4.1-F4.6 | 1 uke |

### 6.3 Akseptekriterier

- [ ] Alle findings har evidence_ids (minst 1)
- [ ] Evidence class E0-E4 på alle evidence
- [ ] Automation type fra 11 kategorier
- [ ] AI/Data/Integration feasibility scores 0-100
- [ ] Risk assessment 11 kategorier → autonomy constraint
- [ ] Opportunity score 0-100 deterministisk + sensitivity
- [ ] Critic agent flagger kontradiksjoner og hallucinasjoner
- [ ] Ingen opportunity uten forklarbar reasoning/evidence

---

## 7. Fase 5 - ROI + PRIORITIZATION

### 7.1 Mål
**Alle viktige kroner kan spores tilbake til input.**

### 7.2 Arbeidspakker

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| F5.1 | **ROI Engine** | Deterministisk beregning, pure functions, ingen LLM | Fase 4 | 1 uke |
| F5.2 | **Scenario Modelling** | LOW/EXPECTED/HIGH, Monte Carlo eller bounds | F5.1 | 3 dager |
| F5.3 | **Variable Classification** | MEASURED/CUSTOMER_PROVIDED/DERIVED/BENCHMARK/ASSUMED | F5.1 | 3 dager |
| F5.4 | **Sensitivity Analysis** | Hvilke variabler driver payback/ROI | F5.1 | 3 dager |
| F5.5 | **Roadmap Engine** | NOW/NEXT/LATER med dependencies og risk | Fase 4 | 1 uke |
| F5.6 | **ROI Pipeline** | ROI → RISK_REVIEW → HUMAN_QA | F5.1-F5.5 | 3 dager |

### 7.3 Akseptekriterier

- [ ] ROI beregnes 100% deterministisk (ingen LLM)
- [ ] Tre scenarier: LOW/EXPECTED/HIGH
- [ ] Alle variabler klassifisert (MEASURED/ASSUMED/etc.)
- [ ] Sensitivitetanalyse viser drivere
- [ ] Roadmap NOW/NEXT/LATER med avhengigheter
- [ ] Payback, NPV, IRR beregnet

---

## 8. Fase 6 - GOVERNANCE

### 8.1 Mål
**Systemet kan forklare hvorfor en agent fikk lov til å gjøre noe.**

### 8.2 Arbeidspakker

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| F6.1 | **Policy-as-Code (OPA)** | Rego rules, bundle, runtime eval, CI test | Fase 1 | 1 uke |
| F6.2 | **Agent Capabilities** | Tool permissions per agent, evidence requirements | F6.1 | 3 dager |
| F6.3 | **Autonomy Model A0-A5** | Risk × evidence × reversibility → max autonomy | F6.1 | 1 uke |
| F6.3 | **Human Approval Gates** | Policy-drevet REQUIRE_APPROVAL, approvers per risiko | F6.1 | 3 dager |
| F6.4 | **Destructive Actions** | DELETE/DEPLOY/EXPORT krever A3+ + human | F6.1 | 3 dager |
| F6.5 | **Decision Traces** | WHO/WHAT → CONTEXT → EVIDENCE → POLICY → DECISION | F6.1 | 1 uke |
| F6.6 | **CI/CD Policy Enforcement** | `opa test` gate, bundle deploy, rollback | F6.1 | 3 dager |

### 8.3 Akseptekriterier

- [ ] OPA bundle bygger, tester grønne
- [ ] Runtime policy eval: ALLOW/DENY/REQUIRE_APPROVAL
- [ ] Agent capabilities definert (tools, evidence req)
- [ ] Autonomy A0-A5 enforced per handling
- [ ] Human gates trigges av policy (risk × evidence × reversibility)
- [ ] Destructive actions blokkert uten A3+ + approval
- [ ] Alle policy decisions logges med trace_id
- [ ] CI gate: `opa test` må være grønn

---

## 9. Fase 7 - OBSERVABILITY

### 9.1 Mål
**En audit kan spores: USER → WORKFLOW → AGENT → MODEL → TOOL → POLICY → EVIDENCE → RESULT → COST.**

### 9.2 Arbeidspakker

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| F7.1 | **Trace Manager** | Trace/span CRUD, parent-child, context propagation | Fase 1 | 1 uke |
| F7.2 | **AI Gateway Integration** | Alle AI-kall via Gateway, metadata, cost tracking | Fase 1 | 3 dager |
| F7.3 | **Cost Governance** | Per trace/audit/tenant/agent/model/phase, budgets | F7.2 | 1 uke |
| F7.4 | **Policy & Evidence Tracing** | Policy decisions + evidence IDs per span | Fase 6, 3 | 3 dager |
| F7.5 | **OpenTelemetry Export** | OTLP eksport, sanitization (ingen PII) | F7.1 | 3 dager |
| F7.6 | **Dashboard (Control Center)** | Active traces, cost breakdown, latency, errors | F7.1 | 1 uke |
| F7.7 | **Query API** | Trace lookup, cost report, agent perf, bottlenecks | F7.1 | 3 dager |

### 9.3 Akseptekriterier

- [ ] Full trace per audit run (user → workflow → agent → tool → policy → evidence)
- [ ] Alle AI-kall via AI Gateway med metadata
- [ ] Kostnader per trace/audit/tenant/agent/model/fase
- [ ] Budget alerts (70%/90%/100%) + auto-pause
- [ ] Policy decisions synlige i trace
- [ ] Evidence IDs linket til spans
- [ ] OTLP eksport fungerende (Datadog/Honeycomb/Grafana)
- [ ] Dashboard: active traces, cost by model/agent/phase, latency P95

---

## 10. Fase 8 - REPORT + EXECUTIVE UX

### 10.1 Mål
**En daglig leder uten AI-kompetanse forstår hva som bør gjøres først.**

### 10.2 Arbeidspakker

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| F8.1 | **Executive Summary** | One-page: systems, processes, tasks, evidence, opportunities, value, payback | Fase 5 | 3 dager |
| F8.2 | **Interactive Report** | HTML med drill-down: finding → evidence → ROI | Fase 8 | 1 uke |
| F8.3 | **Opportunity Matrix** | Value vs Effort vs Risk visualisering | Fase 5 | 3 dager |
| F8.4 | **Process Views** | Swimlane, timeline, bottleneck highlighting | Fase 3 | 3 dager |
| F8.5 | **Evidence Drill-Down** | Klikk funn → se evidence graph → kilde | Fase 3 | 3 dager |
| F8.6 | **Report Generation** | PDF + HTML, executive + technical + evidence JSON | Fase 8 | 3 dager |
| F8.7 | **Delivery & Record** | Leveranse i workspace, record-delivery.mjs | Fase 1 | 2 dager |

### 10.3 Akseptekriterier

- [ ] Executive summary forstås av leder uten AI-bakgrunn
- [ ] Interaktiv rapport: klikk funn → evidence → ROI
- [ ] Opportunity matrix: value vs effort vs risk
- [ ] Prosessvisning: swimlane + bottleneck
- [ ] Evidence drill-down: funn → evidence graph → kilde
- [ ] PDF + HTML + JSON leveranse
- [ ] Record-delivery logget i D1

---

## 11. Fase 9 - OUTCOME MEASUREMENT

### 11.1 Mål
**Arch kan måle om anbefalt tiltak ga verdi.**

### 11.2 Arbeidspakker

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| F9.1 | **Implementation Tracking** | Status, kostnad, team, metodologi, notater | Fase 8 | 1 uke |
| F9.2 | **Outcome Measurement** | Expected vs Actual: time, cost, errors, throughput | F9.1 | 1 uke |
| F9.3 | **Variance Analysis** | Avvik per metrikk, overall accuracy | F9.2 | 3 dager |
| F9.4 | **Calibration Updates** | Oppdater AI feasibility, data readiness, cost estimates | F9.2 | 3 dager |
| F9.5 | **Learning Loop** | Audit → Opp → Impl → Obs → Outcome → Compare → Learn | F9.1-F9.4 | 1 uke |

### 11.3 Akseptekriterier

- [ ] Implementasjoner sporeres (status, kostnad, team)
- [ ] Expected vs Actual per metrikk
- [ ] Variance analysis med overall accuracy
- [ ] Kalibrering oppdaterer: AI feasibility, data readiness, cost estimates
- [ ] Learning loop lukket: fremtidige audits bruker kalibrering

---

## 12. Fase 10 - CONTINUOUS AUDIT (Arkitektur først)

### 12.1 Mål
**Arkitektur klar for recurring audits, change detection, KPI tracking.**

### 12.2 Arbeidspakker (Design-fase)

| ID | Pakke | Beskrivelse | Avhengighet | Estimat |
|----|-------|-------------|-------------|---------|
| F10.1 | **Recurring Schedule** | Cron/Workers scheduled runs per tenant | Fase 9 | Design |
| F10.2 | **Change Detection** | Hash-basert diff på system/process/task models | Fase 9 | Design |
| F10.3 | **New System Detection** | CMDB/API registry sync | Fase 9 | Design |
| F10.4 | **KPI Tracking Dashboard** | Tenant KPIs over tid | Fase 9 | Design |
| F10.5 | **Continuous Optimization** | Opportunity refresh, re-prioritering | Fase 9 | Design |

**Ikke bygg før kjernen (faser 1-9) fungerer.**

---

## 13. MCP Phase (Ved reelt behov)

| Trigger | Krav |
|---------|------|
| Kunde trenger agent-til-agent interoperability | MCP 2026-07-28 spec (stateless, header routing, Tasks extension) |
| Eksternt system trenger å kalle Arch Audit | Scoped tools, proper auth, policy enforcement |
| Multi-agent orchestration utvidelse | Tenant isolation, tracing, schema validation |

**Ikke bygg før behov er demonstrert.**

---

## 14. Prioriteringsregel (§103)

For hvert backlog-item score 0-100:

| Kriterium | Vekt |
|-----------|------|
| USER VALUE | 25% |
| AUDIT QUALITY | 20% |
| REVENUE VALUE | 20% |
| RISK REDUCTION | 15% |
| ENGINEERING EFFORT | 10% (invers) |
| DEPENDENCIES | 5% |
| TIME TO VALUE | 5% |
| ARCHITECTURAL IMPORTANCE | 10% |

**Bruk 0-100 prioritization. Ikke implementer i tilfeldig rekkefølge.**

---

## 15. Git & Deployment Disciplin (§106-107)

```markdown
## Git Rules
- Clean working tree før arbeid
- Feature branches fra main
- Commit messages: "feat: add X", "fix: resolve Y", "docs: update Z"
- Ingen "fix stuff" eller "updates"
- Atomiske commits (én logisk endring)

## Deployment
- Staging/preview først
- Før production: tests green, build green, migrations verified, policy green, security green, smoke green
- Rollback forstått og testet
- Produksjonsdeploy ≠ debugging
```

---

## 16. Evidence for Implementation (§108)

Etter hver fase leverer:

```markdown
## FASE X - EVIDENCE

### BEFORE
Verifisert tilstand (skjermbilder, curl, test resultater)

### CHANGE
Hva ble gjort (filer, linjer, arkitekturendringer)

### TEST
Hva ble testet (unit, integration, smoke, security, evals)

### EVIDENCE
Hvordan vet vi det virker? (skjermbilder, curl output, test output, dashboards)

### RISK
Hva gjenstår? (kjente bugs, teknisk gjeld, avhengigheter)

### NEXT
Neste prioritet (ifølge prioriteringsregel)
```

---

## 17. Master Backlog (Canonical)

| ID | Fase | Capability | Problem | Evidence | Solution | Value | Risk | Effort | Dependencies | Priority | Status | Acceptance Test |
|----|------|------------|---------|----------|----------|-------|------|--------|--------------|----------|--------|-----------------|
| F1.1 | 1 | Auth + Access | Ingen auth | CURRENT_STATE | Cloudflare Access OIDC + canonical identity | Kritisk | Høy | 1 uke | - | P0 | PLANNED | Access beskytter /app/*, application-layer isolation test grønn |
| F1.2 | 1 | Multi-tenancy | Ingen tenant isolation | CURRENT_STATE | Application-layer isolation + tenant_id i alle spørringer | Kritisk | Høy | 1 uke | F1.1 | P0 | PLANNED | Tenant A ≠ Tenant B data |
| F1.3 | 1 | R2/Worker Isolation | Cross-tenant filer | CURRENT_STATE | Prefix + middleware | Kritisk | Høy | 3d | F1.2 | P0 | PLANNED | Tenant A ≠ Tenant B filer |
| F1.4 | 1 | DB Schema v1 | Ingen DB for Arch | CURRENT_STATE | Core + audit_sessions + public_company_contexts + question_decisions | Høy | Medium | 1 uke | F1.2 | P1 | PLANNED | Migrering grønn, tenant-scoping aktiv |
| F1.5 | 1 | Observability Baseline | Ingen tracing | CURRENT_STATE | Trace ctx + AI Gateway | Høy | Lav | 3d | - | P0 | PLANNED | Trace ctx propageres |
| F1.6 | 1 | CI/CD Pipeline | Bare deploy.yml | CURRENT_STATE | 8 gates + build | Høy | Medium | 1 uke | - | P1 | PLANNED | CI grønn på PR |
| F1.7 | 1 | Policy Engine | Kun policies.yaml | CURRENT_STATE | OPA bundle + runtime | Kritisk | Medium | 1 uke | - | P0 | PLANNED | ALLOW/DENY/REQUIRE_APPROVAL |
| F2.1 | 2 | Homepage | Generisk landing | CURRENT_STATE | Hero + CTA + trust | Medium | Lav | 3d | F1.x | P1 | PLANNED | 5-sek test bestått |
| F2.2 | 2 | 12 Routes | Kun 4 sider | PRODUCT | 12 ruter implementert | Medium | Medium | 1 uke | F2.1 | P1 | PLANNED | Alle 12 ruter 200 OK |
| F2.3 | 2 | Interactive Demo | Ikke eksisterer | PRODUCT | Nordic Logistics demo | Høy | Medium | 1 uke | F2.2 | P1 | PLANNED | Demo drill-down fungerer |
| F2.4 | 2 | AI Audit Consultant UX | Ikke eksisterer | PRODUCT | AI-ledet conversation (IKKE skjema) | Høy | Medium | 1 uke | F1.6 | P1 | PLANNED | AI-samtale → live findings → free boundary |
| F3.1 | 3 | Business Discovery | Kun intervju | GAP | Adaptive spørreskjema | Høy | Medium | 1 uke | F2.4 | P1 | PLANNED | < 10 min completion |
| F3.2 | 3 | System Inventory | Delvis (stack-detect) | GAP | CRUD + evidence | Høy | Medium | 1 uke | F1.4 | P1 | PLANNED | Auto + manual, evidence |
| F3.3 | 3 | Process Capture | Ikke eksisterer | GAP | Swimlane + varianter | Kritisk | Høy | 2 uker | F3.2 | P0 | PLANNED | Swimlane + unntak |
| F3.4 | 3 | Task Capture | Ikke eksisterer | GAP | Filtrerbar + scores | Høy | Medium | 1 uke | F3.3 | P1 | PLANNED | Automation candidate flagg |
| F3.5 | 3 | Evidence Ingestion | Delvis (Finnbilglass) | GAP | 10 source types + hash | Kritisk | Høy | 2 uker | F1.4 | P0 | PLANNED | 10 types, hash verify |
| F3.6 | 3 | Evidence Graph | Ikke eksisterer | GAP | Finding→evidence→source | Høy | Medium | 1 uke | F3.5 | P1 | PLANNED | Traversering + kontradiksjon |
| F4.1 | 4 | Finding Engine | Ikke eksisterer | GAP | Statement + evidence | Kritisk | Medium | 1 uke | F3.6 | P0 | PLANNED | Alle findings har evidence |
| F4.2 | 4 | Opportunity Detection | Ikke eksisterer | GAP | 11 typer + feasibility | Kritisk | Høy | 1 uke | F3.6 | P0 | PLANNED | 11 typer klassifisert |
| F4.3 | 4 | Feasibility Engines | Ikke eksisterer | GAP | AI/Data/Integration 0-100 | Høy | Medium | 1 uke | F4.2 | P1 | PLANNED | 3 scores per opportunity |
| F4.4 | 4 | Risk Engine | Ikke eksisterer | GAP | 11 kat → autonomy | Kritisk | Medium | 1 uke | F6.3 | P0 | PLANNED | 11 kat → A0-A5 |
| F4.5 | 4 | Opportunity Scoring | Ikke eksisterer | GAP | Deterministisk 0-100 | Høy | Medium | 1 uke | F4.2 | P1 | PLANNED | 0-100 + sensitivity |
| F5.1 | 5 | ROI Engine | Basic i commercial.mjs | GAP | Deterministisk + scenarier | Kritisk | Medium | 1 uke | F4.x | P0 | PLANNED | 100% deterministisk |
| F5.2 | 5 | Scenario Modelling | Ikke eksisterer | GAP | LOW/EXPECTED/HIGH | Høy | Medium | 3d | F5.1 | P1 | PLANNED | 3 scenarier |
| F5.3 | 5 | Variable Classification | Ikke eksisterer | GAP | MEASURED/ASSUMED/... | Høy | Medium | 3d | F5.1 | P1 | PLANNED | Alle variabler klassifisert |
| F6.1 | 6 | Policy-as-Code | Kun policies.yaml | GAP | OPA Rego + bundle | Kritisk | Medium | 1 uke | F1.7 | P0 | PLANNED | Runtime ALLOW/DENY/REQ |
| F6.3 | 6 | Autonomy A0-A5 | Ikke eksisterer | GAP | Risk×evidence×reversibility | Kritisk | Medium | 1 uke | F6.1 | P0 | PLANNED | Policy-drevet autonomy |
| F6.5 | 6 | Decision Traces | Ikke eksisterer | GAP | WHO→CONTEXT→EVIDENCE→POLICY→DECISION | Høy | Medium | 1 uke | F6.1 | P1 | PLANNED | Full trace per decision |
| F7.1 | 7 | Trace Manager | Ikke eksisterer | GAP | Trace/span CRUD | Kritisk | Medium | 1 uke | F1.5 | P0 | PLANNED | Full trace per audit |
| F7.2 | 7 | AI Gateway | Ikke brukt | GAP | Alle AI-kall via Gateway | Kritisk | Lav | 3d | F1.5 | P0 | PLANNED | Metadata + cost tracking |
| F7.3 | 7 | Cost Governance | Ikke eksisterer | GAP | Per trace/tenant/agent + budgets | Høy | Medium | 1 uke | F7.2 | P1 | PLANNED | Budget alerts + pause |
| F8.1 | 8 | Executive Summary | Statisk markdown | PRODUCT | One-page leder-vennlig | Høy | Medium | 3d | F5.x | P1 | PLANNED | Leder forstår på 2 min |
| F8.2 | 8 | Interactive Report | Statisk markdown | PRODUCT | HTML drill-down | Høy | Medium | 1 uke | F8.1 | P1 | PLANNED | Drill-down funn→evidence→ROI |
| F9.1 | 9 | Implementation Tracking | record-delivery.mjs ubrukt | GAP | Status, kostnad, team | Høy | Medium | 1 uke | F8.7 | P1 | PLANNED | Sporbar implementasjon |
| F9.2 | 9 | Outcome Measurement | Ikke eksisterer | GAP | Expected vs Actual | Kritisk | Medium | 1 uke | F9.1 | P0 | PLANNED | Variance per metrikk |
| F9.4 | 9 | Calibration Updates | Ikke eksisterer | GAP | AI feasibility, data readiness | Høy | Medium | 3d | F9.2 | P1 | PLANNED | Kalibrering oppdateres |
```

---

## 18. Execution Board

| Status | Beskrivelse |
|--------|-------------|
| `DISCOVERED` | Identifisert i backlog |
| `VERIFIED` | Current state verifisert, problem bekreftet |
| `PLANNED` | I plan, avhengigheter klart |
| `IN_PROGRESS` | Arbeider aktivt |
| `CODED` | Kode skrevet, ikke testet |
| `TESTED` | Enhetstester + integrasjonstester grønne |
| `STAGING_VERIFIED` | Deployet til staging, smoke test grønn |
| `PRODUCTION_VERIFIED` | Deployet til prod, curl verifisert |
| `BLOCKED` | Blokkert av avhengighet/avklaring |

**Regel:** Ingen `PRODUCTION_VERIFIED` uten faktisk `curl` verifisering i prod.

---

## 19. Neste Aksjon

**Start Fase 1.1: Auth + Cloudflare Access**

Dette er fundamentet alt annet bygger på. Uten auth og tenant isolation kan ingen kundedata håndteres trygt.