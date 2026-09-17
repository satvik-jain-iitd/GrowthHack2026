# EASE — Experience Assistance for Simplified Execution

> "Complex underneath. EASE on top." Every interaction should be easier than the one before it.

Built for **Growth Hack 2026** (event 09/23–09/24, video submission 09/24 7PM).

## Repository Structure

| Folder | Purpose |
|---|---|
| [planning/](./planning) | BMad-method planning workspace — research, product docs, plans, decisions, judging prep, and agent tooling (`.agents`, `.claude`, `_bmad`, `_bmad-output`) |
| [prototype/](./prototype) | Working demo code — the `walkthrough-assistant` mock and the Next.js scaffold it will grow into |
| [architecture/](./architecture) | Architecture notes and diagrams |
| [agentic/](./agentic) | Agentic/automation layer (scaffold) |
| [backend/](./backend) | Backend services (scaffold) |
| [frontend/](./frontend) | Frontend app (scaffold) |
| [database/](./database) | Database schema/config (scaffold) |
| [business/](./business) | Business-case material (raw source + synthesized write-ups) |
| [testing/](./testing) | Test plans, test cases, and QA checklists (scaffold) |
| [archived/](./archived) | Older artifacts kept for reference |

## Getting Started

1. Start with [planning/docs/README.md](./planning/docs/README.md) — the single entry point and full project inventory for the plan.
2. Open [prototype/walkthrough-assistant/index.html](./prototype/walkthrough-assistant/index.html) in a browser to see the working demo — no build step required.
3. Read [AGENTS.md](./AGENTS.md) (or [CLAUDE.md](./CLAUDE.md) if you're on Claude Code) before making changes with a coding agent.

## Sprint Board

Lightweight Agile workflow: **Epic Issue → Story Issue → assignee → `In Progress` → PR (`Closes #N`) → review → merge → `Done`.** GitHub Issues/Projects are the source of truth — no separate ticket tracker.

New to this? Follow the beginner, click-by-click guide: [.github/HOW_TO_CREATE_EPICS_AND_STORIES.md](./.github/HOW_TO_CREATE_EPICS_AND_STORIES.md)

- **Milestone:** [GrowthHack 2026 Submission](https://github.aexp.com/amex-eng/EASE-GH2026/milestone/1) — due 2026-09-24, all Epics and Stories attached
- **Current Sprint:** [sprint plan](./planning/docs/plans/)
- **Project Board:** [Open Project](https://github.aexp.com/users/sjain480/projects/1) — grouped by Status (`Todo` / `In Progress` / `Done`). Hosted under the `sjain480` personal account (org-level Project creation/repo-linking requires `amex-eng` org admin rights not currently held) — still tracks every Epic/Story issue in this repo by reference, just not listed under this repo's own "Projects" tab.
- **My Stories:** [assigned to me](https://github.aexp.com/amex-eng/EASE-GH2026/issues?q=is%3Aopen+is%3Aissue+assignee%3A%40me)
- **In Progress:** view the Project Board above, filtered/grouped by Status
- **Epics:** [all Epics](https://github.aexp.com/amex-eng/EASE-GH2026/issues?q=is%3Aopen+label%3A%22type%3Aepic%22)
- **Pull Requests / Review:** [PRs awaiting my review](https://github.aexp.com/amex-eng/EASE-GH2026/pulls?q=is%3Aopen+is%3Apr+review-requested%3A%40me)

> **Note on automation:** GitHub Projects' built-in workflows automatically move a card to `Done` when its issue closes or its linked PR merges (on by default). The reverse — dragging a card to `Done` also closing the real issue — is an optional workflow toggle only available in the Project's web UI (⋯ menu → Workflows), not via the API/CLI; enable it there if you want full two-way sync. Moving a card to `In Progress` has no built-in trigger (same as most kanban tools) — drag it manually when work starts, or see `sprint-status.yaml` under `planning/_bmad-output/implementation-artifacts/` for the same status tracked by the BMad build workflow.

## Architecture Standard

All architecture for this project must strictly conform to American Express's [Architecture Portal](https://github.com/amex-eng/architecture-portal), cloned locally at [architecture/architecture-portal/](./architecture/architecture-portal). Read `architecture/architecture-portal/docs/` (prescriptive ADRs by domain) before making any architecture decision, and keep the clone in sync with `git -C architecture/architecture-portal pull`. (`architecture1.aexp.com`, referenced earlier, requires corporate SSO/VPN and isn't reachable from the coding agent environment — the cloned `architecture-portal` repo is the working source of truth instead.)

Retired/historical reference material across the enterprise lives in the `amex-archives` GitHub org (2,038 repos, not architecture-specific) — see the indexed list at [architecture/amex-archives-index.md](./architecture/amex-archives-index.md) rather than cloning the whole org.

## For Coding Agents

This repo includes agent instruction files at the root:

- [AGENTS.md](./AGENTS.md) — read by Codex and GitHub Copilot
- [CLAUDE.md](./CLAUDE.md) — read by Claude Code

Both describe the same working agreement; keep them in sync if you edit one.

Each top-level folder also has its own local `CLAUDE.md`/`AGENTS.md` with folder-specific context only (they don't repeat the global rules above — read the root files first, then the local one for the folder you're working in).
