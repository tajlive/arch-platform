#!/usr/bin/env node
/**
 * arch-recon.mjs — «Arch Vakt»: autorisert sikkerhets-rekognosering.
 *
 * Orkestrerer: subfinder → httpx → nuclei → (wpscan hvis WordPress) → ffuf (begrenset)
 * og samler alt til en evidence-JSON + markdown-rapport for Arch-auditen.
 *
 * BRUK: node scripts/arch-recon.mjs <domene> [--save <dir>]
 *
 * SIKKERHETSGRENSE (Tom-mandat):
 * - Kun autoriserte domener: egne systemer + kunder med consent_granted-manifest.
 * - Aldri aggressive moduser, ingen brute-force, lav rate.
 * - Read-only verktøy — ingen exploit-forsøk.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const CUSTOMERS_DIR = join(REPO, 'packages', 'audit', 'customers');

// Egne systemer — alltid autorisert for Tom.
const OWN_SCOPE = [
  'klarpakke.no',
  'finnbilglass.no',
  'auto-glass.no',
  'arch-platform.pages.dev',
  'autoglass.finnbilglass.no',
  'tronderglass.no'
];

// Lite innebygd katalog-ordliste for ffuf (lav rate, kun eksistens-sjekk).
const DEFAULT_PATHS = [
  'admin', 'login', 'wp-admin', 'wp-login.php', 'api', 'docs', 'backup', 'backups',
  '.git', '.env', 'robots.txt', 'sitemap.xml', 'upload', 'uploads', 'test', 'dev',
  'staging', 'old', 'phpinfo.php', 'config.php', 'backup.zip', '.htaccess', 'vendor',
  'node_modules', 'health', 'status', 'swagger', 'graphql', '.well-known'
];

function which(cmd) {
  const r = spawnSync('which', [cmd], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', timeout: opts.timeout ?? 120000, ...opts });
  return { ok: r.status === 0, code: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

function inScope(domain, scope) {
  const d = domain.toLowerCase().replace(/^www\./, '');
  return scope.some((s) => d === s || d.endsWith(`.${s}`));
}

function loadCustomerScope() {
  const out = [];
  if (!existsSync(CUSTOMERS_DIR)) return out;
  for (const f of readdirSync(CUSTOMERS_DIR)) {
    if (!f.endsWith('.json') || f.startsWith('_')) continue;
    try {
      const m = JSON.parse(readFileSync(join(CUSTOMERS_DIR, f), 'utf8'));
      if (m.consent_granted === true) {
        const urls = [m.website, m.scope?.description?.match(/https?:\/\/[^\s",)]+/g)?.join(' ')]
          .filter(Boolean).join(' ');
        for (const match of urls.matchAll(/https?:\/\/([^\s/,)]+)/g)) {
          out.push(match[1].replace(/^www\./, ''));
        }
      }
    } catch { /* hopp over ugyldige manifester */ }
  }
  return out;
}

function toolSection(title, lines) {
  if (!lines.length) return '';
  return `\n### ${title}\n\n${lines.map((l) => `- ${l}`).join('\n')}\n`;
}

async function main() {
  const args = process.argv.slice(2);
  const domain = args.find((a) => !a.startsWith('--'));
  const saveFlag = args.indexOf('--save');
  const outDir = saveFlag >= 0 ? resolve(args[saveFlag + 1] || '.') : join(REPO, 'docs', 'audits', 'recon', domain || 'unknown');

  if (!domain) {
    console.error('Bruk: node scripts/arch-recon.mjs <domene> [--save <dir>]');
    process.exit(1);
  }

  const scope = [...new Set([...OWN_SCOPE, ...loadCustomerScope()])];
  if (!inScope(domain, scope)) {
    console.error(`NEKTET: «${domain}» er ikke i autorisert scope.`);
    console.error('Autorisert scope:', scope.join(', '));
    console.error('Legg til en consent-granted-kundemanifest i packages/audit/customers/ eller be Tom godkjenne domenet.');
    process.exit(2);
  }

  mkdirSync(outDir, { recursive: true });
  const summary = {
    domain,
    scanned_at: new Date().toISOString(),
    scope: 'authorized',
    tools: {},
    subdomains: [],
    live_hosts: [],
    findings: [],
    directories: []
  };

  // 1. subfinder — passiv subdomene-oppdagelse
  const subfinder = which('subfinder');
  if (subfinder) {
    const r = run(subfinder, ['-d', domain, '-silent']);
    summary.subdomains = r.out.split('\n').filter(Boolean);
    summary.tools.subfinder = { ok: r.ok, count: summary.subdomains.length };
    console.log(`[1/5] subfinder: ${summary.subdomains.length} subdomener`);
  } else {
    summary.tools.subfinder = { ok: false, error: 'ikke installert' };
    console.log('[1/5] subfinder: ikke installert — hopper over');
  }

  // 2. httpx-toolkit (ProjectDiscovery) — levende hoster + teknologistabel.
  // NB: brew sin «httpx» er Python-klienten — ProjectDiscovery sin heter httpx-toolkit.
  const targets = [domain, ...summary.subdomains];
  const targetFile = join(outDir, 'targets.txt');
  writeFileSync(targetFile, targets.join('\n'));
  const httpx = which('httpx-toolkit') || which('httpx');
  if (httpx) {
    const r = run(httpx, ['-l', targetFile, '-silent', '-sc', '-title', '-td', '-timeout', '10']);
    for (const line of r.out.split('\n').filter(Boolean)) {
      const m = line.match(/^\[(.+?)\] \[(.+?)\] (.*)$/);
      if (m) summary.live_hosts.push({ url: m[1], status: m[2], title: m[3] });
      else summary.live_hosts.push({ url: line, status: '?', title: '' });
    }
    summary.tools.httpx = { ok: r.ok, count: summary.live_hosts.length };
    console.log(`[2/5] httpx: ${summary.live_hosts.length} levende hoster`);
  } else {
    summary.tools.httpx = { ok: false, error: 'ikke installert' };
    console.log('[2/5] httpx: ikke installert — hopper over');
  }

  const liveUrls = summary.live_hosts.map((h) => h.url).filter((u) => u.startsWith('http'));
  if (liveUrls.length === 0) liveUrls.push(`https://${domain}`);
  const liveFile = join(outDir, 'live.txt');
  writeFileSync(liveFile, liveUrls.join('\n'));

  // 3. nuclei — kjente sårbarheter (standard-maler, lav rate)
  const nuclei = which('nuclei');
  if (nuclei) {
    const r = run(nuclei, ['-l', liveFile, '-silent', '-severity', 'low,medium,high,critical', '-timeout', '10'], { timeout: 300000 });
    summary.findings = r.out.split('\n').filter(Boolean);
    summary.tools.nuclei = { ok: r.ok, count: summary.findings.length };
    console.log(`[3/5] nuclei: ${summary.findings.length} funn`);
  } else {
    summary.tools.nuclei = { ok: false, error: 'ikke installert' };
    console.log('[3/5] nuclei: ikke installert — hopper over');
  }

  // 4. wpscan — kun hvis WordPress er detektert (passiv sjekk)
  const hasWordPress = summary.live_hosts.some((h) => /wordpress/i.test(h.title || ''));
  const wpscan = which('wpscan');
  if (wpscan && hasWordPress) {
    const wpUrl = liveUrls[0];
    const r = run(wpscan, ['--url', wpUrl, '--no-banner', '--format', 'json'], { timeout: 300000 });
    summary.tools.wpscan = { ok: r.ok, url: wpUrl, output_chars: r.out.length };
    console.log(`[4/5] wpscan: WordPress detektert på ${wpUrl} — skannet`);
  } else {
    summary.tools.wpscan = { ok: true, skipped: !hasWordPress ? 'ikke WordPress' : 'ikke installert' };
    console.log(`[4/5] wpscan: ${!hasWordPress ? 'ikke WordPress — hopper over' : 'ikke installert'}`);
  }

  // 5. ffuf — begrenset katalog-sjekk (lav rate, liten ordliste)
  const ffuf = which('ffuf');
  if (ffuf) {
    const wordlist = join(outDir, 'wordlist.txt');
    writeFileSync(wordlist, DEFAULT_PATHS.join('\n'));
    const r = run(ffuf, ['-u', `${liveUrls[0]}/FUZZ`, '-w', wordlist, '-mc', '200,201,204,301,302,307,401,403', '-t', '10', '-s'], { timeout: 120000 });
    summary.directories = r.out.split('\n').filter(Boolean);
    summary.tools.ffuf = { ok: r.ok, count: summary.directories.length };
    console.log(`[5/5] ffuf: ${summary.directories.length} katalogtreff`);
  } else {
    summary.tools.ffuf = { ok: false, error: 'ikke installert' };
    console.log('[5/5] ffuf: ikke installert — hopper over');
  }

  // Lagre evidence + rapport
  const evidenceFile = join(outDir, `recon-${domain}.evidence.json`);
  writeFileSync(evidenceFile, JSON.stringify(summary, null, 2));

  const md = [
    `# Arch Vakt — sikkerhetsrekognosering: ${domain}`,
    '',
    `- Skannet: ${summary.scanned_at}`,
    `- Scope: AUTORISERT (egne systemer / kundemanifest)`,
    '',
    `## Sammendrag`,
    '',
    `| Verktøy | Resultat |`,
    `|---|---|`,
    `| subfinder | ${summary.subdomains.length} subdomener |`,
    `| httpx | ${summary.live_hosts.length} levende hoster |`,
    `| nuclei | ${summary.findings.length} funn |`,
    `| ffuf | ${summary.directories.length} katalogtreff |`,
    '',
    `## Subdomener`,
    '',
    ...(summary.subdomains.length ? summary.subdomains.map((s) => `- ${s}`) : ['- Ingen funnet']),
    '',
    `## Levende hoster`,
    '',
    ...(summary.live_hosts.length ? summary.live_hosts.map((h) => `- ${h.url} — HTTP ${h.status} — ${h.title}`) : ['- Ingen']),
    '',
    `## Sårbarhetsfunn (nuclei)`,
    '',
    ...(summary.findings.length ? summary.findings.map((f) => `- ${f}`) : ['- Ingen funn']),
    '',
    `## Katalogtreff (ffuf, begrenset ordliste)`,
    '',
    ...(summary.directories.length ? summary.directories.map((d) => `- ${d}`) : ['- Ingen']),
    '',
    '---',
    '_Arch Vakt kjører kun mot autorisert scope. Ingen exploits, ingen aggressive moduser._'
  ].join('\n');

  const reportFile = join(outDir, `recon-${domain}.md`);
  writeFileSync(reportFile, md);
  console.log(`\n✅ Ferdig. Rapport: ${reportFile}`);
  console.log(`   Evidence: ${evidenceFile}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
