// Deterministic byte-level manifest of the build tree; no paths outside dist.
import { readdir,readFile } from 'node:fs/promises';
import { resolve,join } from 'node:path';
import { createHash } from 'node:crypto';
const root=resolve(process.argv[2]||'dist');
const files=[];
async function walk(dir,prefix='') {
 for(const e of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
  const path=prefix+e.name,full=join(dir,e.name);
  if(e.isDirectory())await walk(full,path+'/');
  else if(e.isFile())files.push([path,createHash('sha256').update(await readFile(full)).digest('hex')]);
  else throw Error('Unexpected build entry: '+path);
 }
}
await walk(root);files.sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
console.log(JSON.stringify(files));
