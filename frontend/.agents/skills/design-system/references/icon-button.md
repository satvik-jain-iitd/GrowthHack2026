# IconButton Component Reference
> AI agent-friendly reference for DLS IconButton component

## Quick Reference
Icon-only buttons for common actions. Uses icons as visual triggers without visible text labels, requiring screen reader labels for accessibility.

## Import
```tsx
import { IconButton, IconToggleButton } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<IconButton screenReaderLabel="Close" variant="tertiary">
  <IconClose />
</IconButton>
```

## Props API

### IconButton

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| screenReaderLabel | `string` | Yes | - | Accessible label for screen readers |
| children | `ReactElement` | Yes | - | Icon component (will be resized to md) |
| variant | `'primary'` \| `'secondary'` \| `'tertiary'` | No | `'tertiary'` | Visual style variant |
| shape | `'square'` \| `'round'` | No | `'square'` | Button shape |
| tertiaryColor | `'blue'` \| `'gray'` | No | `'blue'` | Color for tertiary variant |
| isLoading | `boolean` | No | - | Shows loading state |
| disabled | `boolean` | No | - | @deprecated use `aria-disabled` instead. Removes button from accessibility tree and prevents focus. |
| aria-disabled | `Booleanish` | No | - | Disables but keeps in tab order |
| onClick | `MouseEventHandler<HTMLButtonElement>` | No | - | Click handler |
| className | `string` | No | - | Additional CSS classes |
| labelOverrides | `{ loadingScreenReaderLabel?: string }` | No | - | Custom loading label |
| aria-expanded | `Booleanish` | No | - | For expandable UI (e.g., menus) |
| ref | `Ref<HTMLButtonElement>` | No | - | Forwarded to the underlying `<button>` element |

### IconToggleButton

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| screenReaderLabel | `string` | Yes | - | Accessible label for screen readers |
| children | `ReactElement` | Yes | - | Icon component (will be resized to md) |
| aria-pressed | `Booleanish` | No | - | Toggle state; when truthy the icon renders in its filled state |
| disabled | `boolean` | No | - | @deprecated use `aria-disabled` instead. Removes button from accessibility tree and prevents focus. |
| aria-disabled | `Booleanish` | No | - | Disables but keeps in tab order |
| aria-expanded | `Booleanish` | No | - | For expandable UI (e.g., menus) |
| shape | `'square'` \| `'round'` | No | `'square'` | Button shape |
| onClick | `MouseEventHandler<HTMLButtonElement>` | No | - | Click handler |
| className | `string` | No | - | Additional CSS classes |
| isLoading | `boolean` | No | - | Shows loading state |
| ref | `Ref<HTMLButtonElement>` | No | - | Forwarded to the underlying `<button>` element |

## Common Patterns

### Basic IconButton Variants
```tsx
<IconButton screenReaderLabel="Close" variant="primary">
  <IconClose />
</IconButton>

<IconButton screenReaderLabel="Close" variant="secondary">
  <IconClose />
</IconButton>

<IconButton screenReaderLabel="Close" variant="tertiary">
  <IconClose />
</IconButton>

<IconButton screenReaderLabel="Close" variant="tertiary" tertiaryColor="gray">
  <IconClose />
</IconButton>
```

### Round Icon Buttons
```tsx
<IconButton screenReaderLabel="Add" shape="round" variant="primary">
  <IconPlus />
</IconButton>

<IconButton screenReaderLabel="Settings" shape="round" variant="secondary">
  <IconSetting />
</IconButton>
```

### Icon Toggle Button (Bookmark Example)
```tsx
function BookmarkButton() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  return (
    <IconToggleButton
      screenReaderLabel={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      aria-pressed={isBookmarked}
      onClick={() => setIsBookmarked(!isBookmarked)}
    >
      <IconBookmark />
    </IconToggleButton>
  );
}
```

### Icon Toggle Button (Show/Hide Example)
```tsx
function PasswordVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <IconToggleButton
      screenReaderLabel={isVisible ? "Hide password" : "Show password"}
      aria-pressed={isVisible}
      onClick={() => setIsVisible(!isVisible)}
    >
      {isVisible ? <IconEyeOpen /> : <IconEyeClosed />}
    </IconToggleButton>
  );
}
```

### Icon Toggle Button with Expansion
```tsx
function MenuToggle() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <IconToggleButton
      screenReaderLabel="Menu"
      aria-pressed={isOpen}
      aria-expanded={isOpen}
      onClick={() => setIsOpen(!isOpen)}
    >
      <IconMenu />
    </IconToggleButton>
  );
}
```

### Loading State
```tsx
<IconButton 
  screenReaderLabel="Save" 
  variant="primary" 
  isLoading
  labelOverrides={{ loadingScreenReaderLabel: 'Saving' }}
>
  <IconSave />
</IconButton>
```

### Common Actions
```tsx
// Close/Dismiss
<IconButton screenReaderLabel="Close dialog" variant="tertiary">
  <IconClose />
</IconButton>

// Delete
<IconButton screenReaderLabel="Delete item" variant="tertiary">
  <IconTrash />
</IconButton>

// Edit
<IconButton screenReaderLabel="Edit" variant="tertiary">
  <IconEdit />
</IconButton>

// More actions menu
<IconButton screenReaderLabel="More actions" variant="tertiary">
  <IconMoreVertical />
</IconButton>
```

## Accessibility Requirements

**Required:**
- **Always** provide `screenReaderLabel` - this is the only text users will hear
- Ensure icon button has 44x44px minimum target size
- Use 3:1 contrast ratio with background
- Icon buttons must be focusable and keyboard operable
- For toggle buttons, use `aria-pressed` to indicate state

**Recommended:**
- Use icon buttons only for common, well-known actions (close, edit, delete, etc.)
- Change `screenReaderLabel` to reflect current state for toggle buttons
- Use `aria-expanded` with `aria-pressed` for expandable UI elements
- Keep icon meaning consistent across application
- Consider localization for icon meanings

**Avoid:**
- Don't use icon buttons for new, complex, or critical actions (like form submit)
- Don't make icon buttons smaller than 44x44px
- Don't use icon buttons as the only way to access important functionality
- Don't use icon buttons to save space on complex actions

## Anti-Patterns

❌ **Wrong: Missing screen reader label**
```tsx
<IconButton variant="primary">
  <IconClose />
</IconButton>
```
✅ **Correct: Always include screenReaderLabel**
```tsx
<IconButton screenReaderLabel="Close" variant="primary">
  <IconClose />
</IconButton>
```

❌ **Wrong: Icon button for navigation**
```tsx
<IconButton screenReaderLabel="Go to account" onClick={() => navigate('/account')}>
  <IconArrowRight />
</IconButton>
```
✅ **Correct: Use Link for navigation**
```tsx
<Link href="/account">
  <IconArrowRight /> Account
</Link>
```

❌ **Wrong: Icon button for complex action**
```tsx
<IconButton screenReaderLabel="Submit application">
  <IconCheckmark />
</IconButton>
```
✅ **Correct: Use regular Button for complex/critical actions**
```tsx
<Button variant="primary">Submit Application</Button>
```

❌ **Wrong: Toggle button without aria-pressed**
```tsx
<IconButton 
  screenReaderLabel="Bookmark"
  onClick={() => setBookmarked(!bookmarked)}
>
  <IconBookmark isFilled={bookmarked} />
</IconButton>
```
✅ **Correct: Use IconToggleButton with aria-pressed**
```tsx
<IconToggleButton
  screenReaderLabel="Bookmark"
  aria-pressed={bookmarked}
  onClick={() => setBookmarked(!bookmarked)}
>
  <IconBookmark />
</IconToggleButton>
```

❌ **Wrong: Using different icons for same action**
```tsx
// In one place
<IconButton screenReaderLabel="Close"><IconX /></IconButton>
// In another place
<IconButton screenReaderLabel="Close"><IconTimes /></IconButton>
```
✅ **Correct: Consistent icons for same action**
```tsx
// Always use same icon for close
<IconButton screenReaderLabel="Close"><IconClose /></IconButton>
```

## Best Practices

- **Use for common actions only:** close, edit, delete, bookmark, settings, search
- **Icon selection:** use simple, universally recognizable icons
- **Consistent usage:** same icon for same action throughout app
- **Size:** icons automatically sized to `md`, button is minimum 44x44px
- **Color:** tertiary gray or blue for most cases, primary/secondary for emphasis
- **Shape:** square for most cases, round for floating actions
- **Toggle buttons:** use for activate/deactivate actions (bookmark, show/hide, expand/collapse)
- **Not for toggle switches:** use Toggle Switch component for settings
- **Screen reader labels:** make them action-specific, not generic
- **Background:** use on light backgrounds (white, gray 100, gray 200)

## When to Use

**Use IconButton for:**
- Common actions: close, delete, edit, menu, search
- Space-constrained interfaces where icon meaning is clear
- Repeated actions in lists/tables
- Secondary/tertiary actions that don't need emphasis

**Use IconToggleButton for:**
- Bookmark/unbookmark
- Show/hide content
- Expand/collapse sections
- Enable/disable features (when not using Toggle Switch)

**Don't use IconButton for:**
- Navigation to other pages (use Link)
- Complex or unfamiliar actions
- Primary form submission
- Critical actions requiring user confidence

## Related Components
- [Button](button.md) - Standard button with text label
- [ButtonBase](button-base.md) - Unstyled button foundation
- [SplitButton](split-button.md) - Primary action with nested options
- [ToggleSwitch](toggle-switch.md) - For settings/preferences
