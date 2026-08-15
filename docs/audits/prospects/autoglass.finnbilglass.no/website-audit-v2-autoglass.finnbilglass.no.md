# Arch Website Audit — autoglass.finnbilglass.no

| | |
|---|---|
| Kunde | autoglass.finnbilglass.no |
| Nettsted | https://autoglass.finnbilglass.no |
| Audit-dato | 2026-08-15T00:45:22.949Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

## Executive Summary

autoglass.finnbilglass.no sin offentlige nettside scorer **55%** på Arch Website Score. Den største risikoen er: **Header: csp**. **15 funn** bør prioriteres (0 kritisk, 15 høy ROI). Største mulighet: **83% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 55%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🟠 Performance | ██████░░░░ 57% |
| 🔴 Security Surface | ████░░░░░░ 44% |
| 🟠 UX / Mobile | ████████░░ 75% |
| 🔴 Accessibility | ███░░░░░░░ 33% |
| 🟢 SEO / Discovery | █████████░ 88% |
| 🟢 Reliability | ████████░░ 80% |
| 🔴 Trust / Privacy | ███░░░░░░░ 30% |
| 🔴 Automation Potential | ████████░░ 83% |

> **Slik leser du dette:** høyere = bedre, bortsett fra **Automation Potential**
> som viser uutnyttet automatiseringsverdi (høy = mer å hente, verdien Arch kan levere).
> Score er en evidensbasert vurdering, **ikke** en sertifisering. UNKNOWN telles som ikke-verifisert.

## Toppfunn (prioritert)

### 🔴 Kritisk — må håndteres først

- *(ingen funn i denne kategorien)*

### 🟠 Høy ROI — størst verdi per innsats

**Header: csp**
- **Problem:** Header: csp
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Header: hsts**
- **Problem:** Header: hsts
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

**Sikkerhetsheadere — gradering E**
- **Problem:** Sikkerhetsheadere — gradering E
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

**Google Fonts (ekstern)**
- **Problem:** Google Fonts (ekstern)
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

**Versjons-avsløring**
- **Problem:** Versjons-avsløring
- **Forretningsmessig betydning:** Tjenesten avslører versjon/teknologi offentlig — gir angripere en snarvei til kjente sårbarheter.
- **Anbefalt løsning:** Skjul versjons-headere (Server, X-Powered-By) og rammeverk-signaturer.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Call-to-action**
- **Problem:** Call-to-action
- **Forretningsmessig betydning:** Handlingsknapper (CTA) er svake eller uklare — besøkende vet ikke hva de skal gjøre videre.
- **Anbefalt løsning:** Gjør primær-CTA tydelig og konsekvent.
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

**Sosiale medier (lenker fra nettsiden)**
- **Problem:** Sosiale medier (lenker fra nettsiden)
- **Forretningsmessig betydning:** Sosiale medie-profiler mangler eller har døde lenker — tapt synlighet og troverdighet hos besøkende som sjekker tilstedeværelse.
- **Anbefalt løsning:** Lenk til aktive profiler og fjern/oppdater døde lenker.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Telefon på nettsiden**
- **Problem:** Telefon på nettsiden
- **Forretningsmessig betydning:** Kontaktinformasjon (telefon/e-post) er ikke lett å finne på nettsiden — interesserte kunder får ingen enkel vei til kontakt.
- **Anbefalt løsning:** Legg til tydelig telefon/e-post i header eller footer.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**E-post på nettsiden**
- **Problem:** E-post på nettsiden
- **Forretningsmessig betydning:** Kontaktinformasjon (telefon/e-post) er ikke lett å finne på nettsiden — interesserte kunder får ingen enkel vei til kontakt.
- **Anbefalt løsning:** Legg til tydelig telefon/e-post i header eller footer.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

### 🔵 Strategisk — planlegg neste kvartal

**Strukturert data (JSON-LD)**
- **Problem:** Strukturert data (JSON-LD)
- **Forretningsmessig betydning:** Manglende strukturert data (JSON-LD) gir færre rike søkeresultater og lavere synlighet i nye søkeflater.
- **Anbefalt løsning:** Legg til JSON-LD strukturerte data (Organisasjon, WebSite, produkt/service).
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

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

1. Semantiske landemerker — Middels (1–3 dager)
2. Strukturert data (JSON-LD) — Middels (1–3 dager)
3. Header: csp — Middels (1–3 dager)
4. Header: hsts — Middels (1–3 dager)
5. Header: permissions — Middels (1–3 dager)
6. Header: frame — Middels (1–3 dager)
7. Cookie-banner — Middels (1–3 dager)
8. Personvernerklæring-link — Middels (1–3 dager)

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
| 4 | Semantiske landemerker | Middels (1–3 dager) |
| 5 | Strukturert data (JSON-LD) | Middels (1–3 dager) |
| 6 | Header: csp | Middels (1–3 dager) |
| 7 | Header: hsts | Middels (1–3 dager) |
| 8 | Header: permissions | Middels (1–3 dager) |
| 9 | Header: frame | Middels (1–3 dager) |
| 10 | Cookie-banner | Middels (1–3 dager) |
| 11 | Personvernerklæring-link | Middels (1–3 dager) |
| 12 | Kontakt-/lead-skjema | Middels (1–3 dager) |
| 13 | Sikkerhetsheadere — gradering E | Middels (1–3 dager) |
| 14 | DMARC for subdomene | Middels (1–3 dager) |
| 15 | Cookie-banner / samtykke-plattform (CMP) | Middels (1–3 dager) |
| 16 | Personvernerklæring | Middels (1–3 dager) |
| 17 | Google Fonts (ekstern) | Middels (1–3 dager) |
| 18 | Synlighet i AI-svar | Middels (1–3 dager) |
| 19 | Posisjon i AI-svar | Middels (1–3 dager) |
| 20 | Trackere observert uten synlig samtykke | Middels (1–3 dager) |
| 21 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~43.5 dager (vurdering, ikke løfte).

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
| ❌ Funn | Sikkerhetsheadere — gradering E | Gradering E. Content-Security-Policy: MANGLER; Strict-Transport-Security: MANGLER; X-Frame-Options: MANGLER; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · Permissions-Policy mangler |
| ✅ OK | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | Ingen cookies satt av serveren (0 set-cookie-headere). |
| ✅ OK | Ingen versjonslekkasjer | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. |
| ✅ OK | TLS-sertifikat gyldighet | notBefore=2026-07-25T02:20:01.000Z, notAfter=2026-10-23T03:19:52.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=autoglass.finnbilglass.no |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ✅ OK | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: blocked · TLS 1.1: blocked |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | SPF (avsender-verifisering) | v=spf1 include:_spf.domeneshop.no ~all — ~all er svakt, spoofing mulig |
| ✅ OK | SPF: private IP-er i mekanismene | ingen private IP-er i SPF |
| ⚠️ Ikke verifisert | DKIM (e-post-signering) | ingen av probede selektorer funnet (kan ikke konkludere fravær) |
| ✅ OK | DMARC (spoofing-beskyttelse) | p=quarantine (delvis) — v=DMARC1; p=quarantine; rua=mailto:dmarc@domeneshop.no |
| ❌ Funn | DMARC for subdomene | ingen _dmarc.autoglass.finnbilglass.no — subdomener kan spoofes |
| ❌ Funn | MTA-STS (håndhevet e-post-TLS) | ingen MTA-STS (TXT + policy-fil mangler) |
| ❌ Funn | TLS-RPT (TLS-rapportering) | ingen TLS-rapportering |
| ➖ N/A | BIMI (merkevare-logo i innboks) | ingen BIMI (ikke påkrevd) |
| ❌ Funn | CAA (sertifikat-utsteder-kontroll) | ingen CAA |
| ❌ Funn | DNSSEC (signert sone) | manglende AD-flag — sonen er ikke DNSSEC-signert |
| ✅ OK | E-post-omdømme (DNSBL) | mx.domeneshop.no (194.63.252.28) ikke listet |
| ⚠️ Ikke verifisert | Subdomene-eksponering (crt.sh) | crt.sh-feil: The operation was aborted due to timeout |

| Protokoll | Observert |
|---|---|
| SPF | v=spf1 include:_spf.domeneshop.no ~all |
| DMARC | quarantine (p=quarantine) |
| MTA-STS | TXT: nei · policy-fil: nei |
| CAA | ingen CAA |
| DNSSEC | ikke signert |
| DNSBL | mx.domeneshop.no ikke listet |
| Subdomener (crt.sh) | 0 observert |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Firma i Brreg (Enhetsregisteret) | N kandidater for «Autoglass», ingen med Brreg-hjemmeside som matcher finnbilglass.no — kan ikke entydig knytte firma til domene. Kandidater: AUTOGLASS AS (968552732) · LARSEN AUTOGLASS (990447829) · BJÅLIDS AUTOGLASS AS (987814160) |
| ⚠️ Ikke verifisert | Bransjekontekst (SSB) | SSB-tabell ikke kartlagt for næring 46 |
| ✅ OK | Domenet registrert (Norid) | registrert 2026-05-24 |
| ✅ OK | Sist endret (Norid) | sist endret 2026-08-13 |
| ❌ Funn | DNSSEC (Norid) | DNSSEC ikke aktivert (delegationSigned=false) |
| ✅ OK | Registrar (Norid) | registrar: Domeneshop AS |

**Brreg-enhet:** AUTOGLASS AS — org.nr 968552732 · Aksjeselskap · stiftet 1994-01-17 · næring: Engroshandel med deler og utstyr for motorvogner · 7 ansatte.

**Norid (finnbilglass.no):** registrert 2026-05-24 · sist endret 2026-08-13 · registrar: Domeneshop AS · DNSSEC: nei.

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Arkivhistorikk finnes | ingen arkiverte versjoner funnet i Wayback for finnbilglass.no |

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Cookie-banner / samtykke-plattform (CMP) | ingen CMP/banner observert — potential concern, krever juridisk vurdering |
| ➖ N/A | Reelt valg (avvis-knapp) | ingen banner/CMP observert |
| ✅ OK | Forhåndsavkrysset samtykke | ingen forhåndsavkryssede samtykke-inputs observert |
| ❌ Funn | Personvernerklæring | ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering |
| ✅ OK | Tredjeparts-trackere | ingen kjente tredjeparts-trackere observert |
| ❌ Funn | Google Fonts (ekstern) | ekstern Google Fonts observert (IP-data til Google) — signal, krever juridisk vurdering |
| ➖ N/A | Pris inkl. mva | ingen e-handels-signaler observert (handlekurv/kjøp/pris) |
| ➖ N/A | Angrerett-informasjon | ingen e-handels-signaler observert (handlekurv/kjøp/pris) |
| ➖ N/A | Klageadgang / tvisteløsning | ingen e-handels-signaler observert (handlekurv/kjøp/pris) |

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
| ❌ Funn | Sosiale medier (lenker fra nettsiden) | ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet) |
| ❌ Funn | Telefon på nettsiden | ingen tel:-lenke observert — potential concern (kontaktbarhet) |
| ❌ Funn | E-post på nettsiden | ingen mailto:-lenke observert — potential concern (kontaktbarhet) |
| ✅ OK | Navn-konsistens (nettside ↔ Brreg) | «AUTOGLASS AS» (Brreg) samsvarer med nettsidenavn |
| ⚠️ Ikke verifisert | Google Business Profile (anmeldelser, kategori) | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert |

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Innholdskvalitet (AI-vurdert) | Nettsiden presenterer Autoglass AS som en B2B-grossist av bilglass, med konkrete tall på lagerbeholdning (133 000+ glass) og sortiment (27 000+ varianter). Innholdet er funksjonelt og uten feil, men svært begrenset i omfang, noe som gir lite informasjon om selskapets historikk, tjenester eller verdiøkende tilbud. Aktualiteten vurderes som frisk siden det ikke finnes utdaterte datoer eller årstall i teksten. |
| ✅ OK | Aktualitet (AI-vurdert) | Ingen årstall-signaler funnet i teksten · Ingen stavefeil eller ufullstendige setninger · Teksten er kort og informativ, men mangler dybde og kontekst |

**AI-vurdering (DeepSeek, deepseek-chat):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.

### AI-synlighet (GEO — hvordan AI-assistenter omtaler dere)

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Synlighet i AI-svar | 0/3 svar nevner Autoglass AS · sitat: «Autoglas Norge» · prompter: «Hvilken B2B-leverandør anbefaler du for bilglass m…» / «Hva er det beste alternativet for grossist av bilg…» |
| ❌ Funn | Posisjon i AI-svar | ikke nevnt i noen av svarene |
| ✅ OK | Sentiment i AI-omtale | sentiment: nøytral · råd: Sørg for å bli nevnt som en selvstendig aktør med eget lager og sortiment i AI-svar, ikke bare som partner til andre leverandører. |
| ✅ OK | Kilder AI-en siterer | eksterne domener i AI-svar: glassbutikken.no |

**Målemetode (Peec.ai-modellen):** 3 kunderelevante spørsmål ble stilt til en AI-assistent (deepseek-chat). Spørsmålene er generert fra nettsidens eget innhold og ligger i evidence-filen.

**Stilte spørsmål:**
- Hvilken B2B-leverandør anbefaler du for bilglass med stort lager og bredt varespekter i Norge?
- Hva er det beste alternativet for grossist av bilglass til verksteder og bilbransjen i 2026?
- Kan du anbefale en pålitelig leverandør av bilglass med over 100 000 varianter på lager for profesjonelle aktører?

**Målinger per spørsmål:**
- «Hvilken B2B-leverandør anbefaler du for bilglass med stort lager og br…» → ikke nevnt
- «Hva er det beste alternativet for grossist av bilglass til verksteder …» → ikke nevnt · kilder: glassbutikken.no
- «Kan du anbefale en pålitelig leverandør av bilglass med over 100 000 v…» → ikke nevnt


**Anbefaling (AI-vurdert):** Sørg for å bli nevnt som en selvstendig aktør med eget lager og sortiment i AI-svar, ikke bare som partner til andre leverandører.

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._