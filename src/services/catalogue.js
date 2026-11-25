'use strict';

const { products } = require('../data/products');

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const POSITIVE_INTEGER = /^[1-9]\d*$/;

/**
 * Raised when pagination query parameters are invalid. The message is safe to return to clients.
 */
class PaginationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PaginationError';
  }
}

function parsePositiveInteger(value) {
  if (typeof value !== 'string' || !POSITIVE_INTEGER.test(value)) {
    return null;
  }
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : null;
}

/**
 * Read and validate `page` and `pageSize` from a request query object.
 * Missing values fall back to the defaults.
 * @param {Record<string, unknown>} query
 * @returns {{page: number, pageSize: number}}
 * @throws {PaginationError} if either value is not a positive integer, or pageSize exceeds MAX_PAGE_SIZE
 */
function parsePagination(query = {}) {
  let page = DEFAULT_PAGE;
  if (query.page !== undefined) {
    page = parsePositiveInteger(query.page);
    if (page === null) {
      throw new PaginationError('page must be a positive integer');
    }
  }

  let pageSize = DEFAULT_PAGE_SIZE;
  if (query.pageSize !== undefined) {
    pageSize = parsePositiveInteger(query.pageSize);
    if (pageSize === null || pageSize > MAX_PAGE_SIZE) {
      throw new PaginationError(`pageSize must be an integer between 1 and ${MAX_PAGE_SIZE}`);
    }
  }

  return { page, pageSize };
}

/**
 * Return one page of items with pagination metadata.
 * A page past the end yields an empty `products` array.
 * @param {object[]} items
 * @param {{page: number, pageSize: number}} options
 * @returns {{products: object[], page: number, pageSize: number, total: number, totalPages: number}}
 */
function paginate(items, { page, pageSize }) {
  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    products: items.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  };
}

/**
 * List the catalogue, paginated according to the request query.
 * @param {Record<string, unknown>} query
 * @returns {{products: object[], page: number, pageSize: number, total: number, totalPages: number}}
 * @throws {PaginationError} for invalid pagination parameters
 */
function listProducts(query) {
  return paginate(products, parsePagination(query));
}

module.exports = {
  listProducts,
  paginate,
  parsePagination,
  PaginationError,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE
};
