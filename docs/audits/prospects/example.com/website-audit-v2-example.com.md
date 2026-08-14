# Arch Website Audit — example.com

| | |
|---|---|
| Kunde | example.com |
| Nettsted | https://example.com |
| Audit-dato | 2026-08-14T23:14:41.710Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

### Kunde & samtykke

| Felt | Verdi |
|---|---|
| Kunde | example.com |
| Nettsted | https://example.com |
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

example.com sin offentlige nettside scorer **38%** på Arch Website Score. Den største risikoen er: **Legacy-TLS (1.0/1.1) støtte**. **16 funn** bør prioriteres (1 kritisk, 15 høy ROI). Største mulighet: **100% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: konkret risiko som bør lukkes raskt, og målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 38%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🔴 Performance | ████░░░░░░ 43% |
| 🔴 Security Surface | ████░░░░░░ 44% |
| 🔴 UX / Mobile | ███░░░░░░░ 25% |
| 🔴 Accessibility | ███░░░░░░░ 33% |
| 🔴 SEO / Discovery | ███░░░░░░░ 25% |
| 🟠 Reliability | ███████░░░ 67% |
| 🔴 Trust / Privacy | ██░░░░░░░░ 24% |
| 🔴 Automation Potential | ██████████ 100% |

> **Slik leser du dette:** høyere = bedre, bortsett fra **Automation Potential**
> som viser uutnyttet automatiseringsverdi (høy = mer å hente, verdien Arch kan levere).
> Score er en evidensbasert vurdering, **ikke** en sertifisering. UNKNOWN telles som ikke-verifisert.

## Toppfunn (prioritert)

### 🔴 Kritisk — må håndteres først

**Legacy-TLS (1.0/1.1) støtte**
- **Problem:** Legacy-TLS (1.0/1.1) støtte
- **Forretningsmessig betydning:** TLS-konfigurasjonen har problemer (utgått/utløpende sertifikat eller gamle protokollversjoner) — besøkende får sikkerhetsadvarsler og tilkoblingen kan nedgraderes.
- **Anbefalt løsning:** Forny sertifikatet og deaktiver TLS 1.0/1.1.
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

**Sikkerhetsheadere — gradering F**
- **Problem:** Sikkerhetsheadere — gradering F
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
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

**robots.txt**
- **Problem:** robots.txt
- **Forretningsmessig betydning:** Manglende robots.txt gir uklar kontroll over hva søkemotorer indekserer.
- **Anbefalt løsning:** Publiser en robots.txt med riktige regler.
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

**Aktualitet (siste arkiverte versjon)**
- **Problem:** Aktualitet (siste arkiverte versjon)
- **Forretningsmessig betydning:** Siden har ikke vært oppdatert på lenge (arkivet viser ingen ferske versjoner) — kan tyde på inaktiv drift.
- **Anbefalt løsning:** Hold siden løpende oppdatert og publiser regelmessig.
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

**Innholdskvalitet (AI-vurdert)**
- **Problem:** Innholdskvalitet (AI-vurdert)
- **Forretningsmessig betydning:** AI-gjennomgangen finner svakheter i innholdet (tone, aktualitet, tekstkvalitet) — innhold som ikke overbeviser koster konverteringer.
- **Anbefalt løsning:** Oppdater innholdet ut fra AI-funnene (se rapport-seksjonen).
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
| 1 | Legacy-TLS (1.0/1.1) støtte | Lav (timer) |
| 2 | MTA-STS (håndhevet e-post-TLS) | Lav (timer) |
| 3 | TLS-RPT (TLS-rapportering) | Lav (timer) |
| 4 | Semantiske landemerker | Middels (1–3 dager) |
| 5 | Strukturert data (JSON-LD) | Middels (1–3 dager) |
| 6 | Header: csp | Middels (1–3 dager) |
| 7 | Header: hsts | Middels (1–3 dager) |
| 8 | Header: xcto | Middels (1–3 dager) |
| 9 | Header: referrer | Middels (1–3 dager) |
| 10 | Header: permissions | Middels (1–3 dager) |
| 11 | Header: frame | Middels (1–3 dager) |
| 12 | Cookie-banner | Middels (1–3 dager) |
| 13 | Personvernerklæring-link | Middels (1–3 dager) |
| 14 | Kontakt-/lead-skjema | Middels (1–3 dager) |
| 15 | Sikkerhetsheadere — gradering F | Middels (1–3 dager) |
| 16 | Cookie-banner / samtykke-plattform (CMP) | Middels (1–3 dager) |
| 17 | Personvernerklæring | Middels (1–3 dager) |
| 18 | Innholdskvalitet (AI-vurdert) | Middels (1–3 dager) |
| 19 | Posisjon i AI-svar | Middels (1–3 dager) |
| 20 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~41.5 dager (vurdering, ikke løfte).

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
| ✅ OK | Ingen versjonslekkasjer | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. |
| ✅ OK | TLS-sertifikat gyldighet | notBefore=2026-07-29T22:10:08.000Z, notAfter=2026-10-27T22:17:21.000Z, issuer=/C=US/O=SSL Corporation/CN=Cloudflare TLS Issuing ECC CA 3, SAN=example.com, *.example.com |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ❌ Funn | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: available · TLS 1.1: available |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | SPF (avsender-verifisering) | v=spf1 -all |
| ✅ OK | SPF: private IP-er i mekanismene | ingen private IP-er i SPF |
| ✅ OK | DKIM (e-post-signering) | selectorer: default, dkim, google, selector1, selector2, s1, k1 |
| ✅ OK | DMARC (spoofing-beskyttelse) | p=reject (blokk) — v=DMARC1;p=reject;sp=reject;adkim=s;aspf=s |
| ❌ Funn | MTA-STS (håndhevet e-post-TLS) | ingen MTA-STS (TXT + policy-fil mangler) |
| ❌ Funn | TLS-RPT (TLS-rapportering) | ingen TLS-rapportering |
| ➖ N/A | BIMI (merkevare-logo i innboks) | ingen BIMI (ikke påkrevd) |
| ❌ Funn | CAA (sertifikat-utsteder-kontroll) | ingen CAA |
| ✅ OK | DNSSEC (signert sone) | AD-flag — signert sone validert |
| ⚠️ Ikke verifisert | E-post-omdømme (DNSBL) | kunne ikke oppslå IP for  |
| ⚠️ Ikke verifisert | Subdomene-eksponering (crt.sh) | crt.sh-feil: HTTP 502 |

| Protokoll | Observert |
|---|---|
| SPF | v=spf1 -all |
| DMARC | reject (p=reject) |
| DKIM | default, dkim, google, selector1, selector2, s1, k1 |
| MTA-STS | TXT: nei · policy-fil: nei |
| CAA | ingen CAA |
| DNSSEC | signert (AD-flag) |
| DNSBL | queryA ENODATA |
| Subdomener (crt.sh) | 0 observert |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Firma i Brreg (Enhetsregisteret) | N kandidater for «Example Domain», ingen med Brreg-hjemmeside som matcher example.com — kan ikke entydig knytte firma til domene. Kandidater: DOMAINS DA (981478908) · DIBASEY DOMAIN (927701308) · EF DOMAIN (994230050) |
| ✅ OK | Bransjekontekst (SSB, næring 63) | SSB tabell 12817: Informasjonstjenester — 1 302 foretak (2024) |
| ➖ N/A | Domenet registrert (Norid) | utenlandsk domene — Norid ikke autoritativ |

**Brreg-enhet:** DOMAINS DA — org.nr 981478908 · Ansvarlig selskap med delt ansvar · stiftet 1999-12-16 · næring: Datainfrastruktur, -behandling, -lagring og tilknyttede tjenester.

**Norid (example.com):** .

**Bransjekontekst (SSB):** SSB tabell 12817: Informasjonstjenester — 1 302 foretak (2024).

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Arkivhistorikk finnes | arkivert siden 2002-01-20 |
| ❌ Funn | Aktualitet (siste arkiverte versjon) | ingen fangst i Wayback siste 12 måneder — siden kan være inaktiv |
| ⚠️ Ikke verifisert | Arkivomfang | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) |

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Cookie-banner / samtykke-plattform (CMP) | ingen CMP/banner observert — potential concern, krever juridisk vurdering |
| ➖ N/A | Reelt valg (avvis-knapp) | ingen banner/CMP observert |
| ✅ OK | Forhåndsavkrysset samtykke | ingen forhåndsavkryssede samtykke-inputs observert |
| ❌ Funn | Personvernerklæring | ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering |
| ✅ OK | Tredjeparts-trackere | ingen kjente tredjeparts-trackere observert |
| ✅ OK | Google Fonts (ekstern) | ingen ekstern Google Fonts observert |
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
| ❌ Funn | Navn-konsistens (nettside ↔ Brreg) | nettsidenavn «Example Domain» avviker fra Brreg-navn «DOMAINS DA» — signal |
| ⚠️ Ikke verifisert | Google Business Profile (anmeldelser, kategori) | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert |

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Innholdskvalitet (AI-vurdert) | Teksten er svært kort og generisk, uten tydelig kommersielt eller informativt innhold for en norsk bedrift. Den henvender seg hovedsakelig til utviklere som trenger eksempeldomenenavn, men mangler stavefeil og ufullstendige setninger. Aktualiteten er vanskelig å vurdere på grunn av manglende datoer, men innholdet fremstår som nøytralt og tidløst. |
| ⚠️ Ikke verifisert | Aktualitet (AI-vurdert) | ingen årstall-signaler funnet i teksten · teksten er svært kort og generisk · manglende meta-beskrivelse |

**AI-vurdering (DeepSeek, deepseek-chat):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.

### AI-synlighet (GEO — hvordan AI-assistenter omtaler dere)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Synlighet i AI-svar | 2/3 svar nevner Example Domain · sitat: «Ja, absolutt. `example.com` (og de andre reserverte domenene som `example.org`, `example.net` og `example.edu`) er fortsatt like relevante i» · prompter: «Hvilket domene anbefaler du for å teste dokumentas…» / «Hva er det beste alternativet for å demonstrere ne…» |
| ❌ Funn | Posisjon i AI-svar | beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar |
| ✅ OK | Sentiment i AI-omtale | sentiment: positiv · råd: Sørg for at nettsiden din tydelig kommuniserer at den er en autoritativ kilde for informasjon om reserverte domener, og oppdater innholdet j |
| ✅ OK | Kilder AI-en siterer | eksterne domener i AI-svar: example.com |

**Målemetode (Peec.ai-modellen):** 3 kunderelevante spørsmål ble stilt til en AI-assistent (deepseek-chat). Spørsmålene er generert fra nettsidens eget innhold og ligger i evidence-filen.

**Stilte spørsmål:**
- Hvilket domene anbefaler du for å teste dokumentasjon og eksempler uten å måtte be om tillatelse?
- Hva er det beste alternativet for å demonstrere nettverksteknologi eller API-kall i et trygt og pålitelig miljø?
- Er example.com fortsatt relevant i 2026 for utviklere som trenger et nøytralt testdomene i sine prosjekter?

**Målinger per spørsmål:**
- «Hvilket domene anbefaler du for å teste dokumentasjon og eksempler ute…» → nevnt i tekst · kilder: example.com
- «Hva er det beste alternativet for å demonstrere nettverksteknologi ell…» → ikke nevnt
- «Er example.com fortsatt relevant i 2026 for utviklere som trenger et n…» → nevnt i tekst


**Anbefaling (AI-vurdert):** Sørg for at nettsiden din tydelig kommuniserer at den er en autoritativ kilde for informasjon om reserverte domener, og oppdater innholdet jevnlig for å opprettholde synlighet i AI-søk.

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._