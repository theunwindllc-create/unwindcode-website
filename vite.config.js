import { defineConfig } from 'vite';
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { dirname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function discoverHtmlEntries(rootDir, options = {}) {
  const entries = {};
  const ignoreDirs = options.ignoreDirs || new Set();

  function walk(currentDir) {
    for (const item of readdirSync(currentDir, { withFileTypes: true })) {
      if (item.isDirectory()) {
        if (!ignoreDirs.has(item.name)) {
          walk(resolve(currentDir, item.name));
        }
        continue;
      }

      if (!item.isFile() || !item.name.endsWith('.html')) continue;

      const filePath = resolve(currentDir, item.name);
      const rel = relative(rootDir, filePath).replace(/\\/g, '/');
      if (rel === 'index.html') continue;

      const entryName = item.name === 'index.html'
        ? dirname(rel)
        : rel.replace(/\.html$/, '');
      entries[entryName] = filePath;
    }
  }

  if (statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) {
    walk(rootDir);
  }

  return entries;
}

const rootDir = __dirname;
const pageEntries = discoverHtmlEntries(rootDir, {
  ignoreDirs: new Set(['dist', 'node_modules', '.git', '.worktrees', '.vercel', 'tmp', 'social 2']),
});

const transmissionEntries = Object.fromEntries(
  Object.entries(pageEntries).filter(([name]) => name.startsWith('transmissions/')),
);

function copySocialPreviewAssets() {
  return {
    name: 'copy-public-proof-assets',
    closeBundle() {
      for (const [sourceDir, targetDir] of [
        [resolve(__dirname, 'assets', 'social'), resolve(__dirname, 'dist/assets/social')],
        [resolve(__dirname, 'assets', 'visuals'), resolve(__dirname, 'dist/assets/visuals')],
        [resolve(__dirname, 'assets', 'specs'), resolve(__dirname, 'dist/assets/specs')],
        [resolve(__dirname, 'social'), resolve(__dirname, 'dist/social')],
      ]) {
        if (!existsSync(sourceDir)) continue;
        mkdirSync(targetDir, { recursive: true });
        cpSync(sourceDir, targetDir, { recursive: true });
      }

      for (const [sourceFile, targetFile] of [
        [resolve(__dirname, 'sitemap.xml'), resolve(__dirname, 'dist/sitemap.xml')],
        [resolve(__dirname, 'llms.txt'), resolve(__dirname, 'dist/llms.txt')],
        [resolve(__dirname, 'ai-services.json'), resolve(__dirname, 'dist/ai-services.json')],
        [resolve(__dirname, 'assets', 'asset-manifest.json'), resolve(__dirname, 'dist/assets/asset-manifest.json')],
      ]) {
        if (!existsSync(sourceFile)) continue;
        mkdirSync(dirname(targetFile), { recursive: true });
        cpSync(sourceFile, targetFile);
      }
    },
  };
}

export default defineConfig({
  plugins: [copySocialPreviewAssets()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...pageEntries,
      },
    },
  },
});

export { copySocialPreviewAssets, discoverHtmlEntries, transmissionEntries };
