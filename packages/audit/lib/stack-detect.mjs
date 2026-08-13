// Stack-deteksjon — read-only observasjon av repoets verktøykjede (Arch Audit v1).
// Multi-package aware: skanner ALLE package.json/tsconfig/test-config/wrangler i repoet
// (ikke bare root), fordi eksterne prosjekter ofte er mono-repo (root + frontend/ + api/worker/).
// Alt er observed (fra faktiske filer), aldri gjetting. Ingen verdi uten kilde.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SKIP = new Set([
  "node_modules", ".git", ".wrangler", ".venv-pdf", ".venv", "venv",
  "dist", "dist-mirror", "allure-results", "allure-report", ".next",
  ".worktrees", ".chrome-profile", "output", "logs", "__pycache__",
  ".src-backup-20260527-012916",
]);

const MAX_DEPTH = 10;

function collectFiles(root) {
  const out = [];
  const walk = (dir, depth) => {
    if (depth < 0) return;
    let entries;
    try { entries = readdirSync(dir); } catch { return; }
    for (const name of entries) {
      if (SKIP.has(name)) continue;
      const p = join(dir, name);
      let isDir = false;
      try { isDir = statSync(p).isDirectory(); } catch { continue; }
      if (isDir) walk(p, depth - 1);
      else out.push(p);
    }
  };
  walk(root, MAX_DEPTH);
  return out;
}

function readJson(p) {
  try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; }
}

const FRAMEWORKS = [
  { name: "Next.js", deps: ["next"], exclude: [] },
  { name: "React (SPA)", deps: ["react"], exclude: ["next"] },
  { name: "Vue", deps: ["vue"], exclude: [] },
  { name: "Svelte", deps: ["svelte"], exclude: [] },
  { name: "Nuxt", deps: ["nuxt"], exclude: [] },
  { name: "Astro", deps: ["astro"], exclude: [] },
  { name: "Express", deps: ["express"], exclude: [] },
  { name: "Fastify", deps: ["fastify"], exclude: [] },
  { name: "NestJS", deps: ["@nestjs/core"], exclude: [] },
];

const TEST_CONFIG_PATTERNS = ["vitest.config.", "vitest.workspace.", "jest.config.", "playwright.config."];
const ESLINT_PATTERNS = [".eslintrc", "eslint.config."];

export function detect(repoRoot) {
  const files = collectFiles(repoRoot);
  const relFiles = files.map((f) => relative(repoRoot, f));

  // package.json i alle kataloger (root + sub-pakker)
  const pkgPaths = relFiles.filter((f) => f.split("/").pop() === "package.json");
  const packages = [];
  for (const p of pkgPaths) {
    const json = readJson(join(repoRoot, p));
    if (!json) continue;
    const dir = p === "package.json" ? "." : p.slice(0, p.length - "/package.json".length);
    packages.push({
      path: dir,
      name: json.name ?? null,
      version: json.version ?? null,
      scripts: Object.keys(json.scripts ?? {}),
      deps: Object.keys({ ...(json.dependencies ?? {}), ...(json.devDependencies ?? {}) }),
      has_lockfile: relFiles.includes(dir === "." ? "package-lock.json" : `${dir}/package-lock.json`),
    });
  }

  const rootPkg = packages.find((p) => p.path === ".");
  const allDeps = [...new Set(packages.flatMap((p) => p.deps))];
  const allScripts = [...new Set(packages.flatMap((p) => p.scripts))];

  const tsconfigs = relFiles.filter((f) => /(^|\/)tsconfig(\.[\w.-]+)?\.json$/.test(f));
  const testConfigs = relFiles.filter((f) => {
    const base = f.split("/").pop();
    return TEST_CONFIG_PATTERNS.some((pat) => base.startsWith(pat));
  });
  const eslintConfigs = relFiles.filter((f) => {
    const base = f.split("/").pop();
    return ESLINT_PATTERNS.some((pat) => base.includes(pat));
  });
  const wranglerFiles = relFiles.filter((f) => /(^|\/)wrangler\.(toml|jsonc|json)$/.test(f));

  // Rammeverk (første match i prioritert rekkefølge)
  const framework = FRAMEWORKS.find((f) =>
    f.deps.every((d) => allDeps.includes(d)) && !(f.exclude?.some((e) => allDeps.includes(e)))
  )?.name ?? (packages.length ? "ukjent (ingen kjent rammeverk)" : "ikke et Node-prosjekt (ingen package.json)");

  // Språk
  const language = tsconfigs.length || allDeps.includes("typescript")
    ? "TypeScript"
    : "JavaScript (ingen tsconfig)";

  // Package manager (root lockfile)
  const has = (rel) => relFiles.includes(rel);
  const package_manager = has("pnpm-lock.yaml") ? "pnpm"
    : has("yarn.lock") ? "yarn"
    : has("package-lock.json") ? "npm"
    : has("bun.lockb") ? "bun" : "ukjent (ingen lockfile)";

  // Test-runner (konfig-filer ELLER deps, på tvers av alle pakker)
  const runners = [];
  if (testConfigs.some((f) => /vitest/.test(f)) || allDeps.includes("vitest")) runners.push("vitest");
  if (testConfigs.some((f) => /jest\.config/.test(f)) || allDeps.includes("jest")) runners.push("jest");
  if (testConfigs.some((f) => /playwright\.config/.test(f)) || allDeps.includes("@playwright/test") || allDeps.includes("playwright")) runners.push("playwright");
  const test_runner = runners.length ? [...new Set(runners)].join(" + ") : "ingen test-runner";

  // Cloudflare / Supabase
  const cloudflare = [];
  if (wranglerFiles.length) cloudflare.push(...wranglerFiles.map((f) => `wrangler.toml (${f})`));
  if (allDeps.includes("@opennextjs/cloudflare")) cloudflare.push("@opennextjs/cloudflare (dep)");
  if (allDeps.includes("@cloudflare/workers-types") || allDeps.includes("wrangler")) cloudflare.push("Cloudflare Workers (dep)");
  const supabase = [];
  if (allDeps.includes("@supabase/supabase-js")) supabase.push("@supabase/supabase-js (dep)");
  if (relFiles.includes("supabase/config.toml")) supabase.push("supabase/config.toml");

  const runtime_hint = cloudflare.length ? "Cloudflare" : (supabase.length ? "Supabase-tilkoblet" : "ukjent");

  return {
    name: rootPkg?.name ?? null,
    version: rootPkg?.version ?? null,
    framework,
    language,
    package_manager,
    test_runner,
    has_tests: runners.length > 0,
    cloudflare: [...new Set(cloudflare)],
    supabase: [...new Set(supabase)],
    scripts: rootPkg?.scripts ?? [],
    all_scripts: allScripts,
    all_deps: allDeps,
    packages,
    tsconfigs,
    test_configs: testConfigs,
    eslint_configs: eslintConfigs,
    wrangler_files: wranglerFiles,
    monorepo: packages.length > 1,
    runtime_hint,
  };
}
