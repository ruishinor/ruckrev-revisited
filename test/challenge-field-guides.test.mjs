import test from 'node:test';
import assert from 'node:assert/strict';
import {challenges,completionSheet} from '../src/data/challenges.mjs';
import {challengeFieldGuides} from '../src/data/challenge-field-guides.mjs';
import {renderFieldGuide} from '../src/lib/challenge-field-guide-render.mjs';
import {renderChallengeDetail} from '../src/lib/challenges.mjs';
test('every independent challenge has distinct nonempty guidance and execution steps',()=>{
 assert.deepEqual(Object.keys(challengeFieldGuides).sort(),challenges.map(c=>c.id).sort());
 const seen=new Set();
 for(const c of challenges){const g=challengeFieldGuides[c.id];
  for(const k of ['why','ready','record','next']){assert.ok(typeof g[k]==='string'&&g[k].trim(),`${c.id}: ${k}`);assert.ok(!seen.has(g[k]),`${c.id}: repeated ${k}`);seen.add(g[k]);}
  assert.ok(Array.isArray(g.steps)&&g.steps.length>0,`${c.id}: steps`);
  for(const s of g.steps){assert.ok(typeof s==='string'&&s.trim(),`${c.id}: missing step`);assert.ok(!seen.has(s),`${c.id}: repeated step`);seen.add(s);}
 }
});
test('all challenge routes render the field guide without removing existing completion and record functionality',()=>{
 for(const c of challenges){const html=renderChallengeDetail(c),guide=renderFieldGuide(c);
  assert.ok(html.includes(guide),`${c.id}: field guide absent`);
  assert.equal((html.match(/id="field-guide-title"/g)||[]).length,1);
  for(const selector of ['challenge-record','challenge-print','challenge-field-guide'])assert.ok(html.includes(selector),`${c.id}: ${selector}`);
  assert.ok(html.includes(`/challenge-records/${c.id}.txt`));
  assert.ok(completionSheet(c).includes(c.finish));
  assert.ok(Number.isInteger(c.version)&&c.version>=1);
 }
});
