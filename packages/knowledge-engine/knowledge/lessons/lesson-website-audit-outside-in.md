# Lærdom: outside-in website audit som salgs­trakt-førstesteg

**Dato:** 2026-08-13
**Kontekst:** F4.2B — Arch Website Audit v1

## Lærdom

**Laveste terskel inn i en teknisk salgs­trakt er en read-only, evidensbasert outside-in audit av noe kunden allerede eier offentlig — ikke en repo-tilgang.**

En potensiell kunde vil ikke gi kildekode-tilgang før de har sett verdi. Men nettsiden deres er allerede offentlig. Ved å bygge en audit som kun trenger `@url:https://kunde.no`, fjerner man **hele tillits-barrieren** som en repo-audit innebærer, samtidig som man beviser kvaliteten på arbeidet.

## Konkrete grep som gjorde det troverdig

1. **UNKNOWN ≠ PASS** — «frahold av bevis» ble aldri et negativt faktum. En sjekk vi ikke kunne gjøre (f.eks. responsiv-CSS uten å laste CSS) merkes `UNKNOWN`, ikke `FAIL`. Uten dette ville tool'en fabrikkere falske funn.
2. **Trackere/analytics = signal, ikke score-FAIL.** Å ha Google Analytics er ikke en sårbarhet — det er et *potensielt* privacy-concern. CMP-sjekken kjører kun hvis trackere faktisk finnes.
3. **Provenance på alt** (`evidence` + `confidence` per sjekk) — kunden kan spore hvert funn tilbake til en observerbar HTTP-respons.
4. **Gjenbruk det kommersielle laget** (4 bøtter, 5 felt, Build Proposal, consent-gate, isolasjon) i stedet for å bygge en one-off. Web-audit arver hele F4.1-laget.
5. **Crawl-sikkerhet som default** (max_pages, max_depth, delay, robots-respekt, same-origin) — en «audit» som crawler aggressivt er en skanner, ikke en audit.

## Pitfall som ble fanget

- **Render-blokkering-sjekk teller feil uten `type=module`/inline-håndtering.** Next.js emitterer `<script type="module">` (deferred av spec) og inline-skript (ingen nettverksressurs). Uten eksplisitt filtrering rapporterte klarpakke.no «71 blokkerende skript» — et falskt positivt for akkurat den profilen Tom jakter. Fikset ved å ekskludere `async`/`defer`/`type=module`/inline (uten `src`).

## Når dette gjelder

Når man bygger en salgs­trakt for tekniske tjenester der tillit er barrieren — start med det kunden allerede eksponerer offentlig, bevis kvaliteten der, og be deretter om dypere tilgang.
