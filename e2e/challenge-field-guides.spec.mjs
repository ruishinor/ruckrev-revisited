import {assertChallengeLayout} from './challenge-layout.mjs';
import {test,expect} from '@playwright/test';
import {challenges} from '../src/data/challenges.mjs';
test('every independent challenge serves its specific field guide and completion record',async({page})=>{
 test.setTimeout(120000);
 for(const c of challenges){
  await page.goto(c.path);
  await expect(page.getByRole('heading',{name:c.title,exact:true})).toBeVisible();
  const guide=page.locator('.challenge-field-guide');
  await expect(guide).toBeVisible();
  await expect(guide.getByRole('heading',{name:'How to do it',exact:true})).toBeVisible();
  expect(await guide.locator('ol > li').count()).toBeGreaterThanOrEqual(3);
  await expect(page.getByRole('heading',{name:'Personal completion record',exact:true})).toBeVisible();
 }
});
test('all challenge field guides fit narrow mobile width with decoded illustrations and working controls',async({page})=>{
 test.setTimeout(180000);
 await page.setViewportSize({width:360,height:800});
 for(const c of challenges){
  await page.goto(c.path);
  await expect(page.getByRole('heading',{name:c.title,exact:true})).toBeVisible();
  await expect(page.locator('.challenge-field-guide')).toBeVisible();
  await assertChallengeLayout(page,360);
  await expect(page.getByRole('button',{name:'Print challenge and record'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Record a challenge attempt'})).toBeVisible();
 }
});
