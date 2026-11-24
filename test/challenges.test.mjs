import test from 'node:test';
import assert from 'node:assert/strict';
import {challenges,challengeRoutes,monthlyRotation,monthlyChallenge,completionSheet} from '../src/data/challenges.mjs';
import {challengeFilters,filterChallenges,renderChallengeLibrary,renderChallengeDetail} from '../src/lib/challenges.mjs';
import {sections} from '../src/data/content.mjs';
import {entries} from '../src/data/guides.mjs';
import {assessments} from '../src/data/assessments.mjs';
const filters=s=>challengeFilters(new URLSearchParams(s));
test('unique stable challenge IDs, complete records, distinct paths, and valid related links',()=>{
 assert.equal(new Set(challengeRoutes).size,challenges.length+1);assert.equal(new Set(challenges.map(c=>c.id)).size,challenges.length);
 const valid=new Set(['/testing-library/',...assessments.map(a=>'/testing-library/'+a.id+'/'),...Object.keys(sections),...Object.keys(entries)]);
 for(const c of challenges){assert.match(c.id,/^[a-z0-9-]+$/);assert.equal(c.kind,'independent');assert.ok(Number.isInteger(c.version)&&c.version>=1);assert.equal(c.options.length,2);for(const k of ['title','purpose','equipment','prep','finish','alternative','review'])assert.ok(typeof c[k]==='string'&&c[k].trim(),k+' '+c.id);for(const [href,label,why] of c.links){assert.ok(valid.has(href),href);assert.ok(label&&why);}}
});
test('filtering is composable, counts accurate and sort non-mutating',()=>{
 const initial=challenges.map(c=>c.id);assert.equal(filterChallenges(filters('')).length,challenges.length);assert.equal(filterChallenges(filters('q=map+return')).some(c=>c.id==='map-and-return'),true);assert.equal(filterChallenges(filters('category=Teamwork&format=Solo')).length,challenges.filter(c=>c.category==='Teamwork'&&['Solo','Solo or team'].includes(c.format)).length);assert.equal(filterChallenges(filters('category=Teamwork&format=Team')).length,challenges.filter(c=>c.category==='Teamwork'&&['Team','Solo or team'].includes(c.format)).length);assert.equal(filterChallenges(filters('q=impossiblezzzz')).length,0);assert.equal(filters('level=unknown').level,'all');const sorted=filterChallenges(filters('sort=name'));assert.deepEqual(sorted.map(c=>c.title),sorted.map(c=>c.title).sort((a,b)=>a.localeCompare(b,'en')));assert.deepEqual(challenges.map(c=>c.id),initial);
});
test('monthly rotation is complete and completion sheet is clearly personal',()=>{
 assert.equal(new Set(monthlyRotation).size,12);for(let m=1;m<=12;m++)assert.equal(monthlyChallenge(m).id,monthlyRotation[m-1]);assert.throws(()=>monthlyChallenge(0));assert.throws(()=>monthlyChallenge(13));for(const c of challenges){const sheet=completionSheet(c);assert.ok(sheet.includes(c.finish));}
});
test('static render covers all results and escapes hostile query parameters',()=>{const html=renderChallengeLibrary(new URLSearchParams(),1);assert.equal((html.match(/data-challenge-id=/g)||[]).length,challenges.length);assert.ok(html.includes(`${challenges.length} of ${challenges.length} challenges`));const evil=renderChallengeLibrary(new URLSearchParams('q=%22%3E%3Cscript%3E'),1);assert.doesNotMatch(evil,/<script>/);assert.ok(evil.includes(`0 of ${challenges.length} challenges`));assert.match(renderChallengeDetail(challenges[0]),/\/challenge-records\/first-distance\.txt/);});
