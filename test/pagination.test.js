'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { paginate } = require('../src/services/pagination');

const items = [1, 2, 3, 4, 5, 6, 7];

test('returns the first page', () => {
  assert.deepEqual(paginate(items, { page: 1, pageSize: 3 }), {
    items: [1, 2, 3],
    page: 1,
    pageSize: 3,
    total: 7,
    totalPages: 3
  });
});

test('returns a middle page', () => {
  assert.deepEqual(paginate(items, { page: 2, pageSize: 3 }).items, [4, 5, 6]);
});

test('returns a partial last page', () => {
  assert.deepEqual(paginate(items, { page: 3, pageSize: 3 }).items, [7]);
});

test('returns no items for a page past the end but keeps the totals', () => {
  const result = paginate(items, { page: 10, pageSize: 3 });
  assert.deepEqual(result.items, []);
  assert.equal(result.total, 7);
  assert.equal(result.totalPages, 3);
});

test('counts pages exactly when the total is a multiple of the page size', () => {
  assert.equal(paginate([1, 2, 3, 4, 5, 6], { page: 1, pageSize: 3 }).totalPages, 2);
});

test('reports zero pages for an empty list', () => {
  const result = paginate([], { page: 1, pageSize: 20 });
  assert.deepEqual(result.items, []);
  assert.equal(result.total, 0);
  assert.equal(result.totalPages, 0);
});
