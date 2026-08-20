# Arch Pre-Beta Audit — Melhus Bil Trondheim AS

**Dato:** 2026-08-20  
**Metode:** Offentlige kilder (Brønnøysund Enhetsregisteret + nettsideanalyse)  
**Regler overholdt:** Ingen kontakt, ingen antakelser, fakta/signal/hypotese/spørsmål adskilt, ingen falske AI-funn.

---

## 1. Company X-Ray

| Felt | Verdi | Kilde |
|------|-------|-------|
| Org.nr | 944638741 | Brønnøysund |
| Navn | MELHUS BIL TRONDHEIM AS | Brønnøysund |
| Org.form | Aksjeselskap (AS) | Brønnøysund |
| Næring | 95.310 Reparasjon og vedlikehold av motorvogner | Brønnøysund |
| Stiftet | 1987-06-30 | Brønnøysund |
| Ansatte | 74 (total) | Brønnøysund |
| Underenhet Salg | 35 ansatte — Detaljhandel med motorvogner | Brønnøysund |
| Underenhet Verksted | 39 ansatte — Reparasjon/vedlikehold | Brønnøysund |
| Hjemmeside | www.melhusbil.no | Brønnøysund |
| MVA-registrert | Ja | Brønnøysund |
| Status | Aktiv (ikke konkurs/avvikling) | Brønnøysund |
| Siste årsregnskap | 2025 (innsendt) | Brønnøysund |
| Daglig leder | Rune Hagen | Brønnøysund roller |
| Styre | Rune Vikvald, Kåre Vikvald | Brønnøysund roller |
| Adresse | Tungasletta 8, 7047 Trondheim | Brønnøysund |

**Viktig korreksjon til antakelsen:** Melhus Bil er **bilforhandler med verksted** (Ford, F-150, BYD, Renault, Alpine, Dacia, Suzuki, Kia), ikke et rent bilglass-firma. Det er likevel en svært relevant automotive-case — verksted + salg + deler = mange repeterende administrative prosesser.

---

## 2. Evidence Table (fakta vs signal vs hypotese)

| # | Observasjon | Type | Kilde | Confidence |
|---|-------------|------|-------|-----------|
| E1 | 74 ansatte fordelt på 2 underenheter (salg 35, verksted 39) | FAKTA | Brønnøysund | HØY |
| E2 | Næring 95.310 (reparasjon motorvogner) | FAKTA | Brønnøysund | HØY |
| E3 | Nettside på WordPress | FAKTA | nettside (generator) | HØY |
| E4 | Nettside har live chat + telefon + epost | FAKTA | nettside | HØY |
| E5 | Nettside har IKKE synlig digital booking/tidsbestilling | SIGNAL | nettside (fravær) | MEDIUM |
| E6 | Nettside har IKKE synlig kontaktskjema (`<form>`) | SIGNAL | nettside (fravær) | MEDIUM |
| E7 | Forhandler 7 bilmerker (Ford, BYD, Renault, Alpine, Dacia, Suzuki, Kia) | FAKTA | nettside title | HØY |
| E8 | Verksted = 39 av 74 ansatte (53 %) | FAKTA | Brønnøysund | HØY |
| E9 | Etablert 1987 (39 år drift) | FAKTA | Brønnøysund | HØY |
| E10 | Siste årsregnskap 2025 (regnskapspliktig, aktiv) | FAKTA | Brønnøysund | HØY |

**Merk om signaler:** E5 og E6 er fravær-signaler (ikke funnet i HTML-en). Fravær av et skjema er et *svakt* signal — nettsiden kan ha booking et annet sted (tredjepart). Dette skal IKKE presenteres som funn før verifisert.

---

## 3. Potential Improvement Areas (hypoteser, IKKE funn)

Basert på observerbare signaler, formulert som **hypoteser** som må verifiseres i samtale:

| # | Hypotese | Basert på | Krever verifisering |
|---|----------|-----------|---------------------|
| H1 | **Kundedialog via telefon/chat** kan ha høy manuell belastning (verksted = 39 ansatte håndterer kunder) | E4, E8 | Hvor mange henvendelser per dag? |
| H2 | **Timebooking/verkstedtime** kan være delvis manuell (ingen synlig digital booking) | E5, E8 | Hvordan booker kunder verkstedtime i dag? |
| H3 | **Ordre-/fakturahåndtering** for 7 bilmerker + deler kan være arbeidsflyt-tung | E7, E2 | Hvilke systemer (ERP/DMS) brukes? |
| H4 | **Forsikring-/skadeoppgjør** (bilforhandler) kan ha dokumentflyt | E2, E7 | Hvor mye tid på skadeoppgjør? |
| H5 | **Kundestatus/oppfølging** (servicepåminnelser, EU-kontroll) kan være manuell | E2 | Hvordan følges kunder opp i dag? |

---

## 4. Questions for First Meeting (sparsomme, formålsdrevne)

Hvert spørsmål har et eksplisitt formål (QuestionDecision-prinsippet):

| # | Spørsmål | Formål |
|---|----------|--------|
| Q1 | «Hvor kommer flest kundehenvendelser fra i dag — telefon, chat, epost?» | IDENTIFY_PROCESS + REDUCE_UNCERTAINTY |
| Q2 | «Hvordan booker en kunde verkstedtime i dag?» | IDENTIFY_PROCESS (verifiser H2) |
| Q3 | «Hvilket system bruker dere for ordre, faktura og delelager?» | IDENTIFY_SYSTEM (verifiser H3) |
| Q4 | «Hvor mye tid går til skadeoppgjør og forsikringsdialog?» | QUANTIFY_VALUE (verifiser H4) |
| Q5 | «Hvordan minner dere kunder om service og EU-kontroll?» | IDENTIFY_PROCESS (verifiser H5) |

**Ikke spør:** «Hvor mange ansatte har dere?» (E1 allerede kjent) eller «Hva driver dere med?» (E2/E7 kjent).

---

## 5. Beta Presentation Draft (3 sider, «måle først, anbefal etterpå»)

### Side 1 — «Dette fant Arch om virksomheten deres»

> Melhus Bil Trondheim AS — bilforhandler og verksted, 74 ansatte, etablert 1987. To avdelinger: salg (35) og verksted (39). Forhandler 7 bilmerker. Aktiv nettside med telefon, chat og epost som kundekanaler.

*(Kun fakta. Ingen konklusjoner.)*

### Side 2 — «Tre områder hvor dere kan undersøke forbedringer»

> 1. Kundedialog — telefon/chat for verkstedkunder
> 2. Timebooking — hvordan kunder booker verkstedtime
> 3. Ordre/faktura/deler — arbeidsflyt på tvers av 7 merker

*(Hypoteser, merket som «kan undersøke», ikke «funn».)*

### Side 3 — «Slik kan dette måles»

> For hvert område: observer dagens prosess → mål tidsbruk → identifiser mulig forbedring → mål etter endring. Arch måler først, anbefaler etterpå.

*(Ingen besparelsesløfter. Ingen «vi kan spare dere X kr».)*

---

## 6. Konklusjon for beta-kontakt

Melhus Bil Trondheim er en **sterk første beta-kandidat** fordi:
- ✅ Verifisert beslutningstaker (daglig leder Rune Hagen, navngitt i Brønnøysund)
- ✅ Riktig størrelse (74 ansatte, 2 tydelige avdelinger)
- ✅ Automotive-domene (Toms bakgrunn)
- ✅ Lokal (Trondheim, lav terskel)
- ✅ Aktiv digital tilstedeværelse (nettside, chat, 7 merker)

**Ærlig risiko:** Det er en bilforhandler (ikke rent bilglass), så Toms «bilglass»-case må justeres til «automotive/verksted». Verksted = 53 % av ansatte er faktisk en sterkere læringskontekst (repeterende serviceprosesser).

**Viktig:** Alle hypoteser (H1-H5) er ukjente inntil kunden svarer. Arch må ikke presentere dem som funn. Det er nøyaktig dette som skiller Arch fra «AI chatbot med gjetting».
