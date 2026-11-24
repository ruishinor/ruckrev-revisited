import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {securityHeaders} from './security-headers.mjs';
const responseHeaders={...securityHeaders,'cache-control':'no-store'};
const dir=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const mime={'.txt':'text/plain; charset=utf-8','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
const port=Number(process.env.PORT||4173);
createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,responseHeaders);return res.end();}
  const url=new URL(req.url,'http://localhost');
  const decoded=decodeURIComponent(url.pathname);
  let file=resolve(dir,'.'+decoded);
  if(!file.startsWith(dir+sep)&&file!==dir){res.writeHead(403,responseHeaders);return res.end();}
  let info=await stat(file).catch(()=>null);
  if(info?.isDirectory()){file=resolve(file,'index.html');info=await stat(file).catch(()=>null);}
  if(!info?.isFile()){res.writeHead(404,{...responseHeaders,'content-type':'text/plain; charset=utf-8'});return res.end('Page not found');}
  const data=await readFile(file);
  res.writeHead(200,{...responseHeaders,'content-type':mime[extname(file)]||'application/octet-stream'});
  res.end(req.method==='HEAD'?undefined:data);
 }catch(e){res.writeHead(500,responseHeaders);res.end('Server error');}
}).listen(port,'127.0.0.1',()=>console.log(`Rucking Revolution: http://127.0.0.1:${port}`));
