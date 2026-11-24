import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { assessments, byId, categories } from '../src/data/assessments.mjs';
import { FILTER_DEFAULTS, filterAssessments, validSelection, parseSelection, normalizeParams, withParams } from '../src/lib/catalog.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
test('catalogue has seventeen distinct assessments and distinct formal publishers',()=>{
 assert.equal(assessments.length,17);
 assert.equal(new Set(assessments.map(a=>a.id)).size,17);
 assert.equal(new Set(assessments.map(a=>a.name)).size,17);
 assert.equal(byId.artillerijaeger.country,'Norway');
 assert.equal(byId['nsw-pct'].metric.label,'Multi-stage fitness test');
 assert.equal(byId['danish-police'].metric.label,'2,400 m run');
 assert.equal(byId['ntoa-pfq'].components.length,5);
});
test('every test has a working link, short description and distinct locally bundled imagery',async()=>{
 for(const item of assessments){
  assert.ok(item.name&&item.overview&&item.shortName&&item.metric.label);
  assert.ok(item.source?.url?.startsWith('https://'),`Missing original source for ${item.id}`);
  const url=new URL(item.source.url); assert.ok(url.hostname.includes('.'));
  assert.match(item.image,/^[a-z0-9-]+\.webp$/);const image=await readFile(join(root,'public/assets',item.image));assert.equal(image.toString('ascii',0,4),'RIFF');assert.equal(image.toString('ascii',8,12),'WEBP');assert.ok(image.length>10000);assert.equal(assessments.filter(a=>a.image===item.image).length,1);
  const dir=await stat(join(root,'testing-library',item.id,'index.html'));
  assert.ok(dir.size>100);
 }
});
test('library filters and search combine correctly',()=>{
 assert.equal(filterAssessments().length,17);
 assert.equal(filterAssessments(assessments,{...FILTER_DEFAULTS,country:'Norway'}).length,2);
 assert.equal(filterAssessments(assessments,{...FILTER_DEFAULTS,domain:'Police'}).length,4);
 assert.deepEqual(filterAssessments(assessments,{...FILTER_DEFAULTS,q:'beep'}).map(a=>a.id),['nsw-pct','foreign-legion']);
 assert.deepEqual(filterAssessments(assessments,{...FILTER_DEFAULTS,category:'water'}).map(a=>a.id),['rasp','artillerijaeger']);
 assert.equal(filterAssessments(assessments,{...FILTER_DEFAULTS,category:'water',country:'Australia'}).length,0);
});
test('selection is de-duplicated and never exceeds three',()=>{
 assert.deepEqual(validSelection(['rasp','rasp','ntoa-pfq','unknown','nsw-pct','danish-police']),['rasp','ntoa-pfq','nsw-pct']);
 assert.deepEqual(parseSelection('none'),[]);assert.deepEqual(parseSelection('constructor,__proto__,toString'),[]);
 assert.deepEqual(parseSelection('rasp,artillerijaeger'),['rasp','artillerijaeger']);
});
test('URL handling ignores unexpected views and invalid sort names',()=>{
 const state=normalizeParams(new URLSearchParams('view=garbage&sort=broken&country=Norway&q=ruck'));
 assert.equal(state.view,'grid');assert.equal(state.sort,'relevance');assert.equal(state.country,'Norway');
 assert.equal(normalizeParams(new URLSearchParams('country=invalid&category=invalid')).country,'all');
 const url=withParams({...FILTER_DEFAULTS,country:'Norway'},['rasp']);
 assert.equal(url,'/testing-library/?country=Norway&compare=rasp');
});
test('every category has an icon and valid identifier',()=>{
 for(const c of categories){assert.match(c.id,/^[a-z]+$/);assert.ok(c.icon&&c.label);}
});
test('site copy avoids jargon and unsupported performance targets',async()=>{
 const content=await readFile(join(root,'src/data/assessments.mjs'),'utf8');
 assert.doesNotMatch(content,/evidence\b/i);
 assert.doesNotMatch(content,/20 km loaded march|3,000 m run in 14 minutes/i);
});
