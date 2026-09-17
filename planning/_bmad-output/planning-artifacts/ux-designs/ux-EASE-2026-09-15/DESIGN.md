---
name: EASE — GrowthHack 2026 MVP
status: final
sources:
  - ../../prds/prd-EASE-2026-09-14/prd.md
  - ../../briefs/brief-EASE-2026-09-14/brief.md
  - /planning/docs/product/hero-journey-floor-plan.md
updated: 2026-09-15
description: >
  Guided-execution layer over a mocked ResyOS Dashboard. DLS v7 (@americanexpress/dls-react)
  on web; this DESIGN.md specifies the EASE Chrome Layer brand delta only — the Host App Skin
  (mocked ResyOS) is deliberately NOT DLS-branded (see Brand & Style).
colors:
  # EASE Chrome Layer inherits DLS v7 utility-class color tokens by name (per UI-system
  # inheritance: values are DLS v7 dls-core token names, not restated hex — DLS owns the
  # rendered value). Local keys below are EASE's semantic roles onto those DLS tokens;
  # no new hex values invented for anything DLS already covers.
  ease-primary: 'dls-deep-blue'
  ease-primary-hover: 'dls-bright-blue'
  ease-highlight: 'dls-bright-blue'
  ease-highlight-ring: 'dls-bright-blue'
  ease-success: 'dls-color-success'
  ease-warning: 'dls-color-warning'
  ease-neutral: 'dls-color-neutral'
  ease-white: 'dls-white'
  ease-black: 'dls-black'
  ease-surface: 'dls-gray-01'
  ease-reject: 'dls-red'
  # ease-scrim has no DLS equivalent (DLS has no scrim/overlay utility) — a genuine new
  # value, given as an 8-digit hex (55% opacity black) per the hex-string frontmatter rule.
  ease-scrim: '#0000008C'
  # Host App Skin — NOT a DLS token, intentionally distinct. Grounded in resy.com's own
  # live brand tokens (captured 2026-09-14 in prototype/walkthrough-assistant), reused here
  # only as the realism reference for the mocked host app, per PRD §6.1 "realistic
  # mocked Resy-style web application." [ASSUMPTION]
  host-action-blue: '#336FDE'
  host-ink: '#2A2A2A'
  host-black-rail: '#000000'
  host-white: '#FFFFFF'
typography:
  # EASE Chrome Layer inherits DLS v7 typography utilities by name (heading-1..6,
  # body/body-1..3, legal-1/2, font-sans-*). No overrides; note field per the spec's
  # platform-conventions pattern since DLS, not this file, owns the rendered values.
  ease-chrome: { note: 'Inherits DLS v7 utility classes verbatim — heading-1..6, body/body-1..3, legal-1/2, font-sans-large/medium-book/bold. No local overrides.' }
  # Host App Skin uses a plain sans stack to read as a believable third-party product
  # distinct from the DLS-branded EASE chrome. [ASSUMPTION]
  host-body:
    fontFamily: 'Helvetica Neue, Arial, sans-serif'
rounded:
  # DLS defaults inherited for all EASE chrome; only the one token referenced by name
  # below is declared locally, per the DLS "full" pill convention.
  full: '9999px'
spacing:
  # DLS spacing scale inherited as-is; no local overrides declared.
components:
  ease-intent-bar:
    background: '{colors.ease-primary}'
    foreground: '{colors.ease-white}'
    radius: '{rounded.full}'
  ease-spotlight-ring:
    border: '3px solid {colors.ease-highlight-ring}'
    scrim: '{colors.ease-scrim}'
  ease-progress-panel:
    background: '{colors.ease-white}'
    foreground: '{colors.ease-black}'
    accent-current: '{colors.ease-primary}'
    accent-done: '{colors.ease-success}'
  ease-validation-message:
    error-bg: '{colors.ease-warning}'
    success-bg: '{colors.ease-success}'
  ease-microguide-card:
    background: '{colors.ease-surface}'
    foreground: '{colors.ease-black}'
  ease-specialist-review-card:
    background: '{colors.ease-white}'
    approve-action: '{colors.ease-success}'
    reject-action: '{colors.ease-reject}'
---

# EASE — Design Spine

> GrowthHack 2026 MVP. Single-surface responsive web (locked decision, PRD §6.2 — no iPad/native). DLS v7 React (`@americanexpress/dls-react`) per the repo's non-negotiable design-system standard (`AGENTS.md`/`CLAUDE.md`). Paired with `EXPERIENCE.md`. Both spines win on conflict with the existing `prototype/walkthrough-assistant/` mock, which is reference/inspiration only per the user's explicit choice, not ground truth.

## Brand & Style

EASE's screen is **two brands sharing one browser tab, on purpose** — this split is the single most important design decision in this document and every component inherits from it:

1. **Host App Skin** — the mocked ResyOS Dashboard that EASE operates on top of. It must look and feel like a believable third-party restaurant-management product, because the PRD's realism bar (§6.1) and the judging Innovation criterion depend on the audience believing this is a real app EASE is guiding someone through. It intentionally does **not** use DLS — an Amex-branded host app would break the premise that EASE demos on Resy specifically for this MVP, while remaining architected so the same pattern generalizes to other partners' software later (per the brief's stated longer-term ambition, not a claim this demo makes). `[ASSUMPTION]` Grounded in resy.com's own live brand tokens (action blue `#336FDE`, ink `#2A2A2A`, black rail, Helvetica Neue) as previously captured — reused here as a realism reference only.
2. **EASE Chrome Layer** — everything EASE itself renders on top of the host app: the intent bar, the spotlight highlighter, the progress panel, validation messages, the generated Micro-Guide, and the Specialist Review surface. This is the actual Amex-built product surface for GrowthHack judging purposes, so it strictly follows DLS v7 tokens and components per the repo's design-system mandate — no invented hex values, no custom CSS classes beyond documented DLS utilities.

The visual contrast between the two layers is deliberate and should read clearly on screen: when EASE is "speaking" (highlighting, guiding, validating), the DLS-branded chrome should visually pop against the plainer host-app backdrop, the same way a real digital-adoption overlay would. `[ASSUMPTION]` This visual contrast is the demo's on-screen proof of the brief's differentiation claim (`brief.md` — "Vs. traditional digital-adoption tooling"): EASE's own chrome (Intent Bar, Spotlight, Progress Panel, Micro-Guide, Specialist Review) is a distinct, brand-visible layer rendered *within* the same mocked-application session — not a reskin of the host app, and not a separate window. "On top of" here describes that brand/visual relationship, not a claim that EASE runs outside the product experience — it still guides the owner *inside* the one continuous session, matching the PRD Vision's "guides them step by step inside a realistic mocked application."

## Colors

**EASE Chrome Layer** (DLS-governed):
- `ease-primary` (`dls-deep-blue`) — the intent bar, primary buttons, the progress panel's "current step" accent.
- `ease-highlight` / `ease-highlight-ring` (`dls-bright-blue`) — the spotlight ring around the one control EASE wants the owner to act on next (FR-3). Used nowhere else — bright blue means "act here," full stop.
- `ease-success` (`dls-color-success`) — validation-passed states, the progress panel's "done" steps, the Specialist Review "approve" action.
- `ease-warning` (`dls-color-warning`) — validation-failed messages (FR-8), and the Save-vs-Activate Gap "not yet live" catch (FR-7) — the MVP's flagship moment, so this color needs to read as *important, not alarming*: warning, not destructive/red.
- `ease-neutral` (`dls-color-neutral`) — de-emphasized/upcoming steps in the progress panel, backgrounds for non-active regions.
- `ease-reject` (`dls-red`) — reserved solely for the Specialist Review "reject" action (see Do's and Don'ts).
- `ease-scrim` (`#0000008C`, 55% opacity black) — the semi-opaque backdrop dimming everything except the spotlighted control. Not a DLS token (DLS has no scrim utility) — the one genuinely new color value in this file.

**Host App Skin** (non-DLS, realism-only): `host-action-blue` (#336FDE) for the mocked app's own primary actions/links, `host-ink` (#2A2A2A) for its body text, `host-black-rail` for its left nav rail, `host-white` background. These never appear on an EASE chrome component — if a color needs to convey an EASE decision (highlight, validation, progress), it always comes from the DLS palette above, never from the host skin.

**Contrast targets (load-bearing combinations):** DLS v7's own tokens meet WCAG AA by default for chrome-on-chrome pairs (e.g., `ease-white` text on `ease-primary`, `ease-black` text on `ease-success`/`ease-warning`) — no local override needed. The one pair DLS's own AA guarantee does **not** cover is the Spotlight Ring against the Host App Skin, because the ring sits on top of non-DLS host colors it doesn't control: `ease-highlight-ring` (`dls-bright-blue`) must maintain **at least 3:1 contrast** (WCAG AA non-text/UI-component minimum) against whatever Host App Skin background it's drawn over (`host-white`, `host-black-rail`, etc.) — verify this pairing specifically when the key-screen mock is built, since it's the one place two independent brand systems touch.

Avoid: reusing `host-action-blue` for anything EASE says or does (it would blur the two-layer distinction this MVP's Innovation story depends on); `ease-reject` (`dls-red`) for anything except the Specialist Review "reject" action (reject is the only genuinely destructive, non-recoverable action in the MVP).

## Typography

EASE Chrome Layer inherits DLS v7 typography utilities wholesale: `heading-1`–`heading-6` for the progress panel title and Micro-Guide/Specialist Review headers, `body`/`body-1`–`body-3` for validation messages and guide step text, `legal-1`/`legal-2` for any fine print (e.g., Micro-Guide provenance line — "Generated from a live run on `<run-date>`" — a runtime value, not a design token). No custom fonts, no overrides.

Host App Skin uses a plain system sans stack (Helvetica Neue / Arial / sans-serif fallback) — `[ASSUMPTION]` deliberately generic-looking so it doesn't read as either an Amex product or a specific named real product beyond what's needed for Resy-realism.

## Layout & Spacing

DLS default spacing scale inherited as-is for all EASE chrome — no custom spacing tokens. Progress panel docks to one side of the viewport (right, per the shadcn/Drift-style precedent of a persistent side panel that doesn't require re-navigation) — `[ASSUMPTION]`, revisit once a key-screen mock exists. Host App Skin's internal layout mirrors the real ResyOS Dashboard's own conventions (left black rail nav, main canvas) closely enough to be recognizable, per the hero-journey ground truth's screen references.

## Elevation & Depth

EASE chrome elements float above the host app: the spotlight ring, scrim, and any EASE-authored modal/toast use DLS's standard elevation utilities (shadow-on-raise) to visually separate "EASE is talking to you right now" from "this is just the host app." Host App Skin uses flat, minimal elevation — consistent with most real B2B dashboard products, and a further visual cue that depth = EASE, flat = host.

## Shapes

EASE chrome inherits DLS default corner radii — no overrides beyond `{rounded.full}` (the pill shape used by the Intent Bar). The spotlight ring itself is not a filled shape but an outline (`3px solid {colors.ease-highlight-ring}`) around the host control's own bounding box, so it never obscures the control it's pointing at.

## Components

**EASE Chrome Layer** (all DLS-governed, no custom CSS):
- **Intent Bar** (`ease-intent-bar`) — persistent entry point for the owner's stated goal ("Help me create a floor plan"). `ease-primary` fill, DLS `Button`/input primitives. `[ASSUMPTION]` Docked bottom-of-viewport, echoing the existing prototype's chat-launcher convention as a UX pattern (not its styling) — confirm placement once a key-screen mock exists.
- **Spotlight Ring** (`ease-spotlight-ring`) — the FR-3 highlight mechanism. One ring, one scrim, always exactly one active control per Step (never zero, never more than one — this is a hard EXPERIENCE.md rule, see Component Patterns).
- **Progress Panel** (`ease-progress-panel`) — persistent Step 1–6 list with per-step status (`ease-neutral` upcoming, `ease-primary` current, `ease-success` done) and overall completion percentage (FR-4).
- **Validation Message** (`ease-validation-message`) — inline, DLS `body` text, `ease-warning` background on failure naming the specific missing field (FR-8), `ease-success` on pass. Never a generic DLS default "error" toast with vague copy.
- **Micro-Guide Card** (`ease-microguide-card`) — Scribe-style numbered step cards (FR-10), `ease-surface` background, DLS `heading` for the guide title, `legal-1` provenance line.
- **Specialist Review Card** (`ease-specialist-review-card`) — Micro-Guide preview + journey stats + approve (`ease-success`)/reject (`ease-reject`) actions (FR-11).

**Host App Skin:** whatever DLS-free components the mocked ResyOS Dashboard needs (nav rail, floor-plan canvas, table config form, Shift settings form) — these are staging/props for EASE to operate on, not judged as an Amex UI deliverable, so they're excluded from the DLS mandate. `[ASSUMPTION]` — flag for Architecture/Build if this reading is wrong.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep every EASE-authored pixel in DLS v7 components/utilities | Let the Host App Skin's colors/fonts leak into an EASE chrome component |
| Use `ease-highlight` for exactly one control per Step | Highlight more than one control, or leave a Step with nothing highlighted |
| Use `ease-warning` (not `ease-reject`) for the Save-vs-Activate Gap catch | Make the MVP's flagship moment look like a destructive error |
| Reserve `ease-reject` for the Specialist Review reject action only | Reuse `ease-reject` anywhere else in the EASE chrome |
| Keep the two-layer brand contrast visible on screen | Reskin the Host App Skin to look Amex-branded — this MVP demos on Resy specifically (per PRD scope); "any partner's software" is the brief's stated longer-term ambition, not a claim this demo itself makes |
