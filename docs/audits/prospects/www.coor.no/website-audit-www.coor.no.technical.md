# Teknisk appendix — Arch Website Audit www.coor.no

> **Generert:** 2026-08-14T19:23:43.442Z · **Nettsted:** https://www.coor.no/ · **Endelig URL:** https://www.coor.no/

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-www.coor.no.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 25 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | 0 av 10 ressurser feilet | high |
| performance | Komprimering (gzip/brotli) | PASS | gzip | high |
| performance | Cache-headere | FAIL | ingen cache-control | high |
| performance | Render-blokkerende ressurser | PASS | 0 blokkerende skript, 15 stylesheets | medium |
| performance | Bilde-optimalisering | FAIL | 44 bilder, 35 m/ dimensjoner, 43 lazy | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 1 eksterne domener (www.juicer.io) | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | PASS | @media funnet | medium |
| accessibility | Språk-attributt (lang) | PASS | no | high |
| accessibility | Alt-tekst på bilder | PASS | 0/44 bilder mangler alt | high |
| accessibility | Skjemaetiketter | PASS | 1 input, 1 label | medium |
| accessibility | Overskriftshierarki | PASS | h1=1 h2=13 h3=52 | high |
| accessibility | Semantiske landemerker | PASS | 4/4 (header, nav, main, footer) | high |
| seo | Tittel | PASS | Facility Management i Norge \| Coor | high |
| seo | Meta-beskrivelse | FAIL |  | high |
| seo | Canonical | FAIL | mangler canonical | high |
| seo | Robots-meta | PASS | all | medium |
| seo | robots.txt | PASS | robots.txt tilstede | high |
| seo | Sitemap.xml | PASS | sitemap tilstede (1 URL-er) | high |
| seo | OpenGraph | PASS | title=true description=true image=true | high |
| seo | Strukturert data (JSON-LD) | PASS | JSON-LD tilstede | high |
| security | Header: csp | PASS | tilstede | high |
| security | Header: hsts | PASS | tilstede | high |
| security | Header: xcto | PASS | tilstede | high |
| security | Header: referrer | PASS | tilstede | high |
| security | Header: permissions | PASS | tilstede | high |
| security | Header: frame | PASS | tilstede | high |
| security | Blandet innhold (http på https) | FAIL | 2 http-referanser | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | cloudflare | high |
| trust_privacy | Cookie-banner | PASS | cookie/samtykke-element observert | low |
| trust_privacy | Personvernerklæring-link | FAIL | ingen personvern-link observert | high |
| trust_privacy | Samtykke-plattform (CMP) | FAIL | trackere observert uten CMP | low |
| trust_privacy | Kontakt-/lead-skjema | PASS | 1 <form> observert | high |
| trust_privacy | Call-to-action | PASS | CTA-tekst observert | low |
| tech | Teknologi: cdn | PASS | Cloudflare | high |
| tech | Teknologi: hosting | PASS | cloudflare | high |
| tech | Teknologi: analytics | PASS | Google Analytics/Tag Manager | high |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://www.coor.no/
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: gzip · Cache: —

## 3. Sikkerhets-headere (offentlig observerbare)

| Header | Verdi |
|---|---|
| csp | report-uri https://www.coor.com/report-endpoints/report; report-to report-endpoint; font-src https://use.typekit.net data: https://fonts.gstatic.com https://widget.lifeinside.io https://static.juicer.io 'self'; img-src https://media.lifeinside.io https://i.ytimg.com https://img.youtube.com https://widget.datablocks.se https://app.optimizely.com https://cdn.optimizely.com data: * https://*.googletagmanager.com https://*.google-analytics.com; media-src https://media.lifeinside.io 'self' https://www.juicer.io; script-src https://js-eu1.hsforms.net/forms/embed/v2.js 'unsafe-inline' 'self' https://*.cookiebot.com https://*.lifeinside.io https://tracker.leadenhancer.com https://adsby.bidtheatre.com https://snap.licdn.com https://www.google.com https://googleads.g.doubleclick.net https://www.gstatic.com https://www.googleadservices.com https://*.hotjar.com https://js-eu1.hs-scripts.com https://js-eu1.hsleadflows.net https://js-eu1.hs-banner.com https://js-eu1.hs-analytics.net https://js-eu1.hubspot.com https://js-eu1.usemessages.com https://bat.bing.com https://connect.facebook.net https://www.youtube.com https://s.ytimg.com https://cdn.ontame.io https://*.inzynk.io https://*.livechatinc.com https://www.juicer.io https://widget.datablocks.se https://js.monitor.azure.com https://*.optimizely.com https://optimizely.s3.amazonaws.com https://cdn-assets-prod.s3.amazonaws.com https://*.googletagmanager.com https://www.googletagmanager.com; frame-src https://forms-eu1.hsforms.com https://consentcdn.cookiebot.com https://www.google.com https://td.doubleclick.net https://www.facebook.com https://www.youtube.com https://www.youtube-nocookie.com https://secure.livechatinc.com https://*.cdn.optimizely.com https://*.cdn-pci.optimizely.com https://www.googletagmanager.com; connect-src https://forms-eu1.hsforms.com https://hubspot-forms-static-embed-eu1.s3.amazonaws.com https://*.cookiebot.com https://*.lifeinside.io https://px.ads.linkedin.com https://www.google.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://adservice.google.com https://*.hotjar.io wss://ws.hotjar.com https://forms-eu1.hubspot.com https://cta-eu1.hubspot.com https://api-eu1.hubspot.com https://bat.bing.com https://www.facebook.com https://www.youtube.com https://analytics.inzynk.io https://*.livechatinc.com https://www.juicer.io https://widget.datablocks.se https://hub.mfn.se/ https://dc.services.visualstudio.com https://js.monitor.azure.com https://*.optimizely.com 'self' https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com; style-src 'unsafe-inline' https://use.typekit.net https://p.typekit.net https://fonts.googleapis.com https://consent.cookiebot.com https://www.juicer.io https://widget.datablocks.se 'self'; frame-ancestors ; form-action 'self' https://forms-eu1.hsforms.com https://www.facebook.com; default-src ; base-uri 'self'; |
| hsts | max-age=31536000; includeSubDomains; preload |
| xcto | nosniff |
| referrer | same-origin |
| permissions | publickey-credentials-get=(), xr-spatial-tracking=(), screen-wake-lock=(), cross-origin-isolated=(), web-share=(), picture-in-picture=(), keyboard-map=(), encrypted-media=(), display-capture=(), usb=(), serial=(), payment=(), midi=(), microphone=(), magnetometer=(), geolocation=(), camera=(), fullscreen=(), autoplay=(), accelerometer=() |
| frame | SAMEORIGIN |
- Blandet innhold: 2 http-referanser
- Source maps eksponert: UNKNOWN
- Versjons-avsløring: cloudflare

## 4. Crawl-resultat

- Sider sjekket: 25 · Vellykket: 25
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/10

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: — · CDN: Cloudflare · Hosting: cloudflare
- Analytics/trackere: Google Analytics/Tag Manager
- Tredjeparts-domener: www.juicer.io

## 6. SEO / Meta / Struktur

- Tittel: Facility Management i Norge | Coor · Meta-beskrivelse: 
- Canonical: — · robots.txt: ja · Sitemap: 1 URL-er
- OpenGraph: {"title":true,"description":true,"image":true} · JSON-LD: ja
- Headings: {"h1":1,"h2":13,"h3":52,"h4":1,"h5":0,"h6":0} · Lang: no

## 7. Browser-evidence

- Rendered DOM: 684934 tegn
- Skjermbilder: /Users/taj/arch-platform/docs/audits/prospects/www.coor.no/browser-evidence/screenshot-desktop.png, /Users/taj/arch-platform/docs/audits/prospects/www.coor.no/browser-evidence/screenshot-mobile.png
- Console-feil: 0
- Failed requests: 0

## 8. Automatiserings-signaler

- {"contact_form":true,"analytics":true,"cmp":false,"chat":true,"booking":true,"newsletter":false}
- Uutnyttet potensial: 33% (4/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-www.coor.no.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._