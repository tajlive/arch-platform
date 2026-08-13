# Audit-rapport — auto-glass.no

**Dato:** 2026-08-13
**Utført av:** Arch (utenfor-inn analyse, uautentisert + innlogget varesøk)
**Formål:** Ærlig gjennomgang av nettbutikken — teknikk, sikkerhet, fart, innhold og brukervennlighet.

> **Slik leser du rapporten:** alle tekniske ord og forkortelser er forklart i vanlig norsk første gang de brukes. Alt som er målt er faktiske målinger, ikke synsing.

---

## 1. Helhetskarakter: 69 av 100

| Område | Poeng (0–100) | Forklaring |
|---|---|---|
| Fart | 60 | Siden laster greit (~1 sekund), men henter alt på nytt hver gang |
| Sikkerhet | 50 | Gammel programvare med kjente hull |
| Brukervennlighet / mobil | 100 | Fungerer godt på mobil og desktop |
| Tilgjengelighet | 60 | God, men zoom er sperret og én overskrift mangler |
| Synlighet på Google (SEO) | 63 | Mangler sidebeskrivelser og noen sider er døde |
| Pålitelighet | 100 | Ingen nedetid, alle sider jeg testet svarte |
| Tillit / personvern | 80 | Bra, men mangler én beskyttelse |

**Bunnlinje:** auto-glass.no er en ærlig og innholdsmessig solid B2B-nettbutikk, men den er **teknisk gammel (fra 2018) og har reelle sikkerhetshull**. Den viktigste funksjonen — å søke opp riktig glass — fungerer fint.

---

## 2. Sikkerhet — 🔴 her er problemene

Nettbutikken er bygget på programvare som er **7 år gammel** og ikke lenger får sikkerhetsoppdateringer. Det kan sammenlignes med en bil som ikke har vært på EU-kontroll siden 2018.

**Hva jeg fant (fakta, målt direkte på siden):**

1. **WordPress 4.9.31** — selve «motoren» i nettsiden. Versjonen er fra 2018 og får **ikke** sikkerhetsoppdateringer lenger. Navnet og versjonsnummeret står åpent i nettsidens kode, synlig for alle (også hackere).
2. **WooCommerce 3.4.8** — programmet som driver nettbutikken (handlekurv, ordre). Også fra 2018.
3. **Innloggingssiden ligger åpen** (`wp-login.php`) — hackere kan automatisk prøve å gjette passord.
4. **Blandet innhold (kritisk):** siden er kryptert (https), men laster **noe** innhold over ukryptert (http). Det er som å sende noen brev i åpne konvolutter mens resten er forseglet. Dette er det ene **kritiske** funnet og bør fikses først.
5. **Manglende «Content-Security-Policy»** — en beskyttelse som sier hva nettsiden har lov til å laste. Uten den er det lettere for ondsinnet kode å snike seg inn.

**Det som heldigvis er gjort riktig:**
- En kjent angrepsvei («XML-RPC») er blokkert.
- En annen («readme.html») er blokkert.
- «HSTS» (tvungen kryptering) er slått på.
- «Referrer-Policy» og «X-Frame-Options» (beskyttelse mot å bli lagt inn i andre nettsider) er på plass.

---

## 3. Fart — 🟡 grei, men sløser bort

- Siden laster på **omtrent 1 sekund**, noe som er helt OK for brukeren.
- Men siden laster **49 filer hver eneste gang** uten å huske noe i mellom («caching» er avslått). Tilbakevendende kunder må derfor laste alt på nytt hver gang.
- Bildene bruker et **gammelt format** (JPG/PNG) i stedet for moderne (WebP), som ofte er 25–50 % mindre.
- Noen bilder er lastet opp helt tilbake i **2017** (logo, forsidebildet).

---

## 4. Synlighet på Google (SEO) — 🟡 bra, men med hull

- **Ingen sidebeskrivelse** («meta description») er lagt inn. Det betyr at når siden dukker opp i Google, står det ingen forklarende tekst under tittelen. Jeg sjekket forsiden, om-oss og min-konto — alle manglet dette.
- Nettadresse-tittelen gjentar seg selv: «Autoglass AS – Vi kan bilglass – Autoglass».
- **Fire sider finnes ikke** (gir «side ikke funnet», feilkode 404): `kontakt-oss`, `priser`, `levering`, `garanti`. Kunder som klikker seg inn på disse får en død side.
- Overskriftsstrukturen hopper over nivåer (dårlig for både Google og skjermlesere).
- ✅ Det som er bra: siden har «strukturert data» (skjult info som hjelper Google forstå hva firmaet er) — både «WebSite» og «Organization».

---

## 5. Tilgjengelighet — 🟡 god, men to feil

Tilgjengelighet = om siden også kan brukes av folk med nedsatt syn, motorikk osv.

- **Zoom er sperret på mobil.** Nettleserens innstilling sier «maksimum forstørrelse = 1.0», som betyr at svaksynte ikke kan forstørre teksten. Dette er et reelt tilgjengelighetsbrudd.
- Siden mangler et «main»-landemerke (en usynlig markør som skjermlesere bruker for å hoppe rett til hovedinnholdet).
- Én hovedoverskrift er tom.
- 2 av 4 bilder mangler beskrivelsestekst («alt-tekst») som skjermlesere leser opp for blinde.

---

## 6. Innhold og tekster — 🟢 sterkt, men noen tall bør dobbeltsjekkes

- **Kontaktinformasjonen er riktig:** telefon +47 21 37 83 90, post@auto-glass.no, Ole Deviks vei 26, Oslo, organisasjonsnummer 968 552 732.
- «Om oss»-teksten er god og tillitsvekkende.
- **Påstander som bør verifiseres** (kunder kan sjekke dem, så de må stemme): «over 130 000 ruter på lager», «trippel AAA rating», «raskest voksende og mest lønnsomme».
- Nyhetssiden viser **gammelt innhold** (blant annet «Vi sponser en racerbil»).
- Skjemaet «Bli kunde» har et skjult-felt som skal være usynlig, men som faktisk **er synlig** («Dette feltet er for valideringsformål og skal stå uendret»). Det ser uprofesjonelt ut og bør skjules.
- Siden er tospråklig (norsk/svensk) med «Svensk»-knapp og «Hovedside» — dette er bevisst og OK.

---

## 7. Bilder — 🟡 få og små, men gamle

- Siden har bare **4 bilder** på forsiden, alle små (1–30 KB).
- 2 av dem mangler beskrivelsestekst for skjermlesere.
- De er i gammelt format (JPG/PNG) og lastet opp i 2017.

---

## 8. Innlogget test — 🟢 kjernen virker

Jeg logget inn med kundekontoen og testet det viktigste:

- ✅ **Søk på registreringsnummer fungerer** — testet «EV21734», fant riktig bil (Jaguar I-Pace 2019) med 15 glassvarianter og priser.
- ✅ Varekortene viser riktig informasjon og tilbehør.

Så den viktigste funksjonen for B2B-kundene — å finne riktig glass — **virker**.

---

## 9. Anbefalinger (prioritert rekkefølge)

| # | Tiltak | Hvor viktig |
|---|---|---|
| 1 | Fiks krypteringsfeilen (blandet http/https) | 🔴 Kritisk |
| 2 | Oppdater WordPress + WooCommerce til dagens versjon | 🔴 Kritisk |
| 3 | Beskytt innloggingssiden mot automatiske angrep | 🟡 Viktig |
| 4 | Legg inn sidebeskrivelser for Google + fiks de 4 døde sidene | 🟡 Viktig |
| 5 | Fjern/skjul «valideringsfeltet» i «Bli kunde»-skjemaet | 🟡 Viktig |
| 6 | Tillat zoom på mobil + legg inn alt-tekster | 🟢 Bra å fikse |
| 7 | Verifiser tallene i «Om oss» + oppdater nyhetssiden | 🟢 Bra å fikse |
| 8 | Slå på caching + moderne bildeformat (WebP) | 🟢 Bra å fikse |

---

## 10. Tekniske detaljer (for nettbutikk-leverandøren)

- WordPress 4.9.31 (EOL), WooCommerce 3.4.8, jQuery 1.12.4, Font Awesome 4.7.0, FlexSlider 2.6.3, GDPR-cookie-compliance 1.1.2, Facebook SDK v2.11.
- 49 ressurser, ~633 KB overført, TTFB 351 ms, FCP 588 ms, load 1017 ms.
- Headere: `cache-control: public, no-cache` (ingen caching), mangler `content-security-policy`.
- Lighthouse (mobil): Accessibility 90, Best Practices 100, SEO 92.
