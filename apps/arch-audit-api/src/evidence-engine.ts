// evidence-engine.ts — Evidence Engine v1
//
// Samler datakilder til én «intelligence report» for en virksomhet.
// Kilder (verifisert i prod 2026-08-20):
//   ✓ brreg-enhet    — Brønnøysund Enhetsregisteret (identitet, roller, ansatte)
//   ✓ brreg-regnskap — Brønnøysund Regnskapsregisteret (driftsresultat, resultat, EK, gjeld, revisjon)
//   ✓ website        — nettsideanalyse (tech stack, kanaler) — rate-limit-sensitiv, fallback
//   ✗ nav-stillinger — krever bearer-auth (404 på public-feed) → markeres NOT_AVAILABLE
//   ✗ ssb-bransje    — feil endepunkt (400) → markeres NOT_AVAILABLE
//   ✗ kunngjoringer  — 404 → markeres NOT_AVAILABLE
//
// Prinsipp: en utilgjengelig kilde markeres ærlig — aldri late som den finnes.

import { BrregCompany } from "./adapters";
import {
  IntelligenceReport,
  ResearchOrchestrator,
} from "./research-orchestrator";

export type {
  CompanyIntelligenceGraph,
  DigitalFootprint,
  EvidenceSource,
  FinancialProfile,
  IntelligenceReport,
  LeadershipRole,
  SourceStatus,
} from "./research-orchestrator";

// ── Evidence Engine ─────────────────────────────────────────

export class EvidenceEngine {
  private orchestrator = new ResearchOrchestrator();

  async analyze(query: string): Promise<{ company: BrregCompany; report: IntelligenceReport }> {
    return this.orchestrator.run(query);
  }
}
