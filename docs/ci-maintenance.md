# CI maintenance (24 November 2026)

Baseline: `27e013f3436331c3120f47380f809b16a122f979`.

- Checkout [v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1), `3d3c42e5aac5ba805825da76410c181273ba90b1`; setup-node [v7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0), `949feb2413d6458794dcd2491c4babbbce0c15c1`. Both release commits are signed and upstream action manifests specify Node 24. Application CI remains Node 22. Credential persistence and implicit package caching are disabled. Existing triggers, job names, permissions and browser container digest are unchanged.
- Playwright stays at 1.65.1. Generate the npm lockfile from the public registry once, commit it, and use `npm ci --ignore-scripts` afterward. Production omits dev dependencies. The browser job still launches Chromium before the full suite. Update runner, lockfile and container tag/digest together, never independently.
- `npm run verify` includes static checks. README no longer hardcodes obsolete inventory counts. Local dev server declares JPEG MIME types; production header policy is unchanged.

Deferred: tracked generated `dist/` (301 files at baseline, about 5.3 MB) should be removed in a separate PR after confirming builds, deployment and any external consumers; do not delete or alter history. Build and static check duplicate route inventory; centralize with explicit uniqueness and route coverage checks in a separate change. The visible main ruleset blocks deletion and force-push, but branch protection read is unavailable; verify required `check`/`browser` and deployment checks are enforced server-side before tightening repository policy. No policy changes are made by this patch.

References: https://docs.github.com/en/actions/reference/security/secure-use
