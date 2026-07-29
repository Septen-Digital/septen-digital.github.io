import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(projectRoot, "src");
const helperFilePattern = /\.(?:astro|[cm]?[jt]sx?)$/u;
const ignoredHelperNames = new Set(["createStaticContainer", "getStaticPaths", "render", "init"]);

let sharedHelperIndexCache = null;

function normalizePath(filePath) {
  return filePath.split(path.sep).join("/");
}

function walkSourceFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const resolvedPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkSourceFiles(resolvedPath));
      continue;
    }

    if (helperFilePattern.test(entry.name)) {
      files.push(resolvedPath);
    }
  }

  return files;
}

function collectHelperNames(source) {
  const helperNames = new Set();
  const functionPattern = /\bfunction\s+([a-z][A-Za-z0-9_]*)\s*\(/gu;
  const arrowPattern =
    /\b(?:const|let|var)\s+([a-z][A-Za-z0-9_]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/gu;

  for (const pattern of [functionPattern, arrowPattern]) {
    for (const match of source.matchAll(pattern)) {
      const helperName = match[1];

      if (!ignoredHelperNames.has(helperName)) {
        helperNames.add(helperName);
      }
    }
  }

  return helperNames;
}

function getSharedHelperIndex() {
  if (sharedHelperIndexCache) {
    return sharedHelperIndexCache;
  }

  const helperIndex = new Map();
  const sourceFiles = walkSourceFiles(srcRoot).filter(
    (filePath) => !normalizePath(filePath).includes("/src/utils/"),
  );

  for (const filePath of sourceFiles) {
    const source = fs.readFileSync(filePath, "utf8");
    const helperNames = collectHelperNames(source);

    for (const helperName of helperNames) {
      const usage = helperIndex.get(helperName) ?? new Set();
      usage.add(normalizePath(filePath));
      helperIndex.set(helperName, usage);
    }
  }

  sharedHelperIndexCache = helperIndex;
  return helperIndex;
}

function isProjectSourceFile(filePath) {
  return normalizePath(filePath).startsWith(normalizePath(srcRoot));
}

function isUtilsFile(filePath) {
  return normalizePath(filePath).includes("/src/utils/");
}

function createSharedHelperRule(ruleName, message) {
  return {
    meta: {
      type: "suggestion",
      docs: {
        description:
          "Require shared helper logic to move into src/utils once it appears in multiple files.",
      },
      schema: [],
      messages: {
        [ruleName]: message,
      },
    },
    create(context) {
      const filename = context.physicalFilename;

      if (
        !filename ||
        filename === "<input>" ||
        !isProjectSourceFile(filename) ||
        isUtilsFile(filename)
      ) {
        return {};
      }

      const sharedHelperIndex = getSharedHelperIndex();
      const normalizedFilename = normalizePath(filename);

      function reportIfShared(node, name) {
        if (
          !name ||
          !/^[a-z]/u.test(name) ||
          ignoredHelperNames.has(name) ||
          !sharedHelperIndex.has(name)
        ) {
          return;
        }

        const helperFiles = sharedHelperIndex.get(name);
        if (!helperFiles || helperFiles.size < 3 || !helperFiles.has(normalizedFilename)) {
          return;
        }

        context.report({
          node,
          messageId: ruleName,
          data: {
            name,
            count: String(helperFiles.size),
          },
        });
      }

      return {
        FunctionDeclaration(node) {
          reportIfShared(node.id ?? node, node.id?.name);
        },
        VariableDeclarator(node) {
          if (node.id.type !== "Identifier" || node.init?.type !== "ArrowFunctionExpression") {
            return;
          }

          reportIfShared(node.id, node.id.name);
        },
      };
    },
  };
}

const noRawImgRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow raw img tags in Astro and JSX templates.",
    },
    schema: [],
    messages: {
      noRawImg:
        "Use Astro image components instead of raw <img> tags so image optimization stays consistent.",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type === "JSXIdentifier" && node.name.name === "img") {
          context.report({
            node,
            messageId: "noRawImg",
          });
        }
      },
    };
  },
};

const noClientLoadRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow client:load hydration in Astro components.",
    },
    schema: [],
    messages: {
      noClientLoad:
        "Avoid client:load hydration. Prefer server-rendered markup, a plain script, or a less eager client directive.",
    },
  },
  create(context) {
    const filename = context.physicalFilename;

    if (!filename?.endsWith(".astro")) {
      return {};
    }

    return {
      Program(node) {
        const sourceCode = context.sourceCode;
        const sourceText = sourceCode.getText();
        const directivePattern = /\bclient:load\b/gu;

        for (const match of sourceText.matchAll(directivePattern)) {
          const startIndex = match.index ?? 0;
          const endIndex = startIndex + match[0].length;

          context.report({
            node,
            messageId: "noClientLoad",
            loc: {
              start: sourceCode.getLocFromIndex(startIndex),
              end: sourceCode.getLocFromIndex(endIndex),
            },
          });
        }
      },
    };
  },
};

export default {
  meta: {
    name: "eslint-plugin-septen",
  },
  rules: {
    "no-raw-img": noRawImgRule,
    "no-client-load": noClientLoadRule,
    "require-utils-for-shared-helpers": createSharedHelperRule(
      "requireUtilsForSharedHelpers",
      "Helper '{{name}}' appears in {{count}} source files. Move shared logic into src/utils to keep business logic centralized.",
    ),
    "no-repeated-business-logic": createSharedHelperRule(
      "noRepeatedBusinessLogic",
      "Helper '{{name}}' is duplicated across {{count}} source files. Centralize the repeated business logic instead of maintaining copies.",
    ),
  },
};
