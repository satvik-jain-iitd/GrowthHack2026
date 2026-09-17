# Filter Component Reference

> AI agent-friendly reference for DLS Filter component

## Quick Reference

Filters allow users to dynamically filter data/content. Two variations: FilterMenu (icon button with dropdown) and FilterPersistent (always-visible panel).

## Import

```tsx
import { FilterMenu, FilterPersistent } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
<FilterMenu id="filters" filtersAppliedCount={0}>
  <CheckboxGroup legend="Categories">
    <Checkbox id="cat1" label="Category 1" />
    <Checkbox id="cat2" label="Category 2" />
  </CheckboxGroup>
</FilterMenu>
```

## Props API

### FilterMenu Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier |
| children | ReactNode | Yes | - | Filter controls (CheckboxGroup, RadioGroup, etc.) |
| filtersAppliedCount | number | | - | Number of active filters (shows badge) |
| showMenu | boolean | | - | Controlled menu visibility |
| defaultShowMenu | boolean | | false | Default menu visibility (uncontrolled) |
| menuStyles | CSSProperties | | - | Custom styles for menu |
| labelOverrides | object | | - | Custom labels for internationalization |
| onApplyButtonClick | (event: MouseEvent<HTMLButtonElement>) => void | | - | Apply button handler |
| onResetButtonClick | (event: MouseEvent<HTMLButtonElement>) => void | | - | Reset button handler |
| onFilterButtonClick | (event: MouseEvent<HTMLButtonElement>) => void | | - | Filter icon button click handler |
| onCloseButtonClick | (event: MouseEvent<HTMLButtonElement>) => void | | - | Close button handler |
| onMenuClose | () => void | | - | Menu close handler |
| iconButtonOtherProps | object | | - | Additional props for the IconButton trigger |
| badgeProps | object | | - | Additional props for the badge |
| closeButtonProps | object | | - | Additional props for the close button |
| closeButtonRef | MutableRefObject<HTMLButtonElement \| null> | | - | Ref for the close button |
| resetButtonProps | object | | - | Additional props for the reset button |
| applyButtonProps | object | | - | Additional props for the apply button |
| showResetButton | boolean | | true | Show reset button (default applied in FilterPersistent) |
| showApplyButton | boolean | | true | Show apply button (default applied in FilterPersistent) |

### FilterPersistent Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier |
| children | ReactNode | Yes | - | Filter controls |
| closeButton | ReactElement | | - | Close button element (injected by FilterMenu; don't pass manually) |
| showResetButton | boolean | | true | Show reset button |
| showApplyButton | boolean | | true | Show apply button |
| labelOverrides | object | | - | Custom labels (`applyButtonLabel`, `resetButtonLabel`, `menuHeadingLabel`, `filterButtonScreenReaderLabel`, `badgeScreenReaderLabel`) |
| onApplyButtonClick | (event: MouseEvent<HTMLButtonElement>) => void | | - | Apply handler |
| onResetButtonClick | (event: MouseEvent<HTMLButtonElement>) => void | | - | Reset handler |
| menuStyles | CSSProperties | | - | Custom styles for menu |
| resetButtonProps | object | | - | Additional props for the reset button |
| applyButtonProps | object | | - | Additional props for the apply button |

## Common Patterns

### Filter Menu with Badge
```tsx
<FilterMenu id="filter" filtersAppliedCount={3}>
  <CheckboxGroup legend="Options">
    <Checkbox id="opt1" label="Option 1" />
    <Checkbox id="opt2" label="Option 2" />
  </CheckboxGroup>
</FilterMenu>
```

### Single Select Filter
```tsx
<FilterPersistent id="filter">
  <RadioGroup legend="Sort by">
    <RadioButton id="newest" label="Newest" name="sort" />
    <RadioButton id="oldest" label="Oldest" name="sort" />
  </RadioGroup>
</FilterPersistent>
```

### Multi-Group Filter
```tsx
<FilterPersistent id="filter">
  <CheckboxGroup legend="Category">
    <Checkbox id="cat1" label="Electronics" />
    <Checkbox id="cat2" label="Clothing" />
  </CheckboxGroup>
  <CheckboxGroup legend="Price Range">
    <Checkbox id="price1" label="$0-$50" />
    <Checkbox id="price2" label="$50-$100" />
  </CheckboxGroup>
</FilterPersistent>
```

## Accessibility Requirements

**Required:**
- Provide visible labels for all filter options
- Group related filters with fieldset/legend
- Ensure keyboard accessibility
- Announce changes to assistive technology

**Recommended:**
- Use clear, descriptive labels
- Arrange values logically
- Use scrollbars for long lists

## Anti-Patterns

**Never:**
- Overwhelm users with excessive options
- Use confusing labels
- Make filters the only way to view essential content
- Use when dataset is too small to need filtering

## Best Practices

- Use for narrowing down large datasets
- Keep filter options relevant to displayed data
- Show count of applied filters
- Use icons that are simple and well-known
- Provide clear call-to-action buttons
- Update content dynamically when filters change

## Related Components

- [Checkbox](checkbox.md) - For multi-select filters
- [Radio](radio.md) - For single-select filters
- [Search](search.md) - For text-based filtering
- [Tag](tag.md) - For showing active filters
