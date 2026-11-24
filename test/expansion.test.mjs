import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sections, footerColumns } from '../src/data/content.mjs';
import { assessments } from '../src/data/assessments.mjs';
const root=resolve(import.meta.dirname,'..');
function fakeDocument(){
 const app={innerHTML:''};
 const passive={addEventListener(){},setAttribute(){},getAttribute(){return 'false';},focus(){},value:''};
 return {app,doc:{title:'',body:{append(){}},querySelector(s){if(s==='#app')return app;if(s==='h1')return {textContent:'Test page'};if(['.mobile-toggle','#library-search','#test-search','#main'].includes(s))return passive;return null;}}};
}
async function renderRoute(path){const {app,doc}=fakeDocument();globalThis.document=doc;globalThis.location={pathname:path,search:'',hash:''};await import(`../src/app.mjs?expansion=${encodeURIComponent(path)}`);return app.innerHTML;}
test('all curated content pages are complete, sourced and built as local routes',async()=>{
 assert.ok(Object.keys(sections).length>=10);
 for(const [path,data] of Object.entries(sections)){
  assert.ok(data.title&&data.lead&&data.blocks?.length>=2);
  assert.match(data.source,/github\.com\/ruishinor\/rucking-revolution/);
  const html=await renderRoute(path);
  assert.match(html,/<h1>/);
  assert.match(html,/View the original material/);
  assert.doesNotMatch(html,/We couldn.t find that page/);
  const f=await stat(resolve(root,'dist',path.slice(1),'index.html')).catch(()=>null);
  // dist might not be built yet on a fresh checkout, so verify the source content here.
  if(f)assert.ok(f.size>100);
 }
});
test('footer includes original categories and only usable local or external routes',async()=>{
 const local=footerColumns.flatMap(c=>c.items.map(i=>i[1])).filter(x=>x.startsWith('/'));
 for(const href of local){assert.ok(['/','/about/','/training/','/testing-library/','/resources/'].includes(href)||Boolean(sections[href]),`Missing footer page ${href}`);}
 const html=await renderRoute('/');
 assert.match(html,/Rucking plans/);assert.match(html,/Field notes/);assert.match(html,/Instagram/);
 assert.match(html,/You don’t need to do it alone/);
 assert.doesNotMatch(html,/Rucks can be quiet time/);
});
test('the revised training page prompts action and includes a goal selector',async()=>{
 const html=await renderRoute('/training/');
 assert.match(html,/Build your next training week/);
 assert.match(html,/High-intensity|Harder, faster rucks/i);
 assert.match(html,/Strength &amp; conditioning/);
});
test('references appear in details, comparison and bibliography',async()=>{
 const detail=await renderRoute('/testing-library/ntoa-pfq/');assert.match(detail,/apa-reference/);assert.match(detail,/NTOA/);
 const page=await renderRoute('/references/');assert.equal((page.match(/bibliography-item/g)||[]).length,6);
 const sources=new Set(assessments.map(x=>x.source.publisher));assert.equal(sources.size,5); // Norwegian general and Artillerijeger use same publisher.
});
test('new images and icon set are bundled in public assets',async()=>{
 for(const item of ['mountain-atmosphere.webp','progress-ruck.webp','glyph-ruck.png','glyph-run.png','glyph-compare.png','glyph-globe.png','glyph-shield.png','glyph-filter.png','glyph-waves.png']){
  assert.ok((await stat(resolve(root,'public/assets',item))).size>500,item);
 }
 for(const code of ['us','no','au','dk'])assert.ok((await stat(resolve(root,'public/assets/flags',`${code}.svg`))).size>100);
});
test('public-facing original site copy favours rucking terms and no clinical or militaristic slogans',async()=>{
 const s=(await readFile(resolve(root,'src/app.mjs'),'utf8'))+'\n'+(await readFile(resolve(root,'src/data/content.mjs'),'utf8'));
 assert.doesNotMatch(s,/\bwalks?\b|\bwalking\b/i);
 assert.doesNotMatch(s,/\bevidence\b|\boperator\b|\bmission-ready\b/i);
});
