import { readFile } from 'node:fs/promises';
export function sharedHeaders(config) {
 const rules=config.headers;
 if (!Array.isArray(rules)||rules.length!==1||rules[0].source!=='/(.*)'||!Array.isArray(rules[0].headers)) throw Error('Review local header handling: expected one global Vercel header rule.');
 const result=Object.create(null);
 for (const {key,value} of rules[0].headers) {
  if (typeof key!=='string'||!/^[-A-Za-z0-9]+$/.test(key)||typeof value!=='string'||/[\r\n]/.test(value)||Object.hasOwn(result,key.toLowerCase())) throw Error('Invalid or duplicate global response header.');
  result[key.toLowerCase()]=value;
 }
 return Object.freeze(result);
}
export const securityHeaders=sharedHeaders(JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8')));
