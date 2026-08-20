-- seed-fixtures.sql: test fixtures for cross-tenant security tests (no real customer data)
-- Tenant A, Tenant B; User A (A), User B (B), User C (A+B), User D (revoked from A)

INSERT INTO tenants (id, name, created_at, status) VALUES
  ('tenant-a', 'Tenant A (test)', '2026-08-20T00:00:00Z', 'ACTIVE'),
  ('tenant-b', 'Tenant B (test)', '2026-08-20T00:00:00Z', 'ACTIVE');

INSERT INTO identities (id, identity_provider, provider_subject, email, email_verified, created_at) VALUES
  ('id-a', 'test', 'user-a-subject', 'user-a@example.test', 0, '2026-08-20T00:00:00Z'),
  ('id-b', 'test', 'user-b-subject', 'user-b@example.test', 0, '2026-08-20T00:00:00Z'),
  ('id-c', 'test', 'user-c-subject', 'user-c@example.test', 0, '2026-08-20T00:00:00Z'),
  ('id-d', 'test', 'user-d-subject', 'user-d@example.test', 0, '2026-08-20T00:00:00Z');

INSERT INTO users (id, display_name, created_at) VALUES
  ('user-a', 'User A', '2026-08-20T00:00:00Z'),
  ('user-b', 'User B', '2026-08-20T00:00:00Z'),
  ('user-c', 'User C', '2026-08-20T00:00:00Z'),
  ('user-d', 'User D', '2026-08-20T00:00:00Z');

INSERT INTO user_identities (user_id, identity_id, is_primary, created_at) VALUES
  ('user-a', 'id-a', 1, '2026-08-20T00:00:00Z'),
  ('user-b', 'id-b', 1, '2026-08-20T00:00:00Z'),
  ('user-c', 'id-c', 1, '2026-08-20T00:00:00Z'),
  ('user-d', 'id-d', 1, '2026-08-20T00:00:00Z');

INSERT INTO tenant_memberships (id, user_id, tenant_id, role, joined_at, status) VALUES
  ('m-a', 'user-a', 'tenant-a', 'OWNER', '2026-08-20T00:00:00Z', 'ACTIVE'),
  ('m-b', 'user-b', 'tenant-b', 'OWNER', '2026-08-20T00:00:00Z', 'ACTIVE'),
  ('m-c1', 'user-c', 'tenant-a', 'MEMBER', '2026-08-20T00:00:00Z', 'ACTIVE'),
  ('m-c2', 'user-c', 'tenant-b', 'MEMBER', '2026-08-20T00:00:00Z', 'ACTIVE'),
  ('m-d', 'user-d', 'tenant-a', 'MEMBER', '2026-08-20T00:00:00Z', 'REVOKED');

INSERT INTO audit_sessions (id, scope, ownership_mode, tenant_id, user_id, status, free_boundary_reached, created_at, updated_at, expires_at) VALUES
  ('audit-a-1', 'FULL', 'AUTHENTICATED', 'tenant-a', 'user-a', 'ACTIVE', 0, '2026-08-20T00:00:00Z', '2026-08-20T00:00:00Z', '2027-08-20T00:00:00Z'),
  ('audit-b-1', 'FULL', 'AUTHENTICATED', 'tenant-b', 'user-b', 'ACTIVE', 0, '2026-08-20T00:00:00Z', '2026-08-20T00:00:00Z', '2027-08-20T00:00:00Z');
