import test from 'node:test';
import assert from 'node:assert/strict';
import {collections} from '../src/data/guides.mjs';

test('collection startup retains prerendered controls and applies early input',async()=>{
 const items=collections['/resources/events/'];
 const cards=items.map(x=>({dataset:{guide:x.title.toLowerCase(),eventCountry:x.eventCountry,eventType:x.eventType},hidden:false}));
 const control=value=>({value,listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}});
 const country=control('United Kingdom'),format=control('all'),search=control('');
 const count={textContent:'9 results'};
 const controls={'#guide-search':search,'#event-country':country,'#event-type':format,'#guide-count':count};
 let replacements=0;
 const app={querySelector(selector){return selector==='main#main'?{}:null;},set innerHTML(value){replacements++;country.value='all';}};
 const doc={title:'',querySelector(selector){return selector==='#app'?app:controls[selector]||null;},querySelectorAll(selector){assert.equal(selector,'[data-guide]');return cards;}};
 globalThis.document=doc;
 globalThis.location={pathname:'/resources/events/',search:'',hash:''};
 try{
  await import('../src/app.mjs?startup=early-country');
  assert.equal(replacements,0);
  assert.equal(country.value,'United Kingdom');
  assert.equal(count.textContent,'3 results');
  format.value='Distance challenge';format.listeners.change();
  assert.equal(count.textContent,'2 results');
  assert.deepEqual(cards.filter(x=>!x.hidden).map(x=>x.dataset.guide),['jurassic coast ultra challenge','london to brighton ultra challenge']);
 }finally{delete globalThis.document;delete globalThis.location;}
});
