# Decision Log

Append-only. Every settled call goes here, oldest first, and is never edited after the fact — only superseded by a later entry that references it. Use this format per entry:

```
## YYYY-MM-DD — <short decision title>

- **Decision:** what was decided
- **Rationale:** why
- **Alternatives considered:** what else was on the table, and why they lost
- **Owner:** who made or is accountable for the call
- **Revisit when:** the condition that would reopen this decision
```

_Entries begin below, oldest first._

---

## 2026-09-14 — Restart planning from scratch; delete the prior BMad pass

- **Decision:** Delete `archived/2026-09-14-bmad-restart/` (the previous planning pass: research, vision, plans, decisions, judging prep, onboarding MVP spec) and rebuild the planning workspace from Phase 0 of the [BMad lifecycle](../../../BMAD-SKILLS-LIFECYCLE.md).
- **Rationale:** The prior pass predated the confirmed GrowthHack 2026 rules, the real judging criteria, and the Resy onboarding recap. Carrying it forward risked anchoring the new PRD to stale assumptions.
- **Alternatives considered:** Keep the archive as reference (rejected — it kept resurfacing as a source of truth in searches); selectively salvage documents (rejected — the salvageable content was re-derivable from `GrowthHack.docx` faster than it could be audited).
- **Owner:** Satvik Jain (Product Lead).
- **Revisit when:** Never — superseded material; the current `docs/` tree is the only source of truth.

## 2026-09-14 — Canonical git remote is the internal AmEx enterprise GitHub

- **Decision:** `origin` points to `https://github.aexp.com/amex-eng/EASE-GH2026`, replacing the prior `github.com/sjain480_aexp/EASE-GH2026`. All pushes and PRs go to this remote.
- **Rationale:** GrowthHack submissions and any post-hack continuation live inside AmEx infrastructure; keeping the project on a personal public-GitHub remote was both a compliance risk and a barrier to teammates' access.
- **Alternatives considered:** Dual remotes (rejected — invites divergent histories, and one already occurred when a teammate pushed an unrelated initial commit).
- **Owner:** Satvik Jain.
- **Revisit when:** Only if the enterprise remote becomes unavailable during the hack window.

## 2026-09-14 — Skip Phase 1 (Discovery/brainstorming); go straight to the Product Brief

- **Decision:** Skip the BMad Discovery phase (`bmad-brainstorming`, `bmad-deep-recon`) and start at Phase 2 (Product Brief), drafting on the Fast path with `[ASSUMPTION]` tags rather than fresh elicitation.
- **Rationale:** The `GrowthHack.docx` source already contained a 60-section EASE vision, the Resy onboarding meeting recap, and the team structure — the discovery output would largely have restated material already in hand, at the cost of days from a fixed September 23–24 event date.
- **Alternatives considered:** Full Discovery pass (rejected on time); partial brainstorming on the hero journey only (rejected once the evidence-based Resy walkthrough supplied better ground truth than a brainstorm would have).
- **Owner:** Satvik Jain.
- **Revisit when:** Post-hack, if EASE continues toward a real pilot and the vision needs widening beyond the one hero journey.

## 2026-09-14 — "Build Floor Plans" is the single MVP hero journey

- **Decision:** The GrowthHack MVP models exactly one journey — the Resy "Build Floor Plans" flow — per the evidence-based current-state walkthrough in [hero-journey-floor-plan.md](../product/hero-journey-floor-plan.md).
- **Rationale:** The walkthrough is evidence-backed (tagged `[V]`/`[U]`), and it contains a genuinely non-obvious friction point — a floor plan can be fully built and saved yet stay invisible to guests until separately activated in a Shift. That "save-vs-activate gap" is exactly the *previously unknown* friction the Innovation criterion (30% of judging) rewards catching.
- **Alternatives considered:** Multiple shallow journeys — schedules, POS integration, reservation inventory (rejected: Hack Completeness is only 10% of judging weight, so one deeply-correct journey outscores several shallow ones — captured as counter-metric SM-C2 in the PRD).
- **Owner:** Satvik Jain, with Meagan McCallum / Rachel Talentino as Resy-side process-owner validation.
- **Revisit when:** Only post-hack, when adding a second journey is the natural scale proof.

## 2026-09-15 — MVP covers Steps 1–6; Step 7 (Single Day Edit) is out of scope

- **Decision:** Of the hero journey's 7 ground-truth steps, the MVP's required completion path is **Steps 1–6** (open editor → name/lay out → configure table fields → create combination → save → activate via Shift). **Step 7 (Single Day Edit)** is formally *out of scope*, not deferred — it appears in no Progress Panel, Telemetry Event, or Micro-Guide.
- **Rationale:** A 6-vs-7 step inconsistency was independently flagged by both the PRD reconciliation pass and the rubric review as a phase-blocker. Step 7 is a holiday/special-service one-off edit — real, but it sits after the journey's climax (the save-vs-activate catch) and adds surface area without adding demo value.
- **Alternatives considered:** Include Step 7 for completeness (rejected — dilutes rehearsal time on the load-bearing steps); leave it ambiguous (rejected — ambiguity had already produced contradictory step counts across documents).
- **Owner:** Satvik Jain.
- **Revisit when:** Only as a bonus demo beat if Steps 1–6 are fully rehearsed and stable — do not plan toward it.

## 2026-09-15 — Web-only surface; no iPad or native app

- **Decision:** The mocked application and the EASE layer target the desktop/laptop **web** surface only. No iPad or native surface is modeled, and no responsive-down behaviour is specified.
- **Rationale:** The real Resy flow supports both web and iPad, but the demo runs on one machine in a five-minute slot; a second surface doubles build and rehearsal cost for no judging gain.
- **Alternatives considered:** iPad-first (rejected — the ground-truth breadcrumbs are better documented for web); responsive both (rejected on time).
- **Owner:** Satvik Jain.
- **Revisit when:** If the demo environment changes to a tablet, or post-hack for a real pilot.

## 2026-09-15 — Two-layer brand model: Host App Skin vs EASE Chrome Layer

- **Decision:** The screen carries two deliberately distinct visual systems. The **Host App Skin** (mocked ResyOS Dashboard) is intentionally *not* DLS-branded and uses Resy-realistic tokens; the **EASE Chrome Layer** (Intent Bar, Spotlight Ring, Progress Panel, Validation Message, Micro-Guide, Specialist Review) strictly follows DLS v7. See [DESIGN.md](../../_bmad-output/planning-artifacts/ux-designs/ux-EASE-2026-09-15/DESIGN.md).
- **Rationale:** The demo's premise is that EASE guides a user through *a product*, and the audience must believe that product is real. An Amex-branded host app would break that illusion. The visual contrast between the layers is itself the on-screen proof that EASE is a distinct layer, not a reskin.
- **Alternatives considered:** DLS everywhere (rejected — destroys host-app realism); no design system at all (rejected — violates the repo's non-negotiable design-system standard for AmEx-built surfaces).
- **Owner:** Satvik Jain, with Shweta Jha (Full-Stack/UI) and Katelyn Winter (Experience Product).
- **Revisit when:** If the repo's design-system mandate is ever read as covering mocked third-party surfaces too — currently treated as an explicit, documented exception.

## 2026-09-15 — Reuse the existing prototype as the Host App Skin; supersede the empty Next.js stub

- **Decision:** Resolves PRD §8 Open Question #2. `prototype/walkthrough-assistant/` (working vanilla HTML/CSS/JS mock, already grounded in Resy brand tokens) is **retained and extended as the Host App Skin**. The root `prototype/package.json` Next.js stub is **superseded** — it declares no dependencies and has an empty `src/`, so it is a stub, not reusable code. The EASE Chrome Layer is built fresh in Next.js + DLS v7 against the independently-authored UX spines.
- **Rationale:** The existing mock already clears the realism bar the Host App Skin needs, and rebuilding it under a two-day clock would spend the scarcest resource on the least differentiated part of the demo. Conversely, the EASE layer is the actual product and must match the UX spec rather than inherit the prototype's ad-hoc chat-launcher patterns.
- **Alternatives considered:** Build everything fresh (rejected on time); build everything on top of the prototype's existing walkthrough engine (rejected — its client-side `localStorage` walkthrough model doesn't carry the deterministic-validation or telemetry architecture the PRD requires).
- **Owner:** Akshat Dhingra (Architecture), with Sachin Kumar Wadhwani (Backend/Validation) and Shweta Jha (Full-Stack/UI).
- **Revisit when:** At Build kickoff, if the Host App Skin turns out to need the exact six-step screens the prototype doesn't yet mock.

## 2026-09-15 — Build the EASE interface on One App, not Next.js

- **Decision:** The EASE Chrome Layer is built as a **One App Holocron module in Single Module configuration**, not as a standalone Next.js application. Recorded as AD-9 in the [architecture spine](../../_bmad-output/planning-artifacts/architecture/architecture-EASE-2026-09-15/ARCHITECTURE-SPINE.md).
- **Rationale:** AmEx's "Web based experiences" Prescriptive ADR names One App for three categories that describe EASE exactly — websites that are dynamic and require browser-managed state, websites with high interaction and multi-step journeys, and websites that present significant data. Choosing anything else would have required a formal EARB exception. Beyond compliance, this is the strongest available answer to the *Hack Feasibility and Scalability* criterion (30% of judging), which asks directly whether the hack is feasible for production rollout and whether it adheres to Amex control and compliance requirements. A practical bonus: One App targets Node 18, which the build machine already runs, whereas Next.js 16 requires Node 20+ and would not have run without an upgrade.
- **Alternatives considered:** Next.js 16 with a written ADR-deviation and exception path (rejected — fast to start, but it converts a 30%-weighted strength into a question judges can poke at); leaving both options open for the team to pick later (rejected — the frontend platform decides the module structure, state library, and where server code can live, so it cannot be deferred).
- **Consequence to be aware of:** One App *is* the frontend server, so it has no in-app API routes the way Next.js does. The backend therefore becomes a separate EASE Core Service plus a separate LLM Boundary Service. This turned out to be an improvement — it matches the AI/ML ADR's prescription of a standalone real-time GenAI microservice, and it mirrors Team EASE's own workstream split.
- **Owner:** Satvik Jain, decided 2026-09-15 after the architecture Reviewer Gate surfaced the ADR conflict.
- **Revisit when:** Only if the team cannot obtain a working One App setup in time — in which case the fallback is Next.js *plus* a formal EARB exception request, not a silent deviation.
