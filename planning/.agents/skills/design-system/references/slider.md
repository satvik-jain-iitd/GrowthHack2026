# Slider Component Reference
> AI agent-friendly reference for DLS Slider component

## Quick Reference
Slider allows users to select a value by dragging a handle along a horizontal track, or using keyboard arrow keys. Use for ranges that provide instant visual feedback and where approximate values are acceptable. Avoid for very large or very small ranges.

## Import
```tsx
import { Slider } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Slider
  id="slider"
  label="Amount"
  hint="Hint text"
  defaultValue={50}
  min={0}
  max={100}
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier |
| label | string | No¹ | - | Visible label text |
| aria-labelledby | string | No¹ | - | ID of an external label element |
| hint | string | - | - | Helper text |
| value | number | - | - | Controlled value |
| defaultValue | number | - | `0` | Initial value (uncontrolled) |
| min | number | Yes | - | Minimum value |
| max | number | Yes | - | Maximum value |
| step | number | - | `1` | Increment amount for PageUp/PageDown. Arrow keys always increment by 1. |
| minLabel | string | - | - | Displayed min label (falls back to `min` value if omitted) |
| maxLabel | string | - | - | Displayed max label (falls back to `max` value if omitted) |
| disabled | boolean | - | - | @deprecated use `aria-disabled` instead. Removes the element from the Accessibility Tree and prevents it from receiving focus |
| aria-disabled | Booleanish | - | - | Accessible disabled state |
| isHintVisuallyHidden | boolean | - | - | Hides hint visually |
| getDatatipValue | (value: number, percent: number) => string | - | - | Returns a string to display in the Datatip above the handle |
| tooltipMessage | string | - | - | Message displayed in the label tooltip |
| tooltipTriggerLabel | string | Yes (if `tooltipMessage` set) | - | Accessible label for the tooltip trigger button |
| tooltipProps | object | - | - | Additional props for the Tooltip component |
| onSliderValueChange | (value: number) => void | - | - | Value change handler |
| sliderThumbProps | object | - | - | Props forwarded to the slider thumb element |
| sliderRangeProps | object | - | - | Props forwarded to the range display element |
| sliderBarProps | object | - | - | Props forwarded to the slider bar element |
| labelOverrides | `{ getSliderRangeScreenReaderLabel?: (label, visibleMinLabel, visibleMaxLabel) => string }` | - | - | Custom accessible labels |

> ¹ At least one of `label` or `aria-labelledby` is required (`RequireVisibleLabel`). If `label` is omitted, `aria-labelledby` must point to a visible label elsewhere on the page.

## Common Patterns

### Basic Slider
```tsx
<Slider
  id="basic-slider"
  label="Amount"
  hint="Select amount"
  defaultValue={50}
  min={0}
  max={100}
/>
```

### With Custom Step
```tsx
<Slider
  id="slider"
  label="Amount"
  hint="Increments by 10"
  defaultValue={50}
  min={0}
  max={100}
  step={10}
/>
```

### With Custom Labels
```tsx
<Slider
  id="slider"
  label="Temperature"
  hint="Select temperature"
  defaultValue={20}
  min={0}
  max={40}
  minLabel="0°C"
  maxLabel="40°C"
/>
```

### Controlled Slider
```tsx
const [value, setValue] = useState(50);

<Slider
  id="controlled-slider"
  label="Volume"
  value={value}
  min={0}
  max={100}
  onSliderValueChange={setValue}
/>
```

### With Tooltip
```tsx
<Slider
  id="slider"
  label="Investment amount"
  hint="Select amount to invest"
  defaultValue={5000}
  min={0}
  max={10000}
  tooltipMessage="Your investment will be allocated across multiple funds"
  tooltipTriggerLabel="More information about investment amount"
/>
```

### With Custom Datatip
```tsx
<Slider
  id="slider"
  label="Price range"
  defaultValue={500}
  min={0}
  max={1000}
  getDatatipValue={(value) => `$${value}`}
/>
```

## Accessibility Requirements

**Required:**
- Provide a visible label
- Always provide a unique `id`
- Always use min and max values
- Ensure min and max are visible to users
- State must be announced to assistive technology

**Recommended:**
- Use `hint` to clarify purpose
- Use `aria-describedby` for additional context
- Ensure handle is keyboard accessible (arrow keys, Page Up/Down, Home/End)
- Provide screen reader labels for range

**Avoid:**
- Removing labels (violates WCAG 1.3.1 and 4.1.2)
- Hiding min/max values
- Using disabled sliders to communicate information
- Using for non-numeric values

## Anti-Patterns

❌ **Wrong:** No label
```tsx
<Slider id="slider" min={0} max={100} />
```

✅ **Correct:** Always provide a label
```tsx
<Slider 
  id="slider" 
  label="Amount" 
  hint="Hint text" 
  min={0} 
  max={100} 
/>
```

---

❌ **Wrong:** Hidden min/max values
```tsx
<Slider
  id="slider"
  label="Amount"
  min={0}
  max={100}
  minLabel=""
  maxLabel=""
/>
```

✅ **Correct:** Visible min/max  values
```tsx
<Slider
  id="slider"
  label="Amount"
  min={0}
  max={100}
/>
```

---

❌ **Wrong:** Too large range (e.g., -1000 to 1000)
```tsx
<Slider
  id="slider"
  label="Select value"
  min={-1000}
  max={1000}
/>
```

✅ **Correct:** Reasonable range
```tsx
<Slider
  id="slider"
  label="Select amount"
  min={0}
  max={100}
/>
```

---

❌ **Wrong:** Too small range (e.g., -2 to 2)
```tsx
<Slider
  id="slider"
  label="Rating"
  min={-2}
  max={2}
/>
```

✅ **Correct:** Use appropriate component for small ranges
```tsx
<RadioGroup legend="Rating" defaultValue="0">
  <RadioButton id="r-2" label="-2" value="-2" />
  <RadioButton id="r-1" label="-1" value="-1" />
  <RadioButton id="r0" label="0" value="0" />
  <RadioButton id="r1" label="1" value="1" />
  <RadioButton id="r2" label="2" value="2" />
</RadioGroup>
```

---

❌ **Wrong:** Using disabled slider
```tsx
<Slider
  id="slider"
  label="Amount"
  defaultValue={50}
  min={0}
  max={100}
  disabled={true}
/>
```

✅ **Correct:** Avoid disabled when possible; use informative text
```tsx
<div>
  <Label>Amount</Label>
  <p>Current selection: 50</p>
  {/* Or use aria-disabled={true} if slider must be shown */}
</div>
```

## Best Practices

- Use for selecting from a continuous range with instant feedback
- Provide visual feedback as user drags handle
- Avoid for ranges that are too large or too small
- Avoid for complex inputted values that are not numbers
- Don't use for manual typing of specific values (use Input instead)
- Always show min and max numeric values visually
- Keep hint text succinct and easy to read
- Avoid disabled sliders; use informative plain text alternative instead
- Use `aria-disabled=true` if disabled state is unavoidable
- Slider bar is clickable to jump to value

## Keyboard Controls

- **Tab** - Focus slider handle
- **Arrow Left/Right** - Decrease/increase value by 1 step (reversed in RTL)
- **Arrow Up/Down** - Increase/decrease value by 1 step
- **Page Up** - Increase value by step amount
- **Page Down** - Decrease value by step amount
- **Home** - Jump to minimum value
- **End** - Jump to maximum value

## Advanced Usage

### Custom Range Labels
```tsx
<Slider
  id="slider"
  label="Price range"
  defaultValue={5000}
  min={0}
  max={10000}
  minLabel="$0"
  maxLabel="$10K"
  getDatatipValue={(value) => `$${value}`}
  labelOverrides={{
    getSliderRangeScreenReaderLabel: (label, min, max) => 
      `${label} from ${min} to ${max} dollars`
  }}
/>
```

### With Tooltip and Custom Formatting
```tsx
<Slider
  id="investment"
  label="Investment percentage"
  hint="Percentage of portfolio"
  defaultValue={50}
  min={0}
  max={100}
  getDatatipValue={(value) => `${value}%`}
  tooltipMessage="This represents the percentage of your total portfolio allocated to this fund"
  tooltipTriggerLabel="More information about investment percentage"
/>
```

## Related Components

- **Stepper** - For precise numeric input with increment buttons
- **Input** - For manual numeric entry
- **Select** - For discrete value selection
