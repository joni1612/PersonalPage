import { mkdir, readFile, writeFile } from "node:fs/promises";
import { build } from "vite";

await build({ build: { ssr: "src/entry-server.tsx", outDir: ".prerender", emptyOutDir: true, target: "node22" } });
const { render, getHeadTags, publicPaths, siteOrigin } = await import("../.prerender/entry-server.js");
const template = await readFile("dist/index.html", "utf8");
const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const path of [...publicPaths, "/404"]) {
  const { title, tags } = getHeadTags(path);
  const head = `<title>${escape(title)}</title>` + tags.map(({ tag, attributes, text }) => {
    const attributesHtml = Object.entries(attributes).map(([name, value]) => `${name}="${escape(value)}"`).join(" ");
    return `<${tag} data-page-meta ${attributesHtml}>${tag === "script" ? `${text}</script>` : ""}`;
  }).join("\n");
  const routeModule = path === "/" ? "Home" : path === "/projects" ? "Projects" : path === "/intervalsicu" ? "IntervalsICU" : path === "/intervalsicu/privacy" ? "IntervalsPrivacy" : path === "/tempostudio" ? "TempoStudio" : path === "/tempostudio/privacy" ? "TempoPrivacy" : path.startsWith("/projects/") ? "CaseStudy" : "NotFound";
  const entry = manifest[`src/routes/${routeModule}.tsx`];
  const styles = new Set();
  const preloads = new Set();
  function visit(chunk) {
    if (!chunk || preloads.has(chunk.file)) return;
    preloads.add(chunk.file);
    for (const css of chunk.css ?? []) styles.add(css);
    for (const imported of chunk.imports ?? []) visit(manifest[imported]);
  }
  visit(entry);
  const links = [...styles].filter(file => !template.includes(`href="/${file}"`)).map(file => `<link rel="stylesheet" href="/${file}">`).join("") + [...preloads].map(file => `<link rel="modulepreload" href="/${file}">`).join("");
  const html = template.replace(/<title>[\s\S]*?<\/title>/, "").replace(/<meta\s+name="description"[\s\S]*?\/>/, "").replace("</head>", head + links + "</head>").replace('<div id="root"></div>', `<div id="root">${await render(path)}</div>`);
  const directory = path === "/404" || path === "/" ? "dist" : `dist${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/${path === "/404" ? "404.html" : "index.html"}`, html);
}
await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`);
await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPaths.map(path => `<url><loc>${siteOrigin}${path}</loc></url>`).join("")}</urlset>\n`);
await writeFile("dist/routes.json", JSON.stringify(publicPaths));
console.log(`Prerendered ${publicPaths.length} public routes and 404.html.`);
