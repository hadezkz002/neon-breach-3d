export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const hypot2 = (x, z) => Math.hypot(x, z);
export function lerpAngle(a, b, t) {
  const delta = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + delta * Math.min(1, Math.max(0, t));
}
export function mat4Identity() {
  return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
}
export function mat4Multiply(a, b) {
  const out = new Float32Array(16);
  for (let c=0;c<4;c++) for (let r=0;r<4;r++) {
    let sum=0;
    for (let k=0;k<4;k++) sum+=a[k*4+r]*b[c*4+k];
    out[c*4+r]=sum;
  }
  return out;
}
export function mat4Perspective(fov, aspect, near, far) {
  const f=1/Math.tan(fov/2), nf=1/(near-far);
  return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0]);
}
export function mat4LookAt(eye, center, up=[0,1,0]) {
  let zx=eye[0]-center[0], zy=eye[1]-center[1], zz=eye[2]-center[2];
  let len=Math.hypot(zx,zy,zz)||1; zx/=len;zy/=len;zz/=len;
  let xx=up[1]*zz-up[2]*zy, xy=up[2]*zx-up[0]*zz, xz=up[0]*zy-up[1]*zx;
  len=Math.hypot(xx,xy,xz)||1;xx/=len;xy/=len;xz/=len;
  const yx=zy*xz-zz*xy, yy=zz*xx-zx*xz, yz=zx*xy-zy*xx;
  return new Float32Array([
    xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,
    -(xx*eye[0]+xy*eye[1]+xz*eye[2]),-(yx*eye[0]+yy*eye[1]+yz*eye[2]),-(zx*eye[0]+zy*eye[1]+zz*eye[2]),1
  ]);
}
export function mat4Model(pos=[0,0,0], scale=[1,1,1], yaw=0) {
  const c=Math.cos(yaw),s=Math.sin(yaw);
  return new Float32Array([c*scale[0],0,-s*scale[0],0, 0,scale[1],0,0, s*scale[2],0,c*scale[2],0, pos[0],pos[1],pos[2],1]);
}
export function transformLocal(x, y, z, yaw, origin) {
  const c=Math.cos(yaw),s=Math.sin(yaw);
  return [origin[0]+c*x+s*z,origin[1]+y,origin[2]-s*x+c*z];
}
