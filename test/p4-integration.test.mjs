import test from 'node:test';
import assert from 'node:assert/strict';
import {collections,entries} from '../src/data/guides.mjs';
import {sections} from '../src/data/content.mjs';
import {crewDrills} from '../src/data/crew-development.mjs';
import {selectDrills,drillText} from '../src/lib/crew-practice.mjs';
import {renderCollection,renderEntry} from '../src/lib/resource-pages.mjs';
import {p4Articles} from '../src/data/p4-editorial.mjs';
import {retiredFieldNotes} from '../src/data/p4-field-notes.mjs';
test('P4 additions resolve through the existing catalogue and renderer',()=>{
 const articles=collections['/resources/articles/'];assert.match(renderCollection(articles),/id="guide-topic"/);
 for(const a of p4Articles){const entry=entries['/resources/articles/'+a[0]+'/'];assert.ok(entry);assert.ok(entries[entry.related[0].path]);for(const r of entry.topicRelated)assert.ok(entries[r.path]);assert.match(renderEntry(entry),/More on /);}
 const notes=collections['/resources/field-notes/'];assert.equal(notes.filter(n=>n.report).length,3);
 for(const n of retiredFieldNotes){assert.equal(entries[n.path],undefined);assert.ok(entries[n.event]);assert.ok(renderEntry(entries[n.event]).includes(n.url));assert.ok(!renderCollection(notes).includes(n.path));}
 assert.ok(sections['/resources/crew-directory/']);assert.ok(sections['/resources/contribute/']);
});
test('all crew exercises export complete information',()=>{
 for(const d of crewDrills)for(const k of ['purpose','preparation','task','constraints','review'])assert.ok(d[k],d.id+' '+k);
 for(const category of ['Inclusion','Service']){const selected=selectDrills({category,level:'Applied',count:3},()=>0);assert.equal(selected.length,2);const plan=drillText(selected);for(const label of ['Purpose:','Preparation:','Practice:','Constraints:','Review:'])assert.match(plan,new RegExp(label));}
});
