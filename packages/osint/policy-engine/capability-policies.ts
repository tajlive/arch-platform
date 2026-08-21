// packages/osint/policy-engine/capability-policies.ts
// Capability to Operation Class mapping - Single source of truth for policy

import type { Capability, OperationClass, CapabilityPolicy } from '../types/core';

// ──────────────────────────────────────────────────────────────
// Capability → Operation Class Mapping
// ──────────────────────────────────────────────────────────────

export const CAPABILITY_POLICIES: ReadonlyArray<CapabilityPolicy> = [
  // ────────────────────────────────────────────────────────────
  // PASSIVE ALLOWED (all target classes)
  // ────────────────────────────────────────────────────────────
  {
    capability: 'dns_lookup',
    operation_class: 'passive_allowed',
    description: 'Standard DNS A/AAAA/MX/TXT lookup',
    risk_level: 'none',
    traffic_signature: 'minimal'
  },
  {
    capability: 'whois_lookup',
    operation_class: 'passive_allowed',
    description: 'Public WHOIS/RDAP lookup',
    risk_level: 'none',
    traffic_signature: 'minimal'
  },
  {
    capability: 'asn_lookup',
    operation_class: 'passive_allowed',
    description: 'ASN lookup via public registries',
    risk_level: 'none',
    traffic_signature: 'minimal'
  },
  {
    capability: 'certificate_transparency',
    operation_class: 'passive_allowed',
    description: 'CT log queries',
    risk_level: 'none',
    traffic_signature: 'minimal'
  },
  {
    capability: 'ssl_certificate_analysis',
    operation_class: 'passive_allowed',
    description: 'TLS cert fetch via public endpoint',
    risk_level: 'none',
    traffic_signature: 'minimal'
  },
  {
    capability: 'http_headers',
    operation_class: 'passive_allowed',
    description: 'HEAD/GET for headers only',
    risk_level: 'none',
    traffic_signature: 'minimal'
  },
  {
    capability: 'technology_fingerprint',
    operation_class: 'passive_allowed',
    description: 'Wappalyzer-style passive fingerprint',
    risk_level: 'none',
    traffic_signature: 'minimal'
  },
  {
    capability: 'ip_reputation',
    operation_class: 'passive_allowed',
    description: 'Public reputation APIs (AbuseIPDB, etc)',
    risk_level: 'none',
    traffic_signature: 'minimal'
  },
  {
    capability: 'public_leak_search',
    operation_class: 'passive_allowed',
    description: 'Search public pastebins, GitHub, etc',
    risk_level: 'low',
    traffic_signature: 'minimal'
  },
  {
    capability: 'brand_monitoring',
    operation_class: 'passive_allowed',
    description: 'Brand/keyword search in public sources',
    risk_level: 'none',
    traffic_signature: 'minimal'
  },
  {
    capability: 'change_detection',
    operation_class: 'passive_allowed',
    description: 'Diff of previously observed public state',
    risk_level: 'none',
    traffic_signature: 'none'
  },
  {
    capability: 'subdomain_enumeration_passive',
    operation_class: 'passive_allowed',
    description: 'CT logs, DNSDB, VirusTotal, etc',
    risk_level: 'low',
    traffic_signature: 'minimal'
  },
  {
    capability: 'dns_wildcard_check',
    operation_class: 'passive_allowed',
    description: 'Test for wildcard DNS',
    risk_level: 'low',
    traffic_signature: 'minimal'
  },

  // ────────────────────────────────────────────────────────────
  // ACTIVE REQUIRES APPROVAL (owned + authorized only)
  // ────────────────────────────────────────────────────────────
  {
    capability: 'dns_zone_transfer',
    operation_class: 'active_requires_approval',
    description: 'AXFR/IXFR attempt',
    risk_level: 'medium',
    traffic_signature: 'moderate'
  },
  {
    capability: 'dns_bruteforce',
    operation_class: 'active_requires_approval',
    description: 'Dictionary-based subdomain brute force',
    risk_level: 'medium',
    traffic_signature: 'high'
  },
  {
    capability: 'subdomain_enumeration_active',
    operation_class: 'active_requires_approval',
    description: 'Active permutation/alteration',
    risk_level: 'medium',
    traffic_signature: 'high'
  },
  {
    capability: 'http_crawl_authenticated',
    operation_class: 'active_requires_approval',
    description: 'Authenticated crawling',
    risk_level: 'high',
    traffic_signature: 'high'
  },
  {
    capability: 'port_scan_tcp',
    operation_class: 'active_requires_approval',
    description: 'TCP SYN/connect scan',
    risk_level: 'high',
    traffic_signature: 'high'
  },
  {
    capability: 'port_scan_udp',
    operation_class: 'active_requires_approval',
    description: 'UDP scan',
    risk_level: 'high',
    traffic_signature: 'high'
  },
  {
    capability: 'vulnerability_scan_active',
    operation_class: 'active_requires_approval',
    description: 'Active vulnerability probing',
    risk_level: 'high',
    traffic_signature: 'high'
  },
  {
    capability: 'credential_testing',
    operation_class: 'active_requires_approval',
    description: 'Default/weak credential testing',
    risk_level: 'critical',
    traffic_signature: 'high'
  },
  {
    capability: 'smtp_enumeration',
    operation_class: 'active_requires_approval',
    description: 'VRFY/EXPN/RCPT TO enumeration',
    risk_level: 'medium',
    traffic_signature: 'moderate'
  },
  {
    capability: 's3_bucket_enumeration',
    operation_class: 'active_requires_approval',
    description: 'Bucket name permutation',
    risk_level: 'medium',
    traffic_signature: 'moderate'
  },

  // ────────────────────────────────────────────────────────────
  // FORBIDDEN (all target classes)
  // ────────────────────────────────────────────────────────────
  {
    capability: 'exploit_execution',
    operation_class: 'forbidden',
    description: 'Exploit execution',
    risk_level: 'critical',
    traffic_signature: 'high'
  },
  {
    capability: 'privilege_escalation',
    operation_class: 'forbidden',
    description: 'Post-exploitation',
    risk_level: 'critical',
    traffic_signature: 'high'
  },
  {
    capability: 'lateral_movement',
    operation_class: 'forbidden',
    description: 'Network pivoting',
    risk_level: 'critical',
    traffic_signature: 'high'
  },
  {
    capability: 'data_exfiltration',
    operation_class: 'forbidden',
    description: 'Data extraction',
    risk_level: 'critical',
    traffic_signature: 'high'
  },
  {
    capability: 'denial_of_service',
    operation_class: 'forbidden',
    description: 'DoS/DDoS',
    risk_level: 'critical',
    traffic_signature: 'high'
  },
  {
    capability: 'social_engineering',
    operation_class: 'forbidden',
    description: 'Phishing/vishing/smishing',
    risk_level: 'critical',
    traffic_signature: 'high'
  },
] as const;

// ──────────────────────────────────────────────────────────────
// Lookup helpers
// ──────────────────────────────────────────────────────────────

export const CAPABILITY_POLICY_MAP: ReadonlyMap<string, CapabilityPolicy> = new Map(
  CAPABILITY_POLICIES.map(p => [p.capability, p])
);

export function getCapabilityPolicy(capability: string): CapabilityPolicy | undefined {
  return CAPABILITY_POLICY_MAP.get(capability);
}

export function getOperationClass(capability: string): OperationClass | undefined {
  return CAPABILITY_POLICY_MAP.get(capability)?.operation_class;
}

export function isCapabilityAllowed(capability: string, targetClass: string, hasApproval: boolean): boolean {
  const policy = getCapabilityPolicy(capability);
  if (!policy) return false;
  
  if (policy.operation_class === 'forbidden') return false;
  if (policy.operation_class === 'passive_allowed') return true;
  if (policy.operation_class === 'active_requires_approval') {
    if (targetClass === 'third_party_public') return false;
    return hasApproval;
  }
  return false;
}

// Export all capabilities as readonly array for iteration
export const ALL_CAPABILITIES: ReadonlyArray<Capability> = CAPABILITY_POLICIES.map(p => p.capability);

// Group capabilities by operation class for UI/profile building
export const CAPABILITIES_BY_CLASS: Readonly<Record<OperationClass, ReadonlyArray<Capability>>> = {
  passive_allowed: CAPABILITY_POLICIES
    .filter(p => p.operation_class === 'passive_allowed')
    .map(p => p.capability),
  active_requires_approval: CAPABILITY_POLICIES
    .filter(p => p.operation_class === 'active_requires_approval')
    .map(p => p.capability),
  forbidden: CAPABILITY_POLICIES
    .filter(p => p.operation_class === 'forbidden')
    .map(p => p.capability),
};