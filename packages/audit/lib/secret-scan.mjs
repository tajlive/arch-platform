// Secret-scan — generisk, read-only, parameterisert på repo-root (Arch Audit v1).
//
// Skanner et repo for secret-mønstre. Skriver ALDRI matchede verdier —
// kun fil:linje + mønster-navn. Skiller lekkasje (versjonskontrollert, prod-kode) fra
// note (gitignoret / test-fixture / eksempel / avkortet placeholder). Allowlist:
// `.arch/secret-audit.allow` (én «fil:mønster»/linje).
//
// v2 (2026-08-13): avkortede placeholder-tokens (inneholder «...») og credential-
// lignende strenger i test-/eksempel-/fixture-filer klassifiseres som NOTE, ikke lekkasje
// — de er nesten alltid dokumenterte dummy-verdier, ikke ekte hemmeligheter.
//
// Ærlig grense: «0 funn» betyr «ingen matchende mønster i scannet filsett» —
// det er IKKE en påstand om at systemet er «sikkert».

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const PATTERNS = [
  { name: "github-token", re: /gh[pousr]_[A-Za-z0-9]{36,}/ },
  { name: "openai-style-key", re: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: "honcho-key", re: /hch-(at|rt)-[A-Za-z0-9]{20,}/ },
  { name: "bearer-token", re: /Bearer\s+[A-Za-z0-9._-]{20,}/ },
  { name: "supabase-pat", re: /sbp_[A-Za-z0-9]{20,}/ },
  { name: "private-key", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: "aws-key", re: /AKIA[0-9A-Z]{16}/ },
  { name: "stripe-live", re: /\bsk_live_[A-Za-z0-9]{20,}\b/ },
  { name: "slack-token", re: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
];

const SKIP_DIRS = new Set([
  ".git", "node_modules", ".next", "dist", ".open-next", ".chrome-profile",
  "playwright-report", "out", ".turbo", "build", ".wrangler", ".venv", "vendor",
]);

// Test-/eksempel-/fixture-/doc-stier: credential-lignende treff her er nesten alltid dummy.
const FIXTURE_PATH_RE = /(^|\/)(tests?|examples?|fixtures?|spec|__tests__|_examples?)(\/|$)/;

function readAllowlist(repoRoot) {
  try {
    const set = new Set();
    for (const line of readFileSync(join(repoRoot, ".arch", "secret-audit.allow"), "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      set.add(t);
    }
    return set;
  } catch {
    return new Set();
  }
}

function isGitignored(repoRoot, relPath) {
  try {
    execFileSync("git", ["check-ignore", "-q", relPath], { cwd: repoRoot, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * scan(repoRoot) → { status, files_scanned, findings, gitignored_notes, fixture_notes, details }
 * read-only, kaster aldri. details bærer ALDRI verdier.
 */
export function scan(repoRoot) {
  const allowlist = readAllowlist(repoRoot);
  const findings = [];
  let scannedFiles = 0;

  const scanFile = (absPath, relPath) => {
    let buf;
    try {
      buf = readFileSync(absPath);
      if (buf.includes(0)) return; // binær
    } catch {
      return;
    }
    const text = buf.toString("utf8");
    scannedFiles++;
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const p of PATTERNS) {
        if (p.re.test(line)) {
          // Avkortede placeholders («eyJhbG...7rOE») er aldri ekte hemmeligheter.
          findings.push({ file: relPath, line: i + 1, pattern: p.name, truncated: line.includes("...") });
        }
      }
    }
  };

  const walk = (dir, rel) => {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const name of entries) {
      if (SKIP_DIRS.has(name)) continue;
      if (rel === "" && name === ".env.local") continue; // lovlig store
      const abs = join(dir, name);
      const relPath = rel ? `${rel}/${name}` : name;
      let st;
      try {
        st = statSync(abs);
      } catch {
        continue;
      }
      if (st.isDirectory()) walk(abs, relPath);
      else if (st.isFile() && st.size < 2_000_000) scanFile(abs, relPath);
    }
  };

  walk(repoRoot, "");

  const annotated = findings
    .filter((f) => !allowlist.has(`${f.file}:${f.pattern}`))
    .map((f) => ({ ...f, gitignored: isGitignored(repoRoot, f.file), fixture: FIXTURE_PATH_RE.test(f.file) }));

  const isLeak = (f) => !f.gitignored && !f.fixture && !f.truncated;
  const leaks = annotated.filter(isLeak);
  const notes = annotated.filter((f) => !isLeak(f));

  return {
    status: leaks.length ? "leaks_found" : "clean",
    files_scanned: scannedFiles,
    findings: leaks.length,
    gitignored_notes: notes.filter((n) => n.gitignored).length,
    fixture_notes: notes.filter((n) => !n.gitignored).length,
    details: annotated.slice(0, 100).map((f) => ({
      file: f.file, line: f.line, pattern: f.pattern,
      severity: isLeak(f) ? "leak" : "note",
    })),
  };
}
