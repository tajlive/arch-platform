# Arch Kostnadskontroll — plan

> Besluttet av Tom 2026-08-14. SSoT: GitHub Issues + denne filen.

## Beslutninger (Tom 2026-08-14)

| # | Tema | Valg |
|---|---|---|
| 1 | Omfang | **A** — ALLE tjenester: Cloudflare, Supabase, Resend, LLM-API, Domeneshop, GitHub, Bitwarden |
| 2 | Hensikt | **C** — synlighet + budsjettvarsler + auto-optimalisering |
| 3 | Datakilde | **C** — hybrid (API der det finnes, manuell der ikke) |
| 4 | Plassering | Arch-plattformen (ny Kostnadskontroll-modul) — agent-beslutning |
| 5 | Granularitet | **B** — per prosjekt (Klarpakke, Autoglass, Finnbilglass, Arch, Trønderglass) |

## API-kartlegging (fase 1-funn, verifisert)

| Tjeneste | Kostnads-API | Automatiserbar? |
|---|---|---|
| Cloudflare | **Billable Usage API** (`/accounts/{id}/billing/usage/paygo`, FOCUS-skjema, krever *Billing Read*-token) | ✅ Ja — begge kontoer (`80d5b1d5`, `2266e975`) |
| DeepSeek | `GET /user/balance` (saldo CNY/USD, ikke historisk kostnad) | ⚠️ Saldo kun |
| Moonshot/Kimi | saldo-endpoint | ⚠️ Saldo kun |
| Supabase | ingen faktura-API på free/pro | ❌ Manuell |
| Resend | ingen faktura-API (dashboard) | ❌ Manuell |
| GitHub | billing-API for org (actions/storage) — krever team/enterprise | ⚠️ Delvis |
| Domeneshop | ingen faktura-API (kun domene-admin) | ❌ Manuell |
| Bitwarden | ingen kostnads-API | ❌ Manuell |

**Konklusjon hybrid:** kun Cloudflare er fullt automatiserbar i dag; LLM-API-er gir saldo (trend-indikator); resten er månedlig manuell input eller dashboard-eksport.

## Datamodell (granularitet: per prosjekt)

```
cost_entry:
  project_id    (klarpakke | autoglassgrossisten | finnbilglass | arch-platform | tronderglass)
  service       (cloudflare | supabase | resend | llm | domeneshop | github | bitwarden)
  account       (80d5b1d5 | 2266e975 | pskhryjzkobytnfwucrb | …)   # konto/prosjekt-ref per tjeneste
  period        (YYYY-MM)                                          # måned
  amount        (decimal)                                          # kostnad
  currency      (NOK | USD)
  source        (api | manual)                                     # 3C: sporbarhet
  ingested_at   (timestamp)
```

## Faseplan

### Fase 1 — Synlighet
- Datamodell + lagring (start: JSON/CSV i Arch-repo; senere Supabase/D1 hvis nødvendig)
- Cloudflare-integrasjon: daglig cron → Billable Usage API → per konto per prosjekt
- LLM-saldo: DeepSeek `/user/balance` + Moonshot-saldo (daglig)
- Manuell input-skjema for Supabase/Resend/Domeneshop/GitHub/Bitwarden (månedlig)
- Dashboard: tabell per prosjekt (kostnad per tjeneste, måned + MTD)

### Fase 2 — Budsjettvarsler
- Budsjettgrense per prosjekt (og per tjeneste der relevant)
- Varsel (Discord/Telegram) ved overskridelse
- Månedlig kostnadsrapport

### Fase 3 — Auto-optimalisering
- Regler som foreslår kutt (nedskalering, pause ubrukte cron/Workers, billigere LLM-modell for tunge cron-jobber)
- Forslag → Tom-godkjenning → utfør (aldri autonomt kutt av betalte tjenester)

## Neste steg (fase 1)

1. Verifiser Cloudflare *Billing Read*-token (eksisterende token mangler sannsynligvis scope)
2. Skript `cost-ingest-cloudflare` → henter begge kontoer daglig
3. Manuell input-fil (seed med nåværende månedlige faste kostnader)
4. Dashboard i Arch customer-portal (intern-seksjon)

## Prinsipp

Følger «Alltid fakta» — ingen estimerte/oppdiktede kostnader. Alle tall må komme fra API-svar eller Tom-bekreftet manuell input. `source`-feltet gjør hver rad sporbar.
