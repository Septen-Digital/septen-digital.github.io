/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface TurnstileApi {
  render(
    container: string | HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      'error-callback'?: (errorCode?: string) => void;
      'expired-callback'?: () => void;
      'timeout-callback'?: () => void;
      'unsupported-callback'?: () => void;
    }
  ): string;
  getResponse(widgetId: string): string;
  reset(widgetId: string): void;
}

interface Window {
  turnstile?: TurnstileApi;
}
