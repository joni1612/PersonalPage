import { test, expect } from "@playwright/test";

test("companion card opens its app page after touch/click", async ({ page }) => {
  await page.goto("/projects");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Intervals ICU Companion App", exact: true }) });
  await card.click();
  await card.getByRole("link", { name: "Explore the app → (Intervals ICU Companion App)", exact: true }).click();
  await expect(page).toHaveURL(/\/intervalsicu$/);
  await expect(page.getByRole("heading", { name: "Intervals ICU Companion", level: 1 })).toBeVisible();
  await expect(page.getByRole("main")).toBeFocused();
});

test("companion card destination is reachable with the keyboard", async ({ page }) => {
  await page.goto("/projects");
  const link = page.getByRole("link", { name: "Explore the app → (Intervals ICU Companion App)", exact: true });
  await link.focus();
  await link.press("Enter");
  await expect(page.getByRole("heading", { name: "Intervals ICU Companion", level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "← All projects", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Projects", level: 1 })).toBeVisible();
});
