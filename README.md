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

Open http://127.0.0.1:4173/. The build exports 104 routes to `dist/`, including complete pre-rendered page content. Interactive controls use JavaScript. The library contains eight formal assessments and the resource collections contain 73 individual entries.

## Structure

- `src/app.mjs`: shared layout, route dispatch and testing-library interactions.
- `src/data/assessments.mjs`: structured fitness tests and official publisher links.
- `src/data/content.mjs`: section introductions, navigation and supporting guidance.
- `src/data/guides.mjs`: searchable catalogues of workouts, exercises, articles, route templates, field-note exercises and organiser-linked events.
- `src/lib/landing.mjs`: home, Learn, Lead, illustrated resource navigation and publication guide.
- `src/lib/legal.mjs`: legal documents, local choice export and privacy contact pathways.
- `src/lib/progression.mjs`: deadline-based training blocks and assessment-specific preparation.
- `src/lib/resource-pages.mjs`: collection rendering, pace and assessment calculations, training-week planning, checklists and local exports.
- `src/lib/icons.mjs`: transparent semantic SVG stencil symbols; legacy PNG files are retained but are not used as UI glyphs.
- `src/lib/catalog.mjs`: filter and comparison logic.
- `public/`: local images, icons, flags, branding and styles.
- `test/` and `e2e/`: Node and Playwright tests.
- `archive/nb-NO.json`: unpublished Norwegian interface strings.

## Editorial and operational principles

Use clear conversational English. Preserve official test names, requirements and publisher references. Do not imply that an illustrative route is a verified GPS route or that an event is currently accepting registrations. The website does not administer the assessments. Editorial images are illustrative.

Keep training guidance practical, adaptable and appropriate to the demands of the user's goal. Verify event and test requirements with their organisers. Review legal and privacy wording when hosting, tracking, forms or accounts change. No claim of accessibility conformance follows from automated testing alone.

GitHub Actions runs unit tests, the static build, asset checks and browser tests. Merge only after the checks pass for the reviewed commit.

The privacy notice describes the application as implemented. Confirm controller identity, mail handling, hosting/log retention and data-processing arrangements with the responsible person before making compliance claims. Route profiles link to the published maps and elevation profiles; the site does not claim to have independently surveyed them. Training blocks are adjustable planning templates, not personalised coaching or readiness predictions.
