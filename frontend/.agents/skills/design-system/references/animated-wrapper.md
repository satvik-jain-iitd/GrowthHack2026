# AnimatedWrapper

One-shot animation wrapper component from `@americanexpress/dls-motion`.

```tsx
import { AnimatedWrapper, fadeIn, duration300, easeOut } from '@americanexpress/dls-motion';
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | **required** | Content to animate |
| `className` | `string` | – | Additional CSS class |
| `style` | `CSSProperties` | – | Additional inline styles |
| `animation` | `Keyframes \| Keyframes[]` | – | Single keyframe or array to compose |
| `duration` | `string` | `'0.3s'` | Animation duration |
| `easing` | `string` | easeInOut value | Easing function |
| `isAnimationStarted` | `boolean` | `true` | Controls when animation begins |
| `onEnd` | `() => void` | – | Fires when animation completes (also fires on reduced motion) |

### Props NOT available

- **No `delay` prop** — use `useDelayed` or `useInView` with `delay` option instead
- **No `iterationCount` prop**

## Key Behaviors

- **One-shot only** — not for enter/exit transitions (use TransitionWrapper for that)
- Applies initial styles from the first keyframe on mount
- Applies final styles when animation finishes
- Respects `prefers-reduced-motion` (skips to final state, still fires `onEnd`)
- Renders a `<div>` wrapper element
- When `isAnimationStarted` is `false`, strips `transform` from initial styles to prevent scroll overflow
- Uses the Web Animations API

## Rules of Hooks Reminder

When using `AnimatedWrapper` with hooks like `useInView` or `useDelayed` to animate lists/grids, **always extract each item into its own child component**. Never call hooks inside `.map()` or loops in a parent component — this violates React's Rules of Hooks. See `./use-in-view.md` and `./use-delayed.md` for correct patterns.

## Examples

### Basic fade-in

```tsx
import { AnimatedWrapper, fadeIn, duration300, easeOut } from '@americanexpress/dls-motion';

function HeroSection() {
  return (
    <AnimatedWrapper animation={fadeIn} duration={duration300} easing={easeOut}>
      <h1>Welcome</h1>
    </AnimatedWrapper>
  );
}
```

### Array composition (slide + fade)

```tsx
import { AnimatedWrapper, slideInLeft, fadeIn, duration300, easeOut } from '@americanexpress/dls-motion';

function PromoCard() {
  return (
    <AnimatedWrapper
      animation={[slideInLeft, fadeIn]}
      duration={duration300}
      easing={easeOut}
    >
      <Card>Promo content</Card>
    </AnimatedWrapper>
  );
}
```

### Deferred start with useInView

```tsx
import { useRef } from 'react';
import { AnimatedWrapper, useInView, fadeIn, duration300, easeOut } from '@americanexpress/dls-motion';

function ScrollRevealSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { showOnce: true });

  return (
    <div ref={ref}>
      <AnimatedWrapper
        animation={fadeIn}
        duration={duration300}
        easing={easeOut}
        isAnimationStarted={isInView}
      >
        <p>This fades in when scrolled into view</p>
      </AnimatedWrapper>
    </div>
  );
}
```

### Sequential chain with onEnd

See `./recipes/motion.md#sequential-chain` for the full pattern using `onEnd` callbacks to trigger animations in sequence.
