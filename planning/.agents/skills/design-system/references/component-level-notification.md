# ComponentLevelNotification Component Reference
> AI agent-friendly reference for DLS Component Level Notification component

## Quick Reference
Inline notifications that provide contextual feedback at the component level. Use for form validation, success messages, or component-specific errors.

## Import
```tsx
import { ComponentLevelNotification } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<ComponentLevelNotification status="error">
  Please enter a valid email address
</ComponentLevelNotification>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| status | 'error' \| 'success' | No | 'error' | Notification status/variant |
| showIcon | boolean | No | true | Whether to display status icon |
| show | boolean | No | true | Whether to show the notification |
| isIconFilled | boolean | No | true | Whether icon is filled or outlined |
| id | string | No | - | Unique identifier |
| aria-live | 'polite' \| 'assertive' \| 'off' | No | - | ARIA live region politeness |
| role | 'status' \| 'log' \| 'alert' \| 'progressbar' \| 'marquee' \| 'timer' | No | - | ARIA role override |
| className | string | No | - | Additional CSS classes |
| children | ReactNode | Yes | - | Notification message content |

## Common Patterns

### Error Notification
```tsx
<ComponentLevelNotification status="error">
  Please enter a valid email address
</ComponentLevelNotification>
```

### Success Notification
```tsx
<ComponentLevelNotification status="success">
  Your changes have been saved
</ComponentLevelNotification>
```

### Without Icon
```tsx
<ComponentLevelNotification status="error" showIcon={false}>
  This field is required
</ComponentLevelNotification>
```

### With Outlined Icon
```tsx
<ComponentLevelNotification status="success" isIconFilled={false}>
  File uploaded successfully
</ComponentLevelNotification>
```

### Conditional Display
```tsx
<ComponentLevelNotification status="error" show={hasError}>
  {errorMessage}
</ComponentLevelNotification>
```

## Accessibility Requirements

**Required:**
- Provide clear, descriptive error messages
- Use appropriate aria-live politeness ('polite' for non-critical, 'assertive' for urgent)
- Ensure notifications are announced to assistive technology
- Component must have message content (accessibility requirement for errors)

**Recommended:**
- Keep messages concise and actionable
- Use 'polite' for most notifications (default behavior)
- Use 'assertive' sparingly for time-sensitive/critical messages
- Position below associated input fields for predictability

**Avoid:**
- Using only icons without text
- Vague or generic error messages
- Using as only means of conveying critical information
- Changing content order unpredictably

## Anti-Patterns

❌ **WRONG: Vague error message**
```tsx
<ComponentLevelNotification status="error">
  Invalid input
</ComponentLevelNotification>
```

✅ **CORRECT: Specific, actionable message**
```tsx
<ComponentLevelNotification status="error">
  Email must contain @ symbol and domain name
</ComponentLevelNotification>
```

❌ **WRONG: No message content**
```tsx
<ComponentLevelNotification status="error" />
```

✅ **CORRECT: Always include message**
```tsx
<ComponentLevelNotification status="error">
  This field is required
</ComponentLevelNotification>
```

## Best Practices

**When to Use:**
- Form field validation errors
- Component-specific success messages
- Inline contextual feedback
- Error messages below inputs
- Status updates for component actions

**When Not to Use:**
- Page-level messages (use PageLevelNotification)
- Critical alerts requiring immediate action (use AlertDialog)
- Marketing promo or general information
- With animations or timeouts

**Message Writing:**
- Get straight to the point with important information
- Tell users what they need to know
- Make users feel supported
- Make next action easy to understand
- Own up to mistakes, be proactive in fixing them
- Use interface-agnostic language ("select" not "click")
- Avoid directional language ("select submit button" not "select red button below")
- End messages with period
- Write at 8th grade reading level

**Error Message Guidelines:**
- Focus on the problem and solution
- Explain what happened and why
- Tell users what they can do to fix it
- Be succinct and conversational
- Avoid over-explaining technical issues
- Don't apologize excessively
- Guide users with specific actions

**Content to Avoid:**
- Being verbose or wasting time
- Making users guess the error
- Hiding key information
- Using curt, threatening, or accusatory language
- Making generalizations
- Technical jargon or confusing phrases
- Referring to "American Express" (use "we" or "us")

**Placement:**
- Appear below inputs for predictability
- Exception: date picker (above calendar)
- Don't change component content order
- Keep forms predictable throughout experience

**Status Usage:**
- **Error**: Negative messages requiring immediate attention, errors, security impacts
- **Success**: Successful completion of action, include next steps when helpful
- **Caution**: NOT supported for component-level (only for icons)

## Advanced Usage

### Dynamic Error Message
```tsx
function ValidatedInput() {
  const [error, setError] = useState('');
  
  const validate = (value) => {
    if (!value) {
      setError('This field is required');
    } else if (value.length < 3) {
      setError('Must be at least 3 characters');
    } else {
      setError('');
    }
  };
  
  return (
    <div className="flex flex-column stack">
      <Label htmlFor="password-input">Password</Label>
      <Input id="password-input" aria-describedby="password-status-message" onChange={(e) => validate(e.target.value)} />
      {error && (
        <ComponentLevelNotification id="password-status-message" status="error">
          {error}
        </ComponentLevelNotification>
      )}
    </div>
  );
}
```

## Related Components
- [FieldControl](field-control.md) - For form field context
- [PageLevelNotification](page-level-notification.md) - For page-wide alerts
- [AlertDialog](alert-dialog.md) - For critical alerts
- [Input](input.md) - For form inputs
