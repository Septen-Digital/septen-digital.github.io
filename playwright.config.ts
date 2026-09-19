import { defineConfig } from "@playwright/test";

process.env.PLAYWRIGHT_BROWSERS_PATH ??= "./.playwright-browsers";

export default defineConfig({
  testDir: "./tests/playwright",
  fullyParallel: true,
  workers: process.env.CI ? "50%" : undefined,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 120_000,
  outputDir: "./test-results/playwright",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}",
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.005,
    },
  },
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    actionTimeout: 15_000,
    baseURL: "http://127.0.0.1:4321",
    navigationTimeout: 30_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: "node ./tools/serve-preview.mjs",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: true,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
    {
      name: "firefox",
      use: {
        browserName: "firefox",
      },
    },
    {
      name: "webkit",
      use: {
        browserName: "webkit",
      },
    },
  ],
});
