import { cp, mkdir, rm, readFile, writeFile, stat } from 'node:fs/promises';
import { sections } from '../src/data/content.mjs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dist=join(root,'dist');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for(const p of ['src','public'])await cp(join(root,p),p==='public'?dist:join(dist,p),{recursive:true});
const baseRoutes=['','training','resources','about','testing-library','testing-library/compare','testing-library/ntoa-pfq','testing-library/rasp','testing-library/norwegian-armed-forces','testing-library/artillerijaeger','testing-library/nsw-pct','testing-library/danish-police'];
const extraRoutes=[...Object.keys(sections).map(x=>x.slice(1,-1)),'references','privacy','terms'];
for(const p of [...baseRoutes,...extraRoutes]){
 const dest=join(dist,p);await mkdir(dest,{recursive:true});await cp(join(root,baseRoutes.includes(p)?p:'','index.html'),join(dest,'index.html'));
}
const files=['index.html','site.css','src/app.mjs','src/data/assessments.mjs','src/lib/catalog.mjs','src/lib/icons.mjs','src/data/content.mjs'];
for(const p of files){const s=await stat(join(dist,p));if(!s.size)throw Error(`Empty build file: ${p}`);}
console.log(`Built dist/ with ${baseRoutes.length+extraRoutes.length} routes and locally bundled visual assets.`);
