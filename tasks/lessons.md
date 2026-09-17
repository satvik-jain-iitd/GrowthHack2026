# EASE — Lessons Learned (Agent Working Notes)

> Append-only. Every time the user corrects an agent or an agent discovers a
> non-obvious fact about this environment, add an entry here instead of
> letting the knowledge disappear when the session ends. Keep entries short
> and dated. This is read by every coding agent per the "Self-Improvement
> Loop" in the root [CLAUDE.md](../CLAUDE.md)/[AGENTS.md](../AGENTS.md).

## How to use this file

- New entry → append at the bottom of the relevant section (or add a new
  section if it doesn't fit).
- Write each lesson as: **what happened** → **what to do instead**.
- Skim this file at the start of a session, before repeating past mistakes.

---

## Environment quirks (things that cost time to discover)

- **`design1.aexp.com`, `architecture1.aexp.com`, and `design.aexp.com` are
  all internal AmEx sites behind corporate SSO/VPN** — `web_fetch` cannot
  reach them (private/loopback IP or SSO redirect). Don't retry fetching
  them directly; use the locally cloned/installed copies instead
  (`architecture/architecture-portal/` for architecture ADRs,
  `*/.agents/skills/design-system/` for the design system).
- **`github.com/amex-eng/...` also requires enterprise SSO for anonymous/browser
  fetches** (`web_fetch` gets an SSO redirect page, not the repo). However,
  the **GitHub MCP server tools (`github-mcp-server-*`) have authenticated
  access to these internal-ish AmEx-owned repos** — use those tools
  (`get_file_contents`, `search_code`, etc.) instead of `web_fetch` or
  assuming the content is unreachable.
- The `github-mcp-server-*` toolset available in this project is **read-only**
  (`list_*`, `get_*`, `search_*` — no `create_*`/`update_*`/`add_*` tools).
  Don't waste time searching for a way to create issues/labels/PRs through
  it; that has to be done through `git`/the GitHub UI, or asked of the user.
- **This session appears to auto-commit and auto-push file edits to `origin`
  in the background**, sometimes bundling unrelated edits into one commit
  with an auto-generated message. Don't assume "I haven't run `git commit`"
  means nothing was pushed — always run `git status`/`git log` to check
  before manually committing (to avoid duplicate or conflicting commits).
- Deferred MCP tools (e.g. `github-mcp-server-*`) are invisible until you
  call `tool_search_tool` first — don't guess at their names/parameters
  before searching.
- **The `mermaid-diagram-validator` / `mermaid-diagram-preview` MCP tools hang
  indefinitely in this environment** (observed twice: once on the
  `BMAD-SKILLS-LIFECYCLE.md` lifecycle diagram, once on the Phase 5
  architecture-spine diagrams — the second call sat 1800s with no response and
  blocked the whole run). Don't call them, and don't conclude the diagram is
  broken when they hang — it's the tool, not the syntax (both diagrams passed
  once validated properly). **Instead, validate locally:** `npm i mermaid jsdom`
  in a temp dir and run `mermaid.parse()` per fenced ```mermaid block under a
  `jsdom` global shim (set `window`/`document`/`navigator`/`Element`/`SVGElement`/
  `HTMLElement`/`Node`/`getComputedStyle`/`requestAnimationFrame`), then
  `mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })`. Runs in
  seconds, needs no browser, and works on Node 18 despite mermaid's
  `EBADENGINE` "requires Node >= 20" warning. `npm` registry itself is
  reachable from this environment (unlike `pip`, which needed
  `--system-certs`).
- **`uv sync` cannot resolve packages from inside the Claude Code sandbox.**
  `pypi.org` is not on the sandbox host allowlist (connection times out), and
  `artifactory.aexp.com` *is* allowlisted and returns 200 but is served through
  the sandbox's MITM proxy, whose CA is in neither `/Users/yyashwa/amex-combined-ca.pem`
  (already wired up via `SSL_CERT_FILE`) nor curl's bundle — `uv` fails with
  `invalid peer certificate: UnknownIssuer` even with `UV_SYSTEM_CERTS=1`.
  Workaround for local verification: `uv venv` + `uv pip install --offline
  --default-index https://pypi.org/simple <pinned==versions>` resolves from the
  uv cache. Generating `uv.lock` has to be done by the user outside the sandbox.
- `pre-commit install` reports `PermissionError: '.git/hooks/pre-commit'` in the
  sandbox but **still writes a working hook** — check the file before believing
  the error. `pre-commit run --all-files` is unaffected.
- `gh` is **not installed** on this machine, so GitHub Enterprise repo settings
  (rulesets, branch protection, required approvals) can't be inspected from the
  agent environment — those have to be read from the web UI by the user.
- `npx` (npm registry) *does* work in the sandbox, because
  `NODE_TLS_REJECT_UNAUTHORIZED=0` is preset in the environment.
- **ESLint 10 resolves config from the linted file's directory**, so a bare
  `npx eslint .` picks up `architecture/architecture-portal/eslint.config.mjs`
  and dies (that vendored app has no `node_modules`). The root
  `eslint.config.mjs` must carry an explicit `ignores` block for every vendored
  path — scoping the `files` glob alone is not enough.
- **`ruff format` also formats Markdown** (Python code blocks inside `.md`), so
  its file count will look surprisingly high in a repo with zero `.py` files.
  Not a misconfiguration.
- **`git` cannot reach `github.aexp.com` from the sandbox** — `git ls-remote`
  fails with `SSL certificate problem: self signed certificate in certificate
  chain`, the same MITM-proxy CA gap that blocks `uv`. Commits can be created
  locally, but fetching, pushing, and anything needing the GitHub UI must be
  done by the user.
- **Check `git log origin/main` before trusting a local branch's base.** A local
  `main` can sit on an orphan snapshot commit that was merged into the real
  history upstream, so it looks like "1 commit, level with origin" while
  `origin/main` is dozens of commits ahead. Verify with
  `git log --oneline main..origin/main` before planning any push.

## Repo structure conventions (established 2026-09-14)

- Root [CLAUDE.md](../CLAUDE.md)/[AGENTS.md](../AGENTS.md) = **global** rules
  only. Every top-level folder (`agentic/`, `architecture/`, `backend/`,
  `business/`, `database/`, `frontend/`, `planning/`, `prototype/`,
  `testing/`) has its **own** local `CLAUDE.md`/`AGENTS.md` with
  folder-specific context only — never copy global rules into a local file;
  link back to the root file instead.
- `architecture/architecture-portal/` is AmEx's real Architecture Portal,
  flattened into the repo (not a live git submodule in practice, even though
  `.gitmodules` declares it as one) — treat its ADRs as binding, and don't
  hand-edit inside it (it's upstream-owned).
- The design-system skill (One Amex Skills, DLS v7) is installed under
  `frontend/.agents/skills/design-system/` and
  `planning/.agents/skills/design-system/` — always use it for any visual/UI
  work; never hand-roll HTML/CSS when a DLS component covers it.
- `prototype/` is the disposable demo sandbox (the zero-build
  `walkthrough-assistant/` mock lives here); `frontend/`/`backend/`/
  `database/`/`agentic/` are the real-build destinations code eventually
  graduates to. Don't confuse "quick demo" work with "real build" work —
  keep them in their respective folders.

## Working with a non-technical stakeholder (this project's owner)

- Avoid technical jargon in explanations; translate every technical decision
  into plain, concrete, everyday language before presenting it.
- Ask one simple, multiple-choice question at a time (via `ask_user`) rather
  than open-ended or bundled questions — faster for a non-technical user to
  answer confidently.
- Play back understanding in plain language ("here's what I think you mean")
  and get explicit confirmation before proceeding on anything that shapes
  scope or product direction (BMad-method discipline: don't skip elicitation).

## Time-saving tips

- Before assuming a folder/file is empty or missing, use `view` on the
  **specific** path rather than re-deriving it from a stale index/README —
  the repo's own inventory docs can lag behind reality (e.g. `planning/docs/README.md`
  mentioned a root `package.json` that had since moved into `prototype/`).
- When a user's message appears to start mid-sentence or reference something
  not in visible context, check tagged files and recent git log/status first
  — it's often a continuation after context was compacted, not a new
  unrelated request.
- Planning docs in this repo carry explicit dates (e.g. sprint plan countdown
  from 09-10) — always sanity-check "today's date" against those before
  reusing a plan's timeline; stale dates silently break countdown logic.

---

## Changelog

| Date | Entry |
|---|---|
| 2026-09-14 | Initial creation — environment quirks, repo structure conventions, non-technical-stakeholder working notes, and time-saving tips captured from the folder-restructuring + Amex-standards-lock-in + GitHub-discovery session. |
| 2026-09-15 | Added the `mermaid-diagram-validator`/`-preview` MCP hang quirk plus the local `mermaid` + `jsdom` `mermaid.parse()` workaround, discovered while finalizing the Phase 5 architecture spine. |
| 2026-09-15 | Added sandbox networking/TLS facts (`uv sync`, `pre-commit install`, npx, `git` to github.aexp.com) plus ESLint 10 config-lookup, `ruff format`-on-Markdown, and stale-local-base gotchas, from the dev-tooling setup session. |
