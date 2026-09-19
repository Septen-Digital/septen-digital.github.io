import { expect, test } from "@playwright/test";
import { publicRoutes } from "./support/site-data";

type SchemaIssue = {
  kind: "invalid-json" | "missing-type" | "invalid-context" | "missing-property" | "malformed-url";
  path: string;
  message: string;
  block?: string;
};

const REQUIRED_TOP_LEVEL = new Set(["@context", "@type"]);
const VALID_CONTEXTS = new Set([
  "https://schema.org",
  "https://schema.org/",
  "http://schema.org",
  "http://schema.org/",
]);

const KNOWN_TYPES = new Set([
  "WebSite",
  "WebPage",
  "Organization",
  "LocalBusiness",
  "ProfessionalService",
  "Service",
  "Product",
  "Person",
  "Article",
  "FAQPage",
  "BreadcrumbList",
  "ItemList",
  "ImageObject",
  "Offer",
  "AggregateRating",
  "Place",
  "ContactPoint",
  "PostalAddress",
  "OpeningHoursSpecification",
  "CreativeWork",
]);

function validateNode(node: unknown, path: string, issues: SchemaIssue[]): void {
  if (Array.isArray(node)) {
    node.forEach((child, i) => validateNode(child, `${path}[${String(i)}]`, issues));
    return;
  }

  if (node === null || typeof node !== "object") {
    return;
  }

  const obj = node as Record<string, unknown>;
  const isTopLevel = REQUIRED_TOP_LEVEL.has("@context") && typeof obj["@type"] !== "undefined";

  if (obj["@context"] !== undefined) {
    const ctx = String(obj["@context"]);
    if (!VALID_CONTEXTS.has(ctx)) {
      issues.push({ kind: "invalid-context", path, message: `Invalid @context "${ctx}"` });
    }
  }

  if (obj["@type"] !== undefined) {
    const type = obj["@type"];
    const types = Array.isArray(type) ? type.map(String) : [String(type)];
    for (const t of types) {
      if (!KNOWN_TYPES.has(t)) {
        issues.push({
          kind: "missing-type",
          path,
          message: `Unknown or misspelled @type "${t}" — add to allowed list if legitimate`,
        });
      }
    }
  }

  if (isTopLevel) {
    for (const key of REQUIRED_TOP_LEVEL) {
      if (!(key in obj)) {
        issues.push({
          kind: "missing-property",
          path,
          message: `Top-level JSON-LD missing required "${key}"`,
        });
      }
    }
  }

  for (const [key, value] of Object.entries(obj)) {
    if (key === "@context" || key === "@type") continue;
    if (key.toLowerCase().endsWith("url") || key === "logo" || key === "image") {
      if (typeof value === "string" && value.length > 0) {
        try {
          const u = new URL(value);
          if (!["http:", "https:"].includes(u.protocol)) {
            issues.push({
              kind: "malformed-url",
              path: `${path}.${key}`,
              message: `URL must be http(s): ${value}`,
            });
          }
        } catch {
          issues.push({
            kind: "malformed-url",
            path: `${path}.${key}`,
            message: `Not a valid URL: ${value}`,
          });
        }
      }
    }
    validateNode(value, `${path}.${key}`, issues);
  }
}

test.describe("structured data: JSON-LD schema validation for SEO", () => {
  for (const route of publicRoutes) {
    test(`schema: ${route.name} (${route.path})`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      const scripts = page.locator('script[type="application/ld+json"]');
      const count = await scripts.count();
      const issues: SchemaIssue[] = [];
      const blocks: unknown[] = [];

      if (count === 0) {
        issues.push({
          kind: "missing-property",
          path: route.path,
          message:
            "No <script type='application/ld+json'> blocks found — add at least WebPage/WebSite schema",
        });
      }

      for (let i = 0; i < count; i += 1) {
        const raw = (await scripts.nth(i).textContent()) ?? "";
        let parsed: unknown = null;
        try {
          parsed = JSON.parse(raw);
          blocks.push(parsed);
        } catch (err) {
          issues.push({
            kind: "invalid-json",
            path: `${route.path}#jsonld-${String(i)}`,
            message: err instanceof Error ? err.message : "Invalid JSON",
            block: raw.slice(0, 400),
          });
          continue;
        }
        validateNode(parsed, `${route.path}#jsonld-${String(i)}`, issues);
      }

      await testInfo.attach(`schema-${route.name}`, {
        contentType: "application/json",
        body: JSON.stringify({ blocks, issues }, null, 2),
      });

      expect(issues, `No JSON-LD schema issues on ${route.path}`).toEqual([]);
    });
  }
});
