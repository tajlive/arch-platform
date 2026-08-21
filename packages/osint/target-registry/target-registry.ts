// packages/osint/target-registry/target-registry.ts
// Target Registry - CRUD + classification with server-side enforcement

import type {
  Target,
  TargetClass,
  TargetId,
  CustomerId,
  UserId,
  Timestamp,
  EvidenceType,
} from '../types/core';
import {
  createTargetId,
  createCustomerId,
  createUserId,
  createTimestamp,
  nowTimestamp,
} from '../types/core';

// ──────────────────────────────────────────────────────────────
// Validation & Error types
// ──────────────────────────────────────────────────────────────

export class TargetValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly code: 'invalid_identifier' | 'invalid_class' | 'missing_evidence' | 'not_found' | 'conflict'
  ) {
    super(message);
    this.name = 'TargetValidationError';
  }
}

export interface CreateTargetInput {
  customerId: string;
  identifier: string;
  displayName: string;
  targetClass: TargetClass;
  evidence: Array<{ type: EvidenceType; value: string }>;
  createdBy: string;
  metadata?: Record<string, unknown>;
}

export interface TargetRegistryStore {
  create(target: Target): Promise<Target>;
  get(targetId: string, customerId: string): Promise<Target | null>;
  list(customerId: string, filter?: { targetClass?: TargetClass; status?: Target['status'] }): Promise<Target[]>;
  update(targetId: string, customerId: string, patch: Partial<Pick<Target, 'display_name' | 'metadata' | 'status'>>): Promise<Target | null>;
  archive(targetId: string, customerId: string, userId: string): Promise<Target | null>;
}

// ──────────────────────────────────────────────────────────────
// Validation rules per target class
// ──────────────────────────────────────────────────────────────

const IDENTIFIER_PATTERNS: Record<'domain' | 'ipv4' | 'cidr' | 'asn', RegExp> = {
  domain: /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i,
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:3[0-2]|[12]?[0-9])$/,
  asn: /^AS\d+$/i,
};

function detectIdentifierType(identifier: string): 'domain' | 'ipv4' | 'cidr' | 'asn' | 'brand' {
  if (IDENTIFIER_PATTERNS.domain.test(identifier)) return 'domain';
  if (IDENTIFIER_PATTERNS.cidr.test(identifier)) return 'cidr';
  if (IDENTIFIER_PATTERNS.ipv4.test(identifier)) return 'ipv4';
  if (IDENTIFIER_PATTERNS.asn.test(identifier)) return 'asn';
  return 'brand';
}

// Evidence requirements per target class (deny-by-default)
const EVIDENCE_REQUIREMENTS: Record<TargetClass, EvidenceType[]> = {
  owned: ['dns_txt', 'whois_match', 'ssl_cert', 'dns_cname', 'manual_declaration'],
  authorized: ['manual_declaration'], // requires mandate reference in evidence
  third_party_public: [], // passive only, no proof required beyond declaration
};

// ──────────────────────────────────────────────────────────────
// Target Registry implementation
// ──────────────────────────────────────────────────────────────

export class TargetRegistry {
  constructor(private readonly store: TargetRegistryStore) {}

  /**
   * Create a target with full validation and server-side class enforcement.
   * The target_class is set server-side based on validation - the client
   * cannot silently escalate to 'owned'/'authorized' without evidence.
   */
  async create(input: CreateTargetInput): Promise<Target> {
    // 1. Validate identifier non-empty
    const identifier = input.identifier.trim();
    if (!identifier) {
      throw new TargetValidationError('Identifier is required', 'identifier', 'invalid_identifier');
    }

    // 2. Validate target class is one of allowed
    const validClasses: TargetClass[] = ['owned', 'authorized', 'third_party_public'];
    if (!validClasses.includes(input.targetClass)) {
      throw new TargetValidationError(`Invalid target class: ${input.targetClass}`, 'targetClass', 'invalid_class');
    }

    // 3. Enforce evidence requirements for owned/authorized (deny-by-default)
    const requiredEvidence = EVIDENCE_REQUIREMENTS[input.targetClass];
    if (requiredEvidence.length > 0) {
      const provided = input.evidence ?? [];
      const hasRequired = provided.some(e => requiredEvidence.includes(e.type));
      if (!hasRequired) {
        throw new TargetValidationError(
          `Target class '${input.targetClass}' requires at least one evidence of type: ${requiredEvidence.join(', ')}. ` +
          `Server-side enforcement blocks creation without proof.`,
          'evidence',
          'missing_evidence'
        );
      }
    }

    // 4. For third_party_public, enforce passive-only marker
    const metadata: Record<string, unknown> = {
      ...(input.metadata ?? {}),
      identifier_type: detectIdentifierType(identifier),
    };
    if (input.targetClass === 'third_party_public') {
      metadata.passive_only = true;
      metadata.active_forbidden = true;
    }

    // 5. Build the target with server-assigned timestamps
    const now = nowTimestamp();
    const target: Target = {
      target_id: createTargetId(crypto.randomUUID()),
      customer_id: createCustomerId(input.customerId),
      target_class: input.targetClass,
      identifier,
      display_name: input.displayName.trim() || identifier,
      evidence: (input.evidence ?? []).map(e => ({
        type: e.type,
        value: e.value,
        verified_at: now,
        verified_by: createUserId(input.createdBy),
      })),
      metadata,
      created_at: now,
      created_by: createUserId(input.createdBy),
      updated_at: now,
      status: input.targetClass === 'third_party_public' ? 'active' : 'pending_verification',
    };

    // 6. Persist
    return this.store.create(target);
  }

  /**
   * Get a single target scoped to customer (tenant isolation).
   */
  async get(targetId: string, customerId: string): Promise<Target | null> {
    return this.store.get(targetId, customerId);
  }

  /**
   * List targets for a customer, optionally filtered.
   */
  async list(customerId: string, filter?: { targetClass?: TargetClass; status?: Target['status'] }): Promise<Target[]> {
    return this.store.list(customerId, filter);
  }

  /**
   * Update mutable fields. target_class is immutable - server-side.
   */
  async update(
    targetId: string,
    customerId: string,
    patch: Partial<Pick<Target, 'display_name' | 'metadata' | 'status'>>
  ): Promise<Target | null> {
    const existing = await this.store.get(targetId, customerId);
    if (!existing) {
      throw new TargetValidationError('Target not found', 'targetId', 'not_found');
    }
    // Explicitly do NOT allow target_class to be changed via update
    return this.store.update(targetId, customerId, patch);
  }

  /**
   * Soft-archive a target (logical delete).
   */
  async archive(targetId: string, customerId: string, userId: string): Promise<Target | null> {
    return this.store.archive(targetId, customerId, userId);
  }
}

export function createTargetRegistry(store: TargetRegistryStore): TargetRegistry {
  return new TargetRegistry(store);
}