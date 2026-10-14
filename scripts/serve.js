import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.ico':'image/x-icon' };
const port = Number(process.env.PORT || 4173);

createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!target.startsWith(root + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    if (!(await stat(target)).isFile()) { res.writeHead(404); res.end('Not found'); return; }
    const body = await readFile(target);
    res.writeHead(200, {'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store'});
    res.end(body);
  } catch (error) {
    res.writeHead(error?.code === 'ENOENT' ? 404 : 500);
    res.end('File unavailable');
  }
}).listen(port, '127.0.0.1', () => console.log(`NEON BREACH dev server: http://127.0.0.1:${port}`));
