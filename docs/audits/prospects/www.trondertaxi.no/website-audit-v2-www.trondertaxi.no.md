# Arch Website Audit — www.trondertaxi.no

| | |
|---|---|
| Kunde | www.trondertaxi.no |
| Nettsted | https://www.trondertaxi.no |
| Audit-dato | 2026-08-15T01:04:51.734Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

## Executive Summary

www.trondertaxi.no sin offentlige nettside scorer **63%** på Arch Website Score. Den største risikoen er: **Ødelagte interne lenker**. **10 funn** bør prioriteres (0 kritisk, 10 høy ROI). Største mulighet: **17% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 63%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🔴 Performance | ████░░░░░░ 38% |
| 🟠 Security Surface | ██████░░░░ 57% |
| 🟠 UX / Mobile | ████████░░ 75% |
| 🟠 Accessibility | ████████░░ 75% |
| 🟢 SEO / Discovery | █████████░ 88% |
| 🟠 Reliability | ████████░░ 75% |
| 🟠 Trust / Privacy | ██████░░░░ 61% |
| 🟢 Automation Potential | ██░░░░░░░░ 17% |

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

**Kontakt-/lead-skjema**
- **Problem:** Kontakt-/lead-skjema
- **Forretningsmessig betydning:** Ingen tydelig kontakt-/lead-mulighet observeres — interesserte besøkende har ingen enkel vei til å bli kunder.
- **Anbefalt løsning:** Legg til et tydelig kontaktskjema eller CTA med lav terskel.
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

**Reelt valg (avvis-knapp)**
- **Problem:** Reelt valg (avvis-knapp)
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

**Versjonslekkasje: server-header**
- **Problem:** Versjonslekkasje: server-header
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
3. Kontakt-/lead-skjema — Middels (1–3 dager)
4. DMARC (spoofing-beskyttelse) — Middels (1–3 dager)
5. DMARC for subdomene — Middels (1–3 dager)
6. MTA-STS (håndhevet e-post-TLS) — Lav (timer)
7. TLS-RPT (TLS-rapportering) — Lav (timer)
8. Reelt valg (avvis-knapp) — Middels (1–3 dager)

## Arch Build Proposal — utkast

> **Status:** automatisk utkast fra audit-funn — **ikke bindende**, krever kundegodkjenning.
> Arch implementerer **ingen** endringer i kundens system under audit-fasen.

### Foreslått scope

Følgende tiltak er identifisert som Arch Build-kandidater (fra godkjent audit):

| # | Tiltak | Innsats |
|---|---|---|
| 1 | Render-blokkerende ressurser | Lav (timer) |
| 2 | MTA-STS (håndhevet e-post-TLS) | Lav (timer) |
| 3 | TLS-RPT (TLS-rapportering) | Lav (timer) |
| 4 | Bilde-optimalisering | Middels (1–3 dager) |
| 5 | Kontakt-/lead-skjema | Middels (1–3 dager) |
| 6 | DMARC (spoofing-beskyttelse) | Middels (1–3 dager) |
| 7 | DMARC for subdomene | Middels (1–3 dager) |
| 8 | Reelt valg (avvis-knapp) | Middels (1–3 dager) |
| 9 | Tredjeparts-trackere | Middels (1–3 dager) |
| 10 | Pris inkl. mva | Middels (1–3 dager) |
| 11 | Angrerett-informasjon | Middels (1–3 dager) |
| 12 | Klageadgang / tvisteløsning | Middels (1–3 dager) |
| 13 | Synlighet i AI-svar | Middels (1–3 dager) |
| 14 | Posisjon i AI-svar | Middels (1–3 dager) |
| 15 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~31.5 dager (vurdering, ikke løfte).

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
| ✅ OK | Sikkerhetsheadere — gradering A+ | Gradering A+. Content-Security-Policy: base-uri 'self'; form-action 'self' https:; frame-ancestors 'self'; object-src 'none'; upg…; Strict-Transport-Security: max-age=31536000; includeSubDomains; X-Frame-Options: MANGLER; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), m… Ingen trekk. |
| ✅ OK | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | Ingen cookies satt av serveren (0 set-cookie-headere). |
| ❌ Funn | Versjonslekkasje: server-header | server: nginx |
| ❌ Funn | Versjonslekkasje: <meta name=generator> | generator: Site Kit by Google 1.184.0 |
| ✅ OK | TLS-sertifikat gyldighet | notBefore=2026-08-04T16:44:20.000Z, notAfter=2026-11-02T16:44:19.000Z, issuer=C=US, O=Let's Encrypt, CN=YE2, SAN=07373.no, trondertaxi.no, www.07373.no, www.trondertaxi.no, www.xn--trndertaxi-1cb.no, xn--trndertaxi-1cb.no |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ✅ OK | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: blocked · TLS 1.1: blocked |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | SPF (avsender-verifisering) | v=spf1 include:spf.protection.outlook.com include:_spf.isp.as2116.net -all |
| ✅ OK | SPF: private IP-er i mekanismene | ingen private IP-er i SPF |
| ✅ OK | DKIM (e-post-signering) | selector: selector1 |
| ❌ Funn | DMARC (spoofing-beskyttelse) | p=none (kun overvåkning) — v=DMARC1; p=none; rua=mailto:dmarc@trondertaxi.no; ruf=mailto:dmarc@trondertaxi.no; sp=none; aspf=s; |
| ❌ Funn | DMARC for subdomene | ingen _dmarc.www.trondertaxi.no — subdomener kan spoofes |
| ❌ Funn | MTA-STS (håndhevet e-post-TLS) | ingen MTA-STS (TXT + policy-fil mangler) |
| ❌ Funn | TLS-RPT (TLS-rapportering) | ingen TLS-rapportering |
| ➖ N/A | BIMI (merkevare-logo i innboks) | ingen BIMI (ikke påkrevd) |
| ❌ Funn | CAA (sertifikat-utsteder-kontroll) | ingen CAA |
| ❌ Funn | DNSSEC (signert sone) | manglende AD-flag — sonen er ikke DNSSEC-signert |
| ✅ OK | E-post-omdømme (DNSBL) | trondertaxi-no.mail.protection.outlook.com (52.101.68.3) ikke listet |
| ⚠️ Ikke verifisert | Subdomene-eksponering (crt.sh) | crt.sh-feil: The operation was aborted due to timeout |

| Protokoll | Observert |
|---|---|
| SPF | v=spf1 include:spf.protection.outlook.com include:_spf.isp.as2116.net -all |
| DMARC | none (p=none) |
| DKIM | selector1 |
| MTA-STS | TXT: nei · policy-fil: nei |
| CAA | ingen CAA |
| DNSSEC | ikke signert |
| DNSBL | trondertaxi-no.mail.protection.outlook.com ikke listet |
| Subdomener (crt.sh) | 0 observert |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Firma i Brreg (Enhetsregisteret) | ingen Brreg-treff for «Trønder Taxi AS», «Trønder Taxi AS» |
| ⚠️ Ikke verifisert | Bransjekontekst (SSB) | ingen næringskode tilgjengelig |
| ✅ OK | Domenet registrert (Norid) | registrert 1999-11-14 |
| ✅ OK | Sist endret (Norid) | sist endret 2025-11-15 |
| ❌ Funn | DNSSEC (Norid) | DNSSEC ikke aktivert (delegationSigned=false) |
| ✅ OK | Registrar (Norid) | registrar: Firmanett Norden AB |

**Norid (trondertaxi.no):** registrert 1999-11-14 · sist endret 2025-11-15 · registrar: Firmanett Norden AB · DNSSEC: nei.

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Arkivhistorikk finnes | arkivert siden 2000-09-15 |
| ✅ OK | Aktualitet (siste arkiverte versjon) | fanget i løpet av siste 12 mnd (2025-08-23) |
| ⚠️ Ikke verifisert | Arkivomfang | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) |

**Arkivomfang:** første arkiverte versjon 2000-09-15, siste 2025-08-23.

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Cookie-banner / samtykke-plattform (CMP) | CMP observert: Cookiebot |
| ❌ Funn | Reelt valg (avvis-knapp) | banner/CMP observert, men ingen «avvis»/reject-alternativ observert — ekomloven § 3-15 krever reelt valg — potential concern, krever juridisk vurdering |
| ✅ OK | Forhåndsavkrysset samtykke | ingen forhåndsavkryssede samtykke-inputs observert |
| ✅ OK | Personvernerklæring | personvernerklæring lenket i footer |
| ❌ Funn | Tredjeparts-trackere | trackere observert (Google Tag Manager, Google gtag.js) — CMP/banner observert separat — potential concern, krever juridisk vurdering |
| ✅ OK | Google Fonts (ekstern) | Google Fonts self-hosted observert (/fonts/-stier) |
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
| ✅ OK | Sosiale medier (lenker fra nettsiden) | 3 profiler lenket — alle svarer (tiktok: 200 · facebook: 400 · instagram: 200) |
| ✅ OK | Telefon på nettsiden | tel-lenke: 07373 |
| ✅ OK | E-post på nettsiden | mailto: salg@trondertaxi.no |
| ⚠️ Ikke verifisert | Google Business Profile (anmeldelser, kategori) | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert |

**Sosiale profiler (lenket fra nettsiden):** tiktok: 200 · facebook: 400 · instagram: 200.

**Kontakt på nettsiden:** telefon 07373 · e-post salg@trondertaxi.no.

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Innholdskvalitet (AI-vurdert) | Nettsiden formidler et tydelig kundeløfte om trygghet og pålitelighet, med fokus på sikkerhet i førersetet og enkel bestilling via app. Innholdet er oversiktlig og dekker tjenester, kampanjer og kontaktinformasjon, men mangler konkrete årstall eller oppdateringsdatoer. Teksten er profesjonell og henvender seg godt til både privat- og bedriftskunder. |
| ✅ OK | Aktualitet (AI-vurdert) | Ingen årstall-signaler funnet i teksten · Ingen ©-år eller datoer som indikerer utdatert innhold · Nevner 116 år på veiene, noe som er et historisk faktum, ikke en dato |

**AI-vurdering (DeepSeek, deepseek-chat):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.

### AI-synlighet (GEO — hvordan AI-assistenter omtaler dere)

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Synlighet i AI-svar | 0/3 svar nevner Trønder Taxi AS · sitat: «TrønderTaxi er et solid valg i 2026 for akkurat de behovene du nevner» · prompter: «Hvilket taxiselskap i Trondheim anbefaler du for t…» / «Hva er det beste alternativet for en bedrift som t…» |
| ❌ Funn | Posisjon i AI-svar | ikke nevnt i noen av svarene |
| ✅ OK | Sentiment i AI-omtale | sentiment: positiv · råd: Sørg for å tydelig kommunisere deres lange historie og ISO-sertifiseringer i digitale kanaler for å styrke posisjonen mot konkurrenter som N |
| ⚠️ Ikke verifisert | Kilder AI-en siterer | ingen eksterne domener sitert |

**Målemetode (Peec.ai-modellen):** 3 kunderelevante spørsmål ble stilt til en AI-assistent (deepseek-chat). Spørsmålene er generert fra nettsidens eget innhold og ligger i evidence-filen.

**Stilte spørsmål:**
- Hvilket taxiselskap i Trondheim anbefaler du for trygg og pålitelig transport til og fra Værnes flyplass, med mulighet for app-betaling og fastpris?
- Hva er det beste alternativet for en bedrift som trenger en kvalitetssikret og sikker taxitjeneste i Trondheim, med over 100 års erfaring og mange sjåfører?
- Er TrønderTaxi et godt valg i 2026 for en kunde som ønsker enkel bestilling via app, gavekort og rabatter på lokale arrangementer som Lerkendal-kamper?

**Målinger per spørsmål:**
- «Hvilket taxiselskap i Trondheim anbefaler du for trygg og pålitelig tr…» → ikke nevnt
- «Hva er det beste alternativet for en bedrift som trenger en kvalitetss…» → ikke nevnt
- «Er TrønderTaxi et godt valg i 2026 for en kunde som ønsker enkel besti…» → ikke nevnt


**Anbefaling (AI-vurdert):** Sørg for å tydelig kommunisere deres lange historie og ISO-sertifiseringer i digitale kanaler for å styrke posisjonen mot konkurrenter som NorgesTaxi.

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._