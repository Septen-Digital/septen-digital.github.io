import { expect, test } from "@playwright/test";
import { publicRoutes } from "./support/site-data";

test.describe("quality: rendered routes", () => {
  for (const route of publicRoutes) {
    test(`renders without page errors: ${route.name} (${route.path})`, async ({ page }) => {
      const pageErrors: Error[] = [];
      page.on("pageerror", (error) => pageErrors.push(error));

      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });

      expect(response?.ok(), `${route.path} responds successfully`).toBe(true);
      await expect(page.locator("main")).toBeVisible();
      expect(pageErrors, `${route.path} has no uncaught client errors`).toHaveLength(0);
    });
  }
});
