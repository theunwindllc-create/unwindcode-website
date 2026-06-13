import assert from 'node:assert/strict';
import test from 'node:test';

import viteConfig from '../vite.config.js';

test('vite build copies prepared social packets into public dist routes', () => {
  const config = typeof viteConfig === 'function'
    ? viteConfig({ command: 'build', mode: 'test' })
    : viteConfig;

  const plugins = Array.isArray(config.plugins) ? config.plugins : [];
  const copyPlugin = plugins.find((plugin) => plugin?.name === 'copy-social-packets-to-dist');

  assert.ok(copyPlugin, 'Vite should include the social packet copy plugin');
  assert.equal(copyPlugin.apply, 'build');
  assert.equal(typeof copyPlugin.closeBundle, 'function');
});
