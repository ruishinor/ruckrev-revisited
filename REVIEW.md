# V2 implementation review — 24 November 2026

## Scope and decisions

The two desktop screenshots are the visual reference for the Testing Library. The original project is a read-only source of brand background, page purpose and adjacent topics. The old `/library` refers to digital products, so v2's test library has its own `/testing-library/` route.

The website uses a dependency-free HTML/CSS/JavaScript implementation. This avoids inheriting the original site's large dependency graph and server-side features before v2 needs them. The test catalogue is structured content in `src/data/assessments.mjs` rather than text embedded in cards. Filtering and selection logic are in `src/lib/catalog.mjs`.

The writing uses everyday language. Formal organisation and programme names remain intact where they identify the actual test.

## Checks performed

- Reviewed original repo structure, source brand foundation, training data, and original testing pages without changing them.
- Checked published test descriptions against NTOA, U.S. Army, Forsvaret, NSW Police Recruitment and Danish Police sites.
- Nine Node tests passed, including app HTML generation, six unique test identities, source links, filtering, comparison selection and no incorrect carry-over of screenshot figures.
- Twelve static pages built; static asset checks passed.
- Local web server returned HTTP 200 for tested pages, JavaScript modules, stylesheets and images.
- Source files passed Node syntax checks.
- Added Playwright test cases and GitHub Actions jobs for browser tests on desktop/mobile.

## Remaining verification and development

1. Browser automation did not run here because Chromium navigation is blocked by this runtime's administrator policy. GitHub Actions should run Playwright after the project is pushed; no visual or accessibility compliance claim is made yet.
2. Only the six screenshot tests are present. The original site has far more training, reading and community content. The supporting pages are navigable but not a full content migration.
3. Photographic assets were created from the supplied mockups. They have a lower resolution than individually generated or licensed original photography. A later art pass can improve them without changing the data model.
4. Requirements published by outside organisations may change. Individual test pages link directly to their source.
5. No production deployment, custom domain or Google indexing was configured or checked.
6. The connected GitHub integration returned 403 when asked to write to the new repository. The push script allows a repo-restricted push from a local GitHub CLI login without changing the original project.

## Risks worth monitoring

- Copy quality can be damaged by importing old source text without editorial review; the original repository's first-person training claims are not all appropriate for the new civilian voice.
- Comparing different programmes can invite false equivalence. The comparison table describes what each includes, but does not calculate a universal score or rank participants.
- Current sourcing is specific to the entry being shown. Example: a current RASP overview states a pack weight but not a march time; do not silently import a time from a different assessment.
- A sticky comparison tray can obscure content on smaller viewports. The CSS reserves bottom space and responsive layouts; browser testing remains necessary.
- The site uses no analytics or personal-data collection. This avoids a consent workflow for now, but means actual user uptake cannot be measured within this implementation.

## Expanded v2 pass (24 November 2026)

- Replaced the low-resolution scenic imagery with an ImageGen panoramic mountain hero and six separate editorial image scenes; extracted a cohesive 14-icon family into local transparent PNGs. The assets are illustrative, not depictions of the named organisations. Country flags use local SVG files for accurate rendering at small sizes.
- Reworked the homepage, Training, Resources and About copy around rucking, deliberate effort, progress and community. The comparison interface, test IDs, filters and published assessment fields remain unchanged.
- Added 11 routed training/resource sections curated from the original repo’s read-only articles, workout, route, international-event, field-note and reading catalogues. Historical events and illustrative route descriptions are not presented as current live listings or accurate GPS routes.
- Added a practical goal-based training-week builder. Its examples are deliberately broad and do not claim to be an official preparation programme.
- Added an expanded footer drawn from the original site's mission, navigation, training/learning categories and contact links, with working Privacy, Terms, Credits and References pages.
- Added publisher references on individual test detail pages, compare pages and a dedicated bibliography in APA-style formatting.
- Archived Norwegian UI strings as `archive/nb-NO.json`; no Norwegian UI is currently published.
- Added additional unit and browser tests to exercise the new pages and interactions.
- Local unit tests, build, static asset checks and local route checks passed. Browser visual sign-off still requires execution through GitHub Actions / a real browser.

The original repository was only read. No changes were sent to it. The deployment and PR process for this expansion remains separate from the initial implementation.
