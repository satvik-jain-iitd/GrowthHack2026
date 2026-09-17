# DatePicker Component Reference
> AI agent-friendly reference for DLS DatePicker component

## Quick Reference
DatePicker enables users to select a single date using manual text entry or a calendar popover. Use for selecting past, present, or future dates like birth dates, payment dates, or appointment scheduling. The component supports keyboard navigation, disabled dates, and special date highlighting.

## Import
```tsx
import { DatePicker } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<DatePicker 
  id="birth-date"
  label="Date of Birth"
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | string | No | - | Text that's used as the visual and accessible label for the component. If not provided, hide the component's built-in label. The visible label for the DateInput component. |
| aria-labelledby | string | No | - | The id of a label, which provides an accessible name for the component |
| id | string | Yes | - | The id associated with the date picker. |
| name | string | No | - | The name used for form submission. |
| value | string | No | - | The value of the input for the date picker, in ISO format (controlled). |
| defaultValue | string | No | - | The default value of the input for the date picker, in ISO format (uncontrolled). |
| onChange | ((event: ChangeEvent<HTMLInputElement> \| MouseEvent<HTMLButtonElement, MouseEvent>, value: DatePickerValueObject) => void) | No | - | The handler called when the value of the input for the date picker changes. |
| onBlur | ((event: FocusEvent<HTMLInputElement, Element>, value: DatePickerValueObject) => void) | No | - | The handler called when the date picker input is blurred. |
| isOpen | boolean | No | - | The open state of the calendar (controlled). |
| defaultIsOpen | boolean | No | - | The default open state of the calendar (uncontrolled). |
| onIsOpenChange | ((isOpen: boolean) => void) | No | - | The handler called when the open state of the calendar changes. |
| disabledDates | DateStringOrDateStringRange[] | No | - | List of disabled dates in the calendar. |
| minDate | string | No | - | The minimum date allowed in the calendar, in ISO format. |
| maxDate | string | No | - | The maximum date allowed in the calendar, in ISO format. |
| circleDate | CalendarDayFlairConfig | No | - | Configuration to outline a day in the calendar with a circle. |
| squareDate | CalendarDayFlairConfig | No | - | Configuration to outline a day in the calendar with a square. |
| footer | ReactNode | No | - | The footer of the calendar. |
| shouldCreatePortal | boolean | No | - | Uses React portals to render date picker content in the document body to avoid clipping content |
| portalContainer | HTMLElement \| null | No | - | DOM element where the content should be rendered |
| disabled | boolean | No | - | @deprecated use `aria-disabled` instead.  The `disabled` prop **removes** the element from the Accessibility Tree and prevents it from receiving focus. |
| aria-disabled | Booleanish | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled". |
| required | boolean | No | - | If true, indicates that the consumer must specify a value for the input before the owning form can be submitted. |
| className | string | No | - | Additional CSS class names to apply to the DateInput container. |
| lang | string | No | - | BCP 47 language tag to format the date input fields according to different cultural norms. |
| aria-describedby | string | No | - | ID of element providing additional description of the date input |
| status | FieldControlStatus | No | - | Default, error, or success state. Will use the value provided by the context when wrapped in a `FieldControl` component. |
| statusMessage | string | No | - | The status message to be displayed if status is 'success' or 'error'. |
| hint | string | No | - | Hint text to assist the user, displayed below the input. |
| isHintVisuallyHidden | boolean | No | - | If true, visually hides the hint text (it will still be accessible to screen readers) |
| showPlaceholder | boolean | No | - | Whether to show placeholders in the input fields |
| autocompleteSettings | DateInputAutocompleteSettings | No | - | AutoComplete settings for each of the input field parts |
| reactlytics | ReactlyticsProp | No | - |  |
| labelOverrides | DatePickerLabelOverrides | No | - | Overrides for labels that have been defaulted in the component. |


### SpecialDateConfig

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `dateString | `string | Yes | Date in 'YYYY-MM-DD' format |
| `label | `string | Yes | Legend label for this date |
| `getLegendLabel | `(date: Date) => string | No | Function to generate legend label |

### DisabledDateConfig

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `dateString | `string | Yes | Date in 'YYYY-MM-DD' format |
| `getScreenReaderLabel | `(date: Date) => string | No | Custom screen reader label for disabled date |

## Common Patterns

### Basic Date Picker
```tsx
const [birthDate, setBirthDate] = useState('');

<DatePicker 
  id="birth-date"
  label="Date of Birth"
  value={birthDate}
  onChange={setBirthDate}
  hint="Select your date of birth"
/>
```

### Date Picker with Date Range Restrictions
```tsx
const today = new Date().toISOString().split('T')[0];
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
const minDate = oneYearAgo.toISOString().split('T')[0];

<DatePicker 
  id="transaction-date"
  label="Transaction Date"
  hint="Select a date within the last year"
  minDate={minDate}
  maxDate={today}
/>
```

### Date Picker with Disabled Dates
```tsx
const disabledDates = [
  '2026-02-15', // Valentine's Day (closed)
  '2026-02-16', // Weekend
  '2026-02-17', // Holiday
];

<DatePicker 
  id="appointment-date"
  label="Appointment Date"
  disabledDates={disabledDates}
  hint="Select an available appointment date"
  footer="We are closed on holidays and weekends"
/>
```

### Date Picker with Special Date Highlighting
```tsx
<DatePicker 
  id="payment-date"
  label="Payment Date"
  circleDate={{
    dateString: '2026-03-01',
    label: 'Statement Due Date',
    getLegendLabel: (day) => 
      `Due: ${day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }}
  squareDate={{
    dateString: '2026-03-15',
    label: 'Late Fee After This Date',
  }}
  footer="Choose a date before the late fee applies"
/>
```

### Past Date Selection (Birth Date)
```tsx
const maxDate = new Date().toISOString().split('T')[0]; // Today
const minDate = '1900-01-01'; // Reasonable minimum

<DatePicker 
  id="birth-date"
  label="Date of Birth"
  maxDate={maxDate}
  minDate={minDate}
  hint="You must be 18 or older"
  showPlaceholder
  required
/>
```

### Future Date Selection (Travel Date)
```tsx
const today = new Date();
const minDate = today.toISOString().split('T')[0];
const maxBookingDate = new Date();
maxBookingDate.setFullYear(maxBookingDate.getFullYear() + 1);
const maxDate = maxBookingDate.toISOString().split('T')[0];

<DatePicker 
  id="travel-date"
  label="Departure Date"
  minDate={minDate}
  maxDate={maxDate}
  hint="Select a date within the next year"
  required
/>
```

### Date Picker with Validation
```tsx
const [selectedDate, setSelectedDate] = useState('');
const [status, setStatus] = useState('default');
const [statusMessage, setStatusMessage] = useState('');

const handleDateChange = (event, date) => {
  setSelectedDate(date.dateString);
  
  const selected = new Date(date.dateString);
  const today = new Date();
  
  if (selected > today) {
    setStatus('error');
    setStatusMessage('Date cannot be in the future');
  } else {
    setStatus('success');
    setStatusMessage('Valid date selected');
  }
};

<DatePicker 
  id="effective-date"
  label="Effective Date"
  value={selectedDate}
  onChange={handleDateChange}
  status={status}
  statusMessage={statusMessage}
  required
/>
```

### Date Picker with Custom Date Format Display
```tsx
<DatePicker 
  id="custom-format-date"
  label="Event Date"
  lang="fr-FR"
  showPlaceholder
  hint="Sélectionnez une date"
/>
```

## Accessibility Requirements

**Required:**
- Always provide visible `label` prop
- Use `id` to uniquely identify the date picker
- Calendar popup must be keyboard navigable (arrow keys, Enter, Escape)
- Disabled dates must be announced to screen readers
- Calendar icon button must have accessible label
- Date format must be clear to users (via placeholder or hint)
- Selected date must be announced to screen readers

**Recommended:**
- Provide `hint` with format example (e.g., "Format: MM/DD/YYYY")
- Use `statusMessage` for validation errors
- Provide `footer` in calendar for important date restrictions
- Use `circleDate` and `squareDate` with clear legend labels
- Test calendar navigation with keyboard only
- Announce date restrictions clearly (min/max dates)

**Avoid:**
- Don't hide the label (violates WCAG 1.3.1)
- Don't rely on placeholder alone for format instructions
- Don't use icon button without accessible text alternative
- Don't disable dates without explanation
- Don't make calendar-only (text input must be functional)
- Don't use ambiguous date formats

## Anti-Patterns

❌ **Wrong: No label**
```tsx
<DatePicker id="date" hint="Select date" />
```
✅ **Correct: Always provide label**
```tsx
<DatePicker id="date" label="Event Date" hint="Select date" />
```

❌ **Wrong: No format guidance**
```tsx
<DatePicker id="date" label="Date" />
```
✅ **Correct: Provide format hint**
```tsx
<DatePicker 
  id="date" 
  label="Date" 
  hint="Format: MM/DD/YYYY"
  showPlaceholder
/>
```

❌ **Wrong: Manual date string manipulation**
```tsx
const date = `${month}/${day}/${year}`;
<DatePicker id="date" label="Date" value={date} />
```
✅ **Correct: Use YYYY-MM-DD format**
```tsx
const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
<DatePicker id="date" label="Date" value={date} />
```

❌ **Wrong: No validation feedback**
```tsx
<DatePicker 
  id="date" 
  label="Date" 
  required 
/>
```
✅ **Correct: Provide validation feedback**
```tsx
<DatePicker 
  id="date" 
  label="Date" 
  required
  status={isValid ? 'success' : 'error'}
  statusMessage={isValid ? '' : 'Please select a valid date'}
/>
```

❌ **Wrong: Disabled dates without explanation**
```tsx
<DatePicker 
  id="date" 
  label="Date"
  disabledDates={['2026-02-15', '2026-02-16']}
/>
```
✅ **Correct: Explain disabled dates**
```tsx
<DatePicker 
  id="date" 
  label="Appointment Date"
  disabledDates={['2026-02-15', '2026-02-16']}
  footer="Weekends and holidays are unavailable"
/>
```

## Best Practices

- **Date Format:**
  - Always use 'YYYY-MM-DD' for value, defaultValue, minDate, maxDate, disabledDates
  - Component handles display formatting based on locale
  - Store dates in ISO format in your data layer
- **Labels:**
  - Provide clear, descriptive labels (not just "Date")
  - Use hint for format guidance and context
  - Use statusMessage for validation errors
  - Use footer for calendar-specific instructions
- **Date Restrictions:**
  - Use minDate/maxDate to prevent invalid selections
  - Disable specific dates when needed (holidays, weekends)
  - Always explain why dates are disabled
  - Test edge cases (leap years, month boundaries)
- **Validation:**
  - Validate on blur, not on every keystroke
  - Provide clear error messages
  - Use visual status indicators (error, success)
  - Allow users to correct mistakes easily
- **Special Dates:**
  - Use circleDate/squareDate sparingly (1-2 special dates max)
  - Provide clear legend labels
  - Don't overload calendar with too many highlights
- **Calendar Popup:**
  - Opens on calendar icon click or input focus
  - Closes on date selection, outside click, or Escape key
  - Use shouldCreatePortal in modals/dropdowns
  - Calendar positions automatically (no overflow)
- **Keyboard Navigation:**
  - Tab: Navigate between input fields and calendar button
  - Arrow keys: Navigate calendar days
  - Enter: Select focused date
  - Escape: Close calendar
  - Page Up/Down: Navigate months
- **Localization:**
  - Use `lang` prop for internationalization
  - Date format adjusts automatically to locale
  - Month names and day labels localize automatically
- **Accessibility:**
  - Never remove labels
  - Always provide format guidance
  - Icon button includes screen reader label
  - Calendar includes ARIA labels and live regions
  - Test with keyboard only
  - Test with screen reader

## Related Components
- [DateRangePicker](date-range-picker.md) - For selecting date ranges
- [DateInput](date-input.md) - Lower-level date input component
