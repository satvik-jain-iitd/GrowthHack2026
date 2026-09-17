# Progress Component Reference

> AI agent-friendly reference for DLS Progress component

## Quick Reference

Progress indicators show the status of ongoing operations. Two variants available: linear (horizontal bar) and circular (ring). Both support determinate (known progress) and indeterminate (unknown duration) modes.

## Import

```tsx
import { ProgressLinear, ProgressCircular } from "@americanexpress/dls-react";
```

## Minimal Example

```tsx
// Determinate linear
<ProgressLinear isDeterminate value={75} />

// Indeterminate linear
<ProgressLinear />

// Determinate circular
<ProgressCircular isDeterminate value={50} />

// Indeterminate circular
<ProgressCircular />
```

## Props API

**ProgressLinear Props**

| Prop             | Type                           | Required    | Default                            | Description                                                      |
| ---------------- | ------------------------------ | ----------- | ---------------------------------- | ---------------------------------------------------------------- |
| isDeterminate    | boolean                        | No          | `false`                            | Whether progress has a known value                               |
| value            | number                         | Conditional | -                                  | Progress value 0-100 (required if `isDeterminate` is `true`)     |
| aria-describedby | string                         | No          | -                                  | ID of an element with a status message for indeterminate loaders |
| labelOverrides   | { screenReaderLabel?: string } | No          | `{ screenReaderLabel: 'Loading' }` | Custom labels for screen readers                                 |
| className        | string                         | No          | -                                  | Additional CSS classes                                           |

**ProgressCircular Props**

| Prop             | Type                           | Required    | Default                            | Description                                                      |
| ---------------- | ------------------------------ | ----------- | ---------------------------------- | ---------------------------------------------------------------- |
| isDeterminate    | boolean                        | No          | `false`                            | Whether progress has a known value                               |
| value            | number                         | Conditional | -                                  | Progress value 0-100 (required if `isDeterminate` is `true`)     |
| size             | 'sm' \| 'md' \| 'lg'           | No          | `'md'`                             | Size of circular indicator (indeterminate only)                  |
| aria-describedby | string                         | No          | -                                  | ID of an element with a status message for indeterminate loaders |
| labelOverrides   | { screenReaderLabel?: string } | No          | `{ screenReaderLabel: 'Loading' }` | Custom labels for screen readers                                 |
| className        | string                         | No          | -                                  | Additional CSS classes                                           |

## Common Patterns

### Page Loading (Indeterminate)

```tsx
<ProgressLinear />
```

### File Upload (Determinate)

```tsx
const [uploadProgress, setUploadProgress] = useState(0);

<ProgressLinear
  isDeterminate
  value={uploadProgress}
  labelOverrides={{ screenReaderLabel: "Uploading file" }}
/>;
```

### Multi-Step Form Progress

```tsx
const progress = (currentStep / totalSteps) * 100;

<ProgressLinear
  isDeterminate
  value={progress}
  labelOverrides={{
    screenReaderLabel: `Step ${currentStep} of ${totalSteps}`,
  }}
/>;
```

### Data Processing with Percentage

```tsx
const [processProgress, setProcessProgress] = useState(0);

<div>
  <ProgressLinear
    isDeterminate
    value={processProgress}
    labelOverrides={{
      screenReaderLabel: `Processing: ${processProgress}% complete`,
    }}
  />
  <p className="text-center margin-1-t">{processProgress}%</p>
</div>;
```

### Circular Progress Sizes

```tsx
// Small - for compact areas
<ProgressCircular size="sm" />

// Medium (default) - standard use
<ProgressCircular size="md" />

// Large - for prominent loading states
<ProgressCircular size="lg" />
```

### Conditional Progress Display

```tsx
{
  isLoading &&
    (uploadProgress !== undefined ? (
      <ProgressLinear isDeterminate value={uploadProgress} />
    ) : (
      <ProgressLinear />
    ));
}
```

### Payment Processing

```tsx
const [paymentProgress, setPaymentProgress] = useState(0);

<ProgressCircular
  isDeterminate
  value={paymentProgress}
  labelOverrides={{
    screenReaderLabel: `Processing payment: ${paymentProgress}% complete`,
  }}
/>;
```

### Section Loading

```tsx
<div className="padding-4">
  <ProgressLinear
    labelOverrides={{ screenReaderLabel: "Loading account details" }}
  />
</div>
```

## Accessibility Requirements

**Required:**

- Always provide meaningful `screenReaderLabel` via `labelOverrides`
- Use descriptive labels that indicate what is loading/processing

**Recommended:**

- Update `screenReaderLabel` to reflect current operation
- Provide context for what is being loaded/processed

**Avoid:**

- Don't use generic "Loading" for all progress - be specific
- Don't use progress without accessible labels
- Don't use progress for indefinite waits (use spinner or skeleton instead)
- Don't set `value` without `isDeterminate={true}`

## Anti-Patterns

❌ **Wrong: Missing screen reader label**

```tsx
<ProgressLinear isDeterminate value={50} />
```

✅ **Correct: Descriptive screen reader label**

```tsx
<ProgressLinear
  isDeterminate
  value={50}
  labelOverrides={{ screenReaderLabel: "Uploading document" }}
/>
```

❌ **Wrong: Value without isDeterminate**

```tsx
<ProgressLinear value={75} />
```

✅ **Correct: isDeterminate with value**

```tsx
<ProgressLinear isDeterminate value={75} />
```

❌ **Wrong: Generic loading label**

```tsx
<ProgressLinear labelOverrides={{ screenReaderLabel: "Loading" }} />
```

✅ **Correct: Specific loading label**

```tsx
<ProgressLinear
  labelOverrides={{ screenReaderLabel: "Loading account transactions" }}
/>
```

❌ **Wrong: Using for indefinite wait**

```tsx
// Don't use indeterminate progress if operation has no expected end
<ProgressLinear />
```

✅ **Correct: Use appropriate indicator**

```tsx
// Use skeleton or spinner for indefinite states
<Skeleton />
```

❌ **Wrong: Circular in horizontal space**

```tsx
<div style={{ width: "100%" }}>
  <ProgressCircular />
</div>
```

✅ **Correct: Linear in horizontal space**

```tsx
<div style={{ width: "100%" }}>
  <ProgressLinear />
</div>
```

## Best Practices

- **Variant selection:**
  - Use `ProgressLinear` for page-level loading and horizontal spaces
  - Use `ProgressCircular` for button loading states and compact areas
- **Determinate vs Indeterminate:**
  - Use determinate when progress is calculable (file upload, multi-step forms)
  - Use indeterminate when duration is unknown (API calls, data fetching)
- **Screen reader labels:**
  - Always provide descriptive labels
  - Update labels to reflect current operation
  - Include percentage for determinate progress
- **Visual hierarchy:**
  - Linear: Use for primary loading states spanning full width
  - Circular: Use for localized loading (buttons, cards, sections)
- **Size selection (circular only):**
  - `sm`: Buttons, inline elements
  - `md`: Standard loading areas
  - `lg`: Prominent page sections
- **User feedback:**
  - Show progress for operations > 2 seconds
  - Pair with descriptive text when possible
  - Announce completion to screen readers

## Related Components

- [ContinuousLinearTracker](continuous-linear-tracker.md) - For goal progress with start/end labels
- [SegmentedLinearTracker](segmented-linear-tracker.md) - For discrete step progress
- [MultiStepTracker](multi-step-tracker.md) - For multi-step workflow progress
- [Button](button.md) - Has built-in `isLoading` prop for button loading states
