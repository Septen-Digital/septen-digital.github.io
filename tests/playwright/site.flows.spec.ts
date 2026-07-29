import { expect, test } from "@playwright/test";

test("mobile navigation opens, traps focus, and closes cleanly", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const toggle = page.getByLabel("Toggle navigation menu");
  const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
  const firstLink = mobileNav.getByRole("link", { name: "Services" });
  const lastLink = mobileNav.getByRole("link", { name: "Contact" });

  await toggle.click();
  await expect(mobileNav).toBeVisible();
  await expect(firstLink).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(lastLink).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(firstLink).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(mobileNav).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("enquiry modal opens, traps focus, and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const trigger = page.locator("[data-open-enquiry]").first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();

  const dialog = page.locator("#enquiry-modal-container");
  const closeButton = page.locator("#enquiry-modal-close-btn");
  const nameField = page.locator("#enq-name");

  await expect(dialog).toBeVisible();
  await expect(nameField).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(closeButton).toBeVisible();
  const focusStayedInDialog = await page.evaluate(() => {
    const dialogElement = document.querySelector("#enquiry-modal-container");
    const activeElement = document.activeElement;
    return Boolean(dialogElement && activeElement && dialogElement.contains(activeElement));
  });
  expect(focusStayedInDialog).toBe(true);

  await page.keyboard.press("Tab");
  await expect(nameField).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("legal modal opens, supports arrow-key tabs, and closes cleanly", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  await page.getByRole("link", { name: "Terms" }).click();

  const dialog = page.locator("#legal-modal-container");
  const closeButton = page.locator("#legal-modal-close-btn");
  const termsTab = page.locator("#legal-tab-terms");
  const privacyTab = page.locator("#legal-tab-privacy");

  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(termsTab).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await expect(privacyTab).toBeFocused();
  await expect(privacyTab).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("keyboard tab order starts with skip link and reaches the main navigation", async ({
  page,
  browserName,
}) => {
  test.skip(browserName === "webkit", "WebKit focus reporting can be unreliable in CI snapshots.");

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Septen home page" })).toBeFocused();

  await page.keyboard.press("Tab");
  const mainNav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(mainNav.getByRole("link", { name: "Services" })).toBeFocused();
});

test("no-JS fallback keeps core routes reachable", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();

  await page.goto("/");
  await page.getByLabel("Toggle navigation menu").click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Services" })).toBeVisible();

  await page.goto("/legal/");
  await expect(page.getByRole("heading", { name: "Terms, Privacy, and Data Rights" })).toBeVisible();

  await context.close();
});

test("all demo routes load and expose their demo heading", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const route of [
    "/demos/carls-coffee/",
    "/demos/alder-and-pipe-plumbing/",
    "/demos/sarahs-boutique/",
    "/demos/greenfield-landscaping/",
    "/demos/north-shore-fitness/",
  ]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.getByText("Interactive Demo")).toBeVisible();
  }
});
