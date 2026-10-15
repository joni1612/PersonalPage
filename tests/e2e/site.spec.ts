import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const path of ["/", "/projects", "/missing", "/intervalsicu"]) {
  test(`direct load and reload of ${path} are accessible without horizontal overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(path);
    await page.reload();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Unexpected Application Error!" })).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("project cards reveal a real destination on tap and keyboard focus", async ({ page }) => {
  await page.goto("/projects");
  const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "RAG Doc Chat", exact: true }) });
  await card.getByRole("heading", { name: "RAG Doc Chat", exact: true }).click();
  const link = card.getByRole("link", { name: /View on GitHub/ });
  await expect(link).toHaveAttribute("href", "https://github.com/joni1612/rag_demo");
  await link.focus();
  await expect(link).toBeFocused();
  const box = await link.boundingBox();
  expect(box).not.toBeNull();
  expect(await link.evaluate(element => {
    const r = element.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return hit === element || element.contains(hit);
  })).toBe(true);
});
