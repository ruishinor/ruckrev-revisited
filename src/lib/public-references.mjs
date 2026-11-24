// Only approved research and operational organiser references are public.
// Source notes and discovery links are retained for editorial work, not rendered.
const approved=new Set([
 'https://doi.org/10.3390/ijerph18084010',
 'https://doi.org/10.1007/s40279-021-01426-9',
 'https://acsm.org/9-facts-about-hydration-electrolytes/',
 'https://www.dnt.no/aktiviteter/kurs-og-utdanning/turleder/',
 'https://www.4daagse.nl/en',
 'https://www.europeana.eu/en/stories/vierdaagse-the-four-days-marches-in-nijmegen'
]);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function publicReferences(sources=[]){return sources.filter(r=>approved.has(r.url));}
export function renderPublicReferences(sources=[]){const refs=publicReferences(sources);return refs.length?' <section class="content-panel article-sources"><h2>References</h2><ul>'+refs.map(r=>'<li><a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(r.label)+'</a></li>').join('')+'</ul></section>':'';}
