# Arch Website Audit — www.toma.no

| | |
|---|---|
| Kunde | www.toma.no |
| Nettsted | https://www.toma.no |
| Audit-dato | 2026-08-14T21:38:33.761Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

### Kunde & samtykke

| Felt | Verdi |
|---|---|
| Kunde | www.toma.no |
| Nettsted | https://www.toma.no |
| Modus | Intern prospect-vurdering |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert (ingen endringer) |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |
| Consent | Ikke innhentet (intern prospect-vurdering) |

> **Read-only / utenfor-inn:** Arch analyserer kun offentlig observerbar informasjon.
> Ingen login-bypass, ingen aggressive tester, ingen mutasjoner, ingen skjemainnsending.
> Interne systemer som ikke er observerbare, rapporteres som **UNKNOWN** — aldri som feil.

## Executive Summary

www.toma.no sin offentlige nettside scorer **64%** på Arch Website Score. Den største risikoen er: **Skjemaetiketter**. **13 funn** bør prioriteres (0 kritisk, 13 høy ROI). Største mulighet: **50% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 64%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🔴 Performance | ████░░░░░░ 38% |
| 🔴 Security Surface | ████░░░░░░ 43% |
| 🟠 UX / Mobile | ████████░░ 75% |
| 🟢 Accessibility | ████████░░ 80% |
| 🟢 SEO / Discovery | ██████████ 100% |
| 🟢 Reliability | █████████░ 86% |
| 🟠 Trust / Privacy | ███████░░░ 71% |
| 🟠 Automation Potential | █████░░░░░ 50% |

> **Slik leser du dette:** høyere = bedre, bortsett fra **Automation Potential**
> som viser uutnyttet automatiseringsverdi (høy = mer å hente, verdien Arch kan levere).
> Score er en evidensbasert vurdering, **ikke** en sertifisering. UNKNOWN telles som ikke-verifisert.

## Toppfunn (prioritert)

### 🔴 Kritisk — må håndteres først

- *(ingen funn i denne kategorien)*

### 🟠 Høy ROI — størst verdi per innsats

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

**Hjemmeside registrert i Brreg**
- **Problem:** Hjemmeside registrert i Brreg
- **Forretningsmessig betydning:** Opplysninger på nettsiden (navn, org.nr, hjemmeside) stemmer ikke med Brønnøysundregistrene — svekker tillit og kan skjule gamle opplysninger som ikke stemmer.
- **Anbefalt løsning:** Oppdater nettsiden så navn/org.nr/hjemmeside samsvarer med Brreg.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

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

**E-post på nettsiden**
- **Problem:** E-post på nettsiden
- **Forretningsmessig betydning:** Kontaktinformasjon (telefon/e-post) er ikke lett å finne på nettsiden — interesserte kunder får ingen enkel vei til kontakt.
- **Anbefalt løsning:** Legg til tydelig telefon/e-post i header eller footer.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

### 🔵 Strategisk — planlegg neste kvartal

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
5. Header: hsts — Middels (1–3 dager)
6. Header: xcto — Middels (1–3 dager)
7. Header: referrer — Middels (1–3 dager)
8. Header: permissions — Middels (1–3 dager)

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
| 7 | Header: hsts | Middels (1–3 dager) |
| 8 | Header: xcto | Middels (1–3 dager) |
| 9 | Header: referrer | Middels (1–3 dager) |
| 10 | Header: permissions | Middels (1–3 dager) |
| 11 | Header: frame | Middels (1–3 dager) |
| 12 | Sikkerhetsheadere — gradering F | Middels (1–3 dager) |
| 13 | DMARC (spoofing-beskyttelse) | Middels (1–3 dager) |
| 14 | DMARC for subdomene | Middels (1–3 dager) |
| 15 | Cookie-banner / samtykke-plattform (CMP) | Middels (1–3 dager) |
| 16 | Tredjeparts-trackere | Middels (1–3 dager) |
| 17 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~34 dager (vurdering, ikke løfte).

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
| ❌ Funn | Versjonslekkasje: server-header | server: BunnyCDN-NO1-830 |
| ✅ OK | TLS-sertifikat gyldighet | notBefore=2026-07-30T00:02:39.000Z, notAfter=2026-10-28T00:02:38.000Z, issuer=C=US, O=Let's Encrypt, CN=YR1, SAN=www.toma.no |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ✅ OK | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: blocked · TLS 1.1: blocked |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | SPF (avsender-verifisering) | v=spf1 include:spf.protection.outlook.com -all |
| ✅ OK | SPF: private IP-er i mekanismene | ingen private IP-er i SPF |
| ✅ OK | DKIM (e-post-signering) | selectorer: default, selector1 |
| ❌ Funn | DMARC (spoofing-beskyttelse) | p=none (kun overvåkning) — v=DMARC1; p=none |
| ❌ Funn | DMARC for subdomene | ingen _dmarc.www.toma.no — subdomener kan spoofes |
| ❌ Funn | MTA-STS (håndhevet e-post-TLS) | ingen MTA-STS (TXT + policy-fil mangler) |
| ❌ Funn | TLS-RPT (TLS-rapportering) | ingen TLS-rapportering |
| ➖ N/A | BIMI (merkevare-logo i innboks) | ingen BIMI (ikke påkrevd) |
| ❌ Funn | CAA (sertifikat-utsteder-kontroll) | ingen CAA |
| ✅ OK | DNSSEC (signert sone) | AD-flag — signert sone validert |
| ✅ OK | E-post-omdømme (DNSBL) | toma-no.mail.protection.outlook.com (52.101.73.12) ikke listet |
| ⚠️ Ikke verifisert | Subdomene-eksponering (crt.sh) | crt.sh-feil: HTTP 503 |

| Protokoll | Observert |
|---|---|
| SPF | v=spf1 include:spf.protection.outlook.com -all |
| DMARC | none (p=none) |
| DKIM | default, selector1 |
| MTA-STS | TXT: nei · policy-fil: nei |
| CAA | ingen CAA |
| DNSSEC | signert (AD-flag) |
| DNSBL | toma-no.mail.protection.outlook.com ikke listet |
| Subdomener (crt.sh) | 0 observert |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Organisasjonsnummer og navn | org 923327487 — TOMADESIGN TOMA KUNCE |
| ✅ OK | Organisasjonsform | Enkeltpersonforetak (ENK) |
| ✅ OK | Konkurs / under avvikling | ikke konkurs og ikke under avvikling |
| ✅ OK | Registrert i Merverdiavgiftsregisteret | ikke registrert i MVA |
| ✅ OK | Stiftelses- og registreringsdato | registrert i Enhetsregisteret 2019-09-04 |
| ✅ OK | Antall ansatte | antall ansatte ikke oppgitt |
| ✅ OK | Næringskode og beskrivelse | 96.990 — Andre personlige tjenester ikke nevnt annet sted |
| ❌ Funn | Hjemmeside registrert i Brreg | ingen hjemmeside registrert i Brreg for «TOMADESIGN TOMA KUNCE» |
| ✅ OK | Navn-konsistens (nettside vs Brreg) | «Toma» samsvarer med Brreg-navn «TOMADESIGN TOMA KUNCE» |
| ➖ N/A | Siste årsregnskap | ikke regnskapspliktig eller ikke innsendt årsregnskap |
| ⚠️ Ikke verifisert | Daglig leder / styreleder (Brreg) | ingen daglig leder i åpent roller-API (ENK har ofte 0 roller) |
| ✅ OK | Bransjekontekst (SSB, næring 96) | SSB tabell 12817: Annen personlig tjenesteyting — 16 771 foretak (2024) |
| ✅ OK | Domenet registrert (Norid) | registrert 2015-11-04 |
| ✅ OK | Sist endret (Norid) | sist endret 2025-10-07 |
| ✅ OK | DNSSEC (Norid) | DNSSEC aktivert (delegationSigned=true) |
| ✅ OK | Registrar (Norid) | registrar: Domeneshop AS |

**Brreg-enhet:** TOMADESIGN TOMA KUNCE — org.nr 923327487 · Enkeltpersonforetak · næring: Andre personlige tjenester ikke nevnt annet sted.

**Norid (toma.no):** registrert 2015-11-04 · sist endret 2025-10-07 · registrar: Domeneshop AS · DNSSEC: ja.

**Bransjekontekst (SSB):** SSB tabell 12817: Annen personlig tjenesteyting — 16 771 foretak (2024).

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Arkivhistorikk finnes | arkivert siden 2000-11-10 |
| ✅ OK | Aktualitet (siste arkiverte versjon) | siste snapshot 2025-09-15 |
| ⚠️ Ikke verifisert | Arkivomfang | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) |

**Arkivomfang:** første arkiverte versjon 2000-11-10, siste 2025-09-15.

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Cookie-banner / samtykke-plattform (CMP) | ingen CMP/banner observert — potential concern, krever juridisk vurdering |
| ➖ N/A | Reelt valg (avvis-knapp) | ingen banner/CMP observert |
| ✅ OK | Forhåndsavkrysset samtykke | ingen forhåndsavkryssede samtykke-inputs observert |
| ✅ OK | Personvernerklæring | personvernerklæring lenket i footer |
| ❌ Funn | Tredjeparts-trackere | trackere observert (Google Tag Manager) — ingen synlig samtykke-gating observert — potential concern, krever juridisk vurdering |
| ✅ OK | Google Fonts (ekstern) | ingen ekstern Google Fonts observert |
| ➖ N/A | Pris inkl. mva | ingen e-handels-signaler observert (handlekurv/kjøp/pris) |
| ➖ N/A | Angrerett-informasjon | ingen e-handels-signaler observert (handlekurv/kjøp/pris) |
| ➖ N/A | Klageadgang / tvisteløsning | ingen e-handels-signaler observert (handlekurv/kjøp/pris) |

**Viktig:** Disse punktene er maskinlesbare SIGNALER, ikke en juridisk vurdering. «Funn» betyr at noe mangler eller er observert — om det faktisk utgjør et problem krever juridisk vurdering.

### Fart (PageSpeed Insights + CrUX)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | PageSpeed mobil | API-feil: HTTP 403 |
| ⚠️ Ikke verifisert | PageSpeed desktop | API-feil: HTTP 403 |
| ⚠️ Ikke verifisert | PageSpeed API tilgjengelig | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig |

### Tilstedeværelse (sosiale medier · NAP)

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Sosiale medier (lenker fra nettsiden) | ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet) |
| ✅ OK | Telefon på nettsiden | tel-lenke: 09090 |
| ❌ Funn | E-post på nettsiden | ingen mailto:-lenke observert — potential concern (kontaktbarhet) |
| ✅ OK | Navn-konsistens (nettside ↔ Brreg) | «TOMADESIGN TOMA KUNCE» (Brreg) samsvarer med nettsidenavn |
| ⚠️ Ikke verifisert | Google Business Profile (anmeldelser, kategori) | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert |

**Kontakt på nettsiden:** telefon 09090.

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Innholdskvalitet (AI-vurdert) | Teksten presenterer Toma som en erfaren og familieeid FM-leverandør med bredt tjenestetilbud, og kommuniserer tydelig verdi som trygghet, effektivitet og personlig service. Innholdet er godt strukturert og profesjonelt skrevet, men mangler konkrete årstall eller datoer som kan bekrefte hvor oppdatert informasjonen er. Aktualiteten vurderes som middels på grunn av fravær av tidsmarkører, selv om referanser til oppkjøp og sertifiseringer indikerer nylig aktivitet. |
| ⚠️ Ikke verifisert | Aktualitet (AI-vurdert) | ingen årstall-signaler funnet i teksten · nevner oppkjøp av ISS som kan være tidsrelevant · refererer til ISO-sertifiseringer og bærekraftsrapportering |

**AI-vurdering (DeepSeek, deepseek-chat):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._