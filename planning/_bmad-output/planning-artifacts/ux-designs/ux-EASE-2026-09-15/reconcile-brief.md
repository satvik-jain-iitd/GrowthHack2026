# Reconciliation — brief.md against DESIGN.md/EXPERIENCE.md

## Coverage summary
Coverage is strong on the core hero-loop mechanics: the spines faithfully carry through intent capture, contextual highlighting, deterministic validation, the save-vs-activate friction catch, auto-generated Micro-Guide output, and the human approval step. They also preserve the strongest differentiation vs “just a chatbot” and “just digital-adoption tooling,” especially through the two-layer Host App Skin/EASE Chrome Layer split and the state-aware guidance rules.

Coverage is weaker where the brief shifts from core flow into hack-storytelling and compounding-value logic. The search/help-article contrast is mostly implicit, the self-improving-knowledge story stops at guide generation/approval, and the 30/30/30/10 judging logic is only partially translated into visible design/experience decisions — strongest on Innovation, lighter on Feasibility/Scalability and Business Unit Value.

## Gaps (in brief, missing from spines)
- **Search/help-article differentiation is not fully operationalized.** The brief explicitly contrasts EASE with “search → article → try → search again → escalate,” but the spines do not state a hard behavioral rule that EASE should never detour the owner into docs/search results/help-center content during the hero journey.
- **Self-improving knowledge is only partially reflected.** The spines cover auto-generated Micro-Guides and human approval, but drop the brief’s stronger freshness idea: EASE detecting when guidance no longer matches the UI and flagging it for review.
- **The “Observe / Learn” part of the loop is thinner than the brief.** The brief names journey-health inputs like completion rate, friction hotspots, and time-to-complete; the spines mainly surface time-to-complete and whether the save-vs-activate catch fired.
- **The “is this partner stuck?” problem is not translated into a UX decision.** The brief highlights fragmented health/progress visibility as a pain point, but the specialist-facing surface does not visibly address stuckness, risk, or friction aggregation even in lightweight form.
- **Persona coverage is uneven.** Primary and secondary personas are clearly represented; the tertiary Tier 2/Tier 3 underserved-partner story is not carried into the spines except as background implication.
- **Judging-criteria translation is incomplete.** Innovation is well represented; Feasibility/Scalability cues (control/compliance, enterprise-readiness proof, brand-protection logic beyond DLS usage) and Business Unit Value cues (business-owner involvement/presence) are largely absent from the spines as explicit experience decisions.
- **“Buy the rails, build the intelligence” is present only indirectly.** The brief makes this a major feasibility argument, but the spines do not make the proprietary value legible as journey model + validation + telemetry vs commodity rails.

## Contradictions (spines vs brief)
- **Accessibility scope conflict:** the brief’s Out-of-Scope section says “accessibility features” are not in scope now, while `EXPERIENCE.md` establishes WCAG 2.2 AA as a mandatory floor for all EASE-authored chrome. This is probably the better product decision, but it currently reads as a scope contradiction that should be clarified.
- **Inside-vs-on-top phrasing conflict:** the brief describes EASE as an intelligent layer that sits “inside the product,” while `DESIGN.md` repeatedly emphasizes that EASE sits “on top of, not inside” the partner product. This is likely intended as overlay wording, but it is inconsistent enough to confuse downstream readers.

## Terminology drift
- The brief names the human approval loop as **“EASE Studio / EASE Control”**; the spines mostly rename it to **“Specialist Review.”** That weakens traceability back to the brief’s loop language.
- The brief consistently says **restaurant owner/manager**; `EXPERIENCE.md` usually shortens this to **owner**, which narrows the persona wording.
- The brief says **contextual highlighting**; the spines introduce **Spotlight Ring** as the main term. Useful internally, but it is a new label not anchored in the brief.
- The brief describes an **in-product experience and execution layer**; the spines introduce **Host App Skin** and **EASE Chrome Layer** as core framing terms. Those terms are effective, but they are new enough that other artifacts may need a vocabulary crosswalk.
- `DESIGN.md` broadens the premise to **“any partner’s software”** whereas the brief is tightly framed around **Resy onboarding**. That reads more like narrative expansion than strict contradiction, but it does introduce drift from the BU-specific story.

## Dropped qualitative ideas
- **“Every partner’s confusion is relearned from scratch by the next partner.”** The Micro-Guide mechanic is present, but the compounding-knowledge story is not vividly dramatized as a before/after narrative beat.
- **Tier 2/Tier 3 underserved partners as the emotional value hook.** The brief’s strongest empathy/value setup for why this matters at scale is largely absent from the spines’ storytelling.
- **Implementation Specialist evolution from navigator to quality controller.** The specialist approval step exists, but the before/after transformation is not strongly staged as a visual or narrative contrast.
- **Business-partner presence in the demo narrative.** The brief explicitly says Meagan or Rachel should appear in the pitch story for Business Unit Value; the spines do not echo that cue.
- **Judge-facing qualitative advice about storytelling and enterprise scale.** The brief says the team should visibly recognize the environment, use storytelling, and argue scale; the spines mostly express this through host-app realism, not through broader narrative scaffolding.
- **The “search/article/escalate” pain loop as a visible foil.** The save-vs-activate catch is excellent, but the old workflow being replaced is not strongly visualized, which weakens the contrast against “just help content.”
