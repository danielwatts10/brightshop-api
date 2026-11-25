# BrightShop API – instructions for Copilot

This is BrightShop's storefront API: product catalogue, carts and pricing for a European online retailer.

## Stack
- Node.js 22+, CommonJS modules, Express 4.
- Tests use the built-in Node test runner (`node:test` and `node:assert/strict`). Run them with `npm test`. Do not add Jest, Mocha or other test frameworks.
- No database: data lives in `src/data/` and carts are kept in memory.

## Conventions
- All money is an integer number of **euro cents**. Never use floating-point euros. Round VAT with `Math.round`.
- Prices in the catalogue are **net of VAT**. VAT is applied to subtotal plus shipping.
- Business logic belongs in `src/services/`; route handlers in `src/routes/` stay thin.
- Validate request input in the route and return `400` with `{ "error": "<message>" }` for bad input, `404` for missing resources.
- Never interpolate user input into HTML. Escape it, or return JSON.
- Keep functions small and add a JSDoc comment to exported functions.

## When you change code
- Add or update tests in `test/` for every behaviour change, including the error cases.
- Run `npm test` and make sure everything passes before you finish.
- Don't add new dependencies without saying why in the pull request description.
