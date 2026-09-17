# Spine Pair Review — EASE GrowthHack 2026 MVP

## Overall verdict
This spine pair is structurally close to the canonical bar and is already useful for human readers, especially around component coverage and overall section shape. It is not yet contract-grade for downstream consumers, though, because the [DESIGN.md](./DESIGN.md) token model is not mechanically resolvable as written and the [EXPERIENCE.md](./EXPERIENCE.md) state/name contract still leaves a few important behaviors implicit. Fix the token contract first, then tighten protagonists, states, and naming drift before handoff.

## 1. Flow coverage — adequate
Checked every PRD UJ against [EXPERIENCE.md](./EXPERIENCE.md) Key Flows for presence, protagonist naming, numbered steps, climax beat, and failure/alternate branch handling.

### Findings
- **medium** Both PRD journeys are represented and both flows include numbered steps, a clear climax, and an applicable alternate/failure branch, but neither flow uses a named protagonist; the copy falls back to generic role nouns ("The owner", "they") instead of a named actor. ([EXPERIENCE.md](./EXPERIENCE.md) §Key Flows; [prd.md](../../prds/prd-EASE-2026-09-14/prd.md) §2.3 Key User Journeys). *Fix:* give each flow a named protagonist in the heading and carry that name through the steps.

## 2. Token completeness — broken
Checked [DESIGN.md](./DESIGN.md) frontmatter tokens, component token values, and every brace-style token reference in prose for local definition/resolution, plus stated contrast requirements for load-bearing combinations.

### Findings
- **critical** The frontmatter is not mechanically self-resolving as a contract: multiple color tokens and component values point into an undeclared `dls.*` namespace, `ease-scrim` is a raw `rgba(...)` literal instead of a spec-shaped hex/reference color token, and `radius: 'dls default (pill)'` is prose rather than a resolvable token value. ([DESIGN.md](./DESIGN.md) frontmatter `colors` and `components`). *Fix:* declare a resolvable DLS namespace in frontmatter or collapse every external dependency into locally declared semantic tokens, and replace free-text component values with token refs or concrete dimensions.
- **high** Cross-reference syntax is used for non-resolving placeholders: `{date}` is prose interpolation, not a token path, and `{ease-highlight-ring}` omits the required `colors.` path segment. ([DESIGN.md](./DESIGN.md) §Typography; [DESIGN.md](./DESIGN.md) §Shapes). *Fix:* convert prose placeholders to plain text/backticks and make token refs fully qualified (for example, `{colors.ease-highlight-ring}`).
- **high** Load-bearing combinations do not state explicit contrast targets or complete foreground/background pairings, especially for the Intent Bar, Validation Message, Progress Panel status states, and the Spotlight Ring against the Host App Skin. ([DESIGN.md](./DESIGN.md) §Colors; [DESIGN.md](./DESIGN.md) §Components; [EXPERIENCE.md](./EXPERIENCE.md) §Accessibility Floor). *Fix:* list the foreground token for each critical surface and state the required WCAG target for each key pair.

## 3. Component coverage — strong
Checked that every EASE component defined in [DESIGN.md](./DESIGN.md) also appears in [EXPERIENCE.md](./EXPERIENCE.md) Component Patterns with real behavioral rules.

### Findings
- No material misses found. The six EASE Chrome components defined in [DESIGN.md](./DESIGN.md) frontmatter all have corresponding behavioral rows in [EXPERIENCE.md](./EXPERIENCE.md) §Component Patterns.

## 4. State coverage — thin
Checked each IA surface in [EXPERIENCE.md](./EXPERIENCE.md) against State Patterns for appropriate empty/load/error/terminal coverage.

### Findings
- **medium** There is no explicit cold-load or "intent resolving" state even though the IA includes app load and a free-text intent submission surface that must resolve via the model before guidance starts. ([EXPERIENCE.md](./EXPERIENCE.md) §Information Architecture; [EXPERIENCE.md](./EXPERIENCE.md) §State Patterns). *Fix:* add explicit rows for initial dashboard load and Intent Bar submission/resolution.
- **medium** The generated-guide side of the system is under-covered: State Patterns includes `pending_review`, but not no-candidate, generation-failed, or post-approval/post-rejection terminal treatments for the separate Specialist Review surface. ([EXPERIENCE.md](./EXPERIENCE.md) §Information Architecture; [EXPERIENCE.md](./EXPERIENCE.md) §State Patterns; [EXPERIENCE.md](./EXPERIENCE.md) §Key Flows). *Fix:* add explicit states for "no pending guide," "guide generation failed/unavailable," and the visible result of approved vs rejected review.

## 5. Visual reference coverage — strong
Checked for any supporting artifacts under `mockups/`, `wireframes/`, and `imports/`.

### Findings
- No material misses found. This pass intentionally has no visual reference files yet: `mockups/` and `wireframes/` are absent, and `imports/` exists but is empty, which matches the stated Fast-path expectation for this review cycle. ([ux-EASE-2026-09-15/](./)).

## 6. Bloat & overspecification — adequate
Checked whether the pair stays contract-focused versus drifting into pitch, architecture, or meta-process prose that downstream implementers do not need.

### Findings
- **low** A few passages drift from contract language into judging/pitch rationale, which slightly reduces scanability for architecture and story-dev consumers. ([DESIGN.md](./DESIGN.md) §Brand & Style, §Colors; [EXPERIENCE.md](./EXPERIENCE.md) §Inspiration & Anti-patterns). *Fix:* once the contract is locked, trim judge-facing justification and keep only the behavior/style rules that consumers must implement.

## 7. Inheritance discipline — thin
Checked source resolution, verbatim UJ/requirement naming, terminology consistency, component naming consistency, and token-name alignment between the spines.

### Findings
- **high** The Key Flow titles are not verbatim copies of the PRD UJ names: Flow 1 drops the PRD's trailing clause about "the one mistake that would otherwise sink the demo," and Flow 2 drops "and approves ... from a successful run." ([EXPERIENCE.md](./EXPERIENCE.md) §Key Flows; [prd.md](../../prds/prd-EASE-2026-09-14/prd.md) §2.3 Key User Journeys). *Fix:* use the exact PRD UJ strings as flow titles, or define an explicit alias once and reuse it consistently.
- **medium** Component identifiers are semantically aligned but not textually identical across sections (`ease-intent-bar` vs `Intent Bar`, `ease-microguide-card` vs `Micro-Guide Card`, etc.), which weakens exact-name traceability. ([DESIGN.md](./DESIGN.md) frontmatter `components`; [EXPERIENCE.md](./EXPERIENCE.md) §Component Patterns). *Fix:* choose one canonical component naming scheme and use it in both documents.
- **medium** `Host App Skin` and `EASE Chrome Layer` are important new nouns shared across both spines, but they are not inherited from or backfilled into a shared glossary/source contract. ([DESIGN.md](./DESIGN.md) §Brand & Style; [EXPERIENCE.md](./EXPERIENCE.md) §Foundation; [prd.md](../../prds/prd-EASE-2026-09-14/prd.md) §3 Glossary). *Fix:* either add these terms to the PRD glossary/decision log or define them in a dedicated glossary block inside the spine pair.

## 8. Shape fit — strong
Checked [DESIGN.md](./DESIGN.md) against the canonical section order and [EXPERIENCE.md](./EXPERIENCE.md) for required/default section presence plus the two optional sections called out in the rubric.

### Findings
- No material misses found. [DESIGN.md](./DESIGN.md) follows the canonical order exactly, and [EXPERIENCE.md](./EXPERIENCE.md) includes all required default sections plus warranted Responsive & Platform / Inspiration & Anti-patterns sections.

## Mechanical notes
- Frontmatter `sources:` resolve cleanly in both [DESIGN.md](./DESIGN.md) and [EXPERIENCE.md](./EXPERIENCE.md).
- Both spines still declare `status: draft`; if this review is the handoff gate, promote only after the token/state/name fixes above land.
- The Host App Skin token provenance references `prototype/walkthrough-assistant/` in prose, but that evidence source is not listed in frontmatter `sources:`. Decide whether that reference is normative evidence or merely inspiration.
- The biggest cross-ref issues are mechanical rather than conceptual: undeclared external token namespace, `{date}` used like a token, and `{ease-highlight-ring}` missing its full path.
