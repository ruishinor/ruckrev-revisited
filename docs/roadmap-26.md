# Event preparation continuity

Baseline: d2678ce46d4e24fe34bad8575e4fabd4fd8423b7 (PR 25).

All event pages link to an explicit goal form; query values resolve only through the local event catalogue. Future published dates may prefill a personal target, not confirm registration or category-specific start. Past and unknown dates require user input. No data are saved until the existing form is submitted. Related structured programme links carry the event context into a preview; only programmes with explicit catalogue links are suggested.

The optional target date checks that the last actual scheduled session precedes it; it does not assess readiness or prescribe load. Preview confirmation rejects changed inputs and changed local records, while the existing IndexedDB compare-and-write transaction still protects against stale tabs. No schema change or data migration.

New independently authored 8-week relay and 12-week mountain walking foundations use the existing schedule generator, with 32 and 48 sessions respectively. They are not solo-ultra or technical mountain race plans. Event references are existing catalogue sources, not newly verified editions. Worksheets are local.

Delete-all now compares revisions in the same transaction; explicit corrupt-data recovery is permitted only while stored data still fails validation. If another tab restores valid data, recovery cannot overwrite it. Existing records and controls are retained. No change to CI pins, branch protections, privacy policy or dependency lockfile.

Remaining functional work: thirteen photographic challenge illustrations, further verified assessment protocols and adventure records, additional attributable accounts and verified historical snapshots. Reading cover work is complete. This increment focuses on continuity rather than expanding catalogue count alone.
