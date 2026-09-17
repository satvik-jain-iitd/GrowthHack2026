# SegmentedLinearTracker Component Reference

> AI agent-friendly reference for DLS SegmentedLinearTracker component

## Quick Reference

Displays progress through discrete steps with individual segments. Each segment represents a step and fills as progress advances. Shows "X of Y" label automatically.

## Import

```tsx
import {
  SegmentedLinearTracker,
  SegmentedLinearTrackerStep,
} from "@americanexpress/dls-react";
```

## Minimal Example

```tsx
<SegmentedLinearTracker currentStep={2}>
  <SegmentedLinearTrackerStep aria-label="Personal Information" />
  <SegmentedLinearTrackerStep aria-label="Payment Details" />
  <SegmentedLinearTrackerStep aria-label="Review" />
  <SegmentedLinearTrackerStep aria-label="Confirmation" />
</SegmentedLinearTracker>
```

## Label Overrides

**SegmentedLinearTrackerLabelOverrides**

| Property            | Type                                                  | Required | Description                                                                                                       |
| ------------------- | ----------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| getCurrentStepLabel | `(currentStep: number, totalSteps: number) => string` | No       | Callback that returns the text which describes the current step. Use this to customize the progress announcement. |

## Props API

**SegmentedLinearTracker Props**

| Prop           | Type                                 | Required | Default   | Description                                                     |
| -------------- | ------------------------------------ | -------- | --------- | --------------------------------------------------------------- |
| children       | ReactNode                            | No       | -         | The `SegmentedLinearTrackerStep` children.                      |
| currentStep    | number                               | Yes      | -         | The current step (1-indexed). Capped at step count if exceeded. |
| color          | `'brand'` \| `'success'`             | No       | `'brand'` | The color of the tracker.                                       |
| labelOverrides | SegmentedLinearTrackerLabelOverrides | No       | -         | Overrides for labels that have been defaulted in the component. |
| ...            | HTMLDivElement props                 | No       | -         | All standard HTML div attributes (className, style, etc.).      |

**SegmentedLinearTrackerStep Props**

| Prop        | Type                      | Required | Default | Description                                                             |
| ----------- | ------------------------- | -------- | ------- | ----------------------------------------------------------------------- |
| aria-label  | string                    | Yes      | -       | Accessible label for the step                                           |
| isCompleted | boolean                   | No       | -       | Whether step is completed (auto-managed by parent, do not set manually) |
| ...         | HTMLProgressElement props | No       | -       | All standard HTML progress element attributes (className, style, etc.). |

## Common Patterns

### Basic Multi-Step Form

```tsx
const [currentStep, setCurrentStep] = useState(1);

<SegmentedLinearTracker currentStep={currentStep}>
  <SegmentedLinearTrackerStep aria-label="Personal Information" />
  <SegmentedLinearTrackerStep aria-label="Address" />
  <SegmentedLinearTrackerStep aria-label="Payment" />
  <SegmentedLinearTrackerStep aria-label="Review" />
</SegmentedLinearTracker>;
```

### Success Color Theme

```tsx
<SegmentedLinearTracker currentStep={3} color="success">
  <SegmentedLinearTrackerStep aria-label="Personal Information" />
  <SegmentedLinearTrackerStep aria-label="Shipping Address" />
  <SegmentedLinearTrackerStep aria-label="Payment Method" />
  <SegmentedLinearTrackerStep aria-label="Review" />
</SegmentedLinearTracker>
```

### Custom Progress Label

```tsx
<SegmentedLinearTracker
  currentStep={2}
  labelOverrides={{
    getCurrentStepLabel: (current, total) => `Step ${current} out of ${total}`,
  }}
>
  <SegmentedLinearTrackerStep aria-label="Account Setup" />
  <SegmentedLinearTrackerStep aria-label="Preferences" />
  <SegmentedLinearTrackerStep aria-label="Verification" />
</SegmentedLinearTracker>
```

### Dynamic Step Count

```tsx
const steps = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Details" },
  { id: 3, label: "Review" },
];

<SegmentedLinearTracker currentStep={currentStep}>
  {steps.map((step) => (
    <SegmentedLinearTrackerStep key={step.id} aria-label={step.label} />
  ))}
</SegmentedLinearTracker>;
```

### Complete Form Flow

```tsx
const [currentStep, setCurrentStep] = useState(1);
const totalSteps = 4;

const handleNext = () => {
  if (currentStep < totalSteps) {
    setCurrentStep(currentStep + 1);
  }
};

const handleBack = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
  }
};

<div>
  <SegmentedLinearTracker currentStep={currentStep}>
    <SegmentedLinearTrackerStep aria-label="Contact Information" />
    <SegmentedLinearTrackerStep aria-label="Shipping Address" />
    <SegmentedLinearTrackerStep aria-label="Payment Method" />
    <SegmentedLinearTrackerStep aria-label="Order Review" />
  </SegmentedLinearTracker>

  <div className="margin-4-t">
    {currentStep > 1 && (
      <Button variant="secondary" onClick={handleBack}>
        Back
      </Button>
    )}
    {currentStep < totalSteps && (
      <Button variant="primary" onClick={handleNext}>
        Continue
      </Button>
    )}
    {currentStep === totalSteps && (
      <Button variant="primary" type="submit">
        Submit
      </Button>
    )}
  </div>
</div>;
```

## Accessibility Requirements

**Required:**

- Each `SegmentedLinearTrackerStep` must have an `aria-label` describing the step
- Steps must be in logical order
- Current step announcement is automatic via `aria-live="polite"`
- Native `<progress>` element used for each step (visually hidden but accessible)

**Recommended:**

- Use descriptive step labels that clearly indicate the step purpose
- Keep step labels concise (2-4 words)
- Provide visual heading or context above tracker
- Consider adding step details/instructions below tracker

**Avoid:**

- Don't use generic labels like "Step 1", "Step 2" (use descriptive names)
- Don't manually set `isCompleted` prop (parent component manages this)
- Don't change step order dynamically after initial render

## Anti-Patterns

❌ **Wrong: Generic step labels**

```tsx
<SegmentedLinearTracker currentStep={2}>
  <SegmentedLinearTrackerStep aria-label="Step 1" />
  <SegmentedLinearTrackerStep aria-label="Step 2" />
  <SegmentedLinearTrackerStep aria-label="Step 3" />
</SegmentedLinearTracker>
```

✅ **Correct: Descriptive step labels**

```tsx
<SegmentedLinearTracker currentStep={2}>
  <SegmentedLinearTrackerStep aria-label="Personal Information" />
  <SegmentedLinearTrackerStep aria-label="Payment Details" />
  <SegmentedLinearTrackerStep aria-label="Review and Submit" />
</SegmentedLinearTracker>
```

❌ **Wrong: 0-indexed currentStep**

```tsx
<SegmentedLinearTracker currentStep={0}>
  <SegmentedLinearTrackerStep aria-label="Step 1" />
</SegmentedLinearTracker>
```

✅ **Correct: 1-indexed currentStep**

```tsx
<SegmentedLinearTracker currentStep={1}>
  <SegmentedLinearTrackerStep aria-label="Personal Information" />
</SegmentedLinearTracker>
```

❌ **Wrong: Missing aria-label**

```tsx
<SegmentedLinearTracker currentStep={1}>
  <SegmentedLinearTrackerStep />
  <SegmentedLinearTrackerStep />
</SegmentedLinearTracker>
```

✅ **Correct: All steps have aria-label**

```tsx
<SegmentedLinearTracker currentStep={1}>
  <SegmentedLinearTrackerStep aria-label="Account Setup" />
  <SegmentedLinearTrackerStep aria-label="Preferences" />
</SegmentedLinearTracker>
```

❌ **Wrong: Manually setting isCompleted**

```tsx
<SegmentedLinearTracker currentStep={2}>
  <SegmentedLinearTrackerStep aria-label="Step 1" isCompleted={true} />
  <SegmentedLinearTrackerStep aria-label="Step 2" />
</SegmentedLinearTracker>
```

✅ **Correct: Let parent manage completion**

```tsx
<SegmentedLinearTracker currentStep={2}>
  <SegmentedLinearTrackerStep aria-label="Personal Information" />
  <SegmentedLinearTrackerStep aria-label="Payment Details" />
</SegmentedLinearTracker>
```

## Best Practices

- **Use for discrete steps:** Shows clear progression through defined stages
- **1-indexed steps:** `currentStep` starts at 1 (not 0)
- **Descriptive labels:** Each step should have meaningful `aria-label`
- **Consistent step count:** Don't dynamically add/remove steps after render
- **Visual context:** Pair with heading or instructions
- **Auto-calculated completion:** Parent automatically marks steps before `currentStep` as complete
- **Bounds protection:** If `currentStep` exceeds step count, displays step count
- **Color consistency:** Use `brand` for primary flows, `success` for successful completion states
- **Custom labels:** Use `labelOverrides.getCurrentStepLabel` for custom progress announcements
- **Responsive:** Segments scale proportionally on smaller viewports
- **Step navigation:** Combine with Back/Next buttons for form navigation

## Related Components

- [MultiStepTracker](multi-step-tracker.md) - Vertical step tracker with labels and descriptions
- [ContinuousLinearTracker](continuous-linear-tracker.md) - Progress bar with start/end labels
- [Progress](progress.md) - General progress indicators (linear/circular)
- [Button](button.md) - For step navigation controls
