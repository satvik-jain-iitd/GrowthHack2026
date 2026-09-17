# AlertDialog Component Reference
> AI agent-friendly reference for DLS AlertDialog component

## Quick Reference
A highly interruptive modal dialog used to display urgent or critical information requiring immediate user action. Use for critical alerts, confirmations, or error messages.

## Import
```tsx
import { AlertDialog, AlertDialogHeader, AlertDialogBody } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<AlertDialog onClose={handleClose} id="alert-dialog">
  <AlertDialogHeader id="header">
    <Heading level={2} variant="sans-small-bold">Alert Heading</Heading>
  </AlertDialogHeader>
  <AlertDialogBody
    id="body"
    actionSlot={<Button variant="primary" onClick={handleClose}>Confirm</Button>}
  >
    <p>Alert message content</p>
  </AlertDialogBody>
</AlertDialog>
```

## Props API

### AlertDialog Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | AlertDialogHeader and AlertDialogBody components |
| onClose | () => void | No | - | Function called when the escape key is pressed |
| shouldCreatePortal | boolean | No | false | Uses React portals to render the AlertDialog in `portalContainer` (if provided) or document body to avoid clipping content |
| portalContainer | HTMLElement \| null | No | - | DOM element where the content should be rendered. Only applicable when `shouldCreatePortal` is true. |

### AlertDialogHeader Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for the header |
| icon | ReactElement | No | - | Optional icon to display in header |
| children | ReactNode | Yes | - | Header content (typically a <Heading> component) |

### AlertDialogBody Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for the body |
| actionSlot | ReactNode | No | - | Action buttons for the dialog |
| children | ReactNode | Yes | - | Body content |

## Common Patterns

### Basic Alert Dialog with Icon
```tsx
function BasicAlertDialog() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open AlertDialog
      </Button>
      {isOpen && (
        <AlertDialog onClose={() => setIsOpen(false)} id="basic-alert">
          <AlertDialogHeader 
            id="header"     
            icon={<IconMerchandise color="brand" size="xl" />}
          >
            <Heading level={2} variant="sans-small-bold">
              Confirm Action
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody
            id="body"
            actionSlot={
              <>
                <Button variant="primary" onClick={() => setIsOpen(false)}>
                  Confirm
                </Button>
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </>
            }
          >
            <p>Are you sure you want to proceed with this action?</p>
          </AlertDialogBody>
        </AlertDialog>
      )}
    </>
  );
}
```

### Delete Confirmation
```tsx
function DeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open AlertDialog
      </Button>
      {isOpen && (
        <AlertDialog onClose={() => setIsOpen(false)} id="delete-confirm">
          <AlertDialogHeader id="header">
            <Heading level={2} variant="sans-small-bold">
              Delete Account
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody
            id="body"
            actionSlot={
              <>
                <Button variant="primary" onClick={handleDelete}>
                  Yes, delete it
                </Button>
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </>
            }
          >
            <p>
              This action cannot be undone. Are you sure you want to permanently delete your account?
            </p>
          </AlertDialogBody>
        </AlertDialog>
      )}
    </>
  );
}
```

### Error Alert
```tsx
function ErrorAlert() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open AlertDialog
      </Button>
      {isOpen && (
        <AlertDialog onClose={() => setIsOpen(false)} id="error-alert">
          <AlertDialogHeader
            id="header"
            icon={<IconWarning color="error" size="xl" />}
          >
            <Heading level={2} variant="sans-small-bold">
              Error
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody
            id="body"
            actionSlot={
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            }
          >
            <p>An error occurred while processing your request. Please try again later.</p>
          </AlertDialogBody>
        </AlertDialog>
      )}
    </>
  );
}
```

### ErrorAlert with portal
```tsx
function ErrorAlert() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
  };
  
  return (
    <Carousel id="carousel-with-modal">
      <CarouselItem id="carousel-item-1" className="text-align-left">
        {isOpen && (
          <AlertDialog onClose={() => setIsOpen(false)} id="error-alert" shouldCreatePortal={true}>
            <AlertDialogHeader
              id="header"
              icon={<IconWarning color="error" size="xl" />}
            >
              <Heading level={2} variant="sans-small-bold">
                Error
              </Heading>
            </AlertDialogHeader>
            <AlertDialogBody
              id="body"
              actionSlot={
                <Button variant="primary" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              }
            >
              <p>An error occurred while processing your request.</p>
            </AlertDialogBody>
          </AlertDialog>
        )}
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Open AlertDialog
        </Button>
      </CarouselItem>
    </Carousel>
  );
}
```

## Accessibility Requirements

**Required:**
- Provide accessible label using aria-labelledby (automatically set from header ID) or aria-label
- Focus is trapped within dialog while open
- Dialog must be keyboard accessible
- Escape key dismisses the dialog
- Focus returns to triggering element on close

**Recommended:**
- Use clear, descriptive headings
- Keep body content concise (2-3 lines max)
- Provide clear button labels indicating action outcome
- Use role="alertdialog" (automatically applied)

**Avoid:**
- Auto-dismissing critical alerts without user action
- Using for non-urgent messages
- Blocking interaction indefinitely
- Vague button labels like "OK" or "Continue"

## Anti-Patterns

❌ **WRONG: Using for non-critical messages**
```tsx
<AlertDialog onClose={handleClose} id="bad-usage">
  <AlertDialogHeader id="header">
    <Heading level={2}>Newsletter Signup</Heading>
  </AlertDialogHeader>
  <AlertDialogBody id="body">
    <p>Would you like to sign up for our newsletter?</p>
  </AlertDialogBody>
</AlertDialog>
```

✅ **CORRECT: Use Modal for non-critical content**
```tsx
<Modal onClose={handleClose} id="good-usage">
  <ModalHeader>Newsletter Signup</ModalHeader>
  <ModalBody>
    <p>Would you like to sign up for our newsletter?</p>
  </ModalBody>
</Modal>
```

❌ **WRONG: Vague button labels**
```tsx
<AlertDialogBody
  id="body"
  actionSlot={
    <>
      <Button variant="primary">OK</Button>
      <Button variant="secondary">Cancel</Button>
    </>
  }
>
  <p>Delete this item?</p>
</AlertDialogBody>
```

✅ **CORRECT: Clear, specific button labels**
```tsx
<AlertDialogBody
  id="body"
  actionSlot={
    <>
      <Button variant="primary">Yes, delete it</Button>
      <Button variant="secondary">No, keep it</Button>
    </>
  }
>
  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
</AlertDialogBody>
```

❌ **WRONG: Too much content**
```tsx
<AlertDialogBody id="body">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
  <p>Sed do eiusmod tempor incididunt...</p>
  <p>Ut labore et dolore magna aliqua...</p>
  <form>{/* Complex form */}</form>
</AlertDialogBody>
```

✅ **CORRECT: Concise, focused content**
```tsx
<AlertDialogBody id="body" actionSlot={<Button>Confirm</Button>}>
  <p>This will permanently delete your account. Are you sure?</p>
</AlertDialogBody>
```

## Best Practices

**When to Use:**
- Critical messages requiring immediate attention
- Confirmations for destructive actions (delete, logout)
- System errors that block workflow
- Security warnings
- Time-sensitive notifications

**When Not to Use:**
- Non-urgent messages (use notifications instead)
- Complex forms or workflows (use Modal or new page)
- Passive information
- Frequent or repeated tasks

**Content Guidelines:**
- Keep body text to 2-3 lines maximum
- Use active, specific language in headings
- Button labels should clearly indicate outcome
- Primary action is most prominent
- Secondary action provides safe alternative

**Button Label Examples:**
- Primary: "Yes, delete it", "Confirm changes", "Submit"
- Secondary: "Cancel", "No, keep it", "Go back"

**Responsive Behavior:**
- Min-width of 300px
- Max-width of 500px
- Reflows according to viewport size
- Follows WCAG 1.4.10 reflow standard

## Related Components
- [Modal](modal.md) - For non-critical content
- [ComponentLevelNotification](component-level-notification.md) - For inline feedback
- [PageLevelNotification](page-level-notification.md) - For page-wide alerts
- [Button](button.md) - For dialog actions