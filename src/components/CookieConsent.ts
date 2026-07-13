const COOKIE_KEY = 'septen-cookie-consent';

export function initCookieConsent() {
  const existing = document.getElementById('cookie-consent');
  if (existing) {
    existing.remove();
  }

  const consent = localStorage.getItem(COOKIE_KEY);
  if (consent === 'accepted') {
    return;
  }

  const container = document.createElement('div');
  container.id = 'cookie-consent';
  container.className = 'fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-[999] animate-slide-in-up';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-modal', 'false');
  container.setAttribute('aria-label', 'Cookie consent');

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <p class="text-[12px] text-slate-700 flex-1">
        We use essential cookies to ensure the site functions securely and works as expected. For more details, see our
        <button type="button" class="text-brand-teal font-bold hover:underline bg-transparent border-none p-0 cursor-pointer" id="cookie-consent-privacy">
          Cookie Policy
        </button>.
      </p>
      <div class="flex items-center justify-center sm:justify-start gap-3 shrink-0">
        <button type="button" id="cookie-consent-ok" class="px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest text-white bg-brand-teal hover:bg-brand-teal-dark rounded-lg transition-colors cursor-pointer border-none">
          OK
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const closeConsent = () => {
    container.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => {
      container.remove();
    }, 300);
  };

  const setConsent = (value: string) => {
    localStorage.setItem(COOKIE_KEY, value);
    closeConsent();
  };

  container.querySelector('#cookie-consent-ok')?.addEventListener('click', () => {
    setConsent('accepted');
  });
  container.querySelector('#cookie-consent-privacy')?.addEventListener('click', async () => {
    const { openLegalModal } = await import('./LegalModal');
    openLegalModal('cookies');
  });
}
