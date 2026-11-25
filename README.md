# BrightShop API

Storefront API for BrightShop, a European online retailer: product catalogue, carts and VAT-aware pricing.

## Run it

```bash
npm install
npm test
npm start   # http://localhost:3000
```

## Endpoints

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/health` | Liveness check |
| GET | `/api/products?page=1&pageSize=20` | List the catalogue, paginated (`pageSize` max 100). Returns `{ products, page, pageSize, total, totalPages }` |
| GET | `/api/products/:sku` | One product |
| POST | `/api/carts` | Create a cart, body `{ "country": "DE" }` |
| GET | `/api/carts/:id` | Cart with totals |
| POST | `/api/carts/:id/items` | Add `{ "sku": "CL-1001", "qty": 1 }` |
| GET | `/search?q=` | Legacy HTML search page |

All amounts are in euro cents. Catalogue prices are net; VAT is added for the cart's country.

## Working with Claude Code

- `CLAUDE.md`: project conventions and commands Claude Code follows.
- `test/CLAUDE.md`: extra conventions that apply when working on tests.
- `.claude/agents/`: subagents, such as `test-specialist`.
- `.claude/settings.json`: shared permissions (commands allowed without asking, and ones that are always blocked).
