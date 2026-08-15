# Teknisk appendix — Arch Website Audit www.coop.no

> **Generert:** 2026-08-15T00:38:55.334Z · **Nettsted:** https://www.coop.no · **Endelig URL:** https://www.coop.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.coop.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 22 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | FAIL | 10 av 10 ressurser feiler | high |
| performance | Komprimering (gzip/brotli) | PASS | br | high |
| performance | Cache-headere | PASS | no-store | high |
| performance | Render-blokkerende ressurser | PASS | 0 blokkerende skript, 1 stylesheets | medium |
| performance | Bilde-optimalisering | PASS | 22 bilder, 22 m/ dimensjoner, 22 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 0 eksterne domener | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | FAIL | ingen @media i stylesheets | medium |
| accessibility | Språk-attributt (lang) | PASS | nb-NO | high |
| accessibility | Alt-tekst på bilder | PASS | 0/22 bilder mangler alt | high |
| accessibility | Skjemaetiketter | FAIL | 4 input, 2 label | medium |
| accessibility | Overskriftshierarki | PASS | h1=1 h2=12 h3=17 | high |
| accessibility | Semantiske landemerker | PASS | 4/4 (header, nav, main, footer) | high |
| seo | Tittel | PASS | Coop litt ditt - Dagligvarebutikker og byggevarehus - Coop | high |
| seo | Meta-beskrivelse | PASS | Gode tilbud på dagligvarer og byggevarer. Coop-medlemmer får kjøpeutbytte på alt de handler og medlemskupp! | high |
| seo | Canonical | PASS | https://www.coop.no/ | high |
| seo | Robots-meta | PASS | index,follow | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | FAIL | mangler sitemap.xml | high |
| seo | OpenGraph | FAIL | title=true description=true image=false | high |
| seo | Strukturert data (JSON-LD) | FAIL | ingen JSON-LD | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | PASS | tilstede | high |
| security | Header: frame | FAIL | mangler | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | cloudflare | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | PASS | 1 <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cdn | PASS | Cloudflare | high |
| tech | Teknologi: hosting | PASS | cloudflare | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |
| security | Sikkerhetsheadere — gradering B | FAIL | Gradering B. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=31536000; includeSubDomains; X-Frame-Options: MANGLER; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: camera=(),microphone=(),usb=() Trekk: CSP mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | Ingen cookies satt av serveren (0 set-cookie-headere). | high |
| security | Ingen versjonslekkasjer | PASS | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. | medium |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-06-25T15:02:07.000Z, notAfter=2026-09-23T15:02:06.000Z, issuer=C=US, O=Let's Encrypt, CN=YE1, SAN=www.coop.no | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | FAIL | v=spf1 include:_spf1.coop.no include:_spf2.coop.no include:_spf3.coop.no include:_spf4.coop.no include:spf.protection.outlook.com include:sendgrid.net include:spf.mandrillapp.com include:de._netblocks.mimecast.com ~all — ~all er svakt, spoofing mulig | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | PASS | selectorer: selector1, selector2 | medium |
| security | DMARC (spoofing-beskyttelse) | PASS | p=reject (blokk) — v=DMARC1;p=reject;sp=reject;pct=100;rua=mailto:636be9c98d@rua.easydmarc.eu,mailto:dmarc.postmaster@coop.no;ruf=mailto:636be9c98d@ruf.easydmarc.eu;ri=86400;fo=1 | high |
| security | DMARC for subdomene | FAIL | ingen _dmarc.www.coop.no — subdomener kan spoofes | medium |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | NOT_APPLICABLE | ingen BIMI (ikke påkrevd) | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | PASS | AD-flag — signert sone validert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | coop-no.mail.protection.outlook.com (52.101.68.36) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | UNKNOWN | crt.sh-feil: The operation was aborted due to timeout | low |
| trust_privacy | Firma i Brreg (Enhetsregisteret) | UNKNOWN | ingen Brreg-treff for «Coop litt ditt» | medium |
| trust_privacy | Bransjekontekst (SSB) | UNKNOWN | ingen næringskode tilgjengelig | medium |
| trust_privacy | Domenet registrert (Norid) | PASS | registrert 2017-11-20 | high |
| reliability | Sist endret (Norid) | PASS | sist endret 2026-03-03 | high |
| security | DNSSEC (Norid) | PASS | DNSSEC aktivert (delegationSigned=true) | high |
| trust_privacy | Registrar (Norid) | PASS | registrar: Corporation Service Company | high |
| reliability | Arkivhistorikk finnes | PASS | arkivert siden 1999-01-25 | high |
| reliability | Aktualitet (siste arkiverte versjon) | PASS | fanget i løpet av siste 12 mnd (2025-08-22) | high |
| reliability | Arkivomfang | UNKNOWN | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | FAIL | ingen CMP/banner observert — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Reelt valg (avvis-knapp) | NOT_APPLICABLE | ingen banner/CMP observert | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | PASS | personvernerklæring lenket i footer | high |
| trust_privacy | Tredjeparts-trackere | PASS | ingen kjente tredjeparts-trackere observert | high |
| trust_privacy | Google Fonts (ekstern) | PASS | ingen ekstern Google Fonts observert | high |
| trust_privacy | Pris inkl. mva | FAIL | pris inkl. mva ikke observert — potential concern (prisopplysningsforskriften), krever juridisk vurdering | high |
| trust_privacy | Angrerett-informasjon | FAIL | angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering | high |
| trust_privacy | Klageadgang / tvisteløsning | FAIL | klageadgang/tvisteløsning ikke observert — potential concern, krever juridisk vurdering | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Sosiale medier (lenker fra nettsiden) | FAIL | ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet) | high |
| trust_privacy | Telefon på nettsiden | FAIL | ingen tel:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | E-post på nettsiden | FAIL | ingen mailto:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | UNKNOWN | Coop sin hjemmeside presenterer et bredt spekter av innhold, fra dagligvare- og byggevaretilbud til medlemsfordeler og inspirasjon. Teksten er godt strukturert og henvender seg tydelig til både nye og eksisterende medlemmer, med fokus på økonomiske fordeler og praktiske tips. Selv om teksten er informativ og relevant, er den preget av mange gjentakende visuelle elementer (representert med blokker) som ikke bidrar med tekstlig verdi. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | PASS | Ingen årstall-signaler funnet i teksten · Nevner 'ukens kundeavis' og 'denne uken' som indikerer ferskt innhold · Refererer til grillsesongen og matpakkesesongen som årstidsaktuelle temaer | medium |
| ai_visibility | Synlighet i AI-svar | FAIL | 0/3 svar nevner Coop litt ditt · sitat: «Coop har Norges største medlemsprogram (Coop Medlem). Du får bonus på alle dagligvarer (opptil 3 % på egenproduserte varer, og jevnlige medl» · prompter: «Hvilken dagligvarekjede i Norge gir best medlemsfo…» / «Hva er det beste stedet å handle både dagligvarer …» | medium |
| ai_visibility | Posisjon i AI-svar | FAIL | ikke nevnt i noen av svarene | medium |
| ai_visibility | Sentiment i AI-omtale | PASS | sentiment: positiv · råd: Fremhev Coop ByggMix og det samlede medlemsprogrammet tydeligere i AI-synlige kanaler for å styrke assosiasjonen mellom dagligvarer og bygge | medium |
| ai_visibility | Kilder AI-en siterer | UNKNOWN | ingen eksterne domener sitert | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.coop.no
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: br · Cache: no-store

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | max-age=31536000; includeSubDomains |
| xcto | nosniff |
| referrer | strict-origin-when-cross-origin |
| permissions | camera=(),microphone=(),usb=() |
| frame | — mangler |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: cloudflare

## 4. Crawl-resultat

- Sider sjekket: 22 · Vellykket: 22
- Ødelagte interne lenker: 0
- Ressurs-feil: 10/10

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: — · CDN: Cloudflare · Hosting: cloudflare
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: ingen

## 6. SEO / Meta / Struktur

- Tittel: Coop litt ditt - Dagligvarebutikker og byggevarehus - Coop · Meta-beskrivelse: Gode tilbud på dagligvarer og byggevarer. Coop-medlemmer får kjøpeutbytte på alt de handler og medlemskupp!
- Canonical: https://www.coop.no/ · robots.txt: ja · Sitemap: nei
- OpenGraph: {"title":true,"description":true,"image":false} · JSON-LD: nei
- Headings: {"h1":1,"h2":12,"h3":17,"h4":0,"h5":0,"h6":0} · Lang: nb-NO

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":true,"analytics":true,"cmp":false,"chat":true,"booking":true,"newsletter":true}
- Uutnyttet potensial: 17% (5/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.coop.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [FAIL] security_headers: Gradering B. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=31536000; includeSubDomains; X-Frame-Options: MANGLER; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: camera=(),microphone=(),usb=() Trekk: CSP mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP)
- [PASS] cookies_attributes: Ingen cookies satt av serveren (0 set-cookie-headere).
- [PASS] version_leaks: Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert.
- [PASS] tls_cert: notBefore=2026-06-25T15:02:07.000Z, notAfter=2026-09-23T15:02:06.000Z, issuer=C=US, O=Let's Encrypt, CN=YE1, SAN=www.coop.no
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [FAIL] spf: v=spf1 include:_spf1.coop.no include:_spf2.coop.no include:_spf3.coop.no include:_spf4.coop.no include:spf.protection.outlook.com include:sendgrid.net include:spf.mandrillapp.com include:de._netblocks.mimecast.com ~all — ~all er svakt, spoofing mulig
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [PASS] dkim: selectorer: selector1, selector2
- [PASS] dmarc: p=reject (blokk) — v=DMARC1;p=reject;sp=reject;pct=100;rua=mailto:636be9c98d@rua.easydmarc.eu,mailto:dmarc.postmaster@coop.no;ruf=mailto:636be9c98d@ruf.easydmarc.eu;ri=86400;fo=1
- [FAIL] dmarc_subdomain: ingen _dmarc.www.coop.no — subdomener kan spoofes
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [NOT_APPLICABLE] bimi: ingen BIMI (ikke påkrevd)
- [FAIL] caa: ingen CAA
- [PASS] dnssec: AD-flag — signert sone validert
- [PASS] dnsbl: coop-no.mail.protection.outlook.com (52.101.68.36) ikke listet
- [UNKNOWN] subdomains: crt.sh-feil: The operation was aborted due to timeout

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [UNKNOWN] brreg_org: ingen Brreg-treff for «Coop litt ditt»
- [UNKNOWN] ssb_context: ingen næringskode tilgjengelig
- [PASS] norid_registered: registrert 2017-11-20
- [PASS] norid_changed: sist endret 2026-03-03
- [PASS] norid_dnssec: DNSSEC aktivert (delegationSigned=true)
- [PASS] norid_registrar: registrar: Corporation Service Company

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [PASS] history_exists: arkivert siden 1999-01-25
- [PASS] history_freshness: fanget i løpet av siste 12 mnd (2025-08-22)
- [UNKNOWN] history_scope: omfang ikke tilgjengelig (Wayback CDX timeout på full historikk)

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error, fallback

## Compliance-signaler Norge (compliance)

- [FAIL] cmp_banner: ingen CMP/banner observert — potential concern, krever juridisk vurdering
- [NOT_APPLICABLE] consent_real_choice: ingen banner/CMP observert
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [PASS] privacy_policy: personvernerklæring lenket i footer
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

- [FAIL] social_profiles: ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet)
- [FAIL] nap_phone: ingen tel:-lenke observert — potential concern (kontaktbarhet)
- [FAIL] nap_email: ingen mailto:-lenke observert — potential concern (kontaktbarhet)
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [UNKNOWN] ai_content_quality: Coop sin hjemmeside presenterer et bredt spekter av innhold, fra dagligvare- og byggevaretilbud til medlemsfordeler og inspirasjon. Teksten er godt strukturert og henvender seg tydelig til både nye og eksisterende medlemmer, med fokus på økonomiske fordeler og praktiske tips. Selv om teksten er informativ og relevant, er den preget av mange gjentakende visuelle elementer (representert med blokker) som ikke bidrar med tekstlig verdi.
- [PASS] ai_content_freshness: Ingen årstall-signaler funnet i teksten · Nevner 'ukens kundeavis' og 'denne uken' som indikerer ferskt innhold · Refererer til grillsesongen og matpakkesesongen som årstidsaktuelle temaer

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [FAIL] ai_vis_visibility: 0/3 svar nevner Coop litt ditt · sitat: «Coop har Norges største medlemsprogram (Coop Medlem). Du får bonus på alle dagligvarer (opptil 3 % på egenproduserte varer, og jevnlige medl» · prompter: «Hvilken dagligvarekjede i Norge gir best medlemsfo…» / «Hva er det beste stedet å handle både dagligvarer …»
- [FAIL] ai_vis_position: ikke nevnt i noen av svarene
- [PASS] ai_vis_sentiment: sentiment: positiv · råd: Fremhev Coop ByggMix og det samlede medlemsprogrammet tydeligere i AI-synlige kanaler for å styrke assosiasjonen mellom dagligvarer og bygge
- [UNKNOWN] ai_vis_sources: ingen eksterne domener sitert

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis, measurements

# V2-kjøretid: 35475 ms (moduler parallelt)