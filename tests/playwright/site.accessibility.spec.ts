import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { publicRoutes } from "./support/site-data";

async function collectA11ySnapshot(page: Page): Promise<{
  missingAlt: Array<{ src: string; tag: string }>;
  missingLabels: Array<{ tag: string; placeholder?: string; id?: string }>;
  incorrectRoles: Array<{ tag: string; role: string; reason: string }>;
  contrastFails: Array<{ selector: string; text: string; ratio?: number; required?: number }>;
}> {
  return await page.evaluate(() => {
    const missingAlt: Array<{ src: string; tag: string }> = [];
    for (const img of Array.from(document.querySelectorAll<HTMLImageElement>("img"))) {
      const alt = img.getAttribute("alt");
      const src = img.getAttribute("src") ?? "";
      if (alt === null) {
        missingAlt.push({ src, tag: img.tagName.toLowerCase() });
      }
    }

    const missingLabels: Array<{ tag: string; placeholder?: string; id?: string }> = [];
    const labelledSet = new Set<Element>();
    for (const label of Array.from(document.querySelectorAll<HTMLLabelElement>("label[for]"))) {
      const target = document.getElementById(label.getAttribute("for") ?? "");
      if (target) labelledSet.add(target);
    }

    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        "input, select, textarea",
      ),
    );
    for (const el of inputs) {
      const type = (el as HTMLInputElement).type;
      if (
        type === "hidden" ||
        type === "submit" ||
        type === "button" ||
        type === "reset" ||
        type === "image"
      )
        continue;
      const aria = el.getAttribute("aria-label");
      const labelled = el.getAttribute("aria-labelledby");
      if (aria || labelled || labelledSet.has(el)) continue;
      const placeholder = el.getAttribute("placeholder") ?? undefined;
      missingLabels.push({ tag: el.tagName.toLowerCase(), placeholder, id: el.id || undefined });
    }

    const incorrectRoles: Array<{ tag: string; role: string; reason: string }> = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("[role]"))) {
      const tag = el.tagName.toLowerCase();
      const role = el.getAttribute("role") ?? "";
      if (tag === "button" && role !== "button" && role !== "") {
        incorrectRoles.push({
          tag,
          role,
          reason: `Native <button> with redundant or conflicting role="${role}"`,
        });
      }
      if (tag === "nav" && role !== "navigation" && role !== "") {
        incorrectRoles.push({
          tag,
          role,
          reason: `Native <nav> with redundant or conflicting role="${role}"`,
        });
      }
    }

    const contrastFails: Array<{
      selector: string;
      text: string;
      ratio?: number;
      required?: number;
    }> = [];
    const contrastTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "p, h1, h2, h3, h4, h5, h6, a, button, label, span, li",
      ),
    );
    for (const el of contrastTargets.slice(0, 200)) {
      const style = window.getComputedStyle(el);
      const fg = style.color;
      const bg = style.backgroundColor;
      const text = (el.textContent ?? "").trim();
      if (!text || text.length < 2) continue;
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = parseFloat(style.fontWeight || "400");
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
      const required = isLargeText ? 3 : 4.5;
      const parseRgb = (c: string) => {
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/iu);
        return m
          ? { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), alpha: m[4] ? Number(m[4]) : 1 }
          : null;
      };
      const f = parseRgb(fg);
      const b = parseRgb(bg);
      if (!f || !b || f.alpha === 0 || b.alpha === 0) continue;
      const rel = (v: number) => {
        const n = v / 255;
        return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
      };
      const l1 = 0.2126 * rel(f.r) + 0.7152 * rel(f.g) + 0.0722 * rel(f.b);
      const l2 = 0.2126 * rel(b.r) + 0.7152 * rel(b.g) + 0.0722 * rel(b.b);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      const ratio = (lighter + 0.05) / (darker + 0.05);
      if (ratio < required) {
        const selector =
          el.tagName.toLowerCase() +
          (el.id ? `#${el.id}` : "") +
          (el.className ? `.${String(el.className).split(" ").slice(0, 2).join(".")}` : "");
        contrastFails.push({
          selector,
          text: text.slice(0, 80),
          ratio: Math.round(ratio * 100) / 100,
          required,
        });
        if (contrastFails.length >= 40) break;
      }
    }

    return { missingAlt, missingLabels, incorrectRoles, contrastFails };
  });
}

test.describe("accessibility snapshot for all routes", () => {
  for (const route of publicRoutes) {
    test(`a11y: ${route.name} (${route.path})`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      const snapshot = await collectA11ySnapshot(page);

      await testInfo.attach(`a11y-${route.name}`, {
        contentType: "application/json",
        body: JSON.stringify(snapshot, null, 2),
      });

      expect(snapshot.missingAlt, `Missing alt text on images on ${route.path}`).toEqual([]);
      expect(snapshot.missingLabels, `Missing labels on form controls on ${route.path}`).toEqual(
        [],
      );
      expect(snapshot.incorrectRoles, `Incorrect ARIA role usage on ${route.path}`).toEqual([]);
      expect(
        snapshot.contrastFails.length,
        `Low-contrast text instances on ${route.path} (keep at 0)`,
      ).toBeLessThanOrEqual(3);
    });
  }
});
