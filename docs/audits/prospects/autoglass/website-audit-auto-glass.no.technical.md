# Teknisk appendix — Arch Website Audit Autoglass AS

> **Generert:** 2026-08-13T01:44:51.491Z · **Nettsted:** https://auto-glass.no/ · **Endelig URL:** https://auto-glass.no/

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-auto-glass.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 13 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 10 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | gzip | high |
| performance | Cache-headere | PASS | public, no-cache | high |
| performance | Render-blokkerende ressurser | FAIL | 14 blokkerende skript, 7 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 4 bilder, 1 m/ dimensjoner, 0 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 1 eksterne domener (use.typekit.net) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | nb-NO | high |
| accessibility | Alt-tekst på bilder | PASS | 0/4 bilder mangler alt | high |
| accessibility | Skjemaetiketter | FAIL | 3 input, 3 label | medium |
| accessibility | Overskriftshierarki | FAIL | h1=2 h2=1 h3=4 | high |
| accessibility | Semantiske landemerker | PASS | 3/4 (header, nav, footer) | high |
| seo | Tittel | PASS | Autoglass AS - Vi kan bilglass - Autoglass | high |
| seo | Meta-beskrivelse | FAIL | mangler meta description | high |
| seo | Canonical | PASS | https://auto-glass.no/ | high |
| seo | Robots-meta | PASS | ingen robots-meta (standard: indekserbart) | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | FAIL | mangler sitemap.xml | high |
| seo | OpenGraph | FAIL | title=true description=true image=false | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | PASS | tilstede | high |
| security | Blandet innhold (http på https) | FAIL | 2 http-referanser | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | Prometheus | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | PASS | 3 <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cms | PASS | WordPress | medium |
| tech | Teknologi: hosting | PASS | Prometheus | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager, Facebook Pixel | high |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://auto-glass.no/
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: gzip · Cache: public, no-cache

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | max-age=31536000 |
| xcto | nosniff |
| referrer | strict-origin-when-cross-origin |
| permissions | — mangler |
| frame | SAMEORIGIN |
- Blandet innhold: 2 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: Prometheus

## 4. Crawl-resultat

- Sider sjekket: 13 · Vellykket: 13
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/10

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: WordPress · CDN: — · Hosting: Prometheus
- Analytics/trackere: Google Analytics/Tag Manager, Facebook Pixel
- Tredjeparts-domener: use.typekit.net

## 6. SEO / Meta / Struktur

- Tittel: Autoglass AS - Vi kan bilglass - Autoglass · Meta-beskrivelse: —
- Canonical: https://auto-glass.no/ · robots.txt: ja · Sitemap: nei
- OpenGraph: {"title":true,"description":true,"image":false} · JSON-LD: ja
- Headings: {"h1":2,"h2":1,"h3":4,"h4":1,"h5":1,"h6":0} · Lang: nb-NO

## 7. Browser-evidence

- Rendered DOM: 60613 tegn
- Skjermbilder: /Users/taj/arch-platform/docs/audits/prospects/autoglass/browser-evidence/screenshot-desktop.png, /Users/taj/arch-platform/docs/audits/prospects/autoglass/browser-evidence/screenshot-mobile.png
- Console-feil: 0
- Failed requests: 0

## 8. Automatiserings-signaler

- {"contact_form":true,"analytics":true,"cmp":false,"chat":false,"booking":true,"newsletter":false}
- Uutnyttet potensial: 50% (3/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-auto-glass.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._