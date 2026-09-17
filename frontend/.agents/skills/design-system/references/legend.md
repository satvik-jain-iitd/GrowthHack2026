# Legend Component Reference
> AI agent-friendly reference for DLS Legend component

## Quick Reference
Legend provides accessible labels for fieldset groups. Use Legend to label groups of related form inputs like radio buttons, checkboxes, or related text fields. Every fieldset should have a Legend.

## Import
```tsx
import { Legend } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<fieldset>
  <Legend>Shipping Method</Legend>
  {/* Radio buttons or checkboxes */}
</fieldset>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | NonNullable<ReactNode> | Yes | - | Children to render as the text for the legend. |


## Common Patterns

### Radio Button Group
```tsx
<fieldset>
  <Legend>Contact Preference</Legend>
  
  <div>
    <input type="radio" id="email-contact" name="contact" value="email" />
    <Label htmlFor="email-contact">Email</Label>
  </div>
  
  <div>
    <input type="radio" id="phone-contact" name="contact" value="phone" />
    <Label htmlFor="phone-contact">Phone</Label>
  </div>
  
  <div>
    <input type="radio" id="mail-contact" name="contact" value="mail" />
    <Label htmlFor="mail-contact">Mail</Label>
  </div>
</fieldset>
```

### Checkbox Group
```tsx
<fieldset>
  <Legend>Notification Preferences</Legend>
  
  <div>
    <input type="checkbox" id="email-notif" value="email" />
    <Label htmlFor="email-notif">Email notifications</Label>
  </div>
  
  <div>
    <input type="checkbox" id="sms-notif" value="sms" />
    <Label htmlFor="sms-notif">SMS notifications</Label>
  </div>
  
  <div>
    <input type="checkbox" id="push-notif" value="push" />
    <Label htmlFor="push-notif">Push notifications</Label>
  </div>
</fieldset>
```

### Legend with Hint
```tsx
<fieldset>
  <Legend>Communication Preferences</Legend>
  <Hint id="comm-hint">
    Select all that apply. You can change these settings at any time.
  </Hint>
  
  <div aria-describedby="comm-hint">
    <input type="checkbox" id="newsletter" value="newsletter" />
    <Label htmlFor="newsletter">Monthly newsletter</Label>
  </div>
  
  <div>
    <input type="checkbox" id="promotions" value="promotions" />
    <Label htmlFor="promotions">Promotional offers</Label>
  </div>
</fieldset>
```

### Required Fieldset
```tsx
<fieldset>
  <Legend>
    Delivery Method <span aria-label="required">*</span>
  </Legend>
  
  <div>
    <input type="radio" id="standard-ship" name="delivery" value="standard" required />
    <Label htmlFor="standard-ship">Standard Shipping (5-7 days)</Label>
  </div>
  
  <div>
    <input type="radio" id="express-ship" name="delivery" value="express" required />
    <Label htmlFor="express-ship">Express Shipping (2-3 days)</Label>
  </div>
  
  <div>
    <input type="radio" id="pickup" name="delivery" value="pickup" required />
    <Label htmlFor="pickup">Store Pickup</Label>
  </div>
</fieldset>
```

### Related Text Inputs Group
```tsx
<fieldset>
  <Legend>Mailing Address</Legend>
  
  <div>
    <Label htmlFor="address1">Street Address</Label>
    <Input id="address1" type="text" />
  </div>
  
  <div>
    <Label htmlFor="address2">Apartment, Suite, etc. (Optional)</Label>
    <Input id="address2" type="text" />
  </div>
  
  <div>
    <Label htmlFor="city">City</Label>
    <Input id="city" type="text" />
  </div>
  
  <div>
    <Label htmlFor="state">State</Label>
    <Select id="state">
      <option value="">Select state</option>
      {/* state options */}
    </Select>
  </div>
  
  <div>
    <Label htmlFor="zip">ZIP Code</Label>
    <Input id="zip" type="text" />
  </div>
</fieldset>
```

### Date Range Group
```tsx
<fieldset>
  <Legend>Travel Dates</Legend>
  
  <div>
    <Label htmlFor="departure">Departure Date</Label>
    <Input 
      id="departure" 
      type="text"
      placeholder="MM/DD/YYYY"
      aria-describedby="departure-hint"
    />
    <Hint id="departure-hint">Format: MM/DD/YYYY</Hint>
  </div>
  
  <div>
    <Label htmlFor="return">Return Date</Label>
    <Input 
      id="return" 
      type="text"
      placeholder="MM/DD/YYYY"
      aria-describedby="return-hint"
    />
    <Hint id="return-hint">Format: MM/DD/YYYY</Hint>
  </div>
</fieldset>
```

### Legend with Tooltip
```tsx
<fieldset>
  <Legend>
    Account Type
    <Tooltip id="account-type-tooltip">
      <TooltipTrigger>
        <InfoTooltipButton screenReaderLabel="Learn about account types" />
      </TooltipTrigger>
      <TooltipContent>
        Individual accounts are for personal use. Business accounts offer additional features for companies.
      </TooltipContent>
    </Tooltip>
  </Legend>
  
  <div>
    <input type="radio" id="individual" name="accountType" value="individual" />
    <Label htmlFor="individual">Individual</Label>
  </div>
  
  <div>
    <input type="radio" id="business" name="accountType" value="business" />
    <Label htmlFor="business">Business</Label>
  </div>
</fieldset>
```

### Fieldset with Error
```tsx
<fieldset aria-describedby="payment-error">
  <Legend>
    Payment Method <span aria-label="required">*</span>
  </Legend>
  
  <ComponentLevelNotification id="payment-error" type="error">
    Please select a payment method
  </ComponentLevelNotification>
  
  <div>
    <input type="radio" id="credit" name="payment" value="credit" aria-invalid="true" />
    <Label htmlFor="credit">Credit Card</Label>
  </div>
  
  <div>
    <input type="radio" id="debit" name="payment" value="debit" aria-invalid="true" />
    <Label htmlFor="debit">Debit Card</Label>
  </div>
  
  <div>
    <input type="radio" id="bank" name="payment" value="bank" aria-invalid="true" />
    <Label htmlFor="bank">Bank Account</Label>
  </div>
</fieldset>
```

### Multi-Select with Legend
```tsx
<fieldset>
  <Legend>Select Your Interests</Legend>
  <Hint id="interests-hint">Choose all that apply</Hint>
  
  <div aria-describedby="interests-hint">
    <input type="checkbox" id="tech" value="technology" />
    <Label htmlFor="tech">Technology</Label>
  </div>
  
  <div>
    <input type="checkbox" id="finance" value="finance" />
    <Label htmlFor="finance">Finance</Label>
  </div>
  
  <div>
    <input type="checkbox" id="travel" value="travel" />
    <Label htmlFor="travel">Travel</Label>
  </div>
  
  <div>
    <input type="checkbox" id="food" value="food" />
    <Label htmlFor="food">Food & Dining</Label>
  </div>
</fieldset>
```

### Nested Fieldsets
```tsx
<fieldset>
  <Legend>Contact Information</Legend>
  
  <div>
    <Label htmlFor="contact-name">Full Name</Label>
    <Input id="contact-name" type="text" />
  </div>
  
  <fieldset>
    <Legend>Phone Numbers</Legend>
    
    <div>
      <Label htmlFor="home-phone">Home Phone (Optional)</Label>
      <Input id="home-phone" type="tel" />
    </div>
    
    <div>
      <Label htmlFor="mobile-phone">Mobile Phone</Label>
      <Input id="mobile-phone" type="tel" />
    </div>
  </fieldset>
</fieldset>
```

## Accessibility Requirements

**Required:**
- Every `<fieldset>` MUST have a `<Legend>` as its first child
- Legend must clearly describe the group of form inputs
- Use Legend for radio button groups, checkbox groups, or related input groups
- Legend should be the first element inside fieldset

**Recommended:**
- Keep legend text concise (2-6 words)
- Use sentence case (not ALL CAPS)
- For complex groups, add Hint after Legend for additional context
- Clearly indicate if the entire fieldset is required
- Use consistent legend patterns throughout forms

**Avoid:**
- Don't use Legend outside of a fieldset
- Don't hide Legend with CSS (screen readers need it)
- Don't use vague legend text ("Options", "Settings")
- Don't nest fieldsets unnecessarily (use sparingly)
- Don't use Legend as instruction text (use Hint for that)

## Anti-Patterns

❌ **Wrong: Missing Legend in fieldset**
```tsx
<fieldset>
  <div>
    <input type="radio" id="yes" name="answer" />
    <Label htmlFor="yes">Yes</Label>
  </div>
  <div>
    <input type="radio" id="no" name="answer" />
    <Label htmlFor="no">No</Label>
  </div>
</fieldset>
```
✅ **Correct: Always include Legend in fieldset**
```tsx
<fieldset>
  <Legend>Would you like to receive updates?</Legend>
  <div>
    <input type="radio" id="yes" name="answer" />
    <Label htmlFor="yes">Yes</Label>
  </div>
  <div>
    <input type="radio" id="no" name="answer" />
    <Label htmlFor="no">No</Label>
  </div>
</fieldset>
```

❌ **Wrong: Legend not first child**
```tsx
<fieldset>
  <Hint id="hint">Select one option</Hint>
  <Legend>Contact Method</Legend>
  {/* inputs */}
</fieldset>
```
✅ **Correct: Legend is first child**
```tsx
<fieldset>
  <Legend>Contact Method</Legend>
  <Hint id="hint">Select one option</Hint>
  {/* inputs */}
</fieldset>
```

❌ **Wrong: Using Legend outside fieldset**
```tsx
<div>
  <Legend>Email Address</Legend>
  <Input id="email" type="email" />
</div>
```
✅ **Correct: Use Label for single inputs**
```tsx
<div>
  <Label htmlFor="email">Email Address</Label>
  <Input id="email" type="email" />
</div>
```

❌ **Wrong: Vague legend text**
```tsx
<fieldset>
  <Legend>Choose Option</Legend>
  {/* inputs */}
</fieldset>
```
✅ **Correct: Descriptive legend text**
```tsx
<fieldset>
  <Legend>Shipping Method</Legend>
  {/* inputs */}
</fieldset>
```

❌ **Wrong: Legend as instruction**
```tsx
<fieldset>
  <Legend>Select all communication preferences that apply to you</Legend>
  {/* checkboxes */}
</fieldset>
```
✅ **Correct: Legend + Hint for instructions**
```tsx
<fieldset>
  <Legend>Communication Preferences</Legend>
  <Hint id="comm-hint">Select all that apply</Hint>
  {/* checkboxes */}
</fieldset>
```

## Best Practices

- **Fieldset association:**
  - Always use Legend inside `<fieldset>` element
  - Legend must be the first child of fieldset
  - One Legend per fieldset
- **Content:**
  - Use clear, descriptive text (2-6 words ideal)
  - Sentence case for readability
  - Describe what the group represents, not instructions
  - Use Hint for additional context or instructions
- **Required indicators:**
  - Use `<span aria-label="required">*</span>` within Legend if entire group required
  - Be consistent with required indicator placement
- **When to use Legend:**
  - Radio button groups (always)
  - Checkbox groups (always)
  - Related text inputs (address fields, date ranges)
  - Any semantically grouped form inputs
- **When NOT to use Legend:**
  - Single form inputs (use Label instead)
  - Non-form content
  - Purely visual grouping without semantic relationship
- **Nesting:**
  - Avoid deeply nested fieldsets (impacts screen reader UX)
  - If nesting, ensure each fieldset has clear, distinct Legend
- **Errors:**
  - Use `aria-describedby` on fieldset to associate error messages
  - Display errors above the group of inputs
- **Responsive:** Legend remains visible and readable at all viewport sizes

## Related Components
- [Label](label.md) - For labeling individual inputs
- [Hint](hint.md) - For supplemental help text
- [Radio](radio.md) - Radio button input (often used in fieldsets)
- [Checkbox](checkbox.md) - Checkbox input (often used in fieldsets)
- [ComponentLevelNotification](component-level-notification.md) - For field-level errors
