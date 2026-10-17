// Builds a single self-contained HTML fragment (CSS and JS inlined) for sharing
// as a hosted page. The host adds its own <!doctype>/<html>/<head>/<body>.
// Usage: node scripts/build-artifact.mjs [output-file]
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "dist-artifact");
const outFile = path.resolve(process.argv[2] ?? path.join(outDir, "finher.html"));

execSync("npx vite build --mode artifact --base ./ --outDir dist-artifact --emptyOutDir", { cwd: root, stdio: "inherit" });

const read = (href) => readFileSync(path.join(outDir, href), "utf8");
// Keep inline code from closing its own tag early, and write the replacement
// character (used on purpose by libraries such as marked) as an escape so the
// host doesn't mistake it for a corrupted character.
const safeScript = (js) =>
  js.replaceAll("</script", "<\\/script").replaceAll("<!--", "<\\!--").replaceAll("�", "\\uFFFD");

let html = readFileSync(path.join(outDir, "index.html"), "utf8");
html = html
  .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, (_, src) => `<script type="module">${safeScript(read(src))}</script>`)
  .replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/, (_, href) => `<style>${read(href)}</style>`)
  .replace(/<link rel="icon"[^>]*>\s*/, "")
  .replace(/<!doctype html>\s*/i, "")
  .replace(/<\/?(html|head|body)[^>]*>\s*/g, "")
  .replace(/<meta (charset|name="viewport")[^>]*>\s*/g, "");

// The host scans the first 8KB for <title>; move it to the very top.
const title = html.match(/<title>.*?<\/title>/)[0];
html = title + "\n" + html.replace(title, "");

writeFileSync(outFile, html);
console.log(`Wrote ${outFile} (${(html.length / 1024).toFixed(0)} KB)`);
