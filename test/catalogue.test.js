'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { listProducts } = require('../src/services/catalogue');

test('defaults to the first page of 20 products', () => {
  const result = listProducts();
  assert.equal(result.page, 1);
  assert.equal(result.pageSize, 20);
  assert.equal(result.total, 10);
  assert.equal(result.totalPages, 1);
  assert.equal(result.products.length, 10);
});

test('returns the requested slice of the catalogue', () => {
  const result = listProducts({ page: 2, pageSize: 3 });
  assert.deepEqual(result.products.map((p) => p.sku), ['CL-1004', 'HG-2001', 'HG-2002']);
  assert.equal(result.totalPages, 4);
});

test('returns a partial last page', () => {
  const result = listProducts({ page: 4, pageSize: 3 });
  assert.deepEqual(result.products.map((p) => p.sku), ['AC-3002']);
});

test('returns no products for a page past the end', () => {
  const result = listProducts({ page: 5, pageSize: 3 });
  assert.deepEqual(result.products, []);
  assert.equal(result.total, 10);
  assert.equal(result.totalPages, 4);
});
