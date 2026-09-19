import { demoRegistry, isDemoSlug } from "./demoMarkup";
import { initMediaSkeletons } from "@utils/media";

let initialized = false;

export default function initDemoPage() {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  const root = document.querySelector("[data-demo-root]");
  const slug = root?.getAttribute("data-demo-slug");
  if (!root || !slug || !isDemoSlug(slug)) return;
  demoRegistry[slug].init?.(root);
  initMediaSkeletons(root);
}
