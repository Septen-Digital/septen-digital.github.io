import { demoRegistry, isDemoSlug } from "./demoMarkup";
import { initMediaSkeletons } from "@utils/media";

let initialized = false;

export default function initDemoPage() {
  // Astro can evaluate this module more than once across navigations, so guard
  // against rebinding demo listeners on the same page.
  if (initialized || typeof document === "undefined") {
    return;
  }

  initialized = true;

  const root = document.querySelector("[data-demo-root]");
  const slug = root?.getAttribute("data-demo-slug");

  if (!root || !slug || !isDemoSlug(slug)) {
    return;
  }

  // Legacy TS demos expose an optional init hook for event listeners, while
  // shared media skeleton behavior is applied consistently to every demo page.
  demoRegistry[slug].init?.(root);
  initMediaSkeletons(root);
}
