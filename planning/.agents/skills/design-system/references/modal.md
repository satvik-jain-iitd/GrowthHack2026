# Modal Component Reference

> AI agent-friendly reference for DLS Modal component

## Quick Reference

Modal overlay that blocks background interaction for user attention. Use for secondary workflows like forms, confirmations, or detailed information that shouldn't navigate away from main page. Has fixed width (800px) for larger viewports.

## Import

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
const [isOpen, setIsOpen] = useState(false);

<>
  <Button variant="primary" onClick={() => setIsOpen(true)}>
    Open Modal
  </Button>
  {isOpen && (
    <Modal
      aria-labelledby="modal-heading"
      aria-describedby="modal-body"
      onClose={() => setIsOpen(false)}
    >
      <ModalHeader id="modal-heading">
        <h2>Heading</h2>
      </ModalHeader>
      <ModalBody id="modal-body">
        <p>Modal content goes here.</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </ModalFooter>
    </Modal>
  )}
</>
```

## Props API

### Modal

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| aria-labelledby | string | Yes | - | The id of the element that labels the Modal. This should be the same as the `id` prop on ModalHeader. |
| aria-describedby | string | No | - | The id of the element that describes the Modal. This should be the same as the `id` prop on ModalBody. |
| children | NonNullable<ReactNode> | Yes | - | Children to render within the Modal. |
| onClose | ((event: MouseEvent \| TouchEvent \| KeyboardEvent) => void) | No | () => {} | Function called when the close button or overlay is clicked or escape key pressed. Note that event is a native DOM event, not a React synthetic event. |
| innerContainerClassName | string | No | - | Class names to be applied to the inner container. Use the `className` prop if targeting the modal scrim. |

### ModalHeader

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier (use with aria-labelledby) |
| children | ReactNode | Yes | - | Header content (typically heading element) |
| closeButtonProps | ButtonProps | | - | Additional props for close button |
| labelOverrides | object | | - | Override screen reader labels |
| hideCloseButton | boolean | | false | Hide the default close button |
| variant | 'none' \| 'subtle' | | 'subtle' | Visual style variant. 'subtle` adds a background color|

### ModalBody

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier (use with aria-describedby) |
| children | ReactNode | Yes | - | Body content |
| className | string | | - | Additional CSS classes |

### ModalFooter

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Footer content (typically buttons) |
| className | string | | - | Additional CSS classes |

## Common Patterns

### Basic Modal
```tsx
{isOpen && (
  <Modal
    aria-labelledby="modal-heading"
    onClose={handleClose}
  >
    <ModalHeader id="modal-heading">
      <h2>Confirm action</h2>
    </ModalHeader>
    <ModalBody>
      <p>Are you sure you want to proceed?</p>
    </ModalBody>
    <ModalFooter>
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
    </ModalFooter>
  </Modal>
)}
```

### Modal with Form
```tsx
{isOpen && (
  <Modal
    aria-labelledby="form-heading"
    aria-describedby="form-description"
    onClose={handleClose}
  >
    <ModalHeader id="form-heading">
      <h2>Edit profile</h2>
    </ModalHeader>
    <ModalBody id="form-description">
      <form id="profile-form" onSubmit={handleSubmit}>
        <Input id="name" label="Name" />
        <Input id="email" label="Email" type="email" />
      </form>
    </ModalBody>
    <ModalFooter>
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      <Button variant="primary" type="submit" form="profile-form">Save</Button>
    </ModalFooter>
  </Modal>
)}
```

## Accessibility Requirements

**Required:**
- Provide `aria-labelledby` pointing to ModalHeader id
- Include ModalHeader with unique `id`
- Provide `onClose` callback for keyboard (Escape) and click-outside dismissal
- Focus automatically trapped within modal when open
- All interactive elements must be keyboard accessible

**Recommended:**
- Use `aria-describedby` pointing to ModalBody id for additional context
- ModalHeader content should be a heading element (h1-h6)
- Keep modal content concise and scannable
- Primary button should be rightmost in footer (left on mobile)

## Anti-Patterns

❌ **Missing aria-labelledby**
```tsx
<Modal onClose={handleClose}> {/* WRONG */}
  <ModalHeader><h2>Title</h2></ModalHeader>
</Modal>
```

✅ **Correct approach**
```tsx
<Modal aria-labelledby="modal-heading" onClose={handleClose}>
  <ModalHeader id="modal-heading"><h2>Title</h2></ModalHeader>
</Modal>
```

---

❌ **Non-heading in ModalHeader**
```tsx
<ModalHeader id="header">
  <p>Title</p> {/* WRONG */}
</ModalHeader>
```

✅ **Correct approach**
```tsx
<ModalHeader id="header">
  <h2>Title</h2>
</ModalHeader>
```

## Best Practices

### Content Guidelines
- **Headings**: Clear, concise, action-oriented
- **Body**: Explain context, consequences, or next steps
- **Button labels**: Specific verbs that describe the outcome ("Save changes", not "OK")
- **Keep it brief**: Modals should not require scrolling when possible
- **Mobile**: Primary button moves to top on mobile (stacked layout)

### When to Use
- Secondary workflows that don't disrupt primary flow when closed
- Forms requiring focused input
- Detailed information review
- Confirmations for non-critical actions

### When NOT to Use
- Critical alerts requiring immediate attention (use AlertDialog)
- Simple, time-sensitive alerts
- Complex multi-step workflows (use separate pages)

## Advanced Usage

### Custom Close Button
```tsx
<ModalHeader 
  id="header"
  closeButtonProps={{ 
    'aria-label': 'Close dialog',
    className: 'custom-close-btn'
  }}
>
  <h2>Custom close button</h2>
</ModalHeader>
```

## Related Components

- [AlertDialog](alert-dialog.md) - Critical alerts and confirmations
- [Button](button.md) - Action triggers
- [Input](input.md) - For form inputs in modals
