# PhoneInput Component Reference
> AI agent-friendly reference for DLS PhoneInput component

## Quick Reference
Composite input combining a country selector with a phone number field. Use for collecting international phone numbers with appropriate country calling codes.

## Import
```tsx
import { PhoneInput } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<PhoneInput
  id="phone-input"
  label="Phone Number"
  hint="Enter your phone number"
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string \| number | No | - | Value to be shown in the PhoneInput (controlled). The value will be reformatted when focus is not on the PhoneInput. e.g. if `phoneFormat` is "### ### ####" and `value` is "1234567890" then it will be displayed as "123 456 7890". |
| onChange | ((event: ChangeEvent<HTMLInputElement>, selectedOption?: SelectOption) => void) | No | - | The onChange event handler called when the input is changed. |
| onBlur | ((event: FocusEvent<HTMLInputElement, Element>, selectedOption?: SelectOption) => void) | No | - | The onBlur event handler called when the input is blurred. |
| onFocus | ((event: FocusEvent<HTMLInputElement, Element>) => void) | No | - | The onFocus event handler called when the input is focused. |
| disabled | boolean | No | - | @deprecated use `aria-disabled` instead.  The `disabled` prop **removes** the element from the Accessibility Tree and prevents it from receiving focus. |
| aria-disabled | Booleanish | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled". |
| label | string | No | - | Text that's used as the visual and accessible label for the component. If not provided, hide the component's built-in label. |
| name | string | No | - | The name attribute of the input field, will default to the id provided |
| required | boolean | No | - | Flag to allow for default validation message to show |
| defaultValue | string \| number | No | - | Default value to be shown in the PhoneInput (uncontrolled). The value will be reformatted when focus is not on the PhoneInput. e.g. if `phoneFormat` is "### ### ####" and `defaultValue` is "1234567890" then it will be displayed as "123 456 7890". |
| aria-describedby | string | No | - | The id of the container of the text describing the input, intended for custom hint text |
| aria-labelledby | string | No | - | The id of a label, which provides an accessible name for the component Identifies the element (or elements) that labels the current element. @see aria-describedby. |
| status | FieldControlStatus | No | - | Default, error, or success state. Will use the value provided by the context when wrapped in a `FieldControl` component. |
| statusMessage | string | No | - | The status message to be displayed if status is 'success' or 'error'. |
| containerRef | RefObject<HTMLDivElement> \| ((instance: HTMLDivElement \| null) => void) | No | - | A ref to the container element |
| childrenContainerProps | Omit<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> | No | - | Props to be spread onto the span containing the children |
| containerProps | Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> | No | - | Props to be spread onto the parent div container |
| id | string | Yes | - | The id for the input field |
| hint | string | No | - | Hint text for input |
| isHintVisuallyHidden | boolean | No | - | If true, visually hides the hint text (it will still be accessible to screen readers) |
| onSelectChange | ((event: ChangeEvent<HTMLSelectElement>, selectedOption?: SelectOption) => void) | No | - | The onChange event handler called when the multi-country select is changed. |
| onSelectBlur | ((event: FocusEvent<HTMLSelectElement, Element>, selectedOption?: SelectOption) => void) | No | - | The onBlur event handler called when the multi-country select is blurred. |
| labelOverrides | PhoneInputLabelOverrides | No | - | Overrides for labels that have been defaulted in the component. |
| reactlytics | ReactlyticsProp | No | - |  |
| autocomplete | string | No | - | Must be defined when the form control collects user personal data. |


## Common Patterns

### Single Country (US)
```tsx
<PhoneInput
  id="phone"
  label="Phone Number"
  hint="Enter your phone number"
  locale="en-US"
  callingCode={1}
  phoneFormat="### ### ####"
/>
```

### Single Country (Show Country Flag, Hide Calling Code)
```tsx
<PhoneInput
  id="phone"
  label="Phone Number"
  showCallingCode={false}
  locale="en-GB"
  callingCode={44}
/>
```

### Multiple Countries
```tsx
<PhoneInput
  id="phone-input"
  selectId="country-select"
  label="Phone Number"
  selectOptions={[
    {
      callingCode: 1,
      country: 'United States',
      locale: 'en-US',
      phoneFormat: '### ### ####'
    },
    {
      callingCode: 44,
      country: 'United Kingdom',
      locale: 'en-GB',
      phoneFormat: '#### ######'
    },
    {
      callingCode: 65,
      country: 'Singapore',
      locale: 'en-SG',
      phoneFormat: '#### ####'
    }
  ]}
/>
```

### Controlled Country Selection
```tsx
const [selectedLocale, setSelectedLocale] = useState('en-US');

<PhoneInput
  id="phone"
  selectId="country"
  label="Phone Number"
  selectedLocale={selectedLocale}
  onSelectChange={(e, option) => setSelectedLocale(option.locale)}
  selectOptions={countryOptions}
/>
```

## Accessibility Requirements

**Required:**
- Provide visible labels for both country selector and phone input
- Use `aria-describedby` for hint and error messages
- Ensure country selector has appropriate screen reader label

**Recommended:**
- Use locale-appropriate phone formats
- Provide clear validation messages for invalid numbers
- Default to user's locale when known

**Avoid:**
- Hardcoded phone formats without locale consideration
- Overly restrictive input masking that prevents valid numbers
- Assuming all phone numbers have the same length

## Anti-Patterns

❌ **Don't use US format for all countries:**
```tsx
<PhoneInput
  id="phone"
  label="Phone"
  phoneFormat="### ### ####"  // Wrong for non-US
  callingCode={44}  // UK code
/>
```

✅ **Do use appropriate format for each country:**
```tsx
<PhoneInput
  id="phone"
  label="Phone"
  locale="en-GB"
  callingCode={44}
  phoneFormat="#### ######"
/>
```

❌ **Don't hide country selection for international users:**
```tsx
<PhoneInput
  id="phone"
  label="Phone"
  // No selectOptions for international site
/>
```

✅ **Do provide country selection:**
```tsx
<PhoneInput
  id="phone"
  selectId="country"
  label="Phone Number"
  selectOptions={allCountries}
/>
```

## Best Practices

- Default to user's current locale/country when possible
- Use `selectOptions` for forms where users may be from different countries
- Respect locale-specific phone number formats
- Don't repurpose input masks for other regions without testing
- Allow flexibility in formatting (spaces, dashes, parentheses)
- Provide clear examples in hint text
- Consider using `autoComplete="tel"` for browser autofill

## Localization Notes

Phone formats vary globally:
- **US**: 10 digits with area code (### ### ####)
- **Hong Kong**: 8 digits, no area code (#### ####)
- **UK**: 10-11 digits (#### ######)
- **Singapore**: 8 digits (#### ####)

Input masks must be localized appropriately. See full country calling codes table in source documentation.

## Related Components
- Input - For basic text input
- Select - For dropdown selection
- CurrencyInput - For monetary values with locale formatting
- DateInput - For date values with locale formatting
