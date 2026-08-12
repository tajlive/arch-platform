# Lesson: Provenance — observed / declared / unknown

**Regel:** Et dashboard/rapport skal aldri vise en deklarert verdi som om den er live telemetri.
Hvert datapunkt må bære status: `observed` (hentet nå), `declared` (konfig/rolle),
`stale` (utgått), `unknown` (ikke verifisert) eller `error` (feil).

**Hvorfor:** «Hermes Active» var en hardkodet streng, ikke observasjon. En kunde kan ikke
skille løgn fra sannhet uten kilde + observasjonstidspunkt. Fail honestly: heller
`unknown` enn fabrikkert helse.

**Arvet av:** F3.6 data-adaptere (hvert datapunkt bærer `value/source/observed_at/status`).
Agent-status på dashboard: Hermes = unknown (ikke instrumentert) inntil det er observert;
Codex/Kimi = declared (roller, ikke kjørende agenter).
