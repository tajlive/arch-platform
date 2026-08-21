// Prod-smoke: arch.axn.no/start → ekte flervalg-flyt mot api.arch.axn.no
import { chromium } from "@playwright/test";

const URL = "https://arch.axn.no/start";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(URL, { waitUntil: "networkidle" });

// Fyll inn et navn med flertreff
await page.locator("#company-input").fill("melhus bil");
await page.locator("#discover-btn").click();

// 1) Picker skal vises (flertreff)
const picker = page.locator("#company-picker");
await picker.waitFor({ state: "visible", timeout: 20000 });
const pickerText = await picker.innerText();
console.log("PICKER_VISIBLE=true");
console.log("PICKER_TEKST=" + pickerText.replace(/\n/g, " | ").slice(0, 160));

await page.screenshot({ path: "/tmp/axn-prod-picker.png", fullPage: false });

// 2) Velg MELHUS BIL TRONDHEIM AS
const target = page.locator(".company-picker-item", { hasText: "MELHUS BIL TRONDHEIM AS" });
await target.click();

// 3) Brief-panel skal vise valgt selskap
const brief = page.locator("#brief-panel");
await brief.waitFor({ state: "visible", timeout: 25000 });
const briefText = await brief.innerText();
const navnOk = briefText.includes("MELHUS BIL TRONDHEIM AS");
console.log("BRIEF_VISIBLE=true");
console.log("RIKTIG_SELSKAP=" + navnOk);

await page.screenshot({ path: "/tmp/axn-prod-brief.png", fullPage: false });

console.log("JS_ERRORS=" + (errors.length ? errors.join(" | ") : "ingen"));

await browser.close();
