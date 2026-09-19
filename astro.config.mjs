import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, "src");

export default defineConfig({
  output: "static",
  site: "https://septen.co.uk",
  server: {
    host: true, // Forces Astro/Vite to always listen on all local network addresses
    port: 4321,
  },
  image: {
    dangerouslyProcessSVG: true,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/demos/"),
    }),
    preact(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@assets": resolve(src, "assets"),
        "@components": resolve(src, "components"),
        "@config": resolve(src, "config"),
        "@content": resolve(src, "content"),
        "@data": resolve(src, "data"),
        "@demos": resolve(src, "demos"),
        "@pages": resolve(src, "pages"),
        "@scripts": resolve(src, "scripts"),
        "@utils": resolve(src, "utils"),
        "@shared-types": resolve(src, "types"),
      },
    },
  },
});
