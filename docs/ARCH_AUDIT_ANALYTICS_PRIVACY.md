# Arch Audit Analytics & Privacy Contract

**Dato:** 2026-08-20  
**Versjon:** 1.0  
**Basert på:** Master Implementation Directive §26-31, §66-67, §90-99

---

## 1. Privacy-First Prinsipp

> **Arch skal analysere etterspørsel uten å bli en overvåkingsplattform.**

Forbudt:
- cross-site tracking
- IP-deanonymisering
- fingerprinting uten behov
- kjøpt tredjepartsprofilering
- skjult deanonymisering

---

## 2. Analytics Stack (Cloudflare-native first)

| Behov | Løsning | Formål |
|-------|---------|--------|
| Public traffic, performance, page usage | **Cloudflare Web Analytics** | Offentlig trafikk |
| First-party product events, funnel, demand, audit lifecycle, high-cardinality | **Workers Analytics Engine** | Produkt-events + demand signals |
| Runtime health | **Workers Metrics** | Runtime |
| AI usage, latency, tokens, cost, failures | **AI Gateway** | AI-kall |
| Organic search demand | **Google Search Console** | Søke-etterspørsel |

> **Ikke legg inn fem nye SaaS-verktøy dersom Cloudflare dekker behovet.**

---

## 3. Analytics Engine Datasets

```
arch_product_events
arch_demand_signals
arch_audit_metrics
arch_ai_costs
```

> Ikke opprett flere datasets enn nødvendig. Design dimensions for faktiske spørsmål:
> - Hvilken bransje konverterer best?
> - Hvilken problemkategori fører oftest til full audit?
> - Hvilken source gir raskest time-to-insight?

---

## 4. D1 vs Analytics Engine (ansvarsdeling)

| D1 (transactional state) | Analytics Engine (event/time-series) |
|--------------------------|--------------------------------------|
| AuditSession | Product events |
| PublicCompanyContext | Demand signals |
| QuestionDecision | Audit metrics |
| Account / Tenant | AI costs |
| Paid Audit / Evidence | Funnel telemetry |

> **Ikke putt rå eventstream i D1. Ikke putt transactional state i Analytics Engine.**

---

## 5. Retention Policy

| Dataset | Retention | Begrunnelse |
|---------|-----------|-------------|
| RAW UNMATCHED SEARCH | Kortest mulig | Potensielt sensitiv free text |
| PRODUCT ANALYTICS | Aggregert/pseudonymisert etter behov | Formål: produktforståelse |
| AUDIT EVIDENCE | Kunde/contract-styrt | Produktdata |
| SEARCH CONSOLE | Aggregert | Market intelligence |
| PRODUCTION OBSERVABILITY | Operasjonell | Debug/ops |

> **Dokumenter retention per dataset. Juridisk/teknisk verifiseres.**

---

## 6. Cookie / Tracking Governance

Før cookies/pixels/replay implementeres: verifiser ekomloven, GDPR, Datatilsynets veiledning.

Dersom samtykke kreves:
- frivillig, spesifikt, informert, utvetydig
- reject like enkelt som accept
- ingen forhåndsvalgte valg
- enkelt å trekke tilbake

### 6.1 Hold samtykke enkelt

- **ESSENTIAL:** nødvendig for audit/session/security.
- **OPTIONAL ANALYTICS:** kun dersom teknologien krever samtykke.

> **Ikke legg inn Meta Pixel, LinkedIn Insight Tag, Google Ads tracking, session replay, heatmaps automatisk.** Vurder hver for seg senere.

### 6.2 Ingen session replay i Fase 1

Conversation-data, firmadata og audit-context kan være sensitivt. Start med event analytics.

---

## 7. Analytics Policy-as-Code

```rego
# policies/rules/analytics.rego
package arch.policy

# FORBUDT i generic analytics
deny_analytics_field(input) {
  input.field in ["email", "phone", "token", "password",
    "access_token", "auth_token", "jwt", "authorization",
    "document_text", "conversation_text", "cookie",
    "ip_address", "uploaded_document", "customer_secret"]
}

# Tillatt (metadata om atferd)
allow_analytics_field(input) {
  input.field in ["industry_category", "event_name",
    "resolved_public_org_number", "aggregated_problem_category",
    "intent_category", "audit_scope"]
}
```

### 7.1 Decisioner (policy-regler)

| Decision | Field | Grunn |
|----------|-------|-------|
| DENY | raw_auth_token → analytics | Hemmelighet |
| DENY | uploaded_document → analytics | Sensitiv produktdata |
| DENY | full_conversation → generic analytics | Sensitiv produktdata |
| DENY | cross_site_identifier | Privacy |
| DENY | ip_deanonymization | Privacy |
| ALLOW | industry_category | Avledet kategori |
| ALLOW | event_name | Metadata |
| ALLOW | resolved_public_org_number (der berettiget) | Canonical |
| ALLOW | aggregated_problem_category | Avledet kategori |
| REVIEW | raw_unmatched_search_query | Kan være sensitiv |

---

## 8. Analytics Privacy Linter

Linter blokkerer analytics events med forbudte felter.

Forbudte patterns (regex-blocklist):
```
email, phone, token, password, document_text,
conversation_text, authorization, cookie, jwt
```

Test: event med `email` felt → blokkeres i CI.

---

## 9. Observability vs Analytics vs Demand

| Domene | Formål | Eksempler |
|--------|--------|-----------|
| **OBSERVABILITY** | Hvordan systemet fungerer | latency, errors, traces, cost |
| **PRODUCT ANALYTICS** | Hvordan produktet brukes | audit starts, findings, conversion |
| **DEMAND INTELLIGENCE** | Hva markedet ønsker | industries, searches, problems, automation categories |

> **Ikke bygg én enorm database med alt.**

---

## 10. Search Query Storage Rule

| Type | Policy |
|------|--------|
| MATCHED COMPANY SEARCH | Lagre resolved canonical company identity + aggregert event |
| UNMATCHED GENERAL SEARCH | Classify/minimize; raw retention kun hvis berettiget |
| AI CONVERSATION | Produktdatabase/evidence under audit scope; analytics får kun avledede kategorier |
| GOOGLE SEARCH QUERY | Aggregert Search Console data |

---

## 11. Search Query Redaction

Detect og fjern: email, phone, personal identifiers, secrets, passwords/tokens — før eventet når analytics.

---

## 12. Consent & Account Transition

Når anonym AuditSession → konto/full audit:
- forklar tydelig: hva lagres, hvorfor, hvor lenge, hvordan sletting fungerer.
- **Ikke skjul i 40 sider vilkår.**

### 12.1 Link anonym → user kun legitimt

Kun når brukeren selv logger inn/oppretter konto. Ikke koble gamle anonyme profiler automatisk uten legitimt grunnlag.

---

## 13. Tester (minstekrav)

| Kategori | Test |
|----------|------|
| DATA MINIMIZATION | email kan ikke nå generic analytics |
| DATA MINIMIZATION | JWT kan ikke nå analytics |
| DATA MINIMIZATION | conversation text kan ikke nå analytics utilsiktet |
| DATA MINIMIZATION | document contents kan ikke nå analytics |
| COMPANY SEARCH | korrekt canonical org mapping |
| COMPANY SEARCH | aliases normaliseres |
| COMPANY SEARCH | unmatched håndteres trygt |
| COMPANY SEARCH | raw sensitive query redacted |
| DEMAND | classification virker |
| DEMAND | aggregasjon korrekt |
| DEMAND | bot traffic ekskludert |
| FUNNEL | start/context/finding/free-boundary/conversion events |
| PRIVACY | consent policy-test |
| PRIVACY | withdrawal respekteres |
| PRIVACY | optional tracking disabled uten consent |

---

## 14. Security på analytics endpoints

- rate limit
- schema validate
- reject arbitrary metadata
- cap payload size
- sanitize
- avoid reflection
- prevent injection
- authenticate internal dashboard
- prevent public analytics queries

---

## 15. Rate Limit & Abuse (Public Discovery)

- request throttling, cache, abuse detection, limits, resource budgets.
- **Ikke gjør Arch til gratis bulk-data API.**

### 15.1 Bot Detection

Skill: real users / crawlers / known bots / automated abuse. Ikke la bots ødelegge demand-data.

### 15.2 Ingen CAPTCHA by default

Bruk Cloudflare-native abuse controls. Eskalér challenge ved mistenkelig aktivitet.

### 15.3 Public Discovery Budget

Per anonym audit: max public source calls, max crawl pages, max AI tokens, max runtime.

---

## 16. Acceptance Criteria — Privacy

Godkjent når:
- [ ] no cross-site tracking
- [ ] no IP deanonymization
- [ ] no secret leakage
- [ ] no tokens in analytics
- [ ] no raw document content in analytics
- [ ] no unnecessary conversation text
- [ ] consent rules enforced where required
- [ ] retention documented
- [ ] deletion path documented
- [ ] analytics/privacy tests green

---

## 17. Acceptance Criteria — Demand Intelligence

Godkjent når dashboard kan svare:
- [ ] Hvilke bransjer undersøkes mest?
- [ ] Hvilke problemer nevnes mest?
- [ ] Hvilke automation categories etterspørres mest?
- [ ] Hvor mange starter audit?
- [ ] Hvor mange når første finding?
- [ ] Hvor mange når free boundary?
- [ ] Hvilke innganger konverterer best?
- [ ] Hvilke organic search queries driver relevant trafikk?
- [ ] Hvilke sider bidrar til audit starts?
- [ ] Hvor faller brukerne av?

---

## 18. Finale Principle

> **Arch skal aldri ofre PRIVACY, TRUST, EVIDENCE eller GOVERNANCE for noen ekstra prosent conversion.**
