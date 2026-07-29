import { getIcon } from "@utils/ui";
import { ENQUIRY_EMAIL } from "@config/web3forms";
import { submitWeb3Form } from "@utils/integrations";
import { escapeHtml } from "@utils/security";
import { validateEmailManually } from "@utils/forms";
import {
  clearEnquiryDraft,
  loadEnquiryDraft,
  saveEnquiryDraft,
  type EnquiryDraft,
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

function resolveModalOptions(
  initialPlanOrOptions: string | null | EnquiryModalOptions,
): EnquiryModalOptions {
  if (initialPlanOrOptions === null || typeof initialPlanOrOptions === "string") {
    return {
      initialPlan: initialPlanOrOptions,
      restoreDraft: true,
      preferredFocusId: null,
    };
  }

  return {
    initialPlan: initialPlanOrOptions.initialPlan ?? null,
    restoreDraft: initialPlanOrOptions.restoreDraft ?? true,
    preferredFocusId: initialPlanOrOptions.preferredFocusId ?? null,
  };
}

function removeEnquirySuccessBanner(): void {
  document.getElementById("enquiry-success-banner")?.remove();
}

function showEnquirySuccessBanner(email: string): void {
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
      <div class="min-w-0 flex-1 space-y-1">
        <p class="font-sans text-sm font-extrabold tracking-tight text-slate-900">Enquiry sent successfully</p>
        <p class="text-xs leading-relaxed text-slate-600">Thank you for your enquiry. We will reply directly to <strong class="font-bold select-all">${escapeHtml(email)}</strong> within 2 business days.</p>
      </div>
      <button type="button" id="dismiss-enquiry-success-banner" class="rounded-lg border-none bg-transparent p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" aria-label="Dismiss success message">
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

  window.setTimeout(() => {
    banner.remove();
  }, 9000);
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
  const savedDraft = modalOptions.restoreDraft === false ? null : loadEnquiryDraft();

  const container = document.createElement("div");
  container.id = "enquiry-modal-container";
  container.className =
    "fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in";
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-modal", "true");
  container.setAttribute("aria-labelledby", "enquiry-modal-title");
  container.setAttribute("aria-describedby", "enquiry-modal-description");

  const initialPlanVal =
    savedDraft?.service ||
    (modalOptions.initialPlan && modalOptions.initialPlan !== "none"
      ? modalOptions.initialPlan
      : "");
  const textInputClass =
    "w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus-visible:outline-none focus:border-brand-teal";
  const emailInputClass = `${textInputClass} pr-10`;
  const textAreaClass =
    "w-full bg-white border border-slate-300 rounded-lg px-3 py-3 text-xs text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus-visible:outline-none focus:border-brand-teal resize-none";

  container.innerHTML = `
    <div 
      id="enquiry-modal-card" 
      class="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-5xl w-full max-h-[min(85dvh,900px)] h-[min(85dvh,900px)] flex flex-col relative overflow-hidden animate-slide-in-up"
      role="document"
    >
      <button 
        id="enquiry-modal-close-btn"
        class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-brand-teal"
        aria-label="Close modal"
      >
        ${getIcon("X", "w-5 h-5 cursor-pointer")}
      </button>
      <div class="px-6 py-5 border-b border-slate-100 shrink-0 pr-16 text-left">
        <span class="font-sans font-black text-[9px] uppercase text-brand-teal tracking-widest block mb-1">Enquiries</span>
        <h2 id="enquiry-modal-title" class="font-sans font-extrabold text-slate-900 text-xl leading-tight">Start Your Project</h2>
        <p id="enquiry-modal-description" class="text-[11px] text-slate-400 mt-1 whitespace-nowrap">
          Complete the enquiry form below and we will reply manually after reviewing your requirements. Alternatively, email <strong class="font-bold text-brand-teal select-all">septen.digital@gmail.com</strong> to enquire directly.
        </p>
      </div>
      <div id="enquiry-content-viewport" class="flex-1 min-h-0 p-4 sm:p-6 md:p-10 overflow-y-auto overscroll-contain scroll-smooth relative w-full">
        <form id="enquiry-multi-step-form" class="space-y-12 pb-2 max-w-3xl mx-auto" novalidate aria-describedby="enquiry-security-note">
          <section id="enquiry-sec-contact" class="space-y-5 scroll-mt-6">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Contact Details</h3>
              <p class="text-xs text-slate-400">Please provide your primary direct contact information.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1 text-left">
                <label for="enq-name" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Your Full Name <span class="text-brand-orange">*</span></label>
                <input id="enq-name" name="name" type="text" required pattern=".*\\S+\\s+\\S+.*" title="Enter your first and last name." maxlength="120" autocomplete="name" placeholder="e.g. Alex Morgan" class="${textInputClass}" />
                <div class="form-field-error-slot min-h-[1.25rem] pt-1"></div>
              </div>
              <div class="space-y-1 text-left">
                <label for="enq-email" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Email Address <span class="text-brand-orange">*</span></label>
                <div class="relative">
                  <input id="enq-email" name="email" type="email" required maxlength="160" autocomplete="email" placeholder="e.g. alex.morgan@example.com" class="${emailInputClass}" />
                  <span id="enq-email-valid-indicator" class="pointer-events-none absolute inset-y-0 right-3 hidden items-center text-emerald-600" aria-hidden="true">
                    <span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500 bg-emerald-50">
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
                        <path d="M4.5 10.5 8 14l7.5-8"></path>
                      </svg>
                    </span>
                  </span>
                </div>
                <div class="form-field-error-slot min-h-[1.25rem] pt-1"></div>
              </div>
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-phone" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Phone Number <span class="text-slate-400">(Optional)</span></label>
              <input id="enq-phone" name="phone" type="tel" inputmode="tel" pattern="[0-9+ ]{7,32}" title="Use numbers, spaces, and an optional leading plus sign." maxlength="${String(PHONE_MAX_LENGTH)}" autocomplete="tel" placeholder="e.g. +44 7700 900000" class="${textInputClass}" />
              <div class="form-field-error-slot min-h-[1.25rem] -mt-0.5 pt-0.5"></div>
            </div>
          </section>
          <section id="enquiry-sec-company" class="space-y-5 scroll-mt-6">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Company Information <span class="text-slate-400 text-sm font-medium">(Optional)</span></h3>
              <p class="text-xs text-slate-400">Tell us about your business or trading entity.</p>
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-company-name" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Company / Business Name <span class="text-slate-400">(Optional)</span></label>
              <input id="enq-company-name" name="companyName" type="text" pattern="[A-Za-z0-9&.,'’()/# -]{1,100}" title="Use letters, numbers, spaces, and basic punctuation only." maxlength="${String(COMPANY_NAME_MAX_LENGTH)}" autocomplete="organization" placeholder="e.g. Acme Business" class="${textInputClass}" />
              <div class="form-field-error-slot min-h-[1.25rem] pt-1"></div>
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-company-address" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Company Address <span class="text-slate-400">(Optional)</span></label>
              <input id="enq-company-address" name="Company Address" type="text" pattern="[A-Za-z0-9&.,'’()/# -]{1,250}" title="Use letters, numbers, spaces, and basic punctuation only." maxlength="${String(COMPANY_ADDRESS_MAX_LENGTH)}" autocomplete="street-address" placeholder="e.g. 12 High Street, Newcastle upon Tyne, NE1 1AD" class="${textInputClass}" />
              <div class="form-field-error-slot min-h-[1.25rem] pt-1"></div>
            </div>
          </section>
          <section id="enquiry-sec-service" class="space-y-5 scroll-mt-6">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Service Option</h3>
              <p class="text-xs text-slate-400">Which of our managed packages best fits your business goals?</p>
            </div>
            <div class="space-y-2 text-left">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p id="enquiry-plan-label" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Select Package Option <span class="text-brand-orange">*</span></p>
                <span id="enq-service-error" class="hidden rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-rose-700" role="alert"></span>
              </div>
              <p id="enquiry-plan-hint" class="text-[11px] text-slate-400 leading-relaxed">Choose the package that best matches your current business needs. You can still explain anything custom in the requirements section below.</p>
              <div id="service-options-wrapper" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 rounded-2xl border border-transparent p-3 transition-colors" role="radiogroup" aria-labelledby="enquiry-plan-label" aria-describedby="enquiry-plan-hint enq-service-error">
                <div class="flex flex-col space-y-4">
                  <div 
                    data-plan-option="Get Online Plan"
                    tabindex="0"
                    role="radio"
                    aria-checked="false"
                    aria-label="Get Online Plan, 29 pounds 99 per month"
                    class="plan-option-card p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors relative flex flex-col justify-between text-left group overflow-hidden h-[110px]"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-sans font-black text-[9px] uppercase tracking-widest text-blue-600">GET ONLINE PLAN</span>
                      <div class="plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors">
                        <div class="plan-radio-dot w-2 h-2 rounded-full bg-blue-500 scale-0 transition-transform"></div>
                      </div>
                    </div>
                    <h4 class="font-sans font-extrabold text-slate-900 text-sm">Get Online <span class="text-blue-600 font-normal">| £29.99/mo</span></h4>
                  </div>
                  <ul class="space-y-1.5 text-[11px] text-slate-500 grow pl-1">
                    <li class="flex items-start gap-1.5">
                      <span class="text-blue-500 shrink-0 mt-0.5">✓</span>
                      <span>Fully custom website design tailored to your brand</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-blue-500 shrink-0 mt-0.5">✓</span>
                      <span>Fast, responsive layout (mobile + desktop optimised)</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-blue-500 shrink-0 mt-0.5">✓</span>
                      <span>Reliable hosting with 99.9% uptime</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-blue-500 shrink-0 mt-0.5">✓</span>
                      <span>Core security protection (SSL encryption + firewall protection)</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-blue-500 shrink-0 mt-0.5">✓</span>
                      <span>Basic API access for integrations and data usage</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-blue-500 shrink-0 mt-0.5">✓</span>
                      <span>Standard support for fixes and maintenance</span>
                    </li>
                  </ul>
                </div>
                <div class="flex flex-col space-y-4">
                  <div 
                    data-plan-option="Growth Plan"
                    tabindex="0"
                    role="radio"
                    aria-checked="false"
                    aria-label="Growth Plan, 59 pounds 99 per month"
                    class="plan-option-card p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange cursor-pointer transition-colors relative flex flex-col justify-between text-left group overflow-hidden h-[110px]"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-sans font-black text-[9px] uppercase tracking-widest text-brand-orange">GROWTH PLAN</span>
                      <div class="plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors">
                        <div class="plan-radio-dot w-2 h-2 rounded-full bg-brand-orange scale-0 transition-transform"></div>
                      </div>
                    </div>
                    <h4 class="font-sans font-extrabold text-slate-900 text-sm">Growth Plan <span class="text-brand-orange font-normal">| £59.99/mo</span></h4>
                  </div>
                  <ul class="space-y-1.5 text-[11px] text-slate-500 grow pl-1">
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-orange shrink-0 mt-0.5">✓</span>
                      <span>Everything included in "Get Online"</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-orange shrink-0 mt-0.5">✓</span>
                      <span>SEO optimisation to improve search rankings and visibility</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-orange shrink-0 mt-0.5">✓</span>
                      <span>Increased API limits with access to advanced usage features</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-orange shrink-0 mt-0.5">✓</span>
                      <span>Priority support with faster response times</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-orange shrink-0 mt-0.5">✓</span>
                      <span>Automation tools for workflows and task reduction</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-brand-orange shrink-0 mt-0.5">✓</span>
                      <span>Performance-focused improvements for speed and conversion</span>
                    </li>
                  </ul>
                </div>
                <div class="flex flex-col space-y-4">
                  <div 
                    data-plan-option="Other / General"
                    tabindex="0"
                    role="radio"
                    aria-checked="false"
                    aria-label="Other or General Option"
                    class="plan-option-card p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-pointer transition-colors relative flex flex-col justify-between text-left group overflow-hidden h-[110px]"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-sans font-black text-[9px] uppercase tracking-widest text-slate-500">OTHER / GENERAL</span>
                      <div class="plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors">
                        <div class="plan-radio-dot w-2 h-2 rounded-full bg-slate-500 scale-0 transition-transform"></div>
                      </div>
                    </div>
                    <h4 class="font-sans font-extrabold text-slate-900 text-sm">Other / General</h4>
                  </div>
                  <p class="text-[11px] text-slate-400 pl-1 leading-relaxed">
                    For custom, complex, or unlisted requirements. Let us know what you need in the details block below, and we'll draft a bespoke plan for you.
                  </p>
                </div>
              </div>
              <input id="enq-selected-service" type="hidden" name="service" value="${initialPlanVal}" required />
            </div>
          </section>
          <section id="enquiry-sec-additional" class="space-y-5 scroll-mt-6">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Requirements</h3>
              <p class="text-xs text-slate-400">Provide any specific needs, competitor examples, or timing details.</p>
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-message" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Tell us about your requirements <span class="text-brand-orange">*</span></label>
              <textarea id="enq-message" name="message" rows="4" required minlength="${String(MESSAGE_MIN_LENGTH)}" maxlength="${String(MESSAGE_MAX_LENGTH)}" placeholder="Describe your trade, what features you need on your new website, any design guidelines or competitor sites you like..." class="${textAreaClass}"></textarea>
              <div class="form-field-error-slot min-h-[1.25rem] -mt-1 pt-0"></div>
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
  const emailValidIndicator = container.querySelector<HTMLElement>("#enq-email-valid-indicator");
  const optionCards = container.querySelectorAll<HTMLElement>(".plan-option-card");
  let isClosing = false;
  let shouldPersistDraft = true;
  let lastFocusedFieldId = savedDraft?.lastFocusedFieldId ?? "";
  let emailValidationRequestId = 0;
  const restorableFieldIds = new Set([
    "enq-name",
    "enq-email",
    "enq-phone",
    "enq-company-name",
    "enq-company-address",
    "enq-message",
  ]);

  const buildDraft = (): EnquiryDraft => ({
    name: nameField?.value ?? "",
    email: emailField?.value ?? "",
    phone: phoneField?.value ?? "",
    companyName: companyNameField?.value ?? "",
    companyAddress: companyAddressField?.value ?? "",
    service: hiddenServiceInput?.value ?? "",
    message: messageField?.value ?? "",
    lastFocusedFieldId:
      document.activeElement instanceof HTMLElement &&
      restorableFieldIds.has(document.activeElement.id)
        ? document.activeElement.id
        : lastFocusedFieldId,
    scrollTop: viewport?.scrollTop ?? 0,
  });

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
          emailField.focus();
          emailField.setSelectionRange(suggestedEmail.length, suggestedEmail.length);
          void validateEmailField({ allowEmpty: true });
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
      nameParts.every((part) => /[\p{L}]{2,}/u.test(part.replace(/['-]/g, "")))
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

    showFieldError(nameField, "Please enter your first and last name.");

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
        `Please describe your project requirements in ${MESSAGE_MIN_LENGTH}-${MESSAGE_MAX_LENGTH} characters.`,
      );
      return false;
    }

    if (isMessageValid()) {
      return true;
    }

    showFieldError(
      messageField,
      `Please describe your project requirements in ${MESSAGE_MIN_LENGTH}-${MESSAGE_MAX_LENGTH} characters.`,
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

  const selectPlan = (planName: string | null): void => {
    if (hiddenServiceInput) {
      hiddenServiceInput.value = planName || "";
    }
    if (planName) {
      clearServiceError();
    }
    optionCards.forEach((c) => {
      const optionPlan = c.getAttribute("data-plan-option");
      const radioCircle = c.querySelector(".plan-radio-circle");
      const radioDot = c.querySelector(".plan-radio-dot");
      const isSelected = planName && optionPlan === planName;
      c.setAttribute("aria-checked", isSelected ? "true" : "false");
      if (isSelected) {
        if (planName === "Get Online Plan") {
          c.className =
            "plan-option-card p-5 rounded-xl border-2 border-blue-500 bg-blue-50/10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors relative flex flex-col text-left group overflow-hidden h-[110px]";
          if (radioCircle)
            radioCircle.className =
              "plan-radio-circle w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center bg-white transition-colors";
          if (radioDot)
            radioDot.className =
              "plan-radio-dot w-2 h-2 rounded-full bg-blue-500 scale-100 transition-transform";
        } else if (planName === "Growth Plan") {
          c.className =
            "plan-option-card p-5 rounded-xl border-2 border-brand-orange bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-brand-orange cursor-pointer transition-colors relative flex flex-col text-left group overflow-hidden h-[110px]";
          if (radioCircle)
            radioCircle.className =
              "plan-radio-circle w-4 h-4 rounded-full border-2 border-brand-orange flex items-center justify-center bg-white transition-colors";
          if (radioDot)
            radioDot.className =
              "plan-radio-dot w-2 h-2 rounded-full bg-brand-orange scale-100 transition-transform";
        } else {
          c.className =
            "plan-option-card p-5 rounded-xl border-2 border-slate-500 bg-slate-50/10 focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-pointer transition-colors relative flex flex-col text-left group overflow-hidden h-[110px]";
          if (radioCircle)
            radioCircle.className =
              "plan-radio-circle w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center bg-white transition-colors";
          if (radioDot)
            radioDot.className =
              "plan-radio-dot w-2 h-2 rounded-full bg-slate-500 scale-100 transition-transform";
        }
      } else {
        c.className =
          "plan-option-card p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-teal cursor-pointer transition-colors relative flex flex-col text-left group overflow-hidden h-[110px]";
        if (radioCircle)
          radioCircle.className =
            "plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors";
        if (radioDot)
          radioDot.className = "plan-radio-dot w-2 h-2 rounded-full scale-0 transition-transform";
      }
    });

    persistDraft();
  };

  optionCards.forEach((c) => {
    c.addEventListener("click", () => {
      const planVal = c.getAttribute("data-plan-option");
      if (!planVal) {
        return;
      }

      selectPlan(hiddenServiceInput?.value === planVal ? null : planVal);
    });
    c.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const planVal = c.getAttribute("data-plan-option");
        if (!planVal) {
          return;
        }

        selectPlan(hiddenServiceInput?.value === planVal ? null : planVal);
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
      messageField.value = savedDraft.message;
    }
  }

  selectPlan(initialPlanVal);

  const preferredFocusSelector =
    modalOptions.preferredFocusId || savedDraft?.lastFocusedFieldId || "enq-name";

  focusFirstElement(container, `#${preferredFocusSelector}`);
  window.setTimeout(() => {
    positionViewportForField(preferredFocusSelector, {
      behavior: "auto",
      fallbackScrollTop: savedDraft?.scrollTop ?? null,
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
    validateNameField();
  });

  emailField?.addEventListener("input", handleEmailInput);
  emailField?.addEventListener("focus", handleEmailFocus);
  emailField?.addEventListener("focusout", () => {
    if (!emailField) {
      return;
    }

    persistDraft();
    if (!emailField.value.trim()) {
      emailValidationRequestId += 1;
      delete emailField.dataset.touched;
      clearFieldError(emailField);
      clearFieldValidState(emailField);
      hideEmailValidIndicator();
      return;
    }

    emailField.dataset.touched = "true";
    void validateEmailField({ allowEmpty: true });
  });

  phoneField?.addEventListener("input", handlePhoneInput);
  phoneField?.addEventListener("focus", () => {
    clearFieldErrorOnFocus(phoneField);
  });
  phoneField?.addEventListener("focusout", () => {
    persistDraft();
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
    validateMessageField();
  });

  companyNameField?.addEventListener("input", handleCompanyFieldInput);
  companyNameField?.addEventListener("focus", () => {
    clearFieldErrorOnFocus(companyNameField);
  });
  companyNameField?.addEventListener("focusout", () => {
    persistDraft();
    validateCompanyNameField();
  });

  companyAddressField?.addEventListener("input", handleCompanyFieldInput);
  companyAddressField?.addEventListener("focus", () => {
    clearFieldErrorOnFocus(companyAddressField);
  });
  companyAddressField?.addEventListener("focusout", () => {
    persistDraft();
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
      showServiceError("Please pick one of the three options.");
      positionViewportForField("enq-service");
      return;
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

    const referenceId = buildReferenceId(enqService);

    const formData = new FormData(form);
    const targetNameValue = formData.get("name")?.toString().trim();
    if (targetNameValue) {
      formData.append("from_name", targetNameValue);
    }

    formData.set("Reference ID", referenceId);

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

    const extraFields = {
      subject: `New Enquiry - ${referenceId}`,
    };

    try {
      await submitWeb3Form(formData, extraFields);
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
      selectPlan(null);
      closeModal({
        persistDraft: false,
        onClosed: () => {
          showEnquirySuccessBanner(enqEmail);
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
