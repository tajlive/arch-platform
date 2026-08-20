# Arch Audit Beta Onboarding v0.1

**Dato:** 2026-08-20

---

## 1. Beta-kriterier

**Prioriter (best fit):**
- 10–100 ansatte
- Tydelige, repeterbare prosesser
- Norsk SMB
- Digitaliseringsbehov (mye manuelt arbeid)
- Villig til å gi feedback

**Ikke prioriter først:**
- Store enterprise (kompleksitet > læringsverdi i beta)
- Svært regulerte bransjer (compliance-overhead)
- Selskaper uten kapasitet til oppfølging

## 2. Anbefalte første bransjer

| Gruppe | Eksempler | Hvorfor |
|--------|-----------|---------|
| Service/håndverk | bilverksted, glass, elektro, bygg | Mange manuelle prosesser |
| Administrasjonstunge SMB | regnskap, eiendom, logistikk | Mange dokument-/arbeidsflyter |
| Teknologibedrift | SaaS, konsulent | Gir god teknisk feedback |

## 3. Onboarding-flyt

```
Admin inviterer (POST /v1/internal/beta/tenant/create)
        ↓
Bedrift mottar tilgang (onetimepin → contact_email)
        ↓
Login (Cloudflare Access)
        ↓
Company X-Ray (public signals)
        ↓
AI Audit Consultant
        ↓
Findings
        ↓
Feedback (relevans + prioritet)
        ↓
Outcome measurement (forventet vs faktisk verdi)
```

## 4. Admin provisioning (implementert)

```
POST /v1/internal/beta/tenant/create   (ADMIN/OWNER, Access-beskyttet)
Input:  { company_name, org_number, contact_email, industry, beta_cohort }
Output: { tenant_id, company_id, invitation_status, created_at }

GET /v1/internal/beta/companies        (liste beta-selskaper)
```

Oppretter atomisk: tenant + company entity + identity + user + membership(OWNER) + beta_program.

## 5. Tilgangsstyring

- **Tenant isolation:** hver beta-bedrift = egen tenant. Cross-tenant-testet (7/7).
- **Rolle:** eier onboardes som OWNER.
- **Ingen kryssbruk:** Tenant A kan aldri se tenant B sin beta-status, funn, spørsmål eller resultater.

## 6. Databehandling (privacy)

- Tenant Knowledge isoleres per tenant (aldri brukt på andre uten godkjenning).
- Aggregert bransjeintelligens krever n ≥ 10.
- Ingen personopplysninger i læring.
- Feedback lagres tenant-scoped (`beta_feedback.tenant_id`).

## 7. Feedback-modell (implementert i schema)

**Etter audit (relevans + prioritet):**
- Relevans: Ja / Nei / Delvis
- Prioritet: Nå / Senere / Ikke aktuelt

**Etter implementering (outcome):**
- Forventet verdi vs faktisk verdi → prediction accuracy

## 8. Release Gate (før første kunde)

- [x] Tenant isolation verifisert (7/7 cross-tenant)
- [x] Backup utført (D1 export)
- [x] Access aktiv (OTP)
- [x] Demo testet (Nordic Service AS)
- [x] Logging aktiv (strukturert)
- [x] Incident-plan dokumentert
- [ ] Onboarding-test utført (manuell provisionering av første beta-selskap)

## 9. Ikke automatiser alt ennå

Manuell godkjenning er riktig i beta. Automatiser først etter at vi vet:
- hva kundene faktisk trenger
- hvilke spørsmål som gir verdi
- hvilke funn som treffer

---

## CTO-prinsipp

> De første 5 kundene er ikke bare kunder. De er treningsdata for Arch sin kunnskapsplattform. Kvaliteten på de første auditene bestemmer kvaliteten på fremtidig AI.
