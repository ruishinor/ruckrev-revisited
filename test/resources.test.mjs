import test from 'node:test';
import assert from 'node:assert/strict';
import { entries,collections } from '../src/data/guides.mjs';
import { pace,gap,cleanCsv,planWeek,renderEntry,crewText } from '../src/lib/resource-pages.mjs';
import { assessments } from '../src/data/assessments.mjs';
import {readFile,stat} from 'node:fs/promises';
import {join} from 'node:path';
test('collections have unique usable paths and substantive sections',async()=>{assert.equal(Object.keys(collections).length,6);assert.equal(Object.keys(entries).length,71);for(const [path,x] of Object.entries(entries)){assert.equal(path,x.path);assert.ok(path.startsWith(x.parent));assert.ok(x.blocks.length>=2);assert.ok(x.blocks.every(b=>b.title&&(b.text||b.items?.length)));assert.match(renderEntry(x),/<h1>/);assert.ok((await stat(join(import.meta.dirname,'../public/assets',x.image))).size>0);if(x.country)assert.ok((await stat(join(import.meta.dirname,'../public/assets/flags',x.country.toLowerCase()+'.svg'))).size>0);assert.ok(x.links?.every(([,url])=>url.startsWith('https://'))??true);}});
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
