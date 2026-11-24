import test from 'node:test';
import assert from 'node:assert/strict';
import { entries,collections } from '../src/data/guides.mjs';
import { pace,gap,cleanCsv,planWeek,renderEntry,crewText } from '../src/lib/resource-pages.mjs';
import { assessments } from '../src/data/assessments.mjs';
import {readFile,stat} from 'node:fs/promises';
import {join} from 'node:path';
test('collections have unique usable paths and substantive sections',async()=>{assert.equal(Object.keys(collections).length,7);assert.equal(Object.keys(entries).length,208);for(const [path,x] of Object.entries(entries)){assert.equal(path,x.path);assert.ok(path.startsWith(x.parent));assert.ok(x.blocks.length>=2);assert.ok(x.blocks.every(b=>b.title&&(b.text||b.items?.length)));assert.match(renderEntry(x),/<h1>/);if(x.image)assert.ok((await stat(join(import.meta.dirname,'../public/assets',x.image))).size>0);else assert.doesNotMatch(renderEntry(x),/guide-entry-image/);if(x.country)assert.ok((await stat(join(import.meta.dirname,'../public/assets/flags',x.country.toLowerCase()+'.svg'))).size>0);assert.ok(x.links?.every(([,url])=>url.startsWith('https://'))??true);}});
test('pace calculator validates inputs and calculates elapsed pace',()=>{assert.deepEqual(pace(10,90),{secondsPerKm:540,kmh:6.67});assert.throws(()=>pace(0,90));assert.throws(()=>pace(10,NaN));});
test('assessment gap handles both directions and no false overall pass',()=>{assert.deepEqual(gap(600,540,'lower'),{remaining:60,met:false});assert.deepEqual(gap(20,25,'higher'),{remaining:5,met:false});assert.deepEqual(gap(500,540,'lower'),{remaining:0,met:true});assert.throws(()=>gap(10,0,'higher'));});
test('CSV export protects spreadsheet formula prefixes and quotes',()=>{assert.equal(cleanCsv('=SUM(A1:A2)'),`"'=SUM(A1:A2)"`);assert.equal(cleanCsv('  @x'),`"'  @x"`);assert.equal(cleanCsv('a"b'),'"a""b"');});
test('weekly plans honor inputs without automatically increasing longest session',()=>{for(const days of [2,3,4]){assert.equal(planWeek({goal:'distance',days,baseline:60,equipment:'weights'}).length,days);}assert.match(planWeek({goal:'distance',days:2,baseline:60,equipment:'pack'})[1],/^60 min/);assert.throws(()=>planWeek({goal:'distance',days:9,baseline:60,equipment:'pack'}));});
test('new formal assessments have official sources and distinct IDs',()=>{assert.ok(assessments.some(a=>a.id==='army-aft'&&a.source.url==='https://www.army.mil/aft/'));assert.ok(assessments.some(a=>a.id==='uk-police-jrft'&&a.countryCode==='GB'));});

test("crew plan export preserves local form input as plain text",()=>{assert.equal(crewText("Plan",[["Route","  10 km  "]]),"Plan\n\nRoute:\n10 km\n");});

test('semantic pictograms are distinct and decorative, not interchangeable',async()=>{
 const {paths,icon}=await import('../src/lib/icons.mjs');
 const names=['article','journal','route','calendar','book','people','toolbox','plan','workout','target','barbell','learning','clipboard','scale','source'];
 assert.equal(new Set(names.map(n=>icon(n,24))).size,names.length);
 assert.equal(new Set(names.filter(n=>n!=='barbell').map(n=>paths[n])).size,names.length-1);
 for(const n of names){assert.ok(icon(n).includes(`data-icon="${n}"`));assert.match(icon(n),/aria-hidden="true"/);}
});

 test('all 50 workouts have structured purpose, duration, equipment and a measurable example dose',()=>{const workouts=collections['/training/workouts/'];assert.equal(workouts.length,50);for(const x of workouts){assert.ok(x.purpose);assert.ok(x.minutes===null||(Number.isInteger(x.minutes)&&x.minutes>0));assert.ok(x.equipment.length);assert.ok(/\d/.test(x.dose));assert.ok(x.blocks.some(b=>b.title==='Working dose'));}});
 test('workout filters combine purpose, equipment and upper duration without misclassifying multi-day sessions',async()=>{const {workoutFilterMatch,renderCollection}=await import('../src/lib/resource-pages.mjs');const x={purpose:'Strength',equipment:'Weights|Sandbag',minutes:'45'};assert.equal(workoutFilterMatch(x,{purpose:'Strength',equipment:'Weights',duration:'60'}),true);assert.equal(workoutFilterMatch(x,{equipment:'Pack'}),false);assert.equal(workoutFilterMatch(x,{duration:'30'}),false);assert.equal(workoutFilterMatch({minutes:''},{duration:'90'}),false);assert.equal(workoutFilterMatch({minutes:''},{duration:'long'}),true);const html=renderCollection(collections['/training/workouts/']);for(const id of ['guide-purpose','guide-equipment','guide-duration'])assert.ok(html.includes(`id="${id}"`));});
