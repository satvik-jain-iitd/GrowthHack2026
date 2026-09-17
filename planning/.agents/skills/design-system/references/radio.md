# Radio Component Reference

> AI agent-friendly reference for DLS Radio component

## Quick Reference

Radio buttons allow users to make a single selection from a group of two or more mutually exclusive options. Use when only one choice can be selected at a time.

## Import

```tsx
import { RadioButton, RadioGroup } from "@americanexpress/dls-react";
```

## Minimal Example

```tsx
<RadioGroup name="option" legend="Select an option">
  <RadioButton name="option" id="radio-1" label="Option 1" value="option-1" />
  <RadioButton name="option" id="radio-2" label="Option 2" value="option-2" />
  <RadioButton name="option" id="radio-3" label="Option 3" value="option-3" />
</RadioGroup>
```

## Props API

### RadioButton

| Prop           | Type              | Required | Default | Description                                                   |
| -------------- | ----------------- | -------- | ------- | ------------------------------------------------------------- |
| id             | string            | Yes      | -       | Unique identifier                                             |
| label          | string            | Yes      | -       | Visible label text                                            |
| value          | string \| number  | Yes      | -       | Value when selected                                           |
| name           | string            | -        | -       | Name attribute for form submission                            |
| checked        | boolean           | -        | -       | Controlled checked state                                      |
| defaultChecked | boolean           | -        | false   | Initial checked state                                         |
| disabled       | boolean           | -        | -       | @deprecated use `aria-disabled` instead. Disables interaction |
| aria-disabled  | boolean \| string | -        | -       | Accessible disabled state                                     |
| onChange       | (event) => void   | -        | -       | Change handler                                                |
| isInvalid      | boolean           | -        | -       | Invalid state                                                 |
| children       | ReactNode         | -        | -       | Additional content like hint text                             |

### RadioGroup

| Prop                   | Type                       | Required | Default    | Description                                                           |
| ---------------------- | -------------------------- | -------- | ---------- | --------------------------------------------------------------------- |
| id                     | string                     | No       | -          | Id for accessible hint text                                           |
| hint                   | string                     | No       | -          | Helper text displayed below the legend                                |
| legend                 | string                     | Yes      | -          | Group label                                                           |
| value                  | string \| number           | -        | -          | Controlled selected value                                             |
| defaultValue           | string \| number           | -        | -          | Initial selected value                                                |
| orientation            | 'vertical' \| 'horizontal' | -        | 'vertical' | Layout direction                                                      |
| disabled               | boolean                    | -        | -          | @deprecated use `aria-disabled` instead. Disables all radios in group |
| aria-disabled          | boolean \| string          | -        | -          | Accessible disabled state                                             |
| aria-invalid           | boolean \| string          | -        | -          | Invalid state for group                                               |
| aria-describedby       | string                     | -        | -          | ID of element providing additional description                        |
| isLegendVisuallyHidden | boolean                    | -        | -          | Hides legend visually                                                 |
| onChange               | (event) => void            | -        | -          | Change handler                                                        |

## Common Patterns

### Default Radio Group

```tsx
<RadioGroup name="option" legend="Select an option" defaultValue="option-1">
  <RadioButton name="option" id="radio-1" label="Option 1" value="option-1" />
  <RadioButton name="option" id="radio-2" label="Option 2" value="option-2" />
  <RadioButton name="option" id="radio-3" label="Option 3" value="option-3" />
</RadioGroup>
```

### Horizontal Layout

```tsx
<RadioGroup
  name="option"
  legend="Select option"
  orientation="horizontal"
  defaultValue="option-2"
>
  <RadioButton name="option" id="radio-1" label="Option 1" value="option-1" />
  <RadioButton name="option" id="radio-2" label="Option 2" value="option-2" />
  <RadioButton name="option" id="radio-3" label="Option 3" value="option-3" />
</RadioGroup>
```

### With Error Validation

```tsx
<RadioGroup
  legend="Select an option"
  aria-invalid={true}
  aria-describedby="error-message"
>
  <RadioButton name="option" id="radio-1" label="Option 1" value="option-1" />
  <RadioButton name="option" id="radio-2" label="Option 2" value="option-2" />
  <RadioButton name="option" id="radio-3" label="Option 3" value="option-3" />
</RadioGroup>
<ComponentLevelNotification id="error-message" status="error">
  Please make a selection.
</ComponentLevelNotification>
```

### Visually Hidden Legend

```tsx
<RadioGroup
  name="option"
  legend="Select an option"
  isLegendVisuallyHidden={true}
>
  <RadioButton name="option" id="radio-1" label="Option 1" value="option-1" />
  <RadioButton name="option" id="radio-2" label="Option 2" value="option-2" />
  <RadioButton name="option" id="radio-3" label="Option 3" value="option-3" />
</RadioGroup>
```

## Accessibility Requirements

**Required:**

- Provide a visible label for each radio button
- Group related radio buttons using `RadioGroup` with `legend`
- Use `id` and `htmlFor` or `aria-labelledby` to associate each radio with its label
- Assign unique `value` to each radio in a group

**Recommended:**

- Pre-select the safest, most secure, or most common option
- Use `aria-describedby` to associate hint or error text with the group
- Ensure labels are clear and descriptive

**Avoid:**

- Leaving radio groups unselected without a default
- Using radio buttons for more than 5 options (use Select instead)
- Adding errors per item (add to group instead)

## Anti-Patterns

❌ **Wrong:** No default selection

```tsx
<RadioGroup name="option" legend="Will you attend">
  <RadioButton name="option" id="option-1" label="Yes" value="yes" />
  <RadioButton name="option" id="option-2" label="No" value="no" />
  <RadioButton
    name="option"
    id="option-3"
    label="I will decide later"
    value="option-3"
  />
</RadioGroup>
```

✅ **Correct:** Default selection

```tsx
<RadioGroup name="option" legend="Will you attend" defaultValue="yes">
  <RadioButton
    name="option"
    id="option-1"
    label="Yes, I will attend"
    value="yes"
  />
  <RadioButton
    name="option"
    id="option-2"
    label="No, I will not attend"
    value="no"
  />
  <RadioButton
    name="option"
    id="option-3"
    label="I will decide later"
    value="later"
  />
</RadioGroup>
```

---

❌ **Wrong:** Vague labels

```tsx
<RadioGroup legend="Select size for shirt" name="option" defaultValue="s">
  <RadioButton
    name="option"
    id="option-1"
    label="Small for chest size 35in"
    value="s"
  />
  <RadioButton
    name="option"
    id="option-2"
    label="Medium for chest size 40in"
    value="m"
  />
  <RadioButton
    name="option"
    id="option-3"
    label="Large for chest size 45in"
    value="l"
  />
</RadioGroup>
```

✅ **Correct:** Clear, concise labels

```tsx
<RadioGroup legend="Select size" name="option" defaultValue="s">
  <RadioButton name="option" id="option-1" label="Small" value="s" />
  <RadioButton name="option" id="option-2" label="Medium" value="m" />
  <RadioButton name="option" id="option-3" label="Large" value="l" />
</RadioGroup>
```

---

❌ **Wrong:** Labels with punctuation

```tsx
<RadioGroup legend="Will you attend?" name="option" defaultValue="yes">
  <RadioButton
    name="option"
    id="option-1"
    label="Yes, I will attend!"
    value="yes"
  />
  <RadioButton
    name="option"
    id="option-2"
    label="No, I will not attend!"
    value="no"
  />
  <RadioButton
    name="option"
    id="option-3"
    label="I will decide later."
    value="later"
  />
</RadioGroup>
```

✅ **Correct:** No ending punctuation

```tsx
<RadioGroup legend="Choose selection" name="option" defaultValue="yes">
  <RadioButton
    name="option"
    id="option-1"
    label="Yes, I will attend"
    value="yes"
  />
  <RadioButton
    name="option"
    id="option-2"
    label="No, I will not attend"
    value="no"
  />
  <RadioButton
    name="option"
    id="option-3"
    label="I will decide later"
    value="later"
  />
</RadioGroup>
```

---

❌ **Wrong:** Long labels truncated with ellipsis

```tsx
<RadioButton label="Mixed greens with balsamic dressing..." value="salad" />
```

✅ **Correct:** Let long labels wrap

```tsx
<RadioButton
  label="French garden salad with thousand island dressing"
  value="salad"
/>
```

---

❌ **Wrong:** Using radio for binary choice

```tsx
<RadioGroup legend="Do you agree with terms?">
  <RadioButton label="I agree" value="yes" />
  <RadioButton label="I don't agree" value="no" />
</RadioGroup>
```

✅ **Correct:** Use Checkbox for binary choice

```tsx
<Checkbox id="agree" label="I agree with terms" />
```

---

❌ **Wrong:** More than 3 options horizontally

```tsx
<RadioGroup
  legend="Select size"
  orientation="horizontal"
  name="option"
  defaultValue="1"
>
  <RadioButton name="option" id="option-1" label="Aqua" value="1" />
  <RadioButton name="option" id="option-2" label="Blue" value="2" />
  <RadioButton name="option" id="option-3" label="Green" value="3" />
  <RadioButton name="option" id="option-4" label="Magenta" value="4" />
</RadioGroup>
```

✅ **Correct:** Vertical for 4+ options

```tsx
<RadioGroup legend="Select size" name="option" defaultValue="1">
  <RadioButton name="option" id="option-1" label="Aqua" value="1" />
  <RadioButton name="option" id="option-2" label="Blue" value="2" />
  <RadioButton name="option" id="option-3" label="Green" value="3" />
  <RadioButton name="option" id="option-4" label="Magenta" value="4" />
</RadioGroup>
```

---

❌ **Wrong:** More than 5 options vertically

```tsx
<RadioGroup
  legend="What color is your favorite?"
  orientation="vertical"
  defaultValue="3"
>
  <RadioButton name="option" id="option-1" label="Aqua" value="1" />
  <RadioButton name="option" id="option-2" label="Bright Blue" value="2" />
  <RadioButton name="option" id="option-3" label="Deep Blue" value="3" />
  <RadioButton name="option" id="option-4" label="Green" value="4" />
  <RadioButton name="option" id="option-5" label="Magenta" value="5" />
  <RadioButton name="option" id="option-6" label="Orange" value="6" />
  <RadioButton name="option" id="option-7" label="Red" value="7" />
  <RadioButton name="option" id="option-8" label="White" value="8" />
</RadioGroup>
```

✅ **Correct:** Use Select for 6+ options

```tsx
<SelectNative label="What color is your favorite?" id="color">
  <SelectNativeOption value="">Select</SelectNativeOption>
  <SelectNativeOption value="1">Aqua</SelectNativeOption>
  <SelectNativeOption value="2">Bright Blue</SelectNativeOption>
  {/* ... more options */}
</SelectNative>
```

---

❌ **Wrong:** Individual error messages per radio

```tsx
<RadioGroup legend="Select size" aria-invalid={true}>
  <RadioButton name="option" id="option-1" label="Small" value="s" />
  <ComponentLevelNotification status="error">Error</ComponentLevelNotification>
  <RadioButton name="option" id="option-2" label="Medium" value="m" />
  <ComponentLevelNotification status="error">Error</ComponentLevelNotification>
</RadioGroup>
```

✅ **Correct:** Group-level error

```tsx
<RadioGroup legend="Select size" aria-invalid={true}>
  <RadioButton name="option" id="option-1" label="Small" value="s" />
  <RadioButton name="option" id="option-2" label="Medium" value="m" />
  <RadioButton name="option" id="option-3" label="Large" value="l" />
</RadioGroup>
<ComponentLevelNotification status="error">
  Please make a selection.
</ComponentLevelNotification>
```

## Best Practices

- Pre-select the safest, most secure, or most common option by default
- Keep labels short, clear, and descriptive (4 words or fewer)
- Avoid ending labels with punctuation, commas, or semicolons
- Let long labels wrap instead of truncating
- Use vertical layout (easier to read than horizontal)
- Limit horizontal layouts to 3 options maximum
- Limit vertical layouts to 5 options maximum (use Select for 6+)
- For binary choices, use Checkbox or ToggleSwitch instead
- Add error messages at group level, not per radio button
- Provide "None" option if group needs an unselected state
- Labels wrap to next line on small screens (minimum 320px)
- Horizontal groups reflow to vertical on smaller breakpoints

## Advanced Usage

### With None Option for Deselection

```tsx
<RadioGroup name="option" legend="What is your eye color?" defaultValue="none">
  <RadioButton name="option" id="option-1" label="Blue" value="blue" />
  <RadioButton name="option" id="option-2" label="Brown" value="brown" />
  <RadioButton name="option" id="option-3" label="Black" value="black" />
  <RadioButton
    name="option"
    id="option-4"
    label="None of the above"
    value="none"
  />
</RadioGroup>
```

## Related Components

- **Checkbox** - For selecting multiple options
- **ToggleSwitch** - For binary on/off states
- **Select** - For choosing from 6+ options
- **RadioGroup** - For grouping radio buttons
- **ComponentLevelNotification** - For displaying error messages
