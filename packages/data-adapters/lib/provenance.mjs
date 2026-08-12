// Provenance — hvert datapunkt bærer kilde, observasjonstidspunkt og status.
// Status-semantikk (Tom-mandat F3.6):
//   observed  — faktisk hentet fra en kilde nå
//   declared  — deklarert (konfig/rolle), IKKE sanntidsverifisert
//   stale     — tidligere observert, men over ferskhetsgrensen
//   unknown   — ikke observerbar / ikke instrumentert ennå
//   error     — forsøk på observasjon feilet

export const observed = (value, source, extra = {}) => ({
  value, source, observed_at: new Date().toISOString(), status: "observed", ...extra,
});
export const declared = (value, source, extra = {}) => ({
  value, source, observed_at: null, status: "declared", ...extra,
});
export const unknown = (source, reason) => ({
  value: null, source, observed_at: null, status: "unknown", reason,
});
export const error = (source, err) => ({
  value: null, source, observed_at: new Date().toISOString(), status: "error",
  reason: String((err && err.message) || err).split("\n")[0],
});
