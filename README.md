# Jonathan Griesinger — Personal Page

A small, static personal site built with React, TypeScript, and Vite.

- `/` — CV: summary, tech stack, experience.
- `/projects` — personal projects as hover/tap flip cards linking to GitHub.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + bundle to dist/
npm run preview    # serve the production build locally
```

## Tests

Use Node 22.12+ and install the test browser once with `npx playwright install chromium`.
Run `npm test` for route/component checks, `npm run test:e2e` for desktop/mobile production-browser and accessibility checks, or `npm run check` for all checks including the build. See [TESTING.md](TESTING.md) for the red/green record and environment limitations. GitHub Actions runs the complete suite on pushes and pull requests.

## Before you ship

Two placeholder files need real values:

- `src/data/site.ts` — your GitHub and LinkedIn URLs (email is set).
- `src/data/projects.ts` — replace the three `// TODO` placeholder projects.

## Deploy to S3 + CloudFront (static)

`npm run build` produces a fully static `dist/` (HTML, JS, CSS, self-hosted fonts). No server runtime is required.

### 1. S3 bucket

Create a private bucket (e.g. `griesinger-portfolio`) and upload the build:

```bash
npm run build
aws s3 sync dist/ s3://YOUR_BUCKET --delete
```

Keep the bucket private and serve it through CloudFront with an Origin Access Control (OAC); do not enable public S3 website hosting.

### 2. CloudFront distribution

- **Origin:** the S3 bucket, using **Origin Access Control (OAC)** (CloudFront-recommended). Attach the generated bucket policy.
- **Default root object:** `index.html`.
- **Viewer protocol policy:** Redirect HTTP to HTTPS.

### 3. SPA routing fallback (required)

This app uses client-side routing (`react-router`). A direct request to `/projects`
has no matching S3 object, so S3 returns 403/404. Map those back to the app shell so
the router can handle the path.

In the CloudFront distribution, add **Custom error responses**:

| HTTP error code | Response page path | HTTP response code |
| --------------- | ------------------ | ------------------ |
| 403             | `/index.html`      | 200                |
| 404             | `/index.html`      | 200                |

> Alternative with no CloudFront config: switch `createBrowserRouter` to a hash
> router in `src/main.tsx`. URLs then look like `/#/projects`. The custom-error
> approach above keeps clean URLs and is recommended.

### 4. Redeploys

CloudFront caches aggressively. After each `aws s3 sync`, invalidate the cache:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

Hashed asset filenames (fonts, JS, CSS) are safe to cache long-term; `index.html`
should be revalidated, which the invalidation above handles.

## Verify the deploy

Load the site, then **hard-refresh `/projects` directly** (not via in-app
navigation). It should return the app with a 200, not an S3 error page. That
confirms the SPA fallback is configured correctly.
