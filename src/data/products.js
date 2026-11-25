'use strict';

// Prices are net of VAT, in euro cents.
const products = [
  { sku: 'CL-1001', name: 'Organic cotton T-shirt', category: 'clothing', price: 1999, stock: 120 },
  { sku: 'CL-1002', name: 'Merino wool jumper', category: 'clothing', price: 6999, stock: 35 },
  { sku: 'CL-1003', name: 'Slim-fit chinos', category: 'clothing', price: 4499, stock: 60 },
  { sku: 'CL-1004', name: 'Rain jacket', category: 'clothing', price: 8999, stock: 18 },
  { sku: 'HG-2001', name: 'Linen duvet cover', category: 'home', price: 5999, stock: 40 },
  { sku: 'HG-2002', name: 'Stoneware mug set (4)', category: 'home', price: 2499, stock: 75 },
  { sku: 'HG-2003', name: 'Oak serving board', category: 'home', price: 3499, stock: 22 },
  { sku: 'HG-2004', name: 'Wool throw blanket', category: 'home', price: 7499, stock: 0 },
  { sku: 'AC-3001', name: 'Canvas tote bag', category: 'accessories', price: 1299, stock: 200 },
  { sku: 'AC-3002', name: 'Leather belt', category: 'accessories', price: 3999, stock: 45 }
];

function findBySku(sku) {
  return products.find((p) => p.sku === sku);
}

module.exports = { products, findBySku };
