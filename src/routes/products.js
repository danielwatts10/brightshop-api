'use strict';

const express = require('express');
const { findBySku } = require('../data/products');
const { listProducts, PaginationError } = require('../services/catalogue');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.json(listProducts(req.query));
  } catch (err) {
    if (err instanceof PaginationError) {
      return res.status(400).json({ error: err.message });
    }
    throw err;
  }
});

router.get('/:sku', (req, res) => {
  const product = findBySku(req.params.sku);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
