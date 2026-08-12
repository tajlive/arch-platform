#!/usr/bin/env node
/**
 * Arch Health Score v2 — vektet sertifisering.
 *
 * Kategorier (vekt):
 *   Governance     20 %  — .arch/ struktur + beslutningslogg + approval-gates
 *   Security       25 %  — secret-registry + mapping + .env-gitignore + secret-policy
 *   Engineering    25 %  — manifest + CI/CD + tester + test-runner
 *   Operations     20 %  — deploy + monitoring + alerts + rollback
 *   Documentation  10 %  — README + ARCHITECT + API-docs + decisions
 *
 * TOTAL = Σ(kategori% × vekt/100). Deterministisk, fil-basert (ingen nettverk).
 *
 * Bruk:
 *   node health-score.mjs [katalog]        → tabell
 *   node health-score.mjs [katalog] --json → maskinlesbart
 */
import { existsSync, readdirSync, statSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const dir = resolve(args.find((a) => !a.startsWith("--")) ?? ".");
const base = join(dir, ".arch");

const has = (rel) => existsSync(join(dir, rel));
const hasArch = (rel) => existsSync(join(base, rel));
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
  return readdirSync(wf).some((f) => {
    if (!/\.(yml|yaml)$/.test(f)) return false;
    return re.test(readFileSync(join(wf, f), "utf8"));
  });
};
const hasTests = () => {
  const walk = (d) => {
    if (!existsSync(d)) return false;
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      try {
        if (statSync(p).isDirectory()) { if (walk(p)) return true; }
        else if (/\.(test|spec)\.[jt]sx?$/.test(f)) return true;
      } catch { /* ignore */ }
    }
    return false;
  };
  return walk(join(dir, "src")) || walk(join(dir, "scripts")) || walk(join(dir, "tests")) || walk(join(dir, "app"));
};

const WEIGHTS = { Governance: 20, Security: 25, Engineering: 25, Operations: 20, Documentation: 10 };

const categories = [
  ["Governance", [
    hasArch("project.yaml"),
    hasArch("policies.yaml"),
    hasArch("agents.yaml"),
    hasArch("audit-log.md"),
    hasArch("decisions.md"),
  ]],
  ["Security", [
    hasArch("secrets/registry.yaml"),
    hasArch("secrets/mapping.yaml"),
    grep(".gitignore", /(^|\n)\s*\.env(\s|\n|$)/),
    grep(".arch/policies.yaml", /secret/i),
  ]],
  ["Engineering", [
    has("package.json"),
    anyWorkflow(),
    hasTests(),
    has("vitest.config.ts") || has("vitest.config.mts") || has("jest.config.js") || has("vitest.workspace.ts") || has("vitest.config.js"),
  ]],
  ["Operations", [
    has(".github/workflows/deploy.yml"),
    grepWorkflows(/monitor/i) || (existsSync(join(dir, "scripts")) && readdirSync(join(dir, "scripts")).some((f) => /monitor/i.test(f))),
    grepWorkflows(/alert|linear|fingerprint/i) || existsSync(join(dir, "scripts/lib/escalation-rules.mjs")),
    grepWorkflows(/rollback/i),
  ]],
  ["Documentation", [
    has("README.md") || has("docs/README.md"),
    has("ARCHITECT.md") || has("docs/ARCHITECT.md"),
    existsSync(join(dir, "docs")) && readdirSync(join(dir, "docs")).some((f) => /api|openapi/i.test(f)),
    hasArch("decisions.md") || hasArch("knowledge/decisions"),
  ]],
];

const result = { name: dir.split("/").pop(), categories: {}, total: 0 };
for (const [name, checks] of categories) {
  const passed = checks.filter(Boolean).length;
  const pct = Math.round((passed / checks.length) * 100);
  result.categories[name] = { pct, passed, total: checks.length, weight: WEIGHTS[name] };
}
const total = categories.reduce((s, [name]) => s + result.categories[name].pct * (WEIGHTS[name] / 100), 0);
result.total = Math.round(total);

if (!hasArch("project.yaml")) {
  result.total = 0;
  if (!asJson) console.error(`✗ ${dir} er ikke et Arch-prosjekt. Score: 0 %`);
}

if (asJson) {
  console.log(JSON.stringify(result));
} else {
  console.log(`\nARCH SCORE — ${result.name}`);
  console.log("──────────────────────────────");
  for (const [name] of categories) {
    const c = result.categories[name];
    console.log(`${name.padEnd(15)} ${String(c.pct).padStart(3)}%  (${c.passed}/${c.total}) · vekt ${c.weight}%`);
  }
  console.log("──────────────────────────────");
  console.log(`TOTAL: ${result.total}%   — Certified by Arch v1.2`);
}
