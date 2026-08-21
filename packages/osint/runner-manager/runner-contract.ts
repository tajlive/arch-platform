// packages/osint/runner-manager/runner-contract.ts
// Runner interface - contract between the Arch control plane and external
// scan runners (SpiderFoot, Nuclei, custom). Runners are isolated external
// processes; the control plane never touches targets directly from frontend.
//
// KEY SAFETY PROPERTY: a runner receives ONLY the capabilities that passed
// server-side policy enforcement AND a signed approval grant (for active).
// It can never exceed that scope.

import type {
  Target,
  ScanProfile,
  Capability,
  ApprovalGrant,
  ScanJobId,
  Finding,
  Timestamp,
} from '../types/core';

// ──────────────────────────────────────────────────────────────
// Runner registration
// ──────────────────────────────────────────────────────────────

export type RunnerType = 'spiderfoot' | 'nuclei' | 'custom';

export interface RunnerConfig {
  runner_id: string;
  runner_type: RunnerType;
  version: string;
  capabilities: Capability[];
  // Internal endpoint - runners are never exposed to the public internet.
  endpoint: string;
  auth: {
    type: 'mtls' | 'token';
    credentials_ref: string; // BWS secret reference, never inline value
  };
  resource_limits: {
    max_cpu_cores: number;
    max_memory_mb: number;
    max_duration_seconds: number;
    max_concurrent_scans: number;
  };
  health_check: {
    endpoint: string;
    interval_seconds: number;
    timeout_seconds: number;
  };
}

// ──────────────────────────────────────────────────────────────
// Job dispatch (control plane → runner)
// ──────────────────────────────────────────────────────────────

export interface RunnerJobSpec {
  scan_job_id: ScanJobId;
  target: Target;
  profile?: ScanProfile; // present when the caller has profile context
  // The FINAL, policy-approved capability set. Runner executes exactly these.
  approved_capabilities: Capability[];
  approval_grant?: ApprovalGrant; // present iff any active capability approved
  correlation_id: string; // for distributed tracing
  timeout_seconds: number;
  priority: 'low' | 'normal' | 'high';
}

export interface RunnerJobRequest {
  job_id: ScanJobId;
  spec: RunnerJobSpec;
  // Callback endpoint on the control plane (internal).
  callback_url: string;
  // Short-lived JWT for authenticated callback - separate from scan secrets.
  callback_token: string;
}

export interface RunnerJobResponse {
  accepted: boolean;
  runner_job_id?: string;
  estimated_duration_seconds?: number;
  error?: string;
}

// ──────────────────────────────────────────────────────────────
// Callback (runner → control plane)
// ──────────────────────────────────────────────────────────────

export type RunnerJobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'timeout' | 'cancelled';

export interface RunnerJobStatusUpdate {
  scan_job_id: ScanJobId;
  runner_id: string;
  status: RunnerJobStatus;
  progress_percent?: number;
  message?: string;
  occurred_at: Timestamp;
}

export interface RunnerFindingBatch {
  scan_job_id: ScanJobId;
  runner_id: string;
  findings: RunnerFinding[];
  batch_seq: number; // for ordering/dedup on the control plane
  completed: boolean; // true = final batch for this job
  occurred_at: Timestamp;
}

/**
 * Raw finding as emitted by a runner - NOT yet normalized to the Arch
 * Finding schema. The control plane normalizes + redacts + classifies.
 */
export interface RunnerFinding {
  module: string; // e.g. sfp_dns, sfp_portscan
  type: string;   // runner-native event type
  data: Record<string, unknown>;
  timestamp: Timestamp;
}

// ──────────────────────────────────────────────────────────────
// Runner implementation contract
// ──────────────────────────────────────────────────────────────

/**
 * A RunnerAdapter is what actually executes a scan against a target using an
 * external tool (SpiderFoot, Nuclei). It MUST:
 *  - Execute ONLY the approved_capabilities (never more)
 *  - Respect the timeout
 *  - Report raw findings back (the control plane normalizes them)
 */
export interface RunnerAdapter {
  readonly runner_id: string;
  readonly runner_type: RunnerType;

  /** Execute the approved capabilities against the target. */
  run(request: RunnerJobRequest): Promise<RunnerJobResponse>;

  /** Poll or stream findings. */
  collectFindings(jobId: string): Promise<RunnerFinding[]>;

  /** Cancel an in-flight job (e.g. approval revoked mid-scan). */
  cancel(jobId: string): Promise<void>;

  /** Health check - is the runner reachable and within limits? */
  healthCheck(): Promise<{ healthy: boolean; detail?: string }>;
}

// ──────────────────────────────────────────────────────────────
// SpiderFoot module mapping
// ──────────────────────────────────────────────────────────────

/**
 * Maps an Arch capability to the SpiderFoot module(s) that implement it.
 * This is the ONLY place SpiderFoot module selection happens - driven by the
 * policy-approved capability set, never by arbitrary user input.
 */
export const SPIDERFOOT_MODULE_MAP: Readonly<Record<Capability, ReadonlyArray<string>>> = {
  // Passive
  dns_lookup: ['sfp_dns'],
  whois_lookup: ['sfp_whois'],
  asn_lookup: ['sfp_asn'],
  certificate_transparency: ['sfp_ct'],
  ssl_certificate_analysis: ['sfp_ssl'],
  http_headers: ['sfp_web'],
  technology_fingerprint: ['sfp_web', 'sfp_server'],
  ip_reputation: ['sfp_iprep'],
  public_leak_search: ['sfp_pastebin', 'sfp_github', 'sfp_dorks'],
  brand_monitoring: ['sfp_brand'],
  change_detection: ['sfp_changes'],
  subdomain_enumeration_passive: ['sfp_dns', 'sfp_ct', 'sfp_virustotal'],
  dns_wildcard_check: ['sfp_dns'],
  // Active (only reachable after approval grant)
  dns_zone_transfer: ['sfp_dns'],
  dns_bruteforce: ['sfp_dns'],
  subdomain_enumeration_active: ['sfp_dns', 'sfp_permute'],
  http_crawl_authenticated: ['sfp_web', 'sfp_spider'],
  port_scan_tcp: ['sfp_portscan'],
  port_scan_udp: ['sfp_portscan'],
  vulnerability_scan_passive: ['sfp_vuln'],
  vulnerability_scan_active: ['sfp_vuln'],
  // Forbidden capabilities → NO modules (never executable)
  exploit_execution: [],
  privilege_escalation: [],
  lateral_movement: [],
  data_exfiltration: [],
  denial_of_service: [],
  social_engineering: [],
  // Unmapped passive capabilities (no SpiderFoot equivalent)
  smtp_enumeration: [],
  s3_bucket_enumeration: [],
  http_crawl_passive: [],
  credential_testing: [],
};

/**
 * Resolve which SpiderFoot modules to run for a policy-approved capability
 * set. Forbidden capabilities and capabilities with no mapping are dropped
 * (never silently converted to an unrelated module).
 */
export function resolveSpiderFootModules(approvedCapabilities: ReadonlyArray<Capability>): {
  modules: string[];
  dropped: Capability[];
} {
  const modules: string[] = [];
  const dropped: Capability[] = [];

  for (const cap of approvedCapabilities) {
    const mapped = SPIDERFOOT_MODULE_MAP[cap] ?? [];
    if (mapped.length === 0) {
      dropped.push(cap); // no SpiderFoot equivalent (or forbidden)
    } else {
      modules.push(...mapped);
    }
  }

  // Dedupe while preserving order
  return { modules: [...new Set(modules)], dropped };
}