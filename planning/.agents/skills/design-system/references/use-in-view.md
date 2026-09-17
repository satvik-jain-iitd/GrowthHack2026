# useInView

Hook for detecting when an element enters the viewport. From `@americanexpress/dls-motion`.

```tsx
import { useInView } from '@americanexpress/dls-motion';
```

## Signature

```ts
useInView(ref: RefObject<Element>, options?: UseInViewOptions): boolean
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `amount` | `'some' \| 'all' \| number` | `'some'` | How much of the element must be visible |
| `showOnce` | `boolean` | `false` | If `true`, stays `true` after first intersection |
| `delay` | `number` | – | Delay in ms before returning `true` after intersection |

## Rules of Hooks — Critical

**Never call `useInView` inside `.map()`, a loop, or conditionally.** Each call to `useInView` is a React hook — it must be called at the top level of a component, not inside callbacks, conditions, or loops.

When animating a list of items (e.g., staggered card grid), you MUST extract each item into its own child component that calls `useInView` at its top level. Calling `useInView` inside `.map()` in a parent component will cause: `"React has detected a change in the order of Hooks"`.

```tsx
// ✅ CORRECT — hook called at top level of child component
function StaggeredCard({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { showOnce: true, delay: index * 100 });
  return (
    <div ref={ref}>
      <AnimatedWrapper animation={[slideInBottom, fadeIn]} isAnimationStarted={isInView}>
        <Card>{item.title}</Card>
      </AnimatedWrapper>
    </div>
  );
}

function CardGrid({ items }) {
  return items.map((item, i) => <StaggeredCard key={item.id} item={item} index={i} />);
}

// ❌ WRONG — hook called inside .map() in parent component (BREAKS Rules of Hooks)
function CardGrid({ items }) {
  return items.map((item, i) => {
    const ref = useRef(null);       // ← hook inside .map() — VIOLATION
    const isInView = useInView(ref); // ← hook inside .map() — VIOLATION
    return <div ref={ref}>...</div>;
  });
}
```

## Examples

### Basic viewport detection

```tsx
import { useRef } from 'react';
import { useInView } from '@americanexpress/dls-motion';

function Section() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref}>
      {isInView ? 'Visible' : 'Not visible'}
    </div>
  );
}
```

### One-time fade-in on scroll

```tsx
import { useRef } from 'react';
import { AnimatedWrapper, useInView, fadeIn, duration300, easeOut } from '@americanexpress/dls-motion';

function ScrollFadeSection() {
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
        <p>Fades in once when scrolled into view</p>
      </AnimatedWrapper>
    </div>
  );
}
```

### Staggered cards with delay

```tsx
import { useRef } from 'react';
import {
  AnimatedWrapper, useInView,
  slideInBottom, fadeIn,
  duration300, easeInOut,
} from '@americanexpress/dls-motion';

function StaggeredCardGrid({ items }) {
  return (
    <div className="flex flex-wrap">
      {items.map((item, index) => (
        <StaggeredCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

function StaggeredCard({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    showOnce: true,
    delay: index * 100,
  });

  return (
    <div ref={ref}>
      <AnimatedWrapper
        animation={[slideInBottom, fadeIn]}
        duration={duration300}
        easing={easeInOut}
        isAnimationStarted={isInView}
      >
        <Card>{item.title}</Card>
      </AnimatedWrapper>
    </div>
  );
}
```

### Threshold control

```tsx
const isFullyVisible = useInView(ref, { amount: 'all' });
const isHalfVisible = useInView(ref, { amount: 0.5 });
```

## When to use vs useDelayed

- **useInView** — for scroll-triggered animations (element enters viewport)
- **useDelayed** — for user-action triggers (button click, page load with stagger)

## Reminder: Extract List Items

When animating lists/grids with `useInView`, always create a separate child component per item. Never call `useInView` inside `.map()` in the parent — this violates React's Rules of Hooks and causes runtime errors.
