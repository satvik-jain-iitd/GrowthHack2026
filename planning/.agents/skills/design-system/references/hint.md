# Hint Component Reference
> AI agent-friendly reference for DLS Hint component

## Quick Reference
Hint provides supplemental help text for form fields. It displays below inputs to give users additional context, formatting requirements, or guidance. Can be visible or visually hidden (screen reader only).

## Import
```tsx
import { Hint } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Hint id="email-hint">
  We'll use this to send you order confirmations
</Hint>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | NonNullable<ReactNode> | Yes | - | Children to render as the text for the hint text. |
| id | string | No | - | Identifies the hint text so that other elements may reference it with aria attributes. |
| isVisuallyHidden | boolean | No | - | If true, visually hides the element but is still available to screen readers |
| className | string | No | - | Utility classNames applied to Hint |


## Common Patterns

### Basic Hint for Input
```tsx
<div>
  <Label htmlFor="email">Email Address</Label>
  <Input 
    id="email" 
    type="email"
    aria-describedby="email-hint"
  />
  <Hint id="email-hint">
    We'll use this to send you order confirmations and shipping updates
  </Hint>
</div>
```

### Password Requirements Hint
```tsx
<div>
  <Label htmlFor="password">Create Password</Label>
  <Input 
    id="password" 
    type="password"
    aria-describedby="password-hint"
  />
  <Hint id="password-hint">
    Password must be at least 8 characters with 1 uppercase letter and 1 number
  </Hint>
</div>
```

### Format Guidance Hint
```tsx
<div>
  <Label htmlFor="phone">Phone Number</Label>
  <Input 
    id="phone" 
    type="tel"
    aria-describedby="phone-hint"
  />
  <Hint id="phone-hint">
    Format: (555) 555-5555
  </Hint>
</div>
```

### Visually Hidden Hint (Screen Reader Only)
```tsx
<div>
  <Label htmlFor="username">Username</Label>
  <Input 
    id="username" 
    type="text"
    aria-describedby="username-hint"
  />
  <Hint id="username-hint" isVisuallyHidden>
    Username must be 3-20 characters, letters and numbers only
  </Hint>
</div>
```

### Multiple Hints with Error
```tsx
<div>
  <Label htmlFor="ssn">Social Security Number</Label>
  <Input 
    id="ssn" 
    type="text"
    aria-describedby="ssn-hint ssn-error"
    aria-invalid="true"
  />
  <Hint id="ssn-hint">
    Format: XXX-XX-XXXX
  </Hint>
  <ComponentLevelNotification id="ssn-error" type="error">
    Please enter a valid Social Security Number
  </ComponentLevelNotification>
</div>
```

### Character Count Hint
```tsx
const [charCount, setCharCount] = useState(0);
const maxChars = 500;

<div>
  <Label htmlFor="bio">Biography</Label>
  <Textarea 
    id="bio"
    aria-describedby="bio-hint"
    onChange={(e) => setCharCount(e.target.value.length)}
    maxLength={maxChars}
  />
  <Hint id="bio-hint">
    {charCount}/{maxChars} characters
  </Hint>
</div>
```

### Optional Field Hint
```tsx
<div>
  <Label htmlFor="middle-name">
    Middle Name <span aria-label="optional">(Optional)</span>
  </Label>
  <Input 
    id="middle-name" 
    type="text"
    aria-describedby="middle-name-hint"
  />
  <Hint id="middle-name-hint">
    Leave blank if you don't have a middle name
  </Hint>
</div>
```

### Date Format Hint
```tsx
<div>
  <Label htmlFor="dob">Date of Birth</Label>
  <Input 
    id="dob" 
    type="text"
    aria-describedby="dob-hint"
  />
  <Hint id="dob-hint">
    MM/DD/YYYY
  </Hint>
</div>
```

### Security Information Hint
```tsx
<div>
  <Label htmlFor="card-cvv">Security Code (CVV)</Label>
  <Input 
    id="card-cvv" 
    type="text"
    maxLength={4}
    aria-describedby="cvv-hint"
  />
  <Hint id="cvv-hint">
    3 or 4 digit code on the back of your card
  </Hint>
</div>
```

## Accessibility Requirements

**Required:**
- Always provide unique `id` prop
- Associate hint with input via `aria-describedby` on the input
- Use clear, concise language
- Place hint immediately after the input it describes
- Hint text must be programmatically associated with input
- Use `isVisuallyHidden={true}` only when visual hint would be redundant

**Recommended:**
- Write in 8th grade reading level (13-14 years old)
- Keep hints brief (1-2 sentences)
- Use positive language (what to do, not what not to do)
- Provide examples when format is specific
- Place hints before error messages in DOM order
- Use hints to prevent errors rather than rely on error messages

**Avoid:**
- Don't use hint for critical information (use labels or inline text)
- Don't duplicate label text in hint
- Don't use overly technical language
- Don't hide hints that provide important formatting guidance
- Don't use hint as a replacement for proper labels
- Don't use ALL CAPS or excessive punctuation

## Anti-Patterns

❌ **Wrong: Missing id**
```tsx
<Hint>Enter your email address</Hint>
```
✅ **Correct: Always provide id**
```tsx
<Hint id="email-hint">Enter your email address</Hint>
```

❌ **Wrong: Not associated with input**
```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
<Hint id="email-hint">Format: user@example.com</Hint>
```
✅ **Correct: Use aria-describedby**
```tsx
<Label htmlFor="email">Email</Label>
<Input 
  id="email" 
  type="email"
  aria-describedby="email-hint"
/>
<Hint id="email-hint">Format: user@example.com</Hint>
```

❌ **Wrong: Hint duplicates label**
```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" aria-describedby="email-hint" />
<Hint id="email-hint">Email Address</Hint>
```
✅ **Correct: Hint provides additional context**
```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" aria-describedby="email-hint" />
<Hint id="email-hint">
  We'll send order confirmations to this email
</Hint>
```

❌ **Wrong: Critical information in hint**
```tsx
<Label htmlFor="amount">Donation Amount</Label>
<Input id="amount" type="number" aria-describedby="amount-hint" />
<Hint id="amount-hint">Minimum donation is $10</Hint>
```
✅ **Correct: Critical info in label or validation**
```tsx
<Label htmlFor="amount">Donation Amount (minimum $10)</Label>
<Input 
  id="amount" 
  type="number" 
  min={10}
  aria-describedby="amount-hint"
/>
<Hint id="amount-hint">Your donation is tax-deductible</Hint>
```

❌ **Wrong: Vague hint text**
```tsx
<Hint id="password-hint">Use strong password</Hint>
```
✅ **Correct: Specific requirements**
```tsx
<Hint id="password-hint">
  Password must be at least 8 characters with 1 uppercase letter and 1 number
</Hint>
```

## Best Practices

- **Placement:** Always place hint immediately after the input it describes
- **Timing:** Show hints upfront (don't wait for user interaction or errors)
- **Clarity:**
  - Use simple, conversational language
  - Be specific about requirements (formats, lengths, restrictions)
  - Provide examples when helpful
  - Focus on what to do, not what not to do
- **Length:** Keep to 1-2 sentences maximum
- **Association:**
  - Always use `id` prop
  - Reference hint in input's `aria-describedby`
  - Can combine multiple describedby values: `aria-describedby="hint-id error-id"`
- **Visual hierarchy:** Hints are styled smaller/lighter than labels and inputs
- **Progressive disclosure:** Use visible hints for important guidance, `isVisuallyHidden` for redundant info
- **Error prevention:** Good hints reduce errors by setting clear expectations
- **Responsive:** Hint text wraps on smaller viewports

## Related Components
- [Label](label.md) - For labeling form inputs
- [Legend](legend.md) - For labeling fieldset groups
- [ComponentLevelNotification](component-level-notification.md) - For error/success messages
- [Input](input.md) - Text input component
- [Textarea](textarea.md) - Multi-line text input
