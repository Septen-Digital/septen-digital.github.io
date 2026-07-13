/**
 * Shared form validation helpers for enquiry and legal modals.
 * Shows inline errors and scrolls the viewport to the first issue.
 */

import { ENQUIRY_EMAIL } from '../config/web3forms';

type FormContainer = ParentNode & Node;
type FormField = HTMLElement & {
  value?: string;
  checked?: boolean;
  type?: string;
};
type FormAlertOptions = {
  id?: string;
  targetSection?: HTMLElement | null;
  beforeEl?: Element | null;
};
type FieldRule = {
  field: FormField | null;
  message: string;
  test?: () => boolean;
};

export function clearFormErrors(container: ParentNode | null, selector = '.form-field-error, .form-error-alert, .form-group-error'): void {
  container?.querySelectorAll(selector).forEach((el) => el.remove());
  container?.querySelectorAll('.field-invalid').forEach((el) => {
    el.classList.remove('field-invalid', 'border-rose-400', 'ring-1', 'ring-rose-300');
    el.removeAttribute('aria-invalid');
  });
  container?.querySelectorAll('.group-invalid').forEach((el) => {
    el.classList.remove('group-invalid', 'border-rose-400', 'ring-1', 'ring-rose-300');
    el.removeAttribute('aria-invalid');
  });
}

function markFieldInvalid(field: HTMLElement): void {
  field.classList.add('field-invalid', 'border-rose-400', 'ring-1', 'ring-rose-300');
  field.setAttribute('aria-invalid', 'true');
}

function showFieldError(field: HTMLElement, message: string): void {
  markFieldInvalid(field);

  const wrapper = field.closest('.space-y-1') || field.parentElement;
  if (!wrapper || wrapper.querySelector('.form-field-error')) return;

  const error = document.createElement('p');
  error.className = 'form-field-error text-[11px] text-rose-600 font-semibold mt-1 animate-fade-in';
  error.setAttribute('role', 'alert');
  error.textContent = message;
  wrapper.appendChild(error);
}

export function showGroupError(groupEl: HTMLElement | null, message: string): void {
  if (!groupEl) return;

  groupEl.classList.add('group-invalid', 'border-rose-400', 'ring-1', 'ring-rose-300');
  groupEl.setAttribute('aria-invalid', 'true');

  const wrapper = groupEl.closest('.space-y-2') || groupEl.parentElement;
  if (!wrapper || wrapper.querySelector('.form-group-error')) return;

  const error = document.createElement('p');
  error.className = 'form-group-error text-[11px] text-rose-600 font-semibold mt-1 animate-fade-in';
  error.setAttribute('role', 'alert');
  error.textContent = message;
  wrapper.appendChild(error);
}

export function showFormAlert(
  container: FormContainer,
  message: string,
  { id = 'form-error-alert', targetSection = null, beforeEl = null }: FormAlertOptions = {}
): HTMLDivElement {
  container.querySelector(`#${id}`)?.remove();

  const alert = document.createElement('div');
  alert.id = id;
  alert.className = 'form-error-alert p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs leading-normal text-left animate-fade-in mt-4';
  alert.setAttribute('role', 'alert');
  alert.innerHTML = message;

  if (beforeEl) {
    beforeEl.parentElement?.insertBefore(alert, beforeEl);
  } else if (targetSection) {
    targetSection.appendChild(alert);
  } else {
    container.appendChild(alert);
  }

  return alert;
}

function fieldHasValue(field: FormField | null): boolean {
  if (!field) return false;
  if (field.type === 'checkbox') return Boolean(field.checked);
  const value = field.value?.trim?.() ?? field.value ?? '';
  return Boolean(value);
}

/**
 * Validate a list of field rules. Returns true if all valid, false if any invalid.
 * @param {Array<{ field: HTMLElement, message: string, test?: () => boolean }>} rules
 */
export function validateFields(rules: FieldRule[]): boolean {
  let hasErrors = false;
  for (const rule of rules) {
    const isValid = rule.test ? rule.test() : fieldHasValue(rule.field);
    if (!isValid) {
      if (rule.field) {
        showFieldError(rule.field, rule.message);
      }
      hasErrors = true;
    }
  }
  return hasErrors;
}

/** Scroll a scrollable viewport so the target element is visible near the top. */
export function scrollToElement(viewport: HTMLElement | null, target: Element | null, offset = 12): void {
  if (!viewport || !target) return;

  const viewportRect = viewport.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const scrollTop = viewport.scrollTop + (targetRect.top - viewportRect.top) - offset;

  viewport.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });

  if (target instanceof HTMLElement && typeof target.focus === 'function' && target.tabIndex !== -1) {
    target.focus({ preventScroll: true });
  }
}

export function scrollToFirstError(viewport: HTMLElement | null, container: ParentNode): void {
  const firstInvalidField = container.querySelector('.field-invalid');
  if (firstInvalidField) {
    scrollToElement(viewport, firstInvalidField);
    return;
  }

  const firstGroupError = container.querySelector('.group-invalid');
  if (firstGroupError) {
    scrollToElement(viewport, firstGroupError);
    return;
  }

  const firstFieldError = container.querySelector('.form-field-error');
  if (firstFieldError) {
    const field = firstFieldError
      .closest('.space-y-1')
      ?.querySelector('input, select, textarea, [role="radio"]');
    scrollToElement(viewport, field || firstFieldError);
    return;
  }

  const firstAlert = container.querySelector('.form-error-alert, .form-group-error');
  if (firstAlert) {
    scrollToElement(viewport, firstAlert);
  }
}

/**
 * Validate Turnstile when enabled. Returns true if OK to proceed.
 */
export function validateTurnstile(
  viewport: HTMLElement | null,
  container: FormContainer,
  turnstileToken: string | null,
  { slotSelector, isEnabled }: { slotSelector: string; isEnabled: boolean }
): boolean {
  if (!isEnabled) return true;
  if (turnstileToken) return true;

  const slot = container.querySelector(slotSelector);
  showFormAlert(
    container,
    `<p class="font-bold mb-1">Verification Required</p>
     <p class="text-[11px] text-rose-700">Please complete the security verification check before submitting.</p>
     <p class="text-[11px] text-slate-600 mt-2">If verification fails for any reason, please email <a class="text-brand-teal font-semibold" href="mailto:${ENQUIRY_EMAIL}">${ENQUIRY_EMAIL}</a> instead.</p>`,
    { id: 'turnstile-error-alert' }
  );

  const alert = container.querySelector('#turnstile-error-alert');
  if (alert && slot) {
    slot.insertAdjacentElement('afterend', alert);
  }

  scrollToFirstError(viewport, container);
  return false;
}
