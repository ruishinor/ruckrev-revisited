import { readFile, stat } from 'node:fs/promises';
import { sections } from '../src/data/content.mjs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const app=await readFile(join(root,'src/app.mjs'),'utf8');
const css=await readFile(join(root,'site.css'),'utf8');
if(!app.includes('const isCompare')||!css.includes('.test-card'))throw Error('Core library files missing');
for(const path of ['','testing-library/','testing-library/compare/','testing-library/artillerijaeger/','training/','resources/','about/','references/','privacy/','terms/','credits/',...Object.keys(sections).map(s=>s.slice(1))]){
 const f=join(root,path,'index.html');const html=await readFile(f,'utf8');
 if(!html.includes('src/app.mjs')||!html.includes('site.css'))throw Error(`HTML imports missing: ${path}`);
}
for(const item of ['mountain-atmosphere.webp','rasp.webp','pfq.webp','artillerijaeger.webp','norway.webp','nsw-police.webp','danish-police.webp','icon.svg'])if(!(await stat(join(root,'assets',item))).size)throw Error(`Missing: ${item}`);
for(const item of ['progress-ruck.webp','glyph-ruck.png','glyph-run.png','glyph-compare.png','glyph-layers.png','glyph-filter.png'])if(!(await stat(join(root,'assets',item))).size)throw Error(`Missing generated asset: ${item}`);
for(const flag of ['us','no','dk','au'])if(!(await stat(join(root,'assets','flags',flag+'.svg'))).size)throw Error(`Missing flag: ${flag}`);
console.log('Static route and asset checks passed.');
