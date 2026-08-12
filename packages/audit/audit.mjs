#!/usr/bin/env node
/**
 * Arch Audit v1 (F4) — første fakturerbare produkt.
 *
 * Analyserer et eksisterende repo (path ELLER registry-project_id) og produserer
 * en evidensbasert rapport med tydelig grense mellom automatiske funn, infererte
 * anbefalinger og menneskelige beslutninger.
 *
 * Bruk:
 *   node packages/audit/audit.mjs <target> [--json] [--save <dir>]
 *   <target>  = absolutt/relativ sti, ELLER project_id i projects.json
 *   --json    = intern teknisk evidence-visning (full JSON)
 *   --save    = skriv kunderapport + evidence til <dir>
 *
 * READ-ONLY: endrer aldri mål-repoet. Ingen deploy, ingen secrets, ingen tilgang.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

import { scan } from "./lib/secret-scan.mjs";
import { detect } from "./lib/stack-detect.mjs";
import { finding, resetSeq, CLASS } from "./lib/classify.mjs";
import { renderCustomer, renderEvidence } from "./lib/report.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..", "..");
const healthScorePath = join(root, "packages", "health-score", "health-score.mjs");
const registryPath = join(root, "packages", "governance", "projects.json");
const knowledgeDir = join(root, "packages", "knowledge-engine", "knowledge");

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const saveIdx = args.indexOf("--save");
const saveDir = saveIdx >= 0 ? args[saveIdx + 1] : null;
const targetArg = args.find((a) => !a.startsWith("--") && a !== (saveDir ?? ""));

if (!targetArg) {
  console.error("Bruk: node packages/audit/audit.mjs <target|project_id> [--json] [--save <dir>]");
  process.exit(2);
}

// ── 1. Resolve target ──
function resolveTarget(arg) {
  const registry = JSON.parse(readFileSync(registryPath, "utf8")).projects;
  const byId = registry.find((p) => p.project_id === arg);
  if (byId) {
    return { path: byId.dev_path ?? null, repo: byId.repository, name: byId.name, type: byId.type, url: byId.url };
  }
  const p = resolve(arg);
  if (existsSync(p)) {
    let repo = null;
    try {
      const out = execFileSync("gh", ["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"], { cwd: p, encoding: "utf8", timeout: 10000 }).trim();
      repo = out || null;
    } catch { repo = null; }
    return { path: p, repo, name: basename(p), type: "ukjent", url: null };
  }
  return null;
}

const target = resolveTarget(targetArg);
if (!target) {
  console.error(`Mål ikke funnet: «${targetArg}» (verken path eller registry-id).`);
  process.exit(2);
}
if (!target.path) {
  console.error(`Registry-prosjekt «${targetArg}» har ingen dev_path — kan ikke analyseres lokalt.`);
  process.exit(2);
}

const started = Date.now();
const NOW = new Date().toISOString();

// ── 2. Samle observert evidence (read-only) ──
const collect = {};

// Health Score v2.1
try {
  const out = execFileSync("node", [healthScorePath, target.path, "--json"], { encoding: "utf8", timeout: 60000 });
  collect.health = JSON.parse(out.trim().split("\n").pop());
} catch (e) {
  collect.health = { total: 0, categories: {}, error: String(e.message || e).split("\n")[0] };
}

// Secret-scan
collect.security = { secrets: scan(target.path) };
collect.security.secret_governance = existsSync(join(target.path, ".arch", "secrets", "registry.yaml")) ? "observed" : "missing";

// Stack
collect.stack = detect(target.path);

// GitHub repo + CI (best-effort)
collect.github = { repo: target.repo, ci: null, pushed_at: null };
if (target.repo) {
  try {
    const out = execFileSync("gh", ["api", `repos/${target.repo}`, "--jq", "{pushed_at, stargazers_count, open_issues_count, archived, private}"], { encoding: "utf8", timeout: 15000 });
    collect.github.repo_meta = JSON.parse(out.trim());
  } catch { collect.github.repo_meta = null; }
  try {
    const out = execFileSync("gh", ["api", `repos/${target.repo}/actions/runs?per_page=1`, "--jq", ".workflow_runs[0] | {status, conclusion, head_sha, created_at}"], { encoding: "utf8", timeout: 15000 });
    collect.github.ci = JSON.parse(out.trim());
  } catch { collect.github.ci = null; }
}

// CI/CD workflow-analyse (matcher repo-verktøykjede)
function analyzeCiCd() {
  const wfDir = join(target.path, ".github", "workflows");
  const workflows = existsSync(wfDir) ? readdirSync(wfDir).filter((f) => /\.(yml|yaml)$/.test(f)) : [];
  const toolReqs = [
    { tool: "tsc", re: /\b(tsc|npx tsc)\b/, present: () => existsSync(join(target.path, "tsconfig.json")) },
    { tool: "npm ci", re: /\bnpm ci\b/, present: () => existsSync(join(target.path, "package-lock.json")) },
    { tool: "npm test", re: /\bnpm (run )?test\b/, present: () => !!collect.stack.scripts?.includes("test") },
    { tool: "eslint", re: /\beslint\b/, present: () => existsSync(join(target.path, "eslint.config.mjs")) || existsSync(join(target.path, ".eslintrc")) || existsSync(join(target.path, ".eslintrc.json")) },
    { tool: "vitest", re: /\bvitest\b/, present: () => ["vitest.config.ts", "vitest.config.mts", "vitest.config.js", "vitest.workspace.ts"].some((f) => existsSync(join(target.path, f))) },
    { tool: "jest", re: /\bjest\b/, present: () => ["jest.config.js", "jest.config.ts"].some((f) => existsSync(join(target.path, f))) },
  ];
  const mismatches = [];
  for (const wf of workflows) {
    const text = readFileSync(join(wfDir, wf), "utf8");
    for (const t of toolReqs) {
      if (t.re.test(text) && !t.present()) mismatches.push(`${wf}: kjører \`${t.tool}\` men verktøyet finnes ikke i repo`);
    }
  }
  return { workflows, mismatches };
}
collect.ci_cd = analyzeCiCd();

// Operations (monitoring/alert/rollback — observer fra workflows + scripts)
function analyzeOps() {
  const wfDir = join(target.path, ".github", "workflows");
  const wfText = existsSync(wfDir) ? readdirSync(wfDir).filter((f) => /\.(yml|yaml)$/.test(f)).map((f) => readFileSync(join(wfDir, f), "utf8")).join("\n") : "";
  const scriptsDir = join(target.path, "scripts");
  const scripts = existsSync(scriptsDir) ? readdirSync(scriptsDir) : [];
  const monitoring = /monitor/i.test(wfText) || scripts.some((f) => /monitor/i.test(f));
  const alerts = /alert|linear|fingerprint|escalat/i.test(wfText) || scripts.some((f) => /alert|escalat|notify/i.test(f));
  const rollback = /rollback/i.test(wfText);
  return { monitoring, alerts, rollback };
}
collect.operations = analyzeOps();

// Documentation
collect.documentation = {
  readme: existsSync(join(target.path, "README.md")) || existsSync(join(target.path, "docs", "README.md")),
  architect: existsSync(join(target.path, "ARCHITECT.md")) || existsSync(join(target.path, "docs", "ARCHITECT.md")),
  api_docs: existsSync(join(target.path, "docs")) && readdirSync(join(target.path, "docs")).some((f) => /api|openapi/i.test(f)),
  decisions: existsSync(join(target.path, ".arch", "decisions.md")) || existsSync(join(target.path, ".arch", "knowledge", "decisions")),
};

// Knowledge-arv
function collectKnowledge() {
  const lessonsDir = join(knowledgeDir, "lessons");
  const files = existsSync(lessonsDir) ? readdirSync(lessonsDir).filter((f) => f.endsWith(".md")) : [];
  const stackLc = JSON.stringify(collect.stack).toLowerCase() + " " + (target.type || "").toLowerCase() + " " + target.name.toLowerCase();
  const RELEVANCE = [
    { file: "lesson-edge-nodejs.md", keywords: ["cloudflare", "supabase", "next"], rule: "supabase-js-ruter = runtime:\"nodejs\" (aldri edge)" },
    { file: "lesson-route-handler-server-client.md", keywords: ["next", "supabase"], rule: "route handlers: createServerClient(request, response)" },
    { file: "lesson-wrangler-env-empty.md", keywords: ["wrangler", "cloudflare"], rule: "wrangler multi-env → --env \"\"" },
    { file: "lesson-kapital-kun-aktive.md", keywords: ["trad", "fin", "crypto"], rule: "kapital/P&L kun fra aktive sesjoner" },
    { file: "lesson-registry-sot-no-hardcoded-paths.md", keywords: ["collect", "registry", "path"], rule: "ingen hardkodede lokale stier i prod-kode" },
    { file: "lesson-governed-deploy-verifiser-verktoy.md", keywords: ["deploy", "ci", "wrangler", "workflow"], rule: "verifiser CLI-kommandoer + CI-verktøykjede FØR prosedyre dokumenteres" },
  ];
  return RELEVANCE.filter((r) => r.keywords.some((k) => stackLc.includes(k)) && files.includes(r.file));
}
collect.knowledge = { inherited: collectKnowledge() };

// ── 3. Klassifiser funn ──
resetSeq();
const findings = [];

// Security
if (collect.security.secrets.status === "clean") {
  findings.push(finding(CLASS.AUTOMATIC, "security", "Ingen secret-mønster i versjonskontrollerte filer",
    `${collect.security.secrets.files_scanned} filer scannet, 0 lekkasje`, { severity: "low", priority: 1 }));
} else {
  findings.push(finding(CLASS.AUTOMATIC, "security", `${collect.security.secrets.findings} secret-lekkasje(r) funnet`,
    `${collect.security.secrets.details?.slice(0, 3).map((d) => `${d.file}:${d.line}`).join(", ") ?? ""}`, { severity: "critical", priority: 1 }));
  findings.push(finding(CLASS.INFERRED, "security", "Rotér eksponerte hemmeligheter og fjern fra versjonskontroll",
    `lekkasje-mønster observert i ${collect.security.secrets.findings} fil(er)`, { severity: "critical", priority: 1 }));
  findings.push(finding(CLASS.HUMAN_APPROVAL, "security", "Rotasjon av tjenestekredentialer",
    "krever eiertilgang (dashboard/API) — menneskelig handling", { severity: "critical", priority: 1 }));
}
if (collect.security.secret_governance === "missing") {
  findings.push(finding(CLASS.INFERRED, "security", "Etablér .arch/secrets/ governance (registry + allowlist)",
    "ingen .arch/secrets/registry.yaml observert", { severity: "medium", priority: 3 }));
}

// CI/CD
if (collect.ci_cd.mismatches.length) {
  for (const mm of collect.ci_cd.mismatches) {
    findings.push(finding(CLASS.AUTOMATIC, "ci_cd", "CI-workflow matcher ikke repo-verktøykjeden", mm, { severity: "high", priority: 1 }));
  }
  findings.push(finding(CLASS.INFERRED, "ci_cd", "Korriger workflowen til faktiske verktøy (eller fjern falske gater)",
    `${collect.ci_cd.mismatches.length} mismatch — falsk rød/grønn CI gir ingen beskyttelse`, { severity: "high", priority: 2 }));
}
if (!collect.ci_cd.workflows.length) {
  findings.push(finding(CLASS.INFERRED, "ci_cd", "Ingen CI-workflow — etablér test-gate før deploy",
    "ingen .github/workflows/*.yml observert", { severity: "high", priority: 2 }));
}
if (collect.health.categories?.Engineering?.pct !== undefined && collect.health.categories.Engineering.pct < 100) {
  findings.push(finding(CLASS.AUTOMATIC, "ci_cd", `Engineering-score ${collect.health.categories.Engineering.pct}%`,
    `health-score: ${collect.health.categories.Engineering.pass}P/${collect.health.categories.Engineering.fail}F/${collect.health.categories.Engineering.unknown}U`, { severity: "medium", priority: 4 }));
}

// Operations
if (!collect.operations.monitoring) findings.push(finding(CLASS.INFERRED, "operations", "Manglende monitoring", "ingen monitor i workflows/scripts", { severity: "medium", priority: 4 }));
if (!collect.operations.alerts) findings.push(finding(CLASS.INFERRED, "operations", "Manglende alert-integrasjon", "ingen alert/escalation i workflows/scripts", { severity: "medium", priority: 4 }));
if (!collect.operations.rollback) findings.push(finding(CLASS.INFERRED, "operations", "Manglende rollback-mekanisme", "ingen rollback i workflow", { severity: "high", priority: 3 }));

// Architecture
if (!collect.stack.test_runner || collect.stack.test_runner === "ingen test-runner") {
  findings.push(finding(CLASS.INFERRED, "architecture", "Ingen test-runner", "ingen vitest/jest/playwright-konfig observert", { severity: "medium", priority: 3 }));
}

// AI/automation (inferert fra manglende automasjon)
const aiOpps = [];
if (!collect.operations.monitoring) aiOpps.push("automatisk monitorering + syntetisk smoke");
if (!collect.operations.alerts) aiOpps.push("alert-routing til eier (Linear/Discord)");
if (!collect.ci_cd.workflows.length) aiOpps.push("CI-pipeline (test → deploy → smoke → rollback)");
if (collect.health.categories?.Documentation?.pct !== undefined && collect.health.categories.Documentation.pct < 100) aiOpps.push("dokumentasjon (ARCHITECT/API-docs)");
if (aiOpps.length) {
  findings.push(finding(CLASS.INFERRED, "ai_automation", "Automasjonsmuligheter identifisert", aiOpps.join("; "), { severity: "low", priority: 5 }));
}

// Legal/regulatorisk — ALLTID human_approval, aldri påstand
findings.push(finding(CLASS.HUMAN_APPROVAL, "tech_debt", "Regulatorisk/juridisk vurdering (GDPR m.fl.)",
  "ikke vurdert av Arch — krever kvalifisert juridisk gjennomgang", { severity: "medium", priority: 2 }));

// ── Quick wins + build-muligheter ──
const quick_wins = [];
if (!collect.operations.rollback) quick_wins.push({ title: "Legg til rollback i deploy-workflow", effort: "lav", impact: "høy", class: CLASS.INFERRED });
if (collect.ci_cd.mismatches.length) quick_wins.push({ title: "Fjern/korriger falske CI-gater (verktøy som ikke finnes)", effort: "lav", impact: "høy", class: CLASS.INFERRED });
if (!collect.documentation.architect) quick_wins.push({ title: "Skriv ARCHITECT.md (arkitektur-overblikk)", effort: "lav", impact: "middels", class: CLASS.INFERRED });

const build_opportunities = [];
if (collect.ci_cd.mismatches.length || !collect.ci_cd.workflows.length) {
  build_opportunities.push({ title: "Arkitektur- og CI-reparasjon", estimated_value: "middels (reduserer risiko)", effort: "middels", class: CLASS.INFERRED });
}
if (!collect.operations.monitoring || !collect.operations.alerts) {
  build_opportunities.push({ title: "Overvåking + alerting + rollback (Arch Managed-forberedelse)", estimated_value: "høy (produksjonstrygghet)", effort: "middels", class: CLASS.INFERRED });
}
build_opportunities.push({ title: "Arch Build — videreutvikling fra godkjent audit", estimated_value: "scopes i Architecture Proposal", effort: "varierer", class: CLASS.HUMAN_APPROVAL });

const human_approvals = [];
human_approvals.push({ title: "Godkjenn produksjonsdeploy (hvis aktuelt)", why: "deploy er Tom/governance-gated" });
if (collect.security.secrets.status !== "clean") human_approvals.push({ title: "Rotér eksponerte hemmeligheter", why: "krever eiertilgang + verifisering i prod" });
human_approvals.push({ title: "Juridisk/regulatorisk vurdering", why: "GDPR m.fl. krever kvalifisert vurdering — utenfor Archs evidensgrunnlag" });

// ── Executive summary ──
const hTotal = collect.health.total ?? 0;
const critCount = findings.filter((f) => f.severity === "critical" || f.severity === "high").length;
const summary = [
  `**${target.name}** er analysert med Arch Audit v1. Samlet Arch Health Score: **${hTotal}%**.`,
  `Secret-scan: **${collect.security.secrets.status === "clean" ? "clean (0 lekkasjer)" : `${collect.security.secrets.findings} lekkasje(r)`}**.`,
  `CI/verktøykjede: ${collect.ci_cd.mismatches.length ? `**${collect.ci_cd.mismatches.length} mismatch** (falske gater)` : "matcher repo"}.`,
  `${critCount ? `**${critCount} funn med høy/kritisk alvorlighet** bør prioriteres.` : "Ingen kritiske funn."}`,
  `Rapporten skiller automatiske funn (🟢), infererte anbefalinger (🟡) og beslutninger som krever menneske (🔴).`,
].join(" ");

const audit = {
  meta: {
    generated: NOW,
    version: "1.0",
    target: target.path,
    name: target.name,
    repo: target.repo,
    url: target.url ?? null,
    commit: (() => { try { return execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: target.path, encoding: "utf8" }).trim(); } catch { return null; } })(),
    audit_duration_ms: Date.now() - started,
  },
  executive_summary: summary,
  health: collect.health,
  security: collect.security,
  stack: collect.stack,
  ci_cd: { ...collect.ci_cd, last_run: collect.github.ci },
  operations: collect.operations,
  documentation: collect.documentation,
  knowledge: collect.knowledge,
  findings,
  quick_wins,
  build_opportunities,
  human_approvals,
};

// ── 4. Output ──
if (asJson) {
  console.log(renderEvidence(audit));
} else {
  console.log(renderCustomer(audit));
}

if (saveDir) {
  mkdirSync(saveDir, { recursive: true });
  const base = join(saveDir, `audit-${(target.name || "target").replace(/[^a-z0-9-]/gi, "-").toLowerCase()}`);
  writeFileSync(`${base}.md`, renderCustomer(audit));
  writeFileSync(`${base}.evidence.json`, renderEvidence(audit));
  console.error(`\n[lagret] ${base}.md + ${base}.evidence.json`);
}

process.exit(0);
