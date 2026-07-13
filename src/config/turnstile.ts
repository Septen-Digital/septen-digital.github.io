/** Public Turnstile site key exposed to the browser through Astro public env vars. */
import { ENQUIRY_EMAIL } from './web3forms';

export const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '';

/** CSS class applied to every Turnstile mount point to reserve widget space. */
export const TURNSTILE_SLOT_CLASS = 'turnstile-slot';
const TURNSTILE_SLOT_LOADING_CLASS = 'turnstile-slot-loading';
const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';

let turnstileLoadPromise: Promise<TurnstileApi | null> | null = null;

export function isTurnstileEnabled() {
  return Boolean(TURNSTILE_SITE_KEY);
}

function loadTurnstileScript(): Promise<TurnstileApi | null> {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (turnstileLoadPromise) {
    return turnstileLoadPromise;
  }

  turnstileLoadPromise = new Promise((resolve) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;

    const finish = async () => {
      const turnstile = await waitForTurnstile();
      resolve(turnstile);
    };

    if (existingScript) {
      if (window.turnstile) {
        resolve(window.turnstile);
        return;
      }

      existingScript.addEventListener('load', () => void finish(), { once: true });
      existingScript.addEventListener('error', () => resolve(null), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => void finish(), { once: true });
    script.addEventListener('error', () => resolve(null), { once: true });
    document.head.appendChild(script);
  });

  return turnstileLoadPromise;
}

function waitForTurnstile(timeoutMs = 10000): Promise<TurnstileApi | null> {
  return new Promise((resolve) => {
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }

    const started = Date.now();
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval);
        resolve(window.turnstile);
      } else if (Date.now() - started >= timeoutMs) {
        clearInterval(interval);
        resolve(null);
      }
    }, 50);
  });
}

function setTurnstileLoadingState(container: HTMLElement, isLoading: boolean): void {
  container.classList.toggle(TURNSTILE_SLOT_LOADING_CLASS, isLoading);
}

function showTurnstileFallback(container: HTMLElement, fallbackMarkup: string): void {
  setTurnstileLoadingState(container, false);
  container.innerHTML = fallbackMarkup;
}

/** Render Turnstile into a dynamically inserted container. Returns the widget id. */
export async function renderTurnstile(containerSelector: string): Promise<string | null> {
  const container = document.querySelector<HTMLElement>(containerSelector);
  if (!container) return null;

  container.classList.add(TURNSTILE_SLOT_CLASS);
  container.setAttribute('aria-live', 'polite');

  const fallbackMarkup = `<p class="turnstile-slot-message text-[11px] text-slate-600 leading-snug">We use Cloudflare Turnstile to protect our forms from spam and automated bots. It looks like the verification didn’t complete. Please email <a class="text-brand-teal font-semibold" href="mailto:${ENQUIRY_EMAIL}">${ENQUIRY_EMAIL}</a> and we’ll get back to you, or try again in a moment.</p>`;

  if (!TURNSTILE_SITE_KEY) {
    showTurnstileFallback(container, fallbackMarkup);
    console.warn('[Septen] PUBLIC_TURNSTILE_SITE_KEY is not set; Turnstile widget disabled.');
    return null;
  }

  setTurnstileLoadingState(container, true);
  container.innerHTML =
    '<p class="turnstile-slot-message text-[10px] text-slate-400 italic">Loading verification...</p>';

  const turnstile = await loadTurnstileScript();
  if (!turnstile) {
    showTurnstileFallback(container, fallbackMarkup);
    console.warn('[Septen] Cloudflare Turnstile script did not load in time.');
    return null;
  }

  setTurnstileLoadingState(container, false);
  container.innerHTML = '';

  try {
    return turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      'error-callback': (errorCode) => {
        showTurnstileFallback(container, fallbackMarkup);
        console.warn('[Septen] Cloudflare Turnstile reported an error.', errorCode);
      },
      'expired-callback': () => {
        showTurnstileFallback(container, fallbackMarkup);
        console.warn('[Septen] Cloudflare Turnstile token expired.');
      },
      'timeout-callback': () => {
        showTurnstileFallback(container, fallbackMarkup);
        console.warn('[Septen] Cloudflare Turnstile challenge timed out.');
      },
      'unsupported-callback': () => {
        showTurnstileFallback(container, fallbackMarkup);
        console.warn('[Septen] Cloudflare Turnstile is unsupported in this browser or context.');
      },
    });
  } catch (error) {
    showTurnstileFallback(container, fallbackMarkup);
    console.warn('[Septen] Cloudflare Turnstile render failed.', error);
    return null;
  }
}

export function getTurnstileToken(widgetId: string | null): string {
  if (widgetId == null) return '';
  return window.turnstile?.getResponse(widgetId) || '';
}
