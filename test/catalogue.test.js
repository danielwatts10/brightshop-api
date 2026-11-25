'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { listProducts, parsePagination, paginate, PaginationError } = require('../src/services/catalogue');

const skus = (result) => result.products.map((p) => p.sku);

test('defaults to page 1 and pageSize 20 when no parameters are given', () => {
  assert.deepEqual(parsePagination({}), { page: 1, pageSize: 20 });
});

test('returns the whole catalogue on the default page', () => {
  const result = listProducts({});
  assert.equal(result.products.length, 10);
  assert.equal(result.page, 1);
  assert.equal(result.pageSize, 20);
  assert.equal(result.total, 10);
  assert.equal(result.totalPages, 1);
});

test('returns the requested slice for a middle page', () => {
  const result = listProducts({ page: '2', pageSize: '3' });
  assert.deepEqual(skus(result), ['CL-1004', 'HG-2001', 'HG-2002']);
  assert.equal(result.total, 10);
  assert.equal(result.totalPages, 4);
});

test('returns a partial last page', () => {
  assert.deepEqual(skus(listProducts({ page: '4', pageSize: '3' })), ['AC-3002']);
});

test('returns an empty list for a page past the end', () => {
  const result = listProducts({ page: '5', pageSize: '3' });
  assert.deepEqual(result.products, []);
  assert.equal(result.totalPages, 4);
});

test('reports zero pages for an empty list', () => {
  assert.equal(paginate([], { page: 1, pageSize: 20 }).totalPages, 0);
});

test('accepts the maximum pageSize of 100', () => {
  assert.equal(parsePagination({ pageSize: '100' }).pageSize, 100);
});

test('rejects a pageSize above 100', () => {
  assert.throws(() => parsePagination({ pageSize: '101' }), PaginationError);
});

const invalidValues = ['0', '-1', '1.5', 'abc', '', '1e2', ' 1', '99999999999999999999', ['1', '2']];

for (const param of ['page', 'pageSize']) {
  for (const value of invalidValues) {
    test(`rejects ${param}=${JSON.stringify(value)}`, () => {
      assert.throws(() => parsePagination({ [param]: value }), PaginationError);
    });
  }
}
