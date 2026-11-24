import test from 'node:test';
import assert from 'node:assert/strict';

function control(properties={}){return {listeners:{},addEventListener(type,fn){this.listeners[type]=fn;},getAttribute(){return null;},...properties};}

test('early search, country and comparison choice survive library startup; clearing is immediate',async()=>{
 const search=control({value:'beep',defaultValue:'',matches(){return true;},focus(){}});
 const country=control({value:'Australia',dataset:{filter:'country'},options:[{value:'all',defaultSelected:false},{value:'Australia',defaultSelected:false}]});
 const check=control({checked:true,defaultChecked:false,dataset:{select:'rasp'}});
 const main=control(),form=control(),row={innerHTML:''},tray={innerHTML:''};
 let results='',replaced=0,updates=[];
 const app={querySelector(s){return ['main#main','main.library-page'].includes(s)?main:null;},set innerHTML(v){replaced++;}};
 const selectors={'#app':app,'#main':main,'#test-search':search,'#library-search':form,'.category-row':row,'#tray-root':tray,'.results':{replaceWith(el){results=el.innerHTML;}},'[data-filter="country"]':country};
 globalThis.document={title:'',activeElement:search,querySelector(s){return selectors[s]||null;},querySelectorAll(s){return s==='select[data-filter]'?[country]:s==='input[data-select]'?[check]:[];},createElement(){return {set innerHTML(v){this.firstElementChild={innerHTML:v};}};}};
 globalThis.location={pathname:'/testing-library/',search:'?sort=name',hash:'#library-search'};
 globalThis.history={state:null,replaceState(a,b,url){updates.push(url);}};
 try{
  await import('../src/app.mjs?interaction=early-library');
  assert.equal(replaced,0);
  assert.equal(search.value,'beep');assert.equal(country.value,'Australia');
  assert.equal((results.match(/class="test-card"/g)||[]).length,1);assert.match(results,/NSW Police PCT/);
  assert.match(tray.innerHTML,/1 test selected/);assert.match(tray.innerHTML,/RASP/);
  assert.match(updates.at(-1),/q=beep/);assert.match(updates.at(-1),/sort=name/);assert.match(updates.at(-1),/#library-search$/);
  search.value='nonexistent';search.listeners.input({target:search});assert.match(results,/No matches this time/);
  main.listeners.click({target:{closest(s){return s==='#clear-filters,#empty-clear'?{}:null;}}});
  assert.equal(search.value,'');assert.equal(country.value,'all');assert.equal((results.match(/class="test-card"/g)||[]).length,26);
  assert.match(tray.innerHTML,/1 test selected/);
  await new Promise(resolve=>setTimeout(resolve,220));
  assert.equal((results.match(/class="test-card"/g)||[]).length,26);
 }finally{delete globalThis.document;delete globalThis.location;delete globalThis.history;}
});

test('comparison link copy reports async success and failure without relying on event.currentTarget',async()=>{
 const copy=control(),status={textContent:''},app={innerHTML:''};
 globalThis.document={title:'',querySelector(s){return {'#app':app,'#copy-compare':copy,'#copy-compare-status':status}[s]||null;}};
 globalThis.location={pathname:'/testing-library/compare/',search:'?ids=rasp,ntoa-pfq',hash:'',href:'https://example.test/testing-library/compare/?ids=rasp,ntoa-pfq'};
 const original=Object.getOwnPropertyDescriptor(globalThis,'navigator');let copied='';
 const clipboard={async writeText(s){await Promise.resolve();copied=s;}};
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard}});
 try{
  await import('../src/app.mjs?interaction=copy');
  assert.match(app.innerHTML,/id="copy-compare-status" role="status"/);
  await copy.listeners.click({currentTarget:null});assert.equal(copied,location.href);assert.equal(status.textContent,'Link copied');
  clipboard.writeText=async()=>{throw Error('denied');};
  await copy.listeners.click({currentTarget:null});assert.equal(status.textContent,'Copy the address from your browser.');
 }finally{delete globalThis.document;delete globalThis.location;if(original)Object.defineProperty(globalThis,'navigator',original);else delete globalThis.navigator;}
});
