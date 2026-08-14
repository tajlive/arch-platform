// Website-funn — Arch Website Audit v1 (F4.2B).
//
// Oversetter FAIL-sjekker (+ browser-evidence + automatiserings-signaler) til funn
// med `kind` som commercial.mjs beriker (4 bøtter + impact/løsning/innsats/build-kandidat).
// UNKNOWN-sjekker blir ALDRI funn — «frahold av bevis» er ikke et negativt faktum.

import { CLASS } from "../classify.mjs";

const CHECK_KIND = {
  https: "web_no_https",
  header_csp: "web_security_headers",
  header_hsts: "web_security_headers",
  header_xcto: "web_security_headers",
  header_referrer: "web_security_headers",
  header_permissions: "web_security_headers",
  header_frame: "web_security_headers",
  mixed_content: "web_mixed_content",
  source_maps: "web_source_maps",
  tech_disclosure: "web_tech_disclosure",
  compression: "web_compression",
  caching: "web_caching",
  render_blocking: "web_render_blocking",
  image_optim: "web_image_optim",
  third_party: "web_third_party",
  viewport: "web_viewport",
  alt_text: "web_alt_text",
  form_labels: "web_form_labels",
  heading_hierarchy: "web_heading_hierarchy",
  semantic: "web_semantic",
  title: "web_seo_title",
  meta_description: "web_seo_meta",
  canonical: "web_seo_canonical",
  robots_txt: "web_seo_robots",
  sitemap: "web_seo_sitemap",
  open_graph: "web_seo_og",
  structured_data: "web_seo_structured",
  broken_links: "web_broken_links",
  asset_failures: "web_asset_failures",
  privacy_link: "web_privacy",
  cookie_banner: "web_privacy",
  contact_form: "web_contact_form",
  cta: "web_cta",
  // ── Audit v2 (ARC-10) ──
  spf: "web_email_spf",
  spf_private_ip: "web_email_spf",
  dmarc: "web_email_dmarc",
  dmarc_subdomain: "web_email_dmarc",
  mta_sts: "web_email_mta_sts",
  tls_rpt: "web_email_mta_sts",
  caa: "web_dns_hardening",
  dnssec: "web_dns_hardening",
  exposed_files: "web_exposed_files",
  cmp_banner: "web_privacy",
  consent_real_choice: "web_privacy",
  consent_prechecked: "web_privacy",
  privacy_policy: "web_privacy",
  third_party_trackers: "web_privacy",
  google_fonts: "web_privacy",
  ecom_price_vat: "web_privacy",
  ecom_angrerett: "web_privacy",
  ecom_klage: "web_privacy",
  psi_mobile: "web_perf_psi",
  psi_desktop: "web_perf_psi",
  psi_crux_mobile: "web_perf_crux",
  psi_crux_desktop: "web_perf_crux",
  social_profiles: "web_social",
  social_dead_links: "web_social",
  nap_phone: "web_nap",
  nap_email: "web_nap",
  nap_name_consistency: "web_company_consistency",
  nap_orgnr_consistency: "web_company_consistency",
  ai_content_quality: "web_content",
  ai_content_freshness: "web_content",
  ai_vis_visibility: "web_ai_visibility",
  ai_vis_position: "web_ai_position",
  ai_vis_sentiment: "web_ai_sentiment",
  ai_vis_sources: "web_ai_visibility",
  history_freshness: "web_freshness",
  brreg_konkurs: "web_konkurs",
  brreg_hjemmeside: "web_company_consistency",
  brreg_navn_consistency: "web_company_consistency",
  norid_dnssec: "web_dns_hardening",
  security_headers: "web_security_headers",
  cookies_attributes: "web_security_headers",
  tls_cert: "web_tls",
  tls_verify: "web_tls",
  tls_legacy: "web_tls",
};

// Dynamiske versjonslekkasje-id-er (leak_0_server, leak_1_powered_by, …) — prefix-match.
function kindFor(ch) {
  if (CHECK_KIND[ch.id]) return CHECK_KIND[ch.id];
  if (/^leak_\d+_/.test(ch.id)) return "web_tech_disclosure";
  return null;
}

const SEVERITY = {
  web_no_https: "critical",
  web_mixed_content: "critical",
  web_viewport: "critical",
  web_security_headers: "high",
  web_source_maps: "high",
  web_broken_links: "high",
  web_asset_failures: "high",
  web_form_labels: "high",
  web_console_errors: "high",
  web_failed_requests: "high",
  web_perf_lcp: "high",
  web_mobile_layout: "high",
  web_privacy: "medium",
  web_contact_form: "high",
  web_automation: "low",
  // ── Audit v2 (ARC-10) ──
  web_email_spf: "medium",
  web_email_dmarc: "medium",
  web_email_mta_sts: "low",
  web_dns_hardening: "low",
  web_exposed_files: "critical",
  web_tls: "critical",
  web_company_consistency: "medium",
  web_konkurs: "critical",
  web_perf_psi: "medium",
  web_perf_crux: "high",
  web_social: "low",
  web_nap: "low",
  web_content: "low",
  web_freshness: "low",
  web_ai_visibility: "medium",
  web_ai_position: "medium",
  web_ai_sentiment: "low",
};

export function buildWebFindings(collectResult, scoreResult, browserEvidence = null) {
  const findings = [];
  let seq = 0;
  const finding = (kind, title, evidence, section = "web") => ({
    id: `W${String(++seq).padStart(3, "0")}`,
    kind,
    title,
    evidence,
    class: CLASS.INFERRED,
    section,
    severity: SEVERITY[kind] ?? "medium",
    priority: 5,
  });

  // 1. FAIL-sjekker → funn
  for (const ch of collectResult.checks ?? []) {
    if (ch.result !== "FAIL") continue;
    const kind = kindFor(ch);
    if (!kind) continue;
    findings.push(finding(kind, ch.label, ch.evidence));
  }

  // 2. Trackere uten synlig samtykke → potensielt concern (signal, krever juridisk review)
  const raw = collectResult.raw ?? {};
  if ((raw.analytics?.length) && !raw.consent_cmp && !raw.cookie_banner) {
    findings.push(finding("web_privacy", "Trackere observert uten synlig samtykke",
      `${raw.analytics.join(", ")} — potensielt concern, krever juridisk gjennomgang`));
  }

  // 3. Browser-evidence (valgfri berikelse)
  const be = browserEvidence ?? {};
  if ((be.console_errors ?? []).length) {
    findings.push(finding("web_console_errors", "JavaScript-feil i nettleser",
      `${be.console_errors.length} console-feil (${be.console_errors.slice(0, 3).map((c) => c.text ?? c).join("; ")})`));
  }
  if ((be.failed_requests ?? []).length) {
    findings.push(finding("web_failed_requests", "Feilende nettverksforespørsler",
      `${be.failed_requests.length} feilede forespørsler (${be.failed_requests.slice(0, 3).map((r) => `${r.url?.split("/")[2]}${r.status ? ` → ${r.status}` : ""}`).join(", ")})`));
  }
  if (be.performance?.lcp && be.performance.lcp > 2500) {
    findings.push(finding("web_perf_lcp", "Høy Largest Contentful Paint (LCP)",
      `LCP ≈ ${be.performance.lcp} ms (over 2500 ms anbefalt terskel)`));
  }
  if (be.mobile?.layout_broken) {
    findings.push(finding("web_mobile_layout", "Mobil-layoutproblem observert",
      be.mobile.detail ?? "overløp/skjult innhold på mobil viewport"));
  }

  // 4. Automatiseringsmuligheter (alltid når uutnyttet potensial > 0)
  const auto = scoreResult.automation;
  if (auto.potential > 0) {
    const missing = Object.entries(raw.automation_signals ?? {}).filter(([, on]) => !on).map(([k]) => k).join(", ");
    findings.push(finding("web_automation", "Automatiseringsmuligheter identifisert",
      `uutnyttet potensial ${auto.potential}% — manglende signaler: ${missing || "n/a"}`));
  }

  return findings;
}
