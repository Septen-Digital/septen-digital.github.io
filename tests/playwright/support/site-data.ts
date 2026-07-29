export const publicRoutes = [
  { name: "home", path: "/" },
  { name: "legal", path: "/legal/" },
  { name: "carls-coffee", path: "/demos/carls-coffee/" },
  { name: "alder-and-pipe-plumbing", path: "/demos/alder-and-pipe-plumbing/" },
  { name: "sarahs-boutique", path: "/demos/sarahs-boutique/" },
  { name: "greenfield-landscaping", path: "/demos/greenfield-landscaping/" },
  { name: "north-shore-fitness", path: "/demos/north-shore-fitness/" },
] as const;

const viewportWidths = [320, 375, 414, 768, 1024, 1280, 1440, 1920] as const;

function getPortraitHeight(width: number): number {
  return Math.min(Math.max(Math.round(width * 1.6), 568), 1600);
}

function getLandscapeHeight(width: number): number {
  return Math.max(Math.round(width * 0.625), 240);
}

export const viewportScenarios = viewportWidths.flatMap((width) => [
  {
    name: `${String(width)}-portrait`,
    viewport: {
      width,
      height: getPortraitHeight(width),
    },
  },
  {
    name: `${String(width)}-landscape`,
    viewport: {
      width,
      height: getLandscapeHeight(width),
    },
  },
]);

