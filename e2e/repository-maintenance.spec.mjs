import {test,expect} from '@playwright/test';
import {securityHeaders} from '../scripts/security-headers.mjs';
test('local HTTP policy matches deployment configuration, including errors and HEAD',async({request})=>{
 for(const [method,path,status] of [['GET','/',200],['HEAD','/',200],['GET','/missing-repository-maintenance-test/',404],['POST','/',405]]){
  const response=await request.fetch(path,{method});expect(response.status()).toBe(status);
  for(const [key,value] of Object.entries(securityHeaders))expect(response.headers()[key],key).toBe(value);
  expect(response.headers()['cache-control']).toBe('no-store');
 }
});
