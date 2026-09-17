# Rule Set: Utility Class Token Migration

## Objective
Define canonical DLS6 to DLS7 utility class token mappings.

For other transformation rules, see:
- `heading-migration.md` — Heading component mappings
- `icon-migration.md` — Icon component standards
- `surface-migration.md` — Surface component and `*-bg` replacement
- `design-token-enforcement.md` — Allowed/prohibited tokens
- `deprecated-utilities.md` — Deprecated classes with no v7 alternative

## Utility Class Migration

Only replace the specific `dls-*` token inside `className`. Preserve other classes.

**If no v7 token exists for a v6 class, do NOT approximate with inline styles, fabricated hex codes, or JS workarounds. Keep the v6 class and flag for manual review.**

### Element Type Rules

**TEXT tokens** — Use for:
- Typography/content elements (p, span, div with text)
- Buttons and links
- Decorative containers
- Default choice when element type is ambiguous

**GRAPHIC tokens** — Use for:
- SVG elements
- Components starting with `Icon`
- Imported from `@americanexpress/dls-icons`

**Both TEXT and GRAPHIC** — Use when:
- Element contains both text and graphic children (apply appropriate token to each child)

### Token Mappings

dls-bright-blue  
- text → color-text-brand  
- graphic → color-graphic-brand  

dls-deep-blue  
- text → color-text-brand-alt  
- graphic → color-graphic-brand-alt  

dls-black  
- text → color-text-emphasis  
- graphic → color-graphic-emphasis  
- **Note**: `dls-black` was #000000, `color-text-emphasis` is #262626. Minor color shift.

dls-white  
- Flag for manual review. No direct v7 foundation token for white text/graphic.
  `{/* REVIEW: dls-white has no direct v7 token mapping */}`

dls-gray-01 through dls-gray-04  
- Flag for manual review. These are light grays (#f4f4f4 through #8c8c8c) with no matching v7 token.
  `{/* REVIEW: dls-gray-01..04 has no close v7 token — verify intended use */}`

dls-gray-05  
- text → color-text-subtle (approximate — was #737373, now #595959)  
- graphic → color-graphic-minimal (exact match #737373)  

dls-gray-06  
- text → color-text-subtle (exact match)  
- graphic → color-graphic-subtle (exact match)  

dls-green  
- text → color-status-text-success  
- graphic → color-status-graphic-success  

dls-red  
- text → color-status-text-critical  
- graphic → color-status-graphic-critical  

dls-orange  
- text → color-status-text-caution  
- graphic → color-status-graphic-caution  

dls-color-warning  
- text → color-status-text-critical  
- graphic → color-status-graphic-critical  

dls-color-success  
- text → color-status-text-success  
- graphic → color-status-graphic-success  

dls-color-neutral  
- text → color-status-text-neutral  
- graphic → color-status-graphic-neutral  

dls-color-moderate  
- text → color-status-text-caution  
- graphic → color-status-graphic-caution  

dls-color-attention  
- text → color-status-text-caution  
- graphic → color-status-graphic-caution  
- **Note**: `dls-color-attention` was #fdb92d (yellow), mapped to caution #b5530d (orange) — significant color shift. Add review comment:
  `{/* REVIEW: dls-color-attention was #fdb92d (yellow), mapped to caution #b5530d (orange) */}`

### Additional Valid v7 Graphic Tokens

The following v7 foundation tokens are available for graphic contexts and should be used where appropriate:
- `color-graphic-minimal` — #737373 (matches `dls-gray-05` in graphic context)
- `color-graphic-regular` — #3d3d3d (use for medium-dark graphic elements)

Remove deprecated interaction classes:
*-hvr
*-active

Append:
{/* REVIEW: interactive-state
    ACTION REQUIRED:
    1) Replace interactive states with CSS pseudo-classes (:hover, :active) or JavaScript handlers
    2) Remove this comment after migration
*/}

Do NOT convert *-bg here (see `surface-migration.md`).
