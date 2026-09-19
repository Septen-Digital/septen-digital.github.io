import fs from "node:fs";
import crypto from "node:crypto";

function hashContent(content) {
  return "sha256-" + crypto.createHash("sha256").update(content, "utf8").digest("base64");
}

const files = [
  "dist/index.html",
  "dist/about/index.html",
  "dist/faq/index.html",
  "dist/pricing/index.html",
  "dist/legal/index.html",
  "dist/demos/index.html",
  "dist/demos/alder-and-pipe-plumbing/index.html",
  "dist/demos/carls-coffee/index.html",
  "dist/demos/greenfield-landscaping/index.html",
  "dist/demos/north-shore-fitness/index.html",
  "dist/demos/sarahs-boutique/index.html",
  "dist/404.html",
];

const allScriptHashes = new Set();
const allStyleHashes = new Set();
const byFile = {};

for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  const fileReport = { scripts: [], styles: [] };

  // <script>...</script>
  const scriptRegex = /<script(?=[\s>])((?:"[^"]*"|'[^']*'|[^>"'])*?)>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = scriptRegex.exec(html)) !== null) {
    const attrs = m[1] || "";
    const body = m[2];
    const typeMatch = attrs.match(/\stype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const type = typeMatch
      ? (typeMatch[1] || typeMatch[2] || typeMatch[3] || "").toLowerCase()
      : "";
    if (
      type === "application/ld+json" ||
      type === "importmap" ||
      type === "speculationrules" ||
      type === "application/json"
    ) {
      continue;
    }
    if (/\ssrc\s*=/i.test(attrs)) {
      continue;
    }
    if (!body || body.trim() === "") continue;
    const h = hashContent(body);
    fileReport.scripts.push({
      h,
      bodyLen: body.length,
      type: type || "empty",
      attrsTrim: attrs.replace(/\s+/g, " ").slice(0, 120),
    });
    allScriptHashes.add(h);
  }

  // <style>...</style>
  const styleRegex = /<style(?=[\s>])((?:"[^"]*"|'[^']*'|[^>"'])*?)>([\s\S]*?)<\/style>/g;
  while ((m = styleRegex.exec(html)) !== null) {
    const attrs = m[1] || "";
    const body = m[2];
    if (!body || body.trim() === "") continue;
    const h = hashContent(body);
    fileReport.styles.push({
      h,
      bodyLen: body.length,
      attrsTrim: attrs.replace(/\s+/g, " ").slice(0, 120),
    });
    allStyleHashes.add(h);
  }

  byFile[f] = fileReport;
}

console.log("UNIQUE inline <script> hashes (for script-src CSP):");
[...allScriptHashes].forEach((h) => console.log("  " + h));
console.log("");
console.log("UNIQUE inline <style> hashes (for style-src-elem CSP):");
[...allStyleHashes].forEach((h) => console.log("  " + h));
console.log("");
console.log("Per-file breakdown:");
for (const [f, rep] of Object.entries(byFile)) {
  if (rep.scripts.length || rep.styles.length) {
    console.log("  " + f + ":");
    if (rep.scripts.length) {
      console.log("    scripts:");
      rep.scripts.forEach((x) =>
        console.log(
          "      len=" +
            String(x.bodyLen).padStart(6, " ") +
            " type=" +
            (x.type || "-").padEnd(8, " ") +
            " attrs=(" +
            x.attrsTrim +
            ")" +
            "\n      " +
            x.h,
        ),
      );
    }
    if (rep.styles.length) {
      console.log("    styles:");
      rep.styles.forEach((x) =>
        console.log(
          "      len=" +
            String(x.bodyLen).padStart(6, " ") +
            " attrs=(" +
            x.attrsTrim +
            ")" +
            "\n      " +
            x.h,
        ),
      );
    }
  }
}
