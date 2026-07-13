# Septen Website

Production Astro marketing site for Septen, built as a fully static deployment for Cloudflare Pages.

## Stack

- Astro 7
- TypeScript
- Tailwind CSS v4
- Preact islands
- Web3Forms for enquiry delivery
- Cloudflare Turnstile for bot protection

## Public routes

- `/` - main marketing site
- `/legal/` - static legal documents page for no-JS and direct access
- `/demos/[slug]` - portfolio demo pages, intentionally excluded from indexing

## Project structure

```text
.
|-- public/
|   |-- _headers
|   |-- founders/
|   |-- logo.svg
|   |-- noscript.css
|   |-- robots.txt
|   `-- ...
|-- src/
|   |-- components/
|   |   |-- sections/
|   |   |-- CookieConsent.ts
|   |   |-- DemoModal.ts
|   |   |-- EnquiryModal.ts
|   |   |-- Footer.astro
|   |   |-- Header.astro
|   |   `-- LegalModal.ts
|   |-- config/
|   |   |-- turnstile.ts
|   |   `-- web3forms.ts
|   |-- content/
|   |   `-- legalContent.ts
|   |-- data/
|   |   `-- site.ts
|   |-- demo_sites/
|   |-- layouts/
|   |   `-- BaseLayout.astro
|   |-- pages/
|   |   |-- demos/
|   |   |   `-- [slug].astro
|   |   |-- legal/
|   |   |   `-- index.astro
|   |   `-- index.astro
|   |-- scripts/
|   |   |-- demoMarkup.ts
|   |   |-- demoPage.ts
|   |   `-- site.ts
|   |-- utils/
|   |-- env.d.ts
|   `-- index.css
|-- .env.example
|-- astro.config.mjs
|-- package.json
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

3. Add the required public keys:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Web3Forms public access key for form submission |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for the enquiry form |

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

## Cloudflare Pages deployment

- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 18+ recommended
- Environment variables:
  - `PUBLIC_WEB3FORMS_ACCESS_KEY`
  - `PUBLIC_TURNSTILE_SITE_KEY`

## SEO and crawler behaviour

- The homepage is fully pre-rendered HTML.
- The site exposes a canonical URL, Open Graph metadata, Twitter card metadata, and JSON-LD structured data from `src/layouts/BaseLayout.astro`.
- `robots.txt` allows crawling and points to `https://septen.co.uk/sitemap-index.xml`.
- The sitemap is generated at build time by `@astrojs/sitemap`, producing `sitemap-index.xml` and `sitemap-0.xml` in `dist/` so it stays aligned with real routed pages.
- The legal page at `/legal/` is indexable and included in the sitemap.
- Demo pages under `/demos/*` are intentionally excluded from search indexing through both `<meta name="robots">` and `X-Robots-Tag` headers.

## Security and form behaviour

- Web3Forms submissions go to `https://api.web3forms.com/submit`.
- Cloudflare Turnstile is required client-side before submission.
- The Turnstile token is removed from `FormData` before posting to Web3Forms, which keeps the free-tier integration valid.
- Static host security headers are configured in `public/_headers`.
- A strict CSP and related hardening headers are configured in `public/_headers`.

## No-JS and accessibility behaviour

- Core navigation works without JavaScript, including the mobile menu fallback from `public/noscript.css`.
- Section navigation uses native fragment links and stable section targets rather than JS scroll correction.
- Legal content is available both through the JS modal and the static `/legal/` page.
- Shared enquiry triggers degrade to real links so users can still reach the contact section or email path without JavaScript.
- Reveal-animated content is reset in `public/noscript.css` so content does not remain hidden when scripting is disabled.

## Maintenance notes

- Update shared business metadata, SEO defaults, pricing, FAQ content, and founder data in `src/data/site.ts`.
- Update landing page sections in `src/components/sections/`.
- Update interactive demo content in `src/demo_sites/`.
- Update legal copy in `src/content/legalContent.ts`; it feeds both the modal and the `/legal/` page.
- If public routes change, rebuild once to refresh the generated sitemap output in `dist/`.
- Keep brand styling in semantic shared classes and utilities rather than scattering new arbitrary colours through markup.
