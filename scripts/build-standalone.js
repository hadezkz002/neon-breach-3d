import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const parts=[
  'src/engine/math.js','src/engine/physics.js','src/engine/graphics.js','src/engine/camera.js',
  'src/game/world.js','src/game/player.js','src/game/visuals.js','src/main.js'
];
const source=[];
for(const file of parts) {
  let js=await readFile(path.join(root,file),'utf8');
  js=js.replace(/^import\s+.*?;\s*$/gm,'').replace(/^export\s+/gm,'');
  source.push(`// Module: ${file}\n${js}`);
}
const js=source.join('\n;\n');
const css=await readFile(path.join(root,'styles/game.css'),'utf8');
let html=await readFile(path.join(root,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="./styles/game.css" />',`<style>\n${css}\n</style>`);
html=html.replace('<script type="module" src="./src/main.js"></script>',`<script>\n${js.replaceAll('</script>','<\\/script>')}\n</script>`);
if(html.includes('<script type="module"') || html.includes('rel="stylesheet"'))throw new Error('Standalone bundle is incomplete');
await mkdir(path.join(root,'dist'),{recursive:true});
await writeFile(path.join(root,'dist/NEON-BREACH-M1.html'),html);
await writeFile(path.join(root,'dist/game.bundle.js'),js);
console.log('Built dist/NEON-BREACH-M1.html — works offline, no runtime dependencies.');
