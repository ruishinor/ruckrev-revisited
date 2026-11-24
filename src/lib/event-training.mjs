import {date,localDate} from './training-data.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function eventContext(search,entries,today=localDate()){
 const slug=new URLSearchParams(search).get('event');
 if(!slug||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))return null;
 const path=`/resources/events/${slug}/`;
 const e=Object.hasOwn(entries,path)?entries[path]:null;
 if(!e||e.kind!=='Event'||e.slug!==slug)return null;
 let target='';try{if(date(e.eventDate)>today)target=e.eventDate;}catch{}
 return {slug,path,title:e.title,target,ref:{kind:'event',id:path,label:e.title}};
}
export function renderEventTraining(e,programmes){
 const q='event='+encodeURIComponent(e.slug);
 const matched=programmes.filter(p=>p.scheduleFormat==='structured'&&p.related.some(r=>r.path===e.path));
 return `<section class="content-panel" aria-label="Personal adventure preparation"><h2>Make this adventure a personal goal</h2><p>Choose your actual category and target date. Saving a goal is not registration, qualification or a prediction of readiness. Published dates may refer to an entire event weekend; confirm your own start.</p><p><a class="button button-secondary" href="/my-training/?${q}#training-goals">Set this adventure as a goal</a></p>${matched.length?`<h3>Related example programmes</h3><ul>${matched.map(p=>`<li><a href="/my-training/?programme=${encodeURIComponent(p.id)}&amp;${q}#training-structured-import">Preview schedule: ${esc(p.title)}</a> — ${p.weeks.length} weeks. ${esc(p.audience)}</li>`).join('')}</ul><p>Choose a block that matches your current capacity. Review the actual schedule before adding it to your calendar.</p>`:'<p><a href="/training/ruck-plans/">Browse training programmes</a> or choose a general block in My Training. No event-specific schedule has been assigned.</p>'}</section>`;
}
