import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const distDir = path.resolve("dist");
const budget = {
  maxTotalCssBytes: 50_000,
  maxTotalJsBytes: 50_000,
  maxSingleCssAssetBytes: 50_000,
  maxSingleJsAssetBytes: 50_000,
};

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

function collectReferencedAssets() {
  const assetPattern = /\/_astro\/[^"'?#]+\.(?:css|js)/gu;
  const assetPaths = new Set();

  for (const htmlFile of walkHtmlFiles(distDir)) {
    const html = fs.readFileSync(htmlFile, "utf8");

    for (const match of html.matchAll(assetPattern)) {
      assetPaths.add(path.join(distDir, match[0].replace(/^\//u, "")));
    }
  }

  return [...assetPaths];
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

const referencedAssets = collectReferencedAssets();

if (referencedAssets.length === 0) {
  throw new Error(
    "No built Astro assets were found in dist/. Run the build before checking bundle budgets.",
  );
}

let totalCssBytes = 0;
let totalJsBytes = 0;
let largestCssBytes = 0;
let largestJsBytes = 0;
let totalCssTransferBytes = 0;
let totalJsTransferBytes = 0;
let largestCssTransferBytes = 0;
let largestJsTransferBytes = 0;

for (const assetPath of referencedAssets) {
  const fileSize = fs.statSync(assetPath).size;
  const compressedSize = gzipSync(fs.readFileSync(assetPath)).length;

  if (assetPath.endsWith(".css")) {
    totalCssBytes += fileSize;
    largestCssBytes = Math.max(largestCssBytes, fileSize);
    totalCssTransferBytes += compressedSize;
    largestCssTransferBytes = Math.max(largestCssTransferBytes, compressedSize);
  }

  if (assetPath.endsWith(".js")) {
    totalJsBytes += fileSize;
    largestJsBytes = Math.max(largestJsBytes, fileSize);
    totalJsTransferBytes += compressedSize;
    largestJsTransferBytes = Math.max(largestJsTransferBytes, compressedSize);
  }
}

const failures = [];

if (totalCssTransferBytes > budget.maxTotalCssBytes) {
  failures.push(
    `Referenced CSS exceeds the gzipped transfer budget: ${formatBytes(totalCssTransferBytes)} > ${formatBytes(budget.maxTotalCssBytes)}.`,
  );
}

if (totalJsTransferBytes > budget.maxTotalJsBytes) {
  failures.push(
    `Referenced JS exceeds the gzipped transfer budget: ${formatBytes(totalJsTransferBytes)} > ${formatBytes(budget.maxTotalJsBytes)}.`,
  );
}

if (largestCssTransferBytes > budget.maxSingleCssAssetBytes) {
  failures.push(
    `A single CSS asset exceeds the gzipped transfer budget: ${formatBytes(largestCssTransferBytes)} > ${formatBytes(budget.maxSingleCssAssetBytes)}.`,
  );
}

if (largestJsTransferBytes > budget.maxSingleJsAssetBytes) {
  failures.push(
    `A single JS asset exceeds the gzipped transfer budget: ${formatBytes(largestJsTransferBytes)} > ${formatBytes(budget.maxSingleJsAssetBytes)}.`,
  );
}

if (failures.length > 0) {
  throw new Error(failures.join("\n"));
}

console.log(
  [
    `Bundle budgets passed.`,
    `Referenced JS raw: ${formatBytes(totalJsBytes)}`,
    `Referenced JS gzip: ${formatBytes(totalJsTransferBytes)}`,
    `Referenced CSS raw: ${formatBytes(totalCssBytes)}`,
    `Referenced CSS gzip: ${formatBytes(totalCssTransferBytes)}`,
  ].join(" "),
);
