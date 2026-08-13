// Browser-innsamling — Arch Website Audit v1 (F4.2B).
//
// Best-effort headless Chrome (dump-dom + skjermbilder) for rendering-signaler.
// Rike mål (console-feil, failed requests, LCP/CLS) hentes fra en ekstern
// browser-evidence JSON (f.eks. via chrome-devtools MCP) og merges inn.
// Ingen browser-tilgjengelig → degraderer ærlig (felt = UNKNOWN), fabrikkerer aldri.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
];

export function chromePath() {
  return CHROME_PATHS.find((p) => existsSync(p)) ?? null;
}

/** Spawner headless Chrome: dump-dom (rendered DOM) + desktop/mobil-screenshots. */
export function collectBrowser(url, outDir) {
  const chrome = chromePath();
  if (!chrome) return { available: false, error: "Chrome ikke funnet på maskinen" };
  const evidence = { available: true, rendered: null, screenshots: [], screenshots_error: null };

  try {
    const dom = execFileSync(chrome, [
      "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
      "--virtual-time-budget=4000", "--dump-dom", url,
    ], { encoding: "utf8", timeout: 40000, maxBuffer: 20 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
    evidence.rendered = { length: dom.length, dom };
  } catch (e) {
    evidence.rendered = { error: String(e.message || e).split("\n")[0] };
  }

  try {
    mkdirSync(outDir, { recursive: true });
    for (const [name, size] of [["desktop", "1440,900"], ["mobile", "390,844"]]) {
      const out = join(outDir, `screenshot-${name}.png`);
      execFileSync(chrome, [
        "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        `--window-size=${size}`, `--screenshot=${out}`, url,
      ], { timeout: 40000, stdio: "ignore" });
      evidence.screenshots.push(out);
    }
  } catch (e) {
    evidence.screenshots_error = String(e.message || e).split("\n")[0];
  }

  return evidence;
}

/** Leser ekstern browser-evidence JSON (chrome-devtools MCP o.l.). */
export function loadBrowserEvidence(path) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return null; }
}
