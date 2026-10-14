import { clamp,lerpAngle } from '../engine/math.js';
import { moveWithCollisions,integrateVertical } from '../engine/physics.js';

export function createPlayer(spawn) {
  return {x:spawn.x,y:spawn.y,z:spawn.z,vx:0,vz:0,vy:0,yaw:0,grounded:true,radius:0.48,
    moveCycle:0,moving:false,sprinting:false,distance:0};
}
export function stepPlayer(p,input,cameraYaw,world,dt) {
  const forward=Number(input.forward)-Number(input.backward);
  const right=Number(input.right)-Number(input.left);
  const mag=Math.hypot(right,forward);
  let nx=0,nz=0;
  if(mag>0){
    const rr=right/mag,ff=forward/mag;
    nx=Math.cos(cameraYaw)*rr-Math.sin(cameraYaw)*ff;
    nz=-Math.sin(cameraYaw)*rr-Math.cos(cameraYaw)*ff;
  }
  const speed=input.sprint?9:5.5;
  const rate=1-Math.exp(-12*dt);
  p.vx+=(nx*speed-p.vx)*rate;
  p.vz+=(nz*speed-p.vz)*rate;
  if(input.jump && p.grounded){p.vy=8.2;p.grounded=false;}
  const moved=moveWithCollisions(p,p.vx*dt,p.vz*dt,p.radius,world.colliders,world.boundary);
  p.distance+=Math.hypot(moved.x-p.x,moved.z-p.z);
  p.x=moved.x;p.z=moved.z;
  if(moved.blockedX)p.vx=0;
  if(moved.blockedZ)p.vz=0;
  const v=integrateVertical(p.y,p.vy,dt);
  p.y=v.y;p.vy=v.vy;p.grounded=v.grounded;
  p.moving=Math.hypot(p.vx,p.vz)>0.2;
  p.sprinting=Boolean(input.sprint && p.moving);
  if(p.moving){p.yaw=lerpAngle(p.yaw,Math.atan2(-p.vx,-p.vz),1-Math.exp(-14*dt));}
  p.moveCycle+=Math.hypot(p.vx,p.vz)*dt*1.8;
  return p;
}
export function initialInput() {
  return {forward:false,backward:false,left:false,right:false,sprint:false,jump:false};
}
export function validatePlayer(p,world) {
  return Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z) &&
    p.y>=0 && Math.abs(p.x)<=world.boundary && Math.abs(p.z)<=world.boundary;
}
