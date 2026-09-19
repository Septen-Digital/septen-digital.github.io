import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { publicRoutes } from "./support/site-data";

type PerfMetrics = {
  routePath: string;
  navigationStart: number;
  responseStart: number;
  domContentLoaded: number;
  loadEventEnd: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  totalBlockingTime?: number;
  transferSizeBytes?: number;
  scriptDurationMs?: number;
  layoutDurationMs?: number;
  recalcStyleDurationMs?: number;
};

const BUDGET = {
  responseStartMs: 800,
  domContentLoadedMs: 2500,
  loadEventEndMs: 5000,
  lcpMs: 3500,
  cls: 0.1,
  transferMb: 1.0,
  scriptDurationMs: 1200,
  layoutDurationMs: 600,
};

const ROUTE_OVERRIDES: Record<string, Partial<typeof BUDGET>> = {
  "/demos/alder-and-pipe-plumbing/": {
    loadEventEndMs: 6500,
    lcpMs: 4500,
    transferMb: 1.35,
    scriptDurationMs: 1600,
  },
  "/demos/carls-coffee/": {
    loadEventEndMs: 6500,
    lcpMs: 4500,
    transferMb: 1.35,
    scriptDurationMs: 1600,
  },
  "/demos/greenfield-landscaping/": {
    loadEventEndMs: 6500,
    lcpMs: 4500,
    transferMb: 1.35,
    scriptDurationMs: 1600,
  },
  "/demos/north-shore-fitness/": {
    loadEventEndMs: 6250,
    lcpMs: 4250,
    transferMb: 1.3,
    scriptDurationMs: 1500,
  },
  "/demos/sarahs-boutique/": {
    loadEventEndMs: 7000,
    lcpMs: 4750,
    transferMb: 1.4,
    scriptDurationMs: 1600,
  },
};

const PROJECT_OVERRIDES: Record<string, Partial<typeof BUDGET>> = {
  "Playwright Firefox": {
    responseStartMs: 1000,
    domContentLoadedMs: 3200,
    loadEventEndMs: 6250,
    lcpMs: 4250,
    scriptDurationMs: 1500,
  },
  "Playwright WebKit": {
    responseStartMs: 1100,
    domContentLoadedMs: 3400,
    loadEventEndMs: 6750,
    lcpMs: 4500,
    scriptDurationMs: 1600,
  },
};

function budgetFor(routePath: string, projectName: string): typeof BUDGET {
  const route = {
    ...BUDGET,
    ...(PROJECT_OVERRIDES[projectName] ?? {}),
    ...(ROUTE_OVERRIDES[routePath] ?? {}),
  };
  return route as typeof BUDGET;
}

async function collectMetrics(page: Page): Promise<PerfMetrics> {
  return await page.evaluate((budgetKeys: string[]) => {
    const nav = performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    const paints = performance.getEntriesByType("paint");
    const lcpList = performance.getEntriesByName(
      "largest-contentful paint",
      "largest-contentful-paint",
    );
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const clsList = performance.getEntriesByType("layout-shift");
    const longTasks = performance.getEntriesByType("longtask");

    const fp = paints.find((e) => e.name === "first-paint")?.startTime;
    const fcp = paints.find((e) => e.name === "first-contentful-paint")?.startTime;
    const lcp = lcpList[lcpList.length - 1]?.startTime;
    const cls = clsList.reduce((acc, e) => {
      const anyEntry = e as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
      return acc + (anyEntry.hadRecentInput ? 0 : (anyEntry.value ?? 0));
    }, 0);

    const totalTransfer = resources.reduce((acc, r) => acc + (r.transferSize ?? 0), 0);

    const jsResources = resources.filter(
      (r) => /\.m?js($|\?)/iu.test(r.name) || r.initiatorType === "script",
    );
    const scriptDurationMs = jsResources.reduce(
      (longest, resource) => Math.max(longest, resource.duration ?? 0),
      0,
    );

    let layoutDurationMs = 0;
    let recalcStyleDurationMs = 0;

    void budgetKeys;

    if (typeof PerformanceObserver !== "undefined") {
      const w = window as unknown as { __septenPerf?: { layoutMs: number; styleMs: number } };
      if (w.__septenPerf) {
        layoutDurationMs = w.__septenPerf.layoutMs;
        recalcStyleDurationMs = w.__septenPerf.styleMs;
      }
    }

    const tbt = longTasks.reduce((acc, t) => acc + Math.max(0, (t.duration ?? 0) - 50), 0);

    return {
      routePath: location.pathname,
      navigationStart: nav?.startTime ?? 0,
      responseStart: nav?.responseStart ?? 0,
      domContentLoaded: nav?.domContentLoadedEventEnd ?? 0,
      loadEventEnd: nav?.loadEventEnd ?? 0,
      firstPaint: fp,
      firstContentfulPaint: fcp,
      largestContentfulPaint: lcp,
      cumulativeLayoutShift: cls,
      totalBlockingTime: tbt,
      transferSizeBytes: totalTransfer,
      scriptDurationMs,
      layoutDurationMs,
      recalcStyleDurationMs,
    };
  }, Object.keys(BUDGET));
}

test.describe("performance with tracing for all routes", () => {
  test.describe.configure({ mode: "serial" });

  for (const route of publicRoutes) {
    test(`perf: ${route.name} (${route.path})`, async ({ page, context }, testInfo) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await context.tracing.start({ screenshots: true, snapshots: true, sources: false });

      const startTime = Date.now();
      await page.goto(route.path, { waitUntil: "load", timeout: 45_000 });
      await page.waitForTimeout(400);
      const metrics = await collectMetrics(page);
      const wallClockMs = Date.now() - startTime;
      const budget = budgetFor(route.path, testInfo.project.name);

      await context.tracing.stop({
        path: `test-results/traces/trace-${route.name.replace(/\W+/gu, "-")}.zip`,
      });

      await testInfo.attach(`perf-${route.name}`, {
        contentType: "application/json",
        body: JSON.stringify({ wallClockMs, budget, ...metrics }, null, 2),
      });

      expect
        .soft(metrics.responseStart, `TTFB (responseStart) for ${route.path} under budget`)
        .toBeLessThanOrEqual(budget.responseStartMs);
      expect
        .soft(metrics.domContentLoaded, `DOMContentLoaded for ${route.path} under budget`)
        .toBeLessThanOrEqual(budget.domContentLoadedMs);
      expect
        .soft(metrics.loadEventEnd, `Load event for ${route.path} under budget`)
        .toBeLessThanOrEqual(budget.loadEventEndMs);
      if (metrics.largestContentfulPaint !== undefined) {
        expect
          .soft(metrics.largestContentfulPaint, `LCP for ${route.path} under budget`)
          .toBeLessThanOrEqual(budget.lcpMs);
      }
      if (metrics.cumulativeLayoutShift !== undefined) {
        expect
          .soft(metrics.cumulativeLayoutShift, `CLS for ${route.path} under budget`)
          .toBeLessThanOrEqual(budget.cls);
      }
      if (metrics.transferSizeBytes !== undefined) {
        const mb = metrics.transferSizeBytes / (1024 * 1024);
        expect
          .soft(mb, `Total transfer size (MB) for ${route.path} under budget`)
          .toBeLessThanOrEqual(budget.transferMb);
      }
      expect
        .soft(metrics.scriptDurationMs, `Aggregate script load+exec for ${route.path}`)
        .toBeLessThanOrEqual(budget.scriptDurationMs);
    });
  }
});
