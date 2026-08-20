# Arch Beta Candidate Intelligence

**Dato:** 2026-08-20  
**Metode:** Brønnøysund Enhetsregisteret (offentlige data, NLOD-lisens)  
**Status:** Research kun — INGEN kontaktet.

---

## Resultat

**45 kvalifiserte bedrifter** funnet via Brønnøysund API, filtrert på:
- NACE-kode (målrettede bransjer)
- 10–100 ansatte (verifisert `antallAnsatte`)
- Aktiv drift (ikke konkurs/avvikling)
- Har hjemmeside (digital tilstedeværelse)

Full shortlist: `data/beta-candidates.json` (committed, verifisert mot Brønnøysund).

---

## Bransjefordeling

| Bransje | Antall | NACE |
|---------|--------|------|
| Bilverksted | 8 | 95.310 |
| Elektro | 7 | 43.210 |
| Rørlegger | 7 | 43.221 |
| Regnskap | 9 | 69.202 |
| Eiendomsforvaltning | 6 | 68.320 |
| Ventilasjon | 5 | 43.223 |
| Glass (produksjon) | 3 | 23.120 |

---

## Anbefalt beta-kohort (prioritert)

### Gruppe 1 — Bilglass / verksted / automotive ⭐⭐⭐⭐⭐

**Hvorfor først:** Domenekunnskap (FinnBilGlass/Autoglass-case), mange manuelle prosesser, lett å forklare verdi.

| Bedrift | Ansatte | Kommune |
|---------|---------|---------|
| Sven Kvia AS | 91 | Sola |
| Sulland-gruppen (Tromsø/Østfold/Hamar) | 89-97 | spredt |
| Bertel O. Steen (flere regionale AS) | 89-99 | spredt |

**Typiske Arch-områder:** telefonhenvendelser, booking, forsikringsdialog, ordre, faktura, lager, kundestatus.

**Merk:** Bertel O. Steen / Sulland / Møller er store konsern med regionale AS — de er «10-100 ansatte» per juridisk enhet, men inngår i større konsern. For ekte uavhengige SMB prioriteres mindre, frittstående verksteder.

### Gruppe 2 — Håndverk (elektro, rørlegger, ventilasjon) ⭐⭐⭐⭐⭐

| Bedrift | Ansatte | Kommune |
|---------|---------|---------|
| Energipartner AS | 98 | Trondheim |
| Agder Ventilasjon AS | 98 | Kristiansand |
| Veas Rør AS | 95 | Drammen |
| Christiania Rørleggerbedrift AS | 85 | Oslo |
| Boligelektrikeren AS | 100 | Oslo |

**Typiske Arch-områder:** tilbud, befaring, planlegging, faktura, dokumentasjon, kundekontakt.

### Gruppe 3 — Regnskapskontor ⭐⭐⭐⭐

| Bedrift | Ansatte | Kommune |
|---------|---------|---------|
| PBL Regnskap AS | 90 | Bodø |
| Saga Regnskap og Rådgivning AS | 77 | Larvik |
| Frisikt (Vest/Øst) | 75/59 | Gjøvik/Ringsaker |
| Amesto Accounthouse Sør AS | 61 | Drammen |

**Typiske Arch-områder:** dokumentflyt, bilagsbehandling, kundeoppfølging, rapportering.

**Bonus:** kan bli samarbeidspartner (videresalg).

### Gruppe 4 — Eiendomsforvaltning ⭐⭐⭐⭐

| Bedrift | Ansatte | Kommune |
|---------|---------|---------|
| Kjeldsberg Eiendomsforvaltning AS | 59 | Trondheim |
| Utleiemegleren Forvaltning AS | 46 | Oslo |
| Scala Drift AS | 92 | Oslo |

**Typiske Arch-områder:** e-post, dokumenter, avtaler, henvendelser, koordinering.

### Gruppe 5 — Teknologibedrift (senere, for teknisk feedback) ⭐⭐⭐

Ikke i shortlisten ennå (krever egen NACE-profil). Anbefales for LinkedIn-case og teknisk feedback, ikke først for penger.

---

## Kontaktstrategi (felles for alle)

> Ikke selg «vi har laget en AI-løsning».

Si i stedet:
> *«Vi tester en ny AI-basert virksomhetsanalyseplattform. Arch gjør først en analyse av offentlige data, identifiserer mulige forbedringsområder og viser hvor AI/automatisering kan gi verdi. Vi søker 5 norske bedrifter som vil være med i en lukket pilot.»*

## Beta-tilbud: «Founding Beta Partner»

✅ Gratis første analyse  
✅ Prioritert oppfølging  
✅ Påvirke produktutvikling  
✅ Rapport de kan bruke internt  

**Mot:** Feedback + mulighet for outcome-måling + case-studie hvis de ønsker.

---

## Kildehenvisning

- Brønnøysund Enhetsregisteret (`data.brreg.no`, NLOD-lisens)
- Søkeparametere: `naeringskode` + `fraAntallAnsatte=10` + `tilAntallAnsatte=100` + `sort=antallAnsatte,DESC`
- Hver bedrift verifisert med `org_number`, `antallAnsatte`, `kommune`, `hjemmeside`, status-flagg.

## Viktig

- **Ingen bedrifter er kontaktet.** Dette er research kun.
- "Arch bruker Arch for å finne Arch sine første kunder" — dette er en live demonstrasjon av produktet.
