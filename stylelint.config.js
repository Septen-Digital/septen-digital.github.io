/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-html/astro"],
  plugins: ["stylelint-order"],
  rules: {
    "at-rule-empty-line-before": null,
    "block-no-empty": true,
    "color-function-notation": "modern",
    "custom-property-pattern": null,
    "declaration-block-no-duplicate-properties": [
      true,
      {
        ignore: [],
      },
    ],
    "declaration-block-single-line-max-declarations": null,
    "declaration-property-value-allowed-list": {
      "/^(background-color|border-color|color|outline-color)$/": [
        "/^var\\(\\s*--[a-z0-9-]+\\s*\\)$/",
        "currentColor",
        "inherit",
        "initial",
        "transparent",
        "unset",
      ],
    },
    "import-notation": null,
    "keyframe-selector-notation": null,
    "media-feature-name-no-vendor-prefix": true,
    "no-descending-specificity": null,
    "order/properties-alphabetical-order": true,
    "property-no-vendor-prefix": true,
    "selector-class-pattern": null,
    "value-no-vendor-prefix": true,
  },
};
