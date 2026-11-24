import {coverFiles} from '../data/reading-covers.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external=(url,label)=>`<a href="${esc(url)}" rel="noopener noreferrer">${esc(label)}</a>`;
export function renderReadingBlock(block,i){
 const b=block.book;
 if(!b)return `<section class="content-panel article-section reading-lead"><h2>${esc(block.title)}</h2><p>${esc(block.text)}</p><p>${external(block.url,'Official Comrades Marathon history')} · <a href="/resources/contribute/">Suggest a correction</a></p></section>`;
 const cover=coverFiles[b.id];
 return `<section class="content-panel article-section reading-card"><div class="reading-cover">${cover?`<a href="${esc(b.bookUrl)}" rel="noopener noreferrer"><img src="${esc(cover)}" alt="Cover of ${esc(b.title)}" loading="lazy" decoding="async"></a>`:`<p>${external(b.coverUrl,'View publisher or author cover')}</p>`}</div><div class="reading-copy"><h2>${esc(b.title)}</h2><p class="guide-meta">${esc(b.author)}</p><p>${esc(block.text)}</p><p class="reading-links">${external(b.bookUrl,'About the book')}${b.authorUrl?' · '+external(b.authorUrl,'Author website'):''} · ${external(b.coverUrl,'Cover source')}</p><p>Read alongside: <a href="${esc(b.related[0])}">${esc(b.related[1])}</a></p></div></section>`;
}
