'use strict';

class ValidationError extends Error {}

/**
 * Filter products by optional query parameters.
 * @param {object[]} products
 * @param {{category?: string, maxPrice?: string, inStock?: string}} query raw query-string values
 * @returns {object[]}
 * @throws {ValidationError} when a filter value is invalid
 */
function filterProducts(products, query = {}) {
  let result = products;

  if (query.category !== undefined) {
    const category = String(query.category).toLowerCase();
    result = result.filter((p) => p.category.toLowerCase() === category);
  }

  if (query.maxPrice !== undefined) {
    if (!/^\d+$/.test(String(query.maxPrice))) {
      throw new ValidationError('maxPrice must be a non-negative whole number of cents');
    }
    const maxPrice = Number(query.maxPrice);
    result = result.filter((p) => p.price <= maxPrice);
  }

  if (query.inStock !== undefined) {
    if (query.inStock !== 'true' && query.inStock !== 'false') {
      throw new ValidationError('inStock must be true or false');
    }
    const wantInStock = query.inStock === 'true';
    result = result.filter((p) => (p.stock > 0) === wantInStock);
  }

  return result;
}

module.exports = { filterProducts, ValidationError };
