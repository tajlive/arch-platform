# Teknisk appendix — Arch Website Audit www.tronderbad.no

> **Generert:** 2026-08-14T03:03:47.415Z · **Nettsted:** https://www.tronderbad.no · **Endelig URL:** https://www.tronderbad.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.tronderbad.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 5 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 7 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | gzip | high |
| performance | Cache-headere | PASS | public, max-age=60 | high |
| performance | Render-blokkerende ressurser | PASS | 0 blokkerende skript, 2 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 7 bilder, 0 m/ dimensjoner, 7 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 2 eksterne domener (kit.fontawesome.com, fonts.googleapis.com) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | UNKNOWN | stylesheets ikke observerbare | low |
| accessibility | Språk-attributt (lang) | PASS | no | high |
| accessibility | Alt-tekst på bilder | PASS | 0/7 bilder mangler alt | high |
| accessibility | Skjemaetiketter | NOT_APPLICABLE | ingen skjemainput | medium |
| accessibility | Overskriftshierarki | PASS | h1=1 h2=3 h3=6 | high |
| accessibility | Semantiske landemerker | PASS | 3/4 (header, nav, footer) | high |
| seo | Tittel | PASS | Trønderbad AS - Kvalitetsbad til normale priser \| Baderomsrenovering i Trondheim | high |
| seo | Meta-beskrivelse | PASS | Trønderbad AS tilbyr profesjonell baderomsrenovering, flisarbeid og tømrerarbeid i Trondheim. Kvalitetsbad til normale priser. Kontakt oss for gratis befaring - 41 12 88 88. | high |
| seo | Canonical | FAIL | mangler canonical | high |
| seo | Robots-meta | PASS | ingen robots-meta (standard: indekserbart) | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (5 URL-er) | high |
| seo | OpenGraph | FAIL | title=true description=true image=false | high |
| seo | Strukturert data (JSON-LD) | FAIL | ingen JSON-LD | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | FAIL | mangler | high |
| security | Header: xcto | FAIL | mangler | high |
| security | Header: referrer | FAIL | mangler | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | FAIL | mangler | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | PASS | ingen sourceMappingURL i sjekkede skript | medium |
| security | Versjons-avsløring | FAIL | cloudflare | high |
| trust_privacy | Cookie-banner | FAIL | ingen cookie-banner observert | low |
| trust_privacy | Personvernerklæring-link | FAIL | ingen personvern-link observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cdn | PASS | Cloudflare | high |
| tech | Teknologi: hosting | PASS | cloudflare | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.tronderbad.no
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: gzip · Cache: public, max-age=60

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | — mangler |
| xcto | — mangler |
| referrer | — mangler |
| permissions | — mangler |
| frame | — mangler |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: nei
- Versjons-avsløring: cloudflare

## 4. Crawl-resultat

- Sider sjekket: 5 · Vellykket: 5
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/7

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: — · CDN: Cloudflare · Hosting: cloudflare
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: kit.fontawesome.com, fonts.googleapis.com

## 6. SEO / Meta / Struktur

- Tittel: Trønderbad AS - Kvalitetsbad til normale priser | Baderomsrenovering i Trondheim · Meta-beskrivelse: Trønderbad AS tilbyr profesjonell baderomsrenovering, flisarbeid og tømrerarbeid i Trondheim. Kvalitetsbad til normale priser. Kontakt oss for gratis befaring - 41 12 88 88.
- Canonical: — · robots.txt: ja · Sitemap: 5 URL-er
- OpenGraph: {"title":true,"description":true,"image":false} · JSON-LD: nei
- Headings: {"h1":1,"h2":3,"h3":6,"h4":0,"h5":0,"h6":0} · Lang: no

## 7. Browser-evidence

- Rendered DOM: 650473 tegn
- Skjermbilder: /Users/taj/arch-platform/docs/audits/prospects/www.tronderbad.no/browser-evidence/screenshot-desktop.png, /Users/taj/arch-platform/docs/audits/prospects/www.tronderbad.no/browser-evidence/screenshot-mobile.png
- Console-feil: 0
- Failed requests: 0

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":false,"chat":true,"booking":true,"newsletter":false}
- Uutnyttet potensial: 50% (3/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.tronderbad.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._