// Kunde-onboarding & isolasjon — Arch Audit v1 (F4.1).
//
// Eksplisitt consent/scope er en HARD gate: en kunde-audit nektes uten
//   - consent_granted === true
//   - scope er definert
//   - tilgangsnivå = read_only
//
// Data-isolasjon: hver kunde får sin egen manifest + output-katalog.
// Ingen secrets kopieres inn i Arch — manifesten lagrer KUN metadata (id/navn/scope/
// consent/access-beskrivelse), aldri verdier.

import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CUSTOMERS_DIR = join(__dirname, "..", "customers");
const AUDIT_OUT_ROOT = join(__dirname, "..", "..", "..", "docs", "audits", "customers");

export function customersDir() { return CUSTOMERS_DIR; }

/** Leser kundemanifest. Returnerer {manifest} eller {error}. */
export function loadCustomer(id) {
  const p = join(CUSTOMERS_DIR, `${id}.json`);
  if (!existsSync(p)) return { error: `Kundemanifest finnes ikke: ${id}.json (opprett fra _template.json)` };
  try {
    return { manifest: JSON.parse(readFileSync(p, "utf8")) };
  } catch (e) {
    return { error: `Kundemanifest ugyldig JSON: ${e.message}` };
  }
}

/** Validerer consent/scope — returnerer liste av blokkerende feil. */
export function validateConsent(m) {
  const errors = [];
  if (m.consent_granted !== true) errors.push("consent_granted må være true (eksplisitt samtykke mangler)");
  if (!m.scope || !m.scope.description || !String(m.scope.description).trim()) errors.push("scope.description mangler (hva som analyseres må defineres)");
  if (m.access?.level !== "read_only") errors.push("access.level må være read_only (minimum nødvendig tilgang)");
  return errors;
}

/** Konsistens-sjekk for isolasjon: manifesten skal aldri inneholde secrets. */
export function assertNoSecrets(m) {
  const s = JSON.stringify(m);
  return !/(api[_-]?key|secret|token|password|bearer)["']?\s*[:=]\s*["'][A-Za-z0-9_\-\.]{16,}/i.test(s);
}

/** Isolert output-katalog per kunde. */
export function customerOutputDir(id) {
  const dir = join(AUDIT_OUT_ROOT, id);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Consent/scope-banner til kunderapportens topp. */
export function stampScope(m, modeLabel) {
  const L = [];
  L.push(`### Kunde & samtykke\n`);
  L.push(`| Felt | Verdi |`);
  L.push(`|---|---|`);
  L.push(`| Kunde | ${m.name ?? m.id} |`);
  L.push(`| Modus | ${modeLabel} |`);
  L.push(`| Tilgang | ${m.access?.level ?? "read_only"} — ${m.access?.source ?? "ikke angitt"} |`);
  L.push(`| Samtykke | ${m.consent_granted ? `✅ gitt ${m.consent_date ?? ""}` : "❌ mangler"} |`);
  L.push(`| NDA | ${m.nda?.signed ? `✅ signert ${m.nda?.date ?? ""}` : "ikke signert"} |`);
  L.push(`| Scope | ${m.scope?.description ?? "—"} |`);
  if (m.scope?.exclude?.length) L.push(`| Ekskludert fra scope | ${m.scope.exclude.join(", ")} |`);
  L.push(``);
  L.push(`> **Read-only garanti:** Arch endrer ingenting i kundens system under audit.`);
  L.push(`> Ingen hemmeligheter er kopiert inn i Arch. Funn vises kun som fil:linje + mønster, aldri verdier.\n`);
  return L.join("\n");
}

// ── Website Audit (F4.2B) ──

/** Validerer website-manifest: consent-gate med prospect_preview-unntak. */
export function validateWebsite(m) {
  const errors = [];
  const site = m.website;
  if (!site || !/^https?:\/\//i.test(site)) errors.push("website må være en gyldig http(s)-URL");
  if (m.mode !== "prospect_preview" && m.consent_granted !== true) errors.push("consent_granted må være true for formell kunde-audit (eller bruk mode=prospect_preview for intern research)");
  return errors;
}

/** Isolert output-katalog for formell website-audit (samme som repo-audit). */
export const websiteCustomerDir = customerOutputDir;

/** Isolert output-katalog for intern prospect-preview (IKKE formell leveranse). */
export function prospectDir(key) {
  const dir = join(AUDIT_OUT_ROOT, "..", "prospects", key);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Website-scope-banner til rapporttopp. */
export function stampWebsiteScope(m, modeLabel) {
  const L = [];
  L.push(`### Kunde & samtykke\n`);
  L.push(`| Felt | Verdi |`);
  L.push(`|---|---|`);
  L.push(`| Kunde | ${m.name ?? m.id} |`);
  L.push(`| Nettsted | ${m.website ?? "—"} |`);
  L.push(`| Modus | ${modeLabel} |`);
  L.push(`| Scope | Offentlig nettside (kun) |`);
  L.push(`| Tilgang | Read-only / uautentisert (ingen endringer) |`);
  L.push(`| Repository-tilgang | Ikke gitt |`);
  L.push(`| Endringer utført | Ingen |`);
  if (m.mode === "prospect_preview") {
    L.push(`| Consent | Ikke innhentet (intern prospect-vurdering) |`);
  } else {
    L.push(`| Consent | ${m.consent_granted ? `✅ gitt ${m.consent_date ?? ""}` : "❌ mangler"} |`);
  }
  L.push(``);
  L.push(`> **Read-only / utenfor-inn:** Arch analyserer kun offentlig observerbar informasjon.`);
  L.push(`> Ingen login-bypass, ingen aggressive tester, ingen mutasjoner, ingen skjemainnsending.`);
  L.push(`> Interne systemer som ikke er observerbare, rapporteres som **UNKNOWN** — aldri som feil.\n`);
  return L.join("\n");
}
