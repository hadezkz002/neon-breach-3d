import {transformLocal} from '../engine/math.js';
export function drawWorld(r,world,time) {
  for(const o of world.objects){
    let y=o.y,rotation=0;
    if(o.animate==='float')y+=Math.sin(time*1.6+o.x)*0.35;
    if(o.animate==='rotate')rotation=time*0.55;
    r.draw([o.x,y,o.z],[o.w,o.h,o.d],o.material,rotation);
  }
}
export function drawPlayer(r,p,time){
  const origin=[p.x,p.y,p.z],yaw=p.yaw;
  const bob=p.grounded&&p.moving?Math.abs(Math.sin(p.moveCycle))*0.035:0;
  function part(pos,scale,mat,rot=0){r.draw(transformLocal(pos[0],pos[1]+bob,pos[2],yaw,origin),scale,mat,yaw+rot);}
  const stride=p.grounded&&p.moving?Math.sin(p.moveCycle)*0.23:0;
  // Humanoid mech assembled from separate articulated solids.
  part([0,0.25,0],[0.86,0.055,0.72],'dark');
  part([0,1.12,0],[0.85,1.03,0.48],'armor');
  part([0,1.48,-0.27],[0.72,0.34,0.11],'player');
  part([0,1.85,0],[0.53,0.53,0.51],'armor');
  part([0,1.89,-0.27],[0.47,0.16,0.075],'visor');
  part([-0.57,1.30+stride*0.2,0],[0.32,0.65,0.41],'player');
  part([0.57,1.30-stride*0.2,0],[0.32,0.65,0.41],'player');
  part([-0.25,0.49+Math.max(0,stride)*0.35,0],[0.31,0.82,0.38],'armor');
  part([0.25,0.49+Math.max(0,-stride)*0.35,0],[0.31,0.82,0.38],'armor');
  part([-0.56,1.06,-0.35],[0.24,0.14,0.14],'neon');
  part([0.56,1.06,-0.35],[0.24,0.14,0.14],'neon');
  // Back-mounted energy reactor and attached antenna
  part([0,1.13,0.36],[0.44,0.58,0.25],'metal');
  part([0,1.18,0.51],[0.22,0.35,0.07],'neon');
  part([0.20,1.88,0.31],[0.05,0.48,0.05],'metal');
  part([0.20,2.11,0.31],[0.09,0.09,0.09],'red');
}
