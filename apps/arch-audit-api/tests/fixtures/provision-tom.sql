-- provision-tom.sql: provisioner Tom (tomarnejensen@gmail.com) som første identity via onetimepin.
-- onetimepin gir ingen user_uuid → provider_subject = 'onetimepin:{normalisert epost}'.
-- Test-identity, IKKE ekte kundedata.

-- Tenant for Tom (Arch-eier)
INSERT INTO tenants (id, name, created_at, status) VALUES
  ('tenant-tom', 'Tom (Arch owner, test)', '2026-08-20T00:00:00Z', 'ACTIVE');

-- Identity (onetimepin)
INSERT INTO identities (id, identity_provider, provider_subject, email, email_verified, created_at) VALUES
  ('id-tom', 'onetimepin', 'onetimepin:tomarnejensen@gmail.com', 'tomarnejensen@gmail.com', 0, '2026-08-20T00:00:00Z');

-- User
INSERT INTO users (id, display_name, created_at) VALUES
  ('user-tom', 'Tom Arne Jensen', '2026-08-20T00:00:00Z');

-- user_identity link
INSERT INTO user_identities (user_id, identity_id, is_primary, created_at) VALUES
  ('user-tom', 'id-tom', 1, '2026-08-20T00:00:00Z');

-- Membership: OWNER av tenant-tom
INSERT INTO tenant_memberships (id, user_id, tenant_id, role, joined_at, status) VALUES
  ('m-tom', 'user-tom', 'tenant-tom', 'OWNER', '2026-08-20T00:00:00Z', 'ACTIVE');
