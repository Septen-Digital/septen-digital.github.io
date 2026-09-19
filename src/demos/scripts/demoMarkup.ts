import { initCarlsCoffee, renderCarlsCoffee } from "@demos/carls-coffee/CarlsCoffee";
import {
  initAlderPipePlumbing,
  renderAlderPipePlumbing,
} from "@demos/alder-and-pipe-plumbing/AlderPipePlumbing";
import {
  initGreenfieldLandscaping,
  renderGreenfieldLandscaping,
} from "@demos/greenfield-landscaping/GreenfieldLandscaping";
import {
  initNorthShoreFitness,
  renderNorthShoreFitness,
} from "@demos/north-shore-fitness/NorthShoreFitness";
import type { DemoContainer } from "@demos/shared/types";

// Keep a single source of truth for demo slugs so homepage cards, routing,
// and demo bootstrapping cannot silently drift apart.
export const demoSlugs = [
  "carls-coffee",
  "alder-and-pipe-plumbing",
  "sarahs-boutique",
  "greenfield-landscaping",
  "north-shore-fitness",
] as const;

export type DemoSlug = (typeof demoSlugs)[number];

export function isDemoSlug(value: string): value is DemoSlug {
  return demoSlugs.some((slug) => slug === value);
}

export type DemoEntry = {
  title: string;
  description: string;
  render?: (container: DemoContainer) => void;
  init?: (container: DemoContainer) => void;
};

function createStaticContainer(): DemoContainer {
  // The legacy TS demos render into a tiny fake container at build time so the
  // route can capture stable HTML without needing a browser DOM.
  return {
    innerHTML: "",
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };
}

function captureMarkup(renderDemo: (container: DemoContainer) => void): string {
  const container = createStaticContainer();
  renderDemo(container);
  return container.innerHTML;
}

export const demoRegistry: Record<DemoSlug, DemoEntry> = {
  "carls-coffee": {
    title: "Carl's Coffee Demo",
    description:
      "Interactive coffee shop demo website showcasing Septen's hospitality design work.",
    render: renderCarlsCoffee,
    init: initCarlsCoffee,
  },
  "alder-and-pipe-plumbing": {
    title: "Alder & Pipe Plumbing Demo",
    description: "Interactive plumbing demo website showcasing Septen's trade business layouts.",
    render: renderAlderPipePlumbing,
    init: initAlderPipePlumbing,
  },
  "sarahs-boutique": {
    title: "Sarah's Boutique Demo",
    description: "Interactive boutique demo website showcasing Septen's retail design work.",
  },
  "greenfield-landscaping": {
    title: "Greenfield Landscaping Demo",
    description:
      "Interactive landscaping demo website showcasing Septen's service business design work.",
    render: renderGreenfieldLandscaping,
    init: initGreenfieldLandscaping,
  },
  "north-shore-fitness": {
    title: "North Shore Fitness Demo",
    description:
      "Interactive fitness demo website showcasing Septen's conversion-focused landing pages.",
    render: renderNorthShoreFitness,
    init: initNorthShoreFitness,
  },
};

export function getDemoMarkup(slug: string): string {
  // Sarah's Boutique is already a native Astro component, so only the legacy
  // TS demos still flow through this string-render path.
  const demo = demoRegistry[slug as DemoSlug];
  if (!demo) {
    return "";
  }

  if (!demo.render) {
    return "";
  }

  return captureMarkup(demo.render);
}
