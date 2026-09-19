import { spawn } from "node:child_process";
import { rename, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node html-validate-run.mjs <config-file> <target...>");
  process.exit(2);
}

const [configFile, ...targets] = args;
const mainConfigPath = path.join(projectRoot, ".htmlvalidate.json");
const stashPath = path.join(projectRoot, ".htmlvalidate.json.__stash__");
const resolvedConfigPath = path.join(projectRoot, configFile);
const shouldStashMainConfig = path.resolve(resolvedConfigPath) !== path.resolve(mainConfigPath);

async function stashExists() {
  try {
    await stat(stashPath);
    return true;
  } catch {
    return false;
  }
}

async function mainConfigExists() {
  try {
    await stat(mainConfigPath);
    return true;
  } catch {
    return false;
  }
}

let stashed = false;
try {
  if (shouldStashMainConfig && (await mainConfigExists())) {
    await rename(mainConfigPath, stashPath);
    stashed = true;
  }

  const child = spawn(
    process.execPath,
    [
      path.join(projectRoot, "node_modules", "html-validate", "bin", "html-validate.mjs"),
      "--config",
      path.join(projectRoot, configFile),
      ...targets,
    ],
    {
      shell: false,
      stdio: "inherit",
      cwd: projectRoot,
    },
  );

  await new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else {
        const safeCode = typeof code === "number" ? String(code) : "unknown";
        reject(new Error(`html-validate exited with code ${safeCode}`));
      }
    });
    child.on("error", reject);
  });
} finally {
  if (stashed && (await stashExists())) {
    await rename(stashPath, mainConfigPath);
  }
}
