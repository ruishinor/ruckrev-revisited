import {assertChallengeLayout} from './challenge-layout.mjs';
import {test,expect} from '@playwright/test';
import {challenges} from '../src/data/challenges.mjs';
test('challenge search, combined filters, reset, sorting, monthly rotation and detail',async({page})=>{
 await page.goto('/resources/challenges/');await expect(page.getByRole('heading',{name:'Challenge Library',exact:true})).toBeVisible();await expect(page.locator('#challenge-count')).toHaveText(`${challenges.length} of ${challenges.length} challenges`);
 await page.getByRole('combobox',{name:'Category',exact:true}).selectOption('Teamwork');await expect(page.locator('#challenge-count')).toHaveText(`${challenges.filter(c=>c.category==='Teamwork').length} of ${challenges.length} challenges`);await page.getByRole('combobox',{name:'Participation',exact:true}).selectOption('Solo');await expect(page.locator('#challenge-empty')).toBeVisible();await page.getByRole('button',{name:'Clear filters'}).click();await expect(page.locator('#challenge-count')).toHaveText(`${challenges.length} of ${challenges.length} challenges`);await expect(page.getByRole('searchbox',{name:'Search challenges'})).toBeFocused();
 await page.getByRole('combobox',{name:'Sort by',exact:true}).selectOption('name');const titles=await page.locator('#challenge-cards h3').allTextContents();expect(titles).toEqual([...titles].sort((a,b)=>a.localeCompare(b,'en')));await page.getByRole('searchbox',{name:'Search challenges'}).fill('five landmarks');await expect(page.locator('#challenge-count')).toHaveText(`1 of ${challenges.length} challenges`);await page.reload();await expect(page.locator('#challenge-count')).toHaveText(`1 of ${challenges.length} challenges`);await page.getByRole('combobox',{name:'Choose a month',exact:true}).selectOption('1');await expect(page.locator('#challenge-month-card')).toContainText('Four-week rhythm');
 await page.locator('#challenge-cards').getByRole('link',{name:'Map and return',exact:true}).click();await expect(page.getByRole('heading',{name:'Map and return',exact:true})).toBeVisible();const response=await page.request.get('/challenge-records/map-and-return.txt');expect(response.ok()).toBeTruthy();
});
test('challenge mobile layout, native controls and route discovery',async({page})=>{
 await page.setViewportSize({width:360,height:800});
 await page.goto('/resources/');
 await page.getByRole('link',{name:/Challenge Library/}).first().click();
 await expect(page.locator('#challenge-count')).toHaveText(`${challenges.length} of ${challenges.length} challenges`);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
 await page.getByRole('searchbox',{name:'Search challenges'}).fill('First distance');
 await page.locator('#challenge-cards').getByRole('link',{name:'First distance',exact:true}).click();
 await expect(page).toHaveURL(/\/resources\/challenges\/first-distance\/$/);
 await expect(page.getByRole('heading',{name:'First distance',exact:true})).toBeVisible();
 await assertChallengeLayout(page,360);
 await expect(page.locator('a[href="/challenge-records/first-distance.txt"]')).toBeVisible();
});
