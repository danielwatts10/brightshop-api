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
| GET | `/api/products` | List the catalogue |
| GET | `/api/products/:sku` | One product |
| POST | `/api/carts` | Create a cart, body `{ "country": "DE" }` |
| GET | `/api/carts/:id` | Cart with totals |
| POST | `/api/carts/:id/items` | Add `{ "sku": "CL-1001", "qty": 1 }` |
| GET | `/search?q=` | Legacy HTML search page |

All amounts are in euro cents. Catalogue prices are net; VAT is added for the cart's country.

## Working with Copilot

- `.github/copilot-instructions.md`: repository-wide conventions Copilot follows.
- `.github/instructions/`: path-specific instructions (tests).
- `.github/agents/`: custom agents, such as `test-specialist`.
- `.github/workflows/copilot-setup-steps.yml`: prepares the coding agent's environment.
- `.vscode/mcp.json`: GitHub MCP server for agent mode in VS Code.
