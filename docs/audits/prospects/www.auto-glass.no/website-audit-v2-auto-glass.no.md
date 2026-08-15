# Arch Website Audit — auto-glass.no

| | |
|---|---|
| Kunde | auto-glass.no |
| Nettsted | https://auto-glass.no |
| Audit-dato | 2026-08-15T00:45:35.058Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

## Executive Summary

auto-glass.no sin offentlige nettside scorer **55%** på Arch Website Score. Den største risikoen er: **Blandet innhold (http på https)**. **13 funn** bør prioriteres (1 kritisk, 12 høy ROI). Største mulighet: **50% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: konkret risiko som bør lukkes raskt, og målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 55%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🔴 Performance | ████░░░░░░ 38% |
| 🔴 Security Surface | █████░░░░░ 48% |
| 🟠 UX / Mobile | █████░░░░░ 50% |
| 🟠 Accessibility | ██████░░░░ 60% |
| 🟠 SEO / Discovery | ██████░░░░ 63% |
| 🟢 Reliability | █████████░ 86% |
| 🟠 Trust / Privacy | ███████░░░ 66% |
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

**Header: permissions**
- **Problem:** Header: permissions
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Sikkerhetsheadere — gradering C**
- **Problem:** Sikkerhetsheadere — gradering C
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

**Cookie-banner / samtykke-plattform (CMP)**
- **Problem:** Cookie-banner / samtykke-plattform (CMP)
- **Forretningsmessig betydning:** Manglende synlig personvern (cookie-banner, personvernerklæring, sporingsavsløring) svekker tillit — og kan være et regulatorisk signal som krever gjennomgang.
- **Anbefalt løsning:** Legg til cookie-samtykke, tydelig personvernerklæring og kartlegg sporingsskript.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Forhåndsavkrysset samtykke**
- **Problem:** Forhåndsavkrysset samtykke
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

**Meta-beskrivelse**
- **Problem:** Meta-beskrivelse
- **Forretningsmessig betydning:** Manglende meta-beskrivelse svekker klikkfrekvensen fra søkeresultatene.
- **Anbefalt løsning:** Legg til unike meta-beskrivelser.
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

**Versjonslekkasje: server-header**
- **Problem:** Versjonslekkasje: server-header
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
5. Header: permissions — Middels (1–3 dager)
6. Blandet innhold (http på https) — Lav (timer)
7. Sikkerhetsheadere — gradering C — Middels (1–3 dager)
8. DMARC (spoofing-beskyttelse) — Middels (1–3 dager)

## Arch Build Proposal — utkast

> **Status:** automatisk utkast fra audit-funn — **ikke bindende**, krever kundegodkjenning.
> Arch implementerer **ingen** endringer i kundens system under audit-fasen.

### Foreslått scope

Følgende tiltak er identifisert som Arch Build-kandidater (fra godkjent audit):

| # | Tiltak | Innsats |
|---|---|---|
| 1 | Render-blokkerende ressurser | Lav (timer) |
| 2 | Skjemaetiketter | Lav (timer) |
| 3 | Blandet innhold (http på https) | Lav (timer) |
| 4 | MTA-STS (håndhevet e-post-TLS) | Lav (timer) |
| 5 | TLS-RPT (TLS-rapportering) | Lav (timer) |
| 6 | Bilde-optimalisering | Middels (1–3 dager) |
| 7 | Header: csp | Middels (1–3 dager) |
| 8 | Header: permissions | Middels (1–3 dager) |
| 9 | Sikkerhetsheadere — gradering C | Middels (1–3 dager) |
| 10 | DMARC (spoofing-beskyttelse) | Middels (1–3 dager) |
| 11 | Cookie-banner / samtykke-plattform (CMP) | Middels (1–3 dager) |
| 12 | Forhåndsavkrysset samtykke | Middels (1–3 dager) |
| 13 | Tredjeparts-trackere | Middels (1–3 dager) |
| 14 | Pris inkl. mva | Middels (1–3 dager) |
| 15 | Angrerett-informasjon | Middels (1–3 dager) |
| 16 | Klageadgang / tvisteløsning | Middels (1–3 dager) |
| 17 | Posisjon i AI-svar | Middels (1–3 dager) |
| 18 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~34.5 dager (vurdering, ikke løfte).

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
| ❌ Funn | Sikkerhetsheadere — gradering C | Gradering C. Content-Security-Policy: MANGLER; Strict-Transport-Security: max-age=31536000; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS uten includeSubDomains · Permissions-Policy mangler |
| ✅ OK | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | Ingen cookies satt av serveren (0 set-cookie-headere). |
| ❌ Funn | Versjonslekkasje: server-header | server: Prometheus |
| ❌ Funn | WordPress-signatur i generator | generator: WordPress 4.9.31 |
| ❌ Funn | Versjonslekkasje: <meta name=generator> | generator: WooCommerce 3.4.8 |
| ✅ OK | TLS-sertifikat gyldighet | notBefore=2026-07-25T05:32:34.000Z, notAfter=2026-10-23T05:32:33.000Z, issuer=C=US, O=Let's Encrypt, CN=YR2, SAN=auto-glass.no, www.auto-glass.no |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ✅ OK | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: blocked · TLS 1.1: blocked |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | SPF (avsender-verifisering) | v=spf1 include:spf.protection.outlook.com -all |
| ✅ OK | SPF: private IP-er i mekanismene | ingen private IP-er i SPF |
| ⚠️ Ikke verifisert | DKIM (e-post-signering) | ingen av probede selektorer funnet (kan ikke konkludere fravær) |
| ❌ Funn | DMARC (spoofing-beskyttelse) | p=none (kun overvåkning) — v=DMARC1; p=none |
| ❌ Funn | MTA-STS (håndhevet e-post-TLS) | ingen MTA-STS (TXT + policy-fil mangler) |
| ❌ Funn | TLS-RPT (TLS-rapportering) | ingen TLS-rapportering |
| ➖ N/A | BIMI (merkevare-logo i innboks) | ingen BIMI (ikke påkrevd) |
| ❌ Funn | CAA (sertifikat-utsteder-kontroll) | ingen CAA |
| ✅ OK | DNSSEC (signert sone) | AD-flag — signert sone validert |
| ✅ OK | E-post-omdømme (DNSBL) | autoglass-no01b.mail.protection.outlook.com (52.101.73.12) ikke listet |
| ⚠️ Ikke verifisert | Subdomene-eksponering (crt.sh) | crt.sh-feil: The operation was aborted due to timeout |

| Protokoll | Observert |
|---|---|
| SPF | v=spf1 include:spf.protection.outlook.com -all |
| DMARC | none (p=none) |
| MTA-STS | TXT: nei · policy-fil: nei |
| CAA | ingen CAA |
| DNSSEC | signert (AD-flag) |
| DNSBL | autoglass-no01b.mail.protection.outlook.com ikke listet |
| Subdomener (crt.sh) | 0 observert |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Organisasjonsnummer og navn | org 968552732 — AUTOGLASS AS |
| ✅ OK | Organisasjonsform | Aksjeselskap (AS) |
| ✅ OK | Konkurs / under avvikling | ikke konkurs og ikke under avvikling |
| ✅ OK | Registrert i Merverdiavgiftsregisteret | registrert i MVA |
| ✅ OK | Stiftelses- og registreringsdato | stiftet 1994-01-17 · registrert i Enhetsregisteret 1995-02-20 |
| ✅ OK | Antall ansatte | 7 ansatte |
| ✅ OK | Næringskode og beskrivelse | 46.720 — Engroshandel med deler og utstyr for motorvogner |
| ✅ OK | Hjemmeside-konsistens (Brreg vs domene) | Brreg-hjemmeside «www.auto-glass.no» samsvarer med auditert domene auto-glass.no |
| ✅ OK | Navn-konsistens (nettside vs Brreg) | «Autoglass» samsvarer med Brreg-navn «AUTOGLASS AS» |
| ✅ OK | Siste årsregnskap | regnskap 2025: driftsinntekter 22 450 842 kr, resultat −1 164 896 kr |
| ✅ OK | Daglig leder / styreleder (Brreg) | daglig leder: Truls Opdal · styreleder: Eduard Eikeland |
| ⚠️ Ikke verifisert | Bransjekontekst (SSB) | SSB-tabell ikke kartlagt for næring 46 |
| ✅ OK | Domenet registrert (Norid) | registrert 1999-11-14 |
| ✅ OK | Sist endret (Norid) | sist endret 2025-11-16 |
| ✅ OK | DNSSEC (Norid) | DNSSEC aktivert (delegationSigned=true) |
| ✅ OK | Registrar (Norid) | registrar: Domeneshop AS |

**Brreg-enhet:** AUTOGLASS AS — org.nr 968552732 · Aksjeselskap · stiftet 1994-01-17 · næring: Engroshandel med deler og utstyr for motorvogner · 7 ansatte.

**Norid (auto-glass.no):** registrert 1999-11-14 · sist endret 2025-11-16 · registrar: Domeneshop AS · DNSSEC: ja.

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Arkivhistorikk finnes | arkivert siden 2004-12-07 |
| ✅ OK | Aktualitet (siste arkiverte versjon) | fanget i løpet av siste 12 mnd (2025-09-15) |
| ⚠️ Ikke verifisert | Arkivomfang | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) |

**Arkivomfang:** første arkiverte versjon 2004-12-07, siste 2025-09-15.

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Cookie-banner / samtykke-plattform (CMP) | ingen CMP/banner observert — potential concern, krever juridisk vurdering |
| ➖ N/A | Reelt valg (avvis-knapp) | ingen banner/CMP observert |
| ❌ Funn | Forhåndsavkrysset samtykke | forhåndsavkrysset samtykke-input observert (type=checkbox) — potential concern, krever juridisk vurdering |
| ✅ OK | Personvernerklæring | personvernerklæring lenket i footer |
| ❌ Funn | Tredjeparts-trackere | trackere observert (Google Tag Manager, Facebook Pixel) — ingen synlig samtykke-gating observert — potential concern, krever juridisk vurdering |
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
| ✅ OK | E-post på nettsiden | mailto: post@auto-glass.no |
| ✅ OK | Navn-konsistens (nettside ↔ Brreg) | «AUTOGLASS AS» (Brreg) samsvarer med nettsidenavn |
| ⚠️ Ikke verifisert | Google Business Profile (anmeldelser, kategori) | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert |

**Kontakt på nettsiden:** e-post post@auto-glass.no.

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Innholdskvalitet (AI-vurdert) | Nettsiden til Autoglass AS presenterer selskapet som en leverandør av bilglass med stort lager og eksport til Skandinavia og Europa. Innholdet er faglig og informativt, men mangler oppdaterte årstall og meta-beskrivelse. Teksten er godt strukturert med tydelig fokus på kvalitet og sikkerhet, men kunne vært mer brukervennlig for potensielle kunder. |
| ⚠️ Ikke verifisert | Aktualitet (AI-vurdert) | Ingen årstall eller datoer funnet i teksten · Manglende meta-beskrivelse · Teksten inneholder mye teknisk informasjon om frontrute-benevninger · Tilstedeværelse av cookie- og personverninformasjon tyder på oppdatert nettside |

**AI-vurdering (DeepSeek, deepseek-chat):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.

### AI-synlighet (GEO — hvordan AI-assistenter omtaler dere)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Synlighet i AI-svar | 1/3 svar nevner Autoglass · sitat: «Autoglass / Autoglass AS / auto-glass.no nevnes ikke i noen av svarene.» · prompter: «Hvilket firma bør jeg velge for å skifte frontrute…» / «Hvor kan jeg få tak i et sjeldent bilglass til en …» |
| ❌ Funn | Posisjon i AI-svar | beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar |
| ✅ OK | Sentiment i AI-omtale | sentiment: nøytral · råd: Sørg for å bli nevnt i AI-svar ved å styrke tilstedeværelsen i relevante kataloger og innhold som dekker bilglassbytte og ADAS-kalibrering. |
| ✅ OK | Kilder AI-en siterer | eksterne domener i AI-svar: ebay.co |

**Målemetode (Peec.ai-modellen):** 3 kunderelevante spørsmål ble stilt til en AI-assistent (deepseek-chat). Spørsmålene er generert fra nettsidens eget innhold og ligger i evidence-filen.

**Stilte spørsmål:**
- Hvilket firma bør jeg velge for å skifte frontrute på en bil med regnsensor og kamera i Oslo?
- Hvor kan jeg få tak i et sjeldent bilglass til en eldre bilmodell når andre leverandører sier nei?
- Hva er det beste alternativet for verksteder som trenger pålitelig levering av bilglass i Skandinavia?

**Målinger per spørsmål:**
- «Hvilket firma bør jeg velge for å skifte frontrute på en bil med regns…» → ikke nevnt
- «Hvor kan jeg få tak i et sjeldent bilglass til en eldre bilmodell når …» → ikke nevnt · kilder: ebay.co
- «Hva er det beste alternativet for verksteder som trenger pålitelig lev…» → nevnt i tekst


**Anbefaling (AI-vurdert):** Sørg for å bli nevnt i AI-svar ved å styrke tilstedeværelsen i relevante kataloger og innhold som dekker bilglassbytte og ADAS-kalibrering.

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._