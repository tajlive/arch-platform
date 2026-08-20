# Arch Pre-Beta Audit — ISS Food & support Midt (Trondheim)

**Dato:** 2026-08-20  
**Kontaktperson:** Eskil Henriksen — Regionsdirektør Food & support Midt (Trondheim)  
**Metode:** Offentlige kilder (Brønnøysund Enhetsregisteret + underenhet-analyse)  
**Regler overholdt:** Ingen kontakt, ingen antakelser, fakta/signal/hypotese/spørsmål adskilt, ingen falske AI-funn.

---

## Strategisk kontekst (fakta)

- **ISS kjøper Toma** (7.5.2026, betinget Konkurransetilsynets godkjenning — ikke fullført).
- Eskil Henriksen er i dag **Tomas** Regionsdirektør Food & support Midt. Ved gjennomført oppkjøp blir hans divisjon en del av ISS.
- «Food & support» = **kantinedrift + catering** (NACE 56.220 + 56.210). Dette er nøyaktig den aktivitetslinjen som dominerer ISS Midt-Norge sin kantineportefølje.

**Hvorfor strategisk:** Eskil kjenner FM/renhold/kantine-bransjen inngående. En varm, personlig inngang til en enterprise-kunde gjennom en som allerede leder den typen operasjon Arch skal analysere.

---

## 1. Company X-Ray (verifisert)

| Felt | Verdi | Kilde |
|------|-------|-------|
| Morselskap | ISS FACILITY SERVICES AS (org 914791723) | Brønnøysund |
| Hovednæring (konsern) | 81.210 Rengjøring av bygninger | Brønnøysund |
| Ansatte (nasjonalt) | 7 483 | Brønnøysund |
| **Divisjon** | Food & support (kantinedrift 56.220 + catering 56.210) | Brønnøysund |
| **Food & support Midt — underenheter** | 76 | Brønnøysund |
| **Trondheim — kantine-enheter** | 54 | Brønnøysund |
| **Rapporterte ansatte (Food & support Midt)** | 122 | Brønnøysund |
| **Største enhet** | Catering Trondheim (32 ansatte) | Brønnøysund |
| Kontaktperson | Eskil Henriksen (Regionsdirektør Food & support Midt) | Toms kunnskap |

---

## 2. Food & support Midt — struktur (verifisert)

### Kantine-portefølje per kommune

| Kommune | Kantine-enheter | Rapporterte ansatte |
|---------|-----------------|---------------------|
| Trondheim | 54 | 66 |
| Ålesund | 10 | 5 |
| Steinkjer | 3 | 0 |
| Ørsta | 2 | 0 |
| Verdal | 2 | 12 |
| Stjørdal | 1 | 8 |
| Haram | 1 | 12 |
| Giske | 1 | 12 |
| Næreøysund | 1 | 0 |
| Ørland | 1 | 7 |
| **Totalt** | **76** | **122** |

### Trondheim-kantiner (utvalg — kundenavn = kontraktsnavn)

SINTEF (6+ enheter: Energiforskning, Materialer/Kjemi, Petroleumsforskning, Ocean, Teknologi og Samfunn), Equinor Rotvoll, Statens vegvesen (Heimdal + Sluppen), NAV Falkenborgveien, NTNU Samfunnsforskning, NRK Tyholt, Danske Bank, Rambøll, Siemens, Kongsberg Maritime, ATB, Norges Geologiske Undersøkelse, Felleskjøpet, Gjensidige, Nidar, Trondheim Torg, m.fl.

**Mønster (FAKTA):** 54 kantine-enheter i Trondheim alene, de fleste med 0–8 ansatte hver. Én «Catering Trondheim»-enhet (32 ansatte) bærer det meste av rapportert bemanning. Typisk modell: mange små kantine-kontrakter spredt på store kunder, hver med egen daglig drift.

---

## 3. Evidence Table (fakta vs signal vs hypotese)

| # | Observasjon | Type | Kilde | Confidence |
|---|-------------|------|-------|-----------|
| E1 | 76 Food & support-enheter i Midt-Norge, 54 i Trondheim | FAKTA | Brønnøysund | HØY |
| E2 | 122 rapporterte ansatte totalt i Food & support Midt | FAKTA | Brønnøysund | HØY |
| E3 | De fleste kantine-enheter er små (0–8 ansatte hver) | FAKTA | Brønnøysund | HØY |
| E4 | Catering Trondheim (32 ansatte) = største enhet | FAKTA | Brønnøysund | HØY |
| E5 | Mange kontrakter mot navngitte kunder (SINTEF, Equinor, NAV, NTNU, NRK, Statens vegvesen) | FAKTA | Brønnøysund underenhet-navn | HØY |
| E6 | 46 av 76 enheter har `antallAnsatte = null` (ikke rapportert) | SIGNAL | Brønnøysund (data-gap) | MEDIUM |
| E7 | ISS kjøper Toma (betinget Konkurransetilsynet) | FAKTA | offentlig kjent | HØY |
| E8 | Eskil leder Food & support Midt | FAKTA | Toms kunnskap | HØY |
| E9 | Kantine-porteføljen er fragmentert (mange små enheter, få store) | FAKTA | E1+E3 | HØY |

**Data-gap (ærlig):** 46/76 enheter mangler rapportert `antallAnsatte`. Dette er et **signal** om at bemanningen i kantine-enhetene kan være fordelt/variabel — men det er IKKE et funn. Det betyr bare at offentlige data er ufullstendige på dette punktet.

---

## 4. Potential Improvement Areas (hypoteser, IKKE funn)

| # | Hypotese | Basert på | Krever verifisering |
|---|----------|-----------|---------------------|
| H1 | **Fragmentert kantine-drift** (54 enheter) kan gi administrativ overhead i bemanning, bestilling, meny og rapportering per enhet | E1, E3, E9 | Hvordan styres 54 kantiner daglig? |
| H2 | **Kontrakts- og kundeoppfølging** mot SINTEF/Equinor/NAV/NTNU kan ha manuell rapportering | E5 | Hva rapporteres per kontrakt, og til hvem? |
| H3 | **Bemanning** på tvers av små enheter (0–8 ansatte) kan være sårbar for vikar-/skiftplanlegging | E3, E6 | Hvordan planlegges bemanning og vikarer? |
| H4 | **Catering/arrangement** (Catering Trondheim, 32 ansatte) kan ha manuell ordre-/logistikkflyt | E4 | Hvordan håndteres catering-ordre i dag? |
| H5 | **Oppkjøpsintegrasjon** (Toma→ISS) kan skape system-/prosessoverlapp i Food & support | E7 | Når/hvordan integreres systemer? |

---

## 5. Questions for First Meeting (sparsomme, formålsdrevne)

| # | Spørsmål | Formål |
|---|----------|--------|
| Q1 | «Hvordan styrer du 54 kantine-enheter i Trondheim — hva krever mest av din tid?» | IDENTIFY_PROCESS + QUANTIFY_VALUE |
| Q2 | «Hva rapporterer dere per kantine-kontrakt i dag, og hvor manuelt er det?» | IDENTIFY_PROCESS (verifiser H2) |
| Q3 | «Hvordan planlegges bemanning og vikarer på tvers av de små enhetene?» | IDENTIFY_PROCESS (verifiser H3) |
| Q4 | «Hvilket system bruker dere for bestilling, meny og svinn i kantinene?» | IDENTIFY_SYSTEM (verifiser H1) |
| Q5 | «Hva betyr Toma-oppkjøpet for systemer og prosesser i din region?» | ASSESS_RISK + IDENTIFY_SYSTEM |

**Ikke spør:** «Hvor mange kantiner har dere?» (E1 kjent), «Hvem er kundene deres?» (E5 kjent), «Hvor mange ansatte?» (E2 kjent).

---

## 6. Beta Presentation Draft (3 sider)

### Side 1 — «Dette fant Arch om ISS Food & support Midt»

> ISS Food & support Midt driver 76 kantine-/catering-enheter — 54 i Trondheim alene. Porteføljen er spredt på store kunder som SINTEF, Equinor, NAV, NTNU, NRK og Statens vegvesen. De fleste enhetene er små (0–8 ansatte), med Catering Trondheim (32) som største.

*(Kun fakta. Ingen konklusjoner.)*

### Side 2 — «Tre områder hvor dere kan undersøke forbedringer»

> 1. Daglig styring av 54 kantine-enheter (bestilling, meny, svinn)
> 2. Kontrakts- og kundeoppfølging mot store kunder
> 3. Bemanning og vikarplanlegging på tvers av små enheter

*(Hypoteser, merket «kan undersøke», ikke «funn».)*

### Side 3 — «Slik kan dette måles»

> For hvert område: observer dagens prosess → mål tidsbruk → identifiser mulig forbedring → mål etter endring. Arch måler først, anbefaler etterpå.

---

## 7. Konklusjon

ISS Food & support Midt er en **strategisk varm enterprise-inngang**:

- ✅ **Varm personlig inngang** — Eskil Henriksen (Tom kjenner ham fra Toma)
- ✅ **Presis domenematch** — kantine/catering = Eskils eksakte ansvarsområde
- ✅ **Tydelig beslutningstaker** — Regionsdirektør med reell myndighet
- ✅ **Rik, målbar prosess-flate** — 76 enheter, 54 i Trondheim, fragmentert bemanning
- ⚠️ **Enterprise, ikke SMB** — utenfor beta-profilen; regionen er operativt håndterbar

**Ærlig vurdering:** Dette er en **enterprise-relasjon**, ikke en SMB-læringsbedrift. Anbefalt håndtering: hold den som en **strategisk enterprise-pilot med Eskil** — enten parallelt med, eller etter, at Arch har bevist seg på 3–5 SMB-er.

**Risiko:** Enterprise-kompleksitet (integrasjon, compliance, flere beslutningstakere) kan oversvømme Arch i beta-fasen. Læringsverdien er høy, men «for mye, for tidlig»-risikoen er reell.

---

## 8. Hva som IKKE er verifisert (kilde-grenser)

- Stillingsannonser (NAV-feed krever bearer-auth) — ikke hentet.
- Regnskapsdetaljer (Brønnøysund regnskaps-API returnerte HTML) — kun «siste årsregnskap 2024» bekreftet.
- 46/76 kantine-enheter mangler rapportert `antallAnsatte` (offentlig data-gap).
- Faktisk prosessbelastning — ukjent inntil Eskil bekrefter.

**Alle hypoteser (H1-H5) er ukjente inntil Eskil svarer. Arch presenterer dem ikke som funn.**
