# Jonathan Griesinger — Personal Page

A small, static personal site built with React, TypeScript, and Vite.

- `/` — CV: summary, tech stack, experience.
- `/projects` — personal projects as hover/tap flip cards linking to GitHub or their app pages.
- `/intervalsicu` — companion app overview, simulator screenshots and support contact.
- `/intervalsicu/privacy` — public privacy policy for the iOS app, widget and OAuth login service.
- `/tempostudio` and `/tempostudio/privacy` — video editor overview and privacy policy.
- `/projects/rag-doc-chat` and `/projects/invoice-extractor` — project case studies.

## Develop

```bash
npm install
npm run dev        # generate images, then serve at http://localhost:5173
npm run build      # images, type-check, split client bundle, static HTML, crawl files
npm run preview    # serve the production build locally
```

## Tests

Use Node 22.12+ and install the test browser once with `npx playwright install chromium`.
Run `npm test` for route/component checks, `npm run test:build` after building for generated SEO/image/hosting checks, and `npm run test:e2e` for desktop/mobile production-browser and accessibility checks. `npm run check` runs all checks including the build. See [TESTING.md](TESTING.md) for the red/green record. GitHub Actions runs the complete suite on pushes and pull requests.

If your environment cannot launch a test browser, start `npm run dev` and open `/tests/browser.html` in an existing browser. It checks the real routes at desktop/mobile widths with axe, loaded images, focus, navigation and overflow. This development-only runner is not included in `dist/`.

## Companion app publication pages

After deployment, use your site origin plus `/intervalsicu` as the app website/support URL (support contact is on that page), and `/intervalsicu/privacy` as the privacy URL in App Store Connect and the Intervals.icu app registration. The pages do not claim the app is already downloadable. Add the deployed privacy link to the iOS app's Settings before submission; this website change does not modify the iOS product.

The privacy copy follows the current app and stateless OAuth code. Before publishing it, verify the actual Cloudflare/AWS logging configuration and email-provider retention against the policy. The page deliberately does not promise that infrastructure has no logs or that uninstall always removes a Keychain credential. Keep the policy, App Store privacy questionnaire and actual product behaviour consistent.

## Site content

Profile/contact information lives in `src/data/site.ts` and `src/data/cv.ts`.
Projects live in `src/data/projects.ts`; each has either an external `githubUrl` or an internal `pagePath`. The companion card uses `/intervalsicu` and does not advertise a nonexistent public repository.

Route titles, descriptions, canonical URLs, social metadata and schema live in `src/data/seo.ts`. All eight public pages, including both privacy policies, remain indexable. Add new pages to the metadata map and both route configurations; build tests enforce the published HTML contract. Case studies use only the project information already present in this repository.

The build generates responsive AVIF/WebP images and 1200 × 630 social JPEGs with Sharp. Generated images are ignored by Git and recreated from the original checked-in screenshots and portrait. Original PNGs remain available from full-size screenshot links. Routes load their own JavaScript/CSS; the initial HTML contains the visible content, metadata and route stylesheet before hydration.

## Deploy to S3 + CloudFront (static)

`npm run build` produces a fully static `dist/` (HTML, JS, CSS, self-hosted fonts). No server runtime is required.

### 1. S3 bucket

Create a private bucket (e.g. `griesinger-portfolio`). The deployment workflow uses the original `aws s3 sync dist/ ... --delete` upload, publishes the prerendered pages at their clean URL keys, and invalidates CloudFront's cache.

```bash
npm run build
npm run test:build
```

Keep the bucket private and serve it through CloudFront with an Origin Access Control (OAC); do not enable public S3 website hosting.

### 2. CloudFront distribution

- **Origin:** the S3 bucket, using **Origin Access Control (OAC)** (CloudFront-recommended). Attach the generated bucket policy.
- **Default root object:** `index.html`.
- **Viewer protocol policy:** Redirect HTTP to HTTPS.

### 3. Prerendered pages with the existing deployment

The build creates `/projects/index.html` and equivalent documents for every public route. After the normal sync, `scripts/deploy-pages.mjs` copies each document to an S3 object with its clean URL as the key. For example, `dist/projects/index.html` is uploaded to the object `projects` with content type `text/html; charset=utf-8`. Nested paths such as `tempostudio/privacy` work the same way. The homepage remains `index.html`.

This uses the existing S3 upload permissions and requires no CloudFront Function or distribution update. For a manual deployment:

```bash
aws s3 sync dist/ s3://YOUR_BUCKET --delete
node scripts/deploy-pages.mjs YOUR_BUCKET
```

The deployment role needs only the original bucket permissions (`s3:ListBucket`, `s3:PutObject`, `s3:DeleteObject`) and `cloudfront:CreateInvalidation`. CloudFront routing, error responses and cache settings are not changed by deployment.

The existing SPA error fallback can remain as configured. If it maps missing objects to `/index.html` with HTTP 200, missing pages will continue to have that status in production, even though the client recovery page uses `noindex`. Correct HTTP 404 responses would require a separate manual CloudFront configuration change. Automatic trailing-slash redirects are likewise not configured by deployment.

### 4. Redeploys

CloudFront caches aggressively. After each `aws s3 sync`, invalidate the cache:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

The original sync behavior and existing CloudFront cache/compression settings are retained. Deployment no longer applies the separate cache-header upload policies introduced during the audit implementation.

## Verify the deploy

Load and hard-refresh `/projects` and `/tempostudio/privacy` directly. Their HTML source must contain the correct heading and unique metadata. Confirm that `/robots.txt` returns plain text and `/sitemap.xml` returns XML. The local preview serves real 404s and explicit cache policies for development checks; those responses do not imply that the existing production CloudFront configuration was changed.

After deployment, register `https://jonathangriesinger.de/sitemap.xml` in Google Search Console and Bing Webmaster Tools using the site owner's accounts. Account verification is an external setup step, not part of the build.

## Tempo Studio publication pages

- `/tempostudio` — guided native video editor, real demo screenshots, current Intervals.icu integration and support.
- `/tempostudio/privacy` — Tempo Studio's native-PKCE, media, route/fitness data, local retention and sharing policy.
- `/projects` — includes Tempo Studio alongside the existing Companion and repository projects.

After deployment, use `https://jonathangriesinger.de/tempostudio` for marketing, `https://jonathangriesinger.de/tempostudio#support` for support and `https://jonathangriesinger.de/tempostudio/privacy` for the App Store privacy URL. The app is preparing for launch; no App Store download link or badge is fabricated. Keep the public policy and App Store privacy answers consistent with the shipping binary.

The clean-key S3 uploads cover direct requests to both Tempo Studio routes. A push to `main` triggers the S3/CloudFront deployment workflow. Creating a local commit does not deploy the site. The privacy URL must be publicly reachable before submitting the iOS app.
