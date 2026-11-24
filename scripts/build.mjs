import { cp, mkdir, rm, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dist=join(root,'dist');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for(const p of ['src','public'])await cp(join(root,p),p==='public'?dist:join(dist,p),{recursive:true});
for(const p of ['','training','resources','about','testing-library','testing-library/compare','testing-library/ntoa-pfq','testing-library/rasp','testing-library/norwegian-armed-forces','testing-library/artillerijaeger','testing-library/nsw-pct','testing-library/danish-police']){
 const dest=join(dist,p);await mkdir(dest,{recursive:true});await cp(join(root,p,'index.html'),join(dest,'index.html'));
}
const files=['index.html','site.css','src/app.mjs','src/data/assessments.mjs','src/lib/catalog.mjs','src/lib/icons.mjs'];
for(const p of files){const s=await stat(join(dist,p));if(!s.size)throw Error(`Empty build file: ${p}`);}
console.log('Built dist/ with 12 routes and 7 bundled images.');
