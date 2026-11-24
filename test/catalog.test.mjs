import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { assessments, byId, categories } from '../src/data/assessments.mjs';
import { FILTER_DEFAULTS, filterAssessments, validSelection, parseSelection, normalizeParams, withParams } from '../src/lib/catalog.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
test('catalogue has distinct assessment identifiers and retains specific regression examples',()=>{
 assert.equal(new Set(assessments.map(a=>a.id)).size,assessments.length);
 assert.equal(new Set(assessments.map(a=>a.name)).size,assessments.length);
 assert.equal(byId.artillerijaeger.country,'Norway');
 assert.equal(byId['danish-police'].metric.label,'2,400 m run');
 assert.equal(byId['ntoa-pfq'].components.length,5);
});
test('every test has source metadata and a distinct locally bundled visual asset',async()=>{
 for(const item of assessments){
  assert.ok(item.name&&item.overview&&item.shortName&&item.metric.label);
  assert.ok(item.source?.url?.startsWith('https://'),`Missing original source for ${item.id}`);
  const url=new URL(item.source.url); assert.ok(url.hostname.includes('.'));
  const image=await readFile(join(root,'public/assets',item.image));if(item.imageKind==='reference-graphic'){assert.match(item.image,/^assessment-[a-z0-9-]+\.svg$/);assert.match(image.toString('utf8'),/^<svg /);assert.equal(item.comparisonEligible,false);}else{assert.match(item.image,/^[a-z0-9-]+\.webp$/);assert.equal(image.toString('ascii',0,4),'RIFF');assert.equal(image.toString('ascii',8,12),'WEBP');assert.ok(image.length>10000);}assert.equal(assessments.filter(a=>a.image===item.image).length,1);
  const dir=await stat(join(root,'testing-library',item.id,'index.html'));
  assert.ok(dir.size>100);
 }
});
test('library filters and search combine correctly',()=>{
 assert.equal(filterAssessments().length,assessments.length);
 assert.equal(filterAssessments(assessments,{...FILTER_DEFAULTS,country:'Norway'}).length,assessments.filter(a=>a.country==='Norway').length);
 assert.equal(filterAssessments(assessments,{...FILTER_DEFAULTS,domain:'Police'}).length,assessments.filter(a=>a.domain==='Police').length);
 const beep=filterAssessments(assessments,{...FILTER_DEFAULTS,q:'beep'}).map(a=>a.id);for(const id of ['nsw-pct','foreign-legion'])assert.ok(beep.includes(id),id);
 const water=filterAssessments(assessments,{...FILTER_DEFAULTS,category:'water'});assert.ok(water.every(a=>a.category.includes('water')));for(const id of ['rasp','artillerijaeger','kjk','mjk','fsk','seal-pst','pararescue-ift','vessel-operator'])assert.ok(water.some(a=>a.id===id),id);
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


test('reference-only entries are searchable but cannot enter comparison through URL or selection',()=>{assert.deepEqual(parseSelection('kjk,rasp,seal-pst,ntoa-pfq'),['rasp','ntoa-pfq']);assert.ok(filterAssessments(assessments,{...FILTER_DEFAULTS,q:'Fartøysoperatør'}).some(a=>a.id==='vessel-operator'));for(const a of assessments.filter(a=>a.comparisonEligible===false))assert.ok(!validSelection([a.id]).length,a.id);});
