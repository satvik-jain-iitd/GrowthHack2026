# ContinuousLinearTracker Component Reference
> AI agent-friendly reference for DLS ContinuousLinearTracker component

## Quick Reference
ContinuousLinearTracker displays continuous progress as a horizontal bar with configurable start/end values. Unlike SegmentedLinearTracker which shows discrete steps, this component shows fluid progress between a minimum and maximum value. Ideal for file uploads, form completion percentages, and any task with measurable continuous progress.

## Import
```tsx
import { ContinuousLinearTracker } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<ContinuousLinearTracker value={45} min={0} max={100} />
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | number | Yes | - | The current value of the tracker |
| min | number | No | `0` | The min value of the tracker |
| max | number | No | `100` | The max value of the tracker |
| color | `'brand'` \| `'success'` | No | `'brand'` | The color of the tracker |
| weight | `'thin'` \| `'thick'` | No | `'thin'` | The variant of the tracker to determine progress bar thickness |
| variant | `'default'` \| `'minimal'` | No | `'default'` | When set to 'minimal', the tracker will not show the start and end text as built in labels. Please ensure the external labels communicate the same information, which is required to adhere to color contrast rules for accessibility |
| hasGradient | boolean | No | `false` | Enables a gradient for color 'brand' of tracker |
| completionText | string | No | - | Text to be shown above tracker when tracker is complete |
| icon | ReactNode | No | - | Icon to be shown with the tracker while in progress and complete. Size is set to 24px by 24px |
| hideTrackerStartText | boolean | No | - | If true, hides the start value label |
| hideTrackerEndText | boolean | No | - | If true, hides the end value/progress label |
| labelOverrides | ContinuousLinearTrackerLabelOverrides | No | - | Overrides for labels that have been defaulted in the component |

### Label Override Functions

| Function | Parameters | Default Return | Description |
|----------|------------|----------------|-------------|
| `getScreenReaderValueText` | `currentValue: number` | `"${currentValue}"` | Screen reader announcement for current value |
| `getScreenReaderLabel` | `min: number, max: number` | `"Progress bar from ${min} to ${max}"` | Screen reader label for the progress element |
| `getTrackerStartText` | `min: number` | `"${min}"` | Visible text at start of tracker |
| `getTrackerEndText` | `min: number, currentValue: number, max: number` | `"${currentValue} of ${max}"` | Visible text at end of tracker |

## Common Patterns

### Basic Progress Tracker
```tsx
<ContinuousLinearTracker 
  value={65} 
  min={0} 
  max={100} 
  completionText="You've successfully earned back your miles!"
  labelOverrides={{
    getScreenReaderValueText: (currentValue) => `${currentValue} miles`,
    getScreenReaderLabel: (min, max) => `Miles from ${min} to ${max}`,
    getTrackerStartText: (min) => `${min} miles`,
    getTrackerEndText: (_, currentValue, max) => `${currentValue} of ${max} miles`,
  }}
/>
```
<!-- 
### File Upload Progress
```tsx
const [uploadProgress, setUploadProgress] = useState(0);

<div>
  <h3>Uploading document.pdf</h3>
  <ContinuousLinearTracker 
    value={uploadProgress} 
    min={0} 
    max={100}
    completionText="Upload complete"
    labelOverrides={{
      getTrackerEndText: (min, current, max) => `${current}% uploaded`
    }}
  />
</div>
``` -->

### Thick Progress Bar with Gradient
```tsx
<ContinuousLinearTracker 
  value={65} 
  min={0} 
  max={100} 
  completionText="You've successfully earned back your miles!"
  labelOverrides={{
    getScreenReaderValueText: (currentValue) => `${currentValue} miles`,
    getScreenReaderLabel: (min, max) => `Miles from ${min} to ${max}`,
    getTrackerStartText: (min) => `${min} miles`,
    getTrackerEndText: (_, currentValue, max) => `${currentValue} of ${max} miles`,
  }}
  weight="thick"
  hasGradient={true}
/>
```

### Custom Icon Progress
```tsx
import { IconAirplane } from '@americanexpress/dls-icons';

<ContinuousLinearTracker 
  value={65} 
  min={0} 
  max={100} 
  completionText="You've successfully earned back your miles!"
  labelOverrides={{
    getScreenReaderValueText: (currentValue) => `${currentValue} miles`,
    getScreenReaderLabel: (min, max) => `Miles from ${min} to ${max}`,
    getTrackerStartText: (min) => `${min} miles`,
    getTrackerEndText: (_, currentValue, max) => `${currentValue} of ${max} miles`,
  }}
  weight="thick"
  hasGradient={true}
  icon={<IconAirplane />}
/>
```

### Hidden Start/End Labels
```tsx
 <div>
  <ContinuousLinearTracker
    hasGradient={true}
    hideTrackerEndText={true}
    hideTrackerStartText={true}
    icon={<IconAirplane />}
    max={1000}
    min={0}
    value={600}
    variant="minimal"
    weight="thick"
  />
  <div
    className="pad-1-t"
  >
    600 miles earned / 1000 miles
  </div>
</div>
```

## Accessibility Requirements

**Required:**
- Progress bar uses native `<progress>` element for screen reader compatibility
- Current value is automatically announced via aria-live region
- Completion text is announced when value reaches max
- If hiding visible labels, provide custom screen reader labels via `labelOverrides`
- Progress element must have accessible label (use `getScreenReaderLabel`)

**Recommended:**
- Provide `completionText` to announce when task is complete
- Keep label overrides concise and informative
- If progress represents a critical process, ensure visual feedback beyond the bar
- Use appropriate `color` to match your brand or context
- For long-running tasks, consider adding estimated time remaining

**Avoid:**
- Don't hide both start and end text without providing context elsewhere
- Don't use solely for decoration - must represent actual progress
- Don't update value too frequently (can overwhelm screen readers)
- Don't use for discrete steps - use SegmentedLinearTracker instead
- Don't rely on color alone to convey information (use labels too)

## Anti-Patterns

❌ **Wrong: No context when hiding labels**
```tsx
<ContinuousLinearTracker 
  value={50} 
  hideTrackerStartText={true}
  hideTrackerEndText={true}
/>
```
✅ **Correct: Provide context when hiding labels**
```tsx
<div>
  <p>Loading: 50%</p>
  <ContinuousLinearTracker 
    value={50} 
    hideTrackerStartText={true}
    hideTrackerEndText={true}
    labelOverrides={{
      getScreenReaderLabel: () => "Page loading progress"
    }}
  />
</div>
```

❌ **Wrong: Value exceeds max**
```tsx
<ContinuousLinearTracker value={150} min={0} max={100} />
```
✅ **Correct: Value clamped to valid range**
```tsx
const clampedValue = Math.min(Math.max(value, 0), 100);
<ContinuousLinearTracker value={clampedValue} min={0} max={100} />
```

❌ **Wrong: Using for discrete steps**
```tsx
<ContinuousLinearTracker value={2} min={1} max={5} />
```
✅ **Correct: Use SegmentedLinearTracker for discrete steps**
```tsx
<SegmentedLinearTracker currentStep={2} totalSteps={5} />
```

❌ **Wrong: No completion feedback**
```tsx
const [uploading, setUploading] = useState(true);
<ContinuousLinearTracker value={uploadProgress} min={0} max={100} />
```
✅ **Correct: Provide completion feedback**
```tsx
const [uploading, setUploading] = useState(true);
<ContinuousLinearTracker 
  value={uploadProgress} 
  min={0} 
  max={100}
  completionText="Upload complete! Your file is ready."
/>
```

## Best Practices

- **Value Management:**
  - Clamp value between min and max before passing to component
  - Component auto-clamps, but explicit clamping provides clarity
  - Update value smoothly for better user experience
  - For percentage-based progress, use min=0 and max=100
- **Labels:**
  - Provide clear, concise labels that describe what's progressing
  - Use `labelOverrides` to customize text for your use case
  - Always provide screen reader labels if hiding visual labels
  - Keep label text short (under 10 words)
- **Completion:**
  - Always provide `completionText` for screen reader announcement
  - Consider additional visual feedback (checkmark icon, success message)
  - Update UI state when progress reaches 100%
- **Visual Design:**
  - Use `thick` weight for prominent progress indicators
  - Use `thin` weight for subtle progress feedback
  - `hasGradient` adds visual polish for brand-colored bars
- **Performance:**
  - Don't update value more than once per second for smooth animation
  - Use debouncing or throttling for rapid changes (e.g., scroll progress)
  - Batch multiple small updates into larger increments
- **Custom Icons:**
  - Provide custom icon for branded or themed progress
  - Icon displays during progress, checkmark shows on completion
  - Icon must be from `@americanexpress/dls-icons`
- **Responsive:**
  - Progress bar scales to container width
  - Test on mobile devices to ensure labels remain readable
  - Consider hiding labels on very narrow screens

## Related Components
- [SegmentedLinearTracker](segmented-linear-tracker.md) - For discrete step progress
- [MultiStepTracker](multi-step-tracker.md) - For multi-step workflow progress  
- [Progress](progress.md) - For indeterminate or loading states