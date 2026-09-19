import type { Page } from "@playwright/test";

export function collectCspMessages(page: Page): string[] {
  const messages: string[] = [];

  page.on("console", (message) => {
    const text = message.text();
    if (text.includes("Content Security Policy") || text.includes("Refused to")) {
      messages.push(text);
    }
  });

  page.on("pageerror", (error) => {
    const text = error.message;
    if (text.includes("Content Security Policy") || text.includes("Refused to")) {
      messages.push(text);
    }
  });

  return messages;
}

export async function disableMotionForSnapshots(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    `,
  });
}

export async function primeLazyContent(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");

  const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = page.viewportSize()?.height ?? 800;

  for (let offset = 0; offset < documentHeight; offset += Math.max(240, viewportHeight - 120)) {
    await page.evaluate((nextOffset) => {
      window.scrollTo({ top: nextOffset, behavior: "auto" });
    }, offset);
    await page.waitForTimeout(40);
  }

  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  });
  await page.waitForTimeout(80);
}
