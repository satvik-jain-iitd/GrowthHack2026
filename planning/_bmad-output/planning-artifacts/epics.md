---
stepsCompleted: [1, "1-confirmed", 2, "2-approved", 3, "3-approved", 4, "4-validated"]
inputDocuments:
  - prds/prd-EASE-2026-09-14/prd.md
  - architecture/architecture-EASE-2026-09-15/ARCHITECTURE-SPINE.md
  - ux-designs/ux-EASE-2026-09-15/DESIGN.md
  - ux-designs/ux-EASE-2026-09-15/EXPERIENCE.md
---

# EASE — GrowthHack 2026 MVP - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for EASE — GrowthHack 2026 MVP, decomposing the requirements from the PRD, UX Design, and Architecture Spine into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Resolve stated intent to the Hero Journey — accept a free-text user intent and resolve it to the single supported Build Floor Plans Journey; an intent that does not match produces an explicit "not supported in this demo" response rather than a silent wrong match.
FR2: Determine current Journey Step from application state — given the mocked application's current screen and the Floor Plan's current save/configuration state, determine which of Steps 1–6 the owner is on; re-entering mid-journey resumes at the correct next incomplete Step, not Step 1.
FR3: Highlight the correct next UI control per Step — for each of the 6 required Steps, highlight the specific control the owner needs next; exactly one primary control is visually highlighted at every Step.
FR4: Persistent progress panel — show every Step with its status (done / current / upcoming) and an overall completion percentage; the panel's "current Step" always matches the Step FR2 has determined.
FR5: Validate each table's required fields — for every table added, validate that Table ID/name, Table Type, minimum party size, and maximum party size are all set before the Step can be marked complete; block with a message naming the specific missing field(s) otherwise.
FR6: Validate table combinations are defined where claimed — if the owner indicates a combination exists, validate it references at least two existing tables and has its own combined capacity set.
FR7: Validate the Save-vs-Activate Gap explicitly — distinguish "Floor Plan saved" from "Floor Plan active in a Shift and visible under Shift Availability" as two separate, independently checkable states; do not mark the Journey complete until both are true; report "not yet live" with the specific next action (activate via Shift) until then.
FR8: Actionable recovery guidance on validation failure — when any FR5/FR6/FR7 validation fails, surface a specific message naming the exact missing/incorrect field or state and the concrete next action to fix it; no generic error messages.
FR9: Emit structured Telemetry Events — emit a timestamped, Step-tagged event for each of: journey started, step viewed, step completed, validation failed, backtracked, help requested, journey abandoned, journey completed. A single successful run produces a complete, ordered event log with no missing step-completed events for any of the 6 required Steps.
FR10: Generate a Micro-Guide from a completed Journey — upon Journey completion (FR7 satisfied), generate a visual Micro-Guide reflecting the actual sequence of Steps, highlighted controls, and the save-vs-activate catch encountered, matching the Telemetry Event log's completed Steps in the same order, with at least one entry per completed Step.
FR11: Present the Micro-Guide and journey stats for approval — present the generated Micro-Guide alongside journey stats (time to complete, whether the save-vs-activate catch was triggered) in a single review surface with an approve/reject action. Approving transitions `pending_review → approved` (canonical); rejecting transitions `pending_review → rejected` (discarded; any previously approved guide for this Journey remains canonical; no auto-retry).

### NonFunctional Requirements

NFR1 (Safety — deterministic completion): The LLM must never independently declare a Journey complete — completion is always determined by deterministic validation (FR5–FR7), with the LLM confined to intent resolution (FR1) and step-location reasoning (FR2) only. Where LLM-inferred Step and validation-derived Step disagree, validation wins.
NFR2 (Cost / Tooling — supported models only): Only the officially GrowthHack-supported models may be used (Open Source: LLAMA 3.2/3.3; Closed Source: Azure GPT 5.2, Gemini-3.1-flash-lite; Embedding: BGE-Large, ADA02), drawing only on the four supported capabilities (Redaction, Substitution, Safechain, Local Memory) as needed. No credential-sharing across team members; credentials are issued 2 days before the event.
NFR3 (Accessibility floor): WCAG 2.2 AA is the floor for all EASE-authored chrome (Intent Bar, Spotlight Ring, Progress Panel, Validation Message, Micro-Guide, Specialist Review) — a standing architectural invariant, not a styling detail, and not affected by the PRD's Non-Goal on advanced/roadmap accessibility capabilities (voice, multilingual).

### Additional Requirements

- **No greenfield starter template — reuse-and-extend instead (relevant to Epic 1 Story 1):** Architecture does not specify a fresh scaffold. AD-2 mandates retaining and extending the existing `prototype/walkthrough-assistant/` as the Host App Skin (it does not yet mock all six Steps' screens, so real additions are expected) while the empty root `prototype/package.json` Next.js stub is superseded and deleted. Epic 1's first story should establish the three-part repo structure (`prototype/walkthrough-assistant/`, `ease-chrome/`, `ease-core/`, `ease-llm-boundary/` per the Structural Seed source tree) rather than scaffolding a new app from a template.
- EASE Chrome Layer must be built as a One App Holocron module in Single Module configuration (AD-9): routing via `holocron-module-route`, shared state via `one-app-ducks` (Redux), served by `one-app-runner` in development; no HTTP API is implemented inside the module — all server work lives in EASE Core Service.
- A single versioned Bridge Contract file is required before any Host App Skin ↔ Chrome Layer wiring (AD-10): a selector map (Step → stable `data-ease-*` attribute, never a CSS class or DOM path) plus a closed event vocabulary (fixed enum of event names with typed payloads); both sides must validate the contract at startup and fail loudly on a missing selector or unknown event name.
- EASE Core Service (Node 18 + Fastify or Express) is the sole owner of Journey/Step state and the only writer of validation results (AD-4); every Validation Checkpoint must be a pure function over Host App Skin state plus Journey state — no network call, no model inference, unit-testable with no LLM present.
- Two-store data model (AD-5): Journey and Micro-Guide records are relational (SQLite via `better-sqlite3` ^11.10.0 — pinned deliberately, since v12+ requires Node 20+ and v13+ requires Node 22+, neither of which One App targets); Telemetry Events are an append-only, schema-flexible JSON Lines log. `journey_id` is minted exactly once, by the Core Service, and carried into every write on both sides; event ordering uses a monotonic per-run `sequence`, never wall-clock time.
- Sole Telemetry Writer (AD-6): the Core Service's Telemetry Writer is the only emitter — Chrome Layer components report user actions to the Core Service, which decides what to emit. Every event carries `timestamp` (ISO 8601 UTC), `sequence`, `event_type` (one of the 8 PRD §4.5 types), `journey_id`, `step` (1–6 or null), and an `attributes` map — OpenTelemetry-log-semantics compatible without adopting the OTel SDK.
- One error envelope `{ code, message, step?, field? }` (AD-12) is used on every cross-process boundary, with three mandated degrade-not-stop behaviours: an LLM Boundary timeout falls back to the last validation-derived Step plus a plain prompt (never blocks); a telemetry write failure is logged and the Journey continues; a relational write failure blocks the Step and surfaces the envelope.
- The LLM Boundary Service is a separate, stateless service (AD-3) — the only place a model SDK is imported anywhere in the codebase; its output is advisory only. `[ASSUMPTION]` Python/FastAPI runtime, matching the AI/ML ADR's Safechain reference implementation — confirm with the AI-Intent workstream owner (Yashwant) before Build starts; the invariant is the service's separateness, not its language.
- Headless-testable validation (AD-13): Validation Checkpoints ship with unit tests that run with no browser and no LLM. FR1's acceptance bound requires a committed fixture: a named set of at least 8 intent paraphrasings that must all resolve to the Hero Journey, plus at least one out-of-scope intent that must return `not_supported`.
- Closed system boundary (AD-8): no outbound call to any real partner or enterprise system anywhere in the codebase; Step 7 (Single Day Edit), Assigned Seating Events, multi-plan Shift activation, and cross-system table-name matching are modelled nowhere.
- Deployment (per the Structural Seed): the entire MVP runs locally on the presenting laptop — `one-app-runner` serves the Chrome Layer, the Host App Skin is served as static files, and the Core and LLM Boundary services run locally alongside. No cloud environment, CI/CD, or environment promotion path is in scope. A full rehearsal must run end-to-end on the actual presenting machine, not only a developer's.
- Node.js is pinned to 18.20.x across all services — matching what One App targets and the version already installed on the build machine.

### UX Design Requirements

UX-DR1: Two-layer brand system — the EASE Chrome Layer strictly inherits DLS v7 tokens by name (colors: `dls-deep-blue`, `dls-bright-blue`, `dls-color-success`, `dls-color-warning`, `dls-color-neutral`, `dls-red`; typography: `heading-1..6`, `body/body-1..3`, `legal-1/2` utilities verbatim) with zero invented hex values except `ease-scrim` (`#0000008C`, 55% opacity black — the one value DLS has no scrim/overlay utility for). The Host App Skin stays deliberately non-DLS (`host-action-blue` #336FDE, `host-ink` #2A2A2A, `host-black-rail`, `host-white`, Helvetica Neue stack) and none of its tokens may appear on an EASE Chrome component.
UX-DR2: Six named EASE Chrome components must be built — IntentBar, SpotlightRing, ProgressPanel, ValidationMessage, MicroGuideCard, SpecialistReviewCard — each implementing the specific behavioral rules in `EXPERIENCE.md`'s Component Patterns table, not only the visual spec in `DESIGN.md`.
UX-DR3: Spotlight Ring behavior — exactly one active ring per Step at all times (zero rings or two rings is a bug); the ring re-anchors on scroll and resize; it never intercepts, blocks, or synthesises a click on the host control underneath (the owner acts on the real control); it must hold ≥3:1 contrast against every Host App Skin background it is drawn over — the one accessibility obligation DLS cannot guarantee automatically.
UX-DR4: Progress Panel — lists Steps 1–6 with status (upcoming / current / done) and overall completion %; the panel's "current" Step must always match the Step the Spotlight Ring is targeting (a hard, testable FR2/FR4 consistency rule).
UX-DR5: Validation Message — inline, near the failing field/action; never color-only (every `ease-warning`/`ease-success` state pairs with explicit text naming the field/state); the Save-vs-Activate Gap catch specifically renders `ease-warning` (not `ease-success`) even though Save itself succeeded, because it needs to read as important, not alarming, and not as a plain success.
UX-DR6: Micro-Guide Card — numbered step cards matching the Telemetry Event log 1:1; one entry per completed Step naming the Step, the control that was highlighted, and (for Step 6) whether the Save-vs-Activate Gap catch fired.
UX-DR7: Specialist Review Card — guide preview plus stats (time-to-complete, completion path, any Validation Checkpoint catches, whether the Save-vs-Activate Gap fired) plus Approve/Reject actions; the card must persist and show the terminal state (`approved`/`rejected`) after an action rather than disappearing, so the Specialist can see the outcome of their own last action.
UX-DR8: All documented state patterns must render their specified treatment, not just the happy path — 8 owner-journey states (no Journey active; intent submitted/resolving; intent not recognized; Step in progress; validation failed; Save-vs-Activate Gap climax; Journey completed; Journey abandoned/re-entered) and 3 Specialist Review states (no pending guide; pending review; approved/rejected post-action).
UX-DR9: Accessibility floor — WCAG 2.2 AA for all EASE-authored chrome (DLS v7 default); the Spotlight Ring never hides, removes, or relabels the underlying host control's native focus order or accessible name; every validation state is conveyed by text as well as colour (also FR8).
UX-DR10: Voice & tone — every EASE-authored string is specific and state-aware per the 5 documented Do/Don't example pairs in `EXPERIENCE.md` (never generic chrome copy like "Please complete the form" or "Something went wrong"); identical directness for the owner and the Implementation Specialist personas — no persona-switching tone.
UX-DR11: Single-surface responsive web only — desktop/laptop web is the only target for MVP (locked decision, PRD §6.2); no tablet/mobile responsive-down behavior is in scope.

### FR Coverage Map

FR1: Epic 1 — Resolve stated intent to the Hero Journey (LLM Boundary Service + Intent Bar).
FR2: Epic 1 — Determine current Journey Step from application state (advisory LLM call + Validation Engine as source of truth).
FR3: Epic 1 — Highlight the correct next UI control per Step (Spotlight Ring + Bridge Contract).
FR4: Epic 1 — Persistent progress panel (Progress Panel component).
FR5: Epic 1 — Validate each table's required fields (Validation Checkpoint).
FR6: Epic 1 — Validate table combinations are defined where claimed (Validation Checkpoint).
FR7: Epic 2 — Validate the Save-vs-Activate Gap explicitly (the flagship checkpoint).
FR8: Epic 1 — Actionable recovery guidance on validation failure (Validation Message component + error envelope); re-exercised for the Step 6 catch in Epic 2 using the same component.
FR9: Epic 1 — Emit structured Telemetry Events (Telemetry Writer, event types for Steps 1–5); extended in Epic 2 for the Step 6/activation-related events.
FR10: Epic 3 — Generate a Micro-Guide from a completed Journey (Micro-Guide Generator).
FR11: Epic 3 — Present the Micro-Guide and journey stats for approval (Specialist Review Card + workflow).

NFR1 (deterministic completion): Epic 1 — enforced by the Validation Engine's design (pure functions, sole state owner); the rule Epic 2's FR7 checkpoint also obeys.
NFR2 (supported models only): Epic 1 — enforced at LLM Boundary Service setup (config-driven model choice).
NFR3 (WCAG 2.2 AA floor): Epic 1 — enforced as every EASE Chrome component is built; carried through unchanged in Epics 2 and 3's components.

## Epic List

### Epic 1: Guided Floor-Plan Setup (Steps 1–5)
The owner states an intent, EASE resolves it to the Build Floor Plans Journey, opens the floor-plan editor, and guides them — one spotlighted control at a time, with a live progress panel and per-field validation — through naming the plan, adding a room and table, configuring every table's required fields, creating a table combination, and saving the plan. Every step emits telemetry and every validation failure names the exact missing field. This epic also establishes the foundational scaffolding all later epics build on: the three-part repo structure, the versioned Bridge Contract, the EASE Core Service skeleton (Validation Engine + Telemetry Writer), the One App Single Module bootstrap for the Chrome Layer, and the separate LLM Boundary Service.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR8, FR9
**NFRs covered:** NFR1, NFR2, NFR3

### Epic 2: The Save-vs-Activate Catch & Journey Completion (Step 6)
Building on a saved plan from Epic 1, EASE does not treat "saved" as "done": it proactively surfaces that the plan isn't yet live, guides the owner into Shift Settings to activate it, and confirms the plan's tables now appear under Shift Availability before marking the full Hero Journey complete. This is the MVP's single most important, judging-visible moment (Innovation criterion), isolated into its own epic to keep it a sharp, rehearsable, independently-verifiable checkpoint.
**FRs covered:** FR7 (plus the FR8/FR9 instances triggered by this Step)

### Epic 3: Auto-Generated Micro-Guide & Specialist Review
Once a Hero Journey run completes (Epic 2's output), EASE automatically generates a visual, numbered Micro-Guide from that actual run's Telemetry Events, and an Implementation Specialist reviews it — approving it as canonical or rejecting it — on a dedicated review surface showing the guide alongside key journey stats, including whether the Save-vs-Activate Gap catch fired.
**FRs covered:** FR10, FR11

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic 1: Guided Floor-Plan Setup (Steps 1–5)

The owner states an intent, EASE resolves it to the Build Floor Plans Journey, opens the floor-plan editor, and guides them — one spotlighted control at a time, with a live progress panel and per-field validation — through naming the plan, adding a room and table, configuring every table's required fields, creating a table combination, and saving the plan.

### Story 1.1: Foundational Scaffolding — Repo Structure, Bridge Contract & Core Service Skeleton

As a developer on Team EASE,
I want the three-part repo structure, a versioned Bridge Contract file, and empty EASE Core Service/LLM Boundary Service skeletons in place,
So that every following story builds on one enforced contract instead of each workstream inventing its own conventions.

**Acceptance Criteria:**

**Given** a fresh checkout of the repo
**When** the scaffolding is in place
**Then** `prototype/walkthrough-assistant/` (Host App Skin), `ease-chrome/` (One App Single Module), `ease-core/` (Core Service), and `ease-llm-boundary/` (LLM Boundary Service) exist per the Structural Seed source tree, and the empty root `prototype/package.json` Next.js stub is deleted (AD-2).
**And** one Bridge Contract file exists defining a versioned selector map (Step → `data-ease-*` attribute) and a closed event vocabulary (fixed enum + typed payloads) (AD-10).
**And** both the Chrome Layer and the Host App Skin validate the Bridge Contract at startup and fail loudly (hard error, not a silent no-op) on a missing selector or unknown event name.
**And** the Core Service skeleton exposes empty Validation Engine and Telemetry Writer modules, and defines the one shared error envelope shape `{ code, message, step?, field? }` (AD-4, AD-6, AD-12). No database schema is created yet — tables are added only by the first story that needs them (Stories 1.6, 3.1).
**And** Node.js is pinned to 18.20.x and `better-sqlite3` to `^11.10.0` across all services (Stack).
**And** the LLM Boundary Service skeleton reads its model choice and credentials from config, restricted to the GrowthHack-supported set (Azure GPT 5.2, Gemini-3.1-flash-lite, LLAMA 3.2/3.3) — never hardcoded in code (NFR2).

### Story 1.2: State an Intent and Land on the Floor-Plan Editor

As a Resy restaurant owner,
I want to type my goal in plain language and have EASE resolve it to the Build Floor Plans journey and open the floor-plan editor with the first control spotlighted,
So that I don't have to already know ResyOS's menu structure to get started.

**Acceptance Criteria:**

**Given** the owner types a floor-plan-creation intent (e.g., "help me create a floor plan") into the Intent Bar
**When** EASE resolves it via the LLM Boundary Service (FR1)
**Then** the Build Floor Plans Journey opens and the Spotlight Ring lands on **Service → Floor Plan Settings** (Step 1).
**And** at least 8 documented paraphrasings of floor-plan intent (a committed fixture, AD-13) all resolve to the same Journey, verified by a headless test with no browser and no live model call.
**Given** an out-of-scope intent (e.g., "set my operating hours")
**When** EASE attempts resolution
**Then** it returns an explicit "not supported in this demo" response — never a silent wrong match (FR1, NFR1).
**And** the Intent Bar shows a lightweight inline pending state while resolving, never a full-screen loader (EXPERIENCE.md State Patterns).
**And** the Intent Bar is built as a DLS v7 component per `DESIGN.md` — no invented hex values, no custom CSS beyond documented DLS utilities (UX-DR1).

### Story 1.3: See My Progress and the Next Control Highlighted at Every Step

As a Resy restaurant owner,
I want EASE to always highlight exactly one next control and show me a progress panel of all 6 Steps,
So that I always know where I am and what to do next, even if I close and reopen the app.

**Acceptance Criteria:**

**Given** an active Journey
**When** any Step is current
**Then** exactly one Spotlight Ring is active (zero or two is a bug), it re-anchors on scroll and resize, and it never intercepts, blocks, or synthesises a click on the host control underneath (FR3, AD-10, UX-DR3).
**And** the Spotlight Ring holds ≥3:1 contrast against every Host App Skin background it is drawn over, and never hides or relabels the underlying host control's native focus order or accessible name (AD-11, UX-DR3/UX-DR9).
**Given** the Progress Panel is visible
**When** the owner is on any Step 1–6
**Then** it lists all 6 Steps with status (upcoming/current/done) and an overall completion percentage, and its "current" Step always matches the Spotlight Ring's target (FR4, UX-DR4 — a hard, testable consistency rule).
**Given** the owner closes and reopens the app mid-Journey
**When** they return to the Dashboard
**Then** guidance resumes at the correct next incomplete Step, not Step 1 (FR2 Consequences).
**And** both components are built from DLS v7 tokens/utilities per `DESIGN.md`, targeting desktop/laptop web only — no tablet/mobile responsive-down behavior is in scope (UX-DR1, UX-DR11).

### Story 1.4: Configure a Table With Required Fields, Validated

As a Resy restaurant owner,
I want EASE to check that every table I add has an ID, type, and minimum/maximum party size before letting me move on, and tell me exactly what's missing if I forget,
So that I don't end up with unusable tables further down the Journey.

**Acceptance Criteria:**

**Given** a table missing one or more of Table ID/name, Table Type, minimum party size, or maximum party size
**When** the owner attempts to proceed past table configuration
**Then** EASE blocks the Step with a Validation Message naming the specific missing field(s) — never a generic error (FR5, FR8).
**Given** all four required fields are set
**When** the owner proceeds
**Then** the Step is marked complete and the Progress Panel advances.
**And** the Validation Checkpoint is a pure function over Host App Skin state plus Journey state — no network call, no model inference — and ships with a headless unit test (AD-4, AD-13).
**And** the Validation Message is never color-only: `ease-warning` always pairs with explicit text naming the field/state (UX-DR5, UX-DR9).

### Story 1.5: Create a Table Combination, Validated

As a Resy restaurant owner,
I want EASE to confirm my table combination actually references two real tables and has its own capacity,
So that larger parties can be seated correctly without a broken combination slipping through.

**Acceptance Criteria:**

**Given** a claimed table combination referencing fewer than two existing tables, or with no combined capacity set
**When** the owner attempts to proceed
**Then** EASE blocks with a Validation Message naming the specific problem (FR6, FR8).
**Given** a combination referencing at least two existing tables with its own combined capacity set
**When** the owner proceeds
**Then** the Step is marked complete.
**And** this Validation Checkpoint is likewise a pure, headless-testable function reusing the same Validation Message component as Story 1.4 (AD-4, AD-13, UX-DR5).

### Story 1.6: Save the Floor Plan

As a Resy restaurant owner,
I want to save my floor plan once every table and combination is configured, and know that this action was recorded,
So that I can move on to making it live in a later step.

**Acceptance Criteria:**

**Given** all tables and combinations pass their Validation Checkpoints (Stories 1.4–1.5)
**When** the owner saves the plan
**Then** the `journeys` table (per `ease-core/db/schema.sql`) is created as part of this story — the first point a Journey record actually needs persisting — and the Journey record is persisted with a single `journey_id` minted once by the Core Service, and a `step_completed` Telemetry Event fires for Step 5 with a monotonic per-run `sequence` (FR9, AD-5, AD-6).
**And** the Progress Panel shows Step 5 as done and advances the current Step toward Step 6.
**And** the system does **not** claim the Journey is complete at this point — "saved" and "live" remain two separate, independently checkable states, reserved for Epic 2 (FR7's boundary).

## Epic 2: The Save-vs-Activate Catch & Journey Completion (Step 6)

Building on a saved plan from Epic 1, EASE does not treat "saved" as "done": it proactively surfaces that the plan isn't yet live, guides the owner into Shift Settings to activate it, and confirms the plan's tables now appear under Shift Availability before marking the full Hero Journey complete.

### Story 2.1: Learn That My Saved Plan Isn't Live Yet

As a Resy restaurant owner,
I want EASE to tell me right after I save that my plan isn't bookable yet, without me having to ask,
So that I don't walk away thinking I'm done when I'm not.

**Acceptance Criteria:**

**Given** a plan just saved (Story 1.6) and not yet selected in any Shift
**When** the save completes
**Then** EASE proactively surfaces "Saved — but not yet live. Activate it in a Shift to make it bookable." — unprompted, not hidden behind a request (FR7).
**And** this message renders with `ease-warning` styling, not `ease-success`, even though the Save action itself succeeded — it must read as important, not alarming, and not as a plain success (UX-DR5, `DESIGN.md` Colors).
**And** a Telemetry Event captures that the Save-vs-Activate Gap catch fired, tagged to Step 6, for later Micro-Guide use (FR9, AD-6).
**And** the Spotlight Ring moves toward Shift Settings as the next control (FR3 continuity into Step 6).

### Story 2.2: Activate the Plan in a Shift and Complete the Journey

As a Resy restaurant owner,
I want EASE to guide me into Shift Settings, help me select my plan, and confirm the tables now show up under Shift Availability,
So that my floor plan actually becomes usable and my Journey is marked complete.

**Acceptance Criteria:**

**Given** the owner follows the Spotlight Ring into **Service → Shift Settings → Edit Shift → Floor Plans**
**When** they select the plan and update the Shift
**Then** EASE checks two independent conditions — plan saved (Story 1.6) and plan selected in an active Shift with its tables visible under Shift Availability — and does not mark the Journey complete until both are true (FR7, AD-4).
**Given** both conditions pass
**When** the check completes
**Then** the Progress Panel shows 100%, a `journey_completed` Telemetry Event fires, and the Journey record is updated as complete (FR9, AD-5).
**And** this is the exact on-screen moment the demo showcases for the Innovation judging criterion — it must be visibly distinct, not a quiet background state change.

### Story 2.3: Get Blocked With a Specific Message If I Try to Activate Too Early

As a Resy restaurant owner,
I want EASE to block me with the exact missing requirement if I try to activate a Shift before every table field is set,
So that I fix the real problem instead of guessing what went wrong.

**Acceptance Criteria:**

**Given** an attempt to activate a Shift while some table still fails its Story 1.4 Validation Checkpoint
**When** the owner tries to proceed
**Then** EASE blocks with a Validation Message naming the specific missing field(s) — reusing the same component and error envelope from Epic 1, never a generic error (FR7, FR8, AD-12).
**And** the Spotlight Ring stays on the failing control rather than advancing (UX-DR3 continuity rule).

## Epic 3: Auto-Generated Micro-Guide & Specialist Review

Once a Hero Journey run completes (Epic 2's output), EASE automatically generates a visual, numbered Micro-Guide from that actual run's Telemetry Events, and an Implementation Specialist reviews it — approving it as canonical or rejecting it — on a dedicated review surface showing the guide alongside key journey stats.

### Story 3.1: A Micro-Guide Is Automatically Generated When a Journey Completes

As an Implementation Specialist,
I want a visual, numbered Micro-Guide to be generated automatically the moment an owner's Journey completes, matching the exact steps and catches from that real run,
So that I have real evidence-based material to review instead of documentation written by hand.

**Acceptance Criteria:**

**Given** a `journey_completed` Telemetry Event (Story 2.2) and its relational Journey record are both committed
**When** the Micro-Guide Generator runs
**Then** the `micro_guides` table (per `ease-core/db/schema.sql`) is created as part of this story — the first point a Micro-Guide record needs persisting — and it joins the two by `journey_id`, orders entries by the event `sequence` (not wall-clock time), and produces one Micro-Guide entry per completed Step (Step 1 through Step 6) — each naming the Step, the control that was highlighted, and, for Step 6, whether the Save-vs-Activate Gap catch fired (FR10, AD-5).
**And** the generated guide's step sequence matches the Telemetry Event log's completed Steps in the same order.
**And** the new guide is created in state `pending_review` (FR11).
**Given** the relational record and event log disagree (e.g., a partial write)
**When** generation is attempted
**Then** it is reported as a failed generation — never silently half-rendered (AD-5).

### Story 3.2: Review and Approve or Reject a Pending Micro-Guide

As an Implementation Specialist,
I want to see the generated Micro-Guide next to the run's key stats and approve or reject it,
So that only a guide I've verified becomes canonical for the next owner.

**Acceptance Criteria:**

**Given** a Micro-Guide in state `pending_review`
**When** the Specialist opens the Specialist Review surface
**Then** the Specialist Review Card shows the guide preview alongside journey stats — time-to-complete, completion path, any Validation Checkpoint catches, and whether the Save-vs-Activate Gap fired (FR11, `EXPERIENCE.md` Component Patterns).
**Given** the Specialist approves the guide
**When** the action is taken
**Then** its state transitions `pending_review → approved`, becomes canonical, and is reflected as such if the same Journey is re-run in the demo (FR11).
**Given** the Specialist rejects the guide
**When** the action is taken
**Then** its state transitions `pending_review → rejected`, the candidate is discarded with no automatic retry, and any previously `approved` guide for this Journey remains canonical.
**And** the card persists and shows the terminal state (`approved`/`rejected`) after the action rather than disappearing, so the Specialist can see the outcome of their own last action (UX-DR7).
**Given** no Micro-Guide is currently pending
**When** the Specialist opens the surface
**Then** it shows the empty state "No guide waiting for review yet." (UX-DR8).
