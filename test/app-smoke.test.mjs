import test from 'node:test';
import assert from 'node:assert/strict';
function makeDocument(){
 const app={innerHTML:''};
 const passive={addEventListener(){},setAttribute(){},getAttribute(){return 'false';},focus(){},value:''};
 const doc={title:'',body:{append(){}},querySelector(selector){if(selector==='#app')return app;if(selector==='h1')return {textContent:'Testing Library'};if(['.mobile-toggle','#library-search','#test-search','#main'].includes(selector))return passive;return null;}};
 return {app,doc};
}
test('test library builds eight cards with filter controls and an empty comparison',async()=>{
 const {app,doc}=makeDocument();globalThis.document=doc;
 globalThis.location={pathname:'/testing-library/',search:'',hash:''};
 await import('../src/app.mjs?bootstrap=library');
 assert.equal((app.innerHTML.match(/class="test-card"/g)||[]).length,8);
 assert.match(app.innerHTML,/Search tests, countries or activities/);
 assert.match(app.innerHTML,/0 tests selected/);
 assert.doesNotMatch(app.innerHTML,/data-select="[^"]+" checked/);
 assert.match(app.innerHTML,/href="\/testing-library\/artillerijaeger\/"/);
 assert.match(app.innerHTML,/aria-pressed="true"/);
 assert.doesNotMatch(app.innerHTML,/style="/);
});
test('compare page builds three columns with publisher links',async()=>{
 const {app,doc}=makeDocument();globalThis.document=doc;
 globalThis.location={pathname:'/testing-library/compare/',search:'?ids=ntoa-pfq,rasp,artillerijaeger',hash:''};
 await import('../src/app.mjs?bootstrap=compare');
 assert.match(app.innerHTML,/Compare fitness tests/);
 assert.match(app.innerHTML,/ntoa\.org\/pfq/);
 assert.match(app.innerHTML,/forsvaret\.no\/utdanning/);
 assert.equal((app.innerHTML.match(/<th scope="col">/g)||[]).length,4);
});
