import greenfieldHero from '../assets/demo-images/greenfield-landscaping/hero.webp';
import greenfieldPatioSteps from '../assets/demo-images/greenfield-landscaping/patio-steps.webp';
import greenfieldRyegrass from '../assets/demo-images/greenfield-landscaping/ryegrass.webp';
import greenfieldCedarFencing from '../assets/demo-images/greenfield-landscaping/cedar-fencing.webp';
import northShoreHero from '../assets/demo-images/north-shore-fitness/hero.webp';
import petersHero from '../assets/demo-images/alder-and-pipe-plumbing/hero.webp';
import { responsiveImageAttrs } from './responsiveImage';

type DemoImageConfig = {
  sourceToken: string;
  image: ImageMetadata;
  width: number;
  widths: number[];
  sizes: string;
};

function createConfig(
  src: string,
  baseWidth: number,
  variantWidths: number[],
  sizes: string,
  image: ImageMetadata
): DemoImageConfig {
  return {
    sourceToken: responsiveImageAttrs({ src, baseWidth, variantWidths, sizes }),
    image,
    width: baseWidth,
    widths: variantWidths,
    sizes,
  };
}

export function getDemoSsrImageConfig(slug: string): DemoImageConfig[] {
  switch (slug) {
    case 'greenfield-landscaping':
      return [
        createConfig('/demo-images/greenfield-landscaping/hero.webp', 1400, [480, 960], '100vw', greenfieldHero),
        createConfig(
          '/demo-images/greenfield-landscaping/patio-steps.webp',
          900,
          [320, 560],
          '(min-width: 64rem) 18rem, (min-width: 40rem) 50vw, 100vw',
          greenfieldPatioSteps
        ),
        createConfig(
          '/demo-images/greenfield-landscaping/ryegrass.webp',
          900,
          [320, 560],
          '(min-width: 64rem) 18rem, (min-width: 40rem) 50vw, 100vw',
          greenfieldRyegrass
        ),
        createConfig(
          '/demo-images/greenfield-landscaping/cedar-fencing.webp',
          900,
          [320, 560],
          '(min-width: 64rem) 18rem, (min-width: 40rem) 50vw, 100vw',
          greenfieldCedarFencing
        ),
      ];
    case 'north-shore-fitness':
      return [createConfig('/demo-images/north-shore-fitness/hero.webp', 1400, [480, 960], '100vw', northShoreHero)];
    case 'alder-and-pipe-plumbing':
      return [
        createConfig(
          '/demo-images/alder-and-pipe-plumbing/hero.webp',
          1100,
          [480, 840],
          '(min-width: 48rem) 50vw, 100vw',
          petersHero
        ),
      ];
    default:
      return [];
  }
}
