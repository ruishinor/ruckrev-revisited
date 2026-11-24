import {assertChallengeLayout} from './challenge-layout.mjs';
import {test,expect} from '@playwright/test';
import {challenges} from '../src/data/challenges.mjs';
test('all challenge field guides fit narrow mobile width with decoded illustrations and working controls',async({page})=>{
 test.setTimeout(180000);
 await page.setViewportSize({width:360,height:800});
 for(const c of challenges){
  await page.goto(c.path);
  await expect(page.getByRole('heading',{name:c.title,exact:true})).toBeVisible();
  const guide=page.locator('.challenge-field-guide');await expect(guide).toBeVisible();
  await expect(guide.locator('ol')).toBeVisible();
  await expect(page.locator('.challenge-record')).toBeVisible();
  await assertChallengeLayout(page,360);
  await expect(page.locator('#challenge-print')).toBeVisible();
  await expect(page.locator('.challenge-record a[href^="/my-training/"]')).toBeVisible();
 }
});
