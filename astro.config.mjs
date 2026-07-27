import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  site: 'https://septen.co.uk',

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/demos/'),
    }),
    preact(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});