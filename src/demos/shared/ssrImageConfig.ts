import greenfieldHero from "@assets/demo-images/greenfield-landscaping/hero.webp";
import greenfieldPatioSteps from "@assets/demo-images/greenfield-landscaping/patio-steps.webp";
import greenfieldRyegrass from "@assets/demo-images/greenfield-landscaping/ryegrass.webp";
import greenfieldCedarFencing from "@assets/demo-images/greenfield-landscaping/cedar-fencing.webp";
import northShoreHero from "@assets/demo-images/north-shore-fitness/hero.webp";
import petersHero from "@assets/demo-images/alder-and-pipe-plumbing/hero.webp";

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
      ];
    case "alder-and-pipe-plumbing":
      return [
        createConfig(
          "__PETERS_HERO_IMAGE__",
          1100,
          [480, 840],
          "(min-width: 48rem) 50vw, 100vw",
          petersHero,
          "constrained",
          "Neat domestic tiling and plumbing in a modern residence",
          "lazy",
          "low",
          "image-skeleton w-full h-full object-cover",
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
      return petersHero;
    default:
      return null;
  }
}
