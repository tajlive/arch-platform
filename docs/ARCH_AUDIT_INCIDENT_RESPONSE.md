# Arch Audit Incident Response

**Dato:** 2026-08-20

---

## 1. Backup Plan

### D1 backup
- **Metode:** `wrangler d1 export arch-audit --remote --output backup.sql` (periodisk + før migrasjon)
- **Frekvens:** manuell før hver migrasjon + periodisk (anbefalt daglig når kundedata finnes)
- **Lagring:** utenfor repo (`.arch/secrets/` governance — aldri i git)

### Migration rollback
- D1 migrations er append-only (`d1_migrations` tabell). Rollback = ny forward-migration.
- Før destruktiv migrasjon: eksporter backup + verifiser rad-count.

### Secrets recovery
- Secrets i BWS (Bitwarden Secrets Manager) + Cloudflare Workers secrets.
- Recovery = `bws secret list` + `wrangler secret put`.

## 2. Monitoring / Alarmer

| Signal | Trigger | Handling |
|--------|---------|----------|
| Worker errors (500) | log `level=error` | `wrangler tail` + request_id |
| D1 failures | D1 query error | sjekk quota/migrations |
| Rate limit spikes | 429-rate øker | sjekk abuse (bulk scraping) |
| Auth failures | AUTH_DENIED/MEMBERSHIP_DENIED øker | sjekk Access-policy + provisioning |

**Status:** `wrangler tail` + strukturert logging implementert. **Ingen automatisk alarm** (Sentry/Cloudflare Notifications) ennå — anbefalt før bred lansering.

## 3. Incident-handling (runbook)

1. **Detekter** — log `level=error` eller 500-respons med `request_id`.
2. **Isoler** — identifiser route + tenant (request_id → logg).
3. **Diagnoser** — `wrangler tail --format json | grep <request_id>`.
4. **Fiks** — root cause, ny commit.
5. **Rollback om nødvendig** — `wrangler versions list` + re-deploy prior commit.
6. **Verifiser** — smoke test + negativ test.
7. **Dokumenter** — hendelse, rotårsak, fiks, guard.

## 4. Cloudflare-native verktøy (tilgjengelig)

- `wrangler tail` — live logs
- `wrangler versions list` — deploy historikk + rollback
- D1 `d1 export` — backup
- Workers Analytics (senere) — metrics

**Gap:** Ingen automatisk alerting / on-call. For lukket beta (3-5 bedrifter) er manuell monitoring via `wrangler tail` akseptabel. For bred lansering: Cloudflare Notifications eller Sentry.
