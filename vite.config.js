import { defineConfig } from 'vite';
import { cpSync, existsSync, readdirSync, rmSync } from 'fs';
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

function copySocialPacketsToDist() {
  return {
    name: 'copy-social-packets-to-dist',
    apply: 'build',
    closeBundle() {
      const sourceDir = resolve(__dirname, 'social');
      const targetDir = resolve(__dirname, 'dist/social');

      if (!existsSync(sourceDir)) {
        return;
      }

      rmSync(targetDir, { recursive: true, force: true });
      cpSync(sourceDir, targetDir, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [copySocialPacketsToDist()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...transmissionEntries,
      },
    },
  },
});
