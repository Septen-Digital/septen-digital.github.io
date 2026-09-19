import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { collectBuiltPages, stripHtml } from "./dist-audit-utils.mjs";

const reportDirectory = path.resolve("reports", "content");
const reportPath = path.join(reportDirectory, "content-check.json");
const requiredOpenGraphProperties = ["og:title", "og:description", "og:url", "og:image"];
const builtPages = collectBuiltPages();

if (builtPages.length === 0) {
  throw new Error(
    "No built HTML pages were found in dist/. Run the build before checking content.",
  );
}

function readTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/iu);
  return match ? stripHtml(match[1]) : "";
}

/**
 * @param {string} html
 * @param {string} name
 * @param {string} [attributeName]
 * @returns {string}
 */
function readMetaContent(html, name, attributeName = "name") {
  const pattern = new RegExp(
    `<meta\\b[^>]*${String(attributeName)}=["']${String(name)}["'][^>]*content=["']([\\s\\S]*?)["'][^>]*>`,
    "iu",
  );
  const match = html.match(pattern);
  return match ? stripHtml(match[1]) : "";
}

/**
 * @param {string} html
 * @param {string} rel
 * @returns {string}
 */
function readLinkHref(html, rel) {
  const pattern = new RegExp(
    `<link\\b[^>]*rel=["']${String(rel)}["'][^>]*href=["']([^"']+)["'][^>]*>`,
    "iu",
  );
  const match = html.match(pattern);
  return match ? match[1].trim() : "";
}

/**
 * @param {string} html
 * @returns {Array<{ level: number; text: string }>}
 */
function readHeadings(html) {
  return [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/giu)].map((match) => ({
    level: Number(match[1]),
    text: stripHtml(match[2]).replace(/\s+/gu, " ").trim(),
  }));
}

const report = builtPages.map((page) => {
  /** @type {string[]} */
  const issues = [];
  const isDemoRoute = page.routePath.startsWith("/demos/");
  const title = readTitle(page.html);
  const metaDescription = readMetaContent(page.html, "description");
  const canonicalUrl = readLinkHref(page.html, "canonical");
  const headings = readHeadings(page.html);
  const h1Count = headings.filter((heading) => heading.level === 1).length;
  /** @type {Map<string, number>} */
  const sectionHeadingCounts = new Map();

  for (const heading of headings.filter((entry) => entry.level <= 2)) {
    const normalizedText = heading.text.toLowerCase();
    sectionHeadingCounts.set(normalizedText, (sectionHeadingCounts.get(normalizedText) ?? 0) + 1);
  }

  const duplicateSectionHeadings = [...sectionHeadingCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([text]) => String(text));

  if (!title) {
    issues.push("Missing document title.");
  }

  if (!metaDescription) {
    issues.push("Missing meta description.");
  }

  if (!canonicalUrl) {
    issues.push("Missing canonical URL.");
  } else if (!canonicalUrl.startsWith("https://septen.co.uk")) {
    issues.push(`Canonical URL must use https://septen.co.uk, received ${canonicalUrl}.`);
  }

  if (!isDemoRoute && h1Count !== 1) {
    issues.push(`Expected exactly one H1, found ${String(h1Count)}.`);
  }

  if (!isDemoRoute && duplicateSectionHeadings.length > 0) {
    issues.push(
      `Duplicate major headings found: ${duplicateSectionHeadings
        .map((heading) => `"${String(heading)}"`)
        .join(", ")}.`,
    );
  }

  for (const property of requiredOpenGraphProperties) {
    const content = readMetaContent(page.html, property, "property");
    if (!content) {
      issues.push(`Missing Open Graph tag ${property}.`);
      continue;
    }

    if ((property === "og:url" || property === "og:image") && !content.startsWith("https://")) {
      issues.push(`Open Graph tag ${property} must use an absolute HTTPS URL.`);
    }
  }

  if (canonicalUrl) {
    const ogUrl = readMetaContent(page.html, "og:url", "property");
    if (ogUrl && ogUrl !== canonicalUrl) {
      issues.push(`Canonical URL and og:url do not match (${canonicalUrl} vs ${ogUrl}).`);
    }
  }

  return {
    routePath: page.routePath,
    issues,
  };
});

await mkdir(reportDirectory, { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const failures = report.filter((entry) => entry.issues.length > 0);

if (failures.length > 0) {
  throw new Error(
    failures
      .map(
        (entry) =>
          `${String(entry.routePath)}\n${entry.issues
            .map((issue) => `- ${String(issue)}`)
            .join("\n")}`,
      )
      .join("\n\n"),
  );
}

console.log(`Built content checks passed for ${String(report.length)} pages.`);
