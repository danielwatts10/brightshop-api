'use strict';

const express = require('express');
const { products, findBySku } = require('../data/products');

const router = express.Router();

// TODO: add pagination to the product listing (page and pageSize query parameters)
router.get('/', (req, res) => {
  res.json({ products });
});

router.get('/:sku', (req, res) => {
  const product = findBySku(req.params.sku);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
