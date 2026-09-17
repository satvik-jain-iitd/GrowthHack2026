> **Instructions for coding agents:** this file (`CLAUDE.md`) is read automatically by **Claude Code**. Codex and GitHub Copilot instead read [AGENTS.md](./AGENTS.md), which mirrors this file — keep both in sync when you update either one.
>
> Folder-specific notes only — see the root [CLAUDE.md](../CLAUDE.md) for the global working agreement, which still applies here.

# EASE — prototype/ Notes

- **`walkthrough-assistant/`** is the working, zero-build demo — open `index.html` directly in a browser, nothing to install. This is what gets shown if someone asks for a quick demo; keep it runnable at all times, and don't break it while experimenting elsewhere in this folder.
- **`src/`, `public/`, `package.json`** are the Next.js scaffold this prototype will grow into for the real build — currently empty; fill in only when deliberately moving past the demo stage, not by accident.
- **Sandbox, not final home** — treat this folder as safe to experiment in first. Once a piece is stable and no longer just demo-ware, promote it to [frontend/](../frontend), [backend/](../backend), etc. rather than letting it live here permanently.
- **`ease-team-onboarding.html`** — reference/onboarding material for the team; not part of the demo runtime.
