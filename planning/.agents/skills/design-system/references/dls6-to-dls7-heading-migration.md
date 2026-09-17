# Rule Set: Heading Migration

## Objective
Replace native heading elements and `heading-*` classes with the DLS7 `<Heading>` component.

## Migrating Headings to `<Heading>`

Replace native `h1`, `h2`, `h3`, `h4` and any element using `heading-*`
classes with `<Heading>`.

### General Rules

-   Preserve inner text.
-   Preserve all attributes (`className`, `id`, `data-*`, `aria-*`,
    etc.).
-   Do not modify surrounding markup.
-   Do not modify custom React components.
-   Leave unchanged if no rule matches.
-   Remove matched `heading-*` classes after conversion.
-   If `<Heading>` is already used in the file, check if there's any error indication missing props (e.g. level, variant) and fix accordingly.
-   Add import if missing:

``` js
import { Heading } from '@americanexpress/dls-react';
```

------------------------------------------------------------------------

## Mapping Rules

-   `h1` → `<Heading level={1} variant="sans-large-book">`

-   `heading-1` → No v7 variant matches its 13px/600/uppercase style. Flag for manual review:
    `{/* REVIEW: heading-1-migration */}`

-   `h2.heading-2` → `<Heading level={2} variant="sans-xsmall-regular">`
    `{/* REVIEW: heading-2 was 15px/600, mapped to closest 16px/400 */}`

-   `h3.heading-3` → `<Heading level={3} variant="sans-xsmall-bold">`

-   `h4.heading-4` → `<Heading level={4} variant="sans-small-regular">`

-   `h2` (without `.heading-2`) →
    `<Heading level={2} variant="sans-medium-regular">`

-   `heading-4-g` → `<Heading level={4} variant="serif-medium-bold">`

-   `heading-5` → `<Heading level={5} variant="sans-large-book">`

-   `heading-5-g` → `<Heading level={5} variant="serif-large-regular">`

-   `heading-6` → `<Heading level={6} variant="sans-xlarge-book">`

-   `heading-6-g` → `<Heading level={6} variant="serif-xlarge-regular">`
    `{/* REVIEW: heading-6-g was 38px in v6, mapped to closest 36px serif-xlarge-regular */}`

-   `heading-7-g` → No v7 `<Heading>` variant matches its 48px/60px style, and `level={7}` is invalid (max 6). Flag for manual review:
    `{/* REVIEW: heading-7-g-migration */}`

------------------------------------------------------------------------

## Font Weight Handling

-   If `font-weight-bold` exists:
    -   Remove it.
    -   Use corresponding `*-bold` variant.
-   If bold styling required:
    -   Use appropriate `*-bold` variant.
-   **Note**: All variants have bold equivalents. Replace `-regular`, `-book` with `-bold` suffix.
