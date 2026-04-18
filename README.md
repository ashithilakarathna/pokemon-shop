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
| `npm run build` | Typecheck and produce a production build in `dist/` |
| `npm run preview` | Serve the `dist/` build locally (run after `npm run build`) |
| `npm run lint` | Run ESLint on the project |

## Project layout

- `src/pages/` — Home (gallery + pagination) and About
- `src/components/` — Layout, card grid, pagination
- `src/data/cards.ts` — Static card list and image URLs
- `documentations/` — Product / architecture notes
