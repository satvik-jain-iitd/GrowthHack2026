# EASE — Planning Docs Inventory

**EASE — Experience Assistance for Simplified Execution**
"Complex underneath. EASE on top."

This is the single entry point for the planning workspace. Every document under `docs/` is listed here with its purpose and status as it's created — if a teammate asks "where is X?", the answer lives here first.

Status legend: ✅ locked · 🟡 draft/living · ⚠️ needs update · 🔴 gap.

> **Fresh restart (2026-09-14):** the prior BMad planning pass (research, vision, plans, decisions, judging prep, and the onboarding MVP spec) was archived and then removed at the user's request. This inventory starts empty and is filled in as the [lifecycle](../../BMAD-SKILLS-LIFECYCLE.md) runs from Phase 1 (Discovery) onward.

## Where things go

| Folder | Purpose |
|---|---|
| `product/` | Vision, positioning, and how-it-works mechanisms |
| `research/` | External landscape and technology-option research |
| `plans/` | Strategy, sprint plans, adversarial/feasibility reviews |
| `decisions/` | Append-only decision log — every settled call, with rationale |
| `judging/` | Judging-criteria mapping and submission prep (if applicable) |

## Current inventory

_This table is updated in the same change whenever a doc under `docs/` is added or materially changed._

| Path | Purpose | Status |
|---|---|---|
| [growthhack-source-brief.md](./growthhack-source-brief.md) | Full Markdown conversion of the root [`GrowthHack.docx`](../../GrowthHack.docx) + [`GrowthHack.pdf`](../../GrowthHack.pdf): GrowthHack 2026 program rules/FAQ, **confirmed judging process and weighted criteria (30/30/30/10)**, the Resy onboarding meeting recap, the complete 60-section EASE product-vision writeup, architecture/governance references, and the Team EASE operating structure. Raw Discovery-phase source material — not yet triaged into `product/`/`research/`/`plans/` | 🟡 draft/living (source of record is still the `.docx`/`.pdf`) |
| [product/hero-journey-floor-plan.md](./product/hero-journey-floor-plan.md) | **Confirmed MVP hero-journey scope** — the evidence-based, current-state (today, without EASE) walkthrough of how a Resy operator builds and activates a floor plan in ResyOS: numbered step sequence, validation/"complete" criteria, documented friction (notably the hidden save-vs-activate distinction), and the concrete checkpoints EASE's deterministic validator must model | ✅ locked (confirmed scope, 2026-09-14) |
| [`_bmad-output/planning-artifacts/prds/prd-EASE-2026-09-14/prd.md`](../_bmad-output/planning-artifacts/prds/prd-EASE-2026-09-14/prd.md) | **Phase 3 PRD (finalized)** — 7 features / 11 FRs scoped to the single Build-Floor-Plans hero journey (Steps 1–6 locked; Step 7 explicitly excluded), Key User Journeys (owner + Implementation Specialist), Glossary, Success Metrics (incl. counter-metrics + BU-value proxy), Constraints/Guardrails, Why Now, Risk register, and 2 remaining Open Questions. Went through full Finalize: input reconciliation, Reviewer Gate rubric review, phase-blocker triage, and structure/prose polish | ✅ final |
| [`_bmad-output/planning-artifacts/ux-designs/ux-EASE-2026-09-15/DESIGN.md`](../_bmad-output/planning-artifacts/ux-designs/ux-EASE-2026-09-15/DESIGN.md) | **Phase 4 UX — Design Spine (finalized)** — the two-layer brand model (non-DLS **Host App Skin** for the mocked ResyOS Dashboard realism layer vs. strictly-DLS-v7 **EASE Chrome Layer** for Intent Bar/Spotlight/Progress Panel/Micro-Guide/Specialist Review), colors/typography/components mapped to DLS v7 tokens, WCAG AA contrast targets. Went through full Finalize: input reconciliation (prd/brief/hero-journey), Reviewer Gate rubric review, structure/prose polish | ✅ final |
| [`_bmad-output/planning-artifacts/ux-designs/ux-EASE-2026-09-15/EXPERIENCE.md`](../_bmad-output/planning-artifacts/ux-designs/ux-EASE-2026-09-15/EXPERIENCE.md) | **Phase 4 UX — Experience Spine (finalized)** — Information Architecture, Voice and Tone, Component/State Patterns, Interaction Primitives, Accessibility Floor, and both Key User Journeys as named-protagonist flows (Jordan the owner, Priya the Implementation Specialist) with the Save-vs-Activate Gap as the climax beat. Paired with `DESIGN.md`; `prototype/walkthrough-assistant/` treated as reference only, not ground truth | ✅ final |
| [`_bmad-output/planning-artifacts/architecture/architecture-EASE-2026-09-15/ARCHITECTURE-SPINE.md`](../_bmad-output/planning-artifacts/architecture/architecture-EASE-2026-09-15/ARCHITECTURE-SPINE.md) | **Phase 5 Architecture Spine (finalized)** — 13 ADs defining a layered guided-execution overlay (Host App Skin simulation fixture / EASE Chrome Layer as a **One App Single Module** / EASE Core Service / separate LLM Boundary Service), the versioned Bridge Contract, deterministic validation as sole state owner, a full **ADR Conformance & Exception Register** against all 8 AmEx architecture-portal ADRs, Stack, and a Capability→Architecture Map. Went through full Finalize: mermaid diagram validation, lint, 5-agent Reviewer Gate (incl. ADR conformance), decision-log backfill | ✅ final |
| [`_bmad-output/planning-artifacts/architecture/architecture-EASE-2026-09-15/architecture-diagram.html`](../_bmad-output/planning-artifacts/architecture/architecture-EASE-2026-09-15/architecture-diagram.html) | **Phase 5 companion** — interactive DLS v7-styled architecture diagram (loads real DLS v7.15.0 CSS from the public CDN); clicking any node shows its governing ADs + delivered FRs. Validated: 47 DLS classes used, 0 undocumented classes, 0 inline styles, 0 hardcoded colours | ✅ final |
| [`_bmad-output/planning-artifacts/epics.md`](../_bmad-output/planning-artifacts/epics.md) | **Phase 6 Epics & Stories (finalized)** — 3 epics / 11 stories decomposing all 11 FRs, 3 NFRs, and 11 UX-DRs: Epic 1 Guided Floor-Plan Setup (Steps 1–5, incl. foundational scaffolding), Epic 2 The Save-vs-Activate Catch & Journey Completion (Step 6, the flagship Innovation-criterion moment), Epic 3 Auto-Generated Micro-Guide & Specialist Review. Full FR Coverage Map; validated for forward-dependency-free stories, DB/entity creation timing, and epic independence | ✅ final |
| [`_bmad-output/implementation-artifacts/sprint-status.yaml`](../_bmad-output/implementation-artifacts/sprint-status.yaml) | **Phase 7 Sprint Tracking (generated)** — readiness gate PASSed (all requirements trace forward into stories and back to recorded intent; no orphans, no forward dependencies, no unrecorded assumptions blocking implementation); tracking file generated from `epics.md` via `bmad-sprint-planning` — 3 epics / 11 stories, all `backlog`, retrospectives `optional`. The file `bmad-build` reads to pick the next story | ✅ generated |

## Next step

See [BMAD-SKILLS-LIFECYCLE.md](../../BMAD-SKILLS-LIFECYCLE.md) at the repo root for the full phase order. Phase 7 (Sprint Planning) is complete; **Build** (`bmad-build`) is next — starts with Story 1.1 (Foundational Scaffolding).
