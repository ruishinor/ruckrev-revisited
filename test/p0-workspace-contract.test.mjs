import test from 'node:test';
import assert from 'node:assert/strict';
import {challenges} from '../src/data/challenges.mjs';
import {entries,trainingProgrammes} from '../src/data/guides.mjs';
import {catalogue,referenceForPath,resolveReference,referenceFrom} from '../src/lib/training-catalogue.mjs';
test('P2 and P3 catalogue references resolve in P1 without duplicate entries',()=>{
 const records=catalogue();assert.equal(new Set(records.map(x=>x.kind+':'+x.id)).size,records.length);
 assert.equal(records.filter(x=>x.kind==='challenge').length,25);
 for(const c of challenges){const x=referenceForPath(c.path);assert.equal(x.kind,'challenge');assert.equal(x.id,c.path);assert.equal(x.label,c.title);assert.deepEqual(resolveReference(referenceFrom(x)),x);assert.equal(entries[c.path],undefined);}
 assert.equal(trainingProgrammes.length,16);assert.equal(records.filter(x=>x.kind==='programme').length,16);
 for(const p of trainingProgrammes){const x=referenceForPath(p.path);assert.equal(x.kind,'programme');assert.equal(x.id,p.path);assert.equal(x.label,p.title);}
});
