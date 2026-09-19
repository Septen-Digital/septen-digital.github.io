import { spawn, spawnSync } from "node:child_process";
import path from "node:path";

const previewUrl = "http://127.0.0.1:4321/";
const astroCliPath = path.resolve("node_modules", "astro", "bin", "astro.mjs");
const child = spawn(
  process.execPath,
  [astroCliPath, "preview", "--host", "127.0.0.1", "--port", "4321", "--strictPort"],
  { stdio: "inherit", shell: false },
);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForPreview = async () => {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(previewUrl);
      if (response.ok) {
        return;
      }
    } catch {}

    await delay(250);
  }

  throw new Error(`Timed out waiting for Astro preview at ${previewUrl}.`);
};

let shuttingDown = false;
let previewReady = false;
let keepAliveTimer = null;
const shutdown = () => {
  shuttingDown = true;
  spawnSync(process.execPath, [astroCliPath, "preview", "stop"], { stdio: "ignore" });
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
  }
  process.exit(0);
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
child.once("exit", (code, signal) => {
  if (!previewReady && !shuttingDown && code !== 0 && !signal) {
    console.error(
      `Astro preview exited before becoming ready (code ${String(code)}, signal ${String(signal)}).`,
    );
    process.exitCode = 1;
  }
});

try {
  await waitForPreview();
  previewReady = true;
  keepAliveTimer = setInterval(() => {}, 1000);
  await new Promise(() => {});
} catch (error) {
  shutdown();
  console.error(error);
  process.exitCode = 1;
}
