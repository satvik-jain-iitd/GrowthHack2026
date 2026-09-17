> **Instructions for coding agents:** this file (`CLAUDE.md`) is read automatically by **Claude Code**. Codex and GitHub Copilot instead read [AGENTS.md](./AGENTS.md), which mirrors this file — keep both in sync when you update either one.
>
> Folder-specific notes only — see the root [CLAUDE.md](../CLAUDE.md) for the global working agreement, which still applies here.

# EASE — architecture/ Notes

- **`architecture-portal/`** is a git submodule (see root [.gitmodules](../.gitmodules)) cloned from the AmEx Architecture Portal. If it looks empty, run `git submodule update --init --recursive`; refresh it periodically with `git -C architecture/architecture-portal pull`.
- **Read before deciding** — `architecture-portal/docs/` holds the prescriptive, binding ADRs by domain (Design Language System, AI/ML, Database, Event Brokers, API Integration, Big Data, Observability, Build/Buy). Check the relevant ADR before choosing a pattern for `backend/`, `database/`, `frontend/`, or `agentic/`.
- **Don't edit inside `architecture-portal/`** — it's an upstream submodule owned by the portal team; changes there go through that repo's own process, not this one. EASE-specific architecture notes/diagrams that aren't yet formal ADRs go directly in this folder, outside the submodule.
- **`amex-archives-index.md` / `amex-archives-repos.csv`** — index of the ~2,038 retired repos in the `amex-archives` org. Consult the index first; only clone a specific repo from there on request, don't bulk-clone.
