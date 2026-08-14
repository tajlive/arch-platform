# Arch Website Audit — klarpakke.no

| | |
|---|---|
| Kunde | klarpakke.no |
| Nettsted | https://klarpakke.no |
| Audit-dato | 2026-08-14T21:37:41.237Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

### Kunde & samtykke

| Felt | Verdi |
|---|---|
| Kunde | klarpakke.no |
| Nettsted | https://klarpakke.no |
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

klarpakke.no sin offentlige nettside scorer **66%** på Arch Website Score. Den største risikoen er: **Kontakt-/lead-skjema**. **5 funn** bør prioriteres (0 kritisk, 5 høy ROI). Største mulighet: **33% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 66%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🔴 Performance | ████░░░░░░ 38% |
| 🟠 Security Surface | █████░░░░░ 54% |
| 🟠 UX / Mobile | ████████░░ 75% |
| 🟠 Accessibility | ████████░░ 75% |
| 🟢 SEO / Discovery | ██████████ 100% |
| 🟢 Reliability | ████████░░ 83% |
| 🟠 Trust / Privacy | ██████░░░░ 61% |
| 🟠 Automation Potential | ███░░░░░░░ 33% |

> **Slik leser du dette:** høyere = bedre, bortsett fra **Automation Potential**
> som viser uutnyttet automatiseringsverdi (høy = mer å hente, verdien Arch kan levere).
> Score er en evidensbasert vurdering, **ikke** en sertifisering. UNKNOWN telles som ikke-verifisert.

## Toppfunn (prioritert)

### 🔴 Kritisk — må håndteres først

- *(ingen funn i denne kategorien)*

### 🟠 Høy ROI — størst verdi per innsats

**Kontakt-/lead-skjema**
- **Problem:** Kontakt-/lead-skjema
- **Forretningsmessig betydning:** Ingen tydelig kontakt-/lead-mulighet observeres — interesserte besøkende har ingen enkel vei til å bli kunder.
- **Anbefalt løsning:** Legg til et tydelig kontaktskjema eller CTA med lav terskel.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Cookie-sikkerhet (HttpOnly/Secure/SameSite)**
- **Problem:** Cookie-sikkerhet (HttpOnly/Secure/SameSite)
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

**Angrerett-informasjon**
- **Problem:** Angrerett-informasjon
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
4. Cookie-sikkerhet (HttpOnly/Secure/SameSite) — Middels (1–3 dager)
5. SPF (avsender-verifisering) — Lav (timer)
6. DMARC (spoofing-beskyttelse) — Middels (1–3 dager)
7. MTA-STS (håndhevet e-post-TLS) — Lav (timer)
8. TLS-RPT (TLS-rapportering) — Lav (timer)

## Arch Build Proposal — utkast

> **Status:** automatisk utkast fra audit-funn — **ikke bindende**, krever kundegodkjenning.
> Arch implementerer **ingen** endringer i kundens system under audit-fasen.

### Foreslått scope

Følgende tiltak er identifisert som Arch Build-kandidater (fra godkjent audit):

| # | Tiltak | Innsats |
|---|---|---|
| 1 | Render-blokkerende ressurser | Lav (timer) |
| 2 | SPF (avsender-verifisering) | Lav (timer) |
| 3 | MTA-STS (håndhevet e-post-TLS) | Lav (timer) |
| 4 | TLS-RPT (TLS-rapportering) | Lav (timer) |
| 5 | Bilde-optimalisering | Middels (1–3 dager) |
| 6 | Kontakt-/lead-skjema | Middels (1–3 dager) |
| 7 | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | Middels (1–3 dager) |
| 8 | DMARC (spoofing-beskyttelse) | Middels (1–3 dager) |
| 9 | Angrerett-informasjon | Middels (1–3 dager) |
| 10 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~20 dager (vurdering, ikke løfte).

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
| ✅ OK | Sikkerhetsheadere — gradering A | Gradering A. Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://pskhryjzkobytnfwucrb.supabas…; Strict-Transport-Security: max-age=63072000; includeSubDomains; preload; X-Frame-Options: DENY; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(… Trekk: CSP svak (unsafe-inline/unsafe-eval) |
| ❌ Funn | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | 1 cookies observert. Mangler HttpOnly: NEXT_LOCALE. Mangler Secure: NEXT_LOCALE. Mangler SameSite: alle har SameSite. (Cookie-navn + flagg kun — verdier aldri lagret/vist.) |
| ✅ OK | Ingen versjonslekkasjer | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. |
| ✅ OK | TLS-sertifikat gyldighet | notBefore=2026-07-28T08:21:14.000Z, notAfter=2026-10-26T09:20:56.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=klarpakke.no, *.klarpakke.no |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ✅ OK | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: blocked · TLS 1.1: blocked |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | SPF (avsender-verifisering) | v=spf1 include:_spf.domeneshop.no include:_spf.google.com include:spf.resend.com ~all — ~all er svakt, spoofing mulig |
| ✅ OK | SPF: private IP-er i mekanismene | ingen private IP-er i SPF |
| ⚠️ Ikke verifisert | DKIM (e-post-signering) | ingen av probede selektorer funnet (kan ikke konkludere fravær) |
| ❌ Funn | DMARC (spoofing-beskyttelse) | p=none (kun overvåkning) — v=DMARC1; p=none; rua=mailto:dmarc@klarpakke.no; ruf=mailto:dmarc@klarpakke.no; fo=1; adkim=s; aspf=s |
| ❌ Funn | MTA-STS (håndhevet e-post-TLS) | ingen MTA-STS (TXT + policy-fil mangler) |
| ❌ Funn | TLS-RPT (TLS-rapportering) | ingen TLS-rapportering |
| ➖ N/A | BIMI (merkevare-logo i innboks) | ingen BIMI (ikke påkrevd) |
| ❌ Funn | CAA (sertifikat-utsteder-kontroll) | ingen CAA |
| ❌ Funn | DNSSEC (signert sone) | manglende AD-flag — sonen er ikke DNSSEC-signert |
| ✅ OK | E-post-omdømme (DNSBL) | mx.domeneshop.no (194.63.252.29) ikke listet |
| ⚠️ Ikke verifisert | Subdomene-eksponering (crt.sh) | ingen data i crt.sh |

| Protokoll | Observert |
|---|---|
| SPF | v=spf1 include:_spf.domeneshop.no include:_spf.google.com include:spf.resend.com ~all |
| DMARC | none (p=none) |
| MTA-STS | TXT: nei · policy-fil: nei |
| CAA | ingen CAA |
| DNSSEC | signert (AD-flag) |
| DNSBL | mx.domeneshop.no ikke listet |
| Subdomener (crt.sh) | 0 observert |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Firma i Brreg (Enhetsregisteret) | ingen Brreg-treff for «Klarpakke» |
| ⚠️ Ikke verifisert | Bransjekontekst (SSB) | ingen næringskode tilgjengelig |
| ✅ OK | Domenet registrert (Norid) | registrert 2025-08-30 |
| ✅ OK | Sist endret (Norid) | sist endret 2026-02-01 |
| ❌ Funn | DNSSEC (Norid) | DNSSEC ikke aktivert (delegationSigned=false) |
| ✅ OK | Registrar (Norid) | registrar: Domeneshop AS |

**Norid (klarpakke.no):** registrert 2025-08-30 · sist endret 2026-02-01 · registrar: Domeneshop AS · DNSSEC: nei.

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Arkivhistorikk finnes | ingen arkiverte versjoner funnet i Wayback for klarpakke.no |

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Cookie-banner / samtykke-plattform (CMP) | generisk cookie/samtykke-banner observert (norsk tekst: cookie/informasjonskapsler + samtykke/godta/aksepter) |
| ✅ OK | Reelt valg (avvis-knapp) | avvis/avslå/reject-alternativ observert («avvis») |
| ✅ OK | Forhåndsavkrysset samtykke | ingen forhåndsavkryssede samtykke-inputs observert |
| ✅ OK | Personvernerklæring | personvernerklæring lenket i footer |
| ✅ OK | Tredjeparts-trackere | ingen kjente tredjeparts-trackere observert |
| ✅ OK | Google Fonts (ekstern) | ingen ekstern Google Fonts observert |
| ✅ OK | Pris inkl. mva | pris inkl. mva-tekst observert |
| ❌ Funn | Angrerett-informasjon | angrerett-informasjon ikke observert — potential concern (angrerettloven), krever juridisk vurdering |
| ✅ OK | Klageadgang / tvisteløsning | klageadgang/tvisteløsning observert |

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
| ❌ Funn | Telefon på nettsiden | ingen tel:-lenke observert — potential concern (kontaktbarhet) |
| ❌ Funn | E-post på nettsiden | ingen mailto:-lenke observert — potential concern (kontaktbarhet) |
| ⚠️ Ikke verifisert | Google Business Profile (anmeldelser, kategori) | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert |

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Innholdskvalitet (AI-vurdert) | Klarpakke posisjonerer seg som en transparent og risikofri inngang til kryptotrading for det norske markedet, med vekt på dokumentasjon og ærlighet om risiko. Siden tilbyr en gratis beta med lekepenger, AI-veiledning på norsk og backtest-resultater som viser både tap og gevinster, noe som bygger tillit. Budskapet er klart og pedagogisk, med tydelige løfter om hva de aldri vil gjøre, og en konkret oppfordring til handling for de første 100 registrerte. |
| ✅ OK | Aktualitet (AI-vurdert) | Gratis beta kun i Norge · 100 000 kr i lekepenger · AI-pilot som forklarer på norsk · Backtest-bevis med gebyr inkludert · Ingen kredittkort, KYC eller binding · Norsk plattform · 5000 KLT-tokens til de 100 første · 90 dager med ekte data · Historisk avkastning er ingen garanti for fremtidig avkastning · De 100 første får gratis tilgang for alltid |

**AI-vurdering (DeepSeek, deepseek-chat):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._