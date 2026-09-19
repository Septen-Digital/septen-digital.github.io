import { expect, test } from "@playwright/test";
import { publicRoutes } from "./support/site-data";

const SITE_ORIGIN = "https://septen.co.uk";
const REQUIRED_OG = ["og:title", "og:description", "og:image", "og:url", "og:type"] as const;
const REQUIRED_TWITTER = [
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
] as const;

test.describe("metadata: title, description, canonical, OG, Twitter tags for all routes", () => {
  for (const route of publicRoutes) {
    test(`meta: ${route.name} (${route.path})`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      const title = (await page.title()) ?? "";
      const metaDescription =
        (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      const canonical = (await page.locator('link[rel="canonical"]').getAttribute("href")) ?? "";

      const og: Record<string, string> = {};
      for (const prop of REQUIRED_OG) {
        og[prop] = (await page.locator(`meta[property="${prop}"]`).getAttribute("content")) ?? "";
      }

      const twitter: Record<string, string> = {};
      for (const name of REQUIRED_TWITTER) {
        twitter[name] = (await page.locator(`meta[name="${name}"]`).getAttribute("content")) ?? "";
      }

      await testInfo.attach(`meta-${route.name}`, {
        contentType: "application/json",
        body: JSON.stringify({ title, metaDescription, canonical, og, twitter }, null, 2),
      });

      expect(title, `Title present on ${route.path}`).not.toBe("");
      expect(
        title.length,
        `Title length within SEO bounds on ${route.path}`,
      ).toBeGreaterThanOrEqual(20);
      expect(title.length, `Title not too long on ${route.path}`).toBeLessThanOrEqual(70);

      expect(metaDescription, `Meta description present on ${route.path}`).not.toBe("");
      expect(
        metaDescription.length,
        `Meta description reasonable length on ${route.path}`,
      ).toBeGreaterThanOrEqual(70);
      expect(
        metaDescription.length,
        `Meta description not too long on ${route.path}`,
      ).toBeLessThanOrEqual(180);

      expect(canonical, `Canonical present on ${route.path}`).not.toBe("");
      expect(canonical.startsWith(SITE_ORIGIN), `Canonical uses site origin on ${route.path}`).toBe(
        true,
      );

      for (const prop of REQUIRED_OG) {
        expect(og[prop], `Open Graph tag "${prop}" present on ${route.path}`).not.toBe("");
      }
      if (og["og:url"]) {
        expect(og["og:url"].startsWith("https://"), `og:url absolute HTTPS on ${route.path}`).toBe(
          true,
        );
      }
      if (og["og:image"]) {
        expect(
          og["og:image"].startsWith("https://"),
          `og:image absolute HTTPS on ${route.path}`,
        ).toBe(true);
      }
      expect(og["og:type"], `og:type is website/article on ${route.path}`).toMatch(
        /^(website|article)$/u,
      );

      for (const name of REQUIRED_TWITTER) {
        expect(twitter[name], `Twitter card tag "${name}" present on ${route.path}`).not.toBe("");
      }
      expect(
        twitter["twitter:card"],
        `twitter:card uses summary_large_image on ${route.path}`,
      ).toBe("summary_large_image");
    });
  }
});
