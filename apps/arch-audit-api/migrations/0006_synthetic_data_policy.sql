-- 0006_synthetic_data_policy.sql — Synthetic Data Policy (Tom 2026-08-20)
-- Skiller syntetisk testdata fra ekte intelligence permanent.
-- Regler:
--   is_synthetic = 1  →  aldri blandet med ekte data
--   environment: 'production' | 'test' | 'staging'
--   created_by: eier (agent, test, system)

ALTER TABLE companies ADD COLUMN is_synthetic INTEGER NOT NULL DEFAULT 0;
ALTER TABLE companies ADD COLUMN environment TEXT NOT NULL DEFAULT 'production';
ALTER TABLE companies ADD COLUMN created_by TEXT;

ALTER TABLE evidence_nodes ADD COLUMN is_synthetic INTEGER NOT NULL DEFAULT 0;
ALTER TABLE evidence_nodes ADD COLUMN environment TEXT NOT NULL DEFAULT 'production';

CREATE INDEX idx_companies_synthetic ON companies(is_synthetic);
CREATE INDEX idx_nodes_synthetic ON evidence_nodes(is_synthetic);
