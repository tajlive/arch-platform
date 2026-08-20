-- 0001_init.sql — Arch Audit P1 foundation schema
-- Minimal: identity/security, public discovery, audit session, question decision.

-- ── Identity / Security ──────────────────────────────────────

CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE'  -- ACTIVE | SUSPENDED | DELETED
);

CREATE TABLE identities (
  id TEXT PRIMARY KEY,
  identity_provider TEXT NOT NULL,       -- cloudflare_access | google_workspace | entra_id | github | generic_oidc
  provider_subject TEXT NOT NULL,        -- sub fra IdP (unik per provider)
  email TEXT NOT NULL,                   -- IKKE canonical tenant-ID; initial resolution only
  email_verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  last_authenticated_at TEXT,
  UNIQUE(identity_provider, provider_subject)
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  identity_id TEXT NOT NULL REFERENCES identities(id),
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_login_at TEXT
);

CREATE TABLE tenant_memberships (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  role TEXT NOT NULL,                    -- OWNER | ADMIN | ANALYST | VIEWER | AUDITOR
  invited_by TEXT,
  invited_at TEXT,
  joined_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | INVITED | REVOKED
  UNIQUE(user_id, tenant_id)
);

-- ── Public Discovery ─────────────────────────────────────────

CREATE TABLE public_company_contexts (
  id TEXT PRIMARY KEY,
  org_number TEXT NOT NULL,
  company_name TEXT NOT NULL,
  industry_code TEXT,
  industry_name TEXT,
  context_json TEXT,                     -- full public context (provenance-preserving)
  confidence TEXT NOT NULL DEFAULT 'LOW',-- LOW | MEDIUM | HIGH | VERIFIED
  sources_json TEXT,                     -- [{source, fetched_at, data}]
  fetched_at TEXT NOT NULL,
  expires_at TEXT
);
CREATE INDEX idx_pcc_org ON public_company_contexts(org_number);

-- ── Audit Session ────────────────────────────────────────────

CREATE TABLE audit_sessions (
  id TEXT PRIMARY KEY,
  scope TEXT NOT NULL DEFAULT 'FREE',    -- FREE | SCAN | FULL | CONTINUOUS
  ownership_mode TEXT NOT NULL,          -- ANONYMOUS | AUTHENTICATED
  tenant_id TEXT,                        -- NULL når ANONYMOUS
  user_id TEXT,                          -- NULL når ANONYMOUS
  company_context_id TEXT REFERENCES public_company_contexts(id),
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | FREE_BOUNDARY | CONVERTED | COMPLETED | ABANDONED | EXPIRED
  free_boundary_reached INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX idx_as_tenant ON audit_sessions(tenant_id);
CREATE INDEX idx_as_status ON audit_sessions(status);

CREATE TABLE session_credentials (
  session_id TEXT PRIMARY KEY REFERENCES audit_sessions(id),
  credential_hash TEXT NOT NULL,         -- SHA-256(session credential) — session ID alene er IKKE autorisasjon
  created_at TEXT NOT NULL
);

-- ── Question Decision ────────────────────────────────────────

CREATE TABLE question_decisions (
  id TEXT PRIMARY KEY,
  audit_session_id TEXT NOT NULL REFERENCES audit_sessions(id),
  question TEXT NOT NULL,
  reason TEXT NOT NULL,
  target_unknown TEXT NOT NULL,
  expected_information_gain INTEGER NOT NULL DEFAULT 0,  -- 0-100
  required_for TEXT NOT NULL,           -- REDUCE_UNCERTAINTY | QUANTIFY_VALUE | IDENTIFY_PROCESS | IDENTIFY_SYSTEM | VERIFY_EVIDENCE | ASSESS_RISK | CHOOSE_TECHNOLOGY
  related_process TEXT,
  related_finding TEXT,
  asked_at TEXT NOT NULL,
  answered_at TEXT,
  answer_json TEXT
);
CREATE INDEX idx_qd_session ON question_decisions(audit_session_id);
