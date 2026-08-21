// packages/osint/api/routes/scan-jobs.ts
// Scan Job API - creates and manages OSINT scan jobs with server-side
// policy enforcement at every stage.

import type {
  ScanJob,
  ScanJobId,
  ScanJobStatus,
  Target,
  Capability,
  ApprovalGrant,
  ProfileId,
  CustomerId,
  UserId,
  TargetId,
  ScanProfile,
} from '../../types/core';
import {
  createScanJobId,
  createCustomerId,
  createUserId,
  createTargetId,
  nowTimestamp,
} from '../../types/core';
import { enforceScanRequest, validateScanJobForDispatch } from '../middleware/policy-enforcement';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface CreateScanJobInput {
  customerId: string;
  targetId: string;
  profileId: string;
  requestedCapabilities: Capability[];
  createdBy: string;
  approvalGrant?: ApprovalGrant | null;
}

export interface ScanJobServiceDeps {
  getTarget: (targetId: string, customerId: string) => Promise<Target | null>;
  getProfile: (profileId: string) => ScanProfile | null;
  saveScanJob: (job: ScanJob) => Promise<ScanJob>;
}

export class ScanJobCreationError extends Error {
  constructor(
    message: string,
    public readonly code: 'target_not_found' | 'profile_not_found' | 'policy_violation' | 'no_capabilities'
  ) {
    super(message);
    this.name = 'ScanJobCreationError';
  }
}

// ──────────────────────────────────────────────────────────────
// Scan Job Service
// ──────────────────────────────────────────────────────────────

export class ScanJobService {
  constructor(private readonly deps: ScanJobServiceDeps) {}

  /**
   * Create a scan job. Policy is enforced server-side BEFORE any runner is
   * touched. If the requested capabilities violate policy (e.g. active
   * capability on a third_party_public target), the job is rejected.
   */
  async create(input: CreateScanJobInput): Promise<ScanJob> {
    // 1. Load target (tenant-isolated)
    const target = await this.deps.getTarget(input.targetId, input.customerId);
    if (!target) {
      throw new ScanJobCreationError('Target not found', 'target_not_found');
    }

    // 2. Load profile
    const profile = this.deps.getProfile(input.profileId);
    if (!profile) {
      throw new ScanJobCreationError('Profile not found', 'profile_not_found');
    }

    // 3. Server-side policy enforcement - this is the critical gate
    const enforcement = enforceScanRequest({
      target,
      requestedCapabilities: input.requestedCapabilities,
      approvalGrant: input.approvalGrant ?? null,
    });

    if (!enforcement.allowed) {
      const reasons = enforcement.rejected.map(r => r.reason).join('; ');
      throw new ScanJobCreationError(
        `Policy violation: ${reasons}`,
        'policy_violation'
      );
    }

    // 4. Determine initial status
    //    - If any capability requires approval and grant is absent → pending_approval
    //    - Otherwise → queued (passive runs immediately)
    const needsApproval = enforcement.allowedCapabilities.some(cap =>
      profile.requires_approval_for.includes(cap)
    );

    let status: ScanJobStatus;
    if (needsApproval && !input.approvalGrant) {
      status = 'pending_approval';
    } else {
      status = 'queued';
    }

    const now = nowTimestamp();
    const job: ScanJob = {
      scan_job_id: createScanJobId(crypto.randomUUID()),
      customer_id: createCustomerId(input.customerId),
      target_id: createTargetId(input.targetId),
      profile_id: input.profileId as ProfileId,
      approval_id: input.approvalGrant?.approval_id,
      status,
      findings_count: 0,
      findings_by_severity: { info: 0, low: 0, medium: 0, high: 0, critical: 0 },
      created_at: now,
      created_by: createUserId(input.createdBy),
      updated_at: now,
    };

    return this.deps.saveScanJob(job);
  }

  /**
   * Pre-dispatch re-validation. Called right before handing a job to a runner
   * as a safety net - catches approval revocation or target reclassification
   * between creation and dispatch.
   */
  async validateBeforeDispatch(params: {
    target: Target;
    requestedCapabilities: Capability[];
    approvalGrant?: ApprovalGrant | null;
  }): Promise<void> {
    const result = validateScanJobForDispatch(params);
    if (!result.allowed) {
      throw new ScanJobCreationError(
        `Pre-dispatch policy violation: ${result.rejected.map(r => r.reason).join('; ')}`,
        'policy_violation'
      );
    }
  }
}

export function createScanJobService(deps: ScanJobServiceDeps): ScanJobService {
  return new ScanJobService(deps);
}