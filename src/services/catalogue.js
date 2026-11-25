'use strict';

const { products } = require('../data/products');

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

/**
 * List one page of the product catalogue.
 * Inputs are expected to be validated positive integers (see the products route).
 * A page past the end returns an empty `products` array.
 * @param {{page?: number, pageSize?: number}} [options]
 * @returns {{products: object[], page: number, pageSize: number, total: number, totalPages: number}}
 */
function listProducts({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const total = products.length;
  const start = (page - 1) * pageSize;
  return {
    products: products.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  };
}

module.exports = { listProducts, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE };
