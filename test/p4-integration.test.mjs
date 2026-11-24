import test from 'node:test';
import assert from 'node:assert/strict';
import {collections,entries} from '../src/data/guides.mjs';
import {sections} from '../src/data/content.mjs';
import {crewDrills} from '../src/data/crew-development.mjs';
import {selectDrills,drillText} from '../src/lib/crew-practice.mjs';
import {renderCollection,renderEntry} from '../src/lib/resource-pages.mjs';
import {p4Articles} from '../src/data/p4-editorial.mjs';
import {p4FieldNotes} from '../src/data/p4-field-notes.mjs';
test('P4 additions resolve through the existing catalogue and renderer',()=>{
 const articles=collections['/resources/articles/'];assert.equal(articles.length,54);assert.match(renderCollection(articles),/id="guide-topic"/);
 for(const a of p4Articles){const entry=entries['/resources/articles/'+a[0]+'/'];assert.ok(entry);assert.ok(entries[entry.related[0].path]);for(const r of entry.topicRelated)assert.ok(entries[r.path]);assert.match(renderEntry(entry),/More on /);}
 const notes=collections['/resources/field-notes/'];assert.equal(notes.length,16);assert.equal(notes.filter(n=>n.report).length,3);assert.equal(notes.filter(n=>!n.report&&!n.noteType).length,8);
 for(const n of p4FieldNotes){assert.ok(entries[n.path]);assert.ok(entries[n.fieldEvent.path]);assert.match(renderEntry(n),/Related event/);assert.ok(renderCollection(notes).includes(`data-note-kind="${n.noteType}"`));}
 assert.ok(sections['/resources/crew-directory/']);assert.ok(sections['/resources/contribute/']);
});
test('all 24 original and additional exercises export complete information',()=>{
 assert.equal(crewDrills.length,24);for(const d of crewDrills)for(const k of ['purpose','preparation','task','constraints','review'])assert.ok(d[k],d.id+' '+k);
 for(const category of ['Inclusion','Service']){const selected=selectDrills({category,level:'Applied',count:3},()=>0);assert.equal(selected.length,2);const plan=drillText(selected);for(const label of ['Purpose:','Preparation:','Practice:','Constraints:','Review:'])assert.match(plan,new RegExp(label));}
});
