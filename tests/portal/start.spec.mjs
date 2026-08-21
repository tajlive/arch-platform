import { test, expect } from "@playwright/test";
import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "apps", "customer-portal");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
};

let server;
let baseUrl;

test.beforeAll(async () => {
  server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relativePath = pathname === "/" ? "start.html" : pathname.replace(/^\/+/, "");
    const file = resolve(root, relativePath);

    if (!file.startsWith(`${root}${sep}`) || !statSync(file, { throwIfNoEntry: false })?.isFile()) {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200, { "content-type": contentTypes[extname(file)] || "application/octet-stream" });
    response.end(readFileSync(file));
  });
  await new Promise((resolveServer) => server.listen(0, "127.0.0.1", resolveServer));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.afterAll(async () => new Promise((resolveServer) => server.close(resolveServer)));

const intelligenceResponse = {
  resolved: true,
  company: {
    company_name: "ROLF SOLHEIM",
    org_number: "936796702",
    postal_code: "7011",
    postal_place: "TRONDHEIM"
  },
  intelligence: {
    identity: {
      industry_name: "Drift av restauranter",
      employees: null,
      municipality: null
    },
    leadership: [{ role_description: "Innehaver", person_name: "Rolf Solheim" }],
    financial: null,
    digital: null,
    sources: [
      { label: "Company identity", status: "AVAILABLE" },
      { label: "Leadership & governance", status: "AVAILABLE" },
      { label: "Financial profile", status: "EMPTY" },
      { label: "Digital footprint", status: "NOT_AVAILABLE" }
    ]
  }
};

const comparisonResponse = {
  resolved: true,
  unresolved: [],
  report: {
    companies: [
      {
        org_number: "999888777",
        company_name: "ROLF SOLHEIM",
        metrics: { operating_margin: 12, employees: 7, digital_score: 45 },
        source_status: {
          "brreg-enhet": "AVAILABLE",
          "brreg-regnskap": "AVAILABLE",
          "brreg-regnskap-historikk": "EMPTY",
          website: "AVAILABLE",
          "nav-arbeidsplassen": "EMPTY"
        }
      },
      {
        org_number: "111222333",
        company_name: "TRONDHEIM SPISESTED AS",
        metrics: { operating_margin: 4, employees: 5, digital_score: 15 },
        source_status: {
          "brreg-enhet": "AVAILABLE",
          "brreg-regnskap": "AVAILABLE",
          "brreg-regnskap-historikk": "AVAILABLE",
          website: "EMPTY",
          "nav-arbeidsplassen": "NOT_AVAILABLE"
        }
      }
    ],
    benchmark: {
      peer_group: {
        industry_name: "Drift av restauranter",
        note: "Sammenligningen bygger på de valgte virksomhetene. Ingen kompatibel SSB-referanse var tilgjengelig."
      },
      metrics: [
        {
          key: "operating_margin",
          label: "Driftsmargin",
          unit: "percent",
          values: [
            { org_number: "999888777", value: 12 },
            { org_number: "111222333", value: 4 }
          ],
          median: 8
        },
        {
          key: "employees",
          label: "Ansatte",
          unit: "count",
          values: [
            { org_number: "999888777", value: 7 },
            { org_number: "111222333", value: 5 }
          ],
          median: 6
        },
        {
          key: "digital_score",
          label: "Digital synlighet",
          unit: "score",
          values: [
            { org_number: "999888777", value: 45 },
            { org_number: "111222333", value: 15 }
          ],
          median: 30
        }
      ],
      sources: [
        { key: "selected-company-peer-set", label: "Valgt sammenligningsgruppe", status: "AVAILABLE" },
        { key: "ssb-bransje", label: "SSB-bransjereferanse", status: "NOT_AVAILABLE", note: "Ingen kompatibel SSB-referanse ble returnert." }
      ]
    },
    strengths: [{
      company_name: "ROLF SOLHEIM",
      metric: "operating_margin",
      detail: "ROLF SOLHEIM har 12 mot medianen på 8 i sammenligningsgruppen.",
      evidence_refs: ["financial|999888777|operating_result"]
    }],
    weaknesses: [{
      company_name: "TRONDHEIM SPISESTED AS",
      metric: "operating_margin",
      detail: "TRONDHEIM SPISESTED AS har 4 mot medianen på 8 i sammenligningsgruppen.",
      evidence_refs: ["financial|111222333|operating_result"]
    }],
    gaps: [{
      company_name: "TRONDHEIM SPISESTED AS",
      metric: "workforce_signals",
      detail: "TRONDHEIM SPISESTED AS har ingen dokumentert verdi for rekrutteringssignaler.",
      evidence_refs: []
    }],
    recommendations: [{
      company_name: "TRONDHEIM SPISESTED AS",
      priority: "HIGH",
      action: "Undersøk avviket i driftsmargin mot sterkere sammenligningsvirksomheter.",
      based_on: ["financial|111222333|operating_result"]
    }]
  }
};

const defaultSearchCandidates = [
  {
    org_number: "999888777",
    company_name: "ROLF SOLHEIM",
    municipality: "TRONDHEIM",
    postal_code: "7011",
    postal_place: "TRONDHEIM"
  }
];

async function mockAuditApi(page, searchCandidates, options = {}) {
  const calls = { questions: [], searches: [], comparisons: [], analyst: [], feedback: [] };
  const candidates = searchCandidates || defaultSearchCandidates;
  await page.route("https://api.arch.axn.no/v1/public/audit/session", (route) => route.fulfill({ status: 200, body: "{}" }));
  await page.route("https://api.arch.axn.no/v1/public/company/search", async (route) => {
    const body = route.request().postDataJSON();
    calls.searches.push(body);
    const queryCandidates = options.searchCandidatesByQuery && options.searchCandidatesByQuery[String(body.query || "").toLowerCase()];
    const resolvedCandidates = queryCandidates || candidates;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ query: body.query, count: resolvedCandidates.length, candidates: resolvedCandidates })
    });
  });
  await page.route("https://api.arch.axn.no/v1/public/company/intelligence", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(intelligenceResponse)
  }));
  await page.route("https://api.arch.axn.no/v1/public/company/resolve", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ context_id: "test-context" })
  }));
  await page.route("https://api.arch.axn.no/v1/public/audit/question", async (route) => {
    const body = route.request().postDataJSON();
    calls.questions.push(body);
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 75));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        question: {
          Kundekommunikasjon: "For ROLF SOLHEIM: Hvor kommer flest nye kundehenvendelser inn i dag?",
          Administrasjon: "For ROLF SOLHEIM: Hvilken administrativ oppgave tar mest tid i en vanlig uke?",
          Dokumentasjon: "For ROLF SOLHEIM: Hvilken dokumentasjon er vanskeligst å finne når dere trenger den?",
          Drift: "For ROLF SOLHEIM: Hvor oppstår de største forsinkelsene i den daglige driften?",
          Salg: "For ROLF SOLHEIM: Hvilket steg i salgsarbeidet gir færrest henvendelser eller avtaler?"
        }[body.focus_area],
        required_for: "IDENTIFY_PROCESS",
        expected_information_gain: 25
      })
    });
  });
  await page.route("https://api.arch.axn.no/v1/public/company/analyst", async (route) => {
    const body = route.request().postDataJSON();
    calls.analyst.push(body);
    if (options.analystError) {
      await route.fulfill({
        status: options.analystError.status || 503,
        contentType: "application/json",
        body: JSON.stringify({ error: options.analystError.error })
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        analyst: {
          summary: "Dokumentert syntese for virksomheten.",
          strengths: [{ claim: "Etablert ledelse", evidence_refs: ["brreg-roller"], kind: "FACT" }],
          weaknesses: [],
          priorities: [{
            rank: 1,
            recommendation: "Kartlegge arbeidsprosesser",
            expected_effect: "Redusert tidsbruk",
            effort: "medium",
            time_horizon: 90,
            evidence_refs: ["brreg-regnskap"],
            uncertainties: ["uforutsette avhengigheter"],
            pre_work: ["intervjue ansatte"],
            kind: "HYPOTHESIS"
          }],
          unknowns: [{ question: "Digital tilstedeværelse?", why: "mangler evidens" }]
        },
        model: { model: "test-model", tokens: { output: 42 } },
        provenance: { disclaimer: "Beslutningsstøtte, ikke rådgivning." }
      })
    });
  });
  await page.route("https://api.arch.axn.no/v1/public/company/compare", async (route) => {
    calls.comparisons.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(options.comparisonResponse || comparisonResponse)
    });
  });
  await page.route("https://api.arch.axn.no/v1/public/analyst/feedback", async (route) => {
    const body = route.request().postDataJSON();
    calls.feedback.push(body);
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, feedback_id: "fb-test-1" }) });
  });
  return calls;
}

async function openBrief(page) {
  const calls = await mockAuditApi(page);
  await page.goto(`${baseUrl}/start.html`);
  await page.locator("#company-input").fill("Rolf Solheim");
  await page.locator("#discover-btn").click();
  await expect(page.locator("#brief-panel")).toBeVisible();
  return calls;
}

test("viser en norsk, dokumentert virksomhetsoversikt uten tekniske statuser", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openBrief(page);

  const brief = page.locator("#brief-panel");
  await expect(brief).toContainText("Virksomhetsoversikt");
  await expect(brief).toContainText("ROLF SOLHEIM");
  await expect(brief).toContainText("Ledelse og roller");
  await expect(brief).toContainText("Datagrunnlag");
  await expect(brief).toContainText("Postnummer og poststed");
  await expect(brief).toContainText("7011 TRONDHEIM");
  await expect(brief).toContainText("Opplysninger som ikke er dokumentert, vises ikke som fakta.");
  await expect(brief).not.toContainText("Not connected");
  await expect(brief).not.toContainText("No data");
  await expect(brief).not.toContainText("NameROLF");

  const label = brief.locator(".brief-row").first().locator(".brief-label");
  const value = brief.locator(".brief-row").first().locator(".brief-value");
  const [labelBox, valueBox] = await Promise.all([label.boundingBox(), value.boundingBox()]);
  expect(valueBox.x).toBeGreaterThan(labelBox.x + labelBox.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await testInfo.attach("start-desktop", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
});

test("holder tekst og valg ryddig på mobil", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const calls = await openBrief(page);

  const brief = page.locator("#brief-panel");
  const label = brief.locator(".brief-row").first().locator(".brief-label");
  const value = brief.locator(".brief-row").first().locator(".brief-value");
  const [labelBox, valueBox] = await Promise.all([label.boundingBox(), value.boundingBox()]);
  expect(valueBox.y).toBeGreaterThan(labelBox.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await expect(page.locator("#friction-panel")).toBeVisible();
  await page.locator("#friction-grid").evaluate((grid) => {
    const admin = [...grid.querySelectorAll("button")].find((button) => button.textContent.includes("Administrasjon"));
    for (let i = 0; i < 5; i++) admin.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await expect(page.locator("#conversation-panel")).toContainText("Hvilken administrativ oppgave tar mest tid i en vanlig uke?");
  await expect(page.locator("#conversation-panel")).toContainText("Formål: kartlegge arbeidsflyten");
  await expect(page.locator("#conversation-panel .msg")).toHaveCount(1);
  expect(calls.questions).toEqual([{ context_id: "test-context", focus_area: "Administrasjon" }]);

  await testInfo.attach("start-mobile", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
});

test("viser firma-velger ved flertreff og kartlegger valgt virksomhet", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const calls = await mockAuditApi(page, [
    {
      org_number: "111111111",
      company_name: "MELHUS BIL ORKANGER AS",
      municipality: "TRONDHEIM",
      postal_code: "7000",
      postal_place: "TRONDHEIM"
    },
    {
      org_number: "944638741",
      company_name: "MELHUS BIL TRONDHEIM AS",
      municipality: "ORKANGER",
      postal_code: "7300",
      postal_place: "ORKANGER"
    }
  ]);
  await page.goto(`${baseUrl}/start.html`);
  await page.locator("#company-input").fill("melhus bil");
  await page.locator("#discover-btn").click();

  // Velgerlisten vises med begge kandidatene
  const picker = page.locator("#company-picker");
  await expect(picker).toBeVisible();
  await expect(picker).toContainText("MELHUS BIL ORKANGER AS");
  await expect(picker).toContainText("MELHUS BIL TRONDHEIM AS");
  await expect(picker).toContainText("7000 TRONDHEIM");
  await expect(picker).toContainText("7300 ORKANGER");

  // Velger andre kandidat → intelligence kjøres for valgt org.nr
  await page.locator(".company-picker-item", { hasText: "MELHUS BIL TRONDHEIM AS" }).click();
  await expect(page.locator("#brief-panel")).toBeVisible();
  await expect(page.locator("#brief-panel")).toContainText("ROLF SOLHEIM");

  // Search ble kalt med det opprinnelige søket
  expect(calls.searches).toHaveLength(1);
  expect(calls.searches[0].query).toBe("melhus bil");
});

test("gir tydelig veiledning for tomt søk og avbrutt virksomhetsvalg", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockAuditApi(page, [
    { org_number: "111111111", company_name: "FØRSTE VIRKSOMHET", postal_code: "7010", postal_place: "TRONDHEIM" },
    { org_number: "222222222", company_name: "ANDRE VIRKSOMHET", postal_code: "7020", postal_place: "TRONDHEIM" }
  ]);
  await page.goto(`${baseUrl}/start.html`);

  await page.locator("#discover-btn").click();
  await expect(page.locator("#status-note")).toHaveText("Skriv inn organisasjonsnummer, navn eller nettside for å starte kartleggingen.");
  await expect(page.locator("#company-input")).toBeFocused();

  await page.locator("#company-input").fill("virksomhet");
  await page.locator("#discover-btn").click();
  await expect(page.locator("#company-picker")).toBeVisible();
  await page.locator("#company-picker-cancel").click();
  await expect(page.locator("#company-picker")).toBeHidden();
  await expect(page.locator("#status-note")).toHaveText("Kartleggingen ble avbrutt.");
  await expect(page.locator("#discover-btn")).toBeEnabled();
});

test("viser Arch Analytiker med dokumenterte funn når fokusområde velges", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const calls = await mockAuditApi(page);
  await page.goto(`${baseUrl}/start.html`);
  await page.locator("#company-input").fill("Rolf Solheim");
  await page.locator("#discover-btn").click();
  await expect(page.locator("#brief-panel")).toBeVisible();

  // Velg fokusområde → analyst-panel åpner og henter dokumentert analyse
  await expect(page.locator("#friction-panel")).toBeVisible();
  await page.locator(".friction-card", { hasText: "Drift" }).click();

  const analyst = page.locator("#analyst-panel");
  await expect(analyst).toBeVisible();
  await expect(analyst).toContainText("Arch Analytiker");
  await expect(analyst).toContainText("Dokumentert syntese for virksomheten.");
  await expect(analyst).toContainText("Etablert ledelse");
  await expect(analyst).toContainText("Kartlegge arbeidsprosesser");
  await expect(analyst).toContainText("Ikke dokumentert");
  await expect(analyst).toContainText("Kilde: Styre og ledelse");
  // Ny kontrakt: innsats, tidshorisont, kind, forventet effekt, disclaimer
  await expect(analyst).toContainText("Innsats: Middels");
  await expect(analyst).toContainText("Tidshorisont: 90 dager");
  await expect(analyst).toContainText("Fakta");
  await expect(analyst).toContainText("Hypotese");
  await expect(analyst).toContainText("Forventet effekt: Redusert tidsbruk");
  await expect(analyst).toContainText("Beslutningsstøtte, ikke rådgivning.");

  // Riktig fokusområde ble sendt til analyst-endepunktet
  expect(calls.analyst).toHaveLength(1);
  expect(calls.analyst[0].focus_area).toBe("drift");
  expect(calls.analyst[0].org_number).toBeDefined();

  // Feedback: klikk "Korrekt" på en strength → POST til feedback-endepunkt
  await analyst.locator(".analyst-feedback-btn", { hasText: "Korrekt" }).first().click();
  await expect(analyst).toContainText("Registrert");
  await expect(analyst).toContainText("Takk for tilbakemeldingen.");
  expect(calls.feedback).toHaveLength(1);
  expect(calls.feedback[0].feedback).toBe("correct");
  expect(calls.feedback[0].finding_type).toBe("strength");
  expect(calls.feedback[0].focus_area).toBe("drift");
});

test("alle fokusområder gir et konkret spørsmål og en dokumentert analyse", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const calls = await openBrief(page);
  const questions = {
    Kundekommunikasjon: "Hvor kommer flest nye kundehenvendelser inn i dag?",
    Administrasjon: "Hvilken administrativ oppgave tar mest tid i en vanlig uke?",
    Dokumentasjon: "Hvilken dokumentasjon er vanskeligst å finne når dere trenger den?",
    Drift: "Hvor oppstår de største forsinkelsene i den daglige driften?",
    Salg: "Hvilket steg i salgsarbeidet gir færrest henvendelser eller avtaler?"
  };

  for (const [area, question] of Object.entries(questions)) {
    await page.locator(".friction-card", { hasText: area }).click();
    await expect(page.locator("#conversation-panel")).toContainText(question);
    await expect(page.locator("#analyst-panel")).toContainText("Dokumentert syntese for virksomheten.");
    await expect.poll(() => calls.analyst.length).toBe(Object.keys(questions).indexOf(area) + 1);
  }

  expect(calls.questions.map((call) => call.focus_area)).toEqual(Object.keys(questions));
  expect(calls.analyst.map((call) => call.focus_area)).toEqual([
    "kundekommunikasjon", "administrasjon", "dokumentasjon", "drift", "salg"
  ]);
});

test("gjør sammenligning, datadekning og analyst-kontekst tilgjengelig", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const calls = await mockAuditApi(page, undefined, {
    searchCandidatesByQuery: {
      "rolf solheim": defaultSearchCandidates,
      "spisested": [{
        org_number: "111222333",
        company_name: "TRONDHEIM SPISESTED AS",
        municipality: "TRONDHEIM",
        postal_code: "7010",
        postal_place: "TRONDHEIM"
      }]
    }
  });
  await page.goto(`${baseUrl}/start.html`);

  await page.locator("#mode-compare").click();
  await expect(page.locator("#comparison-selection")).toBeVisible();
  await expect(page.locator("#compare-run")).toBeDisabled();

  await page.locator("#company-input").fill("Rolf Solheim");
  await page.locator("#discover-btn").click();
  await expect(page.locator("#comparison-selection-list")).toContainText("ROLF SOLHEIM");

  await page.locator("#company-input").fill("spisested");
  await page.locator("#discover-btn").click();
  await expect(page.locator("#comparison-selection-list")).toContainText("TRONDHEIM SPISESTED AS");
  await expect(page.locator("#compare-run")).toBeEnabled();

  await page.locator("#compare-run").click();
  const comparison = page.locator("#comparison-panel");
  await expect(comparison).toBeVisible();
  await expect(comparison).toContainText("Driftsmargin");
  await expect(comparison).toContainText("Median i utvalget: 8 %");
  await expect(comparison).toContainText("Dokumenterte avvik");
  await expect(comparison).toContainText("Manglende datagrunnlag");
  await expect(comparison).toContainText("Kildedekning");
  await expect(comparison).toContainText("Ingen registrerte data");
  await expect(comparison).toContainText("Ikke tilgjengelig");
  expect(calls.comparisons).toEqual([{ companies: ["999888777", "111222333"] }]);

  await page.locator("#comparison-subject").selectOption("999888777");
  await page.locator("#comparison-focus").selectOption("drift");
  await page.locator("#comparison-analyst-btn").click();
  await expect(page.locator("#analyst-panel")).toContainText("Dokumentert syntese for virksomheten.");
  expect(calls.analyst.at(-1)).toMatchObject({
    org_number: "999888777",
    focus_area: "drift",
    comparative_context: ["111222333"]
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await testInfo.attach("comparison-desktop", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
});

test("holder sammenligningsflyten lesbar på mobil", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockAuditApi(page, undefined, {
    searchCandidatesByQuery: {
      "rolf solheim": defaultSearchCandidates,
      "spisested": [{ org_number: "111222333", company_name: "TRONDHEIM SPISESTED AS", postal_code: "7010", postal_place: "TRONDHEIM" }]
    }
  });
  await page.goto(`${baseUrl}/start.html`);
  await page.locator("#mode-compare").click();
  await page.locator("#company-input").fill("Rolf Solheim");
  await page.locator("#discover-btn").click();
  await expect(page.locator("#comparison-selection-list")).toContainText("ROLF SOLHEIM");
  await page.locator("#company-input").fill("spisested");
  await page.locator("#discover-btn").click();
  await expect(page.locator("#comparison-selection-list")).toContainText("TRONDHEIM SPISESTED AS");
  await expect(page.locator("#compare-run")).toBeEnabled();
  await page.locator("#compare-run").click();

  await expect(page.locator("#comparison-panel")).toBeVisible();
  await expect(page.locator("#comparison-panel")).toContainText("Forklar forskjellene med ArchAnalyst");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await testInfo.attach("comparison-mobile", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
});

test("viser en forståelig melding når analysen er midlertidig utilgjengelig", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockAuditApi(page, undefined, {
    analystError: { status: 503, error: { code: "ANALYST_UNAVAILABLE", message: "LLM HTTP 503" } }
  });
  await page.goto(`${baseUrl}/start.html`);
  await page.locator("#company-input").fill("Rolf Solheim");
  await page.locator("#discover-btn").click();
  await expect(page.locator("#brief-panel")).toBeVisible();
  await page.locator(".friction-card", { hasText: "Drift" }).click();

  const analyst = page.locator("#analyst-panel");
  await expect(analyst).toContainText("Analysen er midlertidig opptatt. Prøv igjen om et lite øyeblikk.");
  await expect(analyst).not.toContainText("LLM HTTP 503");
});

test("viser norsk tekst på kunde-, dokumentasjons- og markedsflater", async ({ page }) => {
  await page.goto(`${baseUrl}/index.html`);
  await expect(page.locator("body")).toContainText("Lag intelligenskart");
  await expect(page.locator("body")).toContainText("Be om betatilgang");

  await page.goto(`${baseUrl}/proof.html`);
  await expect(page).toHaveTitle("Bevissenter — Arch");
  await expect(page.locator("body")).toContainText("Sikkerhetsgrunnlag");
  await expect(page.locator("body")).not.toContainText("Proof Center");

  await page.goto(`${baseUrl}/marketing/axn-50-evidence-one-pager.html`);
  await expect(page.locator("h1")).toHaveText("50 evidenssignaler AXN kartlegger i virksomheten din");
  await expect(page.locator("body")).toContainText("Start en analyse");

  await page.goto(`${baseUrl}/osint-approval-ui.html`);
  await expect(page).toHaveTitle("Offentlig digital synlighet — Godkjenningsflyt");
  await expect(page.locator("h1")).toHaveText("🔍 Offentlig digital synlighet");
});
