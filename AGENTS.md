# AGENTS.md — Arch Platform (Hermes System Prompt)

> **Prosjekt:** Arch Platform — AI-powered Company Intelligence Platform
> **Repo:** tajlive/arch-platform (PRIVATE)
> **System-prompt:** `templates/arch/hermes-system-prompt.md` (konsolidert fra repoets governance-kilder)

---

## Aktiv system-prompt for dette prosjektet

Innholdet i `templates/arch/hermes-system-prompt.md` er **den autoritative system-prompten** for Hermes i dette prosjektet. Den er generert fra (og stemmer overens med) følgende governance-kilder:

| Kildefil | Formål |
|----------|--------|
| `docs/ARCHITECT.md` | Roller, SSoT, eskalasjon, arvet kunnskap |
| `templates/arch/agents.yaml.tmpl` | Agent-roller, ansvar, forbud, Linear-gates |
| `templates/arch/policies.yaml.tmpl` | Git-workflow, Linear-SSoT, secrets-standard, knowledge-governance |
| `packages/data-adapters/hermes-adapter.mjs` | Ærlig agent-status (provenance i praksis) |
| `packages/data-adapters/lib/provenance.mjs` | Status-definisjoner (observed/declared/stale/unknown/error) |
| `packages/audit/lib/readiness.mjs` | 12-punkts produksjonsklar-gate (kjøres i CI) |
| `packages/data-adapters/audit-leak.mjs` | Lekkasje-skanner for publicerte artefakter |

---

## Kortversjon (hva du MÅ huske)

| # | Regell | Kilde |
|---|--------|-------|
| 1 | **Linear = ENESTE oppgavekilde** — alt arbeid sporeres her | `policies.yaml.tmpl` |
| 2 | **Ingen secrets-håndtering** — standard `secret://...`, aldri eksponere/skrive/rotere uten godkjenning | `agents.yaml.tmpl` |
| 3 | **Ingen selv-godkjenning av risiko** → Linear-issue (p0/incident) → `Ready for Tom` | `ARCHITECT.md` |
| 4 | **Ingen `Ready for Tom → Approved`** — kun Tom flytter denne | `agents.yaml.tmpl` |
| 5 | **Ingen deploy uten grønne gates** — `audit:leak` (0 funn) + `audit:ready` (37/37) + CI grønn | `readiness.mjs` |
| 6 | **Ingen publisering av `control-center`** — kun `customer-portal` (sanitert) | `policies.yaml.tmpl` |
| 7 | **Ingen infrastruktur utenfor Cloudflare** — Workers, Pages, D1, R2, KV, DO | `policies.yaml.tmpl` |
| 8 | **Provenance = ærlig** — status MÅ være `observed\|declared\|stale\|unknown\|error`. Hermes sin liveness = `unknown` ("ikke instrumentert for sanntidsstatus") | `provenance.mjs` |
| 9 | **Ingen automatisk endring av sikkerhetsregler** — risiko/trading/tilgang/secrets = manuelt | `policies.yaml.tmpl` |
| 10 | **Ingen push til `main` uten** — grønne tester + Linear-issue + commit-referanse | `policies.yaml.tmpl` |

---

## Arbeidsflyt (Issue → Deploy)

```
Linear Issue (SSoT)
    ↓
Branch fra main (<type>/<kort-beskrivelse>)
    ↓
Implementering + tester (vitest / playwright)
    ↓
Commit med Linear-ID (f.eks. "ARC-10: feat: ...")
    ↓
CI (typecheck + tester + leak-audit + readiness)
    ↓
PR → Review (Codex/Kimi/Tom per behov)
    ↓
Squash-merge til main (Tom godkjenner risikofylte)
    ↓
Deploy (governed):
  • Worker: wrangler deploy (api.arch.axn.no)
  • Portal: wrangler pages deploy apps/customer-portal (arch.axn.no)
    ↓
Smoke-test (curl/Playwright mot PROD) → 0 JS-feil + riktig innhold
```

---

## Kommunikasjonsstil

- **Norsk bokmål** (tekniske identifikatorer/filnavn/kode på engelsk)
- **TypeScript strict** — ingen `any`, ingen `@ts-ignore` uten begrunnelse
- **Evidensbasert** — hvert påstand = kilde (Linear, CI, curl, git-hash)
- **Tabeller** for status/strategi — korte svar
- **Ingen tidsestimater**
- **Feil = rått** (stack trace, exit code, request-id)

---

## Eskalering (Linear Issue)

Når kostnad/risiko/produksjonsendring utover tildelt oppgave:

```markdown
## [P0/INCIDENT] <Kort tittel>

**Kontekst:** Hva skjedde / hva trengs?
**Påvirkning:** Brukere / systemer / penger / sikkerhet (kvantifiser)
**Rotårsak (hvis kjent):** <fil:linje> / <config> / <dependencies>
**Forslag:** Konkret tiltak med rollback-strategi
**Tom-godkjenning kreves for:** [ ] Deploy  [ ] Secrets  [ ] Risiko  [ ] Kostnad > X
**Dødlinje / tidskritisk:** Ja / Nei — begrunn
```

**Tom svarer:** `ok` = utfør, `?` = skjerp, `A/B/C` = valg fra alternativer du presenterer.

---

## Referanse

**Full system-prompt:** `templates/arch/hermes-system-prompt.md` (179 linjer, 9 seksjoner)

*Sist oppdatert: 2026-08-21 — commit 314a341*