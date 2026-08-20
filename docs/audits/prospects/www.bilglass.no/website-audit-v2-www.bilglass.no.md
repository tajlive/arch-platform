# Arch Website Audit — www.bilglass.no

| | |
|---|---|
| Kunde | www.bilglass.no |
| Nettsted | https://www.bilglass.no |
| Audit-dato | 2026-08-15T00:30:46.118Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

## Executive Summary

www.bilglass.no sin offentlige nettside scorer **58%** på Arch Website Score. Den største risikoen er: **Ødelagte interne lenker**. **18 funn** bør prioriteres (0 kritisk, 18 høy ROI). Største mulighet: **33% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 58%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🔴 Performance | ████░░░░░░ 38% |
| 🔴 Security Surface | ████░░░░░░ 41% |
| 🟠 UX / Mobile | ████████░░ 75% |
| 🟠 Accessibility | ██████░░░░ 60% |
| 🟢 SEO / Discovery | █████████░ 88% |
| 🟢 Reliability | █████████░ 86% |
| 🟠 Trust / Privacy | ██████░░░░ 57% |
| 🟠 Automation Potential | ███░░░░░░░ 33% |

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

**Skjemaetiketter**
- **Problem:** Skjemaetiketter
- **Forretningsmessig betydning:** Skjemafelt mangler etiketter — skjermlesere og mange brukere forstår ikke feltene, noe som senker konvertering og øker tilgjengelighetsrisiko.
- **Anbefalt løsning:** Koble alle input til <label> og legg til placeholder/aria om nødvendig.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** ✅ ja

**Header: csp**
- **Problem:** Header: csp
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Header: xcto**
- **Problem:** Header: xcto
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Header: referrer**
- **Problem:** Header: referrer
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Header: permissions**
- **Problem:** Header: permissions
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Header: frame**
- **Problem:** Header: frame
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Cookie-banner**
- **Problem:** Cookie-banner
- **Forretningsmessig betydning:** Manglende synlig personvern (cookie-banner, personvernerklæring, sporingsavsløring) svekker tillit — og kan være et regulatorisk signal som krever gjennomgang.
- **Anbefalt løsning:** Legg til cookie-samtykke, tydelig personvernerklæring og kartlegg sporingsskript.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Sikkerhetsheadere — gradering F**
- **Problem:** Sikkerhetsheadere — gradering F
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**DMARC (spoofing-beskyttelse)**
- **Problem:** DMARC (spoofing-beskyttelse)
- **Forretningsmessig betydning:** DMARC mangler eller står i overvåkningsmodus (p=none) — spoofede e-poster i deres navn blir ikke blokkert. Kun ~15 % av domener har full SPF+DKIM+DMARC.
- **Anbefalt løsning:** Innfør DMARC med p=quarantine→reject etter overvåkningsperiode.
- **Forventet innsats:** Middels (1–3 dager)
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

**Tredjeparts-trackere**
- **Problem:** Tredjeparts-trackere
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

**Posisjon i AI-svar**
- **Problem:** Posisjon i AI-svar
- **Forretningsmessig betydning:** Når AI-assistenter nevner bedriften, kommer den langt ned i svaret (eller bare i løpende tekst) — de fleste brukere velger det første de blir anbefalt.
- **Anbefalt løsning:** Optimaliser innhold og kilder så bedriften havner blant de 1-2 første anbefalingene AI-en gir.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Trackere observert uten synlig samtykke**
- **Problem:** Trackere observert uten synlig samtykke
- **Forretningsmessig betydning:** Manglende synlig personvern (cookie-banner, personvernerklæring, sporingsavsløring) svekker tillit — og kan være et regulatorisk signal som krever gjennomgang.
- **Anbefalt løsning:** Legg til cookie-samtykke, tydelig personvernerklæring og kartlegg sporingsskript.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

### 🟢 Quick win — gjør det denne uka

**Render-blokkerende ressurser**
- **Problem:** Render-blokkerende ressurser
- **Forretningsmessig betydning:** Skript blokkerer førstegangsrender — besøkende ser en blank side lenger, og mange gir opp før innholdet vises.
- **Anbefalt løsning:** Utsett/last inn skript asynkront og fjern ubrukte blokkere.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** ✅ ja

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

**Canonical**
- **Problem:** Canonical
- **Forretningsmessig betydning:** Manglende canonical-tagg kan gi duplikat-innhold og svekket rangering.
- **Anbefalt løsning:** Legg til canonical-URL på hver side.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Versjons-avsløring**
- **Problem:** Versjons-avsløring
- **Forretningsmessig betydning:** Tjenesten avslører versjon/teknologi offentlig — gir angripere en snarvei til kjente sårbarheter.
- **Anbefalt løsning:** Skjul versjons-headere (Server, X-Powered-By) og rammeverk-signaturer.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Versjonslekkasje: x-powered-by-header**
- **Problem:** Versjonslekkasje: x-powered-by-header
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

**CAA (sertifikat-utsteder-kontroll)**
- **Problem:** CAA (sertifikat-utsteder-kontroll)
- **Forretningsmessig betydning:** CAA/DNSSEC mangler — hvem som helst med tilgang til en CA kan utstede sertifikater for domenet, og DNS-svar kan i prinsippet forfalskes.
- **Anbefalt løsning:** Legg til CAA-record og aktiver DNSSEC hos DNS-leverandøren.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**DNSSEC (signert sone)**
- **Problem:** DNSSEC (signert sone)
- **Forretningsmessig betydning:** CAA/DNSSEC mangler — hvem som helst med tilgang til en CA kan utstede sertifikater for domenet, og DNS-svar kan i prinsippet forfalskes.
- **Anbefalt løsning:** Legg til CAA-record og aktiver DNSSEC hos DNS-leverandøren.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**DNSSEC (Norid)**
- **Problem:** DNSSEC (Norid)
- **Forretningsmessig betydning:** CAA/DNSSEC mangler — hvem som helst med tilgang til en CA kan utstede sertifikater for domenet, og DNS-svar kan i prinsippet forfalskes.
- **Anbefalt løsning:** Legg til CAA-record og aktiver DNSSEC hos DNS-leverandøren.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**E-post på nettsiden**
- **Problem:** E-post på nettsiden
- **Forretningsmessig betydning:** Kontaktinformasjon (telefon/e-post) er ikke lett å finne på nettsiden — interesserte kunder får ingen enkel vei til kontakt.
- **Anbefalt løsning:** Legg til tydelig telefon/e-post i header eller footer.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

### 🔵 Strategisk — planlegg neste kvartal

**Synlighet i AI-svar**
- **Problem:** Synlighet i AI-svar
- **Forretningsmessig betydning:** Bedriften blir ikke eller sjeldent nevnt når AI-assistenter (ChatGPT, Gemini, DeepSeek) anbefaler tjenester i deres kategori — synlighet i AI-søk er i ferd med å bli en hovedinngang til nye kunder.
- **Anbefalt løsning:** Bygg AI-synlighet: svar på kundespørsmål i innholdet, bli sitert i relevante kilder, og strukturer dataene slik at AI-assistenter lett kan trekke dere frem.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Automatiseringsmuligheter identifisert**
- **Problem:** Automatiseringsmuligheter identifisert
- **Forretningsmessig betydning:** Identifiserte manuelle arbeidsflyter (lead-ruting, kundestøtte, avtalebooking, dokumentflyt) kan automatiseres — frigjør tid og øker responshastighet.
- **Anbefalt løsning:** Automatiser de identifiserte arbeidsflytene (se Build Proposal).
- **Forventet innsats:** Betydelig (1–2 uker)
- **Build-kandidat:** ✅ ja

## Hva Arch kan forbedre (prioritert)

1. Render-blokkerende ressurser — Lav (timer)
2. Bilde-optimalisering — Middels (1–3 dager)
3. Skjemaetiketter — Lav (timer)
4. Header: csp — Middels (1–3 dager)
5. Header: xcto — Middels (1–3 dager)
6. Header: referrer — Middels (1–3 dager)
7. Header: permissions — Middels (1–3 dager)
8. Header: frame — Middels (1–3 dager)

## Arch Build Proposal — utkast

> **Status:** automatisk utkast fra audit-funn — **ikke bindende**, krever kundegodkjenning.
> Arch implementerer **ingen** endringer i kundens system under audit-fasen.

### Foreslått scope

Følgende tiltak er identifisert som Arch Build-kandidater (fra godkjent audit):

| # | Tiltak | Innsats |
|---|---|---|
| 1 | Render-blokkerende ressurser | Lav (timer) |
| 2 | Skjemaetiketter | Lav (timer) |
| 3 | MTA-STS (håndhevet e-post-TLS) | Lav (timer) |
| 4 | TLS-RPT (TLS-rapportering) | Lav (timer) |
| 5 | Bilde-optimalisering | Middels (1–3 dager) |
| 6 | Header: csp | Middels (1–3 dager) |
| 7 | Header: xcto | Middels (1–3 dager) |
| 8 | Header: referrer | Middels (1–3 dager) |
| 9 | Header: permissions | Middels (1–3 dager) |
| 10 | Header: frame | Middels (1–3 dager) |
| 11 | Cookie-banner | Middels (1–3 dager) |
| 12 | Sikkerhetsheadere — gradering F | Middels (1–3 dager) |
| 13 | DMARC (spoofing-beskyttelse) | Middels (1–3 dager) |
| 14 | DMARC for subdomene | Middels (1–3 dager) |
| 15 | Cookie-banner / samtykke-plattform (CMP) | Middels (1–3 dager) |
| 16 | Tredjeparts-trackere | Middels (1–3 dager) |
| 17 | Pris inkl. mva | Middels (1–3 dager) |
| 18 | Angrerett-informasjon | Middels (1–3 dager) |
| 19 | Klageadgang / tvisteløsning | Middels (1–3 dager) |
| 20 | Synlighet i AI-svar | Middels (1–3 dager) |
| 21 | Posisjon i AI-svar | Middels (1–3 dager) |
| 22 | Trackere observert uten synlig samtykke | Middels (1–3 dager) |
| 23 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~46 dager (vurdering, ikke løfte).

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
| ❌ Funn | Sikkerhetsheadere — gradering F | Gradering F. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=63072000; X-Frame-Options: MANGLER; X-Content-Type-Options: MANGLER; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS uten includeSubDomains · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · X-Content-Type-Options mangler nosniff · Referrer-Policy mangler · Permissions-Policy mangler |
| ✅ OK | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | Ingen cookies satt av serveren (0 set-cookie-headere). |
| ❌ Funn | Versjonslekkasje: x-powered-by-header | x-powered-by: Next.js |
| ✅ OK | TLS-sertifikat gyldighet | notBefore=2026-07-09T20:26:45.000Z, notAfter=2026-10-07T21:25:26.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=bilglass.no, *.bilglass.no |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ✅ OK | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: blocked · TLS 1.1: blocked |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | SPF (avsender-verifisering) | v=spf1 include:mail.eu1.inforcloudsuite.com include:spf.protection.outlook.com include:spf.eye-share.com include:167.89.93.88 include:193.69.152.146 -all |
| ✅ OK | SPF: private IP-er i mekanismene | ingen private IP-er i SPF |
| ⚠️ Ikke verifisert | DKIM (e-post-signering) | ingen av probede selektorer funnet (kan ikke konkludere fravær) |
| ❌ Funn | DMARC (spoofing-beskyttelse) | ingen DMARC |
| ❌ Funn | DMARC for subdomene | ingen _dmarc.www.bilglass.no — subdomener kan spoofes |
| ❌ Funn | MTA-STS (håndhevet e-post-TLS) | ingen MTA-STS (TXT + policy-fil mangler) |
| ❌ Funn | TLS-RPT (TLS-rapportering) | ingen TLS-rapportering |
| ➖ N/A | BIMI (merkevare-logo i innboks) | ingen BIMI (ikke påkrevd) |
| ❌ Funn | CAA (sertifikat-utsteder-kontroll) | ingen CAA |
| ❌ Funn | DNSSEC (signert sone) | manglende AD-flag — sonen er ikke DNSSEC-signert |
| ✅ OK | E-post-omdømme (DNSBL) | bilglass-no.mail.protection.outlook.com (52.101.73.16) ikke listet |
| ✅ OK | Subdomene-eksponering (crt.sh) | 15 subdomener — interessant: admin.bilglass.no, booking.test.bilglass.no, mail.bilglass.no |

| Protokoll | Observert |
|---|---|
| SPF | v=spf1 include:mail.eu1.inforcloudsuite.com include:spf.protection.outlook.com include:spf.eye-share.com include:167.89.93.88 include:193.69.152.146 -all |
| DMARC | ikke registrert |
| MTA-STS | TXT: nei · policy-fil: nei |
| CAA | ingen CAA |
| DNSSEC | ikke signert |
| DNSBL | bilglass-no.mail.protection.outlook.com ikke listet |
| Subdomener (crt.sh) | 15 observert — interessant: admin.bilglass.no, booking.test.bilglass.no, mail.bilglass.no |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Firma i Brreg (Enhetsregisteret) | N kandidater for «Riis Bilglass», ingen med Brreg-hjemmeside som matcher bilglass.no — kan ikke entydig knytte firma til domene. Kandidater: RIIS BILGLASS AS (979224907) · RIIS (920721427) · BILGLASS AS (995566559) |
| ✅ OK | Bransjekontekst (SSB, næring 95) | SSB tabell 12817: Reparasjon av varer til personlig bruk — 1 461 foretak (2024) |
| ✅ OK | Domenet registrert (Norid) | registrert 2012-08-06 |
| ✅ OK | Sist endret (Norid) | sist endret 2026-07-06 |
| ❌ Funn | DNSSEC (Norid) | DNSSEC ikke aktivert (delegationSigned=false) |
| ✅ OK | Registrar (Norid) | registrar: SIRCON NORGE AS |

**Brreg-enhet:** RIIS BILGLASS AS — org.nr 979224907 · Aksjeselskap · stiftet 1997-08-04 · næring: Formidlingstjenester tilknyttet reparasjon og vedlikehold av datamaskiner, husholdningsvarer og varer til personlig bruk, og motorvogner og motorsykler · 25 ansatte.

**Norid (bilglass.no):** registrert 2012-08-06 · sist endret 2026-07-06 · registrar: SIRCON NORGE AS · DNSSEC: nei.

**Bransjekontekst (SSB):** SSB tabell 12817: Reparasjon av varer til personlig bruk — 1 461 foretak (2024).

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Arkivhistorikk finnes | arkivert siden 2001-03-02 |
| ✅ OK | Aktualitet (siste arkiverte versjon) | siste snapshot 2026-07-16 |
| ✅ OK | Arkivomfang | 100 arkiverte versjoner (unike URL-nøkler, limit 100) |

**Arkivomfang:** første arkiverte versjon 2001-03-02, siste 2026-07-16 (100 arkiverte versjoner).

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Cookie-banner / samtykke-plattform (CMP) | ingen CMP/banner observert — potential concern, krever juridisk vurdering |
| ➖ N/A | Reelt valg (avvis-knapp) | ingen banner/CMP observert |
| ✅ OK | Forhåndsavkrysset samtykke | ingen forhåndsavkryssede samtykke-inputs observert |
| ✅ OK | Personvernerklæring | personvernerklæring lenket i footer |
| ❌ Funn | Tredjeparts-trackere | trackere observert (Google Tag Manager) — ingen synlig samtykke-gating observert — potential concern, krever juridisk vurdering |
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
| ✅ OK | Sosiale medier (lenker fra nettsiden) | 3 profiler lenket — alle svarer (instagram: 200 · facebook: 400 · linkedin: 200) |
| ✅ OK | Telefon på nettsiden | tel-lenke: 090 09 |
| ❌ Funn | E-post på nettsiden | ingen mailto:-lenke observert — potential concern (kontaktbarhet) |
| ✅ OK | Navn-konsistens (nettside ↔ Brreg) | «RIIS BILGLASS AS» (Brreg) samsvarer med nettsidenavn |
| ⚠️ Ikke verifisert | Google Business Profile (anmeldelser, kategori) | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert |

**Sosiale profiler (lenket fra nettsiden):** instagram: 200 · facebook: 400 · linkedin: 200.

**Kontakt på nettsiden:** telefon 090 09.

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Innholdskvalitet (AI-vurdert) | Nettstedet presenterer et bredt spekter av bilglass-tjenester og tydelig kontaktinformasjon, med fokus på rask og enkel bestilling via telefon. Innholdet er strukturert og profesjonelt, men mangler dybde og konkrete detaljer om priser eller garantier. Teksten er uten stavefeil og virker oppdatert, men gir lite informasjon om selskapets historie eller kvalitetsbevis utover sertifisering. |
| ✅ OK | Aktualitet (AI-vurdert) | ingen årstall eller datoer funnet · teksten er oppdatert med tjenester og kontaktinformasjon · ingen tegn på utdatert innhold |

**AI-vurdering (DeepSeek, deepseek-chat):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.

### AI-synlighet (GEO — hvordan AI-assistenter omtaler dere)

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Synlighet i AI-svar | 0/3 svar nevner Riis Bilglass · sitat: «Det er et par aktører som skiller seg ut.» · prompter: «Hvilket bilglassfirma bør jeg velge for rask og på…» / «Er det verdt å reparere en steinsprutskade fremfor…» |
| ❌ Funn | Posisjon i AI-svar | ikke nevnt i noen av svarene |
| ✅ OK | Sentiment i AI-omtale | sentiment: nøytral · råd: Sørg for at bedriftens åpningstider og tjenester (gratis lånebil, døgnvakt) er tydelig og konsistent beskrevet på nettsiden og i lokale søk. |
| ⚠️ Ikke verifisert | Kilder AI-en siterer | ingen eksterne domener sitert |

**Målemetode (Peec.ai-modellen):** 3 kunderelevante spørsmål ble stilt til en AI-assistent (deepseek-chat). Spørsmålene er generert fra nettsidens eget innhold og ligger i evidence-filen.

**Stilte spørsmål:**
- Hvilket bilglassfirma bør jeg velge for rask og pålitelig steinsprutreparasjon i Oslo-området, med gratis lånebil og åpent alle dager fra 07:00 til 24:00?
- Er det verdt å reparere en steinsprutskade fremfor å bytte hele frontruten, og hvilket firma anbefaler du for kostnadsfri reparasjon og kalibrering av frontruten?
- Hva er det beste alternativet for å fikse en sprukket frontrute før EU-kontroll, med mulighet for original rute og samarbeid med forsikringsselskaper?

**Målinger per spørsmål:**
- «Hvilket bilglassfirma bør jeg velge for rask og pålitelig steinsprutre…» → ikke nevnt
- «Er det verdt å reparere en steinsprutskade fremfor å bytte hele frontr…» → ikke nevnt
- «Hva er det beste alternativet for å fikse en sprukket frontrute før EU…» → ikke nevnt


**Anbefaling (AI-vurdert):** Sørg for at bedriftens åpningstider og tjenester (gratis lånebil, døgnvakt) er tydelig og konsistent beskrevet på nettsiden og i lokale søk.

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._
