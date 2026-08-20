# Arch Audit Evaluation Framework

**Dato:** 2026-08-20  
**Versjon:** 1.0  
**Basert på:** Master Implementation Directive §49

---

## 1. Eval Filosofi

> **Prompts er produksjonskode. De må testes, versjoneres, og regressjonstestes.**

Ingen LLM-bruk i produksjon uten eval framework som verifiserer kvalitet.

---

## 2. Eval Kategorier

| Kategori | Beskrivelse | Mål |
|----------|-------------|-----|
| **Extraction Accuracy** | Hvor nøyaktig henter agent strukturert data fra ukstrukturerte kilder | > 90% F1 |
| **Classification Accuracy** | Hvor riktig klassifiserer agent (automation type, risk, evidence class) | > 85% accuracy |
| **Calculation Accuracy** | ROI, scoring, risk-beregninger (deterministisk, ingen LLM) | 100% (unit test) |
| **Evidence Grounding** | Alle funn har sporbar evidens, ingen hallucinerte referanser | 100% grounded |
| **Recommendation Quality** | Anbefalinger er handlingbare, prioriterte, med begrunnelse | Human eval > 4/5 |
| **False Positive Rate** | Muligheter som ikke bør automatiseres (REMOVE/SIMPLIFY) | < 10% |
| **Hallucination Rate** | Feilaktige claims, fantasi-integrasjoner, feil evidence-refs | < 2% |

---

## 3. Test Datasett (Golden Cases) §49

### 3.1 Minimum Scenarios

```typescript
// packages/evals/golden-cases.ts
export const GOLDEN_CASES = [
  {
    id: "obvious-automation",
    name: "Manuell dataoverføring mellom systemer",
    description: "Ansatt kopierer ordrer fra e-post til ERP, 500/mnd, 5 min/ordre",
    input: {
      interviews: ["Jeg kopierer ordrer manuelt fra Outlook til Visma, tar 5 min per ordre"],
      system_data: { api: "Visma", volume: 500, avg_time_min: 5 }
    },
    expected: {
      finding: "Manuell ordreoppfølging",
      automation_type: "CLASSIC_AUTOMATION",
      ai_feasibility: 90,
      data_readiness: 95,
      integration_feasibility: 90,
      recommended_autonomy: "A4_BOUNDED_AUTONOMY",
      evidence_class: "E4"
    }
  },
  
  {
    id: "bad-automation-candidate",
    name: "Kreativt designarbeid",
    description: "Designer lager unike presentasjoner per kunde, høy variasjon",
    input: {
      interviews: ["Hver presentasjon er unik, jeg bruker 3-4 timer, ingen mal passer"],
      system_data: { tools: ["PowerPoint", "Figma"], volume: 20, variance: "HIGH" }
    },
    expected: {
      finding: "Kreativt designarbeid",
      automation_type: "HUMAN_REQUIRED",
      ai_feasibility: 15,
      data_readiness: 20,
      recommended_autonomy: "A0_OBSERVE",
      reason: "Høy variasjon, kreativt arbeid, ingen klar regelbase"
    }
  },
  
  {
    id: "insufficient-evidence",
    name": "Prosess beskrevet av én person, ingen systemdata",
    description: "HR-avdeling sier de bruker 20% tid på onboarding, men ingen HR-system logger",
    input: {
      interviews: ["Vi bruker ca 20% av tiden på onboarding"],
      system_data: { hr_system: "BambooHR", logging: "NONE" }
    },
    expected: {
      finding: "Manuelt onboarding",
      evidence_class: "E1",
      confidence: 35,
      recommendation: "Først samle systemdata, så vurdere",
      flag: "INSUFFICIENT_EVIDENCE"
    }
  },
  
  {
    id: "conflicting-interviews",
    name: "To avdelinger sier ulikt om samme prosess",
    description: "Salg sier de bruker CRM, marketing sier de bruker spreadsheet",
    input: {
      interviews: [
        "Vi logger alt i HubSpot",
        "Vi bruker Excel for leads, HubSpot er ikke oppdatert"
      ],
      system_data: { hubspot: { leads: 1200, updated: "2024-01-15" } }
    },
    expected: {
      contradiction: {
        type: "INTERVIEW_VS_INTERVIEW",
        severity: "HIGH",
        claim: "CRM usage",
        interview_a: "All logging in HubSpot",
        interview_b: "Excel for leads, HubSpot outdated"
      },
      finding_confidence: "REDUCED",
      recommendation: "Verifiser med systemdata før anbefaling"
    }
  },
  
  {
    id: "wrong-roi-assumptions",
    name: "Kunde antar 90% tidsbesparelse, realistisk er 40%",
    description: "Ledelse tror AI kan automatisere nesten alt, men unntak er 60% av volum",
    input: {
      interviews: ["AI kan ta over nesten alt vi gjør"],
      system_data: { exception_rate: 0.6, volume: 1000 }
    },
    expected: {
      roi_scenarios: {
        low: { payback_months: 18, assumption: "40% automation" },
        expected: { payback_months: 12, assumption: "60% automation" },
        high: { payback_months: 8, assumption: "80% automation" }
      },
      variable_classification: {
        labor_reduction_pct: "ASSUMED",  // Ikke MEASURED
        exception_rate: "MEASURED"
      },
      flag: "ROI_ASSUMPTIONS_UNVERIFIED"
    }
  },
  
  {
    id: "sensitive-data",
    name: "Prosess håndterer personnummer og helsedata",
    description: "Pasientjournaler behandles manuelt, høy privacy-risiko",
    input: {
      interviews: ["Vi skriver inn pasientdata manuelt, tar 10 min per pasient"],
      system_data: { ehr: "DIPS", pii: true, health_data: true, gdpr: true }
    },
    expected: {
      risk: {
        privacy: "CRITICAL",
        legal: "HIGH",
        hallucination: "MEDIUM",
        overall: "CRITICAL"
      },
      recommended_autonomy: "A1_RECOMMEND",
      data_classification: "RESTRICTED",
      flag: "SENSITIVE_DATA"
    }
  },
  
  {
    id: "high-risk-task",
    name: "Godkjenning av kredittvedtak",
    description: "Kredittanalytiker godkjenner lån, feil kostar millioner",
    input: {
      interviews: ["Jeg vurderer kredittverdighet, feil er dyre"],
      system_data: { loan_system: "Basefarm", volume: 200, avg_amount: 2_000_000 }
    },
    expected: {
      risk: {
        financial: "CRITICAL",
        legal: "HIGH",
        irreversibility: "HIGH",
        overall: "CRITICAL"
      },
      recommended_autonomy: "A0_OBSERVE",
      requires_human_approval: true,
      flag: "HIGH_RISK_TASK"
    }
  },
  
  {
    id: "no-api",
    name: "Legacy system uten API, kun skjermskraping",
    description: "Hovedbokssystem fra 1990, ingen API, kun terminal-grensesnitt",
    input: {
      interviews: ["Vi logger inn på grønn skjerm, skriver inn manuelt"],
      system_data: { mainframe: "AS400", api: false, terminal: true }
    },
    expected: {
      automation_type: "RPA",
      integration_feasibility: 30,
      data_readiness: 40,
      recommended_technology: "RPA",
      flag: "NO_API"
    }
  },
  
  {
    id: "process-should-be-removed",
    name: "Rapportering som ingen leser",
    description: "Ukedaglig rapport produseres, sendes til 15 personer, ingen bruker den",
    input: {
      interviews: ["Vi lager denne rapporten hver dag, men ingen bruker den"],
      system_data: { report_volume: 5, recipients: 15, open_rate: 0.02 }
    },
    expected: {
      automation_type: "REMOVE",
      recommendation: "Slutt å produsere rapporten",
      savings: "5 timer/uke",
      flag: "PROCESS_SHOULD_BE_REMOVED"
    }
  },
  
  {
    id: "deterministic-better-than-ai",
    name: "Regelbasert prisberegning",
    description: "Pris = grunnpris * (1 + rabatt) * moms, alltid samme formel",
    input: {
      interviews: ["Vi regner ut pris manuelt i Excel, samme formel hver gang"],
      system_data: { formula: "price = base * (1+discount) * 1.25", volume: 10000 }
    },
    expected: {
      automation_type: "CLASSIC_AUTOMATION",
      ai_feasibility: 10,  // AI trengs ikke
      data_readiness: 100,
      integration_feasibility: 100,
      recommended_technology: "CLASSIC_AUTOMATION",
      reason: "Deterministisk regel, AI gir ingen verdi over kode",
      flag: "DETERMINISTIC_BETTER_THAN_AI"
    }
  },
  
  {
    id: "hallucinated-integration",
    name: "Agent antar API som ikke eksisterer",
    description: "Agent foreslår å integrere mot 'Visma API v3', men v3 eksisterer ikke",
    input: {
      interviews: ["Vi bruker Visma"],
      system_data: { visma: { api_version: "v2", v3_exists: false } }
    },
    expected: {
      hallucination: {
        type: "INTEGRATION_HALLUCINATION",
        claim: "Visma API v3",
        reality: "Only v2 exists",
        severity: "HIGH"
      },
      flag: "HALLUCINATED_INTEGRATION"
    }
  },
  
  {
    id: "ambiguous-evidence",
    name: "Intervju gir tvetydig svar",
    description: "'Nok 10-15 min per ordre, avhenger av kompleksitet'",
    input: {
      interviews: ["Det tar nok 10-15 min, avhenger av kompleksitet"],
      system_data: { avg_time: 12, variance: 0.4 }
    },
    expected: {
      evidence_class: "E1",
      confidence_range: "30-50",
      recommendation: "Spesifiser: hva driver variansen? Spør oppfølgingsspørsmål",
      flag: "AMBIGUOUS_EVIDENCE"
    }
  }
];
```

---

## 4. Eval Metrics

### 4.1 Extraction Accuracy

```typescript
interface ExtractionEval {
  // Felter som skal trekkes ut
  fields: [
    "process_name",
    "volume_per_period", 
    "avg_duration_seconds",
    "systems_involved",
    "pain_points",
    "current_tools",
    "exception_description"
  ];
  
  // Metrics per felt
  metrics: {
    precision: number;    // Av trekkede, hvor mange er riktige?
    recall: number;       // Av faktiske, hvor mange ble trukket?
    f1: number;
  };
  
  // Target
  target_f1: 0.90;
}
```

### 4.2 Classification Accuracy

```typescript
interface ClassificationEval {
  categories: [
    "automation_type",     // 11 typer
    "risk_level",          // 4 nivåer
    "evidence_class",      // E0-E4
    "autonomy_level",      // A0-A5
    "data_readiness",      // 0-100 (bucket)
    "ai_feasibility"       // 0-100 (bucket)
  ];
  
  metrics: {
    accuracy: number;      // Exact match
    macro_f1: number;      // Per klasse
    weighted_f1: number;
  };
  
  target_accuracy: 0.85;
}
```

### 4.3 Evidence Grounding

```typescript
interface GroundingEval {
  checks: {
    // Alle funn har minst 1 evidence_id
    findings_have_evidence: boolean;
    
    // Alle evidence_ids eksisterer i DB
    evidence_refs_valid: boolean;
    
    // Evidence classification matcher innhold
    evidence_classification_consistent: boolean;
    
    // Ingen funn med kun E0/E1 for kritiske anbefalinger
    no_critical_on_weak_evidence: boolean;
    
    // Contradictions flagget
    contradictions_detected: boolean;
  };
  
  target: 1.0;  // 100% grounded
}
```

---

## 5. Eval Runner

```typescript
// packages/evals/src/runner.ts
export class EvalRunner {
  private cases: GoldenCase[];
  private agents: Map<string, Agent>;
  
  async runAll(): Promise<EvalReport> {
    const results: CaseResult[] = [];
    
    for (const case_ of this.cases) {
      const result = await this.runCase(case_);
      results.push(result);
    }
    
    return this.aggregate(results);
  }
  
  async runCase(goldenCase: GoldenCase): Promise<CaseResult> {
    // 1. Kjør audit pipeline med test input
    const auditResult = await this.runAudit(goldenCase.input);
    
    // 2. Evaluer mot forventet
    const extraction = this.evalExtraction(auditResult, goldenCase.expected);
    const classification = this.evalClassification(auditResult, goldenCase.expected);
    const grounding = this.evalGrounding(auditResult);
    const contradiction = this.evalContradiction(auditResult, goldenCase.expected);
    const hallucination = this.evalHallucination(auditResult, goldenCase.expected);
    const roi = this.evalROI(auditResult, goldenCase.expected);
    
    return {
      case_id: goldenCase.id,
      extraction,
      classification,
      grounding,
      contradiction,
      hallucination,
      roi,
      passed: this.allPassed([extraction, classification, grounding, contradiction, hallucination, roi])
    };
  }
  
  private evalExtraction(result: AuditResult, expected: Expected): ExtractionScore {
    // Sammenlign trekkede felter med forventet
    const extracted = result.extractedFields;
    const expected_fields = expected.extracted_fields ?? {};
    
    let tp = 0, fp = 0, fn = 0;
    for (const [key, expectedVal] of Object.entries(expected_fields)) {
      const actualVal = extracted[key];
      if (actualVal !== undefined) {
        if (this.valuesMatch(actualVal, expectedVal)) tp++;
        else fp++;
      } else {
        fn++;
      }
    }
    
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1 = 2 * precision * recall / (precision + recall) || 0;
    
    return { precision, recall, f1, passed: f1 >= 0.9 };
  }
  
  private evalHallucination(result: AuditResult, expected: Expected): HallucinationScore {
    const flags = result.flags ?? [];
    const expectedFlags = expected.flags ?? [];
    
    // Sjekk forventede hallucination flags
    let detected = 0;
    for (const flag of expectedFlags) {
      if (flags.includes(flag)) detected++;
    }
    
    // Sjekk uforventede claims (integration, API, tall)
    const unexpectedClaims = this.detectUnexpectedClaims(result);
    
    return {
      expected_flags_detected: detected,
      expected_flags_total: expectedFlags.length,
      unexpected_claims: unexpectedClaims.length,
      passed: detected === expectedFlags.length && unexpectedClaims.length === 0
    };
  }
}
```

---

## 6. Regression Testing

```typescript
// packages/evals/src/regression.ts
export class RegressionTester {
  // Kjør eval mot forrige baseline
  async runRegression(baseline: EvalReport): Promise<RegressionReport> {
    const current = await this.runAll();
    
    const regressions: Regression[] = [];
    
    for (const [caseId, currentResult] of Object.entries(current.caseResults)) {
      const baselineResult = baseline.caseResults[caseId];
      if (!baselineResult) continue;
      
      // Sjekk alle metrics
      for (const metric of METRICS) {
        const curr = currentResult[metric];
        const base = baselineResult[metric];
        
        if (curr < base * REGRESSION_THRESHOLD) {
          regressions.push({
            case_id: caseId,
            metric,
            baseline: base,
            current: curr,
            delta: curr - base,
            severity: curr < base * 0.9 ? "HIGH" : "MEDIUM"
          });
        }
      }
    }
    
    return { regressions, passed: regressions.length === 0 };
  }
}

const REGRESSION_THRESHOLD = 0.95; // Tillat 5% regresjon
const METRICS = ["extraction_f1", "classification_accuracy", "grounding_score", "hallucination_rate", "false_positive_rate"];
```

---

## 7. CI/CD Integration

```yaml
# .github/workflows/evals.yml
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      
      - name: Install deps
        run: npm ci
      
      - name: Run evals
        run: npm run eval:all
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      
      - name: Check regression
        run: npm run eval:regression
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: eval-results/
      
      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('eval-results/report.json'));
            const body = `## Eval Results\n\n| Case | Extraction F1 | Classification | Grounding | Hallucination |\n|------|---------------|----------------|-----------|---------------|\n${Object.entries(report.caseResults).map(([id, r]) => 
              `| ${id} | ${r.extraction.f1.toFixed(2)} | ${r.classification.accuracy.toFixed(2)} | ${r.grounding.score.toFixed(2)} | ${r.hallucination.rate.toFixed(2)} |`
            ).join('\n')}\n\n**Overall: ${report.passed ? '✅ PASS' : '❌ FAIL'}'`;
            github.rest.issues.createComment({...});
```

---

## 8. Prompt Versioning (§48)

```typescript
// packages/evals/src/prompt-versioning.ts
interface PromptVersion {
  id: string;                    // "discovery-system-mining-v1.2.0"
  agent_id: string;              // "discovery"
  operation: string;             // "system_mining"
  version: string;               // "1.2.0"
  prompt: string;                // Full system + user prompt template
  schema: z.ZodSchema;           // Output schema
  model: string;                 // "gpt-4o"
  provider: string;              // "openai"
  created_at: string;
  created_by: string;
  eval_results: EvalResult;      // Siste eval resultat
  baseline_results?: EvalResult; // For regresjonstest
  changelog: string;             // Hva endret seg
}

// Register i D1
CREATE TABLE prompt_versions (
  id TEXT PRIMARY KEY,
  agent_id TEXT,
  operation TEXT,
  version TEXT,
  prompt TEXT,
  schema TEXT,
  model TEXT,
  provider TEXT,
  created_at TEXT,
  created_by TEXT,
  eval_results TEXT,
  baseline_results TEXT,
  changelog TEXT
);
```

---

## 8. Eval Dashboard

```typescript
// Dashboard data
interface EvalDashboard {
  // Overall health
  overall_pass_rate: number;        // % cases passed
  avg_extraction_f1: number;
  avg_classification_accuracy: number;
  avg_grounding_score: number;
  hallucination_rate: number;
  false_positive_rate: number;
  
  // Per agent
  by_agent: Record<string, AgentEvalSummary>;
  
  // Per model
  by_model: Record<string, ModelEvalSummary>;
  
  // Trends (last 30 runs)
  trends: {
    extraction_f1: number[];
    classification_accuracy: number[];
    hallucination_rate: number[];
  };
  
  // Regressions
  recent_regressions: Regression[];
}
```

---

## 9. Sjekkliste for Eval Launch

```markdown
## Eval Launch Gate

### Golden Cases
- [ ] Alle 12+ golden cases definert
- [ ] Cases dekker alle §49 scenarios
- [ ] Expected outputs dokumentert
- [ ] Evidence classes forventet
- [ ] Flags forventet

### Metrics
- [ ] Extraction F1 target ≥ 0.90
- [ ] Classification accuracy target ≥ 0.85
- [ ] Grounding target 100%
- [ ] Hallucination rate target < 2%
- [ ] False positive rate target < 10%

### Runner
- [ ] Eval runner kjører alle cases
- [ ] Resultater aggregert til rapport
- [ ] Regression tester mot baseline
- [ ] CI/CD integrert (github actions)

### Prompt Versioning
- [ ] Prompts lagres i D1 med versjon
- [ ] Schema per prompt versjon
- [ ] Eval resultat per versjon
- [ ] Changelog per versjon

### Dashboard
- [ ] Overall pass rate
- [ ] Per agent/model breakdown
- [ ] Trend linjer (30 runs)
- [ ] Regression alerts

### CI/CD
- [ ] Evals kjører på PR
- [ ] Regression gate på main
- [ ] Artefakt upload
- [ ] PR kommentar med resultater
```