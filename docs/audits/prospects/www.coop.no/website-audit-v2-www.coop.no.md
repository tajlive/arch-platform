# Arch Website Audit — www.coop.no

| | |
|---|---|
| Kunde | www.coop.no |
| Nettsted | https://www.coop.no |
| Audit-dato | 2026-08-15T00:38:55.334Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

## Executive Summary

www.coop.no sin offentlige nettside scorer **62%** på Arch Website Score. Den største risikoen er: **Ressurs-feil (img/css/js)**. **12 funn** bør prioriteres (0 kritisk, 12 høy ROI). Største mulighet: **17% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 62%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🟠 Performance | ██████░░░░ 63% |
| 🟠 Security Surface | ██████░░░░ 59% |
| 🟠 UX / Mobile | █████░░░░░ 50% |
| 🟢 Accessibility | ████████░░ 80% |
| 🟠 SEO / Discovery | ██████░░░░ 63% |
| 🟠 Reliability | ███████░░░ 71% |
| 🟠 Trust / Privacy | █████░░░░░ 50% |
| 🟢 Automation Potential | ██░░░░░░░░ 17% |

> **Slik leser du dette:** høyere = bedre, bortsett fra **Automation Potential**
> som viser uutnyttet automatiseringsverdi (høy = mer å hente, verdien Arch kan levere).
> Score er en evidensbasert vurdering, **ikke** en sertifisering. UNKNOWN telles som ikke-verifisert.

## Toppfunn (prioritert)

### 🔴 Kritisk — må håndteres først

- *(ingen funn i denne kategorien)*

### 🟠 Høy ROI — størst verdi per innsats

**Ressurs-feil (img/css/js)**
- **Problem:** Ressurs-feil (img/css/js)
- **Forretningsmessig betydning:** Ressurser (bilder/stilark/skript) feiler å laste — deler av siden ser ødelagt ut for besøkende.
- **Anbefalt løsning:** Fiks ødelagte ressursreferanser.
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

**Header: frame**
- **Problem:** Header: frame
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
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

**CAA (sertifikat-utsteder-kontroll)**
- **Problem:** CAA (sertifikat-utsteder-kontroll)
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

1. Skjemaetiketter — Lav (timer)
2. Strukturert data (JSON-LD) — Middels (1–3 dager)
3. Header: csp — Middels (1–3 dager)
4. Header: frame — Middels (1–3 dager)
5. Sikkerhetsheadere — gradering B — Middels (1–3 dager)
6. SPF (avsender-verifisering) — Lav (timer)
7. DMARC for subdomene — Middels (1–3 dager)
8. MTA-STS (håndhevet e-post-TLS) — Lav (timer)

## Arch Build Proposal — utkast

> **Status:** automatisk utkast fra audit-funn — **ikke bindende**, krever kundegodkjenning.
> Arch implementerer **ingen** endringer i kundens system under audit-fasen.

### Foreslått scope

Følgende tiltak er identifisert som Arch Build-kandidater (fra godkjent audit):

| # | Tiltak | Innsats |
|---|---|---|
| 1 | Skjemaetiketter | Lav (timer) |
| 2 | SPF (avsender-verifisering) | Lav (timer) |
| 3 | MTA-STS (håndhevet e-post-TLS) | Lav (timer) |
| 4 | TLS-RPT (TLS-rapportering) | Lav (timer) |
| 5 | Strukturert data (JSON-LD) | Middels (1–3 dager) |
| 6 | Header: csp | Middels (1–3 dager) |
| 7 | Header: frame | Middels (1–3 dager) |
| 8 | Sikkerhetsheadere — gradering B | Middels (1–3 dager) |
| 9 | DMARC for subdomene | Middels (1–3 dager) |
| 10 | Cookie-banner / samtykke-plattform (CMP) | Middels (1–3 dager) |
| 11 | Pris inkl. mva | Middels (1–3 dager) |
| 12 | Angrerett-informasjon | Middels (1–3 dager) |
| 13 | Klageadgang / tvisteløsning | Middels (1–3 dager) |
| 14 | Synlighet i AI-svar | Middels (1–3 dager) |
| 15 | Posisjon i AI-svar | Middels (1–3 dager) |
| 16 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~32 dager (vurdering, ikke løfte).

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
| ❌ Funn | Sikkerhetsheadere — gradering B | Gradering B. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=31536000; includeSubDomains; X-Frame-Options: MANGLER; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: camera=(),microphone=(),usb=() Trekk: CSP mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) |
| ✅ OK | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | Ingen cookies satt av serveren (0 set-cookie-headere). |
| ✅ OK | Ingen versjonslekkasjer | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. |
| ✅ OK | TLS-sertifikat gyldighet | notBefore=2026-06-25T15:02:07.000Z, notAfter=2026-09-23T15:02:06.000Z, issuer=C=US, O=Let's Encrypt, CN=YE1, SAN=www.coop.no |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ✅ OK | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: blocked · TLS 1.1: blocked |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | SPF (avsender-verifisering) | v=spf1 include:_spf1.coop.no include:_spf2.coop.no include:_spf3.coop.no include:_spf4.coop.no include:spf.protection.outlook.com include:sendgrid.net include:spf.mandrillapp.com include:de._netblocks.mimecast.com ~all — ~all er svakt, spoofing mulig |
| ✅ OK | SPF: private IP-er i mekanismene | ingen private IP-er i SPF |
| ✅ OK | DKIM (e-post-signering) | selectorer: selector1, selector2 |
| ✅ OK | DMARC (spoofing-beskyttelse) | p=reject (blokk) — v=DMARC1;p=reject;sp=reject;pct=100;rua=mailto:636be9c98d@rua.easydmarc.eu,mailto:dmarc.postmaster@coop.no;ruf=mailto:636be9c98d@ruf.easydmarc.eu;ri=86400;fo=1 |
| ❌ Funn | DMARC for subdomene | ingen _dmarc.www.coop.no — subdomener kan spoofes |
| ❌ Funn | MTA-STS (håndhevet e-post-TLS) | ingen MTA-STS (TXT + policy-fil mangler) |
| ❌ Funn | TLS-RPT (TLS-rapportering) | ingen TLS-rapportering |
| ➖ N/A | BIMI (merkevare-logo i innboks) | ingen BIMI (ikke påkrevd) |
| ❌ Funn | CAA (sertifikat-utsteder-kontroll) | ingen CAA |
| ✅ OK | DNSSEC (signert sone) | AD-flag — signert sone validert |
| ✅ OK | E-post-omdømme (DNSBL) | coop-no.mail.protection.outlook.com (52.101.68.36) ikke listet |
| ⚠️ Ikke verifisert | Subdomene-eksponering (crt.sh) | crt.sh-feil: The operation was aborted due to timeout |

| Protokoll | Observert |
|---|---|
| SPF | v=spf1 include:_spf1.coop.no include:_spf2.coop.no include:_spf3.coop.no include:_spf4.coop.no include:spf.protection.outlook.com include:sendgrid.net include:spf.mandrillapp.com include:de._netblocks.mimecast.com ~all |
| DMARC | reject (p=reject) |
| DKIM | selector1, selector2 |
| MTA-STS | TXT: nei · policy-fil: nei |
| CAA | ingen CAA |
| DNSSEC | signert (AD-flag) |
| DNSBL | coop-no.mail.protection.outlook.com ikke listet |
| Subdomener (crt.sh) | 0 observert |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Firma i Brreg (Enhetsregisteret) | ingen Brreg-treff for «Coop litt ditt» |
| ⚠️ Ikke verifisert | Bransjekontekst (SSB) | ingen næringskode tilgjengelig |
| ✅ OK | Domenet registrert (Norid) | registrert 2017-11-20 |
| ✅ OK | Sist endret (Norid) | sist endret 2026-03-03 |
| ✅ OK | DNSSEC (Norid) | DNSSEC aktivert (delegationSigned=true) |
| ✅ OK | Registrar (Norid) | registrar: Corporation Service Company |

**Norid (coop.no):** registrert 2017-11-20 · sist endret 2026-03-03 · registrar: Corporation Service Company · DNSSEC: ja.

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Arkivhistorikk finnes | arkivert siden 1999-01-25 |
| ✅ OK | Aktualitet (siste arkiverte versjon) | fanget i løpet av siste 12 mnd (2025-08-22) |
| ⚠️ Ikke verifisert | Arkivomfang | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) |

**Arkivomfang:** første arkiverte versjon 1999-01-25, siste 2025-08-22.

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Cookie-banner / samtykke-plattform (CMP) | ingen CMP/banner observert — potential concern, krever juridisk vurdering |
| ➖ N/A | Reelt valg (avvis-knapp) | ingen banner/CMP observert |
| ✅ OK | Forhåndsavkrysset samtykke | ingen forhåndsavkryssede samtykke-inputs observert |
| ✅ OK | Personvernerklæring | personvernerklæring lenket i footer |
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
| ❌ Funn | Sosiale medier (lenker fra nettsiden) | ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet) |
| ❌ Funn | Telefon på nettsiden | ingen tel:-lenke observert — potential concern (kontaktbarhet) |
| ❌ Funn | E-post på nettsiden | ingen mailto:-lenke observert — potential concern (kontaktbarhet) |
| ⚠️ Ikke verifisert | Google Business Profile (anmeldelser, kategori) | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert |

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Innholdskvalitet (AI-vurdert) | Coop sin hjemmeside presenterer et bredt spekter av innhold, fra dagligvare- og byggevaretilbud til medlemsfordeler og inspirasjon. Teksten er godt strukturert og henvender seg tydelig til både nye og eksisterende medlemmer, med fokus på økonomiske fordeler og praktiske tips. Selv om teksten er informativ og relevant, er den preget av mange gjentakende visuelle elementer (representert med blokker) som ikke bidrar med tekstlig verdi. |
| ✅ OK | Aktualitet (AI-vurdert) | Ingen årstall-signaler funnet i teksten · Nevner 'ukens kundeavis' og 'denne uken' som indikerer ferskt innhold · Refererer til grillsesongen og matpakkesesongen som årstidsaktuelle temaer |

**AI-vurdering (DeepSeek, deepseek-chat):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.

### AI-synlighet (GEO — hvordan AI-assistenter omtaler dere)

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Synlighet i AI-svar | 0/3 svar nevner Coop litt ditt · sitat: «Coop har Norges største medlemsprogram (Coop Medlem). Du får bonus på alle dagligvarer (opptil 3 % på egenproduserte varer, og jevnlige medl» · prompter: «Hvilken dagligvarekjede i Norge gir best medlemsfo…» / «Hva er det beste stedet å handle både dagligvarer …» |
| ❌ Funn | Posisjon i AI-svar | ikke nevnt i noen av svarene |
| ✅ OK | Sentiment i AI-omtale | sentiment: positiv · råd: Fremhev Coop ByggMix og det samlede medlemsprogrammet tydeligere i AI-synlige kanaler for å styrke assosiasjonen mellom dagligvarer og bygge |
| ⚠️ Ikke verifisert | Kilder AI-en siterer | ingen eksterne domener sitert |

**Målemetode (Peec.ai-modellen):** 3 kunderelevante spørsmål ble stilt til en AI-assistent (deepseek-chat). Spørsmålene er generert fra nettsidens eget innhold og ligger i evidence-filen.

**Stilte spørsmål:**
- Hvilken dagligvarekjede i Norge gir best medlemsfordeler og kjøpeutbytte på dagligvarer i 2026?
- Hva er det beste stedet å handle både dagligvarer og byggevarer med gode medlemstilbud i Norge?
- Kan du anbefale en norsk butikkjede som har både ukentlige kundeaviser, oppskrifter og medlemsbonus for hverdagslige innkjøp?

**Målinger per spørsmål:**
- «Hvilken dagligvarekjede i Norge gir best medlemsfordeler og kjøpeutbyt…» → ikke nevnt
- «Hva er det beste stedet å handle både dagligvarer og byggevarer med go…» → ikke nevnt
- «Kan du anbefale en norsk butikkjede som har både ukentlige kundeaviser…» → ikke nevnt


**Anbefaling (AI-vurdert):** Fremhev Coop ByggMix og det samlede medlemsprogrammet tydeligere i AI-synlige kanaler for å styrke assosiasjonen mellom dagligvarer og byggevarer.

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._