// packages/osint/types/core.ts
// Core type definitions for Arch OSINT capability
// TypeScript strict mode - no any, explicit return types

// ──────────────────────────────────────────────────────────────
// Branded primitive types
// ──────────────────────────────────────────────────────────────

type Brand<T, B> = T & { readonly __brand: B };

export type CustomerId = Brand<string, 'CustomerId'>;
export type TargetId = Brand<string, 'TargetId'>;
export type FindingId = Brand<string, 'FindingId'>;
export type ScanJobId = Brand<string, 'ScanJobId'>;
export type ApprovalId = Brand<string, 'ApprovalId'>;
export type ProfileId = Brand<string, 'ProfileId'>;
export type UserId = Brand<string, 'UserId'>;
export type Timestamp = Brand<string, 'Timestamp'>; // ISO 8601 UTC
export type Hash = Brand<string, 'Hash'>; // SHA-256 hex
export type LogId = Brand<string, 'LogId'>;

// Helper to create branded types
export function createCustomerId(id: string): CustomerId { return id as CustomerId; }
export function createTargetId(id: string): TargetId { return id as TargetId; }
export function createFindingId(id: string): FindingId { return id as FindingId; }
export function createScanJobId(id: string): ScanJobId { return id as ScanJobId; }
export function createApprovalId(id: string): ApprovalId { return id as ApprovalId; }
export function createProfileId(id: string): ProfileId { return id as ProfileId; }
export function createUserId(id: string): UserId { return id as UserId; }
export function createTimestamp(iso: string): Timestamp { return iso as Timestamp; }
export function createHash(hex: string): Hash { return hex as Hash; }
export function createLogId(id: string): LogId { return id as LogId; }
export function nowTimestamp(): Timestamp { return new Date().toISOString() as Timestamp; }

// ──────────────────────────────────────────────────────────────
// Target Classification
// ──────────────────────────────────────────────────────────────

export type TargetClass = 'owned' | 'authorized' | 'third_party_public';

export type EvidenceType = 
  | 'dns_txt' 
  | 'whois_match' 
  | 'ssl_cert' 
  | 'dns_cname' 
  | 'manual_declaration';

export interface TargetClassEvidence {
  type: EvidenceType;
  value: string;
  verified_at: Timestamp;
  verified_by: UserId;
}

export interface Target {
  target_id: TargetId;
  customer_id: CustomerId;
  target_class: TargetClass;
  identifier: string; // domain, IP, CIDR, ASN, brand name
  display_name: string;
  evidence: TargetClassEvidence[];
  metadata: Record<string, unknown>;
  created_at: Timestamp;
  created_by: UserId;
  updated_at: Timestamp;
  status: 'active' | 'archived' | 'pending_verification';
}

// ──────────────────────────────────────────────────────────────
// Operation Classes & Capabilities
// ──────────────────────────────────────────────────────────────

export type OperationClass = 'passive_allowed' | 'active_requires_approval' | 'forbidden';

export type Capability =
  | 'dns_lookup'
  | 'dns_zone_transfer'
  | 'dns_bruteforce'
  | 'subdomain_enumeration_passive'
  | 'subdomain_enumeration_active'
  | 'http_headers'
  | 'http_crawl_passive'
  | 'http_crawl_authenticated'
  | 'port_scan_tcp'
  | 'port_scan_udp'
  | 'ssl_certificate_analysis'
  | 'technology_fingerprint'
  | 'vulnerability_scan_passive'
  | 'vulnerability_scan_active'
  | 'credential_testing'
  | 'whois_lookup'
  | 'asn_lookup'
  | 'ip_reputation'
  | 'certificate_transparency'
  | 'public_leak_search'
  | 'brand_monitoring'
  | 'change_detection'
  | 'dns_wildcard_check'
  | 'smtp_enumeration'
  | 's3_bucket_enumeration'
  // Forbidden capabilities (never allowed on any target class)
  | 'exploit_execution'
  | 'privilege_escalation'
  | 'lateral_movement'
  | 'data_exfiltration'
  | 'denial_of_service'
  | 'social_engineering';

export interface CapabilityPolicy {
  capability: Capability;
  operation_class: OperationClass;
  description: string;
  risk_level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  traffic_signature: 'none' | 'minimal' | 'moderate' | 'high';
}

// ──────────────────────────────────────────────────────────────
// Scan Profiles
// ──────────────────────────────────────────────────────────────

export type ProfileType = 
  | 'owned_security_baseline'
  | 'authorized_security_assessment'
  | 'public_market_intelligence';

export interface ScanProfile {
  profile_id: ProfileId;
  profile_type: ProfileType;
  name: string;
  description: string;
  allowed_capabilities: Capability[];
  default_enabled: Capability[];
  requires_approval_for: Capability[];
  target_class_restrictions: TargetClass[];
  max_duration_minutes: number;
  max_concurrent_jobs: number;
  resource_limits: {
    max_cpu_cores: number;
    max_memory_mb: number;
    max_bandwidth_mbps: number;
  };
  created_at: Timestamp;
  updated_at: Timestamp;
  version: number;
}

// ──────────────────────────────────────────────────────────────
// Approval Workflow
// ──────────────────────────────────────────────────────────────

export interface ApprovalRequest {
  approval_id: ApprovalId;
  customer_id: CustomerId;
  target_id: TargetId;
  profile_id: ProfileId;
  requested_capabilities: Capability[];
  requested_by: UserId;
  justification: string;
  scope_document_ref?: string;
  time_window_start?: Timestamp;
  time_window_end?: Timestamp;
  contact_person?: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'revoked';
  decided_by?: UserId;
  decided_at?: Timestamp;
  decision_reason?: string;
  created_at: Timestamp;
  expires_at: Timestamp;
}

export interface ApprovalGrant {
  approval_id: ApprovalId;
  granted_capabilities: Capability[];
  constraints: {
    max_duration_minutes: number;
    allowed_time_windows?: Array<{ start: Timestamp; end: Timestamp }>;
    ip_allowlist?: string[];
    rate_limits?: Record<Capability, number>;
  };
  signed_by: UserId;
  signed_at: Timestamp;
  signature: string; // JWS
}

// ──────────────────────────────────────────────────────────────
// Findings Schema
// ──────────────────────────────────────────────────────────────

export type ObservationType = 
  | 'domain'
  | 'subdomain'
  | 'certificate'
  | 'dns_record'
  | 'ip'
  | 'asn'
  | 'tech_fingerprint'
  | 'public_exposure_signal'
  | 'brand_signal'
  | 'leak_indicator'
  | 'reputation_signal'
  | 'configuration_issue'
  | 'exposed_service'
  | 'outdated_technology'
  | 'missing_security_header'
  | 'information_disclosure'
  | 'cloud_storage_exposure'
  | 'email_exposure'
  | 'credential_leak';

export type VerificationState = 'observed' | 'inferred' | 'verified' | 'dismissed';
export type HumanReviewStatus = 'pending' | 'reviewed' | 'escalated' | 'closed';
export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type Confidence = 'low' | 'medium' | 'high';
export type RedactionLevel = 'none' | 'partial' | 'full';
export type RetentionClass = 'ephemeral' | 'standard' | 'extended' | 'legal_hold';
export type PolicyBasis = 'owned_baseline' | 'authorized_assessment' | 'public_market_intelligence' | 'manual_review';

export interface EvidenceRef {
  type: 'runner_output' | 'screenshot' | 'raw_http' | 'dns_response' | 'certificate' | 'whois';
  ref_id: string;
  hash: Hash;
  collected_at: Timestamp;
}

export interface Finding {
  finding_id: FindingId;
  customer_id: CustomerId;
  target_id: TargetId;
  target_class: TargetClass;
  source_system: string;
  source_module: string;
  observation_type: ObservationType;
  title: string;
  description: string;
  severity: Severity;
  confidence: Confidence;
  evidence_refs: EvidenceRef[];
  first_seen_at: Timestamp;
  last_seen_at: Timestamp;
  observed_at: Timestamp;
  verification_state: VerificationState;
  policy_basis: PolicyBasis;
  contains_personal_data: boolean;
  redaction_level: RedactionLevel;
  retention_class: RetentionClass;
  human_review_status: HumanReviewStatus;
  reviewed_by?: UserId;
  reviewed_at?: Timestamp;
  review_notes?: string;
  metadata: Record<string, unknown>;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// ──────────────────────────────────────────────────────────────
// Scan Job
// ──────────────────────────────────────────────────────────────

export type ScanJobStatus = 
  | 'queued'
  | 'validating'
  | 'pending_approval'
  | 'approved'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'partial';

export interface ScanJob {
  scan_job_id: ScanJobId;
  customer_id: CustomerId;
  target_id: TargetId;
  profile_id: ProfileId;
  approval_id?: ApprovalId;
  status: ScanJobStatus;
  runner_id?: string;
  started_at?: Timestamp;
  completed_at?: Timestamp;
  duration_ms?: number;
  findings_count: number;
  findings_by_severity: Record<Severity, number>;
  error_message?: string;
  resource_usage?: {
    cpu_seconds: number;
    memory_mb_peak: number;
    network_mb: number;
  };
  created_at: Timestamp;
  created_by: UserId;
  updated_at: Timestamp;
}

// ──────────────────────────────────────────────────────────────
// Audit Log
// ──────────────────────────────────────────────────────────────

export type AuditEventType = 
  | 'target_created'
  | 'target_class_changed'
  | 'target_archived'
  | 'profile_created'
  | 'profile_updated'
  | 'scan_job_created'
  | 'scan_job_approved'
  | 'scan_job_rejected'
  | 'scan_job_started'
  | 'scan_job_completed'
  | 'scan_job_cancelled'
  | 'approval_requested'
  | 'approval_granted'
  | 'approval_rejected'
  | 'approval_revoked'
  | 'findings_exported'
  | 'findings_redacted'
  | 'retention_applied'
  | 'policy_violation_attempted';

export interface AuditLogEntry {
  log_id: LogId;
  timestamp: Timestamp;
  event_type: AuditEventType;
  customer_id: CustomerId;
  actor_id: UserId;
  actor_type: 'user' | 'system' | 'runner';
  target_id?: TargetId;
  scan_job_id?: ScanJobId;
  approval_id?: ApprovalId;
  details: Record<string, unknown>;
  policy_decision?: {
    target_class: TargetClass;
    profile_type: string;
    requested_capabilities: Capability[];
    allowed: boolean;
    reason: string;
  };
  previous_hash: Hash;
  entry_hash: Hash;
}

// ──────────────────────────────────────────────────────────────
// Policy Decision
// ──────────────────────────────────────────────────────────────

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
  required_approvals: Capability[];
  granted_capabilities: Capability[];
  pending_approval_capabilities: Capability[];
  profile_type: string;
  target_class: TargetClass;
}