# Lærdom: skille B2B-grossist fra B2C-montør i website-audit

**Dato:** 2026-08-13
**Kontekst:** Full website-audit av auto-glass.no benchmarket mot carglass.no og bilglassgruppen.no

## Lærdom

**En nettbutikk-audit er ikke rettferdig uten å klassifisere forretningsmodellen først. B2B-grossist og B2C-montør-kjede har ulik suksessmålestokk og må ikke scores på samme akse uten forbehold.**

Auto-glass.no er en B2B-grossist (selger glass til verksteder, monterer ikke) — det samme er Bilglassgruppen (bilglassgruppen.no). Carglass.no og Riis Bilglass (bilglass.no) er montør-kjeder som selger til sluttkunde. Å sette alle i samme poengtabell og la Carglass «vinne» på booking-UX/SEO er misvisende: grossistene konkurrerer mot hverandre (auto-glass 69 vs bilglassgruppen 60) på rask, presis glass-identifikasjon og B2B-ordreflyt — ikke mot montørene på pen forbruker-booking.

## Konkrete grep

1. **Klassifiser før du scorer:** legg inn `forretningsmodell` (B2B-grossist / B2C-montør / B2C-tjeneste / produsent-distributør) som et eksplisitt felt i audit-konteksten FØR funn vurderes.
2. **Benchmark kun innenfor samme segment** — eller merk kryss-segment-sammenligninger eksplisitt («ikke direkte konkurrenter, ulik målestokk»).
3. **Vekt funnene etter modell:** for en grossist teller søk-/ordre-flyt og lager-status tyngre enn forbruker-UX; for en montør teller booking- og betalingsflyt tyngre.
4. **Rapporter til kunden med forbeholdet innebygd** — så kunden ikke leser «69 vs 81» som «vi taper mot Carglass», men som «vi er best i vårt segment på X, men henger etter teknisk på Y».
5. **Kartlegg hele verdikjeden:** produsent/distributør (Saint-Gobain Sekurit, Pilkington — originalglass/ettermarked B2B) → grossist (Autoglass, Bilglassgruppen) → montør (Carglass, Riis Bilglass, Glassdrive). Å vite hvilket ledd kunden er i, avgjør hva som er «riktig» målestokk.

## Pitfall som ble fanget

- I første rapportutkast ble de tre satt i samme tabell uten segment-forbehold — «Carglass best (81), auto-glass i midten (69)». Tom korrigerte: «man må skille mellom b2b bilglassgrossist og Bilglassfirma som monterer bilglass.» Fikset ved å legge inn klassifiserings-tabellen og nyansere bunnlinjen.

## Når dette gjelder

Når Arch benchmarker eller auditerer nettbutikker på tvers av segmenter (grossist vs. tjenesteyter vs. forbruker) — klassifiser forretningsmodellen først, og aldri presenter rå-tall på tvers av segmenter uten forbehold.
