# Test conventions

- Use `const { test } = require('node:test')` and `const assert = require('node:assert/strict')`.
- One behaviour per `test(...)`, named as a plain sentence: `test('ships free at or above the threshold', ...)`.
- For HTTP tests, start the app with `createApp().listen(0)` and call it with the global `fetch`, as in `test/api.test.js`.
- Assert exact cent amounts. Cover the happy path and at least one error case.
