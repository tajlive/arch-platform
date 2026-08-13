#!/usr/bin/env node
/**
 * Arch Health Score v2.2 — vektet + evidence/provenance.
 *
 * v2.2 (2026-08-13) — multi-package + eksterne prosjekter:
 *   - `.arch/*`-sjekker = NOT_APPLICABLE for prosjekter uten `.arch/project.yaml`
 *     (eksterne kunder), i stedet for FAIL — eksterne straffes ikke for å ikke
 *     bruke Arch-governance.
 *   - Test-deteksjon er rekursiv (mono-repo: frontend/ + api/<worker>/ + e2e/), ikke bare root.
 *   - Total beregnes kun over AKTIVE kategorier (N/A-ekskludert), ikke tvunget 0.
 *   - Beslutningslogg aksepterer `docs/adr/` (industristandard) for eksterne prosjekter.
 *
 * Kategorier (vekt): Governance 20 · Security 25 · Engineering 25 · Operations 20 · Documentation 10.
 *
 * Hver sjekk returnerer: { result: PASS|FAIL|UNKNOWN|NOT_APPLICABLE, evidence, source, observed_at }.
 *   PASS            — verifisert OK (evidence = fil/kilde)
 *   FAIL            — verifisert mangelfull (evidence = hva som mangler)
 *   UNKNOWN         — ikke verifiserbar → telles som IKKE-healthy (fail-safe)
 *   NOT_APPLICABLE  — utenfor prosjektets omfang → ekskluderes fra nevner
 *
 * Kategori-score = PASS / (PASS + FAIL + UNKNOWN) × 100  (N/A ekskludert).
 * TOTAL = Σ(kategori% × vekt) / Σ(vekt for aktive kategorier).
 *
 * Bruk: node health-score.mjs [katalog] [--json]
 */
import { existsSync, readdirSync, statSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const dir = resolve(args.find((a) => !a.startsWith("--")) ?? ".");
const base = join(dir, ".arch");
const NOW = new Date().toISOString();

const has = (rel) => existsSync(join(dir, rel));
const hasArch = (rel) => existsSync(join(base, rel));
const archManaged = hasArch("project.yaml");
const grep = (rel, re) => {
  const p = join(dir, rel);
  return existsSync(p) && re.test(readFileSync(p, "utf8"));
};
const anyWorkflow = () => {
  const wf = join(dir, ".github", "workflows");
  return existsSync(wf) && readdirSync(wf).some((f) => /\.(yml|yaml)$/.test(f));
};
const grepWorkflows = (re) => {
  const wf = join(dir, ".github", "workflows");
  if (!existsSync(wf)) return false;
  return readdirSync(wf).some((f) => /\.(yml|yaml)$/.test(f) && re.test(readFileSync(join(wf, f), "utf8")));
};

// Rekursiv fil-oppsamling (multi-package aware)
const SKIP = new Set([
  "node_modules", ".git", ".wrangler", ".venv-pdf", ".venv", "venv",
  "dist", "dist-mirror", "allure-results", "allure-report", ".next",
  ".worktrees", ".chrome-profile", "output", "logs", "__pycache__",
  ".src-backup-20260527-012916",
]);
const collectFiles = (d, depth = 10) => {
  const out = [];
  const walk = (p, n) => {
    if (n < 0) return;
    let entries;
    try { entries = readdirSync(p); } catch { return; }
    for (const name of entries) {
      if (SKIP.has(name)) continue;
      const fp = join(p, name);
      let isDir = false;
      try { isDir = statSync(fp).isDirectory(); } catch { continue; }
      if (isDir) walk(fp, n - 1);
      else out.push(fp);
    }
  };
  walk(d, depth);
  return out;
};
const allFiles = collectFiles(dir);
const basenameOf = (p) => p.split("/").pop();

const hasTests = () => allFiles.some((f) => /\.(test|spec)\.[jt]sx?$/.test(f));

const TEST_RUNNER_CONFIGS = [
  "vitest.config.ts", "vitest.config.mts", "vitest.config.js", "vitest.config.mjs", "vitest.workspace.ts",
  "jest.config.js", "jest.config.ts", "jest.config.mjs",
  "playwright.config.ts", "playwright.config.js", "playwright.config.mjs", "playwright.config.cjs",
];
const hasTestRunner = () => allFiles.some((f) => TEST_RUNNER_CONFIGS.includes(basenameOf(f)));

// file-check helper: PASS/FAIL med evidence; .arch/* → N/A utenfor Arch-styrte prosjekter
const na = () => ({ result: "NOT_APPLICABLE", evidence: "utenfor Arch-governance-scope", source: "n/a", observed_at: NOW });
const fileCheck = (label, rel, evidenceHint) => ({
  id: rel, label,
  run: () => {
    if (rel.startsWith(".arch/")) {
      if (!archManaged) return na();
      return hasArch(rel.slice(6))
        ? { result: "PASS", evidence: rel, source: "fil", observed_at: NOW }
        : { result: "FAIL", evidence: `mangler ${rel}`, source: "fil", observed_at: NOW };
    }
    return has(rel)
      ? { result: "PASS", evidence: rel, source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: `mangler ${rel}`, source: "fil", observed_at: NOW };
  },
});

const WEIGHTS = { Governance: 20, Security: 25, Engineering: 25, Operations: 20, Documentation: 10 };

const categories = [
  ["Governance", [
    fileCheck("project.yaml", ".arch/project.yaml"),
    fileCheck("policies.yaml", ".arch/policies.yaml"),
    fileCheck("agents.yaml", ".arch/agents.yaml"),
    fileCheck("audit-log.md", ".arch/audit-log.md"),
    fileCheck("decisions.md", ".arch/decisions.md"),
  ]],
  ["Security", [
    fileCheck("secrets registry", ".arch/secrets/registry.yaml"),
    fileCheck("secrets mapping", ".arch/secrets/mapping.yaml"),
    { id: "gitignore .env", label: ".env gitignoret", run: () => (grep(".gitignore", /(^|\n)\s*\.env(\s|\n|$)/)
      ? { result: "PASS", evidence: ".gitignore", source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: ".env ikke gitignoret", source: "fil", observed_at: NOW }) },
    { id: "secret-policy", label: "secret-policy i policies", run: () => (archManaged
      ? (grep(".arch/policies.yaml", /secret/i)
        ? { result: "PASS", evidence: ".arch/policies.yaml", source: "fil", observed_at: NOW }
        : { result: "FAIL", evidence: "mangler secret-policy", source: "fil", observed_at: NOW })
      : na()) },
  ]],
  ["Engineering", [
    fileCheck("package.json", "package.json"),
    { id: "workflow", label: "CI-workflow", run: () => (anyWorkflow()
      ? { result: "PASS", evidence: ".github/workflows/", source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: "mangler workflow", source: "fil", observed_at: NOW }) },
    { id: "tests", label: "tester tilstede", run: () => (hasTests()
      ? { result: "PASS", evidence: "test-filer funnet", source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: "ingen test-filer", source: "fil", observed_at: NOW }) },
    { id: "test-runner", label: "test-runner konfig", run: () => (hasTestRunner()
      ? { result: "PASS", evidence: "test-runner konfig", source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: "mangler test-runner", source: "fil", observed_at: NOW }) },
  ]],
  ["Operations", [
    fileCheck("deploy workflow", ".github/workflows/deploy.yml"),
    { id: "monitoring", label: "monitoring", run: () => (grepWorkflows(/monitor|uptime/i) || (existsSync(join(dir, "scripts")) && readdirSync(join(dir, "scripts")).some((f) => /monitor/i.test(f)))
      ? { result: "PASS", evidence: "monitor tilstede", source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: "ingen monitor", source: "fil", observed_at: NOW }) },
    { id: "alerts", label: "alert-integrasjon", run: () => (grepWorkflows(/alert|linear|fingerprint|notify/i) || existsSync(join(dir, "scripts/lib/escalation-rules.mjs"))
      ? { result: "PASS", evidence: "alert-integrasjon", source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: "ingen alert-integrasjon", source: "fil", observed_at: NOW }) },
    { id: "rollback", label: "rollback", run: () => (grepWorkflows(/rollback/i)
      ? { result: "PASS", evidence: "rollback i workflow", source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: "ingen rollback", source: "fil", observed_at: NOW }) },
  ]],
  ["Documentation", [
    { id: "readme", label: "README", run: () => (has("README.md") || has("docs/README.md")
      ? { result: "PASS", evidence: "README.md", source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: "mangler README", source: "fil", observed_at: NOW }) },
    { id: "architect", label: "ARCHITECT", run: () => (has("ARCHITECT.md") || has("docs/ARCHITECT.md")
      ? { result: "PASS", evidence: "ARCHITECT.md", source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: "mangler ARCHITECT", source: "fil", observed_at: NOW }) },
    { id: "api-docs", label: "API-dokumentasjon", run: () => (existsSync(join(dir, "docs")) && readdirSync(join(dir, "docs")).some((f) => /api|openapi/i.test(f))
      ? { result: "PASS", evidence: "docs/api", source: "fil", observed_at: NOW }
      : { result: "FAIL", evidence: "mangler API-docs", source: "fil", observed_at: NOW }) },
    { id: "decisions", label: "beslutningslogg", run: () => {
      if (archManaged) {
        return (hasArch("decisions.md") || hasArch("knowledge/decisions"))
          ? { result: "PASS", evidence: "decisions", source: "fil", observed_at: NOW }
          : { result: "FAIL", evidence: "mangler decisions", source: "fil", observed_at: NOW };
      }
      return has("docs/adr")
        ? { result: "PASS", evidence: "docs/adr/", source: "fil", observed_at: NOW }
        : { result: "FAIL", evidence: "mangler beslutningslogg (docs/adr)", source: "fil", observed_at: NOW };
    } },
  ]],
];

const result = { name: dir.split("/").pop(), total: 0, categories: {}, observed_at: NOW, arch_managed: archManaged };
for (const [name, checks] of categories) {
  const results = checks.map((c) => ({ id: c.id, label: c.label, ...c.run() }));
  const pass = results.filter((r) => r.result === "PASS").length;
  const fail = results.filter((r) => r.result === "FAIL").length;
  const unk = results.filter((r) => r.result === "UNKNOWN").length;
  const denom = pass + fail + unk;
  const pct = denom === 0 ? 0 : Math.round((pass / denom) * 100);
  result.categories[name] = { pct, weight: WEIGHTS[name], pass, fail, unknown: unk, denom, checks: results };
}

// Total = vektet snitt over AKTIVE kategorier (N/A-ekskludert), ikke tvunget 0 for eksterne prosjekter.
const active = Object.entries(result.categories).filter(([, c]) => c.denom > 0);
const activeWeight = active.reduce((s, [n]) => s + WEIGHTS[n], 0);
result.total = activeWeight === 0
  ? 0
  : Math.round(active.reduce((s, [n, c]) => s + c.pct * WEIGHTS[n], 0) / activeWeight);

if (asJson) {
  console.log(JSON.stringify(result));
} else {
  console.log(`\nARCH HEALTH SCORE — ${result.name}  (${NOW})`);
  console.log("────────────────────────────────────────────");
  for (const [name] of categories) {
    const c = result.categories[name];
    const label = c.denom === 0 ? "N/A" : `${c.pct}%`;
    console.log(`${name.padEnd(15)} ${String(label).padStart(4)}  (${c.pass}P/${c.fail}F/${c.unknown}U) · vekt ${c.weight}%`);
  }
  console.log("────────────────────────────────────────────");
  console.log(`TOTAL: ${result.total}%   — Arch Health Score`);
}
