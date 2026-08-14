# Teknisk appendix — Arch Website Audit www.cuautoglass.no

> **Generert:** 2026-08-14T02:50:49.803Z · **Nettsted:** https://www.cuautoglass.no · **Endelig URL:** https://www.cuautoglass.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.cuautoglass.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 7 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 10 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | gzip | high |
| performance | Cache-headere | FAIL | ingen cache-control | high |
| performance | Render-blokkerende ressurser | FAIL | 2 blokkerende skript, 5 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 30 bilder, 30 m/ dimensjoner, 0 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 5 eksterne domener (consent.cookiebot.com, site-assets.cdnmns.com, www.googletagmanager.com, www.google-analytics.com, ) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | UNKNOWN | stylesheets ikke observerbare | low |
| accessibility | Språk-attributt (lang) | PASS | no | high |
| accessibility | Alt-tekst på bilder | PASS | 0/30 bilder mangler alt | high |
| accessibility | Skjemaetiketter | PASS | 4 input, 6 label | medium |
| accessibility | Overskriftshierarki | FAIL | h1=2 h2=15 h3=2 | high |
| accessibility | Semantiske landemerker | PASS | 3/4 (header, nav, footer) | high |
| seo | Tittel | PASS | CU autoglass | high |
| seo | Meta-beskrivelse | FAIL | mangler meta description | high |
| seo | Canonical | PASS | https://www.cuautoglass.no | high |
| seo | Robots-meta | PASS | ingen robots-meta (standard: indekserbart) | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (2 URL-er) | high |
| seo | OpenGraph | FAIL | title=true description=false image=true | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | FAIL | mangler | high |
| security | Header: xcto | FAIL | mangler | high |
| security | Header: referrer | FAIL | mangler | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | FAIL | mangler | high |
| security | Blandet innhold (http på https) | FAIL | 1 http-referanser | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | PASS | ingen versjons-headere | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | PASS | CMP observert | medium |
| trust_privacy | Kontakt-/lead-skjema | PASS | 1 <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.cuautoglass.no
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: gzip · Cache: —

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | — mangler |
| xcto | — mangler |
| referrer | — mangler |
| permissions | — mangler |
| frame | — mangler |
- Blandet innhold: 1 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: ingen

## 4. Crawl-resultat

- Sider sjekket: 7 · Vellykket: 7
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/10

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: — · CDN: — · Hosting: —
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: consent.cookiebot.com, site-assets.cdnmns.com, www.googletagmanager.com, www.google-analytics.com, 

## 6. SEO / Meta / Struktur

- Tittel: CU autoglass · Meta-beskrivelse: —
- Canonical: https://www.cuautoglass.no · robots.txt: ja · Sitemap: 2 URL-er
- OpenGraph: {"title":true,"description":false,"image":true} · JSON-LD: ja
- Headings: {"h1":2,"h2":15,"h3":2,"h4":3,"h5":0,"h6":0} · Lang: no

## 7. Browser-evidence

- Rendered DOM: 173417 tegn
- Skjermbilder: /Users/taj/arch-platform/docs/audits/prospects/www.cuautoglass.no/browser-evidence/screenshot-desktop.png, /Users/taj/arch-platform/docs/audits/prospects/www.cuautoglass.no/browser-evidence/screenshot-mobile.png
- Console-feil: 0
- Failed requests: 0

## 8. Automatiserings-signaler

- {"contact_form":true,"analytics":true,"cmp":true,"chat":false,"booking":true,"newsletter":false}
- Uutnyttet potensial: 33% (4/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.cuautoglass.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._