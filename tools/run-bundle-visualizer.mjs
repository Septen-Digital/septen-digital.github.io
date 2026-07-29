import { mkdir, writeFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const reportDir = path.resolve("reports", "bundle");
const reportPath = path.join(reportDir, "stats.html");
const assetPattern = /\/_astro\/[^"'?#]+\.(?:css|js)/gu;

/**
 * @typedef {"CSS" | "JS"} AssetType
 */

/**
 * @typedef {{ pages: string[]; size: number; type: AssetType }} AssetStat
 */

/**
 * @typedef {{ assetPath: string; pages: string[]; size: number; type: AssetType }} BundledAsset
 */

/**
 * @param {string} directory
 * @returns {string[]}
 */
function walkHtmlFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const resolvedPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkHtmlFiles(resolvedPath));
      continue;
    }

    if (entry.isFile() && resolvedPath.endsWith(".html")) {
      files.push(resolvedPath);
    }
  }

  return files;
}

/**
 * @param {number} bytes
 * @returns {string}
 */
function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

/**
 * @param {string} htmlFile
 * @returns {string}
 */
function toPagePath(htmlFile) {
  const relativePath = path.relative(distDir, htmlFile).split(path.sep).join("/");

  if (relativePath === "index.html") {
    return "/";
  }

  return `/${relativePath.replace(/index\.html$/u, "").replace(/\/$/u, "")}/`;
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** @type {Map<string, string[]>} */
const pageAssetMap = new Map();
/** @type {Map<string, AssetStat>} */
const assetStats = new Map();

for (const htmlFile of walkHtmlFiles(distDir)) {
  const html = fs.readFileSync(htmlFile, "utf8");
  const pagePath = toPagePath(htmlFile);
  /** @type {string[]} */
  const assetPaths = [];

  for (const match of html.matchAll(assetPattern)) {
    const publicAssetPath = match[0];
    const absoluteAssetPath = path.join(distDir, publicAssetPath.replace(/^\//u, ""));
    const size = fs.statSync(absoluteAssetPath).size;
    const type = absoluteAssetPath.endsWith(".css") ? "CSS" : "JS";

    assetPaths.push(publicAssetPath);
    assetStats.set(publicAssetPath, {
      pages: [...(assetStats.get(publicAssetPath)?.pages ?? []), pagePath],
      size,
      type,
    });
  }

  pageAssetMap.set(pagePath, [...new Set(assetPaths)]);
}

if (assetStats.size === 0) {
  throw new Error(
    "No built Astro assets were found in dist/. Run the build before generating the bundle report.",
  );
}

/** @type {BundledAsset[]} */
const assets = [...assetStats.entries()]
  .map(([assetPath, details]) => ({
    assetPath,
    ...details,
    pages: [...new Set(details.pages)],
  }))
  .sort((left, right) => right.size - left.size);

const totalJsBytes = assets
  .filter((asset) => asset.type === "JS")
  .reduce((sum, asset) => sum + asset.size, 0);
const totalCssBytes = assets
  .filter((asset) => asset.type === "CSS")
  .reduce((sum, asset) => sum + asset.size, 0);

const assetRows = assets
  .map((asset) => {
    const pageList = asset.pages.map((page) => `<code>${escapeHtml(page)}</code>`).join(", ");
    return `<tr>
      <td><code>${escapeHtml(asset.assetPath)}</code></td>
      <td>${asset.type}</td>
      <td>${formatBytes(asset.size)}</td>
      <td>${pageList}</td>
    </tr>`;
  })
  .join("");

const pageSections = [...pageAssetMap.entries()]
  .map(([pagePath, pageAssets]) => {
    const items = pageAssets
      .map((assetPath) => {
        const asset = assets.find((entry) => entry.assetPath === assetPath);
        return `<li><code>${escapeHtml(assetPath)}</code> <span>${asset ? formatBytes(asset.size) : ""}</span></li>`;
      })
      .join("");

    return `<section>
      <h2>${escapeHtml(pagePath)}</h2>
      <ul>${items}</ul>
    </section>`;
  })
  .join("");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Septen Bundle Report</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, Arial, sans-serif;
      }
      body {
        margin: 0;
        background: #f8fafc;
        color: #0f172a;
      }
      main {
        max-width: 72rem;
        margin: 0 auto;
        padding: 2rem 1.25rem 4rem;
      }
      .summary {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
        margin: 1.5rem 0 2rem;
      }
      .card,
      section,
      table {
        background: #fff;
        border: 1px solid #dbe2ea;
        border-radius: 0.75rem;
      }
      .card {
        padding: 1rem;
      }
      table {
        border-collapse: collapse;
        overflow: hidden;
        width: 100%;
      }
      th,
      td {
        border-bottom: 1px solid #e2e8f0;
        padding: 0.875rem 1rem;
        text-align: left;
        vertical-align: top;
      }
      th {
        background: #f8fafc;
      }
      section {
        margin-top: 1.5rem;
        padding: 1rem;
      }
      ul {
        margin: 0;
        padding-left: 1.25rem;
      }
      li + li {
        margin-top: 0.5rem;
      }
      code {
        font-family: "JetBrains Mono", Consolas, monospace;
      }
      .eyebrow {
        color: #005057;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Bundle Report</p>
      <h1>Referenced Astro Assets</h1>
      <p>This report is generated from the built <code>dist/</code> output so it reflects the actual files referenced by the shipped pages.</p>

      <div class="summary">
        <article class="card">
          <strong>Total JS</strong>
          <div>${formatBytes(totalJsBytes)}</div>
        </article>
        <article class="card">
          <strong>Total CSS</strong>
          <div>${formatBytes(totalCssBytes)}</div>
        </article>
        <article class="card">
          <strong>Referenced Assets</strong>
          <div>${assets.length}</div>
        </article>
        <article class="card">
          <strong>Audited Pages</strong>
          <div>${pageAssetMap.size}</div>
        </article>
      </div>

      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Type</th>
            <th>Size</th>
            <th>Referenced By</th>
          </tr>
        </thead>
        <tbody>${assetRows}</tbody>
      </table>

      ${pageSections}
    </main>
  </body>
</html>`;

await mkdir(reportDir, { recursive: true });
await writeFile(reportPath, html, "utf8");

console.log(`Bundle report written to ${reportPath}`);
