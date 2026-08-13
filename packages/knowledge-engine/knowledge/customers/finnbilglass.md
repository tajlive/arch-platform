# Finnbilglass — kunde/leveranse #3 (B2C bilglass-salg uten forsikring)

## Fakta (2026-08-13)

- **Konsept:** Salg av bilglass til privatpersoner **uten forsikringsdekning** for glasskade.
- **Segment:** B2C — direkte til sluttkunde (ikke grossist, ikke montør-kjede).
- **Domene:** `finnbilglass.no` — registrert hos **Domeneshop**.
- **GitHub:** `tajlive/finnbilglass` (opprettet 2026-08-13, Project Factory v2.1).
- **Lokalt:** `/Users/taj/finnbilglass`.

## Verdi / posisjon

Forsikring er normalt veien folk får ny frontrute (egenandel via kasko/glassdekning). Finnbilglass fanger dem som **ikke har dekning** og ellers må betale full pris — tilbyr enkel vei til riktig glass (regnr/VIN) + pris + bestilling.

## Relasjon til Autoglass AS

- Autoglass AS (`tajlive/autoglassgrossisten`) er B2B-grossisten — leverandør/kilde for glass.
- **Glass-katalogen kan gjenbrukes** (D1 `glass_catalog` + `autoglass_prisliste`, 27 000+ glass).
- Samme tekniske mønster: React/Vite + Cloudflare Worker + D1 + ordremottaker-AI.

## Status

Scaffoldet (`.arch/`, docs, CI-mal) — ingen kode/deploy ennå. Åpent: teknologistack-bekreftelse, domeneshop DNS-peking til hosting, monteringspartner (leveres glasset eller monteres det?).

## Markedslandskap (kontekst)

Nærmeste modeller: Carglass/Glassdrive/Ryds (forsikringsbaserte montør-kjeder) og Bilglassgruppen/auto-glass.no (B2B). Finnbilglass fyller et nisjehull: **privatkjøp av glasset uten forsikring og uten montasje**.
