import { clamp } from './math.js';

/** AABB props: {x,z,w,d} with x/z at center, w/d full extents. */
export function intersectsCircleAabb(x, z, radius, obstacle) {
  const nearestX=clamp(x,obstacle.x-obstacle.w/2,obstacle.x+obstacle.w/2);
  const nearestZ=clamp(z,obstacle.z-obstacle.d/2,obstacle.z+obstacle.d/2);
  const dx=x-nearestX, dz=z-nearestZ;
  return dx*dx+dz*dz < radius*radius - 1e-10;
}
export function collides(x,z,radius,obstacles,boundary=27.3) {
  if(x-radius < -boundary || x+radius > boundary || z-radius < -boundary || z+radius > boundary) return true;
  return obstacles.some(o=>intersectsCircleAabb(x,z,radius,o));
}
/** Swept movement subdivided to avoid tunneling; axis-by-axis slide on collision. */
export function moveWithCollisions(position,dx,dz,radius,obstacles,boundary=27.3) {
  let x=position.x,z=position.z,blockedX=false,blockedZ=false;
  const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/Math.max(radius*0.4,0.08)));
  for(let i=0;i<steps;i++) {
    const nx=x+dx/steps,nz=z+dz/steps;
    if(!collides(nx,z,radius,obstacles,boundary)) x=nx; else blockedX=true;
    if(!collides(x,nz,radius,obstacles,boundary)) z=nz; else blockedZ=true;
  }
  return {x,z,blockedX,blockedZ};
}
export function integrateVertical(y,vy,dt,gravity=-20) {
  let nextY=y+vy*dt+0.5*gravity*dt*dt;
  let nextVy=vy+gravity*dt;
  let grounded=false;
  if(nextY<=0) {nextY=0;nextVy=0;grounded=true;}
  return {y:nextY,vy:nextVy,grounded};
}
/** Return smallest segment distance along ray, or Infinity if no AABB hit. */
export function rayAabb(origin, direction, obstacle, maxDistance=Infinity, inflation=0) {
  let tmin=0,tmax=maxDistance;
  for(const [axis,center,half] of [['x',obstacle.x,obstacle.w/2+inflation],['z',obstacle.z,obstacle.d/2+inflation]]) {
    if(Math.abs(direction[axis])<1e-8) {
      if(origin[axis]<center-half || origin[axis]>center+half) return Infinity;
      continue;
    }
    const a=(center-half-origin[axis])/direction[axis];
    const b=(center+half-origin[axis])/direction[axis];
    tmin=Math.max(tmin,Math.min(a,b));
    tmax=Math.min(tmax,Math.max(a,b));
    if(tmax<tmin) return Infinity;
  }
  return tmin<=maxDistance?tmin:Infinity;
}
