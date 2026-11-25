# BrightShop API

BrightShop's storefront API: product catalogue, carts and pricing for a European online retailer.

## Commands
- `npm test`: run all tests (built-in Node test runner). Run it after every change.
- `npm start`: start the API on http://localhost:3000.

## Stack
- Node.js 22+, CommonJS modules, Express 4.
- Tests use `node:test` and `node:assert/strict`. Do not add Jest, Mocha or other test frameworks.
- No database: data lives in `src/data/` and carts are kept in memory.

## Conventions
- All money is an integer number of **euro cents**. Never use floating-point euros. Round VAT with `Math.round`.
- Catalogue prices are **net of VAT**. VAT is applied to subtotal plus shipping.
- Business logic belongs in `src/services/`; route handlers in `src/routes/` stay thin.
- Validate request input in the route and return `400` with `{ "error": "<message>" }` for bad input, `404` for missing resources.
- Never interpolate user input into HTML. Escape it, or return JSON.
- Add a JSDoc comment to exported functions.

## Workflow
- Add or update tests in `test/` for every behaviour change, including error cases.
- Make sure `npm test` passes before you finish.
- Work on a branch and open a pull request with `gh pr create`; never push to `main`.
- Don't add dependencies without explaining why in the pull request description.
