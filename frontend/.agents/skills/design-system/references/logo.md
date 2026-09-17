# Logo Component Reference

> AI agent-friendly reference for DLS Logo component

## Quick Reference

American Express logo in various variants (line/stack), colors (brand/white/brand-alt), and sizes. Automatically adapts to theme.

## Import

```tsx
import { Logo } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
<Logo alt="American Express" />
```

## Props API

**Important:** Logo uses **conditional prop types** - certain prop combinations are not allowed:
- **Bluebox variants** (`bluebox-solid`, `bluebox-alt`): Cannot use `color` prop (always brand color)
- **Line/Stack variants** (`line`, `stack`): Can use `color` prop
- **Custom logo** (with `children`): Cannot use `variant` or `color` props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| alt | string | No | - | Fallback text to be displayed in the space the image would occupy if the asset fails to load. It should be able to take the place of the logo without altering the meaning of the page.  If left empty, the component will be given the accessible role of 'presentation' to remove the image from the accessibility tree. |
| children | NonNullable<ReactNode> | No | - | Passing children to this component will replace the logo assets entirely, allowing for custom assets to be used whilst making use of the component wrapper styles |
| className | string | No | - | Additional class names to apply to the outermost component HTML element |
| color | "brand" \| "brand-alt" \| "white" | No | brand | What color to render the logo asset. What color to render the logo asset. Note: only applicable for 'line' and 'stack' variants. 'bluebox-solid' and 'bluebox-alt' variants are only available in brand color. @remarks color is only applicable for line and stack logos. bluebox logos are only available in brand color. |
| size | "xs" \| "sm" \| "md" \| "lg" | No | "md" | The size of the logo asset. |
| variant | "line" \| "bluebox-solid" \| "bluebox-alt" \| "stack" | No | "line" | Logo variant. "line" is horizontal, "stack" is vertical, "bluebox-solid" is blue box with white logo, "bluebox-alt" is blue box outline. |

## Common Patterns

### Default Logo
```tsx
<Logo alt="American Express" />
```

### Stack Variant
```tsx
<Logo variant="stack" alt="American Express" />
```

### White Logo (for dark backgrounds)
```tsx
<Logo color="white" alt="American Express" />
```

### Alternative Brand Color
```tsx
<Logo color="brand-alt" alt="American Express" />
```

### Large Logo
```tsx
<Logo size="lg" alt="American Express" />
```

### Decorative Logo
```tsx
<Logo />
```

### Bluebox Solid Variant
```tsx
<Logo variant="bluebox-solid" alt="American Express" />
```

### Bluebox Alt Variant (Outline)
```tsx
<Logo variant="bluebox-alt" alt="American Express" />
```

### Custom Logo (With Children)
```tsx
<Logo alt="Custom Company Logo">
  <img src="/assets/custom-logo.svg" alt="Custom Company Logo" />
</Logo>
```

### Clickable Logo (Link to Homepage)
```tsx
import { Link } from '@americanexpress/dls-react';

<Link href="/" aria-label="American Express home">
  <Logo alt="American Express" />
</Link>
```

## Accessibility Requirements

**Required:**
- Provide `alt` prop when logo is meaningful (e.g., page header)
- Omit `alt` prop when logo is purely decorative

**Recommended:**
- Use "American Express" as alt text typically
- Ensure sufficient contrast between logo and background

## Best Practices

- Use `variant="line"` for headers and navigation
- Use `variant="stack"` for compact spaces or mobile
- Use `color="white"` on dark backgrounds
- Logo automatically adapts to theme tokens
- Keep logos clickable in navigation contexts

## Related Components

- [Button](button.md) - To make logo clickable
- [Links](links.md) - For logo navigation
