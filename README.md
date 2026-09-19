# Septen Website

Production Astro marketing site for Septen, built as a static deployment for `https://septen.co.uk`.

## Stack

- Astro 7
- TypeScript with strict mode enabled
- Tailwind CSS v4
- Preact where interactive islands are still appropriate
- Web3Forms for enquiry delivery
- Local linting, accessibility, and performance audit tooling

## Public routes

- `/` - main marketing site
- `/demos/` - interactive demo catalogue
- `/legal/` - static legal documents page for direct access and no-JS fallback
- `/demos/[slug]/` - portfolio demo pages, intentionally excluded from indexing

Current demo slugs:

- `carls-coffee`
- `alder-and-pipe-plumbing`
- `sarahs-boutique`
- `greenfield-landscaping`
- `north-shore-fitness`

## Project structure

```text
.
|-- public/
|   |-- _headers
|   |-- robots.txt
|   `-- site.webmanifest
|-- src/
|   |-- assets/
|   |   |-- demo-images/
|   |   |-- founders/
|   |   `-- logo.svg
|   |-- components/
|   |   |-- layout/
|   |   |-- modals/
|   |   |-- sections/
|   |   `-- ui/
|   |-- config/
|   |   `-- web3forms.ts
|   |-- content/
|   |   `-- legal/
|   |-- data/
|   |   |-- content.ts
|   |   |-- pricing.ts
|   |   |-- services.ts
|   |   |-- site.ts
|   |   `-- siteMeta.ts
|   |-- demos/
|   |   |-- alder-and-pipe-plumbing/
|   |   |-- carls-coffee/
|   |   |-- greenfield-landscaping/
|   |   |-- north-shore-fitness/
|   |   |-- sarahs-boutique/
|   |   |-- scripts/
|   |   `-- shared/
|   |-- pages/
|   |   |-- demos.astro
|   |   |-- demos/
|   |   |   `-- [slug].astro
|   |   |-- legal/
|   |   |   `-- index.astro
|   |   `-- index.astro
|   |-- scripts/
|   |   `-- site.ts
|   |-- types/
|   |-- utils/
|   |-- env.d.ts
|   `-- index.css
|-- tools/
|   |-- run-pa11y-suite.mjs
|   |-- run-bundle-visualizer.mjs
|   |-- site-audit-pages.mjs
|   `-- ...
|-- .pa11yrc.json
|-- astro.config.mjs
|-- eslint.config.js
|-- package.json
|-- playwright.config.ts
|-- stylelint.config.js
|-- tailwind.config.mjs
`-- tsconfig.json
```

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

Default local URL: `http://localhost:4321`

> No `.env` file is required. The Web3Forms contact-form key lives in
> `src/config/web3forms.ts` — the key is a public publishable identifier
> (same threat model as Stripe `pk_live_*`) and is safe to ship in the
> client bundle. Override it with the optional `PUBLIC_WEB3FORMS_ACCESS_KEY`
> environment variable only if you need to rotate to a different inbox
> without editing source.

## Build and preview

```bash
npm run build
npm run preview
```

Astro outputs the static site to `dist/`.

## Validation and audits

Key local scripts:

- `npm run format` - runs Prettier across the repo
- `npm run lint` - runs ESLint with Astro, TypeScript, accessibility, and project rules
- `npm run astro:check` - validates Astro templates and TypeScript integration
- `npm run stylelint` - lints CSS plus styled segments inside `.astro` files
- `npm run pa11y` - runs `pa11y` (WCAG 2.1 AA) against all audited routes via `tools/run-pa11y-suite.mjs`
- `npm run playwright:install` - installs Playwright browser binaries for Chromium / Firefox / WebKit
- `npm run playwright` - runs the full Playwright test suite
- `npm run playwright:quality` - Playwright quality suite: spellcheck, links, a11y snapshot, perf, schema, viewports, metadata
- `npm run bundle:visualize` - writes a bundle report to `reports/bundle/stats.html`
- `npm run bundle:budget` - enforces referenced JS and CSS budgets from the built site
- `npm run bundle:dead-code` - runs `ts-prune` for manual dead-code review
- `npm run test` - unified release pipeline: build → static checks → Playwright quality/flows/csp → Pa11y AA
- `npm run ci` - `lint` + `format:check` + `stylelint` + `test` for CI environments

The current audit coverage includes:

- `/`
- `/legal/`
- `/demos/carls-coffee/`
- `/demos/alder-and-pipe-plumbing/`
- `/demos/sarahs-boutique/`
- `/demos/greenfield-landscaping/`
- `/demos/north-shore-fitness/`

## Environment and tooling notes

- The repo is validated on Node `22.x`.
- Some newer lint-tool major versions require a newer Node patch level or incompatible upstream peer support, so the repo intentionally stays on the highest fully working dependency set rather than the newest versions reported by `ncu`.
- Playwright browser binaries are installed via `npm run playwright:install`. Chromium is used for the quality suite; the full suite also covers Firefox and WebKit for flow tests.
- Pa11y uses its bundled headless Chromium launcher; no external `chromedriver` package is required.

## Cloudflare Pages deployment

- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22` recommended
- Environment variables (all optional):
  - `PUBLIC_WEB3FORMS_ACCESS_KEY` — override the baked-in Web3Forms key

## SEO and crawler behaviour

- The site uses `https://septen.co.uk` as the canonical domain.
- Shared SEO metadata, Open Graph tags, Twitter card data, and JSON-LD live in `src/components/layout/BaseLayout.astro`.
- `robots.txt` allows crawling and points to `https://septen.co.uk/sitemap-index.xml`.
- `@astrojs/sitemap` generates the sitemap from real routed pages during build.
- `/` and `/legal/` are indexable.
- Demo pages under `/demos/*` are intentionally excluded from indexing through page metadata and `X-Robots-Tag` headers.

## Business model and pricing

- Each website build is priced as a one-off project: Basic (£199), Standard (£349), or Premium (£499), subject to the final written scope.
- Every active website requires an ongoing care plan after launch: Essential Care (£9.99/month), Growth Care (£19.99/month), or Pro Care (£29.99/month).
- The first month of the matching care tier is included with each listed build package. Premium also includes three months of Growth Care at launch as stated in the pricing data.
- Care plans cover hosting, security, maintenance, updates, support, and tier-specific improvement work as described in `src/data/pricing.ts`.
- Bespoke work, integrations, ecommerce, and requirements outside a listed package are scoped and quoted separately.

## Security and form behaviour

- Web3Forms submissions go to `https://api.web3forms.com/submit`.
- Spam protection relies on a hidden honeypot field in the enquiry form.
- Static host security headers are configured in `public/_headers`.
- The site uses a strict CSP:
  - `script-src` whitelists only `'self'` plus Cloudflare Insights, and allows only seven explicitly hashed inline `<script is:inline>` bodies (see `public/_headers`).
  - `script-src-attr 'none'` — **no** inline event-handler attributes are permitted anywhere in the markup.
  - `style-src 'self' 'unsafe-inline'` — external stylesheets plus Astro's compiled `<style>` blocks are permitted.
  - `style-src-attr 'none'` — **no** inline `style="..."` attributes are permitted anywhere in the markup. Every style must live in a CSS file, a Tailwind utility, or a scoped `<style>` block inside an Astro component.
  - Standard hardening: `object-src 'none'`, `frame-src 'none'`, `frame-ancestors 'none'`, `base-uri 'none'`.
- Whenever you change the body of any inline `<script is:inline>` (BaseLayout pre-paint / reveal, index hero scroll-snap, FAQ open/close, demo toggle, Sarah's carousel, etc.) regenerate the CSP hashes or the site will drop into "no-JS" state in production:
  ```bash
  npm run build
  node tools/csp-inline-hashes.mjs
  ```
  then copy the printed seven `'sha256-…'` strings into the `script-src` directive in `public/_headers`.
- To keep `style-src-attr 'none'` enforced, never add a `style="..."` attribute to an element. Prefer Tailwind utilities, a scoped `<style>` block, or a CSS custom property toggle driven by a JS class switch.
- `/_astro/*` and `/fonts/*` assets are cached immutably.
- The demo "eye" toggle (`details[data-demo-chrome-toggle]`) exposes all of its ARIA state on the native `<summary>` (role `button`), not on the outer `<details>` (role `group`), because `aria-pressed` / `aria-label` are only valid on button-like elements.

## No-JS and accessibility behaviour

- Core navigation works without JavaScript.
- Legal content is available both through the JS modal and the static `/legal/` page.
- Shared enquiry triggers degrade to usable non-JS destinations.
- Reveal-animated content is visible by default, and page-specific fallback notices use local `<noscript>` blocks.
- Sarah's Boutique uses static hash-driven views so its JavaScript and no-JavaScript behaviour stay aligned.

## Maintenance notes

- Update shared business metadata in `src/data/siteMeta.ts`.
- Update services and process steps in `src/data/services.ts`.
- Update pricing in `src/data/pricing.ts`.
- Update homepage content, FAQ content, demo card metadata, and founder content in `src/data/content.ts`.
- Update legal copy in `src/content/legal/legalContent.ts`; it feeds both the modal and the `/legal/` page.
- Update shared site interactions in `src/scripts/site.ts`.
- Update Sarah's Boutique markup and hash-driven styling in `src/demos/sarahs-boutique/`.
- If routes or demo slugs change, update `tools/site-audit-pages.mjs` and rebuild so the sitemap and audits stay aligned with the live route set.
