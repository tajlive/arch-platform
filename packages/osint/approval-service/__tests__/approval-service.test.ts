// packages/osint/approval-service/__tests__/approval-service.test.ts
// Approval Service tests - proves signing, expiry, revocation, and that a
// grant can never grant forbidden capabilities for a target class.
// Run: npx tsx approval-service/__tests__/approval-service.test.ts

import { strict as assert } from 'node:assert';
import {
  ApprovalService,
  ApprovalError,
  addMs,
  isExpired,
} from '../approval-service.ts';
import type {
  ApprovalRequest,
  ApprovalGrant,
  Capability,
  Timestamp,
} from '../../types/core.ts';
import {
  createTarget,
  makeApprovalGrant,
} from '../../test-helpers/fixtures.ts';
import { createTimestamp } from '../../types/core.ts';

// ──────────────────────────────────────────────────────────────
// In-memory store (injectable deps)
// ──────────────────────────────────────────────────────────────

class MemStore {
  requests = new Map<string, ApprovalRequest>();
  grants = new Map<string, ApprovalGrant>();

  saveRequest = async (r: ApprovalRequest): Promise<ApprovalRequest> => { this.requests.set(r.approval_id, r); return r; };
  getRequest = async (id: string): Promise<ApprovalRequest | null> => this.requests.get(id) ?? null;
  updateRequest = async (r: ApprovalRequest): Promise<ApprovalRequest> => { this.requests.set(r.approval_id, r); return r; };
  saveGrant = async (g: ApprovalGrant): Promise<ApprovalGrant> => { this.grants.set(g.approval_id, g); return g; };
  getGrant = async (id: string): Promise<ApprovalGrant | null> => this.grants.get(id) ?? null;
}

function makeService(now?: Timestamp): { svc: ApprovalService; store: MemStore; clock: { value: Timestamp; set: (t: Timestamp) => void } } {
  const store = new MemStore();
  const clock = { value: now ?? createTimestamp('2026-08-21T00:00:00.000Z'), set: (t: Timestamp) => { clock.value = t; } };
  const svc = new ApprovalService({
    ...store,
    now: () => clock.value,
  });
  return { svc, store, clock };
}

// ──────────────────────────────────────────────────────────────
// 1. Create + approve → signed grant
// ──────────────────────────────────────────────────────────────
{
  const { svc, store } = makeService();
  const target = createTarget({ targetClass: 'owned', identifier: 'own.example.com' });

  const req = await svc.requestApproval({
    customerId: 'customer-1',
    targetId: 'target-1',
    target,
    profileId: 'owned_security_baseline',
    requestedCapabilities: ['port_scan_tcp'],
    requestedBy: 'user-1',
    justification: 'Authorized security assessment of own infrastructure',
  });
  assert.equal(req.status, 'pending');

  const grant = await svc.approve({
    approvalId: req.approval_id,
    target,
    approver: 'approver-1',
    grantedCapabilities: ['port_scan_tcp'],
  });
  assert.equal(grant.signature, `signed:${req.approval_id}:port_scan_tcp:owned`, 'signature ties grant to scope');
  assert.equal(store.requests.get(req.approval_id)?.status, 'approved');

  console.log('✅ 1. create + approve → signed grant, request marked approved');
}

// ──────────────────────────────────────────────────────────────
// 2. third_party_public: approve with active capability → REJECTED
// ──────────────────────────────────────────────────────────────
{
  const { svc } = makeService();
  const tp = createTarget({ targetClass: 'third_party_public', identifier: 'competitor.example.com' });

  const req = await svc.requestApproval({
    customerId: 'customer-1',
    targetId: 'target-2',
    target: tp,
    profileId: 'public_market_intelligence',
    requestedCapabilities: ['dns_lookup'],
    requestedBy: 'user-1',
    justification: 'passive market intel',
  });

  await assert.rejects(
    svc.approve({
      approvalId: req.approval_id,
      target: tp,
      approver: 'approver-1',
      grantedCapabilities: ['port_scan_tcp'], // active capability attempt
    }),
    (err: ApprovalError) => err.code === 'invalid_grant' && /third_party_public/.test(err.message),
    'granting active capability on third_party_public must be rejected'
  );

  console.log('✅ 2. third_party_public: active capability in grant → rejected by policy');
}

// ──────────────────────────────────────────────────────────────
// 3. Approve already-decided → rejected
// ──────────────────────────────────────────────────────────────
{
  const { svc } = makeService();
  const target = createTarget({ targetClass: 'owned', identifier: 'own.example.com' });

  const req = await svc.requestApproval({
    customerId: 'customer-1',
    targetId: 'target-1',
    target,
    profileId: 'owned_security_baseline',
    requestedCapabilities: ['port_scan_tcp'],
    requestedBy: 'user-1',
    justification: 'test',
  });

  await svc.reject({ approvalId: req.approval_id, approver: 'approver-1', reason: 'not needed' });

  await assert.rejects(
    svc.approve({ approvalId: req.approval_id, target, approver: 'approver-1', grantedCapabilities: ['port_scan_tcp'] }),
    (err: ApprovalError) => err.code === 'already_decided',
    'approving an already-rejected request must fail'
  );

  console.log('✅ 3. approve already-decided → rejected');
}

// ──────────────────────────────────────────────────────────────
// 4. Expiry: approval past expires_at is expired → approve fails
// ──────────────────────────────────────────────────────────────
{
  const { svc, clock } = makeService();
  const t0 = clock.value;
  const later = addMs(t0, 8 * 24 * 60 * 60 * 1000); // 8 days later (> 7 day default)
  const target = createTarget({ targetClass: 'owned', identifier: 'own.example.com' });

  const req = await svc.requestApproval({
    customerId: 'customer-1',
    targetId: 'target-1',
    target,
    profileId: 'owned_security_baseline',
    requestedCapabilities: ['port_scan_tcp'],
    requestedBy: 'user-1',
    justification: 'test',
  });

  assert.equal(isExpired(req, later), true, 'request should be expired by now');

  // Advance the clock past expiry, then approval must fail
  clock.set(later);
  await assert.rejects(
    svc.approve({ approvalId: req.approval_id, target, approver: 'approver-1', grantedCapabilities: ['port_scan_tcp'] }),
    (err: ApprovalError) => err.code === 'expired',
    'approving an expired request must fail'
  );

  console.log('✅ 4. expiry: approving an expired request → rejected');
}

// ──────────────────────────────────────────────────────────────
// 5. Revoke: only approved can be revoked; grant becomes invalid
// ──────────────────────────────────────────────────────────────
{
  const { svc, store } = makeService();
  const target = createTarget({ targetClass: 'owned', identifier: 'own.example.com' });

  const req = await svc.requestApproval({
    customerId: 'customer-1',
    targetId: 'target-1',
    target,
    profileId: 'owned_security_baseline',
    requestedCapabilities: ['port_scan_tcp'],
    requestedBy: 'user-1',
    justification: 'test',
  });

  await svc.approve({
    approvalId: req.approval_id,
    target,
    approver: 'approver-1',
    grantedCapabilities: ['port_scan_tcp'],
  });

  // Grant valid before revoke
  assert.equal(await svc.isGrantValid(req.approval_id), true, 'grant should be valid after approval');

  // Revoke
  await svc.revoke({ approvalId: req.approval_id, approver: 'approver-1', reason: 'scope changed' });
  assert.equal(store.requests.get(req.approval_id)?.status, 'revoked');

  // Grant now invalid → fail-closed for in-flight jobs
  assert.equal(await svc.isGrantValid(req.approval_id), false, 'grant must be invalid after revoke');

  // Cannot revoke a non-approved request
  await assert.rejects(
    svc.revoke({ approvalId: req.approval_id, approver: 'approver-1', reason: 'again' }),
    (err: ApprovalError) => err.code === 'invalid_status_transition',
    'revoking a revoked request must fail'
  );

  console.log('✅ 5. revoke: only approved revocable, grant invalid after revoke');
}

// ──────────────────────────────────────────────────────────────
// 6. Pure helpers
// ──────────────────────────────────────────────────────────────
{
  const t = createTimestamp('2026-08-21T00:00:00.000Z');
  assert.equal(addMs(t, 1000), '2026-08-21T00:00:01.000Z', 'addMs adds ms');
  console.log('✅ 6. addMs helper works');
}

console.log('\n🎉 ALL APPROVAL SERVICE TESTS PASSED');
