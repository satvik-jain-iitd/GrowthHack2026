# Menu Component Reference

## Quick Reference
Menu displays a list of actions that users can select from, triggered by a button or custom trigger. Menus support icons, keyboard navigation, and automatic close on selection.

## Import
```tsx
import { Menu, MenuItem } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Menu id="basic-menu" label="Menu">
  <MenuItem>Item one</MenuItem>
  <MenuItem>Item two</MenuItem>
  <MenuItem>Item three</MenuItem>
</Menu>
```

## Common Patterns

### Menu with Label
```tsx
<Menu id="actions-menu" label="Actions">
  <MenuItem>Edit</MenuItem>
  <MenuItem>Duplicate</MenuItem>
  <MenuItem>Delete</MenuItem>
</Menu>
```

### Menu with Icons
```tsx
<Menu id="icon-menu" label="Menu">
  <MenuItem icon={<IconAirplane />}>Flights</MenuItem>
  <MenuItem icon={<IconHotel />}>Hotels</MenuItem>
  <MenuItem icon={<IconCar />}>Rental Cars</MenuItem>
  <MenuItem icon={<IconBriefcase />}>Business Travel</MenuItem>
</Menu>
```

### Overflow Menu (Custom Trigger)
```tsx
<Menu
  id="overflow-menu"
  label="More options"
  customTrigger={
    <IconToggleButton id="overflow-btn" screenReaderLabel="More options" shape="round">
      <IconMoreVertical />
    </IconToggleButton>
  }
>
  <MenuItem icon={<IconEdit />}>Edit</MenuItem>
  <MenuItem icon={<IconCopy />}>Duplicate</MenuItem>
  <MenuItem icon={<IconShare />}>Share</MenuItem>
  <MenuItem icon={<IconTrash />}>Delete</MenuItem>
</Menu>
```

### Controlled Menu
```tsx
const [isOpen, setIsOpen] = useState(false);

<Menu 
  id="controlled-menu" 
  label="Controlled"
  isOpen={isOpen}
  onIsOpenChange={setIsOpen}
>
  <MenuItem onClick={() => console.log('Item 1')}>Item one</MenuItem>
  <MenuItem onClick={() => console.log('Item 2')}>Item two</MenuItem>
</Menu>
```

### Menu with Click Handlers
```tsx
<Menu id="action-menu" label="Actions">
  <MenuItem onClick={() => alert('Editing')}>Edit</MenuItem>
  <MenuItem onClick={() => alert('Saving')}>Save</MenuItem>
  <MenuItem onClick={() => alert('Deleting')}>Delete</MenuItem>
</Menu>
```

### Disabled Menu
```tsx
<Menu id="disabled-menu" label="Menu" disabled>
  <MenuItem>Item one</MenuItem>
  <MenuItem>Item two</MenuItem>
</Menu>
```

### Mixed Icons (All or None)
```tsx
// When not all items have icons, icons are hidden
<Menu id="mixed-menu" label="Menu">
  <MenuItem icon={<IconHome />}>Home</MenuItem>
  <MenuItem>No Icon</MenuItem> {/* Icons hidden for all */}
  <MenuItem icon={<IconSettings />}>Settings</MenuItem>
</Menu>
```

### Menu in Dynamic Container (Accordion)
```tsx
<Accordion>
  <AccordionPanel
    heading={<h3>Heading</h3>}
    id="panel3"
  />
  <AccordionContent aria-labelledby="panel3">
    <div className="margin-1 scroll-y">
      <Menu 
        id="accordion-menu" 
        label="Options"
        positionStrategy="absolute"
      >
        <MenuItem>Action 1</MenuItem>
        <MenuItem>Action 2</MenuItem>
        <MenuItem>Action 3</MenuItem>
      </Menu>
    </div>
  </AccordionContent>
</Accordion>
```

## Props API

### Menu Props
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| id | string | - | Yes | Unique identifier |
| label | string | - | Yes | Button label (or provide customTrigger) |
| children | ReactNode | - | No | MenuItem components |
| customTrigger | ReactElement | - | No | Custom trigger button (replaces default) |
| defaultIsOpen | boolean | false | No | Initial open state (uncontrolled) |
| isOpen | boolean | - | No | Controlled open state |
| onIsOpenChange | (isOpen: boolean) => void | - | No | Callback when menu opens/closes |
| positionStrategy | 'absolute' \| 'fixed' | 'fixed' | No | Position strategy for popover. Use 'absolute' if parent has dynamic height (e.g., Accordion). |
| disabled | boolean | false | No | @deprecated Disable menu trigger |
| aria-disabled | boolean \| 'true' \| 'false' | - | No | Alternative disabled state |
| onClick | MouseEventHandler | - | No | Click handler for menu trigger |

### MenuItem Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Menu item text |
| icon | ReactElement<IconProps> | - | Optional icon (locked to md size) |
| onClick | MouseEventHandler | - | Click handler (menu auto-closes) |
| disabled | boolean | false | @deprecated Disable menu item |
| aria-disabled | boolean \| 'true' \| 'false' | - | Alternative disabled state |

## Accessibility Requirements

### Required
- Provide visible or accessible label via `label` prop or customTrigger
- All menu items must be keyboard accessible
- Menu has `role="menu"` and items have `role="menuitem"`
- Arrow keys navigate between items
- Enter/Space activates focused item
- Each menu item must have clear, descriptive label

### Recommended
- Use Menu for actions (edit, delete, share)
- Keep menu items to a reasonable number (< 10)
- Group related actions together
- Provide icons for all items or none (consistent visual)

### Avoid
- Don't use for primary navigation (use Navigation component)
- Don't nest menus within menus
- Don't use for long lists (consider Select or other components)

## Anti-Patterns

❌ **Don't use for navigation**
```tsx
// Use Navigation component instead
<Menu label="Pages">
  <MenuItem onClick={() => navigate('/home')}>Home</MenuItem>
  <MenuItem onClick={() => navigate('/about')}>About</MenuItem>
</Menu>
```

✅ **Use for actions**
```tsx
<Menu label="Actions">
  <MenuItem onClick={handleEdit}>Edit</MenuItem>
  <MenuItem onClick={handleDelete}>Delete</MenuItem>
</Menu>
```

❌ **Don't mix icons inconsistently**
```tsx
// Either all items have icons or none
<Menu label="Mixed">
  <MenuItem icon={<IconHome />}>Home</MenuItem>
  <MenuItem>No Icon</MenuItem> {/* Inconsistent */}
</Menu>
```

✅ **Consistent icon usage**
```tsx
<Menu label="Consistent">
  <MenuItem icon={<IconEdit />}>Edit</MenuItem>
  <MenuItem icon={<IconTrash />}>Delete</MenuItem>
  <MenuItem icon={<IconShare />}>Share</MenuItem>
</Menu>
```

## Best Practices

- Menu automatically closes when an item is selected
- Icons are shown only if ALL MenuItems have icons
- Icon size is locked to `md` for consistency
- Menu uses Popover component internally
- Default placement is `bottom-end`
- Menu trigger shows chevron icon (up when open, down when closed)
- Keyboard navigation: Arrow Up/Down to move between items
- First item receives focus when menu opens
- Custom triggers get `aria-expanded` automatically
- Menu manages focus properly (returns to trigger when closed)

## Advanced Usage

### Custom Trigger Examples
```tsx
// Icon button trigger
<Menu
  id="icon-trigger"
  label="Options"
  customTrigger={
    <IconButton id="trigger" screenReaderLabel="Options">
      <IconMoreHorizontal />
    </IconButton>
  }
>
  <MenuItem>Action 1</MenuItem>
  <MenuItem>Action 2</MenuItem>
</Menu>

// Custom styled button
<Menu
  id="custom-trigger"
  label="Custom"
  customTrigger={
    <Button variant="secondary" className="custom-class">
      Custom Trigger
    </Button>
  }
>
  <MenuItem>Option 1</MenuItem>
  <MenuItem>Option 2</MenuItem>
</Menu>
```

### Keyboard Interactions
- **Arrow Down**: Move focus to next item
- **Arrow Up**: Move focus to previous item
- **Enter/Space**: Activate focused item and close menu
- **Escape**: Close menu and return focus to trigger
- Navigation wraps (last item → first item)

## Related Components

- [SelectNative](select-native.md) - For choosing from options (form input)
- [Links](links.md) - For standalone navigation links