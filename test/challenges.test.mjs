import test from 'node:test';
import assert from 'node:assert/strict';
import {challenges,challengeRoutes,monthlyRotation,monthlyChallenge,completionSheet} from '../src/data/challenges.mjs';
import {challengeFilters,filterChallenges,renderChallengeLibrary,renderChallengeDetail} from '../src/lib/challenges.mjs';
import {sections} from '../src/data/content.mjs';
import {entries} from '../src/data/guides.mjs';
import {assessments} from '../src/data/assessments.mjs';
const filters=s=>challengeFilters(new URLSearchParams(s));
test('unique stable challenge IDs, complete records, distinct paths, and valid related links',()=>{
 assert.equal(challenges.length,25);assert.equal(new Set(challengeRoutes).size,26);assert.equal(new Set(challenges.map(c=>c.category)).size,11);
 const valid=new Set(['/testing-library/',...assessments.map(a=>'/testing-library/'+a.id+'/'),...Object.keys(sections),...Object.keys(entries)]);
 for(const c of challenges){assert.match(c.id,/^[a-z0-9-]+$/);assert.equal(c.kind,'independent');assert.equal(c.version,1);assert.equal(c.options.length,2);for(const k of ['title','purpose','equipment','prep','finish','alternative','review'])assert.ok(c[k].length>10,k+' '+c.id);for(const [href,label,why] of c.links){assert.ok(valid.has(href),href);assert.ok(label&&why);}}
});
test('filtering is composable, counts accurate and sort non-mutating',()=>{
 const initial=challenges.map(c=>c.id);assert.equal(filterChallenges(filters('')).length,25);assert.equal(filterChallenges(filters('q=map+return')).some(c=>c.id==='map-and-return'),true);assert.equal(filterChallenges(filters('category=Teamwork&format=Solo')).length,0);assert.equal(filterChallenges(filters('category=Teamwork&format=Team')).length,2);assert.equal(filterChallenges(filters('q=impossiblezzzz')).length,0);assert.equal(filters('level=unknown').level,'all');const sorted=filterChallenges(filters('sort=name'));assert.deepEqual(sorted.map(c=>c.title),sorted.map(c=>c.title).sort((a,b)=>a.localeCompare(b,'en')));assert.deepEqual(challenges.map(c=>c.id),initial);
});
test('monthly rotation is complete and completion sheet is clearly personal',()=>{
 assert.equal(new Set(monthlyRotation).size,12);for(let m=1;m<=12;m++)assert.equal(monthlyChallenge(m).id,monthlyRotation[m-1]);assert.throws(()=>monthlyChallenge(0));assert.throws(()=>monthlyChallenge(13));for(const c of challenges){const sheet=completionSheet(c);assert.match(sheet,/self-reported, not an official certificate/);assert.ok(sheet.includes(c.finish));assert.ok(sheet.includes('adapted / stopped / rescheduled'));}
});
test('static render covers all results and escapes hostile query parameters',()=>{const html=renderChallengeLibrary(new URLSearchParams(),1);assert.equal((html.match(/data-challenge-id=/g)||[]).length,25);assert.match(html,/25 of 25 challenges/);const evil=renderChallengeLibrary(new URLSearchParams('q=%22%3E%3Cscript%3E'),1);assert.doesNotMatch(evil,/<script>/);assert.match(evil,/0 of 25 challenges/);assert.match(renderChallengeDetail(challenges[0]),/\/challenge-records\/first-distance\.txt/);});
