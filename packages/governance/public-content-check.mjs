#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderV2Sections } from "../audit/lib/web/report-v2.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const auditsDir = join(root, "apps", "customer-portal", "audits");

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) walk(file, files);
    else if (file.endsWith(".html")) files.push(file);
  }
  return files;
}

const rawJson = walk(auditsDir).filter((file) => /<td>\s*\{(?:"|&quot;)/.test(readFileSync(file, "utf8")));
const rendered = renderV2Sections({
  v2: {
    sections: [{
      section: "email_dns",
      title: "E-post og DNS",
      raw: { spf: { record: null }, dmarc: { record: null, policy: null }, dkim: { record: null } },
      checks: []
    }]
  }
});
const rendererSafe = !rendered.includes("{") && rendered.includes("ikke registrert");

if (rawJson.length || !rendererSafe) {
  if (rawJson.length) console.error(`Rå JSON i publiserte auditsider: ${rawJson.join(", ")}`);
  if (!rendererSafe) console.error("DNS-rendereren kan skrive tekniske objektdata til kundevisningen.");
  process.exit(1);
}

console.log("Public content check: ingen rå JSON i auditsider, og DNS-rendering er sanert.");
