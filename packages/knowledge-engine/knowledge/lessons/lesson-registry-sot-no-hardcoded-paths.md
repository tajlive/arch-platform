# Lesson: Registry som SSoT — ingen hardkodede stier i prod-kode

**Regel:** Prosjekter/ressurser registreres i en kanonisk Project Registry
(`packages/governance/projects.json`), ikke hardkodes i collector/adapters.
Lokale filsystemstier (`/Users/...`) er KUN lokal utviklingsmetadata (`dev_path`),
aldri prod-identifikator eller SSoT.

**Hvorfor:** `collect-dashboard-data.mjs` leste `/Users/taj/klarpakke` og
`/Users/taj/arch-dashboard` direkte — fungerte på én maskin, umulig på Cloudflare Pages/CI.

**Arvet av:** F3.6 — collector leser registry, adapters er parameterisert på repo/team-id.
Sanitert publikumsvisning stripper alle `dev_path`-felt.
