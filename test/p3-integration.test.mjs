import test from 'node:test';
import assert from 'node:assert/strict';
import {collections,entries,trainingProgrammes} from '../src/data/guides.mjs';
import {assessments} from '../src/data/assessments.mjs';
import {renderEntry,renderCollection,workoutFilterMatch} from '../src/lib/resource-pages.mjs';
import {pathwayArticles,pathwayGuides,pathwayWorkouts} from '../src/data/training-pathways.mjs';
const article='/resources/articles/',workout='/training/workouts/';
test('programme export and catalogue are aligned; every reference resolves',()=>{
 assert.equal(trainingProgrammes.length,16);
 assert.equal(collections[article].filter(a=>a.trainingPlan).length,16);
 assert.equal(trainingProgrammes.filter(p=>p.scheduleFormat==='legacy-text').length,4);
 const targets=new Set([...Object.keys(entries),...assessments.map(a=>`/testing-library/${a.id}/`)]);
 for(const plan of trainingProgrammes){assert.equal(entries[plan.path].programme,plan);assert.ok(targets.has(plan.path));assert.ok(plan.related.length);for(const r of plan.related)assert.ok(targets.has(r.path),r.path);for(const w of plan.weeks)for(const s of w.sessions)if(s.workoutPath)assert.ok(entries[s.workoutPath]?.kind==='Workout',s.workoutPath);}
 for(const r of [...pathwayArticles,...pathwayGuides]){const x=entries[article+r[0]+'/'];assert.ok(x);const html=renderEntry(x);for(const rel of x.related){assert.ok(targets.has(rel.path),rel.path);assert.ok(html.includes(`href="${rel.path}"`),rel.path);}}
});
test('new workout entries preserve searchable filter metadata',()=>{
 const html=renderCollection(collections[workout]);
 for(const r of pathwayWorkouts){const x=entries[workout+r[0]+'/'];assert.ok(x);assert.ok(html.includes(`href="${x.path}"`));assert.ok(workoutFilterMatch({purpose:x.purpose,equipment:x.equipment.join('|'),minutes:String(x.minutes)},{purpose:x.purpose,equipment:x.equipment[0],duration:'60'}));assert.ok(renderEntry(x).includes('Working dose'));}
});
