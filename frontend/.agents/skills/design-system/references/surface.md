# Surface Component Reference

> AI agent-friendly reference for DLS Surface component

## Quick Reference

Visual layer/container where content is presented. All nested elements adapt to surface variant. Applies background and text styles automatically.

## Import

```tsx
import { Surface } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
<Surface variant="foreground">
  <p>Content here</p>
</Surface>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | The children inside the layout. |
| variant | `'base'` \| `'foreground'` \| `'fg-subtle'` \| `'fg-brand'` \| `'fg-brand-alt'` | No | `'foreground'` | The surface variables to be defined for use by components nested inside this component. |
| className | string | No | - | Additional CSS classes |
| ...divProps | - | No | - | Accepts all standard div element props (onClick, style, aria-*, data-*, etc.) |

**Note:** Surface extends `ComponentPropsWithRef<'div'>`, so it accepts all native div element props including `onClick`, `style`, `id`, `aria-*`, `data-*`, etc.

### Surface Variants

- **base**: Background surface (page background)
- **foreground**: Default content surface (cards, panels) - **DEFAULT**
- **fg-subtle**: Subtle foreground (nested sections)
- **fg-brand**: Brand-colored surface (highlights)
- **fg-brand-alt**: Alternative brand surface

## Common Patterns

### Card/Panel (Using Default Variant)
```tsx
<Surface className="pad-2">
  <Heading level={2} variant="sans-medium-bold">
    Card Title
  </Heading>
  <p>Card content...</p>
</Surface>
```

### Branded Section
```tsx
<Surface variant="fg-brand" className="pad-3">
  <Heading level={2} variant="sans-large-bold">
    Special Offer
  </Heading>
  <p>Limited time promotion...</p>
</Surface>
```

### Nested Surfaces
```tsx
<Surface variant="base">
  <Surface variant="foreground">
    <p>Main content</p>
    <Surface variant="fg-subtle">
      <p>Nested section</p>
    </Surface>
  </Surface>
</Surface>
```

### Alternative Brand Surface
```tsx
<Surface variant="fg-brand-alt">
  <p>Alternative branding...</p>
</Surface>
```

### With Event Handlers
```tsx
<Surface 
  variant="foreground" 
  className="pad-2"
  onClick={() => console.log('Surface clicked')}
  role="button"
  tabIndex={0}
>
  <p>Interactive surface</p>
</Surface>
```

### With Custom Attributes
```tsx
<Surface 
  variant="fg-brand" 
  className="pad-2"
  id="promo-section"
  data-testid="promotional-banner"
  aria-labelledby="promo-title"
>
  <Heading level={2} variant="sans-medium-regular" id="promo-title">Special Promotion</Heading>
  <p>Limited time offer...</p>
</Surface>
```

## Accessibility Requirements

**Required:**
- Surfaces automatically ensure color contrast
- All nested components adapt colors for accessibility

**Recommended:**
- Use semantic HTML within surfaces
- Test content visibility in both light/dark modes
- Use appropriate ARIA attributes when needed

**Avoid:**
- Don't rely solely on color to convey information
- Don't nest too many surface layers (3 max recommended)

## Best Practices

- Use `base` for page backgrounds
- Use `foreground` (default) for cards, panels, and dialogs
- Use `fg-subtle` for secondary sections within foreground
- Use `fg-brand` for promotional or highlighted content
- Use `fg-brand-alt` for alternative branded sections
- Components auto-adapt text/border colors to surface
- Nest surfaces logically (base → foreground → fg-subtle)
- Limit nesting depth to 3 levels for clarity
- Use utility classes for spacing (pad-*, margin-*)
- Surface variants apply via `data-dls-surface` attribute

## Advanced Usage

### Layered Layout
```tsx
<Surface variant="base">
  <Surface variant="foreground" className="pad-2 margin-2">
    <Heading level={1} variant="sans-xlarge-bold">Welcome</Heading>
    
    <Surface variant="fg-subtle" className="pad-2 margin-2-t">
      <Heading level={2} variant="sans-medium-bold">Details</Heading>
      <p>Additional information...</p>
    </Surface>
    
    <Surface variant="fg-brand" className="pad-2 margin-2-t">
      <Heading level={2} variant="sans-medium-bold">Promotion</Heading>
      <p>Special offer...</p>
    </Surface>
  </Surface>
</Surface>
```

### Dark Mode Override
```tsx
<Surface variant="foreground" data-dls-mode="dark" className="pad-2">
  <p>This surface is forced to dark mode</p>
</Surface>
```


## Anti-Patterns

❌ **Wrong: Omitting children**
```tsx
<Surface variant="foreground" />
```

✅ **Correct: Always provide children**
```tsx
<Surface variant="foreground">
  <p>Content here</p>
</Surface>
```

---

❌ **Wrong: Over-nesting surfaces**
```tsx
<Surface variant="base">
  <Surface variant="foreground">
    <Surface variant="fg-subtle">
      <Surface variant="fg-brand">
        <Surface variant="fg-brand-alt">
          <p>Too many layers!</p>
        </Surface>
      </Surface>
    </Surface>
  </Surface>
</Surface>
```

✅ **Correct: Limit nesting to 3 levels**
```tsx
<Surface variant="base">
  <Surface variant="foreground">
    <Surface variant="fg-subtle">
      <p>Appropriate nesting</p>
    </Surface>
  </Surface>
</Surface>
```

---

❌ **Wrong: Using div instead of Surface for themed sections**
```tsx
<div className="bg-brand">
  <p>Branded content</p>
</div>
```

✅ **Correct: Use Surface for proper theme adaptation**
```tsx
<Surface variant="fg-brand" className="pad-2">
  <p>Branded content</p>
</Surface>
```

## Related Components

- **DesignSystemProvider**: Root provider that wraps Surface
- **Card**: Pre-styled Surface for card layouts (if available)
- **Heading**: Typography component that adapts to Surface variants
