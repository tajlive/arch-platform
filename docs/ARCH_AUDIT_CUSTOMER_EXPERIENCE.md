# Arch Audit Customer Experience Flow

**Dato:** 2026-08-20

---

## Sluttbrukerflyt (public → upgrade)

```
1. Forside: «La AI-en undersøke bedriften din»
   Input: firmanavn | org.nr | nettside | søkeord
        ↓
2. Company candidates (Brønnøysund autocomplete)
        ↓
3. User velger korrekt firma
        ↓
4. Company X-Ray (public signals, «Vi har allerede undersøkt»)
        ↓
5. AI Audit Consultant (sparsomme spørsmål, INSUFFICIENT EVIDENCE)
        ↓
6. Free boundary (maks 3 funn, indikativ ROI)
        ↓
7. Upgrade (Full Audit — intern data, prosesskart, ROI, roadmap)
```

## Forside-input

| Input | Kilde | Resolusjon |
|-------|-------|-----------|
| Firma | Brønnøysund navn-søk | kandidater |
| Org.nr | Brønnøysund direkte | eksakt |
| Nettside | URL → crawl → firma | heuristikk |
| Søkeord | Brønnøysund fritekst | kandidater |

## Eksempel: «Autoglass Trondheim»

1. Bruker skriver «autoglass» → Brønnøysund gir kandidater (AUTOGLASS AS, m.fl.)
2. Bruker velger → Company X-Ray: næring (engroshandel bildeler), ansatte, roller, nettside
3. AI: «Jeg har funnet Autoglass AS — bilglass-grossist med X ansatte. Før jeg vurderer automatisering: hvor kommer flest kundehenvendelser fra?»
4. Funn + free boundary → upgrade

## Prinsipper

- **Sparsomhet:** aldri spør om noe som allerede er kjent (public data).
- **Ærlighet:** INSUFFICIENT EVIDENCE, aldri oppdiktede tall.
- **«Vi har undersøkt»:** public research FØR første spørsmål.
- **Free = scope, ikke svekket intelligens.**
