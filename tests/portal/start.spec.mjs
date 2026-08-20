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
  company: { company_name: "ROLF SOLHEIM" },
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

async function mockAuditApi(page) {
  await page.route("https://api.arch.axn.no/v1/public/audit/session", (route) => route.fulfill({ status: 200, body: "{}" }));
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
  await page.route("https://api.arch.axn.no/v1/public/audit/question", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ question: "Hvordan dokumenteres kundehenvendelser i dag?", required_for: "arbeidsflytanalyse", expected_information_gain: 25 })
  }));
}

async function openBrief(page) {
  await mockAuditApi(page);
  await page.goto(`${baseUrl}/start.html`);
  await page.locator("#company-input").fill("Rolf Solheim");
  await page.locator("#discover-btn").click();
  await expect(page.locator("#brief-panel")).toBeVisible();
}

test("viser en norsk, dokumentert virksomhetsoversikt uten tekniske statuser", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openBrief(page);

  const brief = page.locator("#brief-panel");
  await expect(brief).toContainText("Virksomhetsoversikt");
  await expect(brief).toContainText("ROLF SOLHEIM");
  await expect(brief).toContainText("Ledelse og roller");
  await expect(brief).toContainText("Datagrunnlag");
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
  await openBrief(page);

  const brief = page.locator("#brief-panel");
  const label = brief.locator(".brief-row").first().locator(".brief-label");
  const value = brief.locator(".brief-row").first().locator(".brief-value");
  const [labelBox, valueBox] = await Promise.all([label.boundingBox(), value.boundingBox()]);
  expect(valueBox.y).toBeGreaterThan(labelBox.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await expect(page.locator("#friction-panel")).toBeVisible();
  await page.getByRole("button", { name: "Kundekommunikasjon" }).click();
  await expect(page.locator("#conversation-panel")).toContainText("Hvordan dokumenteres kundehenvendelser i dag?");
  await expect(page.locator("#conversation-panel")).toContainText("Formål: arbeidsflytanalyse");

  await testInfo.attach("start-mobile", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
});
