# Rucking Revolution — Revisited (v2)

A separate, civilian-first rebuilding of Rucking Revolution. The supplied design mockups guide layout and interaction; published information from the organisations behind formal fitness tests guides the content. This repository never writes to `ruishinor/rucking-revolution`.

## What is here

- Home, Training, Testing Library, Resources and About hubs plus dedicated training, article, field-note, route, reading, event-preparation, community and tools pages.
- Practical goal-based three-session training-week builder.
- Six source-linked fitness tests, each with its own detailed page.
- Search, category filters, country/type/scoring/instructions filters, sorting, grid/list layouts, and up-to-three comparison.
- A comparison page with original links, plus a shareable URL.
- Responsive design, visible keyboard focus, native HTML controls and reduced-motion support.
- New ImageGen photographic-style hero, six cohesive editorial card scenes and premium icon family; locally bundled SVG flags and original page-illustration work. No remote images, trackers, cookies or sign-in.
- Static export and optional Vercel deployment, with a Content Security Policy and security-related headers.

## Run on your computer

Requires Node.js 20 or later. There are no runtime packages to install.

```powershell
npm test
npm run build
npm run dev
```

Open `http://127.0.0.1:4173/testing-library/`. `npm run build` creates a complete static site in `dist/`.

For an existing Windows checkout, use the separately delivered expansion bundle and installer. The original first-publish script is retained for historical reference and must not be rerun on a populated repository.

## Sources and editorial decisions

- The original repository's Astro information architecture, training sections, workouts and brand foundation informed supporting content. It was read without modification.
- The screenshots define the six-card library and the filter/compare interface.
- The PFQ is a five-part NTOA test, not just a 1.5-mile run.
- Artillerijeger is Norwegian; the role page currently lists an 8 km pack run with 22 kg in 52 minutes. The screenshot's Danish flag and 20 km/4 h value are not carried into v2.
- The NSW Police PCT includes a beep test, strength and agility work; the pictured 2.4 km figure is not the published PCT.
- Danish Police uses a 2,400 m run within a six-part entry test, not a 3,000 m run.
- The U.S. Army's current RASP overview includes a 12-mile ruck with a 35 lb dry pack but does not state a time limit on that page. No time is presented as a current requirement.
- For Norwegian Armed Forces general tests, thresholds depend on the test and individual criteria; no universal 3 km cut-off is claimed.

Official sources are linked on each test page and comparison. The public pages were reviewed on **24 November 2026**. Organisational requirements may change. The images are editorial illustrations, not photos of the official programmes.

## Build and checks

- `npm test`: Node's built-in test runner checks catalogue identity, links, queries, selection and HTML generation.
- `npm run build`: copies local files and prepares 27 static routes.
- `node scripts/check-site.mjs`: checks exported pages and assets.
- `.github/workflows/ci.yml`: performs unit/build checks and a Playwright Chromium browser suite in GitHub Actions.
- `e2e/library.spec.mjs`: checks search, filtering, comparison, detail citations, the training-week builder, content routes, mobile navigation and overflow.
- `archive/nb-NO.json`: retained Norwegian interface strings (unpublished; English-only public site).

Implementation choices follow the general direction of W3C WCAG 2.2, Playwright's role-based locators and web-first assertions, and OWASP's guidance on Content Security Policy. **No accessibility conformance claim is made until the browser and assistive-technology checks have actually been completed.**

## Limitations

The screenshots show a single desktop page, so the remaining pages have been inferred from the source site's stated purpose and existing content. The fitness-test section and interactive comparison remain the core of v2. Supporting pages now cover 11 curated topic areas, but are adapted summaries—not complete verbatim copies of every original article, event, resource or route. There is no live event-booking or newsletter service. The connected GitHub integration still cannot write binary assets, so the upgrade bundle publishes through the authenticated local checkout.
