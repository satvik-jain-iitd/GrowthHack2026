> **Instructions for coding agents:** this file (`CLAUDE.md`) is read automatically by **Claude Code**. Codex and GitHub Copilot instead read [AGENTS.md](./AGENTS.md), which mirrors this file — keep both in sync when you update either one.
>
> Folder-specific notes only — see the root [CLAUDE.md](../CLAUDE.md) for the global working agreement, which still applies here.

# EASE — frontend/ Notes

- **Status** — only the installed `design-system` skill (`.agents/skills/`) and `skills-lock.json` exist so far; no app code yet.
- **Relationship to `prototype/`** — this is the eventual home for the real, production frontend. [prototype/](../prototype) (the Next.js scaffold + `walkthrough-assistant` mock) is the sandbox it graduates from — promote/port code here deliberately rather than duplicating work in both places.
- **Design-system skill is mandatory here** — every component/screen must go through Identify → Retrieve → Generate → Validate → Audit using the installed skill; no ad hoc HTML/CSS, no invented colors/spacing/typography outside its tokens.
- **DLS version** — default is the current design-system skill; only switch to `design-system-v6` if this app is confirmed to be on DLS v6.
