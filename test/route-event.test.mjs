import test from 'node:test';
import assert from 'node:assert/strict';
import {trackViewport,panTrack,zoomTrack,viewBox,renderPanControls} from '../src/lib/route-navigation.mjs';
import {isIsoDate,eventDateMatch,renderEventDateFilters} from '../src/lib/event-discovery.mjs';
import {renderAssessmentDetails} from '../src/lib/assessment-details.mjs';
import {byId} from '../src/data/assessments.mjs';
test('map viewport remains bounded and pan is available after zoom',()=>{
 const v=trackViewport();assert.equal(viewBox(v),'0 0 640 360');
 const z=zoomTrack(v,2);assert.equal(viewBox(z),'160 90 320 180');
 assert.equal(viewBox(panTrack(z,80,-45)),'240 45 320 180');
 assert.equal(viewBox(panTrack(z,1e6,-1e6)),'320 0 320 180');
 assert.equal(zoomTrack(z,100).zoom,8);assert.equal(viewBox(zoomTrack(z,.01)),'0 0 640 360');
 assert.throws(()=>trackViewport(NaN));assert.throws(()=>zoomTrack(z,0));assert.match(renderPanControls(),/aria-label="Pan route preview"/);
});
test('event date filters are inclusive, distinguish unknown dates, and reject invalid ranges',()=>{
 assert.ok(isIsoDate('2028-02-29'));assert.ok(!isIsoDate('2027-02-29'));
 assert.ok(eventDateMatch(null));assert.ok(eventDateMatch(null,{dateStatus:'undated'}));assert.ok(!eventDateMatch(null,{from:'2027-01-01'}));
 assert.ok(eventDateMatch('2027-05-01',{from:'2027-05-01',to:'2027-05-01'}));
 assert.ok(!eventDateMatch('2027-05-02',{to:'2027-05-01'}));assert.ok(!eventDateMatch('2027-05-01',{from:'2027-06-01',to:'2027-05-01'}));
 assert.ok(!eventDateMatch('2027-05-01',{dateStatus:'undated'}));assert.match(renderEventDateFilters(),/Reset event filters/);
});
test('assessment cards and detail distinguish source scope and dry pack definition',()=>{
 assert.match(byId.rasp.metric.detail,/dry pack/);assert.match(renderAssessmentDetails('rasp'),/35 lb dry rucksack/);
 const html=renderAssessmentDetails('uk-police-jrft');assert.match(html,/under review/);assert.match(html,/Police support unit/);assert.match(html,/5:4/);assert.match(html,/525 m/);
});
