# MultiStepTracker Component Reference
> AI agent-friendly reference for DLS MultiStepTracker component

## Quick Reference
Multi-step trackers indicate progress through a series of linear, discrete steps. Each step can have substeps, icons, and security indicators. Available in default (vertical, detailed) and compact (simplified) variants that automatically switch based on viewport size.

## Import
```tsx
import { MultiStepTracker, Step } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<MultiStepTracker 
  currentStep={2}
  labelOverrides={{ 'aria-label': 'Application Progress' }}
>
  <Step label="Account Setup" icon={<IconPerson />} />
  <Step label="Security Check" icon={<IconLock />} />
  <Step label="Review" icon={<IconDocument />} />
  <Step label="Complete" icon={<IconCheck />} />
</MultiStepTracker>
```

## Props API

**MultiStepTracker Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | No | - | Unique identifier for the multi-step tracker. |
| children | NonNullable<ReactNode> | Yes | - | Child elements of the multi-step tracker, typically Step components. |
| currentStep | number | No | 1 | The current step number in the multi-step tracker. |
| currentSubStep | number | No | - | The current sub-step number within the current step. |
| variant | "default" \| "compact" | No | - | The variant of the multi-step tracker, can be 'default' or 'compact'. |
| labelOverrides | MultiStepTrackerLabelOverrides | No | - | Overrides for labels that have been defaulted in the component. |


**Step Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | string | Yes | - | Step label text |
| icon | ReactElement | No | - | Icon component to display |
| subStepLabels | string[] | No | - | Array of substep labels |
| securityConfig | { isLocked: boolean; screenReaderLabel: string } | No | - | Security step configuration |
| labelOverrides | { getStatusScreenReaderLabel?: (isCompleted: boolean) => string } | No | - | Custom status labels |

## Common Patterns

### Basic 4-Step Process
```tsx
<MultiStepTracker 
  currentStep={2}
  labelOverrides={{ 'aria-label': 'Account Setup' }}
>
  <Step label="Personal Information" />
  <Step label="Payment Details" />
  <Step label="Review" />
  <Step label="Confirmation" />
</MultiStepTracker>
```

### With Icons
```tsx
<MultiStepTracker 
  currentStep={1}
  labelOverrides={{ 'aria-label': 'Card Application' }}
>
  <Step label="Account Setup" icon={<IconPerson />} />
  <Step label="Card Selection" icon={<IconCreditCard />} />
  <Step label="Identity Verification" icon={<IconShield />} />
  <Step label="Review and Submit" icon={<IconDocument />} />
</MultiStepTracker>
```

### With Substeps
```tsx
const [currentStep, setCurrentStep] = useState(1);
const [currentSubStep, setCurrentSubStep] = useState(1);

<MultiStepTracker 
  currentStep={currentStep}
  currentSubStep={currentSubStep}
  labelOverrides={{ 'aria-label': 'Registration Process' }}
>
  <Step 
    label="Personal Information"
    icon={<IconPerson />}
    subStepLabels={['Name and Address', 'Contact Details', 'Date of Birth']}
  />
  <Step 
    label="Account Setup"
    icon={<IconSettings />}
    subStepLabels={['Username', 'Password', 'Security Questions']}
  />
  <Step 
    label="Confirmation"
    icon={<IconCheck />}
  />
</MultiStepTracker>
```

### With Security Steps
```tsx
<MultiStepTracker 
  currentStep={2}
  labelOverrides={{ 'aria-label': 'Secure Application' }}
>
  <Step 
    label="Personal Details"
    icon={<IconPerson />}
    securityConfig={{
      isLocked: true,
      screenReaderLabel: 'Secure step: Personal Details'
    }}
  />
  <Step 
    label="Identity Verification"
    icon={<IconShield />}
    securityConfig={{
      isLocked: true,
      screenReaderLabel: 'Secure step: Identity Verification'
    }}
  />
  <Step 
    label="Review"
    icon={<IconDocument />}
  />
</MultiStepTracker>
```

### Compact Variant
```tsx
<MultiStepTracker 
  currentStep={2}
  currentSubStep={1}
  variant="compact"
  labelOverrides={{ 'aria-label': 'Quick Setup' }}
>
  <Step 
    label="Basic Info"
    subStepLabels={['Name', 'Email', 'Phone']}
  />
  <Step 
    label="Preferences"
    subStepLabels={['Notifications', 'Privacy']}
  />
  <Step label="Done" />
</MultiStepTracker>
```

### Complete Flow with Navigation
```tsx
const [currentStep, setCurrentStep] = useState(1);
const [currentSubStep, setCurrentSubStep] = useState(1);

const steps = [
  { 
    label: 'Account Information',
    substeps: ['Email', 'Password', 'Profile']
  },
  { 
    label: 'Verification',
    substeps: ['Phone Number', 'OTP Code']
  },
  { 
    label: 'Complete',
    substeps: []
  }
];

const totalSubSteps = steps[currentStep - 1]?.substeps.length || 0;

const handleNext = () => {
  if (totalSubSteps > 0 && currentSubStep < totalSubSteps) {
    setCurrentSubStep(currentSubStep + 1);
  } else if (currentStep < steps.length) {
    setCurrentStep(currentStep + 1);
    setCurrentSubStep(1);
  }
};

<div>
  <MultiStepTracker 
    currentStep={currentStep}
    currentSubStep={totalSubSteps > 0 ? currentSubStep : undefined}
    labelOverrides={{ 'aria-label': 'Registration' }}
  >
    {steps.map((step, index) => (
      <Step 
        key={index}
        label={step.label}
        subStepLabels={step.substeps.length > 0 ? step.substeps : undefined}
      />
    ))}
  </MultiStepTracker>
  
  <div className="margin-4-t">
    <Button variant="primary" onClick={handleNext}>
      Continue
    </Button>
  </div>
</div>
```

### Add Page Headings if Compact Variant
```tsx
<div>
  <MultiStepTracker 
    currentStep={2}
    labelOverrides={{ 'aria-label': 'Application Steps' }}
    variant="compact"
  >
    <Step label="Personal Details" />
    <Step label="Employment Information" />
    <Step label="Review" />
  </MultiStepTracker>
  
  <Heading className="margin-4-t">Employment Information</Heading>
  <p>Please provide your current employment details.</p>
  {/* Form fields... */}
</div>
```

### Dynamic Steps from Data
```tsx
const applicationSteps = [
  { id: 1, label: 'Basic Information' },
  { id: 2, label: 'Address' },
  { id: 3, label: 'Review' }
];

<MultiStepTracker 
  currentStep={currentStep}
  labelOverrides={{ 'aria-label': 'Application Progress' }}
>
  {applicationSteps.map(step => (
    <Step 
      key={step.id}
      label={step.label}
    />
  ))}
</MultiStepTracker>
```

## Variants

| Variant | Description | Use Case | Responsive Behavior |
|---------|-------------|----------|---------------------|
| **Default** | Vertical layout with full step details, icons, and connecting lines | Large breakpoints, detailed workflows | Switches to compact <500px width |
| **Compact** | Simplified horizontal dots with active step label | Small breakpoints, sidebar layouts, mobile | Default on mobile devices |

## Accessibility Requirements

**Required:**
- Provide `aria-label` via `labelOverrides` to identify the tracker
- Each Step must have a descriptive `label` (not generic like "Step 1")
- Substeps must have descriptive labels in `subStepLabels` array
- If using `securityConfig`, provide descriptive `screenReaderLabel`
- Each step page should have a unique heading (h1-h6) matching the step label
- Maintain logical step order (don't reorder after initial render)

**Recommended:**
- Use h2-h6 for step headings on the page (h1 for main page title)
- Show current step label prominently on compact variant
- Keep step count to 5 or fewer (use substeps for complex flows)
- Limit substeps to 3 per step
- Provide progress updates via `aria-live` regions (built-in)
- Use simple, well-known icons with consistent meaning

**Avoid:**
- Don't use generic labels ("Step 1", "Step 2") - be descriptive
- Don't change step order dynamically after initial render
- Don't exceed 5 main steps (break into separate journeys or use substeps)
- Don't use complex or ambiguous icons
- Don't use different icons for same step in different states
- Don't rely solely on icons (always include labels)

## Anti-Patterns

❌ **Wrong: Generic step labels**
```tsx
<MultiStepTracker currentStep={1}>
  <Step label="Step 1" />
  <Step label="Step 2" />
  <Step label="Step 3" />
</MultiStepTracker>
```
✅ **Correct: Descriptive step labels**
```tsx
<MultiStepTracker 
  currentStep={1}
  labelOverrides={{ 'aria-label': 'Account Setup' }}
>
  <Step label="Personal Information" />
  <Step label="Security Settings" />
  <Step label="Review and Complete" />
</MultiStepTracker>
```

❌ **Wrong: Missing aria-label**
```tsx
<MultiStepTracker currentStep={1}>
  <Step label="Account" />
  <Step label="Payment" />
</MultiStepTracker>
```
✅ **Correct: Provide accessible label**
```tsx
<MultiStepTracker 
  currentStep={1}
  labelOverrides={{ 'aria-label': 'Checkout Process' }}
>
  <Step label="Account" />
  <Step label="Payment" />
</MultiStepTracker>
```

❌ **Wrong: Too many main steps**
```tsx
<MultiStepTracker currentStep={1}>
  <Step label="Step 1" />
  <Step label="Step 2" />
  <Step label="Step 3" />
  <Step label="Step 4" />
  <Step label="Step 5" />
  <Step label="Step 6" />
  <Step label="Step 7" />
</MultiStepTracker>
```
✅ **Correct: Use substeps or break into separate journeys**
```tsx
<MultiStepTracker currentStep={1} currentSubStep={1}>
  <Step 
    label="Personal Information"
    subStepLabels={['Name', 'Address', 'Contact']}
  />
  <Step 
    label="Account Setup"
    subStepLabels={['Username', 'Password']}
  />
  <Step label="Review" />
</MultiStepTracker>
```

❌ **Wrong: No page heading for current step**
```tsx
<MultiStepTracker currentStep={2}>
  <Step label="Account" />
  <Step label="Payment" />
  <Step label="Review" />
</MultiStepTracker>
<p>Enter your payment details</p>
```
✅ **Correct: Include heading matching current step**
```tsx
<MultiStepTracker currentStep={2}>
  <Step label="Account" />
  <Step label="Payment Details" />
  <Step label="Review" />
</MultiStepTracker>

<Heading>Payment Details</Heading>
<p>Enter your payment information below.</p>
```

❌ **Wrong: Inconsistent icons for same step**
```tsx
<MultiStepTracker currentStep={1}>
  <Step label="Payment" icon={<IconCreditCard />} />
  <Step label="Payment" icon={<IconCardBenefit />} />
</MultiStepTracker>
```
✅ **Correct: Consistent icons across states**
```tsx
<MultiStepTracker currentStep={1}>
  <Step label="Account Info" icon={<IconPerson />} />
  <Step label="Payment Info" icon={<IconCreditCard />} />
</MultiStepTracker>
```

## Best Practices

- **Step count:** Aim for 5 or fewer main steps. Use substeps to break down complex processes
- **Substeps:** Maximum 3 substeps per step for optimal UX
- **Labels:**
  - Use short, descriptive labels (2-4 words)
  - Each step needs a unique heading on the page
  - Each substep needs a unique heading on the page
- **Icons:**
  - Use simple, well-known visual metaphors (person, card, lock, check)
  - Keep icons consistent (don't change icon for same concept)
  - Consider localization (some symbols have different meanings globally)
  - Icons supplement labels, never replace them
- **Variant selection:**
  - Use `default` for larger viewports with detail-rich workflows
  - Use `compact` for sidebars or when space is limited
  - Automatic responsive switching handles mobile (<500px)
- **Progress state:**
  - `currentStep` is 1-indexed (starts at 1, not 0)
  - Steps before currentStep are marked completed
  - Current step is marked in-progress
  - Steps after currentStep are marked upcoming
- **Page structure:**
  - Always have a unique h1-h6 heading for each step/substep
  - Place tracker prominently at top of content area
  - Provide clear navigation (Back/Next buttons)
- **Security steps:**
  - Use `securityConfig` between steps requiring authentication/verification
  - Provide descriptive `screenReaderLabel`
  - Security visual appears between steps, not on a step itself
- **Responsive:** Automatically switches to compact variant on small screens and reflows gracefully

## Related Components
- [SegmentedLinearTracker](segmented-linear-tracker.md) - For simpler discrete step progress without detailed labels
- [ContinuousLinearTracker](continuous-linear-tracker.md) - For goal-based progress with start/end values
- [Progress](progress.md) - For determinate/indeterminate loading states
- [Button](button.md) - For step navigation controls

