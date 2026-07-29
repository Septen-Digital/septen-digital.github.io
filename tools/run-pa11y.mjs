import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { buildAuditUrl, indexableAuditPagePaths } from "./site-audit-pages.mjs";
import { withPreviewServer } from "./with-preview-server.mjs";

const pa11yReportDir = path.resolve("reports", "pa11y");
const pa11yCommand = process.execPath;
const pa11yCliPath = path.resolve("node_modules", "pa11y", "bin", "pa11y.js");

/**
 * @param {string} pathname
 * @returns {string}
 */
function slugifyPath(pathname) {
  if (pathname === "/") {
    return "home";
  }

  return pathname.replace(/^\/|\/$/gu, "").replace(/[^a-z0-9]+/giu, "-");
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
function runPa11y(url) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      pa11yCommand,
      [pa11yCliPath, url, "--config", ".pa11yrc.json", "--reporter", "json"],
      {
        shell: false,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on(
      "data",
      /** @param {Buffer} chunk */ (chunk) => {
        stdout += chunk.toString();
      },
    );

    child.stderr.on(
      "data",
      /** @param {Buffer} chunk */ (chunk) => {
        stderr += chunk.toString();
      },
    );

    child.on("exit", (code) => {
      if (code === 0) {
        resolve(stdout);
        return;
      }

      const exitCode = typeof code === "number" ? String(code) : "unknown";
      reject(new Error(stderr || `Pa11y failed for ${url} with exit code ${exitCode}`));
    });

    child.on("error", reject);
  });
}

await withPreviewServer(async () => {
  await mkdir(pa11yReportDir, { recursive: true });

  for (const pathname of indexableAuditPagePaths) {
    const url = buildAuditUrl(pathname);
    const result = await runPa11y(url);
    const reportSlug = slugifyPath(pathname);
    const filePath = path.join(pa11yReportDir, `${reportSlug}.json`);
    await writeFile(filePath, result, "utf8");
  }
});
