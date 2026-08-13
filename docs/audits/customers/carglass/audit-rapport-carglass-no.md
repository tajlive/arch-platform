# Audit-rapport — carglass.no

**Dato:** 2026-08-13
**Utført av:** Arch (utenfor-inn analyse, uautentisert)
**Formål:** Ærlig gjennomgang av nettbutikken — teknikk, sikkerhet, fart, innhold og brukervennlighet.

> **Slik leser du rapporten:** alle tekniske ord og forkortelser er forklart i vanlig norsk første gang de brukes. Alt som er målt er faktiske målinger, ikke synsing.

---

## 1. Helhetskarakter: 81 av 100

| Område | Poeng (0–100) | Forklaring |
|---|---|---|
| Fart | 60 | Grei, men tung side med mye ekstern programvare |
| Sikkerhet | 80 | Godt beskyttet |
| Brukervennlighet / mobil | 100 | Fungerer godt på mobil og desktop |
| Tilgjengelighet | 60 | God, men noen knapper mangler navn for skjermlesere |
| Synlighet på Google (SEO) | 100 | Tilnærmet perfekt |
| Pålitelighet | 100 | Ingen nedetid, alle sider svarte |
| Tillit / personvern | 100 | Godt ivaretatt |

**Bunnlinje:** carglass.no er den klart beste av de tre nettbutikkene jeg sammenlignet. Den er moderne, godt beskyttet og svært synlig på Google. Det eneste som trekker ned er farten og et par mindre tilgjengelighetsfeil.

---

## 2. Sikkerhet — 🟢 godt beskyttet

- ✅ **«Content-Security-Policy» er på plass** — en svært detaljert beskyttelse som bestemmer nøyaktig hva nettsiden har lov til å laste, og fra hvilke leverandører. Dette blokkerer ondsinnet kode.
- ✅ **Tvungen kryptering (HSTS) er slått på med «preload»** — det sterkeste nivået. Nettleseren tvinges til å bruke kryptert forbindelse, alltid.
- ✅ **Versjonsnummer på programvaren er skjult** — hackere får ikke vite hvilken versjon som kjører (det gjør det vanskeligere å angripe).
- ✅ «X-Frame-Options» og «X-Content-Type-Options» (beskyttelse mot å bli lagt inn i andre nettsider) er på plass.
- ✅ «Referrer-Policy» er på plass.

**Ingen kritiske sikkerhetsfunn.**

---

## 3. Fart — 🟡 eneste svake punkt

- Siden er **tung** — den laster inn mye ekstern programvare (analyseverktøy, chat, markedsføring, kart osv.). Det betyr at det tar litt tid før alt er lastet.
- ✅ Caching er **slått på** (`cache-control: public, max-age=900`), så gjengangere slipper å laste alt på nytt hver gang.
- Bildene er i moderne format og har beskrivelsestekst (se under).

---

## 4. Synlighet på Google (SEO) — 🟢 tilnærmet perfekt (100/100)

Dette er carglass.no sin største styrke:

- ✅ **God tittel:** «Skifte og reparasjon av alle typer bilglass | Hurtigruta Carglass®» — kort og presis.
- ✅ **Sidebeskrivelse finnes:** «Hurtigruta Carglass® er spesialister på steinsprutskader og sprekk i frontrute. Du kan raskt og enkelt booke time online her.»
- ✅ Mobilinnstillingen er riktig (zoom er **ikke** sperret).
- ✅ Strukturert data (skjult info som hjelper Google) er på plass.

---

## 5. Tilgjengelighet — 🟡 god, men to feil

- ✅ 27 bilder på forsiden, og **alle** har beskrivelsestekst («alt-tekst») for skjermlesere.
- 🟡 To mindre feil:
  1. **Noen knapper mangler navn** som skjermlesere kan lese opp (knapper som bare består av et ikon).
  2. **Tilgjengelighetstreet er ikke helt ryddig** (en teknisk struktur skjermlesere bruker; gjør det litt vanskeligere å navigere).

---

## 6. Innhold og tekster — 🟢 profesjonelt

- Tekstene er korte, klare og salgsrettede («book time online her»).
- God struktur med tydelig hensikt (skifte vs. reparasjon av bilglass).
- Moderne innhold, ingen åpenbare feil eller utdaterte påstander funnet i utenfor-inn-gjennomgangen.

---

## 7. Anbefalinger (prioritert rekkefølge)

| # | Tiltak | Hvor viktig |
|---|---|---|
| 1 | Gjør siden lettere (færre/redundante eksterne skript) for raskere lasting | 🟡 Viktig |
| 2 | Gi ikon-knapper lesbare navn for skjermlesere | 🟢 Bra å fikse |
| 3 | Rydd i tilgjengelighetstreet | 🟢 Bra å fikse |

---

## 8. Tekniske detaljer (for utviklere)

- Server: openresty. Headere: `content-security-policy` (detaljert), `strict-transport-security: max-age=31536000; preload`, `cache-control: public, max-age=900, stale-while-revalidate=600`.
- Lighthouse (mobil): Accessibility 95, Best Practices 100, SEO 100.
- Arch Website Score: 81 % (Security 80, Performance 60, UX 100, Accessibility 60, SEO 100, Reliability 100, Trust 100).
