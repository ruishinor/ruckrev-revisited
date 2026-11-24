// Generated illustrations, not event documentation. Each has its own source crop.
export const photoScenes=Object.freeze({
 'first-distance':'A walker with a small backpack on a park path.',
 'long-loop':'Two walkers following a forest road.',
 'repeat-the-route':'A walker on a riverside trail in afternoon light.',
 'welcome-a-walker':'A small group talking at a trailhead.',
 'new-neighbourhood':'A walker with a backpack exploring a city street.',
 'steady-hour':'A walker checking the time on a woodland path.',
 'local-climbs':"Two walkers climbing a rocky hillside.",
 'viewpoint-walk':"A walker overlooking a lake and wooded hills.",
 'climb-not-race':"A walker taking controlled steps up a slope.",
 'pack-fit-check':"A walker adjusting the chest strap of a backpack.",
 'shared-object':"Two people carrying a manageable soft bag together on grass.",
 'map-and-return':"A walker consulting a paper map on a woodland path.",
 "four-week-rhythm":"Walking shoes, backpack and a calendar at home.",
 "monthly-minutes":"A walker recording activity in a notebook on a park bench.",
 "carry-and-place":"A person handling a manageable soft sandbag on level grass.",
 "route-designer":"A walker planning a route on a paper map at a table.",
 "two-day-repeat":"Two walkers with small backpacks on a sunlit woodland path.",
 "weekend-journey":"A hiker adjusting a small tent beside a lake.",
 "shared-pace":"Four walkers of different ages walking together on a woodland path.",
 "leave-it-better":"A volunteer collecting ordinary litter using gloves and a litter picker.",
 "lead-the-loop":"A group leader discussing a map with walkers at a trailhead.",
 "rotate-roles":"Two walkers handing over a paper map on a hillside.",
 "personal-milestone":"A walker with a backpack passing a red route marker on a mountain trail.",
 "movement-mix":"A walker practising a controlled rise from a park bench with a backpack nearby.",
 "quiet-review":"A walker writing in a notebook overlooking a lake."
});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function challengePhoto(c,logo,photo){if(!Object.hasOwn(photoScenes,c.id)||!/^([A-Za-z0-9+/]+={0,2})$/.test(logo)||!/^\/9j\/[A-Za-z0-9+/]+={0,2}$/.test(photo))throw Error('Invalid challenge artwork');return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="810" viewBox="0 0 1080 810" role="img" aria-label="${esc(photoScenes[c.id])} Rucking Revolution illustration"><image width="1080" height="810" href="data:image/jpeg;base64,${photo}" preserveAspectRatio="xMidYMid slice"/><rect x="894" y="624" width="150" height="150" rx="8" fill="#F1F4F5"/><image x="906" y="636" width="126" height="126" href="data:image/png;base64,${logo}" preserveAspectRatio="xMidYMid meet"/><rect x="32" y="32" width="226" height="32" rx="3" fill="#131C20"/><text x="44" y="53" font-family="Arial,sans-serif" font-size="16" fill="#F1F4F5">GENERATED ILLUSTRATION</text></svg>`;}
export function renderChallengePhoto(c){if(!Object.hasOwn(photoScenes,c.id))return '';const path='/challenge-posts/'+esc(c.id)+'-photo.svg';return `<figure class="challenge-photo"><img src="${path}" alt="${esc(photoScenes[c.id])}" width="1080" height="810" loading="lazy"><figcaption>Generated illustration for this challenge, not a photo of an actual event.</figcaption></figure><p><a class="button button-secondary" href="${path}" download>Download photographic illustration (SVG)</a> <button class="button button-secondary" type="button" id="challenge-photo-png">Download photographic illustration (PNG)</button></p>`;}
export function bindChallengePhoto(){const button=document.querySelector('#challenge-photo-png'),img=document.querySelector('.challenge-photo img'),status=document.querySelector('#challenge-copy-status');if(!button||!img||!status)return;button.addEventListener('click',async()=>{button.disabled=true;try{await img.decode();const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=810;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');ctx.drawImage(img,0,0);const blob=await new Promise((ok,no)=>canvas.toBlob(b=>b?ok(b):no(Error('PNG export failed')),'image/png'));const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=img.getAttribute('src').split('/').pop().replace(/\.svg$/,'.png');document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Photo illustration ready.';}catch{status.textContent='PNG conversion unavailable. Download the SVG instead.';}finally{button.disabled=false;}});}
