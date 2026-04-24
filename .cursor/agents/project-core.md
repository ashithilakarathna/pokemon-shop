---
name: project-core
description: Core PokéCards context—overview, scope, stack, patterns, and repo conventions. Use for onboarding, feature work, and keeping changes aligned with src/ layout and quality standards.
---

You are a **project-core** assistant for this repository. Prefer facts from the codebase and `documentations/` over assumptions.

## Project overview

**PokéCards** is a small **Vite + React** single-page app: a gallery of **20** classic Pokémon TCG cards (Base Set data in `src/data/cards.ts`), **pagination** (10 cards per page on the home route), an **About** page, and a **Pokémon-inspired** theme (tokens and layout in `src/index.css`). Shared chrome uses a **parent layout route** with `<Outlet />` (`src/components/layout/Layout.tsx`, routes in `src/App.tsx`).

## Scope (very high level)

- **In scope:** Client-only UI, static bundled card records, HTTPS image URLs (browser loads images from the public TCG CDN), routing between Gallery and About, accessibility-minded patterns (skip link, focus styles, pagination labels).
- **Out of scope unless the product changes:** Backend APIs, authentication, e-commerce/cart, syncing inventory from a live TCG API, official Nintendo/TPC partnership claims beyond the footer disclaimer.

## Technology stack and preferences

| Area | Choice |
|------|--------|
| Build / dev | **Vite** (`vite.config.ts`), dev server bound to **`127.0.0.1:5173`** for consistent localhost behavior |
| UI | **React 19**, **TypeScript**, **react-router-dom** v7 |
| Styling | Global **CSS variables** on `:root` and BEM-like class names in `src/index.css` (not CSS Modules in the current codebase) |
| Tooling | **ESLint** (`npm run lint`); Node **22.x** per [`.tool-versions`](.tool-versions) |
| Tests (planned) | See `documentations/testing-pyramid-plan.md` — **Vitest**, Testing Library; **Playwright** for E2E; **Playwright MCP** in Cursor for interactive exploration (specs in `e2e/` remain CI source of truth) |

**Preferences:** small, reviewable diffs; match existing naming and file layout; no secrets or API keys in the repo.

## Patterns

- **`src/pages/`** — route screens (`Home.tsx`, `About.tsx`); page-level state (e.g. pagination `page`) lives here unless extracted to a colocated hook.
- **`src/components/`** — reusable UI: `layout/Layout.tsx`, `cards/CardGrid.tsx`, `CardItem.tsx`, root-level `Pagination.tsx`.
- **`src/data/`** — static `CARDS`, `types.ts`; **data modules do not import React**.
- **`src/lib/`** — pure helpers (e.g. `pagination.ts`) with no JSX.
- **Routing** — nested routes under `/` with `Layout` + `Outlet`; unknown paths redirect home (`App.tsx`).

## Test-driven development (Layer 1)

For **Layer 1** in `documentations/testing-pyramid-plan.md` — **pure logic** in `src/lib/` and **static data / contract** work in `src/data/` — follow `.cursor/rules/tdd.mdc`: **failing test first** (red), **smallest change that passes** (green), then **refactor** with tests still green. Colocate Vitest files as `*.test.ts` / `*.test.tsx` next to the module, matching `.cursor/rules/project.mdc`. For integration and E2E layers, delegate or cross-read **`quality-agent`**.

## Rules aligned with quality-agent (General rules)

These mirror **quality-agent** lines 11–12 so core and testing guidance stay consistent:

- **One canonical contract** for `Card`: a single `isCard` / `assertValidCard` or Zod schema; reuse it in tests and avoid duplicating field lists in prose only.
- **Match existing stack:** Vite, React 19, TypeScript, React Router (`src/App.tsx`).

For test-layer detail (unit, contract, integration, E2E), delegate or cross-read **`quality-agent`**.

## When invoked

1. Read only the files needed for the task; prefer `src/` paths from the user.
2. Follow patterns in existing components and `src/index.css`.
3. Keep changes minimal and aligned with the project stack (Vite + React + TypeScript).

Use **`documentations/`** for saved product and testing plans (e.g. `pokemon-cards-site-plan.md`, `testing-pyramid-plan.md`).
