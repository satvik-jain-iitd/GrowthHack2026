---
title: "Product Brief: EASE — Experience Assistance for Simplified Execution"
status: draft
created: 2026-09-14
updated: 2026-09-14
---

# Product Brief: EASE — Experience Assistance for Simplified Execution

> **Purpose of this brief:** win **GrowthHack 2026** by convincing judges, in a 5-minute video, that EASE is the sharpest answer to the USCS theme *"Reimagine Travel Partner & Restaurant Onboarding and Enablement."* This is a hackathon pitch brief, not an investor-grade brief — right-sized for that purpose per `bmad-product-brief`'s own guidance.
>
> **Source material mined for this draft:** [`growthhack-source-brief.md`](../../../../docs/growthhack-source-brief.md) (the full converted GrowthHack.docx — GrowthHack 2026 rules, the Resy onboarding meeting recap, the 60-section EASE vision writeup, and Team EASE's operating structure). No fresh brainstorming/discovery session was run before this draft (explicitly skipped due to time pressure) — everything not directly attributable to that source is tagged `[ASSUMPTION]` below for your review.

## Executive Summary

Restaurant partners onboarding onto Resy today have to learn a complex platform — build floor plans, configure schedules, set up POS integrations, run test transactions — largely on their own, with implementation specialists as the main safety net and no in-product walkthroughs. Onboarding duration is highly variable, support after the strategic-partner tier is thin, and every "how do I…" question currently ends in a long help article rather than help *inside* the moment of doing the work.

**EASE — Experience Assistance for Simplified Execution** is an intelligent experience and execution layer that sits inside the product and turns "I want to get my restaurant live" into contextual, step-by-step, validated guidance — instead of "read this article and find it yourself." A restaurant owner says *"Help me create a floor plan"*; EASE understands the intent, highlights the exact UI to use, tracks progress, validates each action, recovers from errors, and — when the journey succeeds — automatically generates a visual how-to guide for the next user. A human Implementation Specialist stays in the loop as approver and quality controller, not as the only navigation mechanism.

For GrowthHack, EASE proves **one complete loop, not a platform**: Ask → Guide → Complete → Observe → Learn → Approve → Improve, demonstrated end-to-end on the single "create a floor plan" hero journey. `[ASSUMPTION]` This scoping choice is exactly what should let the demo feel finished and confident in 5 minutes, rather than broad and thin.

## The Problem

Restaurant owners onboarding onto Resy are not enterprise IT buyers — they have limited time for structured discovery and are expected to self-configure much of the platform (floor plans, schedules, reservations/events, POS integration, test transactions). The real problem isn't a lack of documentation; it's that **"I know what I want to accomplish, but I don't know what to do next"** — which article applies, whether the last step worked, what's left before they can launch.

This shows up concretely, per the Resy onboarding discovery (meeting with Meagan McCallum, Director of Implementation):
- Onboarding duration varies wildly — some partners "quick flip" through it, others need heavy hand-holding, with implementation specialists as the main lever for either outcome.
- The product currently has **no in-product walkthroughs or guided tours** for new users.
- Post-onboarding support is tiered unevenly: Tier 1 (strategic) partners get dedicated Partner Success attention; **Tier 2/Tier 3 partners mostly get support channels with no proactive engagement** — a large, underserved population.
- Data needed to see partner health/progress is fragmented across Resy backend, Tock backend, Salesforce, Looker, and internal AI systems — nobody has one clear view of "is this partner stuck?"
- A large-scale platform migration ("Resy Importer") is coming, which will force partners to reconfigure and re-experience onboarding-like friction all over again — raising the stakes for solving this well.

The cost of the status quo: slower time-to-launch, uneven partner experience depending on luck-of-the-draw specialist attention, specialists spending their time repeating "click here, now go there" instead of higher-value work, and no compounding knowledge — every partner's confusion is relearned from scratch by the next partner.

## The Solution

EASE turns onboarding from *"search → article → try → search again → escalate"* into a guided, validated, in-product experience with a human quality-control layer behind it. Concretely, for the GrowthHack MVP:

1. **Intent → Guide.** A restaurant owner types (or eventually speaks) a goal — *"Help me create a floor plan"* — and EASE identifies the approved journey and the current screen state.
2. **Contextual highlighting.** EASE highlights the exact UI component to act on next, de-emphasizes the rest, and shows a persistent progress panel (e.g. "Step 3 of 6 — Add Dining Area").
3. **Deterministic validation.** EASE checks whether each step was actually completed correctly — not just that the user clicked something — and helps them recover from errors.
4. **Telemetry capture.** Every journey emits structured events (started, step viewed/completed, validation failed, backtracking, help requested, abandonment, completed) — the raw material for everything downstream.
5. **Auto-generated micro-guide.** On a successful run, EASE automatically produces a Scribe-like visual how-to guide from the *actual successful path* — not a hand-written article that goes stale.
6. **Human approval loop (EASE Studio / EASE Control).** An Implementation Specialist reviews the generated guide and journey health (completion rate, friction hotspots, time-to-complete) and approves it before it becomes the canonical guidance for the next user.

This closes the full loop the vision doc calls out as the MVP bar: **Ask → Guide → Complete → Observe → Learn → Approve → Improve** — proven on one journey (floor plan creation), not attempted across the whole platform.

**Confirmed hero-journey ground truth (2026-09-14):** the abstract 6-step loop above is now backed by an evidence-based, current-state walkthrough of the real Resy "Build Floor Plans" flow — see [`hero-journey-floor-plan.md`](../../../../docs/product/hero-journey-floor-plan.md). It supplies the concrete 7-step sequence (start editor → name/lay out plan → configure each table → create table combinations → save → activate via Shift → handle one-off changes) and the exact fields EASE's deterministic validator must check (table ID/name, table type, min/max party size, combinations, save state, Shift activation, Step 3 Availability visibility). It also surfaces the single strongest, evidence-backed friction point to dramatize for the demo's Innovation angle: **a plan can be fully built and saved yet remain invisible to guests until a separate, non-obvious Shift-activation step** — exactly the kind of "previously unknown" friction the judging criteria reward catching.

## What Makes This Different

- **Vs. a chatbot:** a chatbot says "here are the steps." EASE says "you're on step 3, here's the exact action, and I'll know when you've done it correctly" — it tracks state and validates, a chatbot doesn't.
- **Vs. search / help articles:** search answers "where is the information?" EASE answers "what should happen next?" — it acts inside the moment of doing the work rather than sending the user away to read.
- **Vs. traditional digital-adoption tooling:** most digital-adoption tools just help users navigate an interface. EASE's stated ambition is to understand *intent, business context, journey state, system state, business rules, completion criteria, and outcome* — the goal is "help the user accomplish their goal," not "help the user learn this screen."
- **Self-improving knowledge, not static docs:** every successful journey can generate its own up-to-date visual guide, and EASE can eventually detect when a guide no longer matches reality (a button moved, a menu changed) and flag it for specialist review — knowledge freshness becomes something you can measure instead of something that quietly rots.
- **Human-in-the-loop by design, not an afterthought:** AI identifies opportunities and drafts guidance; humans (Implementation Specialists) stay accountable for approval, quality, and governance. `[ASSUMPTION]` For a judging panel likely wary of "AI replaces the human" pitches, this framing (specialist evolves from navigator to quality controller) is probably a stronger, more defensible story than a full-automation pitch — worth leading with in the demo narrative.
- **Buy the rails, build the intelligence:** EASE explicitly does not try to rebuild commodity capability (foundation models, speech-to-text, session replay, generic analytics). The proprietary value is the journey model, validation rules, and friction telemetry tied to the actual product — a credible answer if judges probe "isn't this just a wrapper around an LLM?"

## Who This Serves

**Primary — the restaurant owner/manager onboarding onto Resy.** Time-poor, self-serving through setup, currently has to piece together floor plans/schedules/POS integration from documentation and specialist availability. Success for them: less time to launch, fewer dead-ends, confidence that each step actually worked.

**Secondary — the Implementation Specialist.** Today the main navigation mechanism for every partner; EASE's premise is to shift their time from repetitive "click here" guidance toward reviewing generated guides, handling exceptions, and improving the process itself.

**Tertiary (future, out of GrowthHack scope) — Tier 2/Tier 3 partners without dedicated Partner Success support**, where the doc explicitly flags today's proactive-engagement gap as a candidate EASE use case. `[ASSUMPTION]` Worth a one-line mention in the pitch as the "where this goes next" hook, but not a claim to build during the hack.

## Success Criteria — for the GrowthHack Submission

The judging rubric is now confirmed (previously an open question — resolved 2026-09-14, verified against [the live Square judging-process page](https://thesquare.americanexpress.com/sites/business-unit/technology/growthhack/documents/759914/judging-process-1) itself, not just the offline `.docx`/`.pdf`). Judging runs in **two rounds**: Round 1 (5 judges, Sept 28–Oct 9, force-ranked 100–1,000 pts) narrows ~all submissions to ~25 semifinalists (selected by score + BU representation); Round 2 (Oct 19–23) re-scores that field on the same criteria.

| Criteria | Weight | What it means for EASE's build priorities |
|---|---|---|
| **Hack Feasibility and Scalability** | 30% | Demo must visibly argue "this could go to Production" — scales to Amex volumes, respects control/compliance, protects the Amex brand. The build-vs-buy positioning ("buy the rails, build the intelligence") directly serves this criterion. |
| **Innovation** *(only some need apply)* | 30% | Don't try to hit all four innovation sub-criteria — pick the strongest ones. EASE's clearest angles: a **previously-unknown improvement opportunity** (in-product guidance genuinely doesn't exist on Resy today per the discovery call) and **reduction/elimination of friction** (turning a 17-step article into a validated, generated guide). |
| **Business Unit Value** | 30% | This is where the team's structure is a genuine asset, not just a bonus badge: Meagan and Rachel (Global Dining/Resy business) are actual process owners **on the hack team**, directly satisfying "were business partners consulted / on the team?" This should be shown on camera, not just claimed. |
| **Hack Completeness** | 10% | **This is the lowest-weighted criterion.** Over-investing engineering time in production-polish is the wrong tradeoff — a clear, working proof of the one hero-journey loop matters far more than breadth or visual polish. Time is much better spent on Feasibility/Innovation/BU-Value framing than on completeness. |

**Practical implication for scope and demo cuts:** since Completeness is only 10% weight, the team should resist scope creep toward "make it look more finished" and instead spend the marginal time on: (a) a sharper feasibility/scalability argument, (b) making the "previously unknown"/reduction-in-friction innovation angle explicit and visible, and (c) put a business stakeholder (Meagan or Rachel) in the pitch narrative itself.

Also confirmed and still relevant:
- **Cross-Functional Collaboration bonus badge** — teams with ETS + Product + Business representation earn bonus points. Team EASE's registered roster (Satvik, Ajay, Akshat, Katelyn, Sachin, Santanu, Yashwant, Shweta from ETS/Product; Meagan and Rachel from the Resy/Global Dining business side) already satisfies this.
- **"What makes a winning hack" qualitative elements** (considered alongside the weighted criteria, per the source): recognize the environment we're in, use storytelling to convey the vision, partner with business/product colleagues, and demonstrate scaling to enterprise demand.
- **Theme fit** — 2026 theme is *"Think Bigger. Move Faster. Build with AI"* against the USCS "Reimagine Travel Partner & Restaurant Onboarding and Enablement" opportunity headline. EASE's floor-plan hero journey is a direct, literal answer to that headline.
- **Format constraint** — the submission is a ≤5-minute, ≤25 MB video; the pitch has to be tight, not exhaustive.

## Scope

**In (GrowthHack MVP — matches the vision doc's own MVP definition, now grounded in a confirmed real-world journey):**
- One hero journey: *"Help me create a floor plan"* — concretely the 7-step Resy sequence in [`hero-journey-floor-plan.md`](../../../../docs/product/hero-journey-floor-plan.md): start editor → name/lay out plan → configure each table (ID, type, min/max party size) → create table combinations → save → activate via Shift → handle one-off single-day edits.
- A realistic mocked Resy-style application (not the live production app) that reproduces this exact flow and its screens/terminology.
- Real LLM-backed intent understanding for that one journey.
- Contextual UI guidance with exact component highlighting and a persistent progress indicator.
- Deterministic validation of each step against the confirmed checkpoints — table ID/name set, table type set, min/max party size set, combinations defined, plan saved, plan selected in an active Shift, tables appear under Step 3 Availability — not just "the LLM said it's done."
- Error detection and recovery guidance, with the confirmed **save-vs-activate gap** as the flagship friction moment EASE proactively catches ("your plan is saved but not yet live — activate it in a Shift to make it bookable").
- Journey telemetry capture (started/completed/failed/backtracked/etc.).
- Auto-generated visual guide from a successful run.
- A lightweight "specialist review" moment showing approval of the generated guide (this is what proves the human-in-the-loop story, even if EASE Studio itself is a stub).

**Out (explicitly, for this hack):**
- The full EASE product family (Signals, Insights, Studio, Control, Assist, Agent as standalone products) — mentioned in the vision only as the platform's long-term shape, not something to build now.
- Any of the 13 "future application" use cases (merchant onboarding, complaints, colleague onboarding, cross-system orchestration, etc.) — real future directions, not GrowthHack deliverables.
- Maturity Model stages 2–5 (Adapt, Predict, Assist, Act) — GrowthHack proves Stage 1 (Guide) only.
- Any integration with real Resy/Tock/Salesforce/Looker systems — the mocked app is the whole point of keeping this demo-able in the time available.
- Voice interaction, multilingual support, accessibility features — real roadmap items, not in scope now.

## Vision

If EASE succeeds beyond GrowthHack, the same "Guide" loop proven on floor-plan creation generalizes across the onboarding journey (schedules, POS integration, test transactions) and then across other Resy/Amex onboarding-shaped problems named directly in the source material: merchant onboarding, supplier enablement, customer servicing, complaints handling, complex multi-system implementations, and the platform migration ("Resy Importer") that's already coming. The maturity model the vision doc lays out — **Guide → Adapt → Predict → Assist → Act** — describes a multi-year path from "shows you what to do" to "does approved work for you," always with a human approval layer at the boundary of increasing autonomy.

The long-run one-line framing from the source material: *"Complex underneath. EASE on top."* — enterprise systems stay as complex as they need to be; the human experience on top gets simpler with every journey EASE observes.

---

## Open Questions

Three of the four original open items are now resolved (2026-09-14):

1. ~~Exact judging rubric/weights are unknown~~ — **Resolved.** See the confirmed weighted criteria (30/30/30/10) in Success Criteria above.
2. ~~Is "create a floor plan" really the single most demo-friendly journey?~~ — **Resolved/confirmed.** The user confirmed [`hero-journey-floor-plan.md`](../../../../docs/product/hero-journey-floor-plan.md) as the exact MVP hero-journey scope, with a strong, evidence-backed "previously unknown friction" moment (save-vs-activate) built in — no further pressure-testing needed on journey choice.
3. ~~Team roster vs. registration rules~~ — **Resolved.** Team confirmed successful registration on September 11.
4. **"Realistic mocked application"** — the existing [`prototype/walkthrough-assistant/`](../../../../../prototype/walkthrough-assistant) demo mock may already be usable as this mocked app's starting point; still needs to be checked/rebuilt against the concrete 7-step sequence and validation checkpoints now defined in `hero-journey-floor-plan.md`, not just the abstract scope description.

## Next Step

Per the BMad lifecycle ([`BMAD-SKILLS-LIFECYCLE.md`](../../../../../BMAD-SKILLS-LIFECYCLE.md)), this brief feeds **Phase 3 — Requirements (`bmad-prd`)**, where the hero journey and MVP scope above get turned into a concrete PRD with acceptance criteria, ready for UX and architecture to build against.
