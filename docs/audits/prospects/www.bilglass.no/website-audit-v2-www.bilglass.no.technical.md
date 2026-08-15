# Teknisk appendix — Arch Website Audit www.bilglass.no

> **Generert:** 2026-08-15T00:30:46.118Z · **Nettsted:** https://www.bilglass.no · **Endelig URL:** https://www.bilglass.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.bilglass.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | FAIL | 3 ødelagt (www.bilglass.no/cdn-cgi/content → 404, www.bilglass.no/cdn-cgi/l/email-protection → 404, www.bilglass.no/cdn-cgi/content → 404) | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 10 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | br | high |
| performance | Cache-headere | PASS | public, max-age=0, must-revalidate | high |
| performance | Render-blokkerende ressurser | FAIL | 2 blokkerende skript, 1 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 2 bilder, 0 m/ dimensjoner, 2 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 1 eksterne domener (cdn.sanity.io) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | no | high |
| accessibility | Alt-tekst på bilder | PASS | 0/2 bilder mangler alt | high |
| accessibility | Skjemaetiketter | FAIL | 2 input, 0 label | medium |
| accessibility | Overskriftshierarki | FAIL | h1=0 h2=0 h3=0 | high |
| accessibility | Semantiske landemerker | PASS | 3/4 (header, nav, footer) | high |
| seo | Tittel | PASS | Riis Bilglass - Reparasjon av steinsprut - ring 090 09 | high |
| seo | Meta-beskrivelse | PASS | Riis Bilglass – Profesjonell reparasjon av steinsprut. Rask og pålitelig service. Ring 090 09 for hjelp i dag! | high |
| seo | Canonical | FAIL | mangler canonical | high |
| seo | Robots-meta | PASS | ingen robots-meta (standard: indekserbart) | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (225 URL-er) | high |
| seo | OpenGraph | PASS | title=true description=true image=true | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | FAIL | mangler | high |
| security | Header: referrer | FAIL | mangler | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | FAIL | mangler | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | PASS | ingen sourceMappingURL i sjekkede skript | medium |
| security | Versjons-avsløring | FAIL | cloudflare, Next.js | high |
| trust_privacy | Cookie-banner | FAIL | ingen cookie-banner observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | PASS | 1 <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: framework | PASS | Next.js | medium |
| tech | Teknologi: cdn | PASS | Cloudflare | high |
| tech | Teknologi: hosting | PASS | cloudflare | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |
| security | Sikkerhetsheadere — gradering F | FAIL | Gradering F. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=63072000; X-Frame-Options: MANGLER; X-Content-Type-Options: MANGLER; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS uten includeSubDomains · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · X-Content-Type-Options mangler nosniff · Referrer-Policy mangler · Permissions-Policy mangler | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | Ingen cookies satt av serveren (0 set-cookie-headere). | high |
| security | Versjonslekkasje: x-powered-by-header | FAIL | x-powered-by: Next.js | high |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-07-09T20:26:45.000Z, notAfter=2026-10-07T21:25:26.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=bilglass.no, *.bilglass.no | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | PASS | TLS 1.0: blocked · TLS 1.1: blocked | medium |
| security | SPF (avsender-verifisering) | PASS | v=spf1 include:mail.eu1.inforcloudsuite.com include:spf.protection.outlook.com include:spf.eye-share.com include:167.89.93.88 include:193.69.152.146 -all | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | UNKNOWN | ingen av probede selektorer funnet (kan ikke konkludere fravær) | low |
| security | DMARC (spoofing-beskyttelse) | FAIL | ingen DMARC | high |
| security | DMARC for subdomene | FAIL | ingen _dmarc.www.bilglass.no — subdomener kan spoofes | medium |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | NOT_APPLICABLE | ingen BIMI (ikke påkrevd) | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | FAIL | manglende AD-flag — sonen er ikke DNSSEC-signert | high |
| trust_privacy | E-post-omdømme (DNSBL) | PASS | bilglass-no.mail.protection.outlook.com (52.101.73.16) ikke listet | medium |
| security | Subdomene-eksponering (crt.sh) | PASS | 15 subdomener — interessant: admin.bilglass.no, booking.test.bilglass.no, mail.bilglass.no | medium |
| trust_privacy | Firma i Brreg (Enhetsregisteret) | UNKNOWN | N kandidater for «Riis Bilglass», ingen med Brreg-hjemmeside som matcher bilglass.no — kan ikke entydig knytte firma til domene. Kandidater: RIIS BILGLASS AS (979224907) · RIIS (920721427) · BILGLASS AS (995566559) | medium |
| trust_privacy | Bransjekontekst (SSB, næring 95) | PASS | SSB tabell 12817: Reparasjon av varer til personlig bruk — 1 461 foretak (2024) | high |
| trust_privacy | Domenet registrert (Norid) | PASS | registrert 2012-08-06 | high |
| reliability | Sist endret (Norid) | PASS | sist endret 2026-07-06 | high |
| security | DNSSEC (Norid) | FAIL | DNSSEC ikke aktivert (delegationSigned=false) | high |
| trust_privacy | Registrar (Norid) | PASS | registrar: SIRCON NORGE AS | high |
| reliability | Arkivhistorikk finnes | PASS | arkivert siden 2001-03-02 | high |
| reliability | Aktualitet (siste arkiverte versjon) | PASS | siste snapshot 2026-07-16 | high |
| reliability | Arkivomfang | PASS | 100 arkiverte versjoner (unike URL-nøkler, limit 100) | high |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | FAIL | ingen CMP/banner observert — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Reelt valg (avvis-knapp) | NOT_APPLICABLE | ingen banner/CMP observert | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | PASS | personvernerklæring lenket i footer | high |
| trust_privacy | Tredjeparts-trackere | FAIL | trackere observert (Google Tag Manager) — ingen synlig samtykke-gating observert — potential concern, krever juridisk vurdering | high |
| trust_privacy | Google Fonts (ekstern) | PASS | ingen ekstern Google Fonts observert | high |
| trust_privacy | Pris inkl. mva | FAIL | pris inkl. mva ikke observert — potential concern (prisopplysningsforskriften), krever juridisk vurdering | high |
| trust_privacy | Angrerett-informasjon | FAIL | angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering | high |
| trust_privacy | Klageadgang / tvisteløsning | FAIL | klageadgang/tvisteløsning ikke observert — potential concern, krever juridisk vurdering | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Sosiale medier (lenker fra nettsiden) | PASS | 3 profiler lenket — alle svarer (instagram: 200 · facebook: 400 · linkedin: 200) | high |
| trust_privacy | Telefon på nettsiden | PASS | tel-lenke: 090 09 | medium |
| trust_privacy | E-post på nettsiden | FAIL | ingen mailto:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | Navn-konsistens (nettside ↔ Brreg) | PASS | «RIIS BILGLASS AS» (Brreg) samsvarer med nettsidenavn | high |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | UNKNOWN | Nettstedet presenterer et bredt spekter av bilglass-tjenester og tydelig kontaktinformasjon, med fokus på rask og enkel bestilling via telefon. Innholdet er strukturert og profesjonelt, men mangler dybde og konkrete detaljer om priser eller garantier. Teksten er uten stavefeil og virker oppdatert, men gir lite informasjon om selskapets historie eller kvalitetsbevis utover sertifisering. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | PASS | ingen årstall eller datoer funnet · teksten er oppdatert med tjenester og kontaktinformasjon · ingen tegn på utdatert innhold | medium |
| ai_visibility | Synlighet i AI-svar | FAIL | 0/3 svar nevner Riis Bilglass · sitat: «Det er et par aktører som skiller seg ut.» · prompter: «Hvilket bilglassfirma bør jeg velge for rask og på…» / «Er det verdt å reparere en steinsprutskade fremfor…» | medium |
| ai_visibility | Posisjon i AI-svar | FAIL | ikke nevnt i noen av svarene | medium |
| ai_visibility | Sentiment i AI-omtale | PASS | sentiment: nøytral · råd: Sørg for at bedriftens åpningstider og tjenester (gratis lånebil, døgnvakt) er tydelig og konsistent beskrevet på nettsiden og i lokale søk. | medium |
| ai_visibility | Kilder AI-en siterer | UNKNOWN | ingen eksterne domener sitert | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.bilglass.no
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: br · Cache: public, max-age=0, must-revalidate

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | max-age=63072000 |
| xcto | — mangler |
| referrer | — mangler |
| permissions | — mangler |
| frame | — mangler |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: nei
- Versjons-avsløring: cloudflare, Next.js

## 4. Crawl-resultat

- Sider sjekket: 25 · Vellykket: 22
- Ødelagte interne lenker: 3
  https://www.bilglass.no/cdn-cgi/content?id=Ue0hH63uZaCFBcbhmMfRUxtfre2v_MLNq.Q9xCMUmDY-1786753772.7875392-1.2.1.1-9KoUhuhQdStK6tucY5I6Cu_0ezMbwN7i_56tpzcMOCYrNuYd5dqCN92ftV1AvRwx → 404, https://www.bilglass.no/cdn-cgi/l/email-protection#f3819a9a80b3919a9f949f928080dd9d9c → 404, https://www.bilglass.no/cdn-cgi/content?id=QS.FPMmlSBWyDEzWhE87nYAH5c8rfjVPmF3K3sgDuJk-1786753773.7745607-1.2.1.1-jlOxsKlxjBijEBqwANKWBM7jQAcWv0tKrUuWJTZTuD74ilKgJpH.dBjTBpdpp5Ez → 404
- Ressurs-feil: 0/10

## 5. Teknologi-overflate (confidence merket)

- Framework: Next.js · CMS: — · CDN: Cloudflare · Hosting: cloudflare
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: cdn.sanity.io

## 6. SEO / Meta / Struktur

- Tittel: Riis Bilglass - Reparasjon av steinsprut - ring 090 09 · Meta-beskrivelse: Riis Bilglass – Profesjonell reparasjon av steinsprut. Rask og pålitelig service. Ring 090 09 for hjelp i dag!
- Canonical: — · robots.txt: ja · Sitemap: 225 URL-er
- OpenGraph: {"title":true,"description":true,"image":true} · JSON-LD: ja
- Headings: {"h1":0,"h2":0,"h3":0,"h4":0,"h5":0,"h6":0} · Lang: no

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":true,"analytics":true,"cmp":false,"chat":true,"booking":true,"newsletter":false}
- Uutnyttet potensial: 33% (4/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.bilglass.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [FAIL] security_headers: Gradering F. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=63072000; X-Frame-Options: MANGLER; X-Content-Type-Options: MANGLER; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS uten includeSubDomains · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · X-Content-Type-Options mangler nosniff · Referrer-Policy mangler · Permissions-Policy mangler
- [PASS] cookies_attributes: Ingen cookies satt av serveren (0 set-cookie-headere).
- [FAIL] leak_0_x-powered-by: x-powered-by: Next.js
- [PASS] tls_cert: notBefore=2026-07-09T20:26:45.000Z, notAfter=2026-10-07T21:25:26.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=bilglass.no, *.bilglass.no
- [PASS] tls_verify: verify return code: 0 (ok)
- [PASS] tls_legacy: TLS 1.0: blocked · TLS 1.1: blocked

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [PASS] spf: v=spf1 include:mail.eu1.inforcloudsuite.com include:spf.protection.outlook.com include:spf.eye-share.com include:167.89.93.88 include:193.69.152.146 -all
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [UNKNOWN] dkim: ingen av probede selektorer funnet (kan ikke konkludere fravær)
- [FAIL] dmarc: ingen DMARC
- [FAIL] dmarc_subdomain: ingen _dmarc.www.bilglass.no — subdomener kan spoofes
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [NOT_APPLICABLE] bimi: ingen BIMI (ikke påkrevd)
- [FAIL] caa: ingen CAA
- [FAIL] dnssec: manglende AD-flag — sonen er ikke DNSSEC-signert
- [PASS] dnsbl: bilglass-no.mail.protection.outlook.com (52.101.73.16) ikke listet
- [PASS] subdomains: 15 subdomener — interessant: admin.bilglass.no, booking.test.bilglass.no, mail.bilglass.no

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [UNKNOWN] brreg_org: N kandidater for «Riis Bilglass», ingen med Brreg-hjemmeside som matcher bilglass.no — kan ikke entydig knytte firma til domene. Kandidater: RIIS BILGLASS AS (979224907) · RIIS (920721427) · BILGLASS AS (995566559)
- [PASS] ssb_context: SSB tabell 12817: Reparasjon av varer til personlig bruk — 1 461 foretak (2024)
- [PASS] norid_registered: registrert 2012-08-06
- [PASS] norid_changed: sist endret 2026-07-06
- [FAIL] norid_dnssec: DNSSEC ikke aktivert (delegationSigned=false)
- [PASS] norid_registrar: registrar: SIRCON NORGE AS

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [PASS] history_exists: arkivert siden 2001-03-02
- [PASS] history_freshness: siste snapshot 2026-07-16
- [PASS] history_scope: 100 arkiverte versjoner (unike URL-nøkler, limit 100)

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count

## Compliance-signaler Norge (compliance)

- [FAIL] cmp_banner: ingen CMP/banner observert — potential concern, krever juridisk vurdering
- [NOT_APPLICABLE] consent_real_choice: ingen banner/CMP observert
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [PASS] privacy_policy: personvernerklæring lenket i footer
- [FAIL] third_party_trackers: trackere observert (Google Tag Manager) — ingen synlig samtykke-gating observert — potential concern, krever juridisk vurdering
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

- [PASS] social_profiles: 3 profiler lenket — alle svarer (instagram: 200 · facebook: 400 · linkedin: 200)
- [PASS] nap_phone: tel-lenke: 090 09
- [FAIL] nap_email: ingen mailto:-lenke observert — potential concern (kontaktbarhet)
- [PASS] nap_name_consistency: «RIIS BILGLASS AS» (Brreg) samsvarer med nettsidenavn
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [UNKNOWN] ai_content_quality: Nettstedet presenterer et bredt spekter av bilglass-tjenester og tydelig kontaktinformasjon, med fokus på rask og enkel bestilling via telefon. Innholdet er strukturert og profesjonelt, men mangler dybde og konkrete detaljer om priser eller garantier. Teksten er uten stavefeil og virker oppdatert, men gir lite informasjon om selskapets historie eller kvalitetsbevis utover sertifisering.
- [PASS] ai_content_freshness: ingen årstall eller datoer funnet · teksten er oppdatert med tjenester og kontaktinformasjon · ingen tegn på utdatert innhold

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [FAIL] ai_vis_visibility: 0/3 svar nevner Riis Bilglass · sitat: «Det er et par aktører som skiller seg ut.» · prompter: «Hvilket bilglassfirma bør jeg velge for rask og på…» / «Er det verdt å reparere en steinsprutskade fremfor…»
- [FAIL] ai_vis_position: ikke nevnt i noen av svarene
- [PASS] ai_vis_sentiment: sentiment: nøytral · råd: Sørg for at bedriftens åpningstider og tjenester (gratis lånebil, døgnvakt) er tydelig og konsistent beskrevet på nettsiden og i lokale søk.
- [UNKNOWN] ai_vis_sources: ingen eksterne domener sitert

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis, measurements

# V2-kjøretid: 37490 ms (moduler parallelt)