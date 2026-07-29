import { mkdtemp, readFile, rm, writeFile, copyFile, unlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const projectRoot = process.cwd();
const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "septen-recovery-"));

/**
 * @param {string} command
 * @param {string[]} args
 * @param {boolean} [expectSuccess]
 * @returns {Promise<void>}
 */
function runCommand(command, args, expectSuccess = true) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      shell: false,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      const succeeded = code === 0;
      if (succeeded === expectSuccess) {
        resolve();
        return;
      }

      reject(
        new Error(
          `Command ${String(command)} ${args.join(" ")} ${
            expectSuccess ? "failed" : "unexpectedly passed"
          } with exit code ${String(code)}.`,
        ),
      );
    });
  });
}

/**
 * @param {string} absolutePath
 * @returns {Promise<string>}
 */
async function backupFile(absolutePath) {
  const backupPath = path.join(tempDirectory, `${path.basename(absolutePath)}.${Date.now()}.bak`);
  await copyFile(absolutePath, backupPath);
  return backupPath;
}

/**
 * @param {string} backupPath
 * @param {string} absolutePath
 * @returns {Promise<void>}
 */
async function restoreFile(backupPath, absolutePath) {
  await copyFile(backupPath, absolutePath);
}

/**
 * @param {string} absolutePath
 * @param {string} nextContents
 * @returns {Promise<void>}
 */
async function overwriteFile(absolutePath, nextContents) {
  await writeFile(absolutePath, nextContents, "utf8");
}

/**
 * @param {string} absolutePath
 * @param {() => Promise<void>} mutate
 * @param {() => Promise<void>} verifyBreakage
 * @param {() => Promise<void>} verifyRecovery
 * @returns {Promise<void>}
 */
async function withFileMutation(absolutePath, mutate, verifyBreakage, verifyRecovery) {
  const backupPath = await backupFile(absolutePath);

  try {
    await mutate();
    await verifyBreakage();
  } finally {
    await restoreFile(backupPath, absolutePath);
  }

  await verifyRecovery();
}

console.log("Running disaster recovery simulations...");

await runCommand("npm", ["run", "build"]);

await (async function testDistRecovery() {
  const distIndexPath = path.resolve("dist", "index.html");
  await overwriteFile(distIndexPath, "<!doctype html><title>broken dist</title>");
  await runCommand("npm", ["run", "build"]);

  const rebuiltIndex = await readFile(distIndexPath, "utf8");
  if (rebuiltIndex.includes("broken dist")) {
    throw new Error("Dist recovery failed: build did not replace the corrupted dist output.");
  }
})();

await (async function testAstroCacheRecovery() {
  const cacheFilePath = path.resolve(".astro", "corrupted-cache.txt");
  await overwriteFile(cacheFilePath, "this cache file should not survive a rebuild");
  await runCommand("npm", ["run", "build"]);
  await rm(cacheFilePath, { force: true });
})();

await (async function testNodeModulesRecovery() {
  const astroPackagePath = path.resolve("node_modules", "astro", "package.json");
  const backupPath = await backupFile(astroPackagePath);

  try {
    await unlink(astroPackagePath);
    await runCommand("npm", ["run", "build"], false);
  } finally {
    await restoreFile(backupPath, astroPackagePath);
  }

  await runCommand("npm", ["run", "build"]);
})();

await (async function testDependencyUpdateBreakageRecovery() {
  const packageJsonPath = path.resolve("package.json");
  await withFileMutation(
    packageJsonPath,
    async () => {
      const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
      packageJson.devDependencies.astro = "9999.0.0-broken";
      await overwriteFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
    },
    async () => {
      await runCommand("npm", ["install", "--package-lock-only", "--ignore-scripts"], false);
    },
    async () => {
      await runCommand("npm", ["run", "build"]);
    },
  );
})();

await (async function testCspRecovery() {
  const headersPath = path.resolve("public", "_headers");
  await withFileMutation(
    headersPath,
    async () => {
      const headers = await readFile(headersPath, "utf8");
      await overwriteFile(headersPath, headers.replace(/script-src [^\n]+/u, "script-src 'none'"));
      await runCommand("npm", ["run", "build"]);
    },
    async () => {
      await runCommand(
        "npm",
        ["run", "playwright:csp", "--", "--project=chromium", "--grep", "core routes load cleanly"],
        false,
      );
    },
    async () => {
      await runCommand("npm", [
        "run",
        "playwright:csp",
        "--",
        "--project=chromium",
        "--grep",
        "core routes load cleanly",
      ]);
    },
  );
})();

await (async function testCssRecovery() {
  const cssPath = path.resolve("src", "index.css");
  await withFileMutation(
    cssPath,
    async () => {
      const css = await readFile(cssPath, "utf8");
      await overwriteFile(cssPath, `${css}\nbody {\n`);
    },
    async () => {
      await runCommand("npm", ["run", "build"], false);
    },
    async () => {
      await runCommand("npm", ["run", "build"]);
    },
  );
})();

await (async function testJsRecovery() {
  const scriptPath = path.resolve("src", "scripts", "site.ts");
  await withFileMutation(
    scriptPath,
    async () => {
      const script = await readFile(scriptPath, "utf8");
      await overwriteFile(scriptPath, `${script}\nconst brokenRecoveryProbe = ;\n`);
    },
    async () => {
      await runCommand("npm", ["run", "build"], false);
    },
    async () => {
      await runCommand("npm", ["run", "build"]);
    },
  );
})();

await rm(tempDirectory, { force: true, recursive: true });

console.log("Disaster recovery simulations passed.");
