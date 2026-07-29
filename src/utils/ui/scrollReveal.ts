/**
 * Scroll-triggered reveal animations using Intersection Observer.
 * Add `data-reveal` to any element; optional `data-reveal-delay="100"` (ms).
 */

const REVEAL_SELECTOR = "[data-reveal]";
const revealTimers = new WeakMap<HTMLElement, number>();
const initializedElements = new WeakSet<HTMLElement>();
let revealObserver: IntersectionObserver | null = null;
let lateRevealObserver: IntersectionObserver | null = null;
let hideObserver: IntersectionObserver | null = null;

function clearRevealTimer(element: HTMLElement): void {
  const activeTimer = revealTimers.get(element);
  if (!activeTimer) {
    return;
  }

  window.clearTimeout(activeTimer);
  revealTimers.delete(element);
}

function ensureObservers(): void {
  if (revealObserver && lateRevealObserver && hideObserver) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobileViewport = window.matchMedia("(max-width: 47.99rem)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const useMobileTiming = !prefersReducedMotion && (isMobileViewport || isCoarsePointer);
  const observerOptions = useMobileTiming
    ? { threshold: 0.08, rootMargin: "-12% 0px -8% 0px" }
    : { threshold: 0.12, rootMargin: "0px 0px -10% 0px" };
  const lateObserverOptions = useMobileTiming
    ? { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    : { threshold: 0.12, rootMargin: "0px 0px -6% 0px" };

  const buildRevealObserver = (options: IntersectionObserverInit) =>
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;

        if (!entry.isIntersecting) {
          clearRevealTimer(el);
          return;
        }

        const requestedDelay = Number(el.dataset.revealDelay || 0);
        const delay = useMobileTiming ? Math.min(requestedDelay, 150) : requestedDelay;

        if (delay > 0) {
          clearRevealTimer(el);

          const timerId = window.setTimeout(() => {
            el.classList.add("is-revealed");
            revealTimers.delete(el);
          }, delay);

          revealTimers.set(el, timerId);
          return;
        }

        el.classList.add("is-revealed");
      });
    }, options);

  revealObserver = buildRevealObserver(observerOptions);
  lateRevealObserver = buildRevealObserver(lateObserverOptions);

  hideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target as HTMLElement;

      if (entry.isIntersecting) {
        return;
      }

      clearRevealTimer(el);
      el.classList.remove("is-revealed");
    });
  });
}

export function initScrollReveal(root: ParentNode = document): void {
  const elements = root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  ensureObservers();

  elements.forEach((el) => {
    if (initializedElements.has(el)) {
      return;
    }

    initializedElements.add(el);
    const observer = el.dataset.revealPosition === "late" ? lateRevealObserver : revealObserver;
    observer?.observe(el);
    hideObserver?.observe(el);
  });
}
