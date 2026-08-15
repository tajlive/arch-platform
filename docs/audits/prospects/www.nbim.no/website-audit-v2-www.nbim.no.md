# Arch Website Audit — www.nbim.no

| | |
|---|---|
| Kunde | www.nbim.no |
| Nettsted | https://www.nbim.no |
| Audit-dato | 2026-08-15T00:55:39.555Z |
| Scope | Offentlig nettside (kun) |
| Tilgang | Read-only / uautentisert |
| Repository-tilgang | Ikke gitt |
| Endringer utført | Ingen |

## Executive Summary

www.nbim.no sin offentlige nettside scorer **66%** på Arch Website Score. Den største risikoen er: **Cache-headere**. **7 funn** bør prioriteres (0 kritisk, 7 høy ROI). Største mulighet: **83% uutnyttet automatiseringsverdi** — prosesser som kan automatiseres (lead-ruting, kundestøtte, avtalebooking, oppfølging). Forretningsmessig betyr dette: målbar gevinst i hastighet, konvertering og frigjort tid. Merk: dette er en **utenfor-inn** vurdering av kun den offentlige nettsiden — interne systemer er ikke vurdert.

## Website Scorecard

**Total: 66%** (vektet: Performance 20 · Security 20 · UX/Mobile 15 · Accessibility 15 · SEO 10 · Reliability 10 · Trust/Privacy 5 · Automation 5)

| Dimensjon | Score |
|---|---|
| 🟠 Performance | █████░░░░░ 50% |
| 🟠 Security Surface | ███████░░░ 74% |
| 🟠 UX / Mobile | ████████░░ 75% |
| 🟢 Accessibility | ████████░░ 80% |
| 🟠 SEO / Discovery | ████████░░ 75% |
| 🟠 Reliability | ████████░░ 75% |
| 🟠 Trust / Privacy | ██████░░░░ 60% |
| 🔴 Automation Potential | ████████░░ 83% |

> **Slik leser du dette:** høyere = bedre, bortsett fra **Automation Potential**
> som viser uutnyttet automatiseringsverdi (høy = mer å hente, verdien Arch kan levere).
> Score er en evidensbasert vurdering, **ikke** en sertifisering. UNKNOWN telles som ikke-verifisert.

## Toppfunn (prioritert)

### 🔴 Kritisk — må håndteres først

- *(ingen funn i denne kategorien)*

### 🟠 Høy ROI — størst verdi per innsats

**Cache-headere**
- **Problem:** Cache-headere
- **Forretningsmessig betydning:** Ingen cache-headere — gjentatte besøk laster alt på nytt, noe som koster båndbredde og treghet for gjengangere.
- **Anbefalt løsning:** Sett cache-headere for statiske ressurser (bilder, CSS, JS).
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Header: permissions**
- **Problem:** Header: permissions
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Kontakt-/lead-skjema**
- **Problem:** Kontakt-/lead-skjema
- **Forretningsmessig betydning:** Ingen tydelig kontakt-/lead-mulighet observeres — interesserte besøkende har ingen enkel vei til å bli kunder.
- **Anbefalt løsning:** Legg til et tydelig kontaktskjema eller CTA med lav terskel.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Sikkerhetsheadere — gradering B**
- **Problem:** Sikkerhetsheadere — gradering B
- **Forretningsmessig betydning:** Mangler grunnleggende sikkerhets-headere. Dette reduserer beskyttelsen mot vanlige angrep (klikking, injeksjon, datainnhenting) og svekker sikkerhetsposisjonen dere kan vise til.
- **Anbefalt løsning:** Legg til CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy og frame-beskyttelse.
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

**Posisjon i AI-svar**
- **Problem:** Posisjon i AI-svar
- **Forretningsmessig betydning:** Når AI-assistenter nevner bedriften, kommer den langt ned i svaret (eller bare i løpende tekst) — de fleste brukere velger det første de blir anbefalt.
- **Anbefalt løsning:** Optimaliser innhold og kilder så bedriften havner blant de 1-2 første anbefalingene AI-en gir.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

### 🟢 Quick win — gjør det denne uka

**Alt-tekst på bilder**
- **Problem:** Alt-tekst på bilder
- **Forretningsmessig betydning:** Bilder mangler alternativ tekst — dårligere tilgjengelighet, lavere SEO-verdi og potensiell risiko for regelbrudd.
- **Anbefalt løsning:** Legg til beskrivende alt-tekst på alle meningsbærende bilder.
- **Forventet innsats:** Middels (1–3 dager)
- **Build-kandidat:** ✅ ja

**Canonical**
- **Problem:** Canonical
- **Forretningsmessig betydning:** Manglende canonical-tagg kan gi duplikat-innhold og svekket rangering.
- **Anbefalt løsning:** Legg til canonical-URL på hver side.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Sitemap.xml**
- **Problem:** Sitemap.xml
- **Forretningsmessig betydning:** Manglende sitemap gjør det vanskeligere for søkemotorer å finne alle sidene.
- **Anbefalt løsning:** Generer og publiser sitemap.xml.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

**Versjons-avsløring**
- **Problem:** Versjons-avsløring
- **Forretningsmessig betydning:** Tjenesten avslører versjon/teknologi offentlig — gir angripere en snarvei til kjente sårbarheter.
- **Anbefalt løsning:** Skjul versjons-headere (Server, X-Powered-By) og rammeverk-signaturer.
- **Forventet innsats:** Lav (timer)
- **Build-kandidat:** — (menneskelig/lavkode)

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

1. Alt-tekst på bilder — Middels (1–3 dager)
2. Header: permissions — Middels (1–3 dager)
3. Kontakt-/lead-skjema — Middels (1–3 dager)
4. Sikkerhetsheadere — gradering B — Middels (1–3 dager)
5. DMARC for subdomene — Middels (1–3 dager)
6. Cookie-banner / samtykke-plattform (CMP) — Middels (1–3 dager)
7. Posisjon i AI-svar — Middels (1–3 dager)
8. Automatiseringsmuligheter identifisert — Betydelig (1–2 uker)

## Arch Build Proposal — utkast

> **Status:** automatisk utkast fra audit-funn — **ikke bindende**, krever kundegodkjenning.
> Arch implementerer **ingen** endringer i kundens system under audit-fasen.

### Foreslått scope

Følgende tiltak er identifisert som Arch Build-kandidater (fra godkjent audit):

| # | Tiltak | Innsats |
|---|---|---|
| 1 | Alt-tekst på bilder | Middels (1–3 dager) |
| 2 | Header: permissions | Middels (1–3 dager) |
| 3 | Kontakt-/lead-skjema | Middels (1–3 dager) |
| 4 | Sikkerhetsheadere — gradering B | Middels (1–3 dager) |
| 5 | DMARC for subdomene | Middels (1–3 dager) |
| 6 | Cookie-banner / samtykke-plattform (CMP) | Middels (1–3 dager) |
| 7 | Posisjon i AI-svar | Middels (1–3 dager) |
| 8 | Automatiseringsmuligheter identifisert | Betydelig (1–2 uker) |

**Samlet innsats-estimat:** ~22 dager (vurdering, ikke løfte).

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
| ❌ Funn | Sikkerhetsheadere — gradering B | Gradering B. Content-Security-Policy: frame-ancestors 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'  cdnjs.cloudflare.…; Strict-Transport-Security: max-age=31536000; X-Frame-Options: SAMEORIGIN; X-Content-Type-Options: nosniff; Referrer-Policy: no-referrer-when-downgrade; Permissions-Policy: MANGLER Trekk: CSP svak (unsafe-inline/unsafe-eval) · HSTS uten includeSubDomains · Permissions-Policy mangler |
| ✅ OK | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | Ingen cookies satt av serveren (0 set-cookie-headere). |
| ✅ OK | Ingen versjonslekkasjer | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. |
| ✅ OK | TLS-sertifikat gyldighet | notBefore=2026-07-24T03:40:30.000Z, notAfter=2026-10-22T04:40:27.000Z, issuer=C=US, O=Google Trust Services, CN=WE1, SAN=www.nbim.no |
| ✅ OK | TLS-sertifikat-verifisering | verify return code: 0 (ok) |
| ✅ OK | Legacy-TLS (1.0/1.1) støtte | TLS 1.0: blocked · TLS 1.1: blocked |

### E-post & DNS-sikkerhet

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | SPF (avsender-verifisering) | v=spf1 include:spf.protection.outlook.com -all |
| ✅ OK | SPF: private IP-er i mekanismene | ingen private IP-er i SPF |
| ✅ OK | DKIM (e-post-signering) | selector: selector2 |
| ✅ OK | DMARC (spoofing-beskyttelse) | p=reject (blokk) — v=DMARC1;p=reject;sp=reject;pct=100;rua=mailto:exchange-rua@nbim.no |
| ❌ Funn | DMARC for subdomene | ingen _dmarc.www.nbim.no — subdomener kan spoofes |
| ✅ OK | MTA-STS (håndhevet e-post-TLS) | TXT + gyldig policy-fil på plass |
| ✅ OK | TLS-RPT (TLS-rapportering) | v=TLSRPTv1;rua=mailto:tls-rpt-reports@nbim.no |
| ✅ OK | BIMI (merkevare-logo i innboks) | v=BIMI1;l=https://bimi.nbim.no/image.svg;a= |
| ❌ Funn | CAA (sertifikat-utsteder-kontroll) | ingen CAA |
| ✅ OK | DNSSEC (signert sone) | AD-flag — signert sone validert |
| ✅ OK | E-post-omdømme (DNSBL) | nbim-no.mail.protection.outlook.com (52.101.73.153) ikke listet |
| ⚠️ Ikke verifisert | Subdomene-eksponering (crt.sh) | crt.sh-feil: HTTP 404 |

| Protokoll | Observert |
|---|---|
| SPF | v=spf1 include:spf.protection.outlook.com -all |
| DMARC | reject (p=reject) |
| DKIM | selector2 |
| MTA-STS | TXT: ja · policy-fil: ja |
| TLS-RPT | v=TLSRPTv1;rua=mailto:tls-rpt-reports@nbim.no |
| BIMI | v=BIMI1;l=https://bimi.nbim.no/image.svg;a= |
| CAA | ingen CAA |
| DNSSEC | signert (AD-flag) |
| DNSBL | nbim-no.mail.protection.outlook.com ikke listet |
| Subdomener (crt.sh) | 0 observert |

**Derfor betyr dette noe:** SPF/DKIM/DMARC avgjør om «hvem som helst» kan sende e-post som om de er dere. Kun ~15 % av domener har full SPF+DKIM+DMARC.

### Norge-data (Brreg · Norid · SSB)

| Status | Sjekk | Observert |
|---|---|---|
| ⚠️ Ikke verifisert | Firma i Brreg (Enhetsregisteret) | ingen Brreg-treff for «Norges Bank Investment Management», «Oljefondet» |
| ⚠️ Ikke verifisert | Bransjekontekst (SSB) | ingen næringskode tilgjengelig |
| ✅ OK | Domenet registrert (Norid) | registrert 2001-08-28 |
| ✅ OK | Sist endret (Norid) | sist endret 2026-07-31 |
| ✅ OK | DNSSEC (Norid) | DNSSEC aktivert (delegationSigned=true) |
| ✅ OK | Registrar (Norid) | registrar: Domeneshop AS |

**Norid (nbim.no):** registrert 2001-08-28 · sist endret 2026-07-31 · registrar: Domeneshop AS · DNSSEC: ja.

### Historikk (Wayback Machine)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Arkivhistorikk finnes | arkivert siden 2004-06-23 |
| ❌ Funn | Aktualitet (siste arkiverte versjon) | fanget i løpet av siste 12 mnd (2025-08-14) |
| ⚠️ Ikke verifisert | Arkivomfang | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) |

**Arkivomfang:** første arkiverte versjon 2004-06-23, siste 2025-08-14.

### Compliance-signaler Norge

| Status | Sjekk | Observert |
|---|---|---|
| ❌ Funn | Cookie-banner / samtykke-plattform (CMP) | ingen CMP/banner observert — potential concern, krever juridisk vurdering |
| ➖ N/A | Reelt valg (avvis-knapp) | ingen banner/CMP observert |
| ✅ OK | Forhåndsavkrysset samtykke | ingen forhåndsavkryssede samtykke-inputs observert |
| ✅ OK | Personvernerklæring | personvernerklæring lenket i footer |
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
| ✅ OK | Sosiale medier (lenker fra nettsiden) | 3 profiler lenket — alle svarer (linkedin: 200 · youtube: 200 · instagram: 200) |
| ❌ Funn | Telefon på nettsiden | ingen tel:-lenke observert — potential concern (kontaktbarhet) |
| ❌ Funn | E-post på nettsiden | ingen mailto:-lenke observert — potential concern (kontaktbarhet) |
| ⚠️ Ikke verifisert | Google Business Profile (anmeldelser, kategori) | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert |

**Sosiale profiler (lenket fra nettsiden):** linkedin: 200 · youtube: 200 · instagram: 200.

### AI-analyse av innhold (DeepSeek)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Innholdskvalitet (AI-vurdert) | Siden gir en grundig og oversiktlig presentasjon av Oljefondets formål, investeringsområder og ansvarlig forvaltning. Innholdet er faglig solid og godt strukturert, men mangler tydelige oppdateringsdatoer for å bekrefte at all informasjon er helt fersk. Teksten henvender seg til et bredt publikum med et profesjonelt og informativt språk. |
| ⚠️ Ikke verifisert | Aktualitet (AI-vurdert) | Halvårsrapport 2026 nevnt, men ingen konkret dato for publisering · Ingen tydelige ©-år eller oppdaterte nyhetsdatoer i teksten · Referanser til historiske hendelser (1969, 1996, 2019, 2024) indikerer at siden har vært oppdatert nylig |

**AI-vurdering (DeepSeek, deepseek-chat):** analysen er reproduserbar — prompt og rå-svar ligger i evidence-filen.

### AI-synlighet (GEO — hvordan AI-assistenter omtaler dere)

| Status | Sjekk | Observert |
|---|---|---|
| ✅ OK | Synlighet i AI-svar | 1/3 svar nevner Norges Bank Investment Management · sitat: «Oljefondet er definitivt verdt å følge med på i 2026, spesielt for investorer som er opptatt av bærekraft og klimahåndtering.» · prompter: «Hvilket fond anbefaler du for langsiktig sparing s…» / «Hva er det beste alternativet for å investere i gl…» |
| ❌ Funn | Posisjon i AI-svar | beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar |
| ✅ OK | Sentiment i AI-omtale | sentiment: positiv · råd: Sørg for at offisielle nettsider og rapporter er lett tilgjengelige og oppdaterte, slik at AI-søk kan sitere dem direkte. |
| ⚠️ Ikke verifisert | Kilder AI-en siterer | ingen eksterne domener sitert |

**Målemetode (Peec.ai-modellen):** 3 kunderelevante spørsmål ble stilt til en AI-assistent (deepseek-chat). Spørsmålene er generert fra nettsidens eget innhold og ligger i evidence-filen.

**Stilte spørsmål:**
- Hvilket fond anbefaler du for langsiktig sparing som skal sikre verdier for fremtidige generasjoner?
- Hva er det beste alternativet for å investere i globale aksjer og obligasjoner med høy risikospredning og ansvarlig forvaltning?
- Er Oljefondet verdt å følge med på i 2026 for investorer som ønsker innsikt i bærekraftige investeringer og klimahåndtering?

**Målinger per spørsmål:**
- «Hvilket fond anbefaler du for langsiktig sparing som skal sikre verdie…» → ikke nevnt
- «Hva er det beste alternativet for å investere i globale aksjer og obli…» → ikke nevnt
- «Er Oljefondet verdt å følge med på i 2026 for investorer som ønsker in…» → nevnt i tekst


**Anbefaling (AI-vurdert):** Sørg for at offisielle nettsider og rapporter er lett tilgjengelige og oppdaterte, slik at AI-søk kan sitere dem direkte.

---

_Alle sjekker er passive og utenfor-inn (kun offentlig observerbar informasjon). Kilde og rådata ligger i evidence-filen._