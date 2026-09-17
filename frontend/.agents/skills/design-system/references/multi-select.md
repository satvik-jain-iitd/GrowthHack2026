# MultiSelect Component Reference
> AI agent-friendly reference for DLS MultiSelect component

## Quick Reference
MultiSelect allows users to select multiple items from a dropdown list of 5 or more options. For fewer than 5 options, consider using checkboxes. Optionally supports dismissible tags for quick deselection.

## Import
```tsx
import { MultiSelect, MultiSelectOption } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<MultiSelect label="Select Group Label" hint="Hint text" id="multi-select">
  <MultiSelectOption value="option-1">Ending in 8673</MultiSelectOption>
  <MultiSelectOption value="option-2">Ending in 6524</MultiSelectOption>
  <MultiSelectOption value="option-3">Ending in 9865</MultiSelectOption>
</MultiSelect>
```

## Props API

### MultiSelect
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier |
| label | string | No | - | Visible label text |
| hint | string | - | - | Helper text |
| selectedValues | Array<string \| number> | - | - | Controlled selected values |
| defaultSelectedValues | Array<string \| number> | - | - | Initial selected values |
| isOpen | boolean | - | - | Controlled open state |
| defaultIsOpen | boolean | - | false | Initial open state |
| isDismissible | boolean | - | false | Shows dismissible tags |
| disabled | boolean | - | - | @deprecated Disables multiselect |
| aria-disabled | boolean \| string | - | - | Accessible disabled state |
| aria-describedby | string | - | - | ID of description element |
| aria-labelledby | string | - | - | ID of label element |
| status | 'default' \| 'error' | - | 'default' | Visual status |
| isHintVisuallyHidden | boolean | - | - | Hides hint visually |
| onIsOpenChange | (isOpen: boolean) => void | - | - | Called when dropdown opens/closes |
| onSelectedValuesChange | (value, isSelected) => void | - | - | Called when selection changes (controlled) |
| onOptionClick | (event) => void | - | - | Called when option clicked |
| onTriggerKeyDown | (event) => void | - | - | Keyboard handler for trigger |
| children | ReactNode | Yes | - | MultiSelectOption components |
| positionStrategy | 'absolute' \| 'fixed' | No | 'fixed' | Positioning strategy for dropdown |
| labelOverrides | object | - | - | Custom accessible labels |

### MultiSelectOption
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string \| number | Yes | - | Option value |
| children | ReactNode | Yes | - | Option display text |
| disabled | boolean | - | - | @deprecated Disables option |
| aria-disabled | boolean \| string | - | - | Disabled state |
| aria-invalid | boolean \| string | - | - | Invalid state |
| tagProps | object | - | - | Props for dismissible tag |
| id | string | - | - | Unique identifier for the option (used for accessibility) |
| aria-selected | boolean \| string | - | - | Indicates if the option is selected (for accessibility) |
| onKeyDown | (event) => void | - | - | Keyboard handler for option |
| onSelectOptionClick | (event) => void | - | - | Called when option is clicked |
| name | string | - | - | Name attribute for the option, useful when used within a form |

## Common Patterns

### Basic MultiSelect
```tsx
<MultiSelect label="Select benefits" hint="Hint text" id="multi-select">
  <MultiSelectOption value="1">Entertainment</MultiSelectOption>
  <MultiSelectOption value="2">Restaurants</MultiSelectOption>
  <MultiSelectOption value="3">Grocery</MultiSelectOption>
  <MultiSelectOption value="4">Transit</MultiSelectOption>
  <MultiSelectOption value="5">Travel</MultiSelectOption>
</MultiSelect>
```

### With Dismissible Tags
```tsx
<MultiSelect
  label="Select benefits"
  hint="Hint text"
  id="multi-select"
  isDismissible={true}
  defaultSelectedValues={[1, 2, 3]}
>
  <MultiSelectOption value={1}>Entertainment</MultiSelectOption>
  <MultiSelectOption value={2}>Restaurants</MultiSelectOption>
  <MultiSelectOption value={3}>Grocery</MultiSelectOption>
  <MultiSelectOption value={4}>Transit</MultiSelectOption>
  <MultiSelectOption value={5}>Travel</MultiSelectOption>
</MultiSelect>
```

### Controlled State
```tsx
const [selected, setSelected] = useState([1, 3]);

<MultiSelect
  label="Select options"
  id="multi-select"
  selectedValues={selected}
  onSelectedValuesChange={(value, isSelected) => {
    setSelected(prev => 
      isSelected 
        ? [...prev, value] 
        : prev.filter(v => v !== value)
    );
  }}
>
  <MultiSelectOption value={1}>Option 1</MultiSelectOption>
  <MultiSelectOption value={2}>Option 2</MultiSelectOption>
  <MultiSelectOption value={3}>Option 3</MultiSelectOption>
</MultiSelect>
```

### With Disabled Option
```tsx
<MultiSelect label="Select options" id="multi-select">
  <MultiSelectOption value={1}>Available option</MultiSelectOption>
  <MultiSelectOption value={2} aria-disabled={true}>
    Unavailable option
  </MultiSelectOption>
  <MultiSelectOption value={3}>Another option</MultiSelectOption>
</MultiSelect>
```

## Accessibility Requirements

**Required:**
- Provide a visible label
- Use `id` to uniquely identify the multiselect
- Screen reader instructions are auto-provided ("Multiple options can be selected")

**Recommended:**
- Use `hint` for additional context
- Use `aria-describedby` for error messages
- Ensure selected state is visually clear (checkmark + gray background)

**Avoid:**
- Hiding labels
- Adding errors within dropdown (display below input instead)
- Using for 5 or fewer options (use checkboxes instead)

## Anti-Patterns

❌ **Wrong:** No label
```tsx
<MultiSelect id="select">
  <MultiSelectOption value={1}>Option 1</MultiSelectOption>
</MultiSelect>
```

✅ **Correct:** Always provide a label
```tsx
<MultiSelect id="select" label="Select options">
  <MultiSelectOption value={1}>Option 1</MultiSelectOption>
</MultiSelect>
```

---

❌ **Wrong:** Using for 5 or fewer options
```tsx
<MultiSelect label="Choose toppings">
  <MultiSelectOption value="1">Onions</MultiSelectOption>
  <MultiSelectOption value="2">Olives</MultiSelectOption>
  <MultiSelectOption value="3">Peppers</MultiSelectOption>
</MultiSelect>
```

✅ **Correct:** Use checkboxes for 5 or fewer options
```tsx
<CheckboxGroup legend="Choose toppings">
  <Checkbox id="c1" label="Onions" />
  <Checkbox id="c2" label="Olives" />
  <Checkbox id="c3" label="Peppers" />
</CheckboxGroup>
```

---

❌ **Wrong:** Label with colon or punctuation
```tsx
<MultiSelect label="Select benefits:" id="select">
  <MultiSelectOption value="1">Option 1</MultiSelectOption>
</MultiSelect>
```

✅ **Correct:** No ending punctuation
```tsx
<MultiSelect label="Select benefits" id="select">
  <MultiSelectOption value="1">Option 1</MultiSelectOption>
</MultiSelect>
```

---

❌ **Wrong:** Title case or ALL CAPS
```tsx
<MultiSelect label="SELECT YOUR BENEFITS" id="select">
  <MultiSelectOption value="1">OPTION 1</MultiSelectOption>
</MultiSelect>
```

✅ **Correct:** Sentence case
```tsx
<MultiSelect label="Select your benefits" id="select">
  <MultiSelectOption value="1">Option 1</MultiSelectOption>
</MultiSelect>
```

## Best Practices

- Use for 6 or more options (use checkboxes for 5 or fewer)
- Keep labels short, clear, and descriptive
- Use sentence case, not title case or ALL CAPS
- Avoid ending labels with colons or commas
- List options in logical order (alphabetical, frequency-based, etc.)
- Avoid long dropdowns requiring excessive scrolling
- For very long lists, use search/typeahead instead
- Error messages appear below the dropdown, not within
- Dismissible tags provide quick visibility and deselection (best for filters)
- Trigger button shows "{n} selected" when items are chosen
- Hover state: blue highlight for clarity
- Selected state: checkmark + gray background
- Selected + hover: blue highlight + checkmark

## Advanced Usage

### With Custom Tag Props
```tsx
<MultiSelect
  label="Filter by category"
  id="filters"
  isDismissible={true}
  defaultSelectedValues={[1, 2]}
>
  <MultiSelectOption 
    value={1} 
    tagProps={{ className: 'custom-tag' }}
  >
    Category 1
  </MultiSelectOption>
  <MultiSelectOption value={2}>
    Category 2
  </MultiSelectOption>
</MultiSelect>
```

## Related Components

- [Checkbox](checkbox.md) - For selecting 5 or fewer multiple options
- [SelectNative](select-native.md) - For selecting single item from 6+ options
- [Tag](tag.md) - Used for dismissible tag display
