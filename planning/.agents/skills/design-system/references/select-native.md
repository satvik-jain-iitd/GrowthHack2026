# SelectNative Component Reference
> AI agent-friendly reference for DLS SelectNative component

## Quick Reference
SelectNative allows users to select a single item from a dropdown list of 6 or more options using the browser's native select element. For fewer than 6 options, consider using radio buttons. Highly recommended for device adaptability.

## Import
```tsx
import { SelectNative, SelectNativeOption } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<SelectNative label="Select an account" hint="Hint text" id="select">
  <SelectNativeOption value="">Select</SelectNativeOption>
  <SelectNativeOption value="option-1">Ending in 8673</SelectNativeOption>
  <SelectNativeOption value="option-2">Ending in 6524</SelectNativeOption>
  <SelectNativeOption value="option-3">Ending in 9865</SelectNativeOption>
</SelectNative>
```

## Props API

### SelectNative
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier |
| label | string | No¹ | - | Visible label text |
| aria-labelledby | string | No¹ | - | ID of an external label element |
| children | ReactNode | - | - | `SelectNativeOption` elements |
| hint | string | - | - | Helper text |
| value | string \| number | - | - | Controlled selected value |
| defaultValue | string | - | - | Initial selected value (uncontrolled) |
| disabled | boolean | - | - | @deprecated use `aria-disabled` instead. Removes the element from the Accessibility Tree and prevents it from receiving focus |
| aria-disabled | Booleanish | - | - | Accessible disabled state |
| aria-describedby | string | - | - | ID of description element |
| required | boolean | - | - | Makes selection required |
| status | `'default' \| 'error' \| 'success'` | - | - | Visual status |
| statusMessage | string | - | - | Status/error message |
| isTwoLined | boolean | - | - | Two-line display mode |
| isHintVisuallyHidden | boolean | - | - | Hides hint visually |
| onChange | ChangeEventHandler\<HTMLSelectElement\> | - | - | Change handler |
| onBlur | FocusEventHandler\<HTMLSelectElement\> | - | - | Blur handler |
| autoComplete | string | - | - | Browser autocomplete value |
| name | string | - | - | Name attribute for form submission |
| lang | string | - | - | BCP 47 language tag, only required if component is in different language than the rest of the page |
| ref | Ref\<HTMLSelectElement\> | - | - | Forwarded to the underlying `<select>` element |

> ¹ At least one of `label` or `aria-labelledby` is required (`RequireVisibleLabel`). If `label` is omitted, `aria-labelledby` must point to a visible label elsewhere on the page.

### SelectNativeOption
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string \| number | - | - | Option value |
| children | ReactNode | - | - | Option display text |
| twoLinedLabel | string | - | - | Secondary label for two-lined mode |

## Common Patterns

### Basic SelectNative
```tsx
<SelectNative label="Select an account" hint="Hint text" id="select">
  <SelectNativeOption value="">Select</SelectNativeOption>
  <SelectNativeOption value="option-1">Ending in 8673</SelectNativeOption>
  <SelectNativeOption value="option-2">Ending in 6524</SelectNativeOption>
  <SelectNativeOption value="option-3">Ending in 9865</SelectNativeOption>
</SelectNative>
```

### Two-Lined Options
```tsx
<SelectNative 
  label="Select an account" 
  hint="Hint text" 
  id="select" 
  isTwoLined={true}
>
  <SelectNativeOption value="">Select</SelectNativeOption>
  <SelectNativeOption value="secondary" twoLinedLabel="Secondary Account">
    Ending in 8673
  </SelectNativeOption>
  <SelectNativeOption value="tertiary" twoLinedLabel="Tertiary Account">
    Ending in 6524
  </SelectNativeOption>
  <SelectNativeOption value="main" twoLinedLabel="Main Account">
    Ending in 9865
  </SelectNativeOption>
</SelectNative>
```

### With Error State
```tsx
<SelectNative 
  label="Select an option" 
  id="select" 
  status="error"
  statusMessage="Please make a selection"
  required={true}
>
  <SelectNativeOption value="">Select</SelectNativeOption>
  <SelectNativeOption value="1">Option 1</SelectNativeOption>
  <SelectNativeOption value="2">Option 2</SelectNativeOption>
</SelectNative>
```

### With Success State
```tsx
<SelectNative 
  label="Country" 
  id="country" 
  status="success"
  statusMessage="Selection confirmed"
  defaultValue="us"
>
  <SelectNativeOption value="">Select country</SelectNativeOption>
  <SelectNativeOption value="us">United States</SelectNativeOption>
  <SelectNativeOption value="ca">Canada</SelectNativeOption>
  <SelectNativeOption value="uk">United Kingdom</SelectNativeOption>
</SelectNative>
```

## Accessibility Requirements

**Required:**
- Provide a visible label
- Use `id` to uniquely identify the select
- List options in logical order

**Recommended:**
- Use `hint` for additional context
- Use `required` for mandatory selections
- Use `aria-describedby` for status/error messages
- Provide clear, descriptive option text

**Avoid:**
- Long dropdowns requiring excessive scrolling
- Hiding labels
- Using all caps or title case (use sentence case)
- Ending labels with colons

## Anti-Patterns

❌ **Wrong:** No label
```tsx
<SelectNative id="select">
  <SelectNativeOption value="1">Option 1</SelectNativeOption>
</SelectNative>
```

✅ **Correct:** Always provide a label
```tsx
<SelectNative id="select" label="Select an option">
  <SelectNativeOption value="1">Option 1</SelectNativeOption>
</SelectNative>
```

---

❌ **Wrong:** Using for 5 or fewer options
```tsx
<SelectNative label="Size" id="size">
  <SelectNativeOption value="">Select</SelectNativeOption>
  <SelectNativeOption value="s">Small</SelectNativeOption>
  <SelectNativeOption value="m">Medium</SelectNativeOption>
  <SelectNativeOption value="l">Large</SelectNativeOption>
</SelectNative>
```

✅ **Correct:** Use radio buttons for 5 or fewer options
```tsx
<RadioGroup legend="Size" defaultValue="m">
  <RadioButton id="size-s" label="Small" value="s" />
  <RadioButton id="size-m" label="Medium" value="m" />
  <RadioButton id="size-l" label="Large" value="l" />
</RadioGroup>
```

---

❌ **Wrong:** Title case or all caps
```tsx
<SelectNative label="SELECT YOUR SIZE" id="size">
  <SelectNativeOption value="s">SMALL</SelectNativeOption>
  <SelectNativeOption value="m">MEDIUM</SelectNativeOption>
</SelectNative>
```

✅ **Correct:** Sentence case
```tsx
<SelectNative label="Select your size" id="size">
  <SelectNativeOption value="s">Small</SelectNativeOption>
  <SelectNativeOption value="m">Medium</SelectNativeOption>
</SelectNative>
```

---

❌ **Wrong:** Label with colon
```tsx
<SelectNative label="Select size:" id="size">
  <SelectNativeOption value="s">Small</SelectNativeOption>
</SelectNative>
```

✅ **Correct:** No ending punctuation
```tsx
<SelectNative label="Select size" id="size">
  <SelectNativeOption value="s">Small</SelectNativeOption>
</SelectNative>
```

## Best Practices

- Use for 6 or more options (use radio buttons for 5 or fewer)
- Highly recommended: use SelectNative (browser-native, device-adaptive)
- Keep labels short, clear, and descriptive
- Use sentence case, not title case or ALL CAPS
- Avoid ending labels with colons
- List options in logical order (alphabetical, frequency-based, etc.)
- Avoid long dropdowns requiring excessive scrolling
- For very long lists, use search/typeahead instead
- Use two-lined mode when additional context helps selection

## Advanced Usage

### With Field Control Wrapper
```tsx
<FieldControl status="error" onFieldTouch={handleTouch}>
  <SelectNative 
    label="Account" 
    id="account"
    required={true}
  >
    <SelectNativeOption value="">Select account</SelectNativeOption>
    <SelectNativeOption value="1">Account 1</SelectNativeOption>
    <SelectNativeOption value="2">Account 2</SelectNativeOption>
  </SelectNative>
</FieldControl>
```

## Related Components

- **RadioGroup** - For 5 or fewer mutually exclusive options
- **SelectCustom** - For selects needing custom graphics
- **MultiSelect** - For selecting multiple items
- **FieldControl** - For form field validation context
