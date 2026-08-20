-- 0002_futureproof_identities.sql — flere identities per user (før kundedata eksisterer)
-- Direktiv P1C §5: Identity(provider, provider_subject, email) → User.
-- En bruker kan senere ha: flere identities, endret email, flere memberships.
-- users.identity_id (1:1) erstattes av user_identities (many-to-many).
-- Alle identity-tabeller er tomme (0 rader) → ren DROP+CREATE er trygg.

-- 1. Ny join-tabell: user_identities (mange-til-mange)
CREATE TABLE user_identities (
  user_id TEXT NOT NULL REFERENCES users(id),
  identity_id TEXT NOT NULL REFERENCES identities(id),
  is_primary INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, identity_id)
);
CREATE INDEX idx_ui_identity ON user_identities(identity_id);

-- 2. Rebuild users UTEN identity_id (mange-til-mange via user_identities)
DROP TABLE users;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_login_at TEXT
);

-- 3. tenant_memberships.user_id → users(id) FK må re-deklareres (pekte på gammel users)
DROP TABLE tenant_memberships;

CREATE TABLE tenant_memberships (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  role TEXT NOT NULL,
  invited_by TEXT,
  invited_at TEXT,
  joined_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  UNIQUE(user_id, tenant_id)
);
