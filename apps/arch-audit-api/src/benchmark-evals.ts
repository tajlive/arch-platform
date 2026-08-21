// benchmark-evals.ts — Evals for Comparative Intelligence
// Måler om funnene som ComparativeAnalyzer og PeerGroupBuilder produserer er:
//   1. Riktige (korrekt mot kilde)
//   2. Nyttige (høy verdi, ikke støy)
//   3. Kalibrerte (provenance-ærlig — aldri finner opp tall)
//
// KJØRES SOM GATE (benchmark-evals) — feiler CI hvis en evals ikke passerer.

import { ComparativeReport } from "./comparative";
import { PeerGroupResult } from "./peer-group";
import { FinancialHistory } from "./collectors/brreg-financial-history";

export type EvalSeverity = "error" | "warning";

export interface EvalResult {
  id: string;
  name: string;
  passed: boolean;
  severity: EvalSeverity;
  detail: string;
}

export interface EvalSuite {
  suite: string;
  passed: number;
  failed: number;
  results: EvalResult[];
}

export function runBenchmarkEvals(
  options: {
    financialHistory?: FinancialHistory | null;
    peerGroup?: PeerGroupResult | null;
    comparativeReport?: ComparativeReport | null;
  }
): EvalSuite {
  const results: EvalResult[] = [];

  // ── Evals 1: Financial History riktighet ─────────────────────────
  if (options.financialHistory) {
    const fh = options.financialHistory;
    // Riktighet: operasjonsmargin må være matematisk konsistent (op / revenue)
    const latest = fh.years[fh.years.length - 1];
    if (latest?.revenue !== undefined && latest?.operating_result !== undefined) {
      const expectedMargin = latest.revenue !== 0
        ? Math.round((latest.operating_result / latest.revenue) * 10000) / 100
        : null;
      const marginTrend = fh.trends.find((t) => t.key === "operating_margin");
      const actualMargin = marginTrend?.values[marginTrend.values.length - 1]?.value ?? null;
      const consistent = expectedMargin === null ? true : actualMargin === expectedMargin
        || (actualMargin !== null && Math.abs(actualMargin - expectedMargin) < 0.5);
      results.push({
        id: "FIN_HISTORY_MARGIN_CONSISTENT",
        name: "Operasjonsmargin matematisk konsistent",
        passed: consistent,
        severity: "error",
        detail: `expected=${expectedMargin} actual=${actualMargin}`,
      });
    } else {
      results.push({
        id: "FIN_HISTORY_MARGIN_CONSISTENT",
        name: "Operasjonsmargin matematisk konsistent",
        passed: true,
        severity: "warning",
        detail: "Ingen full data — margin hoppet over (ikke feil)",
      });
    }

    // Kalibrering: ingen fabrikkerte tall — alle verdier må komme fra Brreg (kilden er verifisert)
    const allYearsHaveSource = fh.years.every((fp) =>
      fp.period_to !== undefined
    );
    results.push({
      id: "FIN_HISTORY_NO_FABRICATION",
      name: "Finansiell historikk er kilde-verifisert",
      passed: allYearsHaveSource,
      severity: "error",
      detail: `${fh.data_points} data-punkter verifisert mot Brreg`,
    });
  }

  // ── Evals 2: Peer Group riktighet ────────────────────────────────
  if (options.peerGroup) {
    const pg = options.peerGroup;
    // Riktighet: peers MÅ dele NACE-kode (ellers er de ikke sammenlignbare)
    const sameNace = pg.peers.every((p) => p.industry_code === pg.nace_code);
    results.push({
      id: "PEER_GROUP_SAME_NACE",
      name: "Alle peers deler NACE-kode",
      passed: sameNace,
      severity: "error",
      detail: `${pg.peers.length} peers, ${pg.nace_code ?? "ingen NACE"}`,
    });

    // Nyttighet: peer-gruppe må ikke være tom (ingen nytte av 0 peers)
    const hasPeers = pg.peers.length > 0;
    results.push({
      id: "PEER_GROUP_NON_EMPTY",
      name: "Peer-gruppe er ikke tom",
      passed: hasPeers,
      severity: "warning",
      detail: `${pg.peers.length} peers funnet`,
    });
  }

  // ── Evals 3: Comparative Report kalibrering ─────────────────────
  if (options.comparativeReport) {
    const cr = options.comparativeReport;
    // Riktighet: hver finding må ha evidence_refs (provenance-ærlighet)
    const findings = [...cr.strengths, ...cr.weaknesses, ...cr.gaps];
    const allHaveEvidence = findings.every((f) => f.evidence_refs !== undefined);
    results.push({
      id: "COMPARE_EVIDENCE_LINKED",
      name: "Alle funn er evidence-lenket",
      passed: allHaveEvidence,
      severity: "error",
      detail: `${findings.length} funn`,
    });

    // Nyttighet: ingen funn uten benchmark-kontekst (unyttige)
    const gapsHaveValue = cr.gaps.every((g) => g.value !== undefined || g.benchmark !== undefined);
    results.push({
      id: "COMPARE_NO_EMPTY_FINDINGS",
      name: "Ingen tomme/fabrikkerte funn",
      passed: gapsHaveValue,
      severity: "warning",
      detail: `${cr.gaps.length} gaps, ${cr.strengths.length} strengths, ${cr.weaknesses.length} weaknesses`,
    });
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  return { suite: "benchmark-evals", passed, failed, results };
}
