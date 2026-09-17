> **Instructions for coding agents:** this file (`AGENTS.md`) is the working agreement read by **Codex** and **GitHub Copilot**. Claude Code instead reads [CLAUDE.md](./CLAUDE.md), which mirrors this file — keep both in sync when you update either one.
>
> Folder-specific notes only — see the root [AGENTS.md](../AGENTS.md) for the global working agreement, which still applies here.

# EASE — testing/ Notes

- **Purpose** — new folder for test plans, test cases, and QA checklists covering the prototype today and the full app later.
- **Start simple** — a plain markdown checklist here is enough before any automated tooling exists; don't hold off documenting manual test steps just because there's no test runner yet.
- **Split of responsibility** — this folder tracks test plans/cases and shared fixtures/docs; actual automated test suites and their runner config live next to the code they test (inside `frontend/`, `backend/`, etc.), not here.
- **Coverage targets** — as `prototype/walkthrough-assistant` and later `frontend/`/`backend/` code stabilize, add a corresponding test-plan file here named after the feature/area it covers.
