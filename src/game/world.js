/** Geometry and collision data generated from the same static layout. */
export function createWorld(seed=1) {
  const objects=[],colliders=[];
  const add=(x,y,z,w,h,d,material,solid=false,options={})=>{
    objects.push({x,y,z,w,h,d,material,...options});
    if(solid) colliders.push({x,z,w,d,height:h,base:y-h/2});
  };
  // Floor: nested height layers and luminous seams
  add(0,-0.55,0,58,1.1,58,'floor');
  for(let i=-26;i<=26;i+=4){add(i,0.012,0,0.055,0.02,53,'grid');add(0,0.014,i,53,0.02,0.055,'grid');}
  // Physical walls and exposed cyan highlights
  for(const side of [-1,1]){
    add(side*28.25,3,0,1.5,6,58,'wall',true);
    add(0,3,side*28.25,58,6,1.5,'wall',true);
    add(side*27.36,5.7,0,0.18,0.18,55,'neon');
    add(0,5.7,side*27.36,55,0.18,0.18,'neon');
  }
  // Fixed sci-fi structures with guaranteed central and outer paths
  for(const [x,z,w,d,h] of [
    [-14,-13,6,5,5],[13,-14,6,5,6],[-14,9,5,6,4],[15,10,7,5,5],
    [0,-14,6,4,3],[-9,0,3,10,3],[9,0,3,10,3],
    [-21,-2,3,3,8],[21,1,3,3,8],[-3,18,5,3,3],[7,20,4,3,4]
  ]){
    add(x,h/2,z,w,h,d,'structure',true);
    add(x,h+0.11,z,w+0.3,0.22,d+0.3,'edge');
    add(x,h+0.26,z,w-0.3,0.06,d-0.3,'metal');
    for(const k of [-1,1]) add(x+k*(w/2-0.22),h/2,z,0.12,h-0.3,d-0.45,'neon');
  }
  // Decorative pylons / unlit machinery
  for(const [x,z] of [[-23,22],[23,22],[-23,-22],[23,-22]]){
    add(x,3.5,z,1.5,7,1.5,'metal',true);
    add(x,7.25,z,2.3,0.5,2.3,'red');
    add(x,8.3,z,0.4,1.7,0.4,'neon');
  }
  for(const [x,z] of [[-4,-7],[4,-7],[-4,7],[4,7]]){
    add(x,0.45,z,1.5,0.9,1.5,'crate',true);
    add(x,0.95,z,1.65,0.12,1.65,'edge');
  }
  // Floating energy terminals are visual only in M1 (interaction ships in M6).
  for(const [x,z] of [[-20,-20],[20,-19],[0,22]]){
    add(x,0.25,z,3.2,0.5,3.2,'metal');
    add(x,2.0,z,1.4,3.1,1.4,'glass',false,{animate:'float'});
    add(x,3.8,z,2.0,0.14,2.0,'neon');
  }
  // Landmark center, enough space for movement demo
  add(0,0.35,0,4.2,0.7,4.2,'metal');
  add(0,1.45,0,1.1,1.9,1.1,'red',false,{animate:'rotate'});
  add(0,2.7,0,2.1,0.2,2.1,'neon');
  const spawn={x:0,y:0,z:14};
  return {objects,colliders,spawn,boundary:27.3,seed};
}
