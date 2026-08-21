// packages/osint/test-helpers/fixtures.ts
// Test fixture builder - constructs valid Target objects.

import type { Target, TargetClass, CustomerId, UserId, Timestamp, Capability, ApprovalGrant, ApprovalId } from '../types/core.ts';
import { createTargetId, createCustomerId, createUserId, createTimestamp, createApprovalId } from '../types/core.ts';

export interface CreateTargetOptions {
  targetClass: TargetClass;
  identifier: string;
  displayName?: string;
  customerId?: string;
  createdBy?: string;
  now?: string;
}

export function createTarget(opts: CreateTargetOptions): Target {
  const now = createTimestamp(opts.now ?? '2026-08-21T00:00:00.000Z');
  const customerId: CustomerId = createCustomerId(opts.customerId ?? 'customer-1');
  const createdBy: UserId = createUserId(opts.createdBy ?? 'user-1');

  return {
    target_id: createTargetId('target-1'),
    customer_id: customerId,
    target_class: opts.targetClass,
    identifier: opts.identifier,
    display_name: opts.displayName ?? opts.identifier,
    evidence: [],
    metadata: {
      identifier_type: 'domain',
      ...(opts.targetClass === 'third_party_public' ? { passive_only: true, active_forbidden: true } : {}),
    },
    created_at: now,
    created_by: createdBy,
    updated_at: now,
    status: opts.targetClass === 'third_party_public' ? 'active' : 'pending_verification',
  };
}

export const TEST_TIMESTAMP: Timestamp = createTimestamp('2026-08-21T00:00:00.000Z');

export function makeApprovalGrant(grantedCapabilities: Capability[]): ApprovalGrant {
  return {
    approval_id: createApprovalId('APR-TEST'),
    granted_capabilities: grantedCapabilities,
    constraints: { max_duration_minutes: 60 },
    signed_by: createUserId('user-1'),
    signed_at: createTimestamp('2026-08-21T00:00:00.000Z'),
    signature: 'test-signature',
  };
}