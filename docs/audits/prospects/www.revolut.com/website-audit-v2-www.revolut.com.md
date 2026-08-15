# Arch Website Audit — www.revolut.com

| | |
|---|---|
| Kunde | www.revolut.com |
| Nettsted | https://www.revolut.com |
| Audit-dato | 2026-08-15T00:54:22.602Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

## Executive Summary

www.revolut.com sin offentlige nettside scorer **42%** på Arch Website Score. Den største risikoen er: **Ødelagte interne lenker**. **13 funn** bør prioriteres (0 kritisk, 13 høy ROI). Største mulighet: **67% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 42%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🔴 Performance | ████░░░░░░ 38% |
| 🟠 Security Surface | ██████░░░░ 58% |
| 🔴 UX / Mobile | ███░░░░░░░ 33% |
| 🟠 Accessibility | █████░░░░░ 50% |
| 🔴 SEO / Discovery | ████░░░░░░ 38% |
| 🟠 Reliability | █████░░░░░ 50% |
| 🔴 Trust / Privacy | ████░░░░░░ 39% |
| 🔴 Automation Potential | ███████░░░ 67% |

> **Slik leser du dette:** høyere = bedre, bortsett fra **Automation Potential**
> som viser uutnyttet automatiseringsverdi (høy = mer å hente, verdien Arch kan levere).
> Score er en evidensbasert vurdering, **ikke** en sertifisering. UNKNOWN telles som ikke-verifisert.

## Toppfunn (prioritert)

### 🔴 Kritisk — må håndteres først

- *(ingen funn i denne kategorien)*

### 🟠 Høy ROI — størst verdi per innsats

**Ødelagte interne lenker**
- **Problem:** Ødelagte interne lenker
- **Forretningsmessig betydning:** Ødelagte interne lenker fører besøkende til døde sider — tapte konverteringer og dårlig inntrykk.
- **Anbefalt løsning:** Fiks eller fjern ødelagte interne lenker.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Cache-headere**
- **Problem:** Cache-headere
- **Forretningsmessig betydning:** Ingen cache-headere — gjentatte besøk laster alt på nytt, noe som koster båndbredde og treghet for gjengangere.
- **Anbefalt løsning:** Sett cache-headere for statiske ressurser (bilder, CSS, JS).
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Header: csp**
- **Problem:** Header: csp
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Personvernerklæring-link**
- **Problem:** Personvernerklæring-link
- **Forretningsmessig betydning:** Manglende synlig personvern (cookie-banner, personvernerklæring, sporingsavsløring) svekker tillit — og kan være et regulatorisk signal som krever gjennomgang.
- **Anbefalt løsning:** Legg til cookie-samtykke, tydelig personvernerklæring og kartlegg sporingsskript.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Kontakt-/lead-skjema**
- **Problem:** Kontakt-/lead-skjema
- **Forretningsmessig betydning:** Ingen tydelig kontakt-/lead-mulighet observeres — interesserte besøkende har ingen enkel vei til å bli kunder.
- **Anbefalt løsning:** Legg til et tydelig kontaktskjema eller CTA med lav terskel.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Sikkerhetsheadere — gradering B**
- **Problem:** Sikkerhetsheadere — gradering B
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**SPF (avsender-verifisering)**
- **Problem:** SPF (avsender-verifisering)
- **Forretningsmessig betydning:** SPF mangler eller er svak (~all/+all) — hvem som helst kan sende e-post som om de er dere, noe som muliggjør phishing i deres navn mot kunder og ansatte.
- **Anbefalt løsning:** Publiser en streng SPF-record (v=spf1 … -all) som dekker alle legitime avsendere.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** ✅ ja

**DMARC for subdomene**
- **Problem:** DMARC for subdomene
- **Forretningsmessig betydning:** DMARC mangler eller står i overvåkningsmodus (p=none) — spoofede e-poster i deres navn blir ikke blokkert. Kun ~15 % av domener har full SPF+DKIM+DMARC.
- **Anbefalt løsning:** Innfør DMARC med p=quarantine→reject etter overvåkningsperiode.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Cookie-banner / samtykke-plattform (CMP)**
- **Problem:** Cookie-banner / samtykke-plattform (CMP)
- **Forretningsmessig betydning:** Manglende synlig personvern (cookie-banner, personvernerklæring, sporingsavsløring) svekker tillit — og kan være et regulatorisk signal som krever gjennomgang.
- **Anbefalt løsning:** Legg til cookie-samtykke, tydelig personvernerklæring og kartlegg sporingsskript.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Personvernerklæring**
- **Problem:** Personvernerklæring
- **Forretningsmessig betydning:** Manglende synlig personvern (cookie-banner, personvernerklæring, sporingsavsløring) svekker tillit — og kan være et regulatorisk signal som krever gjennomgang.
- **Anbefalt løsning:** Legg til cookie-samtykke, tydelig personvernerklæring og kartlegg sporingsskript.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Pris inkl. mva**
- **Problem:** Pris inkl. mva
- **Forretningsmessig betydning:** Manglende synlig personvern (cookie-banner, personvernerklæring, sporingsavsløring) svekker tillit — og kan være et regulatorisk signal som krever gjennomgang.
- **Anbefalt løsning:** Legg til cookie-samtykke, tydelig personvernerklæring og kartlegg sporingsskript.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Angrerett-informasjon**
- **Problem:** Angrerett-informasjon
- **Forretningsmessig betydning:** Manglende synlig personvern (cookie-banner, personvernerklæring, sporingsavsløring) svekker tillit — og kan være et regulatorisk signal som krever gjennomgang.
- **Anbefalt løsning:** Legg til cookie-samtykke, tydelig personvernerklæring og kartlegg sporingsskript.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Klageadgang / tvisteløsning**
- **Problem:** Klageadgang / tvisteløsning
- **Forretningsmessig betydning:** Manglende synlig personvern (cookie-banner, personvernerklæring, sporingsavsløring) svekker tillit — og kan være et regulatorisk signal som krever gjennomgang.
- **Anbefalt løsning:** Legg til cookie-samtykke, tydelig personvernerklæring og kartlegg sporingsskript.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

### 🟢 Quick win — gjør det denne uka

**Bilde-optimalisering**
- **Problem:** Bilde-optimalisering
- **Forretningsmessig betydning:** Bilder er ikke optimalisert (manglende dimensjoner/lazy-load) — tyngre sider, særlig på mobil, gir tregere opplevelse og dyrere data for kunden.
- **Anbefalt løsning:** Legg til width/height + loading="lazy" og komprimer/avgi bilder i riktig format.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Overskriftshierarki**
- **Problem:** Overskriftshierarki
- **Forretningsmessig betydning:** Overskriftsstrukturen er rotete (flere H1 eller nivå-hopp) — forvirrer både skjermlesere og søkemotorer.
- **Anbefalt løsning:** Bruk én H1 per side og logisk H1→H2→H3-rekkefølge.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Semantiske landemerker**
- **Problem:** Semantiske landemerker
- **Forretningsmessig betydning:** Siden mangler semantiske landemerker (header/nav/main/footer) — svakere tilgjengelighet og struktur for skjermlesere.
- **Anbefalt løsning:** Strukturer siden med semantiske HTML-elementer.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Meta-beskrivelse**
- **Problem:** Meta-beskrivelse
- **Forretningsmessig betydning:** Manglende meta-beskrivelse svekker klikkfrekvensen fra søkeresultatene.
- **Anbefalt løsning:** Legg til unike meta-beskrivelser.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Canonical**
- **Problem:** Canonical
- **Forretningsmessig betydning:** Manglende canonical-tagg kan gi duplikat-innhold og svekket rangering.
- **Anbefalt løsning:** Legg til canonical-URL på hver side.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Sitemap.xml**
- **Problem:** Sitemap.xml
- **Forretningsmessig betydning:** Manglende sitemap gjør det vanskeligere for søkemotorer å finne alle sidene.
- **Anbefalt løsning:** Generer og publiser sitemap.xml.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**OpenGraph**
- **Problem:** OpenGraph
- **Forretningsmessig betydning:** Manglende OpenGraph-data gir kjedelige delinger i sosiale medier og meldinger — lavere klikk ved deling.
- **Anbefalt løsning:** Legg til OpenGraph-tagger (tittel, beskrivelse, bilde).
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Versjons-avsløring**
- **Problem:** Versjons-avsløring
- **Forretningsmessig betydning:** Tjenesten avslører versjon/teknologi offentlig — gir angripere en snarvei til kjente sårbarheter.
- **Anbefalt løsning:** Skjul versjons-headere (Server, X-Powered-By) og rammeverk-signaturer.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**MTA-STS (håndhevet e-post-TLS)**
- **Problem:** MTA-STS (håndhevet e-post-TLS)
- **Forretningsmessig betydning:** MTA-STS/TLS-RPT mangler — e-post-TLS håndheves og rapporteres ikke, noe som åpner for nedgraderingsangrep mellom e-postservere.
- **Anbefalt løsning:** Publiser MTA-STS-policy og TLS-RPT-rapportering.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** ✅ ja

**TLS-RPT (TLS-rapportering)**
- **Problem:** TLS-RPT (TLS-rapportering)
- **Forretningsmessig betydning:** MTA-STS/TLS-RPT mangler — e-post-TLS håndheves og rapporteres ikke, noe som åpner for nedgraderingsangrep mellom e-postservere.
- **Anbefalt løsning:** Publiser MTA-STS-policy og TLS-RPT-rapportering.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** ✅ ja

**DNSSEC (signert sone)**
- **Problem:** DNSSEC (signert sone)
- **Forretningsmessig betydning:** CAA/DNSSEC mangler — hvem som helst med tilgang til en CA kan utstede sertifikater for domenet, og DNS-svar kan i prinsippet forfalskes.
- **Anbefalt løsning:** Legg til CAA-record og aktiver DNSSEC hos DNS-leverandøren.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

### 🔵 Strategisk — planlegg neste kvartal

**Strukturert data (JSON-LD)**
- **Problem:** Strukturert data (JSON-LD)
- **Forretningsmessig betydning:** Manglende strukturert data (JSON-LD) gir færre rike søkeresultater og lavere synlighet i nye søkeflater.
- **Anbefalt løsning:** Legg til JSON-LD strukturerte data (Organisasjon, WebSite, produkt/service).
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Automatiseringsmuligheter identifisert**
- **Problem:** Automatiseringsmuligheter identifisert
- **Forretningsmessig betydning:** Identifiserte manuelle arbeidsflyter (lead-ruting, kundestøtte, avtalebooking, dokumentflyt) kan automatiseres — frigjør tid og øker responshastighet.
- **Anbefalt løsning:** Automatiser de identifiserte arbeidsflytene (se Build Proposal).
- **Forventet innsats:** Betydelig (1–2 uker)
- **Build-kandidat:** ✅ ja

## Hva Arch kan forbedre (prioritert)

1. Bilde-optimalisering — Middels (1–3 dager)
2. Semantiske landemerker — Middels (1–3 dager)
3. Strukturert data (JSON-LD) — Middels (1–3 dager)
4. Header: csp — Middels (1–3 dager)
5. Personvernerklæring-link — Middels (1–3 dager)
6. Kontakt-/lead-skjema — Middels (1–3 dager)
7. Sikkerhetsheadere — gradering B — Middels (1–3 dager)
8. SPF (avsender-verifisering) — Lav (timer)

## Arch Build Proposal — utkast

> **Status:** automatisk utkast fra audit-funn — **ikke bindende**, krever kundegodkjenning.
> Arch implementerer **ingen** endringer i kundens system under audit-fasen.

### Foreslått scope

Følgende tiltak er identifisert som Arch Build-kandidater (fra godkjent audit):

| # | Tiltak | Innsats |
|---|---|---|
| 1 | SPF (avsender-verifisering) | Lav (timer) |
| 2 | MTA-STS (håndhevet e-post-TLS) | Lav (timer) |
| 3 | TLS-RPT (TLS-rapportering) | Lav (timer) |
| 4 | Bilde-optimalisering | Middels (1–3 dager) |
| 5 | Semantiske landemerker | Middels (1–3 dager) |
| 6 | Strukturert data (JSON-LD) | Middels (1–3 dager) |
| 7 | Header: csp | Middels (1–3 dager) |
| 8 | Personvernerklæring-link | Middels (1–3 dager) |
| 9 | Kontakt-/lead-skjema | Middels (1–3 dager) |
| 10 | Sikkerhetsheadere — gradering B | Middels (1–3 dager) |
| 11 | DMARC for subdomene | Middels (1–3 dager) |
| 12 | Cookie-banner / samtykke-plattform (CMP) | Middels (1–3 dager) |
| 13 | Personvernerklæring | Middels (1–3 dager) |
| 14 | Pris inkl. mva | Middels (1–3 dager) |
| 15 | Angrerett-informasjon | Middels (1–3 dager) |
| 16 | Klageadgang / tvisteløsning | Middels (1–3 dager) |
| 17 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~35.5 dager (vurdering, ikke løfte).

### Verdi for kunden

- Redusert risiko for nedetid, lekkasjer og feilleveranser.
- Færre manuelle steg — frigjør utviklertid.
- Forutsigbar kvalitetsport før hver deploy (test → smoke → rollback).

### Neste steg

1. Kundegjennomgang av dette utkastet.
2. Endelig Architecture Proposal med fastsatt scope, pris og akseptkriterier.
3. Godkjenning → Arch Build (separat fase, egen tilgang).

---

## Evidence Boundary — hva som IKKE ble inspisert

Fordi repository-/intern tilgang ikke ble gitt, er følgende **UNKNOWN** (ikke vurdert):

- Repository-sikkerhet, CI/CD, testdekning, intern secret-håndtering
- Database-arkitektur, interne rettigheter/roller, backend-logikk
- Ekte Core Web Vitals (LCP/CLS) uten browser-måling, dyp WCAG/konstrast-audit
- Juridisk/regulatorisk samsvar (GDPR m.fl.) — krever kvalifisert gjennomgang

---
_Arch Website Audit er en evidensbasert utenfor-inn vurdering, ikke en sertifisering. 
Ingen endringer ble gjort, ingen mutasjoner, ingen skjemainnsending, ingen login-bypass. 
Juridiske/regulatoriske påstander er ikke vurdert — kun signaler, som krever kvalifisert gjennomgang._



---

## Arch Audit v2 — utvidede undersøkelser


### Hva en hacker ser

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Sikkerhetsheadere — gradering B | Gradering B. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=2592000; includeSubDomains; preload; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: same-origin; Permissions-Policy: accelerometer=(),camera=(),clipboard-read=(),clipboard-write=(),geolocation=(),gyroscope=(… Trekk: CSP mangler · HSTS max-age < 6 mnd (2592000) |
| ✅ OK | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | 1 cookies — alle har HttpOnly, Secure og SameSite. |
| ✅ OK | Ingen versjonslekkasjer | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. |
| ⚠️ Ikke verifisert | TLS-sertifikat gyldighet | Kunne ikke hente sertifikatinfo (ingen PEM i s_client-output). |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ✅ OK | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: blocked · TLS 1.1: blocked |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | SPF (avsender-verifisering) | v=spf1 include:_spf.google.com include:mail.zendesk.com include:_spf.atlassian.net include:_spf.salesforce.com include:_spf.sparkpostmail.com ~all — ~all er svakt, spoofing mulig |
| ✅ OK | SPF: private IP-er i mekanismene | ingen private IP-er i SPF |
| ✅ OK | DKIM (e-post-signering) | selector: google |
| ✅ OK | DMARC (spoofing-beskyttelse) | p=quarantine (delvis) — v=DMARC1; p=quarantine; pct=100; sp=quarantine; rua=mailto:revolut@rua.netcraft.com,mailto:dmarc@revolut.com; ruf=mailto:revolut@ruf.netcraft.com,mailto:dmarc@revolut.com; |
| ❌ Funn | DMARC for subdomene | ingen _dmarc.www.revolut.com — subdomener kan spoofes |
| ❌ Funn | MTA-STS (håndhevet e-post-TLS) | ingen MTA-STS (TXT + policy-fil mangler) |
| ❌ Funn | TLS-RPT (TLS-rapportering) | ingen TLS-rapportering |
| ✅ OK | BIMI (merkevare-logo i innboks) | v=BIMI1;l=https://vmc.digicert.com/d769f6ee-8fe8-480e-8186-627e2dd908d9.svg;a=https://vmc.digicert.com/d769f6ee-8fe8-480e-8186-627e2dd908d9.pem |
| ✅ OK | CAA (sertifikat-utsteder-kontroll) | issuer: amazon.com, fnmt.es, digicert.com, visa.com, mastercard.com, pki.goog, sectigo.com, letsencrypt.org, e-szigno.hu, ssl.com, buypass.com |
| ❌ Funn | DNSSEC (signert sone) | manglende AD-flag — sonen er ikke DNSSEC-signert |
| ✅ OK | E-post-omdømme (DNSBL) | aspmx.l.google.com (172.253.148.27) ikke listet |
| ⚠️ Ikke verifisert | Subdomene-eksponering (crt.sh) | crt.sh-feil: The operation was aborted due to timeout |

| Protokoll | Observert |
|---|---|
| SPF | v=spf1 include:_spf.google.com include:mail.zendesk.com include:_spf.atlassian.net include:_spf.salesforce.com include:_spf.sparkpostmail.com ~all |
| DMARC | quarantine (p=quarantine) |
| DKIM | google |
| MTA-STS | TXT: nei · policy-fil: nei |
| BIMI | v=BIMI1;l=https://vmc.digicert.com/d769f6ee-8fe8-480e-8186-627e2dd908d9.svg;a=https://vmc.digicert.com/d769f6ee-8fe8-480e-8186-627e2dd908d9.pem |
| CAA | amazon.com, fnmt.es, digicert.com, visa.com, mastercard.com, pki.goog, sectigo.com, letsencrypt.org, e-szigno.hu, ssl.com, buypass.com |
| DNSSEC | ikke signert |
| DNSBL | aspmx.l.google.com ikke listet |
| Subdomener (crt.sh) | 0 observert |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Firma i Brreg (Enhetsregisteret) | ingen Brreg-treff |
| ⚠️ Ikke verifisert | Bransjekontekst (SSB) | ingen næringskode tilgjengelig |
| ➖ N/A | Domenet registrert (Norid) | utenlandsk domene — Norid ikke autoritativ |

**Norid (revolut.com):** .

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Arkivhistorikk finnes | arkivert siden 2004-04-07 |
| ✅ OK | Aktualitet (siste arkiverte versjon) | fanget i løpet av siste 12 mnd (2025-08-15) |
| ⚠️ Ikke verifisert | Arkivomfang | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) |

**Arkivomfang:** første arkiverte versjon 2004-04-07, siste 2025-08-15.

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Cookie-banner / samtykke-plattform (CMP) | ingen CMP/banner observert — potential concern, krever juridisk vurdering |
| ➖ N/A | Reelt valg (avvis-knapp) | ingen banner/CMP observert |
| ✅ OK | Forhåndsavkrysset samtykke | ingen forhåndsavkryssede samtykke-inputs observert |
| ❌ Funn | Personvernerklæring | ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering |
| ✅ OK | Tredjeparts-trackere | ingen kjente tredjeparts-trackere observert |
| ✅ OK | Google Fonts (ekstern) | ingen ekstern Google Fonts observert |
| ❌ Funn | Pris inkl. mva | pris inkl. mva ikke observert — potential concern (prisopplysningsforskriften), krever juridisk vurdering |
| ❌ Funn | Angrerett-informasjon | angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering |
| ❌ Funn | Klageadgang / tvisteløsning | klageadgang/tvisteløsning ikke observert — potential concern, krever juridisk vurdering |

**Viktig:** Disse punktene er maskinlesbare SIGNALER, ikke en juridisk vurdering. «Funn» betyr at noe mangler eller er observert — om det faktisk utgjør et problem krever juridisk vurdering.

### Fart (PageSpeed Insights + CrUX)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | PageSpeed mobil | API-feil: HTTP 429 |
| ⚠️ Ikke verifisert | PageSpeed desktop | API-feil: HTTP 429 |
| ⚠️ Ikke verifisert | PageSpeed API tilgjengelig | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig |

### Tilstedeværelse (sosiale medier · NAP)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Hjemmeside lesbar for tilstedeværelse-sjekk | kunne ikke hente HTML |

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | AI-innholdsanalyse | kunne ikke hente hjemmeside-HTML |

### AI-synlighet (GEO — hvordan AI-assistenter omtaler dere)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Synlighet i AI-svar | kunne ikke hente hjemmeside-HTML |

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._