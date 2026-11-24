import test from 'node:test';
import assert from 'node:assert/strict';
import {assessments,byId} from '../src/data/assessments.mjs';
import {militaryAssessments,militaryDetails,militaryPractice} from '../src/data/military-catalogue.mjs';
import {adventureEvents,renderEventCitation,renderUnconfirmedEvents} from '../src/data/adventure-catalogue.mjs';
import {collections,entries} from '../src/data/guides.mjs';
import {renderComponentProtocols} from '../src/lib/component-protocols.mjs';
import {renderEntry,renderCollection} from '../src/lib/resource-pages.mjs';
import {assessmentPractice} from '../src/lib/progression.mjs';

test('military fitness catalogue covers ten nations without treating every entry as special-forces selection',()=>{
 assert.equal(militaryAssessments.length,8);
 assert.equal(new Set(assessments.filter(a=>a.domain==='Armed forces').map(a=>a.country)).size,10);
 assert.equal(byId['foreign-legion'].metric.detail,'Level 5 minimum');
 assert.equal(militaryDetails['foreign-legion'].rows[2][1],'25 m unaided strongly recommended');
 for(const a of militaryAssessments){assert.ok(militaryPractice[a.id].length>=3);assert.match(assessmentPractice(a.id),new RegExp(`/testing-library/${a.id}/`));assert.match(a.source.url,/^https:\/\//);}
 assert.ok(!byId['canada-force'].category.includes('selection'));
});
test('new and existing events retain references, preserve uncertain dates and separate research leads',()=>{
 const events=collections['/resources/events/'];assert.equal(events.length,44);assert.equal(adventureEvents.length,9);
 assert.equal(events.filter(x=>!x.eventDate).length,17);
 for(const e of events){assert.equal(e.citation.url,e.links[0][1]);assert.match(renderEventCitation(e),/web\.archive\.org\/web\/\*/);assert.match(renderEntry(e),/Reference and archive/);}
 const road=entries['/resources/events/road-to-valhalla/'];assert.equal(road.eventDate,'2027-11-11');assert.match(road.meta,/248 km/);assert.match(renderEntry(road),/Historical rules, not yet confirmed for 2027/);
 assert.ok(!events.some(x=>x.eventCountry==='Ukraine'));assert.match(renderUnconfirmedEvents(),/Odesa 100 km/);assert.match(renderCollection(events),/Unconfirmed adventures and event leads/);
});
test('course figures carry accessible text and exact protocol dimensions without inline script or remote dependencies',()=>{
 for(const [id,title,measure] of [['foreign-legion','luc-diagram-title','20 metres'],['nsw-pct','illinois-diagram-title','9.14 m']]){const html=renderComponentProtocols(id);assert.match(html,/<figure class="course-diagram">/);assert.ok(html.includes(title));assert.ok(html.includes(measure));assert.match(html,/role="img" aria-labelledby=/);assert.doesNotMatch(html,/<script|<iframe/);}
});
