---
title: Styling Components
description: Best practices and guidlines for applying styles to DLS components, including using the `className` prop, leveraging DLS utility classes.
---

## Mandatory Guidelines
- Do not use classNames that do not exist in the DLS documentation. Always consult `assets/dls-core.css` and `assets/dls-max.css` for available utility classes.
- Always use DLS utility classes for styling instead of inline styles or custom CSS when possible.
- Use the `className` prop on DLS components to apply styles.
- For layout control, prefer DLS grid and flexbox utilities over custom CSS.

<!-- ## Available Stylesheets and Use Cases -->

DLS provides a comprehensive CSS utility framework through:

- **dls-core.css**: Primary stylesheet with CSS reset, variables for light/dark mode, and basic utility classes
- **dls-max.css**: Includes everything in dls-core plus responsive utility classes with all possible breakpoint modifiers.

### Primary Use Cases
- **Layout**: Grid system (`row`, `col-*`, `container-responsive`) and flexbox utilities (`flex`, `flex-column`, `flex-justify-*`)
- **Spacing**: Responsive margin and padding utilities (`margin-responsive-*`, `pad-responsive-*`)
- **Typography**: Font sizes, weights, and text alignment
- **Colors**: Theme-aware color utilities (`color-*`, `*-bg`) for text and backgrounds
- **Display**: Visibility, positioning, and display utilities
- **Responsive Design**: Mobile-first breakpoint classes (`-sm`, `-md`, `-lg`, `-xl`) 

## How to Apply Styles with className

All DLS React components accept a `className` prop. Use this to apply DLS utility classes or custom classes to components.

### Standard Pattern
Apply utility classes directly to DLS components using the `className` prop:

```tsx
import { Button, Card, CardLayout, CardContent } from '@americanexpress/dls-react';

// Apply flex and spacing utilities to a Button group
<div className="flex pad-2-lr">
  <Button className="margin-responsive-r">
    Submit
  </Button>
  <Button className="">
    Submit
  </Button>
</div>

// Apply multiple utilities to Card
<Card className="margin-responsive-b shadow-1" orientation="vertical">
  <CardLayout>
    <CardContent title="Card Title">
      Content
    </CardContent>
  </CardLayout>
</Card>
```

### Combining Multiple Classes
Chain utility classes together separated by spaces:

```tsx
<div className="flex flex-column flex-align-center pad-responsive margin-responsive-b">
  <Heading>Title</Heading>
  <p>Description text</p>
</div>
```

### Wrapper Pattern
When DLS components need layout control, wrap them in semantic elements:

```tsx
<div className="col-12 col-md-6 margin-responsive-b">
  <Card orientation="vertical">
    <CardLayout>
      <CardContent title="Wrapped Card">
        This card is controlled by grid utilities on the wrapper div
      </CardContent>
    </CardLayout>
  </Card>
</div>
```

### Do Not Use Inline Styles
Avoid inline styles. Instead, use DLS utility classes:

```tsx
// ❌ Avoid
<Button style={{ marginBottom: '16px', width: '100%' }}>Click</Button>

// ✅ Prefer
<Button className="margin-responsive-b width-full">Click</Button>
```

## Responsive Styling with DLS Utility Classes

DLS uses a mobile-first responsive approach with five breakpoints:

### Breakpoints
- **min**: `≥ 0px` - Mobile screens
- **xs** (default): `≥ 320px` - Mobile screens
- **sm**: `≥ 568px` - Small tablets
- **md**: `≥ 800px` - Tablets and small desktops
- **lg**: `≥ 1024px` - Desktops
- **xl**: `≥ 1280px` - Large desktops
- **max**: `≥ 1440px` - Extra large desktops

### Responsive Grid Classes
Grid columns use breakpoint suffixes to adapt layouts:

```tsx
// Full width on mobile, 50% on tablets, 33% on desktops
<div className="row">
  <div className="col-12 col-md-6 col-lg-4">
    <Card orientation="vertical">
      <CardLayout>
        <CardContent title="Responsive Card">
          Adapts to screen size
        </CardContent>
      </CardLayout>
    </Card>
  </div>
  <div className="col-12 col-md-6 col-lg-4">
    <Card orientation="vertical">
      <CardLayout>
        <CardContent title="Responsive Card">
          Adapts to screen size
        </CardContent>
      </CardLayout>
    </Card>
  </div>
</div>
```

### Responsive Spacing Utilities
DLS provides responsive spacing classes that automatically adjust based on viewport:

- `margin-responsive`: Responsive margin on all sides
- `margin-responsive-t`: Top margin
- `margin-responsive-b`: Bottom margin
- `margin-responsive-l`: Left margin
- `margin-responsive-r`: Right margin
- `margin-responsive-lr`: Left and right margin
- `margin-responsive-tb`: Top and bottom margin

- `pad-responsive`: Responsive padding on all sides
- `pad-responsive-t`: Top padding
- `pad-responsive-b`: Bottom padding
- `pad-responsive-l`: Left padding
- `pad-responsive-r`: Right padding
- `pad-responsive-lr`: Left and right padding
- `pad-responsive-tb`: Top and bottom padding

```tsx
<div className="pad-responsive margin-responsive-b">
  <Heading>Responsive Spacing</Heading>
  <p className="margin-responsive-t">
    Spacing adjusts automatically based on viewport size
  </p>
</div>
```

### Conditional Rendering with useMediaQuery
For component-level responsive behavior, use the DLS `useMediaQuery` hook:

```tsx
import { useMediaQuery } from '@americanexpress/dls-react';

export default function ResponsiveComponent() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  return (
    <div className="container-responsive">
      {isDesktop ? (
        <div className="flex flex-row">
          <div className="flex-1">Desktop Layout</div>
          <div className="flex-1">Two Columns</div>
        </div>
      ) : (
        <div className="flex flex-column">
          <div>Mobile Layout</div>
          <div>Stacked</div>
        </div>
      )}
    </div>
  );
}
```

### Common Responsive Patterns

#### Responsive Grid to Stacked Layout
```tsx
<div className="row">
  <div className="col-12 col-md-4 margin-responsive-b">Column 1</div>
  <div className="col-12 col-md-4 margin-responsive-b">Column 2</div>
  <div className="col-12 col-md-4 margin-responsive-b">Column 3</div>
</div>
```
This creates a three-column layout on tablets/desktops and stacks vertically on mobile.

#### Responsive Flex Direction
```tsx
<div className="flex flex-column flex-md-row">
  <div className="flex-1">Item 1</div>
  <div className="flex-1">Item 2</div>
</div>
```

#### Responsive Visibility
Use display utilities to show/hide elements at different breakpoints:

```tsx
// Show only on mobile
<div className="display-block display-md-none">Mobile Only</div>

// Show only on desktop
<div className="display-none display-md-block">Desktop Only</div>
```

## Layout & Grid

### Container
- `container-responsive` - Responsive container with proper width and padding

### Grid System
- `row` - Grid row wrapper (use with col-* classes)
- `col-12` - Full width column (mobile)
- `col-md-1` through `col-md-12` - Medium breakpoint columns (1-12)
- `col-lg-1` through `col-lg-12` - Large breakpoint columns (1-12)
- `col-sm-1` through `col-sm-12` - Small breakpoint columns (1-12)
- `col-xs-1` through `col-xs-12` - Extra small breakpoint columns (1-12)

### Flexbox
- `flex` - Enable flexbox
- `flex-row` - Flex direction row (default, horizontal)
- `flex-column` - Flex direction column (vertical)
- `flex-align-start` - Align items to start
- `flex-align-center` - Align items to center
- `flex-align-end` - Align items to end
- `flex-justify-start` - Justify content start
- `flex-justify-center` - Justify content center
- `flex-justify-end` - Justify content end
- `flex-justify-between` - Justify content space-between

## Spacing

### Margin
- `margin-responsive` - Responsive margin on all sides
- `margin-responsive-t` - Responsive top margin
- `margin-responsive-r` - Responsive right margin
- `margin-responsive-b` - Responsive bottom margin
- `margin-responsive-l` - Responsive left margin
- `margin-responsive-lr` - Responsive left and right margin
- `margin-responsive-tb` - Responsive top and bottom margin

#### Fixed Margin
- `margin-1`, `margin-2`, `margin-3`, `margin-4` - Fixed margin (all sides)
- `margin-1-t`, `margin-2-t`, `margin-3-t`, `margin-4-t` - Fixed top margin
- `margin-1-r`, `margin-2-r`, `margin-3-r`, `margin-4-r` - Fixed right margin
- `margin-1-b`, `margin-2-b`, `margin-3-b`, `margin-4-b` - Fixed bottom margin
- `margin-1-l`, `margin-2-l`, `margin-3-l`, `margin-4-l` - Fixed left margin

#### Shorthand
- `margin-r`, `margin-l`, `margin-t`, `margin-b` - Standard margin shortcuts

### Padding
- `pad-responsive` - Responsive padding on all sides
- `pad-responsive-t` - Responsive top padding
- `pad-responsive-r` - Responsive right padding
- `pad-responsive-b` - Responsive bottom padding
- `pad-responsive-l` - Responsive left padding
- `pad-responsive-lr` - Responsive left and right padding
- `pad-responsive-tb` - Responsive top and bottom padding

#### Fixed Padding
- `pad-1`, `pad-2`, `pad-3`, `pad-4` - Fixed padding (all sides)
- `pad-1-t`, `pad-2-t`, `pad-3-t`, `pad-4-t` - Fixed top padding
- `pad-1-r`, `pad-2-r`, `pad-3-r`, `pad-4-r` - Fixed right padding
- `pad-1-b`, `pad-2-b`, `pad-3-b`, `pad-4-b` - Fixed bottom padding
- `pad-1-l`, `pad-2-l`, `pad-3-l`, `pad-4-l` - Fixed left padding

#### Shorthand
- `pad`, `pad-r`, `pad-l`, `pad-t`, `pad-b` - Standard padding shortcuts
- `pad-lr` - Left and right padding

## Sizing

### Width
- `width-full` - 100% width
- `width-auto` - Auto width

### Height
- `height-full` - 100% height
- `height-auto` - Auto height

## Visual

### Border Radius
- `radius-container` - Container border radius
- `radius-1`, `radius-2`, `radius-3`, `radius-4` - Fixed border radius

### Shadows
- `shadow-1`, `shadow-2`, `shadow-3`, `shadow-4` - Elevation shadows

### Colors
- `color-surface-bg` - Surface background color
- `color-foreground-bg` - Foreground background color

## Position

- `position-absolute` - Absolute positioning
- `position-absolute-tl` - Absolute positioned top-left
- `position-relative` - Relative positioning

## Navigation Specific

- `nav` - Navigation container
- `nav-header` - Header navigation
- `nav-vertical` - Vertical navigation
- `nav-menu` - Navigation menu overlay

## Common Patterns

### Form Field Spacing
```tsx
<Input className="margin-2-b" />
<Input className="margin-responsive-b" />
```

### Button Groups
```tsx
<Button className="margin-2-r">First</Button>
<Button>Second</Button>
```

### Container with Padding
```tsx
<Surface className="pad-4 radius-container">
  {/* content */}
</Surface>
```

### Centered Content
```tsx
<div className="flex flex-justify-center flex-align-center">
  {/* content */}
</div>
```

### Responsive Grid
```tsx
<div className="container-responsive">
  <div className="row">
    <div className="col-12 col-md-6">Column 1</div>
    <div className="col-12 col-md-6">Column 2</div>
  </div>
</div>
```

## Important Notes

1. **Never invent classes** - Only use classes listed here or fetched from MCP
2. **Responsive spacing** - Use `-responsive` variants for mobile-friendly spacing
3. **Grid alignment** - Combine `row` with `flex-align-*` for vertical alignment
4. **Validation** - Always verify class names against this reference or MCP documentation
