# useDelayed

Hook for delaying animation start. From `@americanexpress/dls-motion`.

```tsx
import { useDelayed } from '@americanexpress/dls-motion';
```

## Signature

```ts
useDelayed(delay: number): boolean
```

Returns `false` until the delay (in ms) has elapsed, then returns `true`. If `delay <= 0`, returns `true` immediately.

## Rules of Hooks — Critical

**Never call `useDelayed` inside `.map()`, a loop, or conditionally.** Each call to `useDelayed` is a React hook — it must be called at the top level of a component.

When staggering a list of items, you MUST extract each item into its own child component that calls `useDelayed` at its top level. Calling `useDelayed` inside `.map()` in a parent component will cause: `"React has detected a change in the order of Hooks"`.

```tsx
// ✅ CORRECT — hook at top level of child component
function StaggeredItem({ index, isStarted }) {
  const isReady = useDelayed(isStarted ? index * 300 : 0);
  return <AnimatedWrapper isAnimationStarted={isStarted && isReady}>...</AnimatedWrapper>;
}

function List({ items }) {
  return items.map((item, i) => <StaggeredItem key={item.id} index={i} isStarted={started} />);
}

// ❌ WRONG — hook inside .map() (BREAKS Rules of Hooks)
function List({ items }) {
  return items.map((item, i) => {
    const isReady = useDelayed(i * 300); // ← VIOLATION
    return <AnimatedWrapper isAnimationStarted={isReady}>...</AnimatedWrapper>;
  });
}
```

## Key Pattern

```tsx
import {
  AnimatedWrapper, useDelayed,
  slideInBottom, fadeIn,
  duration300, easeInOut,
} from '@americanexpress/dls-motion';

function StaggeredItem({ index, isStarted }) {
  const isReady = useDelayed(isStarted ? index * 300 : 0);

  return (
    <AnimatedWrapper
      animation={[slideInBottom, fadeIn]}
      duration={duration300}
      easing={easeInOut}
      isAnimationStarted={isStarted && isReady}
    >
      <Card>Item {index}</Card>
    </AnimatedWrapper>
  );
}
```

## Examples

### Staggered list on user action

```tsx
import { useState } from 'react';
import {
  AnimatedWrapper, useDelayed,
  slideInBottom, fadeIn,
  duration300, easeInOut,
} from '@americanexpress/dls-motion';

function StaggeredList({ items }) {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsStarted(true)}>Show Items</Button>
      {items.map((item, index) => (
        <StaggeredItem key={item.id} item={item} index={index} isStarted={isStarted} />
      ))}
    </div>
  );
}

function StaggeredItem({ item, index, isStarted }) {
  const isReady = useDelayed(isStarted ? index * 300 : 0);

  return (
    <AnimatedWrapper
      animation={[slideInBottom, fadeIn]}
      duration={duration300}
      easing={easeInOut}
      isAnimationStarted={isStarted && isReady}
    >
      <Card>{item.title}</Card>
    </AnimatedWrapper>
  );
}
```

### Simple delayed appearance

```tsx
import { AnimatedWrapper, useDelayed, fadeIn, duration300, easeOut } from '@americanexpress/dls-motion';

function DelayedWelcome() {
  const isReady = useDelayed(500);

  return (
    <AnimatedWrapper
      animation={fadeIn}
      duration={duration300}
      easing={easeOut}
      isAnimationStarted={isReady}
    >
      <p>Welcome message appears after 500ms</p>
    </AnimatedWrapper>
  );
}
```

## When to use vs useInView delay

- **useDelayed** — for user-action triggers (button click, page load, state change)
- **useInView with `delay` option** — for scroll-triggered stagger (element enters viewport)

## Reminder: Extract List Items

When staggering lists with `useDelayed`, always create a separate child component per item. Never call `useDelayed` inside `.map()` in the parent — this violates React's Rules of Hooks and causes runtime errors.
