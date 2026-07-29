import { expect, test } from "@playwright/test";
import { disableMotionForSnapshots, primeLazyContent } from "./support/helpers";
import { publicRoutes, viewportScenarios } from "./support/site-data";

test.describe.configure({ mode: "parallel" });

for (const route of publicRoutes) {
  for (const scenario of viewportScenarios) {
    test(`${route.name} matches the visual baseline at ${scenario.name}`, async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== "chromium", "Visual baselines are pinned to Chromium.");

      await page.setViewportSize(scenario.viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await disableMotionForSnapshots(page);
      await page.goto(route.path, { waitUntil: "networkidle" });
      if (route.name !== "sarahs-boutique") {
        await primeLazyContent(page);
      } else {
        await page.waitForTimeout(600);
      }
      await page
        .waitForFunction(
          () => document.querySelectorAll("[data-skeleton].is-media-pending").length === 0,
          { timeout: 20_000 },
        )
        .catch(() => {});
      await page.waitForTimeout(400);

      await expect(page).toHaveScreenshot(`${route.name}-${scenario.name}.png`, {
        timeout: 30_000,
        animations: "disabled",
        caret: "hide",
        fullPage: true,
        scale: "css",
      });
    });
  }
}
