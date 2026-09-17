# Heading Component Reference

> AI agent-friendly reference for DLS Heading component

## Quick Reference

Semantic heading element (h1-h6) with typography variants. Decouples semantic level from visual style.

## Import

```tsx
import { Heading } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
<Heading level={1} variant="sans-xlarge-book">
  Page Title
</Heading>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| level | `1` \| `2` \| `3` \| `4` \| `5` \| `6` | Yes | `2`¹ | Semantic heading level (h1-h6) |
| variant | See variants below | Yes | - | Typography variant |
| children | ReactNode | Yes | - | Heading text content |
| className | string | | - | Additional CSS classes |

> ¹ `level` is required by the TypeScript type. The component's runtime destructuring defaults to `2`, but omitting it will cause a TypeScript error.

### Typography Variants

**Sans-Serif:**
- `sans-xlarge-book`, `sans-xlarge-bold`
- `sans-large-book`, `sans-large-bold`
- `sans-medium-regular`, `sans-medium-bold`
- `sans-small-regular`, `sans-small-medium`, `sans-small-bold`
- `sans-xsmall-regular`, `sans-xsmall-bold`

**Serif:**
- `serif-xlarge-regular`, `serif-xlarge-bold`
- `serif-large-regular`, `serif-large-bold`
- `serif-medium-regular`, `serif-medium-bold`
- `serif-small-regular`, `serif-small-bold`
- `serif-xsmall-regular`, `serif-xsmall-bold`

## Common Patterns

### Page Title (h1)
```tsx
<Heading level={1} variant="sans-xlarge-bold">
  Welcome to Your Account
</Heading>
```

### Section Heading (h2)
```tsx
<Heading level={2} variant="sans-large-bold">
  Recent Transactions
</Heading>
```

### Subsection (h3)
```tsx
<Heading level={3} variant="sans-medium-bold">
  Account Details
</Heading>
```

### Serif Heading
```tsx
<Heading level={1} variant="serif-xlarge-bold">
  Premium Experience
</Heading>
```

### Decoupled Semantics and Style
```tsx
{/* h2 that looks like h1 */}
<Heading level={2} variant="sans-xlarge-bold">
  Section with Large Visual Impact
</Heading>
```

## Accessibility Requirements

**Required:**
- Use proper heading hierarchy (don't skip levels)
- Ensure headings describe their sections accurately
- One h1 per page typically

**Recommended:**
- Use semantic `level` for document outline
- Use `variant` for visual design
- Keep headings concise and descriptive

## Anti-Patterns

**Never:**
- Skip heading levels (e.g., h1 to h3)
- Use headings for styling regular text
- Have multiple h1 elements without proper structure
- Use generic text like "Click here" as headings

## Best Practices

- Match visual hierarchy to semantic hierarchy when possible
- Use descriptive, meaningful text
- Keep headings concise
- Maintain consistent styling patterns
- Use sans-serif for most UI contexts
- Use serif for editorial/marketing content

## Related Components

- [Label](label.md) - For form labels
