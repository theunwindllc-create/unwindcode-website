import assert from 'node:assert/strict';
import test from 'node:test';

import architectureHandler from '../api/architecture.js';
import * as architectureApi from '../api/architecture.js';

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {
      this.body = '';
      return this;
    },
  };
}

test('returns the public architecture registry with cache headers', async () => {
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.match(res.headers['cache-control'], /public/);
  assert.equal(res.body.success, true);
  assert.equal(res.body.registry.review_status, 'public_safe_draft');
  assert.ok(res.body.registry.concepts.length >= 5);
});

test('returns one public architecture concept by id', async () => {
  const req = {
    method: 'GET',
    query: { id: 'four-tier-memory-architecture' },
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(Object.keys(res.body).sort(), ['concept', 'success']);
  assert.equal(res.body.concept.id, 'four-tier-memory-architecture');
  assert.equal(res.body.concept.review_status, 'public_safe');
});

test('filters public architecture concepts by category', async () => {
  const req = {
    method: 'GET',
    query: { category: 'memory' },
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.concepts.length >= 1);
  assert.ok(
    res.body.concepts.every((concept) => concept.category === 'memory'),
    'category filter should only return matching concepts',
  );
});

test('rejects malformed architecture lookup values', async () => {
  const req = {
    method: 'GET',
    query: { id: '../../private' },
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Invalid architecture id' });
});

test('returns non-cacheable errors for unknown architecture concepts', async () => {
  const req = {
    method: 'GET',
    query: { id: 'missing-concept' },
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Architecture concept not found' });
});

test('rejects write methods on the public architecture registry', async () => {
  const req = {
    method: 'POST',
    query: {},
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Method not allowed' });
});

test('architecture registry loader failures are non-cacheable and generic', async () => {
  assert.equal(typeof architectureApi.createArchitectureHandler, 'function');

  const handler = architectureApi.createArchitectureHandler({
    loadRegistry: async () => {
      throw new Error('/private/path/architecture.json failed');
    },
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load architecture registry' });
  assert.equal(JSON.stringify(res.body).includes('/private/path'), false);
});
