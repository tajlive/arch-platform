// packages/osint/policy-engine/policy-engine.ts
// Policy Engine - Core decision logic for OSINT operations

import type {
  Target,
  ScanProfile,
  Capability,
  OperationClass,
  PolicyDecision,
  TargetClass,
  ApprovalGrant,
  ProfileType,
} from '../types/core';
import { 
  getCapabilityPolicy, 
  getOperationClass, 
  isCapabilityAllowed,
  CAPABILITIES_BY_CLASS 
} from './capability-policies';
import type { ScanProfile as ScanProfileType } from '../types/core';

export class PolicyEngine {
  private readonly profiles: Map<string, ScanProfileType>;

  constructor(profiles: ReadonlyArray<ScanProfileType>) {
    this.profiles = new Map(profiles.map(p => [p.profile_id, p]));
  }

  /**
   * Main validation function - evaluates if a scan request complies with policy
   */
  validateScanRequest(params: {
    target: Target;
    profile: ScanProfileType;
    requestedCapabilities: Capability[];
    approvalGrant?: ApprovalGrant | null;
  }): PolicyDecision {
    const { target, profile, requestedCapabilities, approvalGrant } = params;

    // 1. Profile exists and is valid
    if (!this.profiles.has(profile.profile_id)) {
      return this.deny(`Profile ${profile.profile_id} not found in registry`);
    }

    // 2. Target class restriction
    if (!profile.target_class_restrictions.includes(target.target_class)) {
      return this.deny(
        `Profile ${profile.profile_type} not allowed for target class ${target.target_class}. ` +
        `Allowed: ${profile.target_class_restrictions.join(', ')}`
      );
    }

    // 3. All requested capabilities must be in profile's allowed list
    const notAllowed = requestedCapabilities.filter(
      c => !profile.allowed_capabilities.includes(c)
    );
    if (notAllowed.length > 0) {
      return this.deny(
        `Capabilities not allowed by profile: ${notAllowed.join(', ')}. ` +
        `Allowed: ${profile.allowed_capabilities.join(', ')}`
      );
    }

    // 4. Evaluate each capability against policy
    const violations: string[] = [];
    const requiredApprovals: Capability[] = [];
    const grantedCapabilities: Capability[] = [];

    for (const capability of requestedCapabilities) {
      const policy = getCapabilityPolicy(capability);
      if (!policy) {
        violations.push(`Unknown capability: ${capability}`);
        continue;
      }

      switch (policy.operation_class) {
        case 'forbidden':
          violations.push(`Capability ${capability} is forbidden by policy`);
          break;
        case 'active_requires_approval':
          if (target.target_class === 'third_party_public') {
            violations.push(
              `Active capability ${capability} forbidden for third_party_public targets`
            );
          } else if (!approvalGrant?.granted_capabilities.includes(capability)) {
            requiredApprovals.push(capability);
          } else {
            grantedCapabilities.push(capability);
          }
          break;
        case 'passive_allowed':
          grantedCapabilities.push(capability);
          break;
      }
    }

    // 5. Additional third_party_public restrictions
    if (target.target_class === 'third_party_public') {
      const activeCapabilities = requestedCapabilities.filter(c => 
        getOperationClass(c) === 'active_requires_approval'
      );
      if (activeCapabilities.length > 0) {
        violations.push(
          `Third-party public targets cannot use active capabilities: ${activeCapabilities.join(', ')}`
        );
      }
    }

    if (violations.length > 0) {
      return this.deny(violations.join('; '));
    }

    return {
      allowed: true,
      required_approvals: requiredApprovals,
      granted_capabilities: grantedCapabilities,
      pending_approval_capabilities: requiredApprovals,
      profile_type: profile.profile_type,
      target_class: target.target_class,
    };
  }

  /**
   * Validate a profile definition itself
   */
  validateProfile(profile: ScanProfileType): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Must have at least one allowed capability
    if (!profile.allowed_capabilities.length) {
      errors.push('Profile must have at least one allowed capability');
    }

    // Default enabled must be subset of allowed
    const notAllowed = profile.default_enabled.filter(
      c => !profile.allowed_capabilities.includes(c)
    );
    if (notAllowed.length > 0) {
      errors.push(`Default enabled capabilities not in allowed list: ${notAllowed.join(', ')}`);
    }

    // Requires approval must be subset of allowed
    const notAllowedApproval = profile.requires_approval_for.filter(
      c => !profile.allowed_capabilities.includes(c)
    );
    if (notAllowedApproval.length > 0) {
      errors.push(`Requires approval capabilities not in allowed list: ${notAllowedApproval.join(', ')}`);
    }

    // Target class restrictions must be valid
    const validTargetClasses: TargetClass[] = ['owned', 'authorized', 'third_party_public'];
    const invalidClasses = profile.target_class_restrictions.filter(
      c => !validTargetClasses.includes(c)
    );
    if (invalidClasses.length > 0) {
      errors.push(`Invalid target class restrictions: ${invalidClasses.join(', ')}`);
    }

    // Resource limits sanity
    if (profile.max_duration_minutes <= 0 || profile.max_duration_minutes > 1440) {
      errors.push('max_duration_minutes must be between 1 and 1440');
    }
    if (profile.max_concurrent_jobs <= 0 || profile.max_concurrent_jobs > 10) {
      errors.push('max_concurrent_jobs must be between 1 and 10');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Get all capabilities available for a target class + profile combination
   */
  getAvailableCapabilities(targetClass: TargetClass, profileType: ProfileType): Capability[] {
    const profile = Array.from(this.profiles.values())
      .find(p => p.profile_type === profileType);
    
    if (!profile) return [];

    return profile.allowed_capabilities.filter(cap => 
      isCapabilityAllowed(cap, targetClass, false) // Without approval
    );
  }

  /**
   * Get capabilities requiring approval for a target class + profile
   */
  getCapabilitiesRequiringApproval(targetClass: TargetClass, profileType: ProfileType): Capability[] {
    const profile = Array.from(this.profiles.values())
      .find(p => p.profile_type === profileType);
    
    if (!profile) return [];

    return profile.requires_approval_for.filter(cap => {
      const policy = getCapabilityPolicy(cap);
      return policy?.operation_class === 'active_requires_approval' && 
             targetClass !== 'third_party_public';
    });
  }

  /**
   * Get all passive capabilities for a target class
   */
  getPassiveCapabilities(targetClass: TargetClass): Capability[] {
    return CAPABILITIES_BY_CLASS.passive_allowed.filter(cap =>
      isCapabilityAllowed(cap, targetClass, false)
    );
  }

  private deny(reason: string): PolicyDecision {
    return {
      allowed: false,
      reason,
      required_approvals: [],
      granted_capabilities: [],
      pending_approval_capabilities: [],
      profile_type: '',
      target_class: 'owned',
    };
  }
}

// Export for testing
export function createPolicyEngine(profiles: ReadonlyArray<ScanProfileType>): PolicyEngine {
  return new PolicyEngine(profiles);
}