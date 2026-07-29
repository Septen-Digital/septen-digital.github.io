export const previewOrigin = "http://127.0.0.1:4321";

// Keep the audited route list explicit so local reports stay predictable.
export const indexableAuditPagePaths = ["/", "/legal/"];
export const demoAuditPagePaths = [
  "/demos/carls-coffee/",
  "/demos/alder-and-pipe-plumbing/",
  "/demos/sarahs-boutique/",
  "/demos/greenfield-landscaping/",
  "/demos/north-shore-fitness/",
];
export const auditPagePaths = [...indexableAuditPagePaths, ...demoAuditPagePaths];

export function buildAuditUrl(pathname) {
  return new URL(pathname, previewOrigin).toString();
}

export function getAuditUrls() {
  return auditPagePaths.map(buildAuditUrl);
}
