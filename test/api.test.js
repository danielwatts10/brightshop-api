'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

async function request(method, path, body) {
  const res = await fetch(baseUrl + path, {
    method,
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined
  });
  return { status: res.status, body: await res.json() };
}

test('GET /health reports ok', async () => {
  const res = await request('GET', '/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('GET /api/products lists the catalogue', async () => {
  const res = await request('GET', '/api/products');
  assert.equal(res.status, 200);
  assert.ok(res.body.products.length > 0);
});

test('GET /api/products returns pagination metadata with defaults', async () => {
  const res = await request('GET', '/api/products');
  assert.equal(res.status, 200);
  assert.equal(res.body.page, 1);
  assert.equal(res.body.pageSize, 20);
  assert.equal(res.body.total, 10);
  assert.equal(res.body.totalPages, 1);
});

test('GET /api/products returns the requested page', async () => {
  const res = await request('GET', '/api/products?page=2&pageSize=4');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.products.map((p) => p.sku), ['HG-2001', 'HG-2002', 'HG-2003', 'HG-2004']);
  assert.equal(res.body.page, 2);
  assert.equal(res.body.pageSize, 4);
  assert.equal(res.body.totalPages, 3);
});

test('GET /api/products accepts the maximum page size', async () => {
  const res = await request('GET', '/api/products?pageSize=100');
  assert.equal(res.status, 200);
  assert.equal(res.body.pageSize, 100);
});

test('GET /api/products returns an empty list for a page past the end', async () => {
  const res = await request('GET', '/api/products?page=99');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.products, []);
  assert.equal(res.body.totalPages, 1);
});

for (const query of ['page=0', 'page=-1', 'page=abc', 'page=1.5', 'page=', 'page=1&page=2', 'pageSize=0', 'pageSize=101', 'pageSize=2.5']) {
  test(`GET /api/products rejects ${query} with 400`, async () => {
    const res = await request('GET', `/api/products?${query}`);
    assert.equal(res.status, 400);
    assert.equal(typeof res.body.error, 'string');
  });
}

test('GET /api/products/:sku returns 404 for an unknown SKU', async () => {
  const res = await request('GET', '/api/products/NOPE');
  assert.equal(res.status, 404);
});

test('a cart totals the items added to it', async () => {
  const created = await request('POST', '/api/carts', { country: 'NL' });
  assert.equal(created.status, 201);

  const updated = await request('POST', `/api/carts/${created.body.id}/items`, { sku: 'HG-2002', qty: 2 });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.totals.subtotal, 4998);
  assert.equal(updated.body.totals.shipping, 495);
});
