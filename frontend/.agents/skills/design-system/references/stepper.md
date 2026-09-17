# Stepper Component Reference
> AI agent-friendly reference for DLS Stepper component

## Quick Reference
Stepper allows users to incrementally increase or decrease a numeric value using +/- buttons. Use for small, bounded adjustments where precision matters (e.g., quantity selection, rating values). Avoid for large ranges.

## Import
```tsx
import { Stepper } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Stepper 
  id="stepper" 
  label="Quantity" 
  hint="Choose up to 10 items" 
/>
```

## Props API

### Stepper
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier |
| label | string | Yes* | - | Visible label text |
| aria-labelledby | string | Yes* | - | ID of the element that labels the stepper |
| hint | string | No | - | Helper text |
| value | number \| null | No | - | Controlled value |
| defaultValue | number \| null | No | `1` | Initial value |
| min | number | No | - | Minimum allowed value |
| max | number | No | - | Maximum allowed value |
| step | number | No | `1` | Increment/decrement amount |
| disabled | boolean | No | - | @deprecated use aria-disabled instead. The disabled prop removes the element from the Accessibility Tree and prevents it from receiving focus.  |
| aria-disabled | boolean \| string | No | - | Accessible disabled state |
| aria-describedby | string | No | - | ID of description element |
| readOnly | boolean | No | `false` | Makes input read-only and can only be updated through the decrease/increase buttons |
| status | `'default'` \| `'success'` \| `'error'` | No | `'default'` | Visual status |
| statusMessage | string | No | - | Status/error message |
| isHintVisuallyHidden | boolean | No | - | Hides hint visually |
| decreaseIcon | ReactNode | No | IconMinus | Custom decrease icon |
| increaseIcon | ReactNode | No | IconPlus | Custom increase icon |
| onChange | `(event: ChangeEvent<HTMLInputElement> \| MouseEvent<HTMLButtonElement>, newValue: number \| null) => void` | No | - | Change handler (controlled) |
| labelOverrides | StepperLabelOverrides | No | - | Custom accessible labels |
| className | string | No | - | Additional CSS classes |

**\*Either `label` OR `aria-labelledby` must be provided** (at least one is required).

## Common Patterns

### Basic Stepper (has Min/Max)
```tsx
<Stepper
  id="quantity"
  label="Quantity"
  hint="Choose between 1 and 10"
  defaultValue={1}
  min={1}
  max={10}
/>
```

### With Custom Step
```tsx
<Stepper
  id="amount"
  label="Amount"
  hint="Increment by 10"
  defaultValue={50}
  min={0}
  max={100}
  step={10}
/>
```

### With Error State
```tsx
<Stepper
  id="stepper"
  label="Select quantity"
  hint="Required field"
  status="error"
  statusMessage="Please select a quantity"
  defaultValue={1}
  min={1}
  max={10}
/>
```

### Controlled Stepper
```tsx
const [value, setValue] = useState<number | null>(5);

<Stepper
  id="controlled"
  label="Select amount"
  value={value}
  min={1}
  max={20}
  onChange={(event, newValue) => setValue(newValue)}
/>
```

### Read-Only Stepper
```tsx
<Stepper
  id="readonly"
  label="Current selection"
  defaultValue={7}
  readOnly={true}
/>
```

## Accessibility Requirements

**Required:**
- Provide either a visible `label` or `aria-labelledby` (at least one)
- Always provide a unique `id`
- Use logical min/max values
- Disable buttons when limits are reached

**Recommended:**
- Use `hint` to clarify purpose or provide constraints (e.g., "Choose up to 10 cards")
- Use descriptive labels (not "Select number")
- Use sentence case for readability
- Never rely on visual placement alone

**Avoid:**
- Removing labels (violates WCAG 1.3.1 and 4.1.2)
- Using ALL CAPS (reduces readability)
- Allowing values to go beyond valid limits
- Ambiguous or decorative icons

## Anti-Patterns

❌ **Wrong:** No label
```tsx
<Stepper id="stepper" hint="HINT" />
```

✅ **Correct:** Always provide a label
```tsx
<Stepper 
  id="stepper" 
  label="Gift cards to purchase" 
  hint="Choose up to 10 cards" 
/>
```

---

❌ **Wrong:** ALL CAPS label
```tsx
<Stepper 
  id="stepper" 
  label="SELECT NUMBER" 
  hint="HINT" 
/>
```

✅ **Correct:** Sentence case
```tsx
<Stepper 
  id="stepper" 
  label="Statement period" 
  hint="Choose up to 12 months" 
/>
```

---

❌ **Wrong:** Vague label
```tsx
<Stepper id="stepper" label="Select number" />
```

✅ **Correct:** Descriptive label
```tsx
<Stepper 
  id="stepper" 
  label="Gift cards to purchase" 
  hint="Choose up to 10 cards" 
/>
```

---

❌ **Wrong:** Invalid default value
```tsx
<Stepper 
  id="stepper" 
  label="Quantity" 
  defaultValue={0} 
  min={1} 
/>
```

✅ **Correct:** Valid default within bounds
```tsx
<Stepper 
  id="stepper" 
  label="Quantity" 
  defaultValue={1} 
  min={1} 
/>
```

---

❌ **Wrong:** Using for large ranges (e.g., year selection 1900-2025)
```tsx
<Stepper 
  id="year" 
  label="Birth year" 
  min={1900} 
  max={2025} 
/>
```

✅ **Correct:** Use Select for large ranges
```tsx
<SelectNative label="Birth year" id="year">
  <SelectNativeOption value="">Select year</SelectNativeOption>
  <SelectNativeOption value="2025">2025</SelectNativeOption>
  <SelectNativeOption value="2024">2024</SelectNativeOption>
  {/* ... */}
</SelectNative>
```

---

❌ **Wrong:** Ambiguous icons
```tsx
<Stepper 
  id="stepper" 
  label="Amount" 
  decreaseIcon={<IconList />} 
  increaseIcon={<IconCard />} 
/>
```

✅ **Correct:** Clear, universal icons
```tsx
<Stepper 
  id="stepper" 
  label="Amount" 
  decreaseIcon={<IconMinus />} 
  increaseIcon={<IconPlus />} 
/>
```

## Best Practices

- Use for small, bounded numeric adjustments (quantity, ratings, etc.)
- Avoid for large ranges (use Select or text field instead)
- Choose appropriate `step` size based on context (1 for quantity, 0.5 for ratings, etc.)
- Set logical min/max values and disable buttons at limits
- Provide clear, descriptive labels (1-3 words)
- Use sentence case for readability  
- Use hint text to clarify format or behavior if needed
- Ensure label describes the purpose (e.g., "Gift cards to purchase")
- Use clear, universally recognizable icons (+/-)
- Disable minus icon at minimum value
- Disable plus icon at maximum value
- Mirror layout for RTL contexts
- Align labels according to reading direction (left for LTR, right for RTL)
- Keep stepper buttons visually adjacent to input field
- Don't hide +/- icons
- Don't center-align numbers inside field (reduces readability)
- Screen reader announces "Value updated, {value}" after increment/decrement
- Prevent non-digit keyboard input

## Advanced Usage

### Custom Increment Labels
```tsx
<Stepper
  id="stepper"
  label="Repayment period"
  hint="Select between 1 to 3 years"
  defaultValue={3}
  min={1}
  max={3}
  labelOverrides={{
    decreaseScreenReaderLabel: 'Decrease years',
    increaseScreenReaderLabel: 'Increase years',
    getScreenReaderLabel: (value) => `Years updated, ${value}`
  }}
/>
```

### Custom Icons
```tsx
<Stepper
  id="stepper"
  label="Rating"
  defaultValue={3}
  min={0}
  max={5}
  step={0.5}
  decreaseIcon={<IconChevronDown />}
  increaseIcon={<IconChevronUp />}
/>
```

### With Validation
```tsx
const [value, setValue] = useState<number | null>(0);
const hasError = (value ?? 0) < 1;

<Stepper
  id="required-stepper"
  label="Required quantity"
  hint="Minimum 1 item required"
  value={value}
  min={1}
  max={100}
  status={hasError ? 'error' : 'default'}
  statusMessage={hasError ? 'Please select at least 1 item' : ''}
  onChange={(event, newValue) => setValue(newValue)}
/>
```

### Using aria-labelledby Instead of label
```tsx
<div>
  <Heading level={3} variant="sans-medium-regular" id="quantity-heading">How many tickets?</Heading>
  <Stepper
    id="tickets"
    aria-labelledby="quantity-heading"
    defaultValue={2}
    min={1}
    max={10}
  />
</div>
```

## Related Components

- **Slider** - For selecting from a continuous range
- **Input** - For freeform numeric entry
- **Select** - For large numeric ranges
- **IconButton** - Used internally for increase/decrease buttons
