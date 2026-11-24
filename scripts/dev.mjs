import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
const port=Number(process.env.PORT||4173);
createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
  const url=new URL(req.url,'http://localhost');
  const decoded=decodeURIComponent(url.pathname);
  let file=resolve(dir,'.'+decoded);
  if(!file.startsWith(dir+sep)&&file!==dir){res.writeHead(403);return res.end();}
  let info=await stat(file).catch(()=>null);
  if(info?.isDirectory()){file=resolve(file,'index.html');info=await stat(file).catch(()=>null);}
  if(!info?.isFile()){res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});return res.end('Page not found');}
  const data=await readFile(file);
  res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','cache-control':'no-store','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});
  res.end(req.method==='HEAD'?undefined:data);
 }catch(e){res.writeHead(500);res.end('Server error');}
}).listen(port,'127.0.0.1',()=>console.log(`Rucking Revolution: http://127.0.0.1:${port}`));
