// Stack-deteksjon — read-only observasjon av repoets verktøykjede (Arch Audit v1).
// Alt er observed (fra faktiske filer), aldri gjetting. Ingen verdi uten kilde.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const FRAMEWORKS = [
  { name: "Next.js", deps: ["next"] },
  { name: "React (SPA)", deps: ["react"], exclude: ["next"] },
  { name: "Vue", deps: ["vue"] },
  { name: "Svelte", deps: ["svelte"] },
  { name: "Nuxt", deps: ["nuxt"] },
  { name: "Astro", deps: ["astro"] },
  { name: "Express", deps: ["express"] },
  { name: "Fastify", deps: ["fastify"] },
  { name: "NestJS", deps: ["@nestjs/core"] },
];

const CLOUDFLARE_HINTS = [
  ["wrangler.jsonc", "wrangler.jsonc"],
  ["wrangler.toml", "wrangler.toml"],
  ["open-next.config.ts", "open-next.config.ts"],
  ["@opennextjs/cloudflare", "@opennextjs/cloudflare (dep)"],
];

const SUPABASE_HINTS = [
  ["@supabase/supabase-js", "@supabase/supabase-js (dep)"],
  ["supabase/config.toml", "supabase/config.toml"],
];

function readJson(p) {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

export function detect(repoRoot) {
  const pkgPath = join(repoRoot, "package.json");
  const pkg = readJson(pkgPath);
  const has = (rel) => existsSync(join(repoRoot, rel));

  const allDeps = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };
  const depNames = Object.keys(allDeps);

  const framework = FRAMEWORKS.find((f) =>
    f.deps.every((d) => depNames.includes(d)) && !(f.exclude?.some((e) => depNames.includes(e)))
  );

  const language = has("tsconfig.json") ? "TypeScript" : "JavaScript (ingen tsconfig)";

  const packageManager = has("pnpm-lock.yaml") ? "pnpm"
    : has("yarn.lock") ? "yarn"
    : has("package-lock.json") ? "npm"
    : has("bun.lockb") ? "bun" : "ukjent (ingen lockfile)";

  const testRunner = ["vitest.config.ts", "vitest.config.mts", "vitest.config.js", "vitest.workspace.ts"].some(has) ? "vitest"
    : ["jest.config.js", "jest.config.ts", "jest.config.mjs"].some(has) ? "jest"
    : has("playwright.config.ts") ? "playwright" : null;

  const cloudflare = CLOUDFLARE_HINTS.filter(([, hint]) => has(hint.split(" ")[0]) || (hint.includes("(dep)") && depNames.includes(hint.split(" ")[0]))).map(([k]) => k);
  const supabase = SUPABASE_HINTS.filter(([key]) => depNames.includes(key) || has(key)).map(([k]) => k);

  const scripts = Object.keys(pkg?.scripts ?? {});

  return {
    name: pkg?.name ?? null,
    version: pkg?.version ?? null,
    framework: framework?.name ?? (pkg ? "ukjent (ingen kjent rammeverk)" : "ikke et Node-prosjekt (ingen package.json)"),
    language,
    package_manager: packageManager,
    test_runner: testRunner ?? "ingen test-runner",
    has_tests: testRunner !== null,
    cloudflare: cloudflare.length ? cloudflare : [],
    supabase: supabase.length ? supabase : [],
    scripts,
    runtime_hint: cloudflare.length ? "Cloudflare" : (supabase.length ? "Supabase-tilkoblet" : "ukjent"),
  };
}
