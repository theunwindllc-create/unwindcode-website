// Local-only adapter for the existing handlers; never deployed or a provider proxy.
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, realpath } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const built = await realpath(resolve(root, 'dist'));
// Configuration remains server-only; no values or prompts are logged.
for (const [key, value] of Object.entries(loadEnv('development', root, ''))) {
  if (process.env[key] === undefined) process.env[key] = value;
}
const handlers = Object.fromEntries(await Promise.all(['chat', 'grounding', 'search', 'status'].map(async name =>
  [`/api/${name}`, (await import(`../api/${name}.js`)).default])));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.woff2':'font/woff2', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8', '.pdf':'application/pdf' };
const port = Number(process.env.ATLAS_PORT || 52498);
const hosts = new Set([`localhost:${port}`, `127.0.0.1:${port}`, `[::1]:${port}`]);
const server = http.createServer(async (req, res) => {
  try {
    if (!hosts.has(req.headers.host)) { res.writeHead(403).end(); return; }
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const path = decodeURIComponent(url.pathname);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (handlers[path]) {
      if (req.headers.origin && !hosts.has(new URL(req.headers.origin).host)) { res.writeHead(403).end(); return; }
      req.query = Object.fromEntries(url.searchParams);
      if (req.method === 'POST') {
        let body = '';
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 16384) { res.writeHead(413).end(); return; }
        }
        try { req.body = body ? JSON.parse(body) : {}; } catch { res.writeHead(400).end(); return; }
      }
      res.status = code => { res.statusCode = code; return res; };
      res.json = value => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(value)); };
      await handlers[path](req, res);
      return;
    }
    if (!['GET','HEAD'].includes(req.method) || path.startsWith('/api/')) { res.writeHead(404).end(); return; }
    if (path.split('/').some(part => part.startsWith('.') && part !== '')) { res.writeHead(404).end(); return; }
    const candidate = resolve(built, `.${path}`);
    if (!candidate.startsWith(built + sep) && candidate !== built) { res.writeHead(404).end(); return; }
    let file;
    for (const option of [candidate, `${candidate}.html`, resolve(candidate, 'index.html')]) {
      try {
        if (!(await stat(option)).isFile()) continue;
        const physical = await realpath(option);
        if (!physical.startsWith(built + sep)) continue;
        file = physical; break;
      } catch {}
    }
    if (!file) { res.writeHead(404).end('Not found'); return; }
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'HEAD') { res.end(); return; }
    createReadStream(file).pipe(res);
  } catch { if (!res.headersSent) res.writeHead(500); res.end('Request unavailable'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Atlas local preview: http://localhost:${port}`));
