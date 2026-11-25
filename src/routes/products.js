'use strict';

const express = require('express');
const { findBySku } = require('../data/products');
const { listProducts, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../services/catalogue');

const router = express.Router();

// Returns the parsed integer, the fallback when absent, or null when invalid.
// Arrays (repeated params), empty strings, zero, signs and decimals are invalid.
function parsePositiveInt(value, fallback) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
  return Number(value);
}

router.get('/', (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  if (page === null || !Number.isSafeInteger(page)) {
    return res.status(400).json({ error: 'page must be a positive integer' });
  }
  const pageSize = parsePositiveInt(req.query.pageSize, DEFAULT_PAGE_SIZE);
  if (pageSize === null) {
    return res.status(400).json({ error: 'pageSize must be a positive integer' });
  }
  if (pageSize > MAX_PAGE_SIZE) {
    return res.status(400).json({ error: `pageSize must be at most ${MAX_PAGE_SIZE}` });
  }
  res.json(listProducts({ page, pageSize }));
});

router.get('/:sku', (req, res) => {
  const product = findBySku(req.params.sku);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
