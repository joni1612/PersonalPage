import { test, expect } from "@playwright/test";

for (const [path, heading] of [["/", "Jonathan Griesinger"], ["/projects", "Projects"], ["/intervalsicu", "Intervals ICU Companion"], ["/tempostudio", "Tempo Studio"], ["/intervalsicu/privacy", "Privacy policy"], ["/tempostudio/privacy", "Privacy policy"], ["/projects/rag-doc-chat", "RAG Doc Chat"], ["/projects/invoice-extractor", "Invoice Extractor"]]) {
  test(`${path} works with JavaScript disabled`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const response = await page.goto(`http://127.0.0.1:4173${path}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: heading, exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://jonathangriesinger.de${path}`);
    await context.close();
  });
}

test("unknown pages and assets are real 404s; crawl files have correct content types", async ({ request }) => {
  for (const path of ["/missing", "/assets/missing.js", "/images/missing.png"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain('content="noindex, nofollow"');
  }
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(robots.headers()["content-type"]).toContain("text/plain");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toContain("xml");
  const html = await request.get("/projects");
  expect(html.headers()["cache-control"]).toBe("no-cache");
  const compressed = await request.get("/projects", { headers: { "Accept-Encoding": "br" } });
  expect(compressed.headers()["content-encoding"]).toBe("br");
});

test("hydration and navigation update metadata without errors or duplicate tags", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && /hydration|hydrating|Minified React error/i.test(message.text())) errors.push(message.text());
  });
  await page.goto("/tempostudio");
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByRole("link", { name: "← All projects", exact: true }).click();
  await expect(page).toHaveTitle("Projects — Jonathan Griesinger");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://jonathangriesinger.de/projects");
  await page.getByRole("link", { name: "RAG Doc Chat", exact: true }).click();
  await expect(page).toHaveTitle("RAG Doc Chat case study — Jonathan Griesinger");
  await page.goBack();
  await expect(page).toHaveTitle("Projects — Jonathan Griesinger");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  expect(errors).toEqual([]);
});
