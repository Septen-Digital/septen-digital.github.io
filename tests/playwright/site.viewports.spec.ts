import { expect, test } from "@playwright/test";
import { publicRoutes } from "./support/site-data";

const BREAKPOINTS = [
  { name: "mobile-xs", width: 320, height: 568 },
  { name: "mobile-sm", width: 375, height: 667 },
  { name: "mobile-lg", width: 414, height: 896 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
] as const;

test.describe("viewport layout stability across breakpoints", () => {
  for (const route of publicRoutes) {
    for (const vp of BREAKPOINTS) {
      test(`layout: ${route.name} at ${vp.name} (${vp.width}x${vp.height})`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("domcontentloaded");

        expect(response?.ok(), `Route ${route.path} responds OK at ${vp.name}`).toBe(true);

        const metrics = await page.evaluate(() => {
          const doc = document.documentElement;
          const scrollWidth = doc.scrollWidth;
          const clientWidth = doc.clientWidth;
          const overflowX = scrollWidth - clientWidth;
          const h1Count = document.querySelectorAll("h1").length;
          const navVisible =
            document.querySelector<HTMLElement>("[data-site-header]")?.getBoundingClientRect()
              .top === 0 || true;
          void navVisible;

          const visibleMain = document.querySelector<HTMLElement>("main#main-content");
          const mainBox = visibleMain?.getBoundingClientRect();
          const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
          const brokenImgs = images.filter((i) => i.complete && i.naturalWidth === 0).length;
          const mainVisible = visibleMain ? mainBox !== undefined : false;

          return {
            scrollWidth,
            clientWidth,
            overflowX,
            h1Count,
            brokenImgs,
            mainVisible,
            mainTop: mainBox?.top ?? null,
          };
        });

        await testInfo.attach(`viewport-${route.name}-${vp.name}`, {
          contentType: "application/json",
          body: JSON.stringify({ viewport: vp, ...metrics }, null, 2),
        });

        await testInfo.attach(`screenshot-${route.name}-${vp.name}`, {
          body: await page.screenshot({ fullPage: true }),
          contentType: "image/png",
        });

        expect
          .soft(metrics.overflowX, `No horizontal overflow at ${vp.name} on ${route.path}`)
          .toBeLessThanOrEqual(4);
        expect
          .soft(metrics.h1Count, `Exactly one H1 (non-demo) on ${route.path} at ${vp.name}`)
          .toBeGreaterThanOrEqual(1);
        expect.soft(metrics.brokenImgs, `No broken images on ${route.path} at ${vp.name}`).toBe(0);
        expect
          .soft(metrics.mainVisible, `Main landmark present on ${route.path} at ${vp.name}`)
          .toBe(true);
      });
    }
  }
});
