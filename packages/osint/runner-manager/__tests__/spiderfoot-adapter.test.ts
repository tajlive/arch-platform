// packages/osint/runner-manager/__tests__/spiderfoot-adapter.test.ts
// SpiderFoot adapter tests - proves module-only dispatch, health gating,
// and raw finding collection against an injected HTTP client (no live tool).
// Run: npx tsx runner-manager/__tests__/spiderfoot-adapter.test.ts

import { strict as assert } from 'node:assert';
import { SpiderFootAdapter, type HttpClient } from '../spiderfoot-adapter.ts';
import type { RunnerJobRequest } from '../runner-contract.ts';
import type { ScanJobId } from '../../types/core.ts';
import { createTarget } from '../../test-helpers/fixtures.ts';
import { createScanJobId } from '../../types/core.ts';

// ──────────────────────────────────────────────────────────────
// Fake HTTP client - records calls, returns scripted responses
// ──────────────────────────────────────────────────────────────
function makeHttp(overrides: Partial<Record<'create' | 'results' | 'ping', unknown>> = {}): HttpClient & {
  calls: Array<{ method: string; path: string }>;
} {
  const calls: Array<{ method: string; path: string }> = [];
  return {
    calls,
    async get(path: string) {
      calls.push({ method: 'GET', path });
      if (path === '/ping') {
        const healthy = overrides.ping !== false;
        return { ok: healthy, json: {} };
      }
      if (path === '/scan/results') {
        return { ok: true, json: overrides.results ?? { rows: [] } };
      }
      return { ok: false, json: {} };
    },
    async post(path: string) {
      calls.push({ method: 'POST', path });
      if (path === '/scan/create') {
        return { ok: true, json: overrides.create ?? { scanid: 'scan-1' } };
      }
      if (path === '/scan/stop') {
        return { ok: true, json: {} };
      }
      return { ok: false, json: { error: 'unknown' } };
    },
  };
}

function makeRequest(approvedCapabilities: string[]): RunnerJobRequest {
  const target = createTarget({ targetClass: 'owned', identifier: 'example.com' });
  const jobId = createScanJobId('job-1') as ScanJobId;
  return {
    job_id: jobId,
    spec: {
      scan_job_id: jobId,
      target,
      approved_capabilities: approvedCapabilities as never,
      correlation_id: 'corr-1',
      timeout_seconds: 600,
      priority: 'normal',
    },
    callback_url: '/internal/osint/webhooks/runner/status',
    callback_token: 'cb-test',
  };
}

function makeAdapter(http: HttpClient): SpiderFootAdapter {
  return new SpiderFootAdapter({
    runnerId: 'spiderfoot-prod',
    version: '4.x',
    baseUrl: 'http://spiderfoot-internal:5001',
    http,
    supportedCapabilities: ['dns_lookup', 'whois_lookup'],
  });
}

// ──────────────────────────────────────────────────────────────
// 1. run() dispatches ONLY the modules mapped from approved capabilities
// ──────────────────────────────────────────────────────────────
{
  const http = makeHttp();
  const adapter = makeAdapter(http);

  const res = await adapter.run(makeRequest(['dns_lookup', 'whois_lookup']));
  assert.equal(res.accepted, true, 'accepted');
  assert.equal(res.runner_job_id, 'scan-1', 'returns spiderfoot scan id');

  const createCall = http.calls.find(c => c.path === '/scan/create');
  assert.ok(createCall, 'scan/create was called');
  console.log('✅ 1. run() dispatches approved modules to SpiderFoot');
}

// ──────────────────────────────────────────────────────────────
// 2. run() drops forbidden/unmapped caps - never runs unrelated modules
// ──────────────────────────────────────────────────────────────
{
  const http = makeHttp();
  const adapter = makeAdapter(http);

  const res = await adapter.run(makeRequest(['exploit_execution', 'dns_lookup']));
  assert.equal(res.accepted, true, 'forbidden cap dropped, dns_lookup still runs');
  console.log('✅ 2. forbidden capabilities dropped, never executed');
}

// ──────────────────────────────────────────────────────────────
// 3. run() rejects when NO module is resolvable
// ──────────────────────────────────────────────────────────────
{
  const http = makeHttp();
  const adapter = makeAdapter(http);

  const res = await adapter.run(makeRequest(['exploit_execution', 'smtp_enumeration']));
  assert.equal(res.accepted, false, 'no resolvable modules → rejected');
  assert.ok(res.error, 'rejection carries an error');
  assert.equal(http.calls.some(c => c.path === '/scan/create'), false, 'no scan created');
  console.log('✅ 3. no resolvable modules → rejected, no scan created');
}

// ──────────────────────────────────────────────────────────────
// 4. collectFindings() returns raw runner findings (unnormalized)
// ──────────────────────────────────────────────────────────────
{
  const http = makeHttp({ results: { rows: [{ module: 'sfp_dns', type: 'RAW_DNS', data: { host: 'x' } }] } });
  const adapter = makeAdapter(http);

  const findings = await adapter.collectFindings('scan-1');
  assert.equal(findings.length, 1, 'one raw finding returned');
  assert.equal(findings[0].module, 'sfp_dns', 'module preserved');
  console.log('✅ 4. collectFindings() returns raw runner findings');
}

// ──────────────────────────────────────────────────────────────
// 5. healthCheck() passes when /ping is OK, fails otherwise
// ──────────────────────────────────────────────────────────────
{
  const healthyAdapter = makeAdapter(makeHttp({ ping: true }));
  assert.equal((await healthyAdapter.healthCheck()).healthy, true, 'healthy when /ping OK');

  const downAdapter = makeAdapter(makeHttp({ ping: false }));
  assert.equal((await downAdapter.healthCheck()).healthy, false, 'unhealthy when /ping fails');
  console.log('✅ 5. healthCheck() reflects /ping state');
}

console.log('\n🎉 ALL SPIDERFOOT ADAPTER TESTS PASSED');
