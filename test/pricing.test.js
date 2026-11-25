'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calculateTotals, vatRateFor } = require('../src/services/pricing');

test('empty cart has zero totals', () => {
  assert.deepEqual(calculateTotals([], { country: 'DE' }), { subtotal: 0, shipping: 0, vat: 0, total: 0 });
});

test('adds standard shipping below the free-shipping threshold', () => {
  const totals = calculateTotals([{ sku: 'CL-1001', qty: 1 }], { country: 'DE' });
  assert.equal(totals.subtotal, 1999);
  assert.equal(totals.shipping, 495);
  assert.equal(totals.vat, Math.round((1999 + 495) * 0.19));
});

test('ships free at or above the threshold', () => {
  const totals = calculateTotals([{ sku: 'CL-1002', qty: 1 }], { country: 'FR' });
  assert.equal(totals.shipping, 0);
  assert.equal(totals.vat, Math.round(6999 * 0.2));
  assert.equal(totals.total, 6999 + Math.round(6999 * 0.2));
});

test('rejects an unknown country', () => {
  assert.throws(() => vatRateFor('XX'), /Unsupported country/);
});
