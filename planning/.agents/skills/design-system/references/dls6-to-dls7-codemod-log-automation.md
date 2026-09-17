# Rule Set: Codemod Log-Driven Automation

## Objective
Read `dls-codemod-logs/` after the codemod runs (or after detecting it already ran) and attempt known-safe fixes for entries the codemod flagged as `MANUAL_CHANGE`. For entries that cannot be safely automated, add actionable review comments in-source.

## Reading Codemod Logs

1. Check for `dls-codemod-logs/` in the project root.
2. Read `dls-codemod-logs/consolidated.log` if it exists, or read individual log files in the directory.
3. Parse each entry for:
   - **File path** and **line number**
   - **Change type** (`MANUAL_CHANGE`, `WARNING`, etc.)
   - **Description** of what the codemod could not do automatically

## Automatable Codemod Log Patterns

The following codemod log messages have known-safe automated fixes. Attempt them during Phase 4:

### Select → SelectNative `label` Prop
**Log message pattern**: `The Select component now uses a 'label' prop`
**Action**: For each `<SelectNative` (or `<Select` renamed to `SelectNative`) that does NOT have a `label` prop:
1. Look for an adjacent `<label>` element or `<Label>` component targeting the same `id`.
2. If found, extract the label text and add `label="..."` prop to `<SelectNative>`.
3. If the label is dynamic (JSX expression), add `label={expression}`.
4. If no adjacent label can be identified, flag for manual review:
   `{/* REVIEW: SelectNative needs explicit label prop for accessibility */}`

### Tooltip → TooltipTrigger
**Log message pattern**: `Tooltip` / `MANUAL_CHANGE` referencing Tooltip usage
**Action**: For each `<Tooltip>` that does NOT have a `<TooltipTrigger>` child:
1. Identify the trigger element (usually the first child or the element the tooltip is attached to).
2. Wrap that element with `<TooltipTrigger>`.
3. Add import for `TooltipTrigger` from `@americanexpress/dls-react` if missing.
4. If the trigger element is ambiguous, flag for manual review:
   `{/* REVIEW: Tooltip needs a <TooltipTrigger> child — verify which element is the trigger */}`

### Tab `contentId` → `id` + `aria-labelledby`
**Log message pattern**: `contentId` / `Tab` deprecation
**Action**: For each `<Tab` element with a `contentId` prop:
1. Remove `contentId={value}`.
2. Add `id={value}` to the `<Tab>`.
3. On the corresponding `<TabPanel>`, add `aria-labelledby={value}`.
4. If the corresponding `<TabPanel>` cannot be identified, flag:
   `{/* REVIEW: Tab contentId removed — add aria-labelledby on the matching TabPanel */}`

### Spread Props on Renamed Components
**Log message pattern**: Spread props / `{...props}` on migrated components
**Action**: Do NOT auto-fix. Flag for manual review:
`{/* REVIEW: spread props on migrated component — verify no v6-only props are passed */}`

## Lingering v6 Alias Imports

After the codemod runs, some files may still import from the aliased v6 package (e.g., `dls-react6`, `dls-icons6`). These imports block alias cleanup.

### Detection
Scan all source files for imports from:
- `@americanexpress/dls-react6` or `dls-react6`
- `@americanexpress/dls-icons6` or `dls-icons6`
- Any path containing `dls-react6` or `dls-icons6`

Also scan for v6 color constant imports that reference the aliased package:
- Named imports like `dlsRed`, `dlsOrange`, `dlsOrangeBg`, `dlsGreen`, `dlsBlack`, `dlsWhite`, `dlsBrightBlue`, `dlsDeepBlue`, `dlsGray01` through `dlsGray06`, etc.
- These are typically imported from `@americanexpress/dls-react6` (the alias) or directly from `@americanexpress/dls-react` v1.x

### Action
For each lingering v6 import:
1. Check if a v7 equivalent exists in `@americanexpress/dls-react`:
   - If the import is a component that was renamed (see Component Rename Fallback table), update the import to the v7 name.
   - If the import is a color constant (e.g., `dlsRed`, `dlsOrangeBg`), these do NOT exist in v7. Flag for removal:
     `{/* REVIEW: v6 color constant import — remove and replace with v7 design token or component prop. Removing this unblocks uninstalling the dls-react6 alias. */}`
2. After flagging all v6 imports, add to the manual follow-up summary:
   - List of files still importing from v6 alias
   - Guidance: "Once these imports are resolved, run `npm uninstall @americanexpress/dls-react6 @americanexpress/dls-icons6` to remove the aliases"

## Non-Automatable Patterns

For codemod log entries that do NOT match any pattern above, add a review comment at the flagged location:
```jsx
{/* REVIEW: codemod flagged — [paste codemod log description]. Manual migration required. */}
```

Include these in the final "Manual Follow-Ups Required" summary with:
- File name and line number
- Codemod log description
- Suggested next action (if determinable from context)

## Supplemental Review Comments

Beyond what the codemod logs flag, the skill should also detect and flag these additional patterns during Phase 4:

### Heading Level Mismatches
If an element uses both a heading tag (`h1`-`h6`) and a `heading-*` class where the number differs (e.g., `<h2 className="heading-4">`), flag:
`{/* REVIEW: heading tag/class mismatch — verify intended semantic level for <Heading> migration */}`

### `<div>` Replacing Layout Components
If the codemod replaced a DLS layout component (e.g., `TabContentGroup`) with a plain `<div>`, flag:
`{/* REVIEW: layout component replaced with <div> — verify styling is preserved */}`

### dls-white / dls-black in Non-Text Contexts
If `dls-white` or `dls-black` is used on a logo, image container, or non-text element, flag specifically:
`{/* REVIEW: dls-white/dls-black on non-text element — verify v7 token or keep v6 */}`
