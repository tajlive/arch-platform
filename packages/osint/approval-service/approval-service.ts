// packages/osint/approval-service/approval-service.ts
// Approval Service - lifecycle of approval requests and grants.
// Enforces: signature signing, expiry/timeout, revocation, and re-validation
// that an approval grant never grants capabilities forbidden for a target class.

import type {
  ApprovalRequest,
  ApprovalGrant,
  ApprovalId,
  Target,
  Capability,
  CustomerId,
  UserId,
  Timestamp,
  TargetId,
  ProfileId,
} from '../types/core';
import {
  createApprovalId,
  createCustomerId,
  createTargetId,
  createUserId,
  createTimestamp,
  nowTimestamp,
} from '../types/core';
import { validateApprovalGrant } from '../api/middleware/policy-enforcement';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export type ApprovalRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'revoked';

export interface ApprovalServiceDeps {
  // Store interface injected for testability
  saveRequest: (req: ApprovalRequest) => Promise<ApprovalRequest>;
  getRequest: (approvalId: string) => Promise<ApprovalRequest | null>;
  updateRequest: (req: ApprovalRequest) => Promise<ApprovalRequest>;
  saveGrant: (grant: ApprovalGrant) => Promise<ApprovalGrant>;
  getGrant: (approvalId: string) => Promise<ApprovalGrant | null>;
  now?: () => Timestamp;
}

export interface CreateApprovalInput {
  customerId: string;
  targetId: string;
  target: Target;
  profileId: string;
  requestedCapabilities: Capability[];
  requestedBy: string;
  justification: string;
  scopeDocumentRef?: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  contactPerson?: { name: string; email: string; phone?: string };
  expiresInMs?: number;
}

export class ApprovalError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'not_found'
      | 'already_decided'
      | 'not_approver'
      | 'expired'
      | 'revoked'
      | 'invalid_grant'
      | 'invalid_status_transition'
      | 'missing_target_class'
  ) {
    super(message);
    this.name = 'ApprovalError';
  }
}

// ──────────────────────────────────────────────────────────────
// Approval Service
// ──────────────────────────────────────────────────────────────

const DEFAULT_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export class ApprovalService {
  constructor(private readonly deps: ApprovalServiceDeps) {}

  private now(): Timestamp {
    return this.deps.now ? this.deps.now() : nowTimestamp();
  }

  /**
   * Create a new approval request. Deny-by-default: only requests that
   * reference a valid target with a known target_class are accepted.
   */
  async requestApproval(input: CreateApprovalInput): Promise<ApprovalRequest> {
    // Must have a target class for policy re-validation later
    if (!input.target?.target_class) {
      throw new ApprovalError(
        'Cannot create approval without a valid target (missing target_class)',
        'missing_target_class'
      );
    }

    const now = this.now();
    const request: ApprovalRequest = {
      approval_id: createApprovalId(crypto.randomUUID()),
      customer_id: createCustomerId(input.customerId),
      target_id: createTargetId(input.targetId),
      profile_id: input.profileId as ProfileId,
      requested_capabilities: input.requestedCapabilities,
      requested_by: createUserId(input.requestedBy),
      justification: input.justification,
      scope_document_ref: input.scopeDocumentRef,
      time_window_start: input.timeWindowStart ? createTimestamp(input.timeWindowStart) : undefined,
      time_window_end: input.timeWindowEnd ? createTimestamp(input.timeWindowEnd) : undefined,
      contact_person: input.contactPerson,
      status: 'pending',
      created_at: now,
      expires_at: addMs(now, input.expiresInMs ?? DEFAULT_EXPIRY_MS),
    };

    return this.deps.saveRequest(request);
  }

  /**
   * Approve an approval request → creates a signed ApprovalGrant.
   * The grant is validated against the target class FIRST - it can never
   * grant a capability that policy forbids for that target class.
   */
  async approve(params: {
    approvalId: string;
    target: Target;
    approver: string;
    grantedCapabilities: Capability[];
    maxDurationMinutes?: number;
  }): Promise<ApprovalGrant> {
    const { approvalId, target, approver } = params;

    const request = await this.deps.getRequest(approvalId);
    if (!request) {
      throw new ApprovalError('Approval request not found', 'not_found');
    }

    // Status guards
    if (request.status !== 'pending') {
      throw new ApprovalError(
        `Approval ${approvalId} already ${request.status}`,
        'already_decided'
      );
    }
    if (isExpired(request, this.now())) {
      await this.expire(approvalId);
      throw new ApprovalError('Approval request has expired', 'expired');
    }

    // Policy re-validation: the grant must not grant capabilities forbidden
    // for the target class (e.g. active capability on third_party_public).
    const grantValidation = validateApprovalGrant({
      targetClass: target.target_class,
      grantedCapabilities: params.grantedCapabilities,
    });
    if (!grantValidation.valid) {
      throw new ApprovalError(
        `Grant contains capabilities forbidden for target class '${target.target_class}': ${grantValidation.invalidCapabilities.join(', ')}`,
        'invalid_grant'
      );
    }

    const now = this.now();
    const grant: ApprovalGrant = {
      approval_id: createApprovalId(approvalId),
      granted_capabilities: params.grantedCapabilities,
      constraints: {
        max_duration_minutes: params.maxDurationMinutes ?? 60,
      },
      signed_by: createUserId(approver),
      signed_at: now,
      signature: signGrant(approvalId, params.grantedCapabilities, target.target_class),
    };

    // Update request status
    const approved: ApprovalRequest = {
      ...request,
      status: 'approved',
      decided_by: createUserId(approver),
      decided_at: now,
      decision_reason: `Approved with ${params.grantedCapabilities.length} capability grant(s)`,
    };

    await this.deps.saveGrant(grant);
    await this.deps.updateRequest(approved);

    return grant;
  }

  /**
   * Reject an approval request.
   */
  async reject(params: { approvalId: string; approver: string; reason: string }): Promise<ApprovalRequest> {
    const request = await this.deps.getRequest(params.approvalId);
    if (!request) {
      throw new ApprovalError('Approval request not found', 'not_found');
    }
    if (request.status !== 'pending') {
      throw new ApprovalError(
        `Approval ${params.approvalId} already ${request.status}`,
        'already_decided'
      );
    }

    const rejected: ApprovalRequest = {
      ...request,
      status: 'rejected',
      decided_by: createUserId(params.approver),
      decided_at: this.now(),
      decision_reason: params.reason,
    };
    return this.deps.updateRequest(rejected);
  }

  /**
   * Revoke an approved grant. This is critical for mid-scan safety - a
   * revoked grant should cause in-flight jobs to be cancelled (handled by
   * the runner manager / scan job service pre-dispatch re-validation).
   */
  async revoke(params: { approvalId: string; approver: string; reason: string }): Promise<ApprovalRequest> {
    const request = await this.deps.getRequest(params.approvalId);
    if (!request) {
      throw new ApprovalError('Approval request not found', 'not_found');
    }
    if (request.status !== 'approved') {
      throw new ApprovalError(
        `Only approved approvals can be revoked (current: ${request.status})`,
        'invalid_status_transition'
      );
    }

    const revoked: ApprovalRequest = {
      ...request,
      status: 'revoked',
      decided_by: createUserId(params.approver),
      decided_at: this.now(),
      decision_reason: params.reason,
    };
    return this.deps.updateRequest(revoked);
  }

  /**
   * Expire an approval request (called by scheduler or on-access check).
   */
  async expire(approvalId: string): Promise<ApprovalRequest | null> {
    const request = await this.deps.getRequest(approvalId);
    if (!request) return null;
    if (request.status !== 'pending' && request.status !== 'approved') return request;

    const expired: ApprovalRequest = {
      ...request,
      status: 'expired',
      decided_at: this.now(),
      decision_reason: 'Approval window expired',
    };
    return this.deps.updateRequest(expired);
  }

  /**
   * Check whether an approval grant is still valid (not expired/revoked).
   * Used by scan job service pre-dispatch to fail-closed on stale approvals.
   */
  async isGrantValid(approvalId: string): Promise<boolean> {
    const grant = await this.deps.getGrant(approvalId);
    if (!grant) return false;

    const request = await this.deps.getRequest(approvalId);
    if (!request || request.status !== 'approved') return false;
    if (isExpired(request, this.now())) return false;

    return true;
  }
}

// ──────────────────────────────────────────────────────────────
// Pure helpers (exported for testing)
// ──────────────────────────────────────────────────────────────

export function addMs(ts: Timestamp, ms: number): Timestamp {
  return new Date(new Date(ts).getTime() + ms).toISOString() as Timestamp;
}

export function isExpired(request: ApprovalRequest, now: Timestamp): boolean {
  return new Date(now).getTime() > new Date(request.expires_at).getTime();
}

export function signGrant(approvalId: string, capabilities: Capability[], targetClass: Target['target_class']): string {
  // In production this would be an HMAC/JWS signed with a server-side key.
  // This deterministic signature ties the grant to its exact scope so it
  // cannot be reused or replayed for a different target class.
  return `signed:${approvalId}:${capabilities.sort().join(',')}:${targetClass}`;
}

export function createApprovalService(deps: ApprovalServiceDeps): ApprovalService {
  return new ApprovalService(deps);
}
