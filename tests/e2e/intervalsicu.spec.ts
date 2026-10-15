import { test, expect } from "@playwright/test";

test("app screenshots load and open at full size", async ({ page }) => {
  await page.goto("/intervalsicu");
  await page.getByRole("link", { name: "Take a look inside" }).click();
  const gallery = page.getByRole("region", { name: "Inside the app" });
  await expect(gallery.getByRole("img")).toHaveCount(3);
  for (const image of await gallery.getByRole("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 1206)).toBe(true);
  }
  await gallery.getByRole("link", { name: "View full-size screenshot: Make sense of your effort" }).click();
  await expect(page).toHaveURL(/\/images\/intervalsicu\/pace.png$/);
});
