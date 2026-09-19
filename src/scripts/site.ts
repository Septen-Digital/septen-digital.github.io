import type { LegalTab } from "@shared-types/legal";
import { initScrollReveal } from "@utils/ui";
import { initMediaSkeletons } from "@utils/media";

let initialized = false;
const legalTabs = new Set<LegalTab>(["terms", "privacy", "cookies", "data-rights", "disclaimer"]);
// Modal modules are loaded on demand so the default page path stays lean, but
// we still keep warm promises around once a user shows intent to open one.
let enquiryModalModulePromise: Promise<typeof import("@components/modals/EnquiryModal")> | null =
  null;
let legalModalModulePromise: Promise<typeof import("@components/modals/LegalModal")> | null = null;
const warmedOrigins = new Set<string>();

function loadEnquiryModal() {
  enquiryModalModulePromise ??= import("@components/modals/EnquiryModal");
  return enquiryModalModulePromise;
}

function loadLegalModal() {
  legalModalModulePromise ??= import("@components/modals/LegalModal");
  return legalModalModulePromise;
}

function warmOrigin(url: string): void {
  if (typeof document === "undefined" || warmedOrigins.has(url)) {
    return;
  }

  warmedOrigins.add(url);

  const preconnect = document.createElement("link");
  preconnect.rel = "preconnect";
  preconnect.href = url;
  preconnect.crossOrigin = "";
  document.head.append(preconnect);

  const dnsPrefetch = document.createElement("link");
  dnsPrefetch.rel = "dns-prefetch";
  dnsPrefetch.href = url.replace(/^https?:/, "");
  document.head.append(dnsPrefetch);
}

function initMobileMenu(): void {
  const menu = document.querySelector<HTMLDetailsElement>("[data-mobile-menu]");
  const toggle = menu?.querySelector<HTMLElement>("[data-mobile-menu-toggle]");
  const panel = menu?.querySelector<HTMLElement>("[data-mobile-menu-panel]");
  const panelInner = menu?.querySelector<HTMLElement>("[data-mobile-menu-panel-inner]");

  if (!toggle || !menu || !panel || !panelInner) {
    return;
  }

  const desktopMenu = window.matchMedia("(min-width: 48rem)");
  let restoreFocusTarget: HTMLElement | null = null;

  const isOpen = () => menu.open;

  panel.setAttribute("aria-hidden", String(!isOpen()));
  if (!isOpen()) {
    panel.setAttribute("inert", "");
  }

  const getFocusableElements = (): HTMLElement[] =>
    Array.from(
      panelInner.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(
      (element) =>
        !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true",
    );

  const syncMenuState = (open: boolean, restoreFocus = true): void => {
    // The menu is progressively enhanced from native <details>, then upgraded
    // with inert/focus management so it behaves like a lightweight dialog.
    menu.open = open;
    menu.dataset.state = open ? "open" : "closed";
    panel.setAttribute("aria-hidden", String(!open));

    if (open) {
      restoreFocusTarget =
        document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
      panel.removeAttribute("inert");

      window.setTimeout(() => {
        getFocusableElements()[0]?.focus();
      }, 0);

      return;
    }

    panel.setAttribute("inert", "");
    menu.open = false;

    if (restoreFocus) {
      (restoreFocusTarget?.isConnected ? restoreFocusTarget : toggle).focus();
    }
  };

  menu.addEventListener("toggle", () => {
    syncMenuState(menu.open, false);
  });

  panel.addEventListener("click", (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    const shouldClose = target.closest("a[href], button[data-open-enquiry], button[type='button']");
    if (!shouldClose) {
      return;
    }

    syncMenuState(false, false);
  });

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (!isOpen()) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      syncMenuState(false);
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      panelInner.focus();
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

  desktopMenu.addEventListener("change", handleDesktopChange);
}

function initDemoPageControls(): void {
  const demoPage = document.querySelector<HTMLElement>("[data-demo-page]");
  const backToTopButton = document.querySelector<HTMLButtonElement>("[data-demo-back-to-top]");
  const chromeControl = document.querySelector<HTMLElement>("[data-demo-chrome-control]");
  const demoFooter = demoPage?.querySelector<HTMLElement>("footer") ?? null;
  const footer = document.querySelector<HTMLElement>("[data-site-footer]");
  if (!demoPage || !backToTopButton) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const showThreshold = 280;
  let syncFrame = 0;
  let restingBottom = 0;
  let buttonHeight = 0;

  const syncBackToTopMeasurements = (): void => {
    restingBottom = parseFloat(getComputedStyle(backToTopButton).bottom) || 0;
    buttonHeight = backToTopButton.offsetHeight;
  };

  const syncBackToTop = (): void => {
    const chromeHidden = document.documentElement.classList.contains("demo-chrome-hidden");
    const documentElement = document.documentElement;
    const maxScrollY = Math.max(documentElement.scrollHeight - window.innerHeight, 0);
    const actualScrollY = window.scrollY;
    const clampedScrollY = Math.min(Math.max(actualScrollY, 0), maxScrollY);
    const isVisible = window.scrollY > showThreshold;
    backToTopButton.classList.toggle("opacity-0", !isVisible);
    backToTopButton.classList.toggle("pointer-events-none", !isVisible);
    backToTopButton.classList.toggle("opacity-100", isVisible);
    backToTopButton.classList.toggle("pointer-events-auto", isVisible);
    backToTopButton.setAttribute("aria-hidden", String(!isVisible));
    backToTopButton.tabIndex = isVisible ? 0 : -1;
    backToTopButton.disabled = !isVisible;

    if (chromeHidden) {
      backToTopButton.style.bottom = `${restingBottom}px`;
      chromeControl?.style.setProperty("bottom", `${restingBottom}px`);
      return;
    }

    const stopTarget = demoFooter ?? footer;
    if (!stopTarget) {
      backToTopButton.style.bottom = `${restingBottom}px`;
      chromeControl?.style.setProperty("bottom", `${restingBottom}px`);
      return;
    }

    const stopRect = stopTarget.getBoundingClientRect();
    const stopTopInDocument = stopRect.top + actualScrollY;
    const virtualStopTop = stopTopInDocument - clampedScrollY;
    const stopCenter = virtualStopTop + stopRect.height / 2;
    const desiredBottom = window.innerHeight - stopCenter - buttonHeight / 2;

    // Keep the button at its resting inset until the demo footer center reaches it,
    // then raise the button by increasing its bottom position.
    const bottom = `${Math.max(restingBottom, desiredBottom)}px`;
    backToTopButton.style.bottom = bottom;
    chromeControl?.style.setProperty("bottom", bottom);
  };

  const scheduleBackToTopSync = (): void => {
    if (syncFrame) {
      return;
    }

    syncFrame = window.requestAnimationFrame(() => {
      syncFrame = 0;
      syncBackToTop();
    });
  };

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  syncBackToTopMeasurements();
  scheduleBackToTopSync();
  window.addEventListener("scroll", scheduleBackToTopSync, { passive: true });
  window.addEventListener("resize", () => {
    syncBackToTopMeasurements();
    scheduleBackToTopSync();
  });
}

export default function initSite() {
  if (initialized || typeof document === "undefined") {
    return;
  }

  initialized = true;
  document.documentElement.classList.add("site-ready");
  document.dispatchEvent(new CustomEvent("septen:site-ready"));

  initScrollReveal(document);
  initMediaSkeletons(document);
  initMobileMenu();
  initDemoPageControls();

  // Preload modal code on hover/focus intent instead of at first click, which
  // keeps interaction feeling instant without eagerly downloading everything.
  document.addEventListener(
    "pointerover",
    (event: Event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) {
        return;
      }

      if (target.closest("[data-open-enquiry], [data-open-enquiry-mobile]")) {
        warmOrigin("https://challenges.cloudflare.com");
        void loadEnquiryModal();
        return;
      }

      if (target.closest("[data-open-legal]")) {
        void loadLegalModal();
      }
    },
    { passive: true },
  );

  document.addEventListener("focusin", (event: FocusEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    if (target.closest("[data-open-enquiry], [data-open-enquiry-mobile]")) {
      warmOrigin("https://challenges.cloudflare.com");
      void loadEnquiryModal();
      return;
    }

    if (target.closest("[data-open-legal]")) {
      void loadLegalModal();
    }
  });

  document.addEventListener("click", async (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    const enquiryTrigger = target.closest<HTMLElement>(
      "[data-open-enquiry], [data-open-enquiry-mobile]",
    );
    if (enquiryTrigger) {
      event.preventDefault();
      const { openEnquiryModal } = await loadEnquiryModal();
      openEnquiryModal(enquiryTrigger.getAttribute("data-enquiry-plan"));
      return;
    }

    const legalTrigger = target.closest<HTMLElement>("[data-open-legal]");
    if (legalTrigger) {
      event.preventDefault();
      const legalTab = legalTrigger.getAttribute("data-open-legal");
      const { openLegalModal } = await loadLegalModal();
      openLegalModal(
        legalTab && legalTabs.has(legalTab as LegalTab) ? (legalTab as LegalTab) : "terms",
      );
      return;
    }
  });
}
