# Arch Audit Production Checklist v0.1

**Dato:** 2026-08-20

---

## Security

- [x] Access verified (OTP positiv path — Tom-verifisert)
- [x] Tenant isolation verified (7/7 cross-tenant)
- [x] Rate limiting verified (Durable Object, 429)
- [x] Anonymous session security verified (id + secret)
- [x] workers.dev/preview bypass verified (401)
- [x] Security headers påført (HSTS, X-Frame-Options, nosniff)
- [ ] CORS policy audit (delvis — origin-låst, men bred metode-whitelist)

## Technical

- [x] Tests green (30/30 unit + 7/7 cross-tenant)
- [x] Typecheck green
- [x] Deploy verified (api.arch.axn.no)
- [x] Migrations applied (0001 + 0002)
- [ ] Rollback tested (wrangler versions — prosedyre dokumentert, ikke utført)
- [ ] D1 backup utført (prosedyre dokumentert, ikke kjørt ennå)

## Product

- [x] Demo ready (Nordic Service AS — syntetisk, /v1/public/demo/company)
- [x] Privacy ready (/privacy)
- [x] Security side (/security)
- [x] Terms (/terms)
- [x] Data sources (/data-sources)
- [x] Free vs paid boundary dokumentert
- [ ] Priser fastsatt (Scan ~7 900 / Full ~24 900 / Continuous ~4 900 — må valideres)

## Observability

- [x] Strukturert logging (request_id, trace_id, latency, error_code)
- [x] Rate limiting målt
- [ ] AI usage tracking (ikke aktiv — ingen LLM enda)
- [ ] Cost tracking (ikke aktiv)
- [ ] Automatisk alerting (Sentry/CF Notifications) — IKKE implementert

## Gjenstående før lukket beta (3-5 bedrifter)

1. D1 backup kjørt minst én gang
2. Rollback-testet (re-deploy prior version)
3. Personal OAuth (Google) — eller fortsett med onetimepin + manuell onboarding
4. Priser valideres med første kunder
5. Observability: minst error-alerting (Cloudflare Notifications)
