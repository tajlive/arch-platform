# Teknisk appendix — Arch Website Audit www.sodexo.no

> **Generert:** 2026-08-14T19:24:39.803Z · **Nettsted:** https://www.sodexo.no/ · **Endelig URL:** https://www.sodexo.com/

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.sodexo.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | PASS | 308 www.sodexo.no→www.sodexo.com | high |
| reliability | Ødelagte interne lenker | PASS | 17 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | ingen same-origin-ressurser å sample | high |
| performance | Komprimering (gzip/brotli) | PASS | br | high |
| performance | Cache-headere | PASS | public, max-age=0, must-revalidate | high |
| performance | Render-blokkerende ressurser | PASS | 0 blokkerende skript, 3 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 9 bilder, 1 m/ dimensjoner, 7 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 3 eksterne domener (www.sodexo.com, edge.sitecorecloud.io, edge-platform.sitecorecloud.io) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | UNKNOWN | stylesheets ikke observerbare | low |
| accessibility | Språk-attributt (lang) | PASS | en | high |
| accessibility | Alt-tekst på bilder | PASS | 0/9 bilder mangler alt | high |
| accessibility | Skjemaetiketter | FAIL | 1 input, 1 label | medium |
| accessibility | Overskriftshierarki | PASS | h1=1 h2=5 h3=6 | high |
| accessibility | Semantiske landemerker | PASS | 4/4 (header, nav, main, footer) | high |
| seo | Tittel | PASS | Sodexo Group – Food Services &amp; Facilities Management | high |
| seo | Meta-beskrivelse | FAIL | mangler meta description | high |
| seo | Canonical | FAIL | mangler canonical | high |
| seo | Robots-meta | PASS | ingen robots-meta (standard: indekserbart) | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (0 URL-er) | high |
| seo | OpenGraph | PASS | title=true description=true image=true | high |
| seo | Strukturert data (JSON-LD) | FAIL | ingen JSON-LD | high |
| security | Header: csp | PASS | tilstede | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | PASS | tilstede | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | Vercel | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: framework | PASS | Next.js | medium |
| tech | Teknologi: cdn | PASS | Vercel | high |
| tech | Teknologi: hosting | PASS | Vercel | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.sodexo.com/
- Redirects: 308 https://www.sodexo.no/ → https://www.sodexo.com/
- HTTPS: HTTPS leverte respons
- Compression: br · Cache: public, max-age=0, must-revalidate

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data: blob:; img-src * data: blob:; font-src * data:; connect-src *; media-src *; object-src *; frame-src *; |
| hsts | max-age=63072000; includeSubDomains; preload |
| xcto | nosniff |
| referrer | strict-origin-when-cross-origin |
| permissions | — mangler |
| frame | DENY |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: Vercel

## 4. Crawl-resultat

- Sider sjekket: 17 · Vellykket: 17
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/0

## 5. Teknologi-overflate (confidence merket)

- Framework: Next.js · CMS: — · CDN: Vercel · Hosting: Vercel
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: www.sodexo.com, edge.sitecorecloud.io, edge-platform.sitecorecloud.io

## 6. SEO / Meta / Struktur

- Tittel: Sodexo Group – Food Services &amp; Facilities Management · Meta-beskrivelse: —
- Canonical: — · robots.txt: ja · Sitemap: 0 URL-er
- OpenGraph: {"title":true,"description":true,"image":true} · JSON-LD: nei
- Headings: {"h1":1,"h2":5,"h3":6,"h4":9,"h5":0,"h6":0} · Lang: en

## 7. Browser-evidence

- Rendered DOM: 1146006 tegn
- Skjermbilder: /Users/taj/arch-platform/docs/audits/prospects/www.sodexo.no/browser-evidence/screenshot-desktop.png, /Users/taj/arch-platform/docs/audits/prospects/www.sodexo.no/browser-evidence/screenshot-mobile.png
- Console-feil: 0
- Failed requests: 0

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":false,"chat":false,"booking":true,"newsletter":false}
- Uutnyttet potensial: 67% (2/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.sodexo.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._