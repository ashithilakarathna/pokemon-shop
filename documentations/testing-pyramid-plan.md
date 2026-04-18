---
name: Testing pyramid plan
overview: "Define a testing pyramid for the PokéCards Vite + React app: heavy unit coverage on pure logic and minimal data-contract checks, focused component/integration tests for routing and UI behavior, and a thin E2E smoke layer using Playwright. E2E authoring and exploration use the Playwright MCP in Cursor. The repo currently has no test runner ([package.json](package.json)); the plan names tooling and concrete cases by layer."
todos:
  - id: add-vitest-rtl
    content: Add Vitest, jsdom, @testing-library/react, vitest.config; npm scripts test / test:watch
    status: pending
  - id: contract-card-shape
    content: "Minimal contract: one validator (or Zod schema) for Card mandatory vs optional fields; unit tests + loop over CARDS"
    status: pending
  - id: unit-pagination-data
    content: Write unit tests for pagination.ts and CARDS length; compose with contract tests as needed
    status: pending
  - id: integration-ui-routes
    content: RTL + MemoryRouter tests for Home pagination, Layout nav, About, wildcard redirect
    status: pending
  - id: e2e-playwright
    content: Add Playwright, webServer preview, 3–5 smoke e2e specs; configure Playwright MCP in Cursor for interactive E2E
    status: pending
  - id: ci-test-scripts
    content: Wire CI (e.g. GitHub Actions) to run lint, test, and optionally e2e
    status: pending
isProject: false
---

# Test plan (testing pyramid)

## Context

- **Stack:** Vite, React 19, TypeScript, React Router ([`src/App.tsx`](src/App.tsx)).
- **Critical pure logic:** [`src/lib/pagination.ts`](src/lib/pagination.ts) (`getTotalPages`, `getPageSlice`, `PAGE_SIZE`).
- **UI surfaces:** [`src/pages/Home.tsx`](src/pages/Home.tsx) (pagination state + grid), [`src/components/Pagination.tsx`](src/components/Pagination.tsx), [`src/components/layout/Layout.tsx`](src/components/layout/Layout.tsx), [`src/pages/About.tsx`](src/pages/About.tsx), [`src/components/cards/CardGrid.tsx`](src/components/cards/CardGrid.tsx) / `CardItem.tsx`.
- **Data:** static [`src/data/cards.ts`](src/data/cards.ts) (20 cards)—validate length and invariants in unit tests if you export a constant or small helper.

```mermaid
flowchart TB
  subgraph e2e [E2E few]
    smoke[Browser smoke flows]
  end
  subgraph integ [Integration some]
    rtl[RTL plus MemoryRouter]
  end
  subgraph unit [Unit many]
    pag[pagination helpers]
    contract[Card shape contract]
    data[CARDS satisfies contract]
  end
  unit --> integ
  integ --> e2e
```

## Recommended toolchain

| Layer | Tooling | Rationale |
|-------|-----------|-----------|
| Unit + integration | **Vitest** + **@vitejs/plugin-react** (already present) + **jsdom** + **@testing-library/react** | Native Vite integration, fast watch mode. |
| Contract (minimal) | Same as unit (**Vitest**); optional **Zod** if you want a single schema source | No separate Pact broker or HTTP mocks in v1. |
| E2E | **Playwright** only | Checked-in `e2e/*.spec.ts`, `playwright.config.ts`, `webServer` for `preview` or dev URL; CI runs `npx playwright test`. |

Add scripts in [package.json](package.json): e.g. `test`, `test:watch`, `test:e2e` (and optionally `test:e2e:ui`).

### Playwright MCP (Cursor)

Use the **[Playwright MCP](https://github.com/microsoft/playwright-mcp)** server in Cursor for **interactive** E2E work: drive a real browser from the agent, reproduce steps, capture selectors, and debug flakiness **without** replacing the committed Playwright test suite.

| Concern | Playwright MCP | Playwright test files (`e2e/`) |
|---------|----------------|----------------------------------|
| Purpose | Exploration, authoring aid, manual-style verification in chat | Regression suite, CI gate, repeatable assertions |
| When | Designing a new flow, validating a bug, refining locators | After behavior is understood; lock in smoke flows |
| Source of truth | Proposes steps and selectors; human reviews | `expect(...)` in version control |

**Rules:** MCP sessions do not replace CI; new stable behavior should end up as **Playwright specs** under `e2e/`. Keep MCP pointed at the same **base URL** as `playwright.config.ts` (e.g. local preview on `127.0.0.1`) so selectors match CI runs.

---

## Layer 1 — Unit tests (base, largest volume)

**Target files:** primarily [`src/lib/pagination.ts`](src/lib/pagination.ts); optionally tiny pure helpers if you extract any from `Home`.

**`getTotalPages`**

- `itemCount = 0`, positive `pageSize` → expect `1` (current `Math.max(1, ceil(0))` behavior—document as spec).
- `itemCount = 20`, `pageSize = 10` → `2`.
- `itemCount = 21`, `pageSize = 10` → `3`.
- `itemCount = 1`, `pageSize = 10` → `1`.

**`getPageSlice`**

- Twenty items, page `1`, size `10` → first ten IDs/names match first half of fixture.
- Page `2` → second ten.
- `page = 0` or negative → clamps to page `1`.
- `page` greater than total → clamps to last page.
- Empty `items` → empty slice; total pages still `1`.

**Data**

- `CARDS.length === 20`.
- Contract coverage overlaps with the section below; keep **one** canonical definition of “valid card” (helper or schema) and assert `CARDS` in a loop.

Do **not** unit-test external TCG image URLs over the network; keep tests offline.

### Contract testing (minimal, still Layer 1)

Treat the **`Card`** shape as the **consumer contract** for all UI that reads [`src/data/types.ts`](src/data/types.ts). This is **not** a bilateral HTTP pact with the Pokemon TCG API (no live provider); it is **offline shape validation** so bad edits to [`src/data/cards.ts`](src/data/cards.ts) fail CI fast.

| Field | Required? | Rule (minimal) |
|-------|-----------|----------------|
| `id` | **Mandatory** | Non-empty string |
| `name` | **Mandatory** | Non-empty string |
| `imageUrl` | **Mandatory** | Non-empty string; optionally `^https?:` if you want one extra guard |
| `setName` | **Optional** | If present, must be a string (may be empty only if you allow it—prefer non-empty when present) |
| `rarity` | **Optional** | If present, must be a string |

**Example invalid payloads (tests should reject or `safeParse` failure):**

- `{}` — missing mandatory fields.
- `{ id: 'x', name: '', imageUrl: 'https://example.com/a.png' }` — empty `name`.
- `{ id: 'x', name: 'Y', imageUrl: '' }` — empty `imageUrl`.

**Example valid payloads:**

- `{ id: 'base1-1', name: 'Alakazam', imageUrl: 'https://images.pokemontcg.io/base1/1.png' }` — no optional fields.
- Same object with `setName: 'Base Set', rarity: 'Rare Holo'` — optional fields present.

**Minimal implementation:** one pure function `assertValidCard(c: unknown): asserts c is Card` or `isCard(c): c is Card`, **or** a single **Zod** `CardSchema` with `.strict()` on unknown keys only if you want to forbid typos like `imageURL`—otherwise keep default loose object parsing. Run `CARDS.forEach(assertValidCard)` in one test.

---

## Layer 2 — Integration tests (middle, fewer)

Use **Vitest + jsdom + React Testing Library** with **`MemoryRouter`** (and optional `Routes` matching [`src/App.tsx`](src/App.tsx)) so navigation does not need a real browser.

**Layout + routing**

- Render app (or `Layout` + child routes) with initial entry `/`: nav shows Gallery as active; About link present.
- Navigate to `/about`: About heading visible; “Back to gallery” (or equivalent) link works.
- Unknown path: still covered by `<Navigate to="/" replace />` in [`src/App.tsx`](src/App.tsx)—assert redirect behavior with `initialEntries={['/nope']}`.

**Home + pagination**

- Initial load: exactly **10** card titles (or images) from first page; “Page **1** of **2**” (or accessible name) present.
- Click **Next**: shows second set of 10; status “Page 2 of 2”; **Next** disabled.
- Click **Previous**: back to page 1; **Previous** disabled on page 1.
- Keyboard / a11y: tab to pagination buttons; `aria-disabled` / `disabled` matches spec ([`src/components/Pagination.tsx`](src/components/Pagination.tsx)).

**Pagination component in isolation**

- With controlled `page` / callbacks from tests: assert disabled states and that `onPrev` / `onNext` fire when enabled.

**CardGrid / CardItem**

- Given a short mock `cards` array: correct number of list items / articles; image `alt` includes card name ([`src/components/cards/CardItem.tsx`](src/components/cards/CardItem.tsx)).

---

## Layer 3 — E2E tests (top, smallest set)

**Runner:** **Playwright** (mandatory for this project).

**Setup:** Start app once per CI job (`npm run build && npm run preview` with fixed port, or `vite dev` in background); `baseURL` in Playwright config (align host with [`vite.config.ts`](vite.config.ts) `server.host`, e.g. `http://127.0.0.1:5173`).

**Playwright MCP:** Enable in Cursor **Settings → MCP** (add the Playwright MCP server per upstream docs). Use it to explore flows and validate locators; **promote** stable checks into `e2e/*.spec.ts` so CI stays authoritative.

**Flows (3–5 tests max to start)**

1. Open home → see “Featured cards” (or main heading) and at least one card image loads (or network idle for document).
2. Pagination: Next → page indicator updates; Previous returns.
3. Open About via header nav → About content visible; follow link back to gallery.
4. Optional: direct navigation to `/about` and back with browser history.

Avoid asserting on third-party image CDN pixel-perfect; assert DOM structure and navigation instead.

---

## Non-functional / quality gates

- Run **unit + integration** on every PR (`npm test` in CI).
- Run **E2E** on main or nightly if cost is a concern; otherwise on PR with cache.
- Keep **ESLint** ([`npm run lint`](package.json)) in CI; optionally add **`typescript-eslint` test file patterns** when tests live under `src/**/*.test.ts(x)` or `tests/**`.

---

## File layout (suggested)

| Path | Purpose |
|------|---------|
| `vitest.config.ts` | Vitest + jsdom + alias match Vite |
| `src/lib/pagination.test.ts` | Unit tests |
| `src/data/cardContract.test.ts` (or `src/lib/validateCard.test.ts`) | Contract / shape tests + `CARDS` sweep |
| `src/data/validateCard.ts` or `cardSchema.ts` (optional) | Single place for mandatory vs optional rules |
| `src/pages/Home.test.tsx` | Integration |
| `src/App.test.tsx` or `src/test/router.tsx` | Route integration |
| `e2e/*.spec.ts` | Playwright specs |
| `playwright.config.ts` | Browsers, `webServer` command |

---

## Out of scope (initial pyramid)

- Visual regression / Percy unless you explicitly want it.
- Load testing the static site.
- **Consumer–provider HTTP contract** testing (e.g. Pact) against `images.pokemontcg.io` or the TCG REST API—adds brokers, flakiness, and little value while [`src/data/cards.ts`](src/data/cards.ts) remains static. Revisit only if the app gains a real API client with stable OpenAPI/Pact fixtures.

