import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorld} from '../src/game/world.js';
import {createPlayer,stepPlayer,initialInput,validatePlayer} from '../src/game/player.js';
import {mat4Identity,mat4Multiply,mat4Model,mat4Perspective,mat4LookAt} from '../src/engine/math.js';

test('spawn position is accessible and world collision layout nonempty',()=>{
  const w=createWorld();assert.ok(w.objects.length>60);assert.ok(w.colliders.length>12);
  assert.equal(w.spawn.z,14);assert.equal(w.objects.some(o=>o.animate==='rotate'),true);
});
test('character moves forward, sprints faster, and stays within world',()=>{
  const w=createWorld();const input=initialInput();input.forward=true;
  let a=createPlayer(w.spawn);for(let i=0;i<60;i++)stepPlayer(a,input,0,w,1/60);
  assert.ok(a.z < w.spawn.z-4,`z=${a.z}`);
  input.sprint=true;let b=createPlayer(w.spawn);for(let i=0;i<60;i++)stepPlayer(b,input,0,w,1/60);
  assert.ok(b.z<a.z);
  assert.ok(validatePlayer(b,w));
});
test('player leaves ground when jumping and comes back down',()=>{
  const w=createWorld(),p=createPlayer(w.spawn),input=initialInput();input.jump=true;
  stepPlayer(p,input,0,w,1/60);assert.ok(p.y>0);assert.equal(p.grounded,false);
  input.jump=false;for(let i=0;i<90;i++)stepPlayer(p,input,0,w,1/60);
  assert.equal(p.y,0);assert.equal(p.grounded,true);
});
test('player cannot run outside map',()=>{
  const w=createWorld(),p=createPlayer({x:25,y:0,z:0}),input=initialInput();input.right=true;input.sprint=true;
  for(let i=0;i<900;i++)stepPlayer(p,input,0,w,1/60);
  assert.ok(p.x<=w.boundary-p.radius+1e-6);assert.ok(validatePlayer(p,w));
});
test('matrix multiplication maintains identity, perspective is finite',()=>{
  const id=mat4Identity(),model=mat4Model([1,2,3],[2,3,4],0.3);
  assert.deepEqual([...mat4Multiply(id,model)],[...model]);
  const p=mat4Multiply(mat4Perspective(1.0,1.777,0.1,150),mat4LookAt([8,4,8],[0,1,0]));
  assert.ok([...p].every(Number.isFinite));
});
