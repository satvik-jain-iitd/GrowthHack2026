# Button Component Reference
> AI agent-friendly reference for DLS Button component

## Quick Reference
Buttons trigger actions on the page. They can contain a label and/or icon and come in three variants: primary, secondary, and tertiary.

## Import
```tsx
import { Button } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Button variant="primary">Submit</Button>
```

## Props API

| Prop | Type | Required | Default   | Description |
|------|------|----------|-----------|-------------|
| children | `ReactNode` | No | -         | Contents of button body |
| variant | `'primary'` \| `'secondary'` \| `'tertiary'` | No | `primary` | Determines style of button |
| icon | `ReactNode` | No | -         | Custom icon displayed in button |
| iconPosition | `'start'` \| `'end'` | No | `start`   | Place icon before or after text |
| isLoading | boolean | No | `false`   | If true, shows loading button with spinner |
| disabled | boolean | No | `false`   | **Deprecated:** Use `aria-disabled` instead. Removes element from Accessibility Tree and prevents focus |
| aria-disabled | boolean | No | `false`    | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled" |
| onClick | `MouseEventHandler<HTMLButtonElement>` | No | -         | The event handler for click events on button, disabled for disabled buttons |
| reactlytics | `ReactlyticsProp` | No | -         | Analytics tracking prop |
| labelOverrides | `ButtonLabelOverrides` | No | -         | Overrides for labels that have been defaulted in the component |

## Common Patterns

### Primary, Secondary, Tertiary Variants
```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="tertiary">Tertiary Action</Button>
```

### Button with Icon
```tsx
<Button 
  variant="primary" 
  icon={<IconSetting size="md" />} 
  iconPosition="start"
>
  Settings
</Button>

<Button 
  variant="secondary" 
  icon={<IconDownload size="md" />} 
  iconPosition="end"
>
  Download
</Button>
```

### Loading State
```tsx
<Button variant="primary" isLoading={true}>
  Processing
</Button>

<Button 
  variant="primary" 
  isLoading={true}
  labelOverrides={{ loadingScreenReaderLabel: 'Saving your data' }}
>
  Save
</Button>
```

### Disabled State
```tsx
// Prefer aria-disabled (keeps in tab order, announced to screen readers)
<Button variant="primary" aria-disabled="true">
  Submit
</Button>
```

### Button with Custom Icon Color
```tsx
<Button
  variant="secondary"
  icon={<IconWarning size="md" color="critical" isColorImportant={true} />}
>
  View Errors
</Button>
```

### Form Submit Button
```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" variant="primary">
    Submit Form
  </Button>
</form>
```

### Grouped Buttons (Horizontal)
```tsx
<div className="flex stack-1-r">
  <Button variant="secondary">Back</Button>
  <Button variant="primary">Save and Complete</Button>
</div>
```

### Stacked Buttons (Vertical)
```tsx
<div className="flex flex-column stack">
  <Button variant="primary">
    Save and Complete
  </Button>
  <Button variant="secondary">
    Back
  </Button>
</div>
```

## Accessibility Requirements

**Required:**
- Always provide a visible or accessible label
- Prefer `aria-disabled` over `disabled` for better accessibility
- Use `loadingScreenReaderLabel` when `isLoading` is true
- Use descriptive labels (not generic like "Learn More")

**Recommended:**
- Use verb + noun construction for labels (e.g., "View Account Details")
- Keep labels short (1-3 words, max 5)
- Use title case for labels
- Avoid personal pronouns in labels

**Avoid:**
- Don't rely solely on color to indicate button state
- Don't use disabled buttons to communicate information
- Don't disable submit buttons until form is complete (use validation instead)
- Don't use ellipsis to truncate button labels

## Anti-Patterns

❌ **Wrong: Button for navigation**
```tsx
<Button onClick={() => navigate('/account')}>View Account</Button>
```
✅ **Correct: Use Link for navigation**
```tsx
<Link href="/account">View Account</Link>
```

❌ **Wrong: Multiple primary buttons in a group**
```tsx
<div>
  <Button variant="primary">Save</Button>
  <Button variant="primary">Submit</Button>
</div>
```
✅ **Correct: One primary, rest secondary or tertiary**
```tsx
<div>
  <Button variant="secondary">Save Draft</Button>
  <Button variant="primary">Submit</Button>
</div>
```

❌ **Wrong: Generic button label**
```tsx
<Button variant="primary">Click Here</Button>
```
✅ **Correct: Descriptive label**
```tsx
<Button variant="primary">View Account Details</Button>
```

❌ **Wrong: Primary button before secondary**
```tsx
<div className="flex">
  <Button variant="primary">Submit</Button>
  <Button variant="secondary">Cancel</Button>
</div>
```
✅ **Correct: Primary appears in rightmost position when horizontal**
```tsx
<div className="flex">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Submit</Button>
</div>
```
✅ **Correct: Primary appears at top when stacked vertically**
```tsx
<div className="flex flex-column">
  <Button variant="primary">Submit</Button>
  <Button variant="secondary">Cancel</Button>
</div>
```

❌ **Wrong: Disabled button without alternative**
```tsx
<Button aria-disabled={true}>Add to Cart</Button>
```
✅ **Correct: Provide informative alternative**
```tsx
<p>Out of stock</p>
```

## Best Practices

- **Use for actions:** completing tasks, submitting forms, triggering modals
- **Not for navigation:** use Link components for page navigation
- **One primary per page:** avoid multiple primary buttons
- **Button labels:** 1-3 words, verb + noun, specific action, title case
- **Icon selection:** use simple, well-known icons with consistent meaning
- **Horizontal layout:** group related actions, primary button last (rightmost)
- **Vertical layout:** stack with equal widths, primary on top
- **Disabled states:** avoid when possible; use `aria-disabled="true"` over `disabled`
- **Responsive:** stack buttons on mobile with primary on top

## Related Components
- [IconButton](icon-button.md) - Icon-only buttons
- [ButtonBase](button-base.md) - Unstyled button foundation
- [SplitButton](split-button.md) - Primary action with nested options
- [Links](links.md) - For navigation
