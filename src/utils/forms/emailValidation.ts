export function validateEmailManually(emailStr: string): boolean {
  const email = emailStr.trim().toLowerCase();
  if (!email) return false;

  if (email.includes("..")) return false;
  if (email.includes(" ") || email.includes(",")) return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [username, domain] = parts;

  if (!username || !domain) return false;
  if (username.startsWith(".") || username.endsWith(".")) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;

  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;

  const finalExtension = domainParts[domainParts.length - 1];
  if (finalExtension.length < 2 || finalExtension.length > 6) return false;

  const cleanUsernameRegex = /^[a-z0-9._%+-]+$/;
  const cleanDomainRegex = /^[a-z0-9.-]+$/;

  if (!cleanUsernameRegex.test(username)) return false;
  if (!cleanDomainRegex.test(domain)) return false;

  return true;
}
