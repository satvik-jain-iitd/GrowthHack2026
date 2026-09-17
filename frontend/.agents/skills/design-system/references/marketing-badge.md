# MarketingBadge Component Reference

> AI agent-friendly reference for DLS MarketingBadge component

## Quick Reference

Promotional badge for highlighting special offers, features, or "New" labels. Supports positioning (corner/side), overlapping, and emphasis variants.

## Import

```tsx
import { MarketingBadge } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
<MarketingBadge>New</MarketingBadge>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| screenReaderLabel | string | No | - | Screenreader-only description of what the badge indicates for accessibility. |
| className | string | No | - | Additional CSS class names for styling. |
| type | "corner" \| "side" \| "standalone" | No | "standalone" | The layout style of the badge. |
| children | ReactNode | No | - | Content that renders within the badge. |
| size | "small" \| "sm" \| "md" \| "lg" \| "regular" \| "large" | No | - | The size of the text badge. Values "small", "regular", and "large" are deprecated. Please use "sm", "md", or "lg" instead. |
| variant | "emphasis" \| "subtle" | No | "emphasis" | Determines the background color of the badge. |
| position | "top-start" \| "top-end" \| "bottom-start" \| "bottom-end" | No | "top-start" | Determines the position of the badge. |
| icon | ReactNode | No | - | Icon used in the badge. |
| isOverlapping | boolean | No | false | Determines whether the badge should be displayed on top of the content |
| persistentMode | "light" \| "dark" | No | - | If set, MarketingBadge will persistently stay in light or dark mode color. Use this when MarketingBadge is overlayed on an image. |

## Common Patterns

### Standalone Badge
```tsx
<MarketingBadge>New Feature</MarketingBadge>
```

### Standalone Badge with Icon
```tsx
<MarketingBadge icon={<IconStar />}>
  Featured Product
</MarketingBadge>
```

### Standalone Large Badge
```tsx
<MarketingBadge size="lg" icon={<IconStar />}>
  Special limited-time offer available now
</MarketingBadge>
```

### Corner Badge on Card (Non-Overlapping)
```tsx
<Card aria-labelledby="card-heading mkt-badge-1">
  <MarketingBadge 
    id="mkt-badge-1" 
    type="corner" 
    position="top-start"
    icon={<IconStar />}
  >
    Special Offer
  </MarketingBadge>
  <CardLayout>
    <CardContent title={<h2 id="card-heading">Premium Card</h2>}>
      <p>Earn bonus rewards on eligible purchases.</p>
    </CardContent>
  </CardLayout>
</Card>
```

### Side Badge (Overlapping on Image)
```tsx
<Card aria-labelledby="card-heading mkt-badge-2" orientation="horizontal">
  <CardMedia>
    <MarketingBadge 
      id="mkt-badge-2"
      type="side"
      position="top-start"
      variant="subtle"
      isOverlapping={true}
      icon={<IconAirplane />}
      screenReaderLabel="Exclusive membership benefit"
    >
      Membership Experiences
    </MarketingBadge>
    <img alt="" src="/images/card-promo.jpg" />
  </CardMedia>
  <CardLayout>
    <CardContent title={<h2 id="card-heading">Travel Benefits</h2>}>
      <p>Access exclusive events and experiences.</p>
    </CardContent>
  </CardLayout>
</Card>
```

## Badge Types Explained

| Type | Description | Positioning | Use Case |
|------|-------------|-------------|----------|
| **standalone** | Badge appears in normal document flow | N/A - follows document flow | Use within content, headings, or as independent element |
| **corner** | Badge positioned at corner of container | top-start, top-end, bottom-start, bottom-end | Use on cards when badge should be at corner |
| **side** | Badge positioned at side edge of container | top-start, top-end, bottom-start, bottom-end | Use on cards when badge should extend from side |

## Best Practices

- Use for promotions and feature highlights
- Keep text brief (1-3 words)
- Position non-obstructively

## Accessibility Requirements

**Required:**
- Keep text concise and clear
- Non-interactive element

**Recommended:**
- Use `screenReaderLabel` for context
- Don't obstruct important content

## Anti-Patterns

**Never:**
- Use for critical information (use alerts)
- Make interactive
- Overlap buttons

❌ **Wrong: Using corner or side badge without positioned parent**
```tsx
<div>
  <MarketingBadge type="corner" position="top-start">New</MarketingBadge>
  <Card>...</Card>
</div>
```
✅ **Correct: Badge inside positioned parent**
```tsx
<Card>
  <MarketingBadge type="corner" position="top-start">New</MarketingBadge>
  <CardContent>...</CardContent>
</Card>
```

❌ **Wrong: Using standalone badge with position prop**
```tsx
<MarketingBadge type="standalone" position="top-end">New</MarketingBadge>
```
✅ **Correct: Position only applies to corner/side types**
```tsx
<MarketingBadge>New</MarketingBadge>
```

## Related Components

- [Badge](badge.md) - For status indicators
