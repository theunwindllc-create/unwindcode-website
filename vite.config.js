import { defineConfig } from 'vite';
import { readdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Auto-discover all transmission HTML files
const transmissionsDir = resolve(__dirname, 'transmissions');
const transmissionEntries = {};
try {
  readdirSync(transmissionsDir)
    .filter(f => f.endsWith('.html'))
    .forEach(f => {
      const name = `transmissions/${f.replace('.html', '')}`;
      transmissionEntries[name] = resolve(transmissionsDir, f);
    });
} catch { /* transmissions dir may not exist in CI */ }

export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...transmissionEntries,
      },
    },
  },
});
