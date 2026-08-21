-- 0007_analyst_feedback.sql — append-only feedback-logging for ArchAnalyst
-- Produktflyt-steg 7: brukere merker funn som korrekt/nyttig/irrelevant/mangler kontekst.
-- REGEL: append-only. Ingen UPDATE/DELETE. Ingen auto-læring fra enkelttilbakemeldinger.

CREATE TABLE IF NOT EXISTS analyst_feedback (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  org_number TEXT NOT NULL,
  focus_area TEXT NOT NULL,
  analyst_run_id TEXT,
  finding_type TEXT NOT NULL CHECK (finding_type IN ('strength', 'weakness', 'priority', 'unknown')),
  finding_index INTEGER NOT NULL,
  feedback TEXT NOT NULL CHECK (feedback IN ('correct', 'useful', 'irrelevant', 'missing_context')),
  comment TEXT
);

CREATE INDEX IF NOT EXISTS idx_analyst_feedback_org ON analyst_feedback (org_number, focus_area);
CREATE INDEX IF NOT EXISTS idx_analyst_feedback_type ON analyst_feedback (feedback);
