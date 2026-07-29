import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { LinkChecker } from "linkinator";
import { auditPagePaths } from "./site-audit-pages.mjs";
import {
  collectBuiltPages,
  distDir,
  extractAttributeValues,
  resolveInternalHref,
} from "./dist-audit-utils.mjs";

const reportDirectory = path.resolve("reports", "links");
const reportPath = path.join(reportDirectory, "linkinator.json");
const builtPages = collectBuiltPages();

if (builtPages.length === 0) {
  throw new Error("No built HTML pages were found in dist/. Run the build before checking links.");
}

const checker = new LinkChecker();
const result = await checker.check({
  path: distDir,
  port: 4322,
  recurse: true,
  cleanUrls: true,
  checkCss: true,
  checkFragments: true,
  retryErrors: true,
  retryErrorsCount: 2,
  timeout: 15_000,
  linksToSkip: ["^mailto:", "^tel:", "^sms:", "^javascript:", "^#"],
  urlRewriteExpressions: [
    {
      pattern: /https:\/\/septen\.co\.uk/gu,
      replacement: "http://127.0.0.1:4322",
    },
  ],
});

await mkdir(reportDirectory, { recursive: true });
await writeFile(reportPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

/** @type {Array<{ url: string; parent?: string | null; state: string }>} */
const brokenLinks = result.links.filter((link) => link.state === "BROKEN");
const builtRouteSet = new Set(builtPages.map((page) => page.routePath));
const expectedRouteSet = new Set(auditPagePaths);
const unexpectedBuiltRoutes = [...builtRouteSet].filter(
  (routePath) => !expectedRouteSet.has(routePath),
);
const missingBuiltRoutes = [...expectedRouteSet].filter(
  (routePath) => !builtRouteSet.has(routePath),
);
const inboundRouteMap = new Map([...builtRouteSet].map((routePath) => [routePath, new Set()]));

for (const page of builtPages) {
  for (const href of extractAttributeValues(page.html, "href")) {
    const resolvedHref = resolveInternalHref(page.routePath, href);
    if (!resolvedHref) {
      continue;
    }

    const [targetRoutePath] = resolvedHref.split("#");
    if (!builtRouteSet.has(targetRoutePath) || targetRoutePath === page.routePath) {
      continue;
    }

    inboundRouteMap.get(targetRoutePath)?.add(page.routePath);
  }
}

const orphanedRoutes = [...builtRouteSet].filter((routePath) => {
  if (routePath === "/") {
    return false;
  }

  return (inboundRouteMap.get(routePath)?.size ?? 0) === 0;
});

const failures = [];

if (brokenLinks.length > 0) {
  failures.push(
    `Broken links found:\n${brokenLinks
      .map((link) => `- ${String(link.url)} (from ${String(link.parent ?? "unknown source")})`)
      .join("\n")}`,
  );
}

if (unexpectedBuiltRoutes.length > 0) {
  failures.push(
    `Built routes are missing from tools/site-audit-pages.mjs:\n${unexpectedBuiltRoutes
      .map((routePath) => `- ${routePath}`)
      .join("\n")}`,
  );
}

if (missingBuiltRoutes.length > 0) {
  failures.push(
    `Expected audited routes are missing from dist/:\n${missingBuiltRoutes
      .map((routePath) => `- ${routePath}`)
      .join("\n")}`,
  );
}

if (orphanedRoutes.length > 0) {
  failures.push(
    `Orphaned built routes found:\n${orphanedRoutes
      .map((routePath) => `- ${routePath}`)
      .join("\n")}`,
  );
}

if (failures.length > 0) {
  throw new Error(failures.join("\n\n"));
}

console.log(
  `Link scan passed. Checked ${String(result.links.length)} links across ${String(builtPages.length)} built pages.`,
);
