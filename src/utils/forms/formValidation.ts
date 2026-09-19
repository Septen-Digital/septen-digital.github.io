/**
 * Shared form validation helpers for enquiry and legal modals.
 * Shows inline errors and scrolls the viewport to the first issue.
 */

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
type FieldErrorOptions = {
  renderMessage?: (messageEl: HTMLSpanElement) => void;
  tone?: "error" | "notice";
  iconText?: string;
};

export function clearFormErrors(
  container: ParentNode | null,
  selector = ".form-field-error, .form-error-alert, .form-group-error",
): void {
  container?.querySelectorAll(selector).forEach((el) => el.remove());
  container?.querySelectorAll(".field-invalid").forEach((el) => {
    el.classList.remove("field-invalid", "border-red-500");
    el.removeAttribute("aria-invalid");
  });
  container?.querySelectorAll(".group-invalid").forEach((el) => {
    el.classList.remove("group-invalid", "border-red-500");
    el.removeAttribute("aria-invalid");
  });
}

export function clearFieldError(field: HTMLElement | null): void {
  if (!field) return;

  field.classList.remove("field-invalid", "border-red-500");
  field.removeAttribute("aria-invalid");

  const errorId = field.id ? `${field.id}-error` : "";
  if (errorId) {
    const describedBy = (field.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter(Boolean)
      .filter((id) => id !== errorId);

    if (describedBy.length) {
      field.setAttribute("aria-describedby", describedBy.join(" "));
    } else {
      field.removeAttribute("aria-describedby");
    }
  }

  const wrapper = field.closest(".space-y-1") || field.parentElement;
  wrapper?.querySelector(".form-field-error")?.remove();
}

export function clearFieldValidState(field: HTMLElement | null): void {
  if (!field) return;

  field.classList.remove("field-valid", "border-emerald-500");
  field.removeAttribute("data-valid");
}

export function setFieldValidState(field: HTMLElement | null): void {
  if (!field) return;

  clearFieldError(field);
  field.classList.add("field-valid", "border-emerald-500");
  field.setAttribute("data-valid", "true");
}

function markFieldInvalid(field: HTMLElement): void {
  clearFieldValidState(field);
  field.classList.add("field-invalid", "border-red-500");
  field.setAttribute("aria-invalid", "true");
}

export function showFieldError(
  field: HTMLElement,
  message: string,
  options: FieldErrorOptions = {},
): void {
  const tone = options.tone ?? "error";
  if (tone === "error") {
    markFieldInvalid(field);
  } else {
    clearFieldValidState(field);
    field.classList.remove("field-invalid", "border-red-500");
    field.removeAttribute("aria-invalid");
  }

  const wrapper = field.closest(".space-y-1") || field.parentElement;
  if (!wrapper) return;

  wrapper.querySelector(".form-field-error")?.remove();
  const slot = wrapper.querySelector<HTMLElement>(".form-field-error-slot") || wrapper;

  const error = document.createElement("p");
  const errorId = field.id ? `${field.id}-error` : "";
  error.className = `form-field-error flex items-start gap-2 text-[0.8125rem] leading-relaxed font-semibold animate-fade-in ${
    tone === "error" ? "text-rose-600" : "text-slate-900"
  }`;
  error.setAttribute("role", tone === "error" ? "alert" : "status");
  if (errorId) {
    error.id = errorId;

    const describedBy = new Set(
      (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean),
    );
    describedBy.add(errorId);
    field.setAttribute("aria-describedby", Array.from(describedBy).join(" "));
  }

  const icon = document.createElement("span");
  icon.className =
    tone === "error"
      ? "self-center inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-rose-300 bg-rose-100 text-[0.75rem] font-black text-rose-700"
      : "self-center inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-sky-300 bg-sky-100 text-[0.75rem] font-black text-sky-700";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = options.iconText ?? (tone === "error" ? "!" : "?");

  const messageText = document.createElement("span");
  if (options.renderMessage) {
    options.renderMessage(messageText);
  } else {
    messageText.textContent = message;
  }

  error.append(icon, messageText);
  slot.appendChild(error);
}

export function showGroupError(groupEl: HTMLElement | null, message: string): void {
  if (!groupEl) return;

  groupEl.classList.add("group-invalid", "border-red-500");
  groupEl.setAttribute("aria-invalid", "true");

  const wrapper = groupEl.closest(".space-y-2") || groupEl.parentElement;
  if (!wrapper || wrapper.querySelector(".form-group-error")) return;

  const error = document.createElement("p");
  error.className =
    "form-group-error text-[0.8125rem] text-rose-600 font-semibold mt-1.5 animate-fade-in";
  error.setAttribute("role", "alert");
  error.textContent = message;
  wrapper.appendChild(error);
}

export function showFormAlert(
  container: FormContainer,
  message: string,
  { id = "form-error-alert", targetSection = null, beforeEl = null }: FormAlertOptions = {},
): HTMLDivElement {
  container.querySelector(`#${id}`)?.remove();

  const alert = document.createElement("div");
  alert.id = id;
  alert.className =
    "form-error-alert p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs leading-normal text-left animate-fade-in mt-4";
  alert.setAttribute("role", "alert");
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
  if (field.type === "checkbox") return Boolean(field.checked);
  const value = field.value?.trim?.() ?? field.value ?? "";
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
export function scrollToElement(
  viewport: HTMLElement | null,
  target: Element | null,
  offset = 88,
): void {
  if (!viewport || !target) return;

  const viewportRect = viewport.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const scrollTop = viewport.scrollTop + (targetRect.top - viewportRect.top) - offset;

  viewport.scrollTo({ top: Math.max(0, scrollTop), behavior: "smooth" });

  if (
    target instanceof HTMLElement &&
    typeof target.focus === "function" &&
    target.tabIndex !== -1
  ) {
    target.focus({ preventScroll: true });
  }
}

export function scrollToFirstError(viewport: HTMLElement | null, container: ParentNode): void {
  const firstInvalidField = container.querySelector(".field-invalid");
  if (firstInvalidField) {
    scrollToElement(viewport, firstInvalidField);
    return;
  }

  const firstGroupError = container.querySelector(".group-invalid");
  if (firstGroupError) {
    scrollToElement(viewport, firstGroupError);
    return;
  }

  const firstFieldError = container.querySelector(".form-field-error");
  if (firstFieldError) {
    const field = firstFieldError
      .closest(".space-y-1")
      ?.querySelector('input, select, textarea, [role="radio"]');
    scrollToElement(viewport, field || firstFieldError);
    return;
  }

  const firstAlert = container.querySelector(".form-error-alert, .form-group-error");
  if (firstAlert) {
    scrollToElement(viewport, firstAlert);
  }
}
