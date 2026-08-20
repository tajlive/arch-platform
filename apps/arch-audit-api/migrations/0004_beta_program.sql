-- 0004_beta_program.sql — Beta onboarding: beta_program + beta_feedback

-- ── beta_program ─────────────────────────────────────────────
-- Én rad per beta-tenant. Cohort-basert. Tenant-isolert via tenant_id.
CREATE TABLE beta_program (
  tenant_id TEXT PRIMARY KEY REFERENCES tenants(id),
  cohort TEXT NOT NULL,               -- 'BETA_001'
  status TEXT NOT NULL DEFAULT 'INVITED'
    CHECK (status IN ('INVITED','ACTIVE','COMPLETED')),
  started_at TEXT,
  completed_at TEXT,
  feedback_status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (feedback_status IN ('PENDING','RELEVANCE_COLLECTED','OUTCOME_COLLECTED','COMPLETE')),
  company_id TEXT,                    -- kobling til company entity
  created_at TEXT NOT NULL
);

-- ── beta_feedback ────────────────────────────────────────────
-- Kvalitativ feedback per finding (relevans + prioritet) + outcome.
CREATE TABLE beta_feedback (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  finding_id TEXT NOT NULL,
  relevance TEXT NOT NULL CHECK (relevance IN ('YES','NO','PARTIAL')),
  priority TEXT NOT NULL CHECK (priority IN ('NOW','LATER','NOT_RELEVANT')),
  comment TEXT,                       -- valgfri kvalitativ kommentar
  collected_at TEXT NOT NULL
);
CREATE INDEX idx_beta_feedback_tenant ON beta_feedback(tenant_id);
