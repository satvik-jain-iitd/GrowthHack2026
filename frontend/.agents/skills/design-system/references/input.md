# Input Component Reference

> AI agent-friendly reference for DLS Input component

## Quick Reference

Single-line text input for forms and dialogs. Use for short text entries like names, emails, addresses. For multi-line text, use Textarea.

## Import

```tsx
import { Input } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
<Input 
  id="email" 
  label="Email"
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| disabled | boolean | No | - | @deprecated use `aria-disabled` instead.  The `disabled` prop **removes** the element from the Accessibility Tree and prevents it from receiving focus |
| aria-disabled | Booleanish | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled". |
| label | string | No | - | Text that's used as the visual and accessible label for the component. If not provided, hide the component's built-in label. |
| autoComplete | string | No | - | Must be defined when the form control collects user personal data. |
| name | string | No | - | The name attribute of the input field, will default to the id provided |
| required | boolean | No | - | Flag to allow for default validation message to show |
| type | HTMLInputTypeAttribute | No | - | The type of the input component, defaults to 'text' |
| value | string \| number \| readonly string[] | No | - | The value of the input field (controlled) |
| onChange | ChangeEventHandler<HTMLInputElement> | No | - | The onChange event handler to attach to the input field (controlled) |
| defaultValue | string \| number \| readonly string[] | No | - | The default value of the input field (uncontrolled) |
| id | string | Yes | - | The id of the input component, used to associate the input with the built-in accessible label and hint |
| aria-describedby | string | No | - | The id of the container of the text describing the input, intended for custom hint text |
| aria-labelledby | string | No | - | The id of a label, which provides an accessible name for the component Identifies the element (or elements) that labels the current element. @see aria-describedby. |
| childrenPosition | "start" \| "end" | No | - | Positions the slot (children) to the left or right of the other content within the container |
| status | 'default' \| 'error' \| 'success' | No | - | Default, error, or success state. Will use the value provided by the context when wrapped in a `FieldControl` component. |
| statusMessage | string | No | - | The status message to be displayed if status is 'success' or 'error'. |
| containerRef | RefObject | No | - | A ref to the container element |
| containerProps | Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> | No | - | Props to be spread onto the parent div container |
| hint | string | No | - | Hint text to use inbuilt hint instead of a custom label |
| isHintVisuallyHidden | boolean | No | - | If true, visually hides the hint text (it will still be accessible to screen readers) |
| tooltip | ReactElement | No | - | The slot for the tooltip |
| reactlytics | ReactlyticsProp | No | - |  |


## Common Patterns

### Basic Text Input
```tsx
<Input 
  id="name" 
  label="Full name"
  type="text"
/>
```

### Email Input with Autocomplete
```tsx
<Input 
  id="email" 
  label="Email"
  type="email"
  autoComplete="email"
/>
```

### Password Input

**Note:** For password inputs with show/hide toggle functionality, use the dedicated [PasswordInput](password-input.md) component instead.

```tsx
<Input 
  id="password"
  label="Password"
  type="password"
  autoComplete="current-password"
/>
```

### Input with Error State
```tsx
<Input 
  id="password"
  label="Password"
  type="password"
  status="error"
  hint="Password must have at least 8 characters and a numerical value"
/>
```

### Optional Field
```tsx
<Input 
  id="company" 
  label="Company (Optional)"
/>
```

### Input with Hint Text
```tsx
<Input 
  id="username" 
  label="Username"
  hint="Must be 3-20 characters"
/>
```

### Input with Tooltip
```tsx
import { InfoTooltipButton, Input, Tooltip, TooltipTrigger, TooltipContent } from '@americanexpress/dls-react';

<Input
  aria-describedby="tooltip-content"
  id="firstName"
  label="First Name"
  tooltip={
    <Tooltip id="tooltip-content">
      <TooltipTrigger>
        <InfoTooltipButton screenReaderLabel="More info" />
      </TooltipTrigger>
      <TooltipContent>This will be used for the name on your work pass</TooltipContent>
    </Tooltip>
  }
  type="text"
/>
```

### Disabled Input (Accessible)
```tsx
<Input 
  id="email"
  label="Email"
  aria-disabled="true"
  value="user@example.com"
/>
```

## Accessibility Requirements

**Required:**
- Provide `label` prop (always visible)
- Unique `id` for label association
- If using external label, connect via `aria-labelledby`

**Recommended:**
- Use `autocomplete` for common fields (email, name, address, phone)
- Use `hint` prop for helper/error text (automatically sets `aria-describedby`)
- Use `aria-disabled="true"` instead of `disabled` prop
- Provide clear error messages that explain how to fix the issue
- Use `type` attribute appropriately (email, tel, url, etc.)

**Avoid:**
- Using placeholder as the only label (not accessible)
- Ending labels with colons or commas
- Using asterisks (*) for required fields
- Using `disabled` attribute (use `aria-disabled` instead)

## Anti-Patterns

❌ **Missing label** - Fails accessibility
```tsx
<Input id="email" placeholder="Email" /> {/* WRONG */}
```

✅ **Correct approach**
```tsx
<Input id="email" label="Email" />
```

---

❌ **Placeholder instead of label**
```tsx
<Input id="name" placeholder="Full name" /> {/* WRONG */}
```

✅ **Correct approach**
```tsx
<Input id="name" label="Full name" />
```

---

❌ **Asterisks for required fields**
```tsx
<Input id="email" label="Email*" /> {/* WRONG */}
<Input id="company" label="Company" />
```

✅ **Correct approach** - Mark optional fields instead
```tsx
<Input id="email" label="Email" />
<Input id="company" label="Company (Optional)" />
```

---

❌ **Verbose labels**
```tsx
<Input label="Enter your email address" /> {/* WRONG */}
```

✅ **Correct approach** - Keep labels concise
```tsx
<Input label="Email" />
```

---

❌ **Title case or ALL CAPS labels**
```tsx
<Input label="First Name" /> {/* WRONG */}
<Input label="FIRST NAME" /> {/* WRONG */}
```

✅ **Correct approach** - Use sentence case
```tsx
<Input label="First name" />
```

---

❌ **Using disabled attribute**
```tsx
<Input id="field" label="Field" disabled /> {/* WRONG */}
```

✅ **Correct approach** - Use aria-disabled
```tsx
<Input id="field" label="Field" aria-disabled="true" />
```

## Best Practices

### Content Guidelines
- **Labels**: Short, clear, descriptive
- **Case**: Use sentence case, not title case
- **Punctuation**: No colons or commas at end of labels
- **Required fields**: Mark optional fields as "(Optional)" instead of using asterisks
- **Error messages**: Provide actionable solutions, not just stating the problem
- **Autocomplete**: Use HTML autocomplete for common fields to save user time
- **Tooltips**: Use for non-critical contextual information only

### Layout
- **Recommended width**: 316px (scales to fill container if needed)
- **Fixed height**: 48px
- **Minimum width**: Must reflow to 320px for accessibility
- **Touch target**: Minimum 44x44px for interactive elements

### When to Use
- Single-line text input needs
- Form fields requiring concise answers
- Data validation or submission workflows

### When NOT to Use
- Multi-line text (use Textarea instead)
- Non-editable content (use read-only text or labels)
- Actions like filtering or navigation (use Button or ToggleSwitch)

## Advanced Usage

### Input with Icon Children
```tsx
<Input 
  id="search"
  label="Search"
  childrenPosition="start"
>
  <IconSearch size="md" />
</Input>
```

### Custom Aria Associations
```tsx
<div>
  <label id="custom-label">Email address</label>
  <span id="custom-hint">We'll never share your email</span>
  <Input 
    id="email"
    aria-labelledby="custom-label"
    aria-describedby="custom-hint"
  />
</div>
```

### Visually Hidden Hint (Screen Reader Only)
```tsx
<Input 
  id="password"
  label="Password"
  hint="Must contain at least 8 characters"
  isHintVisuallyHidden={true}
/>
```

## Related Components

- [Textarea](textarea.md) - Multi-line text input
- [PasswordInput](password-input.md) - Password-specific input with show/hide toggle
- [PhoneInput](phone-input.md) - Phone number input with formatting
- [CurrencyInput](currency-input.md) - Currency/money input with formatting
- [DateInput](date-input.md) - Date input with validation
- [FieldControl](field-control.md) - Wrapper for input with label and hint
- [Label](label.md) - Standalone label component
- [Hint](hint.md) - Standalone hint text component