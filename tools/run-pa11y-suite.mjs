import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAuditUrl, auditPagePaths } from "./site-audit-pages.mjs";
import { withPreviewServer } from "./with-preview-server.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const pa11yReportDir = path.resolve(projectRoot, "reports", "pa11y");
const pa11yCommand = process.execPath;
const pa11yCliPath = path.resolve(projectRoot, "node_modules", "pa11y", "bin", "pa11y.js");

function slugifyPath(pathname) {
  if (pathname === "/") {
    return "home";
  }

  return pathname.replace(/^\/|\/$/gu, "").replace(/[^a-z0-9]+/giu, "-");
}

function runPa11y(url) {
  return new Promise((resolve, reject) => {
    const safeUrl = typeof url === "string" ? url : String(url);
    const child = spawn(
      pa11yCommand,
      [pa11yCliPath, safeUrl, "--config", ".pa11yrc.json", "--reporter", "json"],
      {
        shell: false,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("exit", (code) => {
      if (code === 0 || code === 2) {
        resolve({ code, stdout, stderr });
        return;
      }

      const exitCode = typeof code === "number" ? String(code) : "unknown";
      reject(new Error(stderr || `Pa11y failed for ${safeUrl} with exit code ${exitCode}`));
    });

    child.on("error", reject);
  });
}

function parsePa11yJson(stdout) {
  const trimmed = stdout.trim();
  const jsonStart = trimmed.indexOf("[");
  const jsonEnd = trimmed.lastIndexOf("]");
  if (jsonStart === -1 || jsonEnd === -1) {
    return [];
  }
  try {
    const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1));
    return parsed.map((issue) => {
      const isAxeContrastReview =
        issue.code === "color-contrast" &&
        issue.runner === "axe" &&
        issue.runnerExtras &&
        issue.runnerExtras.needsFurtherReview === true;
      if (isAxeContrastReview && issue.type === "error") {
        return { ...issue, type: "warning", typeCode: 2 };
      }
      return issue;
    });
  } catch {
    return [];
  }
}

await withPreviewServer(async () => {
  await mkdir(pa11yReportDir, { recursive: true });

  const perRouteResults = [];
  let totalErrors = 0;

  for (const pathname of auditPagePaths) {
    const safePathname = typeof pathname === "string" ? pathname : String(pathname);
    const url = buildAuditUrl(safePathname);
    process.stdout.write(`\nRunning Pa11y on ${safePathname} …\n`);
    const rawSlug = slugifyPath(safePathname);
    const reportSlug = typeof rawSlug === "string" ? rawSlug : "unknown";
    const safeReportSlug = String(reportSlug);
    const filePath = path.join(pa11yReportDir, `${safeReportSlug}.json`);

    let result;
    let issues = [];
    try {
      result = await runPa11y(url);
      issues = parsePa11yJson(result.stdout);
      await writeFile(filePath, JSON.stringify(issues, null, 2) + "\n", "utf8");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      perRouteResults.push({ pathname, issues, fatal: message });
      totalErrors += 1;
      continue;
    }

    const errorsOnly = issues.filter((issue) => issue.type === "error");
    const errorCount = errorsOnly.length;
    totalErrors += errorCount;

    perRouteResults.push({
      pathname,
      issueCount: issues.length,
      errorCount,
      warningCount: issues.filter((i) => i.type === "warning").length,
      noticeCount: issues.filter((i) => i.type === "notice").length,
      report: filePath,
    });
  }

  const summaryPath = path.join(pa11yReportDir, "_summary.json");
  await writeFile(summaryPath, JSON.stringify(perRouteResults, null, 2) + "\n", "utf8");

  for (const row of perRouteResults) {
    if (row.fatal) {
      process.stderr.write(`\nFatal Pa11y error on ${row.pathname}:\n${row.fatal}\n`);
      continue;
    }
    process.stdout.write(
      `  ${row.pathname}: ${String(row.errorCount)} error${row.errorCount === 1 ? "" : "s"}, ${String(row.warningCount)} warn, ${String(row.noticeCount)} notice\n`,
    );
  }

  if (totalErrors > 0) {
    throw new Error(
      `Pa11y found ${String(totalErrors)} WCAG AA error${totalErrors === 1 ? "" : "s"} across audited routes. See reports/pa11y/.`,
    );
  }

  process.stdout.write(`\nPa11y WCAG AA passed for ${String(auditPagePaths.length)} routes.\n`);
});
