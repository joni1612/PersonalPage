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

Create a private bucket (e.g. `griesinger-portfolio`). The deployment workflow uploads assets first, then images and documents with explicit cache headers. It retains older hashed assets so visitors with an open tab can still navigate after a deployment.

```bash
npm run build
npm run test:build
```

Keep the bucket private and serve it through CloudFront with an Origin Access Control (OAC); do not enable public S3 website hosting.

### 2. CloudFront distribution

- **Origin:** the S3 bucket, using **Origin Access Control (OAC)** (CloudFront-recommended). Attach the generated bucket policy.
- **Default root object:** `index.html`.
- **Viewer protocol policy:** Redirect HTTP to HTTPS.

### 3. Static route rewrites and real 404s (required)

The build creates `/projects/index.html` and equivalent documents for every public route. A generated CloudFront viewer-request function rewrites only known routes to these objects. It redirects trailing-slash and `index.html` URLs to their canonical clean URLs, preserving query parameters. Requests for files and unknown routes pass through to S3.

The deployment workflow runs `node scripts/configure-cdn.mjs --apply` to publish the routing function and associate it with the default behavior. It changes the old SPA custom error responses to:

| HTTP error code | Response page path | HTTP response code |
| --------------- | ------------------ | ------------------ |
| 403             | `/404.html`        | 404                |
| 404             | `/404.html`        | 404                |

The deployment role additionally needs `cloudfront:GetDistribution`, `cloudfront:GetDistributionConfig`, `cloudfront:UpdateDistribution`, `cloudfront:ListFunctions`, `cloudfront:DescribeFunction`, `cloudfront:CreateFunction`, `cloudfront:UpdateFunction`, and `cloudfront:PublishFunction`. Scope distribution operations to the website and function operations to `personal-page-routes-*` where IAM supports resource restrictions. The script preserves unrelated distribution settings and refuses to replace an existing viewer-request function or Lambda association. Integrate such an existing function explicitly before deployment.

To prepare and inspect the changes using AWS credentials without applying them:

```bash
CLOUDFRONT_DISTRIBUTION_ID=YOUR_DIST_ID node scripts/configure-cdn.mjs
```

Inspect `.prerender/cloudfront-function.js` and `.prerender/distribution-config.json`, then use `--apply` when ready to deploy. No AWS changes are made by the normal build or tests.

### 4. Redeploys

CloudFront caches aggressively. After each `aws s3 sync`, invalidate the cache:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

The workflow sets hashed assets to `public, max-age=31536000, immutable`, images to a one-day revalidated lifetime, HTML to `no-cache`, and crawl files to a one-hour revalidated lifetime. CloudFront compression remains enabled.

## Verify the deploy

Load and hard-refresh `/projects` directly. Its HTML source must contain the Projects heading and unique metadata. Confirm that `/robots.txt` returns plain text, `/sitemap.xml` returns XML, and both an unknown page and a missing asset return HTTP 404. Use `npm run preview` to exercise the same routing, content types and cache policies locally.

After deployment, register `https://jonathangriesinger.de/sitemap.xml` in Google Search Console and Bing Webmaster Tools using the site owner's accounts. Account verification is an external setup step, not part of the build.

## Tempo Studio publication pages

- `/tempostudio` — guided native video editor, real demo screenshots, current Intervals.icu integration and support.
- `/tempostudio/privacy` — Tempo Studio's native-PKCE, media, route/fitness data, local retention and sharing policy.
- `/projects` — includes Tempo Studio alongside the existing Companion and repository projects.

After deployment, use `https://jonathangriesinger.de/tempostudio` for marketing, `https://jonathangriesinger.de/tempostudio#support` for support and `https://jonathangriesinger.de/tempostudio/privacy` for the App Store privacy URL. The app is preparing for launch; no App Store download link or badge is fabricated. Keep the public policy and App Store privacy answers consistent with the shipping binary.

The generated CloudFront function covers direct requests to both Tempo Studio routes. A push to `main` triggers the S3/CloudFront deployment workflow. Creating a local commit does not deploy the site. The privacy URL must be publicly reachable before submitting the iOS app.
