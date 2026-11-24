// Local track viewport in SVG coordinates. No network, persistence or geolocation.
export const TRACK_WIDTH=640,TRACK_HEIGHT=360;
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
export function trackViewport(zoom=1,cx=TRACK_WIDTH/2,cy=TRACK_HEIGHT/2){
 if(![zoom,cx,cy].every(Number.isFinite))throw new TypeError('Invalid track viewport');
 zoom=clamp(zoom,1,8);const width=TRACK_WIDTH/zoom,height=TRACK_HEIGHT/zoom;
 cx=clamp(cx,width/2,TRACK_WIDTH-width/2);cy=clamp(cy,height/2,TRACK_HEIGHT-height/2);
 return {zoom,cx,cy,width,height,x:cx-width/2,y:cy-height/2};
}
export function panTrack(view,dx,dy){return trackViewport(view.zoom,view.cx+dx,view.cy+dy);}
export function zoomTrack(view,multiplier){if(!Number.isFinite(multiplier)||multiplier<=0)throw new TypeError('Invalid zoom');return trackViewport(view.zoom*multiplier,view.cx,view.cy);}
export function viewBox(view){return [view.x,view.y,view.width,view.height].map(x=>Number(x.toFixed(6))).join(' ');}
export const panIds=['gpx-north','gpx-west','gpx-east','gpx-south'];
export function renderPanControls(){return `<div class="gpx-controls gpx-pan" role="group" aria-label="Pan route preview"><button type="button" class="button button-secondary" id="gpx-north" disabled>Pan north</button><button type="button" class="button button-secondary" id="gpx-west" disabled>Pan west</button><button type="button" class="button button-secondary" id="gpx-east" disabled>Pan east</button><button type="button" class="button button-secondary" id="gpx-south" disabled>Pan south</button></div><p id="gpx-view-status" class="guide-meta" role="status" aria-live="polite">Whole route view.</p>`;}
export function bindTrackNavigation(map,find){
 let view=trackViewport(),available=false,drag=null;
 const status=find('#gpx-view-status');
 function paint(announce=true){map.setAttribute('viewBox',viewBox(view));for(const id of panIds)find('#'+id).disabled=!available||view.zoom===1;if(announce&&status)status.textContent=view.zoom===1?'Whole route view.':`Map zoom ${Math.round(view.zoom*100)}%. Pan controls available.`;}
 function set(next,announce=true){view=next;paint(announce);}
 function step(x,y){set(panTrack(view,x*view.width/4,y*view.height/4));}
 for(const [id,x,y] of [['gpx-north',0,-1],['gpx-west',-1,0],['gpx-east',1,0],['gpx-south',0,1]])find('#'+id).addEventListener('click',()=>step(x,y));
 // Dragging is optional; equivalent native buttons work by keyboard and touch.
 map.addEventListener('pointerdown',e=>{if(!available||view.zoom===1||e.pointerType!=='mouse'||e.button!==0)return;const matrix=map.getScreenCTM();if(!matrix)return;const inverse=matrix.inverse();drag={id:e.pointerId,x:e.clientX,y:e.clientY,inverse,view};map.setPointerCapture(e.pointerId);e.preventDefault();});
 map.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;set(panTrack(drag.view,-(drag.inverse.a*dx+drag.inverse.c*dy),-(drag.inverse.b*dx+drag.inverse.d*dy)),false);});
 function end(e){if(drag&&e.pointerId===drag.id){drag=null;paint();}}
 for(const name of ['pointerup','pointercancel','lostpointercapture'])map.addEventListener(name,end);
 return {setAvailable(value){available=Boolean(value);drag=null;set(trackViewport());},zoom(multiplier){if(available)set(zoomTrack(view,multiplier));},reset(){drag=null;set(trackViewport());}};
}
