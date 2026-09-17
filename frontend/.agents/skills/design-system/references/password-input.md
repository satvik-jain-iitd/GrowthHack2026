# PasswordInput Component Reference
> AI agent-friendly reference for DLS PasswordInput component

## Quick Reference
Input field for sensitive data with built-in show/hide toggle functionality. Use for passwords or any sensitive information that users should be able to preview before submitting.

## Import
```tsx
import { PasswordInput } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<PasswordInput
  id="password-input"
  label="Password"
  hint="Enter your password"
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onBlur | ((event: FocusEvent<HTMLElement, Element>) => void) | No | - | Handler for focus loss events from any focusable HTML element within the component. |
| disabled | boolean | No | - | @deprecated use `aria-disabled` instead.  The `disabled` prop **removes** the element from the Accessibility Tree and prevents it from receiving focus. This is not recommended.  All DLS components are designed to use the `aria-disabled` property instead, which will style the component to be disabled, but still allow keyboard focus and screen reader interactivity. |
| aria-disabled | Booleanish | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled". |
| label | string | No | - | Text that's used as the visual and accessible label for the component. If not provided, hide the component's built-in label. The visible label for the PasswordInput component. |
| autoComplete | string | No | - | Must be defined when the form control collects user personal data. Attribute value must match the tokens defined in [input purposes section](https://www.w3.org/TR/WCAG21/#input-purposes) |
| name | string | No | - | The name attribute of the input field, will default to the id provided |
| required | boolean | No | - | Flag to allow for default validation message to show |
| value | string \| number \| readonly string[] | No | - | The value of the input field (controlled) |
| onChange | ChangeEventHandler<HTMLInputElement> | No | - | The onChange event handler to attach to the input field (controlled) |
| defaultValue | string \| number \| readonly string[] | No | - | The default value of the input field (uncontrolled) |
| id | string | Yes | - | The ID for the input field, necessary for accessibility and labeling. |
| aria-describedby | string | No | - | The id of the container of the text describing the input, intended for custom hint text |
| aria-labelledby | string | No | - | The id of a label, which provides an accessible name for the component Identifies the element (or elements) that labels the current element. @see aria-describedby. |
| childrenPosition | "start" \| "end" | No | - | Positions the slot (children) to the left or right of the other content within the container |
| status | FieldControlStatus | No | - | Default, error, or success state. Will use the value provided by the context when wrapped in a `FieldControl` component. |
| statusMessage | string | No | - | The status message to be displayed if status is 'success' or 'error'. |
| containerRef | RefObject<HTMLDivElement> \| ((instance: HTMLDivElement \| null) => void) | No | - | A ref to the container element |
| childrenContainerProps | Omit<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> | No | - | Props to be spread onto the span containing the children |
| containerProps | Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> | No | - | Props to be spread onto the parent div container |
| hint | string | No | - | Hint text to assist the user, displayed above the input. |
| isHintVisuallyHidden | boolean | No | - | If true, visually hides the hint text (it will still be accessible to screen readers) |
| defaultShouldShowPassword | boolean | No | - | Shows the password by default. |
| shouldShowPassword | boolean | No | - | Controlled visibility of the password |
| onShowPasswordChange | ((isVisible: boolean) => void) | No | - | Handler for changes in password visibility. |
| labelOverrides | PasswordInputLabelOverrides | No | - | Overrides for labels that have been defaulted in the component. |


## Common Patterns

### Basic Password Input
```tsx
<PasswordInput
  id="password"
  label="Password"
  hint="Must contain at least 8 characters"
/>
```

### With Validation Status
```tsx
<PasswordInput
  id="password"
  label="Password"
  status="error"
  statusMessage="Password must have at least 8 characters and a numerical value"
/>
```

### Controlled Visibility
```tsx
const [showPassword, setShowPassword] = useState(false);

<PasswordInput
  id="password"
  label="Password"
  shouldShowPassword={showPassword}
  onShowPasswordChange={setShowPassword}
/>
```

### With Optional Field
```tsx
<PasswordInput
  id="new-password"
  label="New Password (Optional)"
  hint="Leave blank to keep current password"
/>
```

## Accessibility Requirements

**Required:**
- Always provide a visible label
- Use `aria-describedby` to associate hint and error messages
- Ensure toggle button has clear screen reader labels (auto-provided)

**Recommended:**
- Include hint text for password requirements
- Provide clear error messages that guide users to correct issues
- Use status prop to indicate validation state

**Avoid:**
- Using placeholder text instead of labels
- Disabling password inputs without clear reason
- Complex or unclear password requirements without hint text

## Anti-Patterns

❌ **Don't use placeholder without label:**
```tsx
<PasswordInput
  id="password"
  placeholder="Enter password"
/>
```

✅ **Do provide visible label:**
```tsx
<PasswordInput
  id="password"
  label="Password"
  hint="Enter your password"
/>
```

❌ **Don't use vague error messages:**
```tsx
<PasswordInput
  id="password"
  label="Password"
  status="error"
  statusMessage="Invalid"
/>
```

✅ **Do provide actionable error messages:**
```tsx
<PasswordInput
  id="password"
  label="Password"
  status="error"
  statusMessage="Password must have at least 8 characters and a numerical value"
/>
```

## Best Practices

- Keep labels short and clear (e.g., "Password", not "Enter your password")
- Use sentence case for labels
- Don't end labels with colons or commas
- Show "optional" when field is not required
- Use hint text for password requirements instead of placeholder text
- Provide detailed error messages that explain how to fix issues
- Use simple, well-known icons (show/hide automatically provided)
- Avoid disabling inputs when possible

## Related Components
- Input - For non-sensitive text input
- CurrencyInput - For monetary values
- PhoneInput - For phone numbers with country codes
- DateInput - For date values
