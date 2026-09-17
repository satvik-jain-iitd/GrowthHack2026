# Navigation Component Reference
> AI agent-friendly reference for DLS Navigation component

## Quick Reference

Navigation is used to organize and display links for navigating between pages (URLs) or major app sections. Supports vertical, horizontal, and mega menu layouts, with nested items, headings, icons, custom link components, and button-style navigation items (see ActiveButtons pattern). Use ActiveButtons for in-page navigation between major sections or views (not for navigating to different URLs). For other in-page actions, use Button or Tabs.

## Import

```tsx
import { Navigation, NavigationItem, NavigationHeading, NavigationSection } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
<Navigation showInContainer>
  <NavigationItem label="Home" href="/" />
  <NavigationItem label="Products">
    <NavigationItem label="Product A" href="/products/a" />
    <NavigationItem label="Product B" href="/products/b" />
  </NavigationItem>
</Navigation>
```

## Props API

### Navigation
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| showInContainer | boolean |  | false | Display navigation in a contained layout |
| defaultOpenPanelIds | string[] |  | [] | IDs of panels open by default (vertical only) |
| shouldAllowMultipleExpanded | boolean |  | false | Allow multiple panels to be expanded at once |
| variant | 'vertical' \| 'horizontal' |  | 'vertical' | Layout orientation |
| isMegaMenu | boolean |  | false | Enable mega menu style (horizontal only) |
| className | string |  | - | Additional CSS classes for container |

### NavigationItem
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | string \| ReactElement | Yes | - | The item label |
| icon | ReactNode |  | - | Optional icon |
| href | string |  | - | If provided, renders as a link |
| asChild | boolean |  | - | Use a custom component as the link |
| children | NavigationItem \| NavigationHeading |  | - | Nested items or headings |
| onToggle | function |  | - | For collapsible items |
| aria-current | 'page' \| boolean |  | - | Set to `'page'` if the NavigationItem represents the current page |

### NavigationHeading
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| level | 1-6 |  | 2 | Heading level |
| children | string \| ReactNode | Yes | - | Heading content |

### NavigationSection
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | string \| ReactNode |  | - | Section label |

## Common Patterns

### Vertical Navigation (default)
```tsx
<Navigation showInContainer defaultOpenPanelIds={["products"]} shouldAllowMultipleExpanded>
  <NavigationItem id="home" label="Home" href="/" />
  <NavigationItem id="products" label="Products">
    <NavigationItem label="Product A" href="/products/a" />
    <NavigationItem label="Product B" href="/products/b" />
  </NavigationItem>
</Navigation>
```

### Horizontal Navigation
```tsx
<Navigation variant="horizontal">
  <NavigationItem label="Home" href="/" />
  <NavigationItem label="Products" href="/products" />
</Navigation>
```

### Mega Menu
```tsx
<Navigation variant="horizontal" isMegaMenu>
  <NavigationItem label="Products">
    {/* Mega menu content here */}
  </NavigationItem>
</Navigation>
```

### With Custom Link Component (e.g. React Router)
```tsx
import { Link } from 'react-router-dom';

<Navigation>
  <NavigationItem label="Dashboard" asChild>
    <Link to="/dashboard" />
  </NavigationItem>
</Navigation>
```

### Button Navigation (ActiveButtons)
```tsx
<Navigation showInContainer>
  <NavigationItem id="my-account" label="My Account" onClick={() => {}} />
  <NavigationItem id="cards" label="Cards" onClick={() => {}} />
  <NavigationItem id="banking" label="Banking" onClick={() => {}} />
  <NavigationItem id="travel" label="Travel" onClick={() => {}} />
</Navigation>
```
Use this pattern for in-page navigation between major sections or views (e.g., switching panels or dashboard sections) that do not correspond to different URLs.

## Accessibility Requirements

**Required:**
- Use `label` for every navigation item (always visible)
- Use `aria-current` for the active page link
- Use unique `id` for collapsible items

**Recommended:**
- Use semantic structure (nesting, headings) for clarity
- Use `defaultOpenPanelIds` for initial open state
- Use icons for visual context if helpful

**Avoid:**
- Using navigation for in-page actions (use Button or Tabs instead)
- Over-nesting (keep navigation simple and scannable)

## Anti-Patterns

❌ **Using navigation for actions**
```tsx
<NavigationItem label="Delete" onClick={handleDelete} /> {/* WRONG: use Button instead */}
```

❌ **Missing label**
```tsx
<NavigationItem href="/home" /> {/* WRONG: always provide a label */}
```

❌ **No aria-current for active link**
```tsx
<NavigationItem label="Home" href="/" /> {/* WRONG: add aria-current="page" for current page */}
```

## Best Practices

### Content Guidelines
- **Labels**: Short, clear, descriptive
- **Case**: Use sentence case, not title case
- **Icons**: Use only when they add clarity
- **Nesting**: Group related links, but avoid deep trees
- **Active state**: Use `aria-current` for the current page

### Layout
- **Vertical**: Use for sidebars, app navigation
- **Horizontal**: Use for top nav, global navigation
- **Mega menu**: Use for large, multi-column navigation

### When to Use
 - Navigating between pages or major app sections (URLs)
 - Grouping related links in a sidebar or header
 - Button-style navigation (ActiveButtons) for in-page navigation between major sections or views

### When NOT to Use
- Triggering in-page actions that are not navigation (use Button)
- Tabbed content (use Tabs)
- Breadcrumbs (use Breadcrumbs)

## Advanced Usage

### Custom aria-current for active link
```tsx
<NavigationItem label="Home" href="/" aria-current="page" />
```

### Collapsible Navigation with Multiple Panels Expanded
```tsx
<Navigation showInContainer shouldAllowMultipleExpanded defaultOpenPanelIds={["products", "about"]}>
  <NavigationItem id="products" label="Products">
    <NavigationItem label="Product A" href="/products/a" />
    <NavigationItem label="Product B" href="/products/b" />
  </NavigationItem>
  <NavigationItem id="about" label="About">
    <NavigationItem label="About A" href="/about/a" />
    <NavigationItem label="About B" href="/about/b" />
  </NavigationItem>
</Navigation>
```

## Related Components

- **Links** - For standalone links
- **Tabs** - For in-page tabbed navigation
- **Breadcrumbs** - For showing page hierarchy
- **Button** - For actions, not navigation
- **Heading** - For section headings in navigation
- **Surface** - For navigation containers

---

For more advanced usage and examples, see the Storybook stories in the codebase.