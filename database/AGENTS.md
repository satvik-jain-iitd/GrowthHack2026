> **Instructions for coding agents:** this file (`AGENTS.md`) is the working agreement read by **Codex** and **GitHub Copilot**. Claude Code instead reads [CLAUDE.md](./CLAUDE.md), which mirrors this file — keep both in sync when you update either one.
>
> Folder-specific notes only — see the root [AGENTS.md](../AGENTS.md) for the global working agreement, which still applies here.

# EASE — database/ Notes

- **Status** — empty scaffold, no code yet. Will hold schema, migrations, and config for whatever store EASE ends up using.
- **Direction so far** — a graph DB is the current lean for the knowledge/journey model; see [planning/docs/product/architecture-mechanisms.md](../planning/docs/product/architecture-mechanisms.md) and [planning/docs/decisions/decision-log.md](../planning/docs/decisions/decision-log.md) before treating this as final.
- **Before scaffolding** — confirm the choice against the relevant ADR in [architecture/architecture-portal/docs/Database/](../architecture/architecture-portal/docs/Database).
- **No real data or credentials** — schema/migrations/config only, never seeded production or personal data.
