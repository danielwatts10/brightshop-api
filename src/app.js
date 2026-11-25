'use strict';

const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const searchRouter = require('./routes/search');

function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/products', productsRouter);
  app.use('/api/carts', cartsRouter);
  app.use('/search', searchRouter);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
