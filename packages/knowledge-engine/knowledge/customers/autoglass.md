# Autoglass AS — kunde #2 (B2B bilglassgrossist)

Dato: 2026-08-13 · Kontakt: Eduard Eikeland (eduard@auto-glass.no, 40408241) · Org.nr 968 552 732

## Profil

- **Produkt:** Bilglass + tilbehør (klips, pyntelist, lim, primer, sensorgel) til verksteder.
- **Forretningsmodell:** **B2B-grossist** — selger glass til 500+ verksteder, **monterer IKKE selv**. Kun B2B-priser (kundens rabatt trekkes på ordre/faktura). **Har OGSÅ en B2C-kanal for salg av bilglass til private:** `autoglass.finnbilglass.no` (Tom 2026-08-13).
- **Nettbutikk B2B:** auto-glass.no — WooCommerce/WordPress (gammel stack, se audit).
- **Nettbutikk B2C (private):** autoglass.finnbilglass.no — React/Vite-frontend som snakker med Worker-en `autoglass-glass-sok.autoglassnorge.workers.dev` (vår CF Worker med D1 glass-catalog-db).
- **Katalog:** 27 184 produkter (glass + viskersett + klips/pyntelister).
- **Kontakt:** +47 21 37 83 90, post@auto-glass.no, Ole Deviks vei 26, Oslo.

## Ark-rolle

Første **eksterne** Arch-kunde. Produktet under bygging: **senior AI-ordremottaker** (stemme-simulering → senere telefoni) som søker live på auto-glass.no (regnr/rutenummer/eurocode), presenterer pris + Oslo-lager i dialogen, og tar B2B-ordrer. PROD-kode: `/Users/taj/bilglass-worktrees/customer-ai-chat` (branch `feat/customer-ai-chat`, CF Worker `autoglass-glass-sok`).

## Klassifisering — viktig (Tom 2026-08-13)

**Skille B2B bilglassgrossist fra montør-kjede.** De er ikke samme markedssegment:

| Type | Firma | Kunde | Nettbutikk-mål |
|---|---|---|---|
| **B2B-grossist** | Autoglass AS (auto-glass.no) | Verksteder | Rask katalog-/ordre-tilgang, B2B-priser, lager-status |
| **B2B-grossist (+ B2C-kanal til private)** | Autoglass AS (autoglass.finnbilglass.no) | Private (B2C) | Salg av bilglass til private — React/Vite + vår CF Worker |
| **B2B-grossist** | Bilglassgruppen AS (bilglassgruppen.no) | Verksteder | Samme som over |
| **Produsent/distributør (originalglass, B2B)** | Saint-Gobain (Sekurit) | Grossister/verksteder | Distribuerer ORIGINALE Sekurit-bilglass B2B |
| **Produsent/distributør (B2B)** | Pilkington (NSG Group) | Grossister/verksteder | Sender bilglass B2B fra Sverige til Norge |
| **Produsent/distributør (B2B)** | AGC (Asahi Glass, AGC Automotive) | Grossister/verksteder | Global bilglassprodusent (japansk) |
| **Produsent/distributør (B2B)** | Xinyi Glass Holdings | Grossister/verksteder | Global bilglassprodusent (kinesisk/HK) |
| **Produsent/distributør (B2B)** | Fuyao Group (FY, fygi.com) | Grossister/verksteder | Verdens største bilglassprodusent (kinesisk) |
| **Montør-kjede (B2C)** | Carglass (carglass.no) | Sluttkunde | Booke time online, betaling, merkevare |
| **Montør-kjede (B2C)** | Riis Bilglass AS (bilglass.no) | Sluttkunde | Norges største kjede, ~200 avdelinger |
| **Montør-kjede (B2C)** | Glassdrive (glassdrive.no) | Sluttkunde | Montørbedrift |

**Konsekvens for audit:** en grossist-nettbutikk og en montør-nettbutikk har ulik suksessmålestokk. Auto-glass.no sin **direkte konkurrent er Bilglassgruppen** (begge B2B-grossister) — der vinner Auto-glass (69 vs 60). Carglass, Riis Bilglass og Glassdrive er i montør-segmentet (ikke direkte konkurrenter). Saint-Gobain Sekurit er ett nivå opp i verdikjeden (originalglass-produsent/distributør) og selger B2B til grossister/verksteder. Pilkington (NSG Group) er tilsvarende en B2B-produsent/distributør som sender bilglass fra Sverige til Norge. AGC (Asahi Glass / AGC Automotive) er en tredje global bilglassprodusent i samme ledd. Xinyi Glass Holdings er en fjerde (kinesisk/Hong Kong-basert). Fuyao Group er en femte — verdens største bilglassprodusent (kinesisk, med replacement glass via fygi.com og fabrikker i USA/Tyskland).

## Nøkkelfakta (verifisert 2026-08-13, website-audit)

- Arch Website Score: **69/100** (benchmark: carglass 81, bilglassgruppen 60).
- Lighthouse (mobil): A11y 90, Best Practices 100, SEO 92.
- Kritisk funn: blandet innhold (http på https) + WordPress 4.9.31 EOL / WooCommerce 3.4.8 (2018-stack, kjente sikkerhetshull).
- Innlogget søk på regnr **fungerer** (EV21734 → Jaguar I-Pace 2019, 15 glassvarianter).
- Rapporter: `docs/audits/customers/{autoglass,carglass,bilglassgruppen}/audit-rapport-*.md`.

## Kunde-artefakter

- **Komplett prisliste** (`docs/audits/customers/autoglass/assets/PROSEKT-API-16-MAI26-prisliste.xls`) — alle Autoglass AS sine varer. Generert av Eduard Eikeland 16.05.2026. Sortert etter varenummer. Analyse-script: `assets/analyze-prisliste.py`.
- **Importert til D1 (2026-08-13):** 29 627 unike varer i tabell `autoglass_prisliste` i `glass-catalog-db` (CF-account 2266e975, Autoglass-org). Kolonner: varenr, varenavn, kommentar, pris, eurokode, alias_av, rad_type. UNIQUE(varenr, varenavn) — idempotent re-import. Import-rute: GitHub Actions `d1-prisliste-import.yml` (autoglassnorge/autoglassgrossisten, push-trigger på generert-SQL + workflow_dispatch). Rad-fordeling: glass 25 179 · tilbehør 2 961 · alias 1 420 · frakt 59 · emballasje 8.

## Prisliste-analyse (PROSEKT API, 16.05.2026)

**Omfang:** 33 083 varer (datarader). Kolonner: Varenr, Varenavn, kommentar, Pris, Eurokode.

- **Pris:** 1–149 565 kr. Median 4 115 kr, snitt 6 299 kr. (eks. mva — katalogpris = FULL PRIS, rabatt trekkes på ordre/faktura.)
- **27 479 varer har Eurokode** (= bilglass) · **5 604 uten** (= tilbehør, viskersett, frakt, emballasje).
- **Kategorier** (nøkkelord i varenavn): glass/annet 24 780 · dørrute 3 434 · bakrute 1 511 · siderute 1 012 · frontrute 623 · pyntelist 471 · ventilrute 424 · viskersett 266 · klips 198 · primer 77 · frakt 59 · lim 43.
- **Topp bilmerker** (antall varer): FORD 2 075 · MERCEDES 1 902 · TOYOTA 1 717 · VW 1 683 · BMW 1 474 · OPEL 1 308 · AUDI 1 185 · RENAULT 938 · PEUGEOT 908 · NISSAN 854 · HONDA 797 · MAZDA 784 · VOLVO 769.

**Viktige konvensjoner avdekket i prislisten:**

1. **Sensorgel/sensortape = «S»-serien.** 88 varer heter eksplisitt «SENSORGEL» (f.eks. 1850S CITROEN XANTIA, 2123S SAAB 9-5), og 70 til heter «SENSORTAPE»/«SENSOR PAD» med alias mot S-nummer: `1580 = S1`, `21111 = S4`, `BRUK S3`, `BRUK S8`. Bekrefter at S+tall (S1/S3/S4/S8) er produktkodene, og at sensortape = sensorgel (Tom-korrigering).
2. **«BRUK <varenr>»-konvensjonen** (945 varer) = erstatnings-/alias-referanse: «BRUK 1158K» betyr «bruk varenummer 1158K i stedet». Engelsk variant «USE» finnes på US-import (502 varer). Ordremottakeren må behandle «BRUK X» som en peker til X, ikke som et eget glass.
3. **Sotet-grad i kommentarfeltet:** `#-10%#`, `#-5%#` osv. (lystransmisjon), `EMB` = emballasje (2 670 varer), `NB` = merknad (1 942 varer).

