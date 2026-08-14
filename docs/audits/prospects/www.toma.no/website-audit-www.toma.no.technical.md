# Teknisk appendix — Arch Website Audit www.toma.no

> **Generert:** 2026-08-14T19:25:37.966Z · **Nettsted:** https://www.toma.no/ · **Endelig URL:** https://www.toma.no/

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.toma.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 25 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 3 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | br | high |
| performance | Cache-headere | PASS | public, max-age=0 | high |
| performance | Render-blokkerende ressurser | FAIL | 1 blokkerende skript, 2 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 13 bilder, 0 m/ dimensjoner, 12 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 1 eksterne domener (fonts.bunny.net) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | nb-NO | high |
| accessibility | Alt-tekst på bilder | PASS | 0/13 bilder mangler alt | high |
| accessibility | Skjemaetiketter | FAIL | 1 input, 0 label | medium |
| accessibility | Overskriftshierarki | PASS | h1=1 h2=8 h3=14 | high |
| accessibility | Semantiske landemerker | PASS | 4/4 (header, nav, main, footer) | high |
| seo | Tittel | PASS | Toma gir mennesker en bedre arbeidsdag - Toma | high |
| seo | Meta-beskrivelse | PASS | Toma er en bedrift med 45 års erfaring som skaper trygge og effektive arbeidsplasser – fra kantine og renhold til eiendomsdrift og vakthold. | high |
| seo | Canonical | PASS | https://www.toma.no/ | high |
| seo | Robots-meta | PASS | index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1 | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (14 URL-er) | high |
| seo | OpenGraph | PASS | title=true description=true image=true | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | FAIL | mangler | high |
| security | Header: xcto | FAIL | mangler | high |
| security | Header: referrer | FAIL | mangler | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | FAIL | mangler | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | BunnyCDN-NO1-830 | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | PASS | 1 <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cms | PASS | WordPress | medium |
| tech | Teknologi: hosting | PASS | BunnyCDN-NO1-830 | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.toma.no/
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: br · Cache: public, max-age=0

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
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: BunnyCDN-NO1-830

## 4. Crawl-resultat

- Sider sjekket: 25 · Vellykket: 25
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/3

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: WordPress · CDN: — · Hosting: BunnyCDN-NO1-830
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: fonts.bunny.net

## 6. SEO / Meta / Struktur

- Tittel: Toma gir mennesker en bedre arbeidsdag - Toma · Meta-beskrivelse: Toma er en bedrift med 45 års erfaring som skaper trygge og effektive arbeidsplasser – fra kantine og renhold til eiendomsdrift og vakthold.
- Canonical: https://www.toma.no/ · robots.txt: ja · Sitemap: 14 URL-er
- OpenGraph: {"title":true,"description":true,"image":true} · JSON-LD: ja
- Headings: {"h1":1,"h2":8,"h3":14,"h4":0,"h5":0,"h6":0} · Lang: nb-NO

## 7. Browser-evidence

- Rendered DOM: 198534 tegn
- Skjermbilder: /Users/taj/arch-platform/docs/audits/prospects/www.toma.no/browser-evidence/screenshot-desktop.png, /Users/taj/arch-platform/docs/audits/prospects/www.toma.no/browser-evidence/screenshot-mobile.png
- Console-feil: 0
- Failed requests: 0

## 8. Automatiserings-signaler

- {"contact_form":true,"analytics":true,"cmp":false,"chat":true,"booking":false,"newsletter":false}
- Uutnyttet potensial: 50% (3/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.toma.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._