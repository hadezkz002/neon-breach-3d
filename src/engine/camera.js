import {clamp,lerp} from './math.js';
import {rayAabb} from './physics.js';
export function createCamera(){return {yaw:0.2,pitch:0.26,distance:8.2,x:0,y:4,z:20,initialized:false};}
export function updateCamera(camera,player,world,dt){
  const target=[player.x,player.y+1.35,player.z];
  const horizontal=Math.cos(camera.pitch),vertical=Math.sin(camera.pitch);
  const dx=Math.sin(camera.yaw)*horizontal,dy=vertical,dz=Math.cos(camera.yaw)*horizontal;
  let allowed=camera.distance;
  for(const o of world.colliders){
    if(o.height<2.2)continue;
    const hit=rayAabb({x:target[0],z:target[2]},{x:dx,z:dz},o,allowed,0.55);
    if(Number.isFinite(hit)){
      // Ground-level objects must not force camera too close if camera is above their top.
      const hitY=target[1]+dy*hit;
      if(hitY <= (o.base+o.height+0.4))allowed=Math.min(allowed,Math.max(2.0,hit-0.8));
    }
  }
  const desired=[target[0]+dx*allowed,target[1]+dy*allowed+0.7,target[2]+dz*allowed];
  const a=camera.initialized?1-Math.exp(-13*dt):1;
  camera.x=lerp(camera.x,desired[0],a);camera.y=lerp(camera.y,desired[1],a);camera.z=lerp(camera.z,desired[2],a);
  camera.initialized=true;
  return {eye:[camera.x,camera.y,camera.z],target};
}
export function dragCamera(camera,dx,dy){camera.yaw-=dx*0.0035;camera.pitch=clamp(camera.pitch+dy*0.0035,-0.12,1.05);}
export function zoomCamera(camera,amount){camera.distance=clamp(camera.distance+amount,4.5,13);}
