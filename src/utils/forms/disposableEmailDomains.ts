const DISPOSABLE_EMAIL_DOMAINS_URL =
  "https://disposable.github.io/disposable-email-domains/domains.txt";

let disposableDomainsPromise: Promise<Set<string> | null> | null = null;

function normalizeEmailDomain(email: string): string {
  return email.trim().toLowerCase().split("@")[1] ?? "";
}

export function emailUsesDisposableDomain(email: string, disposableDomains: Set<string>): boolean {
  const emailDomain = normalizeEmailDomain(email);
  if (!emailDomain) {
    return false;
  }

  for (const blockedDomain of disposableDomains) {
    if (emailDomain === blockedDomain || emailDomain.endsWith(`.${blockedDomain}`)) {
      return true;
    }
  }

  return false;
}

export async function getDisposableEmailDomains(): Promise<Set<string> | null> {
  disposableDomainsPromise ??= fetch(DISPOSABLE_EMAIL_DOMAINS_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Unable to load disposable email domains: ${response.status}`);
      }

      const body = await response.text();
      const domains = body
        .split(/\r?\n/)
        .map((domain) => domain.trim().toLowerCase())
        .filter(Boolean);

      return new Set(domains);
    })
    .catch((error: unknown) => {
      console.warn("[Septen Enquiry] Disposable email domain list unavailable.", error);
      disposableDomainsPromise = null;
      return null;
    });

  return disposableDomainsPromise;
}
