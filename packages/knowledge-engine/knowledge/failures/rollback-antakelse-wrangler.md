# Failure

System: Arch Platform deploy-verktøy (wrangler 4.122.0) · Cloudflare Pages
Dato: 2026-08-13 (F3.6C First Governed Deploy)

Symptom: Rollback-planen i deploy-readiness-report refererte
`wrangler pages deployment rollback` som dokumentert tilbakerullingsprosedyre.

Rotårsak: Kommandoen finnes IKKE i wrangler 4.122.0. `wrangler pages deployment`
har kun `list` / `create` / `tail` / `delete`. Antakelsen ble skrevet uten å
verifisere mot faktisk CLI-versjon (`wrangler pages deployment --help`).

Fix: Rollback-plan korrigert til faktiske mekanismer:
1. Cloudflare-dashboard → Deployment → «Roll back».
2. API `POST /accounts/{id}/pages/projects/{name}/rollbacks` med `deployment_id`.
3. Re-deploy tidligere commit (`wrangler pages deploy --commit-hash <sha>`).

Permanent regel: Dokumenter ALDRI en CLI-kommando som prosedyre uten å verifisere
at den faktisk finnes i gjeldende verktøyversjon (`<verktøy> <sub> --help`).
Anta at CLI-overflater endres mellom versjoner.

Arvet av: Arch Audit v1 (F4) — «verifiser verktøy-versjoner» er en eksplisitt
audit-sjekk.
