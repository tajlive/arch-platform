// packages/osint/runner-manager/finding-normalizer.ts
// Finding normalizer - converts raw RunnerFinding events into the canonical
// Arch Finding schema. This is the ONLY place runner-native output becomes an
// Arch finding, so all redaction + severity + retention decisions live here.
//
// SAFETY PROPERTY: a finding is NEVER auto-verified. Runner output is at most
// 'observed' (or 'inferred' for low-confidence signals); anything at
// medium+ severity goes to human review. We never present runner output as a
// confirmed exploit/vulnerability.

import type {
  Finding,
  FindingId,
  CustomerId,
  TargetId,
  TargetClass,
  Severity,
  Confidence,
  ObservationType,
  RedactionLevel,
  RetentionClass,
  VerificationState,
  HumanReviewStatus,
  PolicyBasis,
  Timestamp,
} from '../types/core';
import {
  createFindingId,
  createCustomerId,
  createTargetId,
  createTimestamp,
  nowTimestamp,
} from '../types/core';
import type { RunnerFinding } from './runner-contract';

// ──────────────────────────────────────────────────────────────
// Observation type mapping (module → canonical observation type)
// ──────────────────────────────────────────────────────────────

const OBSERVATION_TYPE_BY_MODULE: Readonly<Record<string, ObservationType>> = {
  sfp_dns: 'dns_record',
  sfp_whois: 'domain',
  sfp_asn: 'asn',
  sfp_ct: 'certificate',
  sfp_ssl: 'certificate',
  sfp_web: 'missing_security_header',
  sfp_server: 'tech_fingerprint',
  sfp_iprep: 'reputation_signal',
  sfp_pastebin: 'leak_indicator',
  sfp_github: 'leak_indicator',
  sfp_dorks: 'public_exposure_signal',
  sfp_brand: 'brand_signal',
  sfp_changes: 'configuration_issue',
  sfp_virustotal: 'reputation_signal',
  sfp_permute: 'subdomain',
  sfp_spider: 'exposed_service',
  sfp_portscan: 'exposed_service',
  sfp_vuln: 'outdated_technology',
  sfp_subdomains: 'subdomain',
};

const DEFAULT_OBSERVATION_TYPE: ObservationType = 'information_disclosure';

// ──────────────────────────────────────────────────────────────
// Severity mapping (module + native event type → severity)
// ──────────────────────────────────────────────────────────────

/**
 * Conservative default severity per module. These are STARTING points only:
 * a module firing does not confirm a vulnerability, it flags something the
 * control plane must inspect. Anything medium+ forces human review.
 */
const BASE_SEVERITY_BY_MODULE: Readonly<Record<string, Severity>> = {
  sfp_dns: 'info',
  sfp_whois: 'info',
  sfp_asn: 'info',
  sfp_ct: 'info',
  sfp_iprep: 'info',
  sfp_brand: 'info',
  sfp_changes: 'info',
  sfp_server: 'low',
  sfp_web: 'low',
  sfp_pastebin: 'medium',
  sfp_github: 'medium',
  sfp_dorks: 'medium',
  sfp_ssl: 'low',
  sfp_spider: 'low',
  sfp_portscan: 'low',
  sfp_vuln: 'medium',
  sfp_virustotal: 'info',
  sfp_permute: 'info',
  sfp_subdomains: 'info',
};

// Personal-data indicators seen in raw runner data. If any key is present
// (emails, phone numbers, government IDs, raw credentials), the finding is
// flagged and forced to full redaction + extended retention.
const PERSONAL_DATA_KEYS: ReadonlyArray<string> = [
  'email',
  'emails',
  'phone',
  'phone_number',
  'mobile',
  'ssn',
  'national_id',
  'passport',
  'credit_card',
  'card_number',
  'credentials',
  'password',
  'password_hash',
  'secret_key',
  'api_key',
];

const PERSONAL_DATA_VALUE_PATTERN = /(?:[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|(?:\+47|\+45|\+46|\+44)?[0-9]{8,12}|passw(?:or)?d|secret|token|api[-_]?key)/i;

// ──────────────────────────────────────────────────────────────
// Normalizer
// ──────────────────────────────────────────────────────────────

export interface NormalizeFindingsInput {
  customerId: string;
  targetId: string;
  targetClass: TargetClass;
  scanJobId: string;
  sourceSystem: string; // e.g. 'spiderfoot'
  policyBasis: PolicyBasis;
  /** Optional override for observed_at (defaults to now). Injectable clock for tests. */
  now?: () => Timestamp;
}

export interface NormalizeResult {
  findings: Finding[];
  /** Count of raw events that produced no finding (dropped/redacted at source). */
  dropped: number;
}

function isPersonalData(raw: Record<string, unknown>): boolean {
  if (PERSONAL_DATA_KEYS.some(k => k in raw)) return true;
  return Object.values(raw).some(v =>
    typeof v === 'string' && PERSONAL_DATA_VALUE_PATTERN.test(v)
  );
}

function severityFor(runner: RunnerFinding): Severity {
  // Direct event-type overrides take precedence (e.g. an explicit vuln report).
  const type = runner.type.toLowerCase();
  if (type.includes('critical') || type.includes('exploit') || type.includes('rce')) return 'critical';
  if (type.includes('vuln') || type.includes('exposed') || type.includes('leak')) return 'medium';
  return BASE_SEVERITY_BY_MODULE[runner.module] ?? 'info';
}

function observationTypeFor(module: string, type: string): ObservationType {
  const mapped = OBSERVATION_TYPE_BY_MODULE[module];
  if (mapped) return mapped;
  // Fall back to type-name heuristics for unmapped modules.
  if (/certificate|ssl/i.test(type)) return 'certificate';
  if (/subdomain/i.test(type)) return 'subdomain';
  if (/email/i.test(type)) return 'email_exposure';
  if (/cloud|s3|bucket/i.test(type)) return 'cloud_storage_exposure';
  return DEFAULT_OBSERVATION_TYPE;
}

function redactionAndRetention(
  personal: boolean
): { redaction_level: RedactionLevel; retention_class: RetentionClass; contains_personal_data: boolean } {
  if (personal) {
    return {
      redaction_level: 'full',
      retention_class: 'extended',
      contains_personal_data: true,
    };
  }
  return {
    redaction_level: 'none',
    retention_class: 'standard',
    contains_personal_data: false,
  };
}

/**
 * Normalize a batch of raw runner findings into canonical Arch findings.
 * A single raw event becomes a single finding (1:1). No aggregation, no
 * auto-verification, no fabrication of evidence we did not observe.
 */
export function normalizeFindings(input: NormalizeFindingsInput, raw: RunnerFinding[]): NormalizeResult {
  const observedAt: Timestamp = input.now ? input.now() : nowTimestamp();
  const customerId: CustomerId = createCustomerId(input.customerId);
  const targetId: TargetId = createTargetId(input.targetId);

  const findings: Finding[] = [];
  let dropped = 0;

  for (const runner of raw) {
    // Ignore empty/no-signal events and runner-internal events.
    if (!runner.data || Object.keys(runner.data).length === 0) {
      dropped += 1;
      continue;
    }

    const personal = isPersonalData(runner.data);
    const severity = severityFor(runner);
    const { redaction_level, retention_class, contains_personal_data } =
      redactionAndRetention(personal);

    // Verification + human-review policy:
    //  - always 'observed' (never 'verified' — verification is a separate step)
    //  - medium+ or personal-data findings MUST go to human review
    const verification_state: VerificationState = 'observed';
    const human_review_status: HumanReviewStatus =
      severity === 'medium' || severity === 'high' || severity === 'critical' || contains_personal_data
        ? 'pending'
        : 'closed';
    const confidence: Confidence = personal ? 'high' : 'medium';

    findings.push({
      finding_id: createFindingId(crypto.randomUUID()),
      customer_id: customerId,
      target_id: targetId,
      target_class: input.targetClass,
      source_system: input.sourceSystem,
      source_module: runner.module,
      observation_type: observationTypeFor(runner.module, runner.type),
      title: `${runner.module}: ${runner.type}`,
      description: describeFinding(runner),
      severity,
      confidence,
      evidence_refs: [],
      first_seen_at: runner.timestamp,
      last_seen_at: runner.timestamp,
      observed_at: observedAt,
      verification_state,
      policy_basis: input.policyBasis,
      contains_personal_data,
      redaction_level,
      retention_class,
      human_review_status,
      metadata: { raw_type: runner.type, batch: true },
      created_at: observedAt,
      updated_at: observedAt,
    });
  }

  return { findings, dropped };
}

/**
 * Build a human-readable, product-safe description from the raw runner data.
 * Uses ONLY observed signal wording — never claims an exploit is confirmed.
 */
function describeFinding(runner: RunnerFinding): string {
  const data = runner.data;
  const host = typeof data['host'] === 'string' ? data['host'] : undefined;
  const value = typeof data['data'] === 'string' ? data['data'] : undefined;

  const parts: string[] = [`Observed ${runner.type} signal from ${runner.module}.`];
  if (host) parts.push(`Related host: ${host}.`);
  if (value && value.length < 160) parts.push(`Value: ${value}.`);
  parts.push('Unverified — requires review before any conclusion.');
  return parts.join(' ');
}
