type ResponsiveImageConfig = {
  src: string;
  baseWidth: number;
  variantWidths: number[];
  sizes: string;
};

function withWidthSuffix(src: string, width: number): string {
  return src.replace(/(\.[a-z0-9]+)$/i, `-${width}$1`);
}

export function responsiveImageAttrs(config: ResponsiveImageConfig): string {
  const srcset = [
    ...config.variantWidths.map((width) => `${withWidthSuffix(config.src, width)} ${width}w`),
    `${config.src} ${config.baseWidth}w`,
  ].join(', ');

  return `src="${config.src}" srcset="${srcset}" sizes="${config.sizes}"`;
}
