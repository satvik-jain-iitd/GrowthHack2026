# Checkbox Component Reference
> AI agent-friendly reference for DLS Checkbox component

## Quick Reference
Checkboxes allow users to select one or more items from a predefined list of independent options. Use for accepting terms, selecting multiple items, or toggling features that require submission.

## Import
```tsx
import { Checkbox, CheckboxGroup, CheckboxIndeterminate } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Checkbox id="checkbox" label="I agree to terms" />
```

## Props API

### Checkbox
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | The id of the input field |
| label | string \| ReactElement | Yes | - | A string or elements to be placed on the label |
| checked | boolean | No | - | The checked state of the checkbox |
| defaultChecked | boolean | No | - | Flag to use the component in an uncontrolled setting |
| value | string | No | - | The string representing the value of the checkbox |
| name | string | No | - | The name of the checkbox |
| aria-invalid | boolean | No | - | Flag to indicate that the field is in a warning state |
| aria-describedby | string | No | - | ID of element providing further context and description of the checkbox |
| aria-disabled | boolean | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled" |
| disabled | boolean | No | - | **Deprecated:** Use `aria-disabled` instead. Removes element from Accessibility Tree and prevents focus |
| onChange | ChangeEventHandler<HTMLInputElement> | No | - | The event handler for change events on the input field |
| statusMessage | string | No | - | The status message to be displayed. Will only be displayed if `aria-invalid` is true |
| labelProps | HTMLLabelElement Props | No | - | Props to be spread onto the `<label>` element |
| iconProps | any | No | - | Props to be spread onto the `<IconCheck>` component |
| reactlytics | ReactlyticsProp | No | - | Analytics tracking prop |

### CheckboxGroup
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| legend | string \| ReactElement | Yes | - | A string or elements to be placed on the legend |
| children | ReactNode | Yes | - | Children to render in the checkbox group |
| id | string | No | - | ID for the accessible hint text |
| hint | string | No | - | The hint text to be displayed below the legend |
| orientation | `'horizontal'` \| `'vertical'` | No | `'vertical'` | Controls the orientation that the CheckboxGroup's children are rendered in |
| isLegendVisuallyHidden | boolean | No | - | If true, visually hides the `legend` element but it will still be available to screen readers |
| aria-invalid | boolean | No | - | Flag to indicate that each Checkbox in the CheckboxGroup is in an invalid state |
| statusMessage | string | No | - | The status message to be displayed. Will only be displayed if `aria-invalid` is true |
| reactlytics | ReactlyticsProp | No | - | Analytics tracking prop |

### CheckboxIndeterminate
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | The id of the input field |
| label | string \| ReactElement | Yes | - | A string or elements to be placed on the label |
| aria-controls | string | Yes | - | Identifies the element (or elements) whose contents or presence are controlled |
| checked | boolean | No | - | The checked state of the indeterminate checkbox (controlled) |
| defaultChecked | boolean | No | - | The default checked state of the Indeterminate Checkbox (uncontrolled component) |
| isIndeterminate | boolean | No | - | Flag to indicate whether the checkbox is in an indeterminate state |
| value | string | No | - | The string representing the value of the checkbox |
| name | string | No | - | The name of the checkbox |
| aria-invalid | boolean | No | - | Flag to indicate that the field is in a warning state |
| aria-disabled | boolean | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled" |
| disabled | boolean | No | - | **Deprecated:** Use `aria-disabled` instead. Removes element from Accessibility Tree and prevents focus |
| onClick | (event: KeyboardEvent<HTMLInputElement> \| MouseEvent<HTMLInputElement>, checked: boolean) => void | No | - | The event handler for click events on the indeterminate checkbox |
| reactlytics | ReactlyticsProp | No | - | Analytics tracking prop |

## Common Patterns

### Default Checkbox
```tsx
<Checkbox id="checkbox-1" label="I have read and agree" />
```

### Checkbox Group (Vertical)
```tsx
<CheckboxGroup legend="Choose pizza toppings">
  <Checkbox id="checkbox-1" label="Onions" />
  <Checkbox id="checkbox-2" label="Olives" />
  <Checkbox id="checkbox-3" label="Peppers" />
</CheckboxGroup>
```

### Checkbox Group (Horizontal)
```tsx
<CheckboxGroup legend="Choose pizza toppings" orientation="horizontal">
  <Checkbox id="checkbox-1" label="Onions" />
  <Checkbox id="checkbox-2" label="Olives" />
  <Checkbox id="checkbox-3" label="Peppers" />
</CheckboxGroup>
```

### Indeterminate Checkbox (Select All)
```tsx
<CheckboxGroup legend="Indeterminate Group">
  <CheckboxIndeterminate 
    id="select-all" 
    label="Select All" 
    aria-controls="item-1 item-2 item-3" 
  />
  <div style={{ marginLeft: '12px' }}>
    <Checkbox id="item-1" label="Item 1" />
    <Checkbox id="item-2" label="Item 2" />
    <Checkbox id="item-3" label="Item 3" />
  </div>
</CheckboxGroup>
```

### With Error Validation
```tsx
<CheckboxGroup legend="Required Selection" aria-invalid={true}>
  <Checkbox id="checkbox-1" label="Option 1" />
  <Checkbox id="checkbox-2" label="Option 2" />
</CheckboxGroup>
<ComponentLevelNotification status="error">
  Please select at least one option.
</ComponentLevelNotification>
```

### Disabled Checkbox
```tsx
<Checkbox id="disabled-checkbox" label="Disabled option" aria-disabled={true} />
```

## Accessibility Requirements

**Required:**
- Provide a visible label for each checkbox
- Use the `label` prop to get accessible checkbox label built into the component. Alternatively, use `id` and `htmlFor` or `aria-labelledby` to associate checkbox with a custom label.
- Group related checkboxes with `CheckboxGroup` using `legend`
- Use `aria-invalid` for error states
- Use `aria-disabled` instead of `disabled` when possible

**Recommended:**
- Use `aria-describedby` to associate hint or error text
- Add `statusMessage` for clear error messaging
- Wrap long labels to another line (don't truncate)
- Provide context for checkbox groups with descriptive legends

**Avoid:**
- Using `disabled` attribute (use `aria-disabled` for better accessibility)
- Hiding labels or relying on visual context alone
- Adding errors per item (add to group instead)

## Anti-Patterns

❌ **Wrong:** Vague or unclear labels
```tsx
<Checkbox id="checkbox" label="Option 1" />
```

✅ **Correct:** Clear, descriptive labels
```tsx
<Checkbox id="checkbox" label="I have read and agree" />
```

---

❌ **Wrong:** Labels with punctuation
```tsx
<Checkbox id="checkbox" label="I have read and agree!" />
```

✅ **Correct:** No ending punctuation
```tsx
<Checkbox id="checkbox" label="I have read and agree" />
```

---

❌ **Wrong:** Truncating long labels
```tsx
<Checkbox id="checkbox" label="Pineapple is the best topping for..." />
```

✅ **Correct:** Wrap long labels
```tsx
<Checkbox id="checkbox" label="Pineapple is the best topping for pizza" />
```

---

❌ **Wrong:** More than 3 options horizontally
```tsx
<CheckboxGroup legend="Choose options" orientation="horizontal">
  <Checkbox id="c1" label="Option 1" />
  <Checkbox id="c2" label="Option 2" />
  <Checkbox id="c3" label="Option 3" />
  <Checkbox id="c4" label="Option 4" />
  <Checkbox id="c5" label="Option 5" />
</CheckboxGroup>
```

✅ **Correct:** Limit horizontal to 3 items
```tsx
<CheckboxGroup legend="Choose Options" orientation="horizontal">
  <Checkbox id="c1" label="Option 1" />
  <Checkbox id="c2" label="Option 2" />
  <Checkbox id="c3" label="Option 3" />
</CheckboxGroup>
```

---

❌ **Wrong:** More than 5 options vertically (use MultiSelect instead)
```tsx
<CheckboxGroup legend="Choose benefits">
  <Checkbox label="Entertainment" id="1" />
  <Checkbox label="Restaurants" id="2" />
  <Checkbox label="Grocery" id="3" />
  <Checkbox label="Transit" id="4" />
  <Checkbox label="Travel" id="5" />
  <Checkbox label="Dining" id="6" />
  <Checkbox label="Shopping" id="7" />
</CheckboxGroup>
```

---

❌ **Wrong:** Using checkbox for binary on/off state
```tsx
<Checkbox id="dark-mode" label="Dark mode" />
```

✅ **Correct:** Use ToggleSwitch for binary states
```tsx
<ToggleSwitch id="dark-mode" label="Dark mode" onText="On" offText="Off" />
```

---

❌ **Wrong:** Individual error messages
```tsx
<CheckboxGroup legend="Options">
  <Checkbox id="c1" label="Option 1" aria-invalid={true} />
  <ComponentLevelNotification status="error">Error</ComponentLevelNotification>
  <Checkbox id="c2" label="Option 2" aria-invalid={true} />
  <ComponentLevelNotification status="error">Error</ComponentLevelNotification>
</CheckboxGroup>
```

✅ **Correct:** Group-level error
```tsx
<CheckboxGroup legend="Options" aria-invalid={true}>
  <Checkbox id="c1" label="Option 1" />
  <Checkbox id="c2" label="Option 2" />
</CheckboxGroup>
<ComponentLevelNotification status="error">
  Please select at least one option.
</ComponentLevelNotification>
```

## Best Practices

- Use checkboxes when users can select one or multiple options from a list
- Perfect for accepting terms of service or similar functionality
- Always provide short, clear, descriptive labels (1-4 words when possible)
- Avoid ending labels with punctuation, commas, or semicolons
- Wrap long labels instead of truncating with ellipsis
- Vertical layout is easier to read than horizontal
- Limit horizontal layouts to 3 options maximum
- Limit vertical layouts to 5 options maximum (use MultiSelect for 6+)
- Use Radio for single selection, Checkbox for multiple selection
- Use ToggleSwitch for binary on/off states, not Checkbox
- Add error messages at the group level, not per item
- Labels wrap to next line on small screens (minimum 320px)
- Horizontal groups reflow to vertical on smaller breakpoints

## Related Components

- [Radio](radio.md) - For single selection from a list
- [ToggleSwitch](toggle-switch.md) - For binary on/off states
- [MultiSelect](multi-select.md) - For selecting multiple items from 6+ options
- [ComponentLevelNotification](component-level-notification.md) - For displaying error messages