# Tooltip Component Reference

> This file is an AI agent-friendly reference for the DLS Tooltip component.

## Quick Reference

Non-actionable, brief informative message or tip. Tooltips are user-triggered to give extra information that is contextual but not critical to a user's journey. Tooltips are initiated in one of three ways: hover, focus or press.

## Import

```tsx
import { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  InfoTooltipButton 
} from '@americanexpress/dls-react';
import { Button } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
// Basic Tooltip with Button
<Tooltip id="tooltip">
  <TooltipTrigger>
    <Button variant="secondary">Tell Me Why</Button>
  </TooltipTrigger>
  <TooltipContent>
    Your email will be used to update you on your application process.
  </TooltipContent>
</Tooltip>

// Info Tooltip (inline)
<Tooltip id="info-tooltip">
  <TooltipTrigger>
    <InfoTooltipButton screenReaderLabel="Tell Me Why" />
  </TooltipTrigger>
  <TooltipContent>
    Your email will be used to update you on your application process.
  </TooltipContent>
</Tooltip>
```

## Props API

### Tooltip Props

| Prop | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| id | Yes | string | - | Unique identifier for the tooltip. Required for accessibility |
| placement | No | `'top'` \| `'right'` \| `'bottom'` \| `'left'` \| `'top-start'` \| `'top-end'` \| `'right-start'` \| `'right-end'` \| `'bottom-start'` \| `'bottom-end'` \| `'left-start'` \| `'left-end'` | `'top'` | Preferred placement of tooltip relative to trigger |
| disableHover | No | boolean | `false` | If true, tooltip won't open on hover |
| isOpen | No | boolean | - | Controlled open state |
| defaultIsOpen | No | boolean | `false` | Default open state (uncontrolled) |
| onIsOpenChange | No | (isOpen: boolean) => void | - | Callback when open state changes |
| shouldCreatePortal | No | boolean | `false` | Render tooltip in a portal (outside DOM hierarchy) |
| children | No | ReactNode | - | TooltipTrigger and TooltipContent |

### InfoTooltipButton Props

`InfoTooltipButtonProps` is `Omit<IconButtonProps, 'children'>` — the button manages its own icons automatically (info icon normally, cancel icon when open). Do not pass `children`.

| Prop | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| screenReaderLabel | Yes | string | - | Accessible label for screen readers |
| disabled | No | boolean | - | **Deprecated**: use `aria-disabled` instead. Removes element from accessibility tree and prevents focus |
| aria-disabled | No | boolean \| `'true'` \| `'false'` | - | If true, styles component as disabled and prevents interactivity |
| aria-expanded | No | boolean \| `'true'` \| `'false'` | - | The "expanded" state of the button |
| onClick | No | MouseEventHandler<HTMLButtonElement> | - | Click event handler |
| isLoading | No | boolean | - | If true, shows loading button with spinner |
| shape | No | `'round'` \| `'square'` | `'round'` | Determines shape of button |
| variant | No | `'primary'` \| `'secondary'` \| `'tertiary'` | `'tertiary'` | Determines style of button |
| tertiaryColor | No | `'blue'` \| `'gray'` | `'blue'` | Determines color theme of the tertiary button |
| className | No | string | - | Additional CSS classes |
| ...buttonProps | No | - | - | Accepts all standard button element props |

### TooltipContent Props

`TooltipContentProps` extends `Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'id'>` — accepts all standard div props except `role` and `id` (those are managed internally).

| Prop | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| children | No | ReactNode | - | Tooltip content (text only, no interactive elements) |
| className | No | string | - | Additional CSS classes |
| style | No | CSSProperties | - | Inline styles |
| onMouseEnter | No | MouseEventHandler<HTMLDivElement> | - | Mouse enter handler |
| onMouseLeave | No | MouseEventHandler<HTMLDivElement> | - | Mouse leave handler |

### TooltipTrigger Props

| Prop | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| children | Yes | NonNullable<ReactElement> | - | The element that triggers the tooltip to open. Must be a button to remain accessible. Cannot be null or undefined. |

## Common Patterns

### Form Field Help
```tsx
<Tooltip id="email-help">
  <TooltipTrigger>
    <InfoTooltipButton screenReaderLabel="Why we need your email" />
  </TooltipTrigger>
  <TooltipContent>
    Your email will be used to send order confirmations and shipping updates.
  </TooltipContent>
</Tooltip>
```

### Controlled Tooltip
```tsx
const [isOpen, setIsOpen] = useState(false);

<Tooltip 
  id="controlled-tooltip"
  isOpen={isOpen}
  onIsOpenChange={setIsOpen}
>
  <TooltipTrigger>
    <Button variant="secondary">Toggle Tooltip</Button>
  </TooltipTrigger>
  <TooltipContent>
    This tooltip is controlled by parent state.
  </TooltipContent>
</Tooltip>
```

### Custom Placement
```tsx
<Tooltip id="bottom-tooltip" placement="bottom">
  <TooltipTrigger>
    <Button variant="secondary">Hover Me</Button>
  </TooltipTrigger>
  <TooltipContent>
    This tooltip appears below the button.
  </TooltipContent>
</Tooltip>
```

### Disabled Hover (Click Only)
```tsx
<Tooltip id="click-only" disableHover>
  <TooltipTrigger>
    <Button variant="secondary">Click Only</Button>
  </TooltipTrigger>
  <TooltipContent>
    This tooltip only opens on click, not hover.
  </TooltipContent>
</Tooltip>
```

### With Portal (Overlay Issues)
```tsx
<Tooltip id="portal-tooltip" shouldCreatePortal>
  <TooltipTrigger>
    <Button variant="secondary">Portal Tooltip</Button>
  </TooltipTrigger>
  <TooltipContent>
    Rendered in a portal to avoid z-index issues.
  </TooltipContent>
</Tooltip>
```

## Component Variations

| Variation | Description | Use Case |
|-----------|-------------|----------|
| **Tooltip** | Tooltip paired with any button component | Use with standard buttons to provide extra contextual information |
| **Info Tooltip** | Tooltip triggered by InfoTooltipButton with info/cancel icon | Use inline with text (labels, titles) for contextual help. Must be inline to meet accessibility standards |

## Accessibility

- **Trigger must be focusable:** Tooltip triggers must be keyboard accessible (buttons).
- **No interactive content:** Tooltips cannot contain links, inputs, or buttons as they never receive focus.
- **Touch support:** Tooltips work on hover, focus, and press (touch devices). Never rely on hover alone.
- **Size requirements:** 
  - Inline tooltips (with text blocks): No minimum size requirement
  - Standalone tooltips: Must be at least 44x44px to meet [WCAG Target Size (Level AAA)](https://www.w3.org/WAI/WCAG21/Understanding/target-size)
- **Concurrent input mechanisms:** All trigger methods (keyboard, mouse, touch) must work independently per [WCAG Concurrent Input Mechanisms](https://www.w3.org/WAI/WCAG22/Understanding/concurrent-input-mechanisms.html)
- **Keyboard support:**
  - `Space` or `Enter`: Toggle tooltip
  - `Escape`: Close tooltip
  - `Tab`: Focus moves away and closes tooltip
- **ARIA attributes:**
  - Trigger has `aria-expanded` when open
  - Trigger has `aria-describedby` pointing to tooltip ID
  - Content has `role="tooltip"` (internally managed, do not pass)

## Best Practices

**Do:**
- Use for non-critical contextual information or help
- Use for additional guidance that supplements the UI
- Keep tooltip content short and descriptive
- Place tooltips in predictable locations
- Use InfoTooltipButton inline with text blocks (labels, titles)

**Don't:**
- Don't use for information needed to complete a task (use hint text instead)
- Don't use on buttons that trigger other actions (e.g., delete button with tooltip will fail on touch devices)
- Don't include interactive elements (links, buttons, inputs) in tooltip content
- Don't use for critical information (tooltip content should supplement, not replace)
- Don't trigger tooltips on hover alone (must support touch devices)

## Layout & Positioning

- Tooltips automatically reposition based on available space using `@floating-ui`
- Supported placements: `top`, `right`, `bottom`, `left`, and variants (`top-start`, `top-end`, etc.)
- Default placement is `top` but will flip/shift to stay visible
- Maximum width: 475px (3 columns in grid)
- Content wraps to multiple lines when needed
- Arrow automatically points to trigger element

## Advanced Usage

### Responsive Max Width
```tsx
<Tooltip id="long-content">
  <TooltipTrigger>
    <Button variant="secondary">Details</Button>
  </TooltipTrigger>
  <TooltipContent>
    This is a longer tooltip that will wrap to multiple lines when the content 
    exceeds the maximum width of 475px. The tooltip remains responsive and accessible.
  </TooltipContent>
</Tooltip>
```

### Open by Default 
```tsx
<Tooltip id="tooltip" defaultIsOpen>
  <TooltipTrigger>
    <Button variant="secondary">Tell Me Why</Button>
  </TooltipTrigger>
  <TooltipContent>
    Your email will be used to update you on your application process.
  </TooltipContent>
</Tooltip>
```

## Related Components

- **Hint**: For persistent help text on form fields (preferred over tooltips for form guidance)
- **Modal**: For complex information or actions requiring user interaction
- **ComponentLevelNotification**: For contextual alerts or messages
