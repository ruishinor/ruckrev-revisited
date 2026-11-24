import test from 'node:test';
import assert from 'node:assert/strict';
import {challenges,completionSheet} from '../src/data/challenges.mjs';
import {challengeFieldGuides} from '../src/data/challenge-field-guides.mjs';
import {renderFieldGuide} from '../src/lib/challenge-field-guide-render.mjs';
import {renderChallengeDetail} from '../src/lib/challenges.mjs';
const words=s=>s.trim().split(/\s+/).length;
test('every independent challenge has a unique substantive field guide with an actionable protocol',()=>{
 assert.deepEqual(Object.keys(challengeFieldGuides).sort(),challenges.map(c=>c.id).sort());
 const seen=new Set();
 for(const c of challenges){const g=challengeFieldGuides[c.id];
  for(const k of ['why','ready','record','next']){assert.ok(words(g[k])>=20,`${c.id}: ${k}`);assert.ok(!seen.has(g[k]),`${c.id}: repeated ${k}`);seen.add(g[k]);}
  assert.ok(g.steps.length>=3,`${c.id}: steps`);
  for(const s of g.steps){assert.ok(words(s)>=12,`${c.id}: step too short`);assert.ok(!seen.has(s),`${c.id}: repeated step`);seen.add(s);}
  assert.ok(words(Object.values(g).flat().join(' '))>=160,`${c.id}: shallow guide`);
 }
});
test('all challenge routes render the field guide without removing existing completion and record functionality',()=>{
 for(const c of challenges){const html=renderChallengeDetail(c),guide=renderFieldGuide(c);
  assert.ok(html.includes(guide),`${c.id}: field guide absent`);
  assert.equal((html.match(/id="field-guide-title"/g)||[]).length,1);
  for(const label of ['Choose your target','How to do it','What to record','Where to go next','Completion','Personal completion record'])assert.ok(html.includes(label),`${c.id}: ${label}`);
  assert.ok(html.includes(`/challenge-records/${c.id}.txt`));
  assert.ok(completionSheet(c).includes(c.finish));
  assert.equal(c.version,1);
 }
});
