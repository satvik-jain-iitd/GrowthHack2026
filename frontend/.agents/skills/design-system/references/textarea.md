# Textarea Component Reference
> AI agent-friendly reference for DLS Textarea component

## Quick Reference
Multi-line text input for collecting longer text content. Use when users need to input more than one line of text.

## Import
```tsx
import { Textarea } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Textarea
  id="message"
  label="Message"
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | The ID for the textarea field, necessary for accessibility and labeling. |
| label | string | Yes* | - | Text that's used as the visual and accessible label for the component. If not provided, hide the component's built-in label. |
| aria-labelledby | string | Yes* | - | The id of a label, which provides an accessible name for the component. Identifies the element (or elements) that labels the current element. |
| hint | string | No | - | Hint text to assist the user, displayed below the textarea. |
| isHintVisuallyHidden | boolean | No | `false` | If true, visually hides the hint text (it will still be accessible to screen readers) |
| status | `'default'` \| `'error'` \| `'success'` | No | `'default'` | Default, error, or success state. Will use the value provided by the context when wrapped in a `FieldControl` component. |
| statusMessage | string | No | - | The status message to be displayed if status is 'success' or 'error'. |
| rows | number | No | `5` | Number of visible text lines |
| cols | number | No | `50` | Visible width in average character widths |
| disabled | boolean | No | - | @deprecated use `aria-disabled` instead. The `disabled` prop **removes** the element from the Accessibility Tree and prevents it from receiving focus. |
| aria-disabled | boolean \| `'true'` \| `'false'` | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled". |
| aria-describedby | string | No | - | ID of element providing additional description |
| value | string | No | - | The value of the textarea (controlled) |
| defaultValue | string | No | - | The default value of the textarea (uncontrolled) |
| onChange | ChangeEventHandler<HTMLTextAreaElement> | No | - | Callback function when value changes |
| onBlur | FocusEventHandler<HTMLTextAreaElement> | No | - | Callback function when textarea loses focus |
| onFocus | FocusEventHandler<HTMLTextAreaElement> | No | - | Callback function when textarea gains focus |
| placeholder | string | No | - | Placeholder text (discouraged - use hint instead) |
| maxLength | number | No | - | Maximum number of characters allowed |
| minLength | number | No | - | Minimum number of characters required |
| required | boolean | No | `false` | Whether the field is required |
| readOnly | boolean | No | `false` | Whether the textarea is read-only |
| autoComplete | string | No | - | Autocomplete attribute value |
| name | string | No | - | Name attribute for the textarea |
| className | string | No | - | Additional CSS classes |
| tooltip | ReactElement<typeof Tooltip> | No | - | InfoTooltip within the label, aligned to the right |

**\*Either `label` OR `aria-labelledby` must be provided** (at least one is required).

**Note:** Textarea extends `ComponentPropsWithRef<'textarea'>`, so it accepts all native textarea element props including `wrap`, `spellCheck`, `autoFocus`, etc.

## Common Patterns

### With Custom Row/Column Size
```tsx
<Textarea
  id="message"
  label="Message"
  rows={10}
  cols={80}
/>
```

### With Character Limit
```tsx
<Textarea
  id="bio"
  label="Bio"
  hint="Maximum 500 characters"
  maxLength={500}
/>
```

### With Validation Error
```tsx
<Textarea
  id="feedback"
  label="Feedback"
  status="error"
  statusMessage="Feedback must be at least 10 characters"
/>
```

### With Success State
```tsx
<Textarea
  id="feedback"
  label="Feedback"
  status="success"
  statusMessage="Thank you for your feedback"
/>
```

### Controlled Textarea
```tsx
const [value, setValue] = useState('');

<Textarea
  id="comments"
  label="Comments"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Optional Field
```tsx
<Textarea
  id="comments"
  label="Additional Comments (Optional)"
  rows={4}
/>
```

### Read-Only
```tsx
<Textarea
  id="terms"
  label="Terms and Conditions"
  value={termsText}
  readOnly={true}
  rows={10}
/>
```

### Disabled
```tsx
<Textarea
  id="disabled-field"
  label="Disabled Field"
  aria-disabled="true"
  value="Cannot edit this"
/>
```

### With Tooltip
```tsx
<Textarea
  id="description"
  label="Description"
  tooltip={<Tooltip>Additional information about this field</Tooltip>}
/>
```

### Required Field
```tsx
<Textarea
  id="reason"
  label="Reason for request"
  required={true}
  hint="This field is required"
/>
```

### Using aria-labelledby Instead of label
```tsx
<div>
  <h3 id="message-heading">Your Message</h3>
  <Textarea
    id="message"
    aria-labelledby="message-heading"
    hint="Please provide your message"
  />
</div>
```

## Accessibility Requirements

**Required:**
- Provide either a visible `label` or `aria-labelledby`
- Always provide a unique `id`
- Use `aria-describedby` for hint and error messages (handled automatically)
- Announce changes to status messages

**Recommended:**
- Use hint text instead of placeholder
- Provide character count feedback for limited fields
- Clear error messages that explain how to fix issues
- Mark required fields explicitly
- Use `autoComplete` attribute when appropriate

**Never:**
- Use placeholder without label
- Disable textarea without clear reason
- Hide important information in placeholder text
- Use vague or unclear labels
- End labels with punctuation (colons, commas, periods)

## Anti-Patterns

❌ **Wrong: No label**
```tsx
<Textarea
  id="message"
  placeholder="Enter your message"
/>
```

✅ **Correct: Always provide label**
```tsx
<Textarea
  id="message"
  label="Message"
  hint="Enter your message"
/>
```

---

❌ **Wrong: Vague labels**
```tsx
<Textarea
  id="input"
  label="Enter your message here"
/>
```

✅ **Correct: Concise labels**
```tsx
<Textarea
  id="message"
  label="Message"
/>
```

---

❌ **Wrong: Punctuation in labels**
```tsx
<Textarea
  id="name"
  label="Name:"
/>
```

✅ **Correct: No punctuation**
```tsx
<Textarea
  id="name"
  label="Name"
/>
```

---

❌ **Wrong: ALL CAPS labels**
```tsx
<Textarea
  id="message"
  label="MESSAGE"
/>
```

✅ **Correct: Sentence case**
```tsx
<Textarea
  id="message"
  label="Message"
/>
```

## Best Practices

- Keep labels short and clear (1-3 words)
- Use sentence case for labels (not Title Case or ALL CAPS)
- Don't end labels with colons, commas, or periods
- Show "(Optional)" in label when field is not required
- Avoid placeholders - use hint text instead
- Write actionable error messages that guide users to fix issues
- Default dimensions: 5 rows × 50 cols
- Textarea is user-resizable by default (can be controlled with CSS)
- Use `autocomplete` attribute when appropriate for user convenience
- Provide character count feedback for fields with `maxLength`
- Use controlled components when you need to validate/transform input

## Technical Details

- **Default rows**: 5 (not 3)
- **Default cols**: 50
- **Resizable**: Yes, by default (controlled by CSS `resize` property)
- **Component extends**: `ComponentPropsWithRef<'textarea'>`
- **Label requirement**: Either `label` OR `aria-labelledby` (enforced by TypeScript)
- **Disabled behavior**: When `aria-disabled` is true, the textarea becomes `readOnly`
- **Status message ID**: Automatically generated as `${id}-status-message`
- **Hint ID**: Automatically generated as `${id}-hint`
- **Label ID**: Automatically generated as `${id}-label`

## Related Components 

_(alternatives to textarea)_
- [Input](input.md) - For single-line text input
- [FieldControl](field-control.md) - For grouping multiple inputs with shared validation
- [Label](label.md) - Standalone label component
- [Hint](hint.md) - Standalone hint component
