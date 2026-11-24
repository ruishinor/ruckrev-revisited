import {icon} from './icons.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Only use a glyph where the documented event format has an unambiguous meaning.
// Category and participation are independent; a mixed entry format is not a team-only event.
const categoryIcons=Object.freeze({'Rucking':'ruck','Multi-day trek':'route','Multi-day march':'route','Ultra-distance race':'run','Multisport relay':null});
const runningEvents=new Set(['dragons-back-race','antarctic-ice-marathon']);
export function eventMarkers(e){
 const key=runningEvents.has(e.slug)?'run':Object.hasOwn(categoryIcons,e.eventType)?categoryIcons[e.eventType]:null;
 const variants=Array.isArray(e.variants)?e.variants:[];
 const result=[{label:e.eventType,icon:key}];
 if(variants.some(v=>v.participation==='team')) result.push({label:variants.every(v=>v.participation==='team')?'Team event':'Team option',icon:'people'});
 return result;
}
export function renderEventMarkers(e){return `<span class="event-markers">${eventMarkers(e).map(m=>`<span class="event-marker">${m.icon?icon(m.icon,24):''}${esc(m.label)}</span>`).join('')}</span>`;}
export function renderArticleConnections(x){if(x.kind!=='Article'||!x.related?.length)return '';return `<section class="content-panel article-connections"><h2>Put it into practice</h2>${x.related.map(r=>`<p>${esc(r.context)} <a href="${esc(r.path)}">${esc(r.label)}</a>.</p>`).join('')}${x.worksheet?`<p><a href="${esc(x.worksheet.path)}" download>${esc(x.worksheet.label)}</a> — keep a copy for your own use.</p>`:''}</section>`;}
