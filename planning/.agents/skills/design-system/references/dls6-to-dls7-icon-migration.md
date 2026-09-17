# Rule Set: Icon Migration Standards

## Objective
Migrate DLS6 icon usage to DLS7-compliant icon props and classes.

## Import Path Change

In v6, icons could be imported from `@americanexpress/dls-react`. In v7, icons must be imported from `@americanexpress/dls-icons` as a separate package.

```js
// v6 (deprecated)
import { IconCalendar } from '@americanexpress/dls-react';

// v7 (required)
import { IconCalendar } from '@americanexpress/dls-icons';
```

If the codemod was skipped, scan for icon imports from `@americanexpress/dls-react` and move them to `@americanexpress/dls-icons`.

## Detection Rules

Detect icon if:
- Tag starts with Icon
- OR imported from @americanexpress/dls-icons

## Migration Rules

Prefer `color` prop over class when possible.

Default color = brand.

### Class-to-`color`-prop Mapping

When an icon has a DLS6 color class in `className`, remove the class and apply the corresponding `color` prop:

| DLS6 Class       | `color` Prop Value |
|------------------|--------------------|
| dls-bright-blue  | brand              |
| dls-deep-blue    | brand-alt          |
| dls-green        | success            |
| dls-red          | critical           |
| dls-orange       | caution            |
| dls-gray-*       | neutral            |

### Valid `color` Prop Values

brand, brand-alt, caution, critical, information, success, neutral, black, white, inherit

### `isColorImportant` Prop

DLS7 icons support an `isColorImportant` prop that forces `!important` on the icon fill CSS. This may be needed when icons are rendered inside `<Surface>` contexts where the surface color would otherwise override the icon color.

Allowed sizes:
xs | sm | md | lg | xl

Remove hardcoded width/height.
Replace filled props with isFilled, and preserve the existing value.

If contrast uncertain:
{/* REVIEW: icon-contrast */}

## Prohibited Patterns
- NEVER add inline `style` attributes to icons. Use only the `color` prop with valid values listed above.
- NEVER fabricate hex codes for icon colors. If no `color` prop value matches the v6 class, keep the v6 class and flag for review.
