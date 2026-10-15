import { test, expect } from "@playwright/test";

test("privacy information is publicly readable and linked in both directions", async ({ page }) => {
  await page.goto("/intervalsicu/privacy");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Privacy policy", level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Disconnecting and deleting data", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Disconnecting and deleting data" })).toBeInViewport();
  await page.getByRole("link", { name: "Back to the app" }).click();
  await page.getByRole("link", { name: "Privacy policy", exact: true }).click();
  await expect(page).toHaveURL(/\/intervalsicu\/privacy$/);
  await expect(page.getByRole("main")).toBeFocused();
});

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
