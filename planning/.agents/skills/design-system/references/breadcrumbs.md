# Breadcrumbs Component Reference

## Quick Reference
Breadcrumbs show content hierarchy or trace a user's path, allowing users to navigate up to higher levels or previous steps in the navigation hierarchy.

## Import
```tsx
import { BreadcrumbTrail, Breadcrumb } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<BreadcrumbTrail>
  <Breadcrumb href="/home">Home</Breadcrumb>
  <Breadcrumb href="/products">Products</Breadcrumb>
  <Breadcrumb>Current Page</Breadcrumb>
</BreadcrumbTrail>
```

## Common Patterns

### Default BreadcrumbTrail
```tsx
<BreadcrumbTrail>
  <Breadcrumb href="/">Home</Breadcrumb>
  <Breadcrumb href="/products">Products</Breadcrumb>
  <Breadcrumb href="/products/category">Category</Breadcrumb>
  <Breadcrumb>Current Page</Breadcrumb>
</BreadcrumbTrail>
```

### With Home Icon
```tsx
<BreadcrumbTrail>
  <Breadcrumb href="/">
    <IconHome title="Home" titleId="home-icon" isFilled={true} />
  </Breadcrumb>
  <Breadcrumb href="/products">Products</Breadcrumb>
  <Breadcrumb>Current Page</Breadcrumb>
</BreadcrumbTrail>
```

### With Custom Link Component
```tsx
const CustomLink = ({ children, ...props }) => (
  <a {...props} data-custom-attribute="value">{children}</a>
);

<BreadcrumbTrail>
  <Breadcrumb asChild href="/">
    <CustomLink>
      <IconHome title="Home" titleId="home-icon" isFilled={true} />
    </CustomLink>
  </Breadcrumb>
  <Breadcrumb asChild href="/products">
    <CustomLink>Products</CustomLink>
  </Breadcrumb>
  <Breadcrumb>Current Page</Breadcrumb>
</BreadcrumbTrail>
```

### With Custom Screen Reader Label
```tsx
<BreadcrumbTrail labelOverrides={{ navScreenReaderLabel: 'Navigation path' }}>
  <Breadcrumb href="/">Home</Breadcrumb>
  <Breadcrumb href="/products">Products</Breadcrumb>
  <Breadcrumb>Current Item</Breadcrumb>
</BreadcrumbTrail>
```

## Props API

### BreadcrumbTrail Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | - | Breadcrumb components |
| labelOverrides | `BreadcrumbLabelOverrides` | - | Custom labels for screen readers |

### Breadcrumb Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | `ReactNode` | No | -       | Link text |
| href | string | No | -       | The URL that the hyperlink points to |
| asChild | boolean | No | `false` | Component will delegate outermost React element to use first element passed within children |
| reactlytics | ReactlyticsProp | No | -       | Analytics tracking prop |


## Accessibility Requirements

### Required
- Last breadcrumb automatically has `aria-current="page"` (handled by BreadcrumbTrail)
- Each breadcrumb link must have descriptive text indicating destination
- Breadcrumbs must be wrapped in BreadcrumbTrail (renders as `<nav>` element)
- Default screen reader label is "Breadcrumb" for the nav element

### Recommended
- Match breadcrumb labels to page titles
- Use home icon only for homepage navigation
- Provide alternative primary navigation alongside breadcrumbs
- Ensure each page has a visible title (`<h1>`)

### Avoid
- Using breadcrumbs as the only navigation method
- Truncating breadcrumb labels
- Removing labels from text breadcrumbs (icons acceptable for home only)

## Anti-Patterns

❌ **Don't use for primary navigation**
```tsx
// Breadcrumbs should not be the only way to navigate
<BreadcrumbTrail>
  <Breadcrumb href="/">Home</Breadcrumb>
</BreadcrumbTrail>
```

✅ **Provide alternative navigation**
```tsx
<>
  <Navigation /> {/* Primary navigation */}
  <BreadcrumbTrail>
    <Breadcrumb href="/">Home</Breadcrumb>
    <Breadcrumb href="/products">Products</Breadcrumb>
    <Breadcrumb>Current Page</Breadcrumb>
  </BreadcrumbTrail>
</>
```

❌ **Don't use inside modals**
```tsx
<Modal>
  <BreadcrumbTrail>...</BreadcrumbTrail>
</Modal>
```

❌ **Don't use for progress indication**
```tsx
// Use MultiStepTracker instead
<BreadcrumbTrail>
  <Breadcrumb>Step 1</Breadcrumb>
  <Breadcrumb>Step 2</Breadcrumb>
  <Breadcrumb>Step 3</Breadcrumb>
</BreadcrumbTrail>
```

✅ **Use MultiStepTracker for progress**
```tsx
<MultiStepTracker currentStep={2} totalSteps={3} />
```

## Best Practices

- Use when you have more than two hierarchy levels
- Match breadcrumbs to page URL structure
- Keep labels short and descriptive (match page titles)
- Place breadcrumbs consistently in the same location across pages
- Breadcrumbs wrap to new lines on smaller screens
- Current page breadcrumb renders as `<span>` (not a link)
- Non-current breadcrumbs render as links
- Each page must have both breadcrumbs AND a visible title
- Breadcrumbs should supplement, not replace, primary navigation

## Related Components

- [MultiStepTracker](multi-step-tracker.md) - For showing user progress through steps
- [Links](links.md) - For standalone navigation links
- [Navigation](navigation.md) - For primary site navigation
```
