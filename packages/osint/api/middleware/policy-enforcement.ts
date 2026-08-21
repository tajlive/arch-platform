// packages/osint/api/middleware/policy-enforcement.ts
// Server-side policy enforcement middleware.
// CRITICAL: All policy decisions happen HERE, on the server. The client can
// never override these rules - even if it sends forbidden capabilities or
// attempts to reclassify a target, the server rejects the request.

import type {
  Target,
  TargetClass,
  Capability,
  OperationClass,
  ApprovalGrant,
} from '../../types/core';
import {
  getCapabilityPolicy,
  getOperationClass,
} from '../../policy-engine/capability-policies';

// ──────────────────────────────────────────────────────────────
// Result types
// ──────────────────────────────────────────────────────────────

export interface PolicyCheckResult {
  allowed: boolean;
  reason?: string;
  operation_class?: OperationClass;
  capability?: Capability;
}

export class PolicyViolationError extends Error {
  constructor(
    message: string,
    public readonly capability: Capability,
    public readonly targetClass: TargetClass,
    public readonly operationClass: OperationClass
  ) {
    super(message);
    this.name = 'PolicyViolationError';
  }
}

// ──────────────────────────────────────────────────────────────
// Enforcement helpers
// ──────────────────────────────────────────────────────────────

/**
 * Hard server-side rule: third_party_public targets can ONLY use passive
 * capabilities. Any active capability request is rejected regardless of what
 * the client sends, and even if an approval grant somehow exists.
 */
export function enforceThirdPartyPassiveOnly(
  targetClass: TargetClass,
  capability: Capability
): PolicyCheckResult {
  if (targetClass !== 'third_party_public') {
    return { allowed: true, capability };
  }

  const opClass = getOperationClass(capability);
  if (opClass === 'active_requires_approval' || opClass === 'forbidden') {
    return {
      allowed: false,
      reason: `Capability '${capability}' is not permitted for third_party_public targets. Only passive, publicly available data sources are used. Server-side enforcement blocks this request.`,
      operation_class: opClass,
      capability,
    };
  }

  return { allowed: true, capability, operation_class: opClass };
}

/**
 * Evaluate whether a capability is allowed for a target given its class
 * and any approval grant.
 */
export function evaluateCapability(
  targetClass: TargetClass,
  capability: Capability,
  approvalGrant?: ApprovalGrant | null
): PolicyCheckResult {
  const policy = getCapabilityPolicy(capability);

  // Unknown capability → deny (deny-by-default)
  if (!policy) {
    return {
      allowed: false,
      reason: `Unknown capability '${capability}'. Denied by default.`,
      capability,
    };
  }

  // Forbidden capabilities are always blocked
  if (policy.operation_class === 'forbidden') {
    return {
      allowed: false,
      reason: `Capability '${capability}' is forbidden by policy.`,
      operation_class: policy.operation_class,
      capability,
    };
  }

  // Third-party public hard restriction
  if (targetClass === 'third_party_public') {
    const tpCheck = enforceThirdPartyPassiveOnly(targetClass, capability);
    if (!tpCheck.allowed) return tpCheck;
  }

  // Active capabilities require approval grant (owned/authorized only)
  if (policy.operation_class === 'active_requires_approval') {
    const hasGrant = approvalGrant?.granted_capabilities.includes(capability) ?? false;
    if (!hasGrant) {
      return {
        allowed: false,
        reason: `Capability '${capability}' requires an approved authorization grant. None found for this request.`,
        operation_class: policy.operation_class,
        capability,
      };
    }
    return { allowed: true, operation_class: policy.operation_class, capability };
  }

  // Passive capabilities are allowed by default
  return { allowed: true, operation_class: 'passive_allowed', capability };
}

/**
 * Validate a full scan request (list of capabilities) against a target.
 * Returns all rejected capabilities. If any are rejected, the whole request
 * fails (fail-closed).
 */
export function enforceScanRequest(params: {
  target: Target;
  requestedCapabilities: Capability[];
  approvalGrant?: ApprovalGrant | null;
}): { allowed: boolean; rejected: PolicyCheckResult[]; allowedCapabilities: Capability[] } {
  const { target, requestedCapabilities, approvalGrant } = params;

  const rejected: PolicyCheckResult[] = [];
  const allowedCapabilities: Capability[] = [];

  for (const cap of requestedCapabilities) {
    const result = evaluateCapability(target.target_class, cap, approvalGrant);
    if (result.allowed) {
      allowedCapabilities.push(cap);
    } else {
      rejected.push(result);
    }
  }

  // Fail-closed: any rejection → whole request rejected
  return {
    allowed: rejected.length === 0,
    rejected,
    allowedCapabilities,
  };
}

/**
 * Validate a scan job for a target before dispatch to a runner.
 * This is called server-side at job creation AND again right before
 * dispatch, so policy is re-checked even if approval was granted earlier
 * (e.g. approval revoked in the meantime).
 */
export function validateScanJobForDispatch(params: {
  target: Target;
  requestedCapabilities: Capability[];
  approvalGrant?: ApprovalGrant | null;
}): { allowed: boolean; rejected: PolicyCheckResult[]; allowedCapabilities: Capability[] } {
  // Re-run the same enforcement as creation-time - this is the safety net
  // that catches approval revocation between request and dispatch.
  return enforceScanRequest(params);
}

/**
 * Validate an approval grant itself - ensure it doesn't contain capabilities
 * that are forbidden for the target class. The grant being validated is passed
 * as the approval evidence, so legitimate active capabilities for owned/
 * authorized targets pass, while forbidden or third_party_public-active ones
 * are rejected.
 */
export function validateApprovalGrant(params: {
  targetClass: TargetClass;
  grantedCapabilities: Capability[];
}): { valid: boolean; invalidCapabilities: Capability[] } {
  const { targetClass, grantedCapabilities } = params;
  const invalidCapabilities: Capability[] = [];

  for (const cap of grantedCapabilities) {
    // A capability is only grantable if it is NOT forbidden and NOT active-on-
    // third_party_public. Passive capabilities are fine; active capabilities are
    // fine for owned/authorized (the grant itself provides the approval).
    const policy = getCapabilityPolicy(cap);

    if (!policy) {
      invalidCapabilities.push(cap);
      continue;
    }

    if (policy.operation_class === 'forbidden') {
      invalidCapabilities.push(cap);
      continue;
    }

    if (targetClass === 'third_party_public' && policy.operation_class === 'active_requires_approval') {
      invalidCapabilities.push(cap);
      continue;
    }
  }

  return {
    valid: invalidCapabilities.length === 0,
    invalidCapabilities,
  };
}