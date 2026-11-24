import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {byId} from '../src/data/assessments.mjs';
import {assessmentDetails,renderAssessmentDetails} from '../src/lib/assessment-details.mjs';
import {assessmentPractice} from '../src/lib/progression.mjs';
import {collections,entries,trainingProgrammes} from '../src/data/guides.mjs';
import {europeanAdventures,eventPlanLinks,renderEuropeanExtras,frenchAccounts} from '../src/data/european-adventures.mjs';
import {makeProgrammeImport} from '../src/lib/training-import.mjs';
import {eventFacetMatch} from '../src/lib/adventure-facets.mjs';
import {renderEntry} from '../src/lib/resource-pages.mjs';
import {photoScenes} from '../src/data/challenge-photography.mjs';

test('WCT is a searchable occupational assessment with separate duty-level standards and an accessible diagram',()=>{
 const a=byId['nwcg-wct'],d=assessmentDetails[a.id];assert.equal(a.domain,'Fire and rescue');assert.equal(a.source.date,'2023, November');assert.deepEqual(d.rows.map(r=>r[3]),['45 min','30 min','16 min']);assert.match(d.format,/no running or jogging/);assert.match(d.scoring,/altitude corrections/);const h=renderAssessmentDetails(a.id);assert.match(h,/wct-diagram-title/);assert.match(h,/not a site-specific course map/);assert.match(h,/45 lb/);assert.match(assessmentPractice(a.id),/\/testing-library\/nwcg-wct\//);
});
test('European event sources and category distinctions remain explicit',()=>{
 assert.equal(collections['/resources/events/'].length,46);for(const e of europeanAdventures){assert.equal(entries[e.path],e);assert.equal(e.links[0][1],e.citation.url);assert.ok(e.variants.every(v=>v.load===null&&v.qualification===null));}const [fr,hu]=europeanAdventures;assert.deepEqual(fr.variants.map(v=>v.distanceKm),[12,22,38,52]);assert.match(renderEntry(fr),/older date/);assert.match(renderEntry(hu),/conflicting later line/);assert.ok(eventFacetMatch(hu.variants,{participation:'solo',distance:'ultra'}));assert.ok(eventFacetMatch(hu.variants,{participation:'team',distance:'ultra'}));assert.doesNotMatch(renderEuropeanExtras(fr),/web\.archive\.org/);assert.match(renderEuropeanExtras(fr),/https:\/\/www\.paris-mantes\.fr\//);assert.equal(frenchAccounts.length,2);
});
test('new programmes import real session schedules, retain recovery weeks and link actual worksheets',async()=>{
 const start='2026-11-30',today='2026-11-24';for(const [id,weekCount,expected] of [['eight-week-winter-night-walk',8,24],['twelve-week-urban-ultra-base',12,36]]){const p=trainingProgrammes.find(x=>x.id===id);assert.equal(p.weeks.length,weekCount);assert.equal(p.scheduleFormat,'structured');assert.ok(p.weeks.some(w=>w.phase==='easier'));const imported=makeProgrammeImport(p,start,[],{today,workoutReference:path=>({kind:'workout',id:path,label:entries[path].title})});assert.equal(imported.planned.length,expected);assert.ok(imported.planned.every(s=>s.load===null));assert.equal(imported.parent.ref.id,p.path);assert.ok((await readFile(new URL('../public'+entries[p.path].worksheet.path,import.meta.url),'utf8')).length>500);assert.match(renderEntry(entries[p.path]),/Import actual programme into My Training/);}
 for(const [slug,[id]] of Object.entries(eventPlanLinks)){const e=entries['/resources/events/'+slug+'/'];assert.ok(e);assert.ok(renderEntry(e).includes('/resources/articles/'+id+'/'));assert.ok(renderEntry(e).includes('/my-training/?programme='+id+'#training-structured-import'));}
});
test('six new scene IDs are real distinct illustrations without replacing prior artwork',async()=>{assert.equal(Object.keys(photoScenes).length,25);const ids=['local-climbs','viewpoint-walk','climb-not-race','pack-fit-check','shared-object','map-and-return'];const seen=new Set();for(const id of ids){assert.ok(photoScenes[id]);const bytes=await readFile(new URL('../artwork/challenges/'+id+'.jpg',import.meta.url));assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(bytes.readUInt16BE(bytes.length-2),0xffd9);assert.ok(bytes.length>10000);seen.add(bytes.toString('base64'));}assert.equal(seen.size,6);});
