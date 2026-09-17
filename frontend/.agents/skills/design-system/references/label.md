# Label Component Reference
> AI agent-friendly reference for DLS Label component

## Quick Reference
Label provides accessible labels for form inputs. Every form input must have an associated label to be accessible. Labels can be visible or visually hidden (screen reader only).

## Import
```tsx
import { Label } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| htmlFor | string | No | - | Identifies the element associated with the label. Either `htmlFor` or `id` must be provided. Use `htmlFor` to associate with a form input's `id` attribute (most common pattern). |
| id | string | No | - | Identifies the label so that other elements may reference it with aria attributes. Either `htmlFor` or `id` must be provided. Use `id` when inputs reference the label via `aria-labelledby`. |
| children | ReactNode | Yes | - | Children to render as the label text. |
| isVisuallyHidden | boolean | No | - | If true, visually hides the element but is still available to screen readers |
| tooltip | ReactElement<typeof Tooltip> | No | - | Tooltip to display alongside the label for additional contextual information |

## Common Patterns

### Basic Text Input Label
```tsx
<Label htmlFor="first-name">First Name</Label>
<Input id="first-name" type="text" />
```

### Required Field Indicator
```tsx
<Label htmlFor="email">
  Email Address <span aria-label="required">*</span>
</Label>
<Input id="email" type="email" required />
```

### Optional Field Indicator
```tsx
<Label htmlFor="middle-name">
  Middle Name <span aria-label="optional">(Optional)</span>
</Label>
<Input id="middle-name" type="text" />
```

### Label with Tooltip
```tsx
import { Label, Input, Tooltip, TooltipTrigger, TooltipContent, InfoTooltipButton } from '@americanexpress/dls-react';

<Label 
  htmlFor="ssn"
  tooltip={
    <Tooltip id="ssn-tooltip">
      <TooltipTrigger>
        <InfoTooltipButton screenReaderLabel="Why we need your SSN" />
      </TooltipTrigger>
      <TooltipContent>
        We use this to verify your identity and process your application
      </TooltipContent>
    </Tooltip>
  }
>
  Social Security Number
</Label>
<Input id="ssn" type="text" />
```

### Visually Hidden Label (Screen Reader Only)
```tsx
<Label htmlFor="search" isVisuallyHidden>
  Search the site
</Label>
<Input 
  id="search" 
  type="search" 
  placeholder="Search..."
/>
```

### Complete Form Field with Label, Input, and Hint
```tsx
<div>
  <Label htmlFor="password">Create Password</Label>
  <Input 
    id="password" 
    type="password"
    aria-describedby="password-hint"
  />
  <Hint id="password-hint">
    Must be at least 8 characters with 1 uppercase letter and 1 number
  </Hint>
</div>
```

### Label for Select
```tsx
<Label htmlFor="country">Country</Label>
<Select id="country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="mx">Mexico</option>
</Select>
```

### Label for Textarea
```tsx
<Label htmlFor="comments">Additional Comments</Label>
<Textarea 
  id="comments" 
  rows={4}
  aria-describedby="comments-hint"
/>
<Hint id="comments-hint">Maximum 500 characters</Hint>
```

### Label for Checkbox Group (with Legend)
```tsx
<fieldset>
  <Legend>Notification Preferences</Legend>
  
  <div>
    <input type="checkbox" id="email-notif" />
    <Label htmlFor="email-notif">Email notifications</Label>
  </div>
  
  <div>
    <input type="checkbox" id="sms-notif" />
    <Label htmlFor="sms-notif">SMS notifications</Label>
  </div>
</fieldset>
```

### Label for Radio Buttons
```tsx
<fieldset>
  <Legend>Shipping Method</Legend>
  
  <div>
    <input type="radio" id="standard" name="shipping" />
    <Label htmlFor="standard">Standard (5-7 business days)</Label>
  </div>
  
  <div>
    <input type="radio" id="express" name="shipping" />
    <Label htmlFor="express">Express (2-3 business days)</Label>
  </div>
</fieldset>
```

### Label with Error State
```tsx
<div>
  <Label htmlFor="email">Email Address</Label>
  <Input 
    id="email" 
    type="email"
    aria-describedby="email-error"
    aria-invalid="true"
  />
  <ComponentLevelNotification id="email-error" type="error">
    Please enter a valid email address
  </ComponentLevelNotification>
</div>
```

### Label for Date Input
```tsx
<Label htmlFor="birth-date">Date of Birth</Label>
<Input 
  id="birth-date" 
  type="text"
  placeholder="MM/DD/YYYY"
  aria-describedby="birth-date-hint"
/>
<Hint id="birth-date-hint">Format: MM/DD/YYYY</Hint>
```

## Accessibility Requirements

**Required:**
- Every form input MUST have an associated label (visible or hidden)
- Always provide `htmlFor` prop matching the input's `id`
- Input `id` and Label `htmlFor` must match exactly
- Label text must be descriptive and clear
- Do not use `placeholder` as a replacement for labels
- Use `isVisuallyHidden={true}` only when visual label would be redundant

**Recommended:**
- Keep labels concise (1-5 words)
- Use sentence case (not ALL CAPS)
- Place label above or to the left of input
- Clearly indicate required vs optional fields
- Use consistent labeling patterns throughout forms
- For inline checkboxes/radios, place label after input

**Avoid:**
- Don't use vague labels ("Enter text", "Field 1")
- Don't hide labels that provide important context
- Don't rely solely on placeholder text
- Don't use icons or symbols as labels without text
- Don't use labels as instructions (use Hint for that)
- Don't use different terms for the same concept across forms

## Anti-Patterns

❌ **Wrong: Missing htmlFor**
```tsx
<Label>Email Address</Label>
<Input id="email" type="email" />
```
✅ **Correct: Always provide htmlFor**
```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

❌ **Wrong: htmlFor doesn't match input id**
```tsx
<Label htmlFor="user-email">Email Address</Label>
<Input id="email" type="email" />
```
✅ **Correct: htmlFor matches input id exactly**
```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

❌ **Wrong: Using placeholder instead of label**
```tsx
<Input id="email" type="email" placeholder="Email Address" />
```
✅ **Correct: Always use Label**
```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" placeholder="[REDACTED_EMAIL_ADDRESS_3]" />
```

❌ **Wrong: Vague label text**
```tsx
<Label htmlFor="input1">Field 1</Label>
```
✅ **Correct: Descriptive label text**
```tsx
<Label htmlFor="first-name">First Name</Label>
```

❌ **Wrong: Label as instruction**
```tsx
<Label htmlFor="password">
  Password must be at least 8 characters
</Label>
<Input id="password" type="password" />
```
✅ **Correct: Label + Hint for instructions**
```tsx
<Label htmlFor="password">Password</Label>
<Input 
  id="password" 
  type="password"
  aria-describedby="password-hint"
/>
<Hint id="password-hint">
  Must be at least 8 characters
</Hint>
```

❌ **Wrong: Hiding necessary labels**
```tsx
<Label htmlFor="email" isVisuallyHidden>Email</Label>
<Input id="email" type="email" />
```
✅ **Correct: Show labels unless truly redundant**
```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

## Best Practices

- **Association:**
  - Always use `htmlFor` prop
  - Ensure `htmlFor` matches input's `id` exactly
  - One label per input (use Legend for groups)
- **Visibility:**
  - Labels should be visible by default
  - Only use `isVisuallyHidden` when visual context makes label redundant
  - Never hide labels on complex or uncommon inputs
- **Placement:**
  - Text inputs: Label above input
  - Checkboxes/radios: Label to the right of input
  - Consistent placement throughout forms
- **Content:**
  - Use clear, descriptive text (2-5 words ideal)
  - Sentence case for readability
  - Indicate required fields with asterisk (*) or "(Required)"
  - Indicate optional fields with "(Optional)"
  - Never use just icons or symbols without text
- **Required/Optional indicators:**
  - Use `<span aria-label="required">*</span>` for accessibility
  - Place indicator after label text
  - Be consistent across entire form
- **Form groups:**
  - Use `<fieldset>` and `<Legend>` for checkbox/radio groups
  - Individual checkboxes/radios still need their own Labels
- **Responsive:** Labels remain visible and readable at all viewport sizes
- **Touch targets:** Label clicking should focus associated input (automatic with htmlFor)

## Related Components
- [Hint](hint.md) - For supplemental help text
- [Legend](legend.md) - For labeling fieldset groups
- [Input](input.md) - Text input component
- [Checkbox](checkbox.md) - Checkbox input
- [Radio](radio.md) - Radio button input
- [Select](select-native.md) - Select dropdown