// HermesAdapter — ærlig agent-status. Ingenting vises som «Active» uten at det
// faktisk er observert. Codex/Kimi er ROLLER (ikke kjørende agenter) → declared.
import { observed, declared, unknown } from "./lib/provenance.mjs";

export function fetchAgents() {
  // Hermes er observert aktiv kun hvis collect kjøres INNE i en Hermes-sesjon.
  // Dette er en build-time-samler → vi kan ikke bevise liveness i sanntid.
  return [
    { name: "Hermes", role: "Chief Architect + Ops", ...unknown("hermes", "ikke instrumentert for sanntidsstatus") },
    { name: "Codex", role: "Senior Developer", ...declared("Ready", "rolle-konfig (agents.yaml)") },
    { name: "Kimi", role: "Research Analyst", ...declared("Research", "rolle-konfig (agents.yaml)") },
  ];
}
