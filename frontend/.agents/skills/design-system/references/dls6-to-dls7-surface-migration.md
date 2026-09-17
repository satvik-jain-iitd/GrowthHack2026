# Rule Set: Surface Migration Rules

## Objective
Replace `*-bg` utility classes with the DLS7 `<Surface>` component.

## Import

Ensure:
```js
import { Surface } from '@americanexpress/dls-react';
```

## Mappings

- dls-bright-blue-bg → `<Surface variant="fg-brand">`
- dls-deep-blue-bg → `<Surface variant="fg-brand-alt">`
- dls-white-bg → `<Surface variant="foreground">`
- dls-gray-01-bg → `<Surface variant="base">`
- dls-gray-02-bg → `<Surface variant="fg-subtle">`
- dls-gray-03-bg through dls-gray-06-bg → Flag for manual review. No Surface variant matches dark gray backgrounds.
  `{/* REVIEW: dls-gray-0X-bg has no matching Surface variant — verify intended use */}`

## Rules

Remove bg token from className after wrapping with `<Surface>`.

**If no Surface variant matches the v6 background class, do NOT approximate with inline styles or fabricated hex codes. Keep the v6 class and flag for manual review.**
