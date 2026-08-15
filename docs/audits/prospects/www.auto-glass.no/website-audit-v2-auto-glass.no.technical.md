# Teknisk appendix — Arch Website Audit auto-glass.no

> **Generert:** 2026-08-15T00:45:35.058Z · **Nettsted:** https://auto-glass.no · **Endelig URL:** https://auto-glass.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-auto-glass.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 13 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 10 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | gzip | high |
| performance | Cache-headere | PASS | public, no-cache | high |
| performance | Render-blokkerende ressurser | FAIL | 14 blokkerende skript, 7 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 4 bilder, 1 m/ dimensjoner, 0 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 1 eksterne domener (use.typekit.net) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | nb-NO | high |
| accessibility | Alt-tekst på bilder | PASS | 0/4 bilder mangler alt | high |
| accessibility | Skjemaetiketter | FAIL | 3 input, 3 label | medium |
| accessibility | Overskriftshierarki | FAIL | h1=2 h2=1 h3=4 | high |
| accessibility | Semantiske landemerker | PASS | 3/4 (header, nav, footer) | high |
| seo | Tittel | PASS | Autoglass AS - Vi kan bilglass - Autoglass | high |
| seo | Meta-beskrivelse | FAIL | mangler meta description | high |
| seo | Canonical | PASS | https://auto-glass.no/ | high |
| seo | Robots-meta | PASS | ingen robots-meta (standard: indekserbart) | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | FAIL | mangler sitemap.xml | high |
| seo | OpenGraph | FAIL | title=true description=true image=false | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | PASS | tilstede | high |
| security | Blandet innhold (http på https) | FAIL | 2 http-referanser | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | Prometheus | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | PASS | 3 <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cms | PASS | WordPress | medium |
| tech | Teknologi: hosting | PASS | Prometheus | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager, Facebook Pixel | high |
| security | Sikkerhetsheadere — gradering C | FAIL | Gradering C. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=31536000; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS uten includeSubDomains · Permissions-Policy mangler | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | Ingen cookies satt av serveren (0 set-cookie-headere). | high |
| security | Versjonslekkasje: server-header | FAIL | server: Prometheus | high |
| security | WordPress-signatur i generator | FAIL | generator: WordPress 4.9.31 | medium |
| security | Versjonslekkasje: <meta name=generator> | FAIL | generator: WooCommerce 3.4.8 | medium |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-07-25T05:32:34.000Z, notAfter=2026-10-23T05:32:33.000Z, issuer=C=US, O=Let's Encrypt, CN=YR2, SAN=auto-glass.no, www.auto-glass.no | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | PASS | v=spf1 include:spf.protection.outlook.com -all | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | UNKNOWN | ingen av probede selektorer funnet (kan ikke konkludere fravær) | low |
| security | DMARC (spoofing-beskyttelse) | FAIL | p=none (kun overvåkning) — v=DMARC1; p=none | high |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | NOT_APPLICABLE | ingen BIMI (ikke påkrevd) | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | PASS | AD-flag — signert sone validert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | autoglass-no01b.mail.protection.outlook.com (52.101.73.12) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | UNKNOWN | crt.sh-feil: The operation was aborted due to timeout | low |
| trust_privacy | Organisasjonsnummer og navn | PASS | org 968552732 — AUTOGLASS AS | high |
| trust_privacy | Organisasjonsform | PASS | Aksjeselskap (AS) | high |
| security | Konkurs / under avvikling | PASS | ikke konkurs og ikke under avvikling | high |
| trust_privacy | Registrert i Merverdiavgiftsregisteret | PASS | registrert i MVA | high |
| trust_privacy | Stiftelses- og registreringsdato | PASS | stiftet 1994-01-17 · registrert i Enhetsregisteret 1995-02-20 | high |
| trust_privacy | Antall ansatte | PASS | 7 ansatte | high |
| trust_privacy | Næringskode og beskrivelse | PASS | 46.720 — Engroshandel med deler og utstyr for motorvogner | high |
| trust_privacy | Hjemmeside-konsistens (Brreg vs domene) | PASS | Brreg-hjemmeside «www.auto-glass.no» samsvarer med auditert domene auto-glass.no | high |
| trust_privacy | Navn-konsistens (nettside vs Brreg) | PASS | «Autoglass» samsvarer med Brreg-navn «AUTOGLASS AS» | high |
| trust_privacy | Siste årsregnskap | PASS | regnskap 2025: driftsinntekter 22 450 842 kr, resultat −1 164 896 kr | high |
| trust_privacy | Daglig leder / styreleder (Brreg) | PASS | daglig leder: Truls Opdal · styreleder: Eduard Eikeland | high |
| trust_privacy | Bransjekontekst (SSB) | UNKNOWN | SSB-tabell ikke kartlagt for næring 46 | medium |
| trust_privacy | Domenet registrert (Norid) | PASS | registrert 1999-11-14 | high |
| reliability | Sist endret (Norid) | PASS | sist endret 2025-11-16 | high |
| security | DNSSEC (Norid) | PASS | DNSSEC aktivert (delegationSigned=true) | high |
| trust_privacy | Registrar (Norid) | PASS | registrar: Domeneshop AS | high |
| reliability | Arkivhistorikk finnes | PASS | arkivert siden 2004-12-07 | high |
| reliability | Aktualitet (siste arkiverte versjon) | PASS | fanget i løpet av siste 12 mnd (2025-09-15) | high |
| reliability | Arkivomfang | UNKNOWN | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | FAIL | ingen CMP/banner observert — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Reelt valg (avvis-knapp) | NOT_APPLICABLE | ingen banner/CMP observert | high |
| trust_privacy | Forhåndsavkrysset samtykke | FAIL | forhåndsavkrysset samtykke-input observert (type=checkbox) — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Personvernerklæring | PASS | personvernerklæring lenket i footer | high |
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
| trust_privacy | E-post på nettsiden | PASS | mailto: post@auto-glass.no | medium |
| trust_privacy | Navn-konsistens (nettside ↔ Brreg) | PASS | «AUTOGLASS AS» (Brreg) samsvarer med nettsidenavn | high |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | UNKNOWN | Nettsiden til Autoglass AS presenterer selskapet som en leverandør av bilglass med stort lager og eksport til Skandinavia og Europa. Innholdet er faglig og informativt, men mangler oppdaterte årstall og meta-beskrivelse. Teksten er godt strukturert med tydelig fokus på kvalitet og sikkerhet, men kunne vært mer brukervennlig for potensielle kunder. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | UNKNOWN | Ingen årstall eller datoer funnet i teksten · Manglende meta-beskrivelse · Teksten inneholder mye teknisk informasjon om frontrute-benevninger · Tilstedeværelse av cookie- og personverninformasjon tyder på oppdatert nettside | medium |
| ai_visibility | Synlighet i AI-svar | PASS | 1/3 svar nevner Autoglass · sitat: «Autoglass / Autoglass AS / auto-glass.no nevnes ikke i noen av svarene.» · prompter: «Hvilket firma bør jeg velge for å skifte frontrute…» / «Hvor kan jeg få tak i et sjeldent bilglass til en …» | medium |
| ai_visibility | Posisjon i AI-svar | FAIL | beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar | medium |
| ai_visibility | Sentiment i AI-omtale | PASS | sentiment: nøytral · råd: Sørg for å bli nevnt i AI-svar ved å styrke tilstedeværelsen i relevante kataloger og innhold som dekker bilglassbytte og ADAS-kalibrering. | medium |
| ai_visibility | Kilder AI-en siterer | PASS | eksterne domener i AI-svar: ebay.co | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://auto-glass.no
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: gzip · Cache: public, no-cache

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | max-age=31536000 |
| xcto | nosniff |
| referrer | strict-origin-when-cross-origin |
| permissions | — mangler |
| frame | SAMEORIGIN |
- Blandet innhold: 2 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: Prometheus

## 4. Crawl-resultat

- Sider sjekket: 13 · Vellykket: 13
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/10

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: WordPress · CDN: — · Hosting: Prometheus
- Analytics/trackere: Google Analytics/Tag Manager, Facebook Pixel
- Tredjeparts-domener: use.typekit.net

## 6. SEO / Meta / Struktur

- Tittel: Autoglass AS - Vi kan bilglass - Autoglass · Meta-beskrivelse: —
- Canonical: https://auto-glass.no/ · robots.txt: ja · Sitemap: nei
- OpenGraph: {"title":true,"description":true,"image":false} · JSON-LD: ja
- Headings: {"h1":2,"h2":1,"h3":4,"h4":1,"h5":1,"h6":0} · Lang: nb-NO

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":true,"analytics":true,"cmp":false,"chat":false,"booking":true,"newsletter":false}
- Uutnyttet potensial: 50% (3/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-auto-glass.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [FAIL] security_headers: Gradering C. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=31536000; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS uten includeSubDomains · Permissions-Policy mangler
- [PASS] cookies_attributes: Ingen cookies satt av serveren (0 set-cookie-headere).
- [FAIL] leak_0_server: server: Prometheus
- [FAIL] leak_1_wordpress: generator: WordPress 4.9.31
- [FAIL] leak_2_meta: generator: WooCommerce 3.4.8
- [PASS] tls_cert: notBefore=2026-07-25T05:32:34.000Z, notAfter=2026-10-23T05:32:33.000Z, issuer=C=US, O=Let's Encrypt, CN=YR2, SAN=auto-glass.no, www.auto-glass.no
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [PASS] spf: v=spf1 include:spf.protection.outlook.com -all
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [UNKNOWN] dkim: ingen av probede selektorer funnet (kan ikke konkludere fravær)
- [FAIL] dmarc: p=none (kun overvåkning) — v=DMARC1; p=none
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [NOT_APPLICABLE] bimi: ingen BIMI (ikke påkrevd)
- [FAIL] caa: ingen CAA
- [PASS] dnssec: AD-flag — signert sone validert
- [PASS] dnsbl: autoglass-no01b.mail.protection.outlook.com (52.101.73.12) ikke listet
- [UNKNOWN] subdomains: crt.sh-feil: The operation was aborted due to timeout

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [PASS] brreg_org: org 968552732 — AUTOGLASS AS
- [PASS] brreg_orgform: Aksjeselskap (AS)
- [PASS] brreg_konkurs: ikke konkurs og ikke under avvikling
- [PASS] brreg_mva: registrert i MVA
- [PASS] brreg_dates: stiftet 1994-01-17 · registrert i Enhetsregisteret 1995-02-20
- [PASS] brreg_ansatte: 7 ansatte
- [PASS] brreg_naering: 46.720 — Engroshandel med deler og utstyr for motorvogner
- [PASS] brreg_hjemmeside: Brreg-hjemmeside «www.auto-glass.no» samsvarer med auditert domene auto-glass.no
- [PASS] brreg_navn_consistency: «Autoglass» samsvarer med Brreg-navn «AUTOGLASS AS»
- [PASS] brreg_regnskap: regnskap 2025: driftsinntekter 22 450 842 kr, resultat −1 164 896 kr
- [PASS] brreg_roller: daglig leder: Truls Opdal · styreleder: Eduard Eikeland
- [UNKNOWN] ssb_context: SSB-tabell ikke kartlagt for næring 46
- [PASS] norid_registered: registrert 1999-11-14
- [PASS] norid_changed: sist endret 2025-11-16
- [PASS] norid_dnssec: DNSSEC aktivert (delegationSigned=true)
- [PASS] norid_registrar: registrar: Domeneshop AS

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [PASS] history_exists: arkivert siden 2004-12-07
- [PASS] history_freshness: fanget i løpet av siste 12 mnd (2025-09-15)
- [UNKNOWN] history_scope: omfang ikke tilgjengelig (Wayback CDX timeout på full historikk)

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error, fallback

## Compliance-signaler Norge (compliance)

- [FAIL] cmp_banner: ingen CMP/banner observert — potential concern, krever juridisk vurdering
- [NOT_APPLICABLE] consent_real_choice: ingen banner/CMP observert
- [FAIL] consent_prechecked: forhåndsavkrysset samtykke-input observert (type=checkbox) — potential concern, krever juridisk vurdering
- [PASS] privacy_policy: personvernerklæring lenket i footer
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
- [PASS] nap_email: mailto: post@auto-glass.no
- [PASS] nap_name_consistency: «AUTOGLASS AS» (Brreg) samsvarer med nettsidenavn
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [UNKNOWN] ai_content_quality: Nettsiden til Autoglass AS presenterer selskapet som en leverandør av bilglass med stort lager og eksport til Skandinavia og Europa. Innholdet er faglig og informativt, men mangler oppdaterte årstall og meta-beskrivelse. Teksten er godt strukturert med tydelig fokus på kvalitet og sikkerhet, men kunne vært mer brukervennlig for potensielle kunder.
- [UNKNOWN] ai_content_freshness: Ingen årstall eller datoer funnet i teksten · Manglende meta-beskrivelse · Teksten inneholder mye teknisk informasjon om frontrute-benevninger · Tilstedeværelse av cookie- og personverninformasjon tyder på oppdatert nettside

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [PASS] ai_vis_visibility: 1/3 svar nevner Autoglass · sitat: «Autoglass / Autoglass AS / auto-glass.no nevnes ikke i noen av svarene.» · prompter: «Hvilket firma bør jeg velge for å skifte frontrute…» / «Hvor kan jeg få tak i et sjeldent bilglass til en …»
- [FAIL] ai_vis_position: beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar
- [PASS] ai_vis_sentiment: sentiment: nøytral · råd: Sørg for å bli nevnt i AI-svar ved å styrke tilstedeværelsen i relevante kataloger og innhold som dekker bilglassbytte og ADAS-kalibrering.
- [PASS] ai_vis_sources: eksterne domener i AI-svar: ebay.co

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis, measurements

# V2-kjøretid: 42647 ms (moduler parallelt)