# Badge Component Reference
> AI agent-friendly reference for DLS Badge component

## Quick Reference

Static visual indicators to label, categorize, notify, or show counts. Non-interactive.

## Import

```tsx
import { Badge } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
<Badge type="text" status="information">New</Badge>
```

## Props API

### Shared Props
All Badge variants accept these common props:

| Prop | Type | Required | Default | Description |
|------|------|----------|--------|-------------|
| type | `'dot'` \| `'text'` \| `'number'` \| `'status'` \| `'flag'` | No | `number` | The type of badge |
| screenReaderLabel | string | No | -      | Screenreader-only description of what the badge indicates for accessibility |
| className | string | No | -      | Additional CSS class names for styling |

### Text Badge Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | No | - | Content that renders within the Text Badge |
| icon | ReactNode | No | - | Icon used in the Text Badge |
| status | `'caution'` \| `'information'` \| `'success'` \| `'critical'` \| `'neutral'` | No | `'neutral'` | Determines the color of the text badge |
| size | `'sm'` \| `'lg'` | No | `'lg'` | The size of the text badge. Values "small" and "large" are deprecated. Please use "sm" or "lg" instead |

### Number Badge Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | string \| number | No | - | Content that renders within the Number Badge |
| anchorElement | ReactNode | No | - | The element which the Number Badge will anchor to |

### Status Badge Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | No | - | Content that renders within the Status Badge |
| status | `'caution'` \| `'information'` \| `'success'` \| `'critical'` \| `'neutral'` | No | `'neutral'` | Determines the color of the status badge |

### Dot Badge Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variant | `'primary'` \| `'secondary'` | No | `'primary'` | Determines style of dot badge |
| anchorElement | ReactNode | No | - | The element which the Dot Badge will anchor to |

### Flag Badge Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | No | - | Content that renders within the Flag Badge |
| icon | ReactNode | No | - | Icon used in the Flag Badge |
| size | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` | No | `'md'` | The size of the flag badge |

## Common Patterns

### Text Badge
```tsx
<Badge type="text" status="neutral">New</Badge>
<Badge
  icon={<IconSuccess isFilled={true} />}
  status="success"
  type="text"
>
  Approved
</Badge>
```

### Number Badge
```tsx
<Badge type="number" screenReaderLabel="5 notifications">5</Badge>
<Badge type="number" screenReaderLabel="150 items">150</Badge> {/* Shows "99+" */}
<IconButton
  screenReaderLabel="Home"
  variant="secondary"
>
  <Badge
    anchorElement={<IconEmail size="md" />}
    screenReaderLabel="Unread Messages"
    type="number"
  >
    3
  </Badge>
</IconButton>
```

### Dot Badge
```tsx
<IconButton screenReaderLabel="Home" variant="secondary">
  <Badge
    anchorElement={<IconHome size="md" />}
    screenReaderLabel="New Message"
    type="dot"
    variant="secondary"
  />
</IconButton>
```

### Status Badge
```tsx
<div className="margin-1-b flex">
  <Badge
    screenReaderLabel="Success"
    status="success"
    type="status"
  />
  <span>
    AutoPay On
  </span>
</div>
```

### Flag Badge
```tsx
<Badge
  icon={<IconStar />}
  type="flag"
  size="sm"
>
  Flag
</Badge>
```

## Accessibility Requirements

**Required:**
- Always provide `screenReaderLabel` for non-text badges
- Do not use Badge as focusable element

**Recommended:**
- Ensure badge content is concise
- Use semantic status values

## Anti-Patterns

**Never:**
- Make badges interactive (use Button or Tag)
- Use for navigation (use Links)
- Nest focusable elements inside

## Best Practices

- Use text badges for labeling
- Use dot badges for status indicators
- Use number badges for counts (caps at 99+)
- Keep text concise (1-2 words)
- Ensure color isn't only indicator

## Related Components

- [Tag](tag.md) - Interactive version
- [MarketingBadge](marketing-badge.md) - Promotional badges
