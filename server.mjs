// Minimal static file server for the `dist/` build, used only so we can set
// security headers on every response — Railway's default static-site hosting
// doesn't support custom headers, and this site is otherwise fully static
// (no server-side logic, no database, nothing else to secure).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, isAbsolute, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("./dist/", import.meta.url));
const PORT = process.env.PORT || 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Covers the one inline script in src/layouts/Layout.astro (theme init).
// If that script's content ever changes, regenerate this hash with:
//   node -e "const c=require('crypto');console.log('sha256-'+c.createHash('sha256').update('<exact script body>','utf-8').digest('base64'))"
const THEME_SCRIPT_HASH = "sha256-wjwVD5vFEp4zFjvm0GODZ599AkZs2RE1QBisbEBmv6w=";

const CSP = [
  "default-src 'self'",
  `script-src 'self' '${THEME_SCRIPT_HASH}'`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
  "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://formspree.io",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

function setSecurityHeaders(res) {
  res.setHeader("Content-Security-Policy", CSP);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-XSS-Protection", "0"); // superseded by CSP; explicitly disabling avoids legacy filter quirks
}

function withinDist(candidate) {
  const rel = relative(DIST, candidate);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

async function resolveFile(pathname) {
  // pathname always starts with "/" (from URL parsing); joining it onto DIST
  // as a relative segment keeps it anchored under DIST rather than escaping
  // to the filesystem root, and withinDist() rejects any ".." traversal.
  let filePath = join(DIST, "." + pathname);
  if (!withinDist(filePath)) return null;

  try {
    const s = await stat(filePath);
    if (s.isDirectory()) filePath = join(filePath, "index.html");
  } catch {
    // No exact match — try Astro's directory-style route (e.g. /about -> /about/index.html).
    filePath = join(filePath, "index.html");
  }

  try {
    await stat(filePath);
    return filePath;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  setSecurityHeaders(res);

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const filePath = await resolveFile(decodeURIComponent(url.pathname));

  if (!filePath) {
    try {
      const notFound = await readFile(join(DIST, "404.html"));
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(notFound);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
    return;
  }

  const ext = extname(filePath);
  const isHashedAsset = filePath.includes(`${sep}_astro${sep}`);

  try {
    const data = await readFile(filePath);
    res.setHeader(
      "Cache-Control",
      isHashedAsset ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate"
    );
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server error");
  }
}).listen(PORT, () => {
  console.log(`Serving dist/ on :${PORT}`);
});
