import { fileURLToPath } from "node:url";
import path from "node:path";
import astroParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import septenPlugin from "./tools/eslint-plugin-septen.mjs";

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));
const sharedTypeAwareParserOptions = {
  tsconfigRootDir,
  ecmaVersion: "latest",
  sourceType: "module",
};
const typeAwareParserOptions = {
  ...sharedTypeAwareParserOptions,
  projectService: true,
};
const sharedTypeAwareRules = {
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/restrict-template-expressions": [
    "error",
    {
      allowAny: false,
      allowArray: false,
      allowBoolean: false,
      allowNullish: false,
      allowNumber: true,
      allowRegExp: false,
    },
  ],
  "septen/no-raw-img": "error",
  "septen/no-repeated-business-logic": "error",
};

export default [
  {
    ignores: [".astro/**", "dist/**", "node_modules/**", "reports/**"],
  },
  ...eslintPluginAstro.configs["flat/recommended"],
  ...eslintPluginAstro.configs["flat/jsx-a11y-strict"],
  {
    files: ["src/**/*.{js,ts,tsx,jsx}", "tools/**/*.mjs"],
    languageOptions: {
      parser: tsParser,
      parserOptions: typeAwareParserOptions,
    },
    plugins: {
      "@typescript-eslint": tsEslint,
      "jsx-a11y": jsxA11y,
      septen: septenPlugin,
    },
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
      ...sharedTypeAwareRules,
    },
  },
  {
    files: [".prettierrc.mjs", "astro.config.mjs", "eslint.config.js", "stylelint.config.js"],
    languageOptions: {
      parser: tsParser,
      parserOptions: sharedTypeAwareParserOptions,
    },
    plugins: {
      "@typescript-eslint": tsEslint,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        ...sharedTypeAwareParserOptions,
        extraFileExtensions: [".astro"],
        parser: tsParser,
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsEslint,
      septen: septenPlugin,
    },
    rules: {
      ...sharedTypeAwareRules,
      "septen/no-client-load": "error",
    },
  },
];
