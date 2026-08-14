# Teknisk appendix — Arch Website Audit www.no.issworld.com

> **Generert:** 2026-08-14T16:21:07.561Z · **Nettsted:** https://www.no.issworld.com/ · **Endelig URL:** https://www.no.issworld.com/

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.no.issworld.com.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 16 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 10 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | br | high |
| performance | Cache-headere | PASS | s-maxage=0,max-age=5 | high |
| performance | Render-blokkerende ressurser | FAIL | 3 blokkerende skript, 3 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 16 bilder, 14 m/ dimensjoner, 15 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 1 eksterne domener (web.cmp.usercentrics.eu) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | no-no | high |
| accessibility | Alt-tekst på bilder | PASS | 0/16 bilder mangler alt | high |
| accessibility | Skjemaetiketter | FAIL | 2 input, 1 label | medium |
| accessibility | Overskriftshierarki | PASS | h1=1 h2=19 h3=8 | high |
| accessibility | Semantiske landemerker | PASS | 4/4 (header, nav, main, footer) | high |
| seo | Tittel | PASS | ISS Norge | high |
| seo | Meta-beskrivelse | PASS | ISS skaper arbeidsplasser som får mennesker til å trives – med renhold, mat, eiendom/tekniske tjenester, support og arbeidsplassløsninger. Kontakt oss. | high |
| seo | Canonical | PASS | https://www.no.issworld.com | high |
| seo | Robots-meta | PASS | ingen robots-meta (standard: indekserbart) | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (51 URL-er) | high |
| seo | OpenGraph | PASS | title=true description=true image=true | high |
| seo | Strukturert data (JSON-LD) | FAIL | ingen JSON-LD | high |
| security | Header: csp | PASS | tilstede | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | FAIL | mangler | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | cloudflare | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | PASS | link til personvern observert | high |
| trust_privacy | Samtykke-plattform (CMP) | PASS | CMP observert | medium |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cdn | PASS | Cloudflare | high |
| tech | Teknologi: hosting | PASS | cloudflare | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.no.issworld.com/
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: br · Cache: s-maxage=0,max-age=5

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | upgrade-insecure-requests |
| hsts | max-age=31536000 |
| xcto | nosniff |
| referrer | no-referrer-when-downgrade |
| permissions | — mangler |
| frame | — mangler |
- Blandet innhold: 0 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: cloudflare

## 4. Crawl-resultat

- Sider sjekket: 16 · Vellykket: 16
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/10

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: — · CDN: Cloudflare · Hosting: cloudflare
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: web.cmp.usercentrics.eu

## 6. SEO / Meta / Struktur

- Tittel: ISS Norge · Meta-beskrivelse: ISS skaper arbeidsplasser som får mennesker til å trives – med renhold, mat, eiendom/tekniske tjenester, support og arbeidsplassløsninger. Kontakt oss.
- Canonical: https://www.no.issworld.com · robots.txt: ja · Sitemap: 51 URL-er
- OpenGraph: {"title":true,"description":true,"image":true} · JSON-LD: nei
- Headings: {"h1":1,"h2":19,"h3":8,"h4":35,"h5":0,"h6":0} · Lang: no-no

## 7. Browser-evidence

- Rendered DOM: spawnSync /Applications/Google Chrome.app/Contents/MacOS/Google Chrome ETIMEDOUT tegn
- Skjermbilder: ingen
- Console-feil: 0
- Failed requests: 0

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":true,"cmp":true,"chat":true,"booking":true,"newsletter":false}
- Uutnyttet potensial: 33% (4/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.no.issworld.com.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._