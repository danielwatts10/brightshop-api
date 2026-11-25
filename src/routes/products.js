'use strict';

const express = require('express');
const { products, findBySku } = require('../data/products');
const { filterProducts, ValidationError } = require('../services/catalogue');

const router = express.Router();

// TODO: add pagination to the product listing (page and pageSize query parameters)
router.get('/', (req, res) => {
  try {
    res.json({ products: filterProducts(products, req.query) });
  } catch (err) {
    if (err instanceof ValidationError) {
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
