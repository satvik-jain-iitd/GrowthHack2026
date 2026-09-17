# Motion Recipes

Concrete, copy-paste-ready code patterns for `@americanexpress/dls-motion`.

## Composition Rules

### Slide + Fade (required)

Slide primitives only animate `transform`. Always compose with fade for opacity:

```tsx
// Correct — slide + fade composed as array
<AnimatedWrapper animation={[slideInLeft, fadeIn]} duration={duration300} easing={easeOut}>
  <Card>Content</Card>
</AnimatedWrapper>

// Wrong — slide alone (content appears abruptly, no opacity transition)
<AnimatedWrapper animation={slideInLeft} duration={duration300} easing={easeOut}>
  <Card>Content</Card>
</AnimatedWrapper>
```

### Array Syntax

Pass multiple keyframes as an array. They run simultaneously:

```tsx
animation={[slideInBottom, fadeIn]}
```

### combineKeyframes Utility

For advanced composition, use `combineKeyframes` to merge multiple keyframe objects into one:

```tsx
import { combineKeyframes, slideInLeft, fadeIn } from '@americanexpress/dls-motion';

const combined = combineKeyframes(slideInLeft, fadeIn);
```

## Easing Guide

### ASCII Curves

```
easeOut (entrance animations — responsive)
Speed
  ^
  |  /───────
  | /
  |/________________ time
cubic-bezier(0, 0, 0.2, 1) — Fast start, gradual deceleration

easeIn (exit animations — deliberate)
Speed
  ^
  |         /
  |        /
  |_______/_________ time
cubic-bezier(0.4, 0, 1, 1) — Slow start, fast finish

easeInOut (general / TransitionWrapper default)
Speed
  ^
  |    /──\
  |   /    \
  |  /      \
  | /        \
  |/__________\_____ time
cubic-bezier(0.4, 0, 0.2, 1) — Balanced, natural feel

linear (continuous animations)
Speed
  ^
  |      /──────
  |    /
  |  /
  |/________________ time
cubic-bezier(0, 0, 1, 1) — Constant speed
```

### Easing Selection Table

| Animation Direction | Easing Token | Why |
|---|---|---|
| Enter | easeOut | Fast start feels responsive |
| Exit | easeIn | Accelerates away, feels deliberate |
| Both (TransitionWrapper) | easeInOut | One prop handles both; balanced |
| Continuous | linear | Constant speed for progress/spinners |

### Decision Tree

```
What direction?
├─ Entrance → easeOut
├─ Exit → easeIn
├─ Both enter + exit (TransitionWrapper) → easeInOut
├─ Continuous → linear
└─ Unsure → easeInOut
```

### Selection Table

| Animation | Direction | Easing | Duration |
|---|---|---|---|
| Modal open | Entrance | `easeOut` | `duration300` |
| Modal close | Exit | `easeIn` | `duration300` |
| Drawer open | Entrance | `easeOut` | `duration300` |
| Drawer close | Exit | `easeIn` | `duration300` |
| Fade in content | Entrance | `easeOut` | `duration200` |
| Fade out content | Exit | `easeIn` | `duration200` |
| Slide in | Entrance | `easeOut` | `duration300` |
| Slide out | Exit | `easeIn` | `duration300` |
| Staggered list | Entrance | `easeInOut` | `duration300` |
| Scroll reveal | Entrance | `easeInOut` | `duration300`–`duration700` |
| Hero entrance | Entrance | `easeOut` | `duration500` |
| Progress bar | Continuous | `linear` | – |

### TransitionWrapper Single-Easing Note

TransitionWrapper takes a **SINGLE** `easing` prop applied to both enter and exit. You cannot configure different easing for each direction. Use `easeInOut` as the default since it handles both gracefully.

---

## Grid & Layout Integration

Grid and layout utility classes go on the AnimatedWrapper element itself, not on child elements inside the wrapper.

**Correct — grid classes on the wrapper:**

```tsx
<AnimatedWrapper
  className="col-xs-12 col-md-3"
  animation={[slideInBottom, fadeIn]}
  duration={duration300}
  easing={easeInOut}
  isAnimationStarted={isInView}
>
  <Card>Content</Card>
</AnimatedWrapper>
```

**Wrong — grid classes on child div inside wrapper:**

```tsx
<AnimatedWrapper
  animation={[slideInBottom, fadeIn]}
  duration={duration300}
  easing={easeInOut}
  isAnimationStarted={isInView}
>
  <div className="col-xs-12 col-md-3">
    <Card>Content</Card>
  </div>
</AnimatedWrapper>
```

The wrapper renders a `<div>`, so layout classes applied to it flow directly into the grid system. Nesting an extra div breaks the grid parent-child relationship.

---

## <a name="page-level-motion-rules"></a>Page-Level Motion Rules

**Rule:** Never slide an entire page or page-level container. Slides use `translateX/Y(100%)` — on full-width elements, this slides the entire viewport off-screen. Page-level containers may only use `fadeIn`. Animate child sections independently.

**Correct — animate child sections independently:**

```tsx
const Page = () => (
  <main>
    {/* Hero fades in on mount */}
    <AnimatedWrapper animation={fadeIn} duration={duration500} easing={easeOut}>
      <HeroSection />
    </AnimatedWrapper>

    {/* Cards stagger in on scroll */}
    <div className="flex flex-wrap">
      {cards.map((card, i) => (
        <ScrollCard key={card.id} card={card} index={i} />
      ))}
    </div>

    {/* CTA fades in on scroll */}
    <ScrollRevealCTA />
  </main>
);
```

**Wrong — wrapping page root in a slide:**

```tsx
// WRONG — slides the entire viewport
<AnimatedWrapper animation={[slideInLeft, fadeIn]} duration={duration500} easing={easeOut}>
  <main>
    <HeroSection />
    <CardGrid />
    <CTASection />
  </main>
</AnimatedWrapper>
```

---

## <a name="motion-effects-when-to-use-what"></a>Motion Effects: When to Use What

Concrete code examples for each of the four DLS motion types.

### Micro-animation — Success feedback

```tsx
import { AnimatedWrapper, fadeIn, duration200, easeOut } from '@americanexpress/dls-motion';

<AnimatedWrapper animation={fadeIn} duration={duration200} easing={easeOut} isAnimationStarted={isSuccess}>
  <SuccessIcon />
</AnimatedWrapper>
```

### Content transition — Modal with fade

```tsx
import {
  TransitionWrapper, fadeIn, fadeOut,
  duration300, easeInOut,
} from '@americanexpress/dls-motion';

<TransitionWrapper
  isOpen={isModalOpen}
  enterAnimation={fadeIn}
  exitAnimation={fadeOut}
  duration={duration300}
  easing={easeInOut}
  shouldMountOnEnter
  shouldUnmountOnExit
>
  <Modal>...</Modal>
</TransitionWrapper>
```

### Content transition — Drawer with slide+fade

```tsx
import {
  TransitionWrapper,
  slideInLeft, slideOutLeft,
  fadeIn, fadeOut,
  duration300, easeInOut,
} from '@americanexpress/dls-motion';

<TransitionWrapper
  isOpen={isDrawerOpen}
  enterAnimation={[slideInLeft, fadeIn]}
  exitAnimation={[slideOutLeft, fadeOut]}
  duration={duration300}
  easing={easeInOut}
  shouldMountOnEnter
  shouldUnmountOnExit
>
  <DrawerContent />
</TransitionWrapper>
```

### <a name="staggered-scroll-triggered-reveals"></a>Content transition — Staggered scroll-triggered card grid

```tsx
import { useRef } from 'react';
import {
  AnimatedWrapper, useInView,
  slideInBottom, fadeIn,
  duration300, easeInOut,
} from '@americanexpress/dls-motion';

function CardItem({ card, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { showOnce: true, delay: index * 100 });
  return (
    <div ref={ref}>
      <AnimatedWrapper
        animation={[slideInBottom, fadeIn]}
        duration={duration300}
        easing={easeInOut}
        isAnimationStarted={isInView}
      >
        <Card>{card.content}</Card>
      </AnimatedWrapper>
    </div>
  );
}
```

### Page transition — Animate children independently (NOT full page)

```tsx
import {
  AnimatedWrapper, fadeIn,
  duration500, easeOut,
} from '@americanexpress/dls-motion';

const Page = () => (
  <main>
    <AnimatedWrapper animation={fadeIn} duration={duration500} easing={easeOut}>
      <HeroSection />
    </AnimatedWrapper>
    {cards.map((card, i) => <CardItem key={card.id} card={card} index={i} />)}
  </main>
);
```

### Point-to-point — Tab content swap

```tsx
import { AnimatedWrapper, fadeIn, duration200, easeInOut } from '@americanexpress/dls-motion';

<AnimatedWrapper
  key={activeTabId}
  animation={fadeIn}
  duration={duration200}
  easing={easeInOut}
>
  <TabContent />
</AnimatedWrapper>
```

---

## <a name="sequential-chain"></a>Sequential Chain

Chain animations in sequence using `onEnd` callbacks. Each `AnimatedWrapper` starts when the previous one finishes.

```tsx
import { useState } from 'react';
import {
  AnimatedWrapper,
  fadeIn, slideInBottom,
  duration300, easeOut,
} from '@americanexpress/dls-motion';

function SequentialReveal() {
  const [step, setStep] = useState(0);

  return (
    <div>
      <AnimatedWrapper
        animation={fadeIn}
        duration={duration300}
        easing={easeOut}
        onEnd={() => setStep(1)}
      >
        <Heading level={1}>Title</Heading>
      </AnimatedWrapper>

      <AnimatedWrapper
        animation={[slideInBottom, fadeIn]}
        duration={duration300}
        easing={easeOut}
        isAnimationStarted={step >= 1}
        onEnd={() => setStep(2)}
      >
        <p>Subtitle appears after title</p>
      </AnimatedWrapper>

      <AnimatedWrapper
        animation={[slideInBottom, fadeIn]}
        duration={duration300}
        easing={easeOut}
        isAnimationStarted={step >= 2}
      >
        <Button>CTA appears last</Button>
      </AnimatedWrapper>
    </div>
  );
}
```

---

## <a name="staggered-list"></a>Staggered List

Stagger items using `useDelayed` with an index-based delay.

> **Rules of Hooks:** The `useDelayed` hook MUST be called at the top level of its own component. Each list item is extracted into a separate `StaggeredItem` child component below. Never inline `useDelayed` inside `.map()` in the parent — this violates React's Rules of Hooks and causes `"change in the order of Hooks"` errors.

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
      <Button onClick={() => setIsStarted(true)}>Reveal</Button>
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

---

## <a name="scroll-stagger"></a>Scroll Stagger

Stagger items as they scroll into view using `useInView` with `delay`.

> **Rules of Hooks:** The `useInView` hook MUST be called at the top level of its own component. Each grid item is extracted into a separate `ScrollStaggerCard` child component below. Never inline `useInView` or `useRef` inside `.map()` in the parent — this violates React's Rules of Hooks.

```tsx
import { useRef } from 'react';
import {
  AnimatedWrapper, useInView,
  slideInBottom, fadeIn,
  duration300, easeInOut,
} from '@americanexpress/dls-motion';

function ScrollStaggerGrid({ items }) {
  return (
    <div className="flex flex-wrap">
      {items.map((item, index) => (
        <ScrollStaggerCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

function ScrollStaggerCard({ item, index }) {
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

---

## <a name="scroll-reveal"></a>Scroll Reveal

Basic one-time fade-in when element enters the viewport.

```tsx
import { useRef } from 'react';
import { AnimatedWrapper, useInView, fadeIn, duration300, easeOut } from '@americanexpress/dls-motion';

function ScrollRevealSection({ children }) {
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
        {children}
      </AnimatedWrapper>
    </div>
  );
}
```

---

## <a name="stacked-simultaneous"></a>Stacked Simultaneous

Multiple elements animate at the same time using a shared trigger.

```tsx
import { useRef } from 'react';
import {
  AnimatedWrapper, useInView,
  fadeIn, slideInLeft, slideInRight,
  duration300, easeOut,
} from '@americanexpress/dls-motion';

function SimultaneousReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { showOnce: true });

  return (
    <div ref={ref} className="flex flex-row">
      <AnimatedWrapper
        animation={[slideInLeft, fadeIn]}
        duration={duration300}
        easing={easeOut}
        isAnimationStarted={isInView}
      >
        <Card>Left card</Card>
      </AnimatedWrapper>

      <AnimatedWrapper
        animation={[slideInRight, fadeIn]}
        duration={duration300}
        easing={easeOut}
        isAnimationStarted={isInView}
      >
        <Card>Right card</Card>
      </AnimatedWrapper>
    </div>
  );
}
```

---

## <a name="drawer-slide"></a>Drawer Slide

Slide-in drawer with mount/unmount lifecycle.

```tsx
import {
  TransitionWrapper,
  slideInLeft, slideOutLeft,
  fadeIn, fadeOut,
  duration300, easeInOut,
} from '@americanexpress/dls-motion';

function AnimatedDrawer({ isOpen, onClose, children }) {
  return (
    <TransitionWrapper
      isOpen={isOpen}
      enterAnimation={[slideInLeft, fadeIn]}
      exitAnimation={[slideOutLeft, fadeOut]}
      duration={duration300}
      easing={easeInOut}
      shouldMountOnEnter
      shouldUnmountOnExit
      onExited={onClose}
    >
      <aside className="drawer">
        {children}
      </aside>
    </TransitionWrapper>
  );
}
```

---

## <a name="modal-fade"></a>Modal Fade

Fade-in/out modal with backdrop.

```tsx
import { TransitionWrapper, fadeIn, fadeOut, duration300, easeInOut } from '@americanexpress/dls-motion';

function AnimatedModal({ isOpen, onClose, children }) {
  return (
    <>
      {/* Backdrop */}
      <TransitionWrapper
        isOpen={isOpen}
        enterAnimation={fadeIn}
        exitAnimation={fadeOut}
        duration={duration300}
        easing={easeInOut}
        shouldMountOnEnter
        shouldUnmountOnExit
      >
        <div className="modal-backdrop" onClick={onClose} />
      </TransitionWrapper>

      {/* Modal content */}
      <TransitionWrapper
        isOpen={isOpen}
        enterAnimation={fadeIn}
        exitAnimation={fadeOut}
        duration={duration300}
        easing={easeInOut}
        shouldMountOnEnter
        shouldUnmountOnExit
      >
        <div className="modal-content" role="dialog" aria-modal="true">
          {children}
        </div>
      </TransitionWrapper>
    </>
  );
}
```

---

## <a name="page-composition-recipe"></a>Page Composition Recipe

Full page with hero, staggered cards, and CTA — combining multiple patterns.

```tsx
import { useRef, useState } from 'react';
import {
  AnimatedWrapper, useInView,
  fadeIn, slideInBottom,
  duration300, duration500, easeOut, easeInOut,
} from '@americanexpress/dls-motion';

function MarketingPage({ cards }) {
  return (
    <div>
      {/* Hero — fade in on mount */}
      <AnimatedWrapper animation={fadeIn} duration={duration500} easing={easeOut}>
        <Surface>
          <Heading level={1}>Hero Title</Heading>
          <p>Hero description</p>
        </Surface>
      </AnimatedWrapper>

      {/* Card grid — staggered on scroll */}
      <div className="flex flex-wrap">
        {cards.map((card, index) => (
          <ScrollCard key={card.id} card={card} index={index} />
        ))}
      </div>

      {/* CTA — fade in on scroll */}
      <ScrollRevealCTA />
    </div>
  );
}

function ScrollCard({ card, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { showOnce: true, delay: index * 100 });

  return (
    <div ref={ref}>
      <AnimatedWrapper
        animation={[slideInBottom, fadeIn]}
        duration={duration300}
        easing={easeInOut}
        isAnimationStarted={isInView}
      >
        <Card>{card.title}</Card>
      </AnimatedWrapper>
    </div>
  );
}

function ScrollRevealCTA() {
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
        <Button>Get Started</Button>
      </AnimatedWrapper>
    </div>
  );
}
```

---

## Component-to-Motion Mapping Table

| Component | Wrapper | Primitives | Duration |
|---|---|---|---|
| Modal | TransitionWrapper | `fadeIn` / `fadeOut` | `duration300` |
| Drawer | TransitionWrapper | `[slideInLeft, fadeIn]` / `[slideOutLeft, fadeOut]` | `duration300` |
| Tooltip | TransitionWrapper | `fadeIn` / `fadeOut` | `duration200` |
| Toast | TransitionWrapper | `[slideInTop, fadeIn]` / `[slideOutTop, fadeOut]` | `duration300` |
| Card grid | AnimatedWrapper + useInView | `[slideInBottom, fadeIn]` | `duration300` |
| Hero section | AnimatedWrapper | `fadeIn` | `duration500` |
| Marketing section | AnimatedWrapper | `[slideInLeft, fadeIn]` or `[slideInRight, fadeIn]` | `duration300` |

---

## Accessibility

- **prefers-reduced-motion** is handled automatically by `@americanexpress/dls-motion`. When the user has reduced motion enabled, animations skip to their final state instantly
- **Callbacks still fire** — `onEnd`, `onEntered`, `onExited` all fire even when motion is reduced, so sequential chains and mount/unmount logic continue to work
- **Sequential chains work** — because `onEnd` fires on reduced motion, chained animations complete their state transitions without breaking
- **Never override** the reduced motion behavior. Do not add custom `@media (prefers-reduced-motion)` rules that conflict with the library's built-in handling

### Official DLS Motion Accessibility Guidelines

- **Respect prefers-reduced-motion** — handled automatically by both AnimatedWrapper and TransitionWrapper
- **Avoid vestibular triggers** — favor opacity and scale over large sweeping movements. If using slide primitives, always compose with fade
- **Prevent seizure risks** — no flashing above 3 per second. Staggered animations must not create rapid flicker effects
- **Provide user control** — allow pause/stop for non-essential animations. Users should be able to disable decorative motion
- **Information must not be motion-dependent** — never convey critical information through motion alone. Content must be perceivable without animation
- **Keep motion predictable and purposeful** — use motion for clarity, not decoration. Every animation should serve a functional purpose
- **Test with reduced motion enabled** — verify that all functionality works with `prefers-reduced-motion: reduce` active

---

## Do's and Don'ts

### Use Motion to:

- Reinforce product hierarchy or structure
- Provide feedback after user interactions
- Guide focus to new content or state changes
- Support micro-interactions (success cues, loading indicators)

### Don't use Motion when it:

- Delays essential tasks
- Creates unnecessary distractions
- Causes disorientation or discomfort
- Is purely decorative with no functional purpose

---

## Gotchas

1. **Rules of Hooks — extract list items into child components** — Never call `useInView`, `useDelayed`, `useRef`, or any hook inside `.map()`, a loop, or a conditional. When animating a list/grid, create a separate child component for each item that calls hooks at its top level. Violating this causes `"React has detected a change in the order of Hooks"` runtime errors
2. **Overflow from slides** — Slide animations can cause horizontal scrollbars. Add `overflow: hidden` to the parent container if content slides in from off-screen
3. **Single easing on TransitionWrapper** — Cannot set different easing for enter vs exit. Use `easeInOut` as the universal default
4. **onEnd fires on reduced motion** — This is intentional. Design your state logic assuming `onEnd` always fires
5. **No delay prop on AnimatedWrapper** — Use `useDelayed` hook or `useInView` with `delay` option instead
6. **Duration in ms format** — Token values are strings like `'300ms'`. The `duration` prop on wrappers accepts strings like `'0.3s'` or token values directly
