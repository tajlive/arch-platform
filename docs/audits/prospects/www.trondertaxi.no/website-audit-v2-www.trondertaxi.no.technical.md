# Teknisk appendix — Arch Website Audit www.trondertaxi.no

> **Generert:** 2026-08-15T01:04:51.734Z · **Nettsted:** https://www.trondertaxi.no · **Endelig URL:** https://www.trondertaxi.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.trondertaxi.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | PASS | 301 www.trondertaxi.no→trondertaxi.no | high |
| reliability | Ødelagte interne lenker | FAIL | 1 ødelagt (www.trondertaxi.no/en/ → 404) | high |
| reliability | Ressurs-feil (img/css/js) | PASS | ingen same-origin-ressurser å sample | high |
| performance | Komprimering (gzip/brotli) | PASS | gzip | high |
| performance | Cache-headere | PASS | max-age=3, must-revalidate | high |
| performance | Render-blokkerende ressurser | FAIL | 26 blokkerende skript, 13 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 13 bilder, 11 m/ dimensjoner, 6 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 5 eksterne domener (consent.cookiebot.com, trondertaxi.no, www.googletagmanager.com, chat.puzzel.com, www.google.com) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | UNKNOWN | stylesheets ikke observerbare | low |
| accessibility | Språk-attributt (lang) | PASS | nb-NO | high |
| accessibility | Alt-tekst på bilder | PASS | 0/13 bilder mangler alt | high |
| accessibility | Skjemaetiketter | NOT_APPLICABLE | ingen skjemainput | medium |
| accessibility | Overskriftshierarki | FAIL | h1=0 h2=5 h3=3 | high |
| accessibility | Semantiske landemerker | PASS | 3/4 (header, main, footer) | high |
| seo | Tittel | PASS | Trønder Taxi AS | high |
| seo | Meta-beskrivelse | PASS | Vi setter sikkerhet og trygghet i forsetet. Vi leverer pålitelig og kvalitetssikret transport til alle våre kunder. | high |
| seo | Canonical | PASS | https://trondertaxi.no/ | high |
| seo | Robots-meta | PASS | index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1 | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (3 URL-er) | high |
| seo | OpenGraph | FAIL | title=true description=true image=false | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | PASS | tilstede | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | PASS | tilstede | high |
| security | Header: frame | PASS | tilstede | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | nginx | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | PASS | CMP observert | medium |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cms | PASS | WordPress | medium |
| tech | Teknologi: hosting | PASS | nginx | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |
| security | Sikkerhetsheadere — gradering A+ | PASS | Gradering A+. Content-Security-Policy: base-uri 'self'; form-action 'self' https:; frame-ancestors 'self'; object-src 'none'; upg…; Strict-Transport-Security: max-age=31536000; includeSubDomains; X-Frame-Options: MANGLER; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), m… Ingen trekk. | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | Ingen cookies satt av serveren (0 set-cookie-headere). | high |
| security | Versjonslekkasje: server-header | FAIL | server: nginx | high |
| security | Versjonslekkasje: <meta name=generator> | FAIL | generator: Site Kit by Google 1.184.0 | medium |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-08-04T16:44:20.000Z, notAfter=2026-11-02T16:44:19.000Z, issuer=C=US, O=Let's Encrypt, CN=YE2, SAN=07373.no, trondertaxi.no, www.07373.no, www.trondertaxi.no, www.xn--trndertaxi-1cb.no, xn--trndertaxi-1cb.no | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | PASS | v=spf1 include:spf.protection.outlook.com include:_spf.isp.as2116.net -all | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | PASS | selector: selector1 | medium |
| security | DMARC (spoofing-beskyttelse) | FAIL | p=none (kun overvåkning) — v=DMARC1; p=none; rua=mailto:dmarc@trondertaxi.no; ruf=mailto:dmarc@trondertaxi.no; sp=none; aspf=s; | high |
| security | DMARC for subdomene | FAIL | ingen _dmarc.www.trondertaxi.no — subdomener kan spoofes | medium |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | NOT_APPLICABLE | ingen BIMI (ikke påkrevd) | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | FAIL | manglende AD-flag — sonen er ikke DNSSEC-signert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | trondertaxi-no.mail.protection.outlook.com (52.101.68.3) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | UNKNOWN | crt.sh-feil: The operation was aborted due to timeout | low |
| trust_privacy | Firma i Brreg (Enhetsregisteret) | UNKNOWN | ingen Brreg-treff for «Trønder Taxi AS», «Trønder Taxi AS» | medium |
| trust_privacy | Bransjekontekst (SSB) | UNKNOWN | ingen næringskode tilgjengelig | medium |
| trust_privacy | Domenet registrert (Norid) | PASS | registrert 1999-11-14 | high |
| reliability | Sist endret (Norid) | PASS | sist endret 2025-11-15 | high |
| security | DNSSEC (Norid) | FAIL | DNSSEC ikke aktivert (delegationSigned=false) | high |
| trust_privacy | Registrar (Norid) | PASS | registrar: Firmanett Norden AB | high |
| reliability | Arkivhistorikk finnes | PASS | arkivert siden 2000-09-15 | high |
| reliability | Aktualitet (siste arkiverte versjon) | PASS | fanget i løpet av siste 12 mnd (2025-08-23) | high |
| reliability | Arkivomfang | UNKNOWN | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | PASS | CMP observert: Cookiebot | high |
| trust_privacy | Reelt valg (avvis-knapp) | FAIL | banner/CMP observert, men ingen «avvis»/reject-alternativ observert — ekomloven § 3-15 krever reelt valg — potential concern, krever juridisk vurdering | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | PASS | personvernerklæring lenket i footer | high |
| trust_privacy | Tredjeparts-trackere | FAIL | trackere observert (Google Tag Manager, Google gtag.js) — CMP/banner observert separat — potential concern, krever juridisk vurdering | high |
| trust_privacy | Google Fonts (ekstern) | PASS | Google Fonts self-hosted observert (/fonts/-stier) | high |
| trust_privacy | Pris inkl. mva | FAIL | pris inkl. mva ikke observert — potential concern (prisopplysningsforskriften), krever juridisk vurdering | high |
| trust_privacy | Angrerett-informasjon | FAIL | angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering | high |
| trust_privacy | Klageadgang / tvisteløsning | FAIL | klageadgang/tvisteløsning ikke observert — potential concern, krever juridisk vurdering | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Sosiale medier (lenker fra nettsiden) | PASS | 3 profiler lenket — alle svarer (tiktok: 200 · facebook: 400 · instagram: 200) | high |
| trust_privacy | Telefon på nettsiden | PASS | tel-lenke: 07373 | medium |
| trust_privacy | E-post på nettsiden | PASS | mailto: salg@trondertaxi.no | medium |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | PASS | Nettsiden formidler et tydelig kundeløfte om trygghet og pålitelighet, med fokus på sikkerhet i førersetet og enkel bestilling via app. Innholdet er oversiktlig og dekker tjenester, kampanjer og kontaktinformasjon, men mangler konkrete årstall eller oppdateringsdatoer. Teksten er profesjonell og henvender seg godt til både privat- og bedriftskunder. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | PASS | Ingen årstall-signaler funnet i teksten · Ingen ©-år eller datoer som indikerer utdatert innhold · Nevner 116 år på veiene, noe som er et historisk faktum, ikke en dato | medium |
| ai_visibility | Synlighet i AI-svar | FAIL | 0/3 svar nevner Trønder Taxi AS · sitat: «TrønderTaxi er et solid valg i 2026 for akkurat de behovene du nevner» · prompter: «Hvilket taxiselskap i Trondheim anbefaler du for t…» / «Hva er det beste alternativet for en bedrift som t…» | medium |
| ai_visibility | Posisjon i AI-svar | FAIL | ikke nevnt i noen av svarene | medium |
| ai_visibility | Sentiment i AI-omtale | PASS | sentiment: positiv · råd: Sørg for å tydelig kommunisere deres lange historie og ISO-sertifiseringer i digitale kanaler for å styrke posisjonen mot konkurrenter som N | medium |
| ai_visibility | Kilder AI-en siterer | UNKNOWN | ingen eksterne domener sitert | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://trondertaxi.no/
- Redirects: 301 https://www.trondertaxi.no → https://trondertaxi.no/
- HTTPS: HTTPS leverte respons
- Compression: gzip · Cache: max-age=3, must-revalidate

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | base-uri 'self'; form-action 'self' https:; frame-ancestors 'self'; object-src 'none'; upgrade-insecure-requests |
| hsts | max-age=31536000; includeSubDomains |
| xcto | nosniff |
| referrer | strict-origin-when-cross-origin |
| permissions | accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=() |
| frame | frame-ancestors |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: nginx

## 4. Crawl-resultat

- Sider sjekket: 12 · Vellykket: 11
- Ødelagte interne lenker: 1
  https://www.trondertaxi.no/en/ → 404
- Ressurs-feil: 0/0

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: WordPress · CDN: — · Hosting: nginx
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: consent.cookiebot.com, trondertaxi.no, www.googletagmanager.com, chat.puzzel.com, www.google.com

## 6. SEO / Meta / Struktur

- Tittel: Trønder Taxi AS · Meta-beskrivelse: Vi setter sikkerhet og trygghet i forsetet. Vi leverer pålitelig og kvalitetssikret transport til alle våre kunder.
- Canonical: https://trondertaxi.no/ · robots.txt: ja · Sitemap: 3 URL-er
- OpenGraph: {"title":true,"description":true,"image":false} · JSON-LD: ja
- Headings: {"h1":0,"h2":5,"h3":3,"h4":7,"h5":5,"h6":0} · Lang: nb-NO

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":true,"chat":true,"booking":true,"newsletter":true}
- Uutnyttet potensial: 17% (5/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.trondertaxi.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [PASS] security_headers: Gradering A+. Content-Security-Policy: base-uri 'self'; form-action 'self' https:; frame-ancestors 'self'; object-src 'none'; upg…; Strict-Transport-Security: max-age=31536000; includeSubDomains; X-Frame-Options: MANGLER; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), m… Ingen trekk.
- [PASS] cookies_attributes: Ingen cookies satt av serveren (0 set-cookie-headere).
- [FAIL] leak_0_server: server: nginx
- [FAIL] leak_1_meta: generator: Site Kit by Google 1.184.0
- [PASS] tls_cert: notBefore=2026-08-04T16:44:20.000Z, notAfter=2026-11-02T16:44:19.000Z, issuer=C=US, O=Let's Encrypt, CN=YE2, SAN=07373.no, trondertaxi.no, www.07373.no, www.trondertaxi.no, www.xn--trndertaxi-1cb.no, xn--trndertaxi-1cb.no
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [PASS] spf: v=spf1 include:spf.protection.outlook.com include:_spf.isp.as2116.net -all
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [PASS] dkim: selector: selector1
- [FAIL] dmarc: p=none (kun overvåkning) — v=DMARC1; p=none; rua=mailto:dmarc@trondertaxi.no; ruf=mailto:dmarc@trondertaxi.no; sp=none; aspf=s;
- [FAIL] dmarc_subdomain: ingen _dmarc.www.trondertaxi.no — subdomener kan spoofes
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [NOT_APPLICABLE] bimi: ingen BIMI (ikke påkrevd)
- [FAIL] caa: ingen CAA
- [FAIL] dnssec: manglende AD-flag — sonen er ikke DNSSEC-signert
- [PASS] dnsbl: trondertaxi-no.mail.protection.outlook.com (52.101.68.3) ikke listet
- [UNKNOWN] subdomains: crt.sh-feil: The operation was aborted due to timeout

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [UNKNOWN] brreg_org: ingen Brreg-treff for «Trønder Taxi AS», «Trønder Taxi AS»
- [UNKNOWN] ssb_context: ingen næringskode tilgjengelig
- [PASS] norid_registered: registrert 1999-11-14
- [PASS] norid_changed: sist endret 2025-11-15
- [FAIL] norid_dnssec: DNSSEC ikke aktivert (delegationSigned=false)
- [PASS] norid_registrar: registrar: Firmanett Norden AB

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [PASS] history_exists: arkivert siden 2000-09-15
- [PASS] history_freshness: fanget i løpet av siste 12 mnd (2025-08-23)
- [UNKNOWN] history_scope: omfang ikke tilgjengelig (Wayback CDX timeout på full historikk)

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error, fallback

## Compliance-signaler Norge (compliance)

- [PASS] cmp_banner: CMP observert: Cookiebot
- [FAIL] consent_real_choice: banner/CMP observert, men ingen «avvis»/reject-alternativ observert — ekomloven § 3-15 krever reelt valg — potential concern, krever juridisk vurdering
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [PASS] privacy_policy: personvernerklæring lenket i footer
- [FAIL] third_party_trackers: trackere observert (Google Tag Manager, Google gtag.js) — CMP/banner observert separat — potential concern, krever juridisk vurdering
- [PASS] google_fonts: Google Fonts self-hosted observert (/fonts/-stier)
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

- [PASS] social_profiles: 3 profiler lenket — alle svarer (tiktok: 200 · facebook: 400 · instagram: 200)
- [PASS] nap_phone: tel-lenke: 07373
- [PASS] nap_email: mailto: salg@trondertaxi.no
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [PASS] ai_content_quality: Nettsiden formidler et tydelig kundeløfte om trygghet og pålitelighet, med fokus på sikkerhet i førersetet og enkel bestilling via app. Innholdet er oversiktlig og dekker tjenester, kampanjer og kontaktinformasjon, men mangler konkrete årstall eller oppdateringsdatoer. Teksten er profesjonell og henvender seg godt til både privat- og bedriftskunder.
- [PASS] ai_content_freshness: Ingen årstall-signaler funnet i teksten · Ingen ©-år eller datoer som indikerer utdatert innhold · Nevner 116 år på veiene, noe som er et historisk faktum, ikke en dato

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [FAIL] ai_vis_visibility: 0/3 svar nevner Trønder Taxi AS · sitat: «TrønderTaxi er et solid valg i 2026 for akkurat de behovene du nevner» · prompter: «Hvilket taxiselskap i Trondheim anbefaler du for t…» / «Hva er det beste alternativet for en bedrift som t…»
- [FAIL] ai_vis_position: ikke nevnt i noen av svarene
- [PASS] ai_vis_sentiment: sentiment: positiv · råd: Sørg for å tydelig kommunisere deres lange historie og ISO-sertifiseringer i digitale kanaler for å styrke posisjonen mot konkurrenter som N
- [UNKNOWN] ai_vis_sources: ingen eksterne domener sitert

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis, measurements

# V2-kjøretid: 40265 ms (moduler parallelt)