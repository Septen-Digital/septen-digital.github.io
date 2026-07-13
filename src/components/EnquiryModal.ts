import { getIcon } from '../utils/icons';
import {
  getTurnstileToken,
  isTurnstileEnabled,
  renderTurnstile,
  TURNSTILE_SLOT_CLASS,
} from '../config/turnstile';
import { ENQUIRY_EMAIL } from '../config/web3forms';
import { submitWeb3Form } from '../utils/web3formsSubmit';
import { escapeHtml } from '../utils/escape';
import { focusFirstElement, lockBodyScroll, trapFocusWithin } from '../utils/modal';
import {
  clearFormErrors,
  validateFields,
  validateTurnstile,
  showFormAlert,
  showGroupError,
  scrollToFirstError,
} from '../utils/formValidation';

export function openEnquiryModal(initialPlan: string | null = null): void {
  const existing = document.getElementById('enquiry-modal-container');
  if (existing) {
    existing.remove();
  }

  const container = document.createElement('div');
  container.id = 'enquiry-modal-container';
  container.className = 'fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-modal', 'true');
  container.setAttribute('aria-labelledby', 'enquiry-modal-title');
  container.setAttribute('aria-describedby', 'enquiry-modal-description');

  const referenceId = 'SP-ENQ-' + Math.floor(10000 + Math.random() * 90000);
  const initialPlanVal = initialPlan && initialPlan !== 'none' ? initialPlan : '';

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
        ${getIcon('X', 'w-5 h-5 cursor-pointer')}
      </button>
      <div class="px-6 py-5 border-b border-slate-100 shrink-0 pr-16 text-left">
        <span class="font-sans font-black text-[9px] uppercase text-brand-teal tracking-widest block mb-1">Enquiries</span>
        <h2 id="enquiry-modal-title" class="font-sans font-extrabold text-slate-900 text-xl leading-tight">Start Your Project</h2>
        <p id="enquiry-modal-description" class="text-xs text-slate-400 mt-1">Complete the enquiry form below and we will reply manually after reviewing your requirements.</p>
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
                <input id="enq-name" name="name" type="text" required maxlength="120" autocomplete="name" placeholder="e.g. John Doe" class="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" />
              </div>
              <div class="space-y-1 text-left">
                <label for="enq-email" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Email Address <span class="text-brand-orange">*</span></label>
                <input id="enq-email" name="email" type="email" required maxlength="160" autocomplete="email" placeholder="e.g. john@example.com" class="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" />
              </div>
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-phone" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Phone Number <span class="text-slate-400">(Optional)</span></label>
              <input id="enq-phone" name="phone" type="tel" inputmode="tel" maxlength="32" autocomplete="tel" placeholder="e.g. +44 7700 900000" class="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" />
            </div>
          </section>
          <section id="enquiry-sec-company" class="space-y-5 scroll-mt-6">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Company Information <span class="text-slate-400 text-sm font-medium">(Optional)</span></h3>
              <p class="text-xs text-slate-400">Tell us about your business or trading entity.</p>
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-company-name" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Company / Business Name <span class="text-slate-400">(Optional)</span></label>
              <input id="enq-company-name" name="companyName" type="text" maxlength="120" autocomplete="organization" placeholder="e.g. Acme Business" class="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" />
            </div>
            <div class="space-y-1 text-left">
              <label for="enq-company-address" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Company Address <span class="text-slate-400">(Optional)</span></label>
              <input id="enq-company-address" name="companyAddress" type="text" maxlength="200" autocomplete="street-address" placeholder="e.g. 12 High Street, Newcastle upon Tyne, NE1 1AD" class="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" />
            </div>
          </section>
          <section id="enquiry-sec-service" class="space-y-5 scroll-mt-6">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Service Option</h3>
              <p class="text-xs text-slate-400">Which of our managed packages best fits your business goals?</p>
            </div>
            <div class="space-y-2 text-left">
              <label class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Select Package Option <span class="text-brand-orange">*</span></label>
              <p id="enquiry-plan-hint" class="text-[11px] text-slate-400 leading-relaxed">Choose the package that best matches your current business needs. You can still explain anything custom in the requirements section below.</p>
              <div id="service-options-wrapper" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2" role="radiogroup" aria-label="Select package option" aria-describedby="enquiry-plan-hint">
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
              <label for="enq-message" class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Any additional information <span class="text-brand-orange">*</span></label>
              <textarea id="enq-message" name="message" rows="4" required minlength="10" maxlength="2000" placeholder="Describe your trade, what features you need on your new website, any design guidelines or competitor sites you like..." class="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal resize-none"></textarea>
            </div>
            <div class="sr-only" aria-hidden="true">
              <label for="enq-website">Leave this field empty</label>
              <input id="enq-website" name="website" type="text" tabindex="-1" autocomplete="off" />
            </div>
            <div class="space-y-1 text-left">
              <label class="font-black text-[9px] uppercase tracking-wider text-slate-500 block">Verification <span class="text-brand-orange">*</span></label>
              <div id="turnstile-widget-enquiry" class="${TURNSTILE_SLOT_CLASS}"></div>
            </div>
            <div class="pt-8 pb-4 space-y-3">
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

  const triggerElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const restoreBodyScroll = lockBodyScroll();

  document.body.appendChild(container);

  let turnstileWidgetId: string | null = null;
  renderTurnstile('#turnstile-widget-enquiry').then((widgetId) => {
    turnstileWidgetId = widgetId;
  });

  const card = container.querySelector<HTMLElement>('#enquiry-modal-card');
  const closeBtn = container.querySelector<HTMLButtonElement>('#enquiry-modal-close-btn');
  const viewport = container.querySelector<HTMLElement>('#enquiry-content-viewport');
  const form = container.querySelector<HTMLFormElement>('#enquiry-multi-step-form');
  const hiddenServiceInput = container.querySelector<HTMLInputElement>('#enq-selected-service');
  const optionCards = container.querySelectorAll<HTMLElement>('.plan-option-card');
  let isClosing = false;

  const closeModal = (options?: { restoreFocus?: boolean; onClosed?: () => void }): void => {
    if (isClosing) {
      return;
    }

    isClosing = true;
    container.classList.remove('animate-fade-in');
    container.classList.add('animate-fade-out');
    if (card) {
      card.classList.remove('animate-slide-in-up');
      card.classList.add('animate-slide-out-down');
    }
    if (options?.restoreFocus !== false && triggerElement && typeof triggerElement.focus === 'function') {
      triggerElement.focus();
    }
    setTimeout(() => {
      restoreBodyScroll();
      container.remove();
      options?.onClosed?.();
    }, 300);
  };

  closeBtn?.addEventListener('click', closeModal);
  let mousedownOnBackdrop = false;
  container.addEventListener('mousedown', (e: MouseEvent) => {
    mousedownOnBackdrop = (e.target === container);
  });
  container.addEventListener('click', (e: MouseEvent) => {
    if (e.target === container && mousedownOnBackdrop) {
      closeModal();
    }
  });

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    trapFocusWithin(container, e);
  };
  window.addEventListener('keydown', handleKeyDown);

  focusFirstElement(container, '#enq-name');

  const selectPlan = (planName: string | null): void => {
    if (hiddenServiceInput) {
      hiddenServiceInput.value = planName || '';
    }
    if (planName) {
      form?.querySelector('#service-options-wrapper')?.classList.remove('group-invalid', 'border-rose-400', 'ring-1', 'ring-rose-300');
      form?.querySelector('.form-group-error')?.remove();
    }
    optionCards.forEach((c) => {
      const optionPlan = c.getAttribute('data-plan-option');
      const radioCircle = c.querySelector('.plan-radio-circle');
      const radioDot = c.querySelector('.plan-radio-dot');
      const isSelected = planName && optionPlan === planName;
      c.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      if (isSelected) {
        if (planName === 'Get Online Plan') {
          c.className = 'plan-option-card p-5 rounded-xl border-2 border-blue-500 bg-blue-50/10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors relative flex flex-col text-left group overflow-hidden h-[110px]';
          if (radioCircle) radioCircle.className = 'plan-radio-circle w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center bg-white transition-colors';
          if (radioDot) radioDot.className = 'plan-radio-dot w-2 h-2 rounded-full bg-blue-500 scale-100 transition-transform';
        } else if (planName === 'Growth Plan') {
          c.className = 'plan-option-card p-5 rounded-xl border-2 border-brand-orange bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-brand-orange cursor-pointer transition-colors relative flex flex-col text-left group overflow-hidden h-[110px]';
          if (radioCircle) radioCircle.className = 'plan-radio-circle w-4 h-4 rounded-full border-2 border-brand-orange flex items-center justify-center bg-white transition-colors';
          if (radioDot) radioDot.className = 'plan-radio-dot w-2 h-2 rounded-full bg-brand-orange scale-100 transition-transform';
        } else {
          c.className = 'plan-option-card p-5 rounded-xl border-2 border-slate-500 bg-slate-50/10 focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-pointer transition-colors relative flex flex-col text-left group overflow-hidden h-[110px]';
          if (radioCircle) radioCircle.className = 'plan-radio-circle w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center bg-white transition-colors';
          if (radioDot) radioDot.className = 'plan-radio-dot w-2 h-2 rounded-full bg-slate-500 scale-100 transition-transform';
        }
      } else {
        c.className = 'plan-option-card p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-teal cursor-pointer transition-colors relative flex flex-col text-left group overflow-hidden h-[110px]';
        if (radioCircle) radioCircle.className = 'plan-radio-circle w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center bg-white transition-colors';
        if (radioDot) radioDot.className = 'plan-radio-dot w-2 h-2 rounded-full scale-0 transition-transform';
      }
    });
  };

  optionCards.forEach((c) => {
    c.addEventListener('click', () => {
      const planVal = c.getAttribute('data-plan-option');
      if (planVal) selectPlan(planVal);
    });
    c.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const planVal = c.getAttribute('data-plan-option');
        if (planVal) selectPlan(planVal);
      }
    });
  });

  selectPlan(initialPlan);

  container.querySelector('#enq-privacy-link')?.addEventListener('click', async () => {
    const { openLegalModal } = await import('./LegalModal');
    closeModal({
      restoreFocus: false,
      onClosed: () => {
        openLegalModal('privacy');
      },
    });
  });

  form?.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();
    clearFormErrors(form);
    const nameField = form.querySelector<HTMLInputElement>('#enq-name');
    const emailField = form.querySelector<HTMLInputElement>('#enq-email');
    const messageField = form.querySelector<HTMLTextAreaElement>('#enq-message');
    const serviceWrapper = form.querySelector<HTMLElement>('#service-options-wrapper');
    const enqName = nameField?.value?.trim() || '';
    const enqEmail = emailField?.value?.trim() || '';
    const enqService = hiddenServiceInput?.value?.trim() || '';
    const enqMsg = messageField?.value?.trim() || '';

    const hasValidationErrors = validateFields([
      {
        field: nameField,
        message: 'Please enter your first and last name',
        test: () => {
          const nameValue = nameField?.value?.trim() || '';
          if (/\d/.test(nameValue)) return false;
          const nameParts = nameValue.split(/\s+/).filter(part => part.length > 0);
          return nameParts.length >= 2 && nameParts.every(part => part.length >= 2);
        },
      },
      {
        field: emailField,
        message: 'Please enter a valid email',
        test: () => {
          const emailValue = emailField?.value?.trim() || '';
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
        },
      },
      {
        field: messageField,
        message: 'Please describe your project requirements, business type, and any specific needs (at least 10 characters).',
        test: () => enqMsg.length >= 10,
      },
    ]);

    if (hasValidationErrors) {
      scrollToFirstError(viewport, form);
      return;
    }

    if (!enqService) {
      showGroupError(serviceWrapper, 'Please select one of our three package options before submitting.');
      scrollToFirstError(viewport, form);
      return;
    }

    const submitBtn = form.querySelector<HTMLButtonElement>('#enquiry-submit-btn');
    if (!submitBtn) return;
    const originalBtnHTML = submitBtn.innerHTML;

    const turnstileToken = getTurnstileToken(turnstileWidgetId);
    const hasTurnstile = validateTurnstile(viewport, form, turnstileToken, {
      slotSelector: '#turnstile-widget-enquiry',
      isEnabled: isTurnstileEnabled(),
    });

    if (!hasTurnstile) {
      return;
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
    const btnSpan = submitBtn.querySelector<HTMLElement>('span');
    if (btnSpan) {
      btnSpan.textContent = 'Sending...';
    }
    form.querySelector('#enq-error-alert')?.remove();

    const extraFields = {
      referenceId,
      timestamp: new Date().toUTCString(),
      to: ENQUIRY_EMAIL,
      subject: `New Enquiry: ${enqService}`,
    };

    try {
      await submitWeb3Form(form, extraFields);
      if (viewport) {
        viewport.innerHTML = `
          <div class="text-center py-12 px-6 space-y-5 animate-fade-in text-slate-800 max-w-xl mx-auto mt-6">
            <div class="w-16 h-16 bg-emerald-100 text-brand-teal rounded-full flex items-center justify-center mx-auto text-3xl font-bold border border-emerald-200 animate-pulse">✓</div>
            <div class="space-y-1.5">
              <h3 class="font-sans font-extrabold text-slate-900 text-xl tracking-tight">Enquiry submitted successfully</h3>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">Thank you, <strong>${escapeHtml(enqName)}</strong>! Your enquiry has been sent securely to our business email and will be reviewed manually by our team.</p>
            <p class="text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">We will respond directly to <strong>${escapeHtml(enqEmail)}</strong> within 24 business hours. To request a copy of or deletion of your data at any time, use the <strong>Data Rights</strong> link in our site footer.</p>
            <div class="pt-4">
              <button id="close-success-enquiry-btn" class="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-mono text-xs uppercase font-black tracking-widest py-3 rounded-lg cursor-pointer border-none transition-colors">Return to Website</button>
            </div>
          </div>
        `;
        viewport.querySelector<HTMLButtonElement>('#close-success-enquiry-btn')?.addEventListener('click', closeModal);
      }
    } catch (error: unknown) {
      console.error('[Septen Enquiry Error] Submission failed:', error);
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      submitBtn.style.cursor = '';
      submitBtn.innerHTML = originalBtnHTML;

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while transmitting your project details securely. Please verify your connection or reach out to septen.digital@gmail.com directly.';

      showFormAlert(form, `<p class="font-bold mb-1">Enquiry Delivery Failed</p><p class="text-[11px] text-rose-700">${escapeHtml(errorMessage)}</p>`, { id: 'enq-error-alert', beforeEl: submitBtn.closest('.pt-8') });
      scrollToFirstError(viewport, form);
    }
  });

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
