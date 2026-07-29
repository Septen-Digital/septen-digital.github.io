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
|   |-- noscript.css
|   |-- robots.txt
|   `-- site.webmanifest
|-- src/
|   |-- assets/
|   |   |-- demo-images/
|   |   |-- founders/
|   |   `-- logo.svg
|   |-- components/
|   |   |-- demos/
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
|   |-- layouts/
|   |   `-- BaseLayout.astro
|   |-- pages/
|   |   |-- demos/
|   |   |   `-- [slug].astro
|   |   |-- legal/
|   |   |   `-- index.astro
|   |   `-- index.astro
|   |-- scripts/
|   |   |-- sarahs-boutique.ts
|   |   `-- site.ts
|   |-- styles/
|   |   `-- sarahs-boutique.css
|   |-- types/
|   |-- utils/
|   |-- env.d.ts
|   `-- index.css
|-- tools/
|   |-- run-axe.mjs
|   |-- run-pa11y.mjs
|   |-- run-bundle-visualizer.mjs
|   |-- site-audit-pages.mjs
|   `-- ...
|-- .env.example
|-- .pa11yrc.json
|-- astro.config.mjs
|-- eslint.config.js
|-- lighthouserc.json
|-- lighthouserc.demos.json
|-- package.json
|-- stylelint.config.js
|-- tailwind.config.mjs
`-- tsconfig.json
```

## Local development

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from the example:

```powershell
Copy-Item .env.example .env
```

3. Add the required public key:

| Variable                      | Purpose                                         |
| ----------------------------- | ----------------------------------------------- |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Web3Forms public access key for form submission |

4. Start the dev server:

```bash
npm run dev
```

Default local URL: `http://localhost:4321`

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
- `npm run axe` - runs `@axe-core/cli` against all current live routes
- `npm run pa11y` - runs `pa11y` against all current live routes
- `npm run bundle:visualize` - writes a bundle report to `reports/bundle/stats.html`
- `npm run bundle:budget` - enforces referenced JS and CSS budgets from the built site
- `npm run bundle:dead-code` - runs `ts-prune` for manual dead-code review
- `npm run lighthouse` - Lighthouse CI for indexable routes
- `npm run lighthouse:demos` - Lighthouse CI for demo routes
- `npm run validate` - full local release pipeline

The current audit coverage includes:

- `/`
- `/legal/`
- `/demos/carls-coffee/`
- `/demos/alder-and-pipe-plumbing/`
- `/demos/sarahs-boutique/`
- `/demos/greenfield-landscaping/`
- `/demos/north-shore-fitness/`

## Environment and tooling notes

- The repo is currently validated on Node `22.19.x`.
- Some newer lint-tool major versions require a newer Node patch level or incompatible upstream peer support, so the repo intentionally stays on the highest fully working dependency set rather than the newest versions reported by `ncu`.
- The local `axe` runner depends on a locally installed Chrome or Edge binary plus a matching `chromedriver` major version. If the browser major version changes, update the `chromedriver` package to match before relying on the `axe` script again.

## Cloudflare Pages deployment

- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22` recommended
- Environment variables:
  - `PUBLIC_WEB3FORMS_ACCESS_KEY`

## SEO and crawler behaviour

- The site uses `https://septen.co.uk` as the canonical domain.
- Shared SEO metadata, Open Graph tags, Twitter card data, and JSON-LD live in `src/layouts/BaseLayout.astro`.
- `robots.txt` allows crawling and points to `https://septen.co.uk/sitemap-index.xml`.
- `@astrojs/sitemap` generates the sitemap from real routed pages during build.
- `/` and `/legal/` are indexable.
- Demo pages under `/demos/*` are intentionally excluded from indexing through page metadata and `X-Robots-Tag` headers.

## Security and form behaviour

- Web3Forms submissions go to `https://api.web3forms.com/submit`.
- Spam protection relies on a hidden honeypot field in the enquiry form.
- Static host security headers are configured in `public/_headers`.
- The site uses a strict CSP with hashed JSON-LD scripts, `style-src 'self'`, and hardened frame/object/base restrictions.
- `/_astro/*` and `/fonts/*` assets are cached immutably.

## No-JS and accessibility behaviour

- Core navigation works without JavaScript.
- Legal content is available both through the JS modal and the static `/legal/` page.
- Shared enquiry triggers degrade to usable non-JS destinations.
- Reveal-animated content is reset in `public/noscript.css` so content never remains hidden when scripting is disabled.
- Sarah's Boutique uses route-scoped CSS and a dedicated client script rather than an Astro island so it stays compatible with the strict CSP.

## Maintenance notes

- Update shared business metadata in `src/data/siteMeta.ts`.
- Update services and process steps in `src/data/services.ts`.
- Update pricing in `src/data/pricing.ts`.
- Update homepage content, FAQ content, demo card metadata, and founder content in `src/data/content.ts`.
- Update legal copy in `src/content/legal/legalContent.ts`; it feeds both the modal and the `/legal/` page.
- Update shared site interactions in `src/scripts/site.ts`.
- Update Sarah's Boutique enhancement logic in `src/scripts/sarahs-boutique.ts` and route-specific styling in `src/styles/sarahs-boutique.css`.
- If routes or demo slugs change, update `tools/site-audit-pages.mjs` and rebuild so the sitemap and audits stay aligned with the live route set.
