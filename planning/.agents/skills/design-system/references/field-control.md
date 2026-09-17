# FieldControl Component Reference
> AI agent-friendly reference for DLS FieldControl component

## Quick Reference
FieldControl is a utility component that manages form field state and validation status. It provides a context for child components to access and update field status (default, success, error). Use FieldControl to coordinate validation state across multiple form inputs or to implement custom validation logic.

## Import
```tsx
import { FieldControl, type FieldControlStatus } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<FieldControl>
  <Input id="email" label="Email" />
</FieldControl>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| status | 'default' \| 'error' \| 'success' | No | - | The status that should be supplied to the Field Control Context, which is used to determine the status of all child field control elements (inputs, selects, etc.).  If not provided, the component will be uncontrolled and will manage its own status. |
| defaultStatus | 'default' \| 'error' \| 'success' | No | `default` | The default status that should be supplied to the Field Control Context, which is used to determine the status of all child field control elements (inputs, selects, etc.). |
| onStatusChange | ((status: 'default' \| 'error' \| 'success') => void) | No | - | A callback that is called when the status of the Field Control would change. |
| children | ReactNode | No | - | The children to render within the Field Control. |

> All standard HTML `<div>` attributes (`className`, `id`, `style`, `data-*`, etc.) are also accepted and forwarded to the wrapping `<div>` element, since `FieldControlProps extends ComponentPropsWithoutRef<'div'>`.


## Common Patterns

### Basic Field Control (Uncontrolled)
```tsx
<FieldControl defaultStatus="default">
  <Input 
    id="username" 
    label="Username"
    required
  />
</FieldControl>
```

### Controlled Field Status
```tsx
const [status, setStatus] = useState<FieldControlStatus>('default');

<FieldControl status={status} onStatusChange={setStatus}>
  <Input 
    id="email" 
    label="Email Address"
    type="email"
    required
  />
</FieldControl>
```

### Field Control with Custom Validation
```tsx
const [status, setStatus] = useState<FieldControlStatus>('default');
const [password, setPassword] = useState('');

const validatePassword = (value) => {
  if (value.length < 8) {
    setStatus('error');
    return false;
  }
  if (!/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
    setStatus('error');
    return false;
  }
  setStatus('success');
  return true;
};

const handleBlur = () => {
  validatePassword(password);
};

<FieldControl status={status}>
  <Input 
    id="password" 
    label="Password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    onBlur={handleBlur}
    statusMessage={
      status === 'error' 
        ? 'Password must be at least 8 characters with 1 uppercase and 1 number'
        : ''
    }
    required
  />
</FieldControl>
```

### Multiple Fields with Shared Status
```tsx
const [formStatus, setFormStatus] = useState<FieldControlStatus>('default');

<FieldControl status={formStatus} onStatusChange={setFormStatus}>
  <div className="form-group">
    <Input 
      id="first-name" 
      label="First Name"
      required
    />
    <Input 
      id="last-name" 
      label="Last Name"
      required
    />
  </div>
</FieldControl>
```

### Field Control with Status Change Tracking
```tsx
const [status, setStatus] = useState<FieldControlStatus>('default');
const [changeHistory, setChangeHistory] = useState([]);

const handleStatusChange = (newStatus) => {
  setStatus(newStatus);
  setChangeHistory(prev => [
    ...prev, 
    { status: newStatus, timestamp: new Date() }
  ]);
};

<div>
  <FieldControl status={status} onStatusChange={handleStatusChange}>
    <Input 
      id="tracked-input" 
      label="Tracked Input"
      required
    />
  </FieldControl>
  
  {changeHistory.length > 0 && (
    <div className="margin-2-t">
      <p>Status history: {changeHistory.length} changes</p>
    </div>
  )}
</div>
```

### Field Control with Async Validation
```tsx
const [status, setStatus] = useState<FieldControlStatus>('default');
const [username, setUsername] = useState('');
const [isValidating, setIsValidating] = useState(false);

const validateUsernameAvailability = async (value) => {
  if (!value) {
    setStatus('default');
    return;
  }
  
  setIsValidating(true);
  setStatus('default');
  
  try {
    const isAvailable = await checkUsernameAPI(value);
    setStatus(isAvailable ? 'success' : 'error');
  } catch (error) {
    setStatus('error');
  } finally {
    setIsValidating(false);
  }
};

const handleBlur = () => {
  validateUsernameAvailability(username);
};

<FieldControl status={status}>
  <Input 
    id="username" 
    label="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    onBlur={handleBlur}
    statusMessage={
      isValidating 
        ? 'Checking availability...'
        : status === 'error'
        ? 'Username is already taken'
        : status === 'success'
        ? 'Username is available'
        : ''
    }
    required
  />
</FieldControl>
```

### Field Control for Form Section
```tsx
const [addressStatus, setAddressStatus] = useState<FieldControlStatus>('default');
const [street, setStreet] = useState('');
const [city, setCity] = useState('');
const [zip, setZip] = useState('');

const validateAddressSection = () => {
  if (!street || !city || !zip) {
    setAddressStatus('error');
    return false;
  }
  
  setAddressStatus('success');
  return true;
};

<fieldset>
  <Legend>Mailing Address</Legend>
  <FieldControl status={addressStatus}>
    <div className="form-section">
      <Input
        id="street"
        label="Street Address"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        required
      />
      <Input
        id="city"
        label="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <Input
        id="zip"
        label="ZIP Code"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        required
      />
      
      <Button 
        className="margin-2-t"
        onClick={validateAddressSection}
      >
        Validate Address
      </Button>
    </div>
  </FieldControl>
</fieldset>
```

### Field Control with Touch Validation
```tsx
const [status, setStatus] = useState<FieldControlStatus>('default');
const [touched, setTouched] = useState(false);
const [value, setValue] = useState('');

const handleBlur = () => {
  setTouched(true);
  
  if (!value) {
    setStatus('error');
  } else if (value.length < 3) {
    setStatus('error');
  } else {
    setStatus('success');
  }
};

<FieldControl status={touched ? status : 'default'}>
  <Input 
    id="name" 
    label="Full Name"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onBlur={handleBlur}
    statusMessage={
      touched && status === 'error' 
        ? 'Name must be at least 3 characters'
        : ''
    }
    required
  />
</FieldControl>
```

### Conditional Field Control
```tsx
const [enableValidation, setEnableValidation] = useState(false);
const [status, setStatus] = useState<FieldControlStatus>('default');

<div>
  <Checkbox 
    id="enable-validation"
    onChange={(e) => setEnableValidation(e.target.checked)}
  >
    Enable real-time validation
  </Checkbox>
  
  {enableValidation ? (
    <FieldControl status={status} onStatusChange={setStatus}>
      <Input 
        id="validated-input" 
        label="Validated Input"
        required
      />
    </FieldControl>
  ) : (
    <Input 
      id="unvalidated-input" 
      label="Unvalidated Input"
    />
  )}
</div>
```

## Accessibility Requirements

**Required:**
- Field status changes must be announced to screen readers
- Error status should display error messages via statusMessage prop
- Success/error indicators should not rely on color alone
- Child input components must handle aria-invalid appropriately

**Recommended:**
- Use FieldControl for complex validation scenarios
- Provide clear statusMessage text when status is 'error'
- Validate on blur, not on every keystroke (better UX)
- Reset status to 'default' when user starts typing again

**Avoid:**
- Don't use FieldControl unnecessarily for simple inputs
- Don't change status too frequently (can overwhelm screen readers)
- Don't show success status immediately - wait for user to finish
- Don't hide error messages - they must be visible and announced

## Anti-Patterns

❌ **Wrong: No error message with error status**
```tsx
<FieldControl status="error">
  <Input id="email" label="Email" />
</FieldControl>
```
✅ **Correct: Provide error message**
```tsx
<FieldControl status="error">
  <Input 
    id="email" 
    label="Email"
    statusMessage="Please enter a valid email address"
  />
</FieldControl>
```

❌ **Wrong: Validating on every keystroke**
```tsx
const [status, setStatus] = useState('default');

const handleChange = (e) => {
  setValue(e.target.value);
  setStatus(e.target.value.length > 5 ? 'success' : 'error'); // Too aggressive
};

<FieldControl status={status}>
  <Input onChange={handleChange} />
</FieldControl>
```
✅ **Correct: Validate on blur**
```tsx
const [status, setStatus] = useState('default');

const handleBlur = (e) => {
  setStatus(e.target.value.length > 5 ? 'success' : 'error');
};

<FieldControl status={status}>
  <Input onBlur={handleBlur} />
</FieldControl>
```

❌ **Wrong: Using FieldControl for static content**
```tsx
<FieldControl>
  <p>This is just text</p>
</FieldControl>
```
✅ **Correct: Use for form inputs only**
```tsx
<FieldControl>
  <Input id="field" label="Field" />
</FieldControl>
```

❌ **Wrong: Not resetting status when user corrects input**
```tsx
<FieldControl status="error">
  <Input 
    id="email" 
    label="Email"
    onChange={handleChange} // Status stays error
  />
</FieldControl>
```
✅ **Correct: Reset status on change**
```tsx
const [status, setStatus] = useState<FieldControlStatus>('default');

const handleChange = (e) => {
  setValue(e.target.value);
  setStatus('default'); // Reset on change
};

const handleBlur = (e) => {
  // Validate on blur
  setStatus(validateEmail(e.target.value) ? 'success' : 'error');
};

<FieldControl status={status}>
  <Input 
    id="email" 
    label="Email"
    onChange={handleChange}
    onBlur={handleBlur}
  />
</FieldControl>
```

## Best Practices

- **When to Use FieldControl:**
  - Complex validation logic across multiple fields
  - Custom validation that doesn't fit standard patterns
  - Coordinating status across related fields
  - Tracking validation state changes
  - Async validation (API calls)
- **When NOT to Use FieldControl:**
  - Simple required field validation (Input handles this)
  - Single field with basic validation
  - Static content or read-only fields
- **Validation Timing:**
  - Validate on blur, not onChange (less disruptive)
  - Show errors after user has finished entering data
  - Reset status to 'default' when user starts correcting
  - Show success status only after successful validation
- **Status Management:**
  - Use controlled status for complex scenarios
  - Use defaultStatus for simple scenarios
  - Provide onStatusChange to track status changes
  - Don't change status too frequently
- **Error Messages:**
  - Always provide statusMessage with 'error' status
  - Be specific about what's wrong and how to fix it
  - Use positive language ("Please enter..." not "Don't enter...")
  - Keep messages concise (1-2 sentences)
- **Success Feedback:**
  - Use 'success' status sparingly
  - Show success only after validation passes
  - Consider using success for async validations (username availability)
  - Don't show success for every field (can be overwhelming)
- **Accessibility:**
  - Ensure status changes are announced to assistive tech
  - Error messages must be visible and associated with field
  - Don't rely solely on color to indicate status
  - Test with screen readers
- **Performance:**
  - Debounce async validations
  - Avoid unnecessary re-renders
  - Memoize validation functions when possible
- **User Experience:**
  - Give users time to complete input before showing errors
  - Allow easy correction of errors
  - Provide clear guidance on requirements
  - Consider inline validation for long forms

## Related Components
- [Input](input.md) - Text input with built-in status support
- [Textarea](textarea.md) - Multi-line text input
- [Select](select-native.md) - Dropdown selection
- [Checkbox](checkbox.md) - Checkbox input
- [Radio](radio.md) - Radio button input
- [ComponentLevelNotification](component-level-notification.md) - For field-level error messages