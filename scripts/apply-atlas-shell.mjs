// Explicit visitor-facing allowlist. Never decorate creator/social proof artifacts.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(resolve(root, 'public/data/transmissions.json'), 'utf8'));
export const publicRoutes = [
  '/lab', '/home', '/architecture', '/philosophy', '/vision', '/build-with-us',
  '/organisms', '/organisms/visual-cortex', '/organisms/infinity-mirror',
  '/organisms/financial-organisms', '/organisms/brain-cell-architecture',
  '/organisms/research-organisms', '/organisms/infinity-mirror/experience',
  '/proof', '/proof/ledger', '/transmissions',
  ...registry.transmissions.map(t => t.route),
];
export const cellAssets = {
  'visual-cortex': {asset:'visual-cortex-v2', code:'VC / 01'},
  'infinity-mirror': {asset:'infinity-mirror-v2', code:'IM / 02'},
  'financial-organisms': {asset:'financial-organisms-v2', code:'FO / 03'},
  'brain-cell-architecture': {asset:'brain-cell-v2', code:'BC / 04'},
};

export function enhanceHtml(html, route) {
  if (!publicRoutes.includes(route) || html.includes('data-atlas-shell="v2"')) return html;
  const cell = route.startsWith('/organisms/') ? route.split('/')[2] : '';
  const landing = route === '/lab';
  html = html.replace(/<body([^>]*)>/i, (_, attrs) => {
    const classes = `atlas-page${landing ? ' atlas-landing' : ''}`;
    attrs = /class="/.test(attrs) ? attrs.replace(/class="([^"]*)"/, `class="$1 ${classes}"`) : `${attrs} class="${classes}"`;
    return `<body${attrs} data-atlas-shell="v2" data-atlas-cell="${cell}">`;
  });
  const shared = `\n<link rel="stylesheet" href="/atlas/site.css" />\n<link rel="stylesheet" href="/atlas/motion.css" />\n<link rel="stylesheet" href="/atlas/brain.css" />\n<script type="module" src="/atlas/site.js"></script>\n<script type="module" src="/atlas/motion.js"></script>\n<script type="module" src="/atlas/brain.js"></script>\n`;
  const noScript = '<noscript><style>.atlas-page .reveal{opacity:1;transform:none}.atlas-page #nav{position:relative;display:flex;flex-wrap:wrap}.atlas-page #nav .nav-links{position:static;display:flex;flex-wrap:wrap;transform:none;opacity:1;visibility:visible;pointer-events:auto;width:100%;max-height:none;order:3}.atlas-page #nav-toggle{display:none}</style></noscript>';
  html = html.replace('</head>', `${shared}${noScript}</head>`);
  if (!/rel=["'](?:shortcut )?icon["']/.test(html)) html = html.replace('</head>', '<link rel="icon" type="image/svg+xml" href="/atlas/favicon.svg" /></head>');
  let art = cellAssets[cell];
  if (!art && ['/architecture', '/organisms', '/philosophy', '/vision', '/build-with-us', '/proof'].includes(route)) {
    art = { asset: route === '/architecture' ? 'brain-cell-v2' : 'infinity-core', code: 'UNWIND / ATLAS' };
  }
  if (art && !route.endsWith('/experience')) {
    const width = art.asset === 'infinity-core' ? 800 : 960;
    const figure = `<figure class="atlas-hero-art" data-atlas-art aria-hidden="true"><img data-atlas-image src="/lab/media/atlas/${art.asset}-1536.webp" srcset="/lab/media/atlas/${art.asset}-${width}.webp ${width}w, /lab/media/atlas/${art.asset}-1536.webp 1536w" sizes="(max-width: 850px) 92vw, 58vw" width="1536" height="1024" alt="" decoding="async" fetchpriority="high" /><figcaption><span>${art.code}</span><span data-atlas-en="CONCEPTUAL STUDY" data-atlas-es="ESTUDIO CONCEPTUAL">CONCEPTUAL STUDY</span></figcaption></figure>`;
    html = html.replace(/(<section class="lab-hero[^\"]*">\s*<div class="container">)/, `$1${figure}`);
  }
  if (route === '/transmissions') {
    html = html.replace(/(<p class="tx-index-standard"><span>)\d+(<\/span>)/, `$1${registry.transmissions.length}$2`)
      .replace(/(<dl class="tx-index-count"[^>]*>\s*<div>\s*<dt>)\d+(<\/dt>)/, `$1${registry.transmissions.length}$2`);
  }
  if (route === '/organisms') {
    const names = ['Visual Cortex', 'Infinity Mirror', 'Financial Organisms', 'Brain Cell Architecture'];
    const shelf = `<div class="container atlas-cell-shelf" aria-label="Organisms">${Object.entries(cellAssets).map(([id, item], index) => `<a class="atlas-cell-link" data-atlas-cell="${id}" href="/organisms/${id}"><img src="/lab/media/atlas/${item.asset}-480.webp" width="1536" height="1024" alt="" loading="lazy" decoding="async" /><small>${item.code}</small><strong>${names[index]}</strong></a>`).join('')}</div>`;
    html = html.replace(/(<section class="lab-hero[\s\S]*?<\/section>)/, `$1${shelf}`);
  }
  return html;
}

export function applyAtlasShell() {
  const staticDir = resolve(root, 'dist/atlas/static-svg');
  mkdirSync(staticDir, {recursive:true});
  for (const route of publicRoutes) {
    const path = [resolve(root, `dist${route}.html`), resolve(root, `dist${route}/index.html`)].find(existsSync);
    if (!path) throw new Error(`Missing public route: ${route}`);
    let html = enhanceHtml(readFileSync(path, 'utf8'), route);
    // SVGs used as images have isolated style contexts. Parent CSS cannot pause
    // their animation; generate non-animated copies without altering the masters.
    html = html.replace(/<img\b[^>]*>/g, tag => {
      if (tag.includes('data-atlas-static-src')) return tag;
      const src = tag.match(/\bsrc="(\/assets\/[^"?]+\.svg)(?:\?[^\"]*)?"/)?.[1];
      if (!src) return tag;
      const sourcePath = resolve(root, `dist${src}`);
      if (!sourcePath.startsWith(resolve(root, 'dist/assets') + '/') || !existsSync(sourcePath)) return tag;
      const svg = readFileSync(sourcePath, 'utf8');
      if (!/@keyframes|<animate\b/.test(svg)) return tag;
      const name = `${basename(src, '.svg')}-still.svg`;
      const still = svg.replace(/<animate(?:Transform|Motion)?\b[\s\S]*?(?:\/>|<\/animate(?:Transform|Motion)?>)/g, '')
        .replace('</svg>', '<style>*{animation:none!important;transition:none!important}</style></svg>');
      writeFileSync(resolve(staticDir, name), still);
      return tag.replace('<img', `<img data-atlas-static-src="/atlas/static-svg/${name}"`);
    });
    writeFileSync(path, html);
  }
  console.log(`[atlas] enhanced ${publicRoutes.length} public routes; root follows lab promotion`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) applyAtlasShell();
