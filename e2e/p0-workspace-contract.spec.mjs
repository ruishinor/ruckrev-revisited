import {test,expect} from '@playwright/test';
test('independent challenge can be explicitly saved once and reopened from My Training',async({page})=>{
 await page.goto('/resources/challenges/first-distance/');
 const save=page.getByRole('button',{name:'Save to My Training',exact:true});await save.click();
 await expect(page.getByText('Saved to My Training.',{exact:true})).toBeVisible();await save.click();await expect(page.getByText('Already saved.',{exact:true})).toBeVisible();
 await page.goto('/my-training/');await expect(page.locator('#training-status')).toContainText('Ready.');
 const saved=page.locator('#training-personal-list article').filter({hasText:'First distance'});await expect(saved).toHaveCount(1);
 await expect(saved.getByRole('link',{name:'First distance'})).toHaveAttribute('href','/resources/challenges/first-distance/');
 await saved.getByRole('link',{name:'First distance'}).click();await expect(page.getByRole('heading',{name:'First distance',exact:true})).toBeVisible();
});
