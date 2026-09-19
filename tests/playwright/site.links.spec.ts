import { expect, test } from "@playwright/test";
import { publicRoutes } from "./support/site-data";

const EXTERNAL_SKIP_PREFIXES = ["mailto:", "tel:", "sms:", "javascript:", "#", "data:"];
const SITE_ORIGIN = "https://septen.co.uk";

function shouldSkipHref(href: string): boolean {
  return EXTERNAL_SKIP_PREFIXES.some((p) => href.startsWith(p));
}

type LinkIssue = {
  from: string;
  href: string;
  status?: number;
  redirected?: boolean;
  finalUrl?: string;
  reason: string;
};

test.describe("links: crawl routes and validate every <a> href", () => {
  for (const route of publicRoutes) {
    test(`broken-link scan: ${route.name} (${route.path})`, async ({ page, request }, testInfo) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("domcontentloaded");

      const anchors = page.locator("a[href]");
      const count = await anchors.count();
      const seen = new Map<string, { from: string; href: string }>();

      for (let i = 0; i < count; i += 1) {
        const a = anchors.nth(i);
        const href = (await a.getAttribute("href")) ?? "";
        if (!href || shouldSkipHref(href)) continue;
        const absolute = new URL(href, page.url()).toString();
        if (!seen.has(absolute)) {
          seen.set(absolute, { from: route.path, href });
        }
      }

      const issues: LinkIssue[] = [];
      const siteOrigin = new URL(publicRoutes[0].path, page.url()).origin;

      for (const [absolute, meta] of seen.entries()) {
        const origin = new URL(absolute).origin;
        const isInternal = origin === siteOrigin || absolute.startsWith(SITE_ORIGIN);

        try {
          const response = await request.fetch(absolute, {
            method: "GET",
            failOnStatusCode: false,
            maxRedirects: isInternal ? 0 : 5,
            headers: { "User-Agent": "Septin-LinkChecker/1.0 (+https://septen.co.uk)" },
            timeout: 15_000,
          });

          const status = response.status();
          const finalUrl = response.url();
          const redirected = finalUrl !== absolute;

          if (status === 404) {
            issues.push({
              ...meta,
              href: absolute,
              status,
              redirected,
              finalUrl,
              reason: "404 Not Found",
            });
            continue;
          }

          if (status >= 400) {
            issues.push({
              ...meta,
              href: absolute,
              status,
              redirected,
              finalUrl,
              reason: `HTTP ${String(status)}`,
            });
            continue;
          }

          if (isInternal && redirected) {
            const finalPath = new URL(finalUrl).pathname.replace(/\/$/u, "") || "/";
            const origPath = new URL(absolute).pathname.replace(/\/$/u, "") || "/";
            if (finalPath !== origPath) {
              issues.push({
                ...meta,
                href: absolute,
                status,
                redirected: true,
                finalUrl,
                reason: `Internal redirect to ${finalPath} — prefer direct canonical links`,
              });
            }
          }
        } catch (error) {
          issues.push({
            ...meta,
            href: absolute,
            reason: error instanceof Error ? error.message : "unreachable",
          });
        }
      }

      await testInfo.attach(`links-${route.name}`, {
        contentType: "application/json",
        body: JSON.stringify({ checked: seen.size, issues }, null, 2),
      });

      expect(issues, `No broken or redirected links expected on ${route.path}`).toEqual([]);
    });
  }
});
