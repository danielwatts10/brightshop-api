'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { products } = require('../src/data/products');
const { filterProducts, ValidationError } = require('../src/services/catalogue');

test('returns every product with no filters', () => {
  assert.equal(filterProducts(products, {}).length, products.length);
});

test('filters by category, ignoring case', () => {
  const result = filterProducts(products, { category: 'HOME' });
  assert.ok(result.length > 0);
  assert.ok(result.every((p) => p.category === 'home'));
});

test('filters by maximum net price in cents', () => {
  const result = filterProducts(products, { maxPrice: '2500' });
  assert.ok(result.every((p) => p.price <= 2500));
  assert.ok(result.some((p) => p.sku === 'HG-2002'));
});

test('filters to products in stock', () => {
  const result = filterProducts(products, { inStock: 'true' });
  assert.ok(result.every((p) => p.stock > 0));
  assert.ok(!result.some((p) => p.sku === 'HG-2004'));
});

test('combines filters', () => {
  const result = filterProducts(products, { category: 'home', maxPrice: '7500', inStock: 'true' });
  assert.deepEqual(result.map((p) => p.sku), ['HG-2001', 'HG-2002', 'HG-2003']);
});

test('rejects a non-numeric or negative maxPrice', () => {
  assert.throws(() => filterProducts(products, { maxPrice: 'abc' }), ValidationError);
  assert.throws(() => filterProducts(products, { maxPrice: '-1' }), ValidationError);
});

test('rejects an invalid inStock value', () => {
  assert.throws(() => filterProducts(products, { inStock: 'yes' }), ValidationError);
});
