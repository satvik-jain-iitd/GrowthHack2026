# Rule Set: Deprecated Utilities — Automatic Flagging

## Objective
Flag deprecated DLS6 utility classes that have NO direct v7 alternative.

## Rule (DLS-UTIL-DEPRECATED-001)

For any element whose `className` contains any of the classes listed below, perform the following automated edit **and** add a review comment on the same line:

1. Remove the deprecated utility class from `className` (preserve other classes). Normalize whitespace after removal (collapse multiple spaces into one).
2. Add this exact review message using JSX comment syntax on the same line immediately after the element closing `>`:
  ```jsx
  {/* Review: Deprecated Please Remove And Replace With Some Alternatives. */}
  ```
3. Do **NOT** attempt to automatically replace with another token or Surface — this requires developer judgement.
4. Do **NOT** delete related imports automatically; flag for manual cleanup.
5. Require manual developer review and replacement.

## Classes to Flag

- dls-light-blue
- dls-light-blue-bg
- dls-light-blue-bg-hvr:hover
- dls-bright-blue-hover
- dls-bright-blue-hover-bg
- dls-bright-blue-hover-bg-hvr:hover
- dls-bright-blue-active
- dls-bright-blue-active-bg
- dls-bright-blue-active-bg-hvr:hover
- dls-white-bg-hvr:hover
- dls-black-bg
- dls-black-bg-hvr:hover
- dls-gray-01-bg-hvr:hover
- dls-gray-02-bg-hvr:hover
- dls-gray-03-bg-hvr:hover
- dls-gray-04-bg-hvr:hover
- dls-gray-05-bg-hvr:hover
- dls-gray-06-bg-hvr:hover
- dls-green-bg
- dls-green-bg-hvr:hover
- dls-red-bg
- dls-red-bg-hvr:hover
- dls-orange-bg
- dls-orange-bg-hvr:hover
- dls-color-warning-bg
- dls-color-warning-bg-hvr:hover
- dls-color-success-bg
- dls-color-success-bg-hvr:hover
- dls-color-neutral-bg
- dls-color-neutral-bg-hvr:hover
- dls-color-moderate-bg
- dls-color-moderate-bg-hvr:hover
- dls-color-attention-bg
- dls-color-attention-bg-hvr:hover
- All `dls-card-*` (except dls-card-platinum which maps to dls-themes)
  - dls-card-blue
  - dls-card-blue-bg
  - dls-card-everyday
  - dls-card-everyday-bg
  - dls-card-cobrand
  - dls-card-cobrand-bg
  - dls-card-spg
  - dls-card-spg-bg
  - dls-card-green
  - dls-card-green-bg
  - dls-card-gold
  - dls-card-gold-bg
  - dls-card-plum
  - dls-card-plum-bg
  - dls-card-general
  - dls-card-general-bg
  - dls-card-centurion
  - dls-card-centurion-bg
- dls-cobrand-*
  - dls-cobrand-default
  - dls-cobrand-default-bg
- dls-offers-*
  - dls-offers-yellow
  - dls-offers-yellow-bg
  - dls-offers-dark-blue
  - dls-offers-dark-blue-bg
  - dls-offers-bright-blue
  - dls-offers-bright-blue-bg
- dls-cobrand-delta
- dls-cobrand-bonvoy
- dls-cobrand-bluesky
- dls-cobrand-hilton
- dls-cobrand-lowes
- dls-cobrand-schwab
- dls-cobrand-plenti
- dls-cobrand-plum
- dls-cobrand-amazon

## Example Transformation

Before:
```jsx
<div className="foo dls-light-blue bar">
```

After:
```jsx
<div className="foo bar"> {/* Review: Deprecated Please Remove And Replace With Some Alternatives. */}
```

## Notes for Reviewers
- These classes were marked *Deprecated* in the v6→v7 mapping and no clear v7 replacement was provided in the mapping table.
- The dev team must decide replacement strategies: use design tokens, Surface, component props, or remove the visual affordance entirely.
- If a deprecated class *does* have a valid replacement discovered later, update the codemod rules and remove it from this list.
