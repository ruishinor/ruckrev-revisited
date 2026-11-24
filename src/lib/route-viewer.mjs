// Local GPX inspection only. No network, geolocation, persistence or generated route geometry.
import {renderPanControls,bindTrackNavigation} from './route-navigation.mjs';
export const MAX_GPX_BYTES=5*1024*1024, MAX_POINTS=50000;
const rad=x=>x*Math.PI/180;
const finite=x=>typeof x==='number'&&Number.isFinite(x);
export function distanceM(a,b){const dlat=rad(b.lat-a.lat),dlon=rad(b.lon-a.lon);const h=Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlon/2)**2;return 6371008.8*2*Math.asin(Math.sqrt(Math.min(1,Math.max(0,h))));}
export function analyseSegments(segments){
 let count=0,distance=0,ascent=0,descent=0,completeElevation=true;
 if(!Array.isArray(segments)||!segments.length)throw Error('No route or track found.');
 const series=segments.map(segment=>{
  if(!Array.isArray(segment)||!segment.length)throw Error('Empty track segment.');
  let prev;return segment.map(p=>{
   if(++count>MAX_POINTS)throw Error('Too many points. Choose a smaller GPX file.');
   if(!finite(p.lat)||!finite(p.lon)||Math.abs(p.lat)>90||Math.abs(p.lon)>180)throw Error('Invalid latitude or longitude.');
   if(!finite(p.ele))completeElevation=false;
   if(prev){distance+=distanceM(prev,p);if(finite(prev.ele)&&finite(p.ele)){const delta=p.ele-prev.ele;ascent+=Math.max(0,delta);descent+=Math.max(0,-delta);}}
   prev=p;return {lat:p.lat,lon:p.lon,ele:finite(p.ele)?p.ele:null,distance};
  });
 });
 if(!series.some(s=>s.length>1))throw Error('A route needs at least two connected points.');
 if(distance<=0)throw Error('The route has no measurable distance.');
 return {series,count,distance,ascent:completeElevation?ascent:null,descent:completeElevation?descent:null,completeElevation};
}
const children=(el,name)=>Array.from(el.children).filter(x=>x.localName===name&&x.namespaceURI===el.namespaceURI);
export function parseGpx(text,Parser=globalThis.DOMParser){
 if(typeof text!=='string'||text.length>MAX_GPX_BYTES||/<!\s*(DOCTYPE|ENTITY)\b/i.test(text))throw Error('Unsupported or oversized GPX file.');
 const xml=new Parser().parseFromString(text,'application/xml'),root=xml.documentElement;
 if(root.localName!=='gpx'||xml.getElementsByTagName('parsererror').length||!['http://www.topografix.com/GPX/1/1','http://www.topografix.com/GPX/1/0',null].includes(root.namespaceURI))throw Error('Invalid GPX document.');
 const read=(node)=>{const val=(s)=>s!=null&&s.trim()!==''?Number(s):NaN;const ele=children(node,'ele')[0]?.textContent;return {lat:val(node.getAttribute('lat')),lon:val(node.getAttribute('lon')),ele:val(ele)};};
 const tracks=children(root,'trk').flatMap(t=>children(t,'trkseg')).map(s=>children(s,'trkpt')).filter(s=>s.length);
 const routes=children(root,'rte').map(r=>children(r,'rtept')).filter(s=>s.length);
 // Prefer recorded tracks when both are present; do not double-count planned and recorded paths.
 const segments=tracks.length?tracks:routes;
 if(segments.reduce((n,s)=>n+s.length,0)>MAX_POINTS)throw Error('Too many points. Choose a smaller GPX file.');
 return analyseSegments(segments.map(s=>s.map(read)));
}
export function projectRoute(series){
 const first=series[0][0],cos=Math.max(.001,Math.cos(rad(first.lat)));
 let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
 const raw=series.map(s=>s.map(p=>{const x=((((p.lon-first.lon)+540)%360)-180)*cos,y=first.lat-p.lat;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);return {x,y};}));
 const scale=Math.min(560/Math.max(maxX-minX,1e-9),280/Math.max(maxY-minY,1e-9));
 return raw.map(s=>s.map(p=>[320+(p.x-(minX+maxX)/2)*scale,180+(p.y-(minY+maxY)/2)*scale]));
}
const svgNs='http://www.w3.org/2000/svg';
function shape(svg,tag,attrs){const e=document.createElementNS(svgNs,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));svg.append(e);return e;}
const coords=points=>points.map(p=>p.map(n=>n.toFixed(2)).join(',')).join(' ');
export function renderRouteViewer(){return `<section class="content-panel route-viewer" aria-labelledby="gpx-heading"><h2 id="gpx-heading">Inspect a GPX route</h2><p>Open a GPX track from your route provider or GPS device to see its shape, estimated distance and elevation. Your file stays in this browser session. No map service is contacted.</p><p class="guide-meta">The preview shows the supplied track, not a street map or turn-by-turn directions. Use the published map and current trail conditions for navigation. GPX files can contain private locations.</p><label for="gpx-file">GPX file (up to 5 MB)</label><input type="file" id="gpx-file" accept=".gpx,application/gpx+xml,application/xml,text/xml"><div class="gpx-controls"><button type="button" class="button button-secondary" id="gpx-zoom-in" disabled>Zoom in</button><button type="button" class="button button-secondary" id="gpx-zoom-out" disabled>Zoom out</button><button type="button" class="button button-secondary" id="gpx-reset" disabled>Fit route</button><button type="button" class="button button-secondary" id="gpx-clear" disabled>Clear file</button></div>${renderPanControls()}<p id="gpx-status" role="status" aria-live="polite">Choose a GPX file to begin.</p><div id="gpx-results" hidden><svg class="gpx-map" id="gpx-map" viewBox="0 0 640 360" role="img" aria-label="North-up preview of the supplied route, without a base map"></svg><p class="guide-meta">Circle: start. Square: finish. North is up. Separate track segments are not joined. Zoom and pan with the buttons, or drag with a mouse after zooming.</p><h3>Elevation profile</h3><p id="gpx-elevation-note"></p><svg class="gpx-profile" id="gpx-profile" viewBox="0 0 640 200" role="img" aria-label="Elevation by distance from the supplied GPX file" hidden></svg></div><noscript><p>Enable JavaScript to inspect a file locally.</p></noscript></section>`;}
export function bindRouteViewer(){
 const $=s=>document.querySelector(s),input=$('#gpx-file');if(!input)return;
 const map=$('#gpx-map'),profile=$('#gpx-profile'),results=$('#gpx-results'),status=$('#gpx-status'),note=$('#gpx-elevation-note'),ids=['gpx-zoom-in','gpx-zoom-out','gpx-reset','gpx-clear'];let request=0;const navigation=bindTrackNavigation(map,$);
 const controls=enabled=>ids.forEach(id=>$('#'+id).disabled=!enabled);
 function clear(message){map.replaceChildren();profile.replaceChildren();profile.hidden=true;results.hidden=true;controls(false);navigation.setAvailable(false);status.textContent=message;note.textContent='';}
 function render(data){const points=projectRoute(data.series);for(const line of points)shape(map,'polyline',{points:coords(line),class:'gpx-track'});const start=points[0][0],end=points.at(-1).at(-1);shape(map,'circle',{cx:start[0],cy:start[1],r:6,class:'gpx-start'});shape(map,'rect',{x:end[0]-4,y:end[1]-4,width:8,height:8,class:'gpx-finish'});
  status.textContent=`${(data.distance/1000).toFixed(2)} km · ${data.count.toLocaleString('en')} points · ${data.series.length} segment${data.series.length===1?'':'s'}`;
  if(data.completeElevation){let low=Infinity,high=-Infinity;for(const segment of data.series)for(const p of segment){low=Math.min(low,p.ele);high=Math.max(high,p.ele);}for(const s of data.series)shape(profile,'polyline',{points:coords(s.map(p=>[30+p.distance/data.distance*580,170-(p.ele-low)/Math.max(1,high-low)*140])),class:'gpx-track'});note.textContent=`Estimated ascent ${Math.round(data.ascent)} m · descent ${Math.round(data.descent)} m · elevation range ${Math.round(low)}–${Math.round(high)} m. Raw GPS elevation can be noisy.`;profile.hidden=false;}else{note.textContent='Elevation is missing from some or all points. No ascent, descent or profile is estimated.';profile.hidden=true;}
  results.hidden=false;controls(true);navigation.setAvailable(true);
 }
 async function loadFile(){const token=++request,file=input.files?.[0];clear('Choose a GPX file to begin.');if(!file)return;try{if(file.size>MAX_GPX_BYTES)throw Error('File exceeds 5 MB.');status.textContent='Reading your file locally…';const raw=await file.text();if(token!==request)return;render(parseGpx(raw));}catch(e){if(token!==request)return;clear(e instanceof Error?e.message:'Could not read GPX file.');input.value='';}}
 input.addEventListener('change',loadFile);
 $('#gpx-zoom-in').addEventListener('click',()=>navigation.zoom(1.5));$('#gpx-zoom-out').addEventListener('click',()=>navigation.zoom(1/1.5));$('#gpx-reset').addEventListener('click',()=>navigation.reset());$('#gpx-clear').addEventListener('click',()=>{request++;input.value='';clear('File cleared. Choose a GPX file to begin.');input.focus();});
 // A GPX chosen before module startup is retained by the prerendered page.
 if(input.files?.length)void loadFile();
}

const worksheets=[['crew-start-checklist','Start a crew','A launch checklist and four-week review.'],['route-brief','Route brief','Meeting point, route, load options and alternatives.'],['event-preparation','Event preparation','Work backwards from organiser requirements.'],['after-action-review','After-action review','Record the outcome and assign one improvement.'],['assessment-rehearsal','Assessment rehearsal','Record the official protocol, valid results and next preparation focus.']];
export function renderDownloadPack(){return `<section class="content-panel tool-panel"><h2>Downloadable field worksheets</h2><p>Save or print these plain-text worksheets. They work offline, are editable in any text editor and do not require an account.</p><ul class="detail-list">${worksheets.map(([slug,title,description])=>`<li><a href="/downloads/${slug}.txt" download>${title} (.txt)</a> — ${description}</li>`).join('')}</ul></section>`;}
