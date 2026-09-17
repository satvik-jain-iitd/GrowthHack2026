# Reconciliation — Spec package vs ARCHITECTURE-SPINE.md

## Coverage summary

The spine lands the major substrate shape: two-layer Host App Skin/EASE Chrome separation, a single LLM boundary, deterministic validation, relational Journey/Micro-Guide state, append-only telemetry, and explicit no-real-integration scope. The biggest misses are not the headline architecture choices; they are the quiet acceptance floors and behavioral invariants that make the demo trustworthy: accessibility, spotlight bridge behavior, intent non-match handling, mid-flow persistence, canonical guide reuse, and the exact validation/telemetry consequences.

Overall verdict: **partially aligned, not implementation-ready**. The spine names all FRs in frontmatter and maps each capability to a component, but several testable consequences from the PRD/UX package are only implied or silently dropped.

## Gaps (in spec, no architectural home)

- **[Critical] Accessibility Floor is treated as a design assumption, not an architecture invariant.** Home in spec: `EXPERIENCE.md` requires WCAG 2.2 AA for all EASE-authored chrome, non-color-only validation messages, and preserved host-control semantics. Spine coverage: DLS v7 appears in Stack/AD-1, but there is no accessibility acceptance gate, owner, test strategy, focus/tab-order rule, ARIA rule, or invariant that all EASE chrome must pass WCAG 2.2 AA. This leaves the accessibility floor to chance.

- **[Critical] Bridge behavior dropped: Spotlight must follow the owner’s scroll/resize and must not intercept clicks.** Home in spec: `EXPERIENCE.md` says the Spotlight Ring follows the control if the owner scrolls/resizes, and EASE visually points while the owner clicks the real host-app control underneath. Spine coverage: Bridge is defined as selectors + pub/sub, but there is no owner for measurement/repositioning, resize/scroll observation, hit-testing, pointer-events/pass-through, or post-click validation. This is a material architecture gap because the overlay can otherwise break the host app it is guiding.

- **[High] FR-1’s testable consequences are only partially covered.** Home in spine: `lib/llm-boundary/` owns Intent → Journey resolution. Dropped: the named test set of **8+ representative paraphrasings** resolving identically and the explicit **“not supported in this demo”** non-match path. The architecture lacks intent fixtures, deterministic fallback behavior, confidence/non-match thresholds, or a response contract for unsupported intents.

- **[High] PRD §12 LLM-misfire mitigation has no architecture fallback.** The PRD risk says rehearse fixed working phrasings and keep a deterministic fallback path if live LLM behavior is flaky. AD-3 isolates the LLM, but the spine does not specify a fallback resolver, canned demo phrase map, provider-health bypass, or failure mode that preserves the recorded demo.

- **[High] FR-2 mid-journey resume and the UX “Journey abandoned / re-entered mid-flow” state are under-specified.** Home in spine: relational Journey state and Step inference. Dropped: what partial progress is persisted, how abandonment is detected, how re-entry chooses the **correct next incomplete Step**, and whether persisted validation state or live host-app state wins on conflict.

- **[High] FR-3’s “exactly one highlighted control per Step” invariant is not architectural.** Home in spine: `components/SpotlightRing` + `lib/bridge/`. Dropped: a selector registry contract that yields exactly one target, build/runtime checks for zero or multiple targets, and a test that every Step 1–6 has one primary highlight. The spine maps the component but not the hard UX/PRD consequence.

- **[High] FR-7’s full completion condition is compressed to “Save-vs-Activate Gap.”** AD-4 says the gap is validated deterministically, but the PRD/ground truth require three independently checkable states: Floor Plan saved, selected in an active Shift, and tables visible under Shift Availability / “Step 3 Availability.” The final visibility check has no explicit data owner, selector, validation rule, or event/state representation.

- **[High] FR-10 Micro-Guide fidelity lacks required source data.** Home in spine: `lib/guide-generator/` reads Journey state + Telemetry. Dropped: the telemetry/state schema does not require the highlighted control per Step, the exact completed Step sequence, or whether the save-vs-activate catch fired. AD-6 leaves these in an untyped `attributes` map, so the generator cannot be tested against FR-10’s required guide contents.

- **[High] FR-11 canonical guide behavior on rerun/reject is incomplete.** Home in spine: SQLite Micro-Guide state machine and Specialist Review UI. Dropped: an architectural rule for “approved = canonical,” lookup of the canonical guide when the Journey is re-run, and reject semantics preserving any prior approved guide. `pending_review → approved | rejected` is necessary but insufficient.

- **[High] PRD §10 Gen AI FAQ capabilities are named but not decided.** Spine coverage: inherited invariant lists Redaction, Substitution, Safechain, Local Memory; AD-3 uses Safechain as a pattern. Dropped: whether Redaction, Substitution, or Local Memory are in scope, out of scope, or intentionally unused for MVP. The PRD note says a specific supported model and needed capabilities should be picked before implementation; Stack lists Azure GPT 5.2 as default and LLAMA 3.2/3.3 as fallback, which is still a multi-model policy rather than a final single supported model decision.

- **[Medium] FR-5 exact table-field validation is not carried into validator contracts.** AD-4 says “table fields,” but does not name Table ID/name, Table Type, minimum party size, maximum party size, or per-table blocking semantics. Without these as rule identifiers/fixtures, the PRD consequence can be missed while still claiming FR-5 coverage.

- **[Medium] FR-6 exact table-combination validation is not carried into validator contracts.** AD-4 says “combinations,” but does not encode “at least two existing tables” plus “combined capacity set.” The UX also clarifies this two-table floor is MVP-scoped, not a real Resy limit; the architecture does not preserve that nuance.

- **[Medium] FR-8 recovery guidance lacks a concrete next-action field.** Spine coverage: validation failure shape `{ field, message, step }` and ValidationMessage component. Dropped: the PRD requires the message to name the missing/incorrect field/state **and the concrete next action**. A `nextAction`/`targetControl` contract would make this testable; a free-text `message` alone does not.

- **[Medium] FR-9 event taxonomy is referenced, not enumerated or operationalized.** AD-6 says `event_type` is one of the PRD §4.5 eight types, but the spine never lists the eight required names: journey started, step viewed, step completed, validation failed, backtracked, help requested, journey abandoned, journey completed. It also does not define emit points, especially for backtrack/help/abandon, or a test that a successful 6-Step run has all six step-completed events in order.

- **[Medium] UX state “Intent submitted, resolving” has no async latency owner.** AD-3 calls the LLM service real-time request/response, but the architecture does not define the resolving/loading state, disabled-submit behavior, timeout, retry, or service-error handling. This is a quiet UX requirement because it only appears as a state pattern, yet it is the moment where LLM latency becomes visible.

- **[Medium] Specialist Review empty and post-action states have no storage/UI owner.** `EXPERIENCE.md` specifies “No pending Micro-Guide,” “pending review,” and “approved/rejected post-action” states. Spine maps the review card and state machine, but does not define the query that drives the empty state or the requirement that a terminal card remains visible after action.

- **[Medium] Success Metrics are not translated into verification architecture.** AD-4 supports SM-1 by making validation pure and testable in isolation, but the spine does not create a rehearsal-run validation suite, golden state fixtures, end-to-end telemetry check, Micro-Guide fidelity check, or review single-pass check for SM-1 through SM-5. SM-C1/SM-C2 appear only indirectly through deterministic validation and scope control; they are not explicit counter-metric guardrails in architecture.

- **[Medium] DESIGN.md Spotlight Ring 3:1 contrast requirement has no verifier.** The design spec explicitly says DLS does not guarantee the cross-brand pair, so `ease-highlight-ring` must be verified at **≥3:1** against Host App Skin backgrounds. Spine mentions DLS and the layer split, but no contrast audit owner, token-pair test, or key-screen acceptance gate exists.

- **[Medium] The exact 6-Step hero sequence is supported conceptually but not seeded architecturally.** Scope and deferred items correctly exclude Step 7, and AD-4 references the save-vs-activate gap. Missing: a canonical Step registry with Step 1 open editor, Step 2 name/layout, Step 3 configure table fields, Step 4 create combination, Step 5 save, Step 6 Shift activation; per-Step selectors; per-Step validation checkpoints; and the documented save-vs-activate friction as a named demo beat.

- **[Low] “No Journey active” / persistent Intent Bar is implied, not owned.** UX says Intent Bar is always visible and no Spotlight/Progress Panel appears until a Journey starts. The architecture lists IntentBar and SpotlightRing components but does not define initial state composition or the rule that the Intent Bar is not hidden behind a launcher.

- **[Low] SM-5 “zero specialist interventions required” is not connected to owner-flow architecture.** The architecture correctly separates owner flow from Specialist Review, but does not explicitly prevent owner-flow dependency on Implementation Specialist help before completion. This is mostly a QA/demo-script concern, but it affects the Business Unit Value proof.

## Contradictions (spine vs spec)

- **[High] AD-9 is referenced but does not exist.** Inherited invariants bind web-only/single-surface scope and no-real-integration to “AD-9,” but the spine only defines AD-1 through AD-8. No-real-integration is actually AD-8; the web-only/Step 7 invariant has no AD home beyond frontmatter/deferred notes.

- **[High] Prototype reuse is stronger than the spec package supports.** The brief leaves `prototype/walkthrough-assistant/` reuse as an open question requiring checking/rebuilding against the concrete sequence. `EXPERIENCE.md` says the prototype is reference/inspiration for UX, not ground truth, while acknowledging Architecture may reuse code. The spine resolves this as “retained and extended,” then the Structural Seed labels Host App Skin as “existing, unchanged.” “Unchanged” conflicts with the requirement to reproduce the exact 6-Step flow, Shift activation, selectors, and validation checkpoints unless the existing prototype already contains all of them.

- **[Medium] Model selection is presented as default/fallback rather than the PRD’s pre-implementation pick.** PRD §10 says Architecture/Build should pick a specific supported model and needed capabilities before implementation. The spine lists Azure GPT 5.2 default plus LLAMA fallback and keeps model swapping as config. That is useful resilience, but it does not satisfy the “specific model picked” gate unless Architecture treats Azure GPT 5.2 as the actual selected model and records fallback as demo contingency.

- **[Medium] “Host App Skin unchanged” also risks contradicting the hero-journey ground truth.** The ground truth’s completion path requires activation through Shift Settings and visibility under Shift Availability. If the existing vanilla mock does not already implement those screens/states, the architecture’s “unchanged” seed cannot satisfy PRD §6.1’s “realistic mocked Resy-style web application reproducing that flow’s screens and terminology.”

## Terminology drift

- **[Medium] UX-local terms are used as architecture primitives before PRD glossary adoption.** “Host App Skin” and “EASE Chrome Layer” are valid from `DESIGN.md`/`EXPERIENCE.md`, but `EXPERIENCE.md` explicitly notes they are not yet in the PRD Glossary. The spine depends on them heavily; that is fine only if the architecture keeps their UX definitions attached and does not treat them as already PRD-canonical.

- **[Medium] “Step 3 Availability” is absent, increasing Step-number ambiguity.** `EXPERIENCE.md` warns that source “Step 3 Availability” is Shift-editor internal numbering, unrelated to EASE Hero-Journey Step 3. The spine never names this term, so the final FR-7 visibility check can be lost or confused with EASE Step 3 table configuration.

- **[Low] PRD glossary terms are mostly preserved in prose, but code identifiers normalize punctuation.** `MicroGuide`, `ValidationCheckpoint`, `TelemetryEvent`, and `SaveVsActivateGap` are reasonable code forms, but prose should continue using PRD terms “Micro-Guide,” “Validation Checkpoint,” “Telemetry Event,” and “Save-vs-Activate Gap” when describing product behavior.

- **[Low] Persona naming is shortened in diagrams.** The diagram says “Owner / Specialist,” while the PRD term is “Implementation Specialist.” This is harmless in a diagram but should not leak into route/component names or demo copy.

- **[Low] “AD-9” is terminology/traceability drift as well as a contradiction.** The invariant table uses a decision identifier that has no corresponding architecture decision, which will break downstream traceability.

## Dropped qualitative requirements

- **[Critical] Baseline accessibility as a non-negotiable floor.** The terse AD structure captured DLS as a stack dependency but dropped the stronger idea: WCAG 2.2 AA is not an optional roadmap accessibility feature; it is the floor for every EASE-authored pixel and interaction.

- **[High] The overlay must guide without taking over.** The bridge concept’s quiet product promise is that EASE highlights the real host control and lets the owner interact with that control. The spine’s selector/event-bus boundary protects code ownership, but not the user-facing invariant that EASE never intercepts the click or breaks native focus/labels.

- **[High] “Specific, state-aware, never generic” voice and tone.** `EXPERIENCE.md` gives concrete copy patterns: “Saved — but not yet live,” “Missing: maximum party size for Table 4,” and rejects “Something went wrong.” The architecture only stores a generic `message`; it does not preserve the tone/copy requirement as a validation-message contract or content test.

- **[High] The Save-vs-Activate Gap is proactive and visible, not merely a validator rule.** The specs repeatedly frame the catch as the flagship unprompted demo moment and an Innovation proof. AD-4 makes it deterministic, but does not require a proactive Step 5→6 surfaced warning, warning-not-success styling, or telemetry that the catch fired.

- **[Medium] Visual brand contrast as proof of differentiation.** The spine enforces dependency separation, but drops the qualitative demo requirement that EASE’s DLS chrome visibly pops against a non-DLS Host App Skin and that the Spotlight Ring is used only to mean “act here.”

- **[Medium] Counter-metric discipline.** `EXPERIENCE.md` and the PRD warn not to optimize demo slickness or breadth over validation depth. The spine scopes narrowly and uses deterministic validation, but does not make “do not broaden beyond this one Journey” or “do not mark complete for speed” explicit build/QA gates.

- **[Medium] Human-in-the-loop as a visible governance story.** Specialist Review exists structurally, but the architecture does not fully preserve the qualitative requirement that approval is visible, canonical, and never silently auto-published.

- **[Low] “Owner should not have to learn ResyOS” is not an architecture invariant.** The spine provides guide components, but does not explicitly prevent designs that expose too much host-app navigation burden or hide the Intent Bar behind help-on-demand mechanics.
