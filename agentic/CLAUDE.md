> **Instructions for coding agents:** this file (`CLAUDE.md`) is read automatically by **Claude Code**. Codex and GitHub Copilot instead read [AGENTS.md](./AGENTS.md), which mirrors this file — keep both in sync when you update either one.
>
> Folder-specific notes only — see the root [CLAUDE.md](../CLAUDE.md) for the global working agreement, which still applies here.

# EASE — agentic/ Notes

- **Purpose** — home for the agent/automation layer: the logic that lets EASE take actions on a user's behalf, not just answer or guide. Maps to the "Assist" and "Agent" modes described in [planning/docs/product/vision.md](../planning/docs/product/vision.md).
- **Status** — empty scaffold, no code yet.
- **Design reference** — build against the MCP server + Docker gateway + graph DB direction in [planning/docs/product/architecture-mechanisms.md](../planning/docs/product/architecture-mechanisms.md) before inventing a new approach.
- **Boundary** — this is the "decide and act" layer only. Request handling belongs in [backend/](../backend), rendering belongs in [frontend/](../frontend) — keep this folder decoupled from both.
