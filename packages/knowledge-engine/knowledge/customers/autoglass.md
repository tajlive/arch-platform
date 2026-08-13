# Autoglass AS — kunde #2 (B2B bilglassgrossist)

Dato: 2026-08-13 · Kontakt: Eduard Eikeland (eduard@auto-glass.no, 40408241) · Org.nr 968 552 732

## Profil

- **Produkt:** Bilglass + tilbehør (klips, pyntelist, lim, primer, sensorgel) til verksteder.
- **Forretningsmodell:** **B2B-grossist** — selger glass til 500+ verksteder, **monterer IKKE selv**. Kun B2B-priser (kundens rabatt trekkes på ordre/faktura).
- **Nettbutikk:** auto-glass.no — WooCommerce/WordPress (gammel stack, se audit).
- **Katalog:** 27 184 produkter (glass + viskersett + klips/pyntelister).
- **Kontakt:** +47 21 37 83 90, post@auto-glass.no, Ole Deviks vei 26, Oslo.

## Ark-rolle

Første **eksterne** Arch-kunde. Produktet under bygging: **senior AI-ordremottaker** (stemme-simulering → senere telefoni) som søker live på auto-glass.no (regnr/rutenummer/eurocode), presenterer pris + Oslo-lager i dialogen, og tar B2B-ordrer. PROD-kode: `/Users/taj/bilglass-worktrees/customer-ai-chat` (branch `feat/customer-ai-chat`, CF Worker `autoglass-glass-sok`).

## Klassifisering — viktig (Tom 2026-08-13)

**Skille B2B bilglassgrossist fra montør-kjede.** De er ikke samme markedssegment:

| Type | Firma | Kunde | Nettbutikk-mål |
|---|---|---|---|
| **B2B-grossist** | Autoglass AS (auto-glass.no) | Verksteder | Rask katalog-/ordre-tilgang, B2B-priser, lager-status |
| **B2B-grossist** | Bilglassgruppen AS (bilglassgruppen.no) | Verksteder | Samme som over |
| **Produsent/distributør (originalglass, B2B)** | Saint-Gobain (Sekurit) | Grossister/verksteder | Distribuerer ORIGINALE Sekurit-bilglass B2B |
| **Montør-kjede (B2C)** | Carglass (carglass.no) | Sluttkunde | Booke time online, betaling, merkevare |
| **Montør-kjede (B2C)** | Riis Bilglass AS (bilglass.no) | Sluttkunde | Norges største kjede, ~200 avdelinger |
| **Montør-kjede (B2C)** | Glassdrive (glassdrive.no) | Sluttkunde | Montørbedrift |

**Konsekvens for audit:** en grossist-nettbutikk og en montør-nettbutikk har ulik suksessmålestokk. Auto-glass.no sin **direkte konkurrent er Bilglassgruppen** (begge B2B-grossister) — der vinner Auto-glass (69 vs 60). Carglass, Riis Bilglass og Glassdrive er i montør-segmentet (ikke direkte konkurrenter). Saint-Gobain Sekurit er ett nivå opp i verdikjeden (originalglass-produsent/distributør) og selger B2B til grossister/verksteder.

## Nøkkelfakta (verifisert 2026-08-13, website-audit)

- Arch Website Score: **69/100** (benchmark: carglass 81, bilglassgruppen 60).
- Lighthouse (mobil): A11y 90, Best Practices 100, SEO 92.
- Kritisk funn: blandet innhold (http på https) + WordPress 4.9.31 EOL / WooCommerce 3.4.8 (2018-stack, kjente sikkerhetshull).
- Innlogget søk på regnr **fungerer** (EV21734 → Jaguar I-Pace 2019, 15 glassvarianter).
- Rapporter: `docs/audits/customers/{autoglass,carglass,bilglassgruppen}/audit-rapport-*.md`.
