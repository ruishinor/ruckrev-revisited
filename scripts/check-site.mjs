import {communityPost} from '../src/data/community-posts.mjs';
import { readFile, stat } from 'node:fs/promises';
import { sections } from '../src/data/content.mjs';
import { entries } from '../src/data/guides.mjs';
import { assessments } from '../src/data/assessments.mjs';
import {challenges,challengeRoutes,completionSheet} from '../src/data/challenges.mjs';
import { auditPhotoPlacements } from './photo-policy.mjs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const app=await readFile(join(root,'src/app.mjs'),'utf8');
const css=await readFile(join(root,'site.css'),'utf8');
if(!app.includes('const isCompare')||!css.includes('.test-card'))throw Error('Core library files missing');
for(const path of ['','testing-library/','testing-library/compare/',...assessments.map(a=>'testing-library/'+a.id+'/'),'training/','resources/','about/','references/','privacy/','terms/','learn/','lead/','learn/first-three-rucks/','my-training/',...Object.keys(sections).map(s=>s.slice(1)),...Object.keys(entries).map(s=>s.slice(1)),...challengeRoutes.map(s=>s.slice(1))]){
 const f=join(root,path,'index.html');const html=await readFile(f,'utf8');
 if(!/<html\b[^>]*\blang="en"/.test(html))throw Error(`English document language missing: ${path}`);
 if(!/<meta name="referrer" content="no-referrer"\s*\/?\s*>/.test(html))throw Error(`Referrer policy differs from HTTP policy: ${path}`);
 for(const img of html.matchAll(/<img\b[^>]*>/g))if(!/\balt="[^"]*"/.test(img[0]))throw Error(`Image alternative text missing: ${path}`);
 if(/Fysiske tester i Forsvaret|Fysisk prøve til politiuddannelsen/.test(html))throw Error(`Untranslated assessment label: ${path}`);
 if(!html.includes('src/app.mjs')||!html.includes('site.css')||!html.includes('<main')||!html.includes('<h1'))throw Error(`HTML imports missing: ${path}`);
}
for(const item of ['mountain-atmosphere.webp','rasp.webp','artillerijaeger.webp','norway.webp','aft-running.webp','icon.svg'])if(!(await stat(join(root,'assets',item))).size)throw Error(`Missing: ${item}`);
for(const item of ['progress-ruck.webp','glyph-ruck.png','glyph-run.png','glyph-compare.png','glyph-layers.png','glyph-filter.png'])if(!(await stat(join(root,'assets',item))).size)throw Error(`Missing generated asset: ${item}`);
for(const flag of ['us','no','dk','au','gb','nl','se'])if(!(await stat(join(root,'assets','flags',flag+'.svg'))).size)throw Error(`Missing flag: ${flag}`);
for(const p of ['favicon.svg','favicon.png','favicon.ico','apple-touch-icon.png','assets/brand-mark.png','assets/brand-mark.svg'])if(!(await stat(join(root,p))).size)throw Error(`Missing RR hex brand asset: ${p}`);
console.log('Static route and asset checks passed.');
// Check every exported page's root-relative links, module imports and local images.
const routes=['','training','resources','about','testing-library','testing-library/compare',...assessments.map(a=>'testing-library/'+a.id),...Object.keys(sections).map(x=>x.slice(1,-1)),...Object.keys(entries).map(x=>x.slice(1,-1)),'references','privacy','terms','learn','lead','learn/first-three-rucks','my-training',...challengeRoutes.map(x=>x.slice(1,-1))];
let urls=0;
for(const route of routes){
 const html=await readFile(join(root,route,'index.html'),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)throw Error(`Duplicate element ID on ${route||'/'}`);
 for(const match of html.matchAll(/\b(?:href|src)="(\/(?!\/)[^"#?]*)(?:[?#][^"]*)?"/g)){
  const path=decodeURIComponent(match[1]);let target=join(root,path);
  let item=await stat(target).catch(()=>null);
  if(item?.isDirectory()){target=join(target,'index.html');item=await stat(target).catch(()=>null);}
  if(!item?.isFile())throw Error(`Missing local target ${path} on ${route||'/'}`);
  urls++;
 }
}
console.log(`Verified ${urls} local URL occurrences across ${routes.length} routes.`);

for(const c of challenges){const record=await readFile(join(root,'challenge-records',c.id+'.txt'),'utf8');if(record!==completionSheet(c))throw Error('Incorrect completion record '+c.id);}
for(const c of challenges){const post=await readFile(join(root,'challenge-posts',c.id+'.txt'),'utf8');if(post!==communityPost(c))throw Error('Incorrect community post '+c.id);}
await auditPhotoPlacements(root,routes,css,assessments);
