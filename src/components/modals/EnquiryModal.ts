import { getIcon } from "@utils/ui";
import { ENQUIRY_EMAIL } from "@config/web3forms";
import { submitWeb3Form } from "@utils/integrations";
import { escapeHtml } from "@utils/security";
import { validateEmailManually } from "@utils/forms";
import {
  appendRecentEnquiryInput,
  clearEnquiryDraft,
  getRecentEnquiryInputsForKey,
  loadEnquiryDraft,
  loadRecentEnquiryInputs,
  removeRecentEnquiryInput,
  saveEnquiryDraft,
  saveSavedEnquiryIdentity,
  type EnquiryDraft,
  type RecentEnquiryInputKey,
} from "@utils/forms";
import { emailUsesDisposableDomain, getDisposableEmailDomains } from "@utils/forms";
import { focusFirstElement, lockBodyScroll, trapFocusWithin } from "@utils/ui";
import {
  clearFieldError,
  clearFieldValidState,
  clearFormErrors,
  showFieldError,
  showFormAlert,
  scrollToFirstError,
} from "@utils/forms";

type EnquiryModalOptions = {
  initialPlan?: string | null;
  mode?: "standard" | "care";
  restoreDraft?: boolean;
  preferredFocusId?: string | null;
};

type ValidateEmailFieldOptions = {
  allowEmpty?: boolean;
};

const POPULAR_CONSUMER_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "icloud.com",
  "me.com",
  "proton.me",
] as const;

const PROFESSIONAL_EMAIL_TLDS = [
  "com",
  "co.uk",
  "net",
  "org",
  "io",
  "dev",
  "app",
  "digital",
  "agency",
] as const;

const BUSINESS_FIELD_ALLOWED_PATTERN = /^[\p{L}\p{N}\s&.,'’()/#-]+$/u;
const PHONE_ALLOWED_PATTERN = /^[0-9+ ]+$/;
const COMPANY_NAME_MAX_LENGTH = 100;
const COMPANY_ADDRESS_MAX_LENGTH = 250;
const PHONE_MAX_LENGTH = 32;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 2000;

function getBoundedDamerauLevenshteinDistance(
  source: string,
  target: string,
  maxDistance = 2,
): number {
  const sourceLength = source.length;
  const targetLength = target.length;

  if (Math.abs(sourceLength - targetLength) > maxDistance) {
    return maxDistance + 1;
  }

  const matrix = Array.from({ length: sourceLength + 1 }, () =>
    Array<number>(targetLength + 1).fill(0),
  );

  for (let row = 0; row <= sourceLength; row += 1) {
    matrix[row][0] = row;
  }

  for (let column = 0; column <= targetLength; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row <= sourceLength; row += 1) {
    let rowMinimum = Number.POSITIVE_INFINITY;

    for (let column = 1; column <= targetLength; column += 1) {
      const substitutionCost = source[row - 1] === target[column - 1] ? 0 : 1;

      let distance = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + substitutionCost,
      );

      if (
        row > 1 &&
        column > 1 &&
        source[row - 1] === target[column - 2] &&
        source[row - 2] === target[column - 1]
      ) {
        distance = Math.min(distance, matrix[row - 2][column - 2] + 1);
      }

      matrix[row][column] = distance;
      rowMinimum = Math.min(rowMinimum, distance);
    }

    if (rowMinimum > maxDistance) {
      return maxDistance + 1;
    }
  }

  return matrix[sourceLength][targetLength];
}

function getSuggestedBrandDomain(domain: string): string | null {
  if (
    !domain ||
    POPULAR_CONSUMER_EMAIL_DOMAINS.includes(
      domain as (typeof POPULAR_CONSUMER_EMAIL_DOMAINS)[number],
    )
  ) {
    return null;
  }

  let bestDomain: string | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const popularDomain of POPULAR_CONSUMER_EMAIL_DOMAINS) {
    const distance = getBoundedDamerauLevenshteinDistance(domain, popularDomain, 2);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestDomain = popularDomain;
    }
  }

  return bestDistance <= 2 ? bestDomain : null;
}

function getSuggestedDomainByTld(domain: string): string | null {
  const domainLabels = domain.split(".").filter(Boolean);
  if (domainLabels.length < 2) {
    return null;
  }

  let bestSuggestion: string | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const tld of PROFESSIONAL_EMAIL_TLDS) {
    const tldLabels = tld.split(".");
    if (domainLabels.length <= tldLabels.length) {
      continue;
    }

    const domainPrefixLabels = domainLabels.slice(0, -tldLabels.length);
    const currentSuffix = domainLabels.slice(-tldLabels.length).join(".");
    if (!domainPrefixLabels.length || currentSuffix === tld) {
      continue;
    }

    const distance = getBoundedDamerauLevenshteinDistance(currentSuffix, tld, 2);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestSuggestion = `${domainPrefixLabels.join(".")}.${tld}`;
    }
  }

  return bestDistance <= 2 ? bestSuggestion : null;
}

function getDomainEndExtension(domain: string): string {
  const domainLabels = domain.split(".").filter(Boolean);
  if (!domainLabels.length) {
    return "";
  }

  const lastTwoLabels = domainLabels.slice(-2).join(".");
  if (PROFESSIONAL_EMAIL_TLDS.includes(lastTwoLabels as (typeof PROFESSIONAL_EMAIL_TLDS)[number])) {
    return lastTwoLabels;
  }

  return domainLabels[domainLabels.length - 1] ?? "";
}

function checkEmailSuggestion(domain: string): string | null {
  const fullDomain = domain.trim().toLowerCase();
  if (!fullDomain) {
    return null;
  }

  if (
    POPULAR_CONSUMER_EMAIL_DOMAINS.includes(
      fullDomain as (typeof POPULAR_CONSUMER_EMAIL_DOMAINS)[number],
    )
  ) {
    return null;
  }

  const brandSuggestion = getSuggestedBrandDomain(fullDomain);
  if (brandSuggestion) {
    return brandSuggestion;
  }

  const endExtension = getDomainEndExtension(fullDomain);
  if (PROFESSIONAL_EMAIL_TLDS.includes(endExtension as (typeof PROFESSIONAL_EMAIL_TLDS)[number])) {
    return null;
  }

  return getSuggestedDomainByTld(fullDomain);
}

function formatReferencePlanSegment(plan: string): string {
  const normalizedPlan = plan.trim();

  if (/^other(?:\s*\/\s*general|\.\.\.)?$/i.test(normalizedPlan)) {
    return "OTHER";
  }

  return plan
    .replace(/\bplan\b/gi, "")
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toUpperCase();
}

function buildReferenceId(plan: string, date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${formatReferencePlanSegment(plan)}-${day}${month}${year}-${hours}${minutes}`;
}

function buildStandardReferenceId(date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}${month}${year}-${hours}${minutes}${seconds}`;
}

function resolveModalOptions(
  initialPlanOrOptions: string | null | EnquiryModalOptions,
): EnquiryModalOptions {
  if (initialPlanOrOptions === null || typeof initialPlanOrOptions === "string") {
    return {
      initialPlan: initialPlanOrOptions,
      mode: initialPlanOrOptions ? "care" : "standard",
      restoreDraft: true,
      preferredFocusId: null,
    };
  }

  return {
    initialPlan: initialPlanOrOptions.initialPlan ?? null,
    mode: initialPlanOrOptions.mode ?? (initialPlanOrOptions.initialPlan ? "care" : "standard"),
    restoreDraft: initialPlanOrOptions.restoreDraft ?? true,
    preferredFocusId: initialPlanOrOptions.preferredFocusId ?? null,
  };
}

function removeEnquirySuccessBanner(): void {
  document.getElementById("enquiry-success-banner")?.remove();
}

function showEnquirySuccessBanner(email: string, referenceId: string): void {
  removeEnquirySuccessBanner();

  const banner = document.createElement("div");
  banner.id = "enquiry-success-banner";
  banner.className =
    "fixed inset-x-4 bottom-4 z-[120] mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm animate-fade-in";
  banner.setAttribute("role", "status");
  banner.innerHTML = `
    <div class="flex items-start gap-3 text-left">
      <div class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
          <path d="M4.5 10.5 8 14l7.5-8"></path>
        </svg>
      </div>
      <div class="min-w-0 flex-1 space-y-2">
        <p class="font-sans text-sm font-extrabold tracking-tight text-slate-900">Enquiry sent successfully</p>
        <p class="text-xs leading-relaxed text-slate-600">Thank you for your enquiry. We will reply directly to <strong class="font-bold select-all">${escapeHtml(email)}</strong> within 2 business days.</p>
        <div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
          <span class="font-black text-[9px] uppercase tracking-widest text-slate-500 shrink-0">Ref</span>
          <code id="enquiry-success-ref-value" class="font-bold text-brand-teal select-all text-[11px] tracking-wide flex-1 min-w-0 truncate">${escapeHtml(referenceId)}</code>
          <button
            type="button"
            id="enquiry-success-copy-ref"
            class="shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 active:scale-95"
            aria-label="Copy reference number"
            title="Copy reference number"
          >
            <span data-icon-copy class="inline-flex items-center justify-center">
              ${getIcon("Copy", "w-3.5 h-3.5")}
            </span>
            <span data-icon-check class="hidden inline-flex items-center justify-center text-emerald-600">
              ${getIcon("Check", "w-3.5 h-3.5")}
            </span>
          </button>
        </div>
      </div>
      <button type="button" id="dismiss-enquiry-success-banner" class="mt-0.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-rose-500 text-white transition-colors hover:bg-rose-600 active:scale-95 shadow-[0_6px_14px_rgba(244,63,94,0.25)] hover:shadow-[0_8px_18px_rgba(225,29,72,0.3)]" aria-label="Dismiss success message">
        ${getIcon("X", "w-4 h-4")}
      </button>
    </div>
  `;

  document.body.appendChild(banner);

  banner
    .querySelector<HTMLButtonElement>("#dismiss-enquiry-success-banner")
    ?.addEventListener("click", () => {
      banner.remove();
    });

  const copyBtn = banner.querySelector<HTMLButtonElement>("#enquiry-success-copy-ref");
  const refValue = banner.querySelector<HTMLElement>("#enquiry-success-ref-value");
  const iconCopy = banner.querySelector<HTMLElement>("[data-icon-copy]");
  const iconCheck = banner.querySelector<HTMLElement>("[data-icon-check]");
  if (copyBtn && refValue) {
    let resetTimer: number | undefined;
    copyBtn.addEventListener("click", async () => {
      try {
        const text = refValue.textContent || referenceId;
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.className = "sr-only";
          document.body.appendChild(ta);
          ta.select();
          void (document as any).execCommand("copy");
          ta.remove();
        }
        if (iconCopy) iconCopy.classList.add("hidden");
        if (iconCheck) iconCheck.classList.remove("hidden");
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          if (iconCopy) iconCopy.classList.remove("hidden");
          if (iconCheck) iconCheck.classList.add("hidden");
        }, 1200);
      } catch {
        /* no-op */
      }
    });
  }

  window.setTimeout(() => {
    banner.remove();
  }, 18000);
}

function formatSupportEmailMarkup(message: string): string {
  return escapeHtml(message).replaceAll(
    escapeHtml(ENQUIRY_EMAIL),
    `<strong class="font-bold text-brand-teal select-all">${escapeHtml(ENQUIRY_EMAIL)}</strong>`,
  );
}

export function openEnquiryModal(
  initialPlanOrOptions: string | null | EnquiryModalOptions = null,
): void {
  const existing = document.getElementById("enquiry-modal-container");
  if (existing) {
    existing.remove();
  }

  const modalOptions = resolveModalOptions(initialPlanOrOptions);
  let enquiryMode = modalOptions.mode ?? "standard";
  const savedDraft = modalOptions.restoreDraft === false ? null : loadEnquiryDraft();
  const hasExplicitInitialPlan =
    Boolean(modalOptions.initialPlan) && modalOptions.initialPlan !== "none";

  let standardMessageBuffer = savedDraft?.messageStandard ?? "";
  let careMessageBuffer = savedDraft?.messageCare ?? "";

  const container = document.createElement("div");
  container.id = "enquiry-modal-container";
  container.className =
    "fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in";
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-modal", "true");
  container.setAttribute("aria-labelledby", "enquiry-modal-title");
  container.setAttribute("aria-describedby", "enquiry-modal-description");

  const initialPlanVal = hasExplicitInitialPlan
    ? (modalOptions.initialPlan as string)
    : savedDraft?.service && savedDraft.service !== "Standard Enquiry"
      ? savedDraft.service
      : "";
  const recentInputs = loadRecentEnquiryInputs();
  const textInputClass =
    "w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus-visible:outline-none focus:border-brand-teal";
  const seamlessJoinBase =
    "relative z-10 transition-[border-radius,border-color,background-color] duration-100";
  const inputOpenStateClass =
    "[[data-recent-dropdown-open=true]_&]:rounded-b-none [[data-recent-dropdown-open=true]_&]:border-b-transparent";
  const joinedInputClass = `w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 ${seamlessJoinBase} focus:outline-none focus-visible:outline-none focus:border-brand-teal ${inputOpenStateClass}`;
  const emailInputClassPlain = `${textInputClass} pr-10`;
  const emailJoinedInputClass = `w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 pr-10 ${seamlessJoinBase} focus:outline-none focus-visible:outline-none focus:border-brand-teal ${inputOpenStateClass}`;
  const textAreaClass =
    "w-full bg-white border border-slate-300 rounded-lg px-3 py-3 text-xs text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus-visible:outline-none focus:border-brand-teal resize-none";

  const renderRecentDropdownFor = (
    key: RecentEnquiryInputKey,
    iconName: "User" | "Mail" | "Phone" | "Building" | "MapPin",
    emailValClass = "text-slate-800",
  ): { dropdown: string; hasItems: boolean; inputClass: string; emailInputClass: string } => {
    const items = recentInputs[key] ?? [];
    const hasItems = items.length > 0;
    const inputClass = hasItems ? joinedInputClass : textInputClass;
    const emailInputClass = hasItems ? emailJoinedInputClass : emailInputClassPlain;
    if (!hasItems) {
      return { dropdown: "", hasItems: false, inputClass, emailInputClass };
    }
    const rows = items
      .map(
        (value, idx) => `
        <div
          data-recent-row="${key}"
          data-recent-value="${escapeHtml(value)}"
          class="flex items-center gap-2 px-3 py-2 first:pt-2.5 last:pb-2.5 border-t border-slate-200/70 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <button
            type="button"
            data-recent-apply="${key}"
            data-recent-apply-value="${escapeHtml(value)}"
            class="group flex min-w-0 flex-1 items-center gap-2 text-left cursor-pointer"
            tabindex="-1"
          >
            <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-colors group-hover:bg-brand-teal">
              ${getIcon(iconName, "w-3 h-3")}
            </span>
            <span class="${emailValClass} text-[11px] font-semibold truncate min-w-0 select-all ${
              key === "companyAddress" ? "line-clamp-2 leading-snug" : ""
            }">${escapeHtml(value)}</span>
          </button>
          <button
            type="button"
            data-recent-remove="${key}"
            data-recent-remove-value="${escapeHtml(value)}"
            tabindex="-1"
            class="cursor-pointer flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-900 hover:text-white active:scale-95"
            aria-label="Remove suggestion"
            title="Remove from recent entries"
          >
            ${getIcon("X", "w-3 h-3")}
          </button>
        </div>
        ${idx === 0 ? "" : ""}
      `,
      )
      .join("");
    return {
      dropdown: `
      <div
        data-recent-dropdown="${key}"
        class="hidden mt-[-1px] rounded-b-lg border border-slate-300 border-t-transparent bg-white shadow-[0_10px_24px_-12px_rgba(15,23,42,0.18)] relative z-[5] overflow-hidden animate-fade-in origin-top"
      >
        <div class="px-3 pt-2 pb-1">
          <span class="font-black text-[9px] uppercase tracking-widest text-slate-400">Recent</span>
        </div>
        ${rows}
      </div>
      `,
      hasItems: true,
      inputClass,
      emailInputClass,
    };
  };

  const recentName = renderRecentDropdownFor("name", "User");
  const recentEmail = renderRecentDropdownFor("email", "Mail", "text-brand-teal");
  const recentPhone = renderRecentDropdownFor("phone", "Phone");
  const recentCompanyName = renderRecentDropdownFor("companyName", "Building");
  const recentCompanyAddress = renderRecentDropdownFor("companyAddress", "MapPin");

  container.innerHTML = `
    <div 
      id="enquiry-modal-card" 
      class="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-6xl w-full max-h-[min(90dvh,980px)] h-[min(90dvh,980px)] flex flex-col relative overflow-hidden animate-slide-in-up"
      role="document"
    >
      <button 
        id="enquiry-modal-close-btn"
        class="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white hover:text-white transition-colors border-2 border-brand-orange hover:border-brand-orange-dark shadow-[0_10px_24px_rgba(175,98,69,0.28)] hover:shadow-[0_14px_32px_rgba(138,74,53,0.34)] cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
        aria-label="Close modal"
      >
        ${getIcon("X", "w-6 h-6 cursor-pointer")}
      </button>
      <div class="w-full px-4 py-5 pr-4 border-b border-slate-100 shrink-0 text-left sm:px-6 sm:pr-20">
        <span class="font-sans font-black text-[9px] uppercase text-brand-teal tracking-widest block mb-1">Enquiries</span>
        <h2 id="enquiry-modal-title" class="font-sans font-extrabold text-slate-900 text-xl leading-tight">Start Your Project</h2>
        <p id="enquiry-modal-description" class="text-[11px] text-slate-400 mt-1 leading-relaxed">
          Complete the enquiry form below and we will reply manually after reviewing your requirements. Alternatively, email <strong class="font-bold text-brand-teal select-all">septen.digital@gmail.com</strong> to enquire directly.
        </p>
        <div data-enquiry-mode-switch class="enquiry-mode-switch mt-4 grid w-full grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Enquiry type">
          <span class="enquiry-mode-highlight" aria-hidden="true"></span>
          <button type="button" data-enquiry-mode="standard" role="tab" aria-selected="false" class="relative z-10 rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors sm:px-3 sm:py-2 sm:text-[11px]">Ask a Question</button>
          <button type="button" data-enquiry-mode="care" role="tab" aria-selected="false" class="relative z-10 rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors sm:px-3 sm:py-2 sm:text-[11px]">Enquire About Services</button>
        </div>
      </div>
      <div id="enquiry-content-viewport" class="flex-1 min-h-0 p-5 sm:p-8 md:p-12 overflow-y-auto overscroll-contain scroll-smooth relative w-full">
        <form id="enquiry-multi-step-form" class="enquiry-multi-step-form space-y-8 pb-4 max-w-4xl mx-auto" novalidate aria-describedby="enquiry-security-note">
          <section id="enquiry-sec-contact" class="space-y-5 scroll-mt-6">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Contact Details</h3>
              <p class="text-xs text-slate-400">Please provide your primary direct contact information.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1 text-left">
                <label for="enq-name" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Your Full Name <span class="text-brand-orange">*</span></label>
                <div data-recent-input-group="name">
                  <input id="enq-name" name="name" type="text" required pattern="[\\p{L}' -]+\\s+[\\p{L}' -]+" title="Enter your first and last name (or more)." maxlength="120" autocomplete="name" placeholder="e.g. Alex Morgan" class="${recentName.inputClass}" />
                  ${recentName.dropdown}
                </div>
                <div class="form-field-error-slot min-h-5 pt-1"></div>
              </div>
              <div class="space-y-1 text-left">
                <label for="enq-email" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Email Address <span class="text-brand-orange">*</span></label>
                <div data-recent-input-group="email">
                  <div class="relative z-10">
                    <input id="enq-email" name="email" type="email" required maxlength="160" autocomplete="email" placeholder="e.g. alex.morgan@example.com" class="${recentEmail.emailInputClass}" />
                    <span id="enq-email-valid-indicator" class="pointer-events-none absolute inset-y-0 right-3 hidden items-center text-emerald-600" aria-hidden="true">
                      <span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500 bg-emerald-50">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
                          <path d="M4.5 10.5 8 14l7.5-8"></path>
                        </svg>
                      </span>
                    </span>
                  </div>
                  ${recentEmail.dropdown}
                </div>
                <div class="form-field-error-slot min-h-5 pt-1"></div>
              </div>
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-phone" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Phone Number <span class="text-slate-400">(Optional)</span></label>
              <div data-recent-input-group="phone">
                <input id="enq-phone" name="phone" type="tel" inputmode="tel" pattern="[0-9+ ]{7,32}" title="Use numbers, spaces, and an optional leading plus sign." maxlength="${String(PHONE_MAX_LENGTH)}" autocomplete="tel" placeholder="e.g. +44 7700 900000" class="${recentPhone.inputClass}" />
                ${recentPhone.dropdown}
              </div>
              <div class="form-field-error-slot min-h-5 pt-1"></div>
            </div>
          </section>
          <section id="enquiry-sec-company" class="space-y-5 scroll-mt-6">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Company Information <span class="text-slate-400 text-sm font-medium">(Optional)</span></h3>
              <p class="text-xs text-slate-400">Tell us about your business or trading entity.</p>
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-company-name" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Company / Business Name <span class="text-slate-400">(Optional)</span></label>
              <div data-recent-input-group="companyName">
                <input id="enq-company-name" name="companyName" type="text" pattern="[A-Za-z0-9&.,'’()/# -]{1,100}" title="Use letters, numbers, spaces, and basic punctuation only." maxlength="${String(COMPANY_NAME_MAX_LENGTH)}" autocomplete="organization" placeholder="e.g. Acme Business" class="${recentCompanyName.inputClass}" />
                ${recentCompanyName.dropdown}
              </div>
              <div class="form-field-error-slot min-h-5 pt-1"></div>
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-company-address" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Company Address <span class="text-slate-400">(Optional)</span></label>
              <div data-recent-input-group="companyAddress">
                <input id="enq-company-address" name="Company Address" type="text" pattern="[A-Za-z0-9&.,'’()/# -]{1,250}" title="Use letters, numbers, spaces, and basic punctuation only." maxlength="${String(COMPANY_ADDRESS_MAX_LENGTH)}" autocomplete="street-address" placeholder="e.g. 12 High Street, Newcastle upon Tyne, NE1 1AD" class="${recentCompanyAddress.inputClass}" />
                ${recentCompanyAddress.dropdown}
              </div>
              <div class="form-field-error-slot min-h-5 pt-1"></div>
            </div>
          </section>
          <section id="enquiry-sec-service" class="space-y-5 scroll-mt-6">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Service Option</h3>
              <p class="text-xs text-slate-400">All builds require a care plan. Select your build package or retainer tier.</p>
            </div>
            <div class="space-y-2 text-left">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p id="enquiry-plan-label" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Select Package Option <span class="text-brand-orange">*</span></p>
                <span id="enq-service-error" class="hidden rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-rose-700" role="alert"></span>
              </div>
              <p id="enquiry-plan-hint" class="text-[11px] text-slate-400 leading-relaxed">Each upfront build includes a free first month of the matching care tier, followed by the monthly fee shown below. Required care keeps your site hosted, secured, and maintained.</p>
              <div id="service-options-wrapper" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7 transition-colors" role="radiogroup" aria-labelledby="enquiry-plan-label" aria-describedby="enquiry-plan-hint enq-service-error">
                <div class="flex flex-col space-y-3">
                  <div 
                    data-plan-option="Basic Build"
                    tabindex="0"
                    role="radio"
                    aria-checked="false"
                    aria-label="Basic Build, 199 pounds upfront normally 499 pounds"
                    class="plan-option-card p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors relative flex flex-col justify-between text-left group overflow-hidden"
                  >
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="font-sans font-black text-[9px] uppercase tracking-widest text-blue-600">BASIC BUILD</span>
                      <div class="plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors">
                        <div class="plan-radio-dot w-2 h-2 rounded-full bg-blue-500 scale-0 transition-transform"></div>
                      </div>
                    </div>
                    <h4 class="font-sans font-extrabold text-slate-900 text-sm">Basic <span class="text-blue-600 font-normal">| £199 <span class="line-through text-slate-400 text-[11px]">£499</span></span></h4>
                  </div>
                  <ul class="space-y-1.5 text-[11px] text-slate-500 grow pl-1">
                    <li class="flex items-start gap-1.5">
                      <span class="text-blue-500 shrink-0 mt-0.5">✓</span>
                      <span>Custom single-page website with 5 sections</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-blue-500 shrink-0 mt-0.5">✓</span>
                      <span>Mobile + desktop responsive layout</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-blue-500 shrink-0 mt-0.5">✓</span>
                      <span>Basic on-page SEO and 30 day post-launch support</span>
                    </li>
                  </ul>
                </div>
                <div class="flex flex-col space-y-3">
                  <div 
                    data-plan-option="Standard Build"
                    tabindex="0"
                    role="radio"
                    aria-checked="false"
                    aria-label="Standard Build, 349 pounds upfront normally 799 pounds"
                    class="plan-option-card p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange cursor-pointer transition-colors relative flex flex-col justify-between text-left group overflow-hidden"
                  >
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="font-sans font-black text-[9px] uppercase tracking-widest text-brand-orange">STANDARD BUILD</span>
                      <div class="plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors">
                        <div class="plan-radio-dot w-2 h-2 rounded-full bg-brand-orange scale-0 transition-transform"></div>
                      </div>
                    </div>
                    <h4 class="font-sans font-extrabold text-slate-900 text-sm">Standard <span class="text-brand-orange font-normal">| £349 <span class="line-through text-slate-400 text-[11px]">£799</span></span></h4>
                  </div>
                  <ul class="space-y-1.5 text-[11px] text-slate-500 grow pl-1">
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-orange shrink-0 mt-0.5">✓</span>
                      <span>Everything in Basic plus up to 7 multi pages</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-orange shrink-0 mt-0.5">✓</span>
                      <span>Local SEO and Google Business Profile linking</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-orange shrink-0 mt-0.5">✓</span>
                      <span>Conversion polish and handover training</span>
                    </li>
                  </ul>
                </div>
                <div class="flex flex-col space-y-3">
                  <div 
                    data-plan-option="Premium Build"
                    tabindex="0"
                    role="radio"
                    aria-checked="false"
                    aria-label="Premium Build, 499 pounds upfront normally 1299 pounds"
                    class="plan-option-card p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-teal cursor-pointer transition-colors relative flex flex-col justify-between text-left group overflow-hidden"
                  >
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="font-sans font-black text-[9px] uppercase tracking-widest text-brand-teal">PREMIUM BUILD</span>
                      <div class="plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors">
                        <div class="plan-radio-dot w-2 h-2 rounded-full bg-brand-teal scale-0 transition-transform"></div>
                      </div>
                    </div>
                    <h4 class="font-sans font-extrabold text-slate-900 text-sm">Premium <span class="text-brand-teal font-normal">| £499 <span class="line-through text-slate-400 text-[11px]">£1299</span></span></h4>
                  </div>
                  <ul class="space-y-1.5 text-[11px] text-slate-500 grow pl-1">
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-teal shrink-0 mt-0.5">✓</span>
                      <span>Bespoke 12 page layouts, bookings and calendars</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-teal shrink-0 mt-0.5">✓</span>
                      <span>Priority build queue and 3 months growth care</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-teal shrink-0 mt-0.5">✓</span>
                      <span>Pre-launch performance and accessibility audit</span>
                    </li>
                  </ul>
                </div>
                <div class="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 pt-7 border-t border-slate-200">
                  <div class="flex flex-col space-y-3">
                    <div 
                      data-plan-option="Essential Care Retainer"
                      tabindex="0"
                      role="radio"
                      aria-checked="false"
                      aria-label="Essential Care Retainer, 9 pounds 99 per month"
                      class="plan-option-card p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer transition-colors relative flex flex-col justify-between text-left group overflow-hidden"
                    >
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="font-sans font-black text-[9px] uppercase tracking-widest text-slate-500">ESSENTIAL CARE</span>
                        <div class="plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors">
                          <div class="plan-radio-dot w-2 h-2 rounded-full bg-slate-500 scale-0 transition-transform"></div>
                        </div>
                      </div>
                      <h4 class="font-sans font-extrabold text-slate-900 text-sm">Essential Care <span class="text-slate-500 font-normal">| £9.99/mo</span></h4>
                    </div>
                    <ul class="space-y-1.5 text-[11px] text-slate-500 grow pl-1">
                      <li class="flex items-start gap-1.5">
                        <span class="text-slate-500 shrink-0 mt-0.5">✓</span>
                        <span>Secure UK hosting, SSL, and security updates</span>
                      </li>
                      <li class="flex items-start gap-1.5">
                        <span class="text-slate-500 shrink-0 mt-0.5">✓</span>
                      </li>
                      <li class="flex items-start gap-1.5">
                        <span class="text-slate-500 shrink-0 mt-0.5">✓</span>
                        <span>Standard email support (2–3 business days)</span>
                      </li>
                    </ul>
                  </div>
                  <div class="flex flex-col space-y-3">
                    <div 
                      data-plan-option="Growth Care Retainer"
                      tabindex="0"
                      role="radio"
                      aria-checked="false"
                      aria-label="Growth Care Retainer, 19 pounds 99 per month"
                      class="plan-option-card p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange cursor-pointer transition-colors relative flex flex-col justify-between text-left group overflow-hidden"
                    >
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="font-sans font-black text-[9px] uppercase tracking-widest text-brand-orange">GROWTH CARE</span>
                        <div class="plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors">
                          <div class="plan-radio-dot w-2 h-2 rounded-full bg-brand-orange scale-0 transition-transform"></div>
                        </div>
                      </div>
                      <h4 class="font-sans font-extrabold text-slate-900 text-sm">Growth Care <span class="text-brand-orange font-normal">| £19.99/mo</span></h4>
                    </div>
                    <ul class="space-y-1.5 text-[11px] text-slate-500 grow pl-1">
                      <li class="flex items-start gap-1.5"><span class="text-brand-orange shrink-0 mt-0.5">✓</span><span>Everything in Essential plus 6 updates</span></li>
                      <li class="flex items-start gap-1.5"><span class="text-brand-orange shrink-0 mt-0.5">✓</span><span>Monthly SEO check-ins and quarterly reviews</span></li>
                      <li class="flex items-start gap-1.5"><span class="text-brand-orange shrink-0 mt-0.5">✓</span><span>Priority email support (1–2 business days)</span></li>
                    </ul>
                  </div>
                  <div class="flex flex-col space-y-3">
                    <div 
                      data-plan-option="Pro Care Retainer"
                      tabindex="0"
                      role="radio"
                      aria-checked="false"
                      aria-label="Pro Care Retainer, 29 pounds 99 per month"
                      class="plan-option-card p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-teal cursor-pointer transition-colors relative flex flex-col justify-between text-left group overflow-hidden"
                    >
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="font-sans font-black text-[9px] uppercase tracking-widest text-brand-teal">PRO CARE</span>
                        <div class="plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors">
                          <div class="plan-radio-dot w-2 h-2 rounded-full bg-brand-teal scale-0 transition-transform"></div>
                        </div>
                      </div>
                      <h4 class="font-sans font-extrabold text-slate-900 text-sm">Pro Care <span class="text-brand-teal font-normal">| £29.99/mo</span></h4>
                    </div>
                    <ul class="space-y-1.5 text-[11px] text-slate-500 grow pl-1">
                      <li class="flex items-start gap-1.5"><span class="text-brand-teal shrink-0 mt-0.5">✓</span><span>Unlimited edits, A/B tests, and <24hr response</span></li>
                      <li class="flex items-start gap-1.5"><span class="text-brand-teal shrink-0 mt-0.5">✓</span><span>VIP email support (Guaranteed &lt; 24 hr)</span></li>
                      <li class="flex items-start gap-1.5"><span class="text-brand-teal shrink-0 mt-0.5">✓</span><span>3 hrs / mo of new feature development</span></li>
                    </ul>
                  </div>
                </div>
                <div class="md:col-span-3 pt-7 border-t border-slate-200">
                  <div
                    data-plan-option="Bespoke Project"
                    tabindex="0"
                    role="radio"
                    aria-checked="false"
                    aria-label="Bespoke Project or custom requirements"
                    class="plan-option-card group relative flex flex-col gap-4 overflow-hidden rounded-xl border-2 border-brand-orange/45 bg-white p-5 text-left text-slate-800 transition-colors hover:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange cursor-pointer md:flex-row md:items-center md:gap-6 shadow-sm"
                  >
                    <div class="absolute inset-0 bg-brand-orange/5 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative z-10 md:flex-1">
                      <span class="font-sans font-black text-[9px] uppercase tracking-[0.22em] text-brand-orange">BESPOKE · PROJECT</span>
                      <h4 class="font-sans font-extrabold text-slate-900 text-[13.5px] leading-tight mt-1">Bespoke / Custom Project</h4>
                      <p class="text-[11px] text-slate-600 leading-snug mt-1 max-w-md">Custom scoping, ecommerce, bookings and integrations · line-itemised quote.</p>
                    </div>
                    <ul class="relative z-10 space-y-1.5 text-[11px] text-slate-600 md:flex-1">
                      <li class="flex items-start gap-1.5"><span class="text-brand-orange shrink-0 mt-0.5">✓</span><span>Custom scoping, ecommerce and bookings</span></li>
                      <li class="flex items-start gap-1.5"><span class="text-brand-orange shrink-0 mt-0.5">✓</span><span>Line-itemised quote, itemised support</span></li>
                    </ul>
                    <div class="plan-radio-circle relative z-10 w-4.5 h-4.5 rounded-full border border-brand-orange/70 flex items-center justify-center bg-white transition-colors shrink-0">
                      <div class="plan-radio-dot w-2.5 h-2.5 rounded-full bg-brand-orange scale-0 shadow-[0_0_8px_rgba(251,146,60,0.65)] transition-transform"></div>
                    </div>
                  </div>
                </div>
              </div>
              <input id="enq-selected-service" type="hidden" name="service" value="${initialPlanVal}" required />
            </div>
          </section>
          <section id="enquiry-sec-additional" class="space-y-5 scroll-mt-6">
            <div class="border-b border-slate-100 pb-3">
              <h3 id="enquiry-message-heading" class="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Requirements</h3>
              <p id="enquiry-message-blurb" class="text-xs text-slate-400">Provide any specific needs, competitor examples, or timing details.</p>
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-message" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block"><span id="enquiry-message-label">Tell us about your requirements</span> <span class="text-brand-orange">*</span></label>
              <textarea id="enq-message" name="message" rows="4" required minlength="${String(MESSAGE_MIN_LENGTH)}" maxlength="${String(MESSAGE_MAX_LENGTH)}" placeholder="" class="${textAreaClass}"></textarea>
              <div class="form-field-error-slot min-h-5 -mt-1 pt-0"></div>
            </div>
            <input type="checkbox" name="botcheck" class="hidden" />
            <div class="pt-4 pb-4 space-y-3">
              <p id="enquiry-security-note" class="text-[11px] text-slate-400 leading-relaxed text-left">
                Your enquiry is sent securely to our business email and handled manually. We do not store submissions in a customer database. See our <button type="button" id="enq-privacy-link" class="text-brand-teal hover:underline font-bold bg-transparent border-none p-0 cursor-pointer">Privacy Policy</button> for details, including how to request access to or deletion of your data.
              </p>
              <button 
                id="enquiry-submit-btn" 
                type="submit" 
                class="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-bold p-3.5 rounded-lg text-xs cursor-pointer flex justify-center items-center gap-2 uppercase tracking-widest font-mono transition-colors border-none"
              >
                <span>Submit</span>
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  `;

  const triggerElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const restoreBodyScroll = lockBodyScroll();

  document.body.appendChild(container);

  const card = container.querySelector<HTMLElement>("#enquiry-modal-card");
  const closeBtn = container.querySelector<HTMLButtonElement>("#enquiry-modal-close-btn");
  const viewport = container.querySelector<HTMLElement>("#enquiry-content-viewport");
  const form = container.querySelector<HTMLFormElement>("#enquiry-multi-step-form");
  const hiddenServiceInput = container.querySelector<HTMLInputElement>("#enq-selected-service");
  const nameField = form?.querySelector<HTMLInputElement>("#enq-name") ?? null;
  const emailField = form?.querySelector<HTMLInputElement>("#enq-email") ?? null;
  const phoneField = form?.querySelector<HTMLInputElement>("#enq-phone") ?? null;
  const companyNameField = form?.querySelector<HTMLInputElement>("#enq-company-name") ?? null;
  const companyAddressField = form?.querySelector<HTMLInputElement>("#enq-company-address") ?? null;
  const messageField = form?.querySelector<HTMLTextAreaElement>("#enq-message") ?? null;
  const serviceWrapper = form?.querySelector<HTMLElement>("#service-options-wrapper");
  const serviceErrorMessage = form?.querySelector<HTMLElement>("#enq-service-error") ?? null;
  const contactSection = form?.querySelector<HTMLElement>("#enquiry-sec-contact") ?? null;
  const companySection = form?.querySelector<HTMLElement>("#enquiry-sec-company") ?? null;
  const serviceSection = form?.querySelector<HTMLElement>("#enquiry-sec-service") ?? null;
  const additionalSection = form?.querySelector<HTMLElement>("#enquiry-sec-additional") ?? null;
  const modeButtons = container.querySelectorAll<HTMLButtonElement>("[data-enquiry-mode]");
  const modeSwitch = container.querySelector<HTMLElement>("[data-enquiry-mode-switch]");
  const messageHeading = container.querySelector<HTMLElement>("#enquiry-message-heading");
  const messageBlurb = container.querySelector<HTMLElement>("#enquiry-message-blurb");
  const messageLabel = container.querySelector<HTMLElement>("#enquiry-message-label");
  const emailValidIndicator = container.querySelector<HTMLElement>("#enq-email-valid-indicator");
  const optionCards = container.querySelectorAll<HTMLElement>(".plan-option-card");
  let isClosing = false;
  let shouldPersistDraft = true;
  let lastFocusedFieldId = savedDraft?.lastFocusedFieldId ?? "";
  let emailValidationRequestId = 0;
  // Blocks the outgoing field's focusout validation from flashing an error while the mode toggle is being clicked.
  let isSwitchingEnquiryMode = false;
  const restorableFieldIds = new Set([
    "enq-name",
    "enq-email",
    "enq-phone",
    "enq-company-name",
    "enq-company-address",
    "enq-message",
  ]);

  const applyEnquiryMode = (mode: "standard" | "care"): void => {
    if (messageField) {
      if (enquiryMode === "standard") {
        standardMessageBuffer = messageField.value;
      } else {
        careMessageBuffer = messageField.value;
      }
    }
    enquiryMode = mode;
    const isStandard = mode === "standard";
    modeSwitch?.setAttribute("data-active-mode", mode);
    form?.classList.toggle("enquiry-form-standard", isStandard);
    const phoneWrapper = phoneField?.closest(".space-y-1");
    if (phoneWrapper) phoneWrapper.toggleAttribute("hidden", isStandard);
    companySection?.toggleAttribute("hidden", isStandard);
    serviceSection?.toggleAttribute("hidden", isStandard);
    messageHeading && (messageHeading.textContent = isStandard ? "Message" : "Requirements");
    messageLabel &&
      (messageLabel.textContent = isStandard ? "Message" : "Tell us about your requirements");
    messageBlurb?.toggleAttribute("hidden", isStandard);
    if (messageField) {
      messageField.value = isStandard ? standardMessageBuffer : careMessageBuffer;
      messageField.placeholder = isStandard
        ? ""
        : "Describe your trade, what features you need on your new website, any design guidelines or competitor sites you like...";
    }
    if (hiddenServiceInput) {
      hiddenServiceInput.value = isStandard ? "Standard Enquiry" : buildServiceValue();
    }
    clearFormErrors(form);
    clearServiceError();
    modeButtons.forEach((button) => {
      const active = button.dataset.enquiryMode === mode;
      button.setAttribute("aria-selected", String(active));
      button.className = active
        ? "relative z-10 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-brand-teal transition-colors"
        : "relative z-10 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-800";
    });
  };

  modeButtons.forEach((button) => {
    button.addEventListener("pointerdown", () => {
      isSwitchingEnquiryMode = true;
    });
    button.addEventListener("click", () => {
      applyEnquiryMode(button.dataset.enquiryMode === "care" ? "care" : "standard");
      isSwitchingEnquiryMode = false;
    });
  });
  const buildDraft = (): EnquiryDraft => {
    if (messageField) {
      if (enquiryMode === "standard") {
        standardMessageBuffer = messageField.value;
      } else {
        careMessageBuffer = messageField.value;
      }
    }
    return {
      name: nameField?.value ?? "",
      email: emailField?.value ?? "",
      phone: phoneField?.value ?? "",
      companyName: companyNameField?.value ?? "",
      companyAddress: companyAddressField?.value ?? "",
      service: hiddenServiceInput?.value ?? "",
      messageStandard: standardMessageBuffer,
      messageCare: careMessageBuffer,
      lastFocusedFieldId:
        document.activeElement instanceof HTMLElement &&
        restorableFieldIds.has(document.activeElement.id)
          ? document.activeElement.id
          : lastFocusedFieldId,
      scrollTop: viewport?.scrollTop ?? 0,
    };
  };

  const persistDraft = (): void => {
    saveEnquiryDraft(buildDraft());
  };

  const scrollViewportToTop = (behavior: ScrollBehavior): void => {
    viewport?.scrollTo({ top: 0, behavior });
  };

  const scrollViewportToElement = (
    target: Element | null,
    options?: {
      offset?: number;
      behavior?: ScrollBehavior;
      align?: "top" | "bottom";
    },
  ): void => {
    if (!viewport || !target) {
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const behavior = options?.behavior ?? "smooth";
    let scrollTop = viewport.scrollTop;

    if (options?.align === "bottom") {
      const bottomOffset = options?.offset ?? 36;
      scrollTop += targetRect.bottom - viewportRect.top - viewport.clientHeight + bottomOffset;
    } else {
      const topOffset = options?.offset ?? 32;
      scrollTop += targetRect.top - viewportRect.top - topOffset;
    }

    viewport.scrollTo({ top: Math.max(0, scrollTop), behavior });
  };

  const positionViewportForField = (
    fieldId: string | null,
    options?: {
      behavior?: ScrollBehavior;
      fallbackScrollTop?: number | null;
    },
  ): void => {
    const behavior = options?.behavior ?? "smooth";

    switch (fieldId) {
      case "enq-name":
      case "enq-email":
        scrollViewportToTop(behavior);
        return;
      case "enq-phone":
        scrollViewportToElement(contactSection, {
          offset: 24,
          behavior,
        });
        return;
      case "enq-company-name":
      case "enq-company-address":
        scrollViewportToElement(companySection, {
          offset: 24,
          behavior,
        });
        return;
      case "enq-message":
        scrollViewportToElement(additionalSection, {
          offset: 24,
          behavior,
        });
        return;
      case "enq-service":
        scrollViewportToElement(serviceSection ?? serviceWrapper ?? null, {
          offset: 24,
          behavior,
        });
        return;
      default:
        if (viewport && typeof options?.fallbackScrollTop === "number") {
          viewport.scrollTo({
            top: Math.max(0, options.fallbackScrollTop),
            behavior,
          });
        }
    }
  };

  const clearServiceError = (): void => {
    serviceWrapper?.classList.remove(
      "group-invalid",
      "border-red-500",
      "border-rose-300",
      "bg-rose-50/40",
      "ring-1",
      "ring-rose-200",
    );
    serviceWrapper?.removeAttribute("aria-invalid");
    serviceWrapper?.removeAttribute("aria-errormessage");

    if (serviceErrorMessage) {
      serviceErrorMessage.textContent = "";
      serviceErrorMessage.classList.add("hidden");
      serviceErrorMessage.classList.remove("inline-flex");
    }
  };

  // Build and care plans can both be selected at once; picking Bespoke clears everything else.
  type PlanAccent = "blue" | "orange" | "teal" | "slate";

  const PLAN_ACCENTS: Record<string, PlanAccent> = {
    "Basic Build": "blue",
    "Standard Build": "orange",
    "Premium Build": "teal",
    "Bespoke Project": "orange",
    "Essential Care Retainer": "slate",
    "Growth Care Retainer": "orange",
    "Pro Care Retainer": "teal",
  };

  const PLAN_ACCENT_COLORS: Record<PlanAccent, { border: string; bg: string }> = {
    blue: { border: "#3b82f6", bg: "rgb(59 130 246 / 8%)" },
    orange: { border: "var(--brand-orange)", bg: "var(--brand-orange-soft)" },
    teal: { border: "var(--brand-teal)", bg: "var(--brand-teal-overlay-8)" },
    slate: { border: "var(--color-slate-500)", bg: "rgb(100 116 139 / 8%)" },
  };

  const BUILD_PLAN_NAMES = new Set(["Basic Build", "Standard Build", "Premium Build"]);
  const CARE_PLAN_NAMES = new Set([
    "Essential Care Retainer",
    "Growth Care Retainer",
    "Pro Care Retainer",
  ]);
  const BESPOKE_PLAN_NAME = "Bespoke Project";

  let selectedBuildPlan: string | null = null;
  let selectedCarePlan: string | null = null;
  let selectedBespoke = false;

  const setCardSelected = (card: HTMLElement, isSelected: boolean): void => {
    const planName = card.getAttribute("data-plan-option") ?? "";
    const colors = PLAN_ACCENT_COLORS[PLAN_ACCENTS[planName] ?? "teal"];
    const radioCircle = card.querySelector<HTMLElement>(".plan-radio-circle");
    const radioDot = card.querySelector<HTMLElement>(".plan-radio-dot");

    card.setAttribute("aria-checked", isSelected ? "true" : "false");
    card.style.borderColor = isSelected ? colors.border : "";
    card.style.backgroundColor = isSelected ? colors.bg : "";
    if (radioCircle) radioCircle.style.borderColor = isSelected ? colors.border : "";
    if (radioDot) {
      radioDot.classList.toggle("scale-0", !isSelected);
      radioDot.classList.toggle("scale-100", isSelected);
    }
  };

  const buildServiceValue = (): string =>
    selectedBespoke
      ? BESPOKE_PLAN_NAME
      : [selectedBuildPlan, selectedCarePlan].filter(Boolean).join(" + ");

  const applyServiceSelection = (): void => {
    const activePlans = new Set(
      selectedBespoke
        ? [BESPOKE_PLAN_NAME]
        : [selectedBuildPlan, selectedCarePlan].filter((plan): plan is string => Boolean(plan)),
    );

    if (hiddenServiceInput) {
      hiddenServiceInput.value = buildServiceValue();
    }
    if (activePlans.size > 0) {
      clearServiceError();
    }

    optionCards.forEach((card) => {
      const planName = card.getAttribute("data-plan-option");
      setCardSelected(card, Boolean(planName && activePlans.has(planName)));
    });

    persistDraft();
  };

  const applyInitialSelection = (planName: string | null): void => {
    selectedBuildPlan = null;
    selectedCarePlan = null;
    selectedBespoke = false;

    (planName || "")
      .split("+")
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((plan) => {
        if (plan === BESPOKE_PLAN_NAME) {
          selectedBespoke = true;
        } else if (BUILD_PLAN_NAMES.has(plan)) {
          selectedBuildPlan = plan;
        } else if (CARE_PLAN_NAMES.has(plan)) {
          selectedCarePlan = plan;
        }
      });

    if (selectedBespoke) {
      selectedBuildPlan = null;
      selectedCarePlan = null;
    }

    applyServiceSelection();
  };

  const togglePlanSelection = (planName: string): void => {
    if (planName === BESPOKE_PLAN_NAME) {
      selectedBespoke = !selectedBespoke;
      if (selectedBespoke) {
        selectedBuildPlan = null;
        selectedCarePlan = null;
      }
    } else if (BUILD_PLAN_NAMES.has(planName)) {
      selectedBespoke = false;
      selectedBuildPlan = selectedBuildPlan === planName ? null : planName;
    } else if (CARE_PLAN_NAMES.has(planName)) {
      selectedBespoke = false;
      selectedCarePlan = selectedCarePlan === planName ? null : planName;
    }
    applyServiceSelection();
  };

  applyEnquiryMode(enquiryMode);

  const showServiceError = (message: string): void => {
    serviceWrapper?.classList.add(
      "group-invalid",
      "border-red-500",
      "border-rose-300",
      "bg-rose-50/40",
      "ring-1",
      "ring-rose-200",
    );
    serviceWrapper?.setAttribute("aria-invalid", "true");
    serviceWrapper?.setAttribute("aria-errormessage", "enq-service-error");

    if (serviceErrorMessage) {
      serviceErrorMessage.textContent = message;
      serviceErrorMessage.classList.remove("hidden");
      serviceErrorMessage.classList.add("inline-flex");
    }
  };

  const hideEmailValidIndicator = (): void => {
    emailValidIndicator?.classList.add("hidden");
    emailValidIndicator?.classList.remove("flex");
  };

  const showEmailValidIndicator = (): void => {
    emailValidIndicator?.classList.remove("hidden");
    emailValidIndicator?.classList.add("flex");
  };

  const showEmailSuggestionError = (userPrefix: string, suggestedDomain: string): void => {
    if (!emailField) {
      return;
    }

    const suggestedEmail = `${userPrefix}@${suggestedDomain}`;
    showFieldError(emailField, `Did you mean ${suggestedEmail}?`, {
      tone: "notice",
      iconText: "?",
      renderMessage: (messageEl: HTMLSpanElement) => {
        messageEl.append("Did you mean ");

        const suggestionButton = document.createElement("button");
        suggestionButton.type = "button";
        suggestionButton.className =
          "font-bold text-blue-600 underline underline-offset-2 decoration-blue-600 bg-transparent border-none p-0 cursor-pointer";
        suggestionButton.textContent = suggestedEmail;
        suggestionButton.addEventListener("click", () => {
          emailValidationRequestId += 1;
          emailField.value = suggestedEmail;
          emailField.dataset.touched = "true";
          clearFieldError(emailField);
          clearFieldValidState(emailField);
          hideEmailValidIndicator();
          persistDraft();
          emailField.dispatchEvent(new Event("input", { bubbles: true }));
          emailField.dispatchEvent(new Event("change", { bubbles: true }));
          void validateEmailField({ allowEmpty: true }).catch(() => {
            // no-op
          });
          emailField.blur();
        });

        messageEl.append(suggestionButton, "?");
      },
    });
  };

  const clearFieldErrorOnFocus = (field: HTMLElement | null): void => {
    clearFieldError(field);
    clearFieldValidState(field);
  };

  const isNameValid = (): boolean => {
    const nameValue = nameField?.value?.trim() || "";
    const allowedNamePattern = /^[\p{L}' -]+$/u;
    if (!allowedNamePattern.test(nameValue)) {
      return false;
    }

    const nameParts = nameValue.split(/\s+/).filter((part) => part.length > 0);
    return (
      nameParts.length >= 2 &&
      nameParts.every((part) => /[\p{L}]{1,}/u.test(part.replace(/['-]/g, "")))
    );
  };

  const isOptionalBusinessFieldValid = (
    field: HTMLInputElement | null,
    maxLength: number,
  ): boolean => {
    const rawValue = field?.value ?? "";
    const trimmedValue = rawValue.trim();

    if (!trimmedValue) {
      return true;
    }

    return trimmedValue.length <= maxLength && BUSINESS_FIELD_ALLOWED_PATTERN.test(trimmedValue);
  };

  const isPhoneFieldValid = (): boolean => {
    const trimmedValue = phoneField?.value?.trim() || "";

    if (!trimmedValue) {
      return true;
    }

    return trimmedValue.length <= PHONE_MAX_LENGTH && PHONE_ALLOWED_PATTERN.test(trimmedValue);
  };

  const isMessageValid = (): boolean => {
    const trimmedValue = messageField?.value?.trim() || "";

    return trimmedValue.length >= MESSAGE_MIN_LENGTH && trimmedValue.length <= MESSAGE_MAX_LENGTH;
  };

  const validateNameField = (): boolean => {
    clearFieldValidState(nameField);
    clearFieldError(nameField);

    if (!nameField) {
      return false;
    }

    if (!nameField.value.trim()) {
      showFieldError(nameField, "Please enter your first and last name.");
      return false;
    }

    if (isNameValid()) {
      return true;
    }

    showFieldError(
      nameField,
      "Please enter at least your first and last name (middle names and initials are fine).",
    );

    return false;
  };

  const validateMessageField = (): boolean => {
    clearFieldValidState(messageField);
    clearFieldError(messageField);

    if (!messageField) {
      return false;
    }

    if (!messageField.value.trim()) {
      showFieldError(
        messageField,
        enquiryMode === "standard"
          ? `Please make sure your message is at least ${MESSAGE_MIN_LENGTH} characters.`
          : `Please describe your project requirements in ${MESSAGE_MIN_LENGTH}-${MESSAGE_MAX_LENGTH} characters.`,
      );
      return false;
    }

    if (isMessageValid()) {
      return true;
    }

    showFieldError(
      messageField,
      enquiryMode === "standard"
        ? `Please make sure your message is at least ${MESSAGE_MIN_LENGTH} characters.`
        : `Please describe your project requirements in ${MESSAGE_MIN_LENGTH}-${MESSAGE_MAX_LENGTH} characters.`,
    );

    return false;
  };

  const validatePhoneField = (): boolean => {
    clearFieldValidState(phoneField);
    clearFieldError(phoneField);

    if (!phoneField) {
      return true;
    }

    if (!phoneField.value.trim()) {
      return true;
    }

    if (isPhoneFieldValid()) {
      return true;
    }

    showFieldError(phoneField, "Please enter a valid phone number.");

    return false;
  };

  const validateCompanyNameField = (): boolean => {
    clearFieldValidState(companyNameField);
    clearFieldError(companyNameField);

    if (!companyNameField) {
      return true;
    }

    if (!companyNameField.value.trim()) {
      return true;
    }

    if (isOptionalBusinessFieldValid(companyNameField, COMPANY_NAME_MAX_LENGTH)) {
      return true;
    }

    showFieldError(
      companyNameField,
      `Use letters, numbers, spaces, and basic punctuation only, up to ${COMPANY_NAME_MAX_LENGTH} characters.`,
    );

    return false;
  };

  const validateCompanyAddressField = (): boolean => {
    clearFieldValidState(companyAddressField);
    clearFieldError(companyAddressField);

    if (!companyAddressField) {
      return true;
    }

    if (!companyAddressField.value.trim()) {
      return true;
    }

    if (isOptionalBusinessFieldValid(companyAddressField, COMPANY_ADDRESS_MAX_LENGTH)) {
      return true;
    }

    showFieldError(
      companyAddressField,
      `Use letters, numbers, spaces, and basic punctuation only, up to ${COMPANY_ADDRESS_MAX_LENGTH} characters.`,
    );

    return false;
  };

  const validateEmailField = async (options: ValidateEmailFieldOptions = {}): Promise<boolean> => {
    const requestId = ++emailValidationRequestId;
    clearFieldError(emailField);
    clearFieldValidState(emailField);
    hideEmailValidIndicator();

    const rawEmailValue = emailField?.value?.trim() || "";
    const emailValue = rawEmailValue.toLowerCase();
    if (!emailValue) {
      if (!options.allowEmpty && emailField) {
        showFieldError(emailField, "Please enter a valid email address.");
      }
      return false;
    }

    const emailParts = rawEmailValue.split("@");
    let hasSuggestionNotice = false;
    if (emailParts.length === 2) {
      const [userPrefix, rawDomain] = emailParts;
      const suggestedDomain = checkEmailSuggestion(rawDomain.trim().toLowerCase());

      if (emailField && userPrefix && suggestedDomain) {
        showEmailSuggestionError(userPrefix, suggestedDomain);
        hasSuggestionNotice = true;
      }
    }

    if (!validateEmailManually(emailValue)) {
      if (emailField) {
        showFieldError(emailField, "Please enter a valid email address.");
      }
      return false;
    }

    const disposableDomains = await getDisposableEmailDomains();
    if (!container.isConnected || requestId !== emailValidationRequestId) {
      return false;
    }

    if (disposableDomains && emailUsesDisposableDomain(emailValue, disposableDomains)) {
      if (emailField) {
        showFieldError(emailField, "Disposable email addresses are not accepted.");
      }
      return false;
    }

    if (hasSuggestionNotice) {
      return true;
    }

    clearFieldError(emailField);
    showEmailValidIndicator();
    return true;
  };

  const closeModal = (options?: {
    persistDraft?: boolean;
    restoreFocus?: boolean;
    onClosed?: () => void;
  }): void => {
    if (isClosing) {
      return;
    }

    isClosing = true;
    container.classList.remove("animate-fade-in");
    container.classList.add("animate-fade-out");
    if (card) {
      card.classList.remove("animate-slide-in-up");
      card.classList.add("animate-slide-out-down");
    }
    if (
      options?.restoreFocus !== false &&
      triggerElement &&
      typeof triggerElement.focus === "function"
    ) {
      triggerElement.focus();
    }
    setTimeout(() => {
      if ((options?.persistDraft ?? shouldPersistDraft) && form) {
        persistDraft();
      }
      restoreBodyScroll();
      container.remove();
      options?.onClosed?.();
    }, 300);
  };

  closeBtn?.addEventListener("click", () => closeModal());

  const recentGroups: Record<
    RecentEnquiryInputKey,
    {
      field: HTMLInputElement | null | undefined;
      dropdown: HTMLElement | null;
      group: HTMLElement | null;
    }
  > = {
    name: {
      field: nameField,
      group: container.querySelector<HTMLElement>('[data-recent-input-group="name"]'),
      dropdown: container.querySelector<HTMLElement>('[data-recent-dropdown="name"]'),
    },
    email: {
      field: emailField,
      group: container.querySelector<HTMLElement>('[data-recent-input-group="email"]'),
      dropdown: container.querySelector<HTMLElement>('[data-recent-dropdown="email"]'),
    },
    phone: {
      field: phoneField,
      group: container.querySelector<HTMLElement>('[data-recent-input-group="phone"]'),
      dropdown: container.querySelector<HTMLElement>('[data-recent-dropdown="phone"]'),
    },
    companyName: {
      field: companyNameField,
      group: container.querySelector<HTMLElement>('[data-recent-input-group="companyName"]'),
      dropdown: container.querySelector<HTMLElement>('[data-recent-dropdown="companyName"]'),
    },
    companyAddress: {
      field: companyAddressField,
      group: container.querySelector<HTMLElement>('[data-recent-input-group="companyAddress"]'),
      dropdown: container.querySelector<HTMLElement>('[data-recent-dropdown="companyAddress"]'),
    },
  };

  const showRecentDropdown = (key: RecentEnquiryInputKey): void => {
    const { dropdown, field, group } = recentGroups[key];
    if (!dropdown || !field) return;
    const currentValue = field.value.trim().toLowerCase();
    const items = getRecentEnquiryInputsForKey(key);
    const available = items.filter((v) => v.trim().toLowerCase() !== currentValue);
    if (!available.length) {
      hideRecentDropdown(key);
      return;
    }
    group?.setAttribute("data-recent-dropdown-open", "true");
    dropdown.classList.remove("hidden");
    dropdown.classList.add("block");
  };
  const hideRecentDropdown = (key: RecentEnquiryInputKey): void => {
    const { dropdown, group } = recentGroups[key];
    group?.removeAttribute("data-recent-dropdown-open");
    if (!dropdown) return;
    dropdown.classList.add("hidden");
    dropdown.classList.remove("block");
  };
  const clearFieldRuntimeState = (field: HTMLInputElement | null | undefined) => {
    if (!field) return;
    delete field.dataset.touched;
    clearFieldError(field);
    clearFieldValidState(field);
  };

  (Object.keys(recentGroups) as RecentEnquiryInputKey[]).forEach((key) => {
    const { field, dropdown, group } = recentGroups[key];
    if (!field) return;
    field.addEventListener("focus", () => showRecentDropdown(key));
    field.addEventListener("blur", (e) => {
      const target = e.relatedTarget as HTMLElement | null;
      if (target && group && group.contains(target)) return;
      hideRecentDropdown(key);
    });
    field.addEventListener("input", () => {
      const currentValue = field.value.trim().toLowerCase();
      const anyDiff = getRecentEnquiryInputsForKey(key).some(
        (v) => v.trim().toLowerCase() !== currentValue,
      );
      if (!anyDiff) hideRecentDropdown(key);
    });
    if (dropdown) {
      dropdown.addEventListener("mousedown", (e) => {
        if (e.target instanceof HTMLElement && e.target.closest("button")) {
          e.preventDefault();
        }
      });
    }
  });

  container.querySelectorAll<HTMLButtonElement>("[data-recent-apply]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.recentApply as RecentEnquiryInputKey;
      const value = btn.dataset.recentApplyValue ?? "";
      const { field } = recentGroups[key];
      if (!field || !value) return;
      field.value = value;
      clearFieldRuntimeState(field);
      if (key === "email") hideEmailValidIndicator();
      hideRecentDropdown(key);
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
      field.blur();
    });
  });

  container.querySelectorAll<HTMLButtonElement>("[data-recent-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.recentRemove as RecentEnquiryInputKey;
      const value = btn.dataset.recentRemoveValue ?? "";
      if (!value) return;
      const { group, field } = recentGroups[key];
      const row = btn.closest('[data-recent-row="' + key + '"]');
      row?.remove();
      removeRecentEnquiryInput(key, value);
      const stillHasAny = group
        ? group.querySelectorAll<HTMLElement>('[data-recent-row="' + key + '"]').length > 0
        : false;
      if (!stillHasAny) hideRecentDropdown(key);
      if (field && field.value.trim() === value.trim()) {
        clearFieldRuntimeState(field);
        if (key === "email") hideEmailValidIndicator();
      }
    });
  });

  let mousedownOnBackdrop = false;
  container.addEventListener("mousedown", (e: MouseEvent) => {
    mousedownOnBackdrop = e.target === container;
  });
  container.addEventListener("click", (e: MouseEvent) => {
    if (e.target === container && mousedownOnBackdrop) {
      closeModal();
    }
  });

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      closeModal();
      return;
    }

    trapFocusWithin(container, e);
  };
  window.addEventListener("keydown", handleKeyDown);
  void getDisposableEmailDomains();

  optionCards.forEach((c) => {
    c.addEventListener("click", () => {
      const planVal = c.getAttribute("data-plan-option");
      if (!planVal) {
        return;
      }

      togglePlanSelection(planVal);
    });
    c.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const planVal = c.getAttribute("data-plan-option");
        if (!planVal) {
          return;
        }

        togglePlanSelection(planVal);
      }
    });
  });

  if (savedDraft) {
    if (nameField) {
      nameField.value = savedDraft.name;
    }
    if (emailField) {
      emailField.value = savedDraft.email;
    }
    if (phoneField) {
      phoneField.value = savedDraft.phone;
    }
    if (companyNameField) {
      companyNameField.value = savedDraft.companyName;
    }
    if (companyAddressField) {
      companyAddressField.value = savedDraft.companyAddress;
    }
    if (messageField) {
      messageField.value =
        enquiryMode === "standard" ? savedDraft.messageStandard : savedDraft.messageCare;
    }
  }

  applyInitialSelection(initialPlanVal);

  let preferredFocusSelector =
    modalOptions.preferredFocusId || savedDraft?.lastFocusedFieldId || "enq-name";
  let initialFallbackScrollTop: number | null = savedDraft?.scrollTop ?? null;

  if (hasExplicitInitialPlan) {
    // When user clicked a pricing "Enquire" CTA, force the modal to open
    // at the FIRST REQUIRED UNANSWERED field (usually the very top — name),
    // instead of restoring draft scroll position / last focus id which could
    // leave the modal scrolled to the bottom (e.g. a previously-used "Bespoke"
    // draft focus on the message field).
    const nameEmpty = !nameField?.value?.trim();
    const emailEmpty = !emailField?.value?.trim();
    const messageEmpty = !messageField?.value?.trim();
    const serviceEmpty = !hiddenServiceInput?.value?.trim();

    if (nameEmpty) {
      preferredFocusSelector = "enq-name";
    } else if (emailEmpty) {
      preferredFocusSelector = "enq-email";
    } else if (enquiryMode === "care" && serviceEmpty) {
      preferredFocusSelector = "enq-service";
    } else if (messageEmpty) {
      preferredFocusSelector = "enq-message";
    } else {
      preferredFocusSelector = "enq-name";
    }
    initialFallbackScrollTop = 0;
  }

  focusFirstElement(container, `#${preferredFocusSelector}`);
  window.setTimeout(() => {
    positionViewportForField(preferredFocusSelector, {
      behavior: "auto",
      fallbackScrollTop: initialFallbackScrollTop,
    });
  }, 80);

  const handleNameInput = (): void => {
    persistDraft();
  };

  const handleMessageInput = (): void => {
    persistDraft();
  };

  const handleCompanyFieldInput = (): void => {
    persistDraft();
  };

  const handlePhoneInput = (): void => {
    persistDraft();
  };

  const handleEmailInput = (): void => {
    persistDraft();
  };

  const handleEmailFocus = (): void => {
    emailValidationRequestId += 1;
    clearFieldError(emailField);
    clearFieldValidState(emailField);
    hideEmailValidIndicator();
  };

  const handleFormEnterKey = (event: KeyboardEvent): void => {
    if (
      event.key !== "Enter" ||
      event.defaultPrevented ||
      event.isComposing ||
      !(event.target instanceof HTMLElement)
    ) {
      return;
    }

    if (event.target.closest("#service-options-wrapper")) {
      return;
    }

    if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) {
      return;
    }

    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLSelectElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      event.preventDefault();
      event.target.blur();
    }
  };

  form?.addEventListener("keydown", handleFormEnterKey);

  nameField?.addEventListener("input", handleNameInput);
  nameField?.addEventListener("focus", () => {
    clearFieldErrorOnFocus(nameField);
  });
  nameField?.addEventListener("focusout", () => {
    if (!nameField) {
      return;
    }

    nameField.dataset.touched = "true";
    persistDraft();
    if (isSwitchingEnquiryMode) {
      return;
    }
    validateNameField();
  });

  emailField?.addEventListener("input", handleEmailInput);
  emailField?.addEventListener("focus", handleEmailFocus);
  emailField?.addEventListener("focusout", () => {
    if (!emailField) {
      return;
    }

    persistDraft();
    emailField.dataset.touched = "true";
    if (isSwitchingEnquiryMode) {
      return;
    }
    void validateEmailField();
  });

  phoneField?.addEventListener("input", handlePhoneInput);
  phoneField?.addEventListener("focus", () => {
    clearFieldErrorOnFocus(phoneField);
  });
  phoneField?.addEventListener("focusout", () => {
    persistDraft();
    if (isSwitchingEnquiryMode) {
      return;
    }
    validatePhoneField();
  });

  messageField?.addEventListener("input", handleMessageInput);
  messageField?.addEventListener("focus", () => {
    clearFieldErrorOnFocus(messageField);
  });
  messageField?.addEventListener("focusout", () => {
    if (!messageField) {
      return;
    }

    messageField.dataset.touched = "true";
    persistDraft();
    if (isSwitchingEnquiryMode) {
      return;
    }
    validateMessageField();
  });

  companyNameField?.addEventListener("input", handleCompanyFieldInput);
  companyNameField?.addEventListener("focus", () => {
    clearFieldErrorOnFocus(companyNameField);
  });
  companyNameField?.addEventListener("focusout", () => {
    persistDraft();
    if (isSwitchingEnquiryMode) {
      return;
    }
    validateCompanyNameField();
  });

  companyAddressField?.addEventListener("input", handleCompanyFieldInput);
  companyAddressField?.addEventListener("focus", () => {
    clearFieldErrorOnFocus(companyAddressField);
  });
  companyAddressField?.addEventListener("focusout", () => {
    persistDraft();
    if (isSwitchingEnquiryMode) {
      return;
    }
    validateCompanyAddressField();
  });

  [hiddenServiceInput].forEach((field) => {
    field?.addEventListener("input", persistDraft);
    field?.addEventListener("change", persistDraft);
  });

  viewport?.addEventListener("scroll", persistDraft, { passive: true });
  form?.addEventListener("focusin", (event: FocusEvent) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target || !restorableFieldIds.has(target.id)) {
      return;
    }

    lastFocusedFieldId = target.id;
    saveEnquiryDraft({
      ...buildDraft(),
      lastFocusedFieldId: target.id,
    });
  });

  container.querySelector("#enq-privacy-link")?.addEventListener("click", async () => {
    const { openLegalModal } = await import("./LegalModal");
    closeModal({
      restoreFocus: false,
      persistDraft: true,
      onClosed: () => {
        openLegalModal("privacy", {
          restoreFocus: false,
          onCloseComplete: () => {
            openEnquiryModal({
              restoreDraft: true,
            });
          },
        });
      },
    });
  });

  form?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    clearFormErrors(form);
    clearServiceError();
    const enqEmail = emailField?.value?.trim() || "";
    const enqService = hiddenServiceInput?.value?.trim() || "";
    nameField && (nameField.dataset.touched = "true");
    emailField && (emailField.dataset.touched = "true");
    messageField && (messageField.dataset.touched = "true");

    const [isNameFieldValid, isEmailFieldValid] = await Promise.all([
      Promise.resolve(validateNameField()),
      validateEmailField(),
    ]);
    const hasTopRowValidationErrors = !isNameFieldValid || !isEmailFieldValid;

    if (hasTopRowValidationErrors) {
      if (!isNameFieldValid) {
        positionViewportForField("enq-name");
      } else if (!isEmailFieldValid) {
        positionViewportForField("enq-email");
      }
      return;
    }

    if (enquiryMode === "care") {
      const isPhoneFieldValidResult = validatePhoneField();
      if (!isPhoneFieldValidResult) {
        positionViewportForField("enq-phone");
        return;
      }

      const isCompanyNameFieldValid = validateCompanyNameField();
      const isCompanyAddressFieldValid = validateCompanyAddressField();
      if (!isCompanyNameFieldValid || !isCompanyAddressFieldValid) {
        if (!isCompanyNameFieldValid) {
          positionViewportForField("enq-company-name");
        } else if (!isCompanyAddressFieldValid) {
          positionViewportForField("enq-company-address");
        }
        return;
      }

      if (!enqService) {
        showServiceError("Please pick one of the available care or build options.");
        positionViewportForField("enq-service");
        return;
      }
    }

    const isMessageFieldValid = validateMessageField();
    if (!isMessageFieldValid) {
      positionViewportForField("enq-message");
      return;
    }

    const submitBtn = form.querySelector<HTMLButtonElement>("#enquiry-submit-btn");
    if (!submitBtn) return;
    const originalBtnHTML = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";
    submitBtn.style.cursor = "not-allowed";
    const btnSpan = submitBtn.querySelector<HTMLElement>("span");
    if (btnSpan) {
      btnSpan.textContent = "Sending...";
    }
    form.querySelector("#enq-error-alert")?.remove();

    const isCareEnquiry = enquiryMode === "care";
    const referenceId = isCareEnquiry ? buildReferenceId(enqService) : buildStandardReferenceId();

    const formData = new FormData(form);
    const targetNameValue = formData.get("name")?.toString().trim();
    if (targetNameValue) {
      formData.append("from_name", targetNameValue);
    }
    formData.set("Reference ID", referenceId);
    if (!isCareEnquiry) {
      for (const key of [...formData.keys()]) {
        if (
          !new Set(["name", "email", "message", "from_name", "Reference ID", "access_key"]).has(key)
        ) {
          formData.delete(key);
        }
      }
    }

    [
      ["enq-phone", "phone"],
      ["enq-company-name", "companyName"],
      ["enq-company-address", "Company Address"],
    ].forEach(([fieldId, fieldName]) => {
      const field = form.querySelector<HTMLInputElement>(`#${fieldId}`);
      if (!field?.value.trim()) {
        formData.delete(fieldName);
      }
    });

    const companyAddressValue = formData.get("Company Address")?.toString().trim();
    if (companyAddressValue) {
      formData.set("Company Address", companyAddressValue);
    }

    const extraFields: Record<string, string> = isCareEnquiry
      ? { subject: `New Services Enquiry on your website - ${referenceId}` }
      : { subject: `New Question Submitted on your site - ${referenceId}` };

    try {
      await submitWeb3Form(formData, extraFields);
      saveSavedEnquiryIdentity({
        name: nameField?.value?.trim() ?? "",
        email: emailField?.value?.trim() ?? "",
        savedAt: Date.now(),
      });
      appendRecentEnquiryInput("name", nameField?.value ?? "");
      appendRecentEnquiryInput("email", emailField?.value ?? "");
      appendRecentEnquiryInput("phone", phoneField?.value ?? "");
      appendRecentEnquiryInput("companyName", companyNameField?.value ?? "");
      appendRecentEnquiryInput("companyAddress", companyAddressField?.value ?? "");
      standardMessageBuffer = "";
      careMessageBuffer = "";
      shouldPersistDraft = false;
      clearEnquiryDraft();
      form.reset();
      nameField && delete nameField.dataset.touched;
      emailField && delete emailField.dataset.touched;
      messageField && delete messageField.dataset.touched;
      clearFormErrors(form);
      clearServiceError();
      clearFieldValidState(emailField);
      hideEmailValidIndicator();
      applyInitialSelection(null);
      closeModal({
        persistDraft: false,
        onClosed: () => {
          showEnquirySuccessBanner(enqEmail, referenceId);
        },
      });
    } catch (error: unknown) {
      console.error("[Septen Enquiry Error] Submission failed:", error);
      submitBtn.disabled = false;
      submitBtn.style.opacity = "";
      submitBtn.style.cursor = "";
      submitBtn.innerHTML = originalBtnHTML;

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while transmitting your project details securely. Please verify your connection or reach out to septen.digital@gmail.com directly.";

      const errorAlert = showFormAlert(
        form,
        `<p class="font-bold mb-1">Enquiry Delivery Failed</p><p class="text-[11px] text-rose-700">${formatSupportEmailMarkup(errorMessage)}</p>`,
        {
          id: "enq-error-alert",
          beforeEl:
            submitBtn.closest(".pt-6, .pt-8") ??
            form.querySelector("#enquiry-security-note") ??
            submitBtn,
        },
      );
      errorAlert.classList.remove("mt-4");
      errorAlert.classList.add("mt-2");
      scrollToFirstError(viewport, form);
    }
  });

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
