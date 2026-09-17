# Rule Set: Import Migration

## Objective
Migrate static asset imports and DLS stylesheet imports to DLS7-compatible paths.

## Scoped Search Requirement
Before search, MUST ask user:
- "Which files or folders should it search within?"

Proceed only after scope is provided.

## Static Asset Import Rules
1. Determine whether project uses alias pathing from `tsconfig.json`.
2. Search scoped files for:
   - Alias usage resolving to `node_modules/@americanexpress/static-assets`, or
   - Direct `node_modules/@americanexpress/static-assets` usage if no alias pattern is active.
3. For each match:
   - Resolve corresponding file under `node_modules/axp-static-assets/dist/img`
   - Replace import with resolved new path
   - If alias format is used by project, MUST preserve alias style in replacement.

## Ambiguity Handling
If multiple candidate files or no candidate:
- MUST NOT auto-change.
- MUST list under "manual followups".

## Stylesheet Import Rules (Global)
Search entire codebase for imports from:
- `@americanexpress/dls/dist`

Replace with:
- `@americanexpress/dls/dist/styles/stylesheets/dls-core.min.css`

## HTML Asset Reference Rules
1. Search for stylesheet links (`<link ... href="...">`) that include `@americanexpress/dls/`.
2. Replace matching `href` value dynamically:
   - Read the installed `@americanexpress/dls` version from `package.json` or `node_modules/@americanexpress/dls/package.json`.
   - Construct the URL: `https://www.aexp-static.com/cdaas/dls/packages/@americanexpress/dls/{VERSION}/stylesheets/dls-core.min.css`
   - Alternatively, use the `dlsCoreStylesheetUrl` export from `@americanexpress/dls-react` if available.
3. Search for script tags (`<script ... src="...">`) that include `@americanexpress/dls/`.
4. Remove those matching script tags entirely.

## Change Approval and Application
Before applying edits, MUST provide:
1. List of files to be modified
2. Unified diff of proposed changes

After confirmation, apply only import-line changes.

## Constraints
- MUST not modify unrelated code.
- MUST keep changes minimal.
- MUST not create new source files as part of import migration.
