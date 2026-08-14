# Teknisk appendix — Arch Website Audit www.hvass.no

> **Generert:** 2026-08-13T16:40:10.729Z · **Nettsted:** https://www.hvass.no · **Endelig URL:** https://www.hvass.no

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.hvass.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | FAIL | 1 ødelagt (www.hvass.no/om-oss → 404) | high |
| reliability | Ressurs-feil (img/css/js) | PASS | ingen same-origin-ressurser å sample | high |
| performance | Komprimering (gzip/brotli) | PASS | gzip | high |
| performance | Cache-headere | FAIL | ingen cache-control | high |
| performance | Render-blokkerende ressurser | PASS | 0 blokkerende skript, 9 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 15 bilder, 10 m/ dimensjoner, 10 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 5 eksterne domener (use.typekit.net, assets.squarespace.com, definitions.sqspcdn.com, static1.squarespace.com, images.squarespace-cdn.com) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | UNKNOWN | stylesheets ikke observerbare | low |
| accessibility | Språk-attributt (lang) | PASS | no-NO | high |
| accessibility | Alt-tekst på bilder | PASS | 0/15 bilder mangler alt | high |
| accessibility | Skjemaetiketter | NOT_APPLICABLE | ingen skjemainput | medium |
| accessibility | Overskriftshierarki | FAIL | h1=2 h2=4 h3=2 | high |
| accessibility | Semantiske landemerker | PASS | 4/4 (header, nav, main, footer) | high |
| seo | Tittel | PASS | Hvass | high |
| seo | Meta-beskrivelse | FAIL |  | high |
| seo | Canonical | PASS | https://www.hvass.no | high |
| seo | Robots-meta | PASS | ingen robots-meta (standard: indekserbart) | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (22 URL-er) | high |
| seo | OpenGraph | FAIL | title=true description=false image=true | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | FAIL | mangler | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | PASS | tilstede | high |
| security | Blandet innhold (http på https) | FAIL | 1 http-referanser | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | Squarespace | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | FAIL | ingen personvern-link observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cms | PASS | WordPress | medium |
| tech | Teknologi: hosting | PASS | Squarespace | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.hvass.no
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: gzip · Cache: —

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | — mangler |
| hsts | max-age=15552000 |
| xcto | nosniff |
| referrer | — mangler |
| permissions | — mangler |
| frame | SAMEORIGIN |
- Blandet innhold: 1 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: Squarespace

## 4. Crawl-resultat

- Sider sjekket: 19 · Vellykket: 18
- Ødelagte interne lenker: 1
  https://www.hvass.no/om-oss → 404
- Ressurs-feil: 0/0

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: WordPress · CDN: — · Hosting: Squarespace
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: use.typekit.net, assets.squarespace.com, definitions.sqspcdn.com, static1.squarespace.com, images.squarespace-cdn.com

## 6. SEO / Meta / Struktur

- Tittel: Hvass · Meta-beskrivelse: 
- Canonical: https://www.hvass.no · robots.txt: ja · Sitemap: 22 URL-er
- OpenGraph: {"title":true,"description":false,"image":true} · JSON-LD: ja
- Headings: {"h1":2,"h2":4,"h3":2,"h4":0,"h5":0,"h6":0} · Lang: no-NO

## 7. Browser-evidence

- Rendered DOM: 1250384 tegn
- Skjermbilder: /Users/taj/arch-platform/docs/audits/prospects/www.hvass.no/browser-evidence/screenshot-desktop.png, /Users/taj/arch-platform/docs/audits/prospects/www.hvass.no/browser-evidence/screenshot-mobile.png
- Console-feil: 0
- Failed requests: 0

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":false,"chat":false,"booking":true,"newsletter":true}
- Uutnyttet potensial: 50% (3/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.hvass.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._