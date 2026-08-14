# Teknisk appendix — Arch Website Audit www.toma.no

> **Generert:** 2026-08-14T21:38:33.761Z · **Nettsted:** https://www.toma.no · **Endelig URL:** https://www.toma.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.toma.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 25 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 3 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | br | high |
| performance | Cache-headere | PASS | public, max-age=0 | high |
| performance | Render-blokkerende ressurser | FAIL | 1 blokkerende skript, 2 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 13 bilder, 0 m/ dimensjoner, 12 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 1 eksterne domener (fonts.bunny.net) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | nb-NO | high |
| accessibility | Alt-tekst på bilder | PASS | 0/13 bilder mangler alt | high |
| accessibility | Skjemaetiketter | FAIL | 1 input, 0 label | medium |
| accessibility | Overskriftshierarki | PASS | h1=1 h2=8 h3=14 | high |
| accessibility | Semantiske landemerker | PASS | 4/4 (header, nav, main, footer) | high |
| seo | Tittel | PASS | Toma gir mennesker en bedre arbeidsdag - Toma | high |
| seo | Meta-beskrivelse | PASS | Toma er en bedrift med 45 års erfaring som skaper trygge og effektive arbeidsplasser – fra kantine og renhold til eiendomsdrift og vakthold. | high |
| seo | Canonical | PASS | https://www.toma.no/ | high |
| seo | Robots-meta | PASS | index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1 | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (14 URL-er) | high |
| seo | OpenGraph | PASS | title=true description=true image=true | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | FAIL | mangler | high |
| security | Header: xcto | FAIL | mangler | high |
| security | Header: referrer | FAIL | mangler | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | FAIL | mangler | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | BunnyCDN-NO1-830 | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | PASS | 1 <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cms | PASS | WordPress | medium |
| tech | Teknologi: hosting | PASS | BunnyCDN-NO1-830 | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |
| security | Sikkerhetsheadere — gradering F | FAIL | Gradering F. Content-Security-Policy: MANGLER; Strict-Transport-Security: MANGLER; X-Frame-Options: MANGLER; X-Content-Type-Options: MANGLER; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · X-Content-Type-Options mangler nosniff · Referrer-Policy mangler · Permissions-Policy mangler | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | Ingen cookies satt av serveren (0 set-cookie-headere). | high |
| security | Versjonslekkasje: server-header | FAIL | server: BunnyCDN-NO1-830 | high |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-07-30T00:02:39.000Z, notAfter=2026-10-28T00:02:38.000Z, issuer=C=US, O=Let's Encrypt, CN=YR1, SAN=www.toma.no | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | PASS | v=spf1 include:spf.protection.outlook.com -all | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | PASS | selectorer: default, selector1 | medium |
| security | DMARC (spoofing-beskyttelse) | FAIL | p=none (kun overvåkning) — v=DMARC1; p=none | high |
| security | DMARC for subdomene | FAIL | ingen _dmarc.www.toma.no — subdomener kan spoofes | medium |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | NOT_APPLICABLE | ingen BIMI (ikke påkrevd) | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | PASS | AD-flag — signert sone validert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | toma-no.mail.protection.outlook.com (52.101.73.12) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | UNKNOWN | crt.sh-feil: HTTP 503 | low |
| trust_privacy | Organisasjonsnummer og navn | PASS | org 923327487 — TOMADESIGN TOMA KUNCE | medium |
| trust_privacy | Organisasjonsform | PASS | Enkeltpersonforetak (ENK) | high |
| security | Konkurs / under avvikling | PASS | ikke konkurs og ikke under avvikling | high |
| trust_privacy | Registrert i Merverdiavgiftsregisteret | PASS | ikke registrert i MVA | high |
| trust_privacy | Stiftelses- og registreringsdato | PASS | registrert i Enhetsregisteret 2019-09-04 | high |
| trust_privacy | Antall ansatte | PASS | antall ansatte ikke oppgitt | high |
| trust_privacy | Næringskode og beskrivelse | PASS | 96.990 — Andre personlige tjenester ikke nevnt annet sted | high |
| trust_privacy | Hjemmeside registrert i Brreg | FAIL | ingen hjemmeside registrert i Brreg for «TOMADESIGN TOMA KUNCE» | high |
| trust_privacy | Navn-konsistens (nettside vs Brreg) | PASS | «Toma» samsvarer med Brreg-navn «TOMADESIGN TOMA KUNCE» | medium |
| trust_privacy | Siste årsregnskap | NOT_APPLICABLE | ikke regnskapspliktig eller ikke innsendt årsregnskap | high |
| trust_privacy | Daglig leder / styreleder (Brreg) | UNKNOWN | ingen daglig leder i åpent roller-API (ENK har ofte 0 roller) | medium |
| trust_privacy | Bransjekontekst (SSB, næring 96) | PASS | SSB tabell 12817: Annen personlig tjenesteyting — 16 771 foretak (2024) | high |
| trust_privacy | Domenet registrert (Norid) | PASS | registrert 2015-11-04 | high |
| reliability | Sist endret (Norid) | PASS | sist endret 2025-10-07 | high |
| security | DNSSEC (Norid) | PASS | DNSSEC aktivert (delegationSigned=true) | high |
| trust_privacy | Registrar (Norid) | PASS | registrar: Domeneshop AS | high |
| reliability | Arkivhistorikk finnes | PASS | arkivert siden 2000-11-10 | high |
| reliability | Aktualitet (siste arkiverte versjon) | PASS | siste snapshot 2025-09-15 | high |
| reliability | Arkivomfang | UNKNOWN | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | FAIL | ingen CMP/banner observert — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Reelt valg (avvis-knapp) | NOT_APPLICABLE | ingen banner/CMP observert | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | PASS | personvernerklæring lenket i footer | high |
| trust_privacy | Tredjeparts-trackere | FAIL | trackere observert (Google Tag Manager) — ingen synlig samtykke-gating observert — potential concern, krever juridisk vurdering | high |
| trust_privacy | Google Fonts (ekstern) | PASS | ingen ekstern Google Fonts observert | high |
| trust_privacy | Pris inkl. mva | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| trust_privacy | Angrerett-informasjon | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| trust_privacy | Klageadgang / tvisteløsning | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 403 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 403 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Sosiale medier (lenker fra nettsiden) | FAIL | ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet) | high |
| trust_privacy | Telefon på nettsiden | PASS | tel-lenke: 09090 | medium |
| trust_privacy | E-post på nettsiden | FAIL | ingen mailto:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | Navn-konsistens (nettside ↔ Brreg) | PASS | «TOMADESIGN TOMA KUNCE» (Brreg) samsvarer med nettsidenavn | high |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | PASS | Teksten presenterer Toma som en erfaren og familieeid FM-leverandør med bredt tjenestetilbud, og kommuniserer tydelig verdi som trygghet, effektivitet og personlig service. Innholdet er godt strukturert og profesjonelt skrevet, men mangler konkrete årstall eller datoer som kan bekrefte hvor oppdatert informasjonen er. Aktualiteten vurderes som middels på grunn av fravær av tidsmarkører, selv om referanser til oppkjøp og sertifiseringer indikerer nylig aktivitet. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | UNKNOWN | ingen årstall-signaler funnet i teksten · nevner oppkjøp av ISS som kan være tidsrelevant · refererer til ISO-sertifiseringer og bærekraftsrapportering | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.toma.no
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: br · Cache: public, max-age=0

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | — mangler |
| xcto | — mangler |
| referrer | — mangler |
| permissions | — mangler |
| frame | — mangler |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: BunnyCDN-NO1-830

## 4. Crawl-resultat

- Sider sjekket: 25 · Vellykket: 25
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/3

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: WordPress · CDN: — · Hosting: BunnyCDN-NO1-830
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: fonts.bunny.net

## 6. SEO / Meta / Struktur

- Tittel: Toma gir mennesker en bedre arbeidsdag - Toma · Meta-beskrivelse: Toma er en bedrift med 45 års erfaring som skaper trygge og effektive arbeidsplasser – fra kantine og renhold til eiendomsdrift og vakthold.
- Canonical: https://www.toma.no/ · robots.txt: ja · Sitemap: 14 URL-er
- OpenGraph: {"title":true,"description":true,"image":true} · JSON-LD: ja
- Headings: {"h1":1,"h2":8,"h3":14,"h4":0,"h5":0,"h6":0} · Lang: nb-NO

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":true,"analytics":true,"cmp":false,"chat":true,"booking":false,"newsletter":false}
- Uutnyttet potensial: 50% (3/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.toma.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [FAIL] security_headers: Gradering F. Content-Security-Policy: MANGLER; Strict-Transport-Security: MANGLER; X-Frame-Options: MANGLER; X-Content-Type-Options: MANGLER; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · X-Content-Type-Options mangler nosniff · Referrer-Policy mangler · Permissions-Policy mangler
- [PASS] cookies_attributes: Ingen cookies satt av serveren (0 set-cookie-headere).
- [FAIL] leak_0_server: server: BunnyCDN-NO1-830
- [PASS] tls_cert: notBefore=2026-07-30T00:02:39.000Z, notAfter=2026-10-28T00:02:38.000Z, issuer=C=US, O=Let's Encrypt, CN=YR1, SAN=www.toma.no
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [PASS] spf: v=spf1 include:spf.protection.outlook.com -all
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [PASS] dkim: selectorer: default, selector1
- [FAIL] dmarc: p=none (kun overvåkning) — v=DMARC1; p=none
- [FAIL] dmarc_subdomain: ingen _dmarc.www.toma.no — subdomener kan spoofes
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [NOT_APPLICABLE] bimi: ingen BIMI (ikke påkrevd)
- [FAIL] caa: ingen CAA
- [PASS] dnssec: AD-flag — signert sone validert
- [PASS] dnsbl: toma-no.mail.protection.outlook.com (52.101.73.12) ikke listet
- [UNKNOWN] subdomains: crt.sh-feil: HTTP 503

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [PASS] brreg_org: org 923327487 — TOMADESIGN TOMA KUNCE
- [PASS] brreg_orgform: Enkeltpersonforetak (ENK)
- [PASS] brreg_konkurs: ikke konkurs og ikke under avvikling
- [PASS] brreg_mva: ikke registrert i MVA
- [PASS] brreg_dates: registrert i Enhetsregisteret 2019-09-04
- [PASS] brreg_ansatte: antall ansatte ikke oppgitt
- [PASS] brreg_naering: 96.990 — Andre personlige tjenester ikke nevnt annet sted
- [FAIL] brreg_hjemmeside: ingen hjemmeside registrert i Brreg for «TOMADESIGN TOMA KUNCE»
- [PASS] brreg_navn_consistency: «Toma» samsvarer med Brreg-navn «TOMADESIGN TOMA KUNCE»
- [NOT_APPLICABLE] brreg_regnskap: ikke regnskapspliktig eller ikke innsendt årsregnskap
- [UNKNOWN] brreg_roller: ingen daglig leder i åpent roller-API (ENK har ofte 0 roller)
- [PASS] ssb_context: SSB tabell 12817: Annen personlig tjenesteyting — 16 771 foretak (2024)
- [PASS] norid_registered: registrert 2015-11-04
- [PASS] norid_changed: sist endret 2025-10-07
- [PASS] norid_dnssec: DNSSEC aktivert (delegationSigned=true)
- [PASS] norid_registrar: registrar: Domeneshop AS

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [PASS] history_exists: arkivert siden 2000-11-10
- [PASS] history_freshness: siste snapshot 2025-09-15
- [UNKNOWN] history_scope: omfang ikke tilgjengelig (Wayback CDX timeout på full historikk)

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error, fallback

## Compliance-signaler Norge (compliance)

- [FAIL] cmp_banner: ingen CMP/banner observert — potential concern, krever juridisk vurdering
- [NOT_APPLICABLE] consent_real_choice: ingen banner/CMP observert
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [PASS] privacy_policy: personvernerklæring lenket i footer
- [FAIL] third_party_trackers: trackere observert (Google Tag Manager) — ingen synlig samtykke-gating observert — potential concern, krever juridisk vurdering
- [PASS] google_fonts: ingen ekstern Google Fonts observert
- [NOT_APPLICABLE] ecom_price_vat: ingen e-handels-signaler observert (handlekurv/kjøp/pris)
- [NOT_APPLICABLE] ecom_angrerett: ingen e-handels-signaler observert (handlekurv/kjøp/pris)
- [NOT_APPLICABLE] ecom_klage: ingen e-handels-signaler observert (handlekurv/kjøp/pris)

Rådata-nøkler: url, fetched, status, fetch_error, html_length, script_srcs, cmp, consent_reject, consent_prechecked, privacy, trackers, google_fonts, ecommerce

## Fart (PageSpeed Insights + CrUX) (pagespeed)

- [UNKNOWN] psi_mobile: API-feil: HTTP 403
- [UNKNOWN] psi_desktop: API-feil: HTTP 403
- [UNKNOWN] psi_availability: API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig

Rådata-nøkler: mobile, desktop

## Tilstedeværelse (sosiale medier · NAP) (presence)

- [FAIL] social_profiles: ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet)
- [PASS] nap_phone: tel-lenke: 09090
- [FAIL] nap_email: ingen mailto:-lenke observert — potential concern (kontaktbarhet)
- [PASS] nap_name_consistency: «TOMADESIGN TOMA KUNCE» (Brreg) samsvarer med nettsidenavn
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [PASS] ai_content_quality: Teksten presenterer Toma som en erfaren og familieeid FM-leverandør med bredt tjenestetilbud, og kommuniserer tydelig verdi som trygghet, effektivitet og personlig service. Innholdet er godt strukturert og profesjonelt skrevet, men mangler konkrete årstall eller datoer som kan bekrefte hvor oppdatert informasjonen er. Aktualiteten vurderes som middels på grunn av fravær av tidsmarkører, selv om referanser til oppkjøp og sertifiseringer indikerer nylig aktivitet.
- [UNKNOWN] ai_content_freshness: ingen årstall-signaler funnet i teksten · nevner oppkjøp av ISS som kan være tidsrelevant · refererer til ISO-sertifiseringer og bærekraftsrapportering

Rådata-nøkler: available, error, prompt, response, model

# V2-kjøretid: 22731 ms (moduler parallelt)