# Teknisk appendix — Arch Website Audit lillelondon.no

> **Generert:** 2026-08-15T00:57:31.833Z · **Nettsted:** https://lillelondon.no · **Endelig URL:** https://lillelondon.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-lillelondon.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 6 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 10 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | gzip | high |
| performance | Cache-headere | FAIL | ingen cache-control | high |
| performance | Render-blokkerende ressurser | FAIL | 22 blokkerende skript, 39 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 9 bilder, 7 m/ dimensjoner, 3 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 2 eksterne domener (fonts.googleapis.com, awards.infcdn.net) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | en-GB | high |
| accessibility | Alt-tekst på bilder | PASS | 0/9 bilder mangler alt | high |
| accessibility | Skjemaetiketter | NOT_APPLICABLE | ingen skjemainput | medium |
| accessibility | Overskriftshierarki | FAIL | h1=0 h2=1 h3=0 | high |
| accessibility | Semantiske landemerker | PASS | 3/4 (header, nav, footer) | high |
| seo | Tittel | PASS | Lille London - Engelsk Pub i Trondheim | high |
| seo | Meta-beskrivelse | PASS | Vi viser alt av premier league, champions league og eliteserien/rbk på 10 storskjermer. Vi har live musikk fre og lørdag! Ikke glem vårt gode kjøkken som serverer engelske retter. | high |
| seo | Canonical | PASS | https://lillelondon.no/ | high |
| seo | Robots-meta | PASS | max-image-preview:large | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (4 URL-er) | high |
| seo | OpenGraph | PASS | title=true description=true image=true | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | FAIL | mangler | high |
| security | Header: xcto | FAIL | mangler | high |
| security | Header: referrer | FAIL | mangler | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | FAIL | mangler | high |
| security | Blandet innhold (http på https) | FAIL | 1 http-referanser | high |
| security | Eksponerte source maps | PASS | ingen sourceMappingURL i sjekkede skript | medium |
| security | Versjons-avsløring | FAIL | Apache, PHP/8.2.33 | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | FAIL | ingen personvern-link observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cms | PASS | WordPress | medium |
| tech | Teknologi: hosting | PASS | Apache | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |
| security | Sikkerhetsheadere — gradering F | FAIL | Gradering F. Content-Security-Policy: MANGLER; Strict-Transport-Security: MANGLER; X-Frame-Options: MANGLER; X-Content-Type-Options: MANGLER; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · X-Content-Type-Options mangler nosniff · Referrer-Policy mangler · Permissions-Policy mangler | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | Ingen cookies satt av serveren (0 set-cookie-headere). | high |
| security | Versjonslekkasje: server-header | FAIL | server: Apache | high |
| security | Versjonslekkasje: x-powered-by-header | FAIL | x-powered-by: PHP/8.2.33 | high |
| security | Versjonslekkasje: <meta name=generator> | FAIL | generator: All in One SEO (AIOSEO) 5.0.0.1 | medium |
| security | WordPress-signatur i generator | FAIL | generator: WordPress 7.0.4 | medium |
| security | Versjonslekkasje: <meta name=generator> | FAIL | generator: Elementor 4.2.2; features: additional_custom_breakpoints; settings: css_print_method-external, google_font-enabled, font_display-auto | medium |
| security | WordPress-signatur i generator | FAIL | generator: Powered by Slider Revolution 6.5.19 - responsive, Mobile-Friendly Slider Plugin for WordPress with comfortable drag and drop interface. | medium |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-06-25T04:37:41.000Z, notAfter=2026-09-23T04:37:40.000Z, issuer=C=US, O=Let's Encrypt, CN=YE2, SAN=lillelondon.no | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | FAIL | ingen SPF | high |
| security | DKIM (e-post-signering) | UNKNOWN | ingen av probede selektorer funnet (kan ikke konkludere fravær) | low |
| security | DMARC (spoofing-beskyttelse) | FAIL | ingen DMARC | high |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | NOT_APPLICABLE | ingen BIMI (ikke påkrevd) | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | PASS | AD-flag — signert sone validert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | mx2.mailpod1-osl1.g1i.uniweb.no (104.37.38.151) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | PASS | 0 unike subdomener utover apex/www (sertifikatregistret crt.sh har kun hoveddomenet) | medium |
| trust_privacy | Firma i Brreg (Enhetsregisteret) | UNKNOWN | N kandidater for «Lille London - Engelsk Pub i Trondheim», ingen med Brreg-hjemmeside som matcher lillelondon.no — kan ikke entydig knytte firma til domene. Kandidater: LILLE LONDON AS (967852546) · KONRAD LONDON (927105470) · LONDON MARKETING (936702376) | medium |
| trust_privacy | Bransjekontekst (SSB, næring 56) | PASS | SSB tabell 12817: Serveringsvirksomhet — 10 209 foretak (2024) | high |
| trust_privacy | Domenet registrert (Norid) | PASS | registrert 2000-07-12 | high |
| reliability | Sist endret (Norid) | PASS | sist endret 2026-07-12 | high |
| security | DNSSEC (Norid) | PASS | DNSSEC aktivert (delegationSigned=true) | high |
| trust_privacy | Registrar (Norid) | PASS | registrar: GROUP.ONE NORWAY AS | high |
| reliability | Arkivhistorikk finnes | PASS | arkivert siden 2004-04-21 | high |
| reliability | Aktualitet (siste arkiverte versjon) | PASS | fanget i løpet av siste 12 mnd (2025-09-10) | high |
| reliability | Arkivomfang | UNKNOWN | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | FAIL | ingen CMP/banner observert — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Reelt valg (avvis-knapp) | NOT_APPLICABLE | ingen banner/CMP observert | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | FAIL | ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering | high |
| trust_privacy | Tredjeparts-trackere | PASS | ingen kjente tredjeparts-trackere observert | high |
| trust_privacy | Google Fonts (ekstern) | FAIL | ekstern Google Fonts observert (IP-data til Google) — signal, krever juridisk vurdering | high |
| trust_privacy | Pris inkl. mva | FAIL | pris inkl. mva ikke observert — potential concern (prisopplysningsforskriften), krever juridisk vurdering | high |
| trust_privacy | Angrerett-informasjon | FAIL | angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering | high |
| trust_privacy | Klageadgang / tvisteløsning | FAIL | klageadgang/tvisteløsning ikke observert — potential concern, krever juridisk vurdering | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Sosiale medier (lenker fra nettsiden) | PASS | 1 profiler lenket — alle svarer (facebook: 400) | high |
| trust_privacy | Telefon på nettsiden | FAIL | ingen tel:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | E-post på nettsiden | FAIL | ingen mailto:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | Navn-konsistens (nettside ↔ Brreg) | FAIL | nettsidenavn «Lille London - Engelsk Pub i Trondheim» avviker fra Brreg-navn «LILLE LONDON AS» — signal | high |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | UNKNOWN | Siden presenterer pubens tilbud med sportssendinger, live musikk og utleielokaler, men har tydelige tegn på manglende oppdatering, som copyright fra 2022 og gjentatt tekst. Språket er uformelt og henvendt til et bredt publikum, men inneholder flere skrivefeil og ufullstendige setninger som svekker helhetsinntrykket. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | FAIL | © Copyright Lille London 2022 · Ingen årstall-signaler funnet i teksten · Gjentakelse av setninger om Facebook-oppdateringer · Manglende mellomrom i 'Sportman’s club' og 'lokalet ha' | medium |
| ai_visibility | Synlighet i AI-svar | FAIL | 0/3 svar nevner Lille London - Engelsk Pub i Trondheim · sitat: «Lille London nevnes ikke i noen av svarene.» · prompter: «Hva er den beste puben i Trondheim for å se Premie…» / «Kan du anbefale et sted i Trondheim som har både l…» | medium |
| ai_visibility | Posisjon i AI-svar | FAIL | ikke nevnt i noen av svarene | medium |
| ai_visibility | Sentiment i AI-omtale | PASS | sentiment: nøytral · råd: Sørg for at Lille London blir nevnt i relevante AI-svar ved å optimalisere nettsiden og lokale lister med søkeord som 'pub', 'sport', 'live  | medium |
| ai_visibility | Kilder AI-en siterer | UNKNOWN | ingen eksterne domener sitert | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://lillelondon.no
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: gzip · Cache: —

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | — mangler |
| xcto | — mangler |
| referrer | — mangler |
| permissions | — mangler |
| frame | — mangler |
- Blandet innhold: 1 http-referanser
- Source maps eksponert: nei
- Versjons-avsløring: Apache, PHP/8.2.33

## 4. Crawl-resultat

- Sider sjekket: 6 · Vellykket: 6
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/10

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: WordPress · CDN: — · Hosting: Apache
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: fonts.googleapis.com, awards.infcdn.net

## 6. SEO / Meta / Struktur

- Tittel: Lille London - Engelsk Pub i Trondheim · Meta-beskrivelse: Vi viser alt av premier league, champions league og eliteserien/rbk på 10 storskjermer. Vi har live musikk fre og lørdag! Ikke glem vårt gode kjøkken som serverer engelske retter.
- Canonical: https://lillelondon.no/ · robots.txt: ja · Sitemap: 4 URL-er
- OpenGraph: {"title":true,"description":true,"image":true} · JSON-LD: ja
- Headings: {"h1":0,"h2":1,"h3":0,"h4":0,"h5":0,"h6":0} · Lang: en-GB

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":false,"chat":true,"booking":true,"newsletter":false}
- Uutnyttet potensial: 50% (3/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-lillelondon.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [FAIL] security_headers: Gradering F. Content-Security-Policy: MANGLER; Strict-Transport-Security: MANGLER; X-Frame-Options: MANGLER; X-Content-Type-Options: MANGLER; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · X-Content-Type-Options mangler nosniff · Referrer-Policy mangler · Permissions-Policy mangler
- [PASS] cookies_attributes: Ingen cookies satt av serveren (0 set-cookie-headere).
- [FAIL] leak_0_server: server: Apache
- [FAIL] leak_1_x-powered-by: x-powered-by: PHP/8.2.33
- [FAIL] leak_2_meta: generator: All in One SEO (AIOSEO) 5.0.0.1
- [FAIL] leak_3_wordpress: generator: WordPress 7.0.4
- [FAIL] leak_4_meta: generator: Elementor 4.2.2; features: additional_custom_breakpoints; settings: css_print_method-external, google_font-enabled, font_display-auto
- [FAIL] leak_5_wordpress: generator: Powered by Slider Revolution 6.5.19 - responsive, Mobile-Friendly Slider Plugin for WordPress with comfortable drag and drop interface.
- [PASS] tls_cert: notBefore=2026-06-25T04:37:41.000Z, notAfter=2026-09-23T04:37:40.000Z, issuer=C=US, O=Let's Encrypt, CN=YE2, SAN=lillelondon.no
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [FAIL] spf: ingen SPF
- [UNKNOWN] dkim: ingen av probede selektorer funnet (kan ikke konkludere fravær)
- [FAIL] dmarc: ingen DMARC
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [NOT_APPLICABLE] bimi: ingen BIMI (ikke påkrevd)
- [FAIL] caa: ingen CAA
- [PASS] dnssec: AD-flag — signert sone validert
- [PASS] dnsbl: mx2.mailpod1-osl1.g1i.uniweb.no (104.37.38.151) ikke listet
- [PASS] subdomains: 0 unike subdomener utover apex/www (sertifikatregistret crt.sh har kun hoveddomenet)

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [UNKNOWN] brreg_org: N kandidater for «Lille London - Engelsk Pub i Trondheim», ingen med Brreg-hjemmeside som matcher lillelondon.no — kan ikke entydig knytte firma til domene. Kandidater: LILLE LONDON AS (967852546) · KONRAD LONDON (927105470) · LONDON MARKETING (936702376)
- [PASS] ssb_context: SSB tabell 12817: Serveringsvirksomhet — 10 209 foretak (2024)
- [PASS] norid_registered: registrert 2000-07-12
- [PASS] norid_changed: sist endret 2026-07-12
- [PASS] norid_dnssec: DNSSEC aktivert (delegationSigned=true)
- [PASS] norid_registrar: registrar: GROUP.ONE NORWAY AS

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [PASS] history_exists: arkivert siden 2004-04-21
- [PASS] history_freshness: fanget i løpet av siste 12 mnd (2025-09-10)
- [UNKNOWN] history_scope: omfang ikke tilgjengelig (Wayback CDX timeout på full historikk)

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error, fallback

## Compliance-signaler Norge (compliance)

- [FAIL] cmp_banner: ingen CMP/banner observert — potential concern, krever juridisk vurdering
- [NOT_APPLICABLE] consent_real_choice: ingen banner/CMP observert
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [FAIL] privacy_policy: ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering
- [PASS] third_party_trackers: ingen kjente tredjeparts-trackere observert
- [FAIL] google_fonts: ekstern Google Fonts observert (IP-data til Google) — signal, krever juridisk vurdering
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

- [PASS] social_profiles: 1 profiler lenket — alle svarer (facebook: 400)
- [FAIL] nap_phone: ingen tel:-lenke observert — potential concern (kontaktbarhet)
- [FAIL] nap_email: ingen mailto:-lenke observert — potential concern (kontaktbarhet)
- [FAIL] nap_name_consistency: nettsidenavn «Lille London - Engelsk Pub i Trondheim» avviker fra Brreg-navn «LILLE LONDON AS» — signal
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [UNKNOWN] ai_content_quality: Siden presenterer pubens tilbud med sportssendinger, live musikk og utleielokaler, men har tydelige tegn på manglende oppdatering, som copyright fra 2022 og gjentatt tekst. Språket er uformelt og henvendt til et bredt publikum, men inneholder flere skrivefeil og ufullstendige setninger som svekker helhetsinntrykket.
- [FAIL] ai_content_freshness: © Copyright Lille London 2022 · Ingen årstall-signaler funnet i teksten · Gjentakelse av setninger om Facebook-oppdateringer · Manglende mellomrom i 'Sportman’s club' og 'lokalet ha'

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [FAIL] ai_vis_visibility: 0/3 svar nevner Lille London - Engelsk Pub i Trondheim · sitat: «Lille London nevnes ikke i noen av svarene.» · prompter: «Hva er den beste puben i Trondheim for å se Premie…» / «Kan du anbefale et sted i Trondheim som har både l…»
- [FAIL] ai_vis_position: ikke nevnt i noen av svarene
- [PASS] ai_vis_sentiment: sentiment: nøytral · råd: Sørg for at Lille London blir nevnt i relevante AI-svar ved å optimalisere nettsiden og lokale lister med søkeord som 'pub', 'sport', 'live 
- [UNKNOWN] ai_vis_sources: ingen eksterne domener sitert

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis, measurements

# V2-kjøretid: 39559 ms (moduler parallelt)