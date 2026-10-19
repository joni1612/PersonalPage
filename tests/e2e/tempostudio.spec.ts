import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const route of ["/tempostudio", "/tempostudio/privacy"]) {
  test(`${route} loads directly, fits the viewport and passes accessibility checks`, async ({ page }) => {
    await page.goto(route);await page.reload();
    await expect(page.getByRole("heading",{level:1})).toBeVisible();
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    const audit=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
    expect(audit.violations).toEqual([]);
    if(route==="/tempostudio") {
      for(const image of await page.getByRole("main").getByRole("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0&&/\.(avif|webp)$/.test(img.currentSrc))).toBe(true);
      }
    }
  });
}

test("portfolio opens Tempo Studio and links to privacy and support",async({page})=>{
  await page.goto("/projects");
  const link=page.getByRole("link",{name:"Explore the app → (Tempo Studio)",exact:true});
  await link.focus();await link.press("Enter");
  await expect(page).toHaveURL(/\/tempostudio$/);
  await page.getByRole("link",{name:"Privacy policy",exact:true}).click();
  await expect(page).toHaveURL(/\/tempostudio\/privacy$/);
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByRole("link",{name:"Disconnecting and deleting data",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Disconnecting and deleting data"})).toBeInViewport();
  await page.getByRole("link",{name:"Back to the app"}).click();
  await expect(page.getByRole("link",{name:"Contact support"})).toHaveAttribute("href",/mailto:.*Tempo%20Studio%20support/);
});
