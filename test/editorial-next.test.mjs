import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {challenges,challengeRoutes} from '../src/data/challenges.mjs';
import {readingBooks,readingResearchLead} from '../src/data/reading.mjs';
import {coverFiles} from '../src/data/reading-covers.mjs';
import {sections} from '../src/data/content.mjs';
import {entries,trainingProgrammes} from '../src/data/guides.mjs';
import {communityPost,invitations,renderCommunityPost} from '../src/data/community-posts.mjs';
import {renderReadingBlock} from '../src/lib/reading-render.mjs';
import {catalogueLabel} from '../src/lib/landing.mjs';
import {crewDirectory} from '../src/data/p4-directory.mjs';

test('every independent challenge has its own invitation with its actual options and downloadable route',()=>{
 assert.deepEqual(Object.keys(invitations).sort(),challenges.map(c=>c.id).sort());
 const posts=new Set();for(const c of challenges){const post=communityPost(c);assert.ok(!posts.has(post));posts.add(post);for(const option of c.options)assert.ok(post.includes(option.target));assert.ok(post.includes(`https://ruckrev-revisited.vercel.app${c.path}`));const html=renderCommunityPost(c);assert.ok(html.includes(`href="/challenge-posts/${c.id}.txt"`));assert.match(html,/<textarea[^>]*readonly/);}
});
test('reading links, internal destinations and local cover manifest are consistent',async()=>{
 assert.equal(new Set(readingBooks.map(b=>b.id)).size,readingBooks.length);assert.ok(sections['/resources/reading/'].blocks.length);assert.equal(Number(catalogueLabel('Fixture','/resources/reading/').match(/\d+/)?.[0]),readingBooks.length);assert.equal(Number(catalogueLabel('Fixture','/resources/crew-directory/').match(/\d+/)?.[0]),crewDirectory.length);
 for(const b of readingBooks){for(const url of [b.bookUrl,b.authorUrl,b.coverUrl].filter(Boolean))assert.equal(new URL(url).protocol,'https:');assert.ok(entries[b.related[0]]||sections[b.related[0]]||challengeRoutes.includes(b.related[0]),b.related[0]);const html=renderReadingBlock({book:b,text:b.description},0);assert.ok(html.includes(b.bookUrl));if(b.authorUrl)assert.ok(html.includes(b.authorUrl));if(coverFiles[b.id]){const bytes=await readFile(new URL('../public'+coverFiles[b.id],import.meta.url));assert.equal(bytes.readUInt16BE(0),0xffd8);assert.ok(html.includes(`src="${coverFiles[b.id]}"`));}else assert.ok(html.includes(b.coverUrl.replace(/&/g,'&amp;')));}
 assert.equal(readingResearchLead.title,'The Comrades Way — John McInroy');assert.ok(!readingBooks.some(b=>b.title==='The Comrades Way'));
});
test('six-week rehearsal remains a conservative structured block with a working worksheet',async()=>{const plan=trainingProgrammes.find(x=>x.id==='six-week-event-rehearsal');assert.ok(plan);assert.equal(plan.weeks.length,6);assert.deepEqual(plan.weeks.filter(w=>w.phase==='easier').map(w=>w.number),[4,6]);assert.ok(plan.weeks.every(w=>w.sessions.every(s=>s.minutes<=90)));assert.equal(entries[plan.path].worksheet.path,'/downloads/rr-event-rehearsal.txt');assert.ok((await readFile(new URL('../public/downloads/rr-event-rehearsal.txt',import.meta.url),'utf8')).trim());assert.ok(entries['/resources/articles/the-last-hour-starts-at-home/']);});
