import { legalTabContent, legalTabs, type LegalTab } from '../content/legalContent';
import { getIcon } from '../utils/icons';
import { focusFirstElement, lockBodyScroll, trapFocusWithin } from '../utils/modal';

export function openLegalModal(tab: LegalTab = 'terms'): void {
  document.getElementById('legal-modal-container')?.remove();

  const container = document.createElement('div');
  container.id = 'legal-modal-container';
  container.className =
    'fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-modal', 'true');
  container.setAttribute('aria-labelledby', 'legal-modal-title');

  const tabsMarkup = legalTabs
    .map(
      (item) =>
        `<button type="button" data-tab="${item.id}" role="tab" aria-controls="legal-panel-${item.id}" aria-selected="false" class="shrink-0 px-4 sm:px-6 py-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 border-b-2 border-transparent hover:border-slate-300 hover:text-slate-700 transition-colors bg-transparent cursor-pointer whitespace-nowrap">${item.label}</button>`
    )
    .join('');

  const panelsMarkup = legalTabs
    .map((item, index) => {
      const hiddenClass = index === 0 ? '' : ' hidden';
      return `<div data-tab-panel="${item.id}" class="space-y-3${hiddenClass}">${legalTabContent[item.id]}</div>`;
    })
    .join('');

  container.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-4xl w-full max-h-[min(88dvh,90vh)] h-[min(88dvh,90vh)] flex flex-col min-h-0 relative overflow-hidden animate-slide-in-up" role="document">
      <button id="legal-modal-close-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-brand-teal" aria-label="Close modal">
        ${getIcon('X', 'w-5 h-5 cursor-pointer')}
      </button>
      <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 shrink-0 pr-14 sm:pr-16">
        <span class="font-sans font-black text-[9px] uppercase text-brand-teal tracking-widest block mb-1">Legal</span>
        <h2 id="legal-modal-title" class="font-sans font-extrabold text-slate-900 text-xl leading-tight">Terms, Privacy, and Data Rights</h2>
      </div>
      <div class="flex flex-nowrap overflow-x-auto overscroll-x-contain border-b border-slate-100 shrink-0 legal-tab-list" role="tablist" aria-label="Legal document tabs">
        ${tabsMarkup}
      </div>
      <div id="legal-tabs-content" class="flex-1 min-h-0 p-4 sm:p-6 md:p-8 overflow-y-auto overscroll-contain text-left text-[13px] leading-relaxed text-slate-700 legal-copy-content">
        ${panelsMarkup}
      </div>
    </div>
  `;

  const triggerElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const restoreBodyScroll = lockBodyScroll();

  document.body.appendChild(container);

  const card = container.querySelector<HTMLElement>('.animate-slide-in-up');
  const closeButton = container.querySelector<HTMLButtonElement>('#legal-modal-close-btn');
  const tabButtons = Array.from(container.querySelectorAll<HTMLButtonElement>('[data-tab]'));
  const tabPanels = Array.from(container.querySelectorAll<HTMLElement>('[data-tab-panel]'));

  const setTab = (activeTab: LegalTab): void => {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === activeTab;
      button.setAttribute('aria-selected', String(isActive));
      button.tabIndex = isActive ? 0 : -1;
      button.className = isActive
        ? 'shrink-0 px-4 sm:px-6 py-3 text-[11px] font-extrabold uppercase tracking-widest border-b-2 border-brand-teal text-brand-teal bg-transparent cursor-pointer whitespace-nowrap'
        : 'shrink-0 px-4 sm:px-6 py-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 border-b-2 border-transparent hover:border-slate-300 hover:text-slate-700 transition-colors bg-transparent cursor-pointer whitespace-nowrap';
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.dataset.tabPanel === activeTab;
      panel.classList.toggle('hidden', !isActive);
      panel.id = `legal-panel-${panel.dataset.tabPanel}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `legal-tab-${panel.dataset.tabPanel}`);
    });
  };

  setTab(tab);

  tabButtons.forEach((button) => {
    if (button.dataset.tab) {
      button.id = `legal-tab-${button.dataset.tab}`;
    }
    button.addEventListener('click', () => {
      const nextTab = button.dataset.tab as LegalTab | undefined;
      if (nextTab) {
        setTab(nextTab);
      }
    });
  });

  const closeModal = (): void => {
    container.classList.remove('animate-fade-in');
    container.classList.add('animate-fade-out');
    card?.classList.remove('animate-slide-in-up');
    card?.classList.add('animate-slide-out-down');
    triggerElement?.focus();

    window.setTimeout(() => {
      restoreBodyScroll();
      container.remove();
    }, 300);
  };

  closeButton?.addEventListener('click', closeModal);

  let mousedownOnBackdrop = false;
  container.addEventListener('mousedown', (event: MouseEvent) => {
    mousedownOnBackdrop = event.target === container;
  });
  container.addEventListener('click', (event: MouseEvent) => {
    if (event.target === container && mousedownOnBackdrop) {
      closeModal();
    }
  });

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const currentIndex = tabButtons.findIndex((button) => button === document.activeElement);
      if (currentIndex >= 0) {
        const offset = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (currentIndex + offset + tabButtons.length) % tabButtons.length;
        const nextButton = tabButtons[nextIndex];
        const nextTab = nextButton.dataset.tab as LegalTab | undefined;
        if (nextTab) {
          setTab(nextTab);
          nextButton.focus();
          event.preventDefault();
        }
      }
      return;
    }

    trapFocusWithin(container, event);
  };

  window.addEventListener('keydown', handleKeyDown);

  focusFirstElement(container, '[data-tab]');

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node === container) {
          window.removeEventListener('keydown', handleKeyDown);
          observer.disconnect();
        }
      });
    });
  });

  observer.observe(document.body, { childList: true });
}
