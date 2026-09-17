---
name: EASE — GrowthHack 2026 MVP
status: final
sources:
  - ../../prds/prd-EASE-2026-09-14/prd.md
  - ../../briefs/brief-EASE-2026-09-14/brief.md
  - /planning/docs/product/hero-journey-floor-plan.md
updated: 2026-09-15
---

# EASE — Experience Spine

> GrowthHack 2026 MVP. Single-surface responsive web (locked, PRD §6.2). Realizes UJ-1 (owner builds/activates a Floor Plan) and UJ-2 (Implementation Specialist reviews a generated Micro-Guide). Paired with `DESIGN.md` (two-layer brand: Host App Skin + EASE Chrome Layer). `prototype/walkthrough-assistant/` is reference/inspiration only, per explicit user choice — not ground truth.

## Foundation

Single-surface responsive web. EASE Chrome Layer built on DLS v7 (`@americanexpress/dls-react`) per the repo's design-system mandate; `DESIGN.md` is the visual identity reference. The Host App Skin (mocked ResyOS Dashboard) is a separate, deliberately non-DLS surface EASE operates on top of — see `DESIGN.md.Brand & Style`. No authentication flow is modeled beyond an already-authenticated entry state (PRD §2.3 UJ-1 entry state: "authenticated into the mocked ResyOS Dashboard"). Single-tenant, single-venue for the demo — no multi-venue switcher. `[ASSUMPTION]`

**Guiding principle.** The owner should succeed without first having to learn ResyOS's screens, terminology, or hidden multi-step dependencies (PRD §1 Vision). Every Information Architecture, Component Pattern, and State Pattern decision below serves that — not teaching the host app.

**Scope boundary** (inherited from PRD §5 Non-Goals and §6.2):
- This spine models the Build Floor Plans Hero Journey, **Steps 1–6 only**. **Step 7 (Single Day Edit)** is explicitly excluded, not deferred — it does not appear in the Progress Panel, Telemetry Events, or Micro-Guide.
- Also not modeled anywhere in this spine: the full EASE product family (Signals, Insights, Studio, Control, Assist, Agent as standalone products), Maturity Model stages 2–5, any other Journey (schedules, POS integration, etc.), Assigned Seating Events, real POS/Toast table-name-matching validation, and iPad/native surfaces.

**Guardrails** (PRD §7 counter-metrics SM-C1/SM-C2). Component and State Patterns must never trade validation correctness for demo speed/slickness, and must never trade depth on this one Hero Journey for breadth across more Journeys/intents.

**Relationship to `prototype/walkthrough-assistant/`.** This UX Discovery pass captured a fresh vision rather than treating the existing prototype as ground truth — the user's explicit choice for *this spine's authoring process*. That's separate from the PRD's still-open Architecture question (§8 Open Question #2) of whether the prototype's *codebase* is a usable implementation starting point; Architecture may still reuse/adapt that code to build toward this spine's spec. This spine does not resolve that open question.

## Information Architecture

| Surface | Reached from | Purpose |
|---|---|---|
| Mocked ResyOS Dashboard (Host App Skin) | App load (pre-authenticated) | The venue owner's home base — where all 6 Hero Journey Steps physically happen (Floor Plan Settings, Shift Settings, etc.), per `hero-journey-floor-plan.md`. |
| EASE Intent Bar | Persistent, docked on the Dashboard | Entry point for stating a goal in free text (FR-1). `[ASSUMPTION]` Always visible, not hidden behind a launcher icon — the MVP's core claim is proactive guidance, not "help on demand." |
| EASE Spotlight + Progress Panel | Overlaid once a Journey is active | The guided-execution surface: spotlight ring on the next control (FR-3) + persistent Step 1–6 progress (FR-4), visible for the Journey's duration. |
| Micro-Guide (generated) | Auto-surfaced on Journey completion | The Scribe-style step-by-step artifact generated from the just-completed run (FR-10). |
| Specialist Review | Separate stubbed surface, reached by the Implementation Specialist persona | Approve/reject the pending Micro-Guide alongside journey stats (FR-11). Stands in for the brief's broader **EASE Studio / EASE Control** loop — a single approve/reject action for this MVP, not the full Studio workflow (PRD §4.7 Out of Scope). `[ASSUMPTION]` A simple standalone screen/route for the demo, not embedded inside the owner-facing Dashboard — the PRD's Open Question #1 (surface fidelity) is intentionally left light here; revisit once a key-screen mock exists. |

The Intent Bar and Spotlight+Progress Panel are both EASE Chrome Layer, always co-present with the Host App Skin once a Journey starts — never a full-screen takeover of the host app. Specialist Review is reached by a different persona (Implementation Specialist, not the owner) and is out of the owner's navigation path entirely.

**Spine-local glossary (not yet in `prd.md` §3 Glossary):** **Host App Skin** and **EASE Chrome Layer** are terms coined in this UX pass to name the two-brand split described in `DESIGN.md`. `[NOTE FOR PM]` recommend folding both into the PRD Glossary on its next revision so Architecture/Build/QA share one vocabulary; until then, this spine is their canonical definition.

→ Composition reference: none yet — no key-screen mocks rendered this pass (Fast path skipped creative tools per user's choice). Revisit at Finalize / next UX iteration.

## Voice and Tone

Per the brief's differentiation argument ("EASE says 'you're on step 3, here's the exact action, and I'll know when you've done it correctly'") — EASE speaks in specific, state-aware sentences, never generic chrome copy.

| Do | Don't |
|---|---|
| "Step 3 of 6 — set this table's minimum and maximum party size." | "Please complete the form." |
| "Saved — but not yet live. Activate it in a Shift to make it bookable." | "Success!" |
| "Missing: maximum party size for Table 4." | "Something went wrong." |
| "Nice — Table 4 and Table 5 are now combined for parties of 6–8." | "Combination created successfully." |
| Same directness for the owner and the Implementation Specialist — no persona-switching tone. | A cheerier tone for the owner and a drier tone for the specialist. |

## Component Patterns

Behavioral. Visual specs live in `DESIGN.md.Components`. Each row's validation behavior is a **Validation Checkpoint** in PRD terms (§3 Glossary) — a deterministic, testable condition, never an LLM guess.

| Component | Use | Behavioral rules |
|---|---|---|
| Intent Bar | Persistent on Dashboard | Accepts free text; on submit, resolves to the Hero Journey or an explicit "not supported in this demo" response (FR-1) — never a silent wrong match. |
| Spotlight Ring | Overlaid on Host App Skin | Exactly one active ring per Step, always (FR-3) — zero rings = a bug, two rings = a bug. Ring follows the control if the owner scrolls/resizes. |
| Progress Panel | Persistent once a Journey is active | Lists Steps 1–6 with status (upcoming / current / done) and overall %. "Current" always matches the Step the Spotlight Ring is targeting (FR-2/FR-4 consistency — hard rule). |
| Table Configuration (Host App Skin, EASE-validated) | Step 3, inside the floor-plan editor | Every table is an operational record, not decorative artwork (per `hero-journey-floor-plan.md`) — EASE's Validation Checkpoint requires **Table ID/name**, **Table Type**, minimum party size, and maximum party size all set (FR-5) before the Step can complete, alongside the table's physical placement/shape on the canvas (Host App Skin concern, not separately validated by EASE). |
| Table Combination (Host App Skin, EASE-validated) | Step 4 | EASE's Validation Checkpoint requires a combination reference at least **two** existing tables with its own combined capacity (FR-6). `[NOTE]` the ground-truth source (`hero-journey-floor-plan.md`) describes combining "combinable tables" generally without a hard minimum; the two-table floor is this MVP's PRD-scoped rule (FR-6), not a ground-truth constraint — Architecture should not read this as the real Resy product's own limit. |
| Validation Message | Inline, near the field/action it concerns | Names the exact missing field/state and the concrete next action (FR-8) — never a bare pass/fail icon with no text. |
| Micro-Guide Card | Auto-surfaced post-completion | Numbered step cards matching the Telemetry Event log 1:1 (FR-10) — one entry per completed Step, naming the Step, the control that was highlighted, and (Step 6) the Save-vs-Activate Gap catch if triggered. |
| Specialist Review Card | Specialist Review surface | Guide preview + stats (time-to-complete, completion path, any Validation Checkpoint catches, whether the Save-vs-Activate Gap fired) + Approve/Reject (FR-11) — per PRD §2.3 UJ-2, stats are not limited to time-to-complete alone. Reject discards the candidate; any prior approved guide stays canonical — no auto-retry. |

## State Patterns

### Owner journey states (Dashboard, Intent Bar, Chrome overlay)

| State | Surface | Treatment |
|---|---|---|
| No Journey active | Dashboard | Intent Bar visible, no Spotlight/Progress Panel. Host App Skin behaves like a normal (if empty) ResyOS Dashboard. |
| Intent submitted, resolving | Intent Bar | Brief pending/loading treatment while the LLM resolves stated intent to a Journey (FR-1) — `[ASSUMPTION]` a lightweight inline spinner/disabled-submit state, not a full-screen loader, since resolution should be fast. |
| Intent not recognized | Intent Bar | Explicit "not supported in this demo" response (FR-1) — never a silent wrong-Journey match. |
| Journey started, Step in progress | Dashboard + Chrome overlay | Spotlight Ring on the current Step's control; Progress Panel shows current Step; no validation message unless the owner has attempted and failed the Step. |
| Validation failed | Wherever the failing action was attempted | `ease-warning` inline message naming the specific field/state (FR-8); Spotlight Ring stays on the same control — does not advance until fixed. |
| Save-vs-Activate Gap (Step 5→6 climax) | Dashboard, right after Save | EASE proactively surfaces "Saved — but not yet live" (FR-7) even though the owner didn't ask — this is the MVP's flagship unprompted-catch moment and must not be silent or easy to miss. `ease-warning`, not `ease-success`, even though Save itself succeeded. |
| Journey completed | Dashboard → Micro-Guide | Progress Panel shows 100%; Micro-Guide Card auto-appears (FR-10), state `pending_review`. |
| Journey re-run (post-completion) | Dashboard | In scope only to the extent FR-11 requires: if the same Journey is re-run in the demo, EASE reflects whichever Micro-Guide is currently canonical (`approved`) for it. Building a full multi-run history, versioning, or comparison UI is explicitly out of scope (PRD §4.6 Out of Scope). |
| Journey abandoned / re-entered mid-flow | Dashboard | Re-opening resumes guidance at the correct next incomplete Step, not Step 1 (PRD §4.1 "Consequences"). |

### Specialist Review states

| State | Surface | Treatment |
|---|---|---|
| No pending Micro-Guide | Specialist Review | Empty state: "No guide waiting for review yet." `[ASSUMPTION]` shown before any Journey has completed, or after the one pending candidate has already been actioned. |
| Micro-Guide pending review | Specialist Review | Card shows `pending_review` state; Approve → `approved` (canonical); Reject → `rejected` (discarded, prior canonical guide if any stays active, no auto-retry) (FR-11). |
| Micro-Guide approved / rejected (post-action) | Specialist Review | Card reflects the terminal state (`approved` or `rejected`) rather than disappearing — the Specialist can see the outcome of their own last action, not just an empty surface. `[ASSUMPTION]` |

## Interaction Primitives

**Guided, not free-navigation-first.** Unlike Drift's keyboard-first power-user model, EASE's primary interaction is: state intent once via the Intent Bar, then follow the Spotlight Ring turn by turn. This is a deliberate contrast with "traditional digital-adoption tooling" (per the brief) that just helps users navigate — EASE tracks state and validates, so the owner's job is to act on the one highlighted control, not to hunt.

- **Intent Bar submit** — free-text goal in, Journey (or "not supported") out.
- **Spotlight Ring click-through** — the owner interacts with the *real* host-app control underneath the ring; EASE doesn't intercept the click, it only visually points at it and validates the result afterward.
- **Validation retry** — after a failed validation message, the owner corrects the field/state in the host app directly; EASE re-validates without a separate "retry" button (continuous validation, not a modal gate). `[ASSUMPTION]`
- **Micro-Guide / Specialist Review actions** — simple primary-button interactions (Approve/Reject); no drag, no multi-step wizard for the review itself (PRD Non-Goals: full EASE Studio versioning/testing/publishing is explicitly out of scope).

**Banned for MVP:** voice interaction, multilingual assistance (PRD Non-Goals §5), any drag-and-drop authoring of the floor plan itself (the mocked host app's own table-placement UI is out of EASE's control surface — EASE guides and validates it, it doesn't replace it).

## Accessibility Floor

Behavioral. Visual contrast for the EASE Chrome Layer lives in `DESIGN.md` (inherits DLS v7's WCAG-AA-compliant defaults).

- WCAG 2.2 AA for all EASE-authored chrome (Intent Bar, Spotlight Ring, Progress Panel, Validation Message, Micro-Guide, Specialist Review) — DLS v7 components carry this by default.
- **Scope clarification:** the brief's Non-Goals ("not supporting voice interaction, multilingual assistance, or other accessibility capabilities named in the vision's roadmap") refers to advanced, forward-roadmap accessibility *capabilities* as product features — it is not a claim that the built EASE chrome skips baseline WCAG compliance. Baseline AA compliance of whatever is built is a standing repo-wide mandate (DLS v7), not a roadmap item, and is not in tension with that Non-Goal.
- Validation Messages are never color-only — every `ease-warning`/`ease-success` state pairs with explicit text naming the field/state (this is also a hard functional requirement, FR-8, not just an accessibility nicety).
- Spotlight Ring is a visual affordance layered on top of the host app's own controls; the underlying control retains its native focus/tab order and label — EASE does not hide or replace host-app accessibility semantics.
- `[NOTE FOR UX]` The Host App Skin's own accessibility posture (tab order, ARIA on the mocked ResyOS controls) isn't separately specified here since it's staging/props, not the judged EASE surface — flag if Architecture disagrees with that read.

## Key Flows

### Flow 1 — UJ-1: "A Resy owner builds and activates a floor plan, and EASE catches the one mistake that would otherwise sink the demo." (PRD §2.3, verbatim)

**Protagonist:** Jordan, a Resy restaurant owner mid-onboarding, self-serving through setup with limited time for structured discovery. `[ASSUMPTION]` name invented for narrative concreteness — the PRD does not name a specific persona.

1. Jordan opens the mocked ResyOS Dashboard. No Floor Plan exists yet for this venue. `[ASSUMPTION]` this flow models first-time, greenfield plan creation only; the ground truth (`hero-journey-floor-plan.md`) also allows selecting an *existing* plan to edit — that entry path is not modeled for MVP.
2. Jordan types into the Intent Bar: *"Help me create a floor plan."* EASE resolves this to the Build Floor Plans Journey and opens the editor, Spotlight Ring landing on **Service → Floor Plan Settings** (Step 1).
3. Jordan names the plan, adds a room, places a table (Step 2). EASE's ring moves to each required table field in turn — **Table ID/name, Table Type, minimum party size, maximum party size** (Step 3) — and blocks with a named-field message if any is left empty (FR-5/FR-8).
4. Jordan creates a table combination (Step 4); EASE validates it references at least two real tables with its own combined capacity (FR-6 — a PRD-scoped minimum, not a ground-truth cap; see Component Patterns).
5. Jordan saves the plan (Step 5). The Progress Panel ticks Step 5 to done.
6. **Climax:** EASE does not treat "saved" as "done." It proactively surfaces, unprompted: *"Saved — but not yet live. Activate it in a Shift to make it bookable."* — the Save-vs-Activate Gap. Jordan follows the ring into **Service → Shift Settings → ⋮ beside Shift → Edit Shift → Step 2 Service Settings → Floor Plans**, selects the plan, updates the Shift (Step 6). `[ASSUMPTION]` MVP models selecting a single plan per Shift, matching FR-7's singular framing; the ground truth allows selecting one *or more* plans — the multi-plan case is a simplification, not a ground-truth limit.
7. **Resolution:** EASE confirms the tables now appear under Shift Availability — the source calls this same completion signal **"Step 3 Availability"** inside the Shift-edit wizard's own internal step numbering, which is unrelated to and should not be confused with EASE's own Hero-Journey Step 1–6 numbering used throughout this spine. Progress Panel hits 100%, and the Micro-Guide Card auto-appears summarizing the run — including that the Save-vs-Activate Gap catch fired.

Failure branch: if Jordan tries to jump ahead (e.g., attempts Shift activation before every table field is set), EASE blocks with the specific missing field named — never a generic error (FR-8).

### Flow 2 — UJ-2: "An Implementation Specialist reviews and approves the guide EASE generated from a successful run." (PRD §2.3, verbatim)

**Protagonist:** Priya, an Implementation Specialist. `[ASSUMPTION]` name invented for narrative concreteness; the role itself is grounded in the brief's real process-owner perspective (Meagan McCallum, Rachel Talentino) without depicting either by name.

1. A completed Flow 1 run has produced a `pending_review` Micro-Guide plus journey stats — time-to-complete, the completion path, any Validation Checkpoint catches, and whether the Save-vs-Activate Gap triggered (PRD §2.3 UJ-2 entry state).
2. Priya opens the Specialist Review surface and sees the Micro-Guide Card: the guide preview alongside the stats, with the Save-vs-Activate Gap catch called out explicitly (it's the moment she most needs to confirm reads correctly).
3. **Climax:** she approves it — state flips `pending_review` → `approved`, becoming canonical for the next owner's run. (Or rejects it — `pending_review` → `rejected`; any prior canonical guide, if one exists, stays active; the rejected candidate is not retried automatically.)
4. **Resolution:** the full EASE loop closes — Ask → Guide → Complete → Observe → Learn → **Approve** → Improve.

## Responsive & Platform

| Breakpoint | Behavior |
|---|---|
| Desktop / laptop web (primary, locked) | Full Host App Skin + EASE Chrome Layer as specified above. This is the only target for MVP (PRD §6.2 — iPad/native explicitly out of scope). |
| Tablet / mobile | Not modeled for MVP. `[ASSUMPTION]` No responsive-down behavior specified; if the demo is shown on a laptop only, this is a non-issue — flag if the demo environment changes. |

## Inspiration & Anti-patterns

- **Lifted from Whatfix/WalkMe-style digital adoption tools:** the spotlight + balloon guidance mechanic (Spotlight Ring here) — a well-understood pattern for "point at the one thing to do next," reused deliberately for judge legibility (not reinvented for its own sake).
- **Lifted from Scribe:** the auto-generated, numbered step-card Micro-Guide format — proven pattern for "documentation generated from an actual successful run," which is exactly FR-10's claim.
- **Referenced, not copied, from `prototype/walkthrough-assistant/`:** the existing mock's chat-launcher-plus-walkthrough-plus-recorded-guide shape validated that this overall interaction model is buildable in the time available. Per the user's explicit choice, it is inspiration only — this spine's Intent Bar, Spotlight Ring, and Micro-Guide are independently specified above, not a restatement of that prototype's code.
- **Rejected — full chatbot Q&A as the primary interaction:** the brief's differentiation argument is explicit that a chatbot only says "here are the steps"; EASE must visibly track state and validate, so free-form chat is not the primary surface — the Intent Bar (single free-text entry) plus guided Spotlight is.
- **Rejected — silent auto-approval of Micro-Guides:** Specialist Review is a deliberate, visible human gate (PRD's Human-in-the-Loop framing) — never auto-publish a guide without the approve action firing.
