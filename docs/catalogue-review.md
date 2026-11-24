# Catalogue source review

The catalogue is not a register of guaranteed upcoming events. Keep original editions and sources. A passed date, redirect, or unavailable server is a review signal, not a deletion decision.

Run `node scripts/catalogue-audit.mjs` for an offline JSON report. Errors are structural; warnings require human review. Run `node scripts/catalogue-audit.mjs --links` manually from a trusted checkout for up to 50 deduplicated public HTTPS HEAD requests (one second apart; no redirect following). Use only trusted catalogue URLs and restricted network egress. Hostname checks alone cannot prevent private DNS resolution; do not run from an internal network. A 403, 405, 429 or transport failure is not proof a source disappeared. HEAD success is not verification of content. The link pass is optional and excluded from CI. It checks catalogue event and scored assessment links, not every editorial/archive link. Review the remaining sources manually.

## Review intervals

- Confirmed future event: every 30 days and again before promoting registration or a date-sensitive claim.
- Event without a confirmed future date, or historical edition: every 180 days; retain historical details and use a separate edition when material rules change.
- Formal assessment: every 180 days and on a new intake or official revision. A shared review date is not individual source verification.
- Participant reports and archived sources: verify attribution and original context before publication; check archived snapshots when a specific capture is claimed. A wildcard link is a search index only.
- Photos: record creator, original URL, licence or permission, attribution and permitted usage before adding or changing imagery. Existing photos with missing rights documentation require manual review; do not infer rights from an image being available online.

For every change record the original source, date actually inspected, publisher, edition or jurisdiction, claim supported, uncertainty, and reviewer. Search in the publisher's language, compare official rules with official registration pages, and retain differences rather than guessing. Do not promote anecdotes to requirements. Use null for unknown variant values and compare only values belonging to the same variant. Record archive capture timestamp and exact inspected URL separately; never derive a verified capture from a wildcard index. For participant accounts, use a comment permalink where available and summarise in original language; avoid private details.

## Research handoff, 24 November 2026

- Toughest: official race series and calendar inspected: https://www.toughest.se/en/obstacle-courses/ . Distinct from Tough Mudder. Main 8 km, optional double distance, Xplore 4 km, Family 2 km. Main race dates shown for Malmö (22 May 2027), Stockholm (5 June), Oslo (4 September), Gothenburg (18 September). P2 owns edition-level event records; do not duplicate them in the confirmed total.
- IAFF/IAFC CPAT: https://www.iaff.org/cpat/ and https://www.iaff.org/cpat/development-administration/ inspected. Standardised firefighter applicant assessment, eight events and a 10:20 pass/fail time, not a ranking. The official site also lists a June 2026 equipment safety advisory. Add a scored record only after reviewing applicable licensed administration and official event sequence; refer applicants to a licensed test site. Do not publish copied manual diagrams.
- Norwegian Armed Forces: https://www.forsvaret.no/forstegangstjeneste/tjenesteguiden/sokbare-forstegangstjenester/grovopptak inspected. Published 2026 initial intake requirements distinguish Kystjeger and vessel operator; the initial intake is not the full selection and is not confirmation of the next intake. Keep intake-specific source attached to research entry.
- College of Policing: https://www.college.police.uk/support-forces/health-safety-welfare/job-related-fitness-standards inspected; the page explicitly remains under review due to PPST. Retain existing caveat.

No archive snapshot or image licence was verified in this research pass. No participant quotation or new image is included.
