# Teknisk appendix — Arch Website Audit www.revolut.com

> **Generert:** 2026-08-15T00:54:22.602Z · **Nettsted:** https://www.revolut.com · **Endelig URL:** https://www.revolut.com

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.revolut.com.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | FAIL | HTTP 403 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | FAIL | 1 ødelagt (www.revolut.com/ → 403) | high |
| reliability | Ressurs-feil (img/css/js) | PASS | ingen same-origin-ressurser å sample | high |
| performance | Komprimering (gzip/brotli) | PASS | br | high |
| performance | Cache-headere | FAIL | ingen cache-control | high |
| performance | Render-blokkerende ressurser | PASS | 0 blokkerende skript, 0 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 1 bilder, 0 m/ dimensjoner, 0 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 1 eksterne domener () | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | UNKNOWN | stylesheets ikke observerbare | low |
| accessibility | Språk-attributt (lang) | PASS | en-GB | high |
| accessibility | Alt-tekst på bilder | PASS | 0/1 bilder mangler alt | high |
| accessibility | Skjemaetiketter | NOT_APPLICABLE | ingen skjemainput | medium |
| accessibility | Overskriftshierarki | FAIL | h1=1 h2=0 h3=0 | high |
| accessibility | Semantiske landemerker | FAIL | 2/4 (header, main) | high |
| seo | Tittel | PASS | Just a quick security check \| Revolut | high |
| seo | Meta-beskrivelse | FAIL | mangler meta description | high |
| seo | Canonical | FAIL | mangler canonical | high |
| seo | Robots-meta | PASS | index,follow | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | FAIL | mangler sitemap.xml | high |
| seo | OpenGraph | FAIL | title=true description=false image=false | high |
| seo | Strukturert data (JSON-LD) | FAIL | ingen JSON-LD | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | PASS | tilstede | high |
| security | Header: frame | PASS | tilstede | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | cloudflare | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | FAIL | ingen personvern-link observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cdn | PASS | Cloudflare | high |
| tech | Teknologi: hosting | PASS | cloudflare | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |
| security | Sikkerhetsheadere — gradering B | FAIL | Gradering B. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=2592000; includeSubDomains; preload; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: same-origin; Permissions-Policy: accelerometer=(),camera=(),clipboard-read=(),clipboard-write=(),geolocation=(),gyroscope=(… Trekk: CSP mangler · HSTS max-age < 6 mnd (2592000) | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | 1 cookies — alle har HttpOnly, Secure og SameSite. | high |
| security | Ingen versjonslekkasjer | PASS | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. | medium |
| security | TLS-sertifikat gyldighet | UNKNOWN | Kunne ikke hente sertifikatinfo (ingen PEM i s_client-output). | medium |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | FAIL | v=spf1 include:_spf.google.com include:mail.zendesk.com include:_spf.atlassian.net include:_spf.salesforce.com include:_spf.sparkpostmail.com ~all — ~all er svakt, spoofing mulig | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | PASS | selector: google | medium |
| security | DMARC (spoofing-beskyttelse) | PASS | p=quarantine (delvis) — v=DMARC1; p=quarantine; pct=100; sp=quarantine; rua=mailto:revolut@rua.netcraft.com,mailto:dmarc@revolut.com; ruf=mailto:revolut@ruf.netcraft.com,mailto:dmarc@revolut.com; | high |
| security | DMARC for subdomene | FAIL | ingen _dmarc.www.revolut.com — subdomener kan spoofes | medium |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | PASS | v=BIMI1;l=https://vmc.digicert.com/d769f6ee-8fe8-480e-8186-627e2dd908d9.svg;a=https://vmc.digicert.com/d769f6ee-8fe8-480e-8186-627e2dd908d9.pem | low |
| security | CAA (sertifikat-utsteder-kontroll) | PASS | issuer: amazon.com, fnmt.es, digicert.com, visa.com, mastercard.com, pki.goog, sectigo.com, letsencrypt.org, e-szigno.hu, ssl.com, buypass.com | high |
| security | DNSSEC (signert sone) | FAIL | manglende AD-flag — sonen er ikke DNSSEC-signert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | aspmx.l.google.com (172.253.148.27) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | UNKNOWN | crt.sh-feil: The operation was aborted due to timeout | low |
| trust_privacy | Firma i Brreg (Enhetsregisteret) | UNKNOWN | ingen Brreg-treff | medium |
| trust_privacy | Bransjekontekst (SSB) | UNKNOWN | ingen næringskode tilgjengelig | medium |
| trust_privacy | Domenet registrert (Norid) | NOT_APPLICABLE | utenlandsk domene — Norid ikke autoritativ | high |
| reliability | Arkivhistorikk finnes | PASS | arkivert siden 2004-04-07 | high |
| reliability | Aktualitet (siste arkiverte versjon) | PASS | fanget i løpet av siste 12 mnd (2025-08-15) | high |
| reliability | Arkivomfang | UNKNOWN | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | FAIL | ingen CMP/banner observert — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Reelt valg (avvis-knapp) | NOT_APPLICABLE | ingen banner/CMP observert | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | FAIL | ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering | high |
| trust_privacy | Tredjeparts-trackere | PASS | ingen kjente tredjeparts-trackere observert | high |
| trust_privacy | Google Fonts (ekstern) | PASS | ingen ekstern Google Fonts observert | high |
| trust_privacy | Pris inkl. mva | FAIL | pris inkl. mva ikke observert — potential concern (prisopplysningsforskriften), krever juridisk vurdering | high |
| trust_privacy | Angrerett-informasjon | FAIL | angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering | high |
| trust_privacy | Klageadgang / tvisteløsning | FAIL | klageadgang/tvisteløsning ikke observert — potential concern, krever juridisk vurdering | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Hjemmeside lesbar for tilstedeværelse-sjekk | UNKNOWN | kunne ikke hente HTML | medium |
| ux_mobile | AI-innholdsanalyse | UNKNOWN | kunne ikke hente hjemmeside-HTML | medium |
| ai_visibility | Synlighet i AI-svar | UNKNOWN | kunne ikke hente hjemmeside-HTML | medium |

## 2. HTTP & redirect-kjede

- Status: 403 Forbidden
- Endelig URL: https://www.revolut.com
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: br · Cache: —

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | max-age=2592000; includeSubDomains; preload |
| xcto | nosniff |
| referrer | same-origin |
| permissions | accelerometer=(),camera=(),clipboard-read=(),clipboard-write=(),geolocation=(),gyroscope=(),hid=(),magnetometer=(),microphone=(),payment=(),publickey-credentials-get=(),screen-wake-lock=(),serial=(),sync-xhr=(),usb=(),xr-spatial-tracking=* |
| frame | SAMEORIGIN |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: cloudflare

## 4. Crawl-resultat

- Sider sjekket: 1 · Vellykket: 0
- Ødelagte interne lenker: 1
  https://www.revolut.com/ → 403
- Ressurs-feil: 0/0

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: — · CDN: Cloudflare · Hosting: cloudflare
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: ingen

## 6. SEO / Meta / Struktur

- Tittel: Just a quick security check | Revolut · Meta-beskrivelse: —
- Canonical: — · robots.txt: ja · Sitemap: nei
- OpenGraph: {"title":true,"description":false,"image":false} · JSON-LD: nei
- Headings: {"h1":1,"h2":0,"h3":0,"h4":0,"h5":0,"h6":0} · Lang: en-GB

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":false,"chat":false,"booking":true,"newsletter":false}
- Uutnyttet potensial: 67% (2/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.revolut.com.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [FAIL] security_headers: Gradering B. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=2592000; includeSubDomains; preload; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: same-origin; Permissions-Policy: accelerometer=(),camera=(),clipboard-read=(),clipboard-write=(),geolocation=(),gyroscope=(… Trekk: CSP mangler · HSTS max-age < 6 mnd (2592000)
- [PASS] cookies_attributes: 1 cookies — alle har HttpOnly, Secure og SameSite.
- [PASS] version_leaks: Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert.
- [UNKNOWN] tls_cert: Kunne ikke hente sertifikatinfo (ingen PEM i s_client-output).
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [FAIL] spf: v=spf1 include:_spf.google.com include:mail.zendesk.com include:_spf.atlassian.net include:_spf.salesforce.com include:_spf.sparkpostmail.com ~all — ~all er svakt, spoofing mulig
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [PASS] dkim: selector: google
- [PASS] dmarc: p=quarantine (delvis) — v=DMARC1; p=quarantine; pct=100; sp=quarantine; rua=mailto:revolut@rua.netcraft.com,mailto:dmarc@revolut.com; ruf=mailto:revolut@ruf.netcraft.com,mailto:dmarc@revolut.com;
- [FAIL] dmarc_subdomain: ingen _dmarc.www.revolut.com — subdomener kan spoofes
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [PASS] bimi: v=BIMI1;l=https://vmc.digicert.com/d769f6ee-8fe8-480e-8186-627e2dd908d9.svg;a=https://vmc.digicert.com/d769f6ee-8fe8-480e-8186-627e2dd908d9.pem
- [PASS] caa: issuer: amazon.com, fnmt.es, digicert.com, visa.com, mastercard.com, pki.goog, sectigo.com, letsencrypt.org, e-szigno.hu, ssl.com, buypass.com
- [FAIL] dnssec: manglende AD-flag — sonen er ikke DNSSEC-signert
- [PASS] dnsbl: aspmx.l.google.com (172.253.148.27) ikke listet
- [UNKNOWN] subdomains: crt.sh-feil: The operation was aborted due to timeout

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [UNKNOWN] brreg_org: ingen Brreg-treff
- [UNKNOWN] ssb_context: ingen næringskode tilgjengelig
- [NOT_APPLICABLE] norid_registered: utenlandsk domene — Norid ikke autoritativ

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [PASS] history_exists: arkivert siden 2004-04-07
- [PASS] history_freshness: fanget i løpet av siste 12 mnd (2025-08-15)
- [UNKNOWN] history_scope: omfang ikke tilgjengelig (Wayback CDX timeout på full historikk)

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error, fallback

## Compliance-signaler Norge (compliance)

- [FAIL] cmp_banner: ingen CMP/banner observert — potential concern, krever juridisk vurdering
- [NOT_APPLICABLE] consent_real_choice: ingen banner/CMP observert
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [FAIL] privacy_policy: ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering
- [PASS] third_party_trackers: ingen kjente tredjeparts-trackere observert
- [PASS] google_fonts: ingen ekstern Google Fonts observert
- [FAIL] ecom_price_vat: pris inkl. mva ikke observert — potential concern (prisopplysningsforskriften), krever juridisk vurdering
- [FAIL] ecom_angrerett: angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering
- [FAIL] ecom_klage: klageadgang/tvisteløsning ikke observert — potential concern, krever juridisk vurdering

Rådata-nøkler: url, fetched, status, fetch_error, html_length, script_srcs, cmp, consent_reject, consent_prechecked, privacy, trackers, google_fonts, ecommerce

## Fart (PageSpeed Insights + CrUX) (pagespeed)

- [UNKNOWN] psi_mobile: API-feil: HTTP 429
- [UNKNOWN] psi_desktop: API-feil: HTTP 429
- [UNKNOWN] psi_availability: API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig

Rådata-nøkler: mobile, desktop

## Tilstedeværelse (sosiale medier · NAP) (presence)

- [UNKNOWN] presence_html: kunne ikke hente HTML

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [UNKNOWN] ai_content: kunne ikke hente hjemmeside-HTML

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [UNKNOWN] ai_vis_visibility: kunne ikke hente hjemmeside-HTML

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis

# V2-kjøretid: 43814 ms (moduler parallelt)