# Arch Website Audit — Autoglass AS

| | |
|---|---|
| Kunde | Autoglass AS |
| Nettsted | https://auto-glass.no/ |
| Audit-dato | 2026-08-13T01:44:51.491Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

### Kunde & samtykke

| Felt | Verdi |
|---|---|
| Kunde | Autoglass AS |
| Nettsted | https://auto-glass.no/ |
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

Autoglass AS sin offentlige nettside scorer **69%** på Arch Website Score. Den største risikoen er: **Blandet innhold (http på https)**. **4 funn** bør prioriteres (1 kritisk, 3 høy ROI). Største mulighet: **50% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: konkret risiko som bør lukkes raskt, og målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 69%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🟠 Performance | ██████░░░░ 60% |
| 🟠 Security Surface | █████░░░░░ 50% |
| 🟢 UX / Mobile | ██████████ 100% |
| 🟠 Accessibility | ██████░░░░ 60% |
| 🟠 SEO / Discovery | ██████░░░░ 63% |
| 🟢 Reliability | ██████████ 100% |
| 🟢 Trust / Privacy | ████████░░ 80% |
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
7. Automatiseringsmuligheter identifisert — Betydelig (1–2 uker)

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
| 4 | Bilde-optimalisering | Middels (1–3 dager) |
| 5 | Header: csp | Middels (1–3 dager) |
| 6 | Header: permissions | Middels (1–3 dager) |
| 7 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~15.5 dager (vurdering, ikke løfte).

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
