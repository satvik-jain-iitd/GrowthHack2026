# DateRangePicker Component Reference
> AI agent-friendly reference for DLS DateRangePicker component

## Quick Reference
DateRangePicker enables users to select a date range (start and end date) using manual text entry or a calendar popover. Use for filtering data by date range, selecting travel dates, or any task requiring a start and end date. The component enforces a minimum gap between dates and supports disabled dates.

## Import
```tsx
import { DateRangePicker } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<DateRangePicker 
  id="date-range"
  label="Travel Dates"
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | string | No¹ | - | Text that's used as the visual and accessible label for the component. If not provided, hide the component's built-in label. |
| aria-labelledby | string | No¹ | - | The id of a label, which provides an accessible name for the component |
| value | DateRangePickerValue | No | - | The value of the input for the date range picker, in ISO format (controlled). |
| defaultValue | DateRangePickerValue | No | - | The default value of the input for the date range picker, in ISO format (uncontrolled). |
| onChange | ((event: ChangeEvent<HTMLInputElement> \| MouseEvent<HTMLButtonElement, MouseEvent>, value: DateRangePickerValueObject) => void) | No | - | The callback function that is called when the date range picker value changes. |
| onBlur | ((event: FocusEvent<HTMLInputElement, Element>, value: DateRangePickerValueObject) => void) | No | - | The handler called when the date range picker input is blurred. |
| minDays | number | No | 1 | The minimum number of days that the selected range must span. |
| maxDays | number | No | - | The maximum number of days that the selected range can span. |
| shouldRetainEndDateOnChange | boolean | No | - | When set, retain the end date upon start date selection (when the start date is before the end date and the range is greater or equal to minDays). |
| shouldCreatePortal | boolean | No | - | Uses React portals to render date range picker content in the document body to avoid clipping content |
| portalContainer | HTMLElement \| null | No | - | DOM element where the content should be rendered |
| disabled | boolean | No | - | @deprecated use `aria-disabled` instead.  The `disabled` prop **removes** the element from the Accessibility Tree and prevents it from receiving focus. |
| aria-disabled | Booleanish | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled". |
| footer | ReactNode | No | - | The footer of the calendar. |
| name | string | No | - | The name used for form submission. |
| required | boolean | No | - | If true, indicates that the consumer must specify a value for the input before the owning form can be submitted. |
| className | string | No | - | Additional CSS class names to apply to the DateInput container. |
| id | string | Yes | - | The id associated with the date picker. |
| lang | string | No | - | BCP 47 language tag to format the date input fields according to different cultural norms. |
| aria-describedby | string | No | - | ID of element providing additional description of the date input |
| status | FieldControlStatus | No | - | Default, error, or success state. Will use the value provided by the context when wrapped in a `FieldControl` component. |
| statusMessage | string | No | - | The status message to be displayed if status is 'success' or 'error'. |
| hint | string | No | - | Hint text to assist the user, displayed below the input. |
| isHintVisuallyHidden | boolean | No | - | If true, visually hides the hint text (it will still be accessible to screen readers) |
| showPlaceholder | boolean | No | - | Whether to show placeholders in the input fields |
| reactlytics | ReactlyticsProp | No | - |  |
| isOpen | boolean | No | - | The open state of the calendar (controlled). |
| defaultIsOpen | boolean | No | - | The default open state of the calendar (uncontrolled). |
| onIsOpenChange | ((isOpen: boolean) => void) | No | - | The handler called when the open state of the calendar changes. |
| disabledDates | DateStringOrDateStringRange[] | No | - | List of disabled dates in the calendar. |
| minDate | string | No | - | The minimum date allowed in the calendar, in ISO format. |
| maxDate | string | No | - | The maximum date allowed in the calendar, in ISO format. |
| circleDate | CalendarDayFlairConfig | No | - | Configuration to outline a day in the calendar with a circle. |
| squareDate | CalendarDayFlairConfig | No | - | Configuration to outline a day in the calendar with a square. |
| labelOverrides | DateRangePickerLabelOverrides | No | - | Overrides for labels that have been defaulted in the component. |

> ¹ At least one of `label` or `aria-labelledby` is required. If `label` is omitted, `aria-labelledby` must point to a visible label elsewhere on the page.

### DateRangePickerValueObject shape

The `value` argument passed to `onChange` and `onBlur` has this shape:

```ts
interface DateRangePickerValueObject {
  start: {
    dateString: string;      // ISO date string
    dateObject: Date | null; // parsed Date, or null if invalid
  };
  end: {
    dateString: string;
    dateObject: Date | null;
  };
  isInvalid: boolean;
}
```

## Common Patterns

### Basic Date Range Picker
```tsx
const [dateRange, setDateRange] = useState({ start: '', end: '' });

<DateRangePicker 
  id="basic-range"
  label="Select Date Range"
  value={dateRange}
  onChange={(_, { start, end }) =>
    setDateRange({ start: start.dateString, end: end.dateString })
  }
  hint="Choose your start and end dates"
/>
```

### Travel Date Selection
```tsx
const today = new Date().toISOString().split('T')[0];

<DateRangePicker 
  id="travel-dates"
  label="Trip Dates"
  hint="Select the dates of your trip"
  minDate={today}
  minDays={1}
  showPlaceholder
  required
/>
```

### Statement Period Filter
```tsx
const [period, setPeriod] = useState({ 
  start: '2026-01-01', 
  end: '2026-01-31' 
});

<div>
  <h3>Filter Transactions</h3>
  <DateRangePicker 
    id="statement-period"
    label="Statement Period"
    value={period}
    onChange={(_, { start, end }) =>
      setPeriod({ start: start.dateString, end: end.dateString })
    }
    hint="Select the statement period to view"
  />
</div>
```

### Date Range with Disabled Dates

`disabledDates` accepts plain ISO date strings and/or range objects with `from`/`to` keys:

```tsx
const disabledDates = [
  '2026-03-01', // Holiday
  '2026-03-02', // Weekend
  { from: '2026-03-08', to: '2026-03-15' }, // Maintenance window
];

<DateRangePicker 
  id="booking-range"
  label="Reservation Dates"
  disabledDates={disabledDates}
  footer="Some dates may be unavailable due to holidays or maintenance"
  hint="Select your check-in and check-out dates"
/>
```

### Date Range with Special Dates
```tsx
<DateRangePicker 
  id="promotion-range"
  label="Promotional Period"
  circleDate={{
    dateString: '2026-07-04',
    label: 'Independence Day Sale',
  }}
  squareDate={{
    dateString: '2026-07-20',
    label: 'Flash Sale Day',
  }}
  hint="Select dates to view promotional pricing"
/>
```

### Date Range with Minimum Days
```tsx
<DateRangePicker 
  id="rental-period"
  label="Rental Period"
  minDays={3}
  hint="Minimum rental period is 3 days"
  footer="Weekend rentals require a 3-day minimum"
/>
```

### Historical Data Range
```tsx
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
const minDate = oneYearAgo.toISOString().split('T')[0];
const maxDate = new Date().toISOString().split('T')[0];

<DateRangePicker 
  id="report-range"
  label="Report Period"
  minDate={minDate}
  maxDate={maxDate}
  hint="Select a date range within the last year"
/>
```

### Date Range with Validation
```tsx
const [range, setRange] = useState({ start: '', end: '' });
const [status, setStatus] = useState('default');
const [statusMessage, setStatusMessage] = useState('');

const handleRangeChange = (_, { start, end, isInvalid }) => {
  const startDateString = start.dateString;
  const endDateString = end.dateString;
  setRange({ start: startDateString, end: endDateString });
  
  if (!startDateString || !endDateString || isInvalid) {
    setStatus('default');
    setStatusMessage('');
    return;
  }
  
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);
  
  if (daysDiff > 90) {
    setStatus('error');
    setStatusMessage('Date range cannot exceed 90 days');
  } else {
    setStatus('success');
    setStatusMessage('Valid date range selected');
  }
};

<DateRangePicker 
  id="validated-range"
  label="Date Range"
  value={range}
  onChange={handleRangeChange}
  status={status}
  statusMessage={statusMessage}
  hint="Maximum range: 90 days"
/>
```

### Vacation Booking with Retained End Date
```tsx
<DateRangePicker 
  id="vacation-dates"
  label="Vacation Dates"
  shouldRetainEndDateOnChange
  minDays={7}
  hint="Plan your vacation (minimum 7 days)"
  footer="Selecting a new start date will keep your end date if the range meets the minimum stay"
/>
```

### Date Range in Modal (Portal)
```tsx
<Modal isOpen={isOpen}>
  <ModalContent>
    <DateRangePicker 
      id="modal-range"
      label="Select Date Range"
      shouldCreatePortal
    />
  </ModalContent>
</Modal>
```

### Disabled Date Range Picker
```tsx
<DateRangePicker 
  id="locked-range"
  label="Billing Period"
  value={{ start: '2026-02-01', end: '2026-02-28' }}
  aria-disabled
  hint="This billing period is locked"
/>
```

### Date Range with Custom Labels
```tsx
<DateRangePicker 
  id="custom-labels"
  label="Event Duration"
  labelOverrides={{
    startInputGroupScreenReaderLabel: 'Event start date',
    endInputGroupScreenReaderLabel: 'Event end date',
  }}
  hint="Select when your event begins and ends"
/>
```

## Accessibility Requirements

**Required:**
- Always provide visible `label` prop (or `aria-labelledby` pointing to a visible label)
- Use unique `id` for the date range picker
- Calendar popup must be keyboard navigable
- Disabled dates must be announced to screen readers
- Calendar icon button must have accessible label
- Date format must be clear (via placeholder or hint)
- Selected date range must be announced to screen readers
- Start and end inputs must have distinct labels

**Recommended:**
- Provide `hint` with format example and any date restrictions
- Use `statusMessage` for validation errors
- Provide `footer` for important calendar information
- Use `minDays` to enforce business rules
- Test keyboard navigation thoroughly
- Announce date range changes to assistive tech

**Avoid:**
- Don't hide the label (violates WCAG 1.3.1)
- Don't rely on placeholder alone for instructions
- Don't use icon button without accessible text
- Don't allow invalid ranges (enforce minDays, maxDate)
- Don't make calendar-only (text inputs must work)
- Don't use confusing start/end labels

## Anti-Patterns

❌ **Wrong: No label**
```tsx
<DateRangePicker id="range" hint="Select dates" />
```
✅ **Correct: Always provide label**
```tsx
<DateRangePicker id="range" label="Date Range" hint="Select dates" />
```

❌ **Wrong: No validation for range length**
```tsx
<DateRangePicker id="range" label="Range" />
```
✅ **Correct: Enforce reasonable limits**
```tsx
const handleChange = (_, { start, end }) => {
  const days = calculateDaysBetween(start.dateString, end.dateString);
  if (days > 365) {
    setError('Range cannot exceed 1 year');
    return;
  }
  setValue({ start: start.dateString, end: end.dateString });
};

<DateRangePicker 
  id="range" 
  label="Date Range" 
  onChange={handleChange}
  hint="Maximum 1 year range"
/>
```

❌ **Wrong: End date before start date**
```tsx
<DateRangePicker 
  id="range" 
  label="Range"
  value={{ start: '2026-03-01', end: '2026-02-01' }}
/>
```
✅ **Correct: Validate date order**
```tsx
const [range, setRange] = useState({ start: '', end: '' });

const handleChange = (_, { start, end }) => {
  const startStr = start.dateString;
  const endStr = end.dateString;
  if (startStr && endStr) {
    if (new Date(endStr) < new Date(startStr)) {
      setRange({ start: startStr, end: startStr });
      return;
    }
  }
  setRange({ start: startStr, end: endStr });
};

<DateRangePicker 
  id="range" 
  label="Date Range"
  value={range}
  onChange={handleChange}
/>
```

❌ **Wrong: No guidance on minimum days**
```tsx
<DateRangePicker id="range" label="Range" minDays={7} />
```
✅ **Correct: Explain minimum days requirement**
```tsx
<DateRangePicker 
  id="range" 
  label="Rental Period" 
  minDays={7}
  hint="Minimum rental period is 7 days"
/>
```

❌ **Wrong: Using wrong date format**
```tsx
<DateRangePicker 
  value={{ start: '02/15/2026', end: '02/20/2026' }}
/>
```
✅ **Correct: Use YYYY-MM-DD format**
```tsx
<DateRangePicker 
  value={{ start: '2026-02-15', end: '2026-02-20' }}
/>
```

## Best Practices

- **Date Format:**
  - Always use 'YYYY-MM-DD' for value properties
  - Component handles display formatting based on locale
  - Store date ranges in ISO format
  - Validate both start and end dates
- **Labels:**
  - Use descriptive labels specific to use case
  - Provide hint for format and restrictions
  - Use statusMessage for validation errors
  - Use footer for calendar-specific guidance
  - Start/end inputs auto-labeled as "Start date" and "End date"
- **Range Validation:**
  - Use `minDays` to enforce minimum range
  - Validate maximum range length in onChange
  - Ensure end date is not before start date
  - Validate against minDate/maxDate bounds
  - Provide clear error messages
- **Minimum Days:**
  - Set `minDays` for business requirements (e.g., 3-day minimum rental)
  - Default is 1 day — start and end must be on **different** days (a same-day range fails the `>= 1` check)
  - Explain minimum requirement in hint or footer
- **Date Restrictions:**
  - Use minDate/maxDate for valid date boundaries
  - Disable specific dates when needed (holidays, maintenance)
  - Always explain why dates are restricted
  - Test edge cases (month boundaries, leap years)
- **User Experience:**
  - `shouldRetainEndDateOnChange` preserves the end date when a new start date is picked (if start is before end and the span meets `minDays`); it does **not** auto-adjust the end date
  - Show range length (e.g., "5 days selected")
  - Provide feedback when invalid range selected
  - Allow easy clearing/resetting of range
  - Consider default ranges for common use cases
- **Calendar Interaction:**
  - First click selects start date
  - Second click selects end date
  - Visual range preview between clicks
  - Can re-select either date after both selected
  - Respects minDays constraint during selection
- **Keyboard Navigation:**
  - Tab: Navigate between start/end inputs and calendar button
  - Arrow keys: Navigate calendar days
  - Enter: Select focused date
  - Escape: Close calendar
  - Shift+Tab: Navigate backwards
- **Accessibility:**
  - Never remove labels
  - Provide format guidance
  - Icon button includes screen reader label
  - Date range announced via ARIA live region
  - Test with keyboard only
  - Test with screen reader
- **Performance:**
  - Validate on blur, not every keystroke
  - Debounce onChange calls if needed
  - Memoize complex calculations

## Related Components
- [DatePicker](date-picker.md) - For single date selection
- [DateInput](date-input.md) - Lower-level date input component
- [Label](label.md) - For form field labels
- [Hint](hint.md) - For supplemental help text