# Audit-rapport — bilglassgruppen.no

**Dato:** 2026-08-13
**Utført av:** Arch (utenfor-inn analyse, uautentisert)
**Formål:** Ærlig gjennomgang av nettbutikken — teknikk, sikkerhet, fart, innhold og brukervennlighet.

**Forretningsmodell:** 🏭 **B2B bilglassgrossist** — selger glass til verksteder, monterer ikke selv. Direkte konkurrent til **Autoglass (auto-glass.no)**, som også er grossist.

> **Slik leser du rapporten:** alle tekniske ord og forkortelser er forklart i vanlig norsk første gang de brukes. Alt som er målt er faktiske målinger, ikke synsing.

---

## 1. Helhetskarakter: 60 av 100

| Område | Poeng (0–100) | Forklaring |
|---|---|---|
| Fart | 60 | Grei, men ingen caching |
| Sikkerhet | 30 | Mangler flere grunnleggende beskyttelser |
| Brukervennlighet / mobil | 100 | Fungerer godt på mobil og desktop |
| Tilgjengelighet | 75 | God, men kontrast- og størrelsesfeil |
| Synlighet på Google (SEO) | 50 | Mangler sidebeskrivelse og strukturert data |
| Pålitelighet | 67 | Ødelagte interne lenker |
| Tillit / personvern | 40 | Mangler personvernbeskyttelser |

**Bunnlinje:** bilglassgruppen.no er den svakeste av de tre. Siden har ødelagte linker, mangler grunnleggende sikkerhets- og SEO-beskyttelser, og tittelen er repetitiv. Det er likevel en fungerende side, og programvaren er ny (noe som er et pluss).

---

## 2. Sikkerhet — 🔴 flere hull

- 🔴 **Mangler «Content-Security-Policy»** — beskyttelsen som bestemmer hva nettsiden har lov til å laste. Uten den er det lettere for ondsinnet kode å snike seg inn.
- 🔴 **Mangler «HSTS»** (tvungen kryptering). Nettleseren kan derfor i teorien havne på en ukryptert versjon av siden.
- 🔴 **Versjonsnummeret står åpent** i koden («WordPress 7.0.4»), synlig for alle. (Versjonen i seg selv er ny og god — men å vise den hjelper hackere.)
- ✅ Cloudflare sitter foran (et ekstra beskyttelseslag).
- ✅ «Referrer-Policy» er på plass.

**Merk:** det mest alvorlige er manglende CSP og manglende HSTS — dette er grunnleggende beskyttelse som alle moderne nettbutikker bør ha.

---

## 3. Fart — 🟡 grei, men sløser bort

- Siden laster greit, men **caching er avslått** (`cache-control: max-age=0`). Tilbakevendende kunder må laste alt på nytt hver gang.
- 7 bilder på forsiden, alle med beskrivelsestekst (positivt).

---

## 4. Synlighet på Google (SEO) — 🟡 svakt

- 🔴 **Ingen sidebeskrivelse** («meta description»). Når siden dukker opp i Google, står det ingen forklarende tekst under tittelen.
- 🟡 **Tittelen gjentar seg selv to ganger:** «Bilglassgruppen AS – Norges ledende leverandør av bilglass – Bilglassgruppen AS – Norges ledende leverandør av bilglass». Dette ser rotete ut i Google-resultatet.
- 🔴 **Ingen strukturert data** (skjult info som hjelper Google forstå hva firmaet er).
- 🟡 **Ødelagte interne linker** — enkelte klikk inne på siden fører til døde sider.

---

## 5. Tilgjengelighet — 🟡 god, men noen feil

- ✅ 7 bilder, alle med beskrivelsestekst for skjermlesere.
- 🟡 **Kontrastfeil** — enkelte tekster har for liten kontrast mellom tekstfarge og bakgrunn (vanskelig å lese for svaksynte).
- 🟡 **Trykkflater for små** — noen knapper er for små til å treffe på mobil (Apple anbefaler minst 44×44 punkter).
- 🟡 **Overskriftsstrukturen hopper over nivåer** (dårlig for skjermlesere og Google).
- 🟡 Enkelte knapper har et synlig navn som ikke samsvarer med det skjermleseren leser opp.

---

## 6. Innhold og tekster

- Kontaktinformasjonen er til stede.
- «Norges ledende leverandør av bilglass» brukes som slagord — en påstand som bør kunne underbygges.
- Ingen åpenbare stavefeil funnet i utenfor-inn-gjennomgangen.

---

## 7. Anbefalinger (prioritert rekkefølge)

| # | Tiltak | Hvor viktig |
|---|---|---|
| 1 | Legg til «Content-Security-Policy» + «HSTS» (tvungen kryptering) | 🔴 Kritisk |
| 2 | Fiks de ødelagte interne lenkene | 🟡 Viktig |
| 3 | Skjul versjonsnummeret i koden | 🟡 Viktig |
| 4 | Legg inn sidebeskrivelse + strukturert data for Google | 🟡 Viktig |
| 5 | Fiks den repetitive tittelen | 🟡 Viktig |
| 6 | Fiks kontrast + trykkflatestørrelser | 🟢 Bra å fikse |
| 7 | Slå på caching | 🟢 Bra å fikse |

---

## 8. Tekniske detaljer (for utviklere)

- WordPress 7.0.4 (ny versjon, men eksponert i generator-tag). Server: Cloudflare.
- Headere: `cache-control: max-age=0` (ingen caching), mangler `content-security-policy` og `strict-transport-security`.
- Ingen JSON-LD (strukturert data).
- Lighthouse (mobil): Accessibility 92, Best Practices 100, SEO 92. Feilede: color-contrast, heading-order, label-content-name-mismatch, target-size, meta-description.
- Arch Website Score: 60 % (Security 30, Performance 60, UX 100, Accessibility 75, SEO 50, Reliability 67, Trust 40).
