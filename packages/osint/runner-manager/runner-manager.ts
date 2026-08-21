// packages/osint/runner-manager/runner-manager.ts
// Runner Manager - owns the job lifecycle between the control plane and
// external runners. Central safety property: EVERY dispatch re-validates
// policy (approval may have been revoked, target reclassified) and the
// runner receives ONLY the approved capability set.

import type {
  Target,
  Capability,
  ApprovalGrant,
  ScanJobId,
  ScanJobStatus,
  Timestamp,
} from '../types/core';
import { createScanJobId, nowTimestamp } from '../types/core';
import { validateScanJobForDispatch } from '../api/middleware/policy-enforcement';
import type { RunnerAdapter, RunnerJobRequest, RunnerJobSpec, RunnerJobStatus } from './runner-contract';
import { resolveSpiderFootModules } from './runner-contract';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface PendingJob {
  scan_job_id: ScanJobId;
  target: Target;
  requestedCapabilities: Capability[];
  approvalGrant?: ApprovalGrant | null;
  timeoutSeconds: number;
  priority: 'low' | 'normal' | 'high';
  createdAt: Timestamp;
}

export interface DispatchParams {
  target: Target;
  requestedCapabilities: Capability[];
  approvalGrant?: ApprovalGrant | null;
  timeoutSeconds?: number;
  priority?: 'low' | 'normal' | 'high';
}

export interface RunnerManagerDeps {
  getRunner: (runnerId: string) => RunnerAdapter | undefined;
  updateJobStatus: (scanJobId: string, status: ScanJobStatus, detail?: string) => Promise<void>;
  saveFindingsBatch: (scanJobId: string, batch: unknown[]) => Promise<void>;
  isApprovalStillValid: (approvalId: string) => Promise<boolean>;
  // Injectable clock for tests
  now?: () => Timestamp;
}

export class RunnerError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'policy_violation'
      | 'no_runner'
      | 'runner_unhealthy'
      | 'runner_rejected'
      | 'timeout'
      | 'approval_revoked'
      | 'job_not_found'
  ) {
    super(message);
    this.name = 'RunnerError';
  }
}

// ──────────────────────────────────────────────────────────────
// Runner Manager
// ──────────────────────────────────────────────────────────────

export class RunnerManager {
  constructor(private readonly deps: RunnerManagerDeps) {}

  private now(): Timestamp {
    return this.deps.now ? this.deps.now() : nowTimestamp();
  }

  /**
   * Dispatch a job to a runner. The critical re-validation happens HERE,
   * immediately before dispatch - even if the job was created and approved
   * earlier, a revoked approval or reclassified target stops execution.
   */
  async dispatch(runnerId: string, params: DispatchParams): Promise<{ accepted: boolean; runnerJobId?: string }> {
    const { target, requestedCapabilities, approvalGrant } = params;

    // 1. Re-validate policy right before dispatch (fail-closed).
    const enforcement = validateScanJobForDispatch({
      target,
      requestedCapabilities,
      approvalGrant: approvalGrant ?? null,
    });
    if (!enforcement.allowed) {
      throw new RunnerError(
        `Pre-dispatch policy violation: ${enforcement.rejected.map(r => r.reason).join('; ')}`,
        'policy_violation'
      );
    }

    // 2. If an approval grant was involved, verify it's still valid (not revoked/expired).
    if (approvalGrant) {
      const stillValid = await this.deps.isApprovalStillValid(approvalGrant.approval_id);
      if (!stillValid) {
        throw new RunnerError(
          `Approval ${approvalGrant.approval_id} is no longer valid (revoked or expired) - job cancelled`,
          'approval_revoked'
        );
      }
    }

    // 3. Resolve the runner.
    const runner = this.deps.getRunner(runnerId);
    if (!runner) {
      throw new RunnerError(`Runner '${runnerId}' not registered`, 'no_runner');
    }

    // 4. Health check the runner.
    const health = await runner.healthCheck();
    if (!health.healthy) {
      throw new RunnerError(`Runner '${runnerId}' unhealthy: ${health.detail ?? 'no detail'}`, 'runner_unhealthy');
    }

    // 5. Build the job spec - ONLY the approved capabilities.
    //    This is the contract boundary: the runner literally cannot see or
    //    execute anything beyond this set.
    const spec: RunnerJobSpec = {
      scan_job_id: createScanJobId(crypto.randomUUID()),
      target,
      approved_capabilities: enforcement.allowedCapabilities,
      approval_grant: approvalGrant ?? undefined,
      correlation_id: crypto.randomUUID(),
      timeout_seconds: params.timeoutSeconds ?? 600,
      priority: params.priority ?? 'normal',
    };

    const request: RunnerJobRequest = {
      job_id: spec.scan_job_id,
      spec,
      callback_url: '/internal/osint/webhooks/runner/status',
      callback_token: `cb-${crypto.randomUUID()}`,
    };

    // 6. Dispatch.
    const response = await runner.run(request);
    if (!response.accepted) {
      throw new RunnerError(
        `Runner rejected job: ${response.error ?? 'unknown error'}`,
        'runner_rejected'
      );
    }

    return { accepted: true, runnerJobId: response.runner_job_id };
  }

  /**
   * Resolve SpiderFoot modules for a set of approved capabilities.
   * Exposed here so the control plane can preview what a runner will do
   * before dispatch (transparency for audit log).
   */
  previewModules(approvedCapabilities: ReadonlyArray<Capability>): { modules: string[]; dropped: Capability[] } {
    return resolveSpiderFootModules(approvedCapabilities);
  }

  /**
   * Cancel an in-flight job (approval revoked, admin action, timeout).
   */
  async cancel(runnerId: string, jobId: string): Promise<void> {
    const runner = this.deps.getRunner(runnerId);
    if (!runner) {
      throw new RunnerError(`Runner '${runnerId}' not registered`, 'no_runner');
    }
    await runner.cancel(jobId);
    await this.deps.updateJobStatus(jobId, 'cancelled', 'cancelled by control plane');
  }
}

export function createRunnerManager(deps: RunnerManagerDeps): RunnerManager {
  return new RunnerManager(deps);
}