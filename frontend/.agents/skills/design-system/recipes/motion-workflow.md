# Motion Workflow

This file contains the full motion workflow for `@americanexpress/dls-motion`, including decision trees, token tables, audit format, and consistency checks. Follow this workflow when a user accepts the motion offer from Step 6 of the design-system skill.

## Required Output Format

Every response that applies or modifies motion **MUST** end with both blocks below. Plain prose summaries are a violation of this skill.

### Motion Code Audit

```
### ✅ Motion Code Audit
| Check | Findings |
|---|---|
| Framer-style props on AnimatedWrapper | <list each prop + file:line, or "none"> |
| Hardcoded duration/easing values | <list each value + file:line, or "none"> |
| Slide without fade composition | <list each instance + file:line, or "none"> |
| Wrapper selection mismatch | <list each instance + file:line, or "none"> |
| Full-page slide transition | <list each instance + file:line, or "none"> |
| Cross-component animation consistency | <"consistent" or list mismatched props + file:line> |
| dls-motion dependency present | <"yes" or "no (needs add: @americanexpress/dls-motion)"> |
| dls-motion version source | <"existing package.json", "installed unpinned", or list violation + file:line> |
| dls-motion version | <"^7.17.0 or later" or "⚠️ outdated: <version found> — upgrade to ^7.17.0"> |
```

### Motion Summary

```
### 🎬 Motion Applied: <Page/Component Name>
**Summary of changes:**
- <one bullet per animated element: element + animation primitive + trigger>
**Status:**
✅ No errors remain. Motion skill is now active on <Page/Component Name>.
```

If any audit finding is non-empty: flag inline with `⚠️ MOTION API ISSUE: <file>:<line> — <issue> — Fix: <correct pattern>` and resolve before ending your turn.

## Workflow

### Step 0: Consistency Scan (MANDATORY before applying motion)

Before writing any animation code, search the codebase for existing `AnimatedWrapper`, `TransitionWrapper`, `useInView`, `useDelayed` usage. Note what primitives, durations, and easings are used on similar components. New motion code must match existing patterns for the same component types.

### Step 1: Identify Motion Type

Use the Motion Effects Decision Tree (below) to classify the user's intent into one of the four canonical motion types: Micro-animation, Content Transition, Page Transition, or Point-to-Point. This determines which wrapper, primitives, and tokens to use.

### Step 2: Select Scope + Wrapper

Use the Motion Scope decision tree and Component-Level decision tree (see Element-Driven Decision Trees below) to pick the wrapper and primitives.

### Step 3: Apply Motion

Generate code following Core Principles. Use token imports from `'@americanexpress/dls-motion'` only.

### Step 4: Audit + Summary

Output both mandatory blocks from the Required Output Format section. Do not skip.

## Core Principles

1. **Always use dls-motion tokens** — never hardcode duration/easing values
2. **Always compose slide + fade** — slide primitives are transform-only, they need fadeIn/fadeOut for opacity
3. **Array syntax for composition:** `animation={[slideInLeft, fadeIn]}`
4. **Import everything from package root:** `import { fadeIn, duration300, easeInOut } from '@americanexpress/dls-motion'`
5. **prefers-reduced-motion is handled automatically** — never override this behavior
6. **For DLS component APIs** (props, variants, accessibility), defer to the component references — motion handles only the animation layer

## Prerequisites

### Installation

If `@americanexpress/dls-motion` is not in the project's `package.json`, install it before applying any motion code:

```bash
npm install @americanexpress/dls-motion
```

**Version:** Use `^7.17.0` or later (aligned with DLS v7 monorepo). Do NOT use `^0.x` versions — those are pre-monorepo releases with a different API surface.

**Peer dependencies:** Requires `react` and `react-dom` >=16.14.0 <20. Any project already using `@americanexpress/dls-react` v7 satisfies this.

**No stylesheet required:** Unlike `dls-react` (which requires a `dls-core` CSS link), `dls-motion` uses the Web Animations API and has zero CSS dependencies.

**Import path:** Everything imports from the package root — never from subpaths:

```tsx
// ✅ Correct
import { AnimatedWrapper, TransitionWrapper, fadeIn, duration300, easeInOut, useInView, useDelayed } from '@americanexpress/dls-motion';

// ❌ Wrong — do not import from subpaths
import { fadeIn } from '@americanexpress/dls-motion/tokens';
```

### When Dependency Is Missing

If the audit block reports `dls-motion dependency present: no`:
1. Run `npm install @americanexpress/dls-motion`
2. Verify it was added to `dependencies` (not `devDependencies`) in `package.json`
3. Do NOT pin an exact version — use the `^` range prefix
4. Then proceed with applying motion code

## Anti-Patterns

Never do the following:

- **Never wrap a full page or page-level container in a slide animation.** Slides use translateX/Y(100%) — on full-width elements this slides the entire viewport. Page-level containers may only use fadeIn. Animate child sections independently. See `./motion.md#page-level-motion-rules`.
- **Never use slide primitives alone** — content appears/disappears abruptly without opacity transition. Always compose with fadeIn/fadeOut.
- **Never hardcode `'300ms'` or `'cubic-bezier(...)'`** — always use tokens
- **Never use AnimatedWrapper for enter/exit transitions** — use TransitionWrapper
- **Never import from subpaths** like `@americanexpress/dls-motion/tokens` — import from `'@americanexpress/dls-motion'`
- **Never use Framer Motion-style props** (`initial`, `animate`, `exit`, `variants`, `whileHover`) on AnimatedWrapper — these do not exist
- **Never pin or hardcode the dls-motion version** — use the version from the project's package.json or install unpinned
- **Never place AnimatedWrapper inside a `.map()` without extracting to a named component** (Rules of Hooks) — `useInView`, `useDelayed`, `useRef` must be called at the top level of a component

## Motion Effects Decision Tree

Motion at American Express is organized into four types (per DLS motion guidelines):

| Type | Description |
|---|---|
| Micro-animations | Small, localized interactions — hover, press, tap feedback, success cues |
| Content transitions | Elements entering or exiting view — modals, drawers, dropdowns, scroll reveals |
| Page transitions | Animated transitions between major views or routes |
| Point-to-point | Animating between two states or layouts — card expand/collapse, tab switch |

```
What motion effect are you trying to achieve?

├─ Micro-animation (hover, press, tap, success cue)
│  ├─ Hover/press/tap states → OUTSIDE dls-motion scope (use CSS :hover/:active/:focus)
│  ├─ Success feedback (checkmark appear, completion indicator)
│  │  → AnimatedWrapper + fadeIn, duration100-200, easeOut
│  └─ Icon animation → OUTSIDE dls-motion scope
│
├─ Content transition (element entering or exiting view)
│  ├─ Mount/unmount (modal, drawer, toast, tooltip, dropdown)
│  │  → TransitionWrapper
│  │  ├─ Overlay/dialog → enterAnimation: fadeIn, exitAnimation: fadeOut
│  │  ├─ Side panel/drawer → enterAnimation: [slideInLeft, fadeIn], exitAnimation: [slideOutLeft, fadeOut]
│  │  ├─ Toast/notification → enterAnimation: [slideInTop, fadeIn], exitAnimation: [slideOutTop, fadeOut]
│  │  └─ Dropdown → enterAnimation: fadeIn, exitAnimation: fadeOut, duration200
│  └─ Always-mounted, revealed on scroll
│     → AnimatedWrapper + useInView
│     ├─ Single element → fadeIn or [slideInBottom, fadeIn], showOnce: true
│     └─ List/grid → staggered via useInView delay or useDelayed
│        → See ./motion.md#staggered-scroll-triggered-reveals
│
├─ Page transition (between routes/major views)
│  ├─ Full-page slide → PROHIBITED (see Anti-Patterns)
│  ├─ Full-page fade → AnimatedWrapper + fadeIn, duration300-500, on mount
│  └─ Animate child sections independently (RECOMMENDED)
│     → Hero: fadeIn on mount
│     → Cards: staggered [slideInBottom, fadeIn] via useInView
│     → CTA: fadeIn via useInView
│     → See ./motion.md#page-level-motion-rules
│
└─ Point-to-point (between two states/layouts)
   ├─ Expand/collapse → OUTSIDE dls-motion scope (Accordion has built-in)
   ├─ Layout shift / resize → NOT supported by dls-motion (no layout animation primitives)
   └─ Content swap (e.g., tab content change)
      → AnimatedWrapper + fadeIn on new content, duration200-300
```

## Easing by Motion Use Case

| Motion Use Case | Easing Behavior | dls-motion Token | Perceptual Effect |
|---|---|---|---|
| Entering content | Quick start, slow finish | easeOut | Builds confidence and clarity |
| Exiting content | Slow start, quick finish | easeIn | Reduces disorientation |
| Hover/tap interactions | Quick, snappy response | (CSS, not dls-motion) | Feels responsive and lightweight |
| Point-to-point movement | Fast out → slow in | easeInOut | Strong directional focus, polished flow |
| General / both enter+exit | Balanced | easeInOut | One prop handles both directions |
| Continuous (progress, spinner) | Constant speed | linear | Predictable, mechanical |

## Duration by Motion Category

| Duration Category | dls-motion Tokens | Best For |
|---|---|---|
| Short | duration100, duration200 | Hovers, tap feedback, quick entry, tooltips |
| Medium | duration300, duration400 | Standard UI transitions — modals, drawers, dropdowns |
| Long | duration500, duration600, duration700 | Page loads, layout changes, staggered sequences, marketing emphasis |

**Note on TransitionWrapper easing:** TransitionWrapper takes a single `easing` prop for both enter and exit. You cannot use easeOut for enter and easeIn for exit on the same wrapper. Use `easeInOut` for TransitionWrapper.

## Element-Driven Decision Trees

### Page-Level Motion Strategy

```
Need to animate page content?
├─ Hero / above-the-fold content → AnimatedWrapper + fadeIn, duration300, on mount
├─ Card grid / list below fold → staggered AnimatedWrapper + [slideInBottom, fadeIn] via useInView with delay (MUST extract each item into a child component — never call useInView in .map())
├─ Sections revealed on scroll → useInView + fadeIn, showOnce: true
├─ Sequential reveal (one after another) → AnimatedWrapper + onEnd chaining → ./motion.md#sequential-chain
└─ No animation needed → static content, data tables, forms
```

### Component-Level Motion Strategy

```
Component appears/disappears (open/close)?
├─ Modal / Dialog → TransitionWrapper + fadeIn/fadeOut, duration300, easeInOut → ./motion.md#modal-fade
├─ Drawer / Side panel → TransitionWrapper + [slideInLeft, fadeIn] / [slideOutLeft, fadeOut] → ./motion.md#drawer-slide
├─ Tooltip / Popover → TransitionWrapper + fadeIn/fadeOut, duration200
├─ Toast / Notification → TransitionWrapper + [slideInTop, fadeIn] / [slideOutTop, fadeOut]
├─ Accordion content → skip (has built-in transitions)
└─ Tab content → AnimatedWrapper + fadeIn on tab change

Component always visible (one-shot)?
├─ Card list / grid → staggered with useDelayed or useInView delay → ./motion.md#staggered-list (MUST extract each item into a child component)
├─ Single content block → AnimatedWrapper + fadeIn
├─ Marketing / promo section → AnimatedWrapper + [slideInLeft or slideInRight, fadeIn]
├─ Simultaneous multi-element → multiple AnimatedWrappers sharing one trigger → ./motion.md#stacked-simultaneous
└─ Data table / form → no animation
```

### Wrapper Selection

```
Need animation?
├─ One-shot (enter only, no exit) → AnimatedWrapper → ../references/animated-wrapper.md
├─ Enter + exit (open/close) → TransitionWrapper → ../references/transition-wrapper.md
├─ Scroll-triggered → useInView + AnimatedWrapper → ../references/use-in-view.md
├─ Delayed/staggered start → useDelayed + AnimatedWrapper → ../references/use-delayed.md
└─ Token lookup → ../references/motion-tokens.md
```

## Token Selection

### Easing Selection

```
What direction?
├─ Entrance animation → easeOut (fast start, gradual deceleration, feels responsive)
├─ Exit animation → easeIn (slow start, fast finish, feels deliberate)
├─ Both enter + exit (TransitionWrapper) → easeInOut (single prop handles both directions)
├─ Continuous (progress bar, spinner) → linear (constant speed)
└─ General / unsure → easeInOut (balanced default)
```

### Duration Selection

```
What type?
├─ Micro-interaction (tooltip, badge) → duration100 or duration200
├─ Standard transition (modal, drawer, slide) → duration300
├─ Emphasized entrance (hero, marketing) → duration500 or duration700
├─ Staggered delay between items → useInView delay: index * 100, or useDelayed: index * 300
└─ Instant (no animation but token-based) → duration0
```

## Standard Token Defaults

| Component | Wrapper | Primitives | Duration | Easing |
|---|---|---|---|---|
| Modal | TransitionWrapper | `fadeIn` / `fadeOut` | `duration300` | `easeInOut` |
| Drawer | TransitionWrapper | `[slideInLeft, fadeIn]` / `[slideOutLeft, fadeOut]` | `duration300` | `easeInOut` |
| Tooltip | TransitionWrapper | `fadeIn` / `fadeOut` | `duration200` | `easeInOut` |
| Toast | TransitionWrapper | `[slideInTop, fadeIn]` / `[slideOutTop, fadeOut]` | `duration300` | `easeInOut` |
| Card grid | AnimatedWrapper + useInView | `[slideInBottom, fadeIn]` | `duration300` | `easeInOut` |
| Hero section | AnimatedWrapper | `fadeIn` | `duration500` | `easeOut` |
| Marketing section | AnimatedWrapper | `[slideInLeft, fadeIn]` or `[slideInRight, fadeIn]` | `duration300` | `easeOut` |
| Success indicator | AnimatedWrapper | `fadeIn` | `duration200` | `easeOut` |
| Tab content swap | AnimatedWrapper | `fadeIn` | `duration200` | `easeInOut` |
| Page-level fade | AnimatedWrapper | `fadeIn` | `duration500` | `easeOut` |

## Animation Consistency Checklist

Before committing motion code, verify:

1. Same component type uses the same wrapper across all files
2. Same component type uses the same primitives across all files
3. Same component type uses the same duration token across all files
4. Same component type uses the same easing token across all files
5. Same trigger mechanism for the same context (e.g., all scroll reveals use useInView with showOnce)
6. No full-page slides
7. No slide without fade

If inconsistencies are found, update the new code to match the existing pattern or flag for discussion. Output results in the Motion Code Audit block (see Required Output Format).

## When Applying Motion After Code Generation

- Read the already-generated component code
- Wrap animatable elements with the appropriate wrapper — do NOT modify the DLS component structure, only add motion wrappers around existing JSX
- Add imports from `'@americanexpress/dls-motion'`
- Ensure `@americanexpress/dls-motion` is in the project's `package.json` dependencies; if not, note it needs to be added
- **Never wrap the entire generated page in a single AnimatedWrapper.** Always animate individual sections independently. Page-level containers may only use fadeIn, never slide.
- Run the Custom Code Audit after motion is applied (motion wrappers are exempt from the "raw HTML elements" check since they render `<div>` by design)

## Motion Consistency Lint

When asked to "audit motion", "lint motion", or "check motion consistency":

1. Find all imports from `@americanexpress/dls-motion` across the codebase
2. Group usage by component type (e.g., all Modals, all Card grids, all Drawers)
3. For each group, check:
   - Same wrapper used consistently
   - Same primitives used consistently
   - Same duration token used consistently
   - Same easing token used consistently
   - Same trigger mechanism for the same context
4. Output the full lint report using the Motion Code Audit table format
