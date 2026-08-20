-- 0005_evidence_graph.sql — Evidence Graph foundation (Fase 0)
-- Tom-godkjent 2026-08-20. ADDITIV: berører ingen eksisterende tabeller.
--
-- Kjerne: relasjoner mellom fakta, kilder, hypoteser og spørsmål — ikke flat liste.
-- Regler:
--   Evidence → Hypothesis → Question (aldri AI → Recommendation)
--   10 node-typer, 7 edge-relasjoner, join-tabell hypothesis_evidence
--   tenant_id nullable (PUBLIC = NULL, CUSTOMER = kunde-id senere)

-- ── 5.1 companies — root-node ────────────────────────────────
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  org_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  industry_code TEXT,
  industry_name TEXT,
  tenant_id TEXT,                        -- NULL = public data
  created_at TEXT NOT NULL
);
CREATE INDEX idx_companies_tenant ON companies(tenant_id);

-- ── 5.2 evidence_nodes — HJERTET. Én rad = én observasjon + kilde ──
CREATE TABLE evidence_nodes (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  type TEXT NOT NULL CHECK (type IN (
    'COMPANY','PERSON','FINANCIAL_EVENT','DIGITAL_SIGNAL',
    'MARKET_SIGNAL','WORKFORCE_SIGNAL','INDUSTRY_CONTEXT','EVIDENCE',
    'HYPOTHESIS','QUESTION'
  )),
  value TEXT NOT NULL,                   -- observasjonen (f.eks. "Operating margin decreased")
  source TEXT NOT NULL,                  -- kilde (f.eks. "brreg-regnskap 2025")
  confidence TEXT NOT NULL CHECK (confidence IN ('LOW','MEDIUM','HIGH','VERIFIED')),
  freshness TEXT,                        -- Evidence Quality: "2025" (år) eller dato
  verified INTEGER NOT NULL DEFAULT 0,   -- Evidence Quality: 0/1
  observed_at TEXT NOT NULL,
  metadata_json TEXT,                    -- ekstra felter (metric, period, role_type, url, ...)
  tenant_id TEXT                         -- NULL = public data
);
CREATE INDEX idx_en_company ON evidence_nodes(company_id);
CREATE INDEX idx_en_type ON evidence_nodes(type);
CREATE INDEX idx_en_tenant ON evidence_nodes(tenant_id);

-- ── 5.3 evidence_edges — relasjoner ─────────────────────────
CREATE TABLE evidence_edges (
  id TEXT PRIMARY KEY,
  from_node TEXT NOT NULL REFERENCES evidence_nodes(id),
  to_node TEXT NOT NULL REFERENCES evidence_nodes(id),
  relationship TEXT NOT NULL CHECK (relationship IN (
    'BELONGS_TO','HAS_FINANCIAL','HAS_SIGNAL','EVIDENCED_BY',
    'SUPPORTS','GENERATES','ANSWERS'
  )),
  confidence TEXT NOT NULL CHECK (confidence IN ('LOW','MEDIUM','HIGH','VERIFIED')),
  created_at TEXT NOT NULL
);
CREATE INDEX idx_ee_from ON evidence_edges(from_node);
CREATE INDEX idx_ee_to ON evidence_edges(to_node);
CREATE INDEX idx_ee_rel ON evidence_edges(relationship);

-- ── 5.4 hypothesis_evidence — JOIN-tabell (ikke JSON-array) ──
-- Muliggjør toveis søk: "finn alle hypoteser støttet av denne typen evidence".
CREATE TABLE hypothesis_evidence (
  id TEXT PRIMARY KEY,
  hypothesis_id TEXT NOT NULL REFERENCES evidence_nodes(id),
  evidence_id TEXT NOT NULL REFERENCES evidence_nodes(id),
  relationship_type TEXT NOT NULL DEFAULT 'SUPPORTS',
  confidence TEXT NOT NULL CHECK (confidence IN ('LOW','MEDIUM','HIGH','VERIFIED')),
  created_at TEXT NOT NULL
);
CREATE INDEX idx_he_hypothesis ON hypothesis_evidence(hypothesis_id);
CREATE INDEX idx_he_evidence ON hypothesis_evidence(evidence_id);

-- ── 5.5 questions — manglende kunnskap ──────────────────────
-- hypothesis_id IKKE null for AI-genererte spørsmål (håndheves i kode).
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  hypothesis_id TEXT REFERENCES evidence_nodes(id),  -- null = fritt spørsmål (menneske)
  question TEXT NOT NULL,
  information_gain INTEGER NOT NULL DEFAULT 0,       -- 0-100
  answered INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_q_hypothesis ON questions(hypothesis_id);
