# Toma (Tomagruppen) — Deep-dive del 2: org-kart, Trondheim-basen, teknologi, konkurranse

> 2026-08-13 · Utenfor-inn · Alle funn kildebelagt (brreg API, toma.no, hvass.no, Doffin, Arch Website Audit)

## 1. Org-kart (fra toma.no/kontakt-oss — fullt navn + rolle + e-post)

**Konsernledelse:**
| Navn | Rolle | Relevans for Arch |
|---|---|---|
| Frode Monsen | Konsernsjef | Sluttbeslutningstaker |
| **Åsmund Eikli** | **CIO, Tomagruppen** («IT & Digitalisering») | **Den interne digitale kjøperen** |
| **Gunnar Harris-Christensen** | Chief Revenue Officer («Strategi og M&A») | M&A = ISS-integrasjonens ansvarlige |
| Fredrik Duus | Divisjonsdirektør FM (FM + Kantine) | Eskils divisjonssjef |
| Roar Hall / Arne Rud | Konserndirektører Renhold / Eiendomsdrift | |
| Line Cecilie Sorkness Molland | Konserndirektør HR & HMSK | HMS/arbeidsmiljø |
| Christer Gavelli | Adm. dir. Toma Facility Norge | |
| Allan Christoffersen | Adm. dir. Toma Facility Danmark | |
| **Lars Furu** | **Direktør Innkjøp og Prosjekter** | **Anbuds-AI-målet (innkjøp + prosjekter)** |
| **Marte Bjelland** | **Leder for bærekraft** | **Matsvinn-AI-målet (bærekraftseier)** |
| Atefeh Sori | Personvernombud | GDPR-gate for AI-pilot |

**Trondheim/Midt:**
- **Eskil Henriksen** — Regionsdirektør Food & support Midt (Trondheim) — Toms kontakt. (Står ikke på kontakt-siden — divisjonen listes ikke, men rollen er bekreftet på LinkedIn + Doffin.)
- **Per-Erik Larsen** — Avdelingsleder / Eiendomssjef **Trondheim** (+47 454 91 984) — Trøndelag eiendomsdrift.
- Salgsapparat: regiondirektører for ALLE regioner (Vestland, Rogaland, Agder, Innlandet, Møre og Romsdal, Nordland, Troms og Finnmark, Øst, Østfold) — men ingen egen «Midt»-person utover Eskil/Per-Erik på offentlig side.

## 2. Trondheim-basen: NRS Norge AS

- **NRS Norge AS** (org 977340950, **Trondheim/Tiller, Torgardsvegen 9B**, **260 ansatte**, renhold) — Toma sitt Midt-Norge-oppkjøp («Vi styrker markedsposisjonen i Midt-Norge gjennom oppkjøp av NRS Norge»). Dette er Toma sin fysiske Trondheim-base.
- Trondheim-virksomheten = NRS (renhold, 260) + Food & support Midt (Eskil, kontraktskantiner inkl. Lerka) + Eiendomsdrift Trondheim (Per-Erik). Est. ~300+ ansatte i Trondheim.

## 3. Konsernets andre merke: Hvass

- **Hvass AS** (org 886938772, Oslo, Sandstuveien 68, 290 ansatte): «selvstendig enhet i Tomagruppen» — renhold & hygiene, lunsj & kantine, vertskap & vedlikehold. Eget merke + eget nettsted hvass.no (Østlandet/SMB-segment).
- **Arch Website Audit av hvass.no: 57 %** — med **1 KRITISK funn: blandet innhold (http-ressurser på https-side)** + 7 høy ROI. UX/Mobile 50 %. Dårligere enn toma.no (70 %).
- Konklusjon: konsernet har TO nettsider med svakheter — pitch-evidence dobles.

## 4. Teknologistack (Arch Website Audit-evidence)

- toma.no: **WordPress** (CMS) + **BunnyCDN** (CDN/hosting, server-header «BunnyCDN-NO1-830») + Google Analytics/Tag Manager. Ingen rammeverks-signatur.
- Kantineapp: **Kanpla-hvitlabel** (TWA, dk.kanpla.toma.twa) — bestilling/meny/POS via tredjepart.
- Signal: et NOK 2,8 mrd-konsern på WordPress + leid kantineplattform + manuell lead-ruting = betydelig digitalt modningsrom. CIO Åsmund Eikli har mye å bygge (eller kjøpe).

## 5. Historie som salgsammunisjon (fra toma.no/om-toma/historie)

- TOMA = **To**re Monsen + **Ma**ds Madsen (grunnleggerne 1978). Tore ble 100 % eier 2001.
- Kantine/forpleining kom inn via kjøpet av **Albatross Forpleining**; Camps/Kantine/Personalrestaurant vokste derfra.
- **Ironien:** Toma kjøpte i sin tid **ISS Direct** i Danmark (+ Den Rene Linje, Lev-Vel) — nå kjøper ISS dem. Partene kjenner hverandre godt.
- Kundereferanser over tid: Statoil, Norsk Hydro, Kollsnes (Sotra), **Esso-raffineriet Vestfold (kontrakt fortsatt aktiv)**, Hurtigruten, Color Line, Vestlandske Sjøforsvarsdistrikt (10 år), Avinor.
- Siste oppkjøp: Elitevask + Allianceplus → >NOK 2,5 mrd omsetning.
- Ferskt (forsiden): **Toma Camps tok 3 ISO-sertifiseringer samtidig** (kvalitet, miljø, HMS) + **kantina hos robotselskapet 1X Technologies** bygget med NAV-rekruttering («kantinesuksess») — AI-robotselskap som kunde = kulturell bro for Arch.

## 6. Avinor-anskaffelsen (konkurransebildet)

- Avinor utlyste kantinetjenester i **TRE avtaler** (OSL Gardermoen + Oslo Kontrollsentral Røyken + Flysikring) — Doffin K-192868/2025-120124. **Eskil Henriksen = Toma sin kontakt i anskaffelsen.**
- Konkurrent: **Coor vant renholdet på OSL** (feb 2026, ~NOK 100 mill/år) — Coor er aktiv aggressor i Avinor-porteføljen.
- Avinor har i tillegg nylig lyst ut servering/kiosk-kontrakter for **NOK ~3,5 mrd** (8 lufthavner, 35 kontrakter) + Duty Free (EUR ~4 mrd, 8 år) — det offentlige FM/kantine-markedet er i stor bevegelse akkurat nå.
- Hvem vant kantine-avtalene: ikke offentlig kunngjort i de kildene som er tilgjengelige utenfor-inn (UNKNOWN).

## 7. Status ISS-fusjonen (per 2026-08-13)

- Fortsatt IKKE fullført: Toma skriver «betinget av godkjenning fra Konkurransetilsynet»; ingen kunngjøring av vedtak funnet; danske KFST markedshøring 10.–19.6.2026. Timing-vinduet (selg til Toma FØR closing) står åpent.

## 8. Oppdatert mulighetskart (del 2-justeringer)

- **To målgrupper internt:** Eskil (region, operasjon) OG Åsmund Eikli (CIO — eier digitalt). Pitch til Eskil = matsvinn/operasjon; pitch til Åsmund = integrasjonsberedskap/data-eierskap. Møt begge.
- **Hvass-auditen** = en ekstra gratis leveranse som viser bredde («vi har allerede analysert begge merkevarene deres»).
- **Bærekrafts-rapporten** (Marte Bjelland) — Toma rapporterer allerede bærekraft («Bærekraft må være praktisk»); matsvinn-AI gir dem dokumenterbare tall å rapportere. ESG-rapportering + ISS-krav (ISS er børsnotert, har strenge ESG-rapporter) = regulatorisk medvind.
- **1X Technologies-kantina** som referansepunkt i pitchen: «dere bygger kantine for et AI-robotselskap — la Arch bygge AI for kantinen deres».
