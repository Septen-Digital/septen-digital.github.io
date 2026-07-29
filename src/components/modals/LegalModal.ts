import { legalTabContent, legalTabs, type LegalTab } from "@content/legal/legalContent";
import { getIcon } from "@utils/ui";
import { lockBodyScroll, trapFocusWithin } from "@utils/ui";

type LegalModalOptions = {
  onCloseComplete?: () => void;
  restoreFocus?: boolean;
};

export function openLegalModal(tab: LegalTab = "terms", options: LegalModalOptions = {}): void {
  document.getElementById("legal-modal-container")?.remove();

  const container = document.createElement("div");
  container.id = "legal-modal-container";
  container.className =
    "fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in";
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-modal", "true");
  container.setAttribute("aria-labelledby", "legal-modal-title");

  const tabsMarkup = legalTabs
    .map(
      (item: { id: LegalTab; label: string }) =>
        `<button type="button" data-tab="${item.id}" role="tab" aria-controls="legal-panel-${item.id}" aria-selected="false" class="shrink-0 px-4 sm:px-6 py-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 border-b-2 border-transparent hover:border-slate-300 hover:text-slate-700 transition-colors bg-transparent cursor-pointer whitespace-nowrap">${item.label}</button>`,
    )
    .join("");

  const panelsMarkup = legalTabs
    .map((item: { id: LegalTab; label: string }, index: number) => {
      const hiddenClass = index === 0 ? "" : " hidden";
      return `<div data-tab-panel="${item.id}" class="space-y-3${hiddenClass}">${legalTabContent[item.id]}</div>`;
    })
    .join("");

  container.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-4xl w-full max-h-[min(88dvh,90vh)] h-[min(88dvh,90vh)] flex flex-col min-h-0 relative overflow-hidden animate-slide-in-up" role="document">
      <button id="legal-modal-close-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-brand-teal" aria-label="Close modal">
        ${getIcon("X", "w-5 h-5 cursor-pointer")}
      </button>
      <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 shrink-0 pr-14 sm:pr-16">
        <span class="font-sans font-black text-[9px] uppercase text-brand-teal tracking-widest block mb-1">Legal</span>
        <h2 id="legal-modal-title" class="font-sans font-extrabold text-slate-900 text-xl leading-tight">Terms, Privacy, and Data Rights</h2>
      </div>
      <div class="relative shrink-0 border-b border-slate-100 legal-tab-shell" data-legal-tab-shell data-can-scroll-left="false" data-can-scroll-right="false">
        <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-1.5 legal-tab-scroll-hint legal-tab-scroll-hint-left" aria-hidden="true">
          <span class="legal-tab-scroll-icon">${getIcon("ChevronRight", "h-3.5 w-3.5 -rotate-180")}</span>
        </div>
        <div class="flex flex-nowrap overflow-x-auto overscroll-x-contain legal-tab-list" role="tablist" aria-label="Legal document tabs">
          ${tabsMarkup}
        </div>
        <div class="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-1.5 legal-tab-scroll-hint legal-tab-scroll-hint-right" aria-hidden="true">
          <span class="legal-tab-scroll-icon">${getIcon("ChevronRight", "h-3.5 w-3.5")}</span>
        </div>
      </div>
      <div id="legal-tabs-content" class="legal-modal-content flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 pb-8 sm:p-6 sm:pb-10 md:p-8 md:pb-12 text-left text-[13px] leading-relaxed text-slate-700">
        ${panelsMarkup}
      </div>
    </div>
  `;

  const triggerElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const restoreBodyScroll = lockBodyScroll();

  document.body.appendChild(container);

  const card = container.querySelector<HTMLElement>(".animate-slide-in-up");
  const closeButton = container.querySelector<HTMLButtonElement>("#legal-modal-close-btn");
  const contentRegion = container.querySelector<HTMLElement>("#legal-tabs-content");
  const tabShell = container.querySelector<HTMLElement>("[data-legal-tab-shell]");
  const tabList = container.querySelector<HTMLElement>('[role="tablist"]');
  const tabButtons = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-tab]"));
  const tabPanels = Array.from(container.querySelectorAll<HTMLElement>("[data-tab-panel]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeTabId: LegalTab = tab;
  let tabScrollFrame = 0;

  const syncTabScrollHints = (): void => {
    if (!tabList || !tabShell) {
      return;
    }

    const maxScrollLeft = Math.max(tabList.scrollWidth - tabList.clientWidth, 0);
    const scrollLeft = Math.max(tabList.scrollLeft, 0);
    const threshold = 6;
    const canScroll = maxScrollLeft > threshold;
    const canScrollLeft = canScroll && scrollLeft > threshold;
    const canScrollRight = canScroll && scrollLeft < maxScrollLeft - threshold;

    tabShell.dataset.canScrollLeft = String(canScrollLeft);
    tabShell.dataset.canScrollRight = String(canScrollRight);
  };

  const scrollTabButtonIntoView = (button: HTMLButtonElement, behavior: ScrollBehavior): void => {
    if (!tabList) {
      return;
    }

    const maxScrollLeft = tabList.scrollWidth - tabList.clientWidth;
    if (maxScrollLeft <= 0) {
      return;
    }

    const listRect = tabList.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const buttonLeft = buttonRect.left - listRect.left + tabList.scrollLeft;

    const centeredLeft = buttonLeft - (tabList.clientWidth - button.offsetWidth) / 2;
    const nextScrollLeft = Math.min(Math.max(centeredLeft, 0), maxScrollLeft);

    tabList.scrollTo({ left: nextScrollLeft, behavior });
    syncTabScrollHints();
  };

  const syncActiveTabButtonPosition = (behavior: ScrollBehavior): void => {
    const activeButton = tabButtons.find((button) => button.dataset.tab === activeTabId);
    if (!activeButton) {
      return;
    }

    if (tabScrollFrame) {
      window.cancelAnimationFrame(tabScrollFrame);
    }

    const scrollActiveButton = (): void => {
      scrollTabButtonIntoView(activeButton, behavior);
    };

    // Run after layout has settled so mobile overflow measurements are accurate.
    tabScrollFrame = window.requestAnimationFrame(() => {
      tabScrollFrame = 0;
      scrollActiveButton();
      window.requestAnimationFrame(() => {
        scrollActiveButton();
        syncTabScrollHints();
      });
    });
  };

  const focusActiveTabButton = (): void => {
    const activeButton = tabButtons.find((button) => button.dataset.tab === activeTabId);
    activeButton?.focus({ preventScroll: true });
  };

  const focusInitialModalControl = (): void => {
    closeButton?.focus({ preventScroll: true });
  };

  const setTab = (activeTab: LegalTab, behavior: ScrollBehavior = "auto"): void => {
    activeTabId = activeTab;

    tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === activeTab;
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
      button.className = isActive
        ? "shrink-0 px-4 sm:px-6 py-3 text-[11px] font-extrabold uppercase tracking-widest border-b-2 border-brand-teal text-brand-teal bg-transparent cursor-pointer whitespace-nowrap"
        : "shrink-0 px-4 sm:px-6 py-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 border-b-2 border-transparent hover:border-slate-300 hover:text-slate-700 transition-colors bg-transparent cursor-pointer whitespace-nowrap";
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.dataset.tabPanel === activeTab;
      const panelId = panel.dataset.tabPanel;
      panel.classList.toggle("hidden", !isActive);
      if (!panelId) {
        return;
      }

      panel.id = `legal-panel-${panelId}`;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", `legal-tab-${panelId}`);
    });

    contentRegion?.scrollTo({ top: 0, behavior: "auto" });
    syncActiveTabButtonPosition(behavior);
  };

  tabButtons.forEach((button) => {
    if (button.dataset.tab) {
      button.id = `legal-tab-${button.dataset.tab}`;
    }
  });

  setTab(tab);
  window.requestAnimationFrame(() => {
    focusInitialModalControl();
    syncActiveTabButtonPosition("auto");
    syncTabScrollHints();
  });

  if (document.fonts?.ready) {
    void document.fonts.ready.then(() => {
      syncActiveTabButtonPosition("auto");
      syncTabScrollHints();
    });
  }

  const handleResize = (): void => {
    syncActiveTabButtonPosition("auto");
    syncTabScrollHints();
  };

  window.addEventListener("resize", handleResize, { passive: true });
  tabList?.addEventListener("scroll", syncTabScrollHints, { passive: true });

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTab = button.dataset.tab as LegalTab | undefined;
      if (nextTab) {
        setTab(nextTab, prefersReducedMotion ? "auto" : "smooth");
        focusActiveTabButton();
      }
    });
  });

  const closeModal = (): void => {
    container.classList.remove("animate-fade-in");
    container.classList.add("animate-fade-out");
    card?.classList.remove("animate-slide-in-up");
    card?.classList.add("animate-slide-out-down");
    if (options.restoreFocus !== false) {
      triggerElement?.focus();
    }

    window.setTimeout(() => {
      restoreBodyScroll();
      if (tabScrollFrame) {
        window.cancelAnimationFrame(tabScrollFrame);
      }
      window.removeEventListener("resize", handleResize);
      tabList?.removeEventListener("scroll", syncTabScrollHints);
      container.remove();
      options.onCloseComplete?.();
    }, 300);
  };

  closeButton?.addEventListener("click", closeModal);

  let mousedownOnBackdrop = false;
  container.addEventListener("mousedown", (event: MouseEvent) => {
    mousedownOnBackdrop = event.target === container;
  });
  container.addEventListener("click", (event: MouseEvent) => {
    if (event.target === container && mousedownOnBackdrop) {
      closeModal();
    }
  });

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const currentIndex = tabButtons.findIndex((button) => button === document.activeElement);
      if (currentIndex >= 0) {
        const offset = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (currentIndex + offset + tabButtons.length) % tabButtons.length;
        const nextButton = tabButtons[nextIndex];
        const nextTab = nextButton.dataset.tab as LegalTab | undefined;
        if (nextTab) {
          setTab(nextTab, prefersReducedMotion ? "auto" : "smooth");
          nextButton.focus();
          event.preventDefault();
        }
      }
      return;
    }

    trapFocusWithin(container, event);
  };

  window.addEventListener("keydown", handleKeyDown);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node === container) {
          window.removeEventListener("keydown", handleKeyDown);
          observer.disconnect();
        }
      });
    });
  });

  observer.observe(document.body, { childList: true });
}
