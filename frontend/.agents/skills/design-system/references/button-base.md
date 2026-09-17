# ButtonBase Component Reference
> AI agent-friendly reference for DLS ButtonBase component

## Quick Reference
Low-level button component that provides core button functionality without styling. Used as foundation for Button, IconButton, and other button components. Use this only when you need custom button styling.

## Import
```tsx
import { ButtonBase } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<ButtonBase>Click me</ButtonBase>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | `ReactNode` | No | - | Button content |
| type | `'button'` \| `'submit'` \| `'reset'` | No | `'button'` | HTML button type |
| disabled | `boolean` | No | `false` | **Deprecated:** Use `aria-disabled` instead. Removes element from Accessibility Tree and prevents focus |
| aria-disabled | `boolean` \| `'true'` \| `'false'` | No | - | Disables button (keeps in tab order) |
| onClick | `(e: MouseEvent) => void` | No | - | Click handler |
| className | `string` | No | - | CSS classes for custom styling |
| ref | `Ref<HTMLButtonElement>` | No | - | React ref to button element |

**Additional Props:** Accepts all standard HTML button attributes.

## Common Patterns

### Basic Usage with Custom Styling
```tsx
<ButtonBase className="custom-button">
  Custom Button
</ButtonBase>
```

### Submit Button with Custom Styles
```tsx
<form onSubmit={handleSubmit}>
  <ButtonBase type="submit" className="custom-submit-btn">
    Submit Form
  </ButtonBase>
</form>
```

### Disabled State
```tsx
<ButtonBase aria-disabled="true" className="custom-button">
  Disabled Button
</ButtonBase>
```

### With Click Handler and Ref
```tsx
function CustomButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked');
    buttonRef.current?.focus();
  };
  
  return (
    <ButtonBase 
      ref={buttonRef}
      onClick={handleClick}
      className="custom-button"
    >
      Click Me
    </ButtonBase>
  );
}
```

## Behavior

**Click Handling:**
- When `disabled` or `aria-disabled` is true, click events are prevented
- Uses `event.preventDefault()` and `event.stopPropagation()` for disabled buttons
- Integrates with Reactlytics for analytics tracking

**Disabled State:**
- Component treats both `disabled` and `aria-disabled="true"` as disabled
- Sets both `disabled` and `aria-disabled` attributes appropriately
- Prevents click events when disabled

## Accessibility Requirements

**Required:**
- Prefer `aria-disabled` over `disabled` to keep button in tab order
- Button must have accessible content (text or aria-label)

**Recommended:**
- Use semantic `type` attribute (`button`, `submit`, `reset`)
- Provide clear, descriptive labels

**Avoid:**
- Don't use ButtonBase without any styling in production (users won't recognize it as a button)
- Don't omit accessible content

## Best Practices

- **Use ButtonBase when:** building custom button components with unique styling
- **Don't use ButtonBase when:** DLS Button, IconButton, or SplitButton meets your needs
- **Styling:** always add sufficient visual affordance (borders, background, etc.)
- **Type attribute:** explicitly set for clarity (defaults to 'button')
- **Composition:** ButtonBase is used internally by Button, IconButton, and SplitButton
- **Analytics:** ButtonBase automatically integrates with Reactlytics when handlers are provided

## When to Use

**Use ButtonBase for:**
- Building custom button components with unique design requirements
- Creating button-like interactive elements with semantic button behavior
- Extending DLS with organization-specific button variants

**Use regular Button instead for:**
- Standard primary, secondary, or tertiary buttons
- Any button that fits DLS design system patterns
- Most application buttons

## Related Components
- [Button](button.md) - Styled button with variants
- [IconButton](icon-button.md) - Icon-only button
- [SplitButton](split-button.md) - Button with dropdown actions

