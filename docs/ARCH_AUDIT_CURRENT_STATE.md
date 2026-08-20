# Arch Audit Current State

**Dato:** 2026-08-20  
**Verifisert av:** Hermes (Chief Architect)  
**Metode:** Kode-inspeksjon, prod-verifisering (curl), git status, CF API

---

## 1. Repository & Deploy

| Egenskap | Verdi |
|----------|-------|
| Repo | `/Users/taj/arch-platform` (main, clean) |
| Monorepo | 2 apps + 7 packages |
| Prod URL | `https://arch.axn.no` (CF Pages `arch-platform`) |
| Staging URL | `https://arch-platform.pages.dev` (alias) |
| Deploy branch | `main` |
| Deploy trigger | `workflow_dispatch` only (governed) |
| Siste deploy | `deabe2d4` 2026-08-20T12:55:41 |

---

## 2. Arch Audit Capabilities

### 2.1 Repo/System Audit v1 (`packages/audit/audit.mjs`)

| Feature | Status | Evidens |
|---------|--------|---------|
| Secret scan | IMPLEMENTED | `secret-scan.mjs` |
| Stack detection | IMPLEMENTED | `stack-detect.mjs` |
| CI/CD mismatch detection | IMPLEMENTED | `audit.mjs:155-178` |
| Health Score integration | IMPLEMENTED | `health-score.mjs` kall |
| GitHub metadata | IMPLEMENTED | `gh api repos/...` |
| Knowledge Graph lessons | IMPLEMENTED | `collectKnowledge()` |
| 3-class grading (AUTO/INFERRED/HUMAN) | IMPLEMENTED | `classify.mjs` |
| Customer consent gate | IMPLEMENTED | `customer.mjs` |
| Report rendering (customer/technical/evidence) | IMPLEMENTED | `report.mjs` |

**Kjørte audits:** Klarpakke (98%), bilglass, arch-audit-fastapi

---

### 2.2 Website Audit v1 (`packages/audit/audit-web.mjs`)

| Feature | Status | Evidens |
|---------|--------|---------|
| Passiv outside-in crawl | IMPLEMENTED | `collect.mjs` max 25 sider/dybde 3 |
| 8 dimensjoner (Perf 20, Sec 20, UX 15, Acc 15, SEO 10, Rel 10, Trust 5, Auto 5) | IMPLEMENTED | `score.mjs` |
| 4 bøtter (Critical/High ROI/Quick Win/Strategic) | IMPLEMENTED | `commercial.mjs` |
| Executive scorecard (6 dims) | IMPLEMENTED | `scorecard.mjs` |
| Prospect preview mode | IMPLEMENTED | `--prospect-preview` flagg |
| Customer consent gate | IMPLEMENTED | `customer.mjs` |
| Browser evidence (valgfri) | IMPLEMENTED | `browser.mjs` |

**Test-profiler:** klarpakke.no (73%), example.com (44%), arch-platform.pages.dev (66%)

---

### 2.3 Website Audit v2 (`packages/audit/audit-web-v2.mjs`)

| Modul | Status | Evidens |
|-------|--------|---------|
| security.mjs (header A+–F, cookies, TLS, versjon) | IMPLEMENTED | `lib/web/security.mjs` |
| dns-email.mjs (SPF/DKIM/DMARC/MTA-STS/BIMI/CAA/DNSSEC/DNSBL + crt.sh) | IMPLEMENTED | `lib/web/dns-email.mjs` |
| norge.mjs (Brreg, Norid RDAP, SSB) | IMPLEMENTED | `lib/web/norge.mjs` |
| wayback.mjs (Wayback CDX) | IMPLEMENTED | `lib/web/wayback.mjs` |
| compliance.mjs (cookie/CMP, personvern, trackere, pris/angrerett) | IMPLEMENTED | `lib/web/compliance.mjs` |
| pagespeed.mjs (CrUX CWV) | IMPLEMENTED | `lib/web/pagespeed.mjs` |
| presence.mjs (Google Maps, sosiale, NAP) | IMPLEMENTED | `lib/web/presence.mjs` |
| ai-analysis.mjs (DeepSeek Flash) | IMPLEMENTED | `lib/web/ai-analysis.mjs` |
| ai-visibility.mjs (GEO: 3 prompts → 3 AI searches) | IMPLEMENTED | `lib/web/ai-visibility.mjs` |

**Kjørte v2-audits:** autoglass.finnbilglass.no, klarpakke.no, revolut.com

---

### 2.4 Governance & Platform

| Capability | Status | Evidens |
|------------|--------|---------|
| Project Registry (SSoT) | IMPLEMENTED | `packages/governance/projects.json` (14 prosjekter) |
| Health Score v2.1 | IMPLEMENTED | `packages/health-score/health-score.mjs` (vekter: Gov 20, Sec 25, Eng 25, Ops 20, Doc 10) |
| Data Adapters (4) | IMPLEMENTED | GitHub, Linear, Knowledge, Hermes |
| Deploy Readiness (12 gates) | IMPLEMENTED | `packages/governance/deploy-ready-check.mjs` |
| Leakage Audit | IMPLEMENTED | `packages/data-adapters/audit-leak.mjs` (0 funn) |
| CI/CD (workflow_dispatch) | IMPLEMENTED | `.github/workflows/deploy.yml` |
| Secrets Registry | IMPLEMENTED | `.arch/secrets/registry.yaml` (referanser kun) |
| Knowledge Graph (7 domener) | IMPLEMENTED | `.arch/knowledge/` + `packages/knowledge-engine/knowledge/` |
| Linear Integration | IMPLEMENTED | GraphQL med stateId/teamId |

---

## 3. Frontend

### 3.1 Customer Portal (Public)
- **Path:** `apps/customer-portal/`
- **Sider:** index.html, case-arch-platform.html, case-autoglass.html, systems.html
- **Auth:** Ingen
- **Data:** `data.js` (sanitert, generert ved `npm run build`)
- **Live:** `https://arch.axn.no` ✅ 200

### 3.2 Control Center (Intern)
- **Path:** `apps/control-center/`
- **Sider:** index.html (full provenance)
- **Auth:** **INGEN** (merket "INTERN · krever autentisering" men ingen implementert)
- **Data:** `data.js` (full, inkl. `dev_path`, interne metadata)
- **Deploy:** **ALDRI** (ingen auth = ingen deploy)

---

## 4. Data Layer

| Lag | Teknologi | Status |
|-----|-----------|--------|
| Statisk data | `data.js` (window.ARCH_DATA) | IMPLEMENTED |
| Database (Finnbilglass) | Cloudflare D1 | IMPLEMENTED (separat repo) |
| Database (Arch) | **Ingen** (kun JSON-filer) | MISSING |
| Supabase | **Ikke i bruk** | MISSING |
| R2 | **Ikke i bruk** | MISSING |

---

## 5. Authentication & Authorization

| Komponent | Status |
|-----------|--------|
| Customer Portal auth | **INGEN** |
| Control Center auth | **INGEN** |
| API auth | **INGEN** (ingen API-endepunkter) |
| Tenant isolation | **INGEN** |
| RBAC | **INGEN** |

---

## 6. Observability

| Komponent | Status |
|-----------|--------|
| Pre-deploy gates | IMPLEMENTED (12 gates) |
| Smoke test (prod) | IMPLEMENTED (HTTP + privacy) |
| Runtime tracing | **INGEN** |
| Agent/task tracing | **INGEN** |
| Cost tracking | **INGEN** |
| Error tracking | **INGEN** |
| OpenTelemetry | **INGEN** |

---

## 7. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
jobs:
  gates:     # 12 gates (syntax, build, leak-audit, deploy-ready)
  deploy:    # wrangler pages deploy (needs: gates)
  smoke:     # HTTP + privacy + rollback + alert (needs: deploy)
```

**Alle gates grønne:** ✅ 12/12

---

## 8. Committed Audit Reports

| Type | Antall | Eksempler |
|------|--------|-----------|
| Repo audits (v1) | 3 | klarpakke, bilglass, arch-audit-fastapi |
| Kunde audits | 4 | autoglass, bilglass, bilglassgruppen, carglass |
| Prospect website audits v1 | 8 | ISS, Toma, Riis, Coop, Revolut, NBIM, Lille London, Trønder Taxi |
| Prospect website audits v2 | 3 | autoglass.finnbilglass.no, klarpakke.no, revolut.com |

---

## 9. MCP Servers (konfigurert)

- Cloudflare API
- Cloudflare Docs
- Cloudflare Bindings
- Cloudflare Builds
- Cloudflare Observability
- GitHub
- Linear
- Resend
- Stripe
- Supabase
- Browserbase
- Chrome DevTools

---

## 10. Summary

**Sterke sider (IMPLEMENTED):**
- Governance (12 gates, Linear SSO, secrets registry, leakage audit)
- Evidence-based audit methodology (3-class grading, provenance)
- Website audit v1+v2 (8+9 moduler, Norge-data, AI visibility)
- Health Score v2.1 (vekter, evidence, 4 states)
- Project Registry SSoT
- Deploy pipeline (governed, smoke, rollback)

**Store gap (MISSING):**
- **Authentication/Authorization** (ingen auth på control-center)
- **Multi-tenancy** (ingen tenant isolation)
- **Observability** (ingen runtime tracing, cost tracking)
- **Policy-as-code** (policies.yaml men ingen runtime enforcement)
- **Context Graph temporal** (statisk append-only)
- **Outcome tracking** (expected vs actual ikke implementert)
- **Continuous audit** (kun ad-hoc)
- **Database layer** (ingen D1/Supabase for Arch-eigne data)
- **MCP agent interop** (kun data-adapters)

---

## 11. Maturity Score (0-5 per dimensjon)

| Dimensjon | Score | Begrunnelse |
|-----------|-------|-------------|
| Architecture | 4 | Modulær monorepo, governed deploy, SSoT |
| Governance | 4 | 12 gates, Linear SSO, secrets registry |
| Evidence | 4 | 3-class grading, provenance, customer gate |
| Provenance | 4 | observed/declared/stale/unknown/error |
| Auditability | 3 | Leakage audit, deploy gates, men ingen runtime audit log |
| Policy Enforcement | 2 | policies.yaml eksisterer, men ingen runtime/CI enforcement |
| Observability | 1 | Kun pre-deploy, ingen prod tracing |
| Tracing | 1 | Ingen distributed tracing |
| Evals | 2 | Ingen eval framework for LLM-kvalitet |
| Agents | 3 | 6 agenter definert, men ingen orchestration runtime |
| Orchestration | 2 | Hermes som Chief Architect, men ingen state machine |
| Tool Security | 3 | Leakage audit, secrets ref, men ingen sandboxing |
| Authentication | 0 | Ingen auth |
| Authorization | 0 | Ingen RBAC/tenant isolation |
| Secrets | 4 | Registry + BWS/wrangler, ingen i git |
| Tenant Isolation | 0 | Ingen multi-tenancy |
| Data Model | 3 | JSON files, D1 for Finnbilglass, ingen for Arch |
| Temporal Truth | 1 | KG append-only, ingen valid_from/valid_to |
| Context | 2 | KG 7 domener, men ingen decision traces |
| Resilience | 3 | Graceful degradation i adapters, men ingen retry/idempotency på workflow |
| Retry/Idempotency | 2 | Delvis i collect, men ikke på audit pipeline |
| Cost Management | 1 | Ingen cost tracking |
| Human Approval | 3 | Tom-godkjenning på deploy, men ingen autonomy model |
| Accessibility | 3 | Semantisk HTML, men ikke WCAG-testet |
| Performance | 4 | Statisk Pages, Cloudflare edge, gode CWV |
| SEO | 3 | Structured data delvis, content moat planlagt |
| Conversion | 2 | Landing + case-sider, men ingen funnel tracking |
| Product UX | 3 | Clean design, men ingen executive dashboard |
| Audit Methodology | 4 | Evidence-first, 3-class, Norge-utvidelse |
| Report Quality | 4 | Customer + technical + evidence, executive summary |
| ROI Engine | 2 | Basic i commercial.mjs, ikke deterministic scenarios |
| Production Readiness | 3 | Governed deploy OK, men mangler auth/observability/tenancy |

**GJENNOMSNITT: 2.6 / 5.0 (≈ 52%)**

---

## 12. Verdict

Arch Audit er en **solid governance-plattform med world-class audit methodology**, men **ikke en world-class audit PRODUKT** enda.

Mangler for produktskifte:
1. Auth + Multi-tenancy (kritisk for kundedata)
2. Observability + Policy-as-code (kritisk for governance)
3. Outcome tracking + Continuous audit (differentiering)
4. Executive UX + ROI Engine (kommersiell verdi)