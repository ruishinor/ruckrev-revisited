import test from 'node:test';
import assert from 'node:assert/strict';
import { assessments, byId } from '../src/data/assessments.mjs';
import { assessmentDetails, renderAssessmentDetails } from '../src/lib/assessment-details.mjs';
import { icon, paths } from '../src/lib/icons.mjs';
test('every assessment has a structured protocol and separate practical guidance',()=>{
 assert.deepEqual(Object.keys(assessmentDetails).sort(),assessments.map(a=>a.id).sort());
 for(const a of assessments){const d=assessmentDetails[a.id];assert.ok(d.rows.length>=2);assert.ok(d.rows.every(r=>r.length===d.columns.length));assert.ok(d.training.length>=3&&d.mistakes.length>=2&&d.log);const html=renderAssessmentDetails(a.id);for(const s of ['Test protocol and standards','How to prepare','Common mistakes','What to log','scope="row"','scope="col"','Independent training guidance'])assert.ok(html.includes(s),a.id);assert.ok(Object.hasOwn(paths,a.metric.icon));}
 assert.equal(renderAssessmentDetails('__proto__'),'');assert.equal(renderAssessmentDetails('unknown'),'');
});
test('critical protocol distinctions and corrected cards are retained',()=>{
 assert.match(byId['danish-police'].metric.detail,/12:00.*13:30/);assert.equal(byId['nsw-pct'].metric.icon,'shuttle');assert.equal(byId['uk-police-jrft'].metric.icon,'shuttle');assert.match(assessmentDetails['nsw-pct'].rows.at(-1)[0],/20 m/);assert.match(assessmentDetails['uk-police-jrft'].rows[0][1],/15 m/);assert.match(assessmentDetails.rasp.scoring,/packing list/);assert.match(assessmentDetails['ntoa-pfq'].scoring,/30 total/);
});
test('running, loaded endurance and shuttle icons share a scalable vector contract',()=>{
 for(const name of ['run','ruck','shuttle']){const html=icon(name,24);assert.match(html,/viewBox="0 0 24 24"/);assert.match(html,/aria-hidden="true"/);assert.match(html,/stroke="currentColor"/);assert.ok(!html.includes('<img'));}assert.equal(new Set(['run','ruck','shuttle'].map(k=>paths[k])).size,3);
});
