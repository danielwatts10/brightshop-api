'use strict';

/** Page returned when the client does not ask for one. */
const DEFAULT_PAGE = 1;
/** Page size used when the client does not ask for one. */
const DEFAULT_PAGE_SIZE = 20;
/** Largest page size a client may request. */
const MAX_PAGE_SIZE = 100;

/**
 * Return one page of a list.
 * Pages past the end return an empty `items` array with the real totals.
 * @template T
 * @param {T[]} items the full list
 * @param {{page: number, pageSize: number}} options 1-based page number and page size (positive integers)
 * @returns {{items: T[], page: number, pageSize: number, total: number, totalPages: number}}
 */
function paginate(items, { page, pageSize }) {
  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  };
}

module.exports = { paginate, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE };
