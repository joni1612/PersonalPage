import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? (!existsSync(chromium.executablePath()) && existsSync(chrome) ? chrome : undefined);
const server = spawn(process.execPath, ["scripts/preview.mjs", "--port", "4181"], { stdio: ["ignore", "pipe", "inherit"] });
let browser;
const samples = [];
try {
  await new Promise((resolve, reject) => {
    server.stdout.once("data", resolve);
    server.once("error", reject);
    server.once("exit", code => reject(new Error(`Preview exited: ${code}`)));
  });
  browser = await chromium.launch({ headless: true, executablePath });
  for (const path of ["/", "/projects", "/intervalsicu", "/tempostudio"]) {
    for (let sample = 1; sample <= 3; sample++) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.addInitScript(() => {
        window.__performanceAudit = { lcp: 0, cls: 0 };
        new PerformanceObserver(list => {
          const entry = list.getEntries().at(-1);
          if (entry) window.__performanceAudit.lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__performanceAudit.cls += entry.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      const cdp = await context.newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750, connectionType: "cellular4g" });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await page.goto(`http://127.0.0.1:4181${path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);
      const metrics = await page.evaluate(() => {
        const resources = performance.getEntriesByType("resource");
        return {
          lcpMs: Math.round(window.__performanceAudit.lcp),
          cls: Number(window.__performanceAudit.cls.toFixed(3)),
          resourceTransferKB: Math.round(resources.reduce((sum, resource) => sum + resource.transferSize, 0) / 1024),
          requests: resources.length,
          imageSources: [...document.images].map(image => image.currentSrc),
        };
      });
      if (errors.length) throw new Error(errors.join("\n"));
      samples.push({ path, sample, ...metrics });
      if (sample === 3) await page.screenshot({ path: `/tmp/personalpage-seo-${path === "/" ? "home" : path.slice(1)}.jpg`, fullPage: true });
      await context.close();
    }
    console.log(`Measured ${path} (three cold-context samples).`);
  }
  const median = values => [...values].sort((first, second) => first - second)[1];
  const summary = ["/", "/projects", "/intervalsicu", "/tempostudio"].map(path => {
    const rows = samples.filter(row => row.path === path);
    return { path, lcpMs: median(rows.map(row => row.lcpMs)), cls: median(rows.map(row => row.cls)), resourceTransferKB: median(rows.map(row => row.resourceTransferKB)) };
  });
  await mkdir("verification", { recursive: true });
  await writeFile("verification/seo-performance-results.json", JSON.stringify({ measuredAt: new Date().toISOString(), conditions: { viewport: "390x844", deviceScaleFactor: 1, latencyMs: 150, downloadBytesPerSecond: 200000, cpuSlowdown: 4, samples: 3, compression: "Brotli", source: "local production preview" }, summary, samples }, null, 2) + "\n");
  console.table(summary);
} finally {
  if (browser) await browser.close();
  server.kill("SIGTERM");
}
