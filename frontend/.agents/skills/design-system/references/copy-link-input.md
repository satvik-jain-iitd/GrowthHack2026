# CopyLinkInput Component Reference
> AI agent-friendly reference for DLS CopyLinkInput component

## Quick Reference
Read-only input with a copy button for sharing links or text. Automatically copies content to clipboard and shows success/error feedback.

## Import
```tsx
import { CopyLinkInput } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<CopyLinkInput
  hint="Hint Text"
  id="copylink-input"
  label="Label"
  value="http://www.americanexpress.com"
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | The ID for the input field, necessary for accessibility and labeling |
| label | string | No | - | Text that's used as the visual and accessible label for the component |
| value | string \| number \| readonly string[] | No | - | The value of the input field (controlled) |
| name | string | No | - | The name attribute of the input field, will default to the id provided |
| autoComplete | string | No | - | Must be defined when the form control collects user personal data |
| required | boolean | No | - | Flag to allow for default validation message to show |
| onChange | ChangeEventHandler<HTMLInputElement> | No | - | The onChange event handler to attach to the input field (controlled) |
| aria-labelledby | string | No | - | Identifies the element (or elements) that labels the current element |
| aria-describedby | string | No | - | The id of the container of the text describing the input, intended for custom hint text |
| aria-disabled | boolean | No | - | If true, styles component as disabled and prevents interactivity |
| disabled | boolean | No | - | **Deprecated:** Use `aria-disabled` instead. Disables the copy button |
| hint | string | No | - | Hint text to assist the user, displayed above the input |
| isHintVisuallyHidden | boolean | No | - | If true, visually hides the hint text (it will still be accessible to screen readers) |
| status | FieldControlStatus | No | - | Default, error, or success state. Will use the value provided by the context when wrapped in a `FieldControl` component |
| statusMessage | string | No | - | The status message to be displayed if status is 'success' or 'error' |
| timeout | number | No | - | Timeout duration in milliseconds before resetting the status to default |
| onClick | MouseEventHandler<Element> | No | - | Callback function to handle clicks events on the copy button |
| onSuccess | () => void | No | - | Callback function triggered when the copy operation is successful |
| onError | () => void | No | - | Callback function triggered when the copy operation fails |
| onTimeout | () => void | No | - | Callback function triggered when the timeout elapses |
| containerProps | HTMLDivElement Props | No | - | Props to be spread onto the parent div container |
| copyButtonProps | IconButtonProps | No | - | Other props to be spread onto the copy button |
| labelOverrides | CopyLinkInputLabelOverrides | No | - | Overrides for labels that have been defaulted in the component |

## Common Patterns

### With Custom Timeout
```tsx
<CopyLinkInput
  id="referral"
  label="Referral Code"
  hint="Click to copy code"
  value="REF12345"
  timeout={3000}  // Reset after 3 seconds
/>
```

### With Success/Error Callbacks
```tsx
<CopyLinkInput
  id="share"
  label="Share URL"
  value="http://www.americanexpress.com"
  onSuccess={() => {
    console.log('Link copied!');
  }}
  onError={() => {
    console.error('Copy failed');
  }}
/>
```

### Controlled Status
```tsx
const [status, setStatus] = useState('default');

<CopyLinkInput
  id="code"
  label="Confirmation Code"
  value="1234"
  status={status}
  onSuccess={() => setStatus('success')}
  onError={() => setStatus('error')}
  onTimeout={() => setStatus('default')}
/>
```

## Accessibility Requirements

**Required:**
- Provide visible label
- Copy button has clear screen reader label ("Copy" - auto-provided)
- Success/error states announced to screen readers (auto-provided)
- Input is read-only (auto-applied)

**Recommended:**
- Use hint text to explain what will be copied
- Ensure adequate timeout for screen reader users to hear success message

**Avoid:**
- Making the input editable
- Using unclear labels
- Too short timeout durations

## Anti-Patterns

❌ **Don't use without label:**
```tsx
<CopyLinkInput
  id="link"
  value="https://example.com"
/>
```

✅ **Do provide clear label:**
```tsx
<CopyLinkInput
  id="link"
  label="Share Link"
  value="https://example.com"
/>
```

❌ **Don't use for non-copyable content:**
```tsx
<CopyLinkInput
  id="display"
  label="User Name"
  value={userName}
  disabled={true}  // Why have a copy button?
/>
```

✅ **Do use for shareable content:**
```tsx
<CopyLinkInput
  id="profile-link"
  label="Profile Link"
  value={profileUrl}
  hint="Share your profile"
/>
```

## Best Practices

- Use for URLs, codes, keys, or other text meant to be shared/copied
- Input is always read-only - users cannot edit the value
- Copy button uses browser's Clipboard API (`navigator.clipboard.writeText`)
- Success state shows automatically for `timeout` duration (default: 6s)
- Error state shows if clipboard API fails or value is not a string
- Status message announced to screen readers via `aria-live`
- Keep labels concise ("Share Link" not "Click here to copy the share link")
- Provide hint text for context when helpful
- Default timeout (6s) allows time for screen reader announcement

## Browser Support

Requires browser support for Clipboard API (`navigator.clipboard`). Falls back to error state if unavailable.

## Related Components
- [Input](input.md) - For editable text input
- [PasswordInput](password-input.md) - For sensitive data with show/hide toggle
- [Button](button.md) - For general action triggers