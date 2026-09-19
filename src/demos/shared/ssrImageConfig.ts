import greenfieldHero from "@assets/demo-images/greenfield-landscaping/hero.webp";
import greenfieldPatioSteps from "@assets/demo-images/greenfield-landscaping/patio-steps.webp";
import greenfieldRyegrass from "@assets/demo-images/greenfield-landscaping/ryegrass.webp";
import greenfieldCedarFencing from "@assets/demo-images/greenfield-landscaping/cedar-fencing.webp";
import northShoreHero from "@assets/demo-images/north-shore-fitness/hero.webp";
import northShoreCoachMarcus from "@assets/demo-images/north-shore-fitness/coach-marcus.webp";
import northShoreCoachSarah from "@assets/demo-images/north-shore-fitness/coach-sarah.webp";
import northShoreCoachKelly from "@assets/demo-images/north-shore-fitness/coach-kelly.webp";
import alderPipeHero from "@assets/demo-images/alder-and-pipe-plumbing/hero.webp";
import carlsCoffeeDurhamRiver from "@assets/demo-images/carls-coffee/durham-river.webp";
import carlsCoffeeBeans from "@assets/demo-images/carls-coffee/coffee-beans.webp";
import carlsCoffeeShop from "@assets/demo-images/carls-coffee/coffee-shop.webp";
import carlsCoupleDining from "@assets/demo-images/carls-coffee/couple-dining.webp";

type DemoImageConfig = {
  // Each legacy TS demo emits placeholder tokens in its HTML string. The route
  // replaces those tokens with optimized Astro image markup during SSR.
  sourceToken: string;
  image: ImageMetadata;
  width: number;
  widths: number[];
  sizes: string;
  layout: "constrained" | "full-width";
  alt: string;
  loading: "eager" | "lazy";
  fetchpriority: "high" | "low" | "auto";
  className: string;
};

function createConfig(
  sourceToken: string,
  baseWidth: number,
  variantWidths: number[],
  sizes: string,
  image: ImageMetadata,
  layout: "constrained" | "full-width",
  alt: string,
  loading: "eager" | "lazy",
  fetchpriority: "high" | "low" | "auto",
  className: string,
): DemoImageConfig {
  return {
    sourceToken,
    image,
    width: baseWidth,
    widths: variantWidths,
    sizes,
    layout,
    alt,
    loading,
    fetchpriority,
    className,
  };
}

export function getDemoSsrImageConfig(slug: string): DemoImageConfig[] {
  // Keep image policy centralized so the route and the demos do not need to
  // duplicate widths, loading priority, or alt text decisions.
  switch (slug) {
    case "greenfield-landscaping":
      return [
        createConfig(
          "__GREENFIELD_HERO_IMAGE__",
          1400,
          [480, 960],
          "100vw",
          greenfieldHero,
          "full-width",
          "Completed garden landscape and sandstone paving sandstone flags",
          "eager",
          "high",
          "image-skeleton w-full h-full object-cover opacity-55",
        ),
        createConfig(
          "__GREENFIELD_PATIO_IMAGE__",
          900,
          [320, 560],
          "(min-width: 64rem) 18rem, (min-width: 40rem) 50vw, 100vw",
          greenfieldPatioSteps,
          "constrained",
          "Completed patio steps and stone edging",
          "lazy",
          "low",
          "image-skeleton image-skeleton-flush w-full h-full object-cover",
        ),
        createConfig(
          "__GREENFIELD_RYEGRASS_IMAGE__",
          900,
          [320, 560],
          "(min-width: 64rem) 18rem, (min-width: 40rem) 50vw, 100vw",
          greenfieldRyegrass,
          "constrained",
          "Freshly laid cultivated ryegrass lawn",
          "lazy",
          "low",
          "image-skeleton image-skeleton-flush w-full h-full object-cover",
        ),
        createConfig(
          "__GREENFIELD_CEDAR_IMAGE__",
          900,
          [320, 560],
          "(min-width: 64rem) 18rem, (min-width: 40rem) 50vw, 100vw",
          greenfieldCedarFencing,
          "constrained",
          "Cedar fencing and privacy screens",
          "lazy",
          "low",
          "image-skeleton image-skeleton-flush w-full h-full object-cover",
        ),
      ];
    case "north-shore-fitness":
      return [
        createConfig(
          "__NORTH_SHORE_HERO_IMAGE__",
          1400,
          [480, 960],
          "100vw",
          northShoreHero,
          "full-width",
          "North Shore Fitness clean black steel power racking and free weight benches",
          "eager",
          "high",
          "image-skeleton w-full h-full object-cover opacity-35",
        ),
        createConfig(
          "__NORTH_SHORE_COACH_MARCUS_IMAGE__",
          500,
          [200, 360],
          "(min-width: 48rem) 10rem, 8rem",
          northShoreCoachMarcus,
          "constrained",
          "Coach Marcus, Head Performance Coach at North Shore Fitness",
          "lazy",
          "low",
          "image-skeleton w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-amber-500/40 shrink-0",
        ),
        createConfig(
          "__NORTH_SHORE_COACH_SARAH_IMAGE__",
          500,
          [200, 360],
          "(min-width: 48rem) 10rem, 8rem",
          northShoreCoachSarah,
          "constrained",
          "Coach Sarah, Mobility & Restoration Coach at North Shore Fitness",
          "lazy",
          "low",
          "image-skeleton w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-amber-500/40 shrink-0",
        ),
        createConfig(
          "__NORTH_SHORE_COACH_KELLY_IMAGE__",
          500,
          [200, 360],
          "(min-width: 48rem) 10rem, 8rem",
          northShoreCoachKelly,
          "constrained",
          "Trainer Kelly, Conditioning Specialist at North Shore Fitness",
          "lazy",
          "low",
          "image-skeleton w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-amber-500/40 shrink-0",
        ),
      ];
    case "alder-and-pipe-plumbing":
      return [
        createConfig(
          "__ALDER_PIPE_HERO_IMAGE__",
          1100,
          [480, 840],
          "(min-width: 48rem) 50vw, 100vw",
          alderPipeHero,
          "constrained",
          "Neat domestic tiling and plumbing in a modern residence",
          "eager",
          "high",
          "image-skeleton w-full h-full object-cover",
        ),
      ];
    case "carls-coffee":
      return [
        createConfig(
          "__CARLS_DURHAM_RIVER_IMAGE__",
          1400,
          [480, 960, 1280],
          "100vw",
          carlsCoffeeDurhamRiver,
          "full-width",
          "Durham River Wear waterside view, 2 minutes from Carl's Coffee Bailey Street shop",
          "eager",
          "high",
          "image-skeleton w-full h-full object-cover opacity-55",
        ),
        createConfig(
          "__CARLS_COFFEE_BEANS_IMAGE__",
          1400,
          [480, 960, 1280],
          "100vw",
          carlsCoffeeBeans,
          "full-width",
          "Raw green and roasted arabica coffee beans on the Probat tray at Carl's Coffee roastery",
          "lazy",
          "low",
          "w-full h-full object-cover",
        ),
        createConfig(
          "__CARLS_COFFEE_SHOP_IMAGE__",
          800,
          [320, 480, 720],
          "(min-width: 64rem) 24rem, (min-width: 48rem) 50vw, 100vw",
          carlsCoffeeShop,
          "constrained",
          "Carl's Coffee Bailey Street shopfront interior, timber counter with hand-poured espresso",
          "lazy",
          "low",
          "image-skeleton w-full h-full object-cover",
        ),
        createConfig(
          "__CARLS_COUPLE_DINING_IMAGE__",
          1400,
          [480, 960, 1280],
          "100vw",
          carlsCoupleDining,
          "full-width",
          "Two people enjoying coffee and brunch pastries at a sunlit table in Carl's Coffee",
          "lazy",
          "low",
          "w-full h-full object-cover",
        ),
      ];
    default:
      return [];
  }
}

export function getDemoHeroRawImage(slug: string): ImageMetadata | null {
  // Some demos need the hero image rendered directly by Astro so the image is
  // discovered earlier than the surrounding string markup.
  switch (slug) {
    case "north-shore-fitness":
      return northShoreHero;
    case "alder-and-pipe-plumbing":
      return alderPipeHero;
    case "carls-coffee":
      return carlsCoffeeDurhamRiver;
    default:
      return null;
  }
}
