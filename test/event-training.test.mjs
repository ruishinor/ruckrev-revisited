import test from 'node:test';
import assert from 'node:assert/strict';
import {programmes} from '../src/data/training-pathways.mjs';
import {eventContext,renderEventTraining} from '../src/lib/event-training.mjs';
import {makeProgrammeImport} from '../src/lib/training-import.mjs';
import {clearWorkspace} from '../src/lib/training-store.mjs';
import {empty,record,validate} from '../src/lib/training-data.mjs';
const path='/resources/events/ultrabalaton/',e={slug:'ultrabalaton',title:'Example <relay>',kind:'Event',path,eventDate:'2027-04-22'},entries={[path]:e};
const today='2026-11-24',start='2026-11-30';
test('event context resolves only real local event slugs and never invents dates',()=>{
 assert.deepEqual(eventContext('?event=ultrabalaton',entries,today),{slug:e.slug,path,title:e.title,target:e.eventDate,ref:{kind:'event',id:path,label:e.title}});
 for(const eventDate of [null,'2026-11-24','2026-11-23','2027-02-30'])assert.equal(eventContext('?event=ultrabalaton',{[path]:{...e,eventDate}},today).target,'');
 for(const query of ['?event=unknown','?event=__proto__','?event=../ultrabalaton','?event=https://example.org','?event=%3Cscript%3E'])assert.equal(eventContext(query,entries,today),null);
 assert.equal(eventContext('?event=ultrabalaton',{[path]:{...e,kind:'Article'}},today),null);
 const html=renderEventTraining(e,programmes);assert.ok(html.includes('/my-training/?event=ultrabalaton#training-goals'));assert.ok(html.includes('programme=eight-week-relay-rehearsal&amp;event=ultrabalaton'));assert.doesNotMatch(html,/twelve-week-mountain-walking-base/);assert.match(html,/not registration/);
});
test('new programmes have real schedules, recovery weeks, and strict target-date fit',()=>{
 for(const [id,count,easier] of [['eight-week-relay-rehearsal',32,[4,8]],['twelve-week-mountain-walking-base',48,[4,8,12]]]){
  const p=programmes.find(x=>x.id===id);assert.ok(p);assert.deepEqual(p.weeks.filter(w=>w.phase==='easier').map(w=>w.number),easier);
  const existing=[record({id:'keep',kind:'goal',date:'2027-04-22',title:'My goal',notes:'',ref:null,status:'active'})];
  const r=makeProgrammeImport(p,start,existing,{today,target:'2027-04-22'});
  assert.equal(r.planned.length,count);assert.ok(r.planned.every(s=>s.load===null));assert.equal(r.records[0],existing[0]);assert.equal(r.lastDate,r.planned.map(s=>s.date).sort().at(-1));
  assert.deepEqual(validate({...empty(),records:r.records}).records,r.records);
  assert.throws(()=>makeProgrammeImport(p,start,existing,{today,target:r.lastDate}),/ends on or after/);
  assert.throws(()=>makeProgrammeImport(p,start,existing,{today,target:'2026-11-24'}),/future target/);
  assert.throws(()=>makeProgrammeImport(p,start,existing,{today,target:'2027-02-30'}),/valid date/);
  assert.equal(makeProgrammeImport(p,start,existing,{today}).planned.length,count);
 }
});
// A transaction fixture exercises the recovery and revision branches; real IndexedDB is covered in Playwright.
function fakeDb(value){let written,aborted=false;const req={result:value};const tx={objectStore:()=>({get:()=>req,put:v=>{written=v;}}),abort(){aborted=true;this.onabort();}};return {db:{transaction(){queueMicrotask(()=>{req.onsuccess();if(!aborted)tx.oncomplete();});return tx;}},read:()=>written};}
test('delete requires the current revision, and corrupt recovery cannot erase valid restored records',async()=>{
 const state={...empty(),revision:3};let f=fakeDb(state);await assert.rejects(clearWorkspace(f.db,2),/Another tab changed/);assert.equal(f.read(),undefined);
 f=fakeDb(state);await assert.rejects(clearWorkspace(f.db,null),/Another tab changed/);assert.equal(f.read(),undefined);
 f=fakeDb(state);await clearWorkspace(f.db,3);assert.deepEqual(f.read(),{...empty(),revision:4});
 f=fakeDb({bad:true});await assert.rejects(clearWorkspace(f.db,3));assert.equal(f.read(),undefined);
 f=fakeDb({bad:true});await clearWorkspace(f.db,null);assert.ok(validate(f.read()));assert.deepEqual(f.read().records,[]);
});
