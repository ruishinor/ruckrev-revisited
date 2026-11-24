import test from 'node:test';
import assert from 'node:assert/strict';
import { assertPlacements, cssPhotoUses, htmlPhotoUses } from '../scripts/photo-policy.mjs';
const thumb={asset:'x.webp',page:'/',subject:'/learn/',slot:'destination-thumbnail'};
const hero={asset:'x.webp',page:'/learn/',subject:'/learn/',slot:'hero'};
test('only same-destination thumbnail and hero pairs are permitted; three uses always fail',()=>{
 assert.equal(assertPlacements([thumb,hero]).size,1);
 assert.throws(()=>assertPlacements([thumb,hero,{...hero,page:'/other/'}]),/reused 3/);
 assert.throws(()=>assertPlacements([thumb,{...hero,subject:'/lead/'}]),/Unrelated/);
 assert.throws(()=>assertPlacements([thumb,{...thumb,slot:'destination-thumbnail'}]),/Unrelated/);
});
test('global CSS photograph backgrounds and text outlines are rejected',()=>{
 assert.throws(()=>cssPhotoUses("body::before{background:url('/assets/x.webp')}",[]),/Unscoped/);
 assert.throws(()=>cssPhotoUses('h1{-webkit-text-stroke:1px red}',[]),/outlines/);
 assert.deepEqual(htmlPhotoUses('<a class="editorial-photo" href="/learn/"><img src="/assets/x.webp"/></a>','/'),[thumb]);
});
