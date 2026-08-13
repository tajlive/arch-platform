// Stack-deteksjon — read-only observasjon av repoets verktøykjede (Arch Audit v1).
// Multi-package + multi-språk aware: skanner ALLE package.json/tsconfig/test-config/
// wrangler/andre manifest i repoet (ikke bare root), og gjenkjenner Python/Rust/Go m.fl.
// Alt er observed (fra faktiske filer), aldri gjetting. Ingen verdi uten kilde.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SKIP = new Set([
  "node_modules", ".git", ".wrangler", ".venv-pdf", ".venv", "venv",
  "dist", "dist-mirror", "allure-results", "allure-report", ".next",
  ".worktrees", ".chrome-profile", "output", "logs", "__pycache__",
  ".src-backup-20260527-012916", "site-packages",
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
function readText(p) {
  try { return readFileSync(p, "utf8"); } catch { return ""; }
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

const PY_FRAMEWORKS = [
  { name: "Django", dep: "django" },
  { name: "Flask", dep: "flask" },
  { name: "FastAPI", dep: "fastapi" },
  { name: "Starlette", dep: "starlette" },
];

const LANG_MANIFESTS = [
  { lang: "Python", files: ["pyproject.toml", "setup.py", "setup.cfg", "requirements.txt", "Pipfile", "poetry.lock"] },
  { lang: "Rust", files: ["Cargo.toml"] },
  { lang: "Go", files: ["go.mod"] },
  { lang: "Ruby", files: ["Gemfile"] },
  { lang: "PHP", files: ["composer.json"] },
  { lang: "Java", files: ["pom.xml", "build.gradle"] },
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

  // Språk (manifest-basert, multi-språk)
  const nonNode = LANG_MANIFESTS.find((l) => l.files.some((f) => relFiles.includes(f)));
  const pyproject = relFiles.includes("pyproject.toml") ? readText(join(repoRoot, "pyproject.toml")) : "";
  const reqFiles = relFiles.filter((f) => /requirements(-[a-z]+)?\.txt$/.test(f) && !f.includes("/"));
  const pyText = pyproject + "\n" + reqFiles.map((f) => readText(join(repoRoot, f))).join("\n");
  const pyName = pyproject.match(/(?:^|\n)\s*name\s*=\s*["']([^"']+)["']/)?.[1] ?? null;

  // Rammeverk
  let framework;
  if (packages.length) {
    framework = FRAMEWORKS.find((f) =>
      f.deps.every((d) => allDeps.includes(d)) && !(f.exclude?.some((e) => allDeps.includes(e)))
    )?.name ?? "ukjent (ingen kjent rammeverk)";
  } else if (nonNode?.lang === "Python") {
    const nameFw = PY_FRAMEWORKS.find((f) => pyName?.toLowerCase() === f.dep);
    const depFw = PY_FRAMEWORKS.find((f) => pyText.includes(f.dep));
    const pyFw = nameFw ?? depFw;
    framework = pyFw?.name ?? (pyName ? `${pyName} (Python-bibliotek)` : "ukjent (Python)");
  } else if (nonNode) {
    framework = `ikke Node — ${nonNode.lang}`;
  } else {
    framework = "ukjent (ingen kjent manifest)";
  }

  // Språk
  let language;
  if (packages.length) {
    language = (tsconfigs.length || allDeps.includes("typescript")) ? "TypeScript" : "JavaScript (ingen tsconfig)";
  } else {
    language = nonNode?.lang ?? "ukjent (ingen manifest)";
  }

  // Package manager
  const has = (rel) => relFiles.includes(rel);
  let package_manager;
  if (has("pnpm-lock.yaml")) package_manager = "pnpm";
  else if (has("yarn.lock")) package_manager = "yarn";
  else if (has("package-lock.json")) package_manager = "npm";
  else if (has("bun.lockb")) package_manager = "bun";
  else if (has("poetry.lock")) package_manager = "poetry";
  else if (has("uv.lock")) package_manager = "uv";
  else if (has("Pipfile")) package_manager = "pipenv";
  else if (has("requirements.txt")) package_manager = "pip (requirements.txt)";
  else if (pyproject) package_manager = "pyproject (pip/hatch/poetry)";
  else if (has("Cargo.lock")) package_manager = "cargo";
  else if (has("go.sum")) package_manager = "go modules";
  else package_manager = "ukjent (ingen lockfile)";

  // Test-runner (Node + Python + Rust/Go)
  const runners = [];
  if (testConfigs.some((f) => /vitest/.test(f)) || allDeps.includes("vitest")) runners.push("vitest");
  if (testConfigs.some((f) => /jest\.config/.test(f)) || allDeps.includes("jest")) runners.push("jest");
  if (testConfigs.some((f) => /playwright\.config/.test(f)) || allDeps.includes("@playwright/test") || allDeps.includes("playwright")) runners.push("playwright");
  if (pyText.includes("pytest") || relFiles.some((f) => ["pytest.ini", "tox.ini", "conftest.py"].includes(f.split("/").pop()))) runners.push("pytest");
  if (pyText.includes("unittest")) runners.push("unittest");
  if (has("Cargo.toml") || relFiles.some((f) => f.endsWith("_test.rs"))) runners.push("cargo test");
  if (has("go.mod") || relFiles.some((f) => f.endsWith("_test.go"))) runners.push("go test");
  const test_runner = runners.length ? [...new Set(runners)].join(" + ") : "ingen test-runner";

  // Cloudflare / Supabase
  const cloudflare = [];
  if (wranglerFiles.length) cloudflare.push(...wranglerFiles.map((f) => `wrangler.toml (${f})`));
  if (allDeps.includes("@opennextjs/cloudflare")) cloudflare.push("@opennextjs/cloudflare (dep)");
  if (allDeps.includes("@cloudflare/workers-types") || allDeps.includes("wrangler")) cloudflare.push("Cloudflare Workers (dep)");
  const supabase = [];
  if (allDeps.includes("@supabase/supabase-js")) supabase.push("@supabase/supabase-js (dep)");
  if (relFiles.includes("supabase/config.toml")) supabase.push("supabase/config.toml");

  const runtime_hint = cloudflare.length ? "Cloudflare" : (supabase.length ? "Supabase-tilkoblet" : (nonNode?.lang ?? "ukjent"));

  return {
    name: rootPkg?.name ?? pyName ?? null,
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
