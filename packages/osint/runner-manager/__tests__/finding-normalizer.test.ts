// packages/osint/runner-manager/__tests__/finding-normalizer.test.ts
// Finding normalizer tests - proves severity/redaction/retention decisions,
// personal-data detection, verification-state safety, and dropped events.
// Run: npx tsx runner-manager/__tests__/finding-normalizer.test.ts

import { strict as assert } from 'node:assert';
import { normalizeFindings } from '../finding-normalizer.ts';
import type { RunnerFinding } from '../runner-contract.ts';
import { createTimestamp } from '../../types/core.ts';

const T = '2026-08-21T00:00:00.000Z';

function raw(overrides: Partial<RunnerFinding> = {}): RunnerFinding {
  return {
    module: 'sfp_dns',
    type: 'RAW_DNS_DATA',
    data: { host: 'example.com' },
    timestamp: createTimestamp(T),
    ...overrides,
  };
}

const input = {
  customerId: 'customer-1',
  targetId: 'target-1',
  targetClass: 'owned' as const,
  scanJobId: 'job-1',
  sourceSystem: 'spiderfoot',
  policyBasis: 'owned_baseline' as const,
};

// ──────────────────────────────────────────────────────────────
// 1. A valid raw finding normalizes to a canonical Finding (1:1)
// ──────────────────────────────────────────────────────────────
{
  const { findings, dropped } = normalizeFindings(input, [raw()]);
  assert.equal(findings.length, 1, 'one raw event → one finding');
  assert.equal(dropped, 0, 'no drops');
  const f = findings[0];
  assert.equal(f.source_system, 'spiderfoot');
  assert.equal(f.source_module, 'sfp_dns');
  assert.equal(f.verification_state, 'observed', 'never auto-verified');
  assert.equal(f.human_review_status, 'closed', 'info severity → closed');
  assert.equal(f.contains_personal_data, false);
  assert.equal(f.redaction_level, 'none');
  console.log('✅ 1. valid raw finding → canonical Finding (1:1, observed)');
}

// ──────────────────────────────────────────────────────────────
// 2. Empty / no-signal events are dropped, never fabricated
// ──────────────────────────────────────────────────────────────
{
  const { findings, dropped } = normalizeFindings(input, [
    raw(),
    raw({ module: 'sfp_dns', type: 'EMPTY', data: {} }),
  ]);
  assert.equal(findings.length, 1, 'empty event produces no finding');
  assert.equal(dropped, 1, 'empty event counted as dropped');
  console.log('✅ 2. empty events dropped, never fabricated');
}

// ──────────────────────────────────────────────────────────────
// 3. Medium+ severity → forced to human review
// ──────────────────────────────────────────────────────────────
{
  const { findings } = normalizeFindings(input, [raw({ module: 'sfp_vuln', type: 'VULNERABILITY' })]);
  const f = findings[0];
  assert.equal(f.severity, 'medium', 'vuln module → medium baseline');
  assert.equal(f.human_review_status, 'pending', 'medium+ → human review pending');
  console.log('✅ 3. medium+ severity forced to human review');
}

// ──────────────────────────────────────────────────────────────
// 4. Critical exploit event type → critical severity + review
// ──────────────────────────────────────────────────────────────
{
  const { findings } = normalizeFindings(input, [raw({ module: 'sfp_vuln', type: 'EXPLOIT_PRESENT' })]);
  const f = findings[0];
  assert.equal(f.severity, 'critical', 'explicit exploit event → critical');
  assert.equal(f.human_review_status, 'pending', 'critical → review');
  console.log('✅ 4. explicit exploit event → critical + review');
}

// ──────────────────────────────────────────────────────────────
// 5. Personal data detected → full redaction + extended retention
// ──────────────────────────────────────────────────────────────
{
  const { findings } = normalizeFindings(input, [
    raw({ module: 'sfp_pastebin', type: 'LEAK', data: { email: 'x@example.com' } }),
  ]);
  const f = findings[0];
  assert.equal(f.contains_personal_data, true, 'email key detected');
  assert.equal(f.redaction_level, 'full', 'personal data → full redaction');
  assert.equal(f.retention_class, 'extended', 'personal data → extended retention');
  assert.equal(f.human_review_status, 'pending', 'personal data → human review');
  assert.equal(f.confidence, 'high', 'personal data → high confidence');
  console.log('✅ 5. personal data → full redaction + extended retention + review');
}

// ──────────────────────────────────────────────────────────────
// 6. Password-like value pattern in data triggers personal-data flag
// ──────────────────────────────────────────────────────────────
{
  const { findings } = normalizeFindings(input, [
    raw({ module: 'sfp_github', type: 'LEAK', data: { path: 'config.php', data: 'DB_PASSWORD=supersecret' } }),
  ]);
  assert.equal(findings[0].contains_personal_data, true, 'password value pattern flagged');
  assert.equal(findings[0].redaction_level, 'full');
  console.log('✅ 6. password-like value → personal-data flag + full redaction');
}

// ──────────────────────────────────────────────────────────────
// 7. Description is product-safe (never claims confirmation)
// ──────────────────────────────────────────────────────────────
{
  const { findings } = normalizeFindings(input, [raw({ module: 'sfp_portscan', type: 'OPEN_PORT', data: { host: '10.0.0.1' } })]);
  const desc = findings[0].description;
  assert.match(desc, /Observed/, 'uses observed-signal wording');
  assert.doesNotMatch(desc, /confirmed|exploit/i, 'never claims confirmation');
  console.log('✅ 7. description is product-safe, no false confirmation');
}

console.log('\n🎉 ALL FINDING NORMALIZER TESTS PASSED');
