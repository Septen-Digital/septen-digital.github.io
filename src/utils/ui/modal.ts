const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function lockBodyScroll(): () => void {
  const previousOverflow = document.body.style.overflow;
  const previousPaddingRight = document.body.style.paddingRight;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  document.body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  return () => {
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPaddingRight;
  };
}

export function getFocusableElements(container: ParentNode): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => {
      if ("disabled" in element && element.disabled) {
        return false;
      }

      if (element.getAttribute("aria-hidden") === "true") {
        return false;
      }

      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    },
  );
}

export function trapFocusWithin(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) {
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    last.focus();
    event.preventDefault();
    return;
  }

  if (!event.shiftKey && document.activeElement === last) {
    first.focus();
    event.preventDefault();
  }
}

export function focusFirstElement(container: HTMLElement, preferredSelector?: string): void {
  window.setTimeout(() => {
    const preferred = preferredSelector
      ? container.querySelector<HTMLElement>(preferredSelector)
      : null;

    if (preferred) {
      preferred.focus();
      return;
    }

    getFocusableElements(container)[0]?.focus();
  }, 50);
}
