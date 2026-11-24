# Rucking Revolution

A civilian rucking website for training, fitness assessments, resources and community leadership.

## Run locally

Use Node.js 22 or later.

```sh
npm test
npm run build
node scripts/check-site.mjs
npm run dev
```

Open http://127.0.0.1:4173/. The build exports 139 routes to `dist/`, including complete pre-rendered page content. Interactive controls use JavaScript. The library contains eight formal assessments and the resource collections contain 108 individual entries, including 41 workouts with structured purpose, equipment and estimated session duration.

## Structure

- `src/app.mjs`: shared layout, route dispatch and testing-library interactions.
- `src/data/assessments.mjs`: structured fitness tests and official publisher links.
- `src/data/content.mjs`: section introductions, navigation and supporting guidance.
- `src/data/guides.mjs`: searchable catalogues of workouts, exercises, articles, route templates, field-note exercises, published first-person reports, crew guides and organiser-linked events.
- `src/data/event-route-editorial.mjs`: organiser-linked event dates, published route profiles and article source notes.
- `src/lib/landing.mjs`: home, Learn, Lead, illustrated resource navigation and publication guide.
- `src/lib/legal.mjs`: legal documents, local choice export and privacy contact pathways.
- `src/lib/progression.mjs`: deadline-based training blocks and assessment-specific preparation.
- `src/lib/resource-pages.mjs`: collection rendering, pace and assessment calculations, training-week planning, checklists and local exports.
- `src/data/crew-development.mjs`: five crew guides and sixteen leadership practice exercises.
- `src/lib/crew-practice.mjs`: filtered exercise selection and local practice plan export.
- `src/lib/icons.mjs`: transparent semantic SVG stencil symbols; legacy PNG files are retained but are not used as UI glyphs.
- `src/lib/catalog.mjs`: filter and comparison logic.
- `public/`: local images, icons, flags, branding and styles.
- `test/` and `e2e/`: Node and Playwright tests.
- `archive/nb-NO.json`: unpublished Norwegian interface strings.

## Editorial and operational principles

Use clear conversational English. Preserve official test names, requirements and publisher references. Do not imply that an illustrative route is a verified GPS route or that an event is currently accepting registrations. The website does not administer the assessments. Editorial images are illustrative.

Keep training guidance practical, adaptable and appropriate to the demands of the user's goal. Verify event and test requirements with their organisers. Review legal and privacy wording when hosting, tracking, forms or accounts change. No claim of accessibility conformance follows from automated testing alone.

GitHub Actions runs unit tests, the static build, asset checks and browser tests in the version- and digest-pinned Playwright container. Merge only after the checks pass for the reviewed commit.

The privacy notice describes the application as implemented. Confirm controller identity, mail handling, hosting/log retention and data-processing arrangements with the responsible person before making compliance claims. Route profiles link to the published maps and elevation profiles; the site does not claim to have independently surveyed them. Training blocks are adjustable planning templates, not personalised coaching or readiness predictions.

## Local route inspection and field worksheets

The route hub reads user-selected GPX files in memory, with a 5 MB / 50,000-point limit. It renders the supplied track and estimates distance and, only when complete elevation is available, ascent/descent. The preview has no base map, routing engine or live location. Published route profiles continue to link to their actual source maps; no third-party track data is reproduced without permission. Four local editable worksheets are available in Tools & templates.

The delivery policy blocks native form submissions with CSP `form-action 'none'`; browser tools use event handlers and local downloads. Referrer information is suppressed and camera, microphone, geolocation and payment permissions are disabled. Verify these headers on the deployed site before claiming enforcement. Provider logs, identity, mail handling and retention still require operator confirmation.
