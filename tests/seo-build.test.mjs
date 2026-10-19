import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { test } from "node:test";
import { JSDOM } from "jsdom";

const origin = "https://jonathangriesinger.de";
const pages = [
  ["/", "Jonathan Griesinger"],
  ["/projects", "Projects"],
  ["/intervalsicu", "Intervals ICU Companion"],
  ["/intervalsicu/privacy", "Privacy policy"],
  ["/tempostudio", "Tempo Studio"],
  ["/tempostudio/privacy", "Privacy policy"],
  ["/projects/rag-doc-chat", "RAG Doc Chat"],
  ["/projects/invoice-extractor", "Invoice Extractor"],
];

for (const [path, heading] of pages) {
  test(`${path} contains crawlable content and complete, unique metadata`, async () => {
    const html = await readFile(`dist${path === "/" ? "" : path}/index.html`, "utf8");
    const document = new JSDOM(html).window.document;
    assert.equal(document.querySelector("h1")?.textContent, heading);
    assert.ok(document.querySelector("main")?.textContent.length > 100);
    assert.equal(document.querySelectorAll("title").length, 1);
    assert.equal(document.querySelectorAll('meta[name="description"]').length, 1);
    if (path !== "/") assert.notEqual(document.title, "Jonathan Griesinger — Fullstack Developer");
    assert.equal(document.querySelector('link[rel="canonical"]')?.href, origin + path);
    for (const property of ["og:title", "og:description", "og:url", "og:image", "og:image:alt"]) {
      assert.ok(document.querySelector(`meta[property="${property}"]`)?.content);
    }
    assert.equal(document.querySelector('meta[name="twitter:card"]')?.content, "summary_large_image");
    const image = document.querySelector('meta[property="og:image"]').content;
    assert.ok((await stat(`dist${new URL(image).pathname}`)).size > 1000);
    const schema = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
    assert.equal(schema["@context"], "https://schema.org");
    assert.equal(document.querySelector('meta[name="robots"]')?.content, "index, follow");
    assert.ok(document.querySelector('script[type="module"][src]'));
  });
}

test("crawl files list all canonical routes and the 404 document is excluded", async () => {
  const robots = await readFile("dist/robots.txt", "utf8");
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Sitemap: https:\/\/jonathangriesinger.de\/sitemap.xml/);
  const xml = await readFile("dist/sitemap.xml", "utf8");
  const document = new JSDOM(xml, { contentType: "text/xml" }).window.document;
  assert.deepEqual([...document.querySelectorAll("loc")].map(element => element.textContent).sort(), pages.map(([path]) => origin + path).sort());
  const errorDocument = new JSDOM(await readFile("dist/404.html", "utf8")).window.document;
  assert.equal(errorDocument.querySelector("h1")?.textContent, "Page not found");
  assert.equal(errorDocument.querySelector('meta[name="robots"]')?.content, "noindex, nofollow");
  assert.equal(errorDocument.querySelector('link[rel="canonical"]'), null);
});
