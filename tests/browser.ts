import axe, { type AxeResults } from "axe-core";

// Runs in the existing browser when this machine cannot spawn Playwright.
// CI separately exercises the production build using Playwright.
const frame = document.querySelector<HTMLIFrameElement>("#page")!;
const results = document.querySelector("#results")!;
let passed = 0;
let failed = 0;
function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
async function waitFor(condition: () => boolean, message: string) {
  const start = performance.now();
  while (!condition()) {
    if (performance.now() - start > 10_000) throw new Error(message);
    await new Promise(resolve => setTimeout(resolve, 30));
  }
}

for (const width of [1280, 390]) {
  frame.style.width = `${width}px`;
  for (const [path, heading] of [["/", "Jonathan Griesinger"], ["/projects", "Projects"], ["/missing", "Page not found"], ["/intervalsicu", "Intervals ICU Companion"], ["/intervalsicu/privacy", "Privacy policy"]]) {
    const row = document.createElement("li");
    results.append(row);
    row.textContent = `${width}px ${path}: running`;
    try {
      frame.src = path;
      await new Promise<void>((resolve, reject) => {
        frame.onload = () => resolve();
        frame.onerror = () => reject(new Error("Page did not load"));
      });
      await waitFor(() => frame.contentDocument?.querySelector("h1")?.textContent === heading, "Expected route did not render");
      const doc = frame.contentDocument!;
      await doc.fonts.ready;
      await Promise.allSettled(doc.getAnimations().map(animation => animation.finished));
      check(doc.querySelectorAll("h1").length === 1, "One page heading required");
      check(doc.documentElement.scrollWidth <= width, "Horizontal overflow");
      check(doc.activeElement?.id === "main", "Route entry must focus main content");
      check(doc.querySelector<HTMLAnchorElement>(".skip-link")?.getAttribute("href") === "#main", "Skip link missing");
      // Load every lazy image, including those beyond the iframe viewport.
      for (const img of doc.images) {
        img.scrollIntoView();
        await waitFor(() => img.complete && img.naturalWidth > 0, `Broken image: ${img.getAttribute("src")}`);
        check(img.alt.trim().length > 0, "Image has no alternative text");
      }
      // axe must run in the iframe's own realm to recognise its DOM elements.
      const script = doc.createElement("script");
      script.textContent = `${axe.source}\nwindow.__websiteAxeResult = axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']}});`;
      doc.head.append(script);
      const audit = await (frame.contentWindow as Window & { __websiteAxeResult: Promise<AxeResults> }).__websiteAxeResult;
      check(audit.violations.length === 0, JSON.stringify(audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target:n.target, summary:n.failureSummary })) }))));
      if (path === "/projects") {
        for (const link of doc.querySelectorAll<HTMLAnchorElement>("article a")) {
          link.focus();
          check(doc.activeElement === link, "Project link cannot receive keyboard focus");
          if (link.target === "_blank") check(link.rel.includes("noopener") && link.rel.includes("noreferrer"), "Unsafe external link");
        }
      }
      if (path === "/intervalsicu") {
        const privacy = doc.querySelector<HTMLAnchorElement>('a[href="/intervalsicu/privacy"]');
        check(privacy, "Privacy route missing");
        privacy.click();
        await waitFor(() => doc.querySelector("h1")?.textContent === "Privacy policy", "Privacy navigation failed");
        check(doc.activeElement?.id === "main", "Privacy navigation did not move focus");
      }
      row.textContent = `${width}px ${path}: PASS`;
      passed++;
    } catch (error) {
      row.textContent = `${width}px ${path}: FAIL ${String(error)}`;
      failed++;
    }
  }
}
document.querySelector("#status")!.textContent = `Complete: ${passed} passed, ${failed} failed`;
