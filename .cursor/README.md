# Cursor project configuration

This folder holds **team-shared** Cursor settings for this repository.

| Path | Purpose |
|------|---------|
| [`rules/`](rules/) | [Project rules](https://cursor.com/docs/context/rules)—`.mdc` files that guide the AI (always-on or glob-scoped). |
| [`agents/`](agents/) | [Custom subagents](https://cursor.com/docs)—`.md` files with frontmatter (`name`, `description`) plus the system prompt in the body. |
| [`hooks.json`](hooks.json) + [`hooks/`](hooks/) | [Hooks](https://cursor.com/docs/agent/hooks)—scripts that run around agent / tool events (optional). |
| [`skills/`](skills/) | [Agent Skills](https://cursor.com/docs/context/skills)—each skill is a folder with `SKILL.md` (optional). |
| [`commands/`](commands/) | Slash commands as `.md` files (optional). |

Add your own agents under `agents/*.md`. See `agents/example-agent.md` for the minimal shape.
