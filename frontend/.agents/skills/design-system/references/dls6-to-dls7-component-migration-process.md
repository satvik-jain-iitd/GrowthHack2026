# Rule Set: Component and Utility Migration Process

## Objective
Apply DLS7 component and utility transformations safely within user-approved scope.

## Source Rule Files
Before changes, MUST read the transformation canon:
1. `utility-class-migration.md` (utility token mappings)
2. `heading-migration.md` (heading component rules)
3. `icon-migration.md` (icon standards)
4. `surface-migration.md` (surface/bg rules)
5. `design-token-enforcement.md` (allowed/prohibited tokens)
6. `deprecated-utilities.md` (auto-flag deprecated classes)
7. `codemod-log-automation.md` (automatable codemod log patterns, v6 alias flagging)
8. `dls-codemod-logs/consolidated.log` (if present)

## Scope Gate (Mandatory)
Before edits, MUST ask user:
- "Which files or folders should I apply these migration rules to?"

After scope is given:
- MUST restrict edits to specified files/folders only.
- MUST skip test files.

## Execution Requirements
- MUST apply only explicit rule-driven changes.
- MUST preserve surrounding markup, attributes, and behavior unless rule requires change.
- MUST not edit unrelated code.
- If rule ambiguity exists, MUST ask user before proceeding.

## Required Post-Processing Output
MUST provide:
1. Modified file list
2. Unified diffs
3. Rules not auto-applied
4. Manual followups identified from codemod logs or ambiguity
