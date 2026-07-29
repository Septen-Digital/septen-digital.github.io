/** Escape text for safe insertion into HTML text nodes or attributes. */
export function escapeHtml(value: unknown): string {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip control characters and newlines — prevents email header injection. */
export function sanitizeEmailHeader(value: unknown): string {
  if (value == null) return "";
  return String(value)
    .replace(/[\r\n\u0000-\u001f\u007f]/g, " ")
    .trim();
}
