import path from "node:path";
import { spawn } from "node:child_process";
import { previewOrigin } from "./site-audit-pages.mjs";

const astroCliPath = path.resolve("node_modules", "astro", "bin", "astro.mjs");
const previewArgs = [
  astroCliPath,
  "preview",
  "--host",
  "127.0.0.1",
  "--port",
  "4321",
  "--strictPort",
];

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function isPreviewReady() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1000);

  try {
    const response = await fetch(previewOrigin, {
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForPreview(timeoutMs = 30000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await isPreviewReady()) {
      return;
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for Astro preview at ${previewOrigin}.`);
}

async function stopPreview(child, exitPromise) {
  if (!child || child.killed) {
    return;
  }

  child.kill();
  await Promise.race([exitPromise.catch(() => undefined), delay(5000)]);

  if (!child.killed) {
    child.kill("SIGKILL");
    await Promise.race([exitPromise.catch(() => undefined), delay(2000)]);
  }
}

export async function withPreviewServer(runAudit) {
  if (await isPreviewReady()) {
    return runAudit();
  }

  let previewOutput = "";
  const child = spawn(process.execPath, previewArgs, {
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const exitPromise = new Promise((resolve, reject) => {
    child.stdout.on("data", (chunk) => {
      previewOutput += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      previewOutput += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0 || code === null) {
        resolve();
        return;
      }

      reject(new Error(`Astro preview exited with code ${String(code)}.\n${previewOutput}`));
    });
  });

  try {
    await Promise.race([waitForPreview(), exitPromise]);
    return await runAudit();
  } finally {
    await stopPreview(child, exitPromise);
  }
}
