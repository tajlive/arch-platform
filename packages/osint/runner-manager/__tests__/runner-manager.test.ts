// packages/osint/runner-manager/__tests__/runner-manager.test.ts
// Runner Manager tests - proves pre-dispatch re-validation, approval-revoked
// cancellation, and SpiderFoot module resolution.
// Run: npx tsx runner-manager/__tests__/runner-manager.test.ts

import { strict as assert } from 'node:assert';
import { RunnerManager, RunnerError } from '../runner-manager.ts';
import type { RunnerAdapter, RunnerJobRequest, RunnerFinding } from '../runner-contract.ts';
import { resolveSpiderFootModules } from '../runner-contract.ts';
import { createTarget, makeApprovalGrant } from '../../test-helpers/fixtures.ts';
import type { ApprovalGrant, Capability, ScanJobId } from '../../types/core.ts';
import { createScanJobId } from '../../types/core.ts';

// ──────────────────────────────────────────────────────────────
// Fake runner (records what it received)
// ──────────────────────────────────────────────────────────────

class FakeRunner implements RunnerAdapter {
  readonly runner_id = 'spiderfoot-test';
  readonly runner_type = 'spiderfoot' as const;
  received: RunnerJobRequest[] = [];
  cancelled: string[] = [];
  healthy = true;
  accept = true;

  async run(request: RunnerJobRequest): Promise<{ accepted: boolean; runner_job_id?: string; error?: string }> {
    this.received.push(request);
    if (!this.accept) return { accepted: false, error: 'test-rejected' };
    return { accepted: true, runner_job_id: `runner-job-${request.spec.scan_job_id}` };
  }
  async collectFindings(_jobId: string): Promise<RunnerFinding[]> { return []; }
  async cancel(jobId: string): Promise<void> { this.cancelled.push(jobId); }
  async healthCheck(): Promise<{ healthy: boolean; detail?: string }> {
    return { healthy: this.healthy, detail: this.healthy ? undefined : 'unhealthy' };
  }
}

function makeManager(runner: FakeRunner, approvalValid = true): RunnerManager {
  return new RunnerManager({
    getRunner: (id) => (id === runner.runner_id ? runner : undefined),
    updateJobStatus: async () => {},
    saveFindingsBatch: async () => {},
    isApprovalStillValid: async () => approvalValid,
  });
}

// ──────────────────────────────────────────────────────────────
// 1. SpiderFoot module resolution: passive caps → passive modules
// ──────────────────────────────────────────────────────────────
{
  const { modules, dropped } = resolveSpiderFootModules(['dns_lookup', 'whois_lookup', 'certificate_transparency']);
  assert.deepEqual(modules, ['sfp_dns', 'sfp_whois', 'sfp_ct'], 'passive caps resolve to passive modules');
  assert.deepEqual(dropped, [], 'no drops for mapped passive caps');
  console.log('✅ 1. module resolution: passive caps → passive modules');
}

// ──────────────────────────────────────────────────────────────
// 2. Module resolution: forbidden capabilities → dropped, never mapped
// ──────────────────────────────────────────────────────────────
{
  const { modules, dropped } = resolveSpiderFootModules(['exploit_execution', 'denial_of_service', 'dns_lookup']);
  assert.deepEqual(modules, ['sfp_dns'], 'forbidden caps never resolve to modules');
  assert.deepEqual(dropped, ['exploit_execution', 'denial_of_service'], 'forbidden caps dropped explicitly');
  console.log('✅ 2. forbidden capabilities dropped from module resolution');
}

// ──────────────────────────────────────────────────────────────
// 3. Dispatch: third_party_public + active → policy violation, no runner call
// ──────────────────────────────────────────────────────────────
{
  const runner = new FakeRunner();
  const mgr = makeManager(runner);
  const tp = createTarget({ targetClass: 'third_party_public', identifier: 'competitor.example.com' });

  await assert.rejects(
    mgr.dispatch('spiderfoot-test', {
      target: tp,
      requestedCapabilities: ['port_scan_tcp'],
    }),
    (err: RunnerError) => err.code === 'policy_violation',
    'dispatch with active cap on third_party_public must be rejected'
  );

  assert.equal(runner.received.length, 0, 'runner must never be called for a rejected job');
  console.log('✅ 3. third_party_public + active: rejected BEFORE runner call');
}

// ──────────────────────────────────────────────────────────────
// 4. Dispatch: owned + active + VALID grant → accepted, runner gets ONLY approved caps
// ──────────────────────────────────────────────────────────────
{
  const runner = new FakeRunner();
  const mgr = makeManager(runner);
  const owned = createTarget({ targetClass: 'owned', identifier: 'own.example.com' });
  const grant: ApprovalGrant = makeApprovalGrant(['port_scan_tcp']);

  const result = await mgr.dispatch('spiderfoot-test', {
    target: owned,
    requestedCapabilities: ['port_scan_tcp', 'dns_lookup'],
    approvalGrant: grant,
  });

  assert.equal(result.accepted, true, 'dispatch accepted');
  assert.equal(runner.received.length, 1, 'runner called once');
  const spec = runner.received[0]?.spec;
  assert.deepEqual(spec?.approved_capabilities, ['port_scan_tcp', 'dns_lookup'], 'runner receives approved caps');
  assert.equal(spec?.approval_grant?.approval_id, grant.approval_id, 'grant attached');
  console.log('✅ 4. owned + active + valid grant → dispatched with approved caps');
}

// ──────────────────────────────────────────────────────────────
// 5. Dispatch: approval REVOKED mid-flight → cancelled before runner call
// ──────────────────────────────────────────────────────────────
{
  const runner = new FakeRunner();
  const mgr = makeManager(runner, false); // approval now invalid
  const owned = createTarget({ targetClass: 'owned', identifier: 'own.example.com' });

  await assert.rejects(
    mgr.dispatch('spiderfoot-test', {
      target: owned,
      requestedCapabilities: ['port_scan_tcp'],
      approvalGrant: makeApprovalGrant(['port_scan_tcp']),
    }),
    (err: RunnerError) => err.code === 'approval_revoked',
    'revoked approval must stop dispatch'
  );

  assert.equal(runner.received.length, 0, 'runner never called with revoked approval');
  console.log('✅ 5. revoked approval → job blocked before runner call');
}

// ──────────────────────────────────────────────────────────────
// 6. Unhealthy runner → rejected
// ──────────────────────────────────────────────────────────────
{
  const runner = new FakeRunner();
  runner.healthy = false;
  const mgr = makeManager(runner);
  const owned = createTarget({ targetClass: 'owned', identifier: 'own.example.com' });

  await assert.rejects(
    mgr.dispatch('spiderfoot-test', {
      target: owned,
      requestedCapabilities: ['dns_lookup'],
    }),
    (err: RunnerError) => err.code === 'runner_unhealthy',
    'unhealthy runner must be rejected'
  );
  assert.equal(runner.received.length, 0);
  console.log('✅ 6. unhealthy runner → rejected before dispatch');
}

// ──────────────────────────────────────────────────────────────
// 7. Runner rejects job → RunnerError
// ──────────────────────────────────────────────────────────────
{
  const runner = new FakeRunner();
  runner.accept = false;
  const mgr = makeManager(runner);
  const owned = createTarget({ targetClass: 'owned', identifier: 'own.example.com' });

  await assert.rejects(
    mgr.dispatch('spiderfoot-test', {
      target: owned,
      requestedCapabilities: ['dns_lookup'],
    }),
    (err: RunnerError) => err.code === 'runner_rejected',
    'runner rejection surfaces as RunnerError'
  );
  console.log('✅ 7. runner rejection → RunnerError');
}

console.log('\n🎉 ALL RUNNER MANAGER TESTS PASSED');
