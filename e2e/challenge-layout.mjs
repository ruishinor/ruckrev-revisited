import {expect} from '@playwright/test';

// Navigation can commit before the new document's stylesheet has loaded.
// Verify the actual styled page, then force lazy images to decode before
// measuring. Do not clip overflow or relax the viewport-width contract.
export async function assertChallengeLayout(page,width){
 await page.waitForLoadState('load');
 const detail=page.locator('.challenge-detail');
 await expect(detail).toBeVisible();
 const photo=detail.locator('.challenge-photo img');
 const card=detail.locator('img.challenge-social-card');
 await expect(photo).toBeVisible();
 await expect(card).toBeVisible();
 await expect(photo).toHaveCSS('max-width','100%');
 await expect(card).toHaveCSS('max-width','100%');
 for(const image of [photo,card]){
  await image.evaluate(async img=>{img.loading='eager';await img.decode();});
  expect(await image.evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
 }
 const layout=await page.evaluate(async()=>{
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const viewport=document.documentElement.clientWidth;
  const scrollWidth=document.documentElement.scrollWidth;
  const offenders=scrollWidth>viewport?[...document.querySelectorAll('main *')].filter(e=>{
   const r=e.getBoundingClientRect();return r.width>0&&r.right>viewport+1;
  }).slice(0,15).map(e=>({tag:e.tagName,id:e.id,className:String(e.className),right:Math.round(e.getBoundingClientRect().right),width:Math.round(e.getBoundingClientRect().width)})):[];
  return {viewport,windowWidth:window.innerWidth,scrollWidth,offenders};
 });
 expect(layout.windowWidth,`Unexpected viewport on ${page.url()}`).toBe(width);
 expect(layout.scrollWidth,`${page.url()}: ${JSON.stringify(layout)}`).toBeLessThanOrEqual(layout.viewport);
 for(const image of [photo,card]){
  const bounds=await image.boundingBox();
  expect(bounds,`Missing image bounds: ${page.url()}`).not.toBeNull();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x+bounds.width).toBeLessThanOrEqual(layout.viewport+0.5);
 }
}
