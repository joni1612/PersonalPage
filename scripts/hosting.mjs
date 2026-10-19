export function cacheControl(path) {
  if (path.startsWith("/assets/")) return "public, max-age=31536000, immutable";
  if (path === "/robots.txt" || path === "/sitemap.xml") return "public, max-age=3600, must-revalidate";
  if (path.startsWith("/images/")) return "public, max-age=86400, must-revalidate";
  return "no-cache";
}
