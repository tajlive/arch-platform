# Arch Control Plane

Governance-laget. `.arch/` per prosjekt + disse reglene.

## Sannhetskilder (SSoT)

| Domene | System |
|---|---|
| Oppgaver/krav | Linear |
| Kode | GitHub |
| Data | Supabase |
| Runtime | Cloudflare Workers |
| Governance | Arch Control Plane (`.arch/`) |

## Approval-gates

- `Ready for Tom → Approved` = **kun Tom**.
- Arkitektur-forslag = `Ready for Tom` før `init`.
- Factory `--approve` kreves for eksterne ressurser (GitHub-repo, Linear-team).

## Secret-standard

```
secret://<prosjekt>/<miljø>/<tjeneste>/<nøkkel>
```

`.arch/secrets/registry.yaml` = referanser, **aldri** verdier. Verdier i BWS / wrangler /
GitHub Actions / `.env.local`. `secret-audit.mjs` skanner og feiler ved funn (allowlist-basert).

## Knowledge governance

«Arch lærer av systemet, men endrer aldri sikkerhetsgrenser automatisk.»
Agenten kan **aldri** automatisk: endre risk-regler, aktivere trading, endre secrets eller
endre tilgangsnivå. Forslag som rører sikkerhetsgrense = `Ready for Tom`.
