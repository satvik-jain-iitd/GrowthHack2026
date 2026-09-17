# DateInput Component Reference
> AI agent-friendly reference for DLS DateInput component

## Quick Reference
Composite input for collecting dates with locale-aware formatting (MM/DD/YYYY, DD/MM/YYYY, etc.). Provides separate fields for month, day, and year with automatic navigation.

## Import
```tsx
import { DateInput } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<DateInput
  id="birthdate"
  label="Date of Birth"
  hint="Enter your date of birth"
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | string | No | - | Text that's used as the visual and accessible label for the component. If not provided, hide the component's built-in label. The visible label for the DateInput component. |
| aria-labelledby | string | No | - | The id of a label, which provides an accessible name for the component |
| id | string | Yes | - | The ID for the input field, necessary for accessibility and labeling. |
| name | string | No | - | The name used for form submission. |
| hint | string | No | - | Hint text to assist the user, displayed below the input. |
| isHintVisuallyHidden | boolean | No | - | If true, visually hides the hint text (it will still be accessible to screen readers) |
| value | string | No | - | Controlled value for the date input in ISO format ('YYYY-MM-DD') or Date object. |
| defaultValue | string | No | - | Default value for uncontrolled usage in ISO format ('YYYY-MM-DD') or Date object. |
| onChange | (event: ChangeEvent<HTMLInputElement>, date: string) => void | No | - | Callback fired when the date changes. @param event the event associated with the individual input field that triggered the change. @param date the date in ISO format (`'YYYY-MM-DD'`). |
| onBlur | (event: FocusEvent<HTMLInputElement, Element>) => void | No | - | Callback fired when the date input loses focus. Only gets called if the focus is not moving to another input field within the DateInput component. @param event the event associated with the individual input field that triggered the blur. |
| lang | string | No | - | BCP 47 language tag to format the date input fields according to different cultural norms. |
| showPlaceholder | boolean | No | - | Whether to show placeholders in the input fields |
| className | string | No | - | Additional CSS class names to apply to the DateInput container. |
| fieldsToShow | ("day" \| "month" \| "year")[] | No | - | Specifies which date fields to show and in what order. |
| aria-describedby | string | No | - | ID of element providing additional description of the date input |
| autocompleteSettings | DateInputAutocompleteSettings | No | - | AutoComplete settings for each of the input field parts |
| required | boolean | No | - | If true, indicates that the consumer must specify a value for the input before the owning form can be submitted. |
| labelOverrides | DateInputLabelOverrides | No | - | Overrides for labels that have been defaulted in the component. |
| disabled | boolean | No | - | @deprecated use `aria-disabled` instead.  The `disabled` prop **removes** the element from the Accessibility Tree and prevents it from receiving focus. This is not recommended.  All DLS components are designed to use the `aria-disabled` property instead, which will style the component to be disabled, but still allow keyboard focus and screen reader interactivity. |
| aria-disabled | Booleanish | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled". |
| status | FieldControlStatus | No | - | Default, error, or success state. Will use the value provided by the context when wrapped in a `FieldControl` component. |
| statusMessage | string | No | - | The status message to be displayed if status is 'success' or 'error'. |
| reactlytics | ReactlyticsProp | No | - |  |


## Common Patterns

### Basic Date Input (US Format: MM/DD/YYYY)
```tsx
<DateInput
  id="date"
  label="Date"
  lang="en-US"
/>
```

### With Default Value
```tsx
<DateInput
  id="birthdate"
  label="Date of Birth"
  defaultValue="1990-05-15"  // ISO format
/>
```

### With Placeholders
```tsx
<DateInput
  id="date"
  label="Date"
  showPlaceholder={true}
  lang="en-US"  // Shows MM, DD, YYYY placeholders
/>
```

### Month and Year Only
```tsx
<DateInput
  id="expiry"
  label="Card Exp expiration"
  fieldsToShow={['month', 'year']}
  hint="MM/YYYY"
/>
```

### Controlled with Validation
```tsx
const [date, setDate] = useState('');
const [error, setError] = useState('');

<DateInput
  id="date"
  label="Appointment Date"
  value={date}
  onChange={(e, isoDate) => {
    setDate(isoDate);
    if (new Date(isoDate) < new Date()) {
      setError('Date must be in the future');
    } else {
      setError('');
    }
  }}
  status={error ? 'error' : 'default'}
  statusMessage={error}
/>
```

## Accessibility Requirements

**Required:**
- Provide visible label with format hint (e.g., "MM/DD/YYYY")
- Each  field (month, day, year) has individual screen reader labels (auto-provided)
- Selected date is announced to screen readers (auto-provided)
- Use `aria-describedby` for hint and error messages

**Recommended:**
- Show format example in hint text
- Include validation messages for invalid dates
- Use `showPlaceholder` to display format visually

**Avoid:**
- Hiding the label or format information
- Using locale format that doesn't match user expectations
- Complex date constraints without clear messaging

## Anti-Patterns

❌ **Don't use wrong locale format:**
```tsx
<DateInput
  id="date"
  label="Date de naissance"
  lang="en-US"  // Wrong for French users
/>
```

✅ **Do use correct locale:**
```tsx
<DateInput
  id="date"
  label="Date de naissance"
  lang="fr-FR"  // DD/MM/YYYY format
/>
```

❌ **Don't omit format hint:**
```tsx
<DateInput
  id="date"
  label="Date"
/>
```

✅ **Do provide format guidance:**
```tsx
<DateInput
  id="date"
  label="Date"
  hint="MM/DD/YYYY"
  showPlaceholder={true}
/>
```

## Best Practices

- Date format changes by locale (US: MM/DD/YYYY, UK: DD/MM/YYYY, ISO: YYYY-MM-DD)
- Component automatically orders fields based on `lang` prop
- Values are always in ISO format (YYYY-MM-DD) regardless of display format
- Fields auto-advance when max length is reached
- Arrow keys navigate between fields
- Use appropriate `autocompleteSettings` for browser autofill
- Provide locale-specific validation messages
- Consider showing format in label: "Date of Birth (MM/DD/YYYY)"

## Localization Notes

Date formats vary by locale:
- **en-US**: MM/DD/YYYY (Month first)
- **en-GB**: DD/MM/YYYY (Day first)
- **en-CA**: YYYY-MM-DD (Year first)
- **fr-FR**: DD/MM/YYYY
- **de-DE**: DD.MM.YYYY (uses periods)

Component handles field ordering automatically based on `lang` prop.

## Related Components
- [Input](input.md) - For single-line text input
- [PhoneInput](phone-input.md) - For phone numbers with country codes
- [CurrencyInput](currency-input.md) - For monetary values with locale formatting
- [DatePicker](date-picker.md) - For calendar-based date selection