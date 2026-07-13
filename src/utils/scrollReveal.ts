/**
 * Scroll-triggered reveal animations using Intersection Observer.
 * Add `data-reveal` to any element; optional `data-reveal-delay="100"` (ms).
 */

const REVEAL_SELECTOR = '[data-reveal]';
const revealTimers = new WeakMap<HTMLElement, number>();
const initializedElements = new WeakSet<HTMLElement>();
let revealObserver: IntersectionObserver | null = null;
let resizeListenerBound = false;
let observerProfile = '';

function clearRevealTimer(element: HTMLElement): void {
  const activeTimer = revealTimers.get(element);
  if (!activeTimer) {
    return;
  }

  window.clearTimeout(activeTimer);
  revealTimers.delete(element);
}

function useMobileTiming(): boolean {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return false;
  }

  const isMobileViewport = window.matchMedia('(max-width: 47.99rem)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  return isMobileViewport || isCoarsePointer;
}

function getObserverProfile(): string {
  const isShortViewport = window.innerHeight < 560;
  const mobileTiming = useMobileTiming();

  if (isShortViewport) {
    return 'short';
  }

  return mobileTiming ? 'mobile' : 'desktop';
}

function getObserverOptions(): IntersectionObserverInit {
  const profile = getObserverProfile();

  if (profile === 'short') {
    return { threshold: 0.01, rootMargin: '0px' };
  }

  if (profile === 'mobile') {
    return { threshold: 0.05, rootMargin: '0px 0px -4% 0px' };
  }

  return { threshold: 0.12, rootMargin: '0px 0px -10% 0px' };
}

function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
}

function scheduleReveal(element: HTMLElement): void {
  if (element.classList.contains('is-revealed')) {
    return;
  }

  const requestedDelay = Number(element.dataset.revealDelay || 0);
  const delay = useMobileTiming() ? Math.min(requestedDelay, 150) : requestedDelay;

  if (delay > 0) {
    clearRevealTimer(element);

    const timerId = window.setTimeout(() => {
      element.classList.add('is-revealed');
      revealTimers.delete(element);
    }, delay);

    revealTimers.set(element, timerId);
    return;
  }

  element.classList.add('is-revealed');
}

function revealVisibleElements(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
    if (isInViewport(element)) {
      scheduleReveal(element);
    }
  });
}

function disconnectObservers(): void {
  revealObserver?.disconnect();
  revealObserver = null;
}

function ensureObservers(): void {
  const nextProfile = getObserverProfile();
  if (revealObserver && observerProfile === nextProfile) {
    return;
  }

  disconnectObservers();
  observerProfile = nextProfile;

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target as HTMLElement;

      if (!entry.isIntersecting) {
        clearRevealTimer(element);
        return;
      }

      scheduleReveal(element);
    });
  }, getObserverOptions());
}

function bindResizeListener(): void {
  if (resizeListenerBound) {
    return;
  }

  resizeListenerBound = true;

  let resizeTimer = 0;
  window.addEventListener(
    'resize',
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ensureObservers();
        revealVisibleElements();

        document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
          if (initializedElements.has(element)) {
            revealObserver?.observe(element);
          }
        });
      }, 120);
    },
    { passive: true }
  );
}

export function initScrollReveal(root: ParentNode = document): void {
  const elements = root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-revealed'));
    return;
  }

  bindResizeListener();
  ensureObservers();
  revealVisibleElements(root);

  elements.forEach((element) => {
    if (initializedElements.has(element)) {
      return;
    }

    initializedElements.add(element);
    revealObserver?.observe(element);
  });
}
