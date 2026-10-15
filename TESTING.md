# Validation and red/green record

## Commands

Use Node 22.12+ (Node 24 is used in CI). Run `npm ci`, then `npx playwright install chromium` once.

- `npm test`: route and user-interaction tests using the real route configuration.
- `npm run build`: TypeScript checks and production bundle.
- `npm run test:e2e`: production-server checks on desktop and mobile Chromium, including axe accessibility, direct URL/reload, keyboard/touch interaction and overflow.
- `npm run check`: all of the above. CI installs Chromium automatically.

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` optionally selects an existing Chromium binary. Otherwise Playwright uses its managed browser. No external website or real account is required by tests.

## 15 October 2026 — overall coverage

Red: first test import failed because production routes were defined inside the browser entry point. Extracting the existing routes made three baseline checks pass. The unknown-URL test then failed: React Router displayed its developer error screen rather than a recovery page.

Green: shared production routes and a fallback page make all four component tests pass. Tests cover CV/experience/contact content, real project destinations, secure external links, keyboard navigation, active navigation state, main-content focus and the skip link. Production build passes.

Browser execution in the Codex shell is currently blocked by macOS sandbox restrictions (`bootstrap_check_in … Permission denied`), before tests execute. Browser tests are included for local/CI execution; this environment failure is not a passing browser check. Dependency installation used a writable temporary npm cache; `npm audit` reports zero vulnerabilities after compatible updates and selecting a patched Vitest release.

## 15 October 2026 — companion app landing page

Red: all three new `/intervalsicu` tests failed against the existing fallback page (missing overview, screenshots and privacy/support links).

Green: implemented the overview, four feature explanations, screenshot gallery, provider/availability caveats and contact/privacy links. Eleven component/asset tests pass. Four unedited 1206×2622 screenshots were exported from a passing, demo-only Xcode UI capture on iPhone 17 / iOS 27. They contain no personal account data. The temporary capture harness was restored afterward; app product code was not changed. File tests validate the actual PNG headers and dimensions. In-app browser review confirmed all four images loaded after restarting Vite (new public directories were not observed by the sandboxed file watcher).
