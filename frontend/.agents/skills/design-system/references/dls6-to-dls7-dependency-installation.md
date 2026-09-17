# Rule Set: Dependency Installation

## Objective
Install all required DLS7-related dependencies safely, with deterministic fallback behavior.

## Step 0: Alias Detection
Before any dependency changes, scan `package.json` for dependency alias patterns:
1. Check for `dls-react6`, `dls-react7`, `dls-icons6`, `dls-icons7` entries.
2. Report the current alias state:
   - **Scenario A (Clean v6)**: No aliases present — `dls-react` at v1.x, `dls-icons` at v1.x. Let the codemod handle upgrades in Phase 1.
   - **Scenario B (Post-codemod aliases)**: `dls-react` at v7, with `dls-react6` and/or `dls-icons6` aliases pointing to v1.x. Codemod has already run. Verify whether v6 aliases are still needed or can be removed.
   - **Scenario C (Reverse aliases)**: `dls-react` at v1.x, with `dls-react7` and/or `dls-icons7` aliases pointing to v7. Detect and report — running the codemod on top of this state would create duplicate v7 references. Flag for manual resolution.
3. Report detected scenario before proceeding.

## Step 1: Evaluate `@americanexpress/dls`
1. Inspect `package.json` for `@americanexpress/dls`.
2. If present, determine whether it is actually needed:
   - Check if any source files import from `@americanexpress/dls` (CSS module imports, direct references).
   - If no source files import from it, recommend removal: `npm uninstall @americanexpress/dls`
   - If source files do import from it, run: `npm install @americanexpress/dls@latest`
3. MUST wait for completion before next step.

## Step 2: Upgrade `dls-react` and `dls-icons`
1. Check if `@americanexpress/dls-react` is already at v7. If not, run:
   - `npm install @americanexpress/dls-react@7`
2. Check if `@americanexpress/dls-icons` is already at v7. If not, run:
   - `npm install @americanexpress/dls-icons@7`
3. This step is critical when the codemod (Phase 1) was skipped.

## Step 3: One App Bundler Upgrade (Conditional)
1. Inspect `package.json` dependencies for `@americanexpress/one-app-bundler`.
2. If present, project is treated as One App and MUST run:
   - `npm install @americanexpress/one-app-bundler@latest`
   - **Note**: Minimum required version is `@americanexpress/one-app-bundler@^7.0.6` per the official migration guide.
3. If not present, MUST skip this step and state skip reason.

## Step 4: Install Project Dependencies
1. MUST run:
   - `npm install`
2. If install fails, MAY retry once with:
   - `npm install --legacy-peer-deps`
3. MUST report which install path succeeded.

## Step 5: Detect Static Asset Usage
1. Inspect `tsconfig.json` for path aliases.
2. If alias usage exists for `node_modules/@americanexpress/static-assets`, search entire codebase for those alias imports.
3. If no alias usage is detected, search entire codebase for `node_modules/@americanexpress/static-assets` imports/usages.
4. If matches found:
   - MUST list affected files
   - MUST run `npm install axp-static-assets`
5. If no matches found:
   - MUST skip install and state skip reason explicitly.

## Step 6: Post-Migration Alias Cleanup
After all migration phases are complete:
1. Check `package.json` for remaining v6 aliases (`dls-react6`, `dls-icons6`).
2. If migration is fully complete and no source files reference the aliases, remove them:
   - `npm uninstall dls-react6 dls-icons6`
3. Also check for and remove any reverse aliases (`dls-react7`, `dls-icons7`) that are no longer needed.

## Constraints
- MUST execute commands directly.
- MUST keep edits minimal and scoped.
- MUST avoid creating unrelated files.

## Required Output
MUST summarize:
1. Commands executed
2. Files modified
3. Issues encountered and resolution path
