# P2 — independent challenges and participation

Baseline inspected: `ff099d2e6bba71635d33cda2803986132fdbe1b7` (24 November 2026). This adds a separate catalogue rather than replacing or changing the existing seven guide collections or event records. The original 37 event entries and 16 fitness assessments remain separate. The library has 25 independent challenges, 11 categories, 12 recurring monthly selections, six personal milestones and 25 downloadable text records. Local calendar month selects the current rotating challenge; all months are browsable. Suggested alternatives are not official standards. No account, tracking, remote submission, payment, personal data storage or certification is added.

## P1 integration boundary

`src/data/challenges.mjs` provides stable `id`, `version`, `kind`, `path`, `options`, and explicit `finish` fields. Use `(kind, id, version)` as the catalogue reference. Proposed future P1 completion record (not implemented): `{ schemaVersion: 1, challengeId, challengeVersion, targetDescription, completedOn, outcome: 'completed'|'adapted'|'stopped'|'rescheduled', notes, verification: 'self-reported' }`. P1 owns persistence, deletion, import/export, and any verified-achievement workflow. Do not infer verification from self-reported completion. A changed challenge's existing records must retain the original version and target. The downloadable records are blank static plain-text templates; they contain no personal data. No P1 schema or interface was inspected in a separate active branch, so this is a proposal, not an agreed integration.

## Competitive research (checked 24 November 2026)

The design uses broad patterns, not copied programmes, names or eligibility rules. GORUCK's recurring themed membership, GBF's remote and graded challenges, PATHFINDER's choice of training challenges, YOMP's finite virtual series, and ARWS's distinct regional and qualification formats demonstrate useful discoverability and progression mechanisms. Rucking Revolution deliberately avoids a purchase gate, mandatory social media, obligatory ballast, competitive suffering and public identity tracking. A historical club article documents how local communities used challenge patches and training programmes; a walking discussion illustrates the value of cumulative, adjustable consistency. These sources are inspiration, not validation of the safety or efficacy of each challenge.

- GORUCK. (n.d.). *Tribe membership*. https://www.goruck.com/products/tribe-n-training-monthly-subscription
- Green Beret Fitness. (n.d.). *Challenges*. https://www.greenberetfitness.com/challenges
- Green Beret Fitness. (n.d.). *Step off*. https://www.greenberetfitness.com/challenges/step-off
- PATHFINDER Ruck Training. (n.d.). *Which PATHFINDER challenges are right for me?* https://pathfinderrucktraining.com/blogs/pathfinder-ruck-training-the-blog/how-do-i-pick-challenges
- YOMP CO. (n.d.). *Yomp ruck hybrid series*. https://www.yomp.store/blogs/academy/yomp-ruck-hybrid-series
- Adventure Racing World Series. (n.d.). *About us*. https://arworldseries.com/about/about-arws
- Green Country Ruckers. (2020, September 22). *Monthly patch challenges and ruck training programs*. https://greencountryruckers.wordpress.com/2020/09/22/patches-and-training/
- Reddit community discussion (informal, not an authoritative source): https://www.reddit.com/r/walking/comments/1hq0uvk

## P5 adventure-catalogue handoff — do not treat as published entries

P5 owns catalogue verification. No change to event ownership, facet data, existing sources or event counts is included in this patch. The inspected baseline already contains Marathon des Sables Legendary, Dragon’s Back Race, Coast to Coast (NZ), Wilderness Traverse, Red Bull Dolomitenmann, Antarctic Ice Marathon, Silk Road Mountain Race, Norseman, Spartan Death Race, World's Toughest Mudder, Sea to Sea (Florida), and Kyushu International Three-Day March. Do not create duplicate entries. Existing catalogue contains archive-search links, which do not establish the existence of an archived capture. No historical snapshot has been verified in this workstream.

Additional candidates with primary-source existence checks; future edition, load, team configuration, support and eligibility must be verified independently before catalogue publication. APA-style source references below use the source page as author/title and n.d. when the publication date is not established. Each archive link is an index search only, not a verified capture.

| Candidate | Source / status | Wayback search (capture unverified) |
|---|---|---|
| Green Beret Fitness remote challenges and 69 series | Green Beret Fitness. (n.d.). *Challenges*. https://www.greenberetfitness.com/challenges ; *Events*. https://www.greenberetfitness.com/events . Series existence verified; specific format/date/weight must come from individual entry pages. | https://web.archive.org/web/*/https://www.greenberetfitness.com/challenges |
| GORUCK Selection | GORUCK EU. (n.d.). *GORUCK Selection*. https://www.goruck.eu/pages/goruck-selection . Historical format exists; do not assert future availability; retirement status needs direct organiser confirmation. | https://web.archive.org/web/*/https://www.goruck.eu/pages/goruck-selection |
| Patagonian Expedition Race, Chile | Patagonian Expedition Race. (n.d.). *About the expedition*. https://www.patagonianexpeditionrace.com/es/about-the-expedition . Spanish organiser page confirms event format; next edition not established. | https://web.archive.org/web/*/https://www.patagonianexpeditionrace.com/es/about-the-expedition |
| Japan Three-Day March, Saitama | Japan Marching League. (n.d.). *日本スリーデーマーチ [Japan Three-Day March]*. https://j-ml.org/events/004/ . Japan Walking Association's 2026 programme https://jwalking.jp/zenkoku/japan3dm2026/ confirms past edition; 2027 date not established. Distinct from Kyushu. | https://web.archive.org/web/*/https://j-ml.org/events/004/ |
| Toughest (Nordic OCR) | Toughest. (n.d.). *Obstacle courses*. https://www.toughest.se/en/obstacle-courses/ . Series and family options established; add per-event facts only from official pages. | https://web.archive.org/web/*/https://www.toughest.se/en/obstacle-courses/ |
| ARWS global and regional racing | Adventure Racing World Series. (n.d.). *Adventure Racing World Series*. https://arworldseries.com/ . Series exists across Africa, Asia, Europe, North America, Oceania and South America; use individual race pages for criteria and dates. | https://web.archive.org/web/*/https://arworldseries.com/ |

Additional source candidates (existence established on organiser or format-owner pages, not future dates or full variant verification):

| Candidate | Source / status | Wayback search (capture unverified) |
|---|---|---|
| GORUCK Team Assessment | GORUCK. (n.d.). *Team Assessment 2026*. https://www.goruck.com/pages/team-assessment-2026 . Organiser describes a two-person endurance format in its guide; next edition not established. | https://web.archive.org/web/*/https://www.goruck.com/pages/team-assessment-2026 |
| Spartan Agoge | Spartan. (n.d.). *AGOGE: 300 March*. https://www.spartan.com/en/pages/agoge-300-march?tab=event . Current format page relates to Sparta; specific edition details need confirmation. | https://web.archive.org/web/*/https://www.spartan.com/en/pages/agoge-300-march |
| DEKA | Spartan. (n.d.). *Competition formats*. https://www.spartan.com/en/deka/competition-formats . Multiple functional fitness competition formats; not a rucking requirement or formal occupational assessment. | https://web.archive.org/web/*/https://www.spartan.com/en/deka/competition-formats |
| Tough Mudder | Tough Mudder. (n.d.). *Find a Tough Mudder event*. https://toughmudder.com/events/ . Multiple distances and formats; distinguish existing World's Toughest Mudder entry. | https://web.archive.org/web/*/https://toughmudder.com/events/ |
| Backyard Ultra | Big’s Backyard Ultra. (n.d.). *Handbook*. https://bigsbackyardultra.com/handbook/ . Open-ended running format with official rules; no universal fixed finishing distance. | https://web.archive.org/web/*/https://bigsbackyardultra.com/handbook/ |
| Expedition Alaska | Warrior Racing. (n.d.). *Expedition Alaska*. https://www.warriorraces.com/adventure-races/expedition-alaska . Organiser page exists; confirm edition and qualification before listing. | https://web.archive.org/web/*/https://www.warriorraces.com/adventure-races/expedition-alaska |
| UTMB World Series | UTMB Group. (n.d.). *UTMB World Series events*. https://utmb.world/en/utmb-world-series-events . Global trail-running series; add specific race and current qualification information rather than a generic race distance. | https://web.archive.org/web/*/https://utmb.world/en/utmb-world-series-events |
| Source to City, New York | Rat Race. (n.d.). *New York: Source to City adventure*. https://www.ratrace.com/events/nyc/ . Organiser describes a supported multisport journey along the Hudson; do not classify it as a mandatory-load ruck. | https://web.archive.org/web/*/https://www.ratrace.com/events/nyc/ |

Barkley Marathons remains a research lead: independent coverage exists but an official organiser entry page was not established. Do not imply confirmed registration availability. Additional region-specific events and full individual-format details remain to be researched. Do not publish the handoff as verified future event listings. No event images are included or licensed by this patch. P5 should check existing records and branch changes, verify organiser pages, dates, facet variants and photo rights, and coordinate catalogue counts and tests in its own PR.

## Validation and limitations

New Node and browser tests are supplied. Full repository tests, static check, pinned Playwright suite, remote CI and production validation must run on the real checkout. The execution environment could read the repository through GitHub but branch creation returned 403 and local GitHub DNS failed. This patch is not published. The application script checks exact integration anchors, refuses existing new files and performs no overwrite until all anchors are validated. Changes are additive: original route discovery and catalogue modules remain untouched. The resource discovery link sits above the existing seven editorial rows; home and training have additional rows, lead has a team-filtered deep link, event hub and footer link back to the new library. Existing top-level navigation is preserved to avoid crowding. The download is a static .txt file; print uses the browser's print/save-PDF functionality. A full endurance-domain review and accessibility audit on real devices remain pending.
