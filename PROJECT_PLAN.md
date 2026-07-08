# Personal / Portfolio Page — Build Plan

## Context

Jonathan wants a simple, polished personal portfolio site with two routes:

- `/` — a web version of his CV (summary, experience, tech stack), clearly surfacing the tech he works with.
- `/projects` — a showcase of personal projects as flip cards (front: name + short blurb; back: tech stack + GitHub link).

It must be a static site hostable on **S3 + CloudFront**, built simply with **React**. The repo currently contains only `docs/` (`work-history.md`, CV PDF). This is a greenfield build.

**Locked decisions (confirmed with user):**
- Aesthetic: **Warm print / editorial** — off-white paper, characterful display serif, generous whitespace, one deep ink accent. Light theme.
- Tooling: **Vite + React + TypeScript + react-router-dom** → static `dist/`.
- Projects content: **scaffold with 2–3 clearly-marked placeholders** in a typed data file; real repos filled in later.

**Content constraints (from `docs/work-history.md`):**
- Remove **Java** from the tech stack. Spring Boot (Java framework) is dropped alongside it for consistency — flag for confirmation.
- Experience entries stay factual and **tech-stack-focused**; do not overstate leadership, keep specific-project detail light.
- Currently in South Korea; keep any availability/timezone copy neutral (no German-hours claim unless clearly framed).
- No lying / no overclaiming.

---

## Design Direction (locked)

- **Register:** Brand (the portfolio design *is* the product).
- **Color strategy:** Restrained. One accent ≤10% of the surface.
  - Paper: `oklch(0.975 0.008 85)` (warm off-white)
  - Ink (text): `oklch(0.26 0.02 60)` (warm near-black, never `#000`)
  - Accent: deep rust/sienna `oklch(0.52 0.15 45)` for links, rules, active states
  - Muted: warm grey `oklch(0.55 0.015 70)` for metadata/labels
- **Type:** Display serif **Spectral** (headings) + humanist sans **Public Sans** (body, UI, labels). Bundled via `@fontsource/*` (no external CDN). Modular scale with `clamp()`, ≥1.25 ratio between steps.
- **Layout:** Left-aligned, generous asymmetric whitespace, body text capped 65–75ch. Not a centered icon-title-card stack.
- **Motion:** Subtle staggered entrance on load, ease-out (quart/expo). Respect `prefers-reduced-motion`. The one deliberate motion moment is the project card flip.

---

## Information Architecture

```
/            Home / CV
  - Hero            name, role one-liner, primary tech line, nav to /projects
  - About           2–3 sentence professional summary (from work-history overview)
  - Tech Stack      grouped, Java removed, clearly scannable
  - Experience      reverse-chronological, tech-focused entries
  - (Education/Contact footer)

/projects    Projects showcase
  - Intro line
  - Grid of flip cards (front: name + blurb; back: tech + GitHub link)

Shared: header nav (/ ↔ /projects), footer (GitHub, LinkedIn, email)
```

---

## Tech Stack & Project Structure

```
src/
  main.tsx              router setup (createBrowserRouter)
  App.tsx               layout shell (Header + <Outlet/> + Footer)
  routes/
    Home.tsx
    Projects.tsx
  components/
    Header.tsx  Footer.tsx
    Section.tsx
    TechStack.tsx
    ExperienceItem.tsx
    ProjectCard.tsx      the flip card
  data/
    cv.ts                typed CV content (summary, roles, tech groups)
    projects.ts          typed project list (placeholders)
  styles/
    tokens.css           CSS custom properties (color, type scale, spacing)
    global.css           reset + base element styles
  types.ts
index.html
vite.config.ts
```

Deps: `react`, `react-dom`, `react-router-dom`, `@fontsource/spectral`, `@fontsource/public-sans`, dev: `vite`, `typescript`, `@vitejs/plugin-react`, `@types/*`.

---

## Work Packages

Each WP has a **testable requirement**. "Verify" = the acceptance check.

### WP0 — Scaffold
Create Vite React-TS app, add react-router with `/` and `/projects`, install font packages.
- **Verify:** `npm run dev` serves; navigating to `/` and `/projects` renders distinct placeholder pages; `npm run build` produces `dist/` with `index.html` + assets; `npm run preview` serves the built bundle.

### WP1 — Design tokens
Implement `tokens.css` (OKLCH colors above, fluid type scale, spacing scale) and `global.css` (reset, paper background, Spectral for headings, Public Sans for body).
- **Verify:** A sample heading renders in Spectral, body in Public Sans, on the warm paper background; all colors resolve from CSS variables (none hard-coded in components); no `#000`/`#fff` anywhere.

### WP2 — Layout shell
`App.tsx` with `Header` (name/wordmark + nav links) and `Footer` (GitHub, LinkedIn, email). Active-route styling on nav.
- **Verify:** Header appears on both routes; clicking nav switches route without full reload; active link is visually distinct; footer links have correct `href`s and open external links in a new tab (`rel="noopener noreferrer"`).

### WP3 — CV content model
`data/cv.ts`: typed summary, role entries (company, title, dates, 1–2 tech-focused lines each), tech groups. Populate from `work-history.md`, honoring content constraints.
- **Verify:** `cv.ts` typechecks against `types.ts`; contains all 5 relevant roles (FFB, Triplesense Reply, Garuda, CIB intern, tutoring optional); no role text overstates leadership beyond what the source supports; **no occurrence of "Java"** in the tech data.

### WP4 — Home page sections
Build Hero, About, Tech Stack, Experience from `cv.ts`. Tech Stack grouped (e.g. Frontend / Backend & Cloud / Tooling & Other) and scannable.
- **Verify:** Each section renders from data (not hard-coded JSX content); Experience is reverse-chronological; Tech Stack visibly groups items; automated/string check confirms **"Java" (and Spring Boot) absent** from rendered output; body text blocks ≤75ch.

### WP5 — Projects data model
`types.ts` `Project` = `{ name, blurb, tech: string[], githubUrl }`. `data/projects.ts` with 2–3 `// TODO` placeholder projects.
- **Verify:** Typechecks; each placeholder has all four fields; placeholders clearly marked as TODO.

### WP6 — Flip card component
`ProjectCard.tsx`: 3D flip on hover (front → back). Front = name + blurb; back = tech list + GitHub link. Accessible: also flips on keyboard focus, is operable on touch (tap toggles), GitHub link reachable.
- **Verify:** Hover flips front→back and reveals tech + GitHub link; keyboard `Tab` focus flips the card; on touch/no-hover the back is reachable (tap-to-flip fallback); GitHub link opens the repo in a new tab; `prefers-reduced-motion` disables the flip animation (instant swap instead). Flip animates `transform` only (not layout properties).

### WP7 — Projects page
Render grid of `ProjectCard` from `projects.ts` using `repeat(auto-fit, minmax(280px, 1fr))`.
- **Verify:** One card per data entry; grid reflows without media-query breakpoints from mobile to wide; intro line present.

### WP8 — Responsive & a11y polish
Mobile layout, semantic landmarks/heading order, focus-visible states, color contrast AA, reduced-motion across the site.
- **Verify:** Usable at 375px and 1440px with no horizontal scroll; single `<h1>` per page and no skipped heading levels; visible focus ring on all interactive elements; text/accent contrast passes AA; entrance motion respects reduced-motion.

### WP9 — Static deploy config (S3 + CloudFront)
Document/prepare deployment. **SPA routing gotcha:** a direct hit to `/projects` returns 403 from raw S3.
- Recommended fix: CloudFront **custom error responses** mapping 403 and 404 → `/index.html` with response code 200 (so react-router handles the route). Alternative noted: `HashRouter` (no server config, URLs get `#`).
- **Verify:** `dist/` uploads to an S3 bucket; CloudFront serves `/`; a **hard refresh / direct load of `/projects` returns the app (200), not an S3 error**; a `README`/deploy note documents the bucket + CloudFront error-response settings and an invalidation step for redeploys.

---

## Sequencing

WP0 → WP1 → WP2 form the foundation. WP3→WP4 (home) and WP5→WP6→WP7 (projects) can proceed in parallel after WP2. WP8 and WP9 are the closing passes.

---

## Verification (end-to-end)

1. `npm run dev` — click through `/` and `/projects`, confirm nav, content, and card flip (hover + keyboard + reduced-motion).
2. String/grep check on built output for absence of "Java"/"Spring Boot".
3. Resize to 375px and 1440px — no horizontal scroll, layout holds.
4. `npm run build && npm run preview` — built bundle behaves identically.
5. (Deploy) After S3/CloudFront setup, hard-refresh `/projects` in the browser and confirm the app loads (200), validating the SPA-fallback config.

---

## Open Items (non-blocking)

- **Spring Boot**: dropped with Java for consistency. Confirm if it should stay.
- **LinkedIn URL / GitHub username / preferred contact email**: needed for footer links (email `griesinger.jonathan16@gmail.com` on file). Placeholders until provided.
- **Tutoring role**: include on CV or omit as non-engineering. Default: omit from Experience, optionally note under a brief "also" line.
