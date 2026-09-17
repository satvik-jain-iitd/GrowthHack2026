# Design System Skill — DLS v7

Generates accurate, DLS-compliant React UI using the latest version of the Design Language System (`@americanexpress/dls-react` v7+).

Use this skill when your project is on the **current/latest DLS version**. It gives the agent access to ~70 component API references, 7 layout recipes, accessibility patterns, and utility class documentation so it generates code that matches real DLS APIs rather than guessing.

---

## Features

- **Component references** — Props, imports, usage examples, and accessibility notes for every DLS v7 React component (Button, Card, DataTable, Input, Modal, SelectCustom, DatePicker, etc.)
- **Utility class documentation** — Layout, spacing, typography, colors, borders, animation, and miscellaneous utility classes
- **Layout recipes** — Grid system, responsive breakpoints, page structure, navigation patterns, responsive tables, and data visualization
- **Accessibility patterns** — Focus management, ARIA attributes, keyboard navigation, screen reader best practices
- **Motion & animation** — Decision trees, token tables, and recipes for `@americanexpress/dls-motion` (AnimatedWrapper, TransitionWrapper, useInView, useDelayed)
- **Manual accessibility auditing** — WCAG 2.1 A + AA + Amex AAA manual audit workflow, keyboard testing scripts, ARIA state verification, and evidence-backed reporting
- **Styling guide** — Zero-custom-CSS policy; all styling via DLS utility classes on `className`
- **Auto-detection** — Automatically activates when the plugin detects DLS v7 in your project

---

## Usage

**Invoke with a slash command:**
```
/design-system Build a transaction search page with a Search input,
date-range filter Buttons, a status SelectCustom, and a DataTable showing results.
```

**Or natural language:**
```
Use the design-system skill to build a transaction search page with a Search input,
date-range filter Buttons, a status SelectCustom, and a DataTable showing results.
```

### Sample Prompts

**Build a full page layout:**
```
Use the design-system skill to create a dashboard with a Grid layout,
a Navigation sidebar, and a main content area with Cards.
```

**Work with a specific component:**
```
/design-system Add a DateRangePicker to the filter bar that defaults to the last 30 days.
```

**Modify existing code:**
```
Use the design-system skill to refactor the dashboard to use the Grid system with
responsive breakpoints for mobile, tablet, and desktop.
```

**Image prompting (VS Code):**

Upload a screenshot or mockup alongside your prompt to have the agent replicate the design using DLS components. Keep images under ~150 KB and crop to the relevant section.

For 15+ prompt examples, image prompting tips, and advanced patterns, see [PROMPTS.md](../../PROMPTS.md).

### Recommended Models

| Model | Notes |
| --- | --- |
| **Claude Sonnet 4.5 / 4.6** | Best overall DLS code generation results |
| **Claude Haiku 4.5** | Faster; good for simpler tasks |
| **GPT-5.2-Codex** | Good alternative |

> **Tip:** Include `use design-system` explicitly in your prompt when using non-Claude models.

---

## Troubleshooting

**Generated code doesn't match DLS patterns**
- Use a recommended model (Claude Sonnet 4.5/4.6 gives the best results)
- Be explicit about which components, layout, and behavior you want
- Include `use design-system` explicitly in your prompt — required when using non-Claude models

**Image upload not working**
- Keep images under ~150 KB; crop to the relevant section if needed
- Start a new chat if a previous failed upload is causing issues

**Getting v6 patterns instead of v7**
- Check which DLS version your project uses (`@americanexpress/dls-react` in `package.json`)
- The plugin should auto-detect this, but you can override by specifying `/design-system` explicitly

For general troubleshooting (skill not responding, missing models, chat access), see the [root README](../../README.md#troubleshooting).

---

## Contributor Guide

### Skill Structure

```
skills/design-system/
├── SKILL.md
├── README.md
├── references/
│   ├── a11y-report-template.md
│   ├── animated-wrapper.md
│   ├── button.md
│   ├── card.md
│   ├── ...               # ~70 component/utility reference files
│   ├── motion-tokens.md
│   ├── transition-wrapper.md
│   ├── use-delayed.md
│   ├── use-in-view.md
│   └── wcag-checklist.md
├── recipes/
│   ├── accessibility.md
│   ├── accessibility-manual-audit.md
│   ├── browser-testing.md
│   ├── data-visualization.md
│   ├── disabled.md
│   ├── layout.md
│   ├── motion.md                  # Code examples and composition patterns
│   ├── motion-workflow.md         # Decision trees, workflow steps, audit format
│   ├── navigation.md
│   ├── responsive-table.md
│   └── styling-components.md
└── scripts/
    ├── call_tool.mjs
    ├── keyboard-audit.mjs
    └── virtual-screen-reader-audit.mjs
```

### How References Are Organized

**`references/`** — One file per DLS React component, named in kebab-case (e.g., `date-range-picker.md`, `select-custom.md`). Each file contains: import statement, props table, usage examples, and accessibility notes.

**`recipes/`** — Multi-component pattern guides:
- `layout.md` — Grid system, responsive breakpoints, page structure
- `accessibility.md` — Focus management, ARIA patterns, screen reader best practices
- `styling-components.md` — Utility classes, spacing, typography, zero-custom-CSS policy
- `navigation.md` — Navigation patterns and route linking
- `motion.md` — Motion patterns, composition, recipes, page-level rules
- `motion-workflow.md` — Motion decision trees, workflow steps, token tables, audit format
- `accessibility-manual-audit.md` — Manual a11y audit workflow
- `browser-testing.md` — Browser-based a11y testing patterns
- `responsive-table.md` — DataTable patterns for different screen sizes
- `data-visualization.md` — Chart and data display patterns

**`SKILL.md`** — Contains the routing table that maps developer intent to reference files. When you add a new reference, you must also add a corresponding row here.

### Adding a New Component Reference

1. Create `references/<component-name>.md` using kebab-case naming
2. Include: import statement, props table, usage examples, and accessibility notes
3. Pull all information from the actual `@americanexpress/dls-react` v7 source — do not rely on general knowledge
4. Add a routing row in `SKILL.md` mapping relevant keywords to your new file
5. Test by asking the agent a question that should route to your new doc

### Adding a New Recipe

1. Create `recipes/<pattern-name>.md`
2. Show how to combine DLS components to achieve the pattern
3. Include complete, working JSX examples
4. Add a routing row in `SKILL.md` if the recipe covers a new category of questions

### Important Notes

- **Source of truth**: This `skills/design-system/` directory in the repo root is the source of truth. The copy under `plugins/one-amex-agent-plugin/skills/design-system/` is generated by `npm run build` — do not edit it directly.
- **Zero custom CSS**: All examples must use DLS utility classes via `className`. Never include custom CSS or inline styles.
- **Scripts are generated**: The `scripts/` directory contains build output. Do not edit files there manually.
