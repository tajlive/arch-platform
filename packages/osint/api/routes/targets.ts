// packages/osint/api/routes/targets.ts
// Target API - creates/lists targets with server-side class enforcement.
// The client picks a target_class but the SERVER validates evidence and
// rejects attempts to create 'owned'/'authorized' targets without proof.

import type {
  Target,
  TargetClass,
  EvidenceType,
  CustomerId,
  UserId,
} from '../../types/core';
import type { TargetRegistry } from '../../target-registry/target-registry';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface CreateTargetApiRequest {
  identifier: string;
  display_name?: string;
  target_class: TargetClass;
  evidence?: Array<{ type: EvidenceType; value: string }>;
  metadata?: Record<string, unknown>;
}

export interface TargetsApiContext {
  customerId: string; // from auth token, never from client
  userId: string;
}

export class TargetsApi {
  constructor(private readonly registry: TargetRegistry) {}

  /**
   * Create a target. The customer_id and user_id come from the authenticated
   * context (server-side), NOT from the request body - prevents tenant spoofing.
   */
  async create(req: CreateTargetApiRequest, ctx: TargetsApiContext): Promise<Target> {
    return this.registry.create({
      customerId: ctx.customerId,
      identifier: req.identifier,
      displayName: req.display_name ?? '',
      targetClass: req.target_class,
      evidence: req.evidence ?? [],
      createdBy: ctx.userId,
      metadata: req.metadata,
    });
  }

  /**
   * List targets for the authenticated customer (tenant-isolated).
   */
  async list(ctx: TargetsApiContext, filter?: { targetClass?: TargetClass; status?: Target['status'] }): Promise<Target[]> {
    return this.registry.list(ctx.customerId, filter);
  }

  /**
   * Get one target (tenant-isolated).
   */
  async get(targetId: string, ctx: TargetsApiContext): Promise<Target | null> {
    return this.registry.get(targetId, ctx.customerId);
  }

  /**
   * Archive (soft-delete) a target.
   */
  async archive(targetId: string, ctx: TargetsApiContext): Promise<Target | null> {
    return this.registry.archive(targetId, ctx.customerId, ctx.userId);
  }
}

export function createTargetsApi(registry: TargetRegistry): TargetsApi {
  return new TargetsApi(registry);
}

// Re-export for convenience
export type { TargetClass, EvidenceType, CustomerId, UserId };