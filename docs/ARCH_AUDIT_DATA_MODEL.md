# Arch Audit Data Model

**Dato:** 2026-08-20  
**Versjon:** 1.0  
**Basert på:** ARCH_AUDIT_ARCHITECTURE.md §11 + §74

---

## 1. Oversikt

Datamodellen er designet for:
- **Multi-tenancy** fra dag 1 (RLS på D1)
- **Append-only evidence** (immutabilitet)
- **Temporal truth** (valid_from/valid_to)
- **Provenance** på alle funn
- **Deterministisk ROI** (ingen LLM i beregning)

---

## 2. Canonical Entities

### 2.1 Tenant
```typescript
interface Tenant {
  id: string;                    // UUID
  name: string;
  created_at: string;            // ISO 8601
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  settings: TenantSettings;
}

interface TenantSettings {
  allowed_ai_providers: string[];      // ["openai", "anthropic"]
  allowed_models: string[];            // ["gpt-4o", "claude-3.5-sonnet"]
  data_retention_days: number;         // default 365
  audit_frequency: "AD_HOC" | "WEEKLY" | "MONTHLY" | "CONTINUOUS";
  feature_flags: FeatureFlags;
}
```

### 2.2 Canonical Identity Model

> **VIKTIG (CTO-mandat):** Ikke bruk e-post som permanent tenant-ID.
> Forholdet er: `IDENTITY → USER → TENANT MEMBERSHIP → TENANT`, aldri `EMAIL = TENANT`.
> E-post brukes kun til **initial identity resolution**. Dette muliggjør:
> - flere brukere per kunde
> - én bruker med flere organisasjoner
> - endret e-postadresse
> - invitations
> - consultants/admins (AUDITOR rolle på tvers)

```typescript
// 1. IDENTITY — autentiseringskilden (OIDC provider)
interface Identity {
  id: string;                    // UUID (canonical identity)
  identity_provider: IdentityProvider;  // "cloudflare_access", "google", "entra", "github", "oidc"
  provider_subject: string;      // sub fra IdP (unik per provider)
  email: string;                 // IKKE canonical — brukes til initial resolution
  email_verified: boolean;
  created_at: string;
  last_authenticated_at?: string;
}

type IdentityProvider = "cloudflare_access" | "google_workspace" | "entra_id" | "github" | "generic_oidc";

// 2. USER — canonical bruker (ikke knyttet til tenant direkte)
interface User {
  id: string;                    // UUID (canonical user)
  identity_id: string;           // FK → identities (1:1, men kan endres ved e-postbytte)
  display_name: string;
  created_at: string;
  last_login_at?: string;
}

// 3. TENANT MEMBERSHIP — koblingen user ↔ tenant med rolle
interface TenantMembership {
  id: string;                    // UUID
  user_id: string;               // FK → users
  tenant_id: string;             // FK → tenants
  role: "OWNER" | "ADMIN" | "ANALYST" | "VIEWER" | "AUDITOR";
  invited_by?: string;           // user_id som inviterte
  invited_at?: string;
  joined_at: string;
  status: "ACTIVE" | "INVITED" | "REVOKED";
}

// Resolver-kjede (auth middleware):
// Request → Identity (OIDC) → User (canonical) → Membership (tenant + role) → Tenant Context
```

### 2.3 Audit
```typescript
interface Audit {
  id: string;                    // UUID
  tenant_id: string;             // FK → tenants
  name: string;                  // "Q3 2026 Automatiseringskartlegging"
  status: AuditStatus;
  current_state: AuditState;     // State machine state
  config: AuditConfig;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  started_by: string;            // user_id
}

type AuditStatus = 
  | "DRAFT"
  | "IN_PROGRESS"
  | "AWAITING_HUMAN"
  | "COMPLETED"
  | "DELIVERED"
  | "ARCHIVED"
  | "FAILED";

type AuditState = 
  | "CREATED"
  | "DISCOVERY"
  | "DATA_COLLECTION"
  | "ANALYSIS"
  | "EVIDENCE_VALIDATION"
  | "OPPORTUNITY_SCORING"
  | "ROI"
  | "RISK_REVIEW"
  | "HUMAN_QA"
  | "REPORT_READY"
  | "DELIVERED"
  | "IMPLEMENTATION"
  | "MEASUREMENT";

interface AuditConfig {
  scope: AuditScope;
  discovery: DiscoveryConfig;
  evidence: EvidenceConfig;
  roi: ROIConfig;
  risk: RiskConfig;
  policy: PolicyConfig;
}

interface AuditScope {
  departments?: string[];        // ["IT", "HR", "Finance", "Operations"]
  systems?: string[];            // System IDs to include/exclude
  processes?: string[];          // Process IDs to focus on
  exclude_sensitive: boolean;    // Skip PII/financial systems
}
```

---

## 2.4 AI-First Discovery (§3 i PRODUCT.md)

> **VIKTIG:** `/start` er en **AI Audit Consultant**, ikke et flertrinnsskjema.
> PublicCompanyContext bygges FØR første spørsmål. Spørsmål stilles kun med eksplisitt formål.

### 2.4.1 AuditSession (erstatter MiniAudit)

```typescript
interface AuditSession {
  id: string;                    // UUID
  tenant_id?: string;            // Null hvis anonym (gratis)
  user_id?: string;              // Null hvis anonym
  scope: "FREE" | "SCAN" | "FULL";
  company: PublicCompanyContext;  // Bygges FØR første spørsmål
  conversation: QuestionDecision[]; // Forklarbart intervju
  findings: Finding[];           // Live findings (opptil 3 for FREE)
  evidence: Evidence[];          // Bygget opp underveis
  free_boundary_reached: boolean;
  status: "ACTIVE" | "FREE_BOUNDARY" | "CONVERTED" | "COMPLETED" | "ABANDONED";
  created_at: string;
  updated_at: string;
}
```

### 2.4.2 PublicCompanyContext (bygget FØR første spørsmål)

```typescript
interface PublicCompanyContext {
  id: string;
  org_number: string;            // Brønnøysund (Enhetsregisteret)
  company_name: string;
  industry_code: string;         // NACE
  industry_name: string;
  employees_range?: string;      // Fra Brønnøysund/SSB
  revenue?: number;              // Fra Regnskapsregisteret
  revenue_history?: { year: number; revenue: number }[];
  job_postings?: JobPosting[];   // Fra NAV → arbeidsintensive signaler
  website_analysis?: WebsiteAnalysis;
  tech_stack?: TechSignals;
  benchmark?: SSBBenchmark;      // Næringssnitt (SSB)
  confidence: "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";
  data_sources: string[];        // ["bronnoyysund", "ssb", "nav", "website"]
  fetched_at: string;
}

interface JobPosting {
  title: string;                 // "Kundeservicemedarbeider", "Ordrebehandler"
  posted_at: string;
  source: "NAV";                 // Arbeidsplassen
  signal: string;                // "arbeidsintensiv_kundeservice", "ordrebehandling"
}

interface WebsiteAnalysis {
  url: string;
  services: string[];            // "booking", "nettbutikk", "kundesupport"
  has_booking: boolean;
  has_webshop: boolean;
  has_faq: boolean;
  contact_channels: string[];    // ["telefon", "skjema", "epost"]
  tech_signals: string[];        // ["next.js", "shopify", "wordpress"]
}

interface TechSignals {
  server_header?: string;
  csp_present?: boolean;
  ssl_grade?: string;            // A+ til F
  frameworks: string[];          // detektert fra HTML/headers
}

interface SSBBenchmark {
  industry_code: string;
  industry_name: string;
  median_revenue_per_employee: number;
  median_cost_ratio: number;
  automation_adoption_rate: number;  // estimat fra næringsdata
}
```

### 2.4.3 QuestionDecision (Forklarbart auditintervju)

```typescript
interface QuestionDecision {
  id: string;
  session_id: string;            // FK → audit_sessions
  question: string;              // Det faktiske spørsmålet
  reason: string;                // Hvorfor stilles dette
  target_unknown: string;        // Hvilken ukjent variabel vi prøver å løse
  expected_information_gain: number; // 0-100
  related_process?: string;
  related_finding?: string;
  required_for: QuestionPurpose;
  asked_at: string;
  answer?: string;
  answer_analyzed: boolean;
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

**Sparsomhetsregel (håndhevet i API):**
```typescript
// Ikke spør om det allerede er kjent med tilstrekkelig sikkerhet
function shouldAskQuestion(q: QuestionDecision, ctx: PublicCompanyContext, session: AuditSession): boolean {
  // 1. Må ha eksplisitt formål
  if (!q.required_for) return false;
  
  // 2. Forventet informasjonsgevinst må overstige terskel
  if (q.expected_information_gain < 10) return false;
  
  // 3. target_unknown må IKKE allerede være løst i ctx eller tidligere svar
  const known = ctx.confidence === "VERIFIED" || ctx.confidence === "HIGH";
  if (known && ctx[knowableKey(q.target_unknown)]) return false;
  
  return true;
}
```

### 2.4.4 Multimodal Input (konverteres til canonical Evidence)

```typescript
type InputModality = "TEXT" | "VOICE" | "DOCUMENT" | "SCREENSHOT" | "SYSTEM_CONNECTOR";

interface MultimodalInput {
  id: string;
  session_id: string;
  modality: InputModality;
  raw: string;                   // Tekst / ASR-output / dokument-URL / skjermbilde-URL / connector-ID
  hash: string;                  // sha256 av raw
  converted_to_evidence: boolean; // Alltid true etter processing
  evidence_ids: string[];        // FK → evidence
  captured_at: string;
}
```

---

## 3. Discovery Domain

### 3.1 System
```typescript
interface System {
  id: string;                    // UUID
  tenant_id: string;
  audit_id: string;
  name: string;
  category: SystemCategory;
  purpose: string;
  owner: string;                 // Avdeling/team
  users: number;                 // Antall brukere
  data_types: DataType[];        // ["PII", "FINANCIAL", "OPERATIONAL"]
  authentication: AuthType;
  api_available: boolean;
  api_spec_url?: string;         // OpenAPI/GraphQL endpoint
  webhook_available: boolean;
  export_available: boolean;
  import_available: boolean;
  integration_status: IntegrationStatus;
  criticality: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  privacy_class: PrivacyClass;
  estimated_monthly_cost: number; // NOK
  evidence_ids: string[];        // FK → evidence
  discovered_at: string;
  discovered_by: DiscoveryMethod;
  metadata: Record<string, any>;
}

type SystemCategory = 
  | "ERP" | "CRM" | "HRIS" | "FINANCE" | "ITS" | "COMMUNICATION" 
  | "PROJECT_MGMT" | "BI" | "CUSTOM" | "LEGACY" | "SAAS" | "OTHER";

type AuthType = "SSO" | "BASIC" | "API_KEY" | "OAUTH" | "NONE" | "MFA";

type IntegrationStatus = 
  | "NONE" | "PARTIAL" | "FULL" | "DEPRECATED" | "PLANNED";

type PrivacyClass = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";

type DiscoveryMethod = "INTERVIEW" | "API_SCAN" | "DB_SCHEMA" | "CMDB" | "MANUAL";
```

### 3.2 Process
```typescript
interface Process {
  id: string;
  tenant_id: string;
  audit_id: string;
  system_id?: string;            // FK → systems (nullable)
  name: string;
  trigger: ProcessTrigger;
  owner: string;                 // Rolle/avdeling
  start_condition: string;
  activities: ProcessActivity[];
  decisions: ProcessDecision[];
  wait_states: WaitState[];
  exceptions: ProcessException[];
  output: ProcessOutput;
  frequency: Frequency;
  volume_per_period: number;     // f.eks. per måned
  avg_duration_seconds: number;
  cost_per_run: number;          // NOK
  failure_rate: number;          // 0-1
  rework_rate: number;           // 0-1
  dependencies: string[];        // Process IDs
  evidence_ids: string[];
  variants: ProcessVariant[];    // Happy path + unntak
  discovered_at: string;
  discovered_by: DiscoveryMethod;
}

interface ProcessTrigger {
  type: "SCHEDULED" | "EVENT" | "MANUAL" | "API" | "WEBHOOK" | "EMAIL";
  description: string;
  schedule?: string;             // Cron hvis SCHEDULED
}

interface ProcessActivity {
  id: string;
  name: string;
  performer: "HUMAN" | "SYSTEM" | "HYBRID";
  system_id?: string;
  input: string;
  output: string;
  duration_seconds: number;
  is_automated: boolean;
  automation_type?: AutomationType;
}

interface ProcessDecision {
  id: string;
  description: string;
  complexity: "LOW" | "MEDIUM" | "HIGH";
  rule_based: boolean;
  exception_rate: number;
}

interface WaitState {
  reason: string;
  avg_duration_seconds: number;
  triggered_by: string;
}

interface ProcessException {
  trigger: string;
  frequency: number;             // per periode
  handling: string;
  cost_impact: number;
}

interface ProcessOutput {
  type: string;
  consumers: string[];           // Hvem bruker output
  quality_metrics?: Record<string, number>;
}

interface ProcessVariant {
  name: string;                  // "Happy path", "Retur", "Eskalering"
  probability: number;           // 0-1
  activities: ProcessActivity[];
  additional_cost: number;
  additional_time_seconds: number;
}
```

### 3.3 Task
```typescript
interface Task {
  id: string;
  tenant_id: string;
  audit_id: string;
  process_id: string;            // FK → processes
  name: string;
  performer: TaskPerformer;
  system_id?: string;            // FK → systems
  input: TaskInput;
  output: TaskOutput;
  frequency: Frequency;
  volume_per_period: number;
  avg_duration_seconds: number;
  duration_variance_pct: number; // Koeffisient av variasjon
  rule_complexity: Complexity;
  decision_complexity: Complexity;
  data_availability: DataAvailability;
  error_rate: number;            // 0-1
  consequence_of_error: ErrorConsequence;
  automation_candidate: boolean;
  automation_type?: AutomationType;
  ai_feasibility_score?: number; // 0-100
  data_readiness_score?: number; // 0-100
  integration_feasibility_score?: number;
  evidence_ids: string[];
  discovered_at: string;
  discovered_by: DiscoveryMethod;
}

type TaskPerformer = 
  | { type: "HUMAN"; role: string; department: string }
  | { type: "SYSTEM"; system_id: string }
  | { type: "HYBRID"; human_role: string; system_id: string };

interface TaskInput {
  type: "STRUCTURED" | "UNSTRUCTURED" | "SEMI_STRUCTURED";
  format: string;                // "PDF", "Email", "API", "Form", "Spreadsheet"
  source: string;
  volume_per_task: number;       // f.eks. antall sider, tegn, poster
}

interface TaskOutput {
  type: "STRUCTURED" | "UNSTRUCTURED" | "ACTION" | "DECISION";
  destination: string;
  format: string;
}

type Complexity = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

type DataAvailability = "FULL" | "PARTIAL" | "MANUAL_ENTRY" | "EXTERNAL" | "NONE";

type ErrorConsequence = 
  | "NONE" 
  | "REWORK" 
  | "CUSTOMER_IMPACT" 
  | "FINANCIAL_LOSS" 
  | "COMPLIANCE" 
  | "REPUTATIONAL" 
  | "SAFETY";

type AutomationType = 
  | "REMOVE" 
  | "SIMPLIFY" 
  | "STANDARDIZE" 
  | "INTEGRATE" 
  | "CLASSIC_AUTOMATION" 
  | "RPA" 
  | "AI_ASSIST" 
  | "AI_AGENT" 
  | "AGENTIC_WORKFLOW" 
  | "HUMAN_REQUIRED";
```

---

## 4. Evidence Domain (§22-23)

### 4.1 Evidence
```typescript
interface Evidence {
  id: string;                    // UUID
  tenant_id: string;
  audit_id: string;
  source_type: EvidenceSourceType;
  source: string;                // Beskrivelse av kilde
  captured_at: string;           // ISO 8601
  valid_from?: string;           // ISO 8601
  valid_to?: string;             // ISO 8601
  superseded_at?: string;
  superseded_by?: string;        // FK → evidence
  hash: string;                  // SHA256 av innhold
  classification: EvidenceClass; // E0-E4
  confidence: number;            // 0-100 (kalibrert)
  process_id?: string;           // FK → processes
  task_id?: string;              // FK → tasks
  finding_id?: string;           // FK → findings
  metadata: EvidenceMetadata;
  access_policy: AccessPolicy;
}

type EvidenceSourceType = 
  | "INTERVIEW" 
  | "DOCUMENT" 
  | "SCREENSHOT" 
  | "API" 
  | "DATABASE" 
  | "EVENT_LOG" 
  | "METRIC" 
  | "OBSERVATION" 
  | "USER_CONFIRMATION" 
  | "SYSTEM_VERIFICATION";

type EvidenceClass = "E0" | "E1" | "E2" | "E3" | "E4";

/*
E0 — UNSUPPORTED:    Påstand uten evidens
E1 — ANECDOTAL:      Én menneskelig kilde (intervju)
E2 — CORROBORATED:   Flere uavhengige menneskelige kilder
E3 — OBSERVED:       Direkte observasjon (skjermbilde, screen recording)
E4 — SYSTEM_VERIFIED: Maskinverifisert (DB query, API response, logg)
*/

interface EvidenceMetadata {
  // For INTERVIEW
  interviewee_role?: string;
  interview_method?: "SYNC" | "ASYNC" | "SURVEY";
  questions_asked?: string[];
  
  // For DOCUMENT
  document_type?: string;
  document_hash?: string;
  pages?: number;
  
  // For API/DATABASE
  query_executed?: string;
  rows_returned?: number;
  execution_time_ms?: number;
  
  // For EVENT_LOG/METRIC
  time_range?: { from: string; to: string };
  aggregation?: string;
  
  // For SYSTEM_VERIFICATION
  verification_method?: string;
  expected_vs_actual?: { expected: any; actual: any };
  
  // Felles
  collected_by: string;          // agent_id eller user_id
  collection_method: string;
  raw_data_ref?: string;         // R2 path hvis stor
}

interface AccessPolicy {
  classification: PrivacyClass;
  allowed_roles: string[];       // ["ANALYST", "ADMIN", "OWNER"]
  tenant_scoped: boolean;        // Alltid true for kundedata
  retention_days: number;
  encryption_required: boolean;
}
```

### 4.2 Evidence Strength Kalibrering

```typescript
// Kalibreringstabell (empirisk basert på historiske audits)
const EVIDENCE_CALIBRATION = {
  E0: { base_confidence: 0,   weight: 0.0,  description: "Ingen evidens" },
  E1: { base_confidence: 35,  weight: 0.2,  description: "Én kilde" },
  E2: { base_confidence: 55,  weight: 0.4,  description: "Korroborert" },
  E3: { base_confidence: 75,  weight: 0.7,  description: "Observert" },
  E4: { base_confidence: 95,  weight: 1.0,  description: "System-verifisert" }
};

// LLM confidence → Evidence class mapping
function calibrateConfidence(llmConfidence: number, evidenceClass: EvidenceClass): number {
  const base = EVIDENCE_CALIBRATION[evidenceClass].base_confidence;
  const weight = EVIDENCE_CALIBRATION[evidenceClass].weight;
  return Math.round(base + (llmConfidence - 50) * weight * 0.5);
}
```

---

## 5. Findings & Opportunities (§24, 26)

### 5.1 Finding
```typescript
interface Finding {
  id: string;
  tenant_id: string;
  audit_id: string;
  statement: string;             // "Manuell ordreoppfølging tar 15 min/ordre"
  evidence_ids: string[];        // FK → evidence (minst 1)
  confidence: number;            // 0-100 (kalibrert fra evidens)
  business_impact: BusinessImpact;
  affected_processes: string[];  // FK → processes
  affected_tasks: string[];      // FK → tasks
  risk: RiskLevel;
  recommendation: string;
  assumptions: string[];         // Explisitte antagelser
  verification_status: VerificationStatus;
  created_at: string;
  created_by: string;            // agent_id
  verified_at?: string;
  verified_by?: string;
}

interface BusinessImpact {
  annual_cost: number;           // NOK
  error_cost: number;            // NOK
  rework_cost: number;           // NOK
  lost_revenue: number;          // NOK
  customer_impact_score: number; // 0-100
  employee_impact_score: number; // 0-100
  variable_classification: VariableClassification[];
}

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "SUPERSEDED";
```

### 5.2 Opportunity
```typescript
interface Opportunity {
  id: string;
  tenant_id: string;
  audit_id: string;
  finding_id: string;            // FK → findings
  problem: string;
  evidence_ids: string[];
  current_state: CurrentState;
  target_state: TargetState;
  recommended_technology: AutomationType;
  implementation_effort: EffortLevel;
  data_readiness_score: number;      // 0-100
  ai_feasibility_score: number;      // 0-100
  integration_feasibility_score: number; // 0-100
  risk: RiskAssessment;
  expected_benefit: ExpectedBenefit;
  payback_months: number;
  confidence: number;              // 0-100
  dependencies: string[];          // Opportunity IDs
  recommended_autonomy: AutonomyLevel;
  human_role: HumanRole;
  created_at: string;
  priority: "NOW" | "NEXT" | "LATER";
}

interface CurrentState {
  annual_labor_cost: number;
  annual_error_cost: number;
  annual_rework_cost: number;
  annual_volume: number;
  avg_duration_seconds: number;
  fte_involved: number;
}

interface TargetState {
  annual_labor_cost: number;
  annual_error_cost: number;
  annual_rework_cost: number;
  annual_volume: number;
  avg_duration_seconds: number;
  fte_involved: number;
  automation_percentage: number; // 0-100
}

interface RiskAssessment {
  financial: RiskLevel;
  operational: RiskLevel;
  legal: RiskLevel;
  privacy: RiskLevel;
  security: RiskLevel;
  customer: RiskLevel;
  reputational: RiskLevel;
  hallucination: RiskLevel;
  data_leakage: RiskLevel;
  tool_misuse: RiskLevel;
  irreversibility: RiskLevel;
  overall: RiskLevel;
}

interface ExpectedBenefit {
  gross_annual_saving: number;
  net_annual_saving: number;
  implementation_cost: number;
  ongoing_cost: number;           // Software, AI/API, oversight, maintenance
  payback_months: number;
  roi_pct: number;                // (net_saving / implementation_cost) * 100
  npv_36_months?: number;
  scenarios: {
    low: ExpectedBenefit;
    expected: ExpectedBenefit;
    high: ExpectedBenefit;
  };
}

type VariableClassification = 
  | "MEASURED"           // System-verifisert (E4)
  | "CUSTOMER_PROVIDED"  // Kundeoppgitt (E1-E2)
  | "DERIVED"            // Beregnet fra andre variabler
  | "BENCHMARK"          // Bransje-standard
  | "ASSUMED";           // Antatt (laveste evidens)

type EffortLevel = "XS" | "S" | "M" | "L" | "XL";

/*
XS: < 1 uke, 1 person
S:  1-2 uker, 1-2 personer
M:  2-4 uker, 2-3 personer
L:  1-3 mnd, 3-5 personer
XL: > 3 mnd, team
*/

type AutonomyLevel = 
  | "A0_OBSERVE"           // Ingen handling, kun observasjon
  | "A1_RECOMMEND"         // AI foreslår
  | "A2_DRAFT"             // AI lager utkast
  | "A3_APPROVAL_REQUIRED" // Menneske godkjenner handling
  | "A4_BOUNDED_AUTONOMY"  // Automatisk innen policy-grenser
  | "A5_FULL_AUTONOMY";    // Full autonomi (begrenset til lav risiko)

type HumanRole = 
  | "NONE" 
  | "REVIEWER" 
  | "APPROVER" 
  | "EXCEPTION_HANDLER" 
  | "ESCALATION_POINT" 
  | "STRATEGIC_OWNER";
```

---

## 6. ROI Engine (§28-29)

### 6.1 Deterministisk Beregning
```typescript
interface ROIInput {
  // Kostnader i dagens situasjon (MEASURED/CUSTOMER_PROVIDED/DERIVED/BENCHMARK/ASSUMED)
  current: {
    annual_labor_cost: ROIVariable;
    annual_error_cost: ROIVariable;
    annual_rework_cost: ROIVariable;
    lost_revenue: ROIVariable;
    other_costs: ROIVariable[];
  };
  
  // Implementeringskostnader
  implementation: {
    software_cost: ROIVariable;       // Lisenser, setup
    development_cost: ROIVariable;    // Interne/eksterne timer
    ai_api_cost: ROIVariable;         // Årlig modellkostnad
    oversight_cost: ROIVariable;      // Human-in-loop tid
    training_cost: ROIVariable;
    change_mgmt_cost: ROIVariable;
  };
  
  // Løpende kostnader
  ongoing: {
    software_annual: ROIVariable;
    ai_api_annual: ROIVariable;
    maintenance_annual: ROIVariable;
    oversight_annual: ROIVariable;
  };
  
  // Forventede fordeler
  benefits: {
    labor_reduction_pct: ROIVariable;     // 0-100
    error_reduction_pct: ROIVariable;     // 0-100
    rework_reduction_pct: ROIVariable;    // 0-100
    revenue_increase_pct: ROIVariable;    // 0-100
    throughput_increase_pct: ROIVariable; // 0-100
  };
}

interface ROIVariable {
  value: number;
  classification: VariableClassification;
  source: string;                 // Hvorifra tallet kommer
  confidence: number;             // 0-100
  notes?: string;
}

interface ROIResult {
  gross_annual_benefit: number;
  implementation_cost: number;
  annual_ongoing_cost: number;
  net_annual_benefit: number;
  monthly_saving: number;
  annual_saving: number;
  payback_months: number;
  roi_pct: number;
  npv_12_months: number;
  npv_36_months: number;
  irr?: number;
  scenarios: {
    low: ROIResult;
    expected: ROIResult;
    high: ROIResult;
  };
  sensitivity: SensitivityAnalysis[];
  variable_breakdown: {
    measured_pct: number;
    customer_provided_pct: number;
    derived_pct: number;
    benchmark_pct: number;
    assumed_pct: number;
  };
}

interface SensitivityAnalysis {
  variable: string;
  base_value: number;
  impact_on_payback: { low: number; high: number }; // måneder
  impact_on_roi: { low: number; high: number };     // prosentpoeng
}
```

### 6.2 Beregningslogikk (Pure Functions)

```typescript
// Ingen LLM her — ren matematikk
function calculateROI(input: ROIInput): ROIResult {
  // 1. Beregn årlig bruttofordel
  const laborSaving = input.current.annual_labor_cost.value * 
    (input.benefits.labor_reduction_pct.value / 100);
  const errorSaving = input.current.annual_error_cost.value * 
    (input.benefits.error_reduction_pct.value / 100);
  const reworkSaving = input.current.annual_rework_cost.value * 
    (input.benefits.rework_reduction_pct.value / 100);
  const revenueGain = input.current.lost_revenue.value * 
    (input.benefits.revenue_increase_pct.value / 100);
  
  const grossBenefit = laborSaving + errorSaving + reworkSaving + revenueGain;
  
  // 2. Implementeringskostnad
  const implCost = Object.values(input.implementation).reduce(
    (sum, v) => sum + v.value, 0
  );
  
  // 3. Årlig løpende kostnad
  const ongoingCost = Object.values(input.ongoing).reduce(
    (sum, v) => sum + v.value, 0
  );
  
  // 4. Netto
  const netAnnual = grossBenefit - ongoingCost;
  const paybackMonths = implCost / (netAnnual / 12);
  const roiPct = (netAnnual / implCost) * 100;
  
  // 5. Scenarier (Monte Carlo eller deterministic bounds)
  const scenarios = generateScenarios(input);
  
  // 6. Sensitivitet
  const sensitivity = analyzeSensitivity(input);
  
  return {
    gross_annual_benefit: grossBenefit,
    implementation_cost: implCost,
    annual_ongoing_cost: ongoingCost,
    net_annual_benefit: netAnnual,
    monthly_saving: netAnnual / 12,
    annual_saving: netAnnual,
    payback_months: Math.max(0.1, paybackMonths),
    roi_pct: roiPct,
    npv_12_months: calculateNPV(netAnnual, implCost, 12),
    npv_36_months: calculateNPV(netAnnual, implCost, 36),
    scenarios,
    sensitivity,
    variable_breakdown: classifyVariables(input)
  };
}
```

---

## 7. Risk Engine (§32)

```typescript
interface RiskFactor {
  category: RiskCategory;
  level: RiskLevel;
  score: number;                 // 0-100
  evidence_ids: string[];
  mitigation: string;
  residual_risk: RiskLevel;
}

type RiskCategory = 
  | "FINANCIAL" 
  | "OPERATIONAL" 
  | "LEGAL" 
  | "PRIVACY" 
  | "SECURITY" 
  | "CUSTOMER" 
  | "REPUTATIONAL" 
  | "HALLUCINATION" 
  | "DATA_LEAKAGE" 
  | "TOOL_MISUSE" 
  | "IRREVERSIBILITY";

interface RiskAssessment {
  factors: RiskFactor[];
  overall: RiskLevel;
  autonomy_constraint: AutonomyLevel;  // Max autonomy gitt risiko
  requires_human_approval: boolean;
  escalation_path?: string;           // Hvem varsles ved høy risiko
}
```

---

## 8. Policy & Governance (§42-44)

### 8.1 Policy Decision
```typescript
interface PolicyDecision {
  id: string;
  tenant_id: string;
  audit_id?: string;
  principal: Principal;
  action: string;
  resource: Resource;
  context: PolicyContext;
  decision: PolicyDecisionType;
  reason: string;
  obligations: string[];       // ["LOG", "TRACE", "NOTIFY_OWNER"]
  decided_at: string;
  trace_id: string;
  policy_version: string;
}

type PolicyDecisionType = "ALLOW" | "DENY" | "REQUIRE_APPROVAL";

interface Principal {
  type: "AGENT" | "USER" | "SYSTEM";
  id: string;
  tenant_id: string;
  roles: string[];
  autonomy_level: AutonomyLevel;
}

interface Resource {
  type: "SYSTEM" | "PROCESS" | "TASK" | "EVIDENCE" | "FINDING" | "OPPORTUNITY" | "REPORT" | "FILE" | "API" | "TOOL";
  id: string;
  tenant_id: string;
  classification: PrivacyClass;
}

interface PolicyContext {
  risk_level: RiskLevel;
  evidence_class: EvidenceClass;
  phase: AuditState;
  autonomy_requested: AutonomyLevel;
  time_of_day?: string;
  ip_address?: string;
}
```

---

## 9. Observability (§39)

```typescript
interface Trace {
  trace_id: string;              // audit_run_id
  audit_id: string;
  tenant_id: string;
  started_at: string;
  completed_at?: string;
  workflow_id: string;
  spans: Span[];
  cost_summary: CostSummary;
  error?: TraceError;
}

interface Span {
  span_id: string;
  parent_span_id?: string;
  agent_id: string;
  phase: AuditState;
  operation: string;             // "system_mining", "llm_extraction", "roi_calculation"
  started_at: string;
  ended_at?: string;
  duration_ms?: number;
  model?: ModelInfo;
  tokens?: TokenUsage;
  estimated_cost?: number;
  result: "SUCCESS" | "ERROR" | "PARTIAL";
  error?: string;
  evidence_ids?: string[];
  policy_decision_id?: string;
  retry_count: number;
  attributes: Record<string, any>;
}

interface ModelInfo {
  provider: string;
  model: string;
  version?: string;
}

interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

interface CostSummary {
  total_tokens: number;
  total_cost_usd: number;
  by_model: Record<string, { tokens: number; cost_usd: number }>;
  by_agent: Record<string, { tokens: number; cost_usd: number }>;
  by_phase: Record<string, { tokens: number; cost_usd: number }>;
}
```

---

## 10. Outcome Tracking (§53-54)

```typescript
interface Implementation {
  id: string;
  tenant_id: string;
  audit_id: string;
  opportunity_id: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  planned_start: string;
  actual_start?: string;
  planned_end: string;
  actual_end?: string;
  actual_cost: number;           // NOK
  team: string[];
  methodology: "INTERNAL" | "EXTERNAL" | "HYBRID";
  notes: string;
}

interface Outcome {
  id: string;
  implementation_id: string;
  measured_at: string;
  
  // Forventet vs Faktisk
  expected: ExpectedOutcome;
  actual: ActualOutcome;
  
  // Avvik
  variance: OutcomeVariance;
  
  // Læring
  lessons_learned: string[];
  calibration_updates: CalibrationUpdate[];
}

interface ExpectedOutcome {
  time_saved_hours_per_month: number;
  cost_saved_nok_per_month: number;
  error_reduction_pct: number;
  throughput_increase_pct: number;
  customer_satisfaction_delta: number;
}

interface ActualOutcome {
  time_saved_hours_per_month: number;
  cost_saved_nok_per_month: number;
  error_reduction_pct: number;
  throughput_increase_pct: number;
  customer_satisfaction_delta: number;
  measurement_method: string;
  measurement_period_days: number;
}

interface OutcomeVariance {
  time_saved_pct: number;        // (actual - expected) / expected * 100
  cost_saved_pct: number;
  error_reduction_pct: number;
  overall_accuracy_pct: number;  // Gjennomsnittlig presisjon
}

interface CalibrationUpdate {
  variable: string;              // f.eks. "ai_feasibility_score"
  old_value: number;
  new_value: number;
  reason: string;
}
```

---

## 11. Indekser & Ytelse (D1)

```sql
-- Tenant isolation (kritisk)
CREATE INDEX idx_evidence_tenant ON evidence(tenant_id);
CREATE INDEX idx_findings_tenant ON findings(tenant_id);
CREATE INDEX idx_opportunities_tenant ON opportunities(tenant_id);
CREATE INDEX idx_audits_tenant ON audits(tenant_id);
CREATE INDEX idx_systems_tenant ON systems(tenant_id);
CREATE INDEX idx_processes_tenant ON processes(tenant_id);
CREATE INDEX idx_tasks_tenant ON tasks(tenant_id);
CREATE INDEX idx_policy_decisions_tenant ON policy_decisions(tenant_id);
CREATE INDEX idx_implementations_tenant ON implementations(tenant_id);

-- Audit-scoped queries
CREATE INDEX idx_evidence_audit ON evidence(audit_id);
CREATE INDEX idx_findings_audit ON findings(audit_id);
CREATE INDEX idx_opportunities_audit ON opportunities(audit_id);
CREATE INDEX idx_systems_audit ON systems(audit_id);
CREATE INDEX idx_processes_audit ON processes(audit_id);
CREATE INDEX idx_tasks_audit ON tasks(audit_id);

-- Evidence graph traversal
CREATE INDEX idx_evidence_finding ON evidence(finding_id);
CREATE INDEX idx_evidence_process ON evidence(process_id);
CREATE INDEX idx_evidence_task ON evidence(task_id);
CREATE INDEX idx_finding_opportunity ON opportunities(finding_id);

-- Temporal queries
CREATE INDEX idx_evidence_captured ON evidence(captured_at);
CREATE INDEX idx_evidence_valid ON evidence(valid_from, valid_to);
CREATE INDEX idx_audit_state ON audits(current_state);

-- Observability
CREATE INDEX idx_trace_audit ON traces(audit_id);
CREATE INDEX idx_trace_tenant ON traces(tenant_id);
CREATE INDEX idx_span_trace ON spans(trace_id);
CREATE INDEX idx_span_agent ON spans(agent_id);
CREATE INDEX idx_policy_decision_trace ON policy_decisions(trace_id);
```

---

## 12. Migrasjonsstrategi

| Versjon | Beskrivelse | Rollback |
|---------|-------------|----------|
| v1 | Core: tenants, identities, users, tenant_memberships, audits, systems, processes, tasks | Ja |
| v2 | Evidence, findings, opportunities, policy_decisions | Ja |
| v3 | ROI, risk, implementations, outcomes | Ja |
| v4 | Observability (traces, spans, costs) | Ja |
| v5 | Continuous audit (schedules, change_detection) | Ja |

Hver migrasjon:
1. `wrangler d1 migrations create <name>`
2. Skriv `up.sql` + `down.sql`
3. Test på staging D1
4. Deploy med `wrangler d1 migrations apply`
5. Verifiser med `SELECT * FROM sqlite_master WHERE type='table'`

---

## 13. TypeScript Types (Shared)

```typescript
// packages/shared/types/audit.ts
export * from "./tenant";
export * from "./identity";
export * from "./user";
export * from "./membership";
export * from "./audit";
export * from "./system";
export * from "./process";
export * from "./task";
export * from "./evidence";
export * from "./finding";
export * from "./opportunity";
export * from "./roi";
export * from "./risk";
export * from "./policy";
export * from "./trace";
export * from "./outcome";

// Zod schemas for runtime validation
import { z } from "zod";

export const EvidenceClassSchema = z.enum(["E0", "E1", "E2", "E3", "E4"]);
export const RiskLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const AutonomyLevelSchema = z.enum([
  "A0_OBSERVE", "A1_RECOMMEND", "A2_DRAFT", 
  "A3_APPROVAL_REQUIRED", "A4_BOUNDED_AUTONOMY", "A5_FULL_AUTONOMY"
]);
export const VariableClassificationSchema = z.enum([
  "MEASURED", "CUSTOMER_PROVIDED", "DERIVED", "BENCHMARK", "ASSUMED"
]);
export const AuditStateSchema = z.enum([
  "CREATED", "DISCOVERY", "DATA_COLLECTION", "ANALYSIS", 
  "EVIDENCE_VALIDATION", "OPPORTUNITY_SCORING", "ROI", 
  "RISK_REVIEW", "HUMAN_QA", "REPORT_READY", "DELIVERED", 
  "IMPLEMENTATION", "MEASUREMENT"
]);
```