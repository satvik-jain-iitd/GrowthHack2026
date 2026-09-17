# DLS6 to DLS7 Migration Workflow

This file contains the full DLS v6 to DLS v7 migration workflow, including phased instructions, transformation rules, and validation checklist. Follow this workflow when a user accepts the migration offer from Step 6 of the design-system skill.


# DLS6 to DLS7 Migration

## Overview
This skill drives a complete, phased migration from DLS v6 to DLS v7. It follows the official DLS6 to DLS7 migration guide and applies the official codemod, updates dependencies, fixes import paths, and transforms components and utility classes according to canonical DLS7 rules. All transformations are scoped, minimal, and traceable.

If any process rule conflicts with the transformation canon, the canon files win for code transformation behavior.

## When to Use
- Migrating all or part of a frontend codebase from DLS6 to DLS7
- Updating DLS package versions and stylesheet import paths
- Replacing deprecated DLS utility classes and component usage

Do not use this skill for unrelated refactors.

## Key Concepts

### Non-Negotiable Constraints
- Run commands yourself in the IDE integrated terminal.
- Run the Phase 1 codemod command in asynchronous terminal mode.
- Do not answer interactive terminal prompts on the user's behalf; only the user provides prompt responses.
- Keep edits minimal and scoped.
- Never modify files outside the user-approved scope for scoped phases.
- Skip test files for component and utility migration phase.
- Do not auto-resolve ambiguous mappings; flag them for manual follow-up.
- Do not change unrelated code or formatting.
- Do not rely on prompt wording when rules already define procedure.

### Absolute Prohibitions
These rules override all other migration logic. Violating any of them is a critical error.

1. **NEVER write inline styles.** Do not add `style={{ }}` attributes, CSS-in-JS objects, or any inline style properties (e.g., `backgroundColor`, `color`, `border`) to any element. If a v7 token, prop, or utility class cannot express the desired visual, flag the element for manual review instead. Do not approximate styling with inline workarounds.
2. **NEVER invent color values.** Do not fabricate hex codes, RGB values, or any color literal. Only use official DLS v7 design tokens, component props, or utility classes documented in the reference files. If no v7 token or prop exists for a v6 color, flag for manual review.
3. **NEVER approximate with custom code when the v7 API is incomplete.** If a DLS v6 component, prop, or utility class has no clear v7 equivalent, keep the v6 version in place and add a `{/* REVIEW */}` comment. Do not invent wrapper components, helper objects, or JS logic to mimic the v6 behavior.
4. **Defer to v6 when v7 cannot be used properly.** If a component's v7 API does not support the same feature set (e.g., status-based color variants on Badge), leave the v6 import and usage intact rather than downgrading to a broken v7 implementation. Flag with `{/* REVIEW: no v7 equivalent — keeping v6 */}`.

### Required Interaction Points
Ask the user before each scoped search/transform phase:
1. Import-fix scope:
   - Ask: "Which files or folders should it search within?"
2. Rule-based migration scope:
   - Ask: "Which files or folders should I apply these migration rules to?"

Do not proceed with those phases until the user provides scope.

### Quality Bar
A migration is complete only when:
- Required dependency upgrades are installed
- Import paths are updated
- Rule-based transformations are applied within scope
- Manual follow-ups are clearly documented
- Validation checks pass or failures are explicitly explained with next actions

## Instructions

### Phase 0: Baseline and Safety
1. Confirm repository root and branch.
2. Check for uncommitted changes and report them.
3. Record baseline status:
   - `git status --short`
   - Optional: targeted tests/build command if user wants baseline verification.

### Phase 1: Run Official Codemod
Before running codemod, perform idempotency and alias detection checks:
1. Inspect `package.json` for `@americanexpress/dls-react` version.
2. Check whether repository root contains `dls-codemod-logs/`.
3. Scan `package.json` for dependency alias patterns (`dls-react6`, `dls-react7`, `dls-icons6`, `dls-icons7`) and report the alias state (see `dls6-to-dls7-dependency-installation.md` Step 0 for scenarios A/B/C).
4. If either condition is true, treat codemod as already run and skip Phase 1 execution:
   - `@americanexpress/dls-react` is `7.x.x`
   - `dls-codemod-logs/` directory exists

If both checks indicate codemod has not run yet, start it in integrated terminal asynchronous mode and let the user answer any interactive prompts:
- `npx @americanexpress/dls-codemod@7`

After codemod run (or skip decision):
- Capture and summarize changed files (or report skipped with reason).
- Note any codemod warnings/errors.
- Keep codemod output logs for manual follow-up tracking.

### Phase 2: Install/Update Dependencies
Follow the full procedure in `references/dependency-installation.md`. Key steps:
1. Run alias detection (Step 0) — report Scenario A/B/C.
2. Evaluate whether `@americanexpress/dls` is needed. If no source files import from it, recommend removal. Otherwise upgrade.
3. Ensure `@americanexpress/dls-react` and `@americanexpress/dls-icons` are at v7. Run `npm install @americanexpress/dls-react@7 @americanexpress/dls-icons@7` if not already upgraded. This is critical when the codemod is skipped.
4. If the project uses `@americanexpress/one-app-bundler`, upgrade it (minimum `@^7.0.6` per official guide).
5. Run `npm install` (fallback: `npm install --legacy-peer-deps`).
6. Detect and handle static asset usage.

### Phase 3: Fix Imports
Use user-provided scope.

#### 3A. Static asset imports
1. Detect import usage pattern (alias-based or `node_modules/@americanexpress/static-assets`).
2. For each match, resolve corresponding file in:
   - `node_modules/axp-static-assets/dist/img`
3. Replace import path with matching new path.
4. If multiple candidates or no candidate:
   - Do not auto-change.
   - Add to "manual followups".

#### 3B. DLS stylesheet imports
Search entire codebase for imports from:
- `@americanexpress/dls/dist`

Replace with:
- `@americanexpress/dls/dist/styles/stylesheets/dls-core.min.css`

Also handle HTML asset references:
1. Search for stylesheet links (`<link ... href="...">`) that include `@americanexpress/dls/`.
2. Replace matching `href` value dynamically:
   - Read the installed `@americanexpress/dls` version from `package.json` or `node_modules/@americanexpress/dls/package.json`.
   - Construct the URL: `https://www.aexp-static.com/cdaas/dls/packages/@americanexpress/dls/{VERSION}/stylesheets/dls-core.min.css`
   - Alternatively, use the `dlsCoreStylesheetUrl` export from `@americanexpress/dls-react` if available.
3. Search for script tags (`<script ... src="...">`) that include `@americanexpress/dls/`.
4. Remove those matching script tags.

Before applying edits:
- Show list of files to be modified.
- Show unified diff.
- Ask for confirmation if your workflow requires explicit approval.

### Phase 4: Component and Utility Migration
Use user-provided scope and skip test files.

**Before applying any transformation**, re-read the Absolute Prohibitions above. Every edit must pass this checklist:
- Does the edit introduce an inline `style` attribute? → **Reject.** Flag for manual review instead.
- Does the edit contain a hex code, RGB value, or any invented color literal? → **Reject.** Use a v7 token or flag.
- Does the edit approximate v6 behavior with custom JS/CSS? → **Reject.** Keep v6 and flag.

1. Read process rules in `references/` and all transformation canon files (`dls6-to-dls7-heading-migration.md`, `dls6-to-dls7-utility-class-migration.md`, `dls6-to-dls7-icon-migration.md`, `dls6-to-dls7-surface-migration.md`, `dls6-to-dls7-design-token-enforcement.md`, `dls6-to-dls7-deprecated-utilities.md`, `dls6-to-dls7-codemod-log-automation.md`).
2. Read `dls-codemod-logs/consolidated.log` and prioritize flagged files in scope.
3. For each codemod log entry in scope, check against the automatable patterns in `dls6-to-dls7-codemod-log-automation.md`:
   - **Select `label` prop**: Attempt to add `label` prop to `<SelectNative>` from adjacent labels.
   - **Tooltip → TooltipTrigger**: Wrap trigger elements with `<TooltipTrigger>`.
   - **Tab `contentId`**: Replace with `id` + `aria-labelledby` pattern.
   - **Spread props**: Flag for manual review (never auto-fix).
   - **Non-matching entries**: Add a review comment with the codemod log description.
4. Apply rules exactly:
   - Heading migration to `<Heading>` with correct level/variant mapping
   - Font-weight to bold-variant handling
   - Utility token migration (text vs graphic token mapping)
   - Interaction class cleanup with required review comment block
   - Icon migration standards (`color`, `isFilled`, size constraints, remove hardcoded width/height, import path change)
   - Surface migration for `*-bg` mappings with `<Surface>`
   - Design token enforcement and prohibited style cleanup
   - Deprecated utility automatic flagging rule with exact review comment text
   - Component rename fallback (see below)
5. Scan for lingering v6 alias imports (see `dls6-to-dls7-codemod-log-automation.md`):
   - Detect imports from `dls-react6`, `dls-icons6`, or v6 color constants (`dlsRed`, `dlsOrangeBg`, etc.).
   - Flag each with a review comment explaining the import blocks alias cleanup.
   - Add to manual follow-ups: "Once resolved, run `npm uninstall @americanexpress/dls-react6 @americanexpress/dls-icons6`"
6. Preserve all non-target behavior, attributes, and surrounding markup.

#### Component Rename Fallback
If the codemod was skipped, v6 component names may still be in use with v7 packages. Scan for the following v6 component names imported from `@americanexpress/dls-react` and either auto-rename or flag them:

| v6 Component        | v7 Replacement                          |
|---------------------|-----------------------------------------|
| Alert               | ComponentLevelNotification              |
| ButtonPrimary       | `<Button variant="primary">`           |
| ButtonSecondary     | `<Button variant="secondary">`         |
| ButtonTertiary      | `<Button variant="tertiary">`          |
| Anchor              | Link                                    |
| Select              | SelectNative                            |
| TabContent          | TabPanel                                |
| TabGroup            | Tabs                                    |
| TabMenu             | TabList                                 |
| LocaleProvider      | DesignSystemProvider                    |

For `ButtonPrimary`/`ButtonSecondary`/`ButtonTertiary`, the component name changes to `Button` and the variant is passed as a prop. For all others, rename the import and JSX usage.

If a v6 component name is detected but no mapping exists above, flag it:
`{/* REVIEW: v6-component-rename — verify v7 equivalent */}`

After applying:
- Show modified file list.
- Show unified diffs.
- List rules that could not be applied automatically.
- List manual follow-ups (include both codemod-log-driven items and supplemental findings).
- List lingering v6 alias imports with guidance for removal.

### Validation Checklist
Run these checks after migration (or equivalent project commands):
1. Install health:
   - `npm install` exits successfully.
2. Type/lint checks:
   - `npm run lint` (if available)
   - `npm run typecheck` (if available)
3. Tests/build smoke:
   - `npm test -- --watch=false` (if available)
   - `npm run build` (if available)

If a command is missing, report it as "not configured" and continue with available checks.

### Output Contract (Always Provide)
At the end, provide:
1. Commands executed (in order)
2. Files modified
3. Unified diff summary (key hunks)
4. Manual follow-ups
5. Issues encountered and how they were handled
6. Validation results

### If Something Breaks
Use this recovery sequence:
1. Identify failing area (install, compile, test, runtime, styling).
2. Inspect recent diffs for that area and isolate minimal suspect changes.
3. Re-check DLS stylesheet import path:
   - `@americanexpress/dls/dist/styles/stylesheets/dls-core.min.css`
4. Re-run install using:
   - `npm install`
   - fallback once: `npm install --legacy-peer-deps`
5. Revisit ambiguous mappings flagged in manual follow-ups.
6. Roll forward with targeted fixes (preferred) instead of broad reverts.
7. If still blocked, share:
   - exact error
   - affected file(s)
   - suspected migration rule
   - recommended manual patch options

## Reference

Rules must be read in this exact order before executing any phase:

### Process & Execution
1. See [Codemod Execution](../references/dls6-to-dls7-codemod-execution.md) for codemod idempotency, async execution, and post-run requirements.
2. See [Dependency Installation](../references/dls6-to-dls7-dependency-installation.md) for DLS, One App bundler, and static asset install rules.
3. See [Import Migration](../references/dls6-to-dls7-import-migration.md) for stylesheet and static asset import replacement rules.
4. See [Component Migration Process](../references/dls6-to-dls7-component-migration-process.md) for scoping, execution, and output requirements.

### Transformation Canon
5. See [Heading Migration](../references/dls6-to-dls7-heading-migration.md) for `<Heading>` level and variant mappings.
6. See [Utility Class Migration](../references/dls6-to-dls7-utility-class-migration.md) for DLS6→DLS7 token mappings and interaction class cleanup.
7. See [Icon Migration](../references/dls6-to-dls7-icon-migration.md) for icon prop standards, import path change, color-prop mapping, and contrast review rules.
8. See [Surface Migration](../references/dls6-to-dls7-surface-migration.md) for `*-bg` class replacement with `<Surface>`.
9. See [Design Token Enforcement](../references/dls6-to-dls7-design-token-enforcement.md) for allowed tokens and prohibited patterns.
10. See [Deprecated Utilities](../references/dls6-to-dls7-deprecated-utilities.md) for classes with no v7 alternative that require manual review.
11. See [Codemod Log Automation](../references/dls6-to-dls7-codemod-log-automation.md) for automatable codemod log patterns, v6 alias import flagging, and supplemental review rules.
12. See `dls-codemod-logs/consolidated.log` (if present) for files flagged by the official codemod.
13. See the Component Rename Fallback table in Phase 4 for v6→v7 component name mappings when the codemod is skipped.
