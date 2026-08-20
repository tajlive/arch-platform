# Arch Audit Observability Architecture

**Dato:** 2026-08-20  
**Versjon:** 1.0  
**Basert på:** ARCH_AUDIT_ARCHITECTURE.md §7 + Master Implementation Directive §38-41

---

## 1. Observability Filosofi

> **Observability er ikke logging — det er å kunne rekonstruere hva som skjedde, hvorfor, og hva det kostet.**

Hver audit-kjøring må være fullt sporbart fra brukerforespørsel til leverert rapport, med kostnader, feil, policy-beslutninger, og evidenslenker.

---

## 2. Cloudflare Native First (§40)

### 2.1 Hvorfor Cloudflare AI Gateway + Workers Metrics?

| Funksjon | Cloudflare Native | Bygg fra bunnen |
|----------|-------------------|-----------------|
| Token tracking per kall | ✅ Innebygd | ❌ Egen implementasjon |
| Kostnadsberegning | ✅ Per model/provider | ❌ Egen logikk |
| Latency (P50/P95/P99) | ✅ Innebygd | ❌ Egen metrics pipeline |
| Error tracking | ✅ Innebygd | ❌ Egen error handling |
| OpenTelemetry export | ✅ Native | ❌ Egen collector |
| Tenant metadata | ✅ `cf-aig-metadata` | ❌ Egen context propagation |
| Rate limiting | ✅ Innebygd | ❌ Egen implementasjon |
| Caching | ✅ Innebygd | ❌ Egen cache layer |

**Konklusjon:** Bruk Cloudflare AI Gateway som **primær observability-backend** for AI-kall. Bygg kun `packages/observability/` for orchestration, policy-decisions, evidence-traces, og cross-component correlation.

---

## 3. Trace Arkitektur (§39)

### 3.1 Trace Hierarki

```
trace_id = audit_run_id (UUID)
│
├─ workflow_id = audit_pipeline (fast)
│   │
│   ├─ span: audit.created (orchestrator)
│   │
│   ├─ phase: DISCOVERY
│   │   ├─ span: system_mining (agent: discovery)
│   │   │   ├─ tool_call: fetch_github_repo
│   │   │   ├─ tool_call: query_d1_schema
│   │   │   └─ llm_call: classify_systems (model: gpt-4o)
│   │   ├─ span: process_mining (agent: discovery)
│   │   │   └─ llm_call: extract_processes (model: claude-3.5)
│   │   └─ span: task_mining (agent: discovery)
│   │       └─ tool_call: playwright_record
│   │
│   ├─ phase: DATA_COLLECTION
│   │   ├─ span: interviews (agent: process)
│   │   ├─ span: api_queries (agent: evidence)
│   │   └─ span: document_ingest (agent: evidence)
│   │
│   ├─ phase: ANALYSIS
│   │   ├─ span: evidence_build (agent: evidence)
│   │   ├─ span: contradiction_check (agent: critic)
│   │   └─ span: classification (agent: evidence)
│   │
│   ├─ phase: EVIDENCE_VALIDATION
│   │   ├─ span: human_review_gate (policy: REQUIRE_APPROVAL)
│   │   └─ span: system_verification (agent: evidence)
│   │
│   ├─ phase: OPPORTUNITY_SCORING
│   │   ├─ span: classification (agent: automation)
│   │   ├─ span: feasibility (agent: automation)
│   │   └─ span: autonomy_assignment (policy: A3_REQUIRED)
│   │
│   ├─ phase: ROI
│   │   └─ span: roi_calculation (deterministic)
│   │
│   ├─ phase: RISK_REVIEW
│   │   ├─ span: risk_assessment (agent: risk)
│   │   └─ span: risk_policy_check (policy: financial_risk)
│   │
│   ├─ phase: HUMAN_QA
│   │   └─ span: qa_review (human: analyst)
│   │
│   ├─ phase: REPORT_GENERATION
│   │   ├─ span: executive_summary (agent: report)
│   │   ├─ span: interactive_report (agent: report)
│   │   └─ span: evidence_map (agent: report)
│   │
│   └─ phase: DELIVERED
│       └─ span: record_delivery (deterministic)
│
└─ cost_summary (aggregert per trace)
```

### 3.2 Span Struktur

```typescript
interface Span {
  span_id: string;                    // UUID
  trace_id: string;                   // audit_run_id
  parent_span_id?: string;
  agent_id: string;                   // "discovery", "evidence", "orchestrator", "human"
  phase: AuditState;                  // "DISCOVERY", "ANALYSIS", etc.
  operation: string;                  // "system_mining", "llm_extraction", "roi_calculation"
  started_at: string;                 // ISO 8601
  ended_at?: string;
  duration_ms?: number;
  
  // Model info (hvis LLM-kall)
  model?: {
    provider: string;                 // "openai", "anthropic", "cloudflare"
    model: string;                    // "gpt-4o", "claude-3.5-sonnet"
    version?: string;
  };
  
  // Token usage (fra AI Gateway)
  tokens?: {
    input: number;
    output: number;
    total: number;
  };
  
  // Kostnad
  estimated_cost_usd?: number;
  
  // Resultat
  result: "SUCCESS" | "ERROR" | "PARTIAL" | "PENDING_APPROVAL";
  error?: string;
  
  // Evidence linking
  evidence_ids?: string[];            // Bevis generert i denne span
  policy_decision_id?: string;        // Policy evaluering i denne span
  
  // Retry
  retry_count: number;
  max_retries: number;
  
  // Custom attributes
  attributes: Record<string, any>;
}
```

---

## 3.3 Trace Context Propagation

```typescript
// Alle Workers mottar trace context via headers
interface TraceHeaders {
  "x-trace-id": string;           // audit_run_id
  "x-span-id": string;            // current span
  "x-parent-span-id": string;     // parent span
  "x-tenant-id": string;          // for AI Gateway metadata
  "x-audit-id": string;           // audit_id
  "x-workflow-id": string;        // audit_pipeline
}

// Middleware for trace context
export function traceMiddleware(request: Request, env: Env) {
  const traceId = request.headers.get("x-trace-id") ?? uuid();
  const parentSpanId = request.headers.get("x-span-id");
  
  // Sett opp ny span
  const spanId = uuid();
  const span: Span = {
    span_id: spanId,
    trace_id: traceId,
    parent_span_id: parentSpanId,
    agent_id: getAgentId(request),      // fra route/path
    phase: getPhase(request),           // fra audit state
    operation: getOperation(request),   // fra route
    started_at: new Date().toISOString(),
    result: "PENDING",
    retry_count: 0,
    max_retries: 3,
    attributes: {}
  };
  
  // Lagre span i context (D1 async)
  ctx.waitUntil(saveSpan(span));
  
  // Injiser headers til nedstrøms kall
  const newHeaders = new Headers(request.headers);
  newHeaders.set("x-trace-id", traceId);
  newHeaders.set("x-span-id", spanId);
  newHeaders.set("x-parent-span-id", parentSpanId ?? "");
  
  return new Request(request, { headers: newHeaders });
}
```

---

## 4. AI Gateway Integration (§40)

### 4.1 Konfigurasjon

```bash
# Opprett AI Gateway
wrangler ai gateway create arch-audit-prod \
  --account-id 80d5b1d56a3e907150ba7348b6182894

# Miljøvariabler
AI_GATEWAY_ID=arch-audit-prod
AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1/80d5b1d56a3e907150ba7348b6182894/arch-audit-prod
```

### 4.2 Alle AI-kall via Gateway

```typescript
async function callAI(
  provider: "openai" | "anthropic" | "cloudflare",
  model: string,
  messages: Message[],
  context: AIContext
): Promise<AIResponse> {
  const url = `${env.AI_GATEWAY_URL}/${provider}/chat/completions`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getProviderKey(provider)}`,
      "Content-Type": "application/json",
      "cf-aig-metadata": JSON.stringify({
        trace_id: context.traceId,
        span_id: context.spanId,
        tenant_id: context.tenantId,
        audit_id: context.auditId,
        agent_id: context.agentId,
        phase: context.phase,
        operation: context.operation
      })
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: context.temperature ?? 0.1,
      max_tokens: context.maxTokens ?? 4000,
      response_format: { type: "json_object" }  // Tving JSON
    })
  });
  
  // Logg til vår egen observability (async)
  context.waitUntil(logAIRequest({
    trace_id: context.traceId,
    span_id: context.spanId,
    provider,
    model,
    request_tokens: estimateTokens(messages),
    response: await response.clone().json(),
    latency_ms: Date.now() - context.startTime
  }));
  
  return response.json();
}
```

### 4.3 AI Gateway Metadata Schema

```json
{
  "trace_id": "audit-run-uuid",
  "span_id": "span-uuid", 
  "tenant_id": "tenant-uuid",
  "audit_id": "audit-uuid",
  "agent_id": "discovery",
  "phase": "DISCOVERY",
  "operation": "system_mining",
  "model": "gpt-4o",
  "provider": "openai"
}
```

Dette gir Cloudflare mulighet til å aggregere:
- Tokens per tenant / audit / agent / model / fase
- Kostnader per samme dimensjoner
- Latency percentiler
- Error rates
- Cache hit rates

---

## 5. Observability Package (`packages/observability/`)

### 5.1 Struktur

```
packages/observability/
├── src/
│   ├── trace.ts              # Trace/span management
│   ├── ai-gateway.ts         # AI Gateway integration
│   ├── cost.ts               # Cost tracking & budgets
│   ├── policy-trace.ts       # Policy decision tracing
│   ├── evidence-trace.ts     # Evidence linking
│   ├── export.ts             # OpenTelemetry export
│   └── query.ts              # Trace querying API
├── tests/
│   ├── trace.test.ts
│   ├── cost.test.ts
│   └── integration.test.ts
├── package.json
└── tsconfig.json
```

### 5.2 Eksport: `trace.ts`

```typescript
// Hoved-API for tracing
export class TraceManager {
  constructor(private env: Env) {}
  
  // Start ny trace (audit run)
  async startTrace(input: StartTraceInput): Promise<TraceContext> {
    const traceId = uuid();
    const trace: Trace = {
      trace_id: traceId,
      audit_id: input.auditId,
      tenant_id: input.tenantId,
      started_at: new Date().toISOString(),
      workflow_id: "audit_pipeline",
      spans: [],
      cost_summary: { total_tokens: 0, total_cost_usd: 0, by_model: {}, by_agent: {}, by_phase: {} },
      status: "RUNNING"
    };
    await this.saveTrace(trace);
    return { traceId, spanId: uuid() };
  }
  
  // Start span
  async startSpan(traceId: string, input: StartSpanInput): Promise<string> {
    const spanId = uuid();
    const span: Span = {
      span_id: spanId,
      trace_id: traceId,
      parent_span_id: input.parentSpanId,
      agent_id: input.agentId,
      phase: input.phase,
      operation: input.operation,
      started_at: new Date().toISOString(),
      result: "PENDING",
      retry_count: 0,
      max_retries: input.maxRetries ?? 3,
      attributes: input.attributes ?? {}
    };
    await this.saveSpan(span);
    return spanId;
  }
  
  // End span
  async endSpan(spanId: string, result: SpanResult): Promise<void> {
    const span = await this.getSpan(spanId);
    span.ended_at = new Date().toISOString();
    span.duration_ms = new Date(span.ended_at).getTime() - new Date(span.started_at).getTime();
    span.result = result.status;
    span.error = result.error;
    span.tokens = result.tokens;
    span.estimated_cost_usd = result.cost;
    span.evidence_ids = result.evidenceIds;
    span.policy_decision_id = result.policyDecisionId;
    span.model = result.model;
    await this.saveSpan(span);
    
    // Oppdater trace cost summary
    await this.updateTraceCost(span.trace_id, result);
  }
  
  // Policy decision tracing
  async recordPolicyDecision(input: PolicyDecisionInput): Promise<string> {
    const decisionId = uuid();
    const decision: PolicyDecision = {
      id: decisionId,
      trace_id: input.traceId,
      span_id: input.spanId,
      ...input
    };
    await this.savePolicyDecision(decision);
    return decisionId;
  }
  
  // Evidence linking
  async linkEvidence(spanId: string, evidenceIds: string[]): Promise<void> {
    const span = await this.getSpan(spanId);
    span.evidence_ids = [...new Set([...(span.evidence_ids ?? []), ...evidenceIds])];
    await this.saveSpan(span);
  }
  
  // Query API
  async getTrace(traceId: string): Promise<TraceWithSpans> { ... }
  async getSpansByAgent(traceId: string, agentId: string): Promise<Span[]> { ... }
  async getSpansByPhase(traceId: string, phase: AuditState): Promise<Span[]> { ... }
  async getCostBreakdown(traceId: string): Promise<CostSummary> { ... }
  async getErrorSpans(traceId: string): Promise<Span[]> { ... }
}
```

---

## 6. Cost Governance (§80)

### 6.1 Cost Tracking per Dimensjon

```typescript
interface CostTracker {
  // Per trace (audit run)
  async getTraceCost(traceId: string): Promise<CostSummary>;
  
  // Per tenant (månedlig)
  async getTenantMonthlyCost(tenantId: string, month: string): Promise<TenantCostReport>;
  
  // Per agent (kumulativ)
  async getAgentCost(agentId: string, period: Period): Promise<AgentCostReport>;
  
  // Per model
  async getModelCost(model: string, period: Period): Promise<ModelCostReport>;
  
  // Per audit
  async getAuditCost(auditId: string): Promise<AuditCostReport>;
}

interface TenantCostReport {
  tenant_id: string;
  period: string;
  total_cost_usd: number;
  total_tokens: number;
  by_model: Record<string, { tokens: number; cost_usd: number }>;
  by_agent: Record<string, { tokens: number; cost_usd: number }>;
  by_phase: Record<string, { tokens: number; cost_usd: number }>;
  by_audit: Record<string, { tokens: number; cost_usd: number }>;
  budget_utilization_pct: number;
  alerts: BudgetAlert[];
}

interface BudgetAlert {
  type: "WARNING" | "CRITICAL";
  message: string;
  current_spend: number;
  budget: number;
  utilization_pct: number;
}
```

### 6.2 Budgets & Alerts

```typescript
// Konfigurasjon per tenant
interface TenantBudget {
  tenant_id: string;
  monthly_usd_limit: number;
  alert_thresholds: {
    warning: 0.7;    // 70%
    critical: 0.9;   // 90%
    pause: 1.0;      // 100% → pause agent-kall
  };
  per_audit_limit_usd?: number;
  per_agent_limits?: Record<string, number>;
}

// Enforcement i AI Gateway middleware
async function enforceBudget(context: AIContext): Promise<void> {
  const budget = await getTenantBudget(context.tenantId);
  const current = await getCurrentMonthSpend(context.tenantId);
  
  if (current >= budget.monthly_usd_limit) {
    throw new BudgetExceededError("Monthly AI budget exceeded");
  }
  
  if (current >= budget.monthly_usd_limit * budget.alert_thresholds.critical) {
    await sendAlert("CRITICAL", context.tenantId, "AI budget 90% used");
  } else if (current >= budget.monthly_usd_limit * budget.alert_thresholds.warning) {
    await sendAlert("WARNING", context.tenantId, "AI budget 70% used");
  }
}
```

---

## 7. OpenTelemetry Export (§41)

### 7.1 Konfigurasjon

```typescript
// packages/observability/src/export.ts
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

export function setupOpenTelemetry(env: Env): NodeTracerProvider {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "arch-audit",
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: env.ENVIRONMENT,
      "arch.version": "1.0.0"
    })
  });
  
  // OTLP eksport til valgt backend (Datadog, Honeycomb, Grafana, etc.)
  if (env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    const exporter = new OTLPTraceExporter({
      url: env.OTEL_EXPORTER_OTLP_ENDPOINT,
      headers: { "Authorization": `Bearer ${env.OTEL_API_KEY}` }
    });
    provider.addSpanProcessor(new BatchSpanProcessor(exporter));
  }
  
  provider.register();
  return provider;
}

// Konverter vår Span → OpenTelemetry Span
function toOtelSpan(span: Span, tracer: Tracer): Span {
  const otelSpan = tracer.startSpan(span.operation, {
    startTime: new Date(span.started_at),
    attributes: {
      "arch.trace_id": span.trace_id,
      "arch.span_id": span.span_id,
      "arch.agent_id": span.agent_id,
      "arch.phase": span.phase,
      "arch.tenant_id": span.attributes.tenant_id,
      "arch.audit_id": span.attributes.audit_id,
      "gen_ai.provider": span.model?.provider,
      "gen_ai.model": span.model?.model,
      "gen_ai.usage.input_tokens": span.tokens?.input,
      "gen_ai.usage.output_tokens": span.tokens?.output,
      "arch.estimated_cost_usd": span.estimated_cost_usd,
      "arch.result": span.result,
      "arch.evidence_ids": span.evidence_ids?.join(","),
      "arch.policy_decision_id": span.policy_decision_id
    }
  });
  
  if (span.ended_at) {
    otelSpan.end({ endTime: new Date(span.ended_at) });
  }
  
  if (span.error) {
    otelSpan.recordException(new Error(span.error));
    otelSpan.setStatus({ code: SpanStatusCode.ERROR, message: span.error });
  }
  
  return otelSpan;
}
```

### 7.2 Sanitization (følsomme data)

```typescript
// Fjern PII/sensitive data før eksport
function sanitizeSpanForExport(span: Span): Span {
  const sanitized = { ...span };
  
  // Fjern raw attributes som kan inneholde PII
  delete sanitized.attributes.raw_request;
  delete sanitized.attributes.raw_response;
  delete sanitized.attributes.customer_content;
  delete sanitized.attributes.api_keys;
  delete sanitized.attributes.passwords;
  
  // Behold kun metadata
  const allowedKeys = [
    "tenant_id", "audit_id", "agent_id", "phase", "operation",
    "model", "tokens", "cost", "result", "evidence_ids"
  ];
  
  for (const key of Object.keys(sanitized.attributes)) {
    if (!allowedKeys.includes(key)) {
      delete sanitized.attributes[key];
    }
  }
  
  return sanitized;
}
```

---

## 8. Query & Dashboard API

```typescript
// packages/observability/src/query.ts
export class ObservabilityQuery {
  constructor(private traceManager: TraceManager) {}
  
  // Full trace for debugging
  async getFullTrace(traceId: string): Promise<TraceWithSpans> { ... }
  
  // Cost per audit
  async getAuditCost(auditId: string): Promise<AuditCostReport> { ... }
  
  // Tenant monthly report
  async getTenantReport(tenantId: string, month: string): Promise<TenantCostReport> { ... }
  
  // Agent performance
  async getAgentPerformance(agentId: string, period: Period): Promise<AgentPerfReport> {
    return {
      agent_id: agentId,
      period,
      total_runs: 0,
      success_rate: 0,
      avg_latency_ms: 0,
      p95_latency_ms: 0,
      total_tokens: 0,
      total_cost_usd: 0,
      error_rate: 0,
      most_common_errors: [],
      cost_per_run: 0
    };
  }
  
  // Phase bottlenecks
  async getPhaseBottlenecks(traceId: string): Promise<PhaseBottleneck[]> {
    return [
      { phase: "DISCOVERY", duration_ms: 45000, pct_of_total: 35 },
      { phase: "ANALYSIS", duration_ms: 32000, pct_of_total: 25 },
      { phase: "EVIDENCE_VALIDATION", duration_ms: 18000, pct_of_total: 14 },
      // ...
    ];
  }
  
  // Policy decision audit
  async getPolicyDecisions(traceId: string): Promise<PolicyDecision[]> { ... }
  
  // Evidence traceability
  async getEvidenceLineage(evidenceId: string): Promise<EvidenceLineage> { ... }
  
  // Real-time streaming (Server-Sent Events)
  async *streamTraceUpdates(traceId: string): AsyncGenerator<TraceUpdate> { ... }
}
```

---

## 9. Dashboard (Internt)

### 9.1 Control Center Observability Tab

```
┌─────────────────────────────────────────────────────────────────┐
│  ARCH AUDIT OBSERVABILITY                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Real-time]  [Last 24h]  [Last 7d]  [Last 30d]  [Custom]       │
│                                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ Active Traces│ │ Cost (24h)   │ │ Error Rate   │             │
│  │     12       │ │   $4.23      │ │    0.8%      │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Cost by Model (24h)                                        │  │
│  │ ████████████ gpt-4o: $2.10 (50%)                           │  │
│  │ ████████ claude-3.5: $1.45 (34%)                          │  │
│  │ ████ Workers AI: $0.68 (16%)                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Latency P95 by Phase (24h)                                 │  │
│  │ DISCOVERY        ████████████ 45s                          │  │
│  │ ANALYSIS         ████████ 32s                              │  │
│  │ EVIDENCE_VALID   ██████ 18s                                │  │
│  │ OPPORTUNITY      ████ 12s                                  │  │
│  │ ROI              ██ 5s                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Active Traces Table                                        │  │
│  │ Trace ID          │ Tenant   │ Phase        │ Duration │   │
│  │ abc-123...        │ Acme     │ ANALYSIS     │ 2m 34s   │   │
│  │ def-456...        │ Beta     │ DISCOVERY    │ 1m 12s   │   │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Testing

### 10.1 Observability Tests

```typescript
// tests/observability/trace.test.ts
describe("Trace Management", () => {
  test("Trace created with correct structure", async () => {
    const ctx = await traceManager.startTrace({ auditId: "a-1", tenantId: "t-1" });
    expect(ctx.traceId).toBeDefined();
    expect(ctx.spanId).toBeDefined();
  });
  
  test("Span parent-child relationship maintained", async () => {
    const ctx = await traceManager.startTrace({ auditId: "a-1", tenantId: "t-1" });
    const parent = await traceManager.startSpan(ctx.traceId, { agentId: "orchestrator", phase: "CREATED", operation: "start" });
    const child = await traceManager.startSpan(ctx.traceId, { agentId: "discovery", phase: "DISCOVERY", operation: "system_mining", parentSpanId: parent });
    
    const spans = await traceManager.getSpans(ctx.traceId);
    const childSpan = spans.find(s => s.span_id === child);
    expect(childSpan.parent_span_id).toBe(parent);
  });
  
  test("Cost tracking aggregates correctly", async () => {
    const ctx = await traceManager.startTrace({ auditId: "a-1", tenantId: "t-1" });
    const spanId = await traceManager.startSpan(ctx.traceId, { agentId: "discovery", phase: "DISCOVERY", operation: "llm_call" });
    
    await traceManager.endSpan(spanId, {
      status: "SUCCESS",
      tokens: { input: 1000, output: 500, total: 1500 },
      cost: 0.015,
      model: { provider: "openai", model: "gpt-4o" }
    });
    
    const trace = await traceManager.getTrace(ctx.traceId);
    expect(trace.cost_summary.total_tokens).toBe(1500);
    expect(trace.cost_summary.total_cost_usd).toBeCloseTo(0.015, 3);
  });
  
  test("Policy decision recorded and linked to span", async () => {
    const ctx = await traceManager.startTrace({ auditId: "a-1", tenantId: "t-1" });
    const spanId = await traceManager.startSpan(ctx.traceId, { agentId: "automation", phase: "OPPORTUNITY_SCORING", operation: "assign_autonomy" });
    
    const decisionId = await traceManager.recordPolicyDecision({
      trace_id: ctx.traceId,
      span_id: spanId,
      principal: { type: "AGENT", id: "automation", tenant_id: "t-1" },
      action: "assign_autonomy",
      resource: { type: "OPPORTUNITY", id: "opp-1", tenant_id: "t-1" },
      context: { risk_level: "HIGH", evidence_class: "E2", phase: "OPPORTUNITY_SCORING", autonomy_requested: "A3" },
      decision: "REQUIRE_APPROVAL",
      reason: "High financial risk requires human approval"
    });
    
    const decisions = await traceManager.getPolicyDecisions(ctx.traceId);
    expect(decisions).toHaveLength(1);
    expect(decisions[0].decision).toBe("REQUIRE_APPROVAL");
  });
});
```

---

## 11. Deployment & Config

### 11.1 Environment Variables

```bash
# Observability
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.datadoghq.com/v1/traces  # eller Honeycomb, Grafana
OTEL_API_KEY=*** (wrangler secret)
OTEL_SERVICE_NAME=arch-audit

# AI Gateway
AI_GATEWAY_ID=arch-audit-prod
AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1/80d5b1d56a3e907150ba7348b6182894/arch-audit-prod

# Cost budgets
DEFAULT_MONTHLY_BUDGET_USD=100
BUDGET_ALERT_WARNING=0.7
BUDGET_ALERT_CRITICAL=0.9
```

### 11.2 Wrangler.toml (per worker)

```toml
[name = "audit-api"]
main = "src/index.ts"
compatibility_date = "2024-01-01"

[ai]
binding = "AI"

[vars]
ENVIRONMENT = "production"
OTEL_SERVICE_NAME = "arch-audit"

[[d1_databases]]
binding = "DB"
database_name = "arch-audit-prod"
database_id = "xxx"

[[r2_buckets]]
binding = "FILES"
bucket_name = "arch-audit-files-prod"

[observability]
enabled = true
head_sampling_rate = 1.0  # 100% for audit traces
```

---

## 12. Sjekkliste for Observability Launch

```markdown
## Observability Launch Gate

### Core Tracing
- [ ] Trace creation per audit run
- [ ] Span creation per agent/phase/operation
- [ ] Parent-child span relationships
- [ ] Trace context propagation via headers
- [ ] Span completion med result/error/cost

### AI Gateway
- [ ] Alle AI-kall går via Gateway
- [ ] Metadata: trace_id, span_id, tenant_id, audit_id, agent_id, phase
- [ ] Token tracking per kall
- [ ] Latency tracking
- [ ] Error tracking

### Cost Governance
- [ ] Cost per trace/audit/tenant/agent/model/phase
- [ ] Monthly budget per tenant
- [ ] Alert thresholds (70%/90%/100%)
- [ ] Auto-pause ved 100% budget

### Policy & Evidence Tracing
- [ ] Policy decisions logget med trace_id
- [ ] Evidence IDs linket til spans
- [ ] Human gates synlige i trace

### Export & Sanitization
- [ ] OpenTelemetry eksport konfigurer
- [ ] PII sanitization i eksport
- [ ] Custom attributes for Arch-spesifikk metadata

### Dashboard
- [ ] Control Center observability tab
- [ ] Real-time active traces
- [ ] Cost breakdown by model/agent/phase
- [ ] Latency percentiles by phase
- [ ] Error rate tracking

### Security
- [ ] Trace access control (tenant-scoped)
- [ ] No PII i traces (sanitization test)
- [ ] Audit log for trace access

### Testing
- [ ] Unit tests for trace/span/cost
- [ ] Integration test: full audit run → trace
- [ ] Load test: 100 concurrent audits
- [ ] Budget enforcement test
```