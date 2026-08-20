// types.ts — canonical types for Arch Audit API (P1 foundation)

export type AuditScope = "FREE" | "SCAN" | "FULL" | "CONTINUOUS";

export type AuditOwnershipMode = "ANONYMOUS" | "AUTHENTICATED";

export type AuditSessionStatus =
  | "ACTIVE"
  | "FREE_BOUNDARY"
  | "CONVERTED"
  | "COMPLETED"
  | "ABANDONED"
  | "EXPIRED";

export type QuestionPurpose =
  | "REDUCE_UNCERTAINTY"
  | "QUANTIFY_VALUE"
  | "IDENTIFY_PROCESS"
  | "IDENTIFY_SYSTEM"
  | "VERIFY_EVIDENCE"
  | "ASSESS_RISK"
  | "CHOOSE_TECHNOLOGY";

export type Confidence = "LOW" | "MEDIUM" | "HIGH" | "VERIFIED";

export interface AuditSessionRow {
  id: string;
  scope: AuditScope;
  ownership_mode: AuditOwnershipMode;
  tenant_id: string | null;
  user_id: string | null;
  company_context_id: string | null;
  status: AuditSessionStatus;
  free_boundary_reached: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface PublicCompanyContextRow {
  id: string;
  org_number: string;
  company_name: string;
  industry_code: string | null;
  industry_name: string | null;
  context_json: string | null;
  confidence: Confidence;
  sources_json: string | null;
  fetched_at: string;
  expires_at: string | null;
}

export interface QuestionDecisionRow {
  id: string;
  audit_session_id: string;
  question: string;
  reason: string;
  target_unknown: string;
  expected_information_gain: number;
  required_for: QuestionPurpose;
  related_process: string | null;
  related_finding: string | null;
  asked_at: string;
  answered_at: string | null;
  answer_json: string | null;
}

// ── API error contract ──────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  request_id?: string;
}

export class HttpError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
