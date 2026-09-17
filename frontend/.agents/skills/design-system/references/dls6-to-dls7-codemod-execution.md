# Rule Set: Codemod Execution

## Objective
Execute the official DLS7 codemod in the IDE integrated terminal and capture actionable outcomes.

## Preconditions
- Run from repository root.
- Ensure working tree state is known before execution (`git status --short`).
- Perform idempotency checks before execution:
  - Inspect `package.json` for `@americanexpress/dls-react` version.
  - If `@americanexpress/dls-react` is `7.x.x`, treat codemod as already run and skip codemod execution.

## Required Command
- MUST run exactly:
  - `npx @americanexpress/dls-codemod@7`

## Execution Requirements
- MUST execute command directly in integrated terminal.
- MUST execute codemod in asynchronous terminal mode when it is not skipped.
- MUST not answer interactive terminal prompts on the user's behalf; only the user provides prompt responses.
- MUST not ask user to run commands manually.
- SHOULD capture stdout/stderr summary for migration notes.

## Post-Execution Requirements
- MUST provide:
  1. Whether codemod was executed or skipped (with skip reason)
  2. Files changed by codemod (if executed)
  3. Any warnings/errors
  4. Immediate next checks

## Breakage Guidance (Mandatory)
If breakage is reported after codemod, MUST recommend:
1. Verify changed imports and package versions first
2. Run dependency install phase
3. Run targeted compile/test to isolate failures
4. Apply minimal forward fixes instead of broad revert
