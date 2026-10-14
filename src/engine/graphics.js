import {mat4Model,mat4Multiply,mat4Perspective,mat4LookAt} from './math.js';
const VERTEX=`#version 300 es
precision highp float;
in vec3 a_position;
in vec3 a_normal;
uniform mat4 u_model;
uniform mat4 u_viewProjection;
out vec3 v_normal;
out vec3 v_position;
void main(){
  vec4 position=u_model*vec4(a_position,1.0);
  v_position=position.xyz;
  v_normal=mat3(u_model)*a_normal;
  gl_Position=u_viewProjection*position;
}`;
const FRAGMENT=`#version 300 es
precision highp float;
in vec3 v_normal;
in vec3 v_position;
uniform vec3 u_color;
uniform vec3 u_camera;
uniform float u_glow;
uniform float u_time;
out vec4 fragColor;
void main(){
  vec3 n=normalize(v_normal);
  float light=max(dot(n,normalize(vec3(-0.4,0.9,-0.5))),0.0);
  float fill=max(dot(n,normalize(vec3(0.6,0.35,0.8))),0.0);
  vec3 color=u_color*(0.27+0.66*light+0.2*fill);
  float pulse=0.93+0.07*sin(u_time*2.0+v_position.x*0.3);
  color+=u_color*u_glow*1.75*pulse;
  float d=distance(u_camera,v_position);
  float fog=clamp((d-23.0)/52.0,0.0,0.78);
  color=mix(color,vec3(0.025,0.04,0.095),fog);
  color=pow(max(color,0.0),vec3(0.84));
  fragColor=vec4(color,1.0);
}`;
function shader(gl,type,source) {
  const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const msg=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(`GLSL error: ${msg}`);}
  return s;
}
function program(gl){
  const p=gl.createProgram(),v=shader(gl,gl.VERTEX_SHADER,VERTEX),f=shader(gl,gl.FRAGMENT_SHADER,FRAGMENT);
  gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
  return p;
}
function cubeGeometry(){
  const vertices=[];
  const faces=[
    {n:[1,0,0],c:[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]]},
    {n:[-1,0,0],c:[[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,-1,-1]]},
    {n:[0,1,0],c:[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]]},
    {n:[0,-1,0],c:[[-1,-1,1],[-1,-1,-1],[1,-1,-1],[1,-1,1]]},
    {n:[0,0,1],c:[[1,-1,1],[1,1,1],[-1,1,1],[-1,-1,1]]},
    {n:[0,0,-1],c:[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]}
  ];
  for(const face of faces)for(const i of [0,1,2,0,2,3])vertices.push(...face.c[i].map(v=>v*0.5),...face.n);
  return new Float32Array(vertices);
}
export const palette={
  floor:{color:[0.10,0.15,0.24],glow:0},grid:{color:[0.015,0.43,0.62],glow:0.18},
  wall:{color:[0.085,0.12,0.21],glow:0},metal:{color:[0.12,0.23,0.32],glow:0},
  structure:{color:[0.08,0.17,0.26],glow:0},neon:{color:[0.07,0.95,1.0],glow:0.85},
  edge:{color:[0.12,0.5,0.73],glow:0.20},red:{color:[1.0,0.13,0.24],glow:0.48},
  glass:{color:[0.08,0.24,0.60],glow:0.45},crate:{color:[0.2,0.22,0.35],glow:0},
  player:{color:[0.16,0.77,0.95],glow:0.06},armor:{color:[0.11,0.19,0.32],glow:0.05},
  visor:{color:[1.0,0.43,0.14],glow:0.8},dark:{color:[0.035,0.08,0.16],glow:0}
};
export function createRenderer(canvas){
  const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});
  if(!gl)throw new Error('WebGL2 unavailable. Try recent Chrome/Firefox or enable hardware acceleration.');
  const p=program(gl),vao=gl.createVertexArray(),buffer=gl.createBuffer();
  gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,cubeGeometry(),gl.STATIC_DRAW);
  for(const [name,size,offset] of [['a_position',3,0],['a_normal',3,12]]){
    const loc=gl.getAttribLocation(p,name);
    gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,24,offset);
  }
  gl.bindVertexArray(null);
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);
  const u={model:gl.getUniformLocation(p,'u_model'),vp:gl.getUniformLocation(p,'u_viewProjection'),color:gl.getUniformLocation(p,'u_color'),camera:gl.getUniformLocation(p,'u_camera'),glow:gl.getUniformLocation(p,'u_glow'),time:gl.getUniformLocation(p,'u_time')};
  let viewProjection;
  function resize(){
    const ratio=Math.min(1.6,window.devicePixelRatio||1);
    const width=Math.max(1,Math.round(canvas.clientWidth*ratio)),height=Math.max(1,Math.round(canvas.clientHeight*ratio));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
    return width/height;
  }
  function start(eye,target,time){
    const aspect=resize();
    const projection=mat4Perspective(Math.PI/3.25,aspect,0.1,150);
    const view=mat4LookAt(eye,target);
    viewProjection=mat4Multiply(projection,view);
    gl.clearColor(0.019,0.031,0.073,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(p);gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(u.vp,false,viewProjection);
    gl.uniform3fv(u.camera,eye);gl.uniform1f(u.time,time);
  }
  let calls=0;
  function draw(position,scale,material='metal',yaw=0){
    const m=typeof material==='string'?(palette[material]||palette.metal):material;
    gl.uniformMatrix4fv(u.model,false,mat4Model(position,scale,yaw));
    gl.uniform3fv(u.color,m.color);gl.uniform1f(u.glow,m.glow);
    gl.drawArrays(gl.TRIANGLES,0,36);calls++;
  }
  function end(){gl.bindVertexArray(null);}
  function begin(eye,target,time){calls=0;start(eye,target,time);}
  return {begin,draw,end,get drawCalls(){return calls;},gl};
}
