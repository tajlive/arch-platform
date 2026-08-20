import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/portal",
  fullyParallel: false,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    browserName: "chromium",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  }
});
