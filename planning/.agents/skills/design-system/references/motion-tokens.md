# Motion Tokens Reference

All tokens are imported from the package root:

```tsx
import { duration300, easeInOut, fadeIn, slideInLeft } from '@americanexpress/dls-motion';
```

## Duration Tokens

Exported from `packages/dls-motion/src/tokens/duration.ts`:

| Token | Value |
|---|---|
| `duration0` | `'0ms'` |
| `duration100` | `'100ms'` |
| `duration200` | `'200ms'` |
| `duration300` | `'300ms'` |
| `duration400` | `'400ms'` |
| `duration500` | `'500ms'` |
| `duration600` | `'600ms'` |
| `duration700` | `'700ms'` |
| `duration800` | `'800ms'` |
| `duration900` | `'900ms'` |

### Duration Selection Guide

| Type | Token |
|---|---|
| Micro-interaction (tooltip, badge) | `duration100` or `duration200` |
| Standard transition (modal, drawer, slide) | `duration300` |
| Emphasized entrance (hero, marketing) | `duration500` or `duration700` |
| Staggered delay between items | `useInView` delay: `index * 100`, or `useDelayed`: `index * 300` |
| Instant (no animation but token-based) | `duration0` |

## Easing Tokens

Exported from `packages/dls-motion/src/tokens/easing.ts`:

| Token | Value | Use for |
|---|---|---|
| `easeIn` | `'cubic-bezier(0.4, 0, 1, 1)'` | Exit animations |
| `easeOut` | `'cubic-bezier(0, 0, 0.2, 1)'` | Entrance animations |
| `easeInOut` | `'cubic-bezier(0.4, 0, 0.2, 1)'` | General / TransitionWrapper default |
| `linear` | `'cubic-bezier(0, 0, 1, 1)'` | Continuous animations |

### ASCII Curve Visualizations

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

### Easing Selection Guide

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

## Motion Primitives

All 12 primitives use percentage-key keyframe format `{ '0%': {...}, '100%': {...} }`.

### Fade

| Primitive | Description | Keyframes |
|---|---|---|
| `fadeIn` | Opacity 0 → 1 | `{ '0%': { opacity: 0 }, '100%': { opacity: 1 } }` |
| `fadeOut` | Opacity 1 → 0 | `{ '0%': { opacity: 1 }, '100%': { opacity: 0 } }` |

### Slide Horizontal

| Primitive | Description | Keyframes |
|---|---|---|
| `slideInRight` | translateX 100% → 0 | `{ '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } }` |
| `slideInLeft` | translateX -100% → 0 | `{ '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } }` |
| `slideOutRight` | translateX 0 → 100% | `{ '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(100%)' } }` |
| `slideOutLeft` | translateX 0 → -100% | `{ '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-100%)' } }` |

### Slide Vertical

| Primitive | Description | Keyframes |
|---|---|---|
| `slideInTop` | translateY -100% → 0 | `{ '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(0)' } }` |
| `slideInBottom` | translateY 100% → 0 | `{ '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } }` |
| `slideOutTop` | translateY 0 → -100% | `{ '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(-100%)' } }` |
| `slideOutBottom` | translateY 0 → 100% | `{ '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(100%)' } }` |

> **Critical:** Primitives are single-concern. Slide primitives only animate `transform`, not `opacity`. Always compose slide + fade as an array:
> ```tsx
> animation={[slideInLeft, fadeIn]}
> ```
