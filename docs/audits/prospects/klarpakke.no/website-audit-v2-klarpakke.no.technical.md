# Teknisk appendix — Arch Website Audit klarpakke.no

> **Generert:** 2026-08-15T00:21:57.754Z · **Nettsted:** https://klarpakke.no · **Endelig URL:** https://klarpakke.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-klarpakke.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | PASS | 301 klarpakke.no→www.klarpakke.no, 307 www.klarpakke.no→www.klarpakke.no | high |
| reliability | Ødelagte interne lenker | PASS | 10 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | ingen same-origin-ressurser å sample | high |
| performance | Komprimering (gzip/brotli) | PASS | br | high |
| performance | Cache-headere | PASS | public, max-age=60, s-maxage=300, stale-while-revalidate=86400, stale-if-error=3600 | high |
| performance | Render-blokkerende ressurser | FAIL | 1 blokkerende skript, 2 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 2 bilder, 2 m/ dimensjoner, 0 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 1 eksterne domener (www.klarpakke.no) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | UNKNOWN | stylesheets ikke observerbare | low |
| accessibility | Språk-attributt (lang) | PASS | no | high |
| accessibility | Alt-tekst på bilder | PASS | 0/2 bilder mangler alt | high |
| accessibility | Skjemaetiketter | NOT_APPLICABLE | ingen skjemainput | medium |
| accessibility | Overskriftshierarki | FAIL | h1=2 h2=10 h3=10 | high |
| accessibility | Semantiske landemerker | PASS | 3/4 (nav, main, footer) | high |
| seo | Tittel | PASS | Klarpakke — Se regnestykket før du stoler på oss \| Klarpakke | high |
| seo | Meta-beskrivelse | PASS | Gratis beta: 100 000 kr i lekepenger, en AI-pilot som forklarer alt på norsk, og backtest-bevis med gebyr inkludert. Kun i Norge. | high |
| seo | Canonical | PASS | https://www.klarpakke.no | high |
| seo | Robots-meta | PASS | index, follow | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (16 URL-er) | high |
| seo | OpenGraph | PASS | title=true description=true image=true | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | PASS | tilstede | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | PASS | tilstede | high |
| security | Header: frame | PASS | tilstede | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | cloudflare | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: framework | PASS | Next.js | medium |
| tech | Teknologi: cdn | PASS | Cloudflare | high |
| tech | Teknologi: hosting | PASS | cloudflare | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager, Plausible | high |
| security | Sikkerhetsheadere — gradering A | PASS | Gradering A. Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://pskhryjzkobytnfwucrb.supabas…; Strict-Transport-Security: max-age=63072000; includeSubDomains; preload; X-Frame-Options: DENY; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(… Trekk: CSP svak (unsafe-inline/unsafe-eval) | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | FAIL | 1 cookies observert. Mangler HttpOnly: NEXT_LOCALE. Mangler Secure: NEXT_LOCALE. Mangler SameSite: alle har SameSite. (Cookie-navn + flagg kun — verdier aldri lagret/vist.) | high |
| security | Ingen versjonslekkasjer | PASS | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. | medium |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-07-28T08:21:14.000Z, notAfter=2026-10-26T09:20:56.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=klarpakke.no, *.klarpakke.no | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | FAIL | v=spf1 include:_spf.domeneshop.no include:_spf.google.com include:spf.resend.com ~all — ~all er svakt, spoofing mulig | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | UNKNOWN | ingen av probede selektorer funnet (kan ikke konkludere fravær) | low |
| security | DMARC (spoofing-beskyttelse) | FAIL | p=none (kun overvåkning) — v=DMARC1; p=none; rua=mailto:dmarc@klarpakke.no; ruf=mailto:dmarc@klarpakke.no; fo=1; adkim=s; aspf=s | high |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | NOT_APPLICABLE | ingen BIMI (ikke påkrevd) | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | FAIL | manglende AD-flag — sonen er ikke DNSSEC-signert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | mx.domeneshop.no (194.63.252.28) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | UNKNOWN | crt.sh-feil: The operation was aborted due to timeout | low |
| trust_privacy | Firma i Brreg (Enhetsregisteret) | UNKNOWN | ingen Brreg-treff for «Klarpakke» | medium |
| trust_privacy | Bransjekontekst (SSB) | UNKNOWN | ingen næringskode tilgjengelig | medium |
| trust_privacy | Domenet registrert (Norid) | PASS | registrert 2025-08-30 | high |
| reliability | Sist endret (Norid) | PASS | sist endret 2026-02-01 | high |
| security | DNSSEC (Norid) | FAIL | DNSSEC ikke aktivert (delegationSigned=false) | high |
| trust_privacy | Registrar (Norid) | PASS | registrar: Domeneshop AS | high |
| reliability | Arkivhistorikk finnes | UNKNOWN | ingen arkiverte versjoner funnet i Wayback for klarpakke.no | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | PASS | generisk cookie/samtykke-banner observert (norsk tekst: cookie/informasjonskapsler + samtykke/godta/aksepter) | medium |
| trust_privacy | Reelt valg (avvis-knapp) | PASS | avvis/avslå/reject-alternativ observert («avvis») | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | PASS | personvernerklæring lenket i footer | high |
| trust_privacy | Tredjeparts-trackere | PASS | ingen kjente tredjeparts-trackere observert | high |
| trust_privacy | Google Fonts (ekstern) | PASS | ingen ekstern Google Fonts observert | high |
| trust_privacy | Pris inkl. mva | PASS | pris inkl. mva-tekst observert | high |
| trust_privacy | Angrerett-informasjon | FAIL | angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering | high |
| trust_privacy | Klageadgang / tvisteløsning | PASS | klageadgang/tvisteløsning observert | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Sosiale medier (lenker fra nettsiden) | FAIL | ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet) | high |
| trust_privacy | Telefon på nettsiden | FAIL | ingen tel:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | E-post på nettsiden | FAIL | ingen mailto:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | PASS | Klarpakke posisjonerer seg som en transparent og risikofri inngang til krypto-trading for nordmenn, med fokus på læring og dokumentasjon. De lover aldri gevinst, men viser backtest-resultater med gebyr inkludert, og tilbyr lekepenger for å bygge tillit. Siden er tydelig i sin kommunikasjon og henvender seg til nybegynnere som ønsker å lære uten risiko. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | PASS | Gratis beta kun i Norge · 100 000 kr i lekepenger · AI-pilot som forklarer på norsk · Backtest med gebyr inkludert · Ingen kredittkort, KYC eller binding · 5000 KLT til de 100 første · Historisk avkastning er ingen garanti | medium |
| ai_visibility | Synlighet i AI-svar | PASS | 1/3 svar nevner Klarpakke · sitat: «Ja, det kan være verdt det i 2026, men kun hvis du er tålmodig, liker å lære via forklaringer, og ser på det som et læringsabonnement» · prompter: «Hvilket norsk verktøy anbefaler du for å lære kryp…» / «Er Klarpakke verdt det i 2026 for nybegynnere som …» | medium |
| ai_visibility | Posisjon i AI-svar | PASS | beste posisjon: #1 av 3 svar | medium |
| ai_visibility | Sentiment i AI-omtale | PASS | sentiment: blandet · råd: Sørg for at Klarpakke er tydelig beskrevet med konkrete funksjoner og fordeler på nettsiden, og oppmuntre til oppdaterte og detaljerte omtal | medium |
| ai_visibility | Kilder AI-en siterer | UNKNOWN | ingen eksterne domener sitert | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.klarpakke.no/no
- Redirects: 301 https://klarpakke.no → https://www.klarpakke.no/; 307 https://www.klarpakke.no/ → https://www.klarpakke.no/no
- HTTPS: HTTPS leverte respons
- Compression: br · Cache: public, max-age=60, s-maxage=300, stale-while-revalidate=86400, stale-if-error=3600

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | default-src 'self'; script-src 'self' 'unsafe-inline' https://pskhryjzkobytnfwucrb.supabase.co https://*.tradingview.com https://plausible.io https://utt.impactcdn.com https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://pskhryjzkobytnfwucrb.supabase.co https://*.tradingview.com https://*.coingecko.com https://klarpakke.no https://www.klarpakke.no; font-src 'self' data: https://r2cdn.perplexity.ai; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; connect-src 'self' https://pskhryjzkobytnfwucrb.supabase.co wss://pskhryjzkobytnfwucrb.supabase.co https://api.kraken.com https://api.coingecko.com wss://ws.kraken.com https://*.sanity.io wss://*.sanity.io https://plausible.io https://o4509555622608896.ingest.de.sentry.io https://*.ingest.de.sentry.io; frame-src 'self'; upgrade-insecure-requests |
| hsts | max-age=63072000; includeSubDomains; preload |
| xcto | nosniff |
| referrer | strict-origin-when-cross-origin |
| permissions | camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=() |
| frame | DENY |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: cloudflare

## 4. Crawl-resultat

- Sider sjekket: 10 · Vellykket: 10
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/0

## 5. Teknologi-overflate (confidence merket)

- Framework: Next.js · CMS: — · CDN: Cloudflare · Hosting: cloudflare
- Analytics/trackere: Google Analytics/Tag Manager, Plausible
- Tredjeparts-domener: www.klarpakke.no

## 6. SEO / Meta / Struktur

- Tittel: Klarpakke — Se regnestykket før du stoler på oss | Klarpakke · Meta-beskrivelse: Gratis beta: 100 000 kr i lekepenger, en AI-pilot som forklarer alt på norsk, og backtest-bevis med gebyr inkludert. Kun i Norge.
- Canonical: https://www.klarpakke.no · robots.txt: ja · Sitemap: 16 URL-er
- OpenGraph: {"title":true,"description":true,"image":true} · JSON-LD: ja
- Headings: {"h1":2,"h2":10,"h3":10,"h4":0,"h5":0,"h6":0} · Lang: no

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":false,"chat":true,"booking":true,"newsletter":true}
- Uutnyttet potensial: 33% (4/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-klarpakke.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [PASS] security_headers: Gradering A. Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://pskhryjzkobytnfwucrb.supabas…; Strict-Transport-Security: max-age=63072000; includeSubDomains; preload; X-Frame-Options: DENY; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(… Trekk: CSP svak (unsafe-inline/unsafe-eval)
- [FAIL] cookies_attributes: 1 cookies observert. Mangler HttpOnly: NEXT_LOCALE. Mangler Secure: NEXT_LOCALE. Mangler SameSite: alle har SameSite. (Cookie-navn + flagg kun — verdier aldri lagret/vist.)
- [PASS] version_leaks: Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert.
- [PASS] tls_cert: notBefore=2026-07-28T08:21:14.000Z, notAfter=2026-10-26T09:20:56.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=klarpakke.no, *.klarpakke.no
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [FAIL] spf: v=spf1 include:_spf.domeneshop.no include:_spf.google.com include:spf.resend.com ~all — ~all er svakt, spoofing mulig
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [UNKNOWN] dkim: ingen av probede selektorer funnet (kan ikke konkludere fravær)
- [FAIL] dmarc: p=none (kun overvåkning) — v=DMARC1; p=none; rua=mailto:dmarc@klarpakke.no; ruf=mailto:dmarc@klarpakke.no; fo=1; adkim=s; aspf=s
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [NOT_APPLICABLE] bimi: ingen BIMI (ikke påkrevd)
- [FAIL] caa: ingen CAA
- [FAIL] dnssec: manglende AD-flag — sonen er ikke DNSSEC-signert
- [PASS] dnsbl: mx.domeneshop.no (194.63.252.28) ikke listet
- [UNKNOWN] subdomains: crt.sh-feil: The operation was aborted due to timeout

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [UNKNOWN] brreg_org: ingen Brreg-treff for «Klarpakke»
- [UNKNOWN] ssb_context: ingen næringskode tilgjengelig
- [PASS] norid_registered: registrert 2025-08-30
- [PASS] norid_changed: sist endret 2026-02-01
- [FAIL] norid_dnssec: DNSSEC ikke aktivert (delegationSigned=false)
- [PASS] norid_registrar: registrar: Domeneshop AS

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [UNKNOWN] history_exists: ingen arkiverte versjoner funnet i Wayback for klarpakke.no

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error

## Compliance-signaler Norge (compliance)

- [PASS] cmp_banner: generisk cookie/samtykke-banner observert (norsk tekst: cookie/informasjonskapsler + samtykke/godta/aksepter)
- [PASS] consent_real_choice: avvis/avslå/reject-alternativ observert («avvis»)
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [PASS] privacy_policy: personvernerklæring lenket i footer
- [PASS] third_party_trackers: ingen kjente tredjeparts-trackere observert
- [PASS] google_fonts: ingen ekstern Google Fonts observert
- [PASS] ecom_price_vat: pris inkl. mva-tekst observert
- [FAIL] ecom_angrerett: angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering
- [PASS] ecom_klage: klageadgang/tvisteløsning observert

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
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [PASS] ai_content_quality: Klarpakke posisjonerer seg som en transparent og risikofri inngang til krypto-trading for nordmenn, med fokus på læring og dokumentasjon. De lover aldri gevinst, men viser backtest-resultater med gebyr inkludert, og tilbyr lekepenger for å bygge tillit. Siden er tydelig i sin kommunikasjon og henvender seg til nybegynnere som ønsker å lære uten risiko.
- [PASS] ai_content_freshness: Gratis beta kun i Norge · 100 000 kr i lekepenger · AI-pilot som forklarer på norsk · Backtest med gebyr inkludert · Ingen kredittkort, KYC eller binding · 5000 KLT til de 100 første · Historisk avkastning er ingen garanti

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [PASS] ai_vis_visibility: 1/3 svar nevner Klarpakke · sitat: «Ja, det kan være verdt det i 2026, men kun hvis du er tålmodig, liker å lære via forklaringer, og ser på det som et læringsabonnement» · prompter: «Hvilket norsk verktøy anbefaler du for å lære kryp…» / «Er Klarpakke verdt det i 2026 for nybegynnere som …»
- [PASS] ai_vis_position: beste posisjon: #1 av 3 svar
- [PASS] ai_vis_sentiment: sentiment: blandet · råd: Sørg for at Klarpakke er tydelig beskrevet med konkrete funksjoner og fordeler på nettsiden, og oppmuntre til oppdaterte og detaljerte omtal
- [UNKNOWN] ai_vis_sources: ingen eksterne domener sitert

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis, measurements

# V2-kjøretid: 36200 ms (moduler parallelt)