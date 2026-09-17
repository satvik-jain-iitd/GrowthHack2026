# Card Component Reference
> AI agent-friendly reference for DLS Card component

## Quick Reference
Flexible-size containers that display content and actions on a single topic. Use for featured information, related content, or navigational choices.

## Import
```tsx
import { Card, CardMedia, CardLayout, CardContent, CardActions, CardActionable } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Card>
  <CardLayout>
    <CardContent title={<h2>Title</h2>}>
      <p>Card content goes here</p>
    </CardContent>
  </CardLayout>
</Card>
```

## Props API

### Card Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| orientation | 'vertical' \| 'horizontal' | No | 'vertical' | Layout direction of the card |
| innerContainerClassName | string | No | - | Class for inner container that contains the children |
| className | string | No | - | Additional CSS classes |
| children | ReactNode | Yes | - | Card content |

**Important:** CardActionable uses **discriminated union types**:
- **Link mode** (when `href` is provided): Renders as `<a>`, supports `asChild`, `onClick` is optional
- **Button mode** (when `href` is NOT provided): Renders as `<button>`, requires `onClick`, does not support `asChild`

### CardActionable Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Children to render as the contents of the card |
| orientation | 'vertical' \| 'horizontal' | No | 'vertical' | Determines the orientation of the card |
| innerContainerClassName | string | No | - | Class names to be applied to the div which contains the children |
| href | string | No | - | Link URL. When provided, card renders as `<a>` link. |
| onClick | MouseEventHandler | No | - | Click handler. Optional for link mode, **required** for button mode (when no `href` is provided). |
| asChild | boolean | No | - | Component will delegate outermost React element to use first element passed within children. **Only works in link mode (when `href` is provided).** |
| reactlytics | ReactlyticsProp | No | - | Analytics tracking prop |
| disabled | boolean | No | - | **Deprecated:** Use `aria-disabled` instead. Removes element from Accessibility Tree and prevents focus. |

### CardContent Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | ReactElement | No | - | Card title (typically heading element) |
| subtitle | ReactElement | No | - | Card subtitle |
| icon | ReactNode | No | - | Icon to display |
| alignment | 'start' \| 'center' | No | 'start' | Content alignment |
| className | string | No | - | Additional CSS classes |
| children | ReactNode | No | - | Card body content |

### CardMedia Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Media content (typically img) |
| className | string | No | - | Additional CSS classes |

### CardLayout Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | CardContent and/or CardActions |
| className | string | No | - | Additional CSS classes |

### CardActions Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Action buttons or links |
| className | string | No | - | Additional CSS classes |

## Common Patterns

### Basic Card
```tsx
<Card style={{ maxWidth: '420px' }}>
  <CardLayout>
    <CardContent
      title={<h2>Card Title</h2>}
      subtitle={<h3>Subtitle</h3>}
      icon={<IconAccount size="md" isFilled={true} />}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </p>
    </CardContent>
  </CardLayout>
</Card>
```

### Card with Media and Actions
```tsx
<Card aria-labelledby="card-heading" orientation="vertical" style={{ maxWidth: '420px' }}>
  <CardMedia>
    <img
      src="https://example.com/image.jpg"
      alt=""
      style={{ width: '100%', height: 'auto' }}
    />
  </CardMedia>
  <CardLayout>
    <CardContent
      title={<h2 id="card-heading">Title</h2>}
      subtitle={<h3>Subtitle</h3>}
      icon={<IconAccount size="md" />}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </p>
    </CardContent>
    <CardActions>
      <Button variant="secondary">Secondary Action</Button>
      <Button>Primary Action</Button>
    </CardActions>
  </CardLayout>
</Card>
```

### Horizontal Card
```tsx
<Card aria-labelledby="card-heading" orientation="horizontal" style={{ maxWidth: '800px' }}>
  <CardMedia>
    <img
      src="https://example.com/image.jpg"
      alt=""
      style={{ width: '100%', height: 'auto' }}
    />
  </CardMedia>
  <CardLayout>
    <CardContent
      title={<h2 id="card-heading">Title</h2>}
      subtitle={<h3>Subtitle</h3>}
    >
      <p>Horizontal layout with media on the left.</p>
    </CardContent>
    <CardActions>
      <Button variant="secondary">Action</Button>
      <Button>Action</Button>
    </CardActions>
  </CardLayout>
</Card>
```

### Centered Content
```tsx
<Card orientation="vertical" style={{ maxWidth: '420px' }}>
  <CardLayout>
    <CardContent
      title={<h2>Title</h2>}
      subtitle={<h3>Subtitle</h3>}
      icon={<IconAccount size="md" />}
      alignment="center"
    >
      <p>Centered content with icon above title</p>
    </CardContent>
    <CardActions>
      <Button variant="secondary">Action</Button>
      <Button>Action</Button>
    </CardActions>
  </CardLayout>
</Card>
```

### Actionable Card (Link)
```tsx
<CardActionable
  href="/destination"
  aria-labelledby="card-heading"
  orientation="vertical"
  style={{ maxWidth: '420px' }}
>
  <CardMedia>
    <img src="https://example.com/image.jpg" alt="" />
  </CardMedia>
  <CardLayout>
    <CardContent
      title={<h2 id="card-heading">Click Anywhere</h2>}
      subtitle={<h3>Subtitle</h3>}
    >
      <p>Entire card is clickable as a link</p>
    </CardContent>
  </CardLayout>
</CardActionable>
```

### Actionable Card (Button)
```tsx
<CardActionable
  onClick={handleClick}
  aria-labelledby="card-heading"
  orientation="vertical"
  style={{ maxWidth: '420px' }}
>
  <CardLayout>
    <CardContent
      title={<h2 id="card-heading">Interactive Card</h2>}
    >
      <p>Entire card is clickable as a button</p>
    </CardContent>
  </CardLayout>
</CardActionable>
```

### Media at End
```tsx
<Card orientation="vertical" style={{ maxWidth: '420px' }}>
  <CardLayout>
    <CardContent title={<h2>Title</h2>} subtitle={<h3>Subtitle</h3>}>
      <p>Content comes before media</p>
    </CardContent>
    <CardActions>
      <Button>Action</Button>
    </CardActions>
  </CardLayout>
  <CardMedia>
    <img src="https://example.com/image.jpg" alt="" />
  </CardMedia>
</Card>
```

### Custom Card (No Components)
```tsx
<Card style={{ maxWidth: '420px' }}>
  <h2>80,000+</h2>
  <h3>Subtitle</h3>
  <p>Usages of components</p>
</Card>
```

## Accessibility Requirements

**Required:**
- Use aria-labelledby to associate card with heading
- Provide accessible labels for actionable cards
- Ensure proper focus management for interactive cards
- Do not nest interactive elements in actionable cards
- Provide alt text for images

**Recommended:**
- Use semantic heading elements (h2, h3)
- Ensure sufficient color contrast
- Maintain consistent card structure across related cards
- Use clear, descriptive titles

**Avoid:**
- Nesting cards within cards
- Making entire card actionable when actions are inside
- Using images as backgrounds with text overlay (contrast issues)
- Mixing different card patterns inconsistently

## Anti-Patterns

❌ **WRONG: Multiple primary actions**
```tsx
<CardActions>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</CardActions>
```

✅ **CORRECT: One primary, one secondary**
```tsx
<CardActions>
  <Button variant="secondary">Secondary</Button>
  <Button>Primary</Button>
</CardActions>
```

❌ **WRONG: Actions in actionable card**
```tsx
<CardActionable href="/page">
  <CardLayout>
    <CardContent title={<h2>Title</h2>}>
      <p>Content</p>
    </CardContent>
    <CardActions>
      <Button>Action</Button>
    </CardActions>
  </CardLayout>
</CardActionable>
```

✅ **CORRECT: No actions in actionable card**
```tsx
<CardActionable href="/page">
  <CardLayout>
    <CardContent title={<h2>Title</h2>}>
      <p>Entire card is clickable</p>
    </CardContent>
  </CardLayout>
</CardActionable>
```

❌ **WRONG: Mismatched content and action**
```tsx
<Card>
  <CardLayout>
    <CardContent title={<p>Review Your Account</p>}>
      <p>Review your loan balances, recent transaction, or make a payment today.</p>
    </CardContent>
    <CardActions>
      <Link href="#">Explore Rewards</Link>
    </CardActions>
  </CardLayout>
</Card>
```

✅ **CORRECT: Aligned content and action**
```tsx
<Card>
  <CardLayout>
    <CardContent title={<p>Review Your Account</p>}>
      <p>Review your loan balances, recent transaction, or make a payment today.</p>
    </CardContent>
    <CardActions>
      <Link href="#">Go to Account Home</Link>
    </CardActions>
  </CardLayout>
</Card>
```

## Best Practices

**When to Use:**
- Display content and actions on a single topic
- Visually separate content in dashboard views
- Provide glimpse of information with option to learn more
- Group related content with consistent call to action
- Create navigational choices

**When Not to Use:**
- Nesting cards within cards
- Critical alerts (use notifications instead)
- Image backgrounds with text overlay (accessibility issues)
- When all content should be immediately visible

**Layout Guidelines:**
- Minimum width: 288px (vertical), 568px (horizontal)
- Horizontal cards reflow to vertical at small breakpoints
- Use grid for multiple cards (2, 3, or 4 column layouts)
- Maintain consistent height for cards in same row
- Align actions consistently across related cards

**Content Guidelines:**
- Use semantic headings to set clear expectations
- Place actions consistently at bottom of card
- Ensure card title accurately describes content/destination
- Keep content concise and scannable
- Use icon to reinforce meaning (not decorative)

**Icon Usage:**
- Use simple, well-known icons
- Position based on alignment (left for start, top for center)
- Be consistent with icon usage across related cards
- Consider icon meaning and localization
- Use filled icons for emphasis when appropriate

**Actionable Cards:**
- Make entire card clickable with hover state
- Do not include separate CTAs in actionable cards
- Provide clear visual feedback on interaction
- Use for navigation or single primary action only

**Multiple Cards:**
- Maintain consistent card structure
- Use frame fill height to match card heights in row
- Ensure related content has aligned text and CTAs
- Use grid system for responsive layouts

## Advanced Usage

### With Marketing Badge
```tsx
<Card aria-labelledby="card-heading mkt-badge" orientation="vertical">
  <MarketingBadge
    icon={<IconStar />}
    id="mkt-badge"
    position="top-start"
    size="regular"
    type="corner"
    variant="emphasis"
  >
    Special Offer
  </MarketingBadge>
  <CardLayout>
    <CardContent title={<h2 id="card-heading">Earn Membership Rewards Points</h2>}>
      <p>
        After you spend $6000 on eligible purchases on your new Card in your first 6 months
        of Card Membership.
      </p>
    </CardContent>
  </CardLayout>
</Card>
```

### Card Group
```tsx
<div style={{ display: 'flex', gap: '16px' }}>
  <Card style={{ maxWidth: '320px' }}>
    <CardLayout>
      <CardContent title={<h2>Card 1</h2>}>
        <p>This card has the most content and sets height for others</p>
      </CardContent>
    </CardLayout>
  </Card>
  <Card style={{ maxWidth: '320px' }}>
    <CardLayout>
      <CardContent title={<h2>Card 2</h2>}>
        <p>Matches height of longest card in group</p>
      </CardContent>
    </CardLayout>
  </Card>
</div>
```

## Related Components
- [Button](button.md) - For card actions
- [Links](links.md) - For card links
- [MarketingBadge](marketing-badge.md) - For promotional cards
- [Surface](surface.md) - For card backgrounds