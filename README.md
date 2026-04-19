# PokéCards

Small React gallery for twenty classic Pokémon TCG cards (Base Set), with pagination (10 per page) and an About page. Built with **Vite**, **React**, **TypeScript**, and **React Router**.

## Prerequisites

- **Node.js** 22.x (recommended: match [`.tool-versions`](.tool-versions) if you use [asdf](https://asdf-vm.com/))
- **npm** 10+ (comes with Node)

## Run locally

1. **Clone the repository** (or open this folder in your editor).

2. **Install dependencies** from the project root:
   > **Note:** You do not need to manually install or set up Vite or other tooling—this project comes pre-configured. When you run `npm install`, all required dependencies (including Vite, React, TypeScript, etc.) are installed automatically based on `package.json`. No extra global or manual setup steps are necessary.

   ```bash
   npm install
   ```

3. **Start the dev server** (hot reload on file changes):

   ```bash
   npm run dev
   ```

4. **Open the app** in your browser using the URL Vite prints (typically [http://127.0.0.1:5173](http://127.0.0.1:5173)). The dev server is configured to listen on IPv4 loopback so `localhost` / `127.0.0.1` stay consistent on macOS.

### Using asdf for Node

If you use asdf and see “No version is set for nodejs”, either run `asdf set nodejs 22.15.0` in this directory (uses `.tool-versions`) or install the version listed there: `asdf install`.

## Other commands

| Command | Description |
|---------|-------------|
| `npm run test` | Unit tests (**Vitest**); JSON report under `.vitest/report.json` (includes run duration) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Unit tests plus **v8** coverage (`coverage/` — HTML + `coverage-summary.json`) |
| `npm run test:report` | `vitest run` with JSON report written to `.vitest/report.json` |
| `npm run build` | Typecheck and produce a production build in `dist/` |
| `npm run preview` | Serve the `dist/` build locally (run after `npm run build`) |
| `npm run lint` | Run ESLint on the project |
| `npm run playwright:install` | Download **Chromium** for Playwright (run once after `npm install`; used by E2E and aligns with `@playwright/test`) |
| `npm run test:e2e` | **Playwright** smoke tests under `e2e/` (starts preview via `playwright.config.ts` unless you already serve `http://127.0.0.1:5173`) |
| `npm run test:e2e:ui` | Playwright **UI mode** for debugging specs |

**E2E vs MCP:** Checked-in Playwright specs are the **CI source of truth**. [Playwright MCP](https://github.com/microsoft/playwright-mcp) in Cursor (see `.cursor/mcp.json`) is for interactive exploration and locator tuning—promote stable checks into `e2e/*.spec.ts`. Use the same base URL as the dev server: `http://127.0.0.1:5173`.

After a normal `npm run playwright:install`, run:

```bash
npm run test:e2e
```

If install keeps failing, try:

```bash
PW_USE_SYSTEM_CHROME=1 npm run test:e2e
```

That uses Google Chrome from your machine instead of the downloaded Chromium (see `playwright.config.ts`). If `playwright:install` fails with TLS errors (e.g. `unable to get local issuer certificate`), fix your Node or corporate proxy cert setup, or rely on the command above when Chrome is installed.

## Project layout

- `src/pages/` — Home (gallery + pagination) and About
- `src/components/` — Layout, card grid, pagination
- `src/data/cards.ts` — Static card list and image URLs
- `documentations/` — Product / architecture notes
- `e2e/` — Playwright end-to-end smoke tests (see `documentations/testing-pyramid-plan.md`)
