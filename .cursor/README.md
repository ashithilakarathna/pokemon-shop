# Cursor project configuration

This folder holds **team-shared** Cursor settings for this repository.

| Path | Purpose |
|------|---------|
| [`rules/`](rules/) | [Project rules](https://cursor.com/docs/context/rules)—`.mdc` files that guide the AI (always-on or glob-scoped). |
| [`agents/`](agents/) | [Custom subagents](https://cursor.com/docs)—`.md` files with frontmatter (`name`, `description`) plus the system prompt in the body. |
| [`hooks.json`](hooks.json) + [`hooks/`](hooks/) | [Hooks](https://cursor.com/docs/agent/hooks)—scripts that run around agent / tool events (optional). |
| [`skills/`](skills/) | [Agent Skills](https://cursor.com/docs/context/skills)—each skill is a folder with `SKILL.md` (optional). |
| [`commands/`](commands/) | Slash commands as `.md` files (optional). |
| [`mcp.json`](mcp.json) | [Model Context Protocol](https://cursor.com/docs/context/mcp) servers for this workspace (e.g. Playwright browser tools). |

### Playwright MCP

1. Run **`npm install`** in the repo root (installs `@playwright/mcp`).
2. Run **`npm run playwright:install`** once to download the Chromium build Playwright uses (or rely on the first MCP run to trigger a download).
3. Restart Cursor so it picks up [`.cursor/mcp.json`](mcp.json). Confirm the server under **Settings → MCP** shows as connected.
4. Start the app (**`npm run dev`** or preview) and open **`http://127.0.0.1:5173`** in MCP-driven flows so URLs match [`vite.config.ts`](../vite.config.ts) (see `documentations/testing-pyramid-plan.md`).

Add your own agents under `agents/*.md`. This repo includes **`agents/project-core.md`** (overview, stack, patterns) and **`agents/quality-agent.md`** (testing pyramid; `documentations/testing-pyramid-plan.md`).
