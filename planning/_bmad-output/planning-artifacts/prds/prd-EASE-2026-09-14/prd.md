---
title: EASE — GrowthHack 2026 MVP
status: final
created: 2026-09-14
updated: 2026-09-15
---

# PRD: EASE — GrowthHack 2026 MVP
*Working title — confirm.*

## 0. Document Purpose

This PRD scopes the **GrowthHack 2026 MVP** for EASE for the PM, Team EASE, and downstream workflow owners (UX, Architecture, Epics/Stories, Development, QA). It builds on two existing artifacts rather than duplicating them: the [Product Brief](../../briefs/brief-EASE-2026-09-14/brief.md), which holds the problem framing, judging-criteria strategy, scope boundary, and open questions; and the confirmed [hero-journey ground truth](/planning/docs/product/hero-journey-floor-plan.md), which defines the real Resy "Build Floor Plans" flow this MVP must model. The PRD uses a glossary-anchored vocabulary, globally numbered FRs, and inline `[ASSUMPTION]` tags indexed in §9.

## 1. Vision

EASE is an intelligent experience and execution layer that helps a Resy restaurant owner accomplish a task — starting with "build and activate a floor plan" — without needing to learn ResyOS's screens, terminology, or hidden multi-step dependencies first. Instead of a long help article, the owner states an intent ("Help me create a floor plan"), and EASE guides them step by step inside a realistic mocked application: highlighting the right control, tracking progress, validating each action against real completion criteria (not just "did they click something"), catching the flow's most important hidden trap, and — when the journey succeeds — automatically generating a visual guide for the next user, subject to a human Implementation Specialist's review.

The GrowthHack MVP proves exactly one thing well: the full EASE loop — **Ask → Guide → Complete → Observe → Learn → Approve → Improve** — on one real, evidence-grounded journey. It does not attempt the broader EASE product family; it is the seed that the roadmap in the brief's Vision section grows from.

## 2. Target User

### 2.1 Jobs To Be Done

- **As a Resy restaurant owner/manager onboarding onto the platform**, I need to build a working floor plan (tables, capacities, combinations) and get it live in service, without piecing together which button to click, whether my last step actually worked, or why my finished plan isn't showing up for guests.
- **As an Implementation Specialist**, I need a fast way to check that an auto-generated guide reflects a real successful journey, so I remain the quality gate on what becomes canonical guidance — rather than being the only navigation mechanism for every restaurant.

### 2.2 Non-Users (v1)

- Restaurant partners already fully onboarded on the live production Resy platform — the MVP demonstrates on a **mocked** application only (see Non-Goals, §5).
- Tier 2/Tier 3 partners needing ongoing proactive engagement post-onboarding — a real, named future direction (per the Resy onboarding meeting recap) but explicitly out of scope for this MVP.
- Any user of the other 12+ "future application" use cases named in the EASE vision (merchant onboarding, complaints, colleague onboarding, cross-system orchestration, etc.) — not this MVP's audience.

### 2.3 Key User Journeys

- **UJ-1. A Resy owner builds and activates a floor plan, and EASE catches the one mistake that would otherwise sink the demo.**
  - **Persona + context:** a restaurant owner mid-onboarding, self-serving through setup with limited time for structured discovery (per the Resy onboarding meeting recap).
  - **Entry state:** authenticated into the mocked ResyOS Dashboard (web surface only for MVP — **locked decision**, not an open question; see §9). No floor plan exists yet for this venue.
  - **Path:** (1) types/states the intent "Help me create a floor plan"; (2) EASE opens the floor-plan editor and highlights **Service → Floor Plan Settings** (Step 1); (3) names the plan, adds a room, places a table (Step 2); (4) configures the table's ID, type, and min/max party size — EASE highlights each required field in turn and validates it as filled (Step 3); (5) creates a table combination (Step 4); (6) saves the plan (Step 5).
  - **Climax:** EASE does **not** treat "saved" as "done." It proactively surfaces: *"Your plan is saved but not yet live — activate it in a Shift to make it bookable."* The owner follows EASE into **Service → Shift Settings → Edit Shift → Floor Plans**, selects the plan, and updates the Shift (Step 6).
  - **Resolution:** EASE confirms the tables are now visible under Shift Availability, marks the journey complete, and shows the 6-Step progress panel at 100%. The journey's telemetry and a generated visual micro-guide are queued for specialist review.
  - **Edge case:** if the owner tries to skip ahead (e.g., attempts to activate a Shift before every table has a required field set), EASE blocks with a specific, actionable message naming exactly which field is missing — not a generic error.

- **UJ-2. An Implementation Specialist reviews and approves the guide EASE generated from a successful run.**
  - **Persona + context:** the Implementation Specialist who today is the primary navigation mechanism for every restaurant and, in this MVP, shifts toward quality control (per the EASE vision's Human-in-the-Loop model). This role also carries the Product Brief's Business Unit Value strategy into the product itself through Meagan McCallum's and Rachel Talentino's real process-owner perspective, rather than only in the pitch narrative.
  - **Entry state:** a completed UJ-1 run has produced a candidate visual micro-guide and journey telemetry (completion path, any validation catches, time-to-complete).
  - **Path:** opens the (stubbed) specialist review surface; sees the generated guide alongside the underlying journey's key stats; scans the save-vs-activate catch that EASE surfaced.
  - **Climax:** approves the guide (state: `pending_review` → `approved`), making it canonical for the next owner's journey — or rejects it (state: `pending_review` → `rejected`), in which case the prior canonical guide (if any) remains active and the rejected candidate is discarded, not retried automatically. `[ASSUMPTION: for the demo, this is a single approve/reject action, not the full EASE Studio versioning/testing/publishing workflow described in the vision — see Non-Goals]`
  - **Resolution:** the loop closes — Ask → Guide → Complete → Observe → Learn → **Approve** → Improve.

## 3. Glossary

- **EASE** — the intelligent experience and execution layer this PRD scopes; understands intent, guides action, validates completion, and learns from journeys. Corresponds to Stage 1 (**EASE Guide**) of the EASE Maturity Model described in the source vision — "show me what to do" — the only stage this MVP builds.
- **Journey** — an approved, structured path toward completing a specific user goal (e.g., "build a floor plan"), composed of ordered Steps.
- **Hero Journey** — the single journey this MVP builds end-to-end: "Build Floor Plans," per [hero-journey-floor-plan.md](/planning/docs/product/hero-journey-floor-plan.md). MVP-required completion path: **Steps 1–6**; Step 7 is out of scope (see §6.2 for the full boundary).
- **Step** — one discrete, checkable unit of work within the Hero Journey (e.g., "configure table capacity"), numbered Step 1 through Step 6 for MVP purposes. Each Step has a Validation Checkpoint.
- **Validation Checkpoint** — a deterministic, testable condition proving a Step was actually completed (not merely attempted). See FR-5, FR-6, and FR-7 for the concrete list.
- **Floor Plan** — the saved representation of a venue's rooms, tables, and table combinations in the mocked ResyOS application.
- **Table Combination** — two or more individually reservable tables joined to serve a larger party, with its own combined capacity.
- **Shift** — the service-time construct in ResyOS that must reference a Floor Plan before that plan's tables become bookable. Distinct from the Floor Plan itself — see the Save-vs-Activate Gap.
- **Save-vs-Activate Gap** — the confirmed friction point where a Floor Plan can be fully built and saved yet remain invisible to guests until separately selected inside an active Shift. The MVP's flagship proactive-guidance moment.
- **Telemetry Event** — a structured, timestamped record of a discrete occurrence during a Journey (started, step viewed, step completed, validation failed, backtracked, help requested, abandoned, completed).
- **Micro-Guide** — the auto-generated, visual how-to artifact produced from a single successful Journey run, submitted for Specialist Review.
- **Specialist Review** — the human-in-the-loop checkpoint where an Implementation Specialist approves (or rejects) a Micro-Guide before it becomes canonical.
- **Implementation Specialist** — the Resy-side human role that guides partners through onboarding today, and whose role shifts toward quality control under EASE.
- **Intent** — the user's stated goal in natural language, resolved by EASE to a specific Journey.

## 4. Features

### 4.1 Intent Understanding & Journey Selection

**Description:** The owner expresses a goal in natural language (typed for MVP). EASE uses an LLM to resolve that intent to the single supported Journey (Build Floor Plans) and its current Step, given the mocked application's current screen state. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Resolve stated intent to the Hero Journey

The system can accept a free-text user intent (e.g., "help me create a floor plan," "I need to set up my tables") and resolve it to the Build Floor Plans Journey. Realizes UJ-1.

**Consequences (testable):**
- A named test set of at least 8 representative paraphrasings of floor-plan-creation intent (e.g., "help me create a floor plan," "I need to set up my tables," "let's build the dining layout") all resolve to the same Journey.
- An intent that does not match the Hero Journey (out of scope, e.g., "set my operating hours") produces an explicit "not supported in this demo" response rather than a silent wrong match. `[ASSUMPTION: MVP supports exactly one Journey; graceful non-match handling matters more for demo credibility than breadth]`

**Out of Scope:**
- Multi-Journey intent routing (schedules, POS integration, etc.) — those Journeys are not modeled in the MVP (see Non-Goals).

#### FR-2: Determine current Journey Step from application state

Given the mocked application's current screen and the Floor Plan's current save/configuration state, the system determines which Step of the Hero Journey the owner is on. Realizes UJ-1.

**Consequences (testable):**
- Re-entering the flow mid-journey (e.g., after closing and reopening) resumes guidance at the correct next incomplete Step rather than restarting from Step 1.

### 4.2 Contextual UI Guidance

**Description:** EASE visually highlights the exact next control the owner should act on, de-emphasizes irrelevant UI, and maintains a persistent progress panel naming all Steps and the owner's position among them. Realizes UJ-1.

**Functional Requirements:**

#### FR-3: Highlight the correct next UI control per Step

For each of the Hero Journey's 6 required Steps (Step 1: open editor; Step 2: name/lay out plan; Step 3: configure table fields; Step 4: create combination; Step 5: save; Step 6: activate via Shift), the system highlights the specific control the owner needs next, matching Steps 1–6 of the confirmed 7-step ground-truth sequence in [hero-journey-floor-plan.md](/planning/docs/product/hero-journey-floor-plan.md). Realizes UJ-1.

**Consequences (testable):**
- At every Step, exactly one primary control is visually highlighted; no Step leaves the owner without a highlighted next action.

#### FR-4: Persistent progress panel

The system shows a progress panel listing every Step in the Hero Journey with its status (done / current / upcoming) and an overall completion percentage, visible throughout the Journey. Realizes UJ-1.

**Consequences (testable):**
- The panel's "current Step" always matches the Step FR-2 has determined the owner to be on.

### 4.3 Deterministic Step Validation

**Description:** EASE checks whether each Step was actually completed correctly against concrete, checkable conditions — not inferred from an LLM's guess. Realizes UJ-1. This is the feature that most directly answers "why not just a chatbot?" (per the brief's differentiation argument).

**Functional Requirements:**

#### FR-5: Validate each table's required fields

For every table the owner adds, the system validates that Table ID/name, Table Type, minimum party size, and maximum party size are all set before allowing the Step to be marked complete. Realizes UJ-1.

**Consequences (testable):**
- Attempting to proceed past table configuration with any of the four fields empty is blocked with a message naming the specific missing field(s).

#### FR-6: Validate table combinations are defined where claimed

If the owner indicates a table combination exists, the system validates that the combination references at least two existing tables and has its own combined capacity set. Realizes UJ-1.

#### FR-7: Validate the Save-vs-Activate Gap explicitly

The system distinguishes "Floor Plan saved" from "Floor Plan active in a Shift and visible under Shift Availability" as two separate, independently checkable states, and does not mark the Hero Journey complete until both are true. Realizes UJ-1's climax moment.

**Consequences (testable):**
- A Floor Plan that is saved but not yet selected in any Shift is reported by the system as "not yet live," with the specific next action (activate via Shift) named — matching the documented friction in [hero-journey-floor-plan.md](/planning/docs/product/hero-journey-floor-plan.md).
- Once the plan is selected in an active Shift, the system confirms the tables now appear under Shift Availability before marking the Journey complete.

**Notes:** This is the single most important FR for the Innovation judging criterion (per the brief) — the demo should make this exact validation moment visible on screen.

### 4.4 Error Detection & Recovery

**Description:** When validation fails, EASE explains what's wrong in specific, actionable terms and helps the owner recover, rather than a generic error. Realizes UJ-1's edge case.

**Functional Requirements:**

#### FR-8: Actionable recovery guidance on validation failure

When any FR-5/FR-6/FR-7 validation fails, the system surfaces a specific message naming the exact missing or incorrect field/state and the concrete next action to fix it.

**Consequences (testable):**
- No validation failure message is generic (e.g., "something went wrong"); every failure message names the specific field or state at issue.

### 4.5 Journey Telemetry Capture

**Description:** Every Journey run emits structured events. Those events feed the Micro-Guide and demonstrate both the "Observe" step of the EASE loop and the MVP's friction-identification claim. Validation failures, backtracking, and help-requested events are the per-run friction signals for this scope.

**Functional Requirements:**

#### FR-9: Emit structured Telemetry Events

The system emits a Telemetry Event for each of: journey started, step viewed, step completed, validation failed, backtracked, help requested, journey abandoned, journey completed — each timestamped and tagged with the current Step (Step 1 through Step 6).

**Consequences (testable):**
- A single successful end-to-end Hero Journey run produces a complete, ordered event log with no missing step-completed events for any of the 6 required Steps.

**Notes:** Per-run friction signals (validation failed, backtracked, help requested) satisfy the source vision's "friction identification" element of its own stated GrowthHack MVP definition. This is distinct from the full **EASE Signals** product (proactive, cross-user pattern detection across many journeys), which remains out of scope — see §5 Non-Goals.

### 4.6 Auto-Generated Micro-Guide

**Description:** On a successful Journey completion, the system automatically produces a visual, step-by-step Micro-Guide from that actual successful run — the Scribe-like artifact named in the EASE vision. Realizes UJ-2's entry state.

**Functional Requirements:**

#### FR-10: Generate a Micro-Guide from a completed Journey

Upon Journey completion (FR-7 satisfied), the system generates a visual Micro-Guide reflecting the actual sequence of Steps, highlighted controls, and the save-vs-activate catch encountered.

**Consequences (testable):**
- The generated Micro-Guide's step sequence matches the Telemetry Event log's completed Steps in the same order.
- The generated Micro-Guide contains, at minimum, one entry per completed Step (Step 1 through Step 6), each entry naming the Step, the UI control that was highlighted, and (for Step 6) the save-vs-activate catch if it was triggered during that run.

**Out of Scope:**
- Guide versioning, multiple candidate guides, or comparison across multiple runs — single-run generation only for MVP.

### 4.7 Specialist Review (Human-in-the-Loop)

**Description:** A stubbed but real approval step: an Implementation Specialist reviews the generated Micro-Guide and key journey stats, and approves it. This is the feature that proves EASE's human-governance story is a deliberate design choice, not a hedge. Realizes UJ-2.

**Functional Requirements:**

#### FR-11: Present the Micro-Guide and journey stats for approval

The system presents the generated Micro-Guide alongside basic journey stats (time to complete, whether the save-vs-activate catch was triggered) in a single review surface, with an approve/reject action.

**Consequences (testable):**
- A Micro-Guide is created in state `pending_review`.
- Approving it transitions its state to `approved` (treated as canonical); it is reflected as such if the same Journey is re-run in the demo.
- Rejecting it transitions its state to `rejected`; no new canonical guide is set, and any previously approved guide for this Journey (if one exists) remains canonical.

**Out of Scope:**
- Full EASE Studio (versioning, testing, publishing workflows, confidence scoring) — a single approve/reject action stands in for the whole workflow this MVP demonstrates, not the finished Studio product.

## 5. Non-Goals (Explicit)

- **Not building the full EASE product family** (Signals, Insights, Studio, Control, Assist, Agent as standalone products) — this MVP includes only thin slices: per-run friction telemetry (§4.5/FR-9, which satisfies the vision's "friction identification" MVP element without building the full, cross-user **EASE Signals** product) and a single approve/reject stub of Studio (§4.7).
- **Not building any of the other 12+ "future application" use cases** named in the EASE vision (merchant onboarding, supplier enablement, customer servicing, complaints, colleague onboarding, cross-system orchestration, etc.).
- **Not building Maturity Model stages 2–5** (Adapt, Predict, Assist, Act) — this MVP proves Stage 1 (**EASE Guide**) only.
- **Not integrating with any real Resy, Tock, Salesforce, or Looker system** — the mocked application is the whole point of keeping this demo-able in the available time.
- **Not supporting voice interaction, multilingual assistance, or other accessibility capabilities** named in the vision's roadmap — real future items, not this MVP.
- **Not modeling any Journey other than Build Floor Plans** — schedules, reservation inventory, POS integration, and test transactions (all named in the Resy onboarding recap) are future Journeys, not v1.
- **Not modeling Assigned Seating Events** — the ground-truth research notes Assigned Seating Events require a selectable Floor Plan as a dependency; the MVP produces that Floor Plan but does not build the Assigned Seating Events feature itself.

## 6. MVP Scope

### 6.1 In Scope

- The Build Floor Plans Hero Journey, matching **Steps 1–6** of the ground-truth sequence (Step 7 excluded — see §6.2).
- A realistic mocked Resy-style web application reproducing that flow's screens and terminology.
- FR-1 through FR-11 as specified above.
- The save-vs-activate catch as the flagship proactive-guidance and Innovation-criterion moment.

### 6.2 Out of Scope for MVP

- **iPad/native-app surface — web only.** Locked decision (not an open question): the real Resy flow supports both web and iPad, but the MVP targets web only for demo simplicity.
- **Single Day Edit (Step 7 of the ground-truth journey) — out of MVP scope.** The holiday/special-service one-off layout-change flow is real and evidence-backed, but it is not part of the MVP's required 6-Step completion path, telemetry, or validation. Revisit it only as a bonus demo beat if Steps 1–6 are fully rehearsed and stable; do not plan toward it.
- Real POS/Toast integration or table-name-matching validation across systems — documented as a real friction point in the source research (Resy/POS table names must match exactly) but out of scope for a mocked, single-system demo where no second system exists to mismatch against.
- Any persona/role-based personalization, proactive detection of stuck users (the full **EASE Signals** product, as distinct from the per-run friction telemetry in §4.5/FR-9), or aggregated analytics (**EASE Insights**) beyond the single-run telemetry log in §4.5.

## 7. Success Metrics

**Primary**
- **SM-1**: Deterministic validation accuracy — the system correctly identifies the true completion/incompletion state at every Step (especially the save-vs-activate gap) across all rehearsal runs. Validates FR-5, FR-6, FR-7.
- **SM-2**: End-to-end Journey completion — a first-time demo run of the Hero Journey (start to Shift-activation confirmation) completes without a validation false-positive or false-negative. Validates FR-1–FR-9.
- **SM-5**: Zero specialist interventions required — a first-time owner completes the full Hero Journey (Steps 1–6) using only EASE's guidance, with no human Implementation Specialist assistance. This is the concrete product proxy for the brief's Business Unit Value and Feasibility/Scalability arguments: less specialist hand-holding and a believable path toward lower onboarding load. Validates FR-3, FR-4, FR-8.

**Secondary**
- **SM-3**: Micro-Guide fidelity — the generated guide's step sequence matches the actual completed run's Telemetry Event log. Validates FR-10.
- **SM-4**: Specialist Review completes in a single pass (no confusing UI blocking approval). Validates FR-11.

**Counter-metrics (do not optimize)**
- **SM-C1**: Do not optimize for demo speed/slickness at the cost of validation correctness — a fast but wrong validation (e.g., marking the Journey complete while the plan is still save-only) directly undermines the "why not just a chatbot" argument this MVP exists to prove. Counterbalances SM-2.
- **SM-C2**: Do not optimize breadth (more Journeys, more intents recognized) over depth on the one Hero Journey — recall that Hack Completeness is only 10% of the judging weight (per the brief); a single deeply-correct Journey outperforms several shallow ones. Counterbalances SM-1/SM-2.

## 8. Open Questions

1. **Specialist Review surface fidelity** — how polished does the stubbed EASE Studio/Control surface need to look for the demo vs. how functional it needs to be (per Hack Completeness being only 10%-weighted, functional-but-plain likely beats polished-but-shallow).
2. **`prototype/walkthrough-assistant/` reuse** — carried over from the brief: still needs confirmation whether the existing prototype mock is a usable starting point for the mocked application this PRD specifies, now that the exact 6-Step required sequence and validation checkpoints are locked. **Owner:** whoever picks up Architecture (§4.5–4.7 of the brief's workstream matrix names Akshat Dhingra/Sachin Kumar Wadhwani/Shweta Jha). **Revisit:** at Architecture kickoff, before any new scaffolding is built from scratch.

*(Two earlier open questions — web vs. iPad surface, and Single Day Edit inclusion — are now resolved; see §6.2 and the Assumptions Index below.)*

## 9. Assumptions Index

- §2.3, §6.2 (UJ-1 entry state) — **Locked decision**, not an open assumption: MVP targets the web surface only, not iPad, for the mocked application.
- §4.1 (FR-1) — MVP supports exactly one Journey (Build Floor Plans); non-matching intents get an explicit "not supported" response rather than silent misrouting.
- §4.7 (FR-11, UJ-2) — Specialist Review is a single approve/reject action for the demo, standing in for the full EASE Studio workflow described in the vision, not a build of Studio itself.
- §3 (Glossary) — Step-count boundary (Steps 1–6 in scope, Step 7 excluded): full explanation lives in §6.2, resolved 2026-09-15.

---

## 10. Constraints and Guardrails

**Safety:** Per the EASE vision's Human-in-the-Loop model, the LLM must never independently declare a Journey complete — completion is always determined by deterministic validation (§4.3), with the LLM confined to intent resolution (§4.1) and step-location reasoning (FR-2). This mirrors the architecture position already taken in the brief's build-vs-buy framing ("buy the rails, build the intelligence").

**Cost / Tooling:** Per the GrowthHack 2026 Gen AI FAQ (see [growthhack-source-brief.md](/planning/docs/growthhack-source-brief.md#4-faq)), only the officially supported models are available for the hack (Open Source: LLAMA 3.2/3.3; Closed Source: Azure GPT 5.2, Gemini-3.1-flash-lite; Embedding: BGE-Large, ADA02), with credentials shared 2 days before the event and no credential-sharing across team members. The FAQ also names four supported capabilities the build may draw on: **Redaction, Substitution, Safechain, Local Memory**. `[NOTE FOR PM]` architecture/build work should pick a specific supported model (and any of the four capabilities it needs) before implementation starts, not assume open availability.

## 11. Why Now

Timing is load-bearing, not incidental: GrowthHack 2026 runs September 23–24 with a hard 5-minute/25MB submission deadline of 7:00 PM on September 24, Round 1 judging September 28–October 9, and Round 2 October 19–23 (per the confirmed judging process in the brief). This PRD exists specifically to be buildable, demoable, and judgeable within that fixed window — every scope decision above (§5, §6.2) is calibrated against that deadline, not against the full EASE vision's timeline.

## 12. Risk and Mitigations

- **Risk:** LLM intent-resolution misfires live during the recorded demo. **Mitigation:** rehearse with a small, fixed set of confirmed working phrasings; keep a deterministic fallback path if live LLM behavior is flaky on demo day (per the team's own "Single points of dependency and backup coverage" plan in the brief's source material).
- **Risk:** Over-investing in visual polish given Hack Completeness is only 10%-weighted. **Mitigation:** SM-C2 above explicitly counterbalances this; prioritize correctness of the save-vs-activate validation over UI polish.
- **Risk:** Confusing the demo's mocked application with claims about the live Resy production system. **Mitigation:** the pitch narrative (owned by Satvik per the brief's team structure) should state explicitly that this is a mocked application demonstrating the pattern, consistent with Hack Feasibility criteria asking about production-rollout feasibility rather than claiming current production integration.
