# DesignSystemProvider Component Reference

> AI agent-friendly reference for DLS DesignSystemProvider component

## Quick Reference

Root provider component for DLS theme system. Controls light/dark mode and provides context to all child components. Wraps Surface component.

## Import

```tsx
import { DesignSystemProvider, useMode } from '@americanexpress/dls-react';
```

## `useMode` Hook

```ts
useMode(id?: string): ['light' | 'dark' | undefined, (newMode: 'light' | 'dark' | undefined) => void]
```

Returns `[mode, setMode]` for the provider matching `id` (defaults to `'default'`). When using nested providers, pass the matching `id` to target the correct context.

## Minimal Example

```tsx
<DesignSystemProvider mode="light">
  <App />
</DesignSystemProvider>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| mode | "light" \| "dark" | No | light | The color mode for the DesignSystemProvider. |
| id | string | No | default | Local Provider ID key for multiple instances. |
| surface | "base" \| "foreground" \| "fg-subtle" \| "fg-brand" \| "fg-brand-alt" | No | foreground | Surface variant to apply to the DesignSystemProvider Surface. |
| children | ReactNode | Yes | - | The children inside the layout. |


## Common Patterns

### Basic Setup
```tsx
import { DesignSystemProvider } from '@americanexpress/dls-react';

function App() {
  return (
    <DesignSystemProvider mode="light">
      <YourApp />
    </DesignSystemProvider>
  );
}
```

### Dark Mode
```tsx
<DesignSystemProvider mode="dark">
  <YourApp />
</DesignSystemProvider>
```

### Using useMode Hook
```tsx
import { useMode } from '@americanexpress/dls-react';

// Targets the default (root) provider
function ThemeToggle() {
  const [mode, setMode] = useMode();
  
  return (
    <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      Switch to {mode === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}

// Targets a nested provider by matching its id prop
function SidebarThemeToggle() {
  const [mode, setMode] = useMode('sidebar');
  
  return (
    <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      Switch sidebar to {mode === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

### Nested Providers
```tsx
<DesignSystemProvider mode="light" id="app">
  <MainContent />
  <DesignSystemProvider mode="dark" id="sidebar">
    <Sidebar />
  </DesignSystemProvider>
</DesignSystemProvider>
```

> To read or update a nested provider's mode from within it, pass the matching `id` to `useMode`: `useMode('sidebar')`.

### With Custom Surface
```tsx
<DesignSystemProvider mode="light" surface="fg-brand">
  <BrandedSection />
</DesignSystemProvider>
```

## Accessibility Requirements

**Required:**
- Wrap entire application or section that uses DLS components
- Provide mode that meets contrast requirements

**Recommended:**
- Allow users to choose preferred color mode
- Persist mode selection in localStorage (handled automatically)
- Test both light and dark modes for accessibility

## Anti-Patterns

**Never:**
- Nest providers without unique `id` props
- Change mode without user interaction (respect preferences)
- Use multiple providers at root level without IDs

## Best Practices

- Wrap app at highest level possible
- Use `useMode` hook to access/update mode
- Provide mode toggle for user control
- Test all components in both light and dark modes
- Mode persists automatically in localStorage
- Use unique `id` for nested providers

## Advanced Usage

### Mode Persistence
```tsx
// Mode is automatically stored in localStorage as:
// `DESIGN_SYSTEM_ALPHA_${id}_mode`

// For default provider: DESIGN_SYSTEM_ALPHA_default_mode
// For custom id="header": DESIGN_SYSTEM_ALPHA_header_mode
```

### Theme Toggle Component
```tsx
import { useMode, IconButton } from '@americanexpress/dls-react';
import { IconSun, IconMoon } from '@americanexpress/dls-icons';

function ThemeToggle() {
  const [mode, setMode] = useMode();
  
  return (
    <IconButton
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      screenReaderLabel={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? <IconMoon /> : <IconSun />}
    </IconButton>
  );
}
```

## Related Components

- [Surface](surface.md) - For defining surface variants within app
