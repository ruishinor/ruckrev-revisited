import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sections, footerColumns } from '../src/data/content.mjs';
import {challengeRoutes} from '../src/data/challenges.mjs';
const customFooterRoutes=[...challengeRoutes,'/my-training/'];
import { assessments } from '../src/data/assessments.mjs';
const root=resolve(import.meta.dirname,'..');
function fakeDocument(){
 const app={innerHTML:''};
 const passive={addEventListener(){},setAttribute(){},getAttribute(){return 'false';},focus(){},value:''};
 return {app,doc:{title:'',body:{append(){}},querySelector(s){if(s==='#app')return app;if(s==='h1')return {textContent:'Test page'};if(['.mobile-toggle','#library-search','#test-search','#main'].includes(s))return passive;return null;}}};
}
let renderCount=0;
async function renderRoute(path){const {app,doc}=fakeDocument();globalThis.document=doc;globalThis.location={pathname:path,search:'',hash:''};await import(`../src/app.mjs?expansion=${encodeURIComponent(path)}-${++renderCount}`);return app.innerHTML;}
test('all resource pages render useful local content',async()=>{
 assert.ok(Object.keys(sections).length>=10);
 for(const [path,data] of Object.entries(sections)){
  assert.ok(data.title&&data.lead&&data.blocks?.length>=2);
  const html=await renderRoute(path);
  assert.match(html,/<h1>/);
  assert.match(html,/article-section/);
  assert.doesNotMatch(html,/github\.com\/ruishinor\//i);
  assert.doesNotMatch(html,/We couldn.t find that page/);
  const f=await stat(resolve(root,'dist',path.slice(1),'index.html')).catch(()=>null);
  // dist might not be built yet on a fresh checkout, so verify the source content here.
  if(f)assert.ok(f.size>100);
 }
});
test('footer includes navigation categories and only usable local or external routes',async()=>{
 const local=footerColumns.flatMap(c=>c.items.map(i=>i[1])).filter(x=>x.startsWith('/'));
 for(const href of local){assert.ok(['/','/about/','/training/','/testing-library/','/resources/'].includes(href)||Boolean(sections[href])||customFooterRoutes.includes(href),`Missing footer page ${href}`);}
 for(const href of local.filter(x=>customFooterRoutes.includes(x))){const rendered=await renderRoute(href);assert.match(rendered,/<h1>/);assert.doesNotMatch(rendered,/We couldn.t find that page/);}
 const html=await renderRoute('/');
});
test('the revised training page prompts action and includes a goal selector',async()=>{
 const html=await renderRoute('/training/');
 assert.match(html,/id="training-week"/);
});
test('references appear in details, comparison and bibliography',async()=>{
 const detail=await renderRoute('/testing-library/ntoa-pfq/');assert.match(detail,/apa-reference/);assert.match(detail,/NTOA/);
 const page=await renderRoute('/references/');assert.equal((page.match(/bibliography-item/g)||[]).length,assessments.length);
});
test('new images and icon set are bundled in public assets',async()=>{
 for(const item of ['mountain-atmosphere.webp','progress-ruck.webp','glyph-ruck.png','glyph-run.png','glyph-compare.png','glyph-globe.png','glyph-shield.png','glyph-filter.png','glyph-waves.png']){
  assert.ok((await stat(resolve(root,'public/assets',item))).size>500,item);
 }
 for(const code of ['us','no','au','dk'])assert.ok((await stat(resolve(root,'public/assets/flags',`${code}.svg`))).size>100);
});


test('public pages present the site directly and keep legal and publisher links',async()=>{
 for(const path of ['/','/training/','/resources/','/about/','/privacy/','/terms/',...Object.keys(sections)]){
  const html=await renderRoute(path);
  assert.doesNotMatch(html,/github\.com\/ruishinor\//i);
  const legal=html.match(/<nav aria-label="Legal and sources">(.*?)<\/nav>/s)?.[1];
  assert.deepEqual([...legal.matchAll(/href="([^"]+)"/g)].map(m=>m[1]),['/privacy/','/terms/','/references/']);
 }
});

test('interface glyphs use transparent red stencils and light CTA exceptions',async()=>{
 const css=await readFile(resolve(root,'public/site.css'),'utf8');
 const {icon}=await import('../src/lib/icons.mjs');
 assert.match(css,/--rr-brand-red:#8B0000/);
 assert.doesNotMatch(css,/--glyph-back|#B8C1C3/);
 assert.match(css,/\.home-hero h1 em\{color:#8B0000;background:transparent/);
 for(const name of ['ruck','barbell','article','calendar','arrow','run','compare','menu']){const glyph=icon(name);assert.match(glyph,/<svg class="icon"/);assert.match(glyph,/fill="none" stroke="currentColor"/);assert.doesNotMatch(glyph,/<img|background/);}
});
