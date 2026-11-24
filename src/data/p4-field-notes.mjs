// Former short summaries retired; only links to complete original publications are retained.
export const retiredFieldNotes=Object.freeze([
  {
    "path": "/resources/field-notes/dodentocht-reporter-2026/",
    "event": "/resources/events/dodentocht/",
    "label": "Khoroshavin, K. (2026, August 21). 100 kilometres of pain: How I completed Belgium’s Death march. The Brussels Times.",
    "url": "https://www.brusselstimes.com/belgium/2278067/100-kilometres-of-pain-how-i-completed-belgiums-death-march/"
  },
  {
    "path": "/resources/field-notes/dodentocht-unfinished-2026/",
    "event": "/resources/events/dodentocht/",
    "label": "Castellanos Mosquera, X. (2026). 100 km through the night: A lesson in peace. LinkedIn.",
    "url": "https://www.linkedin.com/posts/xaviercastellanos_dodentocht-lightinthedarkness-activity-7494838218484510720-ZS59"
  },
  {
    "path": "/resources/field-notes/classic-sweden-external-interview/",
    "event": "/resources/events/fjallraven-classic-sweden/",
    "label": "The Sporting Lodge. (2024, August 23). Conquering the Fjällräven Classic: Our store manager Drew’s epic journey.",
    "url": "https://www.thesportinglodge.com/blogs/journal/conquering-the-fjallraven-classic-our-store-manager-drews-epic-journey"
  },
  {
    "path": "/resources/field-notes/nijmegen-returning-after-change/",
    "event": "/resources/events/nijmegen/",
    "label": "Stichting DE 4DAAGSE. (n.d.). Story of Teunis.",
    "url": "https://www.4daagse.nl/en/about-the-4days-marches/personal-stories/teunis"
  },
  {
    "path": "/resources/field-notes/nijmegen-marching-tradition/",
    "event": "/resources/events/nijmegen/",
    "label": "Verhees, E. (2021, July 20). Vierdaagse – the Four Days Marches in Nijmegen. Europeana.",
    "url": "https://www.europeana.eu/en/stories/vierdaagse-the-four-days-marches-in-nijmegen"
  }
]);
export function attachOriginalReading(events){for(const r of retiredFieldNotes){const event=events.find(e=>e.path===r.event);if(!event)throw Error('Missing related event '+r.event);(event.originalReading??=[]).push({label:r.label,url:r.url});}}
