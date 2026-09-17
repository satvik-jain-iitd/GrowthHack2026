---
name: design-system
description: |
  Generate and modify frontend applications using DLS React v7 components, CSS utilities, layouts, and accessibility best practices. Use this skill when
  - Building UI with American Express Design Language System (DLS) v7 components
  - Working with `@americanexpress/dls-react` version 7.x (e.g. `^7.14.0`, `^7.15.0`) React components, CSS styling, layouts, or accessibility
  - User requests involve creating, modifying, or debugging DLS v7-based interfaces
  - Adding animation or transitions using `@americanexpress/dls-motion` (AnimatedWrapper, TransitionWrapper, useInView, useDelayed)
  - Performing manual accessibility audits, keyboard testing, or WCAG compliance reviews of web UI
  - Migrating a frontend project from DLS v6 to DLS v7 (codemod, dependency upgrades, component/utility/heading/icon migration, design token enforcement)
metadata:
  version: 1.2.0
---

# Core Principles

1. **Always query MCP or reference files** - Never assume component APIs, prop names, or utility classes from prior knowledge
2. **Use DLS components over HTML** - Prefer `<Button>` over `<button>`, `<Heading>` over `<h1>`, etc.
3. **Use DLS utilities over custom CSS** - Apply documented utility classes via `className`; never create custom CSS
4. **Prioritize local references** - Check `./references/*.md` first, then query MCP if needed
5. **When corrected by user** - Immediately query MCP/references before responding
6. **Always end with the Custom Code Audit block** - Every code generation response MUST include the filled-in audit block from Step 5. A response without it is incomplete.

**Deviation from these principles produces invalid, non-DLS-compliant output.**

# Anti-Patterns

Never do the following:

- **Assume component APIs** - Always verify prop names, component structure, and behavior against documentation
- **Use raw HTML elements** - Never use `<button>`, `<h1>`, `<h2>`, `<input>`, `<select>`, `<label>` when DLS components exist
- **Create custom CSS** - Never write custom CSS classes when DLS utilities exist (check `./recipes/styling-components.md` first)
- **Use undocumented utilities** - Only use CSS classes from `./recipes/styling-components.md` or MCP documentation
- **Skip accessibility** - Always follow accessibility patterns from `./recipes/accessibility.md`
- **Provide answers without verification** - When uncertain or corrected, query documentation first
- **Create flat file structures** - Never place multiple related components in a flat folder when they should be grouped by feature. Always use folder hierarchy to reflect component relationships and feature boundaries.
- **Skip the Custom Code Audit** - Never end a code generation turn without outputting the filled audit block. Omitting it is a violation of this skill.

# Workflow

Follow these steps for every DLS task:

## 1. Identify Requirements

- List all components needed
- Note layout requirements (grid/flex, spacing, alignment)
- Check if patterns exist in `./references/` or `./recipes/`

## 2. Retrieve Documentation

**Check local references first:**

- Component-specific docs: `./references/<component-name>.md`
- Layout patterns: `./recipes/layout.md`
- Styling guidelines: `./recipes/styling-components.md`
- Accessibility rules: `./recipes/accessibility.md`
- Data Visualization and Data Charts guidelines: `./recipes/data-visualization.md`

**If local references insufficient, query MCP:**

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 node <skill-dir>/scripts/call_tool.mjs dls-mcp.dls-get-documentation '{"files":["components/Button"]}' https://mcpinternal-dev.aexp.com/dls-mcp
```

Note the script path is relative to the skill location NOT to the workspace.

## 3. Generate Code

- Always import DLS components using the import statement below (replace component names as needed):
  ```tsx
  import { Button } from "@americanexpress/dls-react";
  ```
- Use exact prop names and APIs from documentation
- Apply DLS utility classes for styling (see `./recipes/styling-components.md`)
- Follow patterns from reference files and recipes
- Add intentional spacing and polish

## 3b. Favor Natural File Boundaries

- Always generate code using modular, maintainable file structures that reflect component relationships:
- One React component per file
- Separate files for helpers, hooks, and constants
- Group related components into feature folders when appropriate
- Use folder hierarchy to mirror component hierarchy
- Never place all code in a single file when multiple logical files are appropriate

## 4. Validate

- Verify all components exist in DLS
- Confirm all utility classes are valid. Check `./references/utility-classes-core.md` (index), then read only the relevant sub-file. Remove any classes that are not documented.
- Check accessibility requirements are met
- Each React component should be in its own file
- Shared utilities, hooks, and constants should be placed in separate files
- Never combine unrelated components or logic in a single file
- Verify that generated code has no ESLint errors according to ESlint configuration in repository

## 5. Custom Code Audit (MANDATORY — do not skip)

You MUST NOT end your turn after generating code without outputting the audit block below. A response that omits this block is incomplete and violates this skill.

**Scan every generated file for:**

- Custom CSS classes in any `className` attribute not found in `./references/utility-classes-core.md` or `./references/utility-classes-extra.md` (and their sub-files)
- Raw HTML elements (`<button>`, `<input>`, `<label>`, `<h1>`–`<h6>`, `<select>`) used in place of DLS components
- Component props not present in the relevant `./references/<component>.md`

**Required output block — fill in every field, do not omit:**

```
### ✅ Custom Code Audit
| Check | Findings |
|---|---|
| Custom CSS classes | <list each class + file:line, or "none"> |
| Raw HTML elements | <list each element + file:line, or "none"> |
| Undocumented props | <list each prop + file:line, or "none"> |
```

**If any finding is non-empty:**

- 🚨 Flag it inline with: `⚠️ CUSTOM CODE DETECTED: <file>:<line> — <issue> — Fix: <DLS equivalent>`
- Propose the DLS-compliant replacement before ending your turn
- Do not leave flagged issues unresolved

## 6. Offer Motion (Conditional)

After completing the Custom Code Audit, evaluate whether the generated UI would benefit from animation.

**Trigger conditions** (offer motion if ANY are true):
- Output contains a page layout with multiple content sections (hero + cards, multi-section page)
- Output includes Card components, Card grids, or rendered list items
- Output includes Modal, AlertDialog, Drawer, or any overlay component
- Output includes a hero section or marketing/promotional content
- Output contains content that loads dynamically or appears/disappears based on state

**If ANY trigger condition is met, present this to the user:**

> **Motion opportunity detected.** Your UI includes [describe what was detected: Cards/a Modal/a page layout/etc.] that could benefit from animation. I can apply:
> - [List specific recommendations based on what was built, e.g.:]
> - Staggered scroll-triggered reveals for your card grid
> - Enter/exit transitions for your Modal/Drawer
> - Fade-in entrance for your hero section
>
> Would you like me to apply motion using `@americanexpress/dls-motion`?

**If user accepts:**
- Follow the full motion workflow in `./recipes/motion-workflow.md`
- That recipe includes the mandatory output blocks (Motion Code Audit + Motion Summary) — do not skip them

**If user declines or no trigger conditions are met:**
- End the turn normally after the Custom Code Audit

**Do NOT apply motion automatically without asking.** Always present the offer and let the user decide.

## 7. Offer Accessibility Manual Audit (Conditional)

After completing the Custom Code Audit (and optionally motion), evaluate whether the generated UI would benefit from a manual accessibility audit.

**Trigger conditions** (offer audit if ANY are true):
- User explicitly requests an accessibility audit, review, or check
- Output contains complex interactive widgets (custom dropdowns, tab panels, modals, drawers, accordions)
- Output contains forms with validation logic
- Output contains dynamic content that appears/disappears based on state
- User mentions WCAG compliance, keyboard navigation, or screen reader testing

**If ANY trigger condition is met, present this to the user:**

> **Accessibility audit opportunity detected.** Your UI includes [describe what was detected] that would benefit from a manual accessibility audit. I can:
> - Test keyboard navigation and focus management
> - Verify ARIA state changes on interactive widgets
> - Check WCAG 2.1 A + AA + Amex AAA compliance
> - Produce an evidence-backed audit report
>
> Would you like me to run a manual accessibility audit?

**If user accepts:**
- Follow the full audit workflow in `./recipes/accessibility-manual-audit.md`
- Use the bundled scripts (`./scripts/keyboard-audit.mjs`, `./scripts/virtual-screen-reader-audit.mjs`) as needed
- End with the mandatory audit report format from `./references/a11y-report-template.md`

**If user declines or no trigger conditions are met:**
- End the turn normally

**Do NOT run the audit automatically without asking.** Always present the offer and let the user decide.

## 8. Offer DLS6 to DLS7 Migration (Conditional)

After completing the above steps, evaluate whether the project would benefit from a DLS v6 to v7 migration.

**Trigger conditions** (offer migration if ANY are true):
- User explicitly requests a DLS v6 to v7 migration, upgrade, or modernization
- Project imports from `@americanexpress/dls-react` v6 (e.g. `^6.x.x`)
- Project uses deprecated DLS v6 utility classes, component names, or import paths
- User mentions codemod, DLS upgrade, heading migration, or icon migration in a DLS context

**If ANY trigger condition is met, present this to the user:**

> **DLS v6 → v7 migration opportunity detected.** Your project [describe what was detected: v6 dependencies/deprecated utility classes/v6 component names/etc.] would benefit from migrating to DLS v7. I can:
> - Run the official DLS codemod
> - Update dependencies and import paths
> - Migrate components, headings, icons, and utility classes to v7 equivalents
> - Enforce DLS v7 design tokens and flag items needing manual review
>
> Would you like me to run the DLS6 to DLS7 migration?

**If user accepts:**
- Follow the full migration workflow in `./recipes/dls6-to-dls7-migration.md`
- Use the reference files (`./references/dls6-to-dls7-*.md`) for transformation rules
- End with the Output Contract (commands executed, files modified, diffs, manual follow-ups, validation results)

**If user declines or no trigger conditions are met:**
- End the turn normally

**Do NOT run the migration automatically without asking.** Always present the offer and let the user decide.

# Resources

## Local Files

**Component References** (`./references/*.md`):
Find detailed documentation for 40+ components including Button, Input, Modal, DataTable, etc. Each reference includes:

- Component overview and purpose
- Accessibility guidelines
- Usage examples and code samples
- Props and API documentation
- Best practices and responsive behavior

**Icons Reference** (`./references/icons.md`):

- Overview of available DLS icons as React components
- Import instructions
- Props API for size, color, fill, and accessibility
- List of icons grouped by category (Actions, Navigation, Status, etc.) with descriptions

**Recipes** (`./recipes/*.md`):

- `accessibility.md` - Accessibility best practices
- `styling-components.md` - Applying styles with utility classes
- `disabled.md` - Using `aria-disabled` properly
- `layout.md` - Responsive layout patterns
- `responsive-table.md` - Mobile-friendly table patterns
- `motion.md` — Motion patterns, composition, recipes, page-level rules
- `accessibility-manual-audit.md` — Manual a11y audit workflow
- `browser-testing.md` — Browser-based a11y testing patterns
- `dls6-to-dls7-migration.md` — Full DLS v6 to v7 migration workflow

**Motion References:**

| Intent keywords | File |
|---|---|
| motion workflow, apply motion, motion decision tree | ./recipes/motion-workflow.md |
| motion effects, motion types, micro-animation, content transition, page transition, point-to-point | ./recipes/motion-workflow.md § Motion Effects |
| one-shot animation, fade-in, animate on mount | ./references/animated-wrapper.md |
| enter/exit, open/close, modal, drawer, mount/unmount | ./references/transition-wrapper.md |
| scroll animation, viewport, in-view | ./references/use-in-view.md |
| delay, stagger, sequential timing | ./references/use-delayed.md |
| duration, easing, keyframe, token, primitive | ./references/motion-tokens.md |
| patterns, composition, recipes, accessibility, best practices | ./recipes/motion.md |

**Accessibility Audit Resources:**

- `accessibility-manual-audit.md` — Manual a11y audit workflow, WCAG checklist, ARIA verification
- `browser-testing.md` — Browser-based a11y testing tool usage patterns
- `wcag-checklist.md` — Full WCAG 2.1 A + AA + Amex AAA criteria reference
- `a11y-report-template.md` — Standardized audit report template

**DLS6 to DLS7 Migration:**

| Intent keywords | File |
|---|---|
| DLS v6 to v7 migration, upgrade DLS, codemod | ./recipes/dls6-to-dls7-migration.md |
| heading migration, heading variant, Heading component | ./references/dls6-to-dls7-heading-migration.md |
| utility class migration, DLS token mapping, interaction class | ./references/dls6-to-dls7-utility-class-migration.md |
| icon migration, icon props, dls-icons import | ./references/dls6-to-dls7-icon-migration.md |
| surface migration, background utility, Surface component | ./references/dls6-to-dls7-surface-migration.md |
| design token enforcement, prohibited patterns | ./references/dls6-to-dls7-design-token-enforcement.md |
| deprecated utilities, no v7 alternative | ./references/dls6-to-dls7-deprecated-utilities.md |
| codemod execution, codemod idempotency | ./references/dls6-to-dls7-codemod-execution.md |
| codemod log, automatable patterns, v6 alias | ./references/dls6-to-dls7-codemod-log-automation.md |
| dependency installation, DLS upgrade, one-app-bundler | ./references/dls6-to-dls7-dependency-installation.md |
| import migration, stylesheet import, static assets | ./references/dls6-to-dls7-import-migration.md |
| component migration process, scoping, output requirements | ./references/dls6-to-dls7-component-migration-process.md |

## MCP Server

**Endpoint:** `https://mcpinternal-dev.aexp.com/dls-mcp`

**Available Tool:**

- `dls-get-documentation` - Fetches component APIs, utility class docs, and implementation guides

**Usage Pattern:**

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 node <skill-dir>/call_tool.mjs dls-mcp.dls-get-documentation '{"files":["path/to/doc"]}' https://mcpinternal-dev.aexp.com/dls-mcp
```

Note the script path is relative to the skill location NOT to the workspace.

**If MCP fails:**

1. Report error to user immediately
2. Do not provide answers from prior knowledge
3. Ask user if they want to retry
4. Do not create workarounds

# Decision Trees

## Component Selection

### Form Inputs

```
Need text input?
├─ Standard text → Input
├─ Password → PasswordInput
├─ Phone number → PhoneInput
├─ Currency/money → CurrencyInput
├─ Date (single field) → DateInput
├─ Multi-line text → Textarea
├─ Shareable link → CopyLinkInput
└─ Search field → Search
```

### Selection Controls

```
Need user to choose?
├─ Single from dropdown → Select (SelectCustom or SelectNative)
├─ Multiple from dropdown → MultiSelect
├─ Single from visible options → Radio
├─ Multiple from visible options → Checkbox
├─ Binary on/off → ToggleSwitch
├─ Segment selection → SegmentedControl
├─ Numeric range → Slider
└─ Increment/decrement number → Stepper
```

### Date & Time

```
Need date selection?
├─ Single date (calendar) → DatePicker
├─ Date range (calendar) → DateRangePicker
└─ Date (text input) → DateInput
```

### Buttons & Actions

```
Need clickable action?
├─ Primary/secondary action → Button
├─ Icon only (no text) → IconButton
├─ Multiple related actions → SplitButton
└─ Custom interactive element → ButtonBase
```

### Form Structure

```
Building a form field?
├─ Wrapper for input + label + hint → FieldControl
├─ Input label → Label
├─ Fieldset label → Legend
└─ Helper/error text → Hint
```

### Navigation

```
Need navigation?
├─ Main site/app navigation (header/sidebar) → Navigation
├─ Grouped links (footer, related links) → LinksList
├─ Breadcrumb trail → Breadcrumbs
├─ Tab navigation (same-page views) → Tabs
├─ Dropdown menu → Menu
├─ Page navigation (prev/next) → Pagination
└─ Individual links → Link, BackLink, LinkOut
```

### Notifications & Feedback

```
Need to notify user?
├─ Blocking dialog/overlay → Modal
├─ Alert/confirmation dialog → AlertDialog
├─ System/page-wide message (top of page, below nav) → PageLevelNotification
├─ Form field error/success (next to/below input) → ComponentLevelNotification
├─ Contextual info on hover → Tooltip
└─ Loading/progress indicator → Progress
```

### Data Display

```
Need to display data?
├─ Tabular data → DataTable
├─ Content container → Card
├─ Expandable sections → Accordion
├─ Image slideshow → Carousel
└─ Elevated surface → Surface
```

### Progress Tracking

```
Need progress indicator?
├─ Continuous progress bar → ContinuousLinearTracker or Progress
├─ Segmented steps (linear) → SegmentedLinearTracker
└─ Multi-step wizard → MultiStepTracker
```

### Typography & Layout

```
Need text/layout?
├─ Headings (h1-h6) → Heading
└─ Theme/config wrapper → DesignSystemProvider
```

### Badges, Tags & Labels

```
Need small label/indicator?
├─ Status badge → Badge
├─ Marketing label → MarketingBadge
├─ Removable tag → Tag
└─ Country flag → Flag
```

### Specialized

```
Other needs?
├─ Brand logo → Logo
└─ Filter controls → Filter
```

## When to Use MCP vs Local References

```
Need component documentation?
├─ Check ./references/<component>.md first
│  ├─ Found and sufficient? → Use it
│  └─ Not found or insufficient? → Query MCP
└─ Need latest updates or edge cases? → Query MCP
```

## Styling Approach

```
Need styling?
├─ Check if DLS utility class exists → Use it
├─ No utility exists?
│  ├─ Check if DLS component supports it via props → Use prop
│  └─ Neither exists? → Report limitation to user
└─ Never create custom CSS classes
```

# Common Patterns

For implementation patterns and best practices, refer to the recipes in `./recipes/`:

- **Accessibility** - See `./recipes/accessibility.md` for WCAG compliance, ARIA usage, and keyboard navigation
- **Styling Components** - See `./recipes/styling-components.md` for utility class application and responsive design
- **Disabled States** - See `./recipes/disabled.md` for proper `aria-disabled` usage
- **Layout Patterns** - See `./recipes/layout.md` for grid/flexbox layouts and responsive breakpoints
- **Responsive Tables** - See `./recipes/responsive-table.md` for mobile-friendly table implementations

Each recipe contains working code examples and detailed explanations.
