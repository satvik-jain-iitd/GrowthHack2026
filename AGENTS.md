<!-- bmad:context -->
<!-- Verified 2026-09-14 against ebb918ed60b182c1232612cc97c35885093c3875. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

> **Instructions for coding agents:** this file (`AGENTS.md`) is the working agreement read by **Codex** and **GitHub Copilot**. Claude Code instead reads [CLAUDE.md](./CLAUDE.md), which mirrors this file — keep both in sync when you update either one.

# EASE — Agent Working Agreement

Project: **EASE — Experience Assistance for Simplified Execution** ("Complex underneath. EASE on top.")
Planning lives in [planning/](./planning) (BMad method), the working demo lives in [prototype/](./prototype).

Adapted from Boris Cherny's team workflow (https://gist.github.com/hqman/e29cb6386c539d795767e8c3fd2c959b).

## Workflow Orchestration

### 1. Plan Mode by Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).
- If something goes sideways, STOP and re-plan immediately — don't keep pushing.
- Use plan mode for verification steps, not just building.
- Write detailed specs upfront to reduce ambiguity.

### 2. Subagent Strategy
- Use subagents liberally to keep the main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, throw more compute at it via subagents.
- One task per subagent for focused execution.

### 3. Self-Improvement Loop
- After ANY correction from the user: update [tasks/lessons.md](./tasks/lessons.md) with the pattern (settled product/scope decisions still go in `planning/docs/decisions/decision-log.md` instead).
- Write rules for yourself that prevent the same mistake.
- Ruthlessly iterate on these lessons until the mistake rate drops.
- Review lessons at the start of a session for the relevant project area.

### 4. Verification Before Done
- Never mark a task complete without proving it works.
- Diff behavior between main and your changes when relevant.
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness.

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution."
- Skip this for simple, obvious fixes — don't over-engineer.
- Challenge your own work before presenting it.

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests — then resolve them.
- Zero context switching required from the user.
- Go fix failing checks without being told how.

## Task Management

1. **Plan First** — write the plan (checkable items) before touching code.
2. **Verify Plan** — check in with the user before starting implementation on anything non-trivial.
3. **Track Progress** — mark items complete as you go.
4. **Explain Changes** — give a high-level summary at each step.
5. **Document Results** — summarize what changed and why once done.
6. **Capture Lessons** — record lessons after any user correction.

## Core Principles

- **Simplicity First** — make every change as simple as possible; touch the minimal amount of code.
- **No Laziness** — find root causes, no temporary fixes, hold to senior-developer standards.
- **Minimal Impact** — changes should only touch what's necessary; avoid introducing regressions.

## Tool Usage Discipline

- **Avoid browser automation (openBrowserPage/clickElement/navigatePage/etc.) unless the user explicitly asks for it.** These tools burn a large number of tokens per page/click and eat into the user's context and usage limits fast.
- **Prefer direct, non-interactive tools first**: `git clone`/`git ls-remote`/`git fetch`, `gh` CLI, `curl`/REST APIs, and `web_fetch` for plain public pages. Only fall back to browser automation when a task genuinely requires JS-rendered pages, clicking through a UI, or an interactive login flow that has no CLI equivalent.
- **Authentication flows are the one exception** — if a site requires SSO/MFA to load at all, it's fine to open it once to detect that requirement, then hand off the interactive login/MFA step to the user rather than repeatedly polling the page yourself.
- **After the user (or GCM/gh) completes an auth flow, immediately switch back to CLI-based tools** (git, gh, curl) for the actual work (cloning, listing repos, reading files) instead of continuing to browse.

## Design System (One Amex Skills)

> **Strict, non-negotiable standard** — every piece of documentation, design work, and development in this repo must follow the AmEx design system exactly as published. No exceptions, no ad hoc substitutes.

- **Install the skill if it's missing** — before any front-end or visual work, check whether the `design-system` skill exists at `.agents/skills/design-system/` in the folder you're working in (already installed in `frontend/` and `planning/`). If it's missing anywhere else in this repo (or in another AmEx project), install it yourself first — don't proceed without it.
- **Install command** — `npx skills add https://github.aexp.com/amex-eng/one-amex-skills.git --skill design-system` (needs Node.js 20+; for teams still on DLS v6, use `--skill design-system-v6` instead).
- **Authenticate safely** — use the HTTPS URL and let Git Credential Manager open a browser login; never use pasted tokens in chat, and don't rely on SSH unless it's already verified working on the machine.
- **Always use this skill for any visual or UI work** — React components, mockups, wireframes, PPT/slide decks, and architecture diagrams. Wherever colors, fonts/typography, spacing, icons, or components are chosen, pull them from the design-system skill's tokens and utility classes instead of inventing anything ad hoc.
- **No raw HTML or custom CSS** — no `<button>`, `<input>`, `<select>`, `<label>`, `<h1>`, or hand-rolled CSS classes when a DLS component or utility class already covers it; no assumed or undocumented props.
- **Follow the skill's own workflow** — Identify → Retrieve → Generate → Validate → Audit — and end every generation with the mandatory Custom Code Audit block flagging any deviations.
- **Reference** — GitHub repo: https://github.com/amex-eng/one-amex-skills.git · Local clone: none needed, skill files live directly in `frontend/.agents/skills/design-system/` and `planning/.agents/skills/design-system/` once installed.
- **Human-facing docs (for context, not agent-fetchable)** — https://design.aexp.com/blogs/one-amex-skills (what the skill is/why it exists) and https://design.aexp.com/web/get-started/skills/developer (official developer setup guide). Both require corporate SSO/VPN and are **not reachable from the coding agent environment** — the vendored skill under `.agents/skills/design-system/` (installed via the command above) is the working source of truth for agents; treat these links as the canonical spec to defer to if the local copy and the live site ever disagree.

## Architecture Standard (Architecture Portal)

> **Strict, non-negotiable standard** — every architecture decision, diagram, and piece of architecture documentation in this repo must conform to the AmEx Architecture Portal. No exceptions, no ad hoc substitutes.

- **All architecture in this repo must strictly conform to** the AmEx Architecture Portal — GitHub repo: https://github.com/amex-eng/architecture-portal · Local clone: [architecture/architecture-portal/](./architecture/architecture-portal) (already cloned — read `docs/` there first; if the local clone is missing or stale, `git clone`/`git pull` it before relying on the repo link alone).
- **Read `architecture/architecture-portal/docs/`** before making any architecture decision — it contains prescriptive ADRs by domain (e.g. `Front-End-and-Mobile-Communications/Design-Language-System-Prescriptive-ADR.md`, `AI~ML/`, `Database/`, `Event-Brokers-and-Messaging/`, `API-Integration-Platforms/`, `Big-Data-&-Analytics/`, `Application-Observability-&-Auditability/`, `BuildBuy-Overview/`). Treat these ADRs as binding unless a newer decision explicitly supersedes them.
- **Keep the local clone in sync** — `git -C architecture/architecture-portal pull` periodically so ADRs don't go stale; note `core.longpaths=true` is required on Windows (already set) because some nested paths are long.
- Historical/retired reference material (if ever needed) lives in the `amex-archives` GitHub org: https://github.aexp.com/amex-archives — an index of all 2,038 repos there (with links, stars, forks, language, size) is at [architecture/amex-archives-index.md](./architecture/amex-archives-index.md) (raw data: [architecture/amex-archives-repos.csv](./architecture/amex-archives-repos.csv)). Consult the index first; only clone specific repos from there on request — don't bulk-clone the org.

## Project-Specific Notes

- **`planning/`** is the BMad-method workspace: `_bmad/` (config), `_bmad-output/`, `docs/` (research, product, plans, decisions, judging), `.agents/` and `.claude/` (installed agent skills), `skills-lock.json` (skills manifest). Treat this as the single source of truth for scope and decisions — start at [planning/docs/README.md](./planning/docs/README.md).
- **`prototype/`** is working demo code: the `walkthrough-assistant/` mock and a Next.js scaffold (`package.json`, `src/`, `public/`). This is where hands-on build work happens.
- Never commit secrets (`.env`, API keys, tokens). Both root and `planning/` have `.gitignore` entries for `.env`, `.DS_Store`, `node_modules/`, and `.next/` — do not remove them. Root `.gitignore` also fully excludes `business/` (raw Slack `.mhtml` exports) — do not remove that entry either.
- **Canonical git remote**: `origin` points to `https://github.aexp.com/amex-eng/EASE-GH2026` (switched 2026-09-14 from the prior `github.com/sjain480_aexp/EASE-GH2026`). Push and open PRs against this remote.
- **Architecture standard**: see the "Architecture Standard (Architecture Portal)" section above — all architecture must conform to `architecture-portal` (cloned locally at `architecture/architecture-portal/`), not `architecture1.aexp.com` (an internal portal requiring corporate SSO/VPN that isn't reachable from this agent environment).

<!-- /bmad:context -->

<!-- Everything below is outside the bmad:context block and survives a refresh. -->

## Commands

There is no repo-wide build step — this is a docs-and-prototype repo. The only
executable code is the zero-build demo and the vendored BMad Python scripts.
Linting and tests are wired up at the root via `pyproject.toml` and
`.pre-commit-config.yaml`.

```bash
# One-time setup: create .venv and install the dev toolchain (pytest, ruff, pre-commit)
uv sync
uv run pre-commit install

# Run the demo (no install, no build step)
open prototype/walkthrough-assistant/index.html

# Headless self-check of the intent matcher + journey data
node prototype/walkthrough-assistant/js/intents.js
#   -> "ponytail: intents self-check OK (11 intents, 3 journeys)"

# BMad tooling tests (needs Python 3.11+; system python3 is 3.9 and will fail)
uv run pytest                       # -> 46 passed

# Lint
uv run ruff check .                 # Python — a no-op today, there is zero first-party Python
uv run ruff format --check .
npx eslint@10 .                     # demo JS
npx markdownlint-cli2               # first-party Markdown
uv run pre-commit run --all-files   # everything at once
```

`test_render_skill.py` is expected to fail collection: it wants
`planning/_bmad/assets/config.template.toml`, and only `_bmad/scripts/` +
`_bmad/config.toml` are vendored here. It is permanently ignored via `addopts`
in `pyproject.toml` — don't "fix" it by inventing the asset.

**All tooling is scoped to first-party, hand-written code.** Vendored and
machine-generated trees — `architecture/architecture-portal/`,
`planning/_bmad/`, `planning/_bmad-output/`, `archived/`, and the installed
skills under `*/.agents/` and `*/.claude/` — are excluded from ruff, ESLint,
markdownlint, and every pre-commit hook.

`CLAUDE.md`, `AGENTS.md`, and three docs with pre-existing violations
(`planning/docs/growthhack-source-brief.md`,
`planning/docs/decisions/decision-log.md`,
`.github/HOW_TO_CREATE_EPICS_AND_STORIES.md`) are currently excluded from
markdownlint so the gate lands green. Cleaning them up and removing the
exclusions is tracked as follow-up work.

The package index is pinned to `artifactory.aexp.com` in `pyproject.toml`, so
`uv sync` needs corporate network access.
