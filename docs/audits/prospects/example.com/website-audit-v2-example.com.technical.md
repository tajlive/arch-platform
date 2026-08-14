# Teknisk appendix — Arch Website Audit example.com

> **Generert:** 2026-08-14T23:14:41.710Z · **Nettsted:** https://example.com · **Endelig URL:** https://example.com

> For utvikler/byrå/IT-leverandør. Executive-rapporten er website-audit-example.com.md.

## 1. Per-sjekk (evidence + confidence)

| Dimensjon | Sjekk | Resultat | Evidence | Confidence |
|---|---|---|---|---|
| reliability | HTTP-status (hovedsiden) | PASS | HTTP 200 | high |
| security | HTTPS/TLS | PASS | HTTPS leverte respons | high |
| reliability | Omdirigeringskjede | NOT_APPLICABLE | ingen redirects | high |
| reliability | Ødelagte interne lenker | PASS | 1 sider sjekket, 0 ødelagt | high |
| reliability | Ressurs-feil (img/css/js) | PASS | ingen same-origin-ressurser å sample | high |
| performance | Komprimering (gzip/brotli) | PASS | br | high |
| performance | Cache-headere | FAIL | ingen cache-control | high |
| performance | Render-blokkerende ressurser | PASS | 0 blokkerende skript, 0 stylesheets | medium |
| performance | Bilde-optimalisering | NOT_APPLICABLE | ingen <img> | medium |
| performance | Tredjeparts-skript/-ressurser | PASS | 0 eksterne domener | medium |
| ux_mobile | Viewport meta | PASS | viewport tilstede | high |
| ux_mobile | Responsive CSS (@media) | UNKNOWN | stylesheets ikke observerbare | low |
| accessibility | Språk-attributt (lang) | PASS | en | high |
| accessibility | Alt-tekst på bilder | NOT_APPLICABLE | ingen <img> | high |
| accessibility | Skjemaetiketter | NOT_APPLICABLE | ingen skjemainput | medium |
| accessibility | Overskriftshierarki | FAIL | h1=1 h2=0 h3=0 | high |
| accessibility | Semantiske landemerker | FAIL | 0/4 (ingen) | high |
| seo | Tittel | PASS | Example Domain | high |
| seo | Meta-beskrivelse | FAIL | mangler meta description | high |
| seo | Canonical | FAIL | mangler canonical | high |
| seo | Robots-meta | PASS | ingen robots-meta (standard: indekserbart) | medium |
| seo | robots.txt | FAIL | mangler robots.txt | high |
| seo | Sitemap.xml | FAIL | mangler sitemap.xml | high |
| seo | OpenGraph | FAIL | title=false description=false image=false | high |
| seo | Strukturert data (JSON-LD) | FAIL | ingen JSON-LD | high |
| security | Header: csp | FAIL | mangler | high |
| security | Header: hsts | FAIL | mangler | high |
| security | Header: xcto | FAIL | mangler | high |
| security | Header: referrer | FAIL | mangler | high |
| security | Header: permissions | FAIL | mangler | high |
| security | Header: frame | FAIL | mangler | high |
| security | Blandet innhold (http på https) | PASS | ingen http-referanser i HTML | high |
| security | Eksponerte source maps | UNKNOWN | skript ikke observerbare | low |
| security | Versjons-avsløring | FAIL | cloudflare | high |
| trust_privacy | Cookie-banner | FAIL | ingen cookie-banner observert | low |
| trust_privacy | Personvernerklæring-link | FAIL | ingen personvern-link observert | high |
| trust_privacy | Samtykke-plattform (CMP) | NOT_APPLICABLE | ingen trackere observert — CMP ikke nødvendig | low |
| trust_privacy | Kontakt-/lead-skjema | FAIL | ingen <form> observert | high |
| trust_privacy | Call-to-action | FAIL | ingen tydelig CTA observert | low |
| tech | Teknologi: cdn | PASS | Cloudflare | high |
| tech | Teknologi: hosting | PASS | cloudflare | high |
| security | Sikkerhetsheadere — gradering F | FAIL | Gradering F. Content-Security-Policy: MANGLER; Strict-Transport-Security: MANGLER; X-Frame-Options: MANGLER; X-Content-Type-Options: MANGLER; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · X-Content-Type-Options mangler nosniff · Referrer-Policy mangler · Permissions-Policy mangler | high |
| security | Cookie-sikkerhet (HttpOnly/Secure/SameSite) | PASS | Ingen cookies satt av serveren (0 set-cookie-headere). | high |
| security | Ingen versjonslekkasjer | PASS | Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert. | medium |
| security | TLS-sertifikat gyldighet | PASS | notBefore=2026-07-29T22:10:08.000Z, notAfter=2026-10-27T22:17:21.000Z, issuer=/C=US/O=SSL Corporation/CN=Cloudflare TLS Issuing ECC CA 3, SAN=example.com, *.example.com | high |
| security | TLS-sertifikat-verifisering | PASS | verify return code: 0 (ok) | high |
| security | Legacy-TLS (1.0/1.1) støtte | FAIL | TLS 1.0: available · TLS 1.1: available | medium |
| security | SPF (avsender-verifisering) | PASS | v=spf1 -all | high |
| security | SPF: private IP-er i mekanismene | PASS | ingen private IP-er i SPF | medium |
| security | DKIM (e-post-signering) | PASS | selectorer: default, dkim, google, selector1, selector2, s1, k1 | medium |
| security | DMARC (spoofing-beskyttelse) | PASS | p=reject (blokk) — v=DMARC1;p=reject;sp=reject;adkim=s;aspf=s | high |
| security | MTA-STS (håndhevet e-post-TLS) | FAIL | ingen MTA-STS (TXT + policy-fil mangler) | high |
| security | TLS-RPT (TLS-rapportering) | FAIL | ingen TLS-rapportering | medium |
| trust_privacy | BIMI (merkevare-logo i innboks) | NOT_APPLICABLE | ingen BIMI (ikke påkrevd) | low |
| security | CAA (sertifikat-utsteder-kontroll) | FAIL | ingen CAA | high |
| security | DNSSEC (signert sone) | PASS | AD-flag — signert sone validert | high |
| trust_privacy | E-post-omdømme (DNSBL) | UNKNOWN | kunne ikke oppslå IP for  | low |
| security | Subdomene-eksponering (crt.sh) | UNKNOWN | crt.sh-feil: HTTP 502 | low |
| trust_privacy | Firma i Brreg (Enhetsregisteret) | UNKNOWN | N kandidater for «Example Domain», ingen med Brreg-hjemmeside som matcher example.com — kan ikke entydig knytte firma til domene. Kandidater: DOMAINS DA (981478908) · DIBASEY DOMAIN (927701308) · EF DOMAIN (994230050) | medium |
| trust_privacy | Bransjekontekst (SSB, næring 63) | PASS | SSB tabell 12817: Informasjonstjenester — 1 302 foretak (2024) | high |
| trust_privacy | Domenet registrert (Norid) | NOT_APPLICABLE | utenlandsk domene — Norid ikke autoritativ | high |
| reliability | Arkivhistorikk finnes | PASS | arkivert siden 2002-01-20 | high |
| reliability | Aktualitet (siste arkiverte versjon) | FAIL | ingen fangst i Wayback siste 12 måneder — siden kan være inaktiv | medium |
| reliability | Arkivomfang | UNKNOWN | omfang ikke tilgjengelig (Wayback CDX timeout på full historikk) | medium |
| trust_privacy | Cookie-banner / samtykke-plattform (CMP) | FAIL | ingen CMP/banner observert — potential concern, krever juridisk vurdering | medium |
| trust_privacy | Reelt valg (avvis-knapp) | NOT_APPLICABLE | ingen banner/CMP observert | high |
| trust_privacy | Forhåndsavkrysset samtykke | PASS | ingen forhåndsavkryssede samtykke-inputs observert | high |
| trust_privacy | Personvernerklæring | FAIL | ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering | high |
| trust_privacy | Tredjeparts-trackere | PASS | ingen kjente tredjeparts-trackere observert | high |
| trust_privacy | Google Fonts (ekstern) | PASS | ingen ekstern Google Fonts observert | high |
| trust_privacy | Pris inkl. mva | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| trust_privacy | Angrerett-informasjon | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| trust_privacy | Klageadgang / tvisteløsning | NOT_APPLICABLE | ingen e-handels-signaler observert (handlekurv/kjøp/pris) | high |
| performance | PageSpeed mobil | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed desktop | UNKNOWN | API-feil: HTTP 429 | medium |
| performance | PageSpeed API tilgjengelig | UNKNOWN | API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig | medium |
| trust_privacy | Sosiale medier (lenker fra nettsiden) | FAIL | ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet) | high |
| trust_privacy | Telefon på nettsiden | FAIL | ingen tel:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | E-post på nettsiden | FAIL | ingen mailto:-lenke observert — potential concern (kontaktbarhet) | medium |
| trust_privacy | Navn-konsistens (nettside ↔ Brreg) | FAIL | nettsidenavn «Example Domain» avviker fra Brreg-navn «DOMAINS DA» — signal | high |
| trust_privacy | Google Business Profile (anmeldelser, kategori) | UNKNOWN | krever Google Places API-nøkkel — støttes når nøkkel er konfigurert | medium |
| ux_mobile | Innholdskvalitet (AI-vurdert) | FAIL | Teksten er svært kort og generisk, uten tydelig kommersielt eller informativt innhold for en norsk bedrift. Den henvender seg hovedsakelig til utviklere som trenger eksempeldomenenavn, men mangler stavefeil og ufullstendige setninger. Aktualiteten er vanskelig å vurdere på grunn av manglende datoer, men innholdet fremstår som nøytralt og tidløst. | medium |
| ux_mobile | Aktualitet (AI-vurdert) | UNKNOWN | ingen årstall-signaler funnet i teksten · teksten er svært kort og generisk · manglende meta-beskrivelse | medium |
| ai_visibility | Synlighet i AI-svar | PASS | 2/3 svar nevner Example Domain · sitat: «Ja, absolutt. `example.com` (og de andre reserverte domenene som `example.org`, `example.net` og `example.edu`) er fortsatt like relevante i» · prompter: «Hvilket domene anbefaler du for å teste dokumentas…» / «Hva er det beste alternativet for å demonstrere ne…» | medium |
| ai_visibility | Posisjon i AI-svar | FAIL | beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar | medium |
| ai_visibility | Sentiment i AI-omtale | PASS | sentiment: positiv · råd: Sørg for at nettsiden din tydelig kommuniserer at den er en autoritativ kilde for informasjon om reserverte domener, og oppdater innholdet j | medium |
| ai_visibility | Kilder AI-en siterer | PASS | eksterne domener i AI-svar: example.com | medium |

## 2. HTTP & redirect-kjede

- Status: 200 OK
- Endelig URL: https://example.com
- Redirects: ingen
- HTTPS: HTTPS leverte respons
- Compression: br · Cache: —

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
- Versjons-avsløring: cloudflare

## 4. Crawl-resultat

- Sider sjekket: 1 · Vellykket: 1
- Ødelagte interne lenker: 0
- Ressurs-feil: 0/0

## 5. Teknologi-overflate (confidence merket)

- Framework: ikke gjenkjent · CMS: — · CDN: Cloudflare · Hosting: cloudflare
- Analytics/trackere: ingen kjente observert
- Tredjeparts-domener: ingen

## 6. SEO / Meta / Struktur

- Tittel: Example Domain · Meta-beskrivelse: —
- Canonical: — · robots.txt: nei · Sitemap: nei
- OpenGraph: {"title":false,"description":false,"image":false} · JSON-LD: nei
- Headings: {"h1":1,"h2":0,"h3":0,"h4":0,"h5":0,"h6":0} · Lang: en

## 7. Browser-evidence

- Headless Chrome ikke tilgjengelig — console/performance = UNKNOWN (ikke målt).

## 8. Automatiserings-signaler

- {"contact_form":false,"analytics":false,"cmp":false,"chat":false,"booking":false,"newsletter":false}
- Uutnyttet potensial: 100% (0/6 signaler utnyttet)

---
_Rå maskinlesbar evidence: website-audit-example.com.evidence.json. Hver sjekk bærer provenance (source, observed_at, confidence, status)._

# V2-moduler — teknisk oversikt

## Hva en hacker ser (security_hacker)

- [FAIL] security_headers: Gradering F. Content-Security-Policy: MANGLER; Strict-Transport-Security: MANGLER; X-Frame-Options: MANGLER; X-Content-Type-Options: MANGLER; Referrer-Policy: MANGLER; Permissions-Policy: MANGLER Trekk: CSP mangler · HSTS mangler · X-Frame-Options mangler (og ingen frame-ancestors i CSP) · X-Content-Type-Options mangler nosniff · Referrer-Policy mangler · Permissions-Policy mangler
- [PASS] cookies_attributes: Ingen cookies satt av serveren (0 set-cookie-headere).
- [PASS] version_leaks: Ingen server/x-powered-by/x-aspnet-version-header, <meta generator>, gammel jQuery eller WordPress-signatur observert.
- [PASS] tls_cert: notBefore=2026-07-29T22:10:08.000Z, notAfter=2026-10-27T22:17:21.000Z, issuer=/C=US/O=SSL Corporation/CN=Cloudflare TLS Issuing ECC CA 3, SAN=example.com, *.example.com
- [PASS] tls_verify: verify return code: 0 (ok)
- [FAIL] tls_legacy: TLS 1.0: available · TLS 1.1: available

Rådata-nøkler: url, final_url, status, status_text, redirects, headers, security_grade, security_deductions, cookies, version_leaks, tls

## E-post & DNS-sikkerhet (email_dns)

- [PASS] spf: v=spf1 -all
- [PASS] spf_private_ip: ingen private IP-er i SPF
- [PASS] dkim: selectorer: default, dkim, google, selector1, selector2, s1, k1
- [PASS] dmarc: p=reject (blokk) — v=DMARC1;p=reject;sp=reject;adkim=s;aspf=s
- [FAIL] mta_sts: ingen MTA-STS (TXT + policy-fil mangler)
- [FAIL] tls_rpt: ingen TLS-rapportering
- [NOT_APPLICABLE] bimi: ingen BIMI (ikke påkrevd)
- [FAIL] caa: ingen CAA
- [PASS] dnssec: AD-flag — signert sone validert
- [UNKNOWN] dnsbl: kunne ikke oppslå IP for 
- [UNKNOWN] subdomains: crt.sh-feil: HTTP 502

Rådata-nøkler: original, registrable, subdomain_of_input, spf, dkim, dmarc, mta_sts, tls_rpt, bimi, caa, dnssec, mx, dnsbl, subdomains

## Norge-data (Brreg · Norid · SSB) (norge)

- [UNKNOWN] brreg_org: N kandidater for «Example Domain», ingen med Brreg-hjemmeside som matcher example.com — kan ikke entydig knytte firma til domene. Kandidater: DOMAINS DA (981478908) · DIBASEY DOMAIN (927701308) · EF DOMAIN (994230050)
- [PASS] ssb_context: SSB tabell 12817: Informasjonstjenester — 1 302 foretak (2024)
- [NOT_APPLICABLE] norid_registered: utenlandsk domene — Norid ikke autoritativ

Rådata-nøkler: brreg, norid, ssb

## Historikk (Wayback Machine) (history)

- [PASS] history_exists: arkivert siden 2002-01-20
- [FAIL] history_freshness: ingen fangst i Wayback siste 12 måneder — siden kan være inaktiv
- [UNKNOWN] history_scope: omfang ikke tilgjengelig (Wayback CDX timeout på full historikk)

Rådata-nøkler: snapshots, first_seen, last_seen, snapshot_count, error, fallback

## Compliance-signaler Norge (compliance)

- [FAIL] cmp_banner: ingen CMP/banner observert — potential concern, krever juridisk vurdering
- [NOT_APPLICABLE] consent_real_choice: ingen banner/CMP observert
- [PASS] consent_prechecked: ingen forhåndsavkryssede samtykke-inputs observert
- [FAIL] privacy_policy: ingen personvernerklæring-link observert — potential concern, krever juridisk vurdering
- [PASS] third_party_trackers: ingen kjente tredjeparts-trackere observert
- [PASS] google_fonts: ingen ekstern Google Fonts observert
- [NOT_APPLICABLE] ecom_price_vat: ingen e-handels-signaler observert (handlekurv/kjøp/pris)
- [NOT_APPLICABLE] ecom_angrerett: ingen e-handels-signaler observert (handlekurv/kjøp/pris)
- [NOT_APPLICABLE] ecom_klage: ingen e-handels-signaler observert (handlekurv/kjøp/pris)

Rådata-nøkler: url, fetched, status, fetch_error, html_length, script_srcs, cmp, consent_reject, consent_prechecked, privacy, trackers, google_fonts, ecommerce

## Fart (PageSpeed Insights + CrUX) (pagespeed)

- [UNKNOWN] psi_mobile: API-feil: HTTP 429
- [UNKNOWN] psi_desktop: API-feil: HTTP 429
- [UNKNOWN] psi_availability: API-et svarte ikke for noen strategi — fartstall ikke tilgjengelig

Rådata-nøkler: mobile, desktop

## Tilstedeværelse (sosiale medier · NAP) (presence)

- [FAIL] social_profiles: ingen profillenker til sosiale medier funnet på nettsiden — potential concern (bedriftens synlighet)
- [FAIL] nap_phone: ingen tel:-lenke observert — potential concern (kontaktbarhet)
- [FAIL] nap_email: ingen mailto:-lenke observert — potential concern (kontaktbarhet)
- [FAIL] nap_name_consistency: nettsidenavn «Example Domain» avviker fra Brreg-navn «DOMAINS DA» — signal
- [UNKNOWN] google_business: krever Google Places API-nøkkel — støttes når nøkkel er konfigurert

Rådata-nøkler: social, contact, google_business

## AI-analyse av innhold (DeepSeek) (ai_analysis)

- [FAIL] ai_content_quality: Teksten er svært kort og generisk, uten tydelig kommersielt eller informativt innhold for en norsk bedrift. Den henvender seg hovedsakelig til utviklere som trenger eksempeldomenenavn, men mangler stavefeil og ufullstendige setninger. Aktualiteten er vanskelig å vurdere på grunn av manglende datoer, men innholdet fremstår som nøytralt og tidløst.
- [UNKNOWN] ai_content_freshness: ingen årstall-signaler funnet i teksten · teksten er svært kort og generisk · manglende meta-beskrivelse

Rådata-nøkler: available, error, prompt, response, model

## AI-synlighet (GEO — hvordan AI-assistenter omtaler dere) (ai_visibility)

- [PASS] ai_vis_visibility: 2/3 svar nevner Example Domain · sitat: «Ja, absolutt. `example.com` (og de andre reserverte domenene som `example.org`, `example.net` og `example.edu`) er fortsatt like relevante i» · prompter: «Hvilket domene anbefaler du for å teste dokumentas…» / «Hva er det beste alternativet for å demonstrere ne…»
- [FAIL] ai_vis_position: beste posisjon: nevnt i løpende tekst (ikke topp-liste) av 3 svar
- [PASS] ai_vis_sentiment: sentiment: positiv · råd: Sørg for at nettsiden din tydelig kommuniserer at den er en autoritativ kilde for informasjon om reserverte domener, og oppdater innholdet j
- [PASS] ai_vis_sources: eksterne domener i AI-svar: example.com

Rådata-nøkler: available, error, model, brand_candidates, prompts, answers, analysis, measurements

# V2-kjøretid: 45937 ms (moduler parallelt)