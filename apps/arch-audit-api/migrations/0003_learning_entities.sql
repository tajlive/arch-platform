-- 0003_learning_entities.sql — Learning Architecture foundation
-- LearningEvent + OutcomeMeasurement (evidence-based learning, ikke rå trening)

-- ── LearningEvent ────────────────────────────────────────────
CREATE TABLE learning_events (
  id TEXT PRIMARY KEY,
  tenant_id TEXT,                    -- null = anonym/aggregert
  type TEXT NOT NULL CHECK (type IN (
    'QUESTION_ANSWERED',
    'FINDING_CREATED',
    'RECOMMENDATION_ACCEPTED',
    'IMPLEMENTATION_STARTED',
    'OUTCOME_MEASURED'
  )),
  source TEXT NOT NULL,              -- pipeline-kilde (f.eks. 'audit', 'implementation')
  evidence_reference TEXT,           -- kobling tilbake til evidens (KREVET for læring)
  created_at TEXT NOT NULL
);
CREATE INDEX idx_learning_events_tenant ON learning_events(tenant_id);
CREATE INDEX idx_learning_events_type ON learning_events(type);

-- ── OutcomeMeasurement ───────────────────────────────────────
CREATE TABLE outcome_measurements (
  id TEXT PRIMARY KEY,
  finding_id TEXT NOT NULL,          -- FK → finding (senere tabell; TEXT nå)
  tenant_id TEXT NOT NULL,           -- tenant-scoped (Tenant Knowledge)
  expected_value REAL NOT NULL,      -- estimert verdi
  actual_value REAL NOT NULL,        -- faktisk verdi
  unit TEXT NOT NULL,                -- 'timer/mnd', 'kr/år'
  measurement_method TEXT NOT NULL,  -- 'kunde-rapportert' | 'system-metrisk'
  confidence TEXT NOT NULL CHECK (confidence IN ('LOW','MEDIUM','HIGH')),
  measured_at TEXT NOT NULL
);
CREATE INDEX idx_outcome_finding ON outcome_measurements(finding_id);
CREATE INDEX idx_outcome_tenant ON outcome_measurements(tenant_id);
