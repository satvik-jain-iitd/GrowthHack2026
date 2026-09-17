> **Instructions for coding agents:** this file (`AGENTS.md`) is the working agreement read by **Codex** and **GitHub Copilot**. Claude Code instead reads [CLAUDE.md](./CLAUDE.md), which mirrors this file — keep both in sync when you update either one.
>
> Folder-specific notes only — see the root [AGENTS.md](../AGENTS.md) for the global working agreement, which still applies here.

# EASE — backend/ Notes

- **Status** — empty scaffold, no code yet. This will hold the API/service layer behind [frontend/](../frontend) and whatever [agentic/](../agentic) calls into.
- **Before picking a framework/pattern** — check the relevant ADRs in [architecture/architecture-portal/docs/](../architecture/architecture-portal/docs) (API Integration Platforms, Event Brokers & Messaging, Observability) so this stays conformant from day one instead of needing rework.
- **Secrets** — never commit API keys, DB creds, or tokens from this layer; follow the same `.env`-gitignore convention used at the repo root.
- **Data layer** — schema/migrations/config belong in [database/](../database), not here — keep service code and schema ownership separate.
