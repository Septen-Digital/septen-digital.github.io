import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import chromedriver from "chromedriver";
import { buildAuditUrl, indexableAuditPagePaths } from "./site-audit-pages.mjs";
import { withPreviewServer } from "./with-preview-server.mjs";

const axeReportDir = path.resolve("reports", "axe");
const axeCommand = process.execPath;
const axeCliPath = path.resolve("node_modules", "@axe-core", "cli", "dist", "src", "bin", "cli.js");
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

function findBrowserPath() {
  return chromeCandidates.find((candidate) => candidate && fs.existsSync(candidate));
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command exited with code ${String(code)}`));
    });

    child.on("error", reject);
  });
}

const browserPath = findBrowserPath();

if (!browserPath) {
  throw new Error(
    "Unable to find a local Chromium browser for axe. Set CHROME_PATH to a Chrome or Edge executable.",
  );
}

await withPreviewServer(async () => {
  await mkdir(axeReportDir, { recursive: true });

  const axeArgs = [
    axeCliPath,
    ...indexableAuditPagePaths.map(buildAuditUrl),
    "--tags",
    "wcag2a,wcag2aa,wcag2aaa,wcag21aa,wcag21aaa",
    "--dir",
    axeReportDir,
    "--save",
    "axe-results.json",
    "--exit",
    "--load-delay",
    "1500",
    "--chrome-path",
    browserPath,
    "--chromedriver-path",
    chromedriver.path,
  ];

  await runCommand(axeCommand, axeArgs);
});
