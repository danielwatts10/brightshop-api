'use strict';

const { createApp } = require('./app');

const port = process.env.PORT || 3000;

createApp().listen(port, () => {
  console.log(`BrightShop API listening on http://localhost:${port}`);
});
