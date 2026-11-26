'use strict';

const express = require('express');
const { products, findBySku } = require('../data/products');
const { paginate, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../services/pagination');

const router = express.Router();

// Parse an optional positive-integer query parameter. Returns { value } or { error }.
function parsePositiveInt(raw, name, { defaultValue, max = Infinity }) {
  if (raw === undefined) {
    return { value: defaultValue };
  }
  if (typeof raw !== 'string' || !/^\d+$/.test(raw)) {
    return { error: `${name} must be a positive integer` };
  }
  const value = Number(raw);
  if (value < 1) {
    return { error: `${name} must be a positive integer` };
  }
  if (value > max) {
    return { error: `${name} must be at most ${max}` };
  }
  return { value };
}

router.get('/', (req, res) => {
  const page = parsePositiveInt(req.query.page, 'page', { defaultValue: DEFAULT_PAGE });
  if (page.error) {
    return res.status(400).json({ error: page.error });
  }
  const pageSize = parsePositiveInt(req.query.pageSize, 'pageSize', {
    defaultValue: DEFAULT_PAGE_SIZE,
    max: MAX_PAGE_SIZE
  });
  if (pageSize.error) {
    return res.status(400).json({ error: pageSize.error });
  }

  const result = paginate(products, { page: page.value, pageSize: pageSize.value });
  res.json({
    products: result.items,
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    totalPages: result.totalPages
  });
});

router.get('/:sku', (req, res) => {
  const product = findBySku(req.params.sku);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
