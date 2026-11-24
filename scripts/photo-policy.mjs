import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

// Each count represents a distinct rendered editorial placement, not a repeated
// visit to that page. Brand logos, flags and functional interface glyphs are
// deliberately outside this photographic rule.
const heroRoutes={'home-page':'/','training-hub':'/training/','learn-hub':'/learn/','lead-hub':'/lead/'};
const filePattern=/\/assets\/([a-z0-9-]+\.webp)/g;
export function assertPlacements(uses){
 const grouped=new Map();
 for(const use of uses){const list=grouped.get(use.asset)||[];list.push(use);grouped.set(use.asset,list);}
 for(const [asset,list] of grouped){
  if(list.length>2)throw Error(`Photograph reused ${list.length} times: ${asset}`);
  if(list.length===2){
   if(list[0].subject!==list[1].subject||list[0].page===list[1].page||!['assessment-card|assessment-detail','destination-thumbnail|hero','article-detail|article-thumbnail'].includes(list.map(x=>x.slot).sort().join('|')))throw Error(`Unrelated or unapproved photo pairing: ${asset} ${JSON.stringify(list)}`);
  }
 }
 return grouped;
}
export function cssPhotoUses(css,assessments){
 const uses=[];
 css=css.replace(/\/\*[\s\S]*?\*\//g,'');
 if(/(?:-webkit-)?text-stroke\s*:/.test(css)||/(?:-webkit-)?text-stroke-width\s*:/.test(css))throw Error('Text outlines are prohibited');
 for(const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
  const selector=match[1].trim(),body=match[2];
  for(const item of body.matchAll(filePattern)){
   const asset=item[1],hero=selector.match(/^body:has\(main\.([a-z-]+)\)::before$/),assessment=selector.match(/^\.photo-([a-z0-9-]+)$/);
   if(hero&&heroRoutes[hero[1]]){const page=heroRoutes[hero[1]];uses.push({asset,page,subject:page,slot:'hero'});continue;}
   if(assessment){const a=assessments.find(a=>a.id===assessment[1]);if(!a||a.image!==asset)throw Error(`Assessment photo mapping mismatch: ${selector} ${asset}`);const prop=body.slice(0,item.index).match(/(--card-photo|--detail-image):[^;]*$/)?.[1];if(!prop)throw Error(`Untracked assessment photo property: ${selector}`);const subject=`/testing-library/${a.id}/`;uses.push({asset,subject,page:prop==='--card-photo'?'/testing-library/':subject,slot:prop==='--card-photo'?'assessment-card':'assessment-detail'});continue;}
   throw Error(`Unscoped photo placement: ${selector} ${asset}`);
  }
 }
 for(const a of assessments){const subject=`/testing-library/${a.id}/`;const found=uses.filter(x=>x.subject===subject);if(a.image&&found.length!==2||!a.image&&found.length)throw Error(`Invalid assessment photography: ${a.id}`);}
 return uses;
}
export function htmlPhotoUses(html,page){
 const uses=[];
 for(const m of html.matchAll(/<img\b[^>]*\bsrc="\/assets\/([a-z0-9-]+\.webp)"[^>]*>/g)){
  const asset=m[1],before=html.slice(0,m.index),start=before.lastIndexOf('<a '),end=before.lastIndexOf('</a>');
  let subject=page,slot='editorial-image';
  if(start>end){const anchor=before.slice(start,before.indexOf('>',start)+1);const href=anchor.match(/\bhref="(\/[^"?#]*)"/)?.[1];if(href){subject=href;slot=anchor.includes('editorial-photo')?'destination-thumbnail':href.startsWith('/resources/articles/')?'article-thumbnail':'destination-thumbnail';}}
  else if(m[0].includes('guide-entry-image'))slot='article-detail';
  uses.push({asset,page,subject,slot});
 }
 return uses;
}
export async function auditPhotoPlacements(root,routes,css,assessments){
 const uses=cssPhotoUses(css,assessments);
 for(const route of routes){const page=route?`/${route}/`:'/';uses.push(...htmlPhotoUses(await readFile(join(root,route,'index.html'),'utf8'),page));}
 const grouped=assertPlacements(uses),hashes=new Map();
 for(const name of await readdir(join(root,'assets'))){if(/\.(?:png|jpe?g|gif|avif)$/i.test(name)&&!/^glyph-[a-z-]+\.png$|^brand-mark\.png$/.test(name))throw Error(`Use tracked WebP for editorial photographs: ${name}`);if(!name.endsWith('.webp'))continue;const bytes=await readFile(join(root,'assets',name));const hash=createHash('sha256').update(bytes).digest('hex');if(hashes.has(hash))throw Error(`Duplicate photo files: ${name} / ${hashes.get(hash)}`);hashes.set(hash,name);if(!grouped.has(name))throw Error(`Unused photograph: ${name}`);}
 for(const name of grouped.keys())await readFile(join(root,'assets',name));
 console.log(`Photo placement policy passed: ${grouped.size} distinct images, ${uses.length} editorial placements, no more than two per image; all pairs share one destination or assessment.`);
 return grouped;
}
