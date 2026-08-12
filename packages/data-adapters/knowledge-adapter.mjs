// KnowledgeAdapter — observert telling fra Knowledge Graph (lokalt filsystem).
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { observed, error } from "./lib/provenance.mjs";

export function fetchKnowledgeCounts(knowledgeDir) {
  try {
    const count = (sub) =>
      existsSync(join(knowledgeDir, sub)) ? readdirSync(join(knowledgeDir, sub)).filter((f) => f.endsWith(".md")).length : 0;
    return observed(
      {
        failures: count("failures"),
        patterns: count("patterns"),
        lessons: count("lessons"),
        decisions: count("decisions"),
        customers: count("customers"),
        architectures: count("architectures"),
      },
      "knowledge-engine (lokalt filsystem)",
    );
  } catch (e) {
    return error("knowledge-engine", e);
  }
}
