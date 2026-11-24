import {photoScenes,challengePhoto} from '../src/data/challenge-photography.mjs';
import {challengeCard} from '../src/data/challenge-card.mjs';
import {communityPost} from '../src/data/community-posts.mjs';
import { cp, mkdir, rm, readFile, writeFile, stat } from 'node:fs/promises';
import { sections } from '../src/data/content.mjs';
import { entries } from '../src/data/guides.mjs';
import { assessments } from '../src/data/assessments.mjs';
import {challenges,challengeRoutes,completionSheet} from '../src/data/challenges.mjs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dist=join(root,'dist');
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
for(const p of ['src','public'])await cp(join(root,p),p==='public'?dist:join(dist,p),{recursive:true});
const baseRoutes=['','training','resources','about','testing-library','testing-library/compare',...assessments.map(a=>'testing-library/'+a.id)];
const extraRoutes=[...Object.keys(sections).map(x=>x.slice(1,-1)),...Object.keys(entries).map(x=>x.slice(1,-1)),'references','privacy','terms','learn','lead','learn/first-three-rucks','my-training',...challengeRoutes.map(x=>x.slice(1,-1))];
let i=0;
for(const p of [...baseRoutes,...extraRoutes]){
 const dest=join(dist,p);await mkdir(dest,{recursive:true});
 let html=await readFile(join(root,baseRoutes.includes(p)?p:'','index.html'),'utf8');
 const app={innerHTML:''},passive={addEventListener(){},setAttribute(){},getAttribute(){return 'false';},focus(){},value:''};
 globalThis.document={title:'',body:{append(){}},querySelector(s){if(s==='#app')return app;if(s==='h1')return null;if(['.mobile-toggle','#library-search','#test-search','#main'].includes(s))return passive;return null;}};
 globalThis.location={pathname:p?'/'+p+'/':'/',search:'',hash:''};
 await import(`../src/app.mjs?build=${++i}`);
 if(!app.innerHTML.includes('<main'))throw Error('Missing static markup: '+p);
 const h1=app.innerHTML.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]?.replace(/<br\s*\/?\s*>/g,' ').replace(/<[^>]+>/g,'')||'Rucking Revolution';
 html=html.replace('<title>Rucking Revolution</title>',`<title>${p?h1+' | Rucking Revolution':'Rucking Revolution'}</title>`).replace('<div id="app"></div>',`<div id="app">${app.innerHTML}</div>`);
 await writeFile(join(dest,'index.html'),html);
}
await mkdir(join(dist,'challenge-records'),{recursive:true});
for(const c of challenges)await writeFile(join(dist,'challenge-records',c.id+'.txt'),completionSheet(c),'utf8');
await mkdir(join(dist,'challenge-posts'),{recursive:true});
const logoBase64=(await readFile(join(root,'public/assets/brand-mark.png'))).toString('base64');
for(const c of challenges){await writeFile(join(dist,'challenge-posts',c.id+'.txt'),communityPost(c),'utf8');await writeFile(join(dist,'challenge-posts',c.id+'.svg'),challengeCard(c,logoBase64),'utf8');}
for(const c of challenges){if(!Object.hasOwn(photoScenes,c.id))continue;const photo=(await readFile(join(root,'artwork/challenges',c.id+'.jpg'))).toString('base64');await writeFile(join(dist,'challenge-posts',c.id+'-photo.svg'),challengePhoto(c,logoBase64,photo),'utf8');}
const files=['index.html','site.css','src/app.mjs','src/data/assessments.mjs','src/lib/catalog.mjs','src/lib/icons.mjs','src/data/content.mjs','src/data/guides.mjs','src/lib/resource-pages.mjs'];
for(const p of files){const s=await stat(join(dist,p));if(!s.size)throw Error(`Empty build file: ${p}`);}
console.log(`Built dist/ with ${baseRoutes.length+extraRoutes.length} static routes and locally bundled visual assets.`);
