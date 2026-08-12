// Klassifikasjon — Arch Audit v1 (F4).
//
// Tre klasser (Tom-mandat): tydelig grense mellom hva som er maskinverifisert,
// hva som er inferert, og hva som krever menneskelig beslutning.
//
//   automatic       — maskinverifisert observasjon (evidence = fil/kilde/status).
//                     EKS: "secret-scan fant 0 funn i versjonskontrollerte filer",
//                          "CI-workflow kjører `npx tsc` men repo har ingen tsconfig".
//   inferred        — regelavledet anbefaling (basert på automatiske funn).
//                     EKS: "Security < 100 → vurder secret-governance".
//                     Dette er en ANBEFALING, ikke en fakta-påstand om systemet.
//   human_approval  — beslutning kun et menneske kan ta (Tom / kunde).
//                     EKS: "rotér Stripe-nøkkel", "GDPR — krever juridisk vurdering",
//                          "godkjenn produksjonsdeploy".
//
// Regel: en audit påstår ALDRI noe om sikkerhet, jus eller regulering uten
// dokumentert grunnlag. Juridiske/regulatoriske forhold er alltid human_approval
// med eksplisitt «ikke vurdert — krever kvalifisert juridisk gjennomgang».

export const CLASS = Object.freeze({
  AUTOMATIC: "automatic",
  INFERRED: "inferred",
  HUMAN_APPROVAL: "human_approval",
});

export const CLASS_LABEL = Object.freeze({
  automatic: "Automatisk funn (maskinverifisert)",
  inferred: "Inferert anbefaling (regelavledet)",
  human_approval: "Krever menneskelig beslutning",
});

let seq = 0;
export const finding = (klass, section, title, evidence, extra = {}) => ({
  id: `F${String(++seq).padStart(3, "0")}`,
  class: klass,
  section,
  title,
  evidence,
  ...extra,
});

export const resetSeq = () => { seq = 0; };
