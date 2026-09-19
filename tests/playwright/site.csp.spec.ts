import { expect, test } from "@playwright/test";
import { collectCspMessages } from "./support/helpers";

function expectNoCspViolations(messages: string[], context: string): void {
  expect(
    messages,
    `${context} should not emit Content-Security-Policy console or runtime errors.`,
  ).toEqual([]);
}

test("core routes load cleanly under the active CSP", async ({ page }) => {
  const cspMessages = collectCspMessages(page);

  for (const route of [
    "/",
    "/legal/",
    "/demos/carls-coffee/",
    "/demos/alder-and-pipe-plumbing/",
    "/demos/sarahs-boutique/",
    "/demos/greenfield-landscaping/",
    "/demos/north-shore-fitness/",
  ]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("main")).toBeVisible();
  }

  expectNoCspViolations(cspMessages, "Core route loading");
});

test("private browsing context preserves the main interactive flows", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  const cspMessages = collectCspMessages(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByLabel("Toggle navigation menu").click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();

  await page.locator("[data-open-enquiry]").first().scrollIntoViewIfNeeded();
  await page.locator("[data-open-enquiry]").first().click();
  await expect(page.locator("#enquiry-modal-container")).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("link", { name: "Terms" }).click();
  await expect(page.locator("#legal-modal-container")).toBeVisible();

  expectNoCspViolations(cspMessages, "Private browsing");
  await context.close();
});

test("adblocker-like request blocking does not disrupt first-party flows", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  await context.route(
    /doubleclick|googlesyndication|googletagmanager|google-analytics|hotjar|clarity|facebook\.net/iu,
    (route) => route.abort(),
  );

  const page = await context.newPage();
  const cspMessages = collectCspMessages(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("link", { name: "Septen home page" })).toBeVisible();
  await page.locator("[data-open-enquiry]").first().scrollIntoViewIfNeeded();
  await page.locator("[data-open-enquiry]").first().click();
  await expect(page.locator("#enquiry-modal-container")).toBeVisible();

  expectNoCspViolations(cspMessages, "Adblocker-like filtering");
  await context.close();
});

test("script-blocker-like request blocking leaves the static fallbacks reachable", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });

  await context.route(/\/_astro\/.*\.js(?:\?.*)?$/u, (route) => route.abort());

  const page = await context.newPage();
  const cspMessages = collectCspMessages(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByLabel("Toggle navigation menu").click();

  const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Services" })).toBeVisible();

  await page.goto("/demos/sarahs-boutique/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Sarah's Boutique" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The Boutique Inventory" })).toBeVisible();

  expectNoCspViolations(cspMessages, "Script-blocker-like filtering");
  await context.close();
});

test("slow-network conditions still allow the enquiry and legal flows to resolve", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  await context.route("**/*", async (route) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 150);
    });
    await route.continue();
  });

  const page = await context.newPage();
  const cspMessages = collectCspMessages(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("[data-open-enquiry]").first().scrollIntoViewIfNeeded();
  await page.locator("[data-open-enquiry]").first().click();
  await expect(page.locator("#enquiry-modal-container")).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("link", { name: "Terms" }).click();
  await expect(page.locator("#legal-modal-container")).toBeVisible();

  expectNoCspViolations(cspMessages, "Slow-network loading");
  await context.close();
});

test("offline mode after initial load keeps the current page usable", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const cspMessages = collectCspMessages(page);

  await page.goto("/demos/sarahs-boutique/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Sarah's Boutique" })).toBeVisible();

  await context.setOffline(true);
  await page.locator('[data-boutique-nav="catalogue"]').click();
  await expect(
    page.locator('[data-boutique-panel="catalogue"][data-boutique-active="true"]'),
  ).toBeVisible();

  expectNoCspViolations(cspMessages, "Offline mode after first load");
  await context.close();
});
