# Arch Audit Policy Architecture

**Dato:** 2026-08-20  
**Versjon:** 1.0  
**Basert på:** ARCH_AUDIT_ARCHITECTURE.md §8 + Master Implementation Directive §42-44

---

## 1. Policy Filosofi

> **Policy er kode, ikke dokumentasjon.**

Policy motoren kjører i **runtime** og avgjør om en handling tillates. Alle policy-beslutninger logges immutable for audit trail.

---

## 2. Policy Engine Valg: OPA vs Cedar

### 2.1 Sammenligning

| Kriterium | OPA/Rego | Cedar |
|-----------|----------|-------|
| **Maturitet** | Høy (Kubernetes, Terraform, Envoy) | Medium (AWS Verified Permissions) |
| **TypeScript Support** | God (opa-wasm, rego.ts) | God (cedar-policy-rs + WASM) |
| **Performance** | Høy (kompilert til WASM) | Meget høy (Rust core) |
| **Policy Testing** | `opa test` innebygd | `cedar test` innebygd |
| **CI/CD Integration** | Mature | Growing |
| **Authorization Model** | RBAC/ABAC/ReBAC | Entity-based, template-linked |
| **Learning Curve** | Medium (Rego språket) | Lav (Cedar språket) |
| **Cloudflare Workers** | Fungerer (WASM) | Fungerer (WASM) |
| **Audit Trail** | Custom logging | Innebygd decision logging |

### 2.2 Anbefaling: **OPA/Rego**

**Grunner:**
1. **Ekosystem**: Større community, flere eksempler, bedre tooling
2. **Testing**: `opa test` er veldig godt for CI/CD gate
3. **Flexibilitet**: Rego håndterer komplekse data-strukturer (nested JSON) naturlig
4. **Cloudflare Workers**: `opa-wasm` fungerer ut av boksen
5. **Eksisterende kunnskap**: Teamet kjenner Rego fra andre prosjekter

---

## 3. Policy Arkitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                        POLICY ENGINE (OPA)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   DATA       │  │   POLICIES   │  │   QUERY      │          │
│  │  (Input)     │  │  (.rego)     │  │  (Decision)  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         ▼                 ▼                 ▼                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  OPA WASM Runtime (embedded in Worker)                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  DECISION LOG (Immutable, D1)                                   │
│  { trace_id, principal, action, resource, decision, reason }   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Policy Struktur

```
policies/
├── data/
│   ├── roles.rego           # Rolledefinisjoner
│   ├── capabilities.rego    # Agent capabilities
│   ├── classifications.rego # Evidence classes, risk levels
│   └── budgets.rego         # Cost budgets per tenant
├── rules/
│   ├── tool_permissions.rego      # Hvilke tools agenter kan kalle
│   ├── system_access.rego         # System tilgang per tenant
│   ├── data_classes.rego          # PII, financial, osv.
│   ├── environment.rego           # dev/staging/prod
│   ├── tenant_isolation.rego      # Cross-tenant forbud
│   ├── autonomy.rego              # A0-A5 per agent/action
│   ├── destructive_actions.rego   # DELETE, DEPLOY, EXPORT
│   ├── external_communication.rego # HTTP, email, webhooks
│   ├── ai_provider.rego           # Tillatte modeller/providers
│   ├── human_approval.rego        # Når REQUIRE_APPROVAL
│   ├── retention.rego             # Retention policies
│   └── evidence_access.rego       # Hvem kan se hva
├── main.rego                    # Entrypoint: allow/deny/require_approval
├── test/
│   ├── tool_permissions_test.rego
│   ├── autonomy_test.rego
│   └── tenant_isolation_test.rego
└── bundle.tar.gz                # Kompilert bundle for deploy
```

---

## 5. Input Data Model

```json
{
  "principal": {
    "type": "AGENT",
    "id": "discovery",
    "tenant_id": "tenant-123",
    "roles": ["DISCOVERY_AGENT"],
    "autonomy_level": "A2_DRAFT"
  },
  "action": "read_system_data",
  "resource": {
    "type": "SYSTEM",
    "id": "sys-456",
    "tenant_id": "tenant-123",
    "classification": "INTERNAL"
  },
  "context": {
    "risk_level": "LOW",
    "evidence_class": "E4",
    "phase": "DISCOVERY",
    "autonomy_requested": "A2_DRAFT",
    "time_of_day": "2026-08-20T14:30:00Z",
    "ip_address": "192.168.1.1"
  }
}
```

---

## 6. Output Decision Model

```json
{
  "decision": "ALLOW",
  "obligations": ["LOG", "TRACE", "METER_COST"],
  "reason": "System mining is read-only, E4 evidence available, low risk, A2 autonomy permitted",
  "matched_rules": ["tool_permissions.system_mining", "autonomy.A2_allowed"],
  "trace_id": "audit-run-uuid"
}
```

Mulige decisions: `ALLOW`, `DENY`, `REQUIRE_APPROVAL`

---

## 7. Policy Rules per Domene (§44)

### 7.1 Tool Permissions

```rego
# policies/rules/tool_permissions.rego
package arch.policy

# Agent -> tillatte tools
agent_tools := {
  "discovery": ["fetch_github_repo", "query_d1_schema", "scan_api_spec", "query_cmdb"],
  "evidence": ["query_database", "call_api", "parse_document", "verify_system", "hash_content"],
  "process": ["extract_processes", "classify_tasks", "adapt_interview", "synthesize_findings"],
  "automation": ["classify_automation", "assess_feasibility", "calculate_roi", "assess_risk"],
  "risk": ["assess_financial_risk", "assess_operational_risk", "assess_privacy_risk"],
  "critic": ["check_contradictions", "check_hallucination", "verify_calculations"],
  "report": ["generate_executive_summary", "generate_interactive_report", "build_evidence_map"],
  "orchestrator": ["state_transition", "policy_evaluation", "human_gate", "trace_injection"]
}

# Tool krever evidence class
tool_min_evidence := {
  "fetch_github_repo": "E4",
  "query_d1_schema": "E4",
  "query_database": "E4",
  "call_api": "E3",
  "parse_document": "E2",
  "verify_system": "E4",
  "extract_processes": "E2",
  "classify_automation": "E2",
  "calculate_roi": "E3",
  "assess_risk": "E2"
}

# Sjekk om agent kan kalle tool
allow_tool(agent, tool, evidence_class) {
  tool in agent_tools[agent]
  evidence_class >= tool_min_evidence[tool]
}
```

### 7.2 System Access

```rego
# policies/rules/system_access.rego
package arch.policy

# Tenant kan kun aksere egne systemer
allow_system_access(principal, resource) {
  principal.tenant_id == resource.tenant_id
}

# Cross-tenant eksplisitt nektet
deny_cross_tenant(principal, resource) {
  principal.tenant_id != resource.tenant_id
  principal.type != "AUDITOR"
}
```

### 7.3 Autonomy Model (A0–A5)

```rego
# policies/rules/autonomy.rego
package arch.policy

# Autonomy levels
autonomy_levels := ["A0_OBSERVE", "A1_RECOMMEND", "A2_DRAFT", "A3_APPROVAL_REQUIRED", "A4_BOUNDED_AUTONOMY", "A5_FULL_AUTONOMY"]

# Agent default autonomy
agent_default_autonomy := {
  "discovery": "A2_DRAFT",
  "evidence": "A2_DRAFT",
  "process": "A1_RECOMMEND",
  "automation": "A2_DRAFT",
  "risk": "A2_DRAFT",
  "critic": "A1_RECOMMEND",
  "report": "A2_DRAFT",
  "orchestrator": "A3_APPROVAL_REQUIRED"
}

# Risk → max autonomy
risk_max_autonomy := {
  "LOW": "A4_BOUNDED_AUTONOMY",
  "MEDIUM": "A3_APPROVAL_REQUIRED",
  "HIGH": "A2_DRAFT",
  "CRITICAL": "A1_RECOMMEND"
}

# Evidence class → max autonomy
evidence_max_autonomy := {
  "E4": "A4_BOUNDED_AUTONOMY",
  "E3": "A3_APPROVAL_REQUIRED",
  "E2": "A2_DRAFT",
  "E1": "A1_RECOMMEND",
  "E0": "A0_OBSERVE"
}

# Finansielle handlinger krever A3+
financial_actions := ["DEPLOY", "EXPORT", "DELETE", "TRANSFER_FUNDS", "COMMIT_SPEND"]

# Beregn effektiv autonomy
effective_autonomy(principal, context) = min_autonomy([
  agent_default_autonomy[principal.id],
  risk_max_autonomy[context.risk_level],
  evidence_max_autonomy[context.evidence_class]
]) {
  # Finansiell override
  context.action in financial_actions
  min_autonomy([effective_autonomy, "A3_APPROVAL_REQUIRED"])
}

# Helper: min av to autonomy levels
min_autonomy([a, b]) = a {
  index_of(a, autonomy_levels) <= index_of(b, autonomy_levels)
}
min_autonomy([a, b]) = b {
  index_of(a, autonomy_levels) > index_of(b, autonomy_levels)
}
```

### 7.4 Human Approval Gates

```rego
# policies/rules/human_approval.rego
package arch.policy

# Når kreves menneskelig godkjenning?
require_human_approval(context) {
  # Høy/krfinans risiko
  context.risk_level in ["HIGH", "CRITICAL"]
}

require_human_approval(context) {
  # Finansiell handling
  context.action in financial_actions
}

require_human_approval(context) {
  # Lav evidens
  context.evidence_class in ["E0", "E1"]
}

require_human_approval(context) {
  # Irreversibel handling
  context.reversibility == "NONE"
}

require_human_approval(context) {
  # Autonomy request over policy
  autonomy_requested > effective_autonomy
}

# Hvem kan godkjenne?
approvers(context) = ["OWNER", "ADMIN"] {
  context.risk_level == "CRITICAL"
}

approvers(context) = ["OWNER", "ADMIN", "ANALYST"] {
  context.risk_level == "HIGH"
  not context.financial_action
}

approvers(context) = ["OWNER", "ADMIN", "ANALYST"] {
  not context.risk_level in ["HIGH", "CRITICAL"]
}
```

### 7.5 Destructive Actions

```rego
# policies/rules/destructive_actions.rego
package arch.policy

destructive_actions := ["DELETE", "DEPLOY", "EXPORT", "DROP_TABLE", "TRUNCATE", "REVOKE_ACCESS"]

# Destructive krever A3+ og human approval
deny_destructive(principal, action, context) {
  action in destructive_actions
  effective_autonomy(principal, context) in ["A0_OBSERVE", "A1_RECOMMEND", "A2_DRAFT"]
}

allow_destructive(principal, action, context) {
  action in destructive_actions
  effective_autonomy(principal, context) in ["A3_APPROVAL_REQUIRED", "A4_BOUNDED_AUTONOMY", "A5_FULL_AUTONOMY"]
  not require_human_approval(context)
}
```

### 7.6 Evidence Access

```rego
# policies/rules/evidence_access.rego
package arch.policy

# E4 evidence kan ses av alle roller i tenant
allow_evidence_access(principal, evidence) {
  principal.tenant_id == evidence.tenant_id
  evidence.classification == "E4"
}

# E3 krever ANALYST+
allow_evidence_access(principal, evidence) {
  principal.tenant_id == evidence.tenant_id
  evidence.classification == "E3"
  principal.roles[_] in ["OWNER", "ADMIN", "ANALYST"]
}

# E2/E1 krever ADMIN+
allow_evidence_access(principal, evidence) {
  principal.tenant_id == evidence.tenant_id
  evidence.classification in ["E2", "E1"]
  principal.roles[_] in ["OWNER", "ADMIN"]
}

# E0 kun OWNER
allow_evidence_access(principal, evidence) {
  principal.tenant_id == evidence.tenant_id
  evidence.classification == "E0"
  principal.roles[_] == "OWNER"
}

# Cross-tenant evidence access: ALDRI
deny_evidence_access(principal, evidence) {
  principal.tenant_id != evidence.tenant_id
  principal.type != "AUDITOR"
}
```

---

## 8. Main Policy Entrypoint

```rego
# policies/main.rego
package arch.policy

# Hovedbeslutning
default decision = "DENY"

decision = "ALLOW" {
  allow(principal, action, resource, context)
}

decision = "REQUIRE_APPROVAL" {
  require_human_approval(context)
  not deny(principal, action, resource, context)
  allow_principal(principal, action, resource)
}

decision = "DENY" {
  deny(principal, action, resource, context)
}

# Tillatelse logikk
allow(principal, action, resource, context) {
  allow_principal(principal, action, resource)
  allow_context(context)
  allow_autonomy(principal, context)
  allow_tool_usage(principal, action, context)
}

allow_principal(principal, action, resource) {
  # Samme tenant eller auditor
  principal.tenant_id == resource.tenant_id
  principal.type != "AUDITOR"
}

allow_principal(principal, action, resource) {
  # Auditor har cross-tenant read
  principal.type == "AUDITOR"
  action in ["READ", "LIST", "EXPORT_REPORT"]
}

allow_context(context) {
  # Ikke i frozen/maintenance
  not context.maintenance_mode
}

allow_autonomy(principal, context) {
  # Effektiv autonomy >= requested
  requested := context.autonomy_requested
  effective := effective_autonomy(principal, context)
  index_of(requested, autonomy_levels) <= index_of(effective, autonomy_levels)
}

allow_tool_usage(principal, action, context) {
  # Hvis tool-kall, sjekk tool permissions
  not context.tool
  allow_tool(principal.id, context.tool, context.evidence_class)
}

# Context helpers
allow_context(context) {
  context.risk_level != "CRITICAL"
}

allow_context(context) {
  context.risk_level == "CRITICAL"
  principal.roles[_] == "OWNER"
}
```

---

## 8. CI/CD Policy Testing (§82)

```bash
# Kjør alle policy tester
opa test policies/ -v

# Eksempel test output
# policies/rules/autonomy_test.rego
package arch.policy.test

test_high_risk_limits_autonomy {
  context := {"risk_level": "HIGH", "evidence_class": "E4", "autonomy_requested": "A4_BOUNDED_AUTONOMY"}
  principal := {"id": "automation", "tenant_id": "t-1"}
  decision := effective_autonomy(principal, context)
  decision == "A3_APPROVAL_REQUIRED"
}

test_financial_action_requires_A3 {
  context := {"risk_level": "LOW", "evidence_class": "E4", "action": "DEPLOY", "autonomy_requested": "A4_BOUNDED_AUTONOMY"}
  principal := {"id": "orchestrator", "tenant_id": "t-1"}
  decision := effective_autonomy(principal, context)
  decision == "A3_APPROVAL_REQUIRED"
}

test_cross_tenant_denied {
  principal := {"type": "AGENT", "id": "discovery", "tenant_id": "t-1"}
  resource := {"type": "SYSTEM", "id": "sys-1", "tenant_id": "t-2"}
  deny_cross_tenant(principal, resource)
}

test_E0_only_owner {
  principal := {"tenant_id": "t-1", "roles": ["ANALYST"]}
  evidence := {"tenant_id": "t-1", "classification": "E0"}
  not allow_evidence_access(principal, evidence)
}

test_E4_all_roles {
  principal := {"tenant_id": "t-1", "roles": ["VIEWER"]}
  evidence := {"tenant_id": "t-1", "classification": "E4"}
  allow_evidence_access(principal, evidence)
}
```

### CI Gate

```yaml
# .github/workflows/policy-test.yml
jobs:
  policy-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install OPA
        uses: opa/setup-opa@v1
      - name: Run policy tests
        run: opa test policies/ -v
      - name: Build bundle
        run: opa build -b policies/ -o policies/bundle.tar.gz
      - name: Verify bundle
        run: opa eval -b policies/bundle.tar.gz -i test/input.json "data.arch.policy.decision"
```

---

## 9. Runtime Policy Evaluation

```typescript
// packages/policy/src/engine.ts
import { OPA } from "opa-wasm";

export class PolicyEngine {
  private opa: OPA;
  
  constructor(bundle: Uint8Array) {
    this.opa = new OPA(bundle);
  }
  
  async evaluate(input: PolicyInput): Promise<PolicyDecision> {
    const result = await this.opa.evaluate("data.arch.policy", input);
    
    const decision = result.result[0]?.expressions[0]?.value?.decision ?? "DENY";
    const obligations = result.result[0]?.expressions[0]?.value?.obligations ?? ["LOG"];
    const reason = result.result[0]?.expressions[0]?.value?.reason ?? "No matching rule";
    const matchedRules = result.result[0]?.expressions[0]?.value?.matched_rules ?? [];
    
    return { decision, obligations, reason, matchedRules };
  }
}

// Bruk i Worker
export async function policyMiddleware(request: Request, env: Env, context: PolicyContext) {
  const input = buildPolicyInput(context);
  const decision = await policyEngine.evaluate(input);
  
  // Logg beslutning
  await logPolicyDecision({
    trace_id: context.traceId,
    span_id: context.spanId,
    ...input,
    decision: decision.decision,
    reason: decision.reason
  });
  
  if (decision.decision === "DENY") {
    throw new AuthorizationError(decision.reason);
  }
  
  if (decision.decision === "REQUIRE_APPROVAL") {
    await requestHumanApproval(context.traceId, decision);
    throw new PendingApprovalError("Awaiting human approval");
  }
  
  return decision;
}
```

---

## 9. Bundle Deployment

```bash
# Bygg bundle
opa build -b policies/ -o policies/bundle.tar.gz --optimize=1

# Deploy til R2 (for Workers å hente)
wrangler r2 put arch-policy-bundles/prod/bundle.tar.gz --file policies/bundle.tar.gz

# Worker henter bundle ved startup
# packages/policy/src/loader.ts
export async function loadPolicyBundle(env: Env): Promise<Uint8Array> {
  const object = await env.R2.get("arch-policy-bundles/prod/bundle.tar.gz");
  if (!object) throw new Error("Policy bundle not found");
  return new Uint8Array(await object.arrayBuffer());
}
```

---

## 10. Policy Versioning

```typescript
interface PolicyVersion {
  version: string;              // Semver: "1.2.0"
  bundle_hash: string;          // SHA256 av bundle.tar.gz
  deployed_at: string;
  deployed_by: string;
  changelog: string;
  test_results: TestResults;
  rollback_version?: string;    // For rask rollback
}

// Ved deploy: lagre version i D1
await env.D1.prepare(`
  INSERT INTO policy_versions (version, bundle_hash, deployed_at, deployed_by, changelog, test_results)
  VALUES (?, ?, ?, ?, ?, ?)
`).bind(version, hash, now, user, changelog, JSON.stringify(testResults)).run();
```

---

## 11. Sjekkliste for Policy Launch

```markdown
## Policy Launch Gate

### Core
- [ ] OPA bundle bygger uten feil
- [ ] Alle policy tester grønne (`opa test policies/ -v`)
- [ ] Bundle deployes til R2
- [ ] Worker laster bundle ved startup
- [ ] Policy evaluation fungerer i runtime

### Coverage (§44)
- [ ] Tool permissions
- [ ] System access
- [ ] Data classes (PII, financial, etc.)
- [ ] Environment restrictions
- [ ] Tenant isolation (cross-tenant deny)
- [ ] Autonomy (A0-A5)
- [ ] Destructive actions (DELETE, DEPLOY, EXPORT)
- [ ] External communication (HTTP, email, webhooks)
- [ ] AI provider restrictions
- [ ] Human approval gates
- [ ] Retention policies
- [ ] Evidence access control

### Testing
- [ ] Unit tests per rule-fil
- [ ] Integration tests i CI
- [ ] Negative tests (forventet DENY)
- [ ] Edge cases (AUDITOR cross-tenant, maintenance mode)

### Observability
- [ ] Alle policy decisions logges til D1
- [ ] Trace ID kobles til policy decision
- [ ] Decision reason lagres
- [ ] Matched rules lagres

### Security
- [ ] Bundle signert/verifisert
- [ ] Ingen secrets i policies
- [ ] Rollback-prosedyre dokumentert
- [ ] Emergency bypass (break-glass) dokumentert
```