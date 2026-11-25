'use strict';

const { findBySku } = require('../data/products');

// Standard VAT rates by destination country (percent).
// TODO: support reduced VAT rates for children's clothing in countries that have them
const VAT_RATES = {
  DE: 19,
  FR: 20,
  NL: 21,
  IE: 23,
  ES: 21
};

const FREE_SHIPPING_THRESHOLD = 5000; // cents, net
const STANDARD_SHIPPING = 495; // cents, net

function vatRateFor(country) {
  const rate = VAT_RATES[country];
  if (rate === undefined) {
    throw new Error(`Unsupported country: ${country}`);
  }
  return rate;
}

/**
 * Calculate the totals for a list of cart lines.
 * @param {{sku: string, qty: number}[]} lines
 * @param {{country: string}} options
 * @returns {{subtotal: number, shipping: number, vat: number, total: number}} amounts in cents
 */
function calculateTotals(lines, { country = 'DE' } = {}) {
  const subtotal = lines.reduce((sum, line) => {
    const product = findBySku(line.sku);
    if (!product) {
      throw new Error(`Unknown SKU: ${line.sku}`);
    }
    return sum + product.price * line.qty;
  }, 0);

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const vat = Math.round(((subtotal + shipping) * vatRateFor(country)) / 100);

  return { subtotal, shipping, vat, total: subtotal + shipping + vat };
}

module.exports = { calculateTotals, vatRateFor, VAT_RATES, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING };
