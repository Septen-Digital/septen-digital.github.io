import { initCarlsCoffee, renderCarlsCoffee } from '../demo_sites/CarlsCoffee';
import { initPetersPlumbing, renderPetersPlumbing } from '../demo_sites/PetersPlumbing';
import { initGreenfieldLandscaping, renderGreenfieldLandscaping } from '../demo_sites/GreenfieldLandscaping';
import { initNorthShoreFitness, renderNorthShoreFitness } from '../demo_sites/NorthShoreFitness';
import type { DemoContainer } from '../demo_sites/types';

export type DemoEntry = {
  title: string;
  description: string;
  render?: (container: DemoContainer) => void;
  init?: (container: DemoContainer) => void;
};

function createStaticContainer(): DemoContainer {
  return {
    innerHTML: '',
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

export const demoRegistry: Record<string, DemoEntry> = {
  'carls-coffee': {
    title: "Carl's Coffee Demo",
    description: "Interactive coffee shop demo website showcasing Septen's hospitality design work.",
    render: renderCarlsCoffee,
    init: initCarlsCoffee,
  },
  'alder-and-pipe-plumbing': {
    title: 'Alder & Pipe Plumbing Demo',
    description: "Interactive plumbing demo website showcasing Septen's trade business layouts.",
    render: renderPetersPlumbing,
    init: initPetersPlumbing,
  },
  'sarahs-boutique': {
    title: "Sarah's Boutique Demo",
    description: "Interactive boutique demo website showcasing Septen's retail design work.",
  },
  'greenfield-landscaping': {
    title: 'Greenfield Landscaping Demo',
    description: "Interactive landscaping demo website showcasing Septen's service business design work.",
    render: renderGreenfieldLandscaping,
    init: initGreenfieldLandscaping,
  },
  'north-shore-fitness': {
    title: 'North Shore Fitness Demo',
    description: "Interactive fitness demo website showcasing Septen's conversion-focused landing pages.",
    render: renderNorthShoreFitness,
    init: initNorthShoreFitness,
  },
};

export function getDemoMarkup(slug: string): string {
  const demo = demoRegistry[slug];
  if (!demo) {
    return '';
  }

  if (!demo.render) {
    return '';
  }

  return captureMarkup(demo.render);
}
