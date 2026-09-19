import { getIcon } from "@utils/ui";
import { focusFirstElement, lockBodyScroll, trapFocusWithin } from "@utils/ui";

export function openDemoModal(businessName = "this local business"): void {
  const existing = document.getElementById("demo-modal-container");
  if (existing) {
    existing.remove();
  }

  const container = document.createElement("div");
  container.id = "demo-modal-container";
  container.className =
    "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in";
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-modal", "true");
  container.setAttribute("aria-labelledby", "demo-modal-title");

  container.innerHTML = `
    <div id="demo-modal-card" class="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-md w-full p-6 text-left relative overflow-hidden animate-slide-in-up" role="document">
      <!-- Aesthetic design accents -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-brand-teal" aria-hidden="true"></div>
      
      <button 
        id="demo-modal-close-btn"
        class="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white hover:text-white transition-colors border-2 border-brand-orange hover:border-brand-orange-dark shadow-[0_10px_24px_rgba(175,98,69,0.28)] hover:shadow-[0_14px_32px_rgba(138,74,53,0.34)] cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
        aria-label="Close modal"
      >
        ${getIcon("X", "w-6 h-6 cursor-pointer")}
      </button>

      <div class="flex items-start gap-4 mt-2">
        <div class="p-2.5 bg-brand-teal/10 text-brand-teal rounded-lg shrink-0">
          ${getIcon("ShieldAlert", "w-6 h-6")}
        </div>
        <div class="space-y-1.5">
          <h3 id="demo-modal-title" class="font-display font-extrabold text-slate-900 text-lg">
            Septen Demonstration
          </h3>
          <span class="inline-block bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-brand-orange/40 font-mono tracking-wider">
            MOCK PREVIEW
          </span>
        </div>
      </div>

      <div class="mt-5 space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>
          You are currently viewing a live demonstration design for <strong>${businessName}</strong> built by <strong>Septen</strong>.
        </p>
        <p>
          This website acts as a high-fidelity visual sample for potential local UK clients. No real enquiries or transactions are active on this page, and no information has been transmitted, logged, or processed.
        </p>
        <p class="text-xs text-slate-500 font-mono italic">
          All user enquiries, bookings, or form requests across this sample page will securely trigger this notification panel without any data submission.
        </p>
      </div>

      <div class="mt-6 flex flex-col gap-2">
        <button
          id="demo-modal-confirm-btn"
          class="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-bold p-3 rounded-lg text-sm transition-colors border-none cursor-pointer text-center font-mono uppercase tracking-widest"
        >
          Got it, Return to Demo
        </button>
      </div>
    </div>
  `;

  // Remember triggering element to restore focus when closed
  const triggerElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const restoreBodyScroll = lockBodyScroll();

  document.body.appendChild(container);

  const closeBtn = container.querySelector<HTMLButtonElement>("#demo-modal-close-btn");
  const confirmBtn = container.querySelector<HTMLButtonElement>("#demo-modal-confirm-btn");

  const closeModal = (): void => {
    container.classList.remove("animate-fade-in");
    container.classList.add("animate-fade-out");

    const card = container.querySelector<HTMLElement>("#demo-modal-card");
    if (card) {
      card.classList.remove("animate-slide-in-up");
      card.classList.add("animate-slide-out-down");
    }

    // Restore focus to original triggering element
    if (triggerElement && typeof triggerElement.focus === "function") {
      triggerElement.focus();
    }

    setTimeout(() => {
      // Unlock scroll cleanly at the end of transition
      restoreBodyScroll();
      container.remove();
    }, 300);
  };

  closeBtn?.addEventListener("click", closeModal);
  confirmBtn?.addEventListener("click", closeModal);

  // Close when clicking outside card
  let mousedownOnBackdrop = false;
  container.addEventListener("mousedown", (e: MouseEvent) => {
    mousedownOnBackdrop = e.target === container;
  });

  container.addEventListener("click", (e: MouseEvent) => {
    if (e.target === container && mousedownOnBackdrop) {
      closeModal();
    }
  });

  // Focus Trapping & Keyboard Management
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      closeModal();
      return;
    }

    trapFocusWithin(container, e);
  };
  window.addEventListener("keydown", handleKeyDown);

  focusFirstElement(container, "#demo-modal-confirm-btn");

  // Clean keyboard listener when modal container is removed
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
