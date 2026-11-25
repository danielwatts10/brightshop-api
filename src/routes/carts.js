'use strict';

const express = require('express');
const crypto = require('node:crypto');
const { findBySku } = require('../data/products');
const { calculateTotals, VAT_RATES } = require('../services/pricing');

const router = express.Router();

// In-memory store; a real service would use a database.
const carts = new Map();

function cartView(cart) {
  return { id: cart.id, country: cart.country, items: cart.items, totals: calculateTotals(cart.items, { country: cart.country }) };
}

router.post('/', (req, res) => {
  const country = (req.body && req.body.country) || 'DE';
  if (!VAT_RATES[country]) {
    return res.status(400).json({ error: `Unsupported country: ${country}` });
  }
  const cart = { id: crypto.randomUUID(), country, items: [] };
  carts.set(cart.id, cart);
  res.status(201).json(cartView(cart));
});

router.get('/:id', (req, res) => {
  const cart = carts.get(req.params.id);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  res.json(cartView(cart));
});

// TODO: validate that qty is a positive integer (it currently accepts 0, negatives and decimals)
router.post('/:id/items', (req, res) => {
  const cart = carts.get(req.params.id);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  const { sku, qty = 1 } = req.body || {};
  const product = findBySku(sku);
  if (!product) {
    return res.status(400).json({ error: `Unknown SKU: ${sku}` });
  }
  const existing = cart.items.find((line) => line.sku === sku);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ sku, qty });
  }
  res.json(cartView(cart));
});

module.exports = router;
