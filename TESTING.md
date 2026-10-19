# Validation and red/green record

## Commands

Use Node 22.12+ (Node 24 is used in CI). Run `npm ci`, then `npx playwright install chromium` once.

- `npm test`: route and user-interaction tests using the real route configuration.
- `npm run build`: TypeScript checks and production bundle.
- `npm run test:build`: generated HTML, crawl files, responsive image budgets, route splitting, font budgets and CloudFront routing/configuration tests.
- `npm run test:e2e`: production-server checks on desktop and mobile Chromium, including axe accessibility, direct URL/reload, keyboard/touch interaction and overflow.
- `npm run check`: all of the above. CI installs Chromium automatically.

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` optionally selects an existing Chromium binary. Otherwise Playwright uses its managed browser, falling back to installed Google Chrome on macOS when the managed binary is absent. No external website or real account is required by tests.

After building, `npm run audit:performance` records three cold-context samples per main route under the original audit's Fast 4G / 4× CPU conditions. It writes raw results and medians to `verification/seo-performance-results.json`. These synthetic diagnostics are not field Core Web Vitals or Lighthouse scores.

## 15 October 2026 — overall coverage

Red: first test import failed because production routes were defined inside the browser entry point. Extracting the existing routes made three baseline checks pass. The unknown-URL test then failed: React Router displayed its developer error screen rather than a recovery page.

Green: shared production routes and a fallback page make all four component tests pass. Tests cover CV/experience/contact content, real project destinations, secure external links, keyboard navigation, active navigation state, main-content focus and the skip link. Production build passes.

Browser execution in the Codex shell is currently blocked by macOS sandbox restrictions (`bootstrap_check_in … Permission denied`), before tests execute. Browser tests are included for local/CI execution; this environment failure is not a passing browser check. Dependency installation used a writable temporary npm cache; `npm audit` reports zero vulnerabilities after compatible updates and selecting a patched Vitest release.

## 15 October 2026 — companion app landing page

Red: all three new `/intervalsicu` tests failed against the existing fallback page (missing overview, screenshots and privacy/support links).

Green: implemented the overview, four feature explanations, screenshot gallery, provider/availability caveats and contact/privacy links. Eleven component/asset tests pass. Four unedited 1206×2622 screenshots were exported from a passing, demo-only Xcode UI capture on iPhone 17 / iOS 27. They contain no personal account data. The temporary capture harness was restored afterward; app product code was not changed. File tests validate the actual PNG headers and dimensions. In-app browser review confirmed all four images loaded after restarting Vite (new public directories were not observed by the sandboxed file watcher).

## 15 October 2026 — public privacy information

Red: all four privacy route/content/navigation tests failed before the route existed.

Green: 15 component/asset tests pass. The public page identifies the developer and contact, effective date, accessed data, purposes, on-device and transient server processing, retention, recipients, international processing, consent and rights, children, policy changes and exact disconnect behaviour. Tests specifically reject misleading never-leaves-device claims and require failed-revocation and uninstall/Keychain caveats. It has a table of contents, mobile layout, page metadata and routes back to the overview. Privacy scope was checked against Apple guideline 5.1.1, the actual Swift models/cache/Keychain/widget implementation, and the stateless OAuth Worker. Provider policy links are direct official links.

The live-browser runner (`/tests/browser.html`, development only) is an alternative to launching a new browser process. It runs axe inside each iframe's own realm, because cross-window DOM/options fail axe's argument validation. It covers five real routes at 1280px and 390px, image loading and navigation/focus in addition to accessibility.

Live-browser result: **10 passed, 0 failed**. Initial contrast failures sampled the existing CV/Projects entrance animation while text was nearly transparent. Waiting for font readiness and the finite animations to finish made the audit evaluate the actual settled page without changing product colours or disabling accessibility rules. The landing and privacy pages were also reviewed visually at phone width with no horizontal overflow.

## 15 October 2026 — companion project card

Red: all three new card tests failed before the app was added: no internal app destination, no keyboard path into the overview, and only five cards.

Green: the sixth card links to the overview, with SwiftUI/Swift Charts/WidgetKit/OAuth/Workers details. A union type requires exactly one internal or external destination; the existing five GitHub destinations are retained. All 18 component/asset tests pass. Keyboard navigation reaches the overview, main content receives focus, and the All projects link returns to the portfolio. Playwright adds mouse/touch and keyboard end-to-end cases; the live-browser runner also exercises the actual internal project navigation at both widths.

Final local verification: **18 component/asset tests passed; 10 live-browser route/accessibility checks passed** (five routes at both widths); production TypeScript/Vite build passed; dependency audit found zero vulnerabilities. Additional in-app-browser clicks and keyboard activation opened the companion overview from its card and focused main content. Playwright's separate 20 production-browser cases are configured for local/CI execution but could not be launched by this sandbox; do not confuse that limitation with the passing live-browser suite. No push or deployment was performed.

## Tempo Studio pages (18 October 2026)

Added failing route tests first: the app overview, screenshot gallery, public privacy policy and portfolio navigation all failed at the missing routes. The initial real-asset tests also fail when the new screenshots are absent. The implementation follows the existing Companion pages and shared editorial styles, adds no network SDK, uses explicit native screenshot dimensions and self-hosted files, and preserves all existing project destinations.

New browser regressions cover direct load/reload, viewport overflow, WCAG/axe checks, actual image loading, keyboard navigation from Projects, privacy anchor links, focus and support links at desktop/mobile widths. Final test output is retained in `verification/tempostudio-*`.

Final results: **27 unit/asset tests pass**, the production build succeeds and **26 desktop/mobile browser tests pass**, including the existing Companion routes. The packaged Playwright headless executable was absent; the existing executable-path setting was used with installed Google Chrome and an isolated test profile. No test assertions were skipped. A local in-app-browser visual check confirmed the overview and screenshot presentation. No deployment was performed.

## SEO and performance (19 October 2026)

Red: `node --test tests/seo-build.test.mjs` failed all nine checks because the homepage had no crawlable heading, other route HTML files were absent, and no crawl files existed. `npm test -- tests/seo.test.tsx` failed because Open Graph metadata was missing. The performance and hosting tests then failed on missing responsive images, route manifest and routing implementation.

Green: prerendered route documents now contain their visible content, unique metadata, canonical URLs, social previews and structured data. Client navigation updates the same metadata model. Privacy policies remain indexable, unknown pages use `noindex, nofollow`, and crawl files contain only public canonical URLs. Project case studies are generated alongside the existing six pages.

Performance checks require AVIF/WebP responsive sources, an AVIF Tempo hero below 100 KB at 512px, route code splitting, and at most seven Latin WOFF2 files below 150 KB total. Hosting tests execute the generated edge function against known pages, trailing-slash redirects, unknown pages and missing assets, and verify preservation of unrelated CDN settings.

Browser tests now cover every route with JavaScript disabled, hydration and back navigation, metadata updates without duplicate tags, real 404 responses, crawl-file content types, and modern screenshot loading. The original full-size PNG destinations remain tested.

The first browser run exposed a startup deadlock: the entry module awaited a lazy route whose shared dependencies imported that same entry module. Moving startup into an async function allowed module initialization to finish and fixed all eight failing hydration/focus checks. A further red/green regression caught double-encoding of query parameters in canonical redirects. The preview now mirrors production Brotli compression, covered by a response-header check.

Final verification: **28 unit/asset tests and 14 generated-build/hosting tests pass**. The full browser suite passed **46 desktop/mobile checks**, followed by **four additional desktop/mobile case-study accessibility checks**. Production builds and whitespace checks pass. No AWS writes or deployment were performed. The deployment role needs the additional CloudFront permissions in `README.md` before publishing.

The performance run collected three samples for each main route. Median LCP was 1.13 s on the homepage, 1.09 s on Projects, 0.60 s on Intervals ICU Companion and 0.62 s on Tempo Studio. Raw samples, resource transfer figures and CLS are retained in `verification/seo-performance-results.json`; the audit document compares them with the original baseline.
