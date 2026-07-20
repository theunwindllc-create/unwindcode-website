// Serve the cinematic lab experience at the root domain (Jesus's 2026-07-19 order).
// Vercel's filesystem wins over vercel.json rewrites, so the built homepage file
// itself must be the lab page. The lab HTML uses absolute /lab/* asset paths and
// canonical "/", so a byte copy is safe. The pulse console remains at /home, and
// the source index.html (the homepage spec's subject) is untouched.
import { copyFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
copyFileSync(resolve(root, 'dist/lab/index.html'), resolve(root, 'dist/index.html'));
console.log('[promote-lab-homepage] dist/index.html now serves the lab experience');
