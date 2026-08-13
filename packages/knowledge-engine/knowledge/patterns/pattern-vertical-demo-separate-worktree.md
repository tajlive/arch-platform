# Pattern: Produksjon av vertikal Arch Build-demo i separat worktree

**Dato:** 2026-08-13
**Kategori:** pattern (gjenbrukbar arbeidsprosedyre)
**Kontekst-prosjekt:** Arch Platform — vertikal salgsdemo for norske bilglassfirmaer (første ekte kunde: Autoglass AS)

## Kontekst

Vi skulle produsere en profesjonell salgsdemo for Arch rettet mot norske bilglassfirmaer.
Demoen skulle være en interaktiv nettleserbasert simulering av en norsk AI-telefonist/
resepsjonist, med mørk premium Arch-stil. Canonical repo var `arch-platform`, men
hoved-worktreeet hadde eksisterende lokale endringer som ikke skulle røres.

## Beslutning

Legg nye vertikale demoer i `arch-platform` som egen modul/app under:

```
apps/vertical-demos/<demo-navn>/
```

For denne demoen ble appen lagt her:

```
apps/vertical-demos/autoglass-voice/
```

## Viktig arbeidsmønster

1. Sjekk først om `arch-platform` finnes lokalt.
2. Sjekk `git status --short` i hovedrepoet.
3. Hvis hovedrepoet har eksisterende lokale endringer, ikke bland deg inn i dem.
4. Opprett separat worktree/gren fra riktig commit:
   `git worktree add -b <branch-name> <worktree-path> HEAD`
5. Legg demoen i den separate worktreeen.
6. Hold endringene smalt til ny demo-mappe, med mindre repoet krever delt konfig.
7. Ikke videreutvikle gamle `arch-dashboard`.
8. Ikke deploy uten eksplisitt godkjenning.

## Implementert demo

- **Worktree:** `/Users/taj/Documents/Codex/2026-08-13/referenced-chatgpt-conversation-this-is-an/work/arch-platform-autoglass-demo` (branch `autoglass-voice-demo`, fra `3bce3eb`)
- **Demo:** `apps/vertical-demos/autoglass-voice/index.html` (+ `app.js`, `styles.css`)
- **README:** `apps/vertical-demos/autoglass-voice/README.md`

## Demoens funksjonelle krav

- Simulerer innkommende norsk telefonsamtale i nettleseren.
- Starter med: «Hei, du har kommet til <bilglassfirma>. Hva kan jeg hjelpe deg med?»
- Lar kunden velge behov:
  - steinsprut
  - sprukket frontrute
  - siderute/bakrute
  - kjøpe bilglass uten montering
  - kjøpe + montering
  - AC/service som sekundært behov
- Normaliserer norsk registreringsnummer.
- Viser eksplisitt tegn-for-tegn-bekreftelse før oppslag.
- Slår aldri opp regnr før kunden har bekreftet.
- Bruker mock/fallback for kjøretøyoppslag når Vegvesen API ikke er trygt koblet i demoen.
- Marker datakilder tydelig som `observed`, `mock` eller `unknown`.
- Viser funnet bil med merke/modell/årsmodell der data finnes.
- Spør om skade, rute, reparasjon/skifte, glassvariant og ADAS/sensor der relevant.
- Har eksempel på produktvalg/glassvariant/prisgrunnlag uten å late som ekte lager.
- Lar kunden velge ønsket tidspunkt eller «bli kontaktet».
- Genererer ferdig intern lead/sak med:
  - kunde, telefon, regnr, bil, behov, glass/montering, prioritet, ønsket tidspunkt, notater
- Viser både «Kunden ser» og «Bedriften mottar internt».
- Har egen «AI Voice Receptionist»-presentasjonsmodus for salg.

## Produktposisjonering

Ikke led med «AI-plattform». Led med:

> «AI som svarer telefonen, finner riktig bil og gjør henvendelsen klar for tilbud/booking.»

For bilglassfirma som kun selger glass og ikke monterer, tilpass pitch til:

> «AI som tar imot forhandler-/verkstedhenvendelser, finner riktig bilglass via regnr/VIN og gjør salgsforespørselen klar.»

Ikke fokuser på montering/booking først.

## Sikkerhetsprinsipper

- Ingen ekte kundedata i frontend.
- Ingen API-nøkler/secrets i frontend.
- Vegvesen API skal kobles via backend, aldri direkte fra nettleser.
- Demo-data må merkes tydelig som demo/mock.
- Ukjent eller feil regnr skal gi retry eller simulert SMS-fallback.

## Verifisering brukt

- `node --check apps/vertical-demos/autoglass-voice/app.js`
- `npm run audit:leak`
- Lokal statisk server for å verifisere 200 OK på HTML/JS/CSS
- Playwright screenshot med lokal Chrome
- Playwright interaksjonsflyt som klikket gjennom demoen og bekreftet at lead ble generert

## Lærdom

Når man bygger en salgsdemo i Arch Platform:

- Bruk eksisterende statisk app-mønster hvis repoet bruker enkle `index.html`, `styles.css`, `app.js`.
- Bruk separat worktree når hovedrepoet er dirty.
- Gjør første skjerm til faktisk demo/opplevelse, ikke marketing landing page.
- For vertikale demosider: bygg hele flyten som kunden skal forstå, ikke bare konsepttekst.
- Marker provenance/datastatus tydelig.
- Test både teknisk syntaks, leakage og faktisk visuell/interaktiv flyt før levering.
