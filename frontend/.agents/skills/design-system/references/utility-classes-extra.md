# Extra Utility Classes — Index

All responsive breakpoint utility classes come from the `dls-max` stylesheet. This file is an index only — load the relevant sub-file for the full class list.

Classes follow the pattern `{base-class}-{breakpoint}` using these suffixes: `-min-down`, `-xs-up`, `-xs-down`, `-sm-up`, `-sm-down`, `-md-up`, `-md-down`, `-lg-up`, `-lg-down`, `-xl-up`, `-xl-down`, `-max-up`

For static (non-responsive) utilities, see [utility-classes-core.md](utility-classes-core.md).

---

## Sub-files

| Category | File | Contents |
|---|---|---|
| Responsive Borders | [utilities-borders-extra.md](utilities-borders-extra.md) | `border-`, `border-0-`, `border-dark-`, `border-dashed-`, `border-dark-dashed-` breakpoint variants |
| Responsive Display | [utilities-layout-extra.md](utilities-layout-extra.md) | `display-none-`, `display-block-`, `display-inline-`, `display-inline-block-` breakpoint variants |
| Responsive Spacing | [utilities-spacing-extra.md](utilities-spacing-extra.md) | `margin-` and `pad-` breakpoint variants (all scales and sides) |
| Responsive Visibility | [utilities-misc-extra.md](utilities-misc-extra.md) | `visible-`, `invisible-` breakpoint variants |

---

## When to load each file

- **Showing/hiding borders at specific breakpoints** → [utilities-borders-extra.md](utilities-borders-extra.md)
- **Showing/hiding elements at specific breakpoints** → [utilities-layout-extra.md](utilities-layout-extra.md)
- **Applying margin or padding at specific breakpoints** → [utilities-spacing-extra.md](utilities-spacing-extra.md)
- **Making elements visible or invisible at specific breakpoints** → [utilities-misc-extra.md](utilities-misc-extra.md)
