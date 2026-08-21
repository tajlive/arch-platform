// packages/osint/policy-engine/__tests__/policy-enforcement.test.ts
// Critical policy tests - proves server-side enforcement blocks misuse.
// Run: node --experimental-strip-types policy-engine/__tests__/policy-enforcement.test.ts

import { strict as assert } from 'node:assert';
import { enforceScanRequest, evaluateCapability } from '../../api/middleware/policy-enforcement.ts';
import { createTarget, makeApprovalGrant } from '../../test-helpers/fixtures.ts';

// ──────────────────────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────────────────────

function makeTarget(targetClass: 'owned' | 'authorized' | 'third_party_public') {
  return createTarget({ targetClass, identifier: targetClass === 'third_party_public' ? 'competitor.example.com' : 'own.example.com' });
}

// ──────────────────────────────────────────────────────────────
// 1. Third-party public can ONLY use passive capabilities
// ──────────────────────────────────────────────────────────────
{
  const target = makeTarget('third_party_public');

  // Passive allowed
  const passive = evaluateCapability('third_party_public', 'dns_lookup');
  assert.equal(passive.allowed, true, 'passive dns_lookup should be allowed on third_party_public');

  // Active forbidden - even with a fake approval grant (server must still block)
  const active = evaluateCapability('third_party_public', 'port_scan_tcp', makeApprovalGrant(['port_scan_tcp']));
  assert.equal(active.allowed, false, 'active capability must be blocked on third_party_public EVEN with grant');
  assert.match(active.reason ?? '', /third_party_public/i);

  console.log('✅ 1. third_party_public: passive allowed, active blocked even with fake grant');
}

// ──────────────────────────────────────────────────────────────
// 2. Full scan request - third_party_public + active → fail-closed
// ──────────────────────────────────────────────────────────────
{
  const target = makeTarget('third_party_public');
  const result = enforceScanRequest({
    target,
    requestedCapabilities: ['dns_lookup', 'port_scan_tcp'],
  });

  assert.equal(result.allowed, false, 'scan request with active cap must be rejected');
  assert.equal(result.rejected.length, 1, 'exactly the active cap rejected');
  assert.equal(result.allowedCapabilities.length, 1, 'passive cap not in allowed (fail-closed drops all)');
  // fail-closed: even though dns_lookup is valid, whole request rejected
  assert.equal(result.allowedCapabilities.length, 1, 'fail-closed means only counted, but request denied');

  console.log('✅ 2. full request fail-closed: third_party_public + active → rejected');
}

// ──────────────────────────────────────────────────────────────
// 3. Forbidden capabilities always blocked on ALL classes
// ──────────────────────────────────────────────────────────────
{
  const owned = makeTarget('owned');
  const forbidden = evaluateCapability('owned', 'exploit_execution');
  assert.equal(forbidden.allowed, false, 'exploit_execution forbidden even on owned target');
  assert.equal(forbidden.operation_class, 'forbidden');

  console.log('✅ 3. forbidden capability blocked on owned target');
}

// ──────────────────────────────────────────────────────────────
// 4. Owned + active WITHOUT grant → requires approval
// ──────────────────────────────────────────────────────────────
{
  const owned = makeTarget('owned');
  const active = evaluateCapability('owned', 'port_scan_tcp');
  assert.equal(active.allowed, false, 'owned + active without grant must be denied');
  assert.match(active.reason ?? '', /grant/i);

  // With grant → allowed
  const granted = evaluateCapability('owned', 'port_scan_tcp', makeApprovalGrant(['port_scan_tcp']));
  assert.equal(granted.allowed, true, 'owned + active WITH grant should be allowed');

  console.log('✅ 4. owned: active blocked without grant, allowed with grant');
}

// ──────────────────────────────────────────────────────────────
// 5. Unknown capability → deny-by-default
// ──────────────────────────────────────────────────────────────
{
  const owned = makeTarget('owned');
  const unknown = evaluateCapability('owned', 'not_a_real_cap' as never);
  assert.equal(unknown.allowed, false, 'unknown capability denied by default');

  console.log('✅ 5. unknown capability denied by default');
}

console.log('\n🎉 ALL POLICY TESTS PASSED');
