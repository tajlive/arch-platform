# Teknisk appendix — Arch Website Audit autoglass.finnbilglass.no

> **Generert:** 2026-08-15T00:45:22.949Z · **Nettsted:** https://autoglass.finnbilglass.no · **Endelig URL:** https://autoglass.finnbilglass.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-autoglass.finnbilglass.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 1 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 2 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | br | high |
| performance | Cache-headere | PASS | public, max-age=0, must-revalidate | high |
| performance | Render-blokkerende ressurser | PASS | 0 blokkerende skript, 2 stylesheets | medium |
| performance | Bilde-optimalisering | NOT_APPLICABLE | ingen <img> | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 1 eksterne domener (fonts.googleapis.com) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | no | high |
| accessibility | Alt-tekst på bilder | NOT_APPLICABLE | ingen <img> | high |
| accessibility | Skjemaetiketter | NOT_APPLICABLE | ingen skjemainput | medium |
| accessibility | Overskriftshierarki | FAIL | h1=0 h2=0 h3=0 | high |
| accessibility | Semantiske landemerker | FAIL | 0/4 (ingen) | high |
| seo | Tittel | PASS | Autoglass AS - B2B Grossist | high |
| seo | Meta-beskrivelse | PASS | Autoglass AS - B2B grossist av bilglass. 133 000+ glass på lager og 27 000+ varianter. | high |
| seo | Canonical | PASS | https://autoglass.finnbilglass.no/ | high |
| seo | Robots-meta | PASS | ingen robots-meta (standard: indekserbart) | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (11 URL-er) | high |
| seo | OpenGraph | PASS | title=true description=true image=true | high |
| seo | Strukturert data (JSON-LD) | FAIL | ingen JSON-LD | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | FAIL | mangler | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | FAIL | mangler | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | PASS | ingen sourceMappingURL i sjekkede skript | medium |
| security | Versjons-avsløring | FAIL | cloudflare | high |
| trust_privacy | Cookie-banner | FAIL | ingen cookie-banner observert | low |
| trust_privacy | Personvernerklæring-link | FAIL | ingen personvern-link observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | FAIL | ingen tydelig CTA observert | low |
| tech | Teknologi: cdn | PASS | Cloudflare | high |
| tech | Teknologi: hosting | PASS | cloudflare | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |
| security | Sikkerhetsheadere — gradering E | FAIL | Gradering E. Content-Security-Policy: MANGLER; Strict-Transport-Security: MANGLER; X-Frame-Options: MANGLER; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · Permissions-Policy mangler | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | Ingen cookies satt av serveren (0 set-cookie-headere). | high |
| security | Ingen versjonslekkasjer | PASS | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. | medium |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-07-25T02:20:01.000Z, notAfter=2026-10-23T03:19:52.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=autoglass.finnbilglass.no | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | FAIL | v=spf1 include:_spf.domeneshop.no ~all — ~all er svakt, spoofing mulig | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | UNKNOWN | ingen av probede selektorer funnet (kan ikke konkludere fravær) | low |
| security | DMARC (spoofing-beskyttelse) | PASS | p=quarantine (delvis) — v=DMARC1; p=quarantine; rua=mailto:dmarc@domeneshop.no | high |
| security | DMARC for subdomene | FAIL | ingen _dmarc.autoglass.finnbilglass.no — subdomener kan spoofes | medium |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | NOT_APPLICABLE | ingen BIMI (ikke påkrevd) | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | FAIL | manglende AD-flag — sonen er ikke DNSSEC-signert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | mx.domeneshop.no (194.63.252.28) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | UNKNOWN | crt.sh-feil: The operation was aborted due to timeout | low |
| trust_privacy | Firma i Brreg (Enhetsregisteret) | UNKNOWN | N kandidater for «Autoglass», ingen med Brreg-hjemmeside som matcher finnbilglass.no — kan ikke entydig knytte firma til domene. Kandidater: AUTOGLASS AS (968552732) · LARSEN AUTOGLASS (990447829) · BJÅLIDS AUTOGLASS AS (987814160) | medium |
| trust_privacy | Bransjekontekst (SSB) | UNKNOWN | SSB-tabell ikke kartlagt for næring 46 | medium |
| trust_privacy | Domenet registrert (Norid) | PASS | registrert 2026-05-24 | high |
| reliability | Sist endret (Norid) | PASS | sist endret 2026-08-13 | high |
| security | DNSSEC (Norid) | FAIL | DNSSEC ikke aktivert (delegationSigned=false) | high |
| trust_privacy | Registrar (Norid) | PASS | registrar: Domeneshop AS | high |
| reliability | Arkivhistorikk finnes | UNKNOWN | ingen arkiverte versjoner funnet i Wayback for finnbilglass.no | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | FAIL | ingen CMP/banner observert — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Reelt valg (avvis-knapp) | NOT_APPLICABLE | ingen banner/CMP observert | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | FAIL | ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering | high |
| trust_privacy | Tredjeparts-trackere | PASS | ingen kjente tredjeparts-trackere observert | high |
| trust_privacy | Google Fonts (ekstern) | FAIL | ekstern Google Fonts observert (IP-data til Google) — signal, krever juridisk vurdering | high |
| trust_privacy | Pris inkl. mva | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| trust_privacy | Angrerett-informasjon | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| trust_privacy | Klageadgang / tvisteløsning | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Sosiale medier (lenker fra nettsiden) | FAIL | ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet) | high |
| trust_privacy | Telefon på nettsiden | FAIL | ingen tel:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | E-post på nettsiden | FAIL | ingen mailto:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | Navn-konsistens (nettside ↔ Brreg) | PASS | «AUTOGLASS AS» (Brreg) samsvarer med nettsidenavn | high |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | UNKNOWN | Nettsiden presenterer Autoglass AS som en B2B-grossist av bilglass, med konkrete tall på lagerbeholdning (133 000+ glass) og sortiment (27 000+ varianter). Innholdet er funksjonelt og uten feil, men svært begrenset i omfang, noe som gir lite informasjon om selskapets historikk, tjenester eller verdiøkende tilbud. Aktualiteten vurderes som frisk siden det ikke finnes utdaterte datoer eller årstall i teksten. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | PASS | Ingen årstall-signaler funnet i teksten · Ingen stavefeil eller ufullstendige setninger · Teksten er kort og informativ, men mangler dybde og kontekst | medium |
| ai_visibility | Synlighet i AI-svar | FAIL | 0/3 svar nevner Autoglass AS · sitat: «Autoglas Norge» · prompter: «Hvilken B2B-leverandør anbefaler du for bilglass m…» / «Hva er det beste alternativet for grossist av bilg…» | medium |
| ai_visibility | Posisjon i AI-svar | FAIL | ikke nevnt i noen av svarene | medium |
| ai_visibility | Sentiment i AI-omtale | PASS | sentiment: nøytral · råd: Sørg for å bli nevnt som en selvstendig aktør med eget lager og sortiment i AI-svar, ikke bare som partner til andre leverandører. | medium |
| ai_visibility | Kilder AI-en siterer | PASS | eksterne domener i AI-svar: glassbutikken.no | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://autoglass.finnbilglass.no
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: br · Cache: public, max-age=0, must-revalidate

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | — mangler |
| xcto | nosniff |
| referrer | strict-origin-when-cross-origin |
| permissions | — mangler |
| frame | — mangler |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: nei
- Versjons-avsløring: cloudflare

## 4. Crawl-resultat

- Sider sjekket: 1 · Vellykket: 1
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/2

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: — · CDN: Cloudflare · Hosting: cloudflare
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: fonts.googleapis.com

## 6. SEO / Meta / Struktur

- Tittel: Autoglass AS - B2B Grossist · Meta-beskrivelse: Autoglass AS - B2B grossist av bilglass. 133 000+ glass på lager og 27 000+ varianter.
- Canonical: https://autoglass.finnbilglass.no/ · robots.txt: ja · Sitemap: 11 URL-er
- OpenGraph: {"title":true,"description":true,"image":true} · JSON-LD: nei
- Headings: {"h1":0,"h2":0,"h3":0,"h4":0,"h5":0,"h6":0} · Lang: no

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":false,"chat":false,"booking":false,"newsletter":false}
- Uutnyttet potensial: 83% (1/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-autoglass.finnbilglass.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [FAIL] security_headers: Gradering E. Content-Security-Policy: MANGLER; Strict-Transport-Security: MANGLER; X-Frame-Options: MANGLER; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · Permissions-Policy mangler
- [PASS] cookies_attributes: Ingen cookies satt av serveren (0 set-cookie-headere).
- [PASS] version_leaks: Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert.
- [PASS] tls_cert: notBefore=2026-07-25T02:20:01.000Z, notAfter=2026-10-23T03:19:52.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=autoglass.finnbilglass.no
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [FAIL] spf: v=spf1 include:_spf.domeneshop.no ~all — ~all er svakt, spoofing mulig
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [UNKNOWN] dkim: ingen av probede selektorer funnet (kan ikke konkludere fravær)
- [PASS] dmarc: p=quarantine (delvis) — v=DMARC1; p=quarantine; rua=mailto:dmarc@domeneshop.no
- [FAIL] dmarc_subdomain: ingen _dmarc.autoglass.finnbilglass.no — subdomener kan spoofes
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [NOT_APPLICABLE] bimi: ingen BIMI (ikke påkrevd)
- [FAIL] caa: ingen CAA
- [FAIL] dnssec: manglende AD-flag — sonen er ikke DNSSEC-signert
- [PASS] dnsbl: mx.domeneshop.no (194.63.252.28) ikke listet
- [UNKNOWN] subdomains: crt.sh-feil: The operation was aborted due to timeout

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [UNKNOWN] brreg_org: N kandidater for «Autoglass», ingen med Brreg-hjemmeside som matcher finnbilglass.no — kan ikke entydig knytte firma til domene. Kandidater: AUTOGLASS AS (968552732) · LARSEN AUTOGLASS (990447829) · BJÅLIDS AUTOGLASS AS (987814160)
- [UNKNOWN] ssb_context: SSB-tabell ikke kartlagt for næring 46
- [PASS] norid_registered: registrert 2026-05-24
- [PASS] norid_changed: sist endret 2026-08-13
- [FAIL] norid_dnssec: DNSSEC ikke aktivert (delegationSigned=false)
- [PASS] norid_registrar: registrar: Domeneshop AS

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [UNKNOWN] history_exists: ingen arkiverte versjoner funnet i Wayback for finnbilglass.no

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error, fallback

## Compliance-signaler Norge (compliance)

- [FAIL] cmp_banner: ingen CMP/banner observert — potential concern, krever juridisk vurdering
- [NOT_APPLICABLE] consent_real_choice: ingen banner/CMP observert
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [FAIL] privacy_policy: ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering
- [PASS] third_party_trackers: ingen kjente tredjeparts-trackere observert
- [FAIL] google_fonts: ekstern Google Fonts observert (IP-data til Google) — signal, krever juridisk vurdering
- [NOT_APPLICABLE] ecom_price_vat: ingen e-handels-signaler observert (handlekurv/kjøp/pris)
- [NOT_APPLICABLE] ecom_angrerett: ingen e-handels-signaler observert (handlekurv/kjøp/pris)
- [NOT_APPLICABLE] ecom_klage: ingen e-handels-signaler observert (handlekurv/kjøp/pris)

Rådata-nøkler: url, fetched, status, fetch_error, html_length, script_srcs, cmp, consent_reject, consent_prechecked, privacy, trackers, google_fonts, ecommerce

## Fart (PageSpeed Insights + CrUX) (pagespeed)

- [UNKNOWN] psi_mobile: API-feil: HTTP 429
- [UNKNOWN] psi_desktop: API-feil: HTTP 429
- [UNKNOWN] psi_availability: API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig

Rådata-nøkler: mobile, desktop

## Tilstedeværelse (sosiale medier · NAP) (presence)

- [FAIL] social_profiles: ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet)
- [FAIL] nap_phone: ingen tel:-lenke observert — potential concern (kontaktbarhet)
- [FAIL] nap_email: ingen mailto:-lenke observert — potential concern (kontaktbarhet)
- [PASS] nap_name_consistency: «AUTOGLASS AS» (Brreg) samsvarer med nettsidenavn
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [UNKNOWN] ai_content_quality: Nettsiden presenterer Autoglass AS som en B2B-grossist av bilglass, med konkrete tall på lagerbeholdning (133 000+ glass) og sortiment (27 000+ varianter). Innholdet er funksjonelt og uten feil, men svært begrenset i omfang, noe som gir lite informasjon om selskapets historikk, tjenester eller verdiøkende tilbud. Aktualiteten vurderes som frisk siden det ikke finnes utdaterte datoer eller årstall i teksten.
- [PASS] ai_content_freshness: Ingen årstall-signaler funnet i teksten · Ingen stavefeil eller ufullstendige setninger · Teksten er kort og informativ, men mangler dybde og kontekst

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [FAIL] ai_vis_visibility: 0/3 svar nevner Autoglass AS · sitat: «Autoglas Norge» · prompter: «Hvilken B2B-leverandør anbefaler du for bilglass m…» / «Hva er det beste alternativet for grossist av bilg…»
- [FAIL] ai_vis_position: ikke nevnt i noen av svarene
- [PASS] ai_vis_sentiment: sentiment: nøytral · råd: Sørg for å bli nevnt som en selvstendig aktør med eget lager og sortiment i AI-svar, ikke bare som partner til andre leverandører.
- [PASS] ai_vis_sources: eksterne domener i AI-svar: glassbutikken.no

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis, measurements

# V2-kjøretid: 41532 ms (moduler parallelt)