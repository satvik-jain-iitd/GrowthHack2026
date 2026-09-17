# Rule Set: Design Token Enforcement

## Objective
Enforce DLS7 design token usage and prohibit deprecated patterns.

## Allowed Tokens

```
.color-text-*
.color-border-*
.color-graphic-*        (includes color-graphic-minimal, color-graphic-regular, etc.)
.color-status-*
.color-surface-bg
.color-graphic-data-viz-*
```

**Notable graphic tokens**: `color-graphic-minimal` (#737373) and `color-graphic-regular` (#3d3d3d) are valid v7 foundation tokens available for graphic contexts. See `utility-class-migration.md` for where they apply.

## Prohibited Patterns

- Raw hex colors (e.g., `#f26122`, `#d32f2f`) — NEVER fabricate or hardcode hex/RGB values
- Inline styles for color — NEVER add `style={{ backgroundColor: '...' }}` or any inline style object
- CSS-in-JS style objects — NEVER create JS objects mapping to color values (e.g., `const STATUS_STYLES = { warning: { backgroundColor: '...' } }`)
- var(--*) references
- Deprecated dls-* classes

**If no v7 token or component prop exists for a v6 color or style, do NOT invent a workaround.** Instead:
1. Keep the v6 class/component intact, OR
2. Flag for manual review:
```jsx
{/* REVIEW: no v7 token — keeping v6, verify replacement */}
```

If unsure:
```jsx
{/* REVIEW: token-mapping */}
```
