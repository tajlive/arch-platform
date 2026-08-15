# Teknisk appendix — Arch Website Audit www.autoglasnorden.se

> **Generert:** 2026-08-15T00:48:12.856Z · **Nettsted:** https://www.autoglasnorden.se · **Endelig URL:** https://www.autoglasnorden.se

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.autoglasnorden.se.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 10 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 10 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | gzip | high |
| performance | Cache-headere | FAIL | ingen cache-control | high |
| performance | Render-blokkerende ressurser | FAIL | 14 blokkerende skript, 10 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 4 bilder, 2 m/ dimensjoner, 0 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 2 eksterne domener (use.typekit.net, autoglass-se.utvikl.es) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | sv-SE | high |
| accessibility | Alt-tekst på bilder | PASS | 0/4 bilder mangler alt | high |
| accessibility | Skjemaetiketter | PASS | 1 input, 1 label | medium |
| accessibility | Overskriftshierarki | FAIL | h1=2 h2=1 h3=0 | high |
| accessibility | Semantiske landemerker | PASS | 3/4 (header, nav, footer) | high |
| seo | Tittel | PASS | Autoglas – Vi kan bilglas - Autoglass | high |
| seo | Meta-beskrivelse | FAIL | mangler meta description | high |
| seo | Canonical | PASS | https://www.autoglasnorden.se/ | high |
| seo | Robots-meta | PASS | index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1 | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (40 URL-er) | high |
| seo | OpenGraph | FAIL | title=true description=true image=false | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | FAIL | mangler | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | PASS | tilstede | high |
| security | Blandet innhold (http på https) | FAIL | 1 http-referanser | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | nginx | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | FAIL | ingen personvern-link observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cms | PASS | WordPress | medium |
| tech | Teknologi: hosting | PASS | nginx | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager, Facebook Pixel | high |
| security | Sikkerhetsheadere — gradering D | FAIL | Gradering D. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=31536000; preload; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS uten includeSubDomains · Referrer-Policy mangler · Permissions-Policy mangler | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | Ingen cookies satt av serveren (0 set-cookie-headere). | high |
| security | Versjonslekkasje: server-header | FAIL | server: nginx | high |
| security | WordPress-signatur i generator | FAIL | generator: WordPress 5.8.1 | medium |
| security | Versjonslekkasje: <meta name=generator> | FAIL | generator: WooCommerce 5.8.0 | medium |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-06-21T23:39:05.000Z, notAfter=2026-09-19T23:39:04.000Z, issuer=C=US, O=Let's Encrypt, CN=YE2, SAN=www.autoglasnorden.se | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | PASS | v=spf1 include:spf.protection.outlook.com -all | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | UNKNOWN | ingen av probede selektorer funnet (kan ikke konkludere fravær) | low |
| security | DMARC (spoofing-beskyttelse) | FAIL | ingen DMARC | high |
| security | DMARC for subdomene | FAIL | ingen _dmarc.www.autoglasnorden.se — subdomener kan spoofes | medium |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | NOT_APPLICABLE | ingen BIMI (ikke påkrevd) | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | FAIL | manglende AD-flag — sonen er ikke DNSSEC-signert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | autoglasnorden-se.mail.protection.outlook.com (52.101.68.36) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | PASS | 0 unike subdomener utover apex/www (sertifikatregistret crt.sh har kun hoveddomenet) | medium |
| trust_privacy | Firma i Brreg (Enhetsregisteret) | UNKNOWN | N kandidater for «Autoglass», ingen med Brreg-hjemmeside som matcher autoglasnorden.se — kan ikke entydig knytte firma til domene. Kandidater: AUTOGLASS AS (968552732) · LARSEN AUTOGLASS (990447829) · BJÅLIDS AUTOGLASS AS (987814160) | medium |
| trust_privacy | Bransjekontekst (SSB) | UNKNOWN | SSB-tabell ikke kartlagt for næring 46 | medium |
| trust_privacy | Domenet registrert (Norid) | NOT_APPLICABLE | utenlandsk domene — Norid ikke autoritativ | high |
| reliability | Arkivhistorikk finnes | PASS | arkivert siden 2008-06-17 | high |
| reliability | Aktualitet (siste arkiverte versjon) | PASS | fanget i løpet av siste 12 mnd (2025-08-15) | high |
| reliability | Arkivomfang | UNKNOWN | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | FAIL | ingen CMP/banner observert — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Reelt valg (avvis-knapp) | NOT_APPLICABLE | ingen banner/CMP observert | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | PASS | lenket, ikke i footer | high |
| trust_privacy | Tredjeparts-trackere | FAIL | trackere observert (Google Tag Manager, Facebook Pixel) — ingen synlig samtykke-gating observert — potential concern, krever juridisk vurdering | high |
| trust_privacy | Google Fonts (ekstern) | PASS | ingen ekstern Google Fonts observert | high |
| trust_privacy | Pris inkl. mva | FAIL | pris inkl. mva ikke observert — potential concern (prisopplysningsforskriften), krever juridisk vurdering | high |
| trust_privacy | Angrerett-informasjon | FAIL | angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering | high |
| trust_privacy | Klageadgang / tvisteløsning | FAIL | klageadgang/tvisteløsning ikke observert — potential concern, krever juridisk vurdering | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Sosiale medier (lenker fra nettsiden) | FAIL | ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet) | high |
| trust_privacy | Telefon på nettsiden | FAIL | ingen tel:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | E-post på nettsiden | PASS | mailto: info@autoglasnorden.se | medium |
| trust_privacy | Navn-konsistens (nettside ↔ Brreg) | PASS | «AUTOGLASS AS» (Brreg) samsvarer med nettsidenavn | high |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | UNKNOWN | Nettsiden til Autoglas AB presenterer selskapet som en pålitelig leverandør av bilglass med stort lager og eksport over Skandinavia og Baltikum. Innholdet er informativt og profesjonelt, men mangler meta-beskrivelse og har en del teknisk sjargong som kan være uklar for vanlige kunder. Aktualiteten er vanskelig å vurdere på grunn av manglende datoer, men teksten virker ikke utdatert. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | PASS | Ingen årstall-signaler funnet i teksten · Ingen datoer eller ©-år funnet · Ingen nyhetsinnlegg eller oppdateringer nevnt · Teksten inneholder ingen tegn på utdatert innhold | medium |
| ai_visibility | Synlighet i AI-svar | PASS | 2/3 svar nevner Autoglass · sitat: «Autoglas Sverige (del av Autoglas Nordic) – De har et bredt sortiment og samarbeider med flere grossister. De kan håndtere både standard og » · prompter: «Jag behöver byta vindruta på min bil och vill ha e…» / «Vilken bilglasfirma i Kungsängen har störst lager …» | medium |
| ai_visibility | Posisjon i AI-svar | FAIL | beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar | medium |
| ai_visibility | Sentiment i AI-omtale | PASS | sentiment: blandet · råd: Sørg for at deres lagerstørrelse og logistikksenter i Kungsängen tydelig kommuniseres i AI-synlige kilder, da de ikke ble nevnt i svaret om  | medium |
| ai_visibility | Kilder AI-en siterer | PASS | eksterne domener i AI-svar: nster.com | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.autoglasnorden.se
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: gzip · Cache: —

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | max-age=31536000; preload |
| xcto | nosniff |
| referrer | — mangler |
| permissions | — mangler |
| frame | SAMEORIGIN |
- Blandet innhold: 1 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: nginx

## 4. Crawl-resultat

- Sider sjekket: 10 · Vellykket: 10
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/10

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: WordPress · CDN: — · Hosting: nginx
- Analytics/trackere: Google Analytics/Tag Manager, Facebook Pixel
- Tredjeparts-domener: use.typekit.net, autoglass-se.utvikl.es

## 6. SEO / Meta / Struktur

- Tittel: Autoglas – Vi kan bilglas - Autoglass · Meta-beskrivelse: —
- Canonical: https://www.autoglasnorden.se/ · robots.txt: ja · Sitemap: 40 URL-er
- OpenGraph: {"title":true,"description":true,"image":false} · JSON-LD: ja
- Headings: {"h1":2,"h2":1,"h3":0,"h4":3,"h5":1,"h6":0} · Lang: sv-SE

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":false,"chat":false,"booking":true,"newsletter":false}
- Uutnyttet potensial: 67% (2/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.autoglasnorden.se.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [FAIL] security_headers: Gradering D. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=31536000; preload; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS uten includeSubDomains · Referrer-Policy mangler · Permissions-Policy mangler
- [PASS] cookies_attributes: Ingen cookies satt av serveren (0 set-cookie-headere).
- [FAIL] leak_0_server: server: nginx
- [FAIL] leak_1_wordpress: generator: WordPress 5.8.1
- [FAIL] leak_2_meta: generator: WooCommerce 5.8.0
- [PASS] tls_cert: notBefore=2026-06-21T23:39:05.000Z, notAfter=2026-09-19T23:39:04.000Z, issuer=C=US, O=Let's Encrypt, CN=YE2, SAN=www.autoglasnorden.se
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [PASS] spf: v=spf1 include:spf.protection.outlook.com -all
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [UNKNOWN] dkim: ingen av probede selektorer funnet (kan ikke konkludere fravær)
- [FAIL] dmarc: ingen DMARC
- [FAIL] dmarc_subdomain: ingen _dmarc.www.autoglasnorden.se — subdomener kan spoofes
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [NOT_APPLICABLE] bimi: ingen BIMI (ikke påkrevd)
- [FAIL] caa: ingen CAA
- [FAIL] dnssec: manglende AD-flag — sonen er ikke DNSSEC-signert
- [PASS] dnsbl: autoglasnorden-se.mail.protection.outlook.com (52.101.68.36) ikke listet
- [PASS] subdomains: 0 unike subdomener utover apex/www (sertifikatregistret crt.sh har kun hoveddomenet)

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [UNKNOWN] brreg_org: N kandidater for «Autoglass», ingen med Brreg-hjemmeside som matcher autoglasnorden.se — kan ikke entydig knytte firma til domene. Kandidater: AUTOGLASS AS (968552732) · LARSEN AUTOGLASS (990447829) · BJÅLIDS AUTOGLASS AS (987814160)
- [UNKNOWN] ssb_context: SSB-tabell ikke kartlagt for næring 46
- [NOT_APPLICABLE] norid_registered: utenlandsk domene — Norid ikke autoritativ

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [PASS] history_exists: arkivert siden 2008-06-17
- [PASS] history_freshness: fanget i løpet av siste 12 mnd (2025-08-15)
- [UNKNOWN] history_scope: omfang ikke tilgjengelig (Wayback CDX timeout på full historikk)

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error, fallback

## Compliance-signaler Norge (compliance)

- [FAIL] cmp_banner: ingen CMP/banner observert — potential concern, krever juridisk vurdering
- [NOT_APPLICABLE] consent_real_choice: ingen banner/CMP observert
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [PASS] privacy_policy: lenket, ikke i footer
- [FAIL] third_party_trackers: trackere observert (Google Tag Manager, Facebook Pixel) — ingen synlig samtykke-gating observert — potential concern, krever juridisk vurdering
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

- [FAIL] social_profiles: ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet)
- [FAIL] nap_phone: ingen tel:-lenke observert — potential concern (kontaktbarhet)
- [PASS] nap_email: mailto: info@autoglasnorden.se
- [PASS] nap_name_consistency: «AUTOGLASS AS» (Brreg) samsvarer med nettsidenavn
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [UNKNOWN] ai_content_quality: Nettsiden til Autoglas AB presenterer selskapet som en pålitelig leverandør av bilglass med stort lager og eksport over Skandinavia og Baltikum. Innholdet er informativt og profesjonelt, men mangler meta-beskrivelse og har en del teknisk sjargong som kan være uklar for vanlige kunder. Aktualiteten er vanskelig å vurdere på grunn av manglende datoer, men teksten virker ikke utdatert.
- [PASS] ai_content_freshness: Ingen årstall-signaler funnet i teksten · Ingen datoer eller ©-år funnet · Ingen nyhetsinnlegg eller oppdateringer nevnt · Teksten inneholder ingen tegn på utdatert innhold

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [PASS] ai_vis_visibility: 2/3 svar nevner Autoglass · sitat: «Autoglas Sverige (del av Autoglas Nordic) – De har et bredt sortiment og samarbeider med flere grossister. De kan håndtere både standard og » · prompter: «Jag behöver byta vindruta på min bil och vill ha e…» / «Vilken bilglasfirma i Kungsängen har störst lager …»
- [FAIL] ai_vis_position: beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar
- [PASS] ai_vis_sentiment: sentiment: blandet · råd: Sørg for at deres lagerstørrelse og logistikksenter i Kungsängen tydelig kommuniseres i AI-synlige kilder, da de ikke ble nevnt i svaret om 
- [PASS] ai_vis_sources: eksterne domener i AI-svar: nster.com

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis, measurements

# V2-kjøretid: 56981 ms (moduler parallelt)