---
name: e2e-tests
description: >-
  Writes Playwright end-to-end smoke tests for this repo using @playwright/test,
  Playwright-native BDD-style structure (nested test.describe for Feature/Scenario),
  and role-based locators. Use when adding or changing E2E coverage, Playwright
  specs, browser smoke flows, or when the user mentions e2e/, playwright, or
  layer-3 tests alongside documentations/testing-pyramid-plan.md.
---

# E2E tests (Playwright)

## Scope

- Add or edit **Playwright E2E tests only** under the **`e2e/`** directory at the repo root. Do **not** place Playwright specs under `src/` or elsewhere.
- **One file per feature** (or cohesive user-facing area): create a new file such as `e2e/<feature>.spec.ts` (e.g. `e2e/about-navigation.spec.ts`, `e2e/gallery-home.spec.ts`). Prefer **`*.spec.ts`** so Playwright discovers tests via `playwright.config.ts` `testDir` / `testMatch`. If you split a large feature, keep related scenarios in that feature’s file rather than one giant catch-all, unless the team standard is a single smoke file (see `documentations/testing-pyramid-plan.md`).

## Conventions

- Follow **`documentations/testing-pyramid-plan.md`**: `baseURL` / host aligned with `vite.config.ts` (e.g. `http://127.0.0.1:5173`), `webServer` for preview in CI, MCP for exploration only—**checked-in specs are the CI source of truth**.
- Structure tests as **Playwright-native BDD**: outer `test.describe('Feature: …')`, inner `test('Scenario: …', …)` with clear titles. Optional thin helpers live in **`e2e/support/`** (e.g. `given*` / `when*` / `then*`) only when they improve readability.
- Prefer **accessible roles and names** (`getByRole`, `getByLabel`) consistent with RTL integration tests and real copy in the app (e.g. pagination `aria-label` **“Card pages”**, buttons **“Next page”** / **“Previous page”**).
- Avoid brittle assertions on third-party assets (e.g. TCG image CDN bytes); assert **DOM and navigation** instead.
- **Comments:** Add short comments where they help a future reader—non-obvious waits, workarounds for flakiness, or why a locator was chosen over alternatives. Do not comment every obvious line.

## When not to use E2E

- Pure logic, routing without a browser, or component behavior already covered faster with **Vitest + RTL**—keep those in `src/**/*.test.tsx` per the pyramid.

---

## Example

Use this shape as the default pattern for new files under `e2e/`:

```ts
import { test, expect } from '@playwright/test'

// Example: one smoke scenario for the gallery home page.
// Real suites: group related scenarios under the same Feature describe in one file per feature.

test.describe('Feature: Gallery home', () => {
  test('Scenario: visitor sees the featured gallery', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: /featured cards/i }),
    ).toBeVisible()

    // At least one card surface in the grid (article + heading is stable for this app).
    await expect(page.getByRole('article').first()).toBeVisible()
  })
})
```
