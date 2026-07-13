type LegalTab = 'terms' | 'privacy' | 'cookies' | 'data-rights' | 'disclaimer';
import { initScrollReveal } from '../utils/scrollReveal';
import { initMediaSkeletons } from '../utils/media';

let initialized = false;
const legalTabs = new Set<LegalTab>(['terms', 'privacy', 'cookies', 'data-rights', 'disclaimer']);
let enquiryModalModulePromise: Promise<typeof import('../components/EnquiryModal')> | null = null;
let legalModalModulePromise: Promise<typeof import('../components/LegalModal')> | null = null;
let cookieConsentModulePromise: Promise<typeof import('../components/CookieConsent')> | null = null;
const warmedOrigins = new Set<string>();

function loadEnquiryModal() {
  enquiryModalModulePromise ??= import('../components/EnquiryModal');
  return enquiryModalModulePromise;
}

function loadLegalModal() {
  legalModalModulePromise ??= import('../components/LegalModal');
  return legalModalModulePromise;
}

function loadCookieConsent() {
  cookieConsentModulePromise ??= import('../components/CookieConsent');
  return cookieConsentModulePromise;
}

function warmOrigin(url: string): void {
  if (typeof document === 'undefined' || warmedOrigins.has(url)) {
    return;
  }

  warmedOrigins.add(url);

  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = url;
  preconnect.crossOrigin = '';
  document.head.append(preconnect);

  const dnsPrefetch = document.createElement('link');
  dnsPrefetch.rel = 'dns-prefetch';
  dnsPrefetch.href = url.replace(/^https?:/, '');
  document.head.append(dnsPrefetch);
}

function scheduleNonCriticalTask(task: () => void): void {
  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: () => void) => number;
  };

  if (typeof idleWindow.requestIdleCallback === 'function') {
    idleWindow.requestIdleCallback(task);
    return;
  }

  window.setTimeout(task, 200);
}

function initHeaderMetrics(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) {
    return;
  }

  const syncHeaderHeight = (): void => {
    document.documentElement.style.setProperty('--site-header-height', `${header.getBoundingClientRect().height}px`);
  };

  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight, { passive: true });
}

function getDemoReturnTargetId(): string | null {
  if (window.location.pathname !== '/') {
    return null;
  }

  const storedSlug = window.sessionStorage.getItem('septen-return-demo');
  if (storedSlug) {
    window.sessionStorage.removeItem('septen-return-demo');
    return `demo-${storedSlug}`;
  }

  const { hash } = window.location;
  if (!hash.startsWith('#demo-')) {
    return null;
  }

  return hash.slice(1);
}

function restoreDemoReturnPosition(): void {
  const targetId = getDemoReturnTargetId();
  if (!targetId) {
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobileViewport = window.matchMedia('(max-width: 47.99rem)').matches;
  const useInstantScroll = prefersReducedMotion || isMobileViewport;
  let lastScrollTop = -1;

  const scrollToTarget = (): boolean => {
    const headerHeightValue = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')
    );
    const stickyOffset = Number.isFinite(headerHeightValue) ? headerHeightValue : 64;
    const top = target.getBoundingClientRect().top + window.scrollY - stickyOffset - 88;
    const nextTop = Math.max(top, 0);

    if (Math.abs(nextTop - lastScrollTop) < 1) {
      return true;
    }

    lastScrollTop = nextTop;
    window.scrollTo({
      top: nextTop,
      behavior: useInstantScroll ? 'auto' : 'smooth',
    });

    return false;
  };

  const runRestorePass = (): void => {
    if (scrollToTarget()) {
      return;
    }

    window.requestAnimationFrame(() => {
      if (scrollToTarget()) {
        return;
      }

      [140, 320, 650].forEach((delay) => {
        window.setTimeout(() => {
          scrollToTarget();
        }, delay);
      });
    });
  };

  runRestorePass();
}

function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-mobile-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const panel = menu?.querySelector<HTMLElement>('[data-mobile-menu-panel]');

  if (!toggle || !menu || !panel) {
    return;
  }

  const desktopMenu = window.matchMedia('(min-width: 48rem)');
  let restoreFocusTarget: HTMLElement | null = null;

  const isOpen = () => menu.dataset.state === 'open';

  menu.setAttribute('aria-hidden', String(!isOpen()));
  if (!isOpen()) {
    menu.setAttribute('inert', '');
  }

  const getFocusableElements = (): HTMLElement[] =>
    Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(
      (element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true'
    );

  const syncMenuState = (open: boolean, restoreFocus = true): void => {
    if (isOpen() === open) {
      return;
    }

    toggle.setAttribute('aria-expanded', String(open));
    menu.dataset.state = open ? 'open' : 'closed';
    menu.setAttribute('aria-hidden', String(!open));

    if (open) {
      restoreFocusTarget = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
      menu.removeAttribute('inert');

      window.setTimeout(() => {
        getFocusableElements()[0]?.focus();
      }, 0);

      return;
    }

    menu.setAttribute('inert', '');

    if (restoreFocus) {
      (restoreFocusTarget?.isConnected ? restoreFocusTarget : toggle).focus();
    }
  };

  toggle.addEventListener('click', () => {
    syncMenuState(!isOpen());
  });

  menu.addEventListener('click', (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    const shouldClose = target.closest('a[href], button[data-open-enquiry]');
    if (!shouldClose) {
      return;
    }

    syncMenuState(false, false);
  });

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!isOpen()) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      syncMenuState(false);
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  const handleDesktopChange = (event: MediaQueryListEvent): void => {
    if (event.matches) {
      syncMenuState(false, false);
    }
  };

  if (desktopMenu.matches) {
    syncMenuState(false, false);
  }

  desktopMenu.addEventListener('change', handleDesktopChange);
}

function initDemoPageControls(): void {
  const demoPage = document.querySelector<HTMLElement>('[data-demo-page]');
  const backToTopButton = document.querySelector<HTMLButtonElement>('[data-demo-back-to-top]');
  const backToSeptenButton = document.querySelector<HTMLAnchorElement>('[data-demo-sticky-back]');
  if (!demoPage || !backToTopButton) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const showThreshold = 280;

  const syncBackToTopVisibility = (): void => {
    const isVisible = window.scrollY > showThreshold;

    backToTopButton.classList.toggle('opacity-0', !isVisible);
    backToTopButton.classList.toggle('translate-y-2', !isVisible);
    backToTopButton.classList.toggle('pointer-events-none', !isVisible);
    backToTopButton.classList.toggle('opacity-100', isVisible);
    backToTopButton.classList.toggle('translate-y-0', isVisible);
    backToTopButton.classList.toggle('pointer-events-auto', isVisible);
    backToTopButton.setAttribute('aria-hidden', String(!isVisible));
  };

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  });

  backToSeptenButton?.addEventListener('click', () => {
    const returnSlug = backToSeptenButton.getAttribute('data-demo-return-slug');
    if (!returnSlug) {
      return;
    }

    window.sessionStorage.setItem('septen-return-demo', returnSlug);
  });

  syncBackToTopVisibility();
  window.addEventListener('scroll', syncBackToTopVisibility, { passive: true });
}

export default function initSite() {
  if (initialized || typeof document === 'undefined') {
    return;
  }

  initialized = true;

  initHeaderMetrics();
  restoreDemoReturnPosition();
  initScrollReveal(document);
  initMediaSkeletons(document);
  initMobileMenu();
  initDemoPageControls();

  scheduleNonCriticalTask(() => {
    void loadCookieConsent().then(({ initCookieConsent }) => {
      initCookieConsent();
    });
  });

  document.addEventListener(
    'pointerover',
    (event: Event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) {
        return;
      }

      if (target.closest('[data-open-enquiry]')) {
        warmOrigin('https://challenges.cloudflare.com');
        void loadEnquiryModal();
        return;
      }

      if (target.closest('[data-open-legal]')) {
        void loadLegalModal();
      }
    },
    { passive: true }
  );

  document.addEventListener('focusin', (event: FocusEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    if (target.closest('[data-open-enquiry]')) {
      warmOrigin('https://challenges.cloudflare.com');
      void loadEnquiryModal();
      return;
    }

    if (target.closest('[data-open-legal]')) {
      void loadLegalModal();
    }
  });

  document.addEventListener('click', async (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    const enquiryTrigger = target.closest<HTMLElement>('[data-open-enquiry]');
    if (enquiryTrigger) {
      event.preventDefault();
      const { openEnquiryModal } = await loadEnquiryModal();
      openEnquiryModal(enquiryTrigger.getAttribute('data-enquiry-plan'));
      return;
    }

    const legalTrigger = target.closest<HTMLElement>('[data-open-legal]');
    if (legalTrigger) {
      event.preventDefault();
      const legalTab = legalTrigger.getAttribute('data-open-legal');
      const { openLegalModal } = await loadLegalModal();
      openLegalModal(legalTab && legalTabs.has(legalTab as LegalTab) ? (legalTab as LegalTab) : 'terms');
    }
  });
}
