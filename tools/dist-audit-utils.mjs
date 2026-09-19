import fs from "node:fs";
import path from "node:path";

export const distDir = path.resolve("dist");
export const siteOrigin = "https://septen.co.uk";

/**
 * @param {string} [directory]
 * @returns {string[]}
 */
export function walkHtmlFiles(directory = distDir) {
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
 * @param {string} filePath
 * @returns {string}
 */
export function routePathFromHtmlFile(filePath) {
  const relativePath = path.relative(distDir, filePath).replace(/\\/gu, "/");

  if (relativePath === "index.html") {
    return "/";
  }

  if (relativePath.endsWith("/index.html")) {
    return `/${String(relativePath.slice(0, -"index.html".length))}`;
  }

  return `/${String(relativePath)}`;
}

/**
 * @returns {Array<{ filePath: string; routePath: string; html: string }>}
 */
export function collectBuiltPages() {
  return walkHtmlFiles().map((filePath) => ({
    filePath,
    routePath: routePathFromHtmlFile(filePath),
    html: fs.readFileSync(filePath, "utf8"),
  }));
}

/**
 * @param {string} pathname
 * @returns {string}
 */
export function normalizePublicPath(pathname) {
  if (pathname === "/index.html") {
    return "/";
  }

  if (pathname.endsWith("/index.html")) {
    return `${String(pathname.slice(0, -"index.html".length))}/`.replace(/\/+/gu, "/");
  }

  if (!path.extname(pathname) && !pathname.endsWith("/")) {
    return `${String(pathname)}/`;
  }

  return pathname;
}

/**
 * @param {string} currentRoutePath
 * @param {string} href
 * @returns {string | null}
 */
export function resolveInternalHref(currentRoutePath, href) {
  if (!href || /^(?:mailto|tel|sms|javascript|data):/iu.test(href) || href.startsWith("#")) {
    return null;
  }

  const currentUrl = new URL(currentRoutePath, siteOrigin);
  const resolvedUrl = new URL(href, currentUrl);

  if (resolvedUrl.origin !== siteOrigin) {
    return null;
  }

  return `${normalizePublicPath(resolvedUrl.pathname)}${String(resolvedUrl.hash)}`;
}

/**
 * @param {string} html
 * @param {string} attributeName
 * @returns {string[]}
 */
export function extractAttributeValues(html, attributeName) {
  /** @type {string[]} */
  const values = [];
  const attributePattern = new RegExp(`${String(attributeName)}\\s*=\\s*(['"])(.*?)\\1`, "giu");

  for (const match of html.matchAll(attributePattern)) {
    values.push(match[2]);
  }

  return values;
}

/**
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
    .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/&nbsp;/giu, " ")
    .replace(/&amp;/giu, "&")
    .replace(/&quot;/giu, '"')
    .replace(/&#39;|&apos;/giu, "'")
    .replace(/&lt;/giu, "<")
    .replace(/&gt;/giu, ">")
    .replace(/\s+/gu, " ")
    .trim();
}
