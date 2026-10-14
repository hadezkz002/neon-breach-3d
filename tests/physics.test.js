import test from 'node:test';
import assert from 'node:assert/strict';
import {intersectsCircleAabb,collides,moveWithCollisions,integrateVertical,rayAabb} from '../src/engine/physics.js';

test('circle/AABB handles corner and clear separation',()=>{
  const wall={x:2,z:0,w:2,d:2};
  assert.equal(intersectsCircleAabb(0.6,0,0.5,wall),true);
  assert.equal(intersectsCircleAabb(-2,0,0.5,wall),false);
  assert.equal(intersectsCircleAabb(0.65,1.35,0.4,wall),false);
});
test('world boundary prevents walking through perimeter',()=>{
  assert.equal(collides(27.0,0,0.48,[],27.3),true);
  assert.equal(collides(0,0,0.48,[],27.3),false);
});
test('large movement cannot tunnel through thin wall',()=>{
  const wall={x:0,z:0,w:0.25,d:8};
  const p=moveWithCollisions({x:-4,z:0},9,0,0.48,[wall],27.3);
  assert.ok(p.x < -0.6,JSON.stringify(p));assert.equal(p.blockedX,true);
});
test('diagonal motion slides along wall instead of sticking',()=>{
  const wall={x:0,z:0,w:1,d:12};
  const p=moveWithCollisions({x:-1.2,z:-2},2.0,3.0,0.48,[wall],27.3);
  assert.ok(p.x<0);assert.ok(p.z>-1.3,JSON.stringify(p));
});
test('vertical integration jumps then lands',()=>{
  let y=0,vy=8.2,grounded=false,airborne=false;
  for(let i=0;i<250;i++){
    ({y,vy,grounded}=integrateVertical(y,vy,.01));
    if(y>0)airborne=true;
  }
  assert.equal(airborne,true);assert.equal(grounded,true);assert.equal(y,0);
});
test('ray obstacle detects front hit and misses back/parallel',()=>{
  const box={x:0,z:4,w:2,d:2};
  assert.equal(rayAabb({x:0,z:0},{x:0,z:1},box,10),3);
  assert.equal(rayAabb({x:0,z:0},{x:0,z:-1},box,10),Infinity);
  assert.equal(rayAabb({x:10,z:0},{x:0,z:1},box,10),Infinity);
});
