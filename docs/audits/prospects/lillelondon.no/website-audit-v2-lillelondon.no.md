# Arch Website Audit — lillelondon.no

| | |
|---|---|
| Kunde | lillelondon.no |
| Nettsted | https://lillelondon.no |
| Audit-dato | 2026-08-15T00:57:31.833Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

## Executive Summary

lillelondon.no sin offentlige nettside scorer **51%** på Arch Website Score. Den største risikoen er: **Blandet innhold (http på https)**. **21 funn** bør prioriteres (1 kritisk, 20 høy ROI). Største mulighet: **50% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: konkret risiko som bør lukkes raskt, og målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 51%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🔴 Performance | ███░░░░░░░ 25% |
| 🔴 Security Surface | ███░░░░░░░ 30% |
| 🟠 UX / Mobile | █████░░░░░ 50% |
| 🟠 Accessibility | ████████░░ 75% |
| 🟢 SEO / Discovery | ██████████ 100% |
| 🟢 Reliability | █████████░ 86% |
| 🔴 Trust / Privacy | ████░░░░░░ 39% |
| 🟠 Automation Potential | █████░░░░░ 50% |

> **Slik leser du dette:** høyere = bedre, bortsett fra **Automation Potential**
> som viser uutnyttet automatiseringsverdi (høy = mer å hente, verdien Arch kan levere).
> Score er en evidensbasert vurdering, **ikke** en sertifisering. UNKNOWN telles som ikke-verifisert.

## Toppfunn (prioritert)

### 🔴 Kritisk — må håndteres først

**Blandet innhold (http på https)**
- **Problem:** Blandet innhold (http på https)
- **Forretningsmessig betydning:** Siden er kryptert, men laster noen ressurser over usikkert HTTP — nettleseren kan blokkere dem, noe som gir ødelagt innhold og svekker den sikre opplevelsen.
- **Anbefalt løsning:** Omskriv alle ressurser til HTTPS (eller relative URL-er).
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** ✅ ja

### 🟠 Høy ROI — størst verdi per innsats

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

**Header: hsts**
- **Problem:** Header: hsts
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

**Sikkerhetsheadere — gradering F**
- **Problem:** Sikkerhetsheadere — gradering F
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

**DMARC (spoofing-beskyttelse)**
- **Problem:** DMARC (spoofing-beskyttelse)
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

**Navn-konsistens (nettside ↔ Brreg)**
- **Problem:** Navn-konsistens (nettside ↔ Brreg)
- **Forretningsmessig betydning:** Opplysninger på nettsiden (navn, org.nr, hjemmeside) stemmer ikke med Brønnøysundregistrene — svekker tillit og kan skjule gamle opplysninger som ikke stemmer.
- **Anbefalt løsning:** Oppdater nettsiden så navn/org.nr/hjemmeside samsvarer med Brreg.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Posisjon i AI-svar**
- **Problem:** Posisjon i AI-svar
- **Forretningsmessig betydning:** Når AI-assistenter nevner bedriften, kommer den langt ned i svaret (eller bare i løpende tekst) — de fleste brukere velger det første de blir anbefalt.
- **Anbefalt løsning:** Optimaliser innhold og kilder så bedriften havner blant de 1-2 første anbefalingene AI-en gir.
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

**Versjons-avsløring**
- **Problem:** Versjons-avsløring
- **Forretningsmessig betydning:** Tjenesten avslører versjon/teknologi offentlig — gir angripere en snarvei til kjente sårbarheter.
- **Anbefalt løsning:** Skjul versjons-headere (Server, X-Powered-By) og rammeverk-signaturer.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Versjonslekkasje: server-header**
- **Problem:** Versjonslekkasje: server-header
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

**Versjonslekkasje: <meta name=generator>**
- **Problem:** Versjonslekkasje: <meta name=generator>
- **Forretningsmessig betydning:** Tjenesten avslører versjon/teknologi offentlig — gir angripere en snarvei til kjente sårbarheter.
- **Anbefalt løsning:** Skjul versjons-headere (Server, X-Powered-By) og rammeverk-signaturer.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**WordPress-signatur i generator**
- **Problem:** WordPress-signatur i generator
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

**Aktualitet (AI-vurdert)**
- **Problem:** Aktualitet (AI-vurdert)
- **Forretningsmessig betydning:** AI-gjennomgangen finner svakheter i innholdet (tone, aktualitet, tekstkvalitet) — innhold som ikke overbeviser koster konverteringer.
- **Anbefalt løsning:** Oppdater innholdet ut fra AI-funnene (se rapport-seksjonen).
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

1. Render-blokkerende ressurser — Lav (timer)
2. Bilde-optimalisering — Middels (1–3 dager)
3. Header: csp — Middels (1–3 dager)
4. Header: hsts — Middels (1–3 dager)
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
| 2 | Blandet innhold (http på https) | Lav (timer) |
| 3 | SPF (avsender-verifisering) | Lav (timer) |
| 4 | MTA-STS (håndhevet e-post-TLS) | Lav (timer) |
| 5 | TLS-RPT (TLS-rapportering) | Lav (timer) |
| 6 | Bilde-optimalisering | Middels (1–3 dager) |
| 7 | Header: csp | Middels (1–3 dager) |
| 8 | Header: hsts | Middels (1–3 dager) |
| 9 | Header: xcto | Middels (1–3 dager) |
| 10 | Header: referrer | Middels (1–3 dager) |
| 11 | Header: permissions | Middels (1–3 dager) |
| 12 | Header: frame | Middels (1–3 dager) |
| 13 | Personvernerklæring-link | Middels (1–3 dager) |
| 14 | Kontakt-/lead-skjema | Middels (1–3 dager) |
| 15 | Sikkerhetsheadere — gradering F | Middels (1–3 dager) |
| 16 | DMARC (spoofing-beskyttelse) | Middels (1–3 dager) |
| 17 | Cookie-banner / samtykke-plattform (CMP) | Middels (1–3 dager) |
| 18 | Personvernerklæring | Middels (1–3 dager) |
| 19 | Google Fonts (ekstern) | Middels (1–3 dager) |
| 20 | Pris inkl. mva | Middels (1–3 dager) |
| 21 | Angrerett-informasjon | Middels (1–3 dager) |
| 22 | Klageadgang / tvisteløsning | Middels (1–3 dager) |
| 23 | Aktualitet (AI-vurdert) | Middels (1–3 dager) |
| 24 | Synlighet i AI-svar | Middels (1–3 dager) |
| 25 | Posisjon i AI-svar | Middels (1–3 dager) |
| 26 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~50.5 dager (vurdering, ikke løfte).

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
| ❌ Funn | Sikkerhetsheadere — gradering F | Gradering F. Content-Security-Policy: MANGLER; Strict-Transport-Security: MANGLER; X-Frame-Options: MANGLER; X-Content-Type-Options: MANGLER; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · X-Content-Type-Options mangler nosniff · Referrer-Policy mangler · Permissions-Policy mangler |
| ✅ OK | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | Ingen cookies satt av serveren (0 set-cookie-headere). |
| ❌ Funn | Versjonslekkasje: server-header | server: Apache |
| ❌ Funn | Versjonslekkasje: x-powered-by-header | x-powered-by: PHP/8.2.33 |
| ❌ Funn | Versjonslekkasje: <meta name=generator> | generator: All in One SEO (AIOSEO) 5.0.0.1 |
| ❌ Funn | WordPress-signatur i generator | generator: WordPress 7.0.4 |
| ❌ Funn | Versjonslekkasje: <meta name=generator> | generator: Elementor 4.2.2; features: additional_custom_breakpoints; settings: css_print_method-external, google_font-enabled, font_display-auto |
| ❌ Funn | WordPress-signatur i generator | generator: Powered by Slider Revolution 6.5.19 - responsive, Mobile-Friendly Slider Plugin for WordPress with comfortable drag and drop interface. |
| ✅ OK | TLS-sertifikat gyldighet | notBefore=2026-06-25T04:37:41.000Z, notAfter=2026-09-23T04:37:40.000Z, issuer=C=US, O=Let's Encrypt, CN=YE2, SAN=lillelondon.no |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ✅ OK | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: blocked · TLS 1.1: blocked |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | SPF (avsender-verifisering) | ingen SPF |
| ⚠️ Ikke verifisert | DKIM (e-post-signering) | ingen av probede selektorer funnet (kan ikke konkludere fravær) |
| ❌ Funn | DMARC (spoofing-beskyttelse) | ingen DMARC |
| ❌ Funn | MTA-STS (håndhevet e-post-TLS) | ingen MTA-STS (TXT + policy-fil mangler) |
| ❌ Funn | TLS-RPT (TLS-rapportering) | ingen TLS-rapportering |
| ➖ N/A | BIMI (merkevare-logo i innboks) | ingen BIMI (ikke påkrevd) |
| ❌ Funn | CAA (sertifikat-utsteder-kontroll) | ingen CAA |
| ✅ OK | DNSSEC (signert sone) | AD-flag — signert sone validert |
| ✅ OK | E-post-omdømme (DNSBL) | mx2.mailpod1-osl1.g1i.uniweb.no (104.37.38.151) ikke listet |
| ✅ OK | Subdomene-eksponering (crt.sh) | 0 unike subdomener utover apex/www (sertifikatregistret crt.sh har kun hoveddomenet) |

| Protokoll | Observert |
|---|---|
| SPF | ikke registrert |
| DMARC | ikke registrert |
| MTA-STS | TXT: nei · policy-fil: nei |
| CAA | ingen CAA |
| DNSSEC | signert (AD-flag) |
| DNSBL | mx2.mailpod1-osl1.g1i.uniweb.no ikke listet |
| Subdomener (crt.sh) | 0 observert |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Firma i Brreg (Enhetsregisteret) | N kandidater for «Lille London - Engelsk Pub i Trondheim», ingen med Brreg-hjemmeside som matcher lillelondon.no — kan ikke entydig knytte firma til domene. Kandidater: LILLE LONDON AS (967852546) · KONRAD LONDON (927105470) · LONDON MARKETING (936702376) |
| ✅ OK | Bransjekontekst (SSB, næring 56) | SSB tabell 12817: Serveringsvirksomhet — 10 209 foretak (2024) |
| ✅ OK | Domenet registrert (Norid) | registrert 2000-07-12 |
| ✅ OK | Sist endret (Norid) | sist endret 2026-07-12 |
| ✅ OK | DNSSEC (Norid) | DNSSEC aktivert (delegationSigned=true) |
| ✅ OK | Registrar (Norid) | registrar: GROUP.ONE NORWAY AS |

**Brreg-enhet:** LILLE LONDON AS — org.nr 967852546 · Aksjeselskap · stiftet 1993-11-01 · næring: Drift av restauranter · 29 ansatte.

**Norid (lillelondon.no):** registrert 2000-07-12 · sist endret 2026-07-12 · registrar: GROUP.ONE NORWAY AS · DNSSEC: ja.

**Bransjekontekst (SSB):** SSB tabell 12817: Serveringsvirksomhet — 10 209 foretak (2024).

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Arkivhistorikk finnes | arkivert siden 2004-04-21 |
| ✅ OK | Aktualitet (siste arkiverte versjon) | fanget i løpet av siste 12 mnd (2025-09-10) |
| ⚠️ Ikke verifisert | Arkivomfang | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) |

**Arkivomfang:** første arkiverte versjon 2004-04-21, siste 2025-09-10.

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Cookie-banner / samtykke-plattform (CMP) | ingen CMP/banner observert — potential concern, krever juridisk vurdering |
| ➖ N/A | Reelt valg (avvis-knapp) | ingen banner/CMP observert |
| ✅ OK | Forhåndsavkrysset samtykke | ingen forhåndsavkryssede samtykke-inputs observert |
| ❌ Funn | Personvernerklæring | ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering |
| ✅ OK | Tredjeparts-trackere | ingen kjente tredjeparts-trackere observert |
| ❌ Funn | Google Fonts (ekstern) | ekstern Google Fonts observert (IP-data til Google) — signal, krever juridisk vurdering |
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
| ✅ OK | Sosiale medier (lenker fra nettsiden) | 1 profiler lenket — alle svarer (facebook: 400) |
| ❌ Funn | Telefon på nettsiden | ingen tel:-lenke observert — potential concern (kontaktbarhet) |
| ❌ Funn | E-post på nettsiden | ingen mailto:-lenke observert — potential concern (kontaktbarhet) |
| ❌ Funn | Navn-konsistens (nettside ↔ Brreg) | nettsidenavn «Lille London - Engelsk Pub i Trondheim» avviker fra Brreg-navn «LILLE LONDON AS» — signal |
| ⚠️ Ikke verifisert | Google Business Profile (anmeldelser, kategori) | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert |

**Sosiale profiler (lenket fra nettsiden):** facebook: 400.

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Innholdskvalitet (AI-vurdert) | Siden presenterer pubens tilbud med sportssendinger, live musikk og utleielokaler, men har tydelige tegn på manglende oppdatering, som copyright fra 2022 og gjentatt tekst. Språket er uformelt og henvendt til et bredt publikum, men inneholder flere skrivefeil og ufullstendige setninger som svekker helhetsinntrykket. |
| ❌ Funn | Aktualitet (AI-vurdert) | © Copyright Lille London 2022 · Ingen årstall-signaler funnet i teksten · Gjentakelse av setninger om Facebook-oppdateringer · Manglende mellomrom i 'Sportman’s club' og 'lokalet ha' |

**AI-vurdering (DeepSeek, deepseek-chat):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.

### AI-synlighet (GEO — hvordan AI-assistenter omtaler dere)

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Synlighet i AI-svar | 0/3 svar nevner Lille London - Engelsk Pub i Trondheim · sitat: «Lille London nevnes ikke i noen av svarene.» · prompter: «Hva er den beste puben i Trondheim for å se Premie…» / «Kan du anbefale et sted i Trondheim som har både l…» |
| ❌ Funn | Posisjon i AI-svar | ikke nevnt i noen av svarene |
| ✅ OK | Sentiment i AI-omtale | sentiment: nøytral · råd: Sørg for at Lille London blir nevnt i relevante AI-svar ved å optimalisere nettsiden og lokale lister med søkeord som 'pub', 'sport', 'live  |
| ⚠️ Ikke verifisert | Kilder AI-en siterer | ingen eksterne domener sitert |

**Målemetode (Peec.ai-modellen):** 3 kunderelevante spørsmål ble stilt til en AI-assistent (deepseek-chat). Spørsmålene er generert fra nettsidens eget innhold og ligger i evidence-filen.

**Stilte spørsmål:**
- Hva er den beste puben i Trondheim for å se Premier League og Champions League med mange storskjermer?
- Kan du anbefale et sted i Trondheim som har både live musikk i helgene og et godt utvalg av engelske retter på menyen?
- Hvilket lokale i Trondheim egner seg best for å leie til et privat selskap på 20-80 personer, med egen bar og mulighet for å spille egen musikk?

**Målinger per spørsmål:**
- «Hva er den beste puben i Trondheim for å se Premier League og Champion…» → ikke nevnt
- «Kan du anbefale et sted i Trondheim som har både live musikk i helgene…» → ikke nevnt
- «Hvilket lokale i Trondheim egner seg best for å leie til et privat sel…» → ikke nevnt


**Anbefaling (AI-vurdert):** Sørg for at Lille London blir nevnt i relevante AI-svar ved å optimalisere nettsiden og lokale lister med søkeord som 'pub', 'sport', 'live musikk' og 'privat selskap' i Trondheim.

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._
