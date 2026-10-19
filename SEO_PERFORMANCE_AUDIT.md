# SEO and Performance Audit

Audit date: 2026-10-19

This audit records the original source code, production build, deployed HTTP behavior, and synthetic mobile performance before optimization. The findings below are preserved as the baseline; implementation status is recorded at the end.

## Executive Summary

The site has a solid semantic and accessibility foundation, but its main SEO limitation is its client-only rendering model. Every direct URL initially serves the same empty React shell with the homepage metadata. Crawlers that do not fully render JavaScript, social preview bots, and link unfurlers therefore cannot reliably see route-specific content or metadata.

The most significant performance issue is the 1.2 MB Tempo Studio hero screenshot, which produced a simulated mobile LCP of 7.96 seconds. The deployment also lacks explicit browser cache policies, while all routes are included in one shared JavaScript bundle.

Recommended order:

1. Prerender routes and provide route-specific metadata.
2. Add `robots.txt`, `sitemap.xml`, canonical URLs, and correct 404 handling.
3. Optimize app screenshots and the homepage portrait.
4. Configure immutable caching for hashed assets.
5. Split route bundles and reduce font delivery.

## Measured Mobile Baseline

Measurements were collected from the local production build using a 390 × 844 viewport, simulated Fast 4G, and 4× CPU throttling. These are synthetic diagnostics, not field Core Web Vitals or Lighthouse scores.

| Route | LCP | Transfer | CLS |
| --- | ---: | ---: | ---: |
| `/` | 2.09 s | 276 KB | 0.002 |
| `/projects` | 1.56 s | 178 KB | 0.001 |
| `/intervalsicu` | 3.06 s | 477 KB | 0.002 |
| `/tempostudio` | 7.96 s | 1.43 MB | 0.017 |

Production build characteristics:

- JavaScript: 341 KB raw, 108 KB gzip.
- CSS: 26 KB raw, 5 KB gzip.
- Emitted font files: 848 KB total.
- Public app screenshots: approximately 4.9 MB total.
- Complete production build: approximately 6.3 MB.

## Findings

### 1. Critical: Routes Are Not Independently Crawlable

Every direct URL initially returns the same `index.html`, which contains an empty `#root` element, the homepage title, and the homepage description. Route content only appears after React executes.

Page-specific metadata is applied later through a `useEffect` in `src/components/PageMeta.tsx`. This is insufficient for social crawlers and less capable search crawlers, and it delays metadata discovery for crawlers that do execute JavaScript.

#### Recommendation

Prerender every public route into route-specific static HTML. Each generated document should contain its final title, description, canonical URL, social metadata, headings, and primary content before JavaScript executes.

Routes to consider prerendering:

- `/`
- `/projects`
- `/intervalsicu`
- `/intervalsicu/privacy`
- `/tempostudio`
- `/tempostudio/privacy`

### 2. Critical: Missing `robots.txt` and Sitemap

The repository does not contain real crawl-control files. In production, requests to `/robots.txt` and `/sitemap.xml` return the application shell with HTTP 200 and `text/html` content.

#### Recommendation

- Add a valid `public/robots.txt`.
- Add or generate `public/sitemap.xml` from the canonical public route list.
- Reference the sitemap from `robots.txt`.
- Decide whether privacy-policy pages should be indexed or marked `noindex`.

### 3. High: Incorrect 404 and SPA Fallback Behavior

CloudFront maps all S3 403 and 404 responses to `/index.html` with HTTP 200. This keeps client-side routes working, but it also means:

- Unknown page URLs become soft 404s.
- Missing scripts, styles, images, `robots.txt`, and sitemap files return HTML with HTTP 200.
- Search engines cannot reliably distinguish valid pages from missing pages.
- Missing assets may fail with MIME-type errors instead of proper 404 responses.

The React not-found route also inherits homepage metadata and cannot set an HTTP 404 status.

#### Recommendation

- Restrict SPA fallback behavior to page-navigation requests.
- Preserve 404 responses for missing files and asset paths.
- Return a real 404 document/status for unknown routes where the hosting architecture allows it.
- Add `noindex, nofollow` metadata to the client-side not-found page as a fallback.

### 4. High: Tempo Studio Hero Image Dominates LCP

`public/images/tempostudio/cover.png` is approximately 1.2 MB and is downloaded at its full 1206 × 2622 resolution even when displayed as a relatively small phone screenshot.

In the simulated mobile audit, this image took approximately 6.9 seconds to transfer and produced an LCP of 7.96 seconds.

Other screenshots range from approximately 214 KB to 831 KB. The Intervals ICU hero screenshot also contributes to its 3.06-second LCP.

#### Recommendation

- Generate AVIF and WebP variants for every screenshot.
- Generate multiple responsive widths and use `srcset` and `sizes`.
- Keep PNG only as a fallback if visual quality requires it.
- Tune screenshot quality while checking text and interface sharpness.
- Preserve intrinsic width and height attributes.
- Continue loading the hero image eagerly with high fetch priority.
- Continue lazy-loading gallery images below the fold.

### 5. High: Incomplete Route Metadata

The app-detail and privacy routes update their title and description after hydration. The homepage receives its metadata from `index.html`, while `/projects` and the not-found route do not define page-specific metadata at all.

Consequently, a direct request to `/projects` initially exposes the homepage title and description.

#### Recommendation

Define the following for every indexable route and include them in prerendered HTML:

- Unique page title.
- Unique meta description.
- Absolute canonical URL.
- Robots directive where required.
- Open Graph metadata.
- Twitter Card metadata.
- Social preview image.

### 6. High: Social Sharing Metadata Is Missing

The site contains no Open Graph or Twitter Card metadata. Links shared in messaging apps and social networks therefore have limited or inconsistent previews.

#### Recommendation

Add route-specific values for:

- `og:type`
- `og:title`
- `og:description`
- `og:url`
- `og:image`
- `og:image:alt`
- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`

Create at least one polished 1200 × 630 social image for the portfolio and, ideally, dedicated images for the two app pages.

### 7. Medium: Structured Data Is Missing

There are no JSON-LD blocks in the application.

#### Recommendation

- Add `Person` structured data to the CV homepage.
- Add `SoftwareApplication` structured data to Intervals ICU Companion and Tempo Studio.
- Add `WebSite` data at the site level if useful.
- Add breadcrumb data only where a visible breadcrumb or clear hierarchy exists.

All structured data should match visible page content and avoid claims such as ratings, prices, or availability unless they are accurate and displayed.

### 8. Medium: All Routes Ship in One JavaScript Bundle

All route components are statically imported in `src/routes.tsx`. This creates one 341 KB raw JavaScript bundle for every page, including app-detail and long privacy-policy content that most visitors do not need.

#### Recommendation

- Lazy-load route components with React Router route-level code splitting.
- Prioritize splitting the privacy pages and app-detail pages.
- Verify that route-specific CSS is split along with the corresponding JavaScript.
- Keep the shared header, footer, tokens, and essential styles in the main bundle.

### 9. Medium: Font Delivery Is Broader Than Necessary

`src/styles/global.css` imports seven complete Fontsource stylesheets. The build emits WOFF and WOFF2 files for Latin, Latin Extended, Vietnamese, and Cyrillic subsets, totaling approximately 848 KB.

Modern browsers only download matching WOFF2 and Unicode subsets, so the full 848 KB is not transferred on each visit. However, tested routes commonly requested five or more font files, adding roughly 70–100 KB and delaying text rendering.

#### Recommendation

- Import only the required Latin or Latin Extended WOFF2 subsets.
- Remove font weights or styles that are not materially used.
- Consider variable font packages if they reduce total transfer size.
- Preload only fonts proven to be critical for LCP; avoid preloading every variant.
- Retain `font-display: swap`.

### 10. Medium: Browser Caching Is Not Explicitly Configured

The deployment workflow runs a single `aws s3 sync` command without assigning cache metadata. Production responses have no explicit `Cache-Control` header.

CloudFront compression is working correctly and Brotli was confirmed for JavaScript. CloudFront also caches responses internally, but browser caching should still be configured deliberately.

#### Recommendation

Deploy files using separate cache policies:

- Hashed assets: `public, max-age=31536000, immutable`.
- HTML: `no-cache` or a short lifetime with revalidation.
- `robots.txt` and sitemap: a moderate lifetime with revalidation.
- Non-hashed public images: either add content hashes or use a controlled shorter lifetime.

Update `.github/workflows/deploy.yml` so cache metadata is reproducible during every deployment.

### 11. Low: Homepage Portrait Improvements

The homepage already provides responsive JPEG sources, but several small improvements remain:

- The source file is 1600 × 1066 while the markup declares 1600 × 1067.
- The image is eager-loaded but does not explicitly use high fetch priority.
- Modern AVIF/WebP alternatives could reduce transfer size further.

#### Recommendation

- Correct the intrinsic height to `1066`.
- Add `fetchPriority="high"` if the portrait remains the expected LCP element.
- Add optimized AVIF/WebP sources using `<picture>`.
- Retain the current descriptive alt text and responsive sizing.

### 12. Low: Content-Level SEO Opportunities

The existing copy clearly describes the developer profile and app functionality. Future organic-search value would come primarily from richer project detail rather than keyword repetition.

#### Recommendation

- Add focused case-study pages for selected projects.
- Explain the problem, technical decisions, constraints, implementation, and outcomes.
- Link related technologies and projects through useful contextual navigation.
- Keep titles and headings natural rather than inserting repetitive keywords.

## Existing Strengths

The following foundations are already implemented well:

- One clear `h1` per page.
- Logical heading hierarchy.
- Semantic landmarks and navigation.
- Descriptive image alt text.
- Explicit image dimensions.
- Lazy loading for screenshot galleries.
- High fetch priority for app hero screenshots.
- Responsive homepage portrait sources.
- Correct `lang="en"` declaration.
- Useful internal links between the CV, projects, apps, support, and privacy pages.
- Excellent measured CLS across all tested routes.
- Self-hosted fonts with `font-display: swap`.
- Brotli compression through CloudFront.
- HTTPS delivery through CloudFront.

## Proposed Implementation Phases

### Phase 1: SEO Foundation

- Add a centralized route metadata model.
- Prerender every public route.
- Add canonical, Open Graph, and Twitter metadata.
- Add `robots.txt` and sitemap generation.
- Add structured data.
- Correct not-found and asset fallback behavior.

### Phase 2: Highest-Impact Performance Work

- Convert screenshots to responsive AVIF/WebP sources.
- Optimize the homepage portrait.
- Configure immutable caching for hashed assets.
- Re-run mobile performance measurements and compare LCP and transfer size.

### Phase 3: Bundle and Font Optimization

- Introduce route-level code splitting.
- Reduce font subsets, formats, and weights.
- Review critical font preloading based on a fresh performance trace.

### Phase 4: Content Expansion

- Add selected project case studies.
- Create dedicated social preview images.
- Register and verify the sitemap in Google Search Console and Bing Webmaster Tools after deployment.

## Validation After Implementation

After changes are deployed, verify:

- Every route returns route-specific HTML when JavaScript is disabled.
- Page source contains the correct title, description, canonical URL, social tags, and JSON-LD.
- `/robots.txt` returns `text/plain` with valid directives.
- `/sitemap.xml` returns XML with canonical URLs.
- Unknown pages and missing assets return HTTP 404 rather than the app shell.
- Hashed assets return immutable one-year cache headers.
- HTML remains revalidated or short-lived.
- Screenshots select an appropriately sized AVIF/WebP source.
- Mobile LCP is below 2.5 seconds where practical.
- CLS remains below 0.1.
- Internal navigation, direct route loads, accessibility checks, and social previews continue to work.

## Implementation Status — 19 October 2026

Implemented locally using red/green TDD:

- Eight prerendered public routes, including two project case studies, with full content before JavaScript executes.
- Shared route metadata for titles, descriptions, canonical URLs, robots directives, Open Graph and Twitter Cards.
- Person, WebSite, WebPage and SoftwareApplication structured data without fabricated ratings or download availability.
- Generated sitemap, valid robots file and a `noindex, nofollow` 404 document. Privacy policies remain indexable.
- Responsive AVIF/WebP sources for every screenshot and the portrait; original PNG full-size links are preserved.
- Three generated 1200 × 630 social preview images matching the site's visual style.
- Route-level JavaScript/CSS splitting, preloaded route styles and hydration of the static HTML.
- Seven Latin WOFF2 font files instead of the original broad font packages.
- Explicit asset/document cache policies in the local production preview. The deployment's separate cache-header upload policies were reverted to retain the original sync behavior.
- S3-only uploads of prerendered documents to their clean URL keys, using the original deployment permissions. CloudFront function/distribution automation was removed at the user's request.
- Project case studies based on the existing RAG Doc Chat and Invoice Extractor information.

The Tempo Studio cover at 512px is approximately 27 KB as AVIF, compared with the original 1.2 MB PNG. Emitted fonts total approximately 134 KB, compared with the original 848 KB. The shared JavaScript bundle is approximately 300 KB raw / 96 KB gzip; other routes now load as separate chunks.

Deployment and account setup remain external steps:

- No live deployment or AWS configuration change was performed during implementation.
- No additional CloudFront permissions are required. The workflow retains the original S3 sync and cache invalidation, with an S3-only upload of clean URL page objects.
- Existing CloudFront error responses, redirects and cache settings remain unchanged. Real HTTP 404 responses and explicit production cache policies remain optional infrastructure follow-ups; the local preview's behavior does not establish their production status.
- After deployment, verify production headers and route HTML, then submit the sitemap through the owner's Google Search Console and Bing Webmaster Tools accounts.

See `TESTING.md` for the red/green record and `verification/seo-performance-results.json` for repeatable synthetic mobile measurements after implementation.

### Mobile Results After Implementation

Three fresh browser contexts per route, using the same 390 × 844 viewport, 150 ms network latency, 200,000 bytes/second download throughput and 4× CPU slowdown as the baseline. The local preview uses Brotli compression. These measurements describe the local build; production and field results must be checked after deployment. The original baseline used one sample per route.

| Route | Original LCP | New median LCP | Original transfer | New median transfer | New median CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 2.09 s | 1.13 s | 276 KB | 199 KB | 0.003 |
| `/projects` | 1.56 s | 1.09 s | 178 KB | 191 KB | 0.001 |
| `/intervalsicu` | 3.06 s | 0.60 s | 477 KB | 222 KB | 0.002 |
| `/tempostudio` | 7.96 s | 0.62 s | 1.43 MB | 224 KB | 0.017 |

Projects gained additional case-study links and a heading, so its resource transfer increased slightly even though LCP improved. Transfer figures measure resource requests, excluding the HTML navigation response, consistently with the original audit.
