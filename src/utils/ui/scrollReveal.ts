const SCROLL_REVEAL_ENABLED = true;

const REVEAL_SELECTOR = "[data-reveal]";
const REVEAL_ROOT_CLASS = "reveals-enabled";
const revealTimers = new WeakMap<HTMLElement, number>();
const revealStates = new WeakMap<HTMLElement, "hidden" | "pending" | "visible">();
const observedElements = new WeakSet<HTMLElement>();
let observer: IntersectionObserver | null = null;

function computeUseMobileTiming(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const isMobileViewport = window.matchMedia("(max-width: 47.99rem)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  return isMobileViewport || isCoarsePointer;
}

function computeDelay(el: HTMLElement): number {
  const requestedDelay = Number(el.dataset.revealDelay || 0);
  return computeUseMobileTiming() ? Math.min(requestedDelay, 150) : requestedDelay;
}

function clearRevealTimer(element: HTMLElement): void {
  const activeTimer = revealTimers.get(element);
  if (!activeTimer) {
    return;
  }

  window.clearTimeout(activeTimer);
  revealTimers.delete(element);
}

function revealElement(el: HTMLElement, delay = 0): void {
  if (revealStates.get(el) === "visible" || revealStates.get(el) === "pending") {
    return;
  }

  clearRevealTimer(el);
  revealStates.set(el, delay > 0 ? "pending" : "visible");

  if (delay <= 0) {
    el.classList.add("is-revealed");
    return;
  }

  const timerId = window.setTimeout(() => {
    el.classList.add("is-revealed");
    revealStates.set(el, "visible");
    revealTimers.delete(el);
  }, delay);

  revealTimers.set(el, timerId);
}

function resetElement(el: HTMLElement): void {
  if (revealStates.get(el) === "hidden") {
    return;
  }

  clearRevealTimer(el);
  el.classList.remove("is-revealed");
  revealStates.set(el, "hidden");
  void el.offsetWidth;
}

function createObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;

        if (entry.isIntersecting) {
          revealElement(el, computeDelay(el));
          return;
        }

        if (entry.intersectionRatio === 0) {
          resetElement(el);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: [0, 0.08],
    },
  );
}

export function initScrollReveal(root: ParentNode = document): void {
  const elements = root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
  if (!elements.length) return;

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!SCROLL_REVEAL_ENABLED || prefersReducedMotion) {
    elements.forEach((el) => {
      clearRevealTimer(el);
      el.classList.add("is-revealed");
      revealStates.set(el, "visible");
    });
    return;
  }

  if (!observer) {
    observer = createObserver();
  }

  if (typeof document !== "undefined") {
    document.documentElement.classList.add(REVEAL_ROOT_CLASS);
  }

  elements.forEach((el) => {
    if (observedElements.has(el)) {
      return;
    }
    observedElements.add(el);

    if (!observer) {
      revealElement(el, computeDelay(el));
      return;
    }

    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInViewport) {
      revealElement(el, computeDelay(el));
    } else {
      resetElement(el);
    }

    observer.observe(el);
  });
}
