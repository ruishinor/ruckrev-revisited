import test from 'node:test';
import assert from 'node:assert/strict';
import {collections,entries} from '../src/data/guides.mjs';
import {existsSync} from 'node:fs';
import {eventFacetMatch} from '../src/lib/adventure-facets.mjs';
import {assessments} from '../src/data/assessments.mjs';
import {renderCollection,renderEntry} from '../src/lib/resource-pages.mjs';
import {eventMarkers,renderEventMarkers} from '../src/lib/event-markers.mjs';
const events=collections['/resources/events/'];
const find=slug=>events.find(x=>x.slug===slug);
test('category icons retain visible labels and distinguish mixed participation from team-only events',()=>{
 assert.deepEqual(eventMarkers(find('sanford-city-ruck')),[{label:'Rucking',icon:'ruck'}]);
 assert.deepEqual(eventMarkers(find('coast-to-coast-nz')).at(-1),{label:'Team option',icon:'people'});
 assert.deepEqual(eventMarkers(find('dolomitenmann')).at(-1),{label:'Team event',icon:'people'});
 assert.deepEqual(eventMarkers({eventType:'Unclear',variants:[{participation:'team'},{}]}).at(-1),{label:'Team option',icon:'people'});
 assert.equal(eventMarkers(find('spartan-death-race'))[0].icon,null);
 assert.equal(eventMarkers(find('wilderness-traverse')).at(-1).label,'Team event');
 for(const slug of ['sea-to-sea-florida','worlds-toughest-mudder']){assert.equal(eventMarkers(find(slug)).at(-1).label,'Team option');assert.equal(eventFacetMatch(find(slug).variants,{participation:'solo'}),true);assert.equal(eventFacetMatch(find(slug).variants,{participation:'team'}),true);}
 assert.equal(eventFacetMatch(find('wilderness-traverse').variants,{participation:'solo'}),false);
 assert.match(renderEventMarkers(find('sanford-city-ruck')), /data-icon="ruck"[^>]*aria-hidden="true"/);
 assert.match(renderCollection(events),/class="event-markers"/);
});
test('each existing article has a real event, assessment or field-report connection',()=>{
 const articles=collections['/resources/articles/'];assert.equal(articles.length,48);
 const targets=new Set([...Object.keys(entries),...assessments.map(a=>'/testing-library/'+a.id+'/')]);
 for(const a of articles){assert.ok(a.related?.length,a.slug);for(const r of a.related){assert.ok(targets.has(r.path),r.path);assert.ok(r.context);assert.ok(r.label);assert.ok(renderEntry(a).includes('href="'+r.path+'"'));}}
 for(const a of articles.filter(x=>x.worksheet)){assert.ok(existsSync(new URL('../public'+a.worksheet.path,import.meta.url)));assert.ok(renderEntry(a).includes('href="'+a.worksheet.path+'" download'));}
 assert.equal(events.length,37);assert.equal(collections['/training/workouts/'].length,50);
});
