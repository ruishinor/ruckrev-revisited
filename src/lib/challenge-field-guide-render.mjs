import {challengeFieldGuides} from '../data/challenge-field-guides.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderFieldGuide(c){
 const g=challengeFieldGuides[c.id];
 if(!Object.hasOwn(challengeFieldGuides,c.id))throw Error('Missing challenge field guide: '+c.id);
 return `<section class="content-panel challenge-field-guide" aria-labelledby="field-guide-title"><span class="eyebrow">FIELD GUIDE</span><h2 id="field-guide-title">What this challenge develops</h2><p>${esc(g.why)}</p><h3>Before you set out</h3><p>${esc(g.ready)}</p><h3>How to do it</h3><ol class="detail-list">${g.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><h3>What to record</h3><p>${esc(g.record)}</p><h3>Where to go next</h3><p>${esc(g.next)}</p><p class="guide-meta">The field guide gives practical examples. Your chosen target and the completion criteria below remain the basis of your personal record.</p></section>`;
}
