# SelectCustom Component Reference

> AI agent-friendly reference for DLS SelectCustom component

## Quick Reference

SelectCustom allows users to select a single item from a dropdown list with support for custom graphics like icons or card art (max 24px height). Use system native when possible; use SelectCustom only when graphics add valuable context.

## Import

```tsx
import { SelectCustom, SelectCustomOption } from "@americanexpress/dls-react";
```

## Minimal Example

```tsx
<SelectCustom hint="Hint text" id="custom-select" label="Select an account">
  <SelectCustomOption value={1}>Account 1</SelectCustomOption>
  <SelectCustomOption value={2}>Account 2</SelectCustomOption>
  <SelectCustomOption value={3}>Account 3</SelectCustomOption>
</SelectCustom>
```

## Props API

### SelectCustom

| Prop                 | Type                      | Required | Default   | Description                                                                                                                                   |
| -------------------- | ------------------------- | -------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | string                    | Yes      | -         | Unique identifier                                                                                                                             |
| label                | string                    | -        | -         | Visible label text                                                                                                                            |
| hint                 | string                    | -        | -         | Helper text                                                                                                                                   |
| value                | string \| number          | -        | -         | Controlled selected value                                                                                                                     |
| defaultValue         | string \| number          | -        | -         | Initial selected value                                                                                                                        |
| isOpen               | boolean                   | -        | -         | Controlled open state                                                                                                                         |
| defaultIsOpen        | boolean                   | -        | -         | Initial open state                                                                                                                            |
| disabled             | boolean                   | -        | -         | @deprecated use aria-disabled instead. The disabled prop removes the element from the Accessibility Tree and prevents it from receiving focus |
| aria-disabled        | boolean \| string         | -        | -         | Accessible disabled state                                                                                                                     |
| aria-describedby     | string                    | -        | -         | ID of description element                                                                                                                     |
| aria-labelledby      | string                    | -        | -         | ID of labelling element                                                                                                                       |
| isHintVisuallyHidden | boolean                   | -        | -         | Hides hint visually                                                                                                                           |
| onIsOpenChange       | (isOpen: boolean) => void | -        | -         | Called when dropdown opens/closes (controlled)                                                                                                |
| onValueChange        | (value) => void           | -        | -         | Called when value changes                                                                                                                     |
| onOptionClick        | (event) => void           | -        | -         | Called when option clicked                                                                                                                    |
| onTriggerKeyDown     | (event) => void           | -        | -         | Keyboard handler for trigger                                                                                                                  |
| status               | 'default' \| 'error'      | -        | 'default' | Visual status                                                                                                                                 |
| positionStrategy     | 'absolute' \| 'fixed'     | -        | 'fixed'   | Dropdown positioning strategy                                                                                                                 |

### SelectCustomOption

| Prop                | Type              | Required | Default | Description                        |
| ------------------- | ----------------- | -------- | ------- | ---------------------------------- |
| id                  | string            | No       | -       | Unique identifier                  |
| onSelectOptionClick | (event) => void   | -        | -       | Called when this option is clicked |
| onKeyDown           | (event) => void   | -        | -       | Keyboard handler for this option   |
| value               | string \| number  | Yes      | -       | Option value                       |
| children            | ReactNode         | Yes      | -       | Option display text                |
| graphic             | ReactNode         | -        | -       | Icon or graphic                    |
| aria-selected       | boolean \| string | -        | -       | Selected state                     |
| name                | string            | -        | -       | Name attribute for form submission |

## Common Patterns

### Basic SelectCustom

```tsx
<SelectCustom hint="Hint text" id="custom-select" label="Select account">
  <SelectCustomOption value={1}>Account ending in 8673</SelectCustomOption>
  <SelectCustomOption value={2}>Account ending in 6524</SelectCustomOption>
  <SelectCustomOption value={3}>Account ending in 9865</SelectCustomOption>
</SelectCustom>
```

### With Graphics/Icons

```tsx
<SelectCustom hint="Select your card" id="card-select" label="Payment method">
  <SelectCustomOption graphic={<IconCard />} value={1}>
    Gold Card
  </SelectCustomOption>
  <SelectCustomOption graphic={<IconCard />} value={2}>
    Platinum Card
  </SelectCustomOption>
  <SelectCustomOption graphic={<IconCard />} value={3}>
    Blue Card
  </SelectCustomOption>
</SelectCustom>
```

### Controlled State

```tsx
const [selectedValue, setSelectedValue] = useState(1);

<SelectCustom
  id="controlled-select"
  label="Select account"
  value={selectedValue}
  onValueChange={setSelectedValue}
>
  <SelectCustomOption value={1}>Option 1</SelectCustomOption>
  <SelectCustomOption value={2}>Option 2</SelectCustomOption>
</SelectCustom>;
```

### With Disabled Option

```tsx
<SelectCustom id="select" label="Select option">
  <SelectCustomOption value={1}>Available option</SelectCustomOption>
  <SelectCustomOption value={2} aria-disabled={true}>
    Unavailable option
  </SelectCustomOption>
  <SelectCustomOption value={3}>Another option</SelectCustomOption>
</SelectCustom>
```

## Accessibility Requirements

**Required:**

- Provide a visible label
- Use `id` to uniquely identify the select
- Ensure all options have unique values
- Make options keyboard accessible

**Recommended:**

- Use `hint` for additional context
- Use `aria-describedby` for error messages
- Ensure graphics/icons don't replace clear text labels

**Avoid:**

- Hiding labels or relying only on graphics
- Using graphics without text context
- Making options inaccessible to keyboard users

## Anti-Patterns

❌ **Wrong:** No label

```tsx
<SelectCustom id="select">
  <SelectCustomOption value={1}>Option 1</SelectCustomOption>
</SelectCustom>
```

✅ **Correct:** Always provide a label

```tsx
<SelectCustom id="select" label="Select an option">
  <SelectCustomOption value={1}>Option 1</SelectCustomOption>
</SelectCustom>
```

---

❌ **Wrong:** Using custom select when native would suffice

```tsx
<SelectCustom id="select" label="Select size">
  <SelectCustomOption value="s">Small</SelectCustomOption>
  <SelectCustomOption value="m">Medium</SelectCustomOption>
  <SelectCustomOption value="l">Large</SelectCustomOption>
</SelectCustom>
```

✅ **Correct:** Use SelectNative for simple lists

```tsx
<SelectNative id="select" label="Select size">
  <SelectNativeOption value="s">Small</SelectNativeOption>
  <SelectNativeOption value="m">Medium</SelectNativeOption>
  <SelectNativeOption value="l">Large</SelectNativeOption>
</SelectNative>
```

## Best Practices

- Use SelectNative by default (browser-native, device-adaptive)
- Use SelectCustom only when graphics/icons add meaningful context
- Graphics should be max 24px in height
- Keep option text clear and concise
- Provide hint text for additional instructions
- List options in logical order (alphabetical, frequency, etc.)
- Avoid long dropdowns requiring excessive scrolling
- For 6+ options in need of filtering, consider search/typeahead

## Advanced Usage

### All Options with Graphics

```tsx
<SelectCustom id="cards" label="Select card">
  <SelectCustomOption graphic={<IconCreditCard />} value="gold">
    Gold Card ****1234
  </SelectCustomOption>
  <SelectCustomOption graphic={<IconCreditCard />} value="plat">
    Platinum Card ****5678
  </SelectCustomOption>
  <SelectCustomOption graphic={<IconCreditCard />} value="blue">
    Blue Card ****9012
  </SelectCustomOption>
</SelectCustom>
```

Note: When all options have graphics, they all display consistently. If only some have graphics, alignment may vary.

## Related Components

- **SelectNative** - System-native select (preferred for simple lists)
- **MultiSelect** - For selecting multiple items
- **RadioGroup** - For 5 or fewer mutually exclusive options
