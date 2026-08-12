# F4 — Arch Commercial Product Layer

Kommersiell flyt: **Kunde → Arch Audit → funn/verdi → Architecture Proposal → godkjenning → Arch Build → produksjon → Arch Managed**

Tre tilbud, bygget i denne rekkefølgen. Kun Audit v1 er implementert (F4.1); Build og Managed er **forberedt (scope/design), ikke implementert** før Audit v1 er verifisert på en ekte potensiell kunde.

---

## F4.1 — Arch Audit v1 ✅ (implementert)

**Status:** bygget, verifisert på Klarpakke (reference audit, read-only).

**Input:** kunde gir repo/systeminfo (path eller registry-id). **Output:** profesjonell, evidensbasert rapport.

**Kode:** `packages/audit/audit.mjs` (+ `lib/{classify,secret-scan,stack-detect,report}.mjs`). CLI: `npm run audit -- <target|project_id> [--json] [--save <dir>]`.

**Leverer (12 seksjoner):** Executive Summary · Arch Health Score (evidence/provenance) · Security & Secret Governance · Architecture Review · CI/CD & Engineering Quality · Operations & Monitoring · AI/automasjon · Teknisk gjeld/risiko · Prioriterte anbefalinger · Quick wins · Estimerte Build-muligheter · Human-approval-krav.

**Tre-klasse-grense (kjerne):**
- 🟢 **automatisk** — maskinverifisert observasjon (evidence = fil/kilde/status)
- 🟡 **inferert** — regelavledet anbefaling (IKKE fakta-påstand om systemet)
- 🔴 **human_approval** — beslutning kun menneske kan ta

**Hard regel:** ingen sikkerhets-, juridiske eller regulatoriske påstander uten dokumentert grunnlag. Juridisk/regulatorisk (GDPR m.fl.) = alltid `human_approval` med «ikke vurdert — krever kvalifisert juridisk gjennomgang». Secret-scan «0 funn» = ingen matchende mønster, IKKE sertifisering.

**Success criterion (Tom):** en potensiell kunde forstår innen minutter: hvor systemet står · hva som er galt · hva som kan forbedres · hva som kan automatiseres · hva Arch kan bygge videre · hva det kan være verdt.

**Første reference audit:** `docs/audits/audit-klarpakke.{md,evidence.json}` — Klarpakke 98 %, 0 lekkasjer, ærlig klassifisering.

---

## F4.2 — Arch Build v1 🚧 (forberedt, IKKE implementert)

**Trigger:** godkjent Audit-funn + kunde sier ja til Architecture Proposal.

**Flyt:** Audit-funn → Architecture Proposal → godkjenning → Project Factory (`arch project init`) → implementering.

**Gjenbruk:** `packages/project-factory/analyze-project.mjs` (proposal) + `init-project.mjs` (scaffold) + Knowledge Graph (arv av failures/lessons/patterns).

**Grenser (governance):** Factory deployer ALDRI, oppretter ALDRI prod-secrets, aktiverer ALDRI live/betaling. Deploy + secrets + tilgang = Tom/kunde-godkjent, egen gate.

**Kriterie for å starte (etter Audit v1 verifisert):** minst én kunde har en godkjent Audit-rapport og har sagt ja til et scoped Build-oppdrag.

---

## F4.3 — Arch Managed v1 🚧 (forberedt, IKKE implementert)

**Trigger:** løsning i drift.

**Leveranse (månedlig):** monitoring · alerts · CI · Health Score · forbedringsforslag · approvals.

**Gjenbruk:** Health Score v2.1 (evidence) · data-adapters (provenance) · deploy-ready-check (12 gates) · ops-mønstre fra Klarpakke (syntetisk monitor, auto-rollback, Sentry→varsel).

**Grenser (governance):** Managed overvåker og foreslår — endrer aldri sikkerhetsgrenser, tilgangsnivåer eller prod-konfig automatisk. «Arch lærer av systemet, men endrer aldri sikkerhetsgrenser automatisk.»

**Kriterie for å starte:** minst én Build-leveranse i drift med godkjent ops-kontrakt.

---

## Rekkefølge-beslutning (Tom)

Ikke mer generell plattformteknologi før Audit v1 er brukt på en ekte potensiell kunde. Audit først (billigst, minst kundetilgang, genererer leads) → Build → Managed.
