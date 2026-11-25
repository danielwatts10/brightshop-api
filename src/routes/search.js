'use strict';

const express = require('express');
const { products } = require('../data/products');

const router = express.Router();

// Simple HTML search page used by the legacy storefront.
router.get('/', (req, res) => {
  const q = req.query.q || '';
  const matches = products.filter((p) => p.name.toLowerCase().includes(String(q).toLowerCase()));
  const items = matches.map((p) => `<li>${p.name}</li>`).join('');
  res.send(`<h1>Results for ${q}</h1><ul>${items}</ul>`);
});

module.exports = router;
