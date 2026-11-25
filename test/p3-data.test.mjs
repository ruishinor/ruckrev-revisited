import test from 'node:test';
import assert from 'node:assert/strict';
import {programmes,pathwayArticles,pathwayWorkouts,pathwayGuides,attachLegacyProgrammes} from '../src/data/training-pathways.mjs';
test('twelve distinct structured programmes cover requested lengths and missing pathways',()=>{
 assert.ok(programmes.length);
 for(const weeks of [4,6,8,12,16,20])assert.ok(programmes.some(x=>x.weeks.length===weeks),`Missing ${weeks}-week pathway`);
 assert.equal(new Set(programmes.map(x=>x.id)).size,programmes.length);
 for(const pathway of ['build','carry','return','long-days','hybrid','benchmark','distance-extension','event-rehearsal','winter-night','urban-ultra','relay','mountain-walking'])assert.ok(programmes.some(x=>x.pathway===pathway),pathway);
 for(const x of programmes){
  assert.equal(x.schemaVersion,1);assert.equal(x.scheduleFormat,'structured');
  for(const key of ['audience','baseline','missedSessions','adaptation','progress','repeatReduceExtend'])assert.ok(typeof x[key]==='string'&&x[key].trim(),`${x.id}: ${key}`);
  assert.ok(x.equipment.length);assert.ok(x.related.length);assert.ok(x.weeks.some(w=>w.phase==='easier'));
  const totals=[];const ids=new Set();
  for(const [i,w] of x.weeks.entries()){
   assert.equal(w.number,i+1);assert.ok(w.objective);assert.ok(w.sessions.length>=3);
   assert.equal(new Set(w.sessions.map(s=>s.day)).size,w.sessions.length);
   for(const s of w.sessions){assert.ok(Number.isInteger(s.minutes)&&s.minutes>0);assert.ok(s.objective);assert.ok(!ids.has(s.id));ids.add(s.id);}
   totals.push(w.sessions.reduce((n,s)=>n+s.minutes,0));
   if(w.phase==='easier'&&i)assert.ok(totals[i]<=totals[i-1],`${x.id} week ${i+1}`);
  }
  assert.deepEqual(x.weeklyMinutes,{min:Math.min(...totals),max:Math.max(...totals)});
  assert.deepEqual(JSON.parse(JSON.stringify(x)),x);
 }
});
test('all new rows have unique slugs, complete copy and valid workout metadata',()=>{
 const rows=[...pathwayArticles,...pathwayGuides,...pathwayWorkouts];assert.equal(new Set(rows.map(x=>x[0])).size,rows.length);
 for(const r of [...pathwayArticles,...pathwayGuides]){assert.ok(r[5].length);assert.ok(r[6].related.some(x=>x.path.startsWith('/resources/events/')||x.path.startsWith('/testing-library/')));}
 for(const r of pathwayWorkouts){const x=r[6];assert.ok(x.minutes>0);assert.ok(x.purpose);assert.ok(x.equipment.length);assert.match(x.dose,/\d/);assert.ok(r[5].length);}
});
test('legacy programme retains original notes and explicitly has no invented session data',()=>{
 const a={slug:'first-twelve-weeks-ruck-plan',path:'/resources/articles/first-twelve-weeks-ruck-plan/',title:'Existing',level:'Beginner',blocks:[{title:'Week by week',items:['1: Tue 20 min; Sat 30 min.','2: easier week.']},{title:'A normal training week',text:'Existing schedule'},{title:'Who this is for',text:'Existing baseline'},{title:'How to adjust',text:'Existing adjustment'}]};
 const blocks=JSON.stringify(a.blocks);attachLegacyProgrammes([a]);assert.equal(JSON.stringify(a.blocks),blocks);assert.equal(a.programme.scheduleFormat,'legacy-text');assert.equal(a.programme.weeklyMinutes,null);assert.deepEqual(a.programme.weeks.map(w=>w.sessions),[[],[]]);assert.equal(a.programme.weeks[1].phase,'easier');
});
