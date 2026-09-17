# Reconciliation — prd.md against DESIGN.md/EXPERIENCE.md

## Coverage summary
The two spine documents capture the core MVP UX well: UJ-1/UJ-2, the web-only surface decision, the 6-step Hero Journey, the save-vs-activate flagship moment, deterministic validation, Micro-Guide generation, and Specialist Review are all materially present. The main misses are around PRD boundary-setting and evaluation detail: telemetry specifics, explicit non-goal/scope exclusions, success-metric framing, and a few glossary/qualitative nuances do not carry through cleanly.

There are also two material PRD/spine mismatches: the spines treat `prototype/walkthrough-assistant/` as already resolved to reference-only, and `EXPERIENCE.md` says post-completion journey re-entry is out of scope even though PRD FR-11 expects rerun behavior to reflect canonical-guide state.

## Gaps (in PRD, missing from spines)
- **FR-9 is only partially carried forward.** The spines reference telemetry / a telemetry log, but they do not preserve the PRD's required **Telemetry Event** schema: `journey started`, `step viewed`, `step completed`, `validation failed`, `backtracked`, `help requested`, `journey abandoned`, `journey completed`, each timestamped and tagged with the current Step.
- **The Step 7 boundary is not stated explicitly.** Both spines repeatedly frame the MVP as Steps 1–6, but neither spine explicitly names **Step 7 / Single Day Edit** as out of scope, which weakens the PRD's crisp scope edge.
- **Several PRD Non-Goals disappear entirely:** no full EASE product-family build (Signals / Insights / Control / Assist / Agent), no maturity-model stages 2–5, and no **Assigned Seating Events**. These are important downstream boundaries for UX readers even if they are not core screen behaviors.
- **PRD Success Metrics / Counter-metrics are not reflected.** The spines do not restate deterministic validation accuracy, zero specialist intervention, single-pass specialist review, or the counter-metric guidance of correctness-over-slickness and depth-over-breadth.
- **UJ-2's review-input detail is narrowed.** The PRD says Specialist Review receives the candidate guide plus journey telemetry including the completion path and any validation catches; the spines mainly preserve only time-to-complete and whether the save-vs-activate moment fired.

## Contradictions (spines vs PRD)
- **Open Question #2 is treated as resolved in the spines.** The PRD says `prototype/walkthrough-assistant/` reuse still needs confirmation at Architecture kickoff; both spines instead say the prototype is reference/inspiration only and "not ground truth."
- **Rerun behavior conflicts.** PRD FR-11 says an approved guide should be reflected if the same Journey is re-run in the demo. `EXPERIENCE.md` says "Journey re-entry after this point is out of scope for MVP," which cuts against that acceptance consequence.

## Terminology drift
- The PRD glossary's named concept **Save-vs-Activate Gap** is mostly restated as the **save-vs-activate catch** in the spines. The idea survives, but the canonical term does not.
- **Validation Checkpoint** — a defined glossary term in the PRD — is not used in either spine, even though the PRD explicitly says each Step has one.
- **Telemetry Event** is not used consistently. The spines switch between generic "telemetry," "journey stats," and "Telemetry Event log" without carrying forward the PRD's named object and event vocabulary.

## Dropped qualitative ideas
- The PRD's higher-order user promise — the owner should succeed **without first learning ResyOS screens, terminology, or hidden dependencies** — is implicit in the mechanics, but it is not stated as a guiding experience principle for downstream readers.
- The PRD's strategic framing of the **Implementation Specialist** role shift (from primary navigation mechanism to quality gate, tied to business-unit value and real process-owner perspective) gets flattened into a simple approve/reject surface.
- FR-2's nuance that EASE infers the current Step from **application state** (current screen plus floor-plan save/configuration state) is not really described; the spines show the current-step UI outcome, not the state-reading principle behind it.
- The PRD's explicit **Observe → Learn** / per-run friction-identification story is only lightly preserved. Telemetry exists as an input to the guide, but the spines do not foreground that "friction identification" claim the way the PRD does.
