// packages/osint/profile-registry/profiles.ts
// Scan Profile definitions - Three standard profiles

import type { ScanProfile, ProfileType, Capability, ProfileId, Timestamp } from '../types/core';
import { createTimestamp } from '../types/core';

// ──────────────────────────────────────────────────────────────
// Standard Scan Profiles
// ──────────────────────────────────────────────────────────────

export const SCAN_PROFILES: ReadonlyArray<ScanProfile> = [
  // ────────────────────────────────────────────────────────────
  // OWNED SECURITY BASELINE
  // ────────────────────────────────────────────────────────────
  {
    profile_id: 'owned_security_baseline' as ProfileId,
    profile_type: 'owned_security_baseline',
    name: 'Sikkerhetsbaseline for egne aktiv',
    description: 'Baseline sikkerhetsvurdering for kundens egne eiendeler. Passive moduler som standard, aktive kun med eksplisitt godkjenning.',
    allowed_capabilities: [
      // Passive (enabled by default)
      'dns_lookup',
      'whois_lookup',
      'asn_lookup',
      'certificate_transparency',
      'ssl_certificate_analysis',
      'http_headers',
      'technology_fingerprint',
      'ip_reputation',
      'public_leak_search',
      'brand_monitoring',
      'change_detection',
      'subdomain_enumeration_passive',
      'dns_wildcard_check',
      // Active (requires approval)
      'dns_zone_transfer',
      'dns_bruteforce',
      'subdomain_enumeration_active',
      'http_crawl_authenticated',
      'port_scan_tcp',
      'port_scan_udp',
      'vulnerability_scan_active',
    ],
    default_enabled: [
      'dns_lookup',
      'whois_lookup',
      'asn_lookup',
      'certificate_transparency',
      'ssl_certificate_analysis',
      'http_headers',
      'technology_fingerprint',
      'ip_reputation',
      'public_leak_search',
      'brand_monitoring',
      'change_detection',
      'subdomain_enumeration_passive',
      'dns_wildcard_check',
    ],
    requires_approval_for: [
      'dns_zone_transfer',
      'dns_bruteforce',
      'subdomain_enumeration_active',
      'http_crawl_authenticated',
      'port_scan_tcp',
      'port_scan_udp',
      'vulnerability_scan_active',
    ],
    target_class_restrictions: ['owned'],
    max_duration_minutes: 120,
    max_concurrent_jobs: 3,
    resource_limits: {
      max_cpu_cores: 2,
      max_memory_mb: 4096,
      max_bandwidth_mbps: 100,
    },
    created_at: createTimestamp('2026-08-21T00:00:00.000Z'),
    updated_at: createTimestamp('2026-08-21T00:00:00.000Z'),
    version: 1,
  },

  // ────────────────────────────────────────────────────────────
  // AUTHORIZED SECURITY ASSESSMENT
  // ────────────────────────────────────────────────────────────
  {
    profile_id: 'authorized_security_assessment' as ProfileId,
    profile_type: 'authorized_security_assessment',
    name: 'Autorisert sikkerhetsvurdering',
    description: 'Sikkerhetsvurdering for eksplisitt autoriserte tredjepartsmål. Krever dokumentert mandat og kontaktperson.',
    allowed_capabilities: [
      // Passive (enabled by default)
      'dns_lookup',
      'whois_lookup',
      'asn_lookup',
      'certificate_transparency',
      'ssl_certificate_analysis',
      'http_headers',
      'technology_fingerprint',
      'ip_reputation',
      'public_leak_search',
      'subdomain_enumeration_passive',
      // Active (requires approval)
      'dns_zone_transfer',
      'dns_bruteforce',
      'subdomain_enumeration_active',
      'port_scan_tcp',
      'port_scan_udp',
      'vulnerability_scan_active',
      'vulnerability_scan_passive',
      'dns_wildcard_check',
    ],
    default_enabled: [
      'dns_lookup',
      'whois_lookup',
      'asn_lookup',
      'certificate_transparency',
      'ssl_certificate_analysis',
      'http_headers',
      'technology_fingerprint',
      'ip_reputation',
      'subdomain_enumeration_passive',
    ],
    requires_approval_for: [
      'dns_zone_transfer',
      'dns_bruteforce',
      'subdomain_enumeration_active',
      'port_scan_tcp',
      'port_scan_udp',
      'vulnerability_scan_active',
    ],
    target_class_restrictions: ['authorized'],
    max_duration_minutes: 180,
    max_concurrent_jobs: 2,
    resource_limits: {
      max_cpu_cores: 4,
      max_memory_mb: 8192,
      max_bandwidth_mbps: 200,
    },
    created_at: createTimestamp('2026-08-21T00:00:00.000Z'),
    updated_at: createTimestamp('2026-08-21T00:00:00.000Z'),
    version: 1,
  },

  // ────────────────────────────────────────────────────────────
  // PUBLIC MARKET INTELLIGENCE
  // ────────────────────────────────────────────────────────────
  {
    profile_id: 'public_market_intelligence' as ProfileId,
    profile_type: 'public_market_intelligence',
    name: 'Offentlig markedsintelligens',
    description: 'Passiv markedsintelligens for offentlige kilder. Kun passive operasjoner tillatt - ingen portskanning, sårbarhetsskanning eller aktive operasjoner.',
    allowed_capabilities: [
      'dns_lookup',
      'whois_lookup',
      'asn_lookup',
      'certificate_transparency',
      'ssl_certificate_analysis',
      'http_headers',
      'technology_fingerprint',
      'ip_reputation',
      'public_leak_search',
      'brand_monitoring',
      'change_detection',
      'subdomain_enumeration_passive',
      'dns_wildcard_check',
    ],
    default_enabled: [
      'dns_lookup',
      'whois_lookup',
      'asn_lookup',
      'certificate_transparency',
      'ssl_certificate_analysis',
      'http_headers',
      'technology_fingerprint',
      'ip_reputation',
      'public_leak_search',
      'brand_monitoring',
      'change_detection',
      'subdomain_enumeration_passive',
      'dns_wildcard_check',
    ],
    requires_approval_for: [],
    target_class_restrictions: ['third_party_public'],
    max_duration_minutes: 60,
    max_concurrent_jobs: 5,
    resource_limits: {
      max_cpu_cores: 1,
      max_memory_mb: 2048,
      max_bandwidth_mbps: 50,
    },
    created_at: createTimestamp('2026-08-21T00:00:00.000Z'),
    updated_at: createTimestamp('2026-08-21T00:00:00.000Z'),
    version: 1,
  },
] as const;

// ──────────────────────────────────────────────────────────────
// Profile Registry
// ──────────────────────────────────────────────────────────────

import type { ScanProfile as ScanProfileType } from '../types/core';

export class ProfileRegistry {
  private readonly profiles: Map<string, ScanProfileType>;

  constructor(profiles: ReadonlyArray<ScanProfileType> = SCAN_PROFILES) {
    this.profiles = new Map(profiles.map(p => [p.profile_id, p]));
  }

  get(profileId: string): ScanProfileType | undefined {
    return this.profiles.get(profileId);
  }

  getByType(profileType: string): ScanProfileType | undefined {
    return Array.from(this.profiles.values()).find(p => p.profile_type === profileType);
  }

  getAll(): ReadonlyArray<ScanProfileType> {
    return Array.from(this.profiles.values());
  }

  getForTargetClass(targetClass: 'owned' | 'authorized' | 'third_party_public'): ScanProfileType[] {
    return Array.from(this.profiles.values()).filter(p => 
      p.target_class_restrictions.includes(targetClass as 'owned' | 'authorized' | 'third_party_public')
    );
  }

  register(profile: ScanProfileType): void {
    if (this.profiles.has(profile.profile_id)) {
      throw new Error(`Profile ${profile.profile_id} already exists`);
    }
    this.profiles.set(profile.profile_id, profile);
  }

  unregister(profileId: string): boolean {
    return this.profiles.delete(profileId);
  }

  // Validate all registered profiles
  validateAll(): { valid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};
    
    for (const profile of this.profiles.values()) {
      const profileErrors: string[] = [];

      if (!profile.allowed_capabilities.length) {
        profileErrors.push('Profile must have at least one allowed capability');
      }

      const notAllowed = profile.default_enabled.filter(
        c => !profile.allowed_capabilities.includes(c)
      );
      if (notAllowed.length > 0) {
        profileErrors.push(`Default enabled not in allowed: ${notAllowed.join(', ')}`);
      }

      const notAllowedApproval = profile.requires_approval_for.filter(
        c => !profile.allowed_capabilities.includes(c)
      );
      if (notAllowedApproval.length > 0) {
        profileErrors.push(`Requires approval not in allowed: ${notAllowedApproval.join(', ')}`);
      }

      if (!profile.target_class_restrictions.length) {
        profileErrors.push('Must have at least one target class restriction');
      }

      if (profile.max_duration_minutes <= 0 || profile.max_duration_minutes > 1440) {
        profileErrors.push('max_duration_minutes must be 1-1440');
      }

      if (profileErrors.length > 0) {
        errors[profile.profile_id] = profileErrors;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export function createProfileRegistry(profiles?: ReadonlyArray<ScanProfile>): ProfileRegistry {
  return new ProfileRegistry(profiles ?? SCAN_PROFILES);
}