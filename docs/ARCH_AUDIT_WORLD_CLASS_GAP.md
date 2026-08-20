# Arch Audit World-Class Gap Analysis

**Dato:** 2026-08-20  
**Basert på:** ARCH_AUDIT_CURRENT_STATE.md + benchmark mot UiPath, Celonis, ServiceNow, Microsoft, Google, AWS, OpenAI, Anthropic, McKinsey, BCG, Bain, Deloitte, Accenture

---

## Gap Oppsummering

| Kategori | Current | World-Class Target | Gap |
|----------|---------|-------------------|-----|
| Discovery | Questionnaire + passive web | Process Mining + Task Mining + System Mining | **KRITISK** |
| Evidence | 3-class, provenance | E0–E4 strength, system-verified, confidence calibration | **HØY** |
| Economics | Basic ROI | Deterministic scenarios, measured/assumed classification, sensitivity | **HØY** |
| Governance | Gates + Linear SSO | Policy-as-code (OPA/Cedar) runtime + CI enforcement | **HØY** |
| Observability | Pre-deploy only | Full distributed trace (user→agent→tool→policy→evidence) | **KRITISK** |
| Security | Leakage-audit + secrets ref | Zero-trust, tenant isolation, auth, OWASP ASVS L2, **Application-layer tenant isolation** | **KRITISK** |
| UX | Case-sider + landing | Executive dashboard, interactive report, drill-down | **MEDIUM** |
| Automation | Partial (collect + audit) | End-to-end audit pipeline med state machine | **HØY** |
| Human Control | Tom-godkjenning | RACI + Autonomy Model A0–A5 + eskaleringssti | **MEDIUM** |
| Outcomes | Not tracked | Expected vs Actual loop, continuous learning | **HØY** |
| Continuous Audit | Ad-hoc | Recurring measurements, change detection, KPI tracking | **HØY** |
| **Engineering Proof Portfolio** | Ingen | Live proof center, agent trace explorer, challenge arch, ADR-er, eval lab | **KRITISK** (differensierer) |

---

## Detaljerte Gap per dimensjon (fra §114 direktivet)

### 1. DISCOVERY — "Bedre enn questionnaire-only"

| World-Class (UiPath/Celonis/ServiceNow) | Arch Status | Gap |
|------------------------------------------|-------------|-----|
| **Process Mining**: Event logs fra systemer → faktisk prosessflyt | Kun passiv web-crawl + interview | **KRITISK** |
| **Task Mining**: Brukeraktivitet (UI-level) → task-tid, variasjon, unntak | Ikke implementert | **KRITISK** |
| **System Mining**: API/DB-skjema → system inventory automatisk | Delvis (stack-detect, GitHub adapter) | **HØY** |
| **Automatisert prosessoppdagelse** | Manuell spørreskjema + web-crawl | **KRITISK** |
| **Variantanalyse** (happy path vs unntak) | Ikke implementert | **HØY** |

**Handlingsbehov:**
- Bygg `packages/discovery/` med: `process-mining.mjs`, `task-mining.mjs`, `system-mining.mjs`
- Integrer med D1 event logs, API-specer, UI-automasjon (Playwright/Puppeteer)
- State machine for discovery pipeline

---

### 2. EVIDENCE — "Findings kan spores til kilder"

| World-Class | Arch Status | Gap |
|-------------|-------------|-----|
| **Evidence Strength E0–E4** (Unsupported → System Verified) | 3-class (AUTO/INFERRED/HUMAN) | **HØY** |
| **Confidence Calibration** (LLM confidence → empirisk kalibrert) | Ikke implementert | **HØY** |
| **System-Verified Evidence** (DB/API query → hash → immutable) | Delvis (sha256 i Finnbilglass D1) | **MEDIUM** |
| **Evidence Graph** (provenance chain: kilde → funn → anbefaling) | Delvis (evidence_ids på findings) | **MEDIUM** |
| **Contradiction Detection** (intervju vs systemdata) | Planlagt (sekvens 21 i direktiv) | **HØY** |

**Handlingsbehov:**
- Utvid `classify.mjs` til E0–E4 + confidence calibration
- Bygg evidence graph i D1: `evidence → finding → opportunity → recommendation`
- Implementer `contradiction-check.mjs` (intervju vs systemdata)

---

### 3. ECONOMICS — "ROI er transparent"

| World-Class (McKinsey/BCG/Bain + UiPath) | Arch Status | Gap |
|-------------------------------------------|-------------|-----|
| **Deterministic ROI Engine** (formel, ikke LLM) | `commercial.mjs` basic | **HØY** |
| **Scenario Modelling** (LOW/EXPECTED/HIGH) | Ikke implementert | **HØY** |
| **Variable Classification** (MEASURED/CUSTOMER_PROVIDED/DERIVED/BENCHMARK/ASSUMED) | Ikke implementert | **HØY** |
| **Sensitivity Analysis** | Ikke implementert | **MEDIUM** |
| **Payback / NPV / IRR** | Kun payback months | **MEDIUM** |
| **Cost Avoidance vs Revenue Generation** | Ikke skilt | **MEDIUM** |

**Handlingsbehov:**
- Bygg `packages/roi/` med deterministic engine
- Scenario modelling med Monte Carlo eller deterministic bounds
- Variable classification på alle økonomiske inputs

---

### 4. GOVERNANCE — "Agents opererer under policy"

| World-Class (Anthropic MCP, OpenAI, Google A2A) | Arch Status | Gap |
|--------------------------------------------------|-------------|-----|
| **Policy-as-Code** (OPA/Rego, Cedar) runtime enforcement | `policies.yaml` kun deklarativ | **KRITISK** |
| **CI/CD Policy Enforcement** | Ikke implementert | **HØY** |
| **Agent Capability Registry** (hva hver agent kan) | Ikke implementert | **HØY** |
| **Human-in-Loop Policy** (risk × evidence × reversibility) | Tom-godkjenning ad-hoc | **MEDIUM** |
| **Decision Trace** (WHO/WHAT → CONTEXT → EVIDENCE → POLICY → DECISION) | Ikke implementert | **HØY** |
| **Audit Log** (immutable, tamper-proof) | Ikke implementert | **HØY** |

**Handlingsbehov:**
- Evaluér OPA vs Cedar for `policies.yaml` → runtime enforcement
- Bygg `packages/policy/` med: `engine.mjs`, `ci-enforcement.mjs`, `decision-trace.mjs`
- Definer autonomy model A0–A5 i policy

---

### 5. OBSERVABILITY — "Runs kan rekonstrueres"

| World-Class (Glean, Domo, Datadog, OpenTelemetry) | Arch Status | Gap |
|----------------------------------------------------|-------------|-----|
| **Distributed Tracing** (user→workflow→agent→model→tool→policy→evidence) | **INGEN** | **KRITISK** |
| **Cost Tracking** (per run/audit/agent/model/tenant) | **INGEN** | **KRITISK** |
| **Latency P50/P95/P99** per component | **INGEN** | **HØY** |
| **Error Tracking** med trace ID | **INGEN** | **HØY** |
| **Hallucination Detection** (grounding score) | **INGEN** | **HØY** |
| **OpenTelemetry Export** | **INGEN** | **MEDIUM** |
| **Cloudflare AI Gateway** (tokens, cost, errors, latency) | Tilgjengelig, ikke brukt | **LAV** (low hanging fruit) |

**Handlingsbehov:**
- Bygg `packages/observability/` (P0 i direktiv)
- Bruk Cloudflare AI Gateway native (tokens, cost, errors, latency, OTel spans)
- Instrumenter alle agent-kall, tool-calls, policy-decisions
- Trace ID propagation gjennom hele audit-pipeline

---

### 6. SECURITY — "Tenant/data isolation er verifisert"

| World-Class (OWASP ASVS L2, SOC2, ISO27001) | Arch Status | Gap |
|----------------------------------------------|-------------|-----|
| **Authentication** (MFA, SSO, session mgmt) | **INGEN** | **KRITISK** |
| **Authorization** (RBAC, ABAC, tenant isolation) | **INGEN** | **KRITISK** |
| **Multi-Tenancy** (data-level isolation, RLS) | **INGEN** | **KRITISK** |
| **Prompt Injection Defense** (trust boundaries) | Planlagt (sekvens 62) | **HØY** |
| **File Ingestion Security** (malware, size, type, tenant scope) | **INGEN** | **HØY** |
| **API Security** (rate limit, schema validation, idempotency) | **INGEN** | **HØY** |
| **Secrets Rotation** (automatisert, auditert) | Manual (BWS/wrangler) | **MEDIUM** |

**Handlingsbehov:**
- Implementer auth (Cloudflare Access / Workers auth / OIDC)
- Multi-tenancy schema med RLS på D1 (før kundedata)
- Prompt injection defense: system instruction vs customer content separation
- OWASP ASVS L2 baseline review

---

### 7. UX — "Leder forstår resultatet raskt"

| World-Class (Linear, Vercel, Stripe, Notion) | Arch Status | Gap |
|----------------------------------------------|-------------|-----|
| **Executive Dashboard** (one-page summary) | Case-sider, ingen dashboard | **MEDIUM** |
| **Interactive Report** (drill-down: finding → evidence → ROI) | Statisk markdown | **HØY** |
| **Opportunity Matrix** (value vs effort vs risk) | Ikke implementert | **MEDIUM** |
| **Process Views** (swimlane, timeline, bottleneck) | Ikke implementert | **MEDIUM** |
| **Evidence Drill-Down** (klikk funn → se kilde) | Evidence JSON kun | **MEDIUM** |
| **Mobile-First Audit Workspace** | Ikke testet | **LAV** |
| **WCAG 2.2 AA** | Ikke verifisert | **LAV** |

**Handlingsbehov:**
- Bygg executive dashboard komponenter (React/Vue eller vanilla JS modules)
- Interactive report: `report-engine.mjs` → HTML med drill-down
- Opportunity matrix visualisering

---

### 8. AUTOMATION — "Store deler av audit kan kjøres maskinelt"

| World-Class (UiPath, Celonis, ServiceNow) | Arch Status | Gap |
|-------------------------------------------|-------------|-----|
| **End-to-End Audit Pipeline** (state machine) | Ad-hoc scripts | **HØY** |
| **Automated Discovery** (system/process/task) | Delvis (web crawl only) | **KRITISK** |
| **Automated Evidence Collection** (API/DB/logs) | Delvis (passiv web only) | **HØY** |
| **Automated Scoring/Classification** | Delvis (rule-based + LLM) | **MEDIUM** |
| **Human Review Gates** (policy-drevet) | Tom-godkjenning manuelt | **MEDIUM** |

**Handlingsbehov:**
- Definer audit state machine (§16): CREATED → DISCOVERY → DATA_COLLECTION → ANALYSIS → EVIDENCE_VALIDATION → OPPORTUNITY_SCORING → ROI → RISK_REVIEW → HUMAN_QA → REPORT_READY → DELIVERED → IMPLEMENTATION → MEASUREMENT
- Bygg `packages/audit-pipeline/` med state machine runtime
- Automatiser discovery med system-mining + task-mining

---

### 9. HUMAN CONTROL — "Menneskelig ekspertise brukes der den tilfører verdi"

| World-Class | Arch Status | Gap |
|-------------|-------------|-----|
| **Autonomy Model A0–A5** (OBSERVE → FULL AUTONOMY) | Ikke definert | **HØY** |
| **RACI Matrix** | Tom = eneste godkjenner | **MEDIUM** |
| **Escalation Path** for nye use cases | Ikke definert | **MEDIUM** |
| **Policy-Drevet Human-in-Loop** (risk × evidence × reversibility) | Ad-hoc | **HØY** |

**Handlingsbehov:**
- Definer autonomy model i `policies.yaml`
- Bygg RACI + escalation path
- Policy engine avgjør human-in-loop basert på risk/evidence/reversibility

---

### 10. OUTCOMES — "Vi kan sammenligne lovet verdi med virkelig verdi"

| World-Class | Arch Status | Gap |
|-------------|-------------|-----|
| **Expected vs Actual Tracking** | `record-delivery.mjs` eksisterer men ubrukt | **KRITISK** |
| **Continuous Learning** (audit → impl → outcome → better audits) | Ikke implementert | **KRITISK** |
| **Benchmark Database** (anonymisert, aggregert) | Planlagt (sekvens 70) | **HØY** |
| **Implementation Conversion Tracking** | Ikke implementert | **HØY** |

**Handlingsbehov:**
- Aktiver `record-delivery.mjs` i audit pipeline
- Bygg `packages/outcomes/` med: `track.mjs`, `compare.mjs`, `learn.mjs`
- Anonymiserings-pipeline for benchmark data

---

### 11. CONTINUOUS AUDIT — "Recurring optimization"

| World-Class (ServiceNow, Datadog, Celonis) | Arch Status | Gap |
|--------------------------------------------|-------------|-----|
| **Recurring Measurements** (scheduled audits) | Ikke implementert | **HØY** |
| **Changed-Process Detection** (diff mot baseline) | Ikke implementert | **HØY** |
| **New System Detection** (CMDB sync) | Ikke implementert | **MEDIUM** |
| **KPI Tracking Dashboard** | Ikke implementert | **MEDIUM** |
| **Continuous Optimization Loop** | Ikke implementert | **HØY** |

**Handlingsbehov:**
- Arkitektur for continuous audit (§55) — ikke bygg før kjernen fungerer
- Cron/Workers-scheduled recurring audit runs
- Change detection: hash-basert diff på system/process/task models

---

## Prioritert Gap-Liste (RICE-inspired)

| Prioritet | Gap | Reach | Impact | Confidence | Effort | RICE |
|-----------|-----|-------|--------|------------|--------|------|
| P0 | Auth + Multi-tenancy | Alle kunder | Kritisk | 1.0 | Høy | **P0** |
| P0 | Observability (Cloudflare AI Gateway) | Alle audits | Kritisk | 1.0 | Lav | **P0** |
| P0 | Policy-as-Code (OPA/Cedar) | Alle audits | Kritisk | 0.9 | Medium | **P0** |
| P1 | Evidence Strength E0–E4 + Calibration | Alle findings | Høy | 0.9 | Medium | **P1** |
| P1 | Deterministic ROI Engine + Scenarios | Alle opportunities | Høy | 0.9 | Medium | **P1** |
| P1 | Audit Pipeline State Machine | Alle audits | Høy | 0.8 | Høy | **P1** |
| P2 | Process/Task Mining Integration | Store kunder | Høy | 0.7 | Høy | **P2** |
| P2 | Interactive Report + Executive Dashboard | Alle kunder | Høy | 0.8 | Medium | **P2** |
| P2 | Outcome Tracking (Expected vs Actual) | Løpende Verdi | Høy | 0.7 | Medium | **P2** |
| P3 | Autonomy Model A0–A5 + RACI | Governance | Medium | 0.8 | Lav | **P3** |
| P3 | Continuous Audit Architecture | Recurring Revenue | Medium | 0.6 | Høy | **P3** |
| P4 | MCP/A2A Agent Interop | Skalering | Lav | 0.5 | Høy | **P4** |

---

## Konklusjon

Arch Audit har **world-class audit METHODOLOGY** (evidence-first, 3-class, provenance, Norge-utvidelse) men **ikke world-class audit PRODUKT**.

De kritiske gapene er **produksjonsrisiko** (auth, tenancy, observability, policy enforcement, **application-layer tenant isolation**) — ikke funksjonsmangler i audit-motoren.

**Anbefalt rekkefølge (per direktiv §116):**
1. **P0:** Truth + Security + Data Isolation (Auth, Multi-tenancy, **Application-layer tenant isolation**)
2. **P1:** Evidence Foundation (E0–E4, calibration, contradiction detection)
3. **P2:** Observability (Cloudflare AI Gateway + OTel)
3. **P3:** Core Audit Workflow (state machine, automated discovery)
4. **P4:** Opportunity/ROI/Risk (deterministic engine, scenarios)
5. **P5:** World-Class UX (executive dashboard, interactive report)
6. **P6:** Policy-as-Code (OPA/Cedar runtime + CI)
7. **P7:** Outcome Measurement (Expected vs Actual)
8. **P8:** Context Graph Temporal + Decision Traces
9. **P9:** MCP/Interoperability ved reelt behov

**Differensierer (Portfolio & Engineering Proof):**
- Live Proof Center (`/proof`) med live CI/prod data
- Agent Trace Explorer (`/trace`) med policy decisions per span
- Challenge Arch (`/challenge`) — "insufficient evidence" i sanntid
- Architecture Explorer (`/architecture`) med "Why?" per teknologi
- ADR Log (`/adrs`) — signaliserer seniornivå
- Eval Lab (`/evals`) med regression gate
- AI Cost Metrics (`/cost`) — cost per audit/finding
- What AI Did / What I Decided (`/decisions`) — tydelig ansvarsfordeling

Dette gir en **unik portefølje-posisjon**: "I architect, orchestrate and verify production AI systems."