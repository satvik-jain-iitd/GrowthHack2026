# Flag Component Reference

> AI agent-friendly reference for DLS Flag component

## Quick Reference

Displays country flags as SVG images. Supports different sizes and custom content.

## Import

```tsx
import { Flag } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
<Flag alt="United States" />
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| alt | string | | `''` | Alt text for flag image (empty = decorative) |
| countryCode | string | | `'US'` | ISO 3166-1 alpha-2 country code (e.g., `'US'`, `'GB'`, `'CA'`) |
| size | `'sm'` \| `'md'` \| `'lg'` | | `'sm'` | Flag size. `'sm'` and `'md'` apply a size modifier class; `'lg'` applies no modifier (renders at natural/full SVG size). |
| className | string | | - | Additional CSS classes applied to the wrapping `<span>` |
| children | ReactNode | | - | Custom content; when provided, overrides the default flag `<img>` |


## Common Patterns

### Basic Flag
```tsx
<Flag alt="United States" />
```

### Specific Country
```tsx
<Flag countryCode="GB" alt="United Kingdom" />
<Flag countryCode="CA" alt="Canada" />
<Flag countryCode="MX" alt="Mexico" />
```

### Medium Size
```tsx
<Flag countryCode="US" alt="United States" size="md" />
```

### Decorative Flag (No Alt Text)

When `alt` is omitted (or set to `""`), the image is treated as decorative. Always pair with visible text so sighted and non-sighted users alike get the country context:

```tsx
<div className="flex flex-align-center">
  <Flag countryCode="US" />
  <p>United States</p>
</div>
```

## Accessibility Requirements

**Required:**
- Provide `alt` text when flag conveys meaningful information
- Use empty string `alt=""` for decorative flags (no meaning)

**Recommended:**
- Use country name as alt text for clarity
- Don't rely solely on flag to convey critical information

## Best Practices

- Use standard ISO country codes
- Provide alt text for flags that convey information
- Use consistent sizing across similar contexts
- Consider pairing with country name text for clarity

## Related Components

- [Badge](badge.md) - For status and labels
