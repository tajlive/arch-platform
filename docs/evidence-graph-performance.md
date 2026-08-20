# Evidence Graph — Load Test Report

**Dato:** 2026-08-20
**Schema-versjon:** 0005 (Evidence Graph) + 0006 (Synthetic Data Policy)
**Databasen:** arch-audit (D1, prod-region EEUR/ARN)

---

## Sammendrag

Evidence Graph ble last-testet med **10 000 syntetiske selskaper** før beta. Formålet var å verifisere at D1 håndterer grafen ved produksjonsskala, og å måle når vi må introdusere R2/Vectorize/Queues.

**Konklusjon:** D1 alene dekker Sprint 2–4. Sub-millisekund query-tid selv ved 10 000 selskaper. Ingen ytelsesgrunn til å introdusere nye tjenester ennå.

---

## Testoppsett

| Parameter | Verdi |
|-----------|-------|
| Selskaper | 10 000 syntetiske (unike org-numre) |
| Noder | 10 000 (1 COMPANY-node per selskap) |
| Total rader i evidence_nodes | 10 113 |
| DB-størrelse ved 10 000 | ~3.5 MB |
| Insert-metode | `wrangler d1 execute --file` (20 000 statements) |
| Insert-tid (10 000) | 5.7 s |

---

## Query-latens (sann D1-tid, `duration` ms)

| Query | Radere lest | Latens |
|-------|-------------|--------|
| Lookup 1 selskap (indeksert) | 12 | **0.28 ms** |
| Lookup 10 000-selskaps-node | 2 | **0.17 ms** |
| COUNT over hele grafen (10 113 rader) | 10 113 | **0.14 ms** |
| 3-veis graf-JOIN (hypotese→evidence→question) | 14 | **0.32 ms** |

> Latens er målt som D1's `meta.duration` (SQL-kjøretid), ikke CLI-overhead. CLI-overhead (`wrangler` prosessoppstart) er ~1.8s uavhengig av query, og er irrelevant for Worker-runtime.

---

## Indekser (fra migrasjon 0005)

```
evidence_nodes: idx_en_company (company_id), idx_en_type (type), idx_en_tenant (tenant_id)
evidence_edges: idx_ee_from, idx_ee_to, idx_ee_rel
hypothesis_evidence: idx_he_hypothesis, idx_he_evidence
questions: idx_q_hypothesis
```

Alle lookups er indeksert → O(log n) selv ved stor vekst.

---

## Når trenger vi mer enn D1?

| Tjeneste | Trigger |
|----------|---------|
| **R2** | Når dokumenter (årsrapporter, PDF-er, nettsider) lagres som blobs > D1 cell-størrelse (~2 MB per rad) |
| **Vectorize** | Når semantisk kryss-søk på tvers av selskaper («bedrifter med lignende mønster») — først med ekte data |
| **Queues (event stream)** | Når research orkestreres asynkront (mange kilder, lang kjøretid, retry) |

**Ingen av disse er nødvendig for Sprint 2–4.** D1 + Workers dekker Research Orchestrator, Analyst og Question Agent.

---

## Governance-notat

Syntetisk test-data ble **fjernet fra prod-D1** etter testen (10 102 selskaper slettet via D1 REST API, DB krympet 3.5 MB → 286 KB). Permanent skille innført i migrasjon 0006 (`is_synthetic`, `environment`, `created_by`), så testdata aldri kan blandes med ekte intelligence.
