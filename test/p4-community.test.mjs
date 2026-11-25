import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {p4Articles,editorialTopics,articleTopic} from '../src/data/p4-editorial.mjs';
import {p4CrewGuides,p4Drills,enrichLegacyDrill} from '../src/data/p4-crew.mjs';
import {crewDirectory,directoryMatch,directoryStatuses} from '../src/data/p4-directory.mjs';
import {retiredFieldNotes,attachOriginalReading} from '../src/data/p4-field-notes.mjs';
import {renderDirectory,renderContribution,bindDirectory,communitySections} from '../src/lib/p4-community.mjs';
test('P4 articles are original structured entries with a topic and event or report link',()=>{
 assert.equal(new Set(p4Articles.map(a=>a[0])).size,p4Articles.length);
 for(const [slug,title,level,summary,meta,blocks,extra] of p4Articles){assert.ok(slug&&title&&level&&summary&&meta);assert.ok(blocks.length);assert.ok(editorialTopics.includes(extra.topic));assert.match(extra.related[0].path,/^\/resources\/(events|field-notes)\/[a-z0-9-]+\/$/);assert.ok(blocks.every(b=>b.title&&b.text));}
 assert.equal(articleTopic({slug:'pack-fit-and-foot-comfort'}),'Equipment');
});
test('P4 crew modules and drills have distinct actionable structures',()=>{
 assert.equal(new Set(p4Drills.map(d=>d.id)).size,p4Drills.length);
 for(const g of p4CrewGuides){assert.ok(g.blocks.length&&g.blocks.every(b=>b.text&&Array.isArray(b.items)));}
 for(const d of p4Drills)for(const k of ['purpose','preparation','task','constraints','review'])assert.ok(d[k],d.id+' '+k);
 assert.equal(enrichLegacyDrill({id:'delegate',task:'original'}).task,'original');assert.ok(enrichLegacyDrill({id:'delegate'}).constraints);
});
test('directory records include public sources, status and date; combined filtering is correct',()=>{
 assert.equal(new Set(crewDirectory.map(c=>c.id)).size,crewDirectory.length);
 for(const c of crewDirectory){assert.ok(directoryStatuses.includes(c.status));assert.match(c.checked,/^\d{4}-\d{2}-\d{2}$/);assert.equal(new Date(c.checked).toISOString().slice(0,10),c.checked);for(const k of ['name','country','location','format','access'])assert.ok(c[k]);for(const k of ['url','source'])assert.equal(new URL(c[k]).protocol,'https:');}
 assert.deepEqual(crewDirectory.filter(c=>directoryMatch(c,{country:'Norway',type:'Rucking',status:'Active'})).map(c=>c.id).sort(),crewDirectory.filter(c=>c.country==='Norway'&&c.type==='Rucking'&&c.status==='Active').map(c=>c.id).sort());assert.ok(directoryMatch(crewDirectory.find(c=>c.id==='polaris'),{country:'Norway',type:'Rucking',status:'Active'}));
 for(const id of ['outdoor-cape','meridian','cape-province'])assert.ok(directoryMatch(crewDirectory.find(c=>c.id===id),{query:'cape walking'}));assert.ok(!directoryMatch(crewDirectory.find(c=>c.id==='polaris'),{query:'cape walking'}));
 assert.deepEqual(crewDirectory.filter(c=>directoryMatch(c,{status:'Historical'})).map(c=>c.id),crewDirectory.filter(c=>c.status==='Historical').map(c=>c.id));
 assert.equal(crewDirectory.filter(c=>directoryMatch(c,{query:'<script>'})).length,0);
 const count=renderDirectory().match(/id="crew-dir-count"[^>]*>([^<]*)</)?.[1];assert.deepEqual(count?.match(/\d+/g)?.map(Number),[crewDirectory.length,crewDirectory.length]);
 assert.equal((renderDirectory().match(/data-crew-record=/g)||[]).length,crewDirectory.length);
});
test('directory binder updates results and preserves readable static content',()=>{
 const original=globalThis.document;const controls=Object.fromEntries(['#crew-dir-search','#crew-dir-country','#crew-dir-type','#crew-dir-status','#crew-dir-count'].map(id=>[id,{value:id.includes('search')?'':'all',disabled:true,textContent:'',listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}}]));
 const cards=crewDirectory.map(c=>({dataset:{crewRecord:c.id},hidden:false}));
 globalThis.document={querySelector:s=>controls[s],querySelectorAll:()=>cards};
 try{bindDirectory();assert.deepEqual(controls['#crew-dir-count'].textContent.match(/\d+/g)?.map(Number),[crewDirectory.length,crewDirectory.length]);controls['#crew-dir-country'].value='Norway';controls['#crew-dir-country'].listeners.change();assert.deepEqual(cards.filter(c=>!c.hidden).map(c=>c.dataset.crewRecord),crewDirectory.filter(c=>c.country==='Norway').map(c=>c.id));controls['#crew-dir-type'].value='Rucking';controls['#crew-dir-type'].listeners.change();assert.deepEqual(cards.filter(c=>!c.hidden).map(c=>c.dataset.crewRecord),crewDirectory.filter(c=>c.country==='Norway'&&c.type==='Rucking').map(c=>c.id));controls['#crew-dir-search'].value='no matches';controls['#crew-dir-search'].listeners.input();assert.equal(cards.filter(c=>!c.hidden).length,0);assert.deepEqual(controls['#crew-dir-count'].textContent.match(/\d+/g)?.map(Number),[0,crewDirectory.length]);}
 finally{globalThis.document=original;}
});
test('contribution templates stay local with an explicit manual email and no submission endpoint',()=>{
 const html=renderContribution();assert.match(html,/mailto:info@ruckingrevolution\.org\?subject=/);assert.doesNotMatch(html,/<form|<input/);
 for(const name of ['rr-editorial-submission.txt','rr-interview-template.txt','rr-equipment-review.txt']){assert.ok(html.includes(`/downloads/${name}" download`));const body=readFileSync(new URL('../public/downloads/'+name,import.meta.url),'utf8');assert.ok(body.trim());}
 assert.ok(Object.values(communitySections).every(s=>s.blocks.length));
});
test('retired summaries preserve original source links on their event',()=>{
 assert.equal(new Set(retiredFieldNotes.map(n=>n.path)).size,retiredFieldNotes.length);
 const events=[...new Set(retiredFieldNotes.map(n=>n.event))].map(path=>({path}));attachOriginalReading(events);
 for(const r of retiredFieldNotes){assert.equal(new URL(r.url).protocol,'https:');assert.ok(events.find(e=>e.path===r.event).originalReading.some(x=>x.url===r.url&&x.label===r.label));}
});
