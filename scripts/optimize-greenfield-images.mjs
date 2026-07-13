import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const imageDir = path.resolve('src/assets/demo-images/greenfield-landscaping');

const configs = {
  'hero.webp': { maxWidth: 1600, quality: 82 },
  'patio-steps.webp': { maxWidth: 1200, quality: 80 },
  'ryegrass.webp': { maxWidth: 1200, quality: 80 },
  'cedar-fencing.webp': { maxWidth: 1200, quality: 80 },
};

for (const [filename, config] of Object.entries(configs)) {
  const filePath = path.join(imageDir, filename);

  try {
    const input = sharp(filePath);
    const before = (await input.metadata()).size ?? 0;

    const buffer = await input
      .rotate()
      .resize({ width: config.maxWidth, withoutEnlargement: true })
      .webp({ quality: config.quality, effort: 4 })
      .toBuffer();

    await writeFile(filePath, buffer);
    console.log(`${filename}: ${Math.round(before / 1024)}KB -> ${Math.round(buffer.length / 1024)}KB`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`${filename}: skipped (${message})`);
  }
}
