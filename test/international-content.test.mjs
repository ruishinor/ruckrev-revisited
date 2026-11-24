import test from 'node:test';
import assert from 'node:assert/strict';
import {nswProtocols,renderComponentProtocols,movementNotes} from '../src/lib/component-protocols.mjs';
import {internationalEvents,practitionerArticles} from '../src/data/international-content.mjs';
test('NSW protocols distinguish actual assessment setup from independent practice',()=>{
 assert.equal(nswProtocols.length,6); const a=nswProtocols.find(x=>x.title==='Illinois agility course');
 assert.match(a.setup,/9\.14 m long × 4\.6 m wide/); assert.match(a.standard,/20 seconds or less/); assert.equal(a.steps.length,4);assert.match(a.invalid,/cone/);
 assert.match(renderComponentProtocols('nsw-pct'),/Official Illinois agility course instructions and course diagram/);
 assert.equal((renderComponentProtocols('nsw-pct').match(/<details /g)||[]).length,6);
 assert.match(renderComponentProtocols('norwegian-armed-forces'),/Medicine-ball throw/); assert.equal(renderComponentProtocols('unknown'),'');
});
test('international catalogue separates confirmed dates from conflicting calendars',()=>{
 assert.equal(internationalEvents.length,8);assert.equal(new Set(internationalEvents.map(x=>x.slug)).size,8);
 assert.equal(internationalEvents.filter(x=>!x.eventDate).length,2);assert.ok(internationalEvents.every(x=>x.links.length&&x.blocks.length>=4));
 const jp=internationalEvents.find(x=>x.country==='JP');assert.equal(jp.eventDate,'2027-03-06');assert.match(jp.meta,/6–7 March/);assert.ok(internationalEvents.some(x=>x.country==='KR'));assert.ok(internationalEvents.some(x=>x.country==='TW'));
 assert.equal(practitionerArticles.length,4);assert.ok(practitionerArticles.every(x=>x.blocks.length>=5));
});
