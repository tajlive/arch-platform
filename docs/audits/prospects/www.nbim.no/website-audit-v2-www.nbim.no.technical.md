# Teknisk appendix — Arch Website Audit www.nbim.no

> **Generert:** 2026-08-15T00:55:39.555Z · **Nettsted:** https://www.nbim.no · **Endelig URL:** https://www.nbim.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.nbim.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | PASS | 302 www.nbim.no→www.nbim.no | high |
| reliability | Ødelagte interne lenker | PASS | 25 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 10 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | gzip | high |
| performance | Cache-headere | FAIL | ingen cache-control | high |
| performance | Render-blokkerende ressurser | PASS | 0 blokkerende skript, 1 stylesheets | medium |
| performance | Bilde-optimalisering | PASS | 18 bilder, 18 m/ dimensjoner, 16 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 0 eksterne domener | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | no | high |
| accessibility | Alt-tekst på bilder | FAIL | 1/18 bilder mangler alt | high |
| accessibility | Skjemaetiketter | PASS | 3 input, 3 label | medium |
| accessibility | Overskriftshierarki | PASS | h1=1 h2=14 h3=4 | high |
| accessibility | Semantiske landemerker | PASS | 4/4 (header, nav, main, footer) | high |
| seo | Tittel | PASS | Oljefondet \| Norges Bank Investment Management | high |
| seo | Meta-beskrivelse | PASS | Form&#xE5;let med Oljefondet er &#xE5; sikre finansielle verdier for n&#xE5;v&#xE6;rende og fremtidige generasjoner basert p&#xE5; inntektene fra Norges olje- og gassressurser.  | high |
| seo | Canonical | FAIL | mangler canonical | high |
| seo | Robots-meta | PASS | index, follow | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | FAIL | mangler sitemap.xml | high |
| seo | OpenGraph | PASS | title=true description=true image=true | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | PASS | tilstede | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | PASS | tilstede | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | cloudflare | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cdn | PASS | Cloudflare | high |
| tech | Teknologi: hosting | PASS | cloudflare | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |
| security | Sikkerhetsheadere — gradering B | FAIL | Gradering B. Content-Security-Policy: frame-ancestors 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'  cdnjs.cloudflare.…; Strict-Transport-Security: max-age=31536000; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: no-referrer-when-downgrade; Permissions-Policy: MANGLER Trekk: CSP svak (unsafe-inline/unsafe-eval) · HSTS uten includeSubDomains · Permissions-Policy mangler | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | Ingen cookies satt av serveren (0 set-cookie-headere). | high |
| security | Ingen versjonslekkasjer | PASS | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. | medium |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-07-24T03:40:30.000Z, notAfter=2026-10-22T04:40:27.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=www.nbim.no | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | PASS | v=spf1 include:spf.protection.outlook.com -all | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | PASS | selector: selector2 | medium |
| security | DMARC (spoofing-beskyttelse) | PASS | p=reject (blokk) — v=DMARC1;p=reject;sp=reject;pct=100;rua=mailto:exchange-rua@nbim.no | high |
| security | DMARC for subdomene | FAIL | ingen _dmarc.www.nbim.no — subdomener kan spoofes | medium |
| security | MTA-STS (håndhevet e-post-TLS) | PASS | TXT + gyldig policy-fil på plass | high |
| security | TLS-RPT (TLS-rapportering) | PASS | v=TLSRPTv1;rua=mailto:tls-rpt-reports@nbim.no | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | PASS | v=BIMI1;l=https://bimi.nbim.no/image.svg;a= | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | PASS | AD-flag — signert sone validert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | nbim-no.mail.protection.outlook.com (52.101.73.153) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | UNKNOWN | crt.sh-feil: HTTP 404 | low |
| trust_privacy | Firma i Brreg (Enhetsregisteret) | UNKNOWN | ingen Brreg-treff for «Norges Bank Investment Management», «Oljefondet» | medium |
| trust_privacy | Bransjekontekst (SSB) | UNKNOWN | ingen næringskode tilgjengelig | medium |
| trust_privacy | Domenet registrert (Norid) | PASS | registrert 2001-08-28 | high |
| reliability | Sist endret (Norid) | PASS | sist endret 2026-07-31 | high |
| security | DNSSEC (Norid) | PASS | DNSSEC aktivert (delegationSigned=true) | high |
| trust_privacy | Registrar (Norid) | PASS | registrar: Domeneshop AS | high |
| reliability | Arkivhistorikk finnes | PASS | arkivert siden 2004-06-23 | high |
| reliability | Aktualitet (siste arkiverte versjon) | FAIL | fanget i løpet av siste 12 mnd (2025-08-14) | high |
| reliability | Arkivomfang | UNKNOWN | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | FAIL | ingen CMP/banner observert — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Reelt valg (avvis-knapp) | NOT_APPLICABLE | ingen banner/CMP observert | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | PASS | personvernerklæring lenket i footer | high |
| trust_privacy | Tredjeparts-trackere | PASS | ingen kjente tredjeparts-trackere observert | high |
| trust_privacy | Google Fonts (ekstern) | PASS | ingen ekstern Google Fonts observert | high |
| trust_privacy | Pris inkl. mva | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| trust_privacy | Angrerett-informasjon | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| trust_privacy | Klageadgang / tvisteløsning | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Sosiale medier (lenker fra nettsiden) | PASS | 3 profiler lenket — alle svarer (linkedin: 200 · youtube: 200 · instagram: 200) | high |
| trust_privacy | Telefon på nettsiden | FAIL | ingen tel:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | E-post på nettsiden | FAIL | ingen mailto:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | PASS | Siden gir en grundig og oversiktlig presentasjon av Oljefondets formål, investeringsområder og ansvarlig forvaltning. Innholdet er faglig solid og godt strukturert, men mangler tydelige oppdateringsdatoer for å bekrefte at all informasjon er helt fersk. Teksten henvender seg til et bredt publikum med et profesjonelt og informativt språk. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | UNKNOWN | Halvårsrapport 2026 nevnt, men ingen konkret dato for publisering · Ingen tydelige ©-år eller oppdaterte nyhetsdatoer i teksten · Referanser til historiske hendelser (1969, 1996, 2019, 2024) indikerer at siden har vært oppdatert nylig | medium |
| ai_visibility | Synlighet i AI-svar | PASS | 1/3 svar nevner Norges Bank Investment Management · sitat: «Oljefondet er definitivt verdt å følge med på i 2026, spesielt for investorer som er opptatt av bærekraft og klimahåndtering.» · prompter: «Hvilket fond anbefaler du for langsiktig sparing s…» / «Hva er det beste alternativet for å investere i gl…» | medium |
| ai_visibility | Posisjon i AI-svar | FAIL | beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar | medium |
| ai_visibility | Sentiment i AI-omtale | PASS | sentiment: positiv · råd: Sørg for at offisielle nettsider og rapporter er lett tilgjengelige og oppdaterte, slik at AI-søk kan sitere dem direkte. | medium |
| ai_visibility | Kilder AI-en siterer | UNKNOWN | ingen eksterne domener sitert | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.nbim.no/no/
- Redirects: 302 https://www.nbim.no → https://www.nbim.no/no/
- HTTPS: HTTPS leverte respons
- Compression: gzip · Cache: —

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | frame-ancestors 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'  cdnjs.cloudflare.com nbim.piwik.pro nbim.containers.piwik.pro cdn.jsdelivr.net *.episerver.net *.azure.com *.msecnd.net *.brightcove.net *.brightcove.com vjs.zencdn.net in.taskanalytics.com z.moatads.com *.akamaihd.net code.jquery.com maxcdn.bootstrapcdn.com www.google.com www.gstatic.com *.hotjar.com web-sdk-eu.aptrinsic.com *.vimeo.com *.plaii.no plaii.no; img-src 'self' data: *.brightcove.com *.brightcove.net *.brightcovecdn.com cf-images.eu-west-1.prod.boltdns.net *.akamaihd.net *.hotjar.com *.episerver.net *.aventia.no *.vimeocdn.com *.plaii.no plaii.no; worker-src blob:  *.akamaihd.net;  frame-src 'self' *.videomarketingplatform.co embed.acast.com *.vimeocdn.com *.vimeo.com vimeo.com norgesbank.aventia.no biovisjon.aventia.no players.brightcove.net maps.google.com www.google.com *.hotjar.com dashboard.find.episerver.net share.esgaia.com *.plaii.no plaii.no |
| hsts | max-age=31536000 |
| xcto | nosniff |
| referrer | no-referrer-when-downgrade |
| permissions | — mangler |
| frame | SAMEORIGIN |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: cloudflare

## 4. Crawl-resultat

- Sider sjekket: 25 · Vellykket: 25
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/10

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: — · CDN: Cloudflare · Hosting: cloudflare
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: ingen

## 6. SEO / Meta / Struktur

- Tittel: Oljefondet | Norges Bank Investment Management · Meta-beskrivelse: Form&#xE5;let med Oljefondet er &#xE5; sikre finansielle verdier for n&#xE5;v&#xE6;rende og fremtidige generasjoner basert p&#xE5; inntektene fra Norges olje- og gassressurser. 
- Canonical: — · robots.txt: ja · Sitemap: nei
- OpenGraph: {"title":true,"description":true,"image":true} · JSON-LD: ja
- Headings: {"h1":1,"h2":14,"h3":4,"h4":0,"h5":0,"h6":0} · Lang: no

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":false,"chat":false,"booking":false,"newsletter":false}
- Uutnyttet potensial: 83% (1/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.nbim.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [FAIL] security_headers: Gradering B. Content-Security-Policy: frame-ancestors 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'  cdnjs.cloudflare.…; Strict-Transport-Security: max-age=31536000; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: no-referrer-when-downgrade; Permissions-Policy: MANGLER Trekk: CSP svak (unsafe-inline/unsafe-eval) · HSTS uten includeSubDomains · Permissions-Policy mangler
- [PASS] cookies_attributes: Ingen cookies satt av serveren (0 set-cookie-headere).
- [PASS] version_leaks: Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert.
- [PASS] tls_cert: notBefore=2026-07-24T03:40:30.000Z, notAfter=2026-10-22T04:40:27.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=www.nbim.no
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [PASS] spf: v=spf1 include:spf.protection.outlook.com -all
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [PASS] dkim: selector: selector2
- [PASS] dmarc: p=reject (blokk) — v=DMARC1;p=reject;sp=reject;pct=100;rua=mailto:exchange-rua@nbim.no
- [FAIL] dmarc_subdomain: ingen _dmarc.www.nbim.no — subdomener kan spoofes
- [PASS] mta_sts: TXT + gyldig policy-fil på plass
- [PASS] tls_rpt: v=TLSRPTv1;rua=mailto:tls-rpt-reports@nbim.no
- [PASS] bimi: v=BIMI1;l=https://bimi.nbim.no/image.svg;a=
- [FAIL] caa: ingen CAA
- [PASS] dnssec: AD-flag — signert sone validert
- [PASS] dnsbl: nbim-no.mail.protection.outlook.com (52.101.73.153) ikke listet
- [UNKNOWN] subdomains: crt.sh-feil: HTTP 404

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [UNKNOWN] brreg_org: ingen Brreg-treff for «Norges Bank Investment Management», «Oljefondet»
- [UNKNOWN] ssb_context: ingen næringskode tilgjengelig
- [PASS] norid_registered: registrert 2001-08-28
- [PASS] norid_changed: sist endret 2026-07-31
- [PASS] norid_dnssec: DNSSEC aktivert (delegationSigned=true)
- [PASS] norid_registrar: registrar: Domeneshop AS

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [PASS] history_exists: arkivert siden 2004-06-23
- [FAIL] history_freshness: fanget i løpet av siste 12 mnd (2025-08-14)
- [UNKNOWN] history_scope: omfang ikke tilgjengelig (Wayback CDX timeout på full historikk)

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error, fallback

## Compliance-signaler Norge (compliance)

- [FAIL] cmp_banner: ingen CMP/banner observert — potential concern, krever juridisk vurdering
- [NOT_APPLICABLE] consent_real_choice: ingen banner/CMP observert
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [PASS] privacy_policy: personvernerklæring lenket i footer
- [PASS] third_party_trackers: ingen kjente tredjeparts-trackere observert
- [PASS] google_fonts: ingen ekstern Google Fonts observert
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

- [PASS] social_profiles: 3 profiler lenket — alle svarer (linkedin: 200 · youtube: 200 · instagram: 200)
- [FAIL] nap_phone: ingen tel:-lenke observert — potential concern (kontaktbarhet)
- [FAIL] nap_email: ingen mailto:-lenke observert — potential concern (kontaktbarhet)
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [PASS] ai_content_quality: Siden gir en grundig og oversiktlig presentasjon av Oljefondets formål, investeringsområder og ansvarlig forvaltning. Innholdet er faglig solid og godt strukturert, men mangler tydelige oppdateringsdatoer for å bekrefte at all informasjon er helt fersk. Teksten henvender seg til et bredt publikum med et profesjonelt og informativt språk.
- [UNKNOWN] ai_content_freshness: Halvårsrapport 2026 nevnt, men ingen konkret dato for publisering · Ingen tydelige ©-år eller oppdaterte nyhetsdatoer i teksten · Referanser til historiske hendelser (1969, 1996, 2019, 2024) indikerer at siden har vært oppdatert nylig

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [PASS] ai_vis_visibility: 1/3 svar nevner Norges Bank Investment Management · sitat: «Oljefondet er definitivt verdt å følge med på i 2026, spesielt for investorer som er opptatt av bærekraft og klimahåndtering.» · prompter: «Hvilket fond anbefaler du for langsiktig sparing s…» / «Hva er det beste alternativet for å investere i gl…»
- [FAIL] ai_vis_position: beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar
- [PASS] ai_vis_sentiment: sentiment: positiv · råd: Sørg for at offisielle nettsider og rapporter er lett tilgjengelige og oppdaterte, slik at AI-søk kan sitere dem direkte.
- [UNKNOWN] ai_vis_sources: ingen eksterne domener sitert

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis, measurements

# V2-kjøretid: 40731 ms (moduler parallelt)