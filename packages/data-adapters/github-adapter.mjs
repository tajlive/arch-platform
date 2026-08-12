// GitHubAdapter — observert repo-metadata via `gh api` (autentisert).
import { execFileSync } from "node:child_process";
import { observed, error } from "./lib/provenance.mjs";

export async function fetchRepo(repo) {
  try {
    const out = execFileSync(
      "gh", ["api", `repos/${repo}`, "--jq", "{pushed_at, stargazers_count, open_issues_count, archived, private}"],
      { encoding: "utf8", timeout: 15000 },
    );
    return observed(JSON.parse(out.trim()), `github:${repo}`);
  } catch (e) {
    return error(`github:${repo}`, e);
  }
}

export async function fetchCiStatus(repo) {
  try {
    const out = execFileSync(
      "gh", ["api", `repos/${repo}/actions/runs?per_page=1`, "--jq", ".workflow_runs[0] | {status, conclusion, head_sha, created_at}"],
      { encoding: "utf8", timeout: 15000 },
    );
    return observed(JSON.parse(out.trim()), `github-ci:${repo}`);
  } catch (e) {
    return error(`github-ci:${repo}`, e);
  }
}
