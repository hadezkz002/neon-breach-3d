import {createRenderer} from './engine/graphics.js';
import {createWorld} from './game/world.js';
import {createPlayer,stepPlayer,initialInput,validatePlayer} from './game/player.js';
import {createCamera,updateCamera,dragCamera,zoomCamera} from './engine/camera.js';
import {drawWorld,drawPlayer} from './game/visuals.js';

const canvas=document.getElementById('viewport');
const welcome=document.getElementById('welcome');
const startButton=document.getElementById('start-game');
const fpsEl=document.getElementById('fps');
const coordEl=document.getElementById('position');
const distanceEl=document.getElementById('distance');
const cameraEl=document.getElementById('camera-mode');
const runEl=document.getElementById('movement');
const errorEl=document.getElementById('error');
const hintEl=document.getElementById('hint');
const world=createWorld();
const player=createPlayer(world.spawn);
const camera=createCamera();
const input=initialInput();
let renderer;
let active=false,paused=false,last=0,frames=0,fpsTime=0,elapsed=0;
let mouseDown=false;

try {renderer=createRenderer(canvas);}
catch(error) {welcome.hidden=false;startButton.disabled=true;errorEl.hidden=false;errorEl.textContent=error.message;console.error(error);}

const keymap={KeyW:'forward',ArrowUp:'forward',KeyS:'backward',ArrowDown:'backward',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',ShiftLeft:'sprint',ShiftRight:'sprint',Space:'jump'};
function resetInput(){for(const key in input)input[key]=false;}
window.addEventListener('keydown',e=>{
  const k=keymap[e.code];
  if(k){if(active){e.preventDefault();input[k]=true;}}
  if(e.code==='Escape'&&active){paused=true;document.exitPointerLock?.();hintEl.textContent='PAUSED — click the arena to resume';}
  if(e.code==='Enter'&&!active&&renderer)start();
});
window.addEventListener('keyup',e=>{const k=keymap[e.code];if(k)input[k]=false;});
window.addEventListener('blur',()=>{resetInput();if(active){paused=true;hintEl.textContent='PAUSED — click the arena to resume';}});
window.addEventListener('mousemove',e=>{
  if(active&&!paused&&(document.pointerLockElement===canvas||mouseDown))dragCamera(camera,e.movementX,e.movementY);
});
canvas.addEventListener('mousedown',e=>{
  if(!active)return;
  if(e.button===0){mouseDown=true;paused=false;canvas.requestPointerLock?.();}
});
window.addEventListener('mouseup',()=>mouseDown=false);
canvas.addEventListener('wheel',e=>{if(active){e.preventDefault();zoomCamera(camera,Math.sign(e.deltaY)*0.75);}}, {passive:false});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('pointerlockchange',()=>{
  cameraEl.textContent=document.pointerLockElement===canvas?'MOUSE LOCKED':'FREE LOOK';
  if(active&&document.pointerLockElement!==canvas&&!mouseDown){paused=true;resetInput();hintEl.textContent='PAUSED — click the arena to resume';}
});
startButton.addEventListener('click',start);
function start(){if(!renderer)return;welcome.hidden=true;active=true;paused=false;hintEl.textContent='WASD move · MOUSE look · SHIFT sprint · SPACE jump · ESC pause';canvas.focus();canvas.requestPointerLock?.();}
function hud(dt){
  frames++;fpsTime+=dt;
  if(fpsTime>0.6){fpsEl.textContent=String(Math.round(frames/fpsTime));frames=0;fpsTime=0;}
  coordEl.textContent=`${player.x.toFixed(1)} / ${player.y.toFixed(1)} / ${player.z.toFixed(1)}`;
  distanceEl.textContent=`${Math.round(player.distance)} m`;
  runEl.textContent=paused?'PAUSED':player.grounded?(player.sprinting?'SPRINT':player.moving?'MOVING':'IDLE'):'AIRBORNE';
}
function loop(timestamp){
  if(!renderer)return;
  const dt=Math.min((timestamp-last)/1000||0,0.035);last=timestamp;
  if(active&&!paused){
    stepPlayer(player,input,camera.yaw,world,dt);elapsed+=dt;
    if(!validatePlayer(player,world)){errorEl.hidden=false;errorEl.textContent='Player position invalid; simulation halted.';paused=true;}
  }
  const {eye,target}=updateCamera(camera,player,world,dt);
  renderer.begin(eye,target,elapsed);
  drawWorld(renderer,world,elapsed);
  drawPlayer(renderer,player,elapsed);
  renderer.end();
  hud(dt);
  window.__neonBreachState={active,paused,position:{x:player.x,y:player.y,z:player.z},grounded:player.grounded,drawCalls:renderer.drawCalls,webgl2:!!renderer.gl};
  requestAnimationFrame(loop);
}
if(renderer)requestAnimationFrame(loop);
