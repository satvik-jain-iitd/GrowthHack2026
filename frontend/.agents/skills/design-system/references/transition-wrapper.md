# TransitionWrapper

Enter/exit animation wrapper component from `@americanexpress/dls-motion`. Use this for elements that appear and disappear (modals, drawers, tooltips, toasts).

```tsx
import { TransitionWrapper, fadeIn, fadeOut, duration300, easeInOut } from '@americanexpress/dls-motion';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | **required** | Controls enter/exit state |
| `enterAnimation` | `Keyframes \| Keyframes[]` | **required** | Animation played on enter |
| `exitAnimation` | `Keyframes \| Keyframes[]` | **required** | Animation played on exit |
| `duration` | `string` | `'0.3s'` | Animation duration |
| `easing` | `string` | easeInOut value | **SINGLE prop for both enter and exit** |
| `shouldMountOnEnter` | `boolean` | `false` | Mount child when entering |
| `shouldUnmountOnExit` | `boolean` | `false` | Unmount child after exit completes |
| `onEnter` | `() => void` | – | Called when enter transition starts |
| `onEntered` | `() => void` | – | Called when enter transition completes |
| `onExit` | `() => void` | – | Called when exit transition starts |
| `onExited` | `() => void` | – | Called when exit transition completes |
| `className` | `string` | – | Additional CSS class |
| `style` | `CSSProperties` | – | Additional inline styles |
| `children` | `ReactNode` | – | Content to animate |

### Prop name gotcha

- Use `shouldMountOnEnter` — **NOT** `mountOnEnter`
- Use `shouldUnmountOnExit` — **NOT** `unmountOnExit`

### Easing gotcha

TransitionWrapper takes a **SINGLE** `easing` prop for both enter and exit. You cannot set different easing for enter vs exit. Use `easeInOut` as the default.

## Examples

### Modal fade

```tsx
import { TransitionWrapper, fadeIn, fadeOut, duration300, easeInOut } from '@americanexpress/dls-motion';

function AnimatedModal({ isOpen, children }) {
  return (
    <TransitionWrapper
      isOpen={isOpen}
      enterAnimation={fadeIn}
      exitAnimation={fadeOut}
      duration={duration300}
      easing={easeInOut}
      shouldMountOnEnter
      shouldUnmountOnExit
    >
      {children}
    </TransitionWrapper>
  );
}
```

### Drawer slide with composition

```tsx
import {
  TransitionWrapper,
  slideInLeft, slideOutLeft,
  fadeIn, fadeOut,
  duration300, easeInOut,
} from '@americanexpress/dls-motion';

function AnimatedDrawer({ isOpen, children }) {
  return (
    <TransitionWrapper
      isOpen={isOpen}
      enterAnimation={[slideInLeft, fadeIn]}
      exitAnimation={[slideOutLeft, fadeOut]}
      duration={duration300}
      easing={easeInOut}
      shouldMountOnEnter
      shouldUnmountOnExit
    >
      {children}
    </TransitionWrapper>
  );
}
```

### Mount/unmount pattern

When `shouldMountOnEnter` and `shouldUnmountOnExit` are both `true`, the child component is:
1. Not rendered initially (before first open)
2. Mounted and enter animation plays when `isOpen` becomes `true`
3. Exit animation plays and child is unmounted when `isOpen` becomes `false`

This is the recommended pattern for modals, drawers, and overlays to avoid rendering hidden DOM elements.
