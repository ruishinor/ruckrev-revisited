import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {p4Articles,editorialTopics,articleTopic} from '../src/data/p4-editorial.mjs';
import {p4CrewGuides,p4Drills,enrichLegacyDrill} from '../src/data/p4-crew.mjs';
import {crewDirectory,directoryMatch,directoryStatuses} from '../src/data/p4-directory.mjs';
import {retiredFieldNotes,attachOriginalReading} from '../src/data/p4-field-notes.mjs';
import {renderDirectory,renderContribution,bindDirectory,communitySections} from '../src/lib/p4-community.mjs';
test('P4 articles are original structured entries with a topic and event or report link',()=>{
 assert.equal(p4Articles.length,11);assert.equal(new Set(p4Articles.map(a=>a[0])).size,11);
 for(const [slug,title,level,summary,meta,blocks,extra] of p4Articles){assert.ok(slug&&title&&level&&summary&&meta);assert.ok(blocks.length>=4);assert.ok(editorialTopics.includes(extra.topic));assert.match(extra.related[0].path,/^\/resources\/(events|field-notes)\/[a-z0-9-]+\/$/);assert.ok(blocks.every(b=>b.title&&b.text));}
 assert.equal(articleTopic({slug:'pack-fit-and-foot-comfort'}),'Equipment');
});
test('P4 crew modules and drills have distinct actionable structures',()=>{
 assert.equal(p4CrewGuides.length,5);assert.equal(p4Drills.length,8);assert.equal(new Set(p4Drills.map(d=>d.id)).size,8);
 for(const g of p4CrewGuides){assert.equal(g.blocks.length,4);assert.ok(g.blocks.every(b=>b.text&&b.items.length===3));}
 for(const d of p4Drills)for(const k of ['purpose','preparation','task','constraints','review'])assert.ok(d[k],d.id+' '+k);
 assert.equal(enrichLegacyDrill({id:'delegate',task:'original'}).task,'original');assert.ok(enrichLegacyDrill({id:'delegate'}).constraints);
});
test('directory records include public sources, status and date; combined filtering is correct',()=>{
 assert.equal(crewDirectory.length,12);assert.equal(new Set(crewDirectory.map(c=>c.id)).size,12);
 for(const c of crewDirectory){assert.ok(directoryStatuses.includes(c.status));assert.equal(c.checked,'2026-11-24');for(const k of ['name','country','location','format','access'])assert.ok(c[k]);for(const k of ['url','source'])assert.equal(new URL(c[k]).protocol,'https:');}
 assert.equal(crewDirectory.filter(c=>directoryMatch(c,{country:'Norway',type:'Rucking',status:'Active'})).length,1);
 assert.equal(crewDirectory.filter(c=>directoryMatch(c,{query:'cape walking'})).length,3);
 assert.equal(crewDirectory.filter(c=>directoryMatch(c,{status:'Historical'})).length,0);
 assert.equal(crewDirectory.filter(c=>directoryMatch(c,{query:'<script>'})).length,0);
 assert.match(renderDirectory(),/12 of 12 communities/);
 assert.equal((renderDirectory().match(/data-crew-record=/g)||[]).length,12);
});
test('directory binder updates results and preserves readable static content',()=>{
 const original=globalThis.document;const controls=Object.fromEntries(['#crew-dir-search','#crew-dir-country','#crew-dir-type','#crew-dir-status','#crew-dir-count'].map(id=>[id,{value:id.includes('search')?'':'all',disabled:true,textContent:'',listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}}]));
 const cards=crewDirectory.map(c=>({dataset:{crewRecord:c.id},hidden:false}));
 globalThis.document={querySelector:s=>controls[s],querySelectorAll:()=>cards};
 try{bindDirectory();assert.equal(controls['#crew-dir-count'].textContent,'12 of 12 communities');controls['#crew-dir-country'].value='Norway';controls['#crew-dir-country'].listeners.change();assert.equal(cards.filter(c=>!c.hidden).length,2);controls['#crew-dir-type'].value='Rucking';controls['#crew-dir-type'].listeners.change();assert.equal(cards.filter(c=>!c.hidden).length,1);controls['#crew-dir-search'].value='no matches';controls['#crew-dir-search'].listeners.input();assert.match(controls['#crew-dir-count'].textContent,/0 of 12/);}
 finally{globalThis.document=original;}
});
test('contribution templates stay local with an explicit manual email and no submission endpoint',()=>{
 const html=renderContribution();assert.match(html,/Send a draft by email when you are ready/);assert.match(html,/mailto:info@ruckingrevolution\.org\?subject=/);assert.match(html,/Nothing is uploaded, emailed, saved by the site or published automatically/);assert.doesNotMatch(html,/<form|<input/);
 for(const name of ['rr-editorial-submission.txt','rr-interview-template.txt','rr-equipment-review.txt']){assert.ok(html.includes(`/downloads/${name}" download`));const body=readFileSync(new URL('../public/downloads/'+name,import.meta.url),'utf8');assert.match(body,/LOCAL ONLY/);}
 assert.ok(Object.values(communitySections).every(s=>s.blocks.length>=2));
});
test('retired summaries preserve original source links on their event',()=>{
 assert.equal(retiredFieldNotes.length,5);assert.equal(new Set(retiredFieldNotes.map(n=>n.path)).size,5);
 const events=[...new Set(retiredFieldNotes.map(n=>n.event))].map(path=>({path}));attachOriginalReading(events);
 for(const r of retiredFieldNotes){assert.equal(new URL(r.url).protocol,'https:');assert.ok(events.find(e=>e.path===r.event).originalReading.some(x=>x.url===r.url&&x.label===r.label));}
});
