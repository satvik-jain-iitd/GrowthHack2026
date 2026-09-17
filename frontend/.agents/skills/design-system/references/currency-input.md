# CurrencyInput Component Reference
> AI agent-friendly reference for DLS CurrencyInput component

## Quick Reference
Specialized input for monetary values with automatic locale-based formatting. Handles currency symbols, decimal separators, and grouping based on locale.

## Import
```tsx
import { CurrencyInput } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<CurrencyInput
  currency="USD"
  hint="Hint Text"
  id="currency-input-id"
  label="Label Text"
  locale="en-US"
  statusMessage="Message."
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | The ID for the input field, necessary for accessibility and labeling |
| label | string | No | - | Text that's used as the visual and accessible label for the component |
| value | string \| number | No | "" | Value to be shown in the currency input. Will be reformatted to the proper locale string based on the props supplied |
| defaultValue | string \| number | No | - | Default value to be shown in the field. Will be reformatted to the proper locale string |
| resetValue | string \| number | No | - | If passed, the input value will be reset to this number when the input is cleared during the onBlur event |
| currency | string | No | - | ISO 4217 currency code |
| locale | string | No | - | BCP 47 language tag |
| showFractions | boolean | No | - | If `false` will hide the fractional number (e.g., "300.00" -> "300") |
| shouldUseCurrencySymbol | boolean | No | - | If `true` will localize currency code (if known) to show symbol (e.g., $/£/€) |
| canBeNegative | boolean | No | - | If `true`, the input will allow negative values (e.g., "-1234"). Defaults to `false` |
| customCurrencySymbol | string | No | - | Custom currency symbol to use when `shouldUseCurrencySymbol` is true. If not provided, will use the symbol based on the `currency` prop |
| hint | string | No | - | Hint text to use inbuilt hint instead of a custom label |
| isHintVisuallyHidden | boolean | No | - | If true, visually hides the hint text (it will still be accessible to screen readers) |
| status | FieldControlStatus | No | - | Default, error, or success state. Will use the value provided by the context when wrapped in a `FieldControl` component |
| statusMessage | string | No | - | The status message to be displayed if status is 'success' or 'error' |
| name | string | No | - | The name attribute of the input field, will default to the id provided |
| autoComplete | string | No | - | Must be defined when the form control collects user personal data |
| required | boolean | No | - | Flag to allow for default validation message to show |
| aria-labelledby | string | No | - | Identifies the element (or elements) that labels the current element |
| aria-describedby | string | No | - | The id of the container of the text describing the input, intended for custom hint text |
| aria-disabled | boolean | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled" |
| disabled | boolean | No | - | **Deprecated:** Use `aria-disabled` instead. Removes element from Accessibility Tree and prevents focus |
| onChange | ChangeEventHandler<HTMLInputElement> | No | - | The onChange event handler (controlled) |
| onBlur | (event: FocusEvent<HTMLInputElement>, params: CurrencyInputOnBlurParams) => void | No | - | The onBlur event handler (controlled). Should be used to get the normalized (non-localized) value as a number |
| containerRef | RefObject<HTMLDivElement> | No | - | A ref to the container element |
| containerProps | HTMLDivElement Props | No | - | Props to be spread onto the parent div container |

## Common Patterns

### US Dollars
```tsx
<CurrencyInput
  id="price"
  label="Price"
  currency="USD"
  locale="en-US"
  hint="Enter the price in USD"
/>
```

### Euros (European Format)
```tsx
<CurrencyInput
  id="price"
  label="Prix"
  currency="EUR"
  locale="fr-FR"
  hint="Entrez le prix en EUR"
/>
```

### Without Decimals
```tsx
<CurrencyInput
  id="amount"
  label="Amount"
  currency="JPY"
  locale="ja-JP"
  showFractions={false}
/>
```

### With Currency Code Instead of Symbol
```tsx
<CurrencyInput
  id="amount"
  label="Amount"
  currency="GBP"
  locale="en-GB"
  shouldUseCurrencySymbol={false}
/>
```

### Controlled with Validation
```tsx
const [amount, setAmount] = useState('');
const [error, setError] = useState('');

<CurrencyInput
  id="amount"
  label="Payment Amount"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  onBlur={(e, data) => {
    if (data.normalizedValue < 10) {
      setError('Minimum amount is $10.00');
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
- Provide visible label
- Include currency description for screen readers (auto-provided)
- Use `aria-describedby` for hint/error messages

**Recommended:**
- Provide hint text for expected format or constraints
- Use status messages to explain validation errors
- Default to user's locale when known

**Avoid:**
- hardcoded currency symbols without locale consideration
- Disabling currency inputs without clear reason

## Anti-Patterns

❌ **Don't hardcode US format for all locales:**
```tsx
<CurrencyInput
  id="amount"
  label="Montant"
  currency="EUR"
  locale="en-US"  // Wrong locale for EUR
/>
```

✅ **Do use correct locale:**
```tsx
<CurrencyInput
  id="amount"
  label="Montant"
  currency="EUR"
  locale="fr-FR"
/>
```

❌ **Don't show fractions for currencies without them:**
```tsx
<CurrencyInput
  id="amount"
  label="金額"
  currency="JPY"
  showFractions={true}  // JPY doesn't use fractions
/>
```

✅ **Do respect currency conventions:**
```tsx
<CurrencyInput
  id="amount"
  label="金額"
  currency="JPY"
  showFractions={false}
/>
```

## Best Practices

- Use appropriate locale for each currency
- Component handles formatting automatically via `Intl.NumberFormat`
- Symbol placement varies by locale (before/after amount)
- Respect currency-specific decimal places (USD: 2, JPY: 0)
- Use `onBlur` callback to access `normalizedValue` (numeric) and `formattedValue` (string)
- Set `resetValue` for default amount when user clears field
- Use `inputMode="decimal"` (auto-applied) for mobile keyboards

## Localization Notes

Currency symbol placement varies by locale:
- **US** (en-US): $1,234.56
- **France** (fr-FR): 1 234,56 €
- **Germany** (de-DE): 1.234,56 €
- **UK** (en-GB): £1,234.56

Component handles all formatting automatically. Just provide correct `currency` and `locale` props.

## Related Components
- [Input](input.md) - For non-currency numeric input
- [PhoneInput](phone-input.md) - For phone numbers with locale formatting
- [DateInput](date-input.md) - For date values with locale formatting
