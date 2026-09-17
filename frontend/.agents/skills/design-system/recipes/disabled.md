---
title: Disabled Components and Accessibility
description: Guidelines and examples for using `aria-disabled` instead of the HTML `disabled` attribute.
---

# Disabled Components

- use `aria-disabled` over HTML `disabled` attribute for better screen reader support
- Example: `<Input aria-disabled={true} />` disables the input for assistive tech and keyboard, but keeps it focusable for some screen readers
- Example: `<Input disabled />` disables the input for all users, but may not be announced as disabled by all screen readers

```jsx
// Disabled DLS Button example
<Button aria-disabled={true}>Disabled Button</Button>
```
